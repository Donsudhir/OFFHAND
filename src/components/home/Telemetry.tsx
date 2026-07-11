"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import CountUp from "@/components/common/CountUp";
import styles from "./telemetry.module.css";

const SWEEP = 1500; // ms — fill / sweep duration (matches CountUp)
const STAGGER = 120; // ms between cards

/* ================================================================== */
/*  Viz 1 — bare number with a thin loading underbar.                 */
/* ================================================================== */
function BarLine({ fill, active, delay }: { fill: number; active: boolean; delay: number }) {
  return (
    <div className={styles.underbar} aria-hidden="true">
      <span
        className={styles.underbarFill}
        style={{
          transform: `scaleX(${active ? fill : 0})`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Viz 2 — full circle dial with clock-style tick marks.             */
/* ================================================================== */
function ClockDial({ fill, active, delay }: { fill: number; active: boolean; delay: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className={styles.dial}>
      <svg viewBox="0 0 120 120" className={styles.dialSvg}>
        {/* clock ticks all the way around */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const major = i % 5 === 0;
          const outer = 58;
          const inner = major ? 48 : 53;
          return (
            <line
              key={i}
              x1={60 + Math.cos(a) * inner}
              y1={60 + Math.sin(a) * inner}
              x2={60 + Math.cos(a) * outer}
              y2={60 + Math.sin(a) * outer}
              className={major ? styles.tickMajor : styles.tick}
            />
          );
        })}
        <g className={styles.dialRot}>
          <circle className={styles.dialTrack} cx="60" cy="60" r={R} />
          <circle
            className={styles.dialFill}
            cx="60"
            cy="60"
            r={R}
            strokeDasharray={C}
            strokeDashoffset={active ? C * (1 - fill) : C}
            style={{ transitionDelay: `${delay}ms` }}
          />
        </g>
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  Viz 3 — non-uniform bars rising from a baseline.                  */
/* ================================================================== */
const BAR_HEIGHTS = [44, 72, 56, 90, 66, 100, 78];
function RisingBars({ active, delay }: { active: boolean; delay: number }) {
  return (
    <div className={styles.bars} aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <span key={i} className={styles.barCol}>
          <span
            className={styles.bar}
            style={{
              height: active ? `${h}%` : "0%",
              transitionDelay: `${delay + i * 70}ms`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Viz 4 — speedometer (semicircle arc + needle).                    */
/* ================================================================== */
function Speedometer({ fill, active, delay }: { fill: number; active: boolean; delay: number }) {
  const angle = -90 + fill * 180;
  const trans = { transitionDelay: `${delay}ms` };
  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 200 116" className={styles.gaugeSvg}>
        {Array.from({ length: 25 }).map((_, i) => {
          const a = Math.PI - (i / 24) * Math.PI;
          const major = i % 4 === 0;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 90}
              y1={100 - Math.sin(a) * 90}
              x2={100 + Math.cos(a) * (major ? 74 : 80)}
              y2={100 - Math.sin(a) * (major ? 74 : 80)}
              className={major ? styles.tickMajor : styles.tick}
            />
          );
        })}
        <path className={styles.arcTrack} d="M14 100 A86 86 0 0 1 186 100" pathLength={1} />
        <path
          className={styles.arcFill}
          d="M14 100 A86 86 0 0 1 186 100"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={active ? 1 - fill : 1}
          style={trans}
        />
        <g
          className={styles.needle}
          style={{ transform: `rotate(${active ? angle : -90}deg)`, ...trans }}
        >
          <line x1="100" y1="100" x2="100" y2="34" className={styles.needleLine} />
        </g>
        <circle cx="100" cy="100" r="5.5" className={styles.needleHub} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Metrics — each maps to one of the four viz types.                  */
/* ------------------------------------------------------------------ */

type Viz = "number" | "clock" | "bars" | "speedo";

interface Metric {
  label: string;
  sub: string;
  value: number;
  prefix?: string;
  suffix: string;
  fill: number; // 0..1
  viz: Viz;
}

const METRICS: Metric[] = [
  { label: "Launch Success", sub: "Adoption across teams", value: 98, suffix: "%", fill: 0.98, viz: "number" },
  { label: "Average ROI", sub: "Compounding returns", value: 17, suffix: "x", fill: 0.86, viz: "clock" },
  { label: "Revenue Impact", sub: "Attributed growth", value: 25, prefix: "$", suffix: "M", fill: 0.62, viz: "bars" },
  { label: "Faster Operations", sub: "Hours saved / month", value: 49, suffix: "h", fill: 0.72, viz: "speedo" },
];

/**
 * Telemetry — "Every pulse, in real time." Four cards, each a different
 * data visualization (number, clock dial, rising bars, speedometer) that
 * fills while the number — shown ABOVE it — counts up. Fires once on view.
 */
export default function Telemetry() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const active = inView || reduced;

  // Only arm the scroll observer AFTER the preloader has dismissed. During boot
  // the page layout is transient (sections collapsed near the top), which can
  // make an IntersectionObserver fire immediately on load — so the animation
  // would already be "done" before you scroll to it. Gating on `offhand:booted`
  // guarantees the fill/count-up plays exactly when the section scrolls in.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let obs: IntersectionObserver | null = null;
    const arm = () => {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs?.disconnect();
          }
        },
        { threshold: 0.25, rootMargin: "0px 0px -12% 0px" }
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
  }, [reduced]);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span />
          LIVE TELEMETRY
        </div>
        <h2 className={styles.title}>Every pulse, in real time.</h2>
        <p className={styles.lead}>
          Deep insight into what the machine is doing: adoption, returns, revenue
          and speed, so the system stays honest even when you&apos;re not looking.
        </p>
      </div>

      <div
        ref={ref}
        className={styles.grid}
        data-active={active ? "true" : "false"}
      >
        {METRICS.map((m, i) => {
          const delay = i * STAGGER;
          return (
            <div className={styles.card} key={m.label}>
              <div className={styles.cardHead}>
                <h3>{m.label}</h3>
                <span>{m.sub}</span>
              </div>

              {/* Number ABOVE the visualization */}
              <div className={styles.num} data-viz={m.viz}>
                {m.prefix && <i className={styles.affix}>{m.prefix}</i>}
                <CountUp
                  value={m.value}
                  duration={SWEEP}
                  delay={delay}
                  start={active}
                />
                <i className={styles.affix}>{m.suffix}</i>
              </div>

              <div className={styles.viz}>
                {m.viz === "number" && <BarLine fill={m.fill} active={active} delay={delay} />}
                {m.viz === "clock" && <ClockDial fill={m.fill} active={active} delay={delay} />}
                {m.viz === "bars" && <RisingBars active={active} delay={delay} />}
                {m.viz === "speedo" && <Speedometer fill={m.fill} active={active} delay={delay} />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
