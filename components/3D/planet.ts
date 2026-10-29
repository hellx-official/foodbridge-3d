import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import type * as THREE from "three";

/** Keep the original scroll choreography separate from the scene's visual effects. */
const initPlanet = (camera: THREE.Camera): (() => void) => {
  gsap.registerPlugin(ScrollTrigger);

  const context = gsap.context(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero_main",
          start: () => "top top",
          scrub: 3,
          anticipatePin: 1,
          pin: true,
        },
      })
      .to(
        ".hero_main .content",
        {
          filter: `blur(40px)`,
          autoAlpha: 0,
          scale: 0.5,
          duration: 2,
          ease: "power1.inOut",
        },
        "setting",
      )
      .to(
        camera.position,
        {
          y: 0.1,
          z: window.innerWidth > 768 ? 19 : 30,
          x: window.innerWidth > 768 ? 0 : 0.1,
          duration: 2,
          ease: "power1.inOut",
        },
        "setting",
      );
  });

  gsap.ticker.lagSmoothing(0);
  return () => context.revert();
};

export default initPlanet;
