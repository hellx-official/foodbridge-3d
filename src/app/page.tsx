"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import BackToTop from "@/components/BackToTop";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";
import LiveRescues from "@/components/LiveRescues";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Testimonials from "@/components/Testimonials";
import { startScroll, stopScroll } from "@/lib/scroll";

// The page is a client boundary because it owns the browser-only WebGL and
// smooth-scroll lifecycles. All WebGL code stays out of the server render.
const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

export default function Home() {
  useEffect(() => {
    startScroll();
    return stopScroll;
  }, []);

  return (
    <div className="noise relative min-h-screen bg-forest text-cream">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </div>

      <ScrollProgress />

      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <LiveRescues />
        <ImpactStats />
        <Testimonials />
        <ContactCTA />
        <Footer />
      </main>

      <BackToTop />
    </div>
  );
}
