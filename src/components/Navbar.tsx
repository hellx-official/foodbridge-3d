"use client";

import { ArrowUpRight, Leaf, Menu, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { lenis, navigateToSection, selectContactRole } from "@/lib/scroll";
import SectionLink from "./SectionLink";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#live-rescues", label: "Live rescues" },
  { href: "#impact", label: "Our impact" },
  { href: "#contact", label: "Contact" },
] as const;

function Navbar() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open]);

  const navigateMobile = (href: string) => {
    dialog.current?.close();
    setOpen(false);
    lenis?.start();
    navigateToSection(href);
  };

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/5 bg-forest/60 px-6 backdrop-blur-md"
      >
        <SectionLink
          href="#home"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
          aria-label="FoodBridge home"
        >
          <Leaf size={22} className="text-sage" aria-hidden="true" /> FoodBridge
        </SectionLink>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <SectionLink
              key={link.href}
              href={link.href}
              className="text-sm text-cream/70 transition-colors hover:text-sage"
            >
              {link.label}
            </SectionLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SectionLink
            href="#contact"
            onClick={() => selectContactRole("restaurant")}
            className="button-coral hidden sm:inline-flex"
          >
            List Your Food <ArrowUpRight size={15} aria-hidden="true" />
          </SectionLink>
          <button
            type="button"
            className="icon-button md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={23} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <dialog
        id="mobile-menu"
        ref={dialog}
        aria-label="Mobile navigation"
        data-lenis-prevent
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-forest px-6 py-5 text-cream"
        onClose={() => setOpen(false)}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-heading text-xl font-bold">
            <Leaf size={22} className="text-sage" aria-hidden="true" />{" "}
            FoodBridge
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={() => {
              dialog.current?.close();
              setOpen(false);
            }}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="flex h-[75vh] flex-col justify-center gap-7">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-3xl font-bold tracking-tight transition-colors hover:text-sage"
              onClick={(event) => {
                event.preventDefault();
                navigateMobile(link.href);
              }}
            >
              <span className="mr-4 font-sans text-xs text-sage/60">
                0{index + 1}
              </span>
              {link.label}
            </a>
          ))}
          <SectionLink
            href="#contact"
            className="button-coral mt-4 self-start"
            onClick={(event) => {
              event.preventDefault();
              selectContactRole("restaurant");
              navigateMobile("#contact");
            }}
          >
            List Your Food <ArrowUpRight size={16} aria-hidden="true" />
          </SectionLink>
          <p className="mt-5 text-sm text-cream/50">Good food. Greater good.</p>
        </div>
      </dialog>
    </>
  );
}

export default memo(Navbar);
