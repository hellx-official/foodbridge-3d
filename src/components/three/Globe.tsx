import { MeshDistortMaterial, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import atmosphereFragment from "@/components/3D/shaders/atmosphere/fragment.glsl";
import atmosphereVertex from "@/components/3D/shaders/atmosphere/vertex.glsl";

export default function Globe({ reducedMotion }: { reducedMotion: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const [day, night, clouds] = useTexture([
    "/earth/day.jpg",
    "/earth/night.jpg",
    "/earth/specularClouds.jpg",
  ]);

  useLayoutEffect(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    for (const texture of [day, night, clouds]) {
      texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
      texture.needsUpdate = true;
    }
  }, [clouds, day, gl, night]);

  // Keep the geographic detail legible while retaining an emerald cast.
  // Chain drei's distortion shader rather than replacing it.
  const tuneEarthMaterial = useCallback(
    (material: THREE.MeshPhysicalMaterial | null) => {
      if (!material || material.userData.earthTintConfigured) return;
      material.userData.earthTintConfigured = true;
      const distortShader = material.onBeforeCompile.bind(material);
      material.onBeforeCompile = (shader, renderer) => {
        distortShader(shader, renderer);
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          `#include <map_fragment>
        #ifdef USE_MAP
          vec3 greenMap = sampledDiffuseColor.rgb * vec3(0.75, 1.0, 0.3);
          diffuseColor.rgb = mix(diffuseColor.rgb, greenMap, 0.38);
        #endif`,
        );
      };
      material.customProgramCacheKey = () => "foodbridge-earth-tint-v1";
      material.needsUpdate = true;
    },
    [],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uOpacity: { value: 0.62 },
      uSunDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
      uAtmosphereDayColor: { value: new THREE.Color("#95e8bd") },
      uAtmosphereTwilightColor: { value: new THREE.Color("#2d6a4f") },
    }),
    [],
  );

  useFrame((state) => {
    if (globe.current && !reducedMotion) {
      globe.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group>
      <group ref={globe}>
        {/* The translucent surface lets a little of the inner light show through. */}
        <mesh renderOrder={0}>
          <sphereGeometry args={[1.85, 64, 48]} />
          <meshStandardMaterial
            color="#52B788"
            emissive="#52B788"
            emissiveIntensity={1.2}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
        <mesh castShadow receiveShadow renderOrder={1}>
          <sphereGeometry args={[2, 128, 96]} />
          <MeshDistortMaterial
            ref={tuneEarthMaterial}
            map={day}
            color="#2D6A4F"
            emissive="#a8ffd2"
            emissiveMap={night}
            emissiveIntensity={0.45}
            distort={0.2}
            speed={reducedMotion ? 0 : 1.5}
            roughness={0.3}
            metalness={0.1}
            envMapIntensity={0.65}
            specularIntensity={0.5}
            transparent
            opacity={0.96}
          />
        </mesh>
        <mesh renderOrder={2}>
          <sphereGeometry args={[2.025, 96, 64]} />
          <MeshDistortMaterial
            color="#e7fff1"
            alphaMap={clouds}
            distort={0.2}
            speed={reducedMotion ? 0 : 1.5}
            transparent
            opacity={0.13}
            depthWrite={false}
            roughness={0.8}
          />
        </mesh>
      </group>
      <mesh scale={1.13} renderOrder={3}>
        <sphereGeometry args={[2, 96, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
