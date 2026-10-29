import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/** Fine, off-axis orbital lines add depth without competing with the globe. */
export default function OrbitAccents({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbit.current && !reducedMotion) {
      orbit.current.rotation.z += Math.min(delta, 0.1) * 0.012;
    }
  });

  return (
    <group ref={orbit} rotation={[1.14, 0.12, -0.18]}>
      <mesh>
        <torusGeometry args={[2.38, 0.004, 6, 192]} />
        <meshBasicMaterial
          color="#52B788"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[2.38, 0, 0]}>
        <sphereGeometry args={[0.032, 16, 12]} />
        <meshStandardMaterial
          color="#8BE0B5"
          emissive="#52B788"
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
