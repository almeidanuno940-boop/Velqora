import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CONTACT, NAV } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Saltar para o conteúdo
      </a>
      <div
        className={cn(
          "mx-auto flex h-[var(--header-h)] max-w-[88rem] items-center justify-between gap-4 px-4 transition-all duration-700 ease-out-expo sm:px-8",
          scrolled && !open && "sm:h-16",
        )}
      >
        <Logo className="relative z-10" />

        <nav
          aria-label="Principal"
          className={cn(
            "hidden items-center gap-0.5 rounded-full border p-1 transition-all duration-700 ease-out-expo xl:flex",
            scrolled
              ? "border-white/10 bg-[oklch(0.16_0.02_253/0.7)] shadow-[0_10px_40px_-15px_black] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          {NAV.map((n) => {
            const isActive = active === n.href.slice(1);
            return (
              <a
                key={n.href}
                href={`/${n.href}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300",
                  isActive
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </a>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <a
            href="/#contacto"
            className="hidden min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_oklch(0.87_0.13_178/0.6)] sm:inline-flex"
          >
            Pedir demonstração
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-[oklch(0.16_0.02_253/0.7)] backdrop-blur-xl transition-colors hover:border-primary/50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        hidden={!open}
        className="fixed inset-0 -z-10 overflow-y-auto bg-[oklch(0.12_0.016_255/0.97)] px-5 pb-10 pt-[calc(var(--header-h)+1.5rem)] backdrop-blur-2xl xl:hidden"
      >
        <nav className="flex flex-col" aria-label="Menu móvel">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={`/${n.href}`}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-white/[0.07] py-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both"
              style={{ animationDelay: `${i * 40}ms`, animationDuration: "600ms" }}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-4xl tracking-tight transition-colors group-hover:text-primary">
                {n.label}
              </span>
            </a>
          ))}
        </nav>
        <a
          href="/#contacto"
          onClick={() => setOpen(false)}
          className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground"
        >
          Pedir demonstração
        </a>
        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <a className="block hover:text-foreground" href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>
          <a className="block hover:text-foreground" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
