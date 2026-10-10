import { CONTACT } from "../content/site";
import type { Lead } from "./lead-schema";

export { leadSchema, LIMITS, HONEYPOT_FIELD, type Lead } from "./lead-schema";

const ENDPOINT = "/api/lead";
// A function dá 504 aos 8 s; o cliente espera mais um pouco para receber essa resposta clara.
const REQUEST_TIMEOUT_MS = 12_000;
const CLIENT_MAX = 3;
const CLIENT_WINDOW_MS = 10 * 60_000;
const STORAGE_KEY = "velqora:lead-attempts";

export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      kind: "validation" | "rate_limited" | "client_limit" | "timeout" | "server" | "network";
      message: string;
      fields?: Record<string, string>;
    };

/* Limite por sessão: 3 envios em 10 minutos. sessionStorage pode falhar → fallback em memória. */
let memoryAttempts: number[] = [];

function readAttempts(now: number): number[] {
  let list = memoryAttempts;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed.filter((n): n is number => typeof n === "number");
    }
  } catch {
    /* storage indisponível: usa a memória */
  }
  return list.filter((t) => now - t < CLIENT_WINDOW_MS);
}

function writeAttempts(list: number[]) {
  memoryAttempts = list;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignora */
  }
}

/** Minutos até poder voltar a enviar, ou 0 se ainda há quota. */
export function clientCooldownMinutes(now = Date.now()): number {
  const recent = readAttempts(now);
  if (recent.length < CLIENT_MAX) return 0;
  return Math.max(1, Math.ceil((CLIENT_WINDOW_MS - (now - recent[0]!)) / 60_000));
}

/** Link mailto: com o pedido já preenchido, para quando o envio automático falha. */
export function buildMailto(data: Partial<Lead>): string {
  const msg = (data.mensagem ?? "").slice(0, 1200);
  const body = [
    `Nome: ${data.nome || "—"}`,
    `Empresa: ${data.empresa || "—"}`,
    `Email: ${data.email || "—"}`,
    `Telefone: ${data.telefone || "—"}`,
    `Serviço pretendido: ${data.servico || "—"}`,
    "",
    msg,
  ].join("\n");
  return `${CONTACT.emailHref}?subject=${encodeURIComponent("Pedido de demonstração Velqora")}&body=${encodeURIComponent(body)}`;
}

/** Envia o pedido para a Netlify Function. Nunca lança: devolve sempre um resultado. */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  const now = Date.now();
  const wait = clientCooldownMinutes(now);
  if (wait > 0) {
    return {
      ok: false,
      kind: "client_limit",
      message: `Já enviou vários pedidos nesta sessão. Aguarde ${wait} min e tente novamente.`,
    };
  }
  writeAttempts([...readAttempts(now), now]);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    let data: { ok?: boolean; message?: string; fields?: Record<string, string> } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      /* resposta sem JSON (ex.: página de erro da plataforma) */
    }
    if (res.ok && data.ok !== false) return { ok: true };
    console.error("[lead] envio falhou", { status: res.status });
    if (res.status === 400 && data.fields) {
      return {
        ok: false,
        kind: "validation",
        message: data.message ?? "Verifique os campos.",
        fields: data.fields,
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        kind: "rate_limited",
        message:
          "Enviou demasiados pedidos em pouco tempo. Aguarde alguns minutos e tente novamente.",
      };
    }
    if (res.status === 504) {
      return { ok: false, kind: "timeout", message: "O envio demorou demasiado tempo." };
    }
    return {
      ok: false,
      kind: "server",
      message: "Não foi possível enviar o pedido neste momento.",
    };
  } catch (err) {
    const aborted = controller.signal.aborted;
    console.error("[lead] envio falhou", { type: aborted ? "timeout" : (err as Error)?.name });
    return aborted
      ? { ok: false, kind: "timeout", message: "O envio demorou demasiado tempo." }
      : { ok: false, kind: "network", message: "Não foi possível ligar ao servidor." };
  } finally {
    clearTimeout(timer);
  }
}
