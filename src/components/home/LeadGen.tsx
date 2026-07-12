"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import styles from "./leadGen.module.css";

/** Where every enquiry is addressed. Shown by the form + used as mailto `to`. */
const OFFHAND_EMAIL = "offhand.digital@gmail.com";

/** GMV (gross merchandise value) bands for the qualifier dropdown. */
const GMV_OPTIONS = ["Under $1M", "$1–5M", "$5–10M", "Above $10M"];

/**
 * Deliver an enquiry to OFFHAND via Web3Forms, straight from the browser.
 * Web3Forms access keys are public form identifiers (rate-limited + spam-
 * protected on their end), and the API is designed to be called client-side —
 * this is why it works reliably from the browser but 403s from a server proxy.
 * Best-effort: the visitor already sees the confirmation regardless.
 */
async function sendToWeb3Forms(fields: {
  subject: string;
  replyto?: string;
  message: string;
}) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.warn("Web3Forms key missing — set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.");
    return;
  }
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: "OFFHAND Website",
        subject: fields.subject,
        replyto: fields.replyto || undefined,
        message: fields.message,
      }),
    });
  } catch {
    /* best-effort */
  }
}

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "200+", label: "AI models" },
  { value: "15+", label: "Integrations" },
  { value: "<60s", label: "Event-to-action" },
];

const QUOTES = [
  {
    text:
      "AI is the new electricity. Just as electricity transformed almost every major industry a hundred years ago, AI will transform every major industry.",
    author: "Andrew Ng",
    role: "Founder, DeepLearning.AI",
  },
  {
    text:
      "The development of full artificial intelligence could be the most important tool we have ever created — it will reshape every industry it touches.",
    author: "Bill Gates",
    role: "Co-founder, Microsoft",
  },
  {
    text:
      "AI is one of the most profound things we're working on as humanity. It's more profound than fire or electricity.",
    author: "Sundar Pichai",
    role: "CEO, Google",
  },
];

const NEXT_STEPS = [
  { n: "01", t: "Share your brief", d: "Takes 2 minutes." },
  { n: "02", t: "2-hour response", d: "We review and architect a solution." },
  { n: "03", t: "Agents go live", d: "First systems deployed within days." },
];

/* ------------------------------------------------------------------ */
/*  Inline icons (project convention — no icon library)                */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

const Icon = {
  Legal: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0L5 7Zm14 0-3 6a3 3 0 0 0 6 0l-3-6Z" />
      <path d="M7 21h10M8 7h8" />
    </svg>
  ),
  Health: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M3 12h4l2 5 4-10 2 5h6" />
    </svg>
  ),
  Commerce: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9.5" cy="20" r="1.2" />
      <circle cx="17.5" cy="20" r="1.2" />
    </svg>
  ),
  Saas: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M8 21h8M12 18v3" />
    </svg>
  ),
  Arrow: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Mail: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
};

const BUSINESS_TYPES = [
  { key: "legal", label: "Legal & Professional", sub: "Law firms, consulting, agencies", Icon: Icon.Legal },
  { key: "health", label: "Health & Wellness", sub: "Gyms, clinics, fitness centers", Icon: Icon.Health },
  { key: "ecom", label: "E-commerce & D2C", sub: "Shopify, marketplaces", Icon: Icon.Commerce },
  { key: "saas", label: "B2B SaaS", sub: "Software, technical products", Icon: Icon.Saas },
] as const;

/* ------------------------------------------------------------------ */
/*  Quote carousel                                                     */
/* ------------------------------------------------------------------ */

