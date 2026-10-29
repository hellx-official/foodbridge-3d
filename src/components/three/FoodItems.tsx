"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DataTexture,
  type Group,
  LatheGeometry,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  SplineCurve,
  Vector2,
} from "three";
import type { SceneSettings } from "@/types";

type Vec3 = [number, number, number];
type FoodKind =
  | "tomato"
  | "pear"
  | "orange"
  | "broccoli"
  | "carrot"
  | "bread"
  | "apple"
  | "avocado"
  | "lemon"
  | "eggplant";

function makeSkin() {
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 1439;
  for (let index = 0; index < size * size; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 100 + (seed % 80);
    pixels[index * 4] = pixels[index * 4 + 1] = pixels[index * 4 + 2] = value;
    pixels[index * 4 + 3] = 255;
  }
  const texture = new DataTexture(pixels, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.magFilter = texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function Skin({ color, skin }: { color: string; skin: DataTexture }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.3}
      metalness={0.1}
      clearcoat={1}
      clearcoatRoughness={0.1}
      bumpMap={skin}
      bumpScale={0.012}
    />
  );
}

function Leaf({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={[0.08 * scale, 0.22 * scale, 0.025 * scale]}
    >
      <sphereGeometry args={[1, 12, 8]} />
      <meshPhysicalMaterial
        color="#52B788"
        roughness={0.3}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function Stem({
  position = [0, 0.38, 0],
  color = "#665038",
}: {
  position?: Vec3;
  color?: string;
}) {
  return (
    <mesh position={position} rotation={[0, 0, -0.15]}>
      <cylinderGeometry args={[0.025, 0.035, 0.16, 10]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function Pear({ skin }: { skin: DataTexture }) {
  const geometry = useMemo(
    () =>
      new LatheGeometry(
        new SplineCurve([
          new Vector2(0, -0.4),
          new Vector2(0.24, -0.38),
          new Vector2(0.33, -0.2),
          new Vector2(0.29, 0),
          new Vector2(0.16, 0.2),
          new Vector2(0.1, 0.36),
          new Vector2(0, 0.38),
        ]).getPoints(32),
        24,
      ),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <>
      <mesh geometry={geometry}>
        <Skin color="#C9D66B" skin={skin} />
      </mesh>
      <Stem />
      <Leaf position={[0.08, 0.42, 0]} rotation={[0, 0, -1]} scale={0.7} />
    </>
  );
}

function FoodModel({ kind, skin }: { kind: FoodKind; skin: DataTexture }) {
  switch (kind) {
    case "tomato":
    case "apple":
      return (
        <>
          <mesh scale={[1, 0.9, 1]}>
            <sphereGeometry args={[0.37, 24, 16]} />
            <Skin
              color={kind === "tomato" ? "#FF6B6B" : "#D95757"}
              skin={skin}
            />
          </mesh>
          {kind === "tomato" ? (
            [0, 72, 144, 216, 288].map((angle) => (
              <group
                key={angle}
                rotation={[0, (angle * Math.PI) / 180, 0]}
                position={[0, 0.32, 0]}
              >
                <Leaf rotation={[-1.2, 0, 0]} scale={0.7} />
              </group>
            ))
          ) : (
            <Leaf position={[0.09, 0.4, 0]} rotation={[0, 0, -1]} scale={0.7} />
          )}
          <Stem position={[0, 0.38, 0]} color="#527342" />
        </>
      );
    case "pear":
      return <Pear skin={skin} />;
    case "orange":
    case "lemon":
      return (
        <>
          <mesh scale={kind === "lemon" ? [1.25, 0.8, 0.8] : [1, 0.94, 1]}>
            <sphereGeometry args={[0.34, 24, 16]} />
            <Skin
              color={kind === "lemon" ? "#E9D65C" : "#F4A261"}
              skin={skin}
            />
          </mesh>
          <Leaf position={[0.08, 0.32, 0]} rotation={[0, 0, -1]} scale={0.65} />
        </>
      );
    case "broccoli":
      return (
        <>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.09, 0.12, 0.42, 12]} />
            <Skin color="#8FBA68" skin={skin} />
          </mesh>
          {(
            [
              [0, 0.16, 0],
              [-0.2, 0.08, 0],
              [0.2, 0.08, 0],
              [0, 0.08, 0.2],
              [0, 0.08, -0.2],
            ] as Vec3[]
          ).map((position, index) => (
            <mesh key={position.join("-")} position={position}>
              <sphereGeometry args={[0.21, 16, 12]} />
              <Skin color={index % 2 ? "#2D6A4F" : "#40916C"} skin={skin} />
            </mesh>
          ))}
        </>
      );
    case "carrot":
      return (
        <>
          <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.2, 0.7, 20]} />
            <Skin color="#F4A261" skin={skin} />
          </mesh>
          {[-0.6, 0, 0.6].map((angle) => (
            <Leaf
              key={angle}
              position={[0, 0.38, 0]}
              rotation={[0, 0, angle]}
            />
          ))}
        </>
      );
    case "bread":
      return (
        <>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.22, 0.42, 6, 16]} />
            <Skin color="#D4A373" skin={skin} />
          </mesh>
          {[-0.18, 0, 0.18].map((x) => (
            <mesh key={x} position={[x, 0.215, 0]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.025, 0.015, 0.28]} />
              <meshPhysicalMaterial
                color="#FEFAE0"
                roughness={0.3}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
          ))}
        </>
      );
    case "avocado":
      return (
        <>
          <mesh scale={[0.85, 1.15, 0.65]}>
            <sphereGeometry args={[0.36, 24, 16]} />
            <Skin color="#2D6A4F" skin={skin} />
          </mesh>
          <mesh position={[0, 0, 0.19]} scale={[0.82, 1.12, 0.25]}>
            <sphereGeometry args={[0.31, 24, 16]} />
            <Skin color="#B7D77A" skin={skin} />
          </mesh>
          <mesh position={[0, -0.05, 0.28]}>
            <sphereGeometry args={[0.13, 20, 12]} />
            <Skin color="#8B5E3C" skin={skin} />
          </mesh>
        </>
      );
    case "eggplant":
      return (
        <>
          <mesh rotation={[0, 0, 0.2]}>
            <capsuleGeometry args={[0.2, 0.35, 6, 16]} />
            <Skin color="#795080" skin={skin} />
          </mesh>
          <mesh position={[-0.06, 0.34, 0]}>
            <coneGeometry args={[0.18, 0.16, 8]} />
            <Skin color="#52B788" skin={skin} />
          </mesh>
          <Stem position={[-0.08, 0.45, 0]} color="#527342" />
        </>
      );
  }
}

