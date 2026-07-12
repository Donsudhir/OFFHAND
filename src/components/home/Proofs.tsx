"use client";

import CountUp from "@/components/common/CountUp";
import styles from "./proofs.module.css";

/* ------------------------------------------------------------------ */
/*  Data — fabricated but plausible "deployed systems" case ledger.    */
/*  Each system pairs a step-by-step build with one headline metric.   */
/* ------------------------------------------------------------------ */

type Accent = "emerald" | "blue" | "amber";

interface Metric {
  /** numeric portion animated by CountUp */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  caption: string; // trailing sentence
  strong: string; // emphasised tail of the caption
}

interface System {
  id: string;
  title: string;
  goal: string;
  steps: string[];
  metric: Metric;
  accent: Accent;
}

const SYSTEMS: System[] = [
  {
    id: "SYSTEM 01",
    title: "Autonomous Inbound Concierge",
    goal: "CAPTURE, QUALIFY AND ROUTE EVERY ENQUIRY IN REAL TIME",
    steps: [
      "Branded intake page captures the lead the instant it lands",
      "AI enriches the record and scores fit in under 1.4s",
      "Fires a Slack alert and a personalised SMS to the owner",
      "Books the meeting and provisions portal access automatically",
    ],
    metric: {
      value: 47,
      prefix: "+",
      suffix: "%",
      caption: "Lift in lead-to-meeting conversion. Every handoff arrives with",
      strong: "full context.",
    },
    accent: "emerald",
  },
  {
    id: "SYSTEM 02",
    title: "Voice Agent Booking Desk",
    goal: "QUALIFY AND BOOK CALLS AROUND THE CLOCK",
    steps: [
      "Inbound or trigger-outbound call connects to the voice agent",
      "Qualifies the caller against your live business rules and tone",
      "Checks availability and books straight into the calendar",
      "Logs the transcript and sends an instant confirmation",
    ],
    metric: {
      value: 79,
      suffix: "%",
      caption: "Of routine scheduling calls resolved",
      strong: "without a human touching them.",
    },
    accent: "blue",
  },
  {
    id: "SYSTEM 03",
    title: "Dormant Pipeline Reactivation",
    goal: "MONETISE COLD LISTS AND RESCUE STALLED DEALS",
    steps: [
      "Scans the CRM for dormant contacts and stalled deals",
      "Launches multi-channel re-engagement, personalised per contact",
      "Handles objections and answers questions from your SOPs",
      "Drops recovered opportunities straight onto your calendar",
    ],
    metric: {
      value: 21.6,
      decimals: 1,
      prefix: "$",
      suffix: "K",
      caption: "Revenue recovered in the first 14 days from",
      strong: "dead leads.",
    },
    accent: "amber",
  },
];

/* One measured-outcome panel (big animated figure + caption). */
function MetricPanel({ metric, accent }: { metric: Metric; accent: Accent }) {
  return (
    <div className={`${styles.metric} ${styles[accent]}`}>
      <span className={styles.metricLabel}>MEASURED OUTCOME</span>
      <CountUp
        className={styles.metricValue}
        value={metric.value}
        decimals={metric.decimals ?? 0}
        prefix={metric.prefix ?? ""}
        suffix={metric.suffix ?? ""}
        duration={1800}
      />
      <p className={styles.metricCaption}>
        {metric.caption} <strong>{metric.strong}</strong>
      </p>
    </div>
  );
}

/* The step-by-step build panel. */
function BuildPanel({ system }: { system: System }) {
  return (
    <div className={`${styles.build} ${styles[system.accent]}`}>
      <span className={styles.sysId}>[{system.id}]</span>
      <h3 className={styles.sysTitle}>{system.title}</h3>
      <p className={styles.sysGoal}>GOAL: {system.goal}</p>
      <ol className={styles.steps}>
        {system.steps.map((s, i) => (
          <li key={i} className={styles.step}>
            <span className={styles.stepNum}>0{i + 1}</span>
            <span className={styles.stepText}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Proofs — a "systems ledger": alternating rows pair a documented build
 * (numbered steps) with a single measured outcome. Fabricated demo data.
 */
export default function Proofs() {
  return (
    <section className={styles.section} id="proofs">
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span />
          [ 03 · SYSTEMS LEDGER ]
        </div>
        <h2 className={styles.title}>
          Deployed systems. <em className="serifAccent">Documented results.</em>
        </h2>
        <p className={styles.lead}>
          Not slides. Live machines we&apos;ve wired, running unattended. Here is
          exactly what each one does, and the number it moved. (Figures are
          illustrative demo data.)
        </p>
      </div>

      <div className={styles.grid}>
        {SYSTEMS.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.row} ${i % 2 === 1 ? styles.flip : ""}`}
          >
            <BuildPanel system={s} />
            <MetricPanel metric={s.metric} accent={s.accent} />
          </div>
        ))}
      </div>
    </section>
  );
}
