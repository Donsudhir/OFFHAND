"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { count } from "../util";
import styles from "../screens.module.css";

/* 02 — CRM · "THE PIPELINE" — leads sort Lead→Won, then one card opens. */

const STAGES = ["LEAD", "QUALIFIED", "PROPOSAL", "WON"];
const LEADS = [
  { n: "A. MERCER", c: "NORTHWIND", v: 12 },
  { n: "R. KAPOOR", c: "VERTEX", v: 8 },
  { n: "S. OKORO", c: "BRIGHTLY", v: 24 },
  { n: "L. CHEN", c: "MONOLITH", v: 5 },
  { n: "D. FORD", c: "HALCYON", v: 31 },
  { n: "P. NWOSU", c: "CADENCE", v: 16 },
  { n: "K. ADLER", c: "PILLAR", v: 9 },
];

const clampInt = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, Math.floor(n)));

export default function CrmScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);

  const stageOf = (i: number) => clampInt(l1 * 4.7 - i * 0.45, 0, 3);
  const won = LEADS.filter((_, i) => stageOf(i) === 3);
  const wonValue = won.reduce((s, l) => s + l.v, 0);
  const hero = LEADS[4]; // highest-value lead for the deep-dive

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>${count(l1, 0, wonValue)}K</div>
          <div className={styles.sub}>closed this cycle · auto-advanced</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>{won.length}</div>
          <div className={styles.sub}>deals won</div>
        </div>
      </div>

      <div className={styles.cols} style={{ top: "32%" }}>
        {STAGES.map((s, si) => (
          <div key={s} className={styles.col}>
            <div className={styles.colHead}>
              <span>{s}</span>
              <span>{LEADS.filter((_, i) => stageOf(i) === si).length}</span>
            </div>
            <div className={styles.colBody}>
              {LEADS.map((l, i) =>
                stageOf(i) === si ? (
                  <div
                    key={i}
                    className={`${styles.card} ${
                      si === 3 ? styles.cardWon : ""
                    }`}
                  >
                    <b>{l.n}</b>
                    <span className={styles.val}>
                      {l.c} · ${l.v}K
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deep-dive: one contact record */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Contact record — {hero.n}</div>
        <div className={styles.record}>
          <div>
            {[
              ["COMPANY", hero.c],
              ["VALUE", `$${hero.v}K`],
              ["STAGE", "WON"],
              ["OWNER", "AUTOMATION"],
              ["SOURCE", "INBOUND / ADS"],
            ].map(([k, v]) => (
              <div key={k} className={styles.recLine}>
                <span style={{ opacity: 0.55 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className={styles.timeline}>
            {[
              ["DAY 00", "Lead captured from paid ad"],
              ["DAY 01", "Auto-scored · routed to pipeline"],
              ["DAY 02", "Sequence sent · opened ×3"],
              ["DAY 05", "Proposal generated"],
              ["DAY 07", "Marked WON · onboarding fired"],
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
      </div>
    </>
  );
}
