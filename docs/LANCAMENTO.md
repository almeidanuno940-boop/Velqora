# Lançamento: onde ver falhas

O site não tem analytics nem cookies. Para saber se o formulário de contacto falha, há dois sítios a vigiar.

## 1. Logs da Netlify Function (`/api/lead`)

Netlify → o site → **Logs & metrics → Functions → `lead`**.

Cada falha regista **uma linha JSON sem dados pessoais** (nunca nome, email, telefone, mensagem, IP nem o URL do webhook):

| `event`               | O que significa                                                  | O que fazer                                                                      |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `lead_not_configured` | `MAKE_WEBHOOK_URL` ausente ou inválida (o visitante vê erro 503) | Definir a variável no Netlify e fazer novo deploy                                |
| `lead_forward_failed` | O Make respondeu com erro (`status`) ou não respondeu (`type`)   | Ver o cenário no Make; `type: "timeout"` = demorou mais de 8 s                   |
| `lead_rate_limited`   | Um IP excedeu o limite de pedidos (5 em 10 min por defeito)      | Normal em spam; se for frequente com clientes reais, subir `LEAD_RATE_LIMIT_MAX` |
| `lead_honeypot_hit`   | Um bot preencheu o campo escondido; nada foi enviado             | Nada                                                                             |

Cada linha tem também `at` (data/hora ISO). Exemplo:

```json
{
  "event": "lead_forward_failed",
  "type": "http_status",
  "status": 500,
  "at": "2026-10-12T18:00:00.000Z"
}
```

Sempre que há uma falha, o visitante vê uma mensagem de erro com um link para enviar o pedido por email (já preenchido) e o telefone, por isso o contacto não se perde.

## 2. Alertas no Make

No cenário que recebe o webhook:

- **Scenario settings → ative as notificações de erro** (o Make envia um email quando uma execução falha) e confirme que o email de notificação da conta é um que lê.
- Ative **"Allow storing of incomplete executions"**: se um módulo falhar (por exemplo, o Gmail ou o Google Sheets), a execução fica guardada para a repetir em vez de perder o lead.
- Opcional: acrescente uma rota de erro (_error handler_) que lhe envie um email com o `idPedido`.

## 3. Primeiro teste depois do deploy

1. Definir `MAKE_WEBHOOK_URL` no Netlify (Site configuration → Environment variables) e fazer novo deploy.
2. Enviar um pedido real pelo formulário do site publicado.
3. Confirmar que o cenário do Make o recebeu e que não aparece nenhum `lead_*` nos logs da function.

## Checklist pós-deploy

- [ ] **`MAKE_WEBHOOK_URL`** definida no Netlify (_Site configuration → Environment variables_, sem prefixo `VITE_`) e novo deploy feito depois de a definir.
- [ ] **Lead de teste** enviado pelo formulário do site publicado; aparece a mensagem "Obrigado…".
- [ ] O pedido **chegou ao cenário do Make** (histórico de execuções) com nome, email, serviço e `idPedido`.
- [ ] **Logs da function** sem erros: _Logs & metrics → Functions → `lead`_ não mostra nenhum `lead_*` para esse pedido.
- [ ] **Alertas do Make** ativos: notificações de erro do cenário e "Allow storing of incomplete executions".
- [ ] **Domínio**: se mudar, definir `VITE_SITE_URL=https://dominio-final` no Netlify e fazer novo deploy; confirmar em `/robots.txt`, `/sitemap.xml` e no código-fonte da página (canonical e `og:url`).
- [ ] **Partilha**: colar o URL no LinkedIn/WhatsApp e confirmar a imagem e o título.
- [ ] **Telemóvel real** (iOS e Android): página carrega sem a cena 3D, menu abre e fecha, formulário envia, links de email/telefone abrem a app certa, "Adicionar ao ecrã principal" mostra o ícone.
