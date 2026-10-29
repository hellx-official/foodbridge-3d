"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  HandHeart,
  UtensilsCrossed,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import type { ContactRole } from "@/types";

export default function ContactCTA() {
  const [role, setRole] = useState<ContactRole | "">("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const onRole = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (
        value === "restaurant" ||
        value === "shelter" ||
        value === "volunteer"
      )
        setRole(value);
    };
    window.addEventListener("foodbridge:role", onRole);
    return () => window.removeEventListener("foodbridge:role", onRole);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const chooseRole = (value: ContactRole) => {
    setRole(value);
    document.getElementById("contact-name")?.focus({ preventScroll: true });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setRole("");
    setToast(true);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-forest/55 px-6 py-32 md:py-40"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="eyebrow mb-4">There’s a place for you here</p>
          <h2 id="contact-title" className="section-title">
            Let’s bridge the gap.
          </h2>
          <p className="body-copy mx-auto mt-5 max-w-xl">
            Have food to share? Need a hand? Help build a neighborhood where
            nothing good goes to waste.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          <article className="glass-card">
            <UtensilsCrossed
              size={28}
              className="mb-5 text-sage"
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold">For Restaurants</h3>
            <p className="mt-3 text-sm leading-6 text-cream/70">
              Your surplus can be someone’s next meal.
              <br />
              Let’s give good food a greater purpose.
            </p>
            <button
              type="button"
              onClick={() => chooseRole("restaurant")}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sage hover:text-cream"
            >
              List your surplus <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </article>
          <article className="glass-card">
            <HandHeart
              size={28}
              className="mb-5 text-sage"
              aria-hidden="true"
            />
            <h3 className="text-xl font-bold">For Shelters</h3>
            <p className="mt-3 text-sm leading-6 text-cream/70">
              More fresh food. More support for your community.
              <br />
              Let’s find your next neighborhood connection.
            </p>
            <button
              type="button"
              onClick={() => chooseRole("shelter")}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sage hover:text-cream"
            >
              Become a pickup partner{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </article>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 grid gap-5 rounded-2xl border border-white/10 bg-forest/60 p-6 backdrop-blur-md md:p-8"
          aria-label="Contact FoodBridge"
          aria-describedby="contact-demo-note"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="field-label">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="field-label">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@organization.com"
                className="field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-role" className="field-label">
              I am a…
            </label>
            <select
              id="contact-role"
              name="role"
              required
              value={role}
              onChange={(event) =>
                setRole(event.target.value as ContactRole | "")
              }
              className="field"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="restaurant">Restaurant or food business</option>
              <option value="shelter">Shelter or community organization</option>
              <option value="volunteer">Volunteer or community member</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="field-label">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              placeholder="Tell us a little about how you’d like to get involved…"
              className="field resize-y"
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p
              id="contact-demo-note"
              className="max-w-sm text-xs leading-5 text-cream/50"
            >
              Interactive demo only. Please don’t enter sensitive information.
              Nothing is sent or stored.
            </p>
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage hover:text-forest"
            >
              Send message <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <output className="fixed bottom-6 right-6 z-[70] flex max-w-[calc(100%-3rem)] items-start gap-3 rounded-lg bg-sage px-4 py-3 text-sm text-forest shadow-xl">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>
            <strong className="block font-semibold">
              Thanks for reaching out!
            </strong>
            This demo didn’t send or store your message.
          </span>
        </output>
      )}
    </section>
  );
}
