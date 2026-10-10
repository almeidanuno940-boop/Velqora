import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { buildMailto, HONEYPOT_FIELD, leadSchema, LIMITS, submitLead, type Lead } from "@/lib/lead";
import { CONTACT, SERVICE_OPTIONS } from "@/content/site";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-input bg-[oklch(0.12_0.016_255/0.8)] px-4 py-3 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-white/25 focus:border-primary/70 focus:outline-none focus:ring-4 focus:ring-primary/15 sm:text-sm";

type Status = { kind: "idle" } | { kind: "ok" } | { kind: "error"; message: string };

const FIELDS = [
  "nome",
  "empresa",
  "email",
  "telefone",
  "servico",
  "mensagem",
  "consentimento",
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inFlight = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: { servico: "", consentimento: false, [HONEYPOT_FIELD]: "" },
  });
  const mensagemLen = (watch("mensagem") ?? "").length;

  const onSubmit = async (data: Lead) => {
    if (inFlight.current) return; // trava o duplo envio antes de o React voltar a renderizar
    inFlight.current = true;
    setStatus({ kind: "idle" });
    try {
      // Honeypot: um humano nunca o preenche. Um bot recebe um "sucesso" falso e nada é enviado.
      if (data[HONEYPOT_FIELD]) {
        setStatus({ kind: "ok" });
        reset();
        return;
      }
      const result = await submitLead(data);
      if (result.ok) {
        setStatus({ kind: "ok" });
        reset();
        return;
      }
      if (result.kind === "validation" && result.fields) {
        let first: keyof Lead | null = null;
        for (const [name, message] of Object.entries(result.fields)) {
          if ((FIELDS as readonly string[]).includes(name)) {
            setError(name as keyof Lead, { type: "server", message });
            first ??= name as keyof Lead;
          }
        }
        if (first) setFocus(first);
      }
      setStatus({ kind: "error", message: result.message });
    } catch (err) {
      // submitLead não lança, mas qualquer falha inesperada nunca pode deixar o botão preso.
      console.error("[lead] erro inesperado no formulário", { type: (err as Error)?.name });
      setStatus({ kind: "error", message: "Não foi possível enviar o pedido neste momento." });
    } finally {
      inFlight.current = false;
    }
  };

  if (status.kind === "ok") {
    return (
      <div role="status" className="panel flex flex-col items-center p-10 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="mt-4 text-lg font-medium">
          Obrigado. O seu pedido foi recebido. Entraremos em contacto brevemente.
        </p>
        <button
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 min-h-11 px-3 text-sm text-primary underline-offset-4 hover:underline"
        >
          Enviar outro pedido
        </button>
      </div>
    );
  }

  const Err = ({ name }: { name: keyof Lead }) =>
    errors[name] ? (
      <p id={`${name}-err`} className="mt-1.5 text-xs text-destructive">
        {errors[name]?.message as string}
      </p>
    ) : null;

  const L = ({
    htmlFor,
    children,
    optional,
  }: {
    htmlFor: string;
    children: string;
    optional?: boolean;
  }) => (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/85"
    >
      {children}{" "}
      {optional && (
        <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
      )}
    </label>
  );

  const aria = (n: keyof Lead) => ({
    "aria-invalid": !!errors[n],
    "aria-describedby": errors[n] ? `${n}-err` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="panel relative space-y-5 p-6 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <L htmlFor="nome">Nome</L>
          <input
            id="nome"
            autoComplete="name"
            maxLength={LIMITS.nome}
            className={cn(field, errors.nome && "border-destructive")}
            {...aria("nome")}
            {...register("nome")}
          />
          <Err name="nome" />
        </div>
        <div>
          <L htmlFor="empresa" optional>
            Empresa
          </L>
          <input
            id="empresa"
            autoComplete="organization"
            maxLength={LIMITS.empresa}
            className={cn(field, errors.empresa && "border-destructive")}
            {...aria("empresa")}
            {...register("empresa")}
          />
          <Err name="empresa" />
        </div>
        <div>
          <L htmlFor="email">Email</L>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            className={cn(field, errors.email && "border-destructive")}
            {...aria("email")}
            {...register("email")}
          />
          <Err name="email" />
        </div>
        <div>
          <L htmlFor="telefone" optional>
            Telefone
          </L>
          <input
            id="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.telefone}
            className={cn(field, errors.telefone && "border-destructive")}
            {...aria("telefone")}
            {...register("telefone")}
          />
          <Err name="telefone" />
        </div>
      </div>
      <div>
        <L htmlFor="servico">Serviço pretendido</L>
        <select
          id="servico"
          className={cn(field, errors.servico && "border-destructive")}
          {...aria("servico")}
          {...register("servico")}
        >
          <option value="" disabled className="bg-popover">
            Selecione uma opção
          </option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-popover">
              {s}
            </option>
          ))}
        </select>
        <Err name="servico" />
      </div>
      <div>
        <L htmlFor="mensagem">Mensagem</L>
        <textarea
          id="mensagem"
          rows={5}
          maxLength={LIMITS.mensagem}
          placeholder="Como funciona hoje o processo que gostaria de automatizar?"
          className={cn(field, "resize-y", errors.mensagem && "border-destructive")}
          {...aria("mensagem")}
          {...register("mensagem")}
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Err name="mensagem" />
          </div>
          <p
            className={cn(
              "shrink-0 text-xs tabular-nums",
              mensagemLen >= LIMITS.mensagem ? "text-destructive" : "text-muted-foreground",
            )}
            aria-hidden="true"
          >
            {mensagemLen}/{LIMITS.mensagem}
          </p>
        </div>
      </div>

      {/* Honeypot: fora do ecrã (não display:none), escondido de leitores de ecrã e do teclado. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor={HONEYPOT_FIELD}>Não preencha este campo</label>
        <input
          id={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register(HONEYPOT_FIELD)}
        />
      </div>

      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground/85">
          <input
            id="consentimento"
            type="checkbox"
            className="size-6 shrink-0 cursor-pointer accent-[oklch(0.87_0.13_178)]"
            {...aria("consentimento")}
            {...register("consentimento")}
          />
          <span>
            Li e aceito a{" "}
            <Link
              to="/privacidade"
              target="_blank"
              rel="noopener"
              className="font-medium text-primary underline underline-offset-4"
            >
              Política de Privacidade
            </Link>{" "}
            e autorizo o tratamento dos dados indicados para responder a este pedido.
          </span>
        </label>
        <Err name="consentimento" />
      </div>

      {status.kind === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {status.message} Tente novamente ou contacte-nos por email ou telefone.{" "}
          <a className="font-semibold underline underline-offset-4" href={buildMailto(getValues())}>
            Enviar por email com o pedido preenchido
          </a>
          {" · "}
          <a className="font-semibold underline underline-offset-4" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-500 ease-out-expo hover:shadow-[0_12px_40px_-10px_oklch(0.87_0.13_178/0.7)] disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "A enviar…" : "Pedir uma demonstração"}
      </button>
    </form>
  );
}
