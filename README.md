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

O projeto inclui `bun.lock` e utiliza Bun para gerir dependências:

```sh
bun install
bun run dev
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
