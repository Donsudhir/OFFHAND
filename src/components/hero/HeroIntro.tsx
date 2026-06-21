"use client";

import { useEffect, useState } from "react";
import { useOS } from "@/state/useOS";
import styles from "./hero.module.css";

/**
 * HeroIntro — Act 1 establishing overlay.
 * Shows the headline + scroll hint when the OS first goes live, then fades out
 * as soon as the visitor starts travelling the hall.
 */
export default function HeroIntro() {
  const phase = useOS((s) => s.phase);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsub = useOS.subscribe((s) => {
      setShow(s.phase === "live" && s.progress < 0.025);
    });
    return unsub;
  }, []);

  if (phase !== "live") return null;

  return (
    <div className={styles.hero} data-show={show} aria-hidden="true">
      <div className={styles.inner}>
        <div className={styles.kicker}>OFFHAND OS — AUTONOMY ONLINE</div>
        <h2 className={styles.title}>
          EIGHT SYSTEMS.
          <br />
          ONE <em>MACHINE</em>.
        </h2>
        <div className={styles.hint}>
          <span className={styles.arrow}>&darr;</span> scroll to dive
        </div>
      </div>
    </div>
  );
}
