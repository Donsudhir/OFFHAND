"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { count, stagger } from "../util";
import styles from "../screens.module.css";

/* 05 — ADS · "THE BROADCAST" — spend that radiates and finds people. */

export default function AdsScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);
  const cx = 150;
  const cy = 120;

  const nodes = Array.from({ length: 22 }, (_, i) => {
    const a = i * 2.39996;
    const r = 18 + (i / 22) * 110;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * (r * 0.62), i };
  });

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>{count(l1, 0, 3.4, 1)}M</div>
          <div className={styles.sub}>people reached</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>${count(l1, 14, 3, 2)}</div>
          <div className={styles.sub}>cost / acquisition ▼</div>
        </div>
      </div>

      <div className={styles.svgWrap} style={{ top: "28%" }}>
        <svg className={styles.svg} viewBox="0 0 300 220" preserveAspectRatio="xMidYMid meet">
          {/* targeting nodes */}
          {nodes.map((n) => {
            const lit = stagger(l1, n.i, nodes.length, 0.7);
            return (
              <circle
                key={n.i}
                cx={n.x}
                cy={n.y}
                r={2.6}
                fill={lit > 0.5 ? "#0b0b0b" : "none"}
                stroke="#0b0b0b"
                strokeWidth={1}
                opacity={0.3 + lit * 0.7}
              />
            );
          })}
          {/* broadcast rings */}
          {[0, 1, 2].map((k) => {
            const prog = stagger(l1, k, 3, 0.4);
            return (
              <ellipse
                key={k}
                cx={cx}
                cy={cy}
                rx={prog * (60 + k * 50)}
                ry={prog * (38 + k * 31)}
                className={styles.svgAcid}
                opacity={(1 - prog) * 0.9}
              />
            );
          })}
          <circle cx={cx} cy={cy} r={5} fill="#c8ff00" stroke="#0b0b0b" />
        </svg>
      </div>

      {/* Deep-dive: one audience segment */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Audience segment — SEG-07 / HIGH INTENT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {[
            ["AGE 25–34", 0.72],
            ["URBAN / METRO", 0.61],
            ["INTEREST: SAAS", 0.84],
            ["RETARGET POOL", 0.49],
          ].map(([k, v], i) => (
            <div key={k as string}>
              <div
                className={styles.tileMeta}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{k}</span>
                <span>{Math.round((v as number) * 100 * l2)}%</span>
              </div>
              <div
                style={{
                  height: 10,
                  marginTop: 4,
                  background: "var(--acid)",
                  width: `${(v as number) * l2 * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
