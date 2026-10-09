import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, CORE_Z } from "./world";

/**
 * O Núcleo: um cristal facetado (a IA) que recebe o caos e devolve ordem.
 * Vidro escuro e facetado (sem refração, para o núcleo luminoso se ler como um só ponto);
 * no nível "high" ganha clearcoat e uma leve iridescência.
 */
export function Core({ tier }: { tier: "high" | "low" }) {
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
      {/* luz que o núcleo projeta no chão e nos portais */}
      <pointLight color={COLORS.mint} intensity={18} distance={16} decay={1.6} />

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
          {tier === "high" ? (
            <meshPhysicalMaterial
              color="#0c2a2c"
              metalness={0.2}
              roughness={0.06}
              clearcoat={1}
              clearcoatRoughness={0.04}
              iridescence={0.35}
              iridescenceIOR={1.3}
              transparent
              opacity={0.42}
              envMapIntensity={2.4}
              flatShading
              depthWrite={false}
            />
          ) : (
            <meshStandardMaterial
              color="#0c2a2c"
              metalness={0.3}
              roughness={0.08}
              transparent
              opacity={0.42}
              envMapIntensity={2.2}
              flatShading
              depthWrite={false}
            />
          )}
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
