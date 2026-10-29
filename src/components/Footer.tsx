"use client";

import { Github, Instagram, Leaf, Linkedin, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import SectionLink from "./SectionLink";

const information = {
  about: {
    title: "Good food. Greater good.",
    text: "FoodBridge is a concept for connecting food businesses with the people and organizations who can put surplus food to good use. This site is an interactive frontend demonstration, not an operating food-distribution service.",
  },
  mission: {
    title: "A second chance for every meal",
    text: "Our idea is simple: make local food sharing easier, keep good food out of landfill, and help neighborhoods support one another. The listings, stories, and impact figures on this site are illustrative.",
  },
  privacy: {
    title: "Privacy in this demo",
    text: "This demo has no backend, analytics, or database. Form entries are not transmitted or saved. Demo claims exist only in memory and reset when the page reloads. External social links open third-party websites with their own privacy policies.",
  },
  terms: {
    title: "Demo terms",
    text: "This website is a prototype. No food reservation, donation, delivery, or agreement is created by using it. All locations, availability, metrics, and stories are sample content. A real service requires verified partners, food-safety procedures, and operational terms.",
  },
  accessibility: {
    title: "Everyone at the table",
    text: "FoodBridge includes keyboard navigation, labeled forms, semantic sections, visible focus indicators, reduced-motion support, and a text-first experience when WebGL is unavailable. Automated checks support, but do not replace, testing with assistive technology.",
  },
};

type InfoKey = keyof typeof information;

function Footer() {
  const [info, setInfo] = useState<InfoKey | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (info) dialog.current?.showModal();
    else dialog.current?.close();
  }, [info]);
  const infoButton = (key: InfoKey, label: string) => (
    <button
      type="button"
      onClick={() => setInfo(key)}
      className="min-h-8 text-left transition-colors hover:text-cream"
    >
      {label}
    </button>
  );

  return (
    <footer className="border-t border-white/5 bg-charcoal px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <SectionLink
              href="#home"
              className="inline-flex items-center gap-2 font-heading text-xl font-bold"
            >
              <Leaf size={22} className="text-sage" aria-hidden="true" />{" "}
              FoodBridge
            </SectionLink>
            <p className="mt-4 max-w-xs text-sm leading-6 text-cream/50">
              Rescue food. Feed people.
              <br />A little less waste. A lot more good.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold">Platform</h3>
            <div className="flex flex-col items-start gap-2 text-sm text-cream/50">
              <SectionLink
                href="#how-it-works"
                className="inline-flex min-h-8 items-center hover:text-cream"
              >
                How it works
              </SectionLink>
              <SectionLink
                href="#live-rescues"
                className="inline-flex min-h-8 items-center hover:text-cream"
              >
                Live rescues
              </SectionLink>
              <SectionLink
                href="#impact"
                className="inline-flex min-h-8 items-center hover:text-cream"
              >
                Our impact
              </SectionLink>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold">Company</h3>
            <div className="flex flex-col items-start gap-2 text-sm text-cream/50">
              {infoButton("about", "About FoodBridge")}
              {infoButton("mission", "Our mission")}
              <SectionLink
                href="#contact"
                className="inline-flex min-h-8 items-center hover:text-cream"
              >
                Get in touch
              </SectionLink>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold">Legal</h3>
            <div className="flex flex-col items-start gap-2 text-sm text-cream/50">
              {infoButton("privacy", "Privacy")}
              {infoButton("terms", "Terms of use")}
              {infoButton("accessibility", "Accessibility")}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-6 border-t border-white/5 pt-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-cream/60">© 2026 FoodBridge</p>
            <p className="mt-2 max-w-xl text-[11px] leading-5 text-cream/60">
              An interactive concept. Listings, stories, and impact figures are
              illustrative.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/hellx-official/foodbridge-3d"
              target="_blank"
              rel="noreferrer"
              aria-label="FoodBridge source on GitHub (opens a new tab)"
              className="icon-button text-cream/60 hover:text-cream"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram platform homepage (opens a new tab)"
              className="icon-button text-cream/60 hover:text-cream"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn platform homepage (opens a new tab)"
              className="icon-button text-cream/60 hover:text-cream"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="footer-dialog-title"
        data-lenis-prevent
        className="m-auto max-h-[85dvh] w-[calc(100%-3rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-forest p-6 text-cream md:p-8"
        onKeyDown={(event) => {
          if (event.key === "Escape") dialog.current?.close();
        }}
        onClose={() => setInfo(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {info && (
          <>
            <div className="flex items-start justify-between gap-4">
              <h2 id="footer-dialog-title" className="text-2xl font-bold">
                {information[info].title}
              </h2>
              <button
                type="button"
                className="icon-button -mr-2 -mt-2 shrink-0"
                aria-label="Close information"
                onClick={() => dialog.current?.close()}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-cream/70">
              {information[info].text}
            </p>
          </>
        )}
      </dialog>
    </footer>
  );
}

export default memo(Footer);
