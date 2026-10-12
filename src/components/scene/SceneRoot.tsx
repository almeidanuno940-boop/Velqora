import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { detectTier, detectWebGL, startSceneTracking, type Tier } from "./store";
import { SceneFallback } from "./SceneFallback";

// A cena só corre no browser. No build SSR o ramo do import é eliminado (import.meta.env.SSR é
// constante), para o three.js não entrar na função do servidor: no runtime de funções do Netlify o
// `three` é carregado por require() e a função rebentava com 500 em todas as páginas.
const NoScene: ComponentType<{ tier: Tier; reduced: boolean }> = () => null;
const Experience = lazy(() =>
  import.meta.env.SSR ? Promise.resolve({ default: NoScene }) : import("./Experience"),
);

/** Instante mínimo (ms desde o início da navegação) para arrancar a cena: a intro do hero acaba por volta dos 2,5 s. */
const SCENE_MIN_START_MS = 2600;

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
    // Poupança de dados ou ligação 2G: não descarregar ~1 MB de three.js só para o fundo.
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    const lean = !!conn?.saveData || /^(slow-2g|2g)$/.test(conn?.effectiveType ?? "");
    if (params.get("scene") === "off" || !gl.ok || (gl.software && !force) || (lean && !force)) {
      setMode({ kind: "static" });
      return stop;
    }
    // a cena só arranca depois do "load", depois de a animação de entrada do hero terminar e com o
    // browser livre: assim não compete com a hidratação nem com o primeiro título pintado
    let idle = 0;
    let timer = 0;
    const start = () => setMode({ kind: "webgl", tier: detectTier(), reduced });
    const whenIdle = () => {
      // Safari ainda não tem requestIdleCallback
      const ric = (window as Partial<Window>).requestIdleCallback?.bind(window);
      if (ric) idle = ric(start, { timeout: 1500 });
      else timer = window.setTimeout(start, 200);
    };
    const afterIntro = () => {
      timer = window.setTimeout(whenIdle, Math.max(0, SCENE_MIN_START_MS - performance.now()));
    };
    if (document.readyState === "complete") afterIntro();
    else window.addEventListener("load", afterIntro, { once: true });
    return () => {
      stop();
      window.removeEventListener("load", afterIntro);
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
