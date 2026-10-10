import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
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
import { CtaLink, Reveal, SectionHead, SplitHeading } from "./Reveal";
import { ContactForm } from "./ContactForm";

const wrap = "mx-auto max-w-7xl px-5 sm:px-8";
const section = "relative py-28 sm:py-40";
const pad = (n: number) => String(n).padStart(2, "0");

/* ————————————————————————————————— Hero */

export function Hero() {
  return (
    <section
      id="inicio"
      data-scene="hero"
      className="relative flex min-h-[100svh] flex-col justify-end pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-16"
    >
      <div className={cn(wrap, "grid w-full items-end gap-12 lg:grid-cols-[1fr_auto]")}>
        <div className="max-w-4xl">
          <Reveal intro>
            <p className="eyebrow">Velqora · Automation &amp; Data Solutions</p>
          </Reveal>
          <SplitHeading
            intro
            as="h1"
            text={"Automatize o trabalho.\n_Transforme os seus dados._"}
            className="mt-6 text-[3.15rem] sm:text-7xl lg:text-[6.4rem] xl:text-[7.2rem]"
            delay={120}
          />
          <Reveal intro delay={350}>
            <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-ember">
              Automatize. Simplifique. Cresça.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              A Velqora cria soluções de automação, inteligência artificial e análise de dados que
              ajudam empresas a simplificar processos, poupar tempo e trabalhar de forma mais
              eficiente.
            </p>
          </Reveal>
          <Reveal intro delay={480} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="#contacto" arrow>
              Pedir uma demonstração
            </CtaLink>
            <CtaLink href="#servicos" variant="ghost">
              Explorar soluções
            </CtaLink>
          </Reveal>
          <Reveal
            intro
            delay={600}
            className="mt-9 flex flex-col text-sm text-muted-foreground sm:flex-row sm:gap-7"
          >
            <a
              href={CONTACT.emailHref}
              className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail className="size-4" />
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="size-4" />
              {CONTACT.phone}
            </a>
          </Reveal>
        </div>

        <Reveal intro delay={700} className="hidden lg:block">
          <div className="panel w-72 !bg-[oklch(0.15_0.02_253/0.6)] p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Workflow · Leads</span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                Ativo
              </span>
            </div>
            <ol className="space-y-1.5">
              {HERO_FLOW.map((s, i) => (
                <li
                  key={s}
                  className="flow-node flex items-center gap-3 rounded-lg border px-3 py-2 text-[13px]"
                  style={{ animationDelay: `${i}s` }}
                >
                  <span className="font-mono text-[10px] opacity-70">{pad(i + 1)}</span>
                  <span className="font-medium uppercase tracking-wide">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-white/[0.07] pt-3 text-xs text-muted-foreground">
              Automação pensada para processos reais de pequenas empresas.
            </p>
          </div>
        </Reveal>
      </div>

      <div
        className={cn(wrap, "mt-14 flex w-full items-center justify-between")}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Do caos à clareza
        </span>
        <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-primary" />
          </span>
        </span>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Problema */

const problemIcons = [Inbox, Layers, Repeat, BarChart3];

export function Problem() {
  return (
    <section data-scene="problem" className={section}>
      <div className={wrap}>
        <SectionHead
          index="01"
          eyebrow="O problema"
          title="Quanto tempo perde a sua empresa com tarefas que _poderiam ser automáticas?_"
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => {
            const Icon = problemIcons[i] ?? Inbox;
            return (
              <Reveal key={p.title} delay={i * 90} className="h-full">
                <article
                  data-spot
                  className="panel group h-full p-6 transition-transform duration-700 ease-out-expo hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl border border-ember/25 bg-ember/10 text-ember">
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{pad(i + 1)}</span>
                  </div>
                  <h3 className="mt-10 text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-12 flex flex-col items-start gap-6 border-t border-white/[0.08] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Formulários, emails, folhas de cálculo e tarefas manuais podem tornar o acompanhamento
            diário mais lento e aumentar o risco de perder informação importante.
          </p>
          <CtaLink href="#servicos" variant="ghost" arrow className="shrink-0">
            Descobrir como automatizar
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Serviços */

type Service = (typeof SERVICES)[number];

function ServiceCard({
  s,
  n,
  className,
}: {
  s: Service;
  n: number;
  className?: string | undefined;
}) {
  return (
    <Reveal delay={(n % 3) * 90} className={cn("h-full", className)}>
      <article
        data-spot
        className="panel group flex h-full flex-col p-7 transition-transform duration-700 ease-out-expo hover:-translate-y-1.5"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground">{pad(n)}</span>
          <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-foreground/90">
            {s.price}
          </span>
        </div>
        <h3 className="mt-8 font-display text-[2rem] leading-[1.05] tracking-tight">{s.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
        <dl className="mt-6 space-y-3 border-t border-white/[0.07] pt-5 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
              Resolve
            </dt>
            <dd className="mt-1 text-foreground/85">{s.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              Benefício
            </dt>
            <dd className="mt-1 text-foreground/85">{s.benefit}</dd>
          </div>
        </dl>
        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Inclui">
          {s.includes.map((x) => (
            <li
              key={x}
              className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-xs text-foreground/80"
            >
              {x}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <a
            href="#contacto"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary"
          >
            {s.cta}
            <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

function FeaturedService({ s, n }: { s: Service; n: number }) {
  if (!("flow" in s)) return null;
  return (
    <Reveal className="md:col-span-2 lg:col-span-6">
      <article
        data-spot
        className="panel group grid gap-10 overflow-hidden p-7 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col">
          <p className="eyebrow">
            <span className="text-muted-foreground">{pad(n)}</span>Sistema completo
          </p>
          <h3 className="mt-6 font-display text-[2.5rem] leading-[1.02] tracking-tight sm:text-5xl">
            {s.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{s.desc}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
                Resolve
              </dt>
              <dd className="mt-1 text-foreground/85">{s.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                Benefício
              </dt>
              <dd className="mt-1 text-foreground/85">{s.benefit}</dd>
            </div>
          </dl>
          <ul className="mt-7 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2" aria-label="Inclui">
            {s.includes.map((x) => (
              <li key={x} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-5 pt-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-4xl tracking-tight">{s.price}</p>
              {"note" in s && <p className="mt-1.5 text-xs text-muted-foreground">{s.note}</p>}
            </div>
            <CtaLink href="#demonstracao" arrow className="shrink-0">
              {s.cta}
            </CtaLink>
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] bg-[oklch(0.12_0.016_255/0.7)] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Fluxo do sistema
          </p>
          <ol className="relative mt-6 space-y-2">
            <span
              aria-hidden="true"
              className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-ember/70 via-primary/60 to-sky/60"
            />
            {s.flow.map((f, j) => {
              const warm = j < 2;
              return (
                <li key={f} className="relative flex items-center gap-4">
                  <span
                    className={cn(
                      "relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full border font-mono text-[10px]",
                      warm
                        ? "border-ember/40 bg-[oklch(0.2_0.04_70)] text-ember"
                        : "border-primary/40 bg-[oklch(0.2_0.04_190)] text-primary",
                    )}
                  >
                    {pad(j + 1)}
                  </span>
                  <span className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-sm">
                    {f}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </article>
    </Reveal>
  );
}

export function Services() {
  const regular = SERVICES.filter((s) => !("featured" in s && s.featured));
  const featured = SERVICES.find((s) => "featured" in s && s.featured);
  const spans = [
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-3",
    "md:col-span-2 lg:col-span-3",
  ];
  return (
    <section id="servicos" data-scene="services" className={section}>
      <div className={wrap}>
        <SectionHead
          index="02"
          eyebrow="Serviços"
          title="Serviços que transformam _processos em resultados._"
          sub="Soluções práticas para automatizar processos e transformar dados em decisões."
        />
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {regular.map((s, i) => (
            <ServiceCard key={s.title} s={s} n={i + 1} className={spans[i]} />
          ))}
          {featured && <FeaturedService s={featured} n={regular.length + 1} />}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Setores */

const sectorIcons = [Building2, Stethoscope, HardHat, Ruler, Wrench, Briefcase];

export function Sectors() {
  return (
    <section id="solucoes" data-scene="sectors" className={section}>
      <div className={wrap}>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHead index="03" eyebrow="Soluções" title="Soluções adaptadas _ao seu negócio._" />
          <Reveal>
            <CtaLink href="#contacto" variant="ghost" arrow>
              Encontrar uma solução para a minha empresa
            </CtaLink>
          </Reveal>
        </div>
        <ul className="mt-16 border-t border-white/[0.09]">
          {SECTORS.map((s, i) => {
            const Icon = sectorIcons[i] ?? Briefcase;
            return (
              <Reveal as="li" key={s.title} delay={i * 60}>
                <div className="group relative grid gap-4 border-b border-white/[0.09] py-7 sm:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.6fr)] sm:items-center sm:gap-8 lg:py-9">
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-4 -right-4 -z-10 origin-left scale-x-0 rounded-2xl bg-gradient-to-r from-primary/[0.08] to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                  <span className="font-mono text-xs text-muted-foreground">{pad(i + 1)}</span>
                  <h3 className="flex items-center gap-4 font-display text-3xl tracking-tight transition-transform duration-700 ease-out-expo group-hover:translate-x-2 sm:text-4xl">
                    <Icon className="size-5 shrink-0 text-primary" />
                    {s.title}
                  </h3>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    {s.items.map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-primary/70" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Demonstração */

export function Demo() {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleY(1)";
      items.forEach((el) => el.classList.add("is-active"));
      return;
    }
    let cleanup = () => {};
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: 0.6 },
            },
          );
          items.forEach((el) =>
            ScrollTrigger.create({
              trigger: el,
              start: "top 62%",
              onEnter: () => el.classList.add("is-active"),
              onLeaveBack: () => el.classList.remove("is-active"),
            }),
          );
        });
        cleanup = () => ctx.revert();
      },
    );
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section id="demonstracao" data-scene="demo" className={section}>
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20")}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            index="04"
            eyebrow="Demonstração"
            title="Veja como uma automação pode funcionar _na prática._"
          />
          <Reveal delay={200}>
            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {[
                "Formulário",
                "Make",
                "IA",
                "Google Sheets",
                "Email",
                "Lead Management",
                "Power BI",
              ].map((t, i, a) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className={i === 0 ? "text-ember" : "text-foreground/85"}>{t}</span>
                  {i < a.length - 1 && <span className="text-primary">→</span>}
                </span>
              ))}
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Exemplo demonstrativo desenvolvido pela Velqora. Os dados e o fluxo ilustram uma
              possibilidade e não representam um cliente real.
            </p>
            <div className="mt-8">
              <CtaLink href="#contacto" arrow>
                Pedir uma demonstração
              </CtaLink>
            </div>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative space-y-3 pl-12 sm:pl-16">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[15px] top-6 w-px bg-white/[0.08] sm:left-[23px]"
          >
            <span
              ref={lineRef}
              className="absolute inset-0 origin-top bg-gradient-to-b from-ember via-primary to-sky"
              style={{ transform: "scaleY(0)" }}
            />
          </span>
          {DEMO_STEPS.map((s, i) => (
            <li
              key={s}
              data-step
              className="group/step relative rounded-2xl border border-white/[0.07] bg-[oklch(0.15_0.02_253/0.72)] px-5 py-4 transition-all duration-700 ease-out-expo [&.is-active]:border-primary/30 [&.is-active]:bg-[oklch(0.17_0.03_200/0.75)]"
            >
              <span
                aria-hidden="true"
                className="absolute -left-12 top-1/2 grid size-[31px] -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-background font-mono text-[10px] text-muted-foreground transition-all duration-700 ease-out-expo group-[.is-active]/step:border-primary/60 group-[.is-active]/step:text-primary group-[.is-active]/step:shadow-[0_0_20px_oklch(0.87_0.13_178/0.5)] sm:-left-16 sm:size-[47px] sm:text-xs"
              >
                {pad(i + 1)}
              </span>
              <span className="text-[15px] text-foreground/75 transition-colors duration-700 group-[.is-active]/step:text-foreground">
                {s}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Como funciona */

export function HowItWorks() {
  return (
    <section id="como-funciona" data-scene="how" className={section}>
      <div className={wrap}>
        <SectionHead
          index="05"
          eyebrow="Processo"
          title="Como funciona: _cinco passos, sem complicações._"
        />
        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="h-full">
              <div data-spot className="panel group flex h-full flex-col p-6">
                <span className="font-display text-7xl leading-none tracking-tight text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_oklch(0.87_0.13_178/0.6)] group-hover:text-primary/15">
                  {pad(i + 1)}
                </span>
                <h3 className="mt-10 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Ferramentas */

export function Tools() {
  const row = [...TOOLS, ...TOOLS];
  return (
    <section data-scene="tools" className={cn(section, "overflow-hidden")}>
      <div className={wrap}>
        <SectionHead
          center
          index="06"
          eyebrow="Tecnologia"
          title="Ferramentas que podem _trabalhar em conjunto._"
        />
      </div>
      <Reveal className="marquee mt-16" delay={150}>
        <ul className="sr-only">
          {TOOLS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="marquee-track flex w-max" aria-hidden="true">
          {row.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="flex items-center gap-8 whitespace-nowrap pr-8 font-display text-5xl tracking-tight text-foreground/90 sm:text-7xl"
            >
              {t}
              <span className="size-2 rounded-full bg-primary/70" />
            </span>
          ))}
        </div>
      </Reveal>
      <div className={wrap}>
        <Reveal className="mt-16 text-center">
          <p className="mx-auto max-w-2xl font-display text-3xl leading-tight tracking-tight text-foreground/90 sm:text-4xl">
            Não vendemos ferramentas.{" "}
            <span className="text-gradient italic">
              Criamos soluções que ligam as ferramentas certas ao processo certo.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Preços */

export function Pricing() {
  return (
    <section id="precos" data-scene="pricing" className={section}>
      <div className={wrap}>
        <SectionHead
          center
          index="07"
          eyebrow="Preços"
          title="Soluções simples _e transparentes._"
          sub="Preços iniciais para projetos standard. Cada solução pode ser adaptada à complexidade do negócio."
        />
        <div className="mt-16 grid items-stretch gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90} className="h-full">
              <div
                data-spot
                className={cn(
                  "panel relative flex h-full flex-col p-8 transition-transform duration-700 ease-out-expo hover:-translate-y-1.5",
                  p.featured &&
                    "!border-primary/40 !bg-[linear-gradient(180deg,oklch(0.87_0.13_178/0.1),oklch(0.16_0.02_253/0.9)_45%)] shadow-[0_30px_80px_-30px_oklch(0.87_0.13_178/0.35)]",
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground">
                    Mais completo
                  </span>
                )}
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {p.name}
                </h3>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Desde</span>
                  <span className="font-display text-6xl leading-none tracking-tight">
                    {p.price.replace("Desde ", "")}
                  </span>
                </p>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Ideal para:</span> {p.ideal}
                </p>
                <div className="hairline my-7" />
                <ul className="space-y-3 text-sm">
                  {p.includes.map((x) => (
                    <li key={x} className="flex items-center gap-3">
                      <Check className="size-4 shrink-0 text-primary" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  <a
                    href="#contacto"
                    aria-label={`Escolher o plano ${p.name}`}
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center rounded-full text-sm font-medium transition-all duration-500 ease-out-expo",
                      p.featured
                        ? "bg-primary text-primary-foreground hover:shadow-[0_10px_40px_-10px_oklch(0.87_0.13_178/0.7)]"
                        : "border border-white/15 hover:border-primary/60 hover:text-primary",
                    )}
                  >
                    Escolher
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["Projetos personalizados", "Desde €399 / orçamento personalizado"],
            ["Manutenção e acompanhamento", "Desde €50/mês"],
          ].map(([t, v], i) => (
            <Reveal key={t} delay={i * 90}>
              <div className="panel flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-3 font-medium">
                  <Plus className="size-4 text-primary" />
                  {t}
                </span>
                <span className="text-sm text-muted-foreground sm:text-right">{v}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Os preços apresentados são valores iniciais. O preço final depende da complexidade, número
          de integrações e necessidades específicas da empresa.
        </p>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Sobre */

export function About() {
  return (
    <section id="sobre" data-scene="about" className={section}>
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end")}>
        <div>
          <SectionHead
            index="08"
            eyebrow="Sobre a Velqora"
            title="Tecnologia útil para o _dia a dia das empresas._"
          />
          <Reveal delay={150} className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
            <p className="text-foreground/90">
              A Velqora nasceu com um objetivo simples: tornar a tecnologia útil para pequenas e
              médias empresas.
            </p>
            <p className="text-muted-foreground">
              Combinamos automação, inteligência artificial e análise de dados para criar soluções
              práticas adaptadas aos processos de cada negócio.
            </p>
          </Reveal>
          <Reveal delay={250} className="mt-10">
            <CtaLink href="#contacto" arrow>
              Falar comigo
            </CtaLink>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <dl className="panel divide-y divide-white/[0.07] overflow-hidden">
            {[
              ["Fundador", "Nuno Almeida"],
              ["Base", "Portugal"],
              ["Foco", "Automation + Data Analytics"],
            ].map(([k, v]) => (
              <div key={k} className="px-7 py-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-2 font-display text-3xl tracking-tight">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— FAQ */

export function Faq() {
  return (
    <section id="faq" data-scene="faq" className={section}>
      <div className={cn(wrap, "grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20")}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead index="09" eyebrow="FAQ" title="Perguntas _frequentes._" />
          <Reveal delay={200}>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Não encontra a resposta?{" "}
              <a
                href="#contacto"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                Fale connosco
              </a>
              .
            </p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="panel px-6 sm:px-8">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`f${i}`}
                className="border-white/[0.07] last:border-b-0"
              >
                <AccordionTrigger className="gap-6 py-6 text-left text-base font-medium hover:text-primary hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Contacto */

export function Contact() {
  return (
    <section id="contacto" data-scene="contact" className={section}>
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20")}>
        <div>
          <SectionHead
            index="10"
            eyebrow="Contacto"
            title="Tem um processo que _poderia ser automático?_"
          />
          <Reveal delay={150}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Conte-nos como a sua empresa trabalha atualmente. Podemos identificar onde a automação
              pode poupar tempo e simplificar o processo.
            </p>
          </Reveal>
          <Reveal delay={220} className="mt-10 space-y-3">
            {[
              { href: CONTACT.emailHref, Icon: Mail, label: "Email", value: CONTACT.email },
              { href: CONTACT.phoneHref, Icon: Phone, label: "Telefone", value: CONTACT.phone },
            ].map(({ href, Icon, label, value }) => (
              <a
                key={label}
                href={href}
                data-spot
                className="panel group flex items-center gap-4 p-5 transition-colors hover:border-primary/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="mt-0.5 block break-all font-medium">{value}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </Reveal>
          <Reveal delay={280} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={CONTACT.emailHref} variant="ghost">
              <Mail className="size-4" />
              Enviar email
            </CtaLink>
            <CtaLink href={CONTACT.phoneHref} variant="ghost">
              <Phone className="size-4" />
              Ligar agora
            </CtaLink>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— CTA final */

export function FinalCta() {
  return (
    <section data-scene="final" className="relative py-32 sm:py-48">
      <div className={cn(wrap, "text-center")}>
        <SplitHeading
          text={"Menos tarefas manuais.\n_Mais tempo para o seu negócio._"}
          className="mx-auto max-w-5xl text-[2.9rem] sm:text-7xl lg:text-[6rem]"
        />
        <Reveal delay={250}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-muted-foreground">
            Descubra onde a automação pode simplificar o trabalho da sua empresa.
          </p>
        </Reveal>
        <Reveal
          delay={350}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <CtaLink href="#contacto" arrow>
            Quero automatizar o meu negócio
          </CtaLink>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ou ligue {CONTACT.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
