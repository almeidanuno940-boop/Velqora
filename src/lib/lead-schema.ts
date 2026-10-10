import { z } from "zod";
import { SERVICE_OPTIONS } from "../content/site";

/**
 * Esquema único do pedido de contacto, partilhado entre o formulário (browser) e a
 * Netlify Function (servidor). Imports relativos de propósito: a function é empacotada
 * à parte e não conhece o alias "@/".
 */

export const LIMITS = {
  nome: 100,
  empresa: 120,
  email: 255,
  telefone: 30,
  mensagem: 2000,
} as const;

/** Nome do campo-armadilha (honeypot). Um humano nunca o vê nem o preenche. */
export const HONEYPOT_FIELD = "website";

/**
 * Telefone: português (9 dígitos a começar por 2 ou 9, com ou sem +351/00351)
 * ou internacional (+ seguido de 8 a 15 dígitos). Espaços, pontos, hífenes e parênteses
 * são ignorados; "+++" ou "---" não passam.
 */
export function isValidPhone(value: string): boolean {
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (!/^(\+|00)?\d+$/.test(compact)) return false;
  const n = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
  if (n.startsWith("+351")) return /^\+351[29]\d{8}$/.test(n);
  if (n.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(n);
  return /^[29]\d{8}$/.test(n);
}

export const leadSchema = z.object({
  nome: z
    .string({ required_error: "Indique o seu nome.", invalid_type_error: "Indique o seu nome." })
    .trim()
    .min(2, "Indique o seu nome.")
    .max(LIMITS.nome, `O nome não pode ter mais de ${LIMITS.nome} caracteres.`),
  empresa: z
    .string({ invalid_type_error: "Nome de empresa inválido." })
    .trim()
    .max(LIMITS.empresa, `A empresa não pode ter mais de ${LIMITS.empresa} caracteres.`)
    .optional(),
  email: z
    .string({ required_error: "Indique o seu email.", invalid_type_error: "Indique o seu email." })
    .trim()
    .min(1, "Indique o seu email.")
    .max(LIMITS.email, `O email não pode ter mais de ${LIMITS.email} caracteres.`)
    .email("Indique um email válido."),
  telefone: z
    .string({ invalid_type_error: "Indique um telefone válido." })
    .trim()
    .max(LIMITS.telefone, `O telefone não pode ter mais de ${LIMITS.telefone} caracteres.`)
    .refine(
      (v) => v === "" || isValidPhone(v),
      "Indique um telefone válido (ex.: 912 345 678 ou +351 912 345 678).",
    )
    .optional(),
  servico: z
    .string({ required_error: "Escolha um serviço.", invalid_type_error: "Escolha um serviço." })
    .min(1, "Escolha um serviço.")
    .refine((v) => SERVICE_OPTIONS.includes(v), "Escolha um serviço da lista."),
  mensagem: z
    .string({
      required_error: "Descreva brevemente o seu pedido.",
      invalid_type_error: "Descreva brevemente o seu pedido.",
    })
    .trim()
    .min(10, "Descreva brevemente o seu pedido (mín. 10 caracteres).")
    .max(LIMITS.mensagem, `A mensagem não pode ter mais de ${LIMITS.mensagem} caracteres.`),
  consentimento: z
    .boolean({
      required_error: "Tem de aceitar a Política de Privacidade para enviar o pedido.",
      invalid_type_error: "Tem de aceitar a Política de Privacidade para enviar o pedido.",
    })
    .refine((v) => v === true, "Tem de aceitar a Política de Privacidade para enviar o pedido."),
  [HONEYPOT_FIELD]: z.string().max(500).optional(),
});

export type Lead = z.infer<typeof leadSchema>;

/**
 * Sanitização feita no servidor antes de validar: remove caracteres de controlo e
 * etiquetas HTML, normaliza quebras de linha e espaços. Campos desconhecidos são ignorados.
 */
// Caracteres de controlo, zero-width e separadores de linha/parágrafo, escritos como texto.
const CONTROL_CHARS =
  "\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F\\u200B-\\u200F\\u2028\\u2029\\uFEFF";

export function sanitizeText(value: unknown, multiline = false): unknown {
  if (typeof value !== "string") return value;
  let s = value.normalize("NFC").replace(/\r\n?/g, "\n");
  s = s.replace(new RegExp(`[${CONTROL_CHARS}]`, "g"), "");
  s = s.replace(/<[^>]*>/g, "");
  s = multiline ? s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  return s.trim();
}

export function sanitizeLeadInput(raw: unknown): Record<string, unknown> {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    nome: sanitizeText(o["nome"]),
    empresa: sanitizeText(o["empresa"]),
    email: sanitizeText(o["email"]),
    telefone: sanitizeText(o["telefone"]),
    servico: sanitizeText(o["servico"]),
    mensagem: sanitizeText(o["mensagem"], true),
    consentimento: o["consentimento"],
    [HONEYPOT_FIELD]: o[HONEYPOT_FIELD],
  };
}
