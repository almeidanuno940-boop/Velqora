import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE_URL } from "@/content/site";

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
      <p>
        Os preços indicados no website são valores iniciais e não constituem proposta vinculativa.
        Cada projeto é orçamentado individualmente.
      </p>
    </LegalPage>
  ),
});
