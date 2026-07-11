"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import PixelSphere from "./PixelSphere";
import styles from "./agentDashboard.module.css";

/* ------------------------------------------------------------------ */
/*  Data — 9 departments → processes → sequential workflow nodes.      */
/* ------------------------------------------------------------------ */

interface Node {
  title: string;
  sub: string;
}
interface Process {
  name: string;
  nodes: Node[];
}
interface Dept {
  name: string;
  role: string;
  pill: string;
  result: string;
  processes: Process[];
}

const n = (title: string, sub: string): Node => ({ title, sub });

const DEPARTMENTS: Dept[] = [
  {
    name: "Growth",
    role: "Kai",
    pill: "15%",
    result: "Up to 15% abandoned carts recovered",
    processes: [
      {
        name: "Cart Recovery",
        nodes: [
          n("Webhook", "Shopify checkout"),
          n("Identify", "Abandoned cart"),
          n("Select Channel", "Email / WhatsApp"),
          n("Personalise", "Claude copy"),
          n("Send", "Resend / Infobip"),
          n("Track", "Open / click"),
        ],
      },
      {
        name: "Incentive Optimisation",
        nodes: [
          n("Segment", "Customer tier"),
          n("Score", "Propensity model"),
          n("Select Offer", "Discount / free ship"),
          n("Apply", "Coupon engine"),
          n("Deliver", "Kai sends"),
          n("Report", "MoM delta"),
        ],
      },
      {
        name: "Channel Selection",
        nodes: [
          n("Profile", "Customer history"),
          n("Predict", "Optimal channel"),
          n("Route", "Email / WA / SMS"),
          n("Deliver", "Resend / Infobip"),
          n("Measure", "Engagement rate"),
          n("Optimise", "Model update"),
        ],
      },
    ],
  },
  {
    name: "Customer Experience",
    role: "Juno",
    pill: "60%",
    result: "60% of tickets resolved autonomously",
    processes: [
      {
        name: "Order Support",
        nodes: [
          n("Inbound", "Chat / email"),
          n("Intent", "LLM parse"),
          n("Lookup", "Shopify order API"),
          n("Respond", "Claude reply"),
          n("Resolve", "Close ticket"),
          n("Log", "Supabase"),
        ],
      },
      {
        name: "Knowledge Base Search",
        nodes: [
          n("Query", "Customer message"),
          n("Embed", "OpenAI vectors"),
          n("Search", "pgvector lookup"),
          n("Rank", "Top 3 docs"),
          n("Synthesise", "Claude answer"),
          n("Reply", "Support ticket"),
        ],
      },
      {
        name: "$50+ Auto-Escalation",
        nodes: [
          n("Detect", "Order value / time"),
          n("Score", "Urgency + LTV"),
          n("Route", "Senior agent"),
          n("Context Pack", "Full history"),
          n("Hand Off", "Human takes over"),
          n("Resolve", "Close & log"),
        ],
      },
    ],
  },
  {
    name: "Leadership Intelligence",
    role: "Sable",
    pill: "24/7",
    result: "Always-on executive intelligence",
    processes: [
      {
        name: "Daily Business Briefing",
        nodes: [
          n("Pull", "All dept metrics"),
          n("Compute", "WoW / MoM deltas"),
          n("Detect", "Anomalies"),
          n("Synthesise", "Claude narrative"),
          n("Format", "PDF / email"),
          n("Deliver", "Monday 8am"),
        ],
      },
      {
        name: "Anomaly Detection",
        nodes: [
          n("Ingest", "Live metrics"),
          n("Baseline", "Rolling 30d avg"),
          n("Detect", "Threshold breach"),
          n("Classify", "Severity A/B/C"),
          n("Alert", "Slack / email"),
          n("Auto-Ticket", "Assigned to owner"),
        ],
      },
      {
        name: "Cross-Dept Synthesis",
        nodes: [
          n("Collect", "9 dept summaries"),
          n("Correlate", "LLM reasoning"),
          n("Surface", "Key insights"),
          n("Recommend", "Actions"),
          n("Approve", "Founder review"),
          n("Archive", "Supabase log"),
        ],
      },
    ],
  },
  {
    name: "Social CX & ORM",
    role: "Onyx + Wren",
    pill: "+2min",
    result: "Sub-2-minute social response times",
    processes: [
      {
        name: "Social Response",
        nodes: [
          n("Monitor", "X / FB / Instagram"),
          n("Classify", "Query / complaint / praise"),
          n("Draft Reply", "Brand-voice LLM"),
          n("Tone Check", "Wren review"),
          n("Post", "Platform API"),
          n("Log", "Sentiment score"),
        ],
      },
      {
        name: "Crisis Detection",
        nodes: [
          n("Monitor", "Keyword + sentiment"),
          n("Spike Detect", "Anomaly threshold"),
          n("Alert", "Wren → Sable"),
          n("Draft Statement", "LLM response"),
          n("Escalate", "Human review"),
          n("Track", "Resolution log"),
        ],
      },
      {
        name: "Reputation Management",
        nodes: [
          n("Aggregate", "All platforms"),
          n("Score", "Brand health"),
          n("Identify", "Threats / praise"),
          n("Counter", "Proactive posts"),
          n("Report", "Weekly ORM brief"),
          n("Trend", "Month-on-month"),
        ],
      },
    ],
  },
  {
    name: "Commerce",
    role: "Pax",
    pill: "⚡",
    result: "Real-time margin-safe pricing",
    processes: [
      {
        name: "Price Optimisation",
        nodes: [
          n("Pull", "Competitor prices"),
          n("Analyse", "Margin + velocity"),
          n("Model", "Demand curve"),
          n("Propose", "New price"),
          n("7 Guardrails", "Floor / ceiling / margin"),
          n("Update", "Shopify API"),
        ],
      },
      {
        name: "Competitor Monitoring",
        nodes: [
          n("Crawl", "Competitor PDPs"),
          n("Extract", "Price + stock"),
          n("Compare", "SKU-to-SKU"),
          n("Alert", "Price undercut"),
          n("Recommend", "Response price"),
          n("Log", "Price history"),
        ],
      },
      {
        name: "Margin Protection",
        nodes: [
          n("Pull COGS", "Latest cost"),
          n("Set Floor", "Minimum price"),
          n("Monitor", "Real-time"),
          n("Block", "Below-floor sale"),
          n("Alert", "Ops team"),
          n("Report", "Margin erosion"),
        ],
      },
    ],
  },
  {
    name: "Revenue & Finance",
    role: "Halo + Iris",
    pill: "13-wk",
    result: "Rolling 13-week cash visibility",
    processes: [
      {
        name: "P&L Generation",
        nodes: [
          n("Pull Orders", "Shopify + returns"),
          n("Net Revenue", "After returns"),
          n("Apply COGS", "Product cost"),
          n("Gross Margin", "Compute"),
          n("Add Opex", "All departments"),
          n("Report", "P&L statement"),
        ],
      },
      {
        name: "Cash Flow Forecasting",
        nodes: [
          n("Bank Data", "Open banking API"),
          n("Ingest AR/AP", "ERP pull"),
          n("Model", "12-week forecast"),
          n("Scenario", "Base / stress"),
          n("Alert", "Runway breach"),
          n("Report", "CFO view"),
        ],
      },
      {
        name: "Financial Anomaly Alerts",
        nodes: [
          n("Ingest", "Live transactions"),
          n("Baseline", "Normal patterns"),
          n("Detect", "Outlier"),
          n("Classify", "Fraud / error / spike"),
          n("Alert", "Iris → Halo"),
          n("Investigate", "Context packet"),
        ],
      },
    ],
  },
  {
    name: "Operations",
    role: "Ridge",
    pill: "+48s",
    result: "48-second reorder response",
    processes: [
      {
        name: "Inventory Monitoring",
        nodes: [
          n("Pull", "Shopify stock"),
          n("Monitor", "Real-time"),
          n("Threshold", "Low stock rule"),
          n("Alert", "Ops team"),
          n("Trigger Reorder", "Auto PO raise"),
          n("Log", "Stock event"),
        ],
      },
      {
        name: "Reorder Triggers",
        nodes: [
          n("Sales Rate", "Velocity data"),
          n("Forecast", "Days of stock"),
          n("Safety Stock", "Buffer calc"),
          n("Raise PO", "Supplier email / EDI"),
          n("Confirm", "Supplier ACK"),
          n("Update ETA", "Supabase log"),
        ],
      },
      {
        name: "Supply Chain Visibility",
        nodes: [
          n("Ingest", "3PL webhooks"),
          n("Map", "Fulfilment status"),
          n("Detect", "Delays / exceptions"),
          n("Alert", "Ridge → Sable"),
          n("Resolve", "Reroute / escalate"),
          n("Notify", "Customer update"),
        ],
      },
    ],
  },
  {
    name: "Marketing",
    role: "Vero",
    pill: "2.1x",
    result: "2.1x return on ad spend",
    processes: [
      {
        name: "Campaign Performance",
        nodes: [
          n("Pull", "Meta + Google APIs"),
          n("Compute", "ROAS / CPA / CTR"),
          n("Compare", "Target vs actual"),
          n("Alert", "Underperforming ads"),
          n("Auto-Adjust", "Bid strategy"),
          n("Report", "Daily brief"),
        ],
      },
      {
        name: "Content Calendar",
        nodes: [
          n("Plan", "Content schedule"),
          n("Draft", "LLM copy"),
          n("Brand Check", "Voice alignment"),
          n("Schedule", "Social APIs"),
          n("Publish", "Auto-post"),
          n("Measure", "Engagement"),
        ],
      },
      {
        name: "Funnel Analytics",
        nodes: [
          n("Ingest", "Shopify + ad data"),
          n("Map Funnel", "Awareness → conversion"),
          n("Identify", "Drop-off points"),
          n("Attribute", "Multi-touch model"),
          n("Recommend", "Budget shifts"),
          n("Report", "Weekly summary"),
        ],
      },
    ],
  },
  {
    name: "Data & Experimentation",
    role: "Delta",
    pill: "1",
    result: "One source of experimental truth",
    processes: [
      {
        name: "RFM Segmentation",
        nodes: [
          n("Pull Orders", "Shopify data"),
          n("Compute", "Recency / frequency / mon."),
          n("Segment", "Top % RFM tiers"),
          n("Tag", "Customer in Supabase"),
          n("Trigger", "Personalised campaign"),
          n("Report", "Segment health"),
        ],
      },
      {
        name: "A/B Test Orchestration",
        nodes: [
          n("Hypothesis", "Define test"),
          n("Split", "50/50 traffic"),
          n("Assign", "Variants"),
          n("Monitor", "Significance level"),
          n("Declare", "Winner"),
          n("Roll Out", "Winning variant"),
        ],
      },
      {
        name: "Cohort Analysis",
        nodes: [
          n("Define", "Cohort by first order"),
          n("Track", "LTV over time"),
          n("Compute", "Retention curves"),
          n("Compare", "Cohort vs cohort"),
          n("Surface", "Key insights"),
          n("Report", "Sable brief"),
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className={styles.chevron} aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" className={styles.chevronDown} aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PER_ROW = 3; // nodes per row before the pipeline bends down

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgentDashboard() {
  const [dept, setDept] = useState(0);
  const [proc, setProc] = useState(0);

  const activeDept = DEPARTMENTS[dept];
  const activeProc = activeDept.processes[proc];

  // Reset the process tab whenever the department changes.
  const selectDept = (i: number) => {
    setDept(i);
    setProc(0);
  };

  const trail = useMemo(
    () => activeProc.nodes.map((x) => x.title).join(" · "),
    [activeProc]
  );

  // Chunk the nodes into rows so the pipeline snakes down instead of scrolling.
  const rows = useMemo(() => {
    const out: Node[][] = [];
    for (let i = 0; i < activeProc.nodes.length; i += PER_ROW) {
      out.push(activeProc.nodes.slice(i, i + PER_ROW));
    }
    return out;
  }, [activeProc]);

  return (
    <section className={styles.section} aria-label="Agent operating system">
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span />
          THE AGENT MESH
        </div>
        <h2 className={styles.title}>An operating system of agents.</h2>
        <p className={styles.lead}>
          Nine departments, one autonomous team. Pick a specialist and watch the
          exact workflow it runs, live, end to end, while you do the work only
          you can.
        </p>
      </div>

      <div className={styles.frame}>
        {/* Left — departments */}
        <aside className={styles.rail} aria-label="Departments">
          {DEPARTMENTS.map((d, i) => (
            <button
              key={d.name + d.role}
              className={styles.railItem}
              data-on={i === dept}
              onClick={() => selectDept(i)}
              data-cursor
            >
              <span className={styles.railBody}>
                <b className={styles.railName}>
                  {d.name}: <span className={styles.railRole}>{d.role}</span>
                </b>
              </span>
              <span className={styles.pill}>{d.pill}</span>
            </button>
          ))}
        </aside>

        {/* Right — workspace */}
        <div className={styles.work}>
          <div className={styles.workTop}>
            <span className={styles.result}>
              {activeDept.name}: {activeDept.role} ·{" "}
              <b>Result: {activeDept.result}</b>
            </span>
          </div>

          {/* Process tabs */}
          <div className={styles.tabs} role="tablist" aria-label="Processes">
            {activeDept.processes.map((p, i) => (
              <button
                key={p.name}
                className={styles.tab}
                data-on={i === proc}
                onClick={() => setProc(i)}
                role="tab"
                aria-selected={i === proc}
                data-cursor
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className={styles.rule} />

          {/* Pipeline meta + live */}
          <div className={styles.pipeMeta}>
            <span className={styles.pipeTrail}>
              <b>Real workflow&nbsp;</b>
              {trail}
            </span>
            <span className={styles.live} aria-label="Live">
              <i className={styles.liveDot} />
              live
            </span>
          </div>

          {/* Serpentine node pipeline — wraps + bends down (no scroll) */}
          <div
            key={`${dept}-${proc}`}
            className={styles.pipe}
            aria-label={`${activeProc.name} workflow`}
          >
            {rows.map((row, r) => {
              const rtl = r % 2 === 1;
              const display = rtl ? [...row].reverse() : row;
              const base = r * PER_ROW;
              return (
                <Fragment key={r}>
                  <div className={styles.row} data-rtl={rtl}>
                    {display.map((node, j) => {
                      const gi = rtl
                        ? base + (row.length - 1 - j)
                        : base + j;
                      return (
                        <Fragment key={node.title + gi}>
                          <div
                            className={styles.node}
                            style={{ ["--d" as string]: `${gi * 80}ms` }}
                            data-cursor
                          >
                            <b className={styles.nodeTitle}>{node.title}</b>
                            <span className={styles.nodeSub}>{node.sub}</span>
                          </div>
                          {j < display.length - 1 && (
                            <span className={styles.connector} aria-hidden="true">
                              <span className={styles.wire} />
                              <span
                                className={styles.pulse}
                                style={{ ["--pd" as string]: `${j * 240}ms` }}
                              />
                              <Chevron />
                            </span>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>

                  {r < rows.length - 1 && (
                    <div
                      className={styles.turn}
                      data-side={r % 2 === 0 ? "right" : "left"}
                      aria-hidden="true"
                    >
                      <span className={styles.turnCol}>
                        <span className={styles.vwire} />
                        <span className={styles.vpulse} />
                        <ChevronDown />
                      </span>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div className={styles.workFoot}>
            <Link href="/projects" className={styles.caseBtn} data-cursor>
              View case study <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The Core — keep the interactive sphere, nicely labelled */}
      <div className={styles.core}>
        <div className={styles.coreText}>
          <div className={styles.coreEyebrow}>
            <span />
            THE CORE · ASK THE SWARM
          </div>
          <h3 className={styles.coreTitle}>One brain behind every agent.</h3>
          <p className={styles.coreLead}>
            Every department plugs into a single reasoning core. Hover it, poke
            it, feel the system think, then let it run your business while you
            sleep.
          </p>
          <div className={styles.coreInput}>
            <span>Ask the swarm anything…</span>
            <i className={styles.caret} />
          </div>
        </div>
        <div className={styles.coreOrb}>
          <PixelSphere count={820} />
          <span className={styles.coreOrbTag}>NEURAL CORE · LIVE</span>
        </div>
      </div>
    </section>
  );
}
