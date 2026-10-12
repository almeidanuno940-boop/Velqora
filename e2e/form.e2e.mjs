/**
 * Teste de ponta a ponta do formulário de contacto (browser real + Netlify Function + webhook simulado).
 *
 * Pré-requisitos (o script NÃO arranca o servidor):
 *   1. Servidor a correr com o webhook apontado para o simulador local deste script e com o limite
 *      de pedidos por IP alargado (senão os cenários esgotam os 5 pedidos / 10 min):
 *        MAKE_WEBHOOK_URL=http://127.0.0.1:4599/hook LEAD_RATE_LIMIT_MAX=100 bun run dev
 *      (ou o mesmo contra `vite preview`/`netlify dev`)
 *   2. Google Chrome instalado (usa o canal "chrome"; defina CHROME_PATH para outro executável).
 *
 * Uso:  BASE_URL=http://127.0.0.1:5173 bun run test:e2e
 */
import http from "node:http";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:5173";
const HOOK_PORT = 4599;

/* ---------- webhook simulado (Make) ---------- */
const hook = { mode: "ok", delayMs: 0, hits: [] };
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    hook.hits.push(JSON.parse(body || "{}"));
    setTimeout(() => {
      if (hook.mode === "ok") res.writeHead(200).end("Accepted");
      else res.writeHead(500).end("boom");
    }, hook.delayMs);
  });
});
await new Promise((r) => server.listen(HOOK_PORT, "127.0.0.1", r));

/* ---------- mini harness ---------- */
let failed = 0;
const check = (cond, label, extra = "") => {
  console.log(`${cond ? "  ✓" : "  ✗ FALHOU"} ${label}${!cond && extra ? ` — ${extra}` : ""}`);
  if (!cond) failed++;
};

const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: "chrome" }),
  headless: true,
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

async function open(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(e.message));
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  await page.goto(`${BASE}/#contacto`, { waitUntil: "load" });
  await page.waitForSelector("form");
  // o botão só fica ativo depois da hidratação do React
  await page.waitForFunction(
    () => document.querySelector("form button[type=submit]")?.disabled === false,
  );
  return { ctx, page, consoleErrors };
}

async function fill(page, over = {}) {
  const v = {
    nome: "Maria Teste",
    empresa: "Empresa Lda",
    email: "maria.teste@example.pt",
    telefone: "912 345 678",
    servico: "Automação de Leads",
    mensagem: "Gostaria de automatizar a receção de pedidos de orçamento.",
    consentimento: true,
    ...over,
  };
  await page.fill("#nome", v.nome);
  await page.fill("#empresa", v.empresa);
  await page.fill("#email", v.email);
  await page.fill("#telefone", v.telefone);
  await page.selectOption("#servico", v.servico);
  await page.fill("#mensagem", v.mensagem);
  if (v.consentimento) await page.check("#consentimento");
}

const submit = (page) => page.locator("form button[type=submit]");

