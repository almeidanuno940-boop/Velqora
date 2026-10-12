import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS, withSecurityHeaders } from "../src/lib/security-headers";

describe("cabeçalhos de segurança", () => {
  it("acrescenta os cabeçalhos e mantém estado, corpo e cabeçalhos existentes", async () => {
    const res = withSecurityHeaders(
      new Response("<p>ok</p>", { status: 404, headers: { "Content-Type": "text/html" } }),
    );
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("<p>ok</p>");
    expect(res.headers.get("content-type")).toBe("text/html");
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(res.headers.get(name)).toBe(value);
    }
  });

  it("não substitui um cabeçalho já definido", () => {
    const res = withSecurityHeaders(
      new Response("", { headers: { "X-Frame-Options": "SAMEORIGIN" } }),
    );
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });

  it("o netlify.toml tem os mesmos valores", () => {
    const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(toml).toContain(`${name} = ${JSON.stringify(value)}`);
    }
  });
});
