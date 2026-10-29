"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector2, Vector3 } from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";

export default function CameraRig({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const progressRef = useScrollProgressRef();
  const pointer = useRef(new Vector2());
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (reducedMotion) {
      pointer.current.set(0, 0);
      return;
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        1 - (event.clientY / window.innerHeight) * 2,
      );
    };
    const reset = () => pointer.current.set(0, 0);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [reducedMotion]);

  useFrame(() => {
    if (reducedMotion) return;
    const progress = progressRef.current;
    target.set(
      Math.sin(progress * Math.PI) * 0.55 + pointer.current.x * 0.3,
      Math.sin(progress * Math.PI * 2) * 0.18 + pointer.current.y * 0.2,
      8 + progress * 3.5,
    );
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}
