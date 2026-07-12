"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Magnetic from "@/components/common/Magnetic";
import { NAV_LINKS } from "@/lib/data";
import styles from "./navbar.module.css";

const STAGGER = 0.035;

/**
 * RollText — a label whose glyphs roll upward on hover while a second copy
 * rolls in from below, each letter staggered from the centre outward. Pure CSS
 * (no framer-motion): two stacked rows + per-letter transition-delay.
 */
function RollText({ text }: { text: string }) {
  const chars = [...text];
  const mid = (chars.length - 1) / 2;
  const row = (clone: boolean) => (
    <span
      className={`${styles.rollRow}${clone ? ` ${styles.rollClone}` : ""}`}
      aria-hidden="true"
    >
      {chars.map((c, i) => (
        <span
          key={i}
          className={styles.rollChar}
          style={{ transitionDelay: `${STAGGER * Math.abs(i - mid)}s` }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
  return (
    <span className={styles.roll}>
      <span className={styles.rollHidden}>{text}</span>
      {row(false)}
      {row(true)}
    </span>
  );
}

/**
 * Navbar — fixed monochrome bar. The menu button drops a fullscreen panel from
 * above, split in two: a looping number-stream video (left) and the rolling-text
 * navigation list (right).
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Solidify the bar once the user leaves the hero (transform/opacity only).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={styles.bar}
        data-scrolled={scrolled && !open ? "true" : "false"}
      >
        <Link href="/" className={styles.brand} data-cursor-label="home">
          <span className={styles.brandDot} />
          OFFHAND
        </Link>

        <nav className={styles.mid}>
          {NAV_LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className={styles.midLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <Magnetic as="span" strength={0.27} className={styles.ctaWrap}>
            <Link href="/#deploy" className={styles.cta} data-cursor-label="talk">
              Start your build
            </Link>
          </Magnetic>
          <button
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor
          >
            <span className={`${styles.icon} ${open ? styles.iconOpen : ""}`}>
              <i />
              <i />
            </span>
            <span className={styles.menuLabel}>{open ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </header>

      {/* Backdrop scrim — click to dismiss. */}
      <div
        className={`${styles.scrim} ${open ? styles.scrimOpen : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Right-side drawer — rolling-text navigation. */}
      <aside
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-hidden={!open}
      >
        <nav className={styles.links}>
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.bigLink}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${0.05 * i + 0.12}s` : "0s" }}
            >
              <span className={styles.bigIndex}>0{i + 1}</span>
              <span className={styles.bigLabel}>
                <RollText text={l.label} />
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

