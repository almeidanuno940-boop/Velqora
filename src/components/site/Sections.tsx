import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail, Phone } from "lucide-react";
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
const section = "relative py-24 sm:py-36";
/** linha fina que separa itens de uma lista */
const rule = "border-t border-white/[0.1]";
const pad = (n: number) => String(n).padStart(2, "0");

/* ————————————————————————————————— Hero */

export function Hero() {
  return (
    <section
      id="inicio"
      data-scene="hero"
      className="relative flex min-h-[100svh] flex-col justify-end pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-20"
    >
      <div className={cn(wrap, "grid w-full items-end gap-12 lg:grid-cols-[1fr_auto]")}>
        <div className="max-w-5xl">
          <SplitHeading
            intro
            tonal
            as="h1"
            text={"Automatize o trabalho.\n_Transforme os seus dados._"}
            className="text-[3.1rem] sm:text-7xl lg:text-[6.2rem] xl:text-[7rem]"
            delay={120}
          />
          <Reveal intro delay={350}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/85 sm:text-xl">
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
        </div>

        <Reveal intro delay={700} className="hidden lg:block">
          <div className="panel w-72 !bg-[oklch(0.15_0.02_253/0.6)] p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Workflow de leads</span>
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
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————————— Problema */

export function Problem() {
  return (
    <section data-scene="problem" className={section}>
      <div className={wrap}>
        <SectionHead title="Quanto tempo perde a sua empresa com tarefas que podem ser automáticas?" />
        <ul className="mt-16 sm:mt-20">
          {PROBLEMS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70}>
              <div
                className={cn(
                  rule,
                  "grid gap-3 py-8 md:grid-cols-[1.1fr_1fr] md:items-baseline md:gap-16 md:py-10",
                )}
              >
                <h3 className="display text-2xl text-ember sm:text-4xl">{p.title}</h3>
                <p className="max-w-md text-lg leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal
          className={cn(
            rule,
            "flex flex-col items-start gap-6 pt-8 md:flex-row md:items-center md:justify-between",
          )}
        >
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

function ServiceRow({ s, i }: { s: Service; i: number }) {
  return (
    <Reveal as="li" delay={(i % 2) * 70}>
      <article
        className={cn(rule, "group grid gap-8 py-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:py-12")}
      >
        <div className="flex flex-col items-start">
          <h3 className="display text-3xl sm:text-[2.6rem]">{s.title}</h3>
          <p className="mt-3 font-mono text-sm text-primary">{s.price}</p>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{s.desc}</p>
          <a
            href="#contacto"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-primary/60 underline-offset-[6px] transition-colors hover:text-primary"
          >
            {s.cta}
            <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </a>
        </div>
        <div className="space-y-6">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="label text-ember">Resolve</dt>
              <dd className="mt-1.5 leading-relaxed text-foreground/90">{s.problem}</dd>
            </div>
            <div>
              <dt className="label text-primary">Benefício</dt>
              <dd className="mt-1.5 leading-relaxed text-foreground/90">{s.benefit}</dd>
            </div>
          </dl>
          <div>
            <p className="label">Inclui</p>
            <p className="mt-1.5 leading-relaxed text-foreground/75">{s.includes.join(", ")}.</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function FeaturedService({ s }: { s: Service }) {
  if (!("flow" in s)) return null;
  return (
    <Reveal className="mt-10">
      <article
        data-spot
        className="panel group grid gap-10 overflow-hidden p-7 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col">
          <p className="label text-primary">O sistema completo</p>
          <h3 className="display mt-4 text-4xl sm:text-5xl">{s.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{s.desc}</p>
          <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="label text-ember">Resolve</dt>
              <dd className="mt-1 text-foreground/90">{s.problem}</dd>
            </div>
            <div>
              <dt className="label text-primary">Benefício</dt>
              <dd className="mt-1 text-foreground/90">{s.benefit}</dd>
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
              <p className="display text-4xl">{s.price}</p>
              {"note" in s && <p className="mt-1.5 text-xs text-muted-foreground">{s.note}</p>}
            </div>
            <CtaLink href="#demonstracao" arrow className="shrink-0">
              {s.cta}
            </CtaLink>
          </div>
        </div>

        <div className="relative rounded-xl border border-white/[0.08] bg-[oklch(0.12_0.016_255/0.7)] p-6 sm:p-8">
          <p className="label">Fluxo do sistema</p>
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
  return (
    <section id="servicos" data-scene="services" className={section}>
      <div className={wrap}>
        <SectionHead
          title="Serviços que transformam processos em resultados."
          sub="Soluções práticas para automatizar processos e transformar dados em decisões."
        />
        <ul className="mt-16 sm:mt-20">
          {regular.map((s, i) => (
            <ServiceRow key={s.title} s={s} i={i} />
          ))}
        </ul>
        {featured && <FeaturedService s={featured} />}
      </div>
    </section>
  );
}

/* ————————————————————————————————— Setores */

export function Sectors() {
  return (
    <section id="solucoes" data-scene="sectors" className={section}>
      <div className={wrap}>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHead title="Soluções adaptadas ao seu negócio." />
          <Reveal>
            <CtaLink href="#contacto" variant="ghost" arrow>
              Encontrar uma solução para a minha empresa
            </CtaLink>
          </Reveal>
        </div>
        <ul className="mt-16 sm:mt-20">
          {SECTORS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 50}>
              <div
                className={cn(
                  rule,
                  "group relative grid gap-4 py-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:items-center sm:gap-12 lg:py-9",
                )}
              >
                <h3 className="display text-3xl transition-transform duration-700 ease-out-expo group-hover:translate-x-2 sm:text-5xl">
                  {s.title}
                </h3>
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-muted-foreground">
                  {s.items.map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-primary/70" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
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
    // O GSAP só é carregado quando a secção está perto do ecrã: fica fora do arranque da página.
    const load = () =>
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
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            load();
          }
        },
        { rootMargin: "900px 0px" },
      );
      observer.observe(list);
    } else {
      load();
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section id="demonstracao" data-scene="demo" className={section}>
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20")}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead title="Veja como uma automação pode funcionar na prática." />
          <Reveal delay={200}>
            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
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
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
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
              className="group/step relative rounded-xl border border-white/[0.07] bg-[oklch(0.15_0.02_253/0.72)] px-5 py-4 transition-all duration-700 ease-out-expo [&.is-active]:border-primary/30 [&.is-active]:bg-[oklch(0.17_0.03_200/0.75)]"
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
        <SectionHead title="Como funciona: cinco passos, sem complicações." />
        <ol className="mt-16 grid gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="h-full">
              <div className={cn(rule, "h-full pt-5")}>
                <span className="display block text-6xl text-primary/80">{i + 1}</span>
                <h3 className="display mt-8 text-2xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
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
        <SectionHead title="Ferramentas que podem trabalhar em conjunto." />
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
              className="display flex items-center gap-8 whitespace-nowrap pr-8 text-5xl text-foreground/90 sm:text-7xl"
            >
              {t}
              <span className="size-2 rounded-full bg-primary/70" />
            </span>
          ))}
        </div>
      </Reveal>
      <div className={wrap}>
        <Reveal className="mt-16">
          <p className="display max-w-3xl text-3xl text-foreground/90 sm:text-4xl">
            Não vendemos ferramentas. Criamos soluções que ligam as ferramentas certas ao processo
            certo.
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
          title="Soluções simples e transparentes."
          sub="Preços iniciais para projetos standard. Cada solução pode ser adaptada à complexidade do negócio."
        />
        <div className="mt-16 grid items-stretch gap-x-10 gap-y-12 sm:mt-20 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className="h-full">
              <div
                data-spot
                className={cn(
                  "relative flex h-full flex-col",
                  p.featured
                    ? "panel !border-primary/40 !bg-[linear-gradient(180deg,oklch(0.87_0.13_178/0.1),oklch(0.16_0.02_253/0.9)_45%)] p-8 shadow-[0_30px_80px_-30px_oklch(0.87_0.13_178/0.35)]"
                    : cn(rule, "pt-8"),
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Mais completo
                  </span>
                )}
                <h3 className="display text-2xl">{p.name}</h3>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Desde</span>
                  <span className="display text-6xl leading-none">
                    {p.price.replace("Desde ", "")}
                  </span>
                </p>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Ideal para:</span> {p.ideal}
                </p>
                <ul className="mt-7 space-y-3 text-[15px]">
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
                      "inline-flex min-h-12 w-full items-center justify-center rounded-full text-[15px] font-medium transition-colors duration-300",
                      p.featured
                        ? "bg-primary text-primary-foreground hover:bg-[oklch(0.92_0.12_178)]"
                        : "border border-white/20 hover:border-foreground/60 hover:bg-white/[0.05]",
                    )}
                  >
                    Escolher
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16">
          {[
            ["Projetos personalizados", "Desde €399 / orçamento personalizado"],
            ["Manutenção e acompanhamento", "Desde €50/mês"],
          ].map(([t, v], i) => (
            <Reveal key={t} delay={i * 70}>
              <div
                className={cn(
                  rule,
                  "flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between",
                )}
              >
                <span className="display text-xl">{t}</span>
                <span className="text-muted-foreground">{v}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
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
          <SectionHead title="Tecnologia útil para o dia a dia das empresas." />
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
              Falar connosco
            </CtaLink>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <dl>
            {[
              ["Fundador", "Nuno Almeida"],
              ["Base", "Portugal"],
              ["Foco", "Automation + Data Analytics"],
            ].map(([k, v]) => (
              <div key={k} className={cn(rule, "py-6")}>
                <dt className="label">{k}</dt>
                <dd className="display mt-1.5 text-3xl">{v}</dd>
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
          <SectionHead title="Perguntas frequentes." />
          <Reveal delay={200}>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Não encontra a resposta?{" "}
              <a
                href="#contacto"
                className="py-3 text-primary underline underline-offset-4 hover:no-underline"
              >
                Fale connosco
              </a>
              .
            </p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="border-b border-white/[0.1]">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="border-white/[0.1]">
                <AccordionTrigger className="display gap-6 py-6 text-left text-xl hover:text-primary hover:no-underline sm:text-2xl">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">
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
          <SectionHead title="Tem um processo que poderia ser automático?" />
          <Reveal delay={150}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Conte-nos como a sua empresa trabalha atualmente. Podemos identificar onde a automação
              pode poupar tempo e simplificar o processo.
            </p>
          </Reveal>
          <Reveal delay={220} className="mt-10">
            {[
              { href: CONTACT.emailHref, Icon: Mail, label: "Email", value: CONTACT.email },
              { href: CONTACT.phoneHref, Icon: Phone, label: "Telefone", value: CONTACT.phone },
            ].map(({ href, Icon, label, value }) => (
              <a
                key={label}
                href={href}
                className={cn(
                  rule,
                  "group flex items-center gap-4 py-5 transition-colors hover:text-primary",
                )}
              >
                <Icon className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="label block">{label}</span>
                  <span className="mt-0.5 block break-all text-lg font-medium">{value}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
            <div className={rule} />
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
      <div className={wrap}>
        <SplitHeading
          tonal
          text={"Menos tarefas manuais.\n_Mais tempo para o seu negócio._"}
          className="max-w-5xl text-[2.9rem] sm:text-7xl lg:text-[6rem]"
        />
        <Reveal delay={250}>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">
            Descubra onde a automação pode simplificar o trabalho da sua empresa.
          </p>
        </Reveal>
        <Reveal
          delay={350}
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
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
