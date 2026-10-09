import { useMemo } from "react";
import * as THREE from "three";
import { CORE_Z, fogChunk, rng, shared } from "./world";

/*
 * Cada partícula é um lead/dado. Antes do núcleo vagueia em órbitas caóticas (âmbar)
 * e é sugada num funil; depois do núcleo segue uma de seis faixas ordenadas (ciano)
 * — uma por serviço — que no fim se abrem e "chovem" sobre o dashboard.
 * Toda a animação corre na GPU.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uFogDensity;
  attribute vec4 aSeed;
  attribute float aLane;
  varying vec3 vColor;
  varying float vAlpha;
  ${fogChunk}

  const float Z0 = 17.0;
  const float Z1 = -46.0;
  const float CORE = ${CORE_Z.toFixed(1)};
  const float TAU = 6.2831853;

  void main() {
    float s = fract(aSeed.x + uTime * (0.016 + aSeed.y * 0.006));
    // 62% do ciclo no caos (lento), 38% no pipeline (rápido)
    float z = s < 0.62 ? mix(Z0, CORE, s / 0.62) : mix(CORE, Z1, (s - 0.62) / 0.38);

    float k = smoothstep(CORE + 1.0, CORE - 2.6, z); // 0 = caos, 1 = ordem

    // — caos: órbitas desencontradas que convergem num funil para o núcleo
    float funnel = smoothstep(CORE + 0.3, CORE + 15.0, z);
    float r = (0.35 + aSeed.z * 7.8) * mix(0.05, 1.0, pow(funnel, 0.8));
    float dir = aSeed.z > 0.5 ? 1.0 : -1.0;
    float a = aSeed.w * TAU + uTime * (0.05 + aSeed.y * 0.12) * dir;
    vec3 chaos = vec3(cos(a) * r, sin(a) * r * 0.62 + 0.45, z);
    chaos += vec3(
      sin(uTime * 0.6 + aSeed.x * 31.0),
      cos(uTime * 0.45 + aSeed.y * 17.0),
      sin(uTime * 0.3 + aSeed.w * 11.0)
    ) * 0.45 * funnel;

    // — ordem: seis feixes à volta do eixo, que se abrem no fim do túnel
    float la = aLane / 6.0 * TAU + 0.5236;
    float spread = smoothstep(-31.0, -44.0, z);
    float lr = 1.0 + spread * (3.0 + aSeed.z * 9.0);
    vec3 order = vec3(cos(la) * lr, sin(la) * lr * 0.6 + 0.45 - spread * (1.2 + aSeed.w * 1.4), z);
    order.xy += (aSeed.zw - 0.5) * mix(0.16, 1.4, spread);

    vec3 p = mix(chaos, order, k);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    float size = uSize * mix(0.55 + aSeed.y * 1.25, 0.45 + aSeed.y * 0.55, k);
    gl_PointSize = min(size * uPixelRatio * (9.0 / max(-mv.z, 0.1)), 48.0 * uPixelRatio);

    vec3 warm = vec3(1.0, 0.56, 0.22);
    vec3 cool = mix(vec3(0.28, 0.95, 0.82), vec3(0.45, 0.8, 1.0), aSeed.w);
    float flare = exp(-abs(z - CORE) * 0.9) * 3.0;
    vColor = mix(warm, cool, k) * (1.0 + flare);

    float fadeIn = smoothstep(Z0, Z0 - 5.0, z);
    float fadeOut = smoothstep(Z1, Z1 + 8.0, z);
    float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + aSeed.y * 3.0) + aSeed.x * 50.0);
    vAlpha = fadeIn * fadeOut * mix((0.4 + aSeed.y * 0.6) * twinkle, 0.95, k);
    vAlpha *= 1.0 - fogFactor(world.xyz);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = pow(core, 1.8) * vAlpha;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor * a, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function FlowParticles({ count, size = 1 }: { count: number; size?: number }) {
  const { geometry, material } = useMemo(() => {
    const rand = rng(7);
    const seeds = new Float32Array(count * 4);
    const lanes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i * 4] = rand();
      seeds[i * 4 + 1] = rand();
      seeds[i * 4 + 2] = rand();
      seeds[i * 4 + 3] = rand();
      lanes[i] = Math.floor(rand() * 6);
    }
    const g = new THREE.BufferGeometry();
    // a posição é calculada no shader; o atributo só define o número de vértices
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    g.setAttribute("aLane", new THREE.BufferAttribute(lanes, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: shared.uTime,
        uPixelRatio: shared.uPixelRatio,
        uFogDensity: shared.uFogDensity,
        uSize: { value: 2.2 * size },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });
    return { geometry: g, material: m };
  }, [count, size]);

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
