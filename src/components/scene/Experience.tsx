import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { sceneState, signalSceneReady, type Tier } from "./store";
import { COLORS, buildCurves, shared } from "./world";
import { FlowParticles } from "./FlowParticles";
import { Core } from "./Core";
import { Gates } from "./Gates";
import { DataCity, Floor } from "./DataCity";
import { Motes, Sky } from "./Atmosphere";

type Props = { tier: Tier; reduced: boolean };

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
  const frames = useRef(0);
  const acc = useRef({ n: 0, t: 0 });
  useFrame((state, delta) => {
    shared.uTime.value = reduced ? 14 : state.clock.elapsedTime;
    shared.uPixelRatio.value = gl.getPixelRatio();
    frames.current++;
    // em "demand" (movimento reduzido) só há um frame; no modo normal espera 3 frames estáveis
    if (frames.current === (reduced ? 1 : 3)) signalSceneReady();
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

function Studio() {
  // ambiente procedural (sem HDRIs externos) — só serve os reflexos do cristal
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer
        form="rect"
        intensity={3}
        color="#5eead4"
        position={[-4, 2, 3]}
        scale={[6, 2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffb067"
        position={[5, -1, 4]}
        scale={[4, 3, 1]}
      />
      <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 6, -3]} scale={3} />
      <Lightformer
        form="rect"
        intensity={1.2}
        color="#7dd3fc"
        position={[0, 0, -8]}
        scale={[10, 4, 1]}
      />
    </Environment>
  );
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
      <Core tier={tier} />
      <DataCity spacing={high ? 1.05 : 1.6} />
      <Studio />
      <ambientLight intensity={0.15} />
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
  const [visible, setVisible] = useState(false);
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
        frameloop={reduced ? "demand" : "always"}
        camera={{ fov: 48, near: 0.1, far: 420, position: [0, 0.75, 15.5] }}
        gl={{
          antialias: tier !== "high",
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          scene.background = COLORS.fogNight.clone();
          requestAnimationFrame(() => setVisible(true));
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
        {fx && <Effects />}
      </Canvas>
    </div>
  );
}
