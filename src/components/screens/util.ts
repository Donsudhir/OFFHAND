/** Small math/format helpers shared by the module screens. */

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Local 0..1 progress within the window [a, b] of a global progress p. */
export const seg = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));

/** Eased count from `from`→`to` as p goes 0→1, with thousands separators. */
export const count = (p: number, from: number, to: number, dec = 0) => {
  const v = lerp(from, to, clamp01(p));
  return v.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
};

export const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

/** Staggered reveal: item i of n reaching full at p. Returns 0..1 for item i. */
export const stagger = (p: number, i: number, n: number, overlap = 0.5) => {
  const span = 1 / (n * (1 - overlap) + overlap);
  const start = i * span * (1 - overlap);
  return clamp01((p - start) / span);
};
