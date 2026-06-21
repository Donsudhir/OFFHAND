"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS, useOS } from "@/state/useOS";
import { sound } from "@/audio/sound";
import styles from "./hud.module.css";

/**
 * OS HUD — always-on brutalist overlay framing the experience.
 * Pure DOM (sits above the R3F canvas); reads live values from the OS store.
 */
export default function Hud() {
  const phase = useOS((s) => s.phase);
  const section = useOS((s) => s.section);
  const progress = useOS((s) => s.progress);
  const cursor = useOS((s) => s.cursor);
  const soundOn = useOS((s) => s.soundOn);
  const toggleSound = useOS((s) => s.toggleSound);

  const clock = useClock();
  const coordRef = useRef<HTMLSpanElement>(null);

  // Live pointer coordinates without re-rendering the whole HUD each move.
  useEffect(() => {
    const unsub = useOS.subscribe((s) => {
      const el = coordRef.current;
      if (!el) return;
      const x = (s.pointer.x * 0.5 + 0.5) * 100;
      const y = (1 - (s.pointer.y * 0.5 + 0.5)) * 100;
      el.textContent = `X:${x.toFixed(1).padStart(5, "0")} Y:${y
        .toFixed(1)
        .padStart(5, "0")}`;
    });
    return unsub;
  }, []);

  const sectorNo = String(section + 1).padStart(2, "0");
  const cursorLabel = `[ ${cursor.toUpperCase()} ]`;

  return (
    <div className={styles.hud} data-phase={phase} aria-hidden="true">
      <div className={styles.frame} />
      <span className={`${styles.tick} ${styles.tl}`} />
      <span className={`${styles.tick} ${styles.tr}`} />
      <span className={`${styles.tick} ${styles.bl}`} />
      <span className={`${styles.tick} ${styles.br}`} />

      {/* Top-left — identity */}
      <div className={`${styles.corner} ${styles.cTL}`}>
        <div>
          <span className={styles.dot} />
          OFFHAND OS
        </div>
        <div className={styles.dim}>v1.0 — {phaseLabel(phase)}</div>
      </div>

      {/* Top-right — telemetry */}
      <div className={`${styles.corner} ${styles.cTR}`}>
        <div>AUTONOMY: ON</div>
        <div className={styles.dim}>{clock}</div>
      </div>

      {/* Bottom-left — module + live cursor coords */}
      <div className={`${styles.corner} ${styles.cBL}`}>
        <div>{phase === "live" ? SECTIONS[section] : "BOOTING"}</div>
        <div className={styles.dim}>
          <span ref={coordRef}>X:050.0 Y:050.0</span> {cursorLabel}
        </div>
      </div>

      {/* Bottom-right — sector progress */}
      <div className={`${styles.corner} ${styles.cBR}`}>
        <div>
          SECTOR {sectorNo} / 08
        </div>
        <div className={styles.dim}>
          {Math.round(progress * 100)
            .toString()
            .padStart(3, "0")}
          % <span className={styles.blink}>_</span>
        </div>
      </div>

      {/* Sound toggle */}
      <button
        className={styles.sound}
        onClick={() => {
          const next = !useOS.getState().soundOn;
          sound.setEnabled(next);
          if (next) sound.beep();
          toggleSound();
        }}
        type="button"
        aria-label={soundOn ? "Mute sound" : "Enable sound"}
      >
        SND {soundOn ? "[ON]" : "[OFF]"}
      </button>
    </div>
  );
}

function phaseLabel(phase: string) {
  switch (phase) {
    case "boot":
      return "COLD BOOT";
    case "waking":
      return "WAKING";
    default:
      return "ONLINE";
  }
}

/** Lightweight HH:MM:SS clock for the telemetry corner. */
function useClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}
