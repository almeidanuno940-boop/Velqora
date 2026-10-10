import { HONEYPOT_FIELD, leadSchema, sanitizeLeadInput } from "../../src/lib/lead-schema";

/**
 * POST /api/lead — recebe o pedido do formulário, valida, aplica anti-spam e reencaminha
 * para o webhook do Make. O URL do webhook vive só aqui (variável MAKE_WEBHOOK_URL, sem
 * prefixo VITE_), por isso nunca chega ao JavaScript do browser.
 */

const FORWARD_TIMEOUT_MS = 8_000; // abaixo dos 10 s que o Netlify dá a uma function
const MAX_BODY_BYTES = 16_384;
const RATE_WINDOW_MS = 10 * 60_000;
// Configurável por variável de ambiente (LEAD_RATE_LIMIT_MAX); por defeito 5 pedidos / 10 min por IP.
const RATE_MAX = Number(process.env["LEAD_RATE_LIMIT_MAX"]) || 5;

type Hits = Map<string, number[]>;
// Em memória: vale por instância da function (travão básico, não uma defesa completa).
// Fica em globalThis para sobreviver a recarregamentos do módulo na mesma instância.
const store = globalThis as typeof globalThis & { __velqoraLeadHits?: Hits };
const hits: Hits = (store.__velqoraLeadHits ??= new Map());

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

/** Regista um erro sem dados pessoais: só o evento, o tipo e o estado HTTP. */
function logError(event: string, extra: Record<string, unknown> = {}) {
  console.error(JSON.stringify({ event, ...extra }));
}

function clientIp(req: Request, context: { ip?: string } | undefined): string {
  return (
    context?.ip ||
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconhecido"
  );
}

/** Devolve os segundos até poder voltar a tentar, ou 0 se ainda há quota. */
function rateLimit(ip: string, now = Date.now()): number {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return Math.ceil((RATE_WINDOW_MS - (now - recent[0]!)) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return 0;
}

function webhookUrl(): URL | null {
  const raw = process.env["MAKE_WEBHOOK_URL"]?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    return u.protocol === "https:" || (local && u.protocol === "http:") ? u : null;
  } catch {
    return null;
  }
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // pedidos sem Origin (ex.: curl) não são cross-site de browser
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(req: Request, context?: { ip?: string }): Promise<Response> {
  if (req.method !== "POST") {
    return json(
      405,
      { ok: false, code: "method_not_allowed", message: "Método não permitido." },
      { Allow: "POST" },
    );
  }
  if (!sameOrigin(req)) {
    return json(403, { ok: false, code: "forbidden", message: "Pedido não autorizado." });
  }
  if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return json(415, {
      ok: false,
      code: "unsupported_media_type",
      message: "Formato de pedido inválido.",
    });
  }

  const retryAfter = rateLimit(clientIp(req, context));
  if (retryAfter > 0) {
    logError("lead_rate_limited");
    return json(
      429,
      {
        ok: false,
        code: "rate_limited",
        message:
          "Enviou demasiados pedidos em pouco tempo. Aguarde alguns minutos e tente novamente.",
        retryAfter,
      },
      { "Retry-After": String(retryAfter) },
    );
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return json(413, {
        ok: false,
        code: "payload_too_large",
        message: "O pedido é demasiado grande.",
      });
    }
    raw = JSON.parse(text);
  } catch {
    return json(400, { ok: false, code: "invalid_json", message: "Pedido inválido." });
  }

  const input = sanitizeLeadInput(raw);

  // Honeypot: um bot preencheu o campo escondido. Respondemos "ok" para não dar pistas, sem reencaminhar.
  const trap = input[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    logError("lead_honeypot_hit");
    return json(200, { ok: true });
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return json(400, {
      ok: false,
      code: "validation",
      message: "Verifique os campos assinalados.",
      fields,
    });
  }

  const url = webhookUrl();
  if (!url) {
    logError("lead_not_configured", { type: "MAKE_WEBHOOK_URL ausente ou inválida" });
    return json(503, {
      ok: false,
      code: "not_configured",
      message: "O envio de pedidos está temporariamente indisponível.",
    });
  }

  const { nome, empresa, email, telefone, servico, mensagem } = parsed.data;
  const payload = {
    idPedido: crypto.randomUUID(),
    nome,
    empresa: empresa ?? "",
    email,
    telefone: telefone ?? "",
    servico,
    mensagem,
    consentimentoRgpd: true,
    origem: "website",
    enviadoEm: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "error",
    });
    if (!res.ok) {
      logError("lead_forward_failed", { type: "http_status", status: res.status });
      return json(502, {
        ok: false,
        code: "upstream_error",
        message: "Não foi possível enviar o pedido neste momento.",
      });
    }
    return json(200, { ok: true });
  } catch (err) {
    const aborted = controller.signal.aborted;
    logError("lead_forward_failed", {
      type: aborted ? "timeout" : (err as Error)?.name || "network_error",
    });
    return aborted
      ? json(504, {
          ok: false,
          code: "upstream_timeout",
          message: "O serviço demorou demasiado a responder.",
        })
      : json(502, {
          ok: false,
          code: "upstream_error",
          message: "Não foi possível enviar o pedido neste momento.",
        });
  } finally {
    clearTimeout(timer);
  }
}

export const config = {
  path: "/api/lead",
  // Reforço ao limite em memória acima (que só vale por instância "quente"): o Netlify aplica
  // este limite à entrada, partilhado por todas as instâncias. Responde 429 sem corpo JSON.
  rateLimit: { windowSize: 60, windowLimit: 10, aggregateBy: ["ip", "domain"] },
};
