import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { leadSchema, submitLead, type Lead } from "@/lib/lead";
import { CONTACT, SERVICE_OPTIONS } from "@/content/site";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base sm:text-sm transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "unconfigured">("idle");
  const [fallbackHref, setFallbackHref] = useState(CONTACT.emailHref);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Lead>({ resolver: zodResolver(leadSchema), defaultValues: { servico: "" } });

  const onSubmit = async (data: Lead) => {
    setStatus("idle");
    if (!import.meta.env["VITE_MAKE_WEBHOOK_URL"]) {
      const body = [
        `Nome: ${data.nome}`,
        `Empresa: ${data.empresa || "—"}`,
        `Email: ${data.email}`,
        `Telefone: ${data.telefone || "—"}`,
        `Serviço pretendido: ${data.servico}`,
        "",
        data.mensagem,
      ].join("\n");
      setFallbackHref(
        `${CONTACT.emailHref}?subject=${encodeURIComponent("Pedido de demonstração Velqora")}&body=${encodeURIComponent(body)}`,
      );
      setStatus("unconfigured");
      return;
    }
    try {
      await submitLead(data);
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-soft"
      >
        <CheckCircle2 className="size-12 text-primary" />
        <p className="mt-4 text-lg font-medium">
          Obrigado. O seu pedido foi recebido. Entraremos em contacto brevemente.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-primary underline-offset-4 hover:underline"
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
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {children} {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}
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
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <L htmlFor="nome">Nome</L>
          <input
            id="nome"
            autoComplete="name"
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
            className={field}
            {...register("empresa")}
          />
        </div>
        <div>
          <L htmlFor="email">Email</L>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
            autoComplete="tel"
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
          <option value="" disabled>
            Selecione uma opção
          </option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
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
          placeholder="Como funciona hoje o processo que gostaria de automatizar?"
          className={cn(field, "resize-y", errors.mensagem && "border-destructive")}
          {...aria("mensagem")}
          {...register("mensagem")}
        />
        <Err name="mensagem" />
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Não foi possível enviar o pedido. Tente novamente ou contacte-me por email ou telefone.
        </p>
      )}
      {status === "unconfigured" && (
        <p role="status" className="rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
          O formulário ainda não está ligado a um serviço de envio. Os dados introduzidos não foram
          enviados.{" "}
          <a className="font-semibold underline" href={fallbackHref}>
            Abrir email com o pedido preenchido
          </a>{" "}
          ou contacte-nos por telefone.
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "A enviar…" : "Pedir uma demonstração"}
      </button>
    </form>
  );
}
