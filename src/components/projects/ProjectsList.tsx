"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import styles from "./projectsList.module.css";

/**
 * ProjectsList — a hover-reactive index. Hovering a row reveals that project's
 * cover photo, which follows the pointer; clicking opens the project.
 */
export default function ProjectsList() {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  };

  return (
    <div className={styles.wrap} onMouseMove={onMove}>
      <div className={styles.list}>
        {PROJECTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className={styles.row}
            data-active={active === i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            data-cursor
            data-cursor-label="open"
          >
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.cat}>{p.category}</span>
            <span className={styles.year}>{p.year}</span>
            {/* inline cover strip that "cuts open" on hover (desktop) */}
            <span className={styles.reveal} data-open={active === i}>
              <Image
                src={p.image}
                alt=""
                fill
                sizes="160px"
                className={styles.rowImg}
              />
            </span>
          </Link>
        ))}
      </div>

      {/* cursor-following cover preview */}
      <div
        ref={previewRef}
        className={styles.preview}
        data-show={active !== null}
        aria-hidden="true"
      >
        {PROJECTS.map((p, i) => (
          <Image
            key={p.slug}
            src={p.image}
            alt=""
            fill
            sizes="300px"
            className={styles.previewImg}
            data-on={active === i}
          />
        ))}
      </div>
    </div>
  );
}
