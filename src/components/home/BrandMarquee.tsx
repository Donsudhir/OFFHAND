"use client";

import { BRANDS } from "@/lib/data";
import styles from "./marquee.module.css";

/** A tiny procedural monochrome "logo" glyph per brand (no image assets). */
function LogoMark({ i }: { i: number }) {
  const shapes = [
    <circle key="c" cx="12" cy="12" r="8" />,
    <rect key="r" x="5" y="5" width="14" height="14" rx="2" />,
    <path key="t" d="M12 4l8 16H4z" />,
    <path key="d" d="M12 3l9 9-9 9-9-9z" />,
    <path key="h" d="M6 4v16M18 4v16M6 12h12" />,
    <path key="x" d="M5 5l14 14M19 5L5 19" />,
  ];
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      {shapes[i % shapes.length]}
    </svg>
  );
}

/**
 * BrandMarquee — an infinite, duplicated row of fabricated client wordmarks.
 * Two identical tracks translate for a seamless loop.
 */
export default function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className={styles.wrap} aria-label="Trusted by (demo brands)">
      <div className={styles.label}>
        <span className={styles.tick} />
        Trusted by teams who&apos;d rather build than babysit
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {row.map((b, i) => (
            <span key={i} className={styles.item}>
              <LogoMark i={i} />
              {b}
            </span>
          ))}
        </div>
        <div className={styles.track} aria-hidden="true">
          {row.map((b, i) => (
            <span key={`b${i}`} className={styles.item}>
              <LogoMark i={i} />
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
