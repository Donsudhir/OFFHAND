"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./textreveal.module.css";

const COPY =
  "One team. One system. We build the website that pulls customers in, the CRM that never drops a lead, and the automations that handle the boring ninety percent, all wired together, all running while you sleep.";

/**
 * TextReveal — the copy starts as dim outline and "fills" word-by-word with
 * light as the block scrolls through the viewport. Pure scroll-linked, no libs.
 */
export default function TextReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const words = COPY.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let active = false;

    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.3;
      const p = (start - r.top) / (start - end + r.height);
      setProgress(Math.max(0, Math.min(1, p)));
      raf = requestAnimationFrame(update);
    };

    // Only run the scroll-linked loop while the block is near the viewport.
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
      { rootMargin: "200px 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const filled = progress * words.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span />
          WHAT WE ACTUALLY DO
        </div>
        <p ref={ref} className={styles.copy}>
          {words.map((w, i) => {
            const o = Math.max(0.12, Math.min(1, filled - i + 0.5));
            return (
              <span
                key={i}
                className={styles.word}
                style={{ opacity: o, color: o > 0.85 ? "var(--fg)" : undefined }}
              >
                {w}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
