"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./engines.module.css";

/* Brand marks (single-colour, currentColor). */
function Mark({ type }: { type: string }) {
  switch (type) {
    case "openai":
      return (
        <svg viewBox="0 0 24 24" className={styles.mark} fill="currentColor" aria-hidden="true">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1686a.0757.0757 0 0 1-.071 0l-4.8303-2.7864A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
        </svg>
      );
    case "claude":
      return (
        <svg viewBox="0 0 24 24" className={styles.mark} fill="currentColor" aria-hidden="true">
          <path d="M17.3041 3.541h-3.6718l6.696 16.918H24ZM6.6959 3.541 0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.541Zm-.3712 10.2412 2.2914-5.9456 2.2914 5.9456Z" />
        </svg>
      );
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className={styles.mark} fill="currentColor" aria-hidden="true">
          <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12" />
        </svg>
      );
    case "perplexity":
      return (
        <svg viewBox="0 0 24 24" className={styles.mark} fill="currentColor" aria-hidden="true">
          <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.272h2.884V.114l7.053 6.256V.043h1.091v6.352zm-7.037 8.44v7.828l5.946 5.232V13.28zm-1.31 7.618V8.428L5.5 13.293v8.077zM4.384 8.464h-1.79v7.982h1.79zm15.194 7.982h1.822V8.464h-1.822zm-7.688-9.081h6.916L11.19 1.193zm-1.089 0V1.213L4.914 7.365z" />
        </svg>
      );
    default:
      return null;
  }
}

const ENGINES = [
  { key: "openai", label: "GPT" },
  { key: "claude", label: "CLAUDE" },
  { key: "gemini", label: "GEMINI" },
  { key: "perplexity", label: "PERPLEXITY" },
];

/**
 * AIEngines — overlapping circular brand marks of the models OFFHAND builds on.
 * The circles reveal one after another, left → right, when the row is genuinely
 * scrolled into view. The observer only arms AFTER the preloader has dismissed
 * (offhand:booted) so a transient boot-time layout can't fire it early.
 */
export default function AIEngines() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    let obs: IntersectionObserver | null = null;

    const arm = () => {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs?.disconnect();
          }
        },
        // Require the row to be a good bit into the viewport before revealing.
        { threshold: 0, rootMargin: "0px 0px -22% 0px" }
      );
      obs.observe(el);
    };

    const booted = (window as unknown as { __offhandBooted?: boolean })
      .__offhandBooted;
    if (booted) {
      arm();
    } else {
      window.addEventListener("offhand:booted", arm, { once: true });
    }

    return () => {
      window.removeEventListener("offhand:booted", arm);
      obs?.disconnect();
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container} ref={ref} data-inview={inView ? "true" : "false"}>
        <p className={styles.lead}>
          Wired into the engines that matter, your data connected to the models
          doing the real work.
        </p>
        <div className={styles.cluster}>
          {ENGINES.map((e, i) => (
            <span
              key={e.key}
              className={styles.orb}
              style={{ transitionDelay: `${i * 160}ms`, zIndex: ENGINES.length - i }}
              aria-label={e.label}
              title={e.label}
            >
              <Mark type={e.key} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
