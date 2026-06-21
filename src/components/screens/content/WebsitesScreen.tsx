"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { seg } from "../util";
import styles from "../screens.module.css";

/* 01 — WEBSITES · "THE BUILD" — a site assembles itself, then peels to source. */

const LOG = [
  "$ offhand build --self",
  "» scaffolding routes",
  "» setting type scale",
  "» wiring components",
  "» loading media",
  "» applying theme",
  "» motion online",
  "✓ deploy ready",
];

const CODE = [
  ["<section ", 'class="hero"', ">"],
  ["  <h1>", "OFFHAND", "</h1>"],
  ["  <p>", "Complex, made offhand.", "</p>"],
  ["  <Cta ", "href=/start", " />"],
  ["</section>", "", ""],
  ["render(", "<App/>", ", root)"],
];

export default function WebsitesScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);
  const wire = seg(l1, 0, 0.32);
  const type = seg(l1, 0.28, 0.58);
  const media = seg(l1, 0.5, 0.78);
  const styled = seg(l1, 0.72, 1);
  const deployed = l1 > 0.92;
  const shownLogs = Math.round(seg(l1, 0, 1) * LOG.length);

  const grey = "var(--concrete)";

  return (
    <>
      <div className={styles.site}>
        <div className={styles.buildLog}>
          {LOG.slice(0, shownLogs).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>

        <div className={styles.preview}>
          <div className={styles.pvRow}>
            <div className={styles.pvNav}>
              <span className={styles.pvDot} />
              <span className={styles.pvDot} />
              <span className={styles.pvDot} />
              <div
                className={styles.block}
                style={{
                  width: `${20 + wire * 30}%`,
                  height: 8,
                  marginLeft: "auto",
                  background: styled > 0 ? "var(--acid)" : grey,
                }}
              />
            </div>
          </div>

          <div className={styles.pvRow}>
            {type > 0.25 ? (
              <div
                className={`${styles.block} ${styles.blockText}`}
                style={{ fontSize: `${20 + styled * 18}px`, opacity: type }}
              >
                OFFHAND
              </div>
            ) : (
              <div
                className={styles.block}
                style={{ width: `${wire * 70}%`, height: 26 }}
              />
            )}
            <div
              className={styles.block}
              style={{
                width: `${30 + type * 40}%`,
                height: 9,
                marginTop: 8,
                opacity: type,
                background: styled > 0 ? "var(--ink)" : grey,
              }}
            />
          </div>

          <div className={styles.pvRow} style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              {[90, 72, 81].map((w, i) => (
                <div
                  key={i}
                  className={styles.block}
                  style={{
                    width: `${type * w}%`,
                    height: 7,
                    background: styled > 0.3 ? "var(--ink)" : grey,
                  }}
                />
              ))}
            </div>
            <div style={{ width: "38%" }}>
              <div
                style={{
                  height: 70,
                  border: "1px solid var(--ink)",
                  opacity: 0.25 + media * 0.75,
                  background:
                    media > 0.1
                      ? "repeating-linear-gradient(45deg,#0b0b0b 0 2px,#ede8df 2px 4px)"
                      : grey,
                }}
              />
            </div>
          </div>

          <div className={styles.pvRow}>
            <div
              style={{
                width: 130,
                height: 26,
                border: "1px solid var(--ink)",
                background: styled > 0.4 ? "var(--acid)" : grey,
              }}
            />
          </div>
        </div>

        <div className={styles.stamp} data-on={deployed}>
          DEPLOY ✓
        </div>
      </div>

      {/* Deep-dive: beneath the pixels */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Beneath the pixels — DOM / source</div>
        <div className={styles.code}>
          {CODE.map((line, i) => (
            <div
              key={i}
              style={{ opacity: seg(l2, i * 0.1, i * 0.1 + 0.3) }}
            >
              <span className={styles.tag}>{line[0]}</span>
              {line[1]}
              <span className={styles.tag}>{line[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
