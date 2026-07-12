"use client";

import OSTerminal from "./OSTerminal";
import styles from "./bento.module.css";

const TRIES = ["help", "services", "run website"];

/**
 * BentoFeatures — "Everything talks to everything." A live console sits beside
 * the pitch: the OFFHAND OS interactive shell, streaming a sandbox agent's work
 * in real-time. Visitors can type commands and poke the machine themselves.
 */
export default function BentoFeatures() {
  const run = (cmd: string) =>
    window.dispatchEvent(new CustomEvent("offhand:term-run", { detail: cmd }));

  return (
    <section className={styles.section}>
      <div className={styles.live}>
        <div className={styles.liveText}>
          <div className={styles.eyebrow}>
            <span />
            AGENT AS A SERVICE · LIVE
          </div>
          <h2 className={styles.title}>Everything talks to everything.</h2>
          <p className={styles.lead}>
            This is a live console attached to a sandbox agent. Watch it work in
            real-time — or type a command and ask it something.
          </p>
          <div className={styles.tries}>
            {TRIES.map((c) => (
              <button
                key={c}
                className={styles.try}
                onClick={() => run(c)}
                data-cursor
              >
                <span>›</span> try {c}
              </button>
            ))}
          </div>
        </div>

        <OSTerminal />
      </div>
    </section>
  );
}
