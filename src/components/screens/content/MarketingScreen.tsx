"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { count, stagger } from "../util";
import styles from "../screens.module.css";

/* 03 — MARKETING · "THE FUNNEL" — attention converts to revenue. */

const BANDS = ["AWARENESS", "INTEREST", "INTENT", "CONVERSION"];

export default function MarketingScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);
  const cx = 150;

  const bandPoly = (i: number) => {
    const topW = 260 - (200 * i) / 4;
    const botW = 260 - (200 * (i + 1)) / 4;
    const y0 = 24 + i * 58;
    const y1 = 24 + (i + 1) * 58;
    return `${cx - topW / 2},${y0} ${cx + topW / 2},${y0} ${
      cx + botW / 2
    },${y1} ${cx - botW / 2},${y1}`;
  };

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>${count(l1, 0, 482)}K</div>
          <div className={styles.sub}>revenue attributed</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>{count(l1, 0, 4.8, 1)}%</div>
          <div className={styles.sub}>visitor → customer</div>
        </div>
      </div>

      <div className={styles.svgWrap} style={{ top: "30%" }}>
        <svg className={styles.svg} viewBox="0 0 300 260" preserveAspectRatio="xMidYMid meet">
          {BANDS.map((b, i) => {
            const fillP = stagger(l1, i, 4, 0.55);
            return (
              <g key={b}>
                <polygon points={bandPoly(i)} className={styles.svgInk} />
                <polygon
                  points={bandPoly(i)}
                  fill="#c8ff00"
                  opacity={fillP * 0.85}
                />
                <text
                  x={cx}
                  y={24 + i * 58 + 34}
                  textAnchor="middle"
                  className={styles.svgLabel}
                  style={{ fontWeight: 700 }}
                >
                  {b}
                </text>
                <text
                  x={cx}
                  y={24 + i * 58 + 48}
                  textAnchor="middle"
                  className={styles.svgLabel}
                  style={{ fontSize: 9, opacity: 0.6 }}
                >
                  {count(fillP, 0, [100, 58, 22, 4.8][i], i === 3 ? 1 : 0)}%
                </text>
              </g>
            );
          })}
          {/* particles descending */}
          {Array.from({ length: 7 }).map((_, i) => {
            const t = (l1 * 1.2 + i / 7) % 1;
            return (
              <circle
                key={i}
                cx={cx + Math.sin(i * 2.4) * (60 - t * 48)}
                cy={24 + t * 232}
                r={2.4}
                fill="#0b0b0b"
                opacity={0.7}
              />
            );
          })}
        </svg>
      </div>

      {/* Deep-dive: one customer's journey */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>One journey — stranger to customer</div>
        <div className={styles.timeline}>
          {[
            ["TOUCH 01", "Saw a paid ad on social"],
            ["TOUCH 02", "Read a comparison article"],
            ["TOUCH 03", "Retargeted · clicked through"],
            ["TOUCH 04", "Booked a demo"],
            ["TOUCH 05", "Converted · $4.2K ARR"],
          ].map(([d, t], i) => (
            <div
              key={i}
              className={styles.tlItem}
              style={{ opacity: Math.min(1, l2 * 5 - i * 0.6) }}
            >
              <span>{d}</span>
              <br />
              {t}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
