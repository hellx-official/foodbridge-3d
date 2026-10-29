"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, HeartHandshake, Leaf } from "lucide-react";
import { heroMetrics } from "@/data/rescues";
import { selectContactRole } from "@/lib/scroll";
import SectionLink from "./SectionLink";
import StatCounter from "./StatCounter";

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-28 text-center"
    >
      <div
        className="hero-shade pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative flex max-w-5xl flex-col items-center">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-sage/20 bg-forest/60 px-4 py-2 backdrop-blur-sm"
        >
          <Leaf size={14} className="text-sage" aria-hidden="true" />
          <span className="eyebrow text-[10px] sm:text-xs">
            Good food. Greater good.
          </span>
        </motion.div>
        <h1
          id="hero-title"
          className="font-heading text-5xl font-bold leading-[1.06] tracking-tight [text-shadow:0_2px_24px_rgba(10,31,10,0.6)] md:text-7xl lg:text-8xl"
        >
          <span className="block">Rescue Food. </span>
          <span className="block text-sage">Feed People. </span>
          <span className="block">Zero Waste.</span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">
          Connecting restaurants with surplus food to shelters and families —
          before it hits the landfill.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <SectionLink
            href="#contact"
            onClick={() => selectContactRole("restaurant")}
            className="button-primary"
          >
            I’m a Restaurant <ArrowUpRight size={17} aria-hidden="true" />
          </SectionLink>
          <SectionLink
            href="#live-rescues"
            onClick={() => selectContactRole("shelter")}
            className="button-secondary"
          >
            <HeartHandshake size={18} aria-hidden="true" /> I Need Food
          </SectionLink>
        </div>
        <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-8 md:grid-cols-4 md:gap-8">
          {heroMetrics.map((metric) => (
            <StatCounter key={metric.label} metric={metric} />
          ))}
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-cream/60">
          A growing community. Illustrative impact.
        </p>
      </div>
      <motion.div
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-6 left-0 flex w-full justify-center"
        aria-hidden="true"
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex items-center gap-2 text-xs text-cream/50"
        >
          <ArrowDown size={14} /> Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
}
