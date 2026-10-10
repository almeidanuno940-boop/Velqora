import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { CONTACT } from "@/content/site";

const link = "text-primary underline underline-offset-4";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** Informação que só o responsável pelo site pode fornecer. Fica visível até ser preenchida. */
function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-ember/15 px-1.5 py-0.5 text-base text-foreground/90">
      [{children}]
    </span>
  );
}

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Velqora" },
      {
        name: "description",
        content: "Política de Privacidade do website Velqora — Automation & Data Solutions.",
      },
      { property: "og:title", content: "Política de Privacidade | Velqora" },
      {
        property: "og:description",
        content: "Como são tratados os dados enviados através deste website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade">
      <p>Última atualização: 10 de outubro de 2026.</p>

      <Section title="1. Responsável pelo tratamento">
        <p>
          Velqora — Automation &amp; Data Solutions. Contacto:{" "}
          <a className={link} href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>{" "}
          ou{" "}
          <a className={link} href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
          .
        </p>
        <p>
          <Pending>denominação legal, NIF e morada a indicar</Pending>
        </p>
      </Section>

      <Section title="2. Que dados recolhemos">
        <p>
          Apenas os que indica no formulário de contacto: nome, empresa (opcional), email, telefone
          (opcional), serviço pretendido e mensagem. Guardamos também a confirmação de que aceitou
          esta política e a data e hora do pedido.
        </p>
      </Section>

      <Section title="3. Para que usamos os dados e com que fundamento">
        <p>
          Usamos estes dados exclusivamente para responder ao seu pedido de contacto ou de
          demonstração. O fundamento é o seu consentimento (artigo 6.º, n.º 1, alínea a) do RGPD),
          que dá ao marcar a caixa do formulário e que pode retirar a qualquer momento.
        </p>
      </Section>

      <Section title="4. Quem recebe os dados">
        <p>
          O pedido é tratado no alojamento do website (Netlify) e reencaminhado para a plataforma de
          automação Make, que nos notifica e organiza os contactos. Estes prestadores atuam como
          subcontratantes. Não vendemos nem cedemos os seus dados a terceiros para marketing.
        </p>
      </Section>

      <Section title="5. Durante quanto tempo guardamos os dados">
        <p>
          <Pending>prazo de conservação a indicar</Pending>
        </p>
      </Section>

      <Section title="6. Os seus direitos">
        <p>
          Pode pedir o acesso, a retificação ou o apagamento dos seus dados, a limitação ou a
          oposição ao tratamento, a portabilidade, e retirar o consentimento em qualquer momento,
          escrevendo para{" "}
          <a className={link} href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>
          . Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (
          <a className={link} href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
            cnpd.pt
          </a>
          ).
        </p>
      </Section>

      <Section title="7. Cookies e armazenamento no browser">
        <p>
          Este website não usa cookies, nem ferramentas de análise ou de publicidade. Para limitar
          envios repetidos do formulário, guarda temporariamente no seu browser (armazenamento de
          sessão) o número de pedidos enviados, que desaparece ao fechar o separador. Os tipos de
          letra são servidos pelo próprio website, sem pedidos a serviços externos.
        </p>
      </Section>

      <Section title="8. Proteção contra abuso">
        <p>
          Para travar o envio automático de spam, o nosso servidor conta temporariamente, em
          memória, os pedidos recebidos por endereço IP, sem guardar esse endereço nem o associar ao
          seu pedido.
        </p>
      </Section>
    </LegalPage>
  ),
});
