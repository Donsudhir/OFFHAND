"use client";

import { create } from "zustand";

/**
 * Site scroll state (v2). One smooth 0..1 progress for the whole page, written
 * by Lenis and read by the 3D camera rig + world "aliveness". Lives outside the
 * React tree so the R3F frame loop can read it cheaply.
 */
interface SiteScroll {
  progress: number;
  velocity: number;
  setProgress: (p: number, v?: number) => void;
}

export const useSiteScroll = create<SiteScroll>((set) => ({
  progress: 0,
  velocity: 0,
  setProgress: (p, v = 0) =>
    set({ progress: p < 0 ? 0 : p > 1 ? 1 : p, velocity: v }),
}));
