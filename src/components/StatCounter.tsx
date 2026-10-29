"use client";

import { useCountUp } from "@/hooks/useCountUp";
import type { Metric } from "@/types";

export default function StatCounter({
  metric,
  large = false,
}: {
  metric: Metric;
  large?: boolean;
}) {
  const { ref, display, final } = useCountUp(
    metric.value,
    2000,
    metric.decimals,
  );
  return (
    <div>
      <p
        className={`font-heading font-bold tracking-tight text-sage ${large ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl"}`}
      >
        <span className="sr-only">
          {final}
          {metric.suffix}
        </span>
        <span ref={ref} aria-hidden="true">
          {display}
          {metric.suffix}
        </span>
      </p>
      <p
        className={`mt-2 text-cream/60 ${large ? "text-sm" : "text-xs md:text-sm"}`}
      >
        {metric.label}
      </p>
    </div>
  );
}
