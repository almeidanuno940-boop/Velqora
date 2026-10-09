import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <Header />
      <main id="conteudo" className="mx-auto max-w-3xl px-5 pb-28 pt-40 sm:px-8">
        <p className="eyebrow">Documento legal</p>
        <h1 className="headline mt-5 text-5xl sm:text-6xl">{title}</h1>
        <div className="mt-8 rounded-xl border border-ember/30 bg-ember/10 px-5 py-4 text-sm text-foreground/90">
          Texto a rever: este documento é provisório e será substituído por uma versão revista.
        </div>
        <div className="panel mt-8 space-y-5 p-7 text-lg leading-relaxed text-muted-foreground sm:p-9">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
