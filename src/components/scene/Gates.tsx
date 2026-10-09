import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, ENTRY_GATE_Z, GATE_ZS } from "./world";

/** Marcas radiais à volta do portal (como uma escala de instrumento). */
function ticksGeometry(radius: number, count: number, len: number) {
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const l = i % 5 === 0 ? len * 2 : len;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push(c * radius, s * radius, 0, c * (radius - l), s * (radius - l), 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

type GateProps = {
  z: number;
  radius: number;
  color: THREE.Color;
  phase: number;
  intensity?: number;
};

function Gate({ z, radius, color, phase, intensity = 1 }: GateProps) {
  const arcs = useRef<THREE.Group>(null);
  const mats = useMemo(() => {
    const ring = new THREE.MeshBasicMaterial({
      color: color.clone(),
      transparent: true,
      toneMapped: false,
      depthWrite: false,
    });
    const arc = new THREE.MeshBasicMaterial({
      color: color.clone().multiplyScalar(0.8),
      transparent: true,
      opacity: 0.5,
      toneMapped: false,
      depthWrite: false,
    });
    const tick = new THREE.LineBasicMaterial({
      color: color.clone().multiplyScalar(0.9),
      transparent: true,
      opacity: 0.45,
      toneMapped: false,
      depthWrite: false,
    });
    return { ring, arc, tick };
  }, [color]);
  const ticks = useMemo(() => ticksGeometry(radius - 0.12, 72, 0.08), [radius]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // um "pacote" de dados atravessa os portais em sequência
    const p = (t * 0.32 + phase) % 1;
    const pulse = Math.exp(-p * 9);
    mats.ring.color.copy(color).multiplyScalar(intensity * (1.1 + pulse * 2.6));
    mats.ring.opacity = 0.7 + pulse * 0.3;
    if (arcs.current) arcs.current.rotation.z = t * 0.08 * (phase > 0.5 ? 1 : -1) + phase * 3;
  });

  return (
    <group position={[0, 0.45, z]}>
      <mesh material={mats.ring}>
        <torusGeometry args={[radius, 0.012, 8, 220]} />
      </mesh>
      <lineSegments geometry={ticks} material={mats.tick} />
      <group ref={arcs}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={mats.arc} rotation={[0, 0, (i * Math.PI) / 2]}>
            <torusGeometry args={[radius + 0.22, 0.022, 6, 60, Math.PI / 4.2]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Gates() {
  return (
    <>
      {/* portal de entrada: "Novo lead" */}
      <Gate z={ENTRY_GATE_Z} radius={3.4} color={COLORS.ember} phase={0.95} intensity={0.9} />
      {GATE_ZS.map((z, i) => (
        <Gate
          key={z}
          z={z}
          radius={2.75}
          color={i === GATE_ZS.length - 1 ? COLORS.sky : COLORS.mint}
          phase={1 - (i + 1) * 0.12}
          intensity={0.85}
        />
      ))}
    </>
  );
}
