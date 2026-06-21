"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOS } from "@/state/useOS";
import { sound } from "@/audio/sound";
import styles from "./boot.module.css";

/** POST log lines streamed during cold boot. */
const LOG: { text: string; cls?: string }[] = [
  { text: "OFFHAND OS v1.0", cls: styles.ok },
  { text: "(c) 2026 OFFHAND SYSTEMS", cls: styles.muted },
  { text: "" },
  { text: "> POWER-ON SELF-TEST .............. OK" },
  { text: "> CPU: OFFHAND CORE ............... ONLINE" },
  { text: "> MOUNTING SERVICES" },
  { text: "  [01] WEBSITES ................... OK" },
  { text: "  [02] CRM ........................ OK" },
  { text: "  [03] MARKETING .................. OK" },
  { text: "  [04] SOCIAL ..................... OK" },
  { text: "  [05] ADS ........................ OK" },
  { text: "  [06] AI AUTOMATION .............. OK" },
  { text: "  [07] SAAS TOOLS ................. OK" },
  { text: "  [08] DIGITAL PRESENCE ........... OK" },
  { text: "> AUTONOMY ENABLED", cls: styles.ok },
  { text: "> 8 / 8 SYSTEMS ONLINE", cls: styles.ok },
];

const WORDMARK = "OFFHAND";

export default function ColdBoot() {
  const phase = useOS((s) => s.phase);
  const setReducedMotion = useOS((s) => s.setReducedMotion);

  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);

  // Detect reduced-motion once, sync to store.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setReducedMotion(mq.matches);
  }, [setReducedMotion]);

  // Stream the POST log (or reveal instantly when reduced).
  useEffect(() => {
    if (reduced) {
      setStep(LOG.length);
      setShowWord(true);
      setReady(true);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setStep(i);
      if (i < LOG.length) {
        const pause = LOG[i - 1].text === "" ? 60 : 90 + Math.random() * 80;
        timer = setTimeout(tick, pause);
      } else {
        timer = setTimeout(() => setShowWord(true), 380);
      }
    };
    timer = setTimeout(tick, 320);
    return () => clearTimeout(timer);
  }, [reduced]);

  // Once the wordmark is shown, arm the wake prompt.
  useEffect(() => {
    if (!showWord || reduced) return;
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, [showWord, reduced]);

  const handleWake = useCallback(() => {
    if (!ready || exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    sound.powerOn();
    useOS.getState().wake();
    const delay = reduced ? 60 : 820;
    setTimeout(() => useOS.getState().setPhase("live"), delay);
  }, [ready, reduced]);

  // Accept first scroll / key / touch / click as the wake signal.
  useEffect(() => {
    if (phase !== "boot") return;
    const onWheel = () => handleWake();
    const onKey = () => handleWake();
    const onTouch = () => handleWake();
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [phase, handleWake]);

  // Unmount entirely once the OS is live.
  if (phase === "live") return null;

  return (
    <div
      className={`${styles.boot} ${reduced ? styles.reduced : ""}`}
      onClick={handleWake}
      role="button"
      tabIndex={0}
      aria-label="Cold boot. Press any key or scroll to enter."
    >
      <div className={`${styles.screen} ${exiting ? styles.exiting : ""}`}>
        <pre className={styles.log}>
          {LOG.slice(0, step).map((l, i) => (
            <span key={i} className={`${styles.line} ${l.cls ?? ""}`}>
              {l.text}
            </span>
          ))}
        </pre>

        {showWord && (
          <div className={styles.word} aria-label={WORDMARK}>
            {WORDMARK.split("").map((c, i) => (
              <span
                key={i}
                className={styles.glyph}
                style={{ animationDelay: `${i * 0.09}s` }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {showWord && (
          <div className={styles.tagline} style={{ animationDelay: "0.7s" }}>
            Complex, made offhand.
          </div>
        )}

        {ready && (
          <div className={styles.prompt}>
            press scroll to wake
            <span className={styles.caret} />
          </div>
        )}
      </div>
    </div>
  );
}