const desktopPositions: Vec3[] = [
  [-3.1, 1.5, 0],
  [3.1, 1.4, -0.3],
  [-3, -1.5, 0.4],
  [3.2, -1.4, 0],
  [-1.6, 2.8, -0.6],
  [1.7, 2.7, -0.5],
  [-1.7, -2.7, 0],
  [1.8, -2.8, 0.2],
  [-3.7, 0, -1],
  [3.7, 0, -1],
];
const mobilePositions: Vec3[] = [
  [-1.45, 2.35, 0],
  [1.4, 2.3, -0.2],
  [-1.5, -2.35, 0],
  [1.45, -2.3, 0],
  [-1.8, 0, -0.3],
  [1.8, 0, -0.3],
];
const kinds: FoodKind[] = [
  "tomato",
  "pear",
  "orange",
  "broccoli",
  "carrot",
  "bread",
  "apple",
  "avocado",
  "lemon",
  "eggplant",
];

function FloatingFood({
  kind,
  position,
  index,
  mobile,
  reducedMotion,
  skin,
}: {
  kind: FoodKind;
  position: Vec3;
  index: number;
  skin: DataTexture;
} & SceneSettings) {
  const floating = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!floating.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    const phase = index * 0.7;
    floating.current.position.y = Math.sin(time * 0.55 + phase) * 0.08;
    floating.current.rotation.y = Math.sin(time * 0.3 + phase) * 0.25;
    floating.current.rotation.z = Math.sin(time * 0.2 + phase) * 0.06;
  });
  return (
    <group
      name={`food-${kind}`}
      position={position}
      rotation={[0.1, 0, ((index % 3) - 1) * 0.25]}
      scale={mobile ? 0.62 : 0.85}
    >
      <group ref={floating}>
        <FoodModel kind={kind} skin={skin} />
      </group>
    </group>
  );
}

export default function FoodItems({ mobile, reducedMotion }: SceneSettings) {
  const skin = useMemo(makeSkin, []);
  useEffect(() => () => skin.dispose(), [skin]);
  return (
    <>
      {kinds.slice(0, mobile ? 6 : 10).map((kind, index) => (
        <FloatingFood
          key={kind}
          kind={kind}
          index={index}
          position={(mobile ? mobilePositions : desktopPositions)[index]}
          mobile={mobile}
          reducedMotion={reducedMotion}
          skin={skin}
        />
      ))}
    </>
  );
}