try {
  console.log("1) Validação no browser (nada é enviado)");
  {
    const { ctx, page } = await open();
    hook.hits.length = 0;
    let apiCalls = 0;
    page.on("request", (r) => r.url().endsWith("/api/lead") && apiCalls++);
    await submit(page).click();
    await page.waitForSelector("#nome-err");
    for (const id of ["nome", "email", "servico", "mensagem", "consentimento"]) {
      check(await page.locator(`#${id}-err`).isVisible(), `erro visível em ${id}`);
    }
    check(
      (await page.locator("#nome").getAttribute("aria-invalid")) === "true",
      "aria-invalid no nome",
    );
    await fill(page, { email: "isto-nao-e-email", telefone: "123", consentimento: false });
    await submit(page).click();
    check(await page.locator("#email-err").isVisible(), "email inválido rejeitado");
    check(await page.locator("#telefone-err").isVisible(), "telefone inválido rejeitado");
    check(await page.locator("#consentimento-err").isVisible(), "consentimento RGPD obrigatório");
    check(
      apiCalls === 0 && hook.hits.length === 0,
      "nenhum pedido enviado ao servidor",
      `api=${apiCalls}`,
    );
    await page.fill("#mensagem", "x".repeat(2100));
    check(
      (await page.inputValue("#mensagem")).length === 2000,
      "mensagem limitada a 2000 caracteres",
    );
    await ctx.close();
  }

  console.log("2) Sucesso: botão desativado, sem duplo envio, payload correto");
  {
    const { ctx, page, consoleErrors } = await open();
    hook.hits.length = 0;
    hook.mode = "ok";
    hook.delayMs = 1200;
    await fill(page);
    const btn = submit(page);
    await btn.dblclick(); // dois cliques seguidos
    await page.waitForFunction(() => document.querySelector("form button[type=submit]")?.disabled);
    check(await btn.isDisabled(), "botão desativado durante o envio");
    check((await btn.innerText()).includes("A enviar"), "texto 'A enviar…' visível");
    await page.waitForSelector("[role=status]");
    check(
      (await page.locator("[role=status]").innerText()).includes("Obrigado"),
      "mensagem de sucesso",
    );
    check(
      hook.hits.length === 1,
      "exatamente 1 pedido chegou ao webhook",
      `hits=${hook.hits.length}`,
    );
    const p = hook.hits[0] ?? {};
    check(
      p.nome === "Maria Teste" &&
        p.email === "maria.teste@example.pt" &&
        p.servico === "Automação de Leads" &&
        p.consentimentoRgpd === true &&
        p.origem === "website" &&
        !("website" in p),
      "payload correto no webhook",
      JSON.stringify(p),
    );
    await page.click("text=Enviar outro pedido");
    check(await page.locator("form").isVisible(), "'Enviar outro pedido' volta ao formulário");
    check((await page.inputValue("#nome")) === "", "formulário reposto após sucesso");
    check(consoleErrors.length === 0, "sem erros na consola", consoleErrors.join(" | "));
    await ctx.close();
  }

  console.log("3) Webhook a falhar (502): erro com alternativa por email/telefone");
  {
    const { ctx, page } = await open();
    hook.hits.length = 0;
    hook.mode = "fail";
    hook.delayMs = 0;
    await fill(page);
    await submit(page).click();
    const alert = page.locator("[role=alert]");
    await alert.waitFor();
    const text = await alert.innerText();
    check(text.includes("Não foi possível enviar"), "mensagem de erro mostrada", text);
    const mailto = await alert.locator("a[href^='mailto:']").getAttribute("href");
    check(
      !!mailto && mailto.includes("Maria%20Teste") && mailto.includes("subject="),
      "link mailto com o pedido preenchido",
    );
    check((await alert.locator("a[href^='tel:']").count()) === 1, "link para ligar presente");
    check(await submit(page).isEnabled(), "botão volta a ficar ativo");
    check(
      (await page.inputValue("#nome")) === "Maria Teste",
      "dados preservados para nova tentativa",
    );
    hook.mode = "ok";
    await submit(page).click();
    await page.waitForSelector("[role=status]");
    check(true, "nova tentativa com sucesso depois do erro");
    await ctx.close();
  }

  console.log("4) Respostas da API simuladas no browser: 503, 429, 504, rede em baixo");
  for (const [label, handler, expected] of [
    [
      "503 (webhook não configurado)",
      (r) =>
        r.fulfill({
          status: 503,
          contentType: "application/json",
          body: '{"ok":false,"code":"not_configured"}',
        }),
      "Não foi possível enviar",
    ],
    [
      "429 (limite do servidor)",
      (r) =>
        r.fulfill({
          status: 429,
          contentType: "application/json",
          body: '{"ok":false,"code":"rate_limited"}',
        }),
      "demasiados pedidos",
    ],
    [
      "504 (timeout)",
      (r) =>
        r.fulfill({
          status: 504,
          contentType: "application/json",
          body: '{"ok":false,"code":"upstream_timeout"}',
        }),
      "demorou demasiado",
    ],
    [
      "502 sem JSON (página da plataforma)",
      (r) => r.fulfill({ status: 502, contentType: "text/html", body: "<h1>Bad gateway</h1>" }),
      "Não foi possível enviar",
    ],
    ["rede em baixo", (r) => r.abort("failed"), "Não foi possível ligar"],
  ]) {
    const { ctx, page } = await open();
    await page.route("**/api/lead", handler);
    await fill(page);
    await submit(page).click();
    const alert = page.locator("[role=alert]");
    await alert.waitFor();
    const text = await alert.innerText();
    check(text.includes(expected), `${label}: "${expected}"`, text);
    check(
      (await alert.locator("a[href^='mailto:']").count()) === 1,
      `${label}: alternativa por email`,
    );
    check(await submit(page).isEnabled(), `${label}: botão volta a ficar ativo`);
    await ctx.close();
  }

  console.log("5) Honeypot preenchido por um bot: nada chega ao webhook");
  {
    const { ctx, page } = await open();
    hook.hits.length = 0;
    hook.mode = "ok";
    await fill(page);
    await page.evaluate(() => {
      const el = document.getElementById("website");
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(el, "http://spam.example");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await submit(page).click();
    await page.waitForSelector("[role=status]");
    await page.waitForTimeout(500);
    check(hook.hits.length === 0, "webhook não recebeu nada", `hits=${hook.hits.length}`);
    await ctx.close();
  }

  console.log("6) Telemóvel (390px): formulário sem overflow e funcional");
  {
    const { ctx, page } = await open({ width: 390, height: 844 });
    hook.hits.length = 0;
    hook.mode = "ok";
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    check(overflow <= 0, "sem scroll horizontal", `overflow=${overflow}`);
    await fill(page);
    await submit(page).click();
    await page.waitForSelector("[role=status]");
    check(hook.hits.length === 1, "pedido enviado a partir do telemóvel");
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(
  failed === 0
    ? "\nE2E do formulário: TUDO OK"
    : `\nE2E do formulário: ${failed} verificação(ões) falharam`,
);
process.exit(failed === 0 ? 0 : 1);
