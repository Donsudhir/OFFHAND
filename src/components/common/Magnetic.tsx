"use client";

import { createElement, ReactNode, ElementType } from "react";
import { useMagnetic } from "@/lib/hooks";

/**
 * Magnetic — wraps content so it eases toward the pointer as one unit
 * (label + affordance move together). Great for buttons/links.
 */
export default function Magnetic({
  children,
  as = "div",
  strength = 0.23,
  className,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  strength?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return createElement(as, { ref, className, ...rest }, children);
}
