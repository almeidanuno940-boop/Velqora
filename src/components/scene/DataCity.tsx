import { useMemo } from "react";
import * as THREE from "three";
import {
  CITY_END_Z,
  CITY_START_Z,
  CORE_Z,
  FLOOR_Y,
  fogChunk,
  hazeChunk,
  rng,
  shared,
} from "./world";

/*
 * O Dashboard: uma paisagem de barras (como um gráfico Power BI visto à escala de uma cidade).
 * As barras crescem quando a câmara chega, oscilam como dados "ao vivo",
 * e algumas destacam-se em âmbar (KPIs).
 */

const barVertex = /* glsl */ `
  uniform float uTime;
  uniform float uRise;
  attribute vec3 aOffset;
  attribute float aHeight;
  attribute float aSeed;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vY;
  varying float vH;
  varying float vSeed;
  void main() {
    float depth = clamp((${CITY_START_Z.toFixed(1)} - aOffset.z) / 58.0, 0.0, 1.0);
    float rise = clamp(uRise * 1.9 - depth * 0.75 - aSeed * 0.15, 0.0, 1.0);
    rise = 1.0 - pow(1.0 - rise, 3.0);
    // clareira: as barras baixam à volta da câmara (os dados abrem caminho)
    float clear = smoothstep(2.5, 9.0, length(aOffset.xz - cameraPosition.xz));
    float h = aHeight * rise * mix(0.12, 1.0, clear);
    h = max(h * (1.0 + 0.06 * sin(uTime * 0.8 + aSeed * 40.0)), 0.015);
    vec3 p = position;
    p.y *= h;
    vec4 world = modelMatrix * vec4(p + aOffset, 1.0);
    vWorld = world.xyz;
    vNormal = normal;
    vUv = uv;
    vY = position.y;
    vH = h;
    vSeed = aSeed;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const barFragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vY;
  varying float vH;
  varying float vSeed;
  ${fogChunk}
  ${hazeChunk}
  void main() {
    float top = step(0.5, vNormal.y);
    float kpi = step(0.955, vSeed);
    float lit = step(0.84, fract(vSeed * 7.31)); // ~16% das barras estão "ao vivo"
    float live = 0.7 + 0.3 * sin(uTime * 1.3 + vSeed * 60.0);
    vec3 cap = mix(vec3(0.3, 0.92, 0.82), vec3(1.0, 0.6, 0.26), kpi);

    // vidro escuro: o corpo quase não reflete luz
    vec3 body = mix(vec3(0.008, 0.013, 0.022), vec3(0.016, 0.034, 0.048), vY);
    float lam = 0.55 + 0.45 * max(dot(vNormal, normalize(vec3(0.35, 0.8, 0.45))), 0.0);
    vec3 col = body * lam;

    // contorno do topo com ~1px de largura em qualquer distância
    float w = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float outline = top * (1.0 - smoothstep(0.6, 1.6, w / max(fwidth(w), 1e-4)));
    // aresta superior das faces laterais
    float rim = (1.0 - top) * (1.0 - smoothstep(0.0, 0.035, (1.0 - vY) * vH));
    // linhas horizontais (como a grelha de um gráfico)
    float band = (1.0 - top) * smoothstep(0.93, 1.0, fract(vWorld.y * 1.6)) * 0.05;
    float fill = top * (0.035 + lit * 0.18 * live);

    col += cap * (outline * 0.75 + rim * 0.35 + band + fill) * mix(1.0, 2.0, kpi);
    col = mix(col, haze(vWorld), fogFactor(vWorld));
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function heightAt(x: number, z: number, r: number) {
  const n =
    Math.sin(x * 0.31) * 0.5 +
    Math.sin(z * 0.23 + 1.7) * 0.5 +
    Math.sin((x - z) * 0.11) * 0.6 +
    Math.sin(x * 0.9 + z * 0.7) * 0.25;
  let h = 0.2 + Math.max(0, n + 0.75) * 1.25;
  h *= 0.55 + Math.min(1, Math.abs(x) / 13) * 0.9; // avenida central mais baixa
  if (r > 0.94) h += 1.5 + (r - 0.94) * 40; // torres-KPI
  return h;
}

export function DataCity({ spacing }: { spacing: number }) {
  const mesh = useMemo(() => {
    const rand = rng(21);
    const offsets: number[] = [];
    const heights: number[] = [];
    const seeds: number[] = [];
    for (let z = CITY_START_Z; z > CITY_END_Z; z -= spacing) {
      for (let x = -28; x <= 28; x += spacing) {
        if (Math.abs(x) < 2.3) continue; // avenida por onde chegam os feixes
        const r = rand();
        if (r < 0.08) continue; // lacunas: menos "grelha perfeita"
        const jx = (rand() - 0.5) * spacing * 0.12;
        offsets.push(x + jx, FLOOR_Y, z);
        heights.push(heightAt(x, z, rand()));
        seeds.push(r);
      }
    }
    const box = new THREE.BoxGeometry(spacing * 0.7, 1, spacing * 0.7);
    box.translate(0, 0.5, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = box.index;
    g.setAttribute("position", box.getAttribute("position"));
    g.setAttribute("normal", box.getAttribute("normal"));
    g.setAttribute("uv", box.getAttribute("uv"));
    g.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
    g.setAttribute("aHeight", new THREE.InstancedBufferAttribute(new Float32Array(heights), 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(new Float32Array(seeds), 1));
    g.instanceCount = heights.length;
    const m = new THREE.ShaderMaterial({
      vertexShader: barVertex,
      fragmentShader: barFragment,
      uniforms: {
        uTime: shared.uTime,
        uRise: shared.uRise,
        uProgress: shared.uProgress,
        uFogColor: shared.uFogColor,
        uFogDensity: shared.uFogDensity,
      },
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    return mesh;
  }, [spacing]);

  return <primitive object={mesh} />;
}

/* ——— Chão: grelha fina que se perde na névoa, com o reflexo do núcleo ——— */

const floorVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const floorFragment = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uProgress;
  uniform float uFogDensity;
  uniform float uTime;
  varying vec3 vWorld;
  ${fogChunk}
  ${hazeChunk}
  float grid(vec2 p) {
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }
  void main() {
    vec2 p = vWorld.xz;
    vec3 col = vec3(0.008, 0.014, 0.024);
    col += vec3(0.22, 0.55, 0.65) * (grid(p) * 0.05 + grid(p / 5.0) * 0.1);
    float core = exp(-length(p - vec2(0.0, ${CORE_Z.toFixed(1)})) * 0.32);
    col += vec3(0.2, 0.85, 0.75) * core * 0.45;
    float entry = exp(-length(p - vec2(0.0, 7.0)) * 0.16);
    col += vec3(1.0, 0.55, 0.22) * entry * 0.08;
    // rasto dos feixes ao longo da avenida
    float lane = exp(-abs(p.x) * 1.2) * smoothstep(${CORE_Z.toFixed(1)}, ${(CORE_Z - 4).toFixed(1)}, p.y);
    float flow = 0.6 + 0.4 * sin(p.y * 0.8 + uTime * 2.4);
    col += vec3(0.2, 0.8, 0.8) * lane * flow * 0.12;
    col = mix(col, haze(vWorld), fogFactor(vWorld));
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function Floor() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        uniforms: {
          uFogColor: shared.uFogColor,
          uFogDensity: shared.uFogDensity,
          uProgress: shared.uProgress,
          uTime: shared.uTime,
        },
      }),
    [],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -45]} material={material}>
      <planeGeometry args={[160, 190]} />
    </mesh>
  );
}
