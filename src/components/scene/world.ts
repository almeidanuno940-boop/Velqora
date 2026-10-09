import * as THREE from "three";

/*
 * "O Fluxo" — a viagem da câmara.
 *
 *  z = +16 … 0    Entrada: leads dispersos (partículas âmbar, caóticas) e o portal "Novo lead".
 *  z = −10        O Núcleo: um cristal facetado (a IA) que refrata o caos em ordem.
 *  z = −15 … −33  O Pipeline: portais luminosos atravessados por seis feixes ciano.
 *  z < −38        O Dashboard: uma paisagem de barras de dados sob uma aurora.
 *
 * Cada secção do site ([data-scene]) corresponde a uma pose da câmara.
 */

export const CORE_Z = -10;
export const FLOOR_Y = -2.2;
export const ENTRY_GATE_Z = 4;
export const GATE_ZS = [-15, -19.5, -24, -28.5, -33];
export const CITY_START_Z = -38;
export const CITY_END_Z = -96;

type Pose = { pos: [number, number, number]; look: [number, number, number] };

export const POSES: Record<string, Pose> = {
  hero: { pos: [0, 0.75, 15.5], look: [0, 0.55, -10] },
  problem: { pos: [-3.4, 1.5, 9.5], look: [0.9, 0.3, -4] },
  services: { pos: [1.9, 0.5, 2.2], look: [-0.4, 0.4, -10] },
  sectors: { pos: [5.5, 2.0, -1.5], look: [-6, 0.2, -10.5] },
  demo: { pos: [0.55, 0.25, -16.2], look: [0, 0.4, -28] },
  how: { pos: [-0.55, 0.6, -26.5], look: [0.3, 0.1, -40] },
  tools: { pos: [0, 2.3, -35.5], look: [0, -0.8, -50] },
  pricing: { pos: [6.5, 7.2, -43], look: [0, -1.2, -58] },
  about: { pos: [-7.5, 4.6, -52], look: [2, -0.6, -66] },
  faq: { pos: [1.2, 2.1, -61], look: [-1.5, 0.2, -76] },
  contact: { pos: [0, 6.2, -64], look: [0, 2.6, -100] },
  final: { pos: [0, 9.5, -62], look: [0, 7.2, -120] },
};

export function buildCurves(names: string[]) {
  const list = names.map((n) => POSES[n]).filter(Boolean) as Pose[];
  const poses = list.length >= 2 ? list : [POSES["hero"]!, POSES["problem"]!];
  const pos = new THREE.CatmullRomCurve3(
    poses.map((p) => new THREE.Vector3(...p.pos)),
    false,
    "centripetal",
  );
  const look = new THREE.CatmullRomCurve3(
    poses.map((p) => new THREE.Vector3(...p.look)),
    false,
    "centripetal",
  );
  return { pos, look, count: poses.length };
}

/* Paleta (valores lineares; >1 alimenta o bloom). */
export const COLORS = {
  ember: new THREE.Color("#ffa04a"),
  mint: new THREE.Color("#5eead4"),
  sky: new THREE.Color("#7dd3fc"),
  fogNight: new THREE.Color("#04070d"),
  fogDawn: new THREE.Color("#0a1b24"),
  zenithNight: new THREE.Color("#020409"),
  zenithDawn: new THREE.Color("#04111a"),
};

/** Uniforms partilhados por todos os shaders (mesmos objetos → atualização única). */
export const shared = {
  uTime: { value: 0 },
  uT: { value: 0 }, // posição atual na viagem (0 … count-1)
  uProgress: { value: 0 }, // 0 … 1
  uRise: { value: 0 }, // crescimento das barras
  uPixelRatio: { value: 1 },
  uFogColor: { value: COLORS.fogNight.clone() },
  uFogDensity: { value: 0.035 },
  uZenith: { value: COLORS.zenithNight.clone() },
};

export const fogChunk = /* glsl */ `
  float fogFactor(vec3 worldPos) {
    float d = length(worldPos - cameraPosition);
    return 1.0 - exp(-uFogDensity * uFogDensity * d * d);
  }
`;

/**
 * Brilho do horizonte (precisa de uFogColor e uProgress). O céu usa-o junto ao horizonte
 * e o chão/barras usam-no como cor da névoa — assim o horizonte funde-se sem linha dura.
 */
export const hazeChunk = /* glsl */ `
  vec3 horizonGlow(vec3 d) {
    float toward = max(dot(d, normalize(vec3(0.0, 0.04, -1.0))), 0.0);
    float dawn = smoothstep(0.35, 1.0, uProgress);
    return vec3(0.03, 0.17, 0.19) * pow(toward, 5.0) * (0.3 + dawn * 0.4)
      + vec3(0.6, 0.3, 0.1) * pow(toward, 28.0) * dawn * 0.28;
  }
  vec3 haze(vec3 worldPos) {
    return uFogColor + horizonGlow(normalize(worldPos - cameraPosition));
  }
`;

export { rng } from "./rng";
