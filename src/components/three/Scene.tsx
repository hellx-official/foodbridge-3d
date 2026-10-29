"use client";

import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import {
  Component,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { SceneSettings } from "@/types";

// Each WebGL module has its own browser-only boundary. Nothing in the Three
// dependency graph is evaluated during the server render.
const Globe = dynamic(() => import("./Globe"), { ssr: false });
const FoodItems = dynamic(() => import("./FoodItems"), { ssr: false });
const Particles = dynamic(() => import("./Particles"), { ssr: false });
const CameraRig = dynamic(() => import("./CameraRig"), { ssr: false });
const Effects = dynamic(() => import("./Effects"), { ssr: false });

function CssFallback({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <div className="flex h-full w-full items-center justify-center bg-forest">
      <div className="css-globe" />
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.warn("FoodBridge is using its CSS fallback:", error.message);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function World({ mobile, reducedMotion }: SceneSettings) {
  return (
    <>
      <color attach="background" args={["#0A1F0A"]} />
      <fog attach="fog" args={["#0A1F0A", 8, 30]} />
      <CameraRig reducedMotion={reducedMotion} />
      {!mobile && (
        <Suspense fallback={null}>
          {/* Drei's city preset, served locally to avoid a runtime CDN.
              Mobile uses the simpler direct-light setup below. */}
          <Environment
            files="/environment/potsdamer_platz_512.hdr"
            environmentIntensity={0.8}
          />
        </Suspense>
      )}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#FEFAE0" />
      <pointLight
        position={[-4, 2, 3]}
        intensity={18}
        distance={20}
        color="#52B788"
      />
      {!mobile && (
        <spotLight
          position={[4, 6, 5]}
          intensity={35}
          distance={25}
          angle={0.5}
          penumbra={1}
          color="#FEFAE0"
        />
      )}
      <Suspense fallback={null}>
        <Globe reducedMotion={reducedMotion} mobile={mobile} />
        <FoodItems mobile={mobile} reducedMotion={reducedMotion} />
        <Particles mobile={mobile} reducedMotion={reducedMotion} />
      </Suspense>
      {!mobile && <Effects />}
    </>
  );
}

export default function Scene() {
  const mobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <SceneBoundary fallback={<CssFallback onReady={onReady} />}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={mobile ? [1, 1] : [1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: mobile ? "low-power" : "high-performance",
        }}
        frameloop="always"
        resize={{ scroll: false }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
        fallback={<CssFallback onReady={onReady} />}
        onCreated={({ gl }) => {
          gl.setClearColor("#0A1F0A", 1);
          gl.domElement.setAttribute("aria-hidden", "true");
          onReady();
        }}
      >
        <World mobile={mobile} reducedMotion={reducedMotion} />
      </Canvas>
      <LoadingScreen ready={ready} />
    </SceneBoundary>
  );
}
