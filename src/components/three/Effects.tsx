import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { MaskFunction } from "postprocessing";

export default function Effects({ mobile }: { mobile: boolean }) {
  return (
    <EffectComposer multisampling={mobile ? 0 : 2}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      {!mobile && (
        <DepthOfField
          ref={(effect) => {
            // The default mask forces alpha to one, covering the DOM behind the canvas.
            if (effect) effect.maskFunction = MaskFunction.MULTIPLY_RGB;
          }}
          focusDistance={0}
          focalLength={0.02}
          // Focus on the globe's near side as the existing camera zooms out.
          focusRange={4}
          target={[0, 0, 1.5]}
          bokehScale={2}
        />
      )}
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  );
}
