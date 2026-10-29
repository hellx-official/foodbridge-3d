"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LoadingScreen({ ready = false }: { ready?: boolean }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setHidden(true), 650);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Portal out of the canvas's z-0 stacking context so the loader really is
  // above the page, without changing the requested scene composition.
  if (hidden || !mounted) return null;
  return createPortal(
    <output
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-forest transition-opacity duration-[600ms] ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
      aria-label="Loading the FoodBridge experience"
      aria-hidden={ready}
    >
      <div className="flex items-center gap-4">
        <span className="font-heading text-3xl font-bold tracking-tight">
          FoodBridge
        </span>
        <span className="h-3 w-3 animate-pulse rounded-full bg-sage" />
      </div>
    </output>,
    document.body,
  );
}
