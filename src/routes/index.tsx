import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  About,
  Contact,
  Demo,
  Faq,
  FinalCta,
  Hero,
  HowItWorks,
  Pricing,
  Problem,
  Sectors,
  Services,
  Tools,
} from "@/components/site/Sections";
import { Loader } from "@/components/site/Loader";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { useSpotlight } from "@/hooks/use-spotlight";
import { CONTACT } from "@/content/site";

const TITLE = "Velqora | Automação, IA e Data Analytics para Empresas";
const DESC =
  "A Velqora cria soluções de automação, inteligência artificial, Power BI e análise de dados para pequenas e médias empresas em Portugal.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Velqora",
  alternateName: "Velqora Automation & Data Solutions",
  slogan: "Automatize. Simplifique. Cresça.",
  description: DESC,
  email: CONTACT.email,
  telephone: "+351916626440",
  areaServed: "PT",
  knowsAbout: [
    "Automação de processos",
    "Automação de leads",
    "Inteligência artificial",
    "Power BI",
    "Análise de dados",
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Velqora, automação de processos, automação de leads, automação para empresas, Power BI, dashboards Power BI, inteligência artificial para empresas, análise de dados, Portugal",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Velqora" },
      { property: "og:url", content: "https://screenshot-magic-8550.lovable.app/" },
      { property: "og:image", content: "https://screenshot-magic-8550.lovable.app/og-image.svg" },
      { property: "og:locale", content: "pt_PT" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "https://screenshot-magic-8550.lovable.app/og-image.svg" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  useSpotlight();
  return (
    <>
      <Loader />
      <SceneRoot />
      <Header />
      <main id="conteudo">
        <Hero />
        <Problem />
        <Services />
        <Sectors />
        <Demo />
        <HowItWorks />
        <Tools />
        <Pricing />
        <About />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
