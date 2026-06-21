"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { stagger } from "../util";
import styles from "../screens.module.css";

/* 06 — AI AUTOMATION · "THE LOOM" — flows execute themselves, hands-free. */

const NODES = [
  { id: 0, x: 40, y: 60, t: "TRIGGER" },
  { id: 1, x: 130, y: 36, t: "ENRICH" },
  { id: 2, x: 130, y: 96, t: "SCORE" },
  { id: 3, x: 220, y: 60, t: "ROUTE" },
  { id: 4, x: 300, y: 30, t: "EMAIL" },
  { id: 5, x: 300, y: 92, t: "TASK" },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
];

export default function AutomationScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>HANDS-FREE</div>
          <div className={styles.sub}>the engine that runs the room</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>{Math.round(l1 * 1240)}</div>
          <div className={styles.sub}>tasks auto-run today</div>
        </div>
      </div>

      <div className={styles.svgWrap} style={{ top: "30%" }}>
        <svg className={styles.svg} viewBox="0 0 340 130" preserveAspectRatio="xMidYMid meet">
          {EDGES.map(([a, b], i) => {
            const prog = stagger(l1, i, EDGES.length, 0.5);
            const A = NODES[a];
            const B = NODES[b];
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="#c8ff00"
                strokeWidth={2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog}
                opacity={0.4 + prog * 0.6}
              />
            );
          })}
          {NODES.map((n, i) => {
            const on = stagger(l1, i, NODES.length, 0.5) > 0.6;
            return (
              <g key={n.id}>
                <rect
                  x={n.x - 26}
                  y={n.y - 12}
                  width={52}
                  height={24}
                  fill={on ? "#0b0b0b" : "var(--paper)"}
                  stroke="#0b0b0b"
                  strokeWidth={1.5}
                />
                <text
                  x={n.x}
                  y={n.y + 3}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="var(--font-jbmono), monospace"
                  fill={on ? "#c8ff00" : "#0b0b0b"}
                  letterSpacing={0.5}
                >
                  {on ? "✓ " : ""}
                  {n.t}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Deep-dive: one node's logic */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Inside node — ROUTE · IF / THEN</div>
        <div className={styles.code} style={{ marginTop: 8 }}>
          {[
            "on  lead.scored",
            "if  score >= 80",
            "    → notify owner",
            "    → start sequence_A",
            "else",
            "    → nurture_pool",
            "always",
            "    → log + sync CRM",
          ].map((l, i) => (
            <div
              key={i}
              style={{ opacity: Math.min(1, l2 * 6 - i * 0.5) }}
            >
              <span className={i === 1 || i === 4 || i === 6 ? styles.tag : ""}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
