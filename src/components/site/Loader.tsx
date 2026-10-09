/**
 * Ecrã de carregamento: só aparece com JS ativo e é 100% CSS (tempo fixo, ver `--intro-at`).
 * Não espera pela cena 3D — esta entra depois com fade — nem bloqueia o conteúdo em
 * dispositivos lentos.
 */
export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 48 48" className="loader-mark size-16" fill="none">
          <defs>
            <linearGradient
              id="loader-r"
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
            className="loader-dots"
            d="M9 9 L24 39"
            stroke="#fbbf6b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="0.01 8.6"
          />
          <path
            className="loader-line"
            d="M24 39 L39 9"
            stroke="url(#loader-r)"
            strokeWidth="4.5"
            strokeLinecap="round"
            pathLength={1}
          />
        </svg>
        <p className="loader-word mt-6 font-display text-4xl tracking-tight">Velqora</p>
        <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
          <div className="loader-bar h-full w-full bg-gradient-to-r from-ember via-primary to-sky" />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Do caos à clareza
        </p>
      </div>
    </div>
  );
}
