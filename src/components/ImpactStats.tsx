import { impactMetrics, monthlyMeals } from "@/data/rescues";
import StatCounter from "./StatCounter";

export default function ImpactStats() {
  const max = Math.max(...monthlyMeals.map((month) => month.meals));
  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className="bg-black/40 px-6 py-32 backdrop-blur-sm md:py-40"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="eyebrow mb-4">Our collective ripple effect</p>
        <h2 id="impact-title" className="section-title">
          Every meal adds up.
        </h2>
        <p className="body-copy mx-auto mt-5 max-w-xl">
          Behind every number is food shared, a neighborhood connected, and a
          little less waste.
        </p>
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {impactMetrics.map((metric) => (
            <StatCounter key={metric.label} metric={metric} large />
          ))}
        </div>
        <figure className="mx-auto mt-20 max-w-3xl rounded-2xl border border-white/10 bg-forest/40 p-6 md:p-8">
          <figcaption
            id="chart-caption"
            className="mb-10 flex flex-col justify-between gap-2 text-left sm:flex-row"
          >
            <span className="text-sm font-semibold">
              Meals rescued, month by month
            </span>
            <span className="text-xs text-cream/50">
              May–October 2026 · Sample data
            </span>
          </figcaption>
          <ol
            className="flex h-32 items-end gap-3 md:gap-5"
            aria-label="Monthly meals rescued"
          >
            {monthlyMeals.map(({ month, meals }) => (
              <li
                key={month}
                className="relative flex-1 rounded-t bg-primary transition-colors hover:bg-sage"
                style={{ height: `${(meals / max) * 100}%` }}
                aria-label={`${month}: ${meals.toLocaleString("en-US")} meals`}
              >
                <span
                  className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-cream/60 md:text-xs"
                  aria-hidden="true"
                >
                  {meals.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ol>
          <div
            className="mt-3 grid grid-cols-6 gap-3 text-xs text-cream/50 md:gap-5"
            aria-hidden="true"
          >
            {monthlyMeals.map(({ month }) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </figure>
        <blockquote className="mx-auto mt-14 max-w-2xl text-lg italic leading-relaxed text-cream/70 md:text-xl">
          “The most sustainable meal is the one that already exists. Let’s make
          sure it reaches someone.”
        </blockquote>
        <p className="mt-4 text-xs text-cream/60">
          The FoodBridge idea · All impact figures are illustrative.
        </p>
      </div>
    </section>
  );
}
