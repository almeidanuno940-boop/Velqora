import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Marca Velqora: um "V" cujo braço esquerdo são pontos dispersos (dados em bruto)
 * e cujo braço direito é uma linha contínua (dados ordenados).
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-r`}
          x1="24"
          y1="39"
          x2="40"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      <path
        d="M9 9 L24 39"
        stroke="#fbbf6b"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="0.01 8.6"
      />
      <path d="M24 39 L39 9" stroke={`url(#${id}-r)`} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a
      href="/#inicio"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
      aria-label="Velqora — início"
    >
      <LogoMark className="transition-transform duration-500 group-hover:-rotate-6" />
      <span className="font-display text-[1.7rem] leading-none tracking-tight text-foreground">
        Velqora
      </span>
    </a>
  );
}
