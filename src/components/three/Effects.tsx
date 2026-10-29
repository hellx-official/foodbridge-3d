"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/** Desktop only. No depth-of-field or chromatic aberration: keep the scene crisp. */
export default function Effects() {
  return (
    <EffectComposer multisampling={2} enableNormalPass={false}>
      <Bloom intensity={0.5} luminanceThreshold={0.6} mipmapBlur />
      <Vignette eskil={false} offset={0.2} darkness={0.6} />
    </EffectComposer>
  );
}
