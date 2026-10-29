"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-sage"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
