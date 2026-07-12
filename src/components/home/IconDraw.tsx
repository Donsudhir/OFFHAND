"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import styles from "./iconDraw.module.css";

/**
 * IconDraw — a 4-column grid on a dark dotted-grid background. Each SVG icon
 * "draws itself in" (line-drawing via stroke-dasharray / stroke-dashoffset over
 * ~2s), then a soft fill + glow fades in. Triggers when scrolled into view.
 *
 * NOTE: this project has no Tailwind, so the layout uses a CSS Module (project
 * convention). The draw + glow are standard CSS keyframes as requested.
 */

const ICONS: { src: string; label: string; copy: string }[] = [
  {
    src: "/lock.svg",
    label: "Secure Guard",
    copy: "Fort-grade encryption on every layer. Your data stays yours: audited, isolated, and never handed off.",
  },
  {
    src: "/chatbot.svg",
    label: "Agent Build",
    copy: "Custom agents that think in your logic and act on your behalf, wired straight into the tools you already run.",
  },
  {
    src: "/automation.svg",
    label: "Cloud Scale",
    copy: "Infrastructure that flexes with demand, from ten users to ten million without a single dropped request.",
  },
  {
    src: "/datamining.svg",
    label: "Data Mining",
    copy: "Turn raw noise into signal. Pipelines and vector stores that surface what actually moves the needle.",
  },
];

type SvgData = { viewBox: string; paths: string[] };

function DrawIcon({ src }: { src: string }) {
  const [data, setData] = useState<SvgData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch the SVG, pull out its viewBox + path data (drop attribution <text>).
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        const viewBox = svg?.getAttribute("viewBox") ?? "0 0 100 100";
        const paths = Array.from(doc.querySelectorAll("path"))
          .map((p) => p.getAttribute("d") ?? "")
          .filter(Boolean);
        setData({ viewBox, paths });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Measure each path's true length so the dash draw is exact.
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.setProperty("--len", `${Math.ceil(len)}`);
    });
  }, [data]);

  if (!data) return <span className={styles.iconSlot} aria-hidden="true" />;

  return (
    <svg
      ref={svgRef}
      className={styles.icon}
      viewBox={data.viewBox}
      role="presentation"
      aria-hidden="true"
    >
      {data.paths.map((d, i) => (
        <path key={i} d={d} className={styles.path} />
      ))}
    </svg>
  );
}

export default function IconDraw() {
  // Replay-on-reveal: once=false so `inView` toggles. It flips true as the row
  // enters from the bottom (bottom rootMargin) and flips false once it fully
  // leaves — so the draw restarts every time you scroll to the section and is
  // never missed by having already finished.
  const [ref, inView] = useInView<HTMLDivElement>({
    once: false,
    threshold: 0,
    rootMargin: "-10% 0px -20% 0px",
  });
  const reduced = useReducedMotion();
  const active = inView || reduced;

  return (
    <section className={styles.section} aria-label="Capabilities">
      <div className={styles.container}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} />
            CORE CAPABILITIES
          </span>
        </div>

        <div
          ref={ref}
          className={styles.grid}
          data-active={active ? "true" : "false"}
        >
          {ICONS.map((icon) => (
            <div key={icon.src} className={styles.item}>
              <div className={styles.iconWrap}>
                <DrawIcon src={icon.src} />
              </div>
              <span className={styles.label}>{icon.label}</span>
              <p className={styles.copy}>{icon.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
