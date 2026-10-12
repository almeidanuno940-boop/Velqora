# Velqora

Website da Velqora — automação, inteligência artificial e Power BI para empresas.

**Website:** https://screenshot-magic-8550.lovable.app<br>
**Projeto Lovable:** https://lovable.dev/projects/4e715852-9a17-41ba-a01f-9a8d2e856ed8

## Stack

- React 19 e TypeScript
- TanStack Start e TanStack Router
- Vite 8
- Tailwind CSS 4
- Netlify (adaptador TanStack Start) e Nitro

## Desenvolvimento

O gestor de pacotes é o **Bun** (`bun.lock` é a única lockfile; não usar `npm install`, que cria um `package-lock.json`).

```sh
bun install
bun run dev        # servidor de desenvolvimento
bun run typecheck  # tsc --noEmit
bun run lint
```

## Build e deployment

```sh
bun run build
```

As alterações enviadas para o branch ligado à Lovable sincronizam com o editor; não reescrever o histórico publicado.

## Formulário de contacto

O formulário valida os campos no browser e envia o pedido para a Netlify Function `netlify/functions/lead.ts` (`POST /api/lead`). A function volta a validar e sanitizar os dados, aplica anti-spam (honeypot e limite por IP) e reencaminha o pedido para o webhook do Make.

O URL do webhook fica **só no servidor**, na variável de ambiente `MAKE_WEBHOOK_URL` (Netlify: _Site configuration > Environment variables_; depois é preciso fazer novo deploy). Nunca usar o prefixo `VITE_`, que embute o valor no JavaScript do browser. Em local, copie `.env.example` para `.env`. Sem a variável, a function responde 503 e o formulário mostra uma alternativa por email.

`LEAD_RATE_LIMIT_MAX` (opcional) altera o limite por IP (por defeito, 5 pedidos em 10 minutos).

## Testes

```sh
bun run test       # vitest: Netlify Function do formulário e formato dos contactos
```

Teste de ponta a ponta do formulário (browser real, function e webhook simulado; precisa do Google Chrome):

```sh
MAKE_WEBHOOK_URL=http://127.0.0.1:4599/hook LEAD_RATE_LIMIT_MAX=100 bun run dev   # num terminal
BASE_URL=http://127.0.0.1:5173 bun run test:e2e                                    # noutro
```

## Domínio, dados legais e contactos

- **Domínio:** defina `VITE_SITE_URL` no Netlify (ou altere `DEFAULT_SITE_URL` em `src/content/site.ts`) e faça novo deploy. Canonical, Open Graph, `robots.txt` e `sitemap.xml` seguem esse valor.
- **Dados legais:** preencha `src/content/legal.ts` (denominação, NIF, morada, prazo de conservação). Enquanto faltar algum, as páginas legais mostram "Texto a rever" e o build avisa; com `STRICT_LEGAL=1` o build falha.
- **Contactos públicos:** `CONTACT` em `src/content/site.ts`.
- **Monitorização:** ver [docs/LANCAMENTO.md](docs/LANCAMENTO.md).
