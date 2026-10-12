/**
 * Dados legais do responsável pelo site. PREENCHER AQUI (e só aqui): as páginas /privacidade e
 * /termos leem estes valores. Enquanto um campo estiver vazio, a página mostra-o como pendente e o
 * aviso "Texto a rever" mantém-se; quando todos estiverem preenchidos, o aviso desaparece.
 *
 * Mantenha cada campo numa linha no formato  chave: "valor",  (o script scripts/check-legal.mjs lê-os
 * e avisa no build se ainda houver campos vazios; com STRICT_LEGAL=1 o build falha).
 *
 * Não invente valores: use só dados reais e confirme o texto final com quem o possa rever (RGPD).
 */
export const LEGAL = {
  /** Denominação legal do responsável pelo tratamento (ex.: nome completo ou firma). */
  legalName: "",
  /** NIF/NIPC. */
  nif: "",
  /** Morada completa (sede ou morada fiscal). */
  address: "",
  /** Prazo de conservação dos pedidos de contacto (ex.: "12 meses após o último contacto"). */
  dataRetention: "",
  /** Data da última revisão da Política de Privacidade. */
  lastUpdated: "10 de outubro de 2026",
};

export type LegalField = "legalName" | "nif" | "address" | "dataRetention";

/** Campos obrigatórios por preencher. */
export function missingLegalFields(): LegalField[] {
  const required: LegalField[] = ["legalName", "nif", "address", "dataRetention"];
  return required.filter((k) => LEGAL[k].trim() === "");
}

export const legalIsComplete = () => missingLegalFields().length === 0;
