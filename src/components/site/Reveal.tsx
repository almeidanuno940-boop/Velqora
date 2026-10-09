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

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    return el ? observe(el) : undefined;
  }, []);
  return ref;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useReveal<HTMLDivElement>();
  // o JSX global do R3F torna ElementType demasiado largo; a tag é sempre um elemento de bloco
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/**
 * Título com entrada palavra-a-palavra. Texto entre _sublinhados_ fica em itálico
 * com o gradiente da marca. O texto completo fica disponível para leitores de ecrã.
 */
export function SplitHeading({
  text,
  as = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const ref = useReveal<HTMLHeadingElement>();
  const Tag = as as "h2";
  let w = 0;
  const parts = text.split("_");
  return (
    <Tag
      ref={ref}
      className={cn("split headline", className)}
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
                        className={cn(i % 2 === 1 && "text-gradient pr-[0.08em] italic")}
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
  index,
  eyebrow,
  title,
  sub,
  center,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <Reveal>
        <p className="eyebrow">
          {index && <span className="text-muted-foreground">{index}</span>}
          {eyebrow}
        </p>
      </Reveal>
      <SplitHeading
        text={title}
        className="mt-5 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]"
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
    primary:
      "bg-primary text-primary-foreground shadow-[0_0_0_1px_oklch(1_0_0/0.1)_inset,0_10px_40px_-10px_oklch(0.87_0.13_178/0.55)] hover:shadow-[0_0_0_1px_oklch(1_0_0/0.2)_inset,0_14px_50px_-8px_oklch(0.87_0.13_178/0.75)] hover:-translate-y-0.5",
    ghost:
      "border border-white/15 bg-white/[0.03] text-foreground backdrop-blur-sm hover:border-primary/50 hover:bg-primary/[0.06] hover:text-primary",
    light: "bg-foreground text-background hover:-translate-y-0.5 hover:bg-white",
  }[variant];
  return (
    <a
      href={href}
      className={cn(
        "group/cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-500 ease-out-expo",
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
