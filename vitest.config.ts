import { defineConfig } from "vitest/config";

// Config própria (sem os plugins do TanStack/Netlify): os testes cobrem lógica pura e a Netlify Function.
export default defineConfig({
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
