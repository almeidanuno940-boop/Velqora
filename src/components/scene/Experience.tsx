import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { sceneState, type Tier } from "./store";
import { COLORS, buildCurves, shared } from "./world";
import { FlowParticles } from "./FlowParticles";
import { Core } from "./Core";
import { Gates } from "./Gates";
import { DataCity, Floor } from "./DataCity";
import { Motes, Sky } from "./Atmosphere";

type Props = { tier: Tier; reduced: boolean };

/*
 * O R3F 9.8 (última versão estável) ainda cria um THREE.Clock, que o three 0.186 marca como
 * deprecado. O aviso é inofensivo e só desaparece com o R3F 10, por isso filtramos só essa
 * mensagem e deixamos passar todas as outras.
 */
if (
  typeof console !== "undefined" &&
  !(console.warn as { __velqoraFiltered?: true }).__velqoraFiltered
) {
  const warn = console.warn.bind(console);
  const filtered = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock:")) return;
    warn(...args);
  };
  (filtered as { __velqoraFiltered?: true }).__velqoraFiltered = true;
  console.warn = filtered;
}

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();

/** Câmara conduzida pelo scroll (com amortecimento) e pelo rato (parallax). */
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();
  const curves = useMemo(() => buildCurves(sceneState.names), []);
  const state = useRef({ t: reduced ? 0 : sceneState.target, px: 0, py: 0 });

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    // ecrãs verticais: campo de visão mais aberto para manter a composição
    cam.fov = aspect < 0.8 ? 68 : aspect < 1.2 ? 58 : 48;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((frame, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const s = state.current;
    const max = curves.count - 1;
    const target = reduced ? 0 : Math.min(sceneState.target, max);
    s.t = reduced ? 0 : THREE.MathUtils.damp(s.t, target, 2.4, delta);
    s.px = THREE.MathUtils.damp(s.px, reduced ? 0 : sceneState.pointerX, 2.2, delta);
    s.py = THREE.MathUtils.damp(s.py, reduced ? 0 : sceneState.pointerY, 2.2, delta);

    const u = THREE.MathUtils.clamp(s.t / max, 0, 1);
    curves.pos.getPoint(u, tmpPos);
    curves.look.getPoint(u, tmpLook);

    // respiração lenta + parallax do rato no plano da câmara
    const time = frame.clock.elapsedTime;
    const breathe = reduced ? 0 : 1;
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    tmpPos
      .addScaledVector(right, s.px * 0.55 + Math.sin(time * 0.21) * 0.12 * breathe)
      .addScaledVector(up, -s.py * 0.3 + Math.sin(time * 0.17) * 0.08 * breathe);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);

    // estado global dos shaders
    shared.uT.value = s.t;
    shared.uProgress.value = u;
    shared.uRise.value = THREE.MathUtils.smoothstep(s.t, 4.4, 7.2);
    shared.uFogColor.value
      .copy(COLORS.fogNight)
      .lerp(COLORS.fogDawn, THREE.MathUtils.smoothstep(u, 0.45, 1));
    shared.uZenith.value.copy(COLORS.zenithNight).lerp(COLORS.zenithDawn, u);
    shared.uFogDensity.value = THREE.MathUtils.lerp(
      0.04,
      0.022,
      THREE.MathUtils.smoothstep(u, 0.45, 0.9),
    );
  });
  return null;
}

/** Relógio da cena (congelado em movimento reduzido) + métricas de depuração. */
function Clock({ reduced, tier }: { reduced: boolean; tier: Tier }) {
  const { gl } = useThree();
  const acc = useRef({ n: 0, t: 0 });
  useFrame((state, delta) => {
    shared.uTime.value = reduced ? 14 : state.clock.elapsedTime;
    shared.uPixelRatio.value = gl.getPixelRatio();
    acc.current.n++;
    acc.current.t += delta;
    if (acc.current.t >= 1) {
      (window as unknown as { __velqoraScene: unknown }).__velqoraScene = {
        tier,
        reduced,
        fps: Math.round(acc.current.n / acc.current.t),
        dpr: gl.getPixelRatio(),
        t: Number(shared.uT.value.toFixed(2)),
        calls: gl.info.render.calls,
      };
      acc.current = { n: 0, t: 0 };
    }
  });
  return null;
}

/**
 * Compila todos os shaders em paralelo (KHR_parallel_shader_compile) antes do primeiro frame,
 * em vez de bloquear a thread principal na primeira renderização.
 * Com pós-processamento a cena é desenhada num render target, onde o three.js usa outras
 * variantes dos shaders (sem tone mapping, saída linear): compilamos essas.
 */
function Warmup({ offscreen, onDone }: { offscreen: boolean; onDone: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    let alive = true;
    const rt = offscreen ? new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }) : null;
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(rt);
    const compiling = gl.compileAsync(scene, camera);
    gl.setRenderTarget(previous);
    compiling
      .catch(() => undefined)
      .finally(() => {
        rt?.dispose();
        if (!alive) return;
        onDone();
        requestAnimationFrame(() => invalidate());
      });
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, invalidate, offscreen, onDone]);
  return null;
}

function World({ tier, reduced }: Props) {
  const high = tier === "high";
  return (
    <>
      <Sky />
      <Floor />
      <Motes count={high ? 1400 : 600} />
      <FlowParticles count={high ? 9000 : 3500} size={high ? 1 : 1.25} />
      <Gates />
      <Core />
      <DataCity spacing={high ? 1.05 : 1.6} />
      <CameraRig reduced={reduced} />
      <Clock reduced={reduced} tier={tier} />
    </>
  );
}

function Effects() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={0.75}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.2}
        radius={0.72}
      />
      <Vignette offset={0.28} darkness={0.72} />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.14} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

export default function Experience({ tier, reduced }: Props) {
  const [compiled, setCompiled] = useState(false);
  const [visible, setVisible] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);

  // só mostra o canvas quando já há frames reais (fade sobre o fundo CSS)
  useEffect(() => {
    if (!compiled) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [compiled]);
  const [fx, setFx] = useState(tier === "high");
  const [dprMax, setDprMax] = useState(tier === "high" ? 1.5 : 1.25);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-[2] transition-opacity duration-[1600ms] ease-out-expo"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, dprMax]}
        frameloop={!compiled ? "never" : reduced ? "demand" : "always"}
        camera={{ fov: 48, near: 0.1, far: 420, position: [0, 0.75, 15.5] }}
        gl={{
          antialias: tier !== "high",
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          // em produção não lemos os logs dos shaders (cada leitura espera pela compilação)
          gl.debug.checkShaderErrors = import.meta.env.DEV;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          scene.background = COLORS.fogNight.clone();
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        }}
      >
        {!reduced && (
          <PerformanceMonitor
            flipflops={3}
            onDecline={() => {
              setDprMax(1);
              setFx(false);
            }}
          />
        )}
        <World tier={tier} reduced={reduced} />
        <Warmup offscreen={fx} onDone={onCompiled} />
        {fx && <Effects />}
      </Canvas>
    </div>
  );
}
