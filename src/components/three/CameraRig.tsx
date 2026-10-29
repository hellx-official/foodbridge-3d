import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import initPlanet from "@/components/3D/planet";

/**
 * The scroll timeline owns the camera's local position. Parallax moves its
 * parent instead, so pointer movement can never overwrite the scroll path.
 */
export default function CameraRig({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const rig = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());

  useLayoutEffect(() => {
    const group = rig.current;
    if (!group) return;

    group.add(camera);
    const cleanupScroll = initPlanet(camera);

    return () => {
      cleanupScroll();
      group.remove(camera);
    };
  }, [camera]);

  useEffect(() => {
    if (reducedMotion) {
      pointer.current.set(0, 0);
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        1 - (event.clientY / window.innerHeight) * 2,
      );
    };
    const resetPointer = () => pointer.current.set(0, 0);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener(
        "pointerleave",
        resetPointer,
      );
    };
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (!rig.current) return;
    // Scale the offset with the existing zoom: the opening close-up has a
    // narrow field of view, while the full globe has room for the full sway.
    const zoom = THREE.MathUtils.clamp((camera.position.z - 4.5) / 14.5, 0, 1);
    const smoothing = 1 - Math.exp(-3 * Math.min(delta, 0.1));
    rig.current.position.x +=
      (pointer.current.x * (0.12 + zoom * 0.38) - rig.current.position.x) *
      smoothing;
    rig.current.position.y +=
      (pointer.current.y * (0.08 + zoom * 0.22) - rig.current.position.y) *
      smoothing;
  });

  return <group ref={rig} />;
}
