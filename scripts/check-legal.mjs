// Avisa (ou falha, com STRICT_LEGAL=1) se src/content/legal.ts ainda tiver campos legais por preencher.
// Corre antes do build (ver "prebuild" e netlify.toml).
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/content/legal.ts", import.meta.url), "utf8");
const fields = ["legalName", "nif", "address", "dataRetention"];
const missing = fields.filter((key) => {
  const m = source.match(new RegExp(String.raw`^\s*${key}:\s*"([^"]*)"`, "m"));
  if (!m) throw new Error(`Campo ${key} não encontrado em src/content/legal.ts`);
  return m[1].trim() === "";
});

if (missing.length === 0) {
  console.log("Dados legais completos.");
} else {
  const msg = `Dados legais por preencher em src/content/legal.ts: ${missing.join(", ")}`;
  if (process.env.STRICT_LEGAL === "1") {
    console.error(`ERRO (STRICT_LEGAL=1): ${msg}`);
    process.exit(1);
  }
  console.warn(`AVISO: ${msg}. As páginas legais continuam marcadas como "Texto a rever".`);
}
