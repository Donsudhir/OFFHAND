"use client";

import { ReactNode } from "react";
import type { ModuleDef } from "@/config/modules";
import { innerL1, innerL2 } from "@/config/timeline";
import { clamp01 } from "./util";
import styles from "./screens.module.css";

/**
 * ScreenFrame — the brutalist "monitor" chrome that wraps every docked module
 * screen. Its entrance (and the body content) is driven by the dwell value `p`.
 */
export default function ScreenFrame({
  module,
  p,
  children,
}: {
  module: ModuleDef;
  p: number; // dwell 0..1
  children: ReactNode;
}) {
  const enter = clamp01(p / 0.12); // ramp the window in over the first slice
  const l1 = innerL1(p);
  const l2 = innerL2(p);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div
        className={styles.window}
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 18}px) scale(${
            0.98 + enter * 0.02
          })`,
        }}
      >
        <div className={styles.head}>
          <span className={styles.headName}>
            {module.num} — {module.name}
          </span>
          <span className={styles.headTitle}>{module.screen}</span>
          <span className={styles.headStatus}>
            <span className={styles.headDot} />
            {l2 > 0 ? "DEEP DIVE" : "LIVE"}
          </span>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.foot}>
          <span>{module.tag}</span>
          <div className={styles.rail}>
            <span
              className={styles.railFill}
              style={{ width: `${(l2 > 0 ? 1 : l1) * 100}%` }}
            />
          </div>
          <span className={styles.footHint}>
            {l2 > 0 ? "L2 — DEEPER" : l1 > 0.98 ? "RELEASE ▼" : "INNER SCROLL ▼"}
          </span>
        </div>
      </div>
    </div>
  );
}
