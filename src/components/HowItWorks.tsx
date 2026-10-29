"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bike, HandHeart, UtensilsCrossed } from "lucide-react";

const steps = [
  {
    icon: UtensilsCrossed,
    title: "Share your surplus",
    description:
      "Restaurants list good food that didn’t find a home. A few details, a pickup window, and you’re ready to give it a second chance.",
  },
  {
    icon: HandHeart,
    title: "Find a local match",
    description:
      "Shelters, community groups, and volunteers discover nearby food and claim what their neighborhood needs.",
  },
  {
    icon: Bike,
    title: "Pick up. Pass it on.",
    description:
      "A quick local pickup brings people together, puts fresh food on the table, and keeps perfectly good meals out of landfill.",
  },
];

export default function HowItWorks() {
  const reducedMotion = useReducedMotion();
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="bg-forest/55 px-6 py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Less waste. More possibility.</p>
          <h2 id="how-it-works-title" className="section-title">
            How It Works
          </h2>
          <p className="body-copy mt-5">
            Three simple steps. One stronger community.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              key={title}
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card group transition-colors hover:border-sage/30"
            >
              <div className="mb-9 flex items-center justify-between">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/10">
                  <Icon
                    size={40}
                    strokeWidth={1.5}
                    className="text-sage"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-heading text-sm text-sage/70">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-cream/70">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
