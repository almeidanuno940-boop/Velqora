import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CONTACT, NAV } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[oklch(0.12_0.016_255/0.92)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs font-display text-3xl leading-tight tracking-tight">
            Automatize. Simplifique. <span className="text-gradient italic">Cresça.</span>
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Automation &amp; Data Solutions
          </p>
        </div>
        <nav aria-label="Rodapé">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Navegação
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={`/${n.href}`}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Contacto
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <a
              href={CONTACT.emailHref}
              className="group flex items-center gap-2.5 break-all text-foreground/90 transition-colors hover:text-primary"
            >
              <Mail className="size-4 shrink-0 text-primary" /> {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="group flex items-center gap-2.5 text-foreground/90 transition-colors hover:text-primary"
            >
              <Phone className="size-4 shrink-0 text-primary" /> {CONTACT.phone}
            </a>
            <a
              href="/#contacto"
              className="inline-flex items-center gap-1 pt-2 text-primary hover:underline hover:underline-offset-4"
            >
              Pedir demonstração <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Velqora. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="/privacidade" className="transition-colors hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="transition-colors hover:text-foreground">
              Termos e Condições
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
