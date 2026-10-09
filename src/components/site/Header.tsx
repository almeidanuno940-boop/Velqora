import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href.startsWith("#") ? `/${n.href}` : n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="/#contacto"
          className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
        >
          Pedir demonstração
        </a>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-border bg-card lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background px-5 pb-10 pt-4 lg:hidden">
          <nav className="flex flex-col" aria-label="Menu móvel">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href.startsWith("#") ? `/${n.href}` : n.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg font-medium"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="/#contacto"
            onClick={() => setOpen(false)}
            className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground"
          >
            Pedir demonstração
          </a>
        </div>
      )}
    </header>
  );
}
