"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import Food from "./Food";
import Globe from "./Globe";
import OrbitAccents from "./OrbitAccents";
import Particles from "./Particles";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reducedMotion;
}

function World() {
  const mobile = useThree((state) => state.size.width <= 768);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />
      {/* The local file is drei's city preset, served without a CDN dependency. */}
      <Suspense fallback={null}>
        <Environment files="/environment/potsdamer_platz_1k.hdr" />
      </Suspense>
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#2D6A4F" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#FEFAE0"
      />
      <Suspense fallback={null}>
        <Globe reducedMotion={reducedMotion} />
      </Suspense>
      <OrbitAccents reducedMotion={reducedMotion} />
      <Food mobile={mobile} reducedMotion={reducedMotion} />
      <Particles mobile={mobile} reducedMotion={reducedMotion} />
      <Effects mobile={mobile} />
    </>
  );
}

export default function Scene() {
  // Keep the old canvas's inline layout and straight-ahead camera framing;
  // Fiber otherwise defaults to a block wrapper and lookAt(0, 0, 0).
  return (
    <Canvas
      className="planet-3D"
      style={{
        display: "inline-block",
        height: "100vh",
        width: "100%",
        pointerEvents: "none",
      }}
      camera={{
        fov: 15,
        near: 0.1,
        far: 10000,
        position: [0, 2.15, 4.5],
        rotation: [0, 0, 0],
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      shadows
      aria-hidden="true"
      fallback={null}
    >
      <World />
    </Canvas>
  );
}
