"use client";

import CountUp from "@/components/common/CountUp";
import { STATS } from "@/lib/data";
import styles from "./stats.module.css";

/**
 * Stats — headline metrics that count up the first time the row is visible
 * (not on page load). Fabricated demo figures.
 */
export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>
            <span />
            QUANTIFIED IMPACT
          </div>
          <p className={styles.blurb}>
            We measure success by how little you have to touch. Fewer things to
            babysit, more of the right customers, measured across every build.
          </p>
        </div>
        <div className={styles.grid}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.cell}>
              <div className={styles.value}>
                <CountUp
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  prefix={s.prefix ?? ""}
                  suffix={s.suffix}
                />
              </div>
              <div className={styles.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
