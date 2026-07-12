"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./beforeAfter.module.css";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const BEFORE = {
  kicker: "Before working with us",
  lead: "Growth stalls when every tool is disconnected and every task is manual.",
  points: [
    {
      title: "Slow Execution Cycles",
      body: "Projects crawl behind manual approvals and unclear handoffs.",
    },
    {
      title: "Operational Overload",
      body: "Teams burn hours on repetitive busywork instead of real strategy.",
    },
    {
      title: "Blind Spots",
      body: "No single source of truth, so nothing is measured or trusted.",
    },
  ],
};

const AFTER = {
  kicker: "After working with us",
  lead: "One connected system brings clarity, speed and scale to every workflow.",
  points: [
    {
      title: "Accelerated Delivery",
      body: "Automation moves work forward the moment it's ready to ship.",
    },
    {
      title: "Operational Clarity",
      body: "The team focuses on craft while the machine handles the rest.",
    },
    {
      title: "Scalable Systems",
      body: "Reliable, documented and built to compound over the long run.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function Cross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 12.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section — scroll-linked "Before vs After"                         */
/* ------------------------------------------------------------------ */

export default function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }

    let raf = 0;
    let active = false;

    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh; // scrollable distance while pinned
      // 0 while the heading sits centred; 1 once scrolled through the block.
      const prog = total > 0 ? -r.top / total : 0;
      setP(Math.max(0, Math.min(1, prog)));
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          active = true;
          raf = requestAnimationFrame(update);
        } else if (!entry.isIntersecting && active) {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "0px 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Heading drifts apart + fades over the first ~55% of the scroll.
  const spread = Math.min(1, p / 0.55);
  // Cards rise into the same spot over the back half.
  const cardP = Math.max(0, Math.min(1, (p - 0.4) / 0.5));

  const stageStyle = {
    ["--spread" as string]: spread.toFixed(3),
    ["--cp" as string]: cardP.toFixed(3),
  } as React.CSSProperties;

  return (
    <section className={styles.wrap} ref={ref}>
      <div className={styles.sticky}>
        <div className={styles.stage} style={stageStyle}>
          {/* Heading — pinned centre, drifts apart + vanishes */}
          <h2 className={styles.heading} aria-label="Before vs After">
            <span className={`${styles.word} ${styles.before}`}>Before</span>
            <span className={styles.vs}>vs</span>
            <span className={`${styles.word} ${styles.after}`}>After</span>
          </h2>

          {/* Cards — rise into the heading's place */}
          <div className={styles.grid} aria-hidden={cardP < 0.05}>
            {/* BEFORE */}
            <article className={`${styles.card} ${styles.cardBefore}`}>
              <header className={styles.cardHead}>
                <h3>{BEFORE.kicker}</h3>
                <p>{BEFORE.lead}</p>
              </header>
              <div className={styles.rule} />
              <ul className={styles.points}>
                {BEFORE.points.map((pt) => (
                  <li key={pt.title}>
                    <span className={`${styles.icon} ${styles.iconBad}`}>
                      <Cross />
                    </span>
                    <div>
                      <b>{pt.title}</b>
                      <span>{pt.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* AFTER */}
            <article className={`${styles.card} ${styles.cardAfter}`}>
              <span className={styles.corner} aria-hidden="true" />
              <header className={styles.cardHead}>
                <h3>{AFTER.kicker}</h3>
                <p>{AFTER.lead}</p>
              </header>
              <div className={styles.rule} />
              <ul className={styles.points}>
                {AFTER.points.map((pt) => (
                  <li key={pt.title}>
                    <span className={`${styles.icon} ${styles.iconGood}`}>
                      <Check />
                    </span>
                    <div>
                      <b>{pt.title}</b>
                      <span>{pt.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
