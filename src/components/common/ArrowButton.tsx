"use client";

import Link from "next/link";
import Magnetic from "@/components/common/Magnetic";
import styles from "./arrowButton.module.css";

/**
 * ArrowButton — a premium pill CTA. On hover an accent fill wipes across the
 * button from the arrow badge, the label colour inverts, and the arrow "flies"
 * out to the right while a fresh one slides in from the left (continuous swap).
 * Wrapped in Magnetic so the whole thing eases toward the pointer.
 */
export default function ArrowButton({
  href,
  label,
  cursorLabel,
  strength = 0.27,
  className,
}: {
  href: string;
  label: string;
  cursorLabel?: string;
  strength?: number;
  className?: string;
}) {
  return (
    <Magnetic
      as="span"
      strength={strength}
      className={`${styles.wrap}${className ? ` ${className}` : ""}`}
    >
      <Link
        href={href}
        className={styles.btn}
        data-cursor
        data-cursor-label={cursorLabel}
      >
        <span className={styles.fill} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        <span className={styles.badge} aria-hidden="true">
          <span className={styles.track}>
            <Arrow />
            <Arrow />
          </span>
        </span>
      </Link>
    </Magnetic>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M4 12h15M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
