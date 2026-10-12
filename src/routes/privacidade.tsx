import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalValue, Pending, Section } from "@/components/site/LegalPage";
import { LEGAL } from "@/content/legal";
import { CONTACT, SITE_URL } from "@/content/site";

const link = "text-primary underline underline-offset-4";

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
      { property: "og:url", content: `${SITE_URL}/privacidade` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacidade` }],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade">
      <p>Última atualização: {LEGAL.lastUpdated}.</p>

      <Section title="1. Responsável pelo tratamento">
        <p>
          Velqora — Automation &amp; Data Solutions (
          <LegalValue field="legalName" label="denominação legal" />, NIF{" "}
          <LegalValue field="nif" label="NIF" />
          ), com morada em <LegalValue field="address" label="morada" />.
        </p>
        <p>
          Contacto para questões de privacidade:{" "}
          <a className={link} href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>{" "}
          ou{" "}
          <a className={link} href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Que dados recolhemos">
        <p>
          Apenas os que indica no formulário de contacto: nome, empresa (opcional), email, telefone
          (opcional), serviço pretendido e mensagem. Guardamos também a confirmação de que aceitou
          esta política e a data e hora do pedido. O preenchimento é voluntário, mas sem os campos
          obrigatórios não conseguimos responder ao pedido.
        </p>
      </Section>

      <Section title="3. Para que usamos os dados e com que fundamento">
        <p>
          Usamos estes dados exclusivamente para responder ao seu pedido de contacto ou de
          demonstração. O fundamento é o seu consentimento (artigo 6.º, n.º 1, alínea a) do RGPD),
          que dá ao marcar a caixa do formulário e que pode retirar a qualquer momento, sem afetar a
          licitude do tratamento feito até lá.
        </p>
      </Section>

      <Section title="4. Quem recebe os dados">
        <p>
          O pedido é tratado no alojamento do website (Netlify) e reencaminhado para a plataforma de
          automação Make, que nos notifica e organiza os contactos. Estes prestadores atuam como
          subcontratantes, por nossa conta. Não vendemos nem cedemos os seus dados a terceiros para
          marketing.
        </p>
        <p>
          <Pending>
            confirmar outras ferramentas que recebam os dados no cenário do Make (por exemplo,
            Google Gmail/Sheets ou OpenAI) e acrescentá-las aqui
          </Pending>
        </p>
      </Section>

      <Section title="5. Transferências para fora do Espaço Económico Europeu">
        <p>
          Alguns prestadores de serviços podem tratar dados fora do Espaço Económico Europeu (por
          exemplo, nos Estados Unidos). Nesses casos, a transferência só ocorre com as garantias
          previstas no RGPD, como uma decisão de adequação da Comissão Europeia ou cláusulas
          contratuais-tipo.
        </p>
        <p>
          <Pending>confirmar a localização e as garantias de cada prestador</Pending>
        </p>
      </Section>

      <Section title="6. Durante quanto tempo guardamos os dados">
        <p>
          Os dados são conservados durante:{" "}
          <LegalValue field="dataRetention" label="prazo de conservação" />. Findo esse prazo, são
          apagados, salvo se outra obrigação legal exigir a sua conservação.
        </p>
      </Section>

      <Section title="7. Decisões automatizadas">
        <p>
          <Pending>
            indicar se os pedidos são analisados ou classificados por ferramentas automáticas ou de
            inteligência artificial e, se sim, confirmar que isso não produz decisões com efeitos
            jurídicos ou igualmente significativos para o titular
          </Pending>
        </p>
      </Section>

      <Section title="8. Os seus direitos">
        <p>
          Pode pedir o acesso, a retificação ou o apagamento dos seus dados, a limitação ou a
          oposição ao tratamento, a portabilidade, e retirar o consentimento em qualquer momento,
          escrevendo para{" "}
          <a className={link} href={CONTACT.emailHref}>
            {CONTACT.email}
          </a>
          . Respondemos no prazo de um mês. Tem também o direito de apresentar reclamação à Comissão
          Nacional de Proteção de Dados (
          <a className={link} href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
            cnpd.pt
          </a>
          ).
        </p>
      </Section>

      <Section title="9. Cookies e armazenamento no browser">
        <p>
          Este website não usa cookies, nem ferramentas de análise ou de publicidade. Para limitar
          envios repetidos do formulário, guarda temporariamente no seu browser (armazenamento de
          sessão) o número de pedidos enviados e, para repor a posição de leitura ao navegar, a
          posição da página. Ambos desaparecem ao fechar o separador. Os tipos de letra são servidos
          pelo próprio website, sem pedidos a serviços externos.
        </p>
      </Section>

      <Section title="10. Proteção contra abuso">
        <p>
          Para travar o envio automático de spam, o nosso servidor conta temporariamente, em
          memória, os pedidos recebidos por endereço IP, sem guardar esse endereço nem o associar ao
          seu pedido. A plataforma de alojamento aplica também um limite de pedidos por endereço IP.
        </p>
      </Section>

      <Section title="11. Alterações a esta política">
        <p>
          Esta política pode ser atualizada. A data da última atualização está indicada no topo da
          página.
        </p>
      </Section>
    </LegalPage>
  ),
});
