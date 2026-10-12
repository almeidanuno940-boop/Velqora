import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LEGAL, legalIsComplete, type LegalField } from "@/content/legal";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** Informação que só o responsável pelo site pode fornecer. Fica visível até ser preenchida. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-ember/15 px-1.5 py-0.5 text-base text-foreground/90">
      [{children}]
    </span>
  );
}

/** Valor vindo de src/content/legal.ts; enquanto estiver vazio aparece como pendente. */
export function LegalValue({ field, label }: { field: LegalField; label: string }) {
  const value = LEGAL[field].trim();
  return value ? <>{value}</> : <Pending>{label} a indicar</Pending>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <Header />
      <main id="conteudo" className="mx-auto max-w-3xl px-5 pb-28 pt-40 sm:px-8">
        <h1 className="headline text-5xl sm:text-6xl">{title}</h1>
        {!legalIsComplete() && (
          <div className="mt-8 rounded-xl border border-ember/30 bg-ember/10 px-5 py-4 text-sm text-foreground/90">
            Texto a rever: este documento é provisório e será substituído por uma versão revista.
          </div>
        )}
        <div className="panel mt-8 space-y-5 p-7 text-lg leading-relaxed text-muted-foreground sm:p-9">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
