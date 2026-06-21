"use client";

import { useEffect, useRef, useState } from "react";
import { useOS } from "@/state/useOS";
import { journeyState, MODULE_COUNT } from "@/config/timeline";
import { sound } from "@/audio/sound";
import styles from "./handoff.module.css";

/* Stub contact targets — swap for real email / booking link later. */
const EMAIL = "mailto:hello@offhand.studio?subject=Start%20my%20build";
const CALL = "mailto:hello@offhand.studio?subject=Book%20a%20call";

/**
 * Handoff — Act 3. The OS "hands you the controls": appears as the camera
 * settles on the core at the end of the journey. Driven by the CTA progress.
 */
export default function Handoff() {
  const phase = useOS((s) => s.phase);
  const [vis, setVis] = useState(0);

  useEffect(() => {
    if (phase !== "live") return;
    let raf = 0;
    let last = -1;
    const loop = () => {
      const js = journeyState(useOS.getState().progress);
      const v = js.moduleIndex === MODULE_COUNT ? js.cta : 0;
      const q = Math.round(v * 100) / 100;
      if (q !== last) {
        last = q;
        setVis(q);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const armedRef = useRef(false);
  useEffect(() => {
    if (vis > 0.6 && !armedRef.current) {
      armedRef.current = true;
      sound.chord();
    } else if (vis < 0.3) {
      armedRef.current = false;
    }
  }, [vis]);

  if (phase !== "live" || vis <= 0.001) return null;

  const enter = Math.min(1, vis / 0.5);

  return (
    <section
      className={styles.handoff}
      style={{ opacity: enter }}
      aria-label="Start your build with OFFHAND"
    >
      <div
        className={styles.inner}
        style={{ transform: `translateY(${(1 - enter) * 24}px)` }}
      >
        <div className={styles.kicker}>OFFHAND OS — HANDOFF COMPLETE</div>
        <h2 className={styles.title}>
          HANDS OFF.
          <br />
          WE&apos;VE <em>GOT IT</em>.
        </h2>
        <div className={styles.prompt}>
          offhand:~$ start your build
          <span className={styles.caret} />
        </div>
        <div className={styles.actions}>
          <a
            className={styles.btn}
            href={EMAIL}
            onMouseEnter={() => sound.hover()}
          >
            &gt; START YOUR BUILD
          </a>
          <a
            className={`${styles.btn} ${styles.btnGhost}`}
            href={CALL}
            onMouseEnter={() => sound.hover()}
          >
            &gt; BOOK A CALL
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>OFFHAND OS v1.0 — © 2026</span>
        <a href={EMAIL}>hello@offhand.studio</a>
        <span className={styles.socials}>
          <a href="#" aria-label="Instagram">[IG]</a>
          <a href="#" aria-label="X">[X]</a>
          <a href="#" aria-label="LinkedIn">[IN]</a>
        </span>
      </footer>
    </section>
  );
}
