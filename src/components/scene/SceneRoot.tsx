import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { detectTier, detectWebGL, signalSceneReady, startSceneTracking, type Tier } from "./store";
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
      signalSceneReady();
    } else {
      setMode({ kind: "webgl", tier: detectTier(), reduced });
    }
    return stop;
  }, []);

  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      {mode.kind === "static" && <SceneFallback />}
      {mode.kind === "webgl" && (
        <SceneBoundary
          onError={() => {
            setMode({ kind: "static" });
            signalSceneReady();
          }}
        >
          <Suspense fallback={null}>
            <Experience tier={mode.tier} reduced={mode.reduced} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scene-veil" aria-hidden="true" />
    </>
  );
}
