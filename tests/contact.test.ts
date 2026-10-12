import { describe, expect, it } from "vitest";
import { CONTACT } from "../src/content/site";

describe("contactos públicos", () => {
  it("email válido e link mailto: correspondente", () => {
    expect(CONTACT.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
    expect(CONTACT.emailHref).toBe(`mailto:${CONTACT.email}`);
  });

  it("telefone em formato E.164 e link tel: sem espaços", () => {
    expect(CONTACT.phoneE164).toMatch(/^\+[1-9]\d{7,14}$/);
    expect(CONTACT.phoneHref).toBe(`tel:${CONTACT.phoneE164}`);
    // o número mostrado é o mesmo, só com espaços
    expect(CONTACT.phone.replace(/\s/g, "")).toBe(CONTACT.phoneE164);
  });
});
