"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DataTexture,
  MathUtils,
  type Points,
  RGBAFormat,
} from "three";
import type { SceneSettings } from "@/types";

function makePositions(count: number, seed: number) {
  let state = seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index++) {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radius = 5 + random() * 7;
    const ring = Math.sqrt(1 - y * y);
    positions[index * 3] = radius * ring * Math.cos(angle);
    positions[index * 3 + 1] = radius * y;
    positions[index * 3 + 2] = radius * ring * Math.sin(angle);
  }
  return positions;
}

function makeSprite() {
  const size = 32;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const distance = Math.hypot(
        (x + 0.5 - size / 2) / (size / 2),
        (y + 0.5 - size / 2) / (size / 2),
      );
      const index = (y * size + x) * 4;
      data[index] = data[index + 1] = data[index + 2] = 255;
      data[index + 3] = Math.round(
        (1 - MathUtils.smoothstep(distance, 0.15, 1)) * 255,
      );
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function Layer({
  count,
  color,
  size,
  speed,
  seed,
  sprite,
  reducedMotion,
}: {
  count: number;
  color: string;
  size: number;
  speed: number;
  seed: number;
  sprite: DataTexture;
  reducedMotion: boolean;
}) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => makePositions(count, seed), [count, seed]);
  useFrame((_, delta) => {
    if (points.current && !reducedMotion)
      points.current.rotation.y += Math.min(delta, 0.1) * speed;
  });
  return (
    <points ref={points} key={count} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default function Particles({ mobile, reducedMotion }: SceneSettings) {
  const sprite = useMemo(makeSprite, []);
  useEffect(() => () => sprite.dispose(), [sprite]);
  return (
    <>
      <Layer
        count={mobile ? 640 : 2000}
        color="#52B788"
        size={0.035}
        speed={0.018}
        seed={2026}
        sprite={sprite}
        reducedMotion={reducedMotion}
      />
      <Layer
        count={mobile ? 160 : 500}
        color="#FF6B6B"
        size={0.045}
        speed={-0.012}
        seed={917}
        sprite={sprite}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
