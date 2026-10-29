import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type ParticleLayerProps = {
  count: number;
  color: string;
  size: number;
  rotationSpeed: number;
  sprite: THREE.DataTexture;
  reducedMotion: boolean;
  seed: number;
};

// A seeded shell makes the two layers stable across resize and remounts.
function makePositions(count: number, seed: number) {
  let state = seed;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const y = 2 * random() - 1;
    const angle = random() * Math.PI * 2;
    const radius = 8 + random() * 4;
    const ringRadius = Math.sqrt(1 - y * y);
    positions[i * 3] = radius * ringRadius * Math.cos(angle);
    positions[i * 3 + 1] = radius * y;
    positions[i * 3 + 2] = radius * ringRadius * Math.sin(angle);
  }
  return positions;
}

// A tiny radial sprite gives PointsMaterial soft, round dust instead of squares.
function makeParticleSprite() {
  const width = 32;
  const data = new Uint8Array(width * width * 4);
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const distance = Math.hypot(
        (x + 0.5 - width / 2) / (width / 2),
        (y + 0.5 - width / 2) / (width / 2),
      );
      const index = (y * width + x) * 4;
      data[index] = data[index + 1] = data[index + 2] = 255;
      const falloff = THREE.MathUtils.smoothstep(distance, 0.3, 1);
      data[index + 3] = Math.round((1 - falloff) * 255);
    }
  }
  const texture = new THREE.DataTexture(data, width, width, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function ParticleLayer({
  count,
  color,
  size,
  rotationSpeed,
  sprite,
  reducedMotion,
  seed,
}: ParticleLayerProps) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => makePositions(count, seed), [count, seed]);

  useFrame((_, delta) => {
    if (points.current && !reducedMotion) {
      points.current.rotation.y += rotationSpeed * Math.min(delta, 0.1);
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        onBeforeCompile={(shader) => {
          // Keep distant points visible at a subpixel camera scale while still
          // letting nearer dust grow naturally with perspective.
          shader.vertexShader = shader.vertexShader.replace(
            "#include <logdepthbuf_vertex>",
            "gl_PointSize = max(gl_PointSize, 2.0);\n#include <logdepthbuf_vertex>",
          );
        }}
      />
    </points>
  );
}

export default function Particles({
  mobile,
  reducedMotion,
}: {
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const sprite = useMemo(makeParticleSprite, []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  return (
    <>
      <ParticleLayer
        count={mobile ? 800 : 2000}
        color="#52B788"
        size={0.03}
        rotationSpeed={0.03}
        seed={2026}
        sprite={sprite}
        reducedMotion={reducedMotion}
      />
      <ParticleLayer
        count={500}
        color="#FF6B6B"
        size={0.05}
        rotationSpeed={-0.015}
        seed={917}
        sprite={sprite}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
