"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  SERVICES,
  STEPS,
  FAQS,
  WHISPERS,
  CONTACT_EMAIL,
  CTA_PRIMARY,
  CTA_SECONDARY,
} from "@/config/services";
import { useReveal } from "./useReveal";
import styles from "./site.module.css";

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=My%20free%20game%20plan`;
const CALL = `mailto:${CONTACT_EMAIL}?subject=Grab%20a%2015-min%20chat`;

/** A section wrapper that reveals gently on scroll. */
function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-shown={shown}
    >
      {children}
    </Tag>
  );
}

export default function Landing() {
  return (
    <div className={styles.root}>
      <TopBar />

      {/* HERO — over the living Atelier 3D */}
      <header className={styles.hero}>
        <div className={styles.heroScrim} />
        <ActivityChip />
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            A digital studio for people who are great at their craft
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>
              <span>You do your craft.</span>
            </span>
            <span className={styles.heroLine}>
              <span>
                We do <em>the rest.</em>
              </span>
            </span>
          </h1>
          <p className={styles.heroLede}>
            You&apos;re brilliant at what you do. But getting found online has
            become a hundred moving parts. Put it down — we&apos;ll bring the
            customers and quietly run everything else, so you become the
            one-of-one in your field.
          </p>
          <div className={styles.heroActions}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href={MAILTO}>
              {CTA_PRIMARY}
              <span className={styles.btnArrow}>→</span>
            </a>
            <a className={`${styles.btn} ${styles.btnGhost}`} href={CALL}>
              {CTA_SECONDARY}
            </a>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <span />
          watch it come alive
        </div>
      </header>

      {/* INTERLUDE A — the 3D breathes */}
      <Interlude
        kicker="Your business, brought to life"
        line={
          <>
            We build you a little world online — and then we make it{" "}
            <em>wake up.</em>
          </>
        }
      />

      {/* STORY / empathy */}
      <section className={styles.band}>
        <div className={`${styles.bandInner} ${styles.story}`}>
          <div className={styles.storyGrid}>
            <Reveal>
              <div className={styles.eyebrow}>Sound familiar?</div>
              <p className={styles.storyBig}>
                Running a business now means being a website, a marketer, a
                social team and an IT department —{" "}
                <em>on top of the actual job.</em>
              </p>
            </Reveal>
            <Reveal className={styles.storyAside}>
              <p>
                A website. Google. SEO. Socials. Ads. The DMs. The follow-ups.
                The reviews. The &ldquo;you should really be on TikTok.&rdquo; It
                never ends — and the leads you&apos;re missing are the ones that
                hurt most.
              </p>
              <p style={{ marginTop: "16px" }}>
                <strong>So hand it over.</strong> Do the one thing only you can
                do. We&apos;ll handle the rest, and you&apos;ll never think about
                &ldquo;the online stuff&rdquo; again.
              </p>
              <div className={styles.tangle}>
                {[
                  "website",
                  "google",
                  "seo",
                  "instagram",
                  "ads",
                  "follow-ups",
                  "reviews",
                  "the inbox",
                ].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES as outcomes */}
      <section className={styles.band}>
        <div className={styles.bandInner}>
          <div className={styles.servicesHead}>
            <Reveal>
              <div className={styles.eyebrow}>What you actually get</div>
              <h2 className={styles.servicesTitle}>
                Not services. <em>Outcomes.</em>
              </h2>
            </Reveal>
            <Reveal className={styles.storyAside}>
              <p style={{ maxWidth: "34ch" }}>
                We speak in results, not tech. Here&apos;s what changes for your
                business — the machinery stays our problem.
              </p>
            </Reveal>
          </div>
          <div className={styles.grid}>
            {SERVICES.map((s) => (
              <Reveal key={s.num} className={styles.card}>
                <span className={styles.cardGlow} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className={styles.cardNum}>{s.num}</span>
                  <span className={styles.cardWhat}>{s.what}</span>
                </div>
                <div>
                  <h3 className={styles.cardOutcome}>{s.outcome}</h3>
                  <p className={styles.cardLine}>{s.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INTERLUDE B */}
      <Interlude
        kicker="The machine, humming quietly"
        line={
          <>
            Every light that comes on is{" "}
            <em>a customer finding you.</em>
          </>
        }
      />

      {/* HOW IT WORKS */}
      <section className={styles.band}>
        <div className={styles.bandInner}>
          <Reveal>
            <div className={styles.eyebrow}>How it works</div>
            <h2 className={styles.servicesTitle}>
              Three steps. <em>Then you relax.</em>
            </h2>
          </Reveal>
          <div className={styles.steps}>
            {STEPS.map((st) => (
              <Reveal key={st.num} className={styles.step}>
                <div className={styles.stepNum}>{st.num}</div>
                <h3 className={styles.stepTitle}>{st.title}</h3>
                <p className={styles.stepBody}>{st.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST (dark warm band) */}
      <section className={styles.trust}>
        <div className={styles.trustWrap}>
          <Reveal>
            <div className={styles.trustEyebrow}>Why people trust us</div>
            <p className={styles.trustBig}>
              Not techy? <em>Perfect.</em> That&apos;s the whole point of hiring
              us.
            </p>
          </Reveal>
          <div className={styles.trustCols}>
            <Reveal className={styles.trustCol}>
              <span className={styles.pin}>No jargon</span>
              <h4>Plain words, always</h4>
              <p>
                You&apos;ll always know what we&apos;re doing and why — explained
                like a human, never a sales deck.
              </p>
            </Reveal>
            <Reveal className={styles.trustCol}>
              <span className={styles.pin}>No risk</span>
              <h4>A free game plan first</h4>
              <p>
                We map exactly what we&apos;d do for you — on one page, no
                strings — before you commit a penny.
              </p>
            </Reveal>
            <Reveal className={styles.trustCol}>
              <span className={styles.pin}>No babysitting</span>
              <h4>Nothing for you to run</h4>
              <p>
                No dashboards, no logins, no tools to learn. We keep it running
                quietly in the background.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.band}>
        <div className={styles.bandInner}>
          <Reveal>
            <div className={styles.eyebrow}>The honest answers</div>
            <h2 className={styles.servicesTitle}>
              What you&apos;re <em>really</em> wondering.
            </h2>
          </Reveal>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => (
              <Faq key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* INTERLUDE C — pull back to the glowing town */}
      <Interlude
        kicker="And there it is"
        line={
          <>
            This little world? It&apos;s yours — and it&apos;s{" "}
            <em>open for business.</em>
          </>
        }
      />

      {/* CLOSING CTA — over the 3D finale */}
      <section className={styles.ctaWrap}>
        <div className={styles.ctaScrim} />
        <div className={styles.cta}>
          <Reveal>
            <h2 className={styles.ctaTitle}>
              Become the <em>one-of-one.</em>
            </h2>
            <p className={styles.ctaLede}>
              Start with a free game plan. No pressure, no jargon — just a clear
              look at what we&apos;d do to grow your business.
            </p>
            <div className={styles.ctaActions}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href={MAILTO}>
                {CTA_PRIMARY}
                <span className={styles.btnArrow}>→</span>
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href={CALL}>
                {CTA_SECONDARY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`${styles.band} ${styles.footer}`}>
        <span>OFFHAND — you do your craft, we do the rest.</span>
        <a href={MAILTO}>{CONTACT_EMAIL}</a>
        <span className={styles.footSocials}>
          <a href="#" aria-label="Instagram">
            Instagram
          </a>
          <a href="#" aria-label="LinkedIn">
            LinkedIn
          </a>
        </span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

/* ---------- Cinematic interlude (transparent; 3D shows through) ---------- */
function Interlude({
  kicker,
  line,
}: {
  kicker: string;
  line: ReactNode;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  return (
    <section className={styles.interlude}>
      <div
        ref={ref}
        className={`${styles.interludeInner} ${styles.reveal}`}
        data-shown={shown}
      >
        <div className={styles.interludeKicker}>{kicker}</div>
        <p className={styles.interludeLine}>{line}</p>
      </div>
    </section>
  );
}

/* ---------- Floating live-activity chip (the calm machine "singing") ---------- */
function ActivityChip() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WHISPERS.length), 3800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.activityChip}>
      <span className={styles.activityDot} />
      {WHISPERS[i]}
    </div>
  );
}

/* ---------- Quiet whisper top bar ---------- */
function TopBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WHISPERS.length), 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.topbar}>
      <a className={styles.brand} href="#top">
        OFF<span>HAND</span>
      </a>
      <span className={styles.whisper}>
        <span className={styles.whisperDot} />
        {WHISPERS[i]}
      </span>
      <a className={styles.human} href={CALL}>
        Talk to a human
      </a>
    </div>
  );
}

/* ---------- FAQ accordion item ---------- */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faq} ${open ? styles.faqOpen : ""}`}>
      <button
        className={styles.faqQ}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {q}
        <span className={styles.faqIcon} />
      </button>
      <div className={styles.faqA}>
        <p className={styles.faqAInner}>{a}</p>
      </div>
    </div>
  );
}
