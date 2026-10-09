import { useEffect } from "react";

/** Liga o brilho dos cartões [data-spot] à posição do rato (um único listener). */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const on = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-spot]") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
}
