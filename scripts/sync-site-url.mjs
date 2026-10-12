// Gera public/robots.txt e public/sitemap.xml a partir do endereço do site, para o domínio só ter de ser
// trocado num sítio: a variável de ambiente VITE_SITE_URL (se definida) ou DEFAULT_SITE_URL em
// src/content/site.ts. Corre antes do build (ver netlify.toml e "prebuild").
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/content/site.ts", import.meta.url), "utf8");
const match = source.match(/const DEFAULT_SITE_URL\s*=\s*"([^"]+)"/);
if (!match) throw new Error("DEFAULT_SITE_URL não encontrado em src/content/site.ts");
const siteUrl = (process.env.VITE_SITE_URL?.trim() || match[1]).replace(/\/+$/, "");
if (!/^https?:\/\/[^/\s]+$/.test(siteUrl)) throw new Error(`SITE_URL inválido: ${siteUrl}`);

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

// Só páginas indexáveis (privacidade e termos têm noindex).
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>
</urlset>
`;

const out = (name) => new URL(`../public/${name}`, import.meta.url);
writeFileSync(out("robots.txt"), robots);
writeFileSync(out("sitemap.xml"), sitemap);
console.log(`robots.txt e sitemap.xml gerados para ${siteUrl}`);
