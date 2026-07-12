"use client";

import { createElement, ReactNode, ElementType, CSSProperties } from "react";
import { useInView } from "@/lib/hooks";

/**
 * Reveal — fades + slides its children in when scrolled into view.
 * Uses the [data-reveal] CSS primitive in globals.css.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once, threshold: 0.2 });
  return createElement(
    as,
    {
      ref,
      className,
      "data-reveal": "",
      "data-inview": inView ? "true" : "false",
      style: { "--reveal-delay": `${delay}s` } as CSSProperties,
    },
    children
  );
}
