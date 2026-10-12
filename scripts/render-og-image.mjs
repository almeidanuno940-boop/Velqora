// Gera public/og-image.png (1200×630) a partir de scripts/og-image.html, com o Chrome instalado.
// Uso: bun run og-image   (defina CHROME_PATH para usar outro executável do Chrome/Chromium)
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const template = new URL("./og-image.html", import.meta.url).href;
const out = fileURLToPath(new URL("../public/og-image.png", import.meta.url));

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(template);
  await page.evaluate(() => document.fonts.ready);
  const families = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
  );
  if (!families.includes("Bricolage")) throw new Error("A fonte Bricolage não carregou.");
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
} finally {
  await browser.close();
}

const kb = Math.round(statSync(out).size / 1024);
console.log(`og-image.png gerada (${kb} KB)`);
if (kb > 300) console.warn("AVISO: a imagem passa dos 300 KB.");
