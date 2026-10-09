/**
 * Estado partilhado entre o DOM e a cena 3D, sem re-renders do React.
 *
 * `target` é a posição contínua do scroll em "momentos" da cena:
 * 0 = secção [data-scene] #0 centrada no ecrã, 1 = secção #1 centrada, etc.
 */
export const sceneState = {
  target: 0,
  count: 1,
  names: [] as string[],
  pointerX: 0,
  pointerY: 0,
};

export type Tier = "high" | "low";

let centers: number[] = [];

function computeTarget() {
  const n = centers.length;
  if (n < 2) {
    sceneState.target = 0;
    return;
  }
  const v = window.scrollY + window.innerHeight / 2;
  if (v <= centers[0]!) {
    sceneState.target = 0;
    return;
  }
  for (let i = 0; i < n - 1; i++) {
    const a = centers[i]!;
    const b = centers[i + 1]!;
    if (v < b) {
      sceneState.target = i + (b > a ? (v - a) / (b - a) : 1);
      return;
    }
  }
  sceneState.target = n - 1;
}

function measure() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  const maxCenter =
    document.documentElement.scrollHeight - window.innerHeight + window.innerHeight / 2;
  sceneState.names = els.map((e) => e.dataset["scene"] ?? "");
  sceneState.count = Math.max(1, els.length);
  let prev = -Infinity;
  centers = els.map((e, i) => {
    const r = e.getBoundingClientRect();
    let c = r.top + window.scrollY + r.height / 2;
    // o hero conta como "centrado" logo no topo da página
    if (i === 0) c = Math.min(c, window.innerHeight / 2);
    // a última secção tem de ser alcançável no fim do scroll
    c = Math.min(c, maxCenter);
    c = Math.max(c, prev + 1);
    prev = c;
    return c;
  });
  computeTarget();
}

/** Liga o scroll/rato ao estado da cena. Devolve a função de limpeza. */
export function startSceneTracking() {
  measure();
  const onScroll = () => computeTarget();
  const onPointer = (e: PointerEvent) => {
    sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pointermove", onPointer, { passive: true });
  void document.fonts?.ready.then(measure);
  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pointermove", onPointer);
  };
}

/* ——— Sinal "cena pronta" para o loader ——— */

let ready = false;
const listeners = new Set<() => void>();

export function signalSceneReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
  listeners.clear();
}

export function onSceneReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/* ——— Capacidades do dispositivo ——— */

export function detectWebGL(): { ok: boolean; software: boolean; renderer: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as
      WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) return { ok: false, software: false, renderer: "" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    return { ok: true, software, renderer };
  } catch {
    return { ok: false, software: false, renderer: "" };
  }
}

export function detectTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 820;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  return coarse || small || cores <= 4 || memory <= 4 ? "low" : "high";
}
