/**
 * OFFHAND OS — Journey timeline.
 *
 * Maps the single 0..1 scroll progress into the nested "travel → dock →
 * inner-scroll → release" experience without brittle scroll-hijacking:
 *
 *   intro  →  [ approach module i → dwell on module i ] × 8  →  outro/CTA
 *
 * During a module's APPROACH the camera travels to its dock pose. During the
 * DWELL the camera holds and the module's screen drives its own inner scroll
 * (and a deep-dive in the dwell's tail). Both the camera rig and the DOM screen
 * layer derive their state from this one pure function, so they always agree.
 */

export const CAM_SEGMENTS = 9; // establishing + 8 modules + core  →  10 pts, 9 gaps
export const MODULE_COUNT = 8;

export const INTRO = 0.03; // hero hold at the establishing shot
export const OUTRO = 0.12; // travel to core + CTA handoff
export const APPROACH = 0.42; // fraction of a module slice spent travelling
export const MODULE_SPAN = (1 - INTRO - OUTRO) / MODULE_COUNT;
export const DEEP_DIVE_AT = 0.78; // dwell progress where L2 (deep-dive) begins

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoother = (x: number) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Camera-curve parameter where module i is framed (dock pose). */
export const dockU = (i: number) => (i + 1) / CAM_SEGMENTS;

export interface JourneyState {
  /** Parameter along the camera curve, 0..1. */
  curveU: number;
  /** -1 intro · 0..7 a module · 8 core/CTA. */
  moduleIndex: number;
  /** 0..1 inner-scroll progress while docked (0 during approach). */
  dwell: number;
  /** True once dwell has entered the deep-dive (L2) tail. */
  deep: boolean;
  /** 0..1 progress through the outro / CTA handoff. */
  cta: number;
}

export function journeyState(p: number): JourneyState {
  // Intro: hold the establishing shot.
  if (p <= INTRO) {
    return { curveU: 0, moduleIndex: -1, dwell: 0, deep: false, cta: 0 };
  }

  // Outro: travel from the last module to the core, then CTA.
  if (p >= 1 - OUTRO) {
    const t = clamp01((p - (1 - OUTRO)) / OUTRO);
    return {
      curveU: lerp(dockU(MODULE_COUNT - 1), 1, smoother(t)),
      moduleIndex: MODULE_COUNT,
      dwell: 0,
      deep: false,
      cta: t,
    };
  }

  // Modules: split each slice into approach (travel) + dwell (inner scroll).
  const local = p - INTRO;
  const i = Math.min(MODULE_COUNT - 1, Math.floor(local / MODULE_SPAN));
  const f = (local - i * MODULE_SPAN) / MODULE_SPAN; // 0..1 within this module
  const prevU = i === 0 ? 0 : dockU(i - 1);

  if (f < APPROACH) {
    const af = smoother(f / APPROACH);
    return {
      curveU: lerp(prevU, dockU(i), af),
      moduleIndex: i,
      dwell: 0,
      deep: false,
      cta: 0,
    };
  }

  const dwell = (f - APPROACH) / (1 - APPROACH);
  return {
    curveU: dockU(i),
    moduleIndex: i,
    dwell,
    deep: dwell >= DEEP_DIVE_AT,
    cta: 0,
  };
}

/** Remap a dwell value so L1 inner-scroll occupies [0, DEEP_DIVE_AT] → 0..1. */
export const innerL1 = (dwell: number) =>
  clamp01(dwell / DEEP_DIVE_AT);

/** Remap a dwell value so the deep-dive tail occupies [DEEP_DIVE_AT, 1] → 0..1. */
export const innerL2 = (dwell: number) =>
  clamp01((dwell - DEEP_DIVE_AT) / (1 - DEEP_DIVE_AT));
