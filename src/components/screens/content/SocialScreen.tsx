"use client";

import { innerL1, innerL2 } from "@/config/timeline";
import { count, stagger, fmt } from "../util";
import styles from "../screens.module.css";

/* 04 — SOCIAL · "THE FEED ENGINE" — an always-on, self-composing feed. */

const POSTS = [
  { k: "REEL", base: 8200 },
  { k: "CAROUSEL", base: 4100 },
  { k: "STORY", base: 12700 },
  { k: "POST", base: 3300 },
  { k: "REEL", base: 21000 },
  { k: "POLL", base: 5600 },
  { k: "POST", base: 7400 },
  { k: "CLIP", base: 15300 },
];

export default function SocialScreen({ p }: { p: number }) {
  const l1 = innerL1(p);
  const l2 = innerL2(p);

  return (
    <>
      <div className={styles.metricRow}>
        <div>
          <div className={styles.bignum}>{count(l1, 0, 1.2, 1)}M</div>
          <div className={styles.sub}>impressions / week · autopilot</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.bignum}>{count(l1, 0, 64)}</div>
          <div className={styles.sub}>posts shipped</div>
        </div>
      </div>

      <div className={styles.gridWall} style={{ top: "32%" }}>
        {POSTS.map((post, i) => {
          const t = stagger(l1, i, POSTS.length, 0.6);
          const boosted = i === 4 && l1 > 0.55;
          return (
            <div
              key={i}
              className={styles.tile}
              style={{
                opacity: t,
                transform: `scale(${0.9 + t * 0.1})`,
                background: boosted ? "var(--acid)" : "var(--paper-2)",
              }}
            >
              {boosted && <span className={styles.tileBoost}>BOOSTED</span>}
              <div className={styles.tileMeta}>{post.k}</div>
              <div className={styles.tileMeta} style={{ fontWeight: 700 }}>
                ♥ {fmt(Math.round(post.base * t))}
              </div>
              <div
                className={styles.tileBar}
                style={{ width: `${t * 100}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Deep-dive: one post's engagement */}
      <div
        className={styles.deep}
        style={{ opacity: Math.min(1, l2 * 4), transform: `translateY(${Math.max(0, 1 - l2 * 2) * 16}%)` }}
      >
        <div className={styles.deepHead}>Top post — engagement breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
          {[
            ["REACH", 214000],
            ["SAVES", 9800],
            ["SHARES", 6400],
            ["COMMENTS", 2100],
          ].map(([k, v], i) => (
            <div key={k}>
              <div
                className={styles.tileMeta}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{k}</span>
                <span>{fmt(Math.round((v as number) * l2))}</span>
              </div>
              <div
                style={{
                  height: 10,
                  marginTop: 4,
                  background: "var(--acid)",
                  width: `${Math.min(1, l2 * 1.2 - i * 0.1) * 100}%`,
                  outline: "1px solid var(--paper)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
