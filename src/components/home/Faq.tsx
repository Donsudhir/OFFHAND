"use client";

import { useMemo, useState } from "react";
import { FAQS } from "@/lib/data";
import styles from "./faq.module.css";

/**
 * Faq — grouped accordion. A tab row filters by group; rows expand one at a time.
 */
export default function Faq() {
  const groups = useMemo(() => [...new Set(FAQS.map((f) => f.group))], []);
  const [group, setGroup] = useState(groups[0]);
  const [open, setOpen] = useState<number | null>(0);

  const items = FAQS.filter((f) => f.group === group);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span />
            COMMON INQUIRIES
          </div>
          <h2 className={styles.title}>
            Everything you need
            <br />
            to know.
          </h2>
          <div className={styles.tabs}>
            {groups.map((g) => (
              <button
                key={g}
                className={`${styles.tab} ${g === group ? styles.tabOn : ""}`}
                onClick={() => {
                  setGroup(g);
                  setOpen(0);
                }}
                data-cursor
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.list}>
          {items.map((f, i) => (
            <div key={f.q} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
              <button
                className={styles.q}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                data-cursor
              >
                <span>{f.q}</span>
                <i className={styles.plus} />
              </button>
              <div className={styles.aWrap}>
                <p className={styles.a}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