function QuoteCarousel() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const q = QUOTES[i];

  return (
    <figure className={styles.quoteCard}>
      <span className={styles.quoteMark} aria-hidden="true">
        &ldquo;
      </span>
      <blockquote key={i} className={styles.quoteText}>
        {q.text}
      </blockquote>
      <figcaption className={styles.quoteBy}>
        <span className={styles.quoteAuthor}>{q.author}</span>
        <span className={styles.quoteRole}>{q.role}</span>
      </figcaption>
      <div className={styles.dots} role="tablist" aria-label="Quotes">
        {QUOTES.map((_, di) => (
          <button
            key={di}
            type="button"
            className={`${styles.dot} ${di === i ? styles.dotOn : ""}`}
            aria-label={`Show quote ${di + 1}`}
            aria-selected={di === i}
            role="tab"
            onClick={() => setI(di)}
            data-cursor
          />
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Multi-step form                                                    */
/* ------------------------------------------------------------------ */

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  gmv: string;
  bottleneck: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  gmv: "",
  bottleneck: "",
};

function LeadForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [sent, setSent] = useState(false);

  function pick(key: string) {
    setType(key);
    // brief pause so the "selected" state is felt before advancing
    window.setTimeout(() => setStep(2), 260);
  }

  function set<K extends keyof Fields>(k: K, v: string) {
    setFields((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const chosen = BUSINESS_TYPES.find((b) => b.key === type);
    // Show the confirmation immediately, then deliver quietly in the background.
    setSent(true);
    void sendToWeb3Forms({
      subject: `New OFFHAND enquiry — ${fields.name}${fields.company ? ` (${fields.company})` : ""}`,
      replyto: fields.email,
      message: [
        `Source: Deploy section`,
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Phone: ${fields.phone || "—"}`,
        `Company: ${fields.company || "—"}`,
        `Website: ${fields.website || "—"}`,
        `Operation: ${chosen?.label ?? "—"}`,
        `GMV: ${fields.gmv || "—"}`,
        "",
        "Bottleneck:",
        fields.bottleneck || "—",
      ].join("\n"),
    });
  }

  if (sent) {
    return (
      <div className={styles.formCard}>
        <div className={styles.queue}>
          <div className={styles.tickWrap} aria-hidden="true">
            <svg className={styles.tickSvg} viewBox="0 0 72 72">
              <circle className={styles.tickCircle} cx="36" cy="36" r="33" />
              <path className={styles.tickCheck} d="M22 37.5 L32 47.5 L51 26" />
            </svg>
            <span className={styles.tickRing} />
          </div>
          <h3 className={styles.queueTitle}>You&apos;re in the queue.</h3>
          <p className={styles.queueCopy}>
            Founders will personally review your application and reach out within
            24 hours to book a discovery call.
          </p>
          <button
            type="button"
            className={styles.sentReset}
            onClick={() => {
              setSent(false);
              setStep(1);
              setType(null);
              setFields(EMPTY);
            }}
            data-cursor
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.formCard} accentFrame`}>
      <div className={styles.formHead}>
        <span className={styles.formStep}>
          STEP {step} OF 2 — {step === 1 ? "YOUR BUSINESS" : "HOW TO REACH YOU"}
        </span>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} data-step={step} />
        </div>
      </div>

      <div className={styles.stepViewport}>
        {step === 1 ? (
          <div className={styles.stepIn} key="s1">
            <p className={styles.prompt}>What best describes your operation?</p>
            <div className={styles.typeGrid}>
              {BUSINESS_TYPES.map((b) => {
                const B = b.Icon;
                return (
                  <button
                    key={b.key}
                    type="button"
                    className={`${styles.typeBtn} ${type === b.key ? styles.typeOn : ""}`}
                    onClick={() => pick(b.key)}
                    data-cursor
                  >
                    <B className={styles.typeIcon} />
                    <span className={styles.typeLabel}>{b.label}</span>
                    <span className={styles.typeSub}>{b.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <form className={styles.stepIn} key="s2" onSubmit={submit}>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Full name</span>
                <input
                  className={styles.input}
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fields.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Work email</span>
                <input
                  className={styles.input}
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={fields.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </label>
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone number</span>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={fields.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Company name</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Company, Inc."
                  value={fields.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Company website</span>
              <input
                className={styles.input}
                type="text"
                placeholder="yourcompany.com"
                value={fields.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Your GMV</span>
              <select
                className={`${styles.input} ${styles.select}`}
                value={fields.gmv}
                onChange={(e) => set("gmv", e.target.value)}
              >
                <option value="" disabled>
                  Select annual GMV range…
                </option>
                {GMV_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Main bottleneck</span>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                placeholder="What manual process is slowing you down?"
                value={fields.bottleneck}
                onChange={(e) => set("bottleneck", e.target.value)}
              />
            </label>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.back}
                onClick={() => setStep(1)}
                data-cursor
              >
                ← Back
              </button>
              <button
                type="submit"
                className={styles.submit}
                data-cursor
                data-cursor-label="send"
              >
                Request Blueprint
                <Icon.Arrow className={styles.submitArrow} />
              </button>
            </div>
            <p className={styles.mailHint}>
              No spam. Founders personally review every application within 24
              hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function LeadGen() {
  return (
    <section className={styles.section} id="deploy">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.grid}>
        {/* Pane 1 — vision + quotes */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>
            <span className={styles.live} />
            DEPLOYMENT
          </span>
          <h2 className={styles.title}>
            Ready to deploy your <em className="serifAccent">agentic workforce?</em>
          </h2>
          <p className={styles.sub}>
            Tell us about your operational bottlenecks, and we&apos;ll architect
            the automation blueprint.
          </p>

          <a className={styles.emailChip} href={`mailto:${OFFHAND_EMAIL}`} data-cursor data-cursor-label="email">
            <span className={styles.emailChipLabel}>Or email us directly</span>
            <span className={styles.emailChipValue}>
              <Icon.Mail className={styles.emailChipIcon} />
              {OFFHAND_EMAIL}
            </span>
          </a>

          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <b className={styles.statValue}>{s.value}</b>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <QuoteCarousel />
        </div>

        {/* Pane 2 — form + next steps */}
        <div className={styles.right}>
          <LeadForm />

          <ol className={styles.timeline}>
            {NEXT_STEPS.map((s) => (
              <li key={s.n} className={styles.tlItem}>
                <span className={styles.tlBadge}>{s.n}</span>
                <div className={styles.tlBody}>
                  <span className={styles.tlTitle}>{s.t}</span>
                  <span className={styles.tlDesc}>{s.d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
