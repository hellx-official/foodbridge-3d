import { ContactShadows, MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type FoodKind = "tomato" | "pear" | "citrus";

type FruitSurfaceProps = {
  reducedMotion: boolean;
  skin: THREE.DataTexture;
};
type FoodProps = {
  kind: FoodKind;
  position: [number, number, number];
  rotation: [number, number, number];
  reducedMotion: boolean;
  mobile: boolean;
};

function makeSkinTexture() {
  const width = 128;
  const pixels = new Uint8Array(width * width * 4);
  let seed = 1439;
  for (let i = 0; i < width * width; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 105 + (seed % 75);
    pixels[i * 4] = pixels[i * 4 + 1] = pixels[i * 4 + 2] = value;
    pixels[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(pixels, width, width, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function makeTomatoGeometry() {
  const geometry = new THREE.SphereGeometry(0.43, 48, 32);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const angle = Math.atan2(z, x);
    const equator = Math.max(0, 1 - (y / 0.43) ** 2);
    const lobes = 1 + 0.045 * Math.cos(5 * angle) * equator;
    positions.setXYZ(i, x * lobes, y * 0.88, z * lobes);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function makePearGeometry() {
  const profile = new THREE.SplineCurve([
    new THREE.Vector2(0, -0.5),
    new THREE.Vector2(0.25, -0.48),
    new THREE.Vector2(0.37, -0.37),
    new THREE.Vector2(0.39, -0.2),
    new THREE.Vector2(0.34, -0.02),
    new THREE.Vector2(0.24, 0.17),
    new THREE.Vector2(0.17, 0.36),
    new THREE.Vector2(0.11, 0.46),
    new THREE.Vector2(0, 0.48),
  ]);
  return new THREE.LatheGeometry(profile.getPoints(48), 48);
}

function Leaf({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.11, 0.04, 0.12, 0.2, 0, 0.29);
    shape.bezierCurveTo(-0.12, 0.2, -0.11, 0.04, 0, 0);
    return new THREE.ShapeGeometry(shape, 16);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshPhysicalMaterial
        color="#2D6A4F"
        emissive="#174c34"
        emissiveIntensity={0.18}
        roughness={0.35}
        metalness={0.05}
        clearcoat={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Tomato({ reducedMotion, skin }: FruitSurfaceProps) {
  const geometry = useMemo(makeTomatoGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <>
      <mesh geometry={geometry} castShadow>
        <MeshDistortMaterial
          color="#FF6B6B"
          emissive="#FF6B6B"
          emissiveIntensity={0.16}
          bumpMap={skin}
          bumpScale={0.012}
          distort={0.22}
          speed={reducedMotion ? 0 : 2}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle) => (
        <group
          key={angle}
          position={[0, 0.37, 0]}
          rotation={[0, THREE.MathUtils.degToRad(angle), 0]}
        >
          <Leaf rotation={[-Math.PI / 2.3, 0, 0]} scale={0.78} />
        </group>
      ))}
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, -0.12]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.18, 12]} />
        <meshPhysicalMaterial color="#365b36" roughness={0.6} />
      </mesh>
    </>
  );
}

function Pear({ reducedMotion, skin }: FruitSurfaceProps) {
  const geometry = useMemo(makePearGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <>
      <mesh geometry={geometry} castShadow>
        <MeshDistortMaterial
          color="#E5B95C"
          emissive="#dca64b"
          emissiveIntensity={0.12}
          bumpMap={skin}
          bumpScale={0.018}
          distort={0.17}
          speed={reducedMotion ? 0 : 1.5}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.53, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.18, 12]} />
        <meshPhysicalMaterial color="#665038" roughness={0.7} />
      </mesh>
      <Leaf position={[0.015, 0.55, 0]} rotation={[0.2, -0.4, -1.1]} />
    </>
  );
}

function Citrus({ reducedMotion, skin }: FruitSurfaceProps) {
  return (
    <>
      <mesh scale={[1, 0.92, 1]} castShadow>
        <sphereGeometry args={[0.36, 48, 32]} />
        <MeshDistortMaterial
          color="#F4A261"
          emissive="#f19749"
          emissiveIntensity={0.14}
          bumpMap={skin}
          bumpScale={0.03}
          distort={0.19}
          speed={reducedMotion ? 0 : 1.7}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.13, 12]} />
        <meshPhysicalMaterial color="#665038" roughness={0.7} />
      </mesh>
      <Leaf position={[0, 0.38, 0]} rotation={[0.15, 0.3, -1.05]} scale={0.8} />
    </>
  );
}

function FloatingFood({
  kind,
  position,
  rotation,
  reducedMotion,
  mobile,
  skin,
}: FoodProps & { skin: THREE.DataTexture }) {
  const floating = useRef<THREE.Group>(null);
  const phase = kind === "tomato" ? 0 : kind === "pear" ? 2 : 4;

  useFrame((state) => {
    if (!floating.current) return;
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    floating.current.position.y = Math.sin(time * 0.55 + phase) * 0.06;
    floating.current.rotation.y = Math.sin(time * 0.35 + phase) * 0.12;
  });

  return (
    <group position={position} rotation={rotation} scale={mobile ? 0.8 : 1}>
      <group ref={floating}>
        {kind === "tomato" && (
          <Tomato reducedMotion={reducedMotion} skin={skin} />
        )}
        {kind === "pear" && <Pear reducedMotion={reducedMotion} skin={skin} />}
        {kind === "citrus" && (
          <Citrus reducedMotion={reducedMotion} skin={skin} />
        )}
      </group>
      <ContactShadows
        position={[0, -0.62, 0]}
        opacity={0.2}
        scale={1.35}
        blur={2.5}
        far={1.5}
        resolution={128}
        frames={1}
        smooth={false}
        color="#1b4332"
      />
    </group>
  );
}

export default function Food({
  mobile,
  reducedMotion,
}: {
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const skin = useMemo(makeSkinTexture, []);
  useEffect(() => () => skin.dispose(), [skin]);

  return (
    <>
      <FloatingFood
        skin={skin}
        kind="tomato"
        position={mobile ? [-1.08, 2.48, 0] : [-2.9, 0.75, 0]}
        rotation={[0.1, 0, -0.2]}
        mobile={mobile}
        reducedMotion={reducedMotion}
      />
      <FloatingFood
        skin={skin}
        kind="pear"
        position={mobile ? [1.05, 2.42, -0.2] : [2.85, 1.0, -0.15]}
        rotation={[0.08, 0, 0.28]}
        mobile={mobile}
        reducedMotion={reducedMotion}
      />
      <FloatingFood
        skin={skin}
        kind="citrus"
        position={mobile ? [1.05, -2.45, -0.15] : [2.95, -1.25, 0.1]}
        rotation={[0.05, 0, -0.3]}
        mobile={mobile}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
