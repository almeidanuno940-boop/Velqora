import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, CORE_Z } from "./world";

/**
 * Matcap procedural: uma esfera de estúdio pintada em canvas (luz ciano em cima, âmbar em
 * baixo, um brilho branco). Dá reflexos de vidro às facetas sem ambiente HDR nem PMREM —
 * cuja compilação de shaders bloqueava o arranque.
 */
function makeMatcap() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const blob = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  };
  ctx.fillStyle = "#04100f";
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "lighter";
  blob(c * 0.55, c * 0.45, c * 0.95, "rgba(94,234,212,0.55)");
  blob(c * 1.5, c * 1.55, c * 0.7, "rgba(255,170,90,0.4)");
  blob(c * 1.45, c * 0.5, c * 0.5, "rgba(125,211,252,0.35)");
  blob(c * 0.62, c * 0.5, c * 0.16, "rgba(255,255,255,0.9)");
  // aro de fresnel: as facetas de perfil ficam mais claras
  const rim = ctx.createRadialGradient(c, c, c * 0.72, c, c, c);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(160,255,240,0.35)");
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** O Núcleo: um cristal facetado (a IA) que recebe o caos e devolve ordem. */
export function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const inner = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  const { shellGeo, edgesGeo, innerGeo } = useMemo(() => {
    const s = new THREE.IcosahedronGeometry(1.25, 0);
    return {
      shellGeo: s,
      edgesGeo: new THREE.EdgesGeometry(s),
      innerGeo: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.72, 1)),
    };
  }, []);

  const matcap = useMemo(makeMatcap, []);

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.mint.clone().multiplyScalar(1.6),
        transparent: true,
        opacity: 0.75,
        toneMapped: false,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.12;
      shell.current.rotation.x = Math.sin(t * 0.2) * 0.25;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.35;
      inner.current.rotation.z += delta * 0.18;
    }
    if (rings.current) {
      const [a, b, c] = rings.current.children;
      if (a) a.rotation.x = t * 0.32;
      if (b) b.rotation.y = t * 0.24;
      if (c) c.rotation.z = -t * 0.18;
    }
    if (glow.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.18;
      glow.current.color.copy(COLORS.mint).multiplyScalar(2.4 * pulse);
    }
    if (group.current) group.current.position.y = 0.45 + Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0.45, CORE_Z]}>
      <mesh>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshBasicMaterial ref={glow} toneMapped={false} />
      </mesh>
      <lineSegments ref={inner} geometry={innerGeo}>
        <lineBasicMaterial
          color={COLORS.mint.clone().multiplyScalar(1.4)}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </lineSegments>

      <group ref={shell}>
        <mesh geometry={shellGeo}>
          <meshMatcapMaterial
            matcap={matcap}
            transparent
            opacity={0.55}
            flatShading
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={edgesGeo}>
          <lineBasicMaterial color="#c8fff6" transparent opacity={0.35} toneMapped={false} />
        </lineSegments>
      </group>

      <group ref={rings}>
        <mesh material={ringMat}>
          <torusGeometry args={[1.75, 0.01, 8, 160]} />
        </mesh>
        <mesh material={ringMat} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.006, 8, 180]} />
        </mesh>
        <group rotation={[Math.PI / 3, Math.PI / 5, 0]}>
          <mesh material={ringMat}>
            <torusGeometry args={[2.35, 0.014, 8, 200, Math.PI * 1.4]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
