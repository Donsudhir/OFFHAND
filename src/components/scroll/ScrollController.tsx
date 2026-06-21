"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { MODULE_COUNT } from "@/config/layout";
import { useOS } from "@/state/useOS";

/** Total scroll length: ~1.5 screens per module + intro + outro headroom. */
const SCROLL_VH = Math.round(MODULE_COUNT * 150 + 260);

/**
 * ScrollController — owns the page's scroll.
 * Renders a tall invisible spacer to create scroll range, runs Lenis for smooth
 * virtual scroll once the OS is live, and writes 0..1 progress to the store
 * (consumed by the camera rig). Falls back to native scroll for reduced-motion.
 */
export default function ScrollController() {
  const phase = useOS((s) => s.phase);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (phase === "boot") return;

    const setProgress = useOS.getState().setProgress;
    const reduced = useOS.getState().reducedMotion;

    // Start every entry into the world at the top.
    window.scrollTo(0, 0);

    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setProgress(progress);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [phase]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "1px",
        height: `${SCROLL_VH}svh`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
