"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export default function Globe({
  reducedMotion,
  mobile,
}: {
  reducedMotion: boolean;
  mobile: boolean;
}) {
  const globe = useRef<Group>(null);
  useFrame((_, delta) => {
    if (globe.current && !reducedMotion)
      globe.current.rotation.y += Math.min(delta, 0.1) * 0.08;
  });

  return (
    <group scale={mobile ? 0.68 : 1}>
      <group ref={globe} rotation={[0.12, 0.4, 0.08]}>
        <mesh renderOrder={0}>
          <sphereGeometry args={[1.8, 32, 24]} />
          <meshBasicMaterial
            color="#52B788"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
        <mesh renderOrder={1}>
          <icosahedronGeometry args={[2, 2]} />
          <MeshDistortMaterial
            color="#2D6A4F"
            distort={0.15}
            speed={reducedMotion ? 0 : 1.5}
            roughness={0.3}
            metalness={0.2}
            flatShading
            transparent
            opacity={0.95}
            envMapIntensity={1.1}
          />
        </mesh>
        <mesh renderOrder={2}>
          <icosahedronGeometry args={[2.025, 2]} />
          <meshBasicMaterial
            color="#52B788"
            wireframe
            transparent
            opacity={0.09}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group rotation={[1.15, 0.12, -0.25]}>
        <mesh>
          <torusGeometry args={[2.5, 0.006, 6, 128]} />
          <meshBasicMaterial
            color="#52B788"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.035, 12, 8]} />
          <meshStandardMaterial
            color="#52B788"
            emissive="#52B788"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>
      <mesh rotation={[0.8, 0.65, 0.4]}>
        <torusGeometry args={[2.7, 0.004, 6, 128]} />
        <meshBasicMaterial
          color="#FF6B6B"
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
