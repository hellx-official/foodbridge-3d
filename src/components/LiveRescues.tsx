"use client";

import { Check, CheckCircle2, Clock3, MapPin, Package, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { rescueFilters, rescues } from "@/data/rescues";
import type { Rescue, RescueFilter } from "@/types";

export default function LiveRescues() {
  const [filter, setFilter] = useState<RescueFilter>("All rescues");
  const [selected, setSelected] = useState<Rescue | null>(null);
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = rescues.filter(
    (rescue) => filter === "All rescues" || rescue.category === filter,
  );

  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const confirmClaim = () => {
    if (!selected) return;
    setClaimed((previous) => new Set(previous).add(selected.id));
    setToast(
      `Demo claim saved for ${selected.restaurant}. No real reservation was made.`,
    );
    setSelected(null);
  };

  return (
    <section
      id="live-rescues"
      aria-labelledby="live-rescues-title"
      className="bg-forest/55 px-6 py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-red-500"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold tracking-wide">LIVE</span>
              <span className="ml-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-cream/50">
                DEMO FEED
              </span>
            </div>
            <h2 id="live-rescues-title" className="section-title">
              Good food. Ready to go.
            </h2>
            <p className="body-copy mt-5 max-w-xl">
              A second chance for today’s surplus. Find a rescue in your
              neighborhood.
            </p>
          </div>
          <p className="flex items-center gap-2 text-xs text-cream/50">
            <MapPin size={14} aria-hidden="true" /> Sample neighborhood · not
            your location
          </p>
        </div>

        <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">Filter rescues</legend>
          {rescueFilters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`min-h-11 rounded-full px-4 py-2 text-sm transition-colors ${filter === item ? "bg-primary text-white" : "bg-white/5 text-cream/60 hover:bg-white/10 hover:text-cream"}`}
            >
              {item}
              <span className="ml-2 text-xs">
                {item === "All rescues"
                  ? rescues.length
                  : rescues.filter((rescue) => rescue.category === item).length}
              </span>
            </button>
          ))}
        </fieldset>
        <p className="sr-only" aria-live="polite">
          {visible.length} rescues shown
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((rescue) => {
            const isClaimed = claimed.has(rescue.id);
            return (
              <article
                key={rescue.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans font-semibold">
                      {rescue.restaurant}
                    </h3>
                    <p className="mt-1 text-sm text-cream/50">{rescue.type}</p>
                  </div>
                  {rescue.urgent && (
                    <span className="shrink-0 rounded-full bg-coral/10 px-2 py-1 text-[10px] font-medium text-coral">
                      Pickup soon
                    </span>
                  )}
                </div>
                <p className="min-h-12 text-sm leading-6 text-cream/70">
                  {rescue.items.join(" · ")}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 px-2 py-1 text-xs text-sage">
                    <Package size={12} aria-hidden="true" />
                    {rescue.quantity} {rescue.unit}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-cream/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={12} aria-hidden="true" />
                    {rescue.pickupWindow}
                  </span>
                  <span>{rescue.distance}</span>
                </div>
                <button
                  type="button"
                  disabled={isClaimed}
                  onClick={() => setSelected(rescue)}
                  className={`mt-5 min-h-11 w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${isClaimed ? "bg-sage/15 text-sage" : "bg-coral text-forest hover:bg-coral/90"}`}
                >
                  {isClaimed ? (
                    <span className="inline-flex items-center gap-2">
                      <Check size={16} aria-hidden="true" /> Claimed in this
                      demo
                    </span>
                  ) : (
                    "Claim This"
                  )}
                </button>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs leading-5 text-cream/60">
          Sample listings and pickup windows. Claims stay in this page session;
          refreshing resets them. No food is reserved.
        </p>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="claim-title"
        aria-describedby="claim-description"
        data-lenis-prevent
        className="m-auto max-h-[85dvh] w-[calc(100%-3rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-forest p-6 text-cream shadow-2xl md:p-8"
        onKeyDown={(event) => {
          if (event.key === "Escape") dialog.current?.close();
        }}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">A little food. A lot of good.</p>
                <h3 id="claim-title" className="text-2xl font-bold">
                  Claim this rescue
                </h3>
              </div>
              <button
                type="button"
                className="icon-button -mr-2 -mt-2 shrink-0"
                aria-label="Close claim details"
                onClick={() => dialog.current?.close()}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p
              id="claim-description"
              className="mt-4 text-sm leading-6 text-cream/70"
            >
              Review this sample pickup before saving a demo claim.
            </p>
            <div className="mt-6 rounded-xl bg-white/5 p-5">
              <h4 className="font-sans font-semibold">{selected.restaurant}</h4>
              <p className="mt-2 text-sm text-cream/70">
                {selected.items.join(" · ")}
              </p>
              <p className="mt-3 text-sm text-sage">
                {selected.quantity} {selected.unit}
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-cream/50">Pickup window</dt>
                  <dd className="mt-1">{selected.pickupWindow}</dd>
                </div>
                <div>
                  <dt className="text-cream/50">Location</dt>
                  <dd className="mt-1">{selected.address}</dd>
                </div>
                <div>
                  <dt className="text-cream/50">Food information</dt>
                  <dd className="mt-1">{selected.dietary}</dd>
                </div>
              </dl>
            </div>
            <p className="mt-5 text-xs leading-5 text-cream/50">
              This is a frontend demonstration, not a real reservation. A live
              service must confirm availability, allergens, and safe pickup
              arrangements.
            </p>
            <button
              type="button"
              onClick={confirmClaim}
              className="button-coral mt-6 w-full rounded-lg"
            >
              Confirm demo claim <Check size={16} aria-hidden="true" />
            </button>
          </>
        )}
      </dialog>
      {toast && (
        <output className="fixed bottom-6 left-6 z-[70] max-w-[calc(100%-6rem)] rounded-lg bg-sage px-4 py-3 text-sm font-medium text-forest shadow-xl">
          <CheckCircle2 size={17} className="mr-2 inline" aria-hidden="true" />
          {toast}
        </output>
      )}
    </section>
  );
}
