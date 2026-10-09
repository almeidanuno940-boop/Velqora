import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { CONTACT } from "@/content/site";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Velqora" },
      {
        name: "description",
        content: "Política de Privacidade do website Velqora — Automation & Data Solutions.",
      },
      { property: "og:title", content: "Política de Privacidade | Velqora" },
      {
        property: "og:description",
        content: "Como são tratados os dados enviados através deste website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade">
      <p>
        Os dados enviados através do formulário de contacto (nome, empresa, email, telefone e
        mensagem) são usados apenas para responder ao seu pedido.
      </p>
      <p>
        Para questões sobre os seus dados, contacte{" "}
        <a className="text-primary" href={CONTACT.emailHref}>
          {CONTACT.email}
        </a>
        .
      </p>
    </LegalPage>
  ),
});
