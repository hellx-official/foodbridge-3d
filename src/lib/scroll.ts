"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // The camera reads a passive scroll ref; ScrollTrigger is registered for the
  // requested stack but must not run expensive automatic layout refreshes.
  ScrollTrigger.config({ autoRefreshEvents: "" });
}

export let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;
let owners = 0;

/** Client-only, reference-counted initialization is safe in React StrictMode. */
export function startScroll() {
  owners += 1;
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopScroll() {
  owners = Math.max(0, owners - 1);
  if (owners > 0) return;
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export function scrollToTop() {
  const immediate = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "instant" : "smooth" });
}

export function navigateToSection(hash: string) {
  const target = document.getElementById(hash.replace(/^#/, ""));
  if (!target) return;
  const immediate = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const focus = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (lenis)
    lenis.scrollTo(target, { offset: -80, immediate, onComplete: focus });
  else {
    target.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
    focus();
  }
  window.history.replaceState(null, "", hash);
}

export function selectContactRole(role: string) {
  window.dispatchEvent(new CustomEvent("foodbridge:role", { detail: role }));
}
