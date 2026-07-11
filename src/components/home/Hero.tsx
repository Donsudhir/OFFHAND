"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ArrowButton from "@/components/common/ArrowButton";
import styles from "./hero.module.css";

/** Headline lines — the second line uses the accent gradient. */
const HEADLINE_LINES: { text: string; accent: boolean }[] = [
  { text: "THE WHOLE MACHINE.", accent: false },
  { text: "Built and run for you.", accent: true },
];

/** Tiny deterministic PRNG so SSR and client agree (no hydration mismatch)
 *  while each letter still gets its own distinct spin pace. */
function seeded(seed: number) {
  let s = seed + 0x9e3779b9;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s = (s + Math.imul(s ^ (s >>> 7), 61 | s)) ^ s;
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

/** Per-letter reel config: the SAME target glyph repeated N times (so the reel
 *  spins the letter in place, odometer-style), plus a spin duration. Each letter
 *  gets a different cell count + duration → they spin at different paces.
 *  Punctuation doesn't spin. */
function reelFor(target: string, seed: number): { cells: string[]; dur: number } {
  const isLetter = /[A-Za-z]/.test(target);
  if (!isLetter) return { cells: [target], dur: 0 };
  const rand = seeded(seed);
  const steps = 5 + Math.floor(rand() * 8); // 5–12 spins
  const dur = 0.7 + rand() * 0.9; // 0.7s–1.6s (different pace per letter)
  return { cells: Array.from({ length: steps + 1 }, () => target), dur };
}

/**
 * RollHeadline — each letter is its own vertical reel that spins the SAME glyph
 * in place (odometer). Every letter starts together once `run` is true (fired
 * after the preloader), but each spins at its own pace. Re-spins on hover.
 */
function RollHeadline({ run }: { run: boolean }) {
  let n = 0; // running index → unique deterministic seed per letter
  return (
    <h1 className={styles.headline} data-run={run ? "true" : "false"}>
      {HEADLINE_LINES.map((line, li) => (
        <span key={li} className={styles.line}>
          {[...line.text].map((ch, ci) => {
            if (ch === " ") {
              n += 1;
              return (
                <span key={ci} className={styles.space}>
                  {"\u00A0"}
                </span>
              );
            }
            const { cells, dur } = reelFor(
              ch,
              (li + 1) * 131 + n * 977 + ch.charCodeAt(0)
            );
            n += 1;
            return (
              <span
                key={ci}
                className={`${styles.reel} ${
                  line.accent ? styles.reelAccent : ""
                }`}
              >
                {/* Sizing spacer so the reel box matches the final glyph. */}
                <span className={styles.reelGhost}>{ch}</span>
                <span
                  className={styles.reelStrip}
                  style={{
                    ["--cells" as string]: cells.length,
                    animationDuration: dur ? `${dur.toFixed(2)}s` : "0s",
                  }}
                >
                  {cells.map((g, gi) => (
                    <span key={gi} className={styles.reelCell}>
                      {g}
                    </span>
                  ))}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/**
 * Hero — a full-bleed pixel-wave background video (de-greened) behind a strong
 * headline + descriptive line and a CTA pair. Scroll indicator
 * (dot → line → SCROLL) bottom-centre.
 */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [run, setRun] = useState(false);

  // Slow the background video to a calm drift.
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.55;
  }, []);

  // Start the headline reels only once the preloader has dismissed, so every
  // letter begins spinning together right as the page becomes interactive.
  useEffect(() => {
    const booted = (window as unknown as { __offhandBooted?: boolean })
      .__offhandBooted;
    if (booted) {
      setRun(true);
      return;
    }
    const on = () => setRun(true);
    window.addEventListener("offhand:booted", on, { once: true });
    return () => window.removeEventListener("offhand:booted", on);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background video, forced monochrome + darkened so no green shows. */}
      <div className={styles.bg} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          src="/pixelwavebg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.mask} />
        <div className={styles.vignette} />
        <div className={styles.grid} />
      </div>

      <div className={styles.inner}>
        <RollHeadline run={run} />

        <p className={styles.sub}>
          AI Automations, Websites, CRM, Marketing, Social, Ads, SaaS and
          Presence, engineered into one system that runs itself.
        </p>

        <div className={styles.actions}>
          <ArrowButton
            href="/contact"
            label="Build a workflow"
            cursorLabel="build"
            strength={0.3}
          />

          <Link href="/projects" className={styles.ghost} data-cursor>
            See the work
          </Link>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollDot} />
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>SCROLL</span>
      </div>
    </section>
  );
}
