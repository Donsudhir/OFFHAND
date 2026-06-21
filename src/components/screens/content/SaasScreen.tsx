"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { count, stagger } from "../util";
import styles from "../screens.module.css";

/* 07 — SAAS · "THE PRODUCT" — a live brutalist app that demos itself. */

const DATA = [42, 68, 55, 81, 73, 92, 60, 88];
const TOGGLES = ["AUTO-SYNC", "ALERTS", "AI ASSIST"];

export default function SaasScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);
  const sliderX = 10 + l1 * 80;

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>{count(l1, 0, 98.6, 1)}%</div>
          <div className={styles.sub}>uptime · your logic, your tool</div>
        </div>
        <div style={{ textAlign: "right", display: "flex", gap: 10 }}>
          {TOGGLES.map((t, i) => {
            const on = l1 > 0.25 + i * 0.2;
            return (
              <div key={t} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 20,
                    border: "1.5px solid var(--ink)",
                    background: on ? "var(--acid)" : "transparent",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 1,
                      left: on ? 21 : 1,
                      width: 16,
                      height: 16,
                      background: "var(--ink)",
                      transition: "left .2s steps(2)",
                    }}
                  />
                </div>
                <div className={styles.sub} style={{ fontSize: 8, marginTop: 4 }}>
                  {t}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* slider */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "8%",
          right: "8%",
          height: 2,
          background: "var(--rule)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: `${sliderX}%`,
            top: -7,
            width: 16,
            height: 16,
            background: "var(--acid)",
            border: "1.5px solid var(--ink)",
          }}
        />
      </div>

      {/* bar chart */}
      <div className={styles.bars}>
        {DATA.map((d, i) => {
          const h = stagger(l1, i, DATA.length, 0.6) * d;
          return (
            <div
              key={i}
              className={i === 5 ? `${styles.bar} ${styles.barAcid}` : styles.bar}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      {/* Deep-dive: a single feature, live */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Feature — usage limits · live</div>
        <div className={styles.record} style={{ alignItems: "start" }}>
          <div>
            {[
              ["PLAN", "SCALE"],
              ["SEATS", `${Math.round(3 + l2 * 9)}`],
              ["API CALLS", `${Math.round(l2 * 48000).toLocaleString()}`],
              ["BILLING", "USAGE-BASED"],
            ].map(([k, v]) => (
              <div key={k} className={styles.recLine}>
                <span style={{ opacity: 0.55 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className={styles.sub} style={{ color: "var(--paper)", opacity: 0.6 }}>
              CONSUMPTION
            </div>
            <div
              style={{
                height: 14,
                marginTop: 8,
                background: "var(--acid)",
                width: `${Math.min(1, l2 * 1.1) * 100}%`,
              }}
            />
            <div className={styles.code} style={{ marginTop: 14 }}>
              {"{ scale: true, auto: true }"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
