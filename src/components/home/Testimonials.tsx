"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import styles from "./testimonials.module.css";

/**
 * Testimonials — a monochrome quote slider with prev/next + dots. Fabricated
 * quotes from demo brands.
 */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const n = TESTIMONIALS.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const t = TESTIMONIALS[i];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span />
          FROM THE PIONEERS
        </div>

        <div className={styles.stage}>
          <blockquote key={i} className={styles.quote}>
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className={styles.foot}>
            <div className={styles.author}>
              <span className={styles.avatar}>{t.author.charAt(0)}</span>
              <div>
                <b>{t.author}</b>
                <span>
                  {t.role} · {t.company}
                </span>
              </div>
            </div>
            <div className={styles.rating} aria-label={`${t.rating} out of 5`}>
              {"★".repeat(t.rating)}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.dots}>
            {TESTIMONIALS.map((_, di) => (
              <button
                key={di}
                className={`${styles.dot} ${di === i ? styles.dotOn : ""}`}
                onClick={() => setI(di)}
                aria-label={`Go to testimonial ${di + 1}`}
                data-cursor
              />
            ))}
          </div>
          <div className={styles.arrows}>
            <button onClick={() => go(-1)} aria-label="Previous" data-cursor>
              ←
            </button>
            <button onClick={() => go(1)} aria-label="Next" data-cursor>
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
