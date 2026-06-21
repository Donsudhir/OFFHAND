"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { stagger } from "../util";
import styles from "../screens.module.css";
import { MODULES } from "@/config/modules";

/* 08 — PRESENCE · "THE CONSTELLATION" — every system, one network (recursion). */

export default function PresenceScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);
  const cx = 150;
  const cy = 110;
  const ring = MODULES.slice(0, 7); // the 7 service nodes around the core

  const nodes = ring.map((m, i) => {
    const a = (i / ring.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * 100, y: cy + Math.sin(a) * 78, m };
  });

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>ONE SYSTEM</div>
          <div className={styles.sub}>everywhere you are</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>{Math.round(l1 * 8)}/8</div>
          <div className={styles.sub}>systems linked</div>
        </div>
      </div>

      <div className={styles.svgWrap} style={{ top: "26%" }}>
        <svg className={styles.svg} viewBox="0 0 300 220" preserveAspectRatio="xMidYMid meet">
          {nodes.map((n, i) => {
            const prog = stagger(l1, i, nodes.length, 0.4);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke="#c8ff00"
                strokeWidth={2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog}
              />
            );
          })}
          {nodes.map((n, i) => {
            const prog = stagger(l1, i, nodes.length, 0.4);
            return (
              <g key={i} opacity={0.4 + prog * 0.6}>
                <rect
                  x={n.x - 28}
                  y={n.y - 11}
                  width={56}
                  height={22}
                  fill="var(--paper)"
                  stroke="#0b0b0b"
                  strokeWidth={1.5}
                />
                <text
                  x={n.x}
                  y={n.y + 3}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="var(--font-jbmono), monospace"
                  fill="#0b0b0b"
                >
                  {n.m.name}
                </text>
              </g>
            );
          })}
          {/* core */}
          <rect
            x={cx - 22}
            y={cy - 16}
            width={44}
            height={32}
            fill="#0b0b0b"
          />
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-jbmono), monospace"
            fill="#c8ff00"
          >
            OFFHAND
          </text>
        </svg>
      </div>

      {/* Deep-dive: recursion — re-enter any system */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Re-enter any system — it was one all along</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginTop: 8,
          }}
        >
          {MODULES.map((m, i) => (
            <div
              key={m.name}
              style={{
                border: "1px solid var(--acid)",
                padding: "10px 8px",
                opacity: Math.min(1, l2 * 6 - i * 0.3),
                fontFamily: "var(--font-jbmono), monospace",
                fontSize: 10,
                letterSpacing: "0.06em",
              }}
            >
              <div style={{ color: "var(--acid)" }}>{m.num}</div>
              {m.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
