import {
  ArrowRight,
  ArrowDown,
  Check,
  Mail,
  Phone,
  Inbox,
  Layers,
  Repeat,
  BarChart3,
  Building2,
  Stethoscope,
  HardHat,
  Ruler,
  Wrench,
  Briefcase,
  Plus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CONTACT,
  DEMO_STEPS,
  FAQS,
  HERO_FLOW,
  PLANS,
  PROBLEMS,
  SECTORS,
  SERVICES,
  STEPS,
  TOOLS,
} from "@/content/site";
import { cn } from "@/lib/utils";
import { CtaLink, Reveal, SectionHead } from "./Reveal";
import { ContactForm } from "./ContactForm";

const wrap = "mx-auto max-w-7xl px-5 sm:px-8";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
      <div className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
      <div className="absolute -top-32 right-0 -z-10 size-[520px] rounded-full bg-accent blur-3xl opacity-70" />
      <div className={cn(wrap, "grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]")}>
        <Reveal>
          <p className="eyebrow">Velqora · Automation &amp; Data Solutions</p>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Automatize. Simplifique. Cresça.
          </p>
          <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.03] sm:text-6xl lg:text-[4.2rem]">
            Automatize o trabalho.
            <br />
            <span className="text-primary">Transforme os seus dados.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A Velqora cria soluções de automação, inteligência artificial e análise de dados que
            ajudam empresas a simplificar processos, poupar tempo e trabalhar de forma mais
            eficiente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="#contacto">
              Pedir uma demonstração <ArrowRight className="size-4" />
            </CtaLink>
            <CtaLink href="#servicos" variant="ghost">
              Explorar soluções
            </CtaLink>
          </div>
          <div className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <a
              href={CONTACT.emailHref}
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              <Mail className="size-4" />
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              <Phone className="size-4" />
              {CONTACT.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-border bg-card/80 p-5 shadow-lift backdrop-blur">
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Workflow · Leads</span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <span className="size-1.5 rounded-full bg-signal" />
                Ativo
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border">
                <span className="flow-dot absolute -left-[3px] size-[7px] rounded-full bg-signal" />
              </div>
              <ol className="space-y-2.5">
                {HERO_FLOW.map((s, i) => (
                  <li
                    key={s}
                    className="flow-node relative flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
                    style={{ animationDelay: `${i}s` }}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent font-mono text-[10px] font-medium text-accent-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wide">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
              Automação pensada para processos reais de pequenas empresas.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const problemIcons = [Inbox, Layers, Repeat, BarChart3];

export function Problem() {
  return (
    <section className="border-y border-border bg-card py-20 sm:py-28">
      <div className={wrap}>
        <SectionHead
          eyebrow="O problema"
          title="Quanto tempo perde a sua empresa com tarefas que poderiam ser automáticas?"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => {
            const Icon = problemIcons[i] ?? Inbox;
            return (
              <Reveal key={p.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-5 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-muted-foreground">
            Formulários, emails, folhas de cálculo e tarefas manuais podem tornar o acompanhamento
            diário mais lento e aumentar o risco de perder informação importante.
          </p>
          <CtaLink href="#servicos" variant="ghost">
            Descobrir como automatizar <ArrowRight className="size-4" />
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicos" className="py-20 sm:py-28">
      <div className={wrap}>
        <SectionHead
          eyebrow="Serviços"
          title="Serviços"
          sub="Soluções práticas para automatizar processos e transformar dados em decisões."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const featured = "featured" in s && s.featured;
            return (
              <Reveal
                key={s.title}
                delay={(i % 3) * 80}
                className={cn(featured && "md:col-span-2 lg:col-span-3")}
              >
                <article
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                    featured
                      ? "border-primary/30 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10"
                      : "border-border",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                      {featured && " · Sistema completo"}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    <p className="mt-4 text-sm">
                      <span className="font-semibold">Resolve:</span>{" "}
                      <span className="text-muted-foreground">{s.problem}</span>
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Benefício:</span>{" "}
                      <span className="text-muted-foreground">{s.benefit}</span>
                    </p>
                    <ul className={cn("mt-5 grid gap-2 text-sm", featured && "sm:grid-cols-2")}>
                      {s.includes.map((x) => (
                        <li key={x} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {x}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <p className="text-lg font-semibold">{s.price}</p>
                      {"note" in s && (
                        <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                      )}
                      <a
                        href={featured ? "#demonstracao" : "#contacto"}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        {s.cta}{" "}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                  {"flow" in s && (
                    <div className="dot-grid mt-8 rounded-xl border border-border bg-background p-5 lg:mt-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Fluxo do sistema
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {s.flow.map((f, j) => (
                          <span key={f} className="flex items-center gap-2">
                            <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft">
                              {f}
                            </span>
                            {j < s.flow.length - 1 && (
                              <ArrowRight className="size-3.5 text-muted-foreground" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const sectorIcons = [Building2, Stethoscope, HardHat, Ruler, Wrench, Briefcase];

export function Sectors() {
  return (
    <section id="solucoes" className="border-y border-border bg-card py-20 sm:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="Soluções" title="Soluções adaptadas ao seu negócio" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s, i) => {
            const Icon = sectorIcons[i] ?? Briefcase;
            return (
              <Reveal key={s.title} delay={(i % 3) * 80}>
                <div className="h-full rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-accent">
                      <Icon className="size-4 text-accent-foreground" />
                    </span>
                    <h3 className="font-semibold">{s.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {s.items.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="mt-2 size-1 rounded-full bg-primary" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10">
          <CtaLink href="#contacto">
            Encontrar uma solução para a minha empresa <ArrowRight className="size-4" />
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

export function Demo() {
  return (
    <section id="demonstracao" className="bg-ink py-20 text-ink-foreground sm:py-28">
      <div className={wrap}>
        <Reveal className="max-w-2xl">
          <p className="eyebrow !text-signal">Demonstração</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Veja como uma automação pode funcionar na prática
          </h2>
        </Reveal>
        <p className="mt-10 mb-4 font-mono text-xs uppercase tracking-widest text-ink-foreground/55">
          Formulário → Make → IA → Google Sheets → Email → Lead Management → Power BI
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_STEPS.map((s, i) => (
            <Reveal key={s} delay={(i % 4) * 70}>
              <li
                className="flow-node relative flex h-full items-start gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.04] p-4"
                style={{ animationDelay: `${i * 0.5}s`, animationDuration: "6s" }}
              >
                <span className="font-mono text-xs text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm">{s}</span>
                {i < DEMO_STEPS.length - 1 && (
                  <>
                    <ArrowDown className="absolute -bottom-3 left-1/2 z-10 size-3.5 -translate-x-1/2 text-ink-foreground/30 sm:hidden" />
                  </>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm text-ink-foreground/65">
            Exemplo demonstrativo desenvolvido pela Velqora. Os dados e o fluxo ilustram uma
            possibilidade e não representam um cliente real.
          </p>
          <CtaLink href="#contacto" variant="light">
            Pedir uma demonstração <ArrowRight className="size-4" />
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="Processo" title="Como funciona" />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-card p-6">
              <Reveal delay={i * 80}>
                <span className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Tools() {
  return (
    <section className="border-y border-border bg-card py-20 sm:py-24">
      <div className={cn(wrap, "text-center")}>
        <SectionHead
          center
          eyebrow="Tecnologia"
          title="Ferramentas que podem trabalhar em conjunto"
        />
        <Reveal className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {TOOLS.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              {t}
            </span>
          ))}
        </Reveal>
        <Reveal className="mt-10">
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Não vendemos ferramentas. Criamos soluções que ligam as ferramentas certas ao processo
            certo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="precos" className="py-20 sm:py-28">
      <div className={wrap}>
        <SectionHead
          center
          eyebrow="Preços"
          title="Soluções simples e transparentes"
          sub="Preços iniciais para projetos standard. Cada solução pode ser adaptada à complexidade do negócio."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 transition-shadow hover:shadow-lift",
                  p.featured ? "border-primary bg-card shadow-lift" : "border-border bg-card",
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground">
                    Mais completo
                  </span>
                )}
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{p.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Ideal para:</span> {p.ideal}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.includes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="size-4 text-primary" />
                      {x}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={cn(
                    "mt-8 inline-flex min-h-11 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    p.featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:border-primary hover:text-primary",
                  )}
                >
                  Escolher
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ["Projetos personalizados", "Desde €399 / orçamento personalizado"],
            ["Manutenção e acompanhamento", "Desde €50/mês"],
          ].map(([t, v]) => (
            <Reveal key={t}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-5">
                <span className="flex items-center gap-3 font-medium">
                  <Plus className="size-4 text-primary" />
                  {t}
                </span>
                <span className="text-right text-sm text-muted-foreground">{v}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Os preços apresentados são valores iniciais. O preço final depende da complexidade, número
          de integrações e necessidades específicas da empresa.
        </p>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="sobre" className="border-y border-border bg-card py-20 sm:py-28">
      <div className={cn(wrap, "grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center")}>
        <Reveal>
          <p className="eyebrow">Sobre a Velqora</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Tecnologia útil para o dia a dia das empresas.
          </h2>
          <div className="mt-6 space-y-4 text-lg text-muted-foreground">
            <p>
              A Velqora nasceu com um objetivo simples: tornar a tecnologia útil para pequenas e
              médias empresas.
            </p>
            <p>
              Combinamos automação, inteligência artificial e análise de dados para criar soluções
              práticas adaptadas aos processos de cada negócio.
            </p>
          </div>
          <div className="mt-8">
            <CtaLink href="#contacto">
              Falar comigo <ArrowRight className="size-4" />
            </CtaLink>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <dl className="divide-y divide-border rounded-2xl border border-border bg-background shadow-soft">
            {[
              ["Fundador", "Nuno Almeida"],
              ["Base", "Portugal"],
              ["Foco", "Automation + Data Analytics"],
            ].map(([k, v]) => (
              <div key={k} className="p-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-1.5 text-lg font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead center eyebrow="FAQ" title="Perguntas frequentes" />
        <Reveal className="mt-10">
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card px-6"
          >
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="last:border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contacto" className="border-t border-border bg-card py-20 sm:py-28">
      <div className={cn(wrap, "grid gap-12 lg:grid-cols-[0.85fr_1.15fr]")}>
        <Reveal>
          <p className="eyebrow">Contacto</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Tem um processo que poderia ser automático?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Conte-me como a sua empresa trabalha atualmente. Podemos identificar onde a automação
            pode poupar tempo e simplificar o processo.
          </p>
          <div className="mt-8 space-y-3">
            <a
              href={CONTACT.emailHref}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
            >
              <Mail className="size-5 text-primary" />
              <span>
                <span className="block text-xs text-muted-foreground">Email</span>
                <span className="font-medium break-all">{CONTACT.email}</span>
              </span>
            </a>
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
            >
              <Phone className="size-5 text-primary" />
              <span>
                <span className="block text-xs text-muted-foreground">Telefone</span>
                <span className="font-medium">{CONTACT.phone}</span>
              </span>
            </a>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={CONTACT.emailHref} variant="ghost">
              <Mail className="size-4" />
              Enviar email
            </CtaLink>
            <CtaLink href={CONTACT.phoneHref} variant="ghost">
              <Phone className="size-4" />
              Ligar agora
            </CtaLink>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-20 sm:py-24">
      <div className={wrap}>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center text-ink-foreground sm:px-12 sm:py-20">
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(oklch(1_0_0/12%)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute -top-40 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-primary/50 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-5xl">
                Menos tarefas manuais.
                <br />
                Mais tempo para o seu negócio.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-ink-foreground/70">
                Descubra onde a automação pode simplificar o trabalho da sua empresa.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink href="#contacto" variant="light">
                  Quero automatizar o meu negócio <ArrowRight className="size-4" />
                </CtaLink>
                <a
                  href={CONTACT.phoneHref}
                  className="text-sm text-ink-foreground/80 hover:text-ink-foreground"
                >
                  ou ligue {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
