"use client";

import { create } from "zustand";

/**
 * OFFHAND OS — global runtime state.
 *
 * Lives outside the React tree so it can be read/written from both the DOM HUD
 * and inside the R3F <Canvas> (which is a separate reconciler / React context).
 */

/** High-level lifecycle of the experience. */
export type Phase =
  | "boot" // Act 0 — cold boot / POST log
  | "waking" // boot → world transition (CRT flatten, palette resolve)
  | "live"; // Act 1+ — the running OS

/** Cursor reticle modes, surfaced in the HUD + custom cursor. */
export type CursorMode = "fly" | "scroll" | "dive" | "idle";

/** The eight service modules, in journey order. */
export const SECTIONS = [
  "WEBSITES",
  "CRM",
  "MARKETING",
  "SOCIAL",
  "ADS",
  "AUTOMATION",
  "SAAS",
  "PRESENCE",
] as const;

export type SectionName = (typeof SECTIONS)[number];

interface OSState {
  phase: Phase;
  /** 0..1 global scroll progress across the whole journey. */
  progress: number;
  /** Index into SECTIONS for the currently focused module. */
  section: number;
  cursor: CursorMode;
  /** Live pointer in normalized device coords (-1..1). */
  pointer: { x: number; y: number };
  soundOn: boolean;
  reducedMotion: boolean;
  booted: boolean; // POST sequence finished, wordmark assembled

  setPhase: (p: Phase) => void;
  setProgress: (n: number) => void;
  setSection: (i: number) => void;
  setCursor: (c: CursorMode) => void;
  setPointer: (x: number, y: number) => void;
  toggleSound: () => void;
  setReducedMotion: (b: boolean) => void;
  setBooted: (b: boolean) => void;
  /** Trigger the boot → world transition. */
  wake: () => void;
}

export const useOS = create<OSState>((set, get) => ({
  phase: "boot",
  progress: 0,
  section: 0,
  cursor: "idle",
  pointer: { x: 0, y: 0 },
  soundOn: false,
  reducedMotion: false,
  booted: false,

  setPhase: (p) => set({ phase: p }),
  setProgress: (n) => set({ progress: clamp01(n) }),
  setSection: (i) => set({ section: i }),
  setCursor: (c) => set({ cursor: c }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setReducedMotion: (b) => set({ reducedMotion: b }),
  setBooted: (b) => set({ booted: b }),

  wake: () => {
    if (get().phase !== "boot") return;
    set({ phase: "waking", cursor: "fly" });
    // Flip the document palette from phosphor boot → newsprint world.
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-mode");
    }
  },
}));

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
