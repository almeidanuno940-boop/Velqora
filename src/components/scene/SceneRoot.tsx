import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { detectTier, detectWebGL, startSceneTracking, type Tier } from "./store";
import { SceneFallback } from "./SceneFallback";

const Experience = lazy(() => import("./Experience"));

type Mode =
  { kind: "pending" } | { kind: "static" } | { kind: "webgl"; tier: Tier; reduced: boolean };

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.warn("[Velqora] Cena 3D desativada:", error);
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Decide como mostrar o fundo: cena WebGL (carregada de forma lazy depois da hidratação)
 * ou um fundo estático quando não há WebGL / o GPU é emulado / a cena falha.
 * O conteúdo da página nunca depende da cena.
 */
export function SceneRoot() {
  const [mode, setMode] = useState<Mode>({ kind: "pending" });

  useEffect(() => {
    const stop = startSceneTracking();
    const params = new URLSearchParams(window.location.search);
    const gl = detectWebGL();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const force = params.get("scene") === "force";
    if (params.get("scene") === "off" || !gl.ok || (gl.software && !force)) {
      setMode({ kind: "static" });
      return stop;
    }
    // a cena só arranca depois do "load" e com o browser livre: não compete com o conteúdo
    let idle = 0;
    let timer = 0;
    const start = () => setMode({ kind: "webgl", tier: detectTier(), reduced });
    const whenIdle = () => {
      // Safari ainda não tem requestIdleCallback
      const ric = (window as Partial<Window>).requestIdleCallback?.bind(window);
      if (ric) idle = ric(start, { timeout: 1500 });
      else timer = window.setTimeout(start, 200);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      stop();
      window.removeEventListener("load", whenIdle);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      {mode.kind === "static" && <SceneFallback />}
      {mode.kind === "webgl" && (
        <SceneBoundary onError={() => setMode({ kind: "static" })}>
          <Suspense fallback={null}>
            <Experience tier={mode.tier} reduced={mode.reduced} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scene-veil" aria-hidden="true" />
    </>
  );
}
