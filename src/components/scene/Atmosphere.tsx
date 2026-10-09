import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hazeChunk, rng, shared } from "./world";

/* ——— Céu: noite profunda no início, aurora ciano e um amanhecer âmbar no fim ——— */

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww; // sempre no plano mais distante
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uFogColor;
  uniform vec3 uZenith;
  uniform float uProgress;
  uniform float uTime;
  varying vec3 vDir;
  ${hazeChunk}

  float aurora(vec3 d, float t) {
    float ang = atan(d.x, -d.z);
    float curtain = sin(ang * 4.0 + t * 0.05 + sin(ang * 9.0 - t * 0.07) * 0.9) * 0.5 + 0.5;
    float folds = sin(d.y * 16.0 - ang * 3.0 + t * 0.11) * 0.5 + 0.5;
    return pow(curtain * (0.55 + 0.45 * folds), 2.6);
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    float dawn = smoothstep(0.35, 1.0, uProgress);
    // no horizonte é exatamente a cor da névoa do chão (haze) → sem linha dura
    vec3 col = mix(uFogColor, uZenith, smoothstep(0.0, 0.55, h)) + horizonGlow(d);
    float band = aurora(d, uTime) * smoothstep(0.06, 0.32, h) * (1.0 - smoothstep(0.5, 0.85, h));
    col += mix(vec3(0.15, 0.85, 0.7), vec3(0.35, 0.65, 1.0), smoothstep(0.1, 0.6, h))
      * band * (0.035 + dawn * 0.16);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        uniforms: {
          uFogColor: shared.uFogColor,
          uZenith: shared.uZenith,
          uProgress: shared.uProgress,
          uTime: shared.uTime,
        },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );
  useFrame(({ camera }) => mesh.current?.position.copy(camera.position));
  return (
    <mesh ref={mesh} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[300, 48, 24]} />
    </mesh>
  );
}

/* ——— Poeira e estrelas: pontos minúsculos que dão escala e profundidade ——— */

const motesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uDrift;
  attribute vec2 aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + aSeed.x * 40.0) * uDrift;
    p.x += cos(uTime * 0.15 + aSeed.y * 30.0) * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed.y) * uPixelRatio * (uDrift > 0.0 ? 6.0 / max(-mv.z, 0.5) : 1.0);
    vAlpha = (0.35 + 0.65 * aSeed.x) * (0.6 + 0.4 * sin(uTime * (0.6 + aSeed.y) + aSeed.x * 20.0));
    if (uDrift > 0.0) vAlpha *= smoothstep(60.0, 8.0, -mv.z) * smoothstep(0.3, 2.0, -mv.z);
  }
`;

const motesFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor * a, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function makeMotes(
  count: number,
  seed: number,
  place: (r: () => number) => [number, number, number],
) {
  const rand = rng(seed);
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = place(rand);
    pos.set([x, y, z], i * 3);
    seeds.set([rand(), rand()], i * 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));
  return g;
}

function motesMaterial(color: THREE.Color, size: number, drift: number) {
  return new THREE.ShaderMaterial({
    vertexShader: motesVertex,
    fragmentShader: motesFragment,
    uniforms: {
      uTime: shared.uTime,
      uPixelRatio: shared.uPixelRatio,
      uSize: { value: size },
      uDrift: { value: drift },
      uColor: { value: color },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
  });
}

export function Motes({ count }: { count: number }) {
  const dust = useMemo(
    () => ({
      geometry: makeMotes(count, 3, (r) => [(r() - 0.5) * 40, -2 + r() * 12, 20 - r() * 120]),
      material: motesMaterial(new THREE.Color(0.75, 0.85, 1.0), 1.6, 0.35),
    }),
    [count],
  );
  const stars = useMemo(
    () => ({
      geometry: makeMotes(Math.round(count * 0.8), 5, (r) => {
        const u = r() * Math.PI * 2;
        const v = 0.04 + r() * 0.9; // só acima do horizonte
        const rad = 260;
        return [
          Math.cos(u) * Math.cos(v) * rad,
          Math.sin(v) * rad,
          Math.sin(u) * Math.cos(v) * rad,
        ];
      }),
      material: motesMaterial(new THREE.Color(0.85, 0.92, 1.0), 1.5, 0),
    }),
    [count],
  );
  const starRef = useRef<THREE.Points>(null);
  useFrame(({ camera }) => starRef.current?.position.copy(camera.position));

  return (
    <>
      <points geometry={dust.geometry} material={dust.material} frustumCulled={false} />
      <points
        ref={starRef}
        geometry={stars.geometry}
        material={stars.material}
        frustumCulled={false}
      />
    </>
  );
}
