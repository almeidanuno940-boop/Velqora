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

O formulário valida os campos no browser e pode enviar pedidos para um webhook Make ou compatível através de `VITE_MAKE_WEBHOOK_URL`. Sem essa variável, não envia nem guarda os dados e apresenta uma alternativa de email preenchida.
