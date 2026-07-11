"use client";

import { useMemo } from "react";
import styles from "./orb.module.css";

/**
 * Orb — a procedural, monochrome "planet / neuron" visual. Deterministic from
 * `seed`, so each project/nav item gets a distinct but on-theme sphere. Pure
 * CSS/SVG (no image assets), grayscale with a soft rim light.
 */
export default function Orb({
  seed = 1,
  className,
  spin = true,
}: {
  seed?: number;
  className?: string;
  spin?: boolean;
}) {
  const cfg = useMemo(() => {
    const rand = mulberry32(seed);
    const rings = 3 + Math.floor(rand() * 3);
    const dots = 46 + Math.floor(rand() * 40);
    const nodes = Array.from({ length: dots }, () => {
      const a = rand() * Math.PI * 2;
      const r = 20 + rand() * 78;
      return {
        x: 50 + Math.cos(a) * r * 0.5,
        y: 50 + Math.sin(a) * r * 0.5,
        s: 0.4 + rand() * 1.4,
        o: 0.2 + rand() * 0.7,
      };
    });
    const links: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (rand() > 0.72) {
        const j = Math.floor(rand() * nodes.length);
        if (j !== i) links.push([i, j]);
      }
    }
    const tilt = -30 + rand() * 60;
    const light = 40 + rand() * 25;
    return { rings, nodes, links, tilt, light };
  }, [seed]);

  return (
    <div className={`${styles.wrap} ${className ?? ""}`} aria-hidden="true">
      <div
        className={styles.sphere}
        style={{
          background: `radial-gradient(circle at ${cfg.light}% 35%, #d9d9dd 0%, #6d6e73 26%, #232327 62%, #0a0a0c 100%)`,
        }}
      />
      <svg
        className={`${styles.net} ${spin ? styles.spin : ""}`}
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${cfg.tilt}deg)` }}
      >
        {[...Array(cfg.rings)].map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="50"
            rx={30 + i * 8}
            ry={12 + i * 4}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.4"
          />
        ))}
        {cfg.links.map(([a, b], i) => (
          <line
            key={i}
            x1={cfg.nodes[a].x}
            y1={cfg.nodes[a].y}
            x2={cfg.nodes[b].x}
            y2={cfg.nodes[b].y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.3"
          />
        ))}
        {cfg.nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.s}
            fill={`rgba(255,255,255,${n.o})`}
          />
        ))}
      </svg>
      <div className={styles.rim} />
    </div>
  );
}

/** Tiny deterministic PRNG. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
