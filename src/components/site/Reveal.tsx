import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Um único IntersectionObserver partilhado por todos os reveals. */
let sharedObserver: IntersectionObserver | null = null;
function observe(el: Element) {
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add("is-visible");
    return () => {};
  }
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          sharedObserver?.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  sharedObserver.observe(el);
  return () => sharedObserver?.unobserve(el);
}

/** `intro`: entrada por CSS no carregamento (hero), sem esperar pelo JS. */
function useReveal<T extends HTMLElement>(intro = false) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    return el && !intro ? observe(el) : undefined;
  }, [intro]);
  return ref;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  intro,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
  intro?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>(intro);
  // o JSX global do R3F torna ElementType demasiado largo; a tag é sempre um elemento de bloco
  const Tag = as as "div";
  const style = (
    intro ? { "--delay": `${delay}ms` } : { transitionDelay: `${delay}ms` }
  ) as CSSProperties;
  return (
    <Tag ref={ref} className={cn("reveal", intro && "intro", className)} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Título com entrada palavra-a-palavra. Com `tonal`, o texto fora dos _sublinhados_ fica
 * esbatido e o resto em destaque (problema → solução). Sem `tonal`, os sublinhados são ignorados.
 * O texto completo fica disponível para leitores de ecrã.
 */
export function SplitHeading({
  text,
  as = "h2",
  className,
  delay = 0,
  intro,
  tonal,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  intro?: boolean;
  tonal?: boolean;
}) {
  const ref = useReveal<HTMLHeadingElement>(intro);
  const Tag = as as "h2";
  let w = 0;
  const parts = text.split("_");
  return (
    <Tag
      ref={ref}
      className={cn("split headline", intro && "intro", className)}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      aria-label={text.replaceAll("_", "")}
    >
      {parts.map((part, i) =>
        part
          .split(/(\n)/)
          .filter(Boolean)
          .map((chunk, k) =>
            chunk === "\n" ? (
              <br key={`${i}-${k}`} />
            ) : (
              chunk
                .split(" ")
                .filter(Boolean)
                .map((word, j) => (
                  <span key={`${i}-${k}-${j}`} aria-hidden="true">
                    <span className="split-word">
                      <span
                        style={{ "--w": w++ } as CSSProperties}
                        className={cn(tonal && i % 2 === 0 && "text-muted-foreground")}
                      >
                        {word}
                      </span>
                    </span>{" "}
                  </span>
                ))
            ),
          ),
      )}
    </Tag>
  );
}

export function SectionHead({
  title,
  sub,
  center,
  className,
}: {
  title: string;
  sub?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <SplitHeading
        text={title}
        className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem]"
        delay={80}
      />
      {sub && (
        <Reveal delay={200}>
          <p
            className={cn(
              "mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground",
              center && "mx-auto",
            )}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
  arrow,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light";
  className?: string;
  arrow?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-[oklch(0.92_0.12_178)]",
    ghost:
      "border border-white/20 text-foreground hover:border-foreground/60 hover:bg-white/[0.05]",
    light: "bg-foreground text-background hover:-translate-y-0.5 hover:bg-white",
  }[variant];
  return (
    <a
      href={href}
      className={cn(
        "group/cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium tracking-tight transition-all duration-500 ease-out-expo",
        styles,
        className,
      )}
    >
      {children}
      {arrow && (
        <span className="relative -mr-1 inline-flex size-4 overflow-hidden" aria-hidden="true">
          <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-5" />
          <ArrowRight className="absolute size-4 -translate-x-5 transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-0" />
        </span>
      )}
    </a>
  );
}
