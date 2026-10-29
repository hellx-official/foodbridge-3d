import { Quote } from "lucide-react";
import { memo } from "react";
import { testimonials } from "@/data/rescues";

function Testimonials() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="bg-forest/55 px-6 py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">The people behind the pickups</p>
          <h2 id="stories-title" className="section-title">
            Built around people.
          </h2>
          <p className="body-copy mt-5">
            Different neighborhoods. The same belief: good food belongs on a
            plate.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((person) => (
            <figure key={person.name} className="glass-card flex flex-col">
              <Quote
                size={24}
                className="mb-6 text-sage/60"
                aria-hidden="true"
              />
              <blockquote className="flex-1 text-sm leading-7 text-cream/70">
                “{person.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-white/10 pt-6">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold ${person.color}`}
                  aria-hidden="true"
                >
                  {person.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {person.name}
                  </span>
                  <span className="mt-1 block text-sm text-cream/50">
                    {person.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-cream/60">
          Illustrative stories from our demo community, not verified
          testimonials.
        </p>
      </div>
    </section>
  );
}

export default memo(Testimonials);
