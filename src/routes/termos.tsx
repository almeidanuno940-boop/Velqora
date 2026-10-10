import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, Pending, Section } from "@/components/site/LegalPage";
import { CONTACT, SITE_URL } from "@/content/site";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos e Condições | Velqora" },
      {
        name: "description",
        content: "Termos e Condições do website Velqora — Automation & Data Solutions.",
      },
      { property: "og:title", content: "Termos e Condições | Velqora" },
      { property: "og:description", content: "Condições de utilização deste website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: `${SITE_URL}/termos` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/termos` }],
  }),
  component: () => (
    <LegalPage title="Termos e Condições">
      <Section title="1. Identificação">
        <p>
          Este website é operado pela Velqora — Automation &amp; Data Solutions. Contacto:{" "}
          <a className="text-primary underline underline-offset-4" href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>
          .
        </p>
        <p>
          <Pending>denominação legal, NIF e morada a indicar</Pending>
        </p>
      </Section>

      <Section title="2. Preços e propostas">
        <p>
          Os preços indicados no website são valores iniciais e não constituem proposta vinculativa.
          Cada projeto é orçamentado individualmente.
        </p>
      </Section>

      <Section title="3. Dados pessoais">
        <p>
          O tratamento dos dados enviados através do formulário de contacto está descrito na{" "}
          <Link to="/privacidade" className="text-primary underline underline-offset-4">
            Política de Privacidade
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  ),
});
