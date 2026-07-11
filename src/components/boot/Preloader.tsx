"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./boot.module.css";

/** POST log streamed during the cold boot. */
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

/**
 * Preloader — a self-contained cold-boot overlay that appears on every page
 * load, streams a POST log, assembles the OFFHAND wordmark, and dismisses on
 * the first scroll / key / tap (with a CRT power-off collapse). Monochrome.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const exitingRef = useRef(false);

  // Detect reduced motion + lock the page scroll while the boot is up.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, []);

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
        const pause = LOG[i - 1].text === "" ? 60 : 70 + Math.random() * 70;
        timer = setTimeout(tick, pause);
      } else {
        timer = setTimeout(() => setShowWord(true), 360);
      }
    };
    timer = setTimeout(tick, 260);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (!showWord || reduced) return;
    const t = setTimeout(() => setReady(true), 820);
    return () => clearTimeout(t);
  }, [showWord, reduced]);

  const dismiss = useCallback(() => {
    if (!ready || exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    const delay = reduced ? 40 : 780;
    setTimeout(() => {
      setGone(true);
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      // Signal that the page is now in its final, scrollable layout so
      // scroll-driven setups (e.g. GSAP pins) can measure without CLS.
      (window as unknown as { __offhandBooted?: boolean }).__offhandBooted = true;
      window.dispatchEvent(new Event("offhand:booted"));
      onDone?.();
    }, delay);
  }, [ready, reduced, onDone]);

  // Accept first scroll / key / touch as the dismiss signal.
  useEffect(() => {
    if (gone) return;
    const go = () => dismiss();
    window.addEventListener("wheel", go, { passive: true });
    window.addEventListener("keydown", go);
    window.addEventListener("touchmove", go, { passive: true });
    return () => {
      window.removeEventListener("wheel", go);
      window.removeEventListener("keydown", go);
      window.removeEventListener("touchmove", go);
    };
  }, [gone, dismiss]);

  if (gone) return null;

  return (
    <div
      className={`${styles.boot} ${reduced ? styles.reduced : ""}`}
      onClick={dismiss}
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
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {showWord && (
          <div className={styles.tagline} style={{ animationDelay: "0.6s" }}>
            Complex, made offhand.
          </div>
        )}

        {ready && (
          <div className={styles.prompt}>
            scroll to enter
            <span className={styles.caret} />
          </div>
        )}
      </div>
    </div>
  );
}
