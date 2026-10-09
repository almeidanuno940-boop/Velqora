import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { CONTACT, NAV } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  const links = NAV.filter((n) => n.label !== "Como funciona");
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">Automatize. Simplifique. Cresça.</p>
          <p className="mt-1 text-xs text-muted-foreground">Automation &amp; Data Solutions</p>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-2 text-sm">
          {links.map((n) => (
            <a
              key={n.href}
              href={`/${n.href}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="space-y-3 text-sm">
          <a
            href={CONTACT.emailHref}
            className="flex items-center gap-2 text-foreground hover:text-primary"
          >
            <Mail className="size-4 text-primary" /> {CONTACT.email}
          </a>
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 text-foreground hover:text-primary"
          >
            <Phone className="size-4 text-primary" /> {CONTACT.phone}
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Velqora. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link to="/privacidade" className="hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="hover:text-foreground">
              Termos e Condições
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
