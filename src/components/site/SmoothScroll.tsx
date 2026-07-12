"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useSiteScroll } from "./useSiteScroll";

/**
 * SmoothScroll — runs Lenis for buttery, cinematic scrolling and publishes a
 * normalized 0..1 progress (+velocity) to the scroll store. Native scroll
 * fallback for reduced-motion. Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const setProgress = useSiteScroll.getState().setProgress;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0, 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on(
      "scroll",
      ({ progress, velocity }: { progress: number; velocity: number }) => {
        setProgress(progress, velocity);
      }
    );

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
