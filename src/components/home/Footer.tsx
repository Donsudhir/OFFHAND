"use client";

import Link from "next/link";
import { useState } from "react";
import { LightBoard } from "@/components/common/LightBoard";
import { CONTACT_EMAIL } from "@/lib/data";
import styles from "./footer.module.css";

/* Link columns — real routes only. */
const COLS: { head: string; links: { label: string; href: string }[] }[] = [
  {
    head: "Work",
    links: [
      { label: "Selected work", href: "/#work" },
      { label: "Journal", href: "/#journal" },
      { label: "Proofs", href: "/#proofs" },
    ],
  },
  {
    head: "Infrastructure",
    links: [
      { label: "Websites & SaaS", href: "/#work" },
      { label: "CRM & pipelines", href: "/#work" },
      { label: "AI automation", href: "/#work" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Deploy agents", href: "/#deploy" },
    ],
  },
];

/* Inline social marks (project convention — no icon library). */
function Social({ name, path }: { name: string; path: React.ReactNode }) {
  return (
    <a href="#" aria-label={name} className={styles.social} data-cursor>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        {path}
      </svg>
    </a>
  );
}

/**
 * Footer — fixed beneath the page (content scrolls up to reveal it). Premium,
 * comprehensive: brand + mission + live status + newsletter, three link
 * columns, an ambient LightBoard, and a bottom bar with legal + socials.
 */
export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        {/* Brand + mission + status + newsletter */}
        <div className={styles.brand}>
          <span className={styles.mark}>OFFHAND</span>
          <p className={styles.mission}>
            Engineering digital leverage for modern businesses.
          </p>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            All systems operational
          </span>

          <form
            className={styles.news}
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            <input
              type="email"
              required
              className={styles.newsInput}
              placeholder={subscribed ? "You're on the list ✓" : "Your email"}
              aria-label="Newsletter email"
              disabled={subscribed}
            />
            <button
              type="submit"
              className={styles.newsBtn}
              aria-label="Subscribe"
              data-cursor
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className={styles.cols}>
          {COLS.map((c) => (
            <div key={c.head} className={styles.col}>
              <span className={styles.colHead}>{c.head}</span>
              {c.links.map((l) => (
                <Link key={l.label} href={l.href} className={styles.colLink}>
                  {l.label}
                </Link>
              ))}
              {c.head === "Company" && (
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.colLink}>
                  {CONTACT_EMAIL}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.board} aria-hidden="true">
        <LightBoard
          text="OFFHAND · OFFHAND · OFFHAND"
          rows={9}
          lightSize={7}
          gap={2}
          updateInterval={90}
          colors={{
            background: "rgba(255, 255, 255, 0.04)",
            textDim: "rgba(168, 85, 247, 0.35)",
            textBright: "rgba(216, 180, 254, 0.95)",
          }}
        />
      </div>

      {/* Bottom bar */}
      <div className={styles.base}>
        <span className={styles.copy}>OFFHAND OS v1.0 · © 2026</span>
        <div className={styles.legal}>
          <a href="#" className={styles.legalLink}>Privacy Policy</a>
          <a href="#" className={styles.legalLink}>Terms</a>
        </div>
        <div className={styles.socials}>
          <Social
            name="X"
            path={<path fill="currentColor" d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5-6.6L5.4 22H2.3l8-9.2L1.7 2h7l4.5 6 5.7-6Zm-2.4 18h1.7L7.6 3.8H5.8L16.5 20Z" />}
          />
          <Social
            name="LinkedIn"
            path={<path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9V9Z" />}
          />
          <Social
            name="GitHub"
            path={<path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.39.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />}
          />
        </div>
      </div>
    </footer>
  );
}
