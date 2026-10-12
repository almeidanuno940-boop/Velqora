import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../netlify/functions/lead";

const WEBHOOK = "https://hook.eu1.make.com/segredo-de-teste";
const SENSITIVE = { nome: "Maria Teste", email: "maria.teste@example.pt", telefone: "912345678" };

const valid = {
  nome: SENSITIVE.nome,
  empresa: "Empresa Lda",
  email: SENSITIVE.email,
  telefone: SENSITIVE.telefone,
  servico: "Automação de Leads",
  mensagem: "Gostaria de automatizar a receção de pedidos de orçamento.",
  consentimento: true,
  website: "",
};

let ipCounter = 0;
const freshIp = () => `203.0.113.${++ipCounter}`;

function post(body: unknown, init: { ip?: string; headers?: Record<string, string> } = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const req = new Request("https://velqora.test/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...init.headers },
    body: raw,
  });
  return handler(req, { ip: init.ip ?? freshIp() });
}

const fetchMock = vi.fn();
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response("Accepted", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("MAKE_WEBHOOK_URL", WEBHOOK);
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  errorSpy.mockRestore();
});

describe("a) pedido válido", () => {
  it("devolve 200 e reencaminha o payload correto para o webhook", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe(WEBHOOK);
    expect(init.method).toBe("POST");
    expect(init.redirect).toBe("error");
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({
      nome: "Maria Teste",
      empresa: "Empresa Lda",
      email: SENSITIVE.email,
      telefone: SENSITIVE.telefone,
      servico: "Automação de Leads",
      mensagem: valid.mensagem,
      consentimentoRgpd: true,
      origem: "website",
    });
    expect(payload.idPedido).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(payload.enviadoEm).toString()).not.toBe("Invalid Date");
    expect(payload).not.toHaveProperty("website"); // o honeypot nunca segue para o Make
  });

  it("aceita campos opcionais vazios", async () => {
    const res = await post({ ...valid, empresa: "", telefone: "" });
    expect(res.status).toBe(200);
    const payload = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(payload.empresa).toBe("");
    expect(payload.telefone).toBe("");
  });

  it("responde com JSON, sem cache e sem cabeçalhos CORS", async () => {
    const res = await post(valid);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("b) honeypot", () => {
  it("responde 200 sem reencaminhar para o webhook", async () => {
    const res = await post({ ...valid, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("c) limite de pedidos por IP", () => {
  it("aceita 5 pedidos e responde 429 com Retry-After ao sexto", async () => {
    const ip = freshIp();
    for (let i = 0; i < 5; i++) expect((await post(valid, { ip })).status).toBe(200);
    const res = await post(valid, { ip });
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.code).toBe("rate_limited");
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("não penaliza outro IP", async () => {
    const ip = freshIp();
    for (let i = 0; i < 6; i++) await post(valid, { ip });
    expect((await post(valid)).status).toBe(200);
  });
});

describe("d) MAKE_WEBHOOK_URL em falta ou inválida", () => {
  it.each([
    ["ausente", ""],
    ["só espaços", "   "],
    ["http não local", "http://hook.make.com/x"],
    ["não é URL", "isto-nao-e-url"],
  ])("devolve 503 (%s)", async (_label, value) => {
    vi.stubEnv("MAKE_WEBHOOK_URL", value);
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("e) webhook a falhar", () => {
  it("devolve 502 quando o Make responde 5xx", async () => {
    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe("upstream_error");
  });

  it("devolve 502 quando a ligação falha", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect((await post(valid)).status).toBe(502);
  });

  it("devolve 504 quando o Make demora mais de 8 s", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: unknown, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(new DOMException("x", "AbortError")));
        }),
    );
    const pending = post(valid);
    await vi.advanceTimersByTimeAsync(8_100);
    const res = await pending;
    expect(res.status).toBe(504);
    expect((await res.json()).code).toBe("upstream_timeout");
  });
});

describe("f) validação", () => {
  const fieldsOf = async (body: unknown) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("validation");
    expect(fetchMock).not.toHaveBeenCalled();
    return json.fields as Record<string, string>;
  };

  it("rejeita email inválido", async () => {
    expect(await fieldsOf({ ...valid, email: "isto-nao-e-email" })).toHaveProperty("email");
  });

  it("rejeita campos obrigatórios vazios", async () => {
    const f = await fieldsOf({ ...valid, nome: "", email: "", servico: "", mensagem: "" });
    expect(Object.keys(f)).toEqual(
      expect.arrayContaining(["nome", "email", "servico", "mensagem"]),
    );
  });

  it("rejeita corpo vazio", async () => {
    const f = await fieldsOf({});
    expect(Object.keys(f)).toEqual(
      expect.arrayContaining(["nome", "email", "servico", "mensagem", "consentimento"]),
    );
  });

  it("rejeita textos demasiado longos", async () => {
    const f = await fieldsOf({
      ...valid,
      nome: "a".repeat(101),
      empresa: "b".repeat(121),
      mensagem: "c".repeat(2001),
    });
    expect(Object.keys(f)).toEqual(expect.arrayContaining(["nome", "empresa", "mensagem"]));
  });

  it("rejeita consentimento RGPD não marcado", async () => {
    const f = await fieldsOf({ ...valid, consentimento: false });
    expect(f["consentimento"]).toMatch(/Pol[ií]tica de Privacidade/);
  });

  it("rejeita consentimento que não seja o booleano true", async () => {
    await fieldsOf({ ...valid, consentimento: "true" });
  });

  it("rejeita telefone inválido e serviço fora da lista", async () => {
    const f = await fieldsOf({ ...valid, telefone: "123", servico: "Serviço inventado" });
    expect(Object.keys(f)).toEqual(expect.arrayContaining(["telefone", "servico"]));
  });
});

describe("pedidos malformados e segurança", () => {
  it("rejeita métodos que não sejam POST (405)", async () => {
    const res = await handler(new Request("https://velqora.test/api/lead"), { ip: freshIp() });
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });

  it("rejeita Content-Type que não seja JSON (415)", async () => {
    const res = await post("nome=x", { headers: { "Content-Type": "text/plain" } });
    expect(res.status).toBe(415);
  });

  it("rejeita JSON inválido (400)", async () => {
    expect((await post("{não é json")).status).toBe(400);
  });

  it("rejeita corpos acima de 16 KB (413)", async () => {
    const res = await post({ ...valid, mensagem: "x".repeat(20_000) });
    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejeita pedidos cross-site (403)", async () => {
    const res = await post(valid, { headers: { Origin: "https://evil.example" } });
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("aceita o próprio Origin", async () => {
    const res = await post(valid, { headers: { Origin: "https://velqora.test" } });
    expect(res.status).toBe(200);
  });

  it("remove HTML e caracteres de controlo; quebras de linha não passam em campos de linha única", async () => {
    const res = await post({
      ...valid,
      nome: "Maria\r\nBcc: atacante@evil.example<script>alert(1)</script>\u0000",
      mensagem: "Linha 1\n\n\n\nLinha 2 <b>negrito</b>",
    });
    expect(res.status).toBe(200);
    const payload = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(payload.nome).not.toMatch(/[\r\n<>]/);
    expect(payload.nome).not.toContain("\u0000");
    expect(payload.nome).not.toContain("script");
    expect(payload.mensagem).toBe("Linha 1\n\nLinha 2 negrito");
  });

  it("ignora campos desconhecidos", async () => {
    await post({ ...valid, isAdmin: true });
    const payload = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(payload).not.toHaveProperty("isAdmin");
  });
});

describe("logs sem dados pessoais", () => {
  it("não regista nome, email, telefone, mensagem nem o URL do webhook em nenhum erro", async () => {
    fetchMock.mockResolvedValueOnce(new Response("x", { status: 500 }));
    await post(valid); // upstream 500
    fetchMock.mockRejectedValueOnce(new TypeError(`fetch failed ${WEBHOOK} ${SENSITIVE.email}`));
    await post(valid); // erro de rede (a mensagem do erro traz dados; não pode ir para o log)
    vi.stubEnv("MAKE_WEBHOOK_URL", "");
    await post(valid); // não configurado
    await post({ ...valid, website: "spam" }); // honeypot
    const ip = freshIp();
    for (let i = 0; i < 6; i++) await post(valid, { ip }); // rate limit

    expect(errorSpy).toHaveBeenCalled();
    const logged = errorSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    for (const secret of [
      SENSITIVE.nome,
      SENSITIVE.email,
      SENSITIVE.telefone,
      valid.mensagem,
      "segredo-de-teste",
      ip,
    ]) {
      expect(logged).not.toContain(secret);
    }
    for (const call of errorSpy.mock.calls) {
      const entry = JSON.parse(String(call[0]));
      expect(typeof entry.event).toBe("string");
    }
  });

  it("regista o estado HTTP do webhook e um carimbo temporal", async () => {
    fetchMock.mockResolvedValueOnce(new Response("x", { status: 503 }));
    await post(valid);
    const entry = JSON.parse(String(errorSpy.mock.calls[0]![0]));
    expect(entry).toMatchObject({ event: "lead_forward_failed", status: 503 });
    expect(new Date(entry.at).toString()).not.toBe("Invalid Date");
  });
});
