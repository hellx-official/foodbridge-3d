"use client";

import type { ComponentPropsWithoutRef } from "react";
import { navigateToSection } from "@/lib/scroll";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: `#${string}`;
};

export default function SectionLink({ href, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        event.preventDefault();
        navigateToSection(href);
      }}
    />
  );
}
