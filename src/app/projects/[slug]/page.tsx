import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { PROJECTS } from "@/lib/data";
import styles from "../project.module.css";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  return {
    title: p ? `${p.name} · OFFHAND` : "Project · OFFHAND",
    description: p?.summary,
  };
}

/* Small inline stat icons (project convention — no icon library). */
const STAT_ICONS = [
  // coins / funding
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>,
  // spark / visibility
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>,
  // chart / growth
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" />
  </svg>,
  // handshake / return
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m11 17 2 2 4-4M3 10l4-3 5 4 5-4 4 3M3 10v4l6 5M21 10v4" />
  </svg>,
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();
  const p = PROJECTS[idx];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <PageShell>
      <article className={styles.page}>
        {/* ---- Hero ---- */}
        <header className={styles.hero}>
          <div className={styles.bg}>
            <Image
              src={p.image}
              alt={p.name}
              fill
              priority
              sizes="100vw"
              className={styles.bgImg}
            />
            <div className={styles.bgTint} />
            <div className={styles.bgFade} />
          </div>

          <div className={styles.heroInner}>
            <Link href="/#work" className={styles.back} data-cursor>
              ← All work
            </Link>
            <span className={styles.brandMark}>◆ {p.name.split(" ")[0].toLowerCase()}</span>
            <h1 className={styles.title}>{p.name}</h1>
            <p className={styles.summary}>{p.summary}</p>
          </div>
        </header>

        <div className={styles.body}>
          {/* ---- Metric band ---- */}
          <section className={styles.metrics}>
            {p.bigMetrics.map((m, i) => (
              <div key={m.label} className={styles.metric}>
                <span className={styles.metricIcon}>{STAT_ICONS[i % STAT_ICONS.length]}</span>
                <b className={styles.metricValue}>{m.value}</b>
                <p className={styles.metricBlurb}>{m.blurb}</p>
              </div>
            ))}
          </section>

          {/* ---- Quote + sidebar ---- */}
          <section className={styles.quoteRow}>
            <div className={styles.quoteCol}>
              <blockquote className={styles.quote}>
                &ldquo;{p.quote.text}&rdquo;
              </blockquote>
              <div className={styles.quoteBy}>
                <span className={styles.quoteAuthor}>{p.quote.author}</span>
                <span className={styles.quoteRole}>{p.quote.role}</span>
              </div>
              <p className={styles.overviewIntro}>{p.overview[0]}</p>
            </div>

            <aside className={styles.aside}>
              <div className={styles.asideItem}>
                <span className={styles.asideLabel}>Industry</span>
                <div className={styles.tags}>
                  {p.industries.map((ind) => (
                    <span key={ind} className={styles.tag}>{ind}</span>
                  ))}
                </div>
              </div>
              <div className={styles.asideItem}>
                <span className={styles.asideLabel}>Timeline</span>
                <span className={styles.asideValue}>{p.timeline}</span>
              </div>
              <div className={styles.asideItem}>
                <span className={styles.asideLabel}>Platform</span>
                <span className={styles.asideValue}>{p.platform}</span>
              </div>
              <div className={styles.asideItem}>
                <span className={styles.asideLabel}>Live website</span>
                <span className={styles.asideLink} data-cursor>{p.liveUrl}</span>
              </div>
            </aside>
          </section>

          {/* ---- Overview split ---- */}
          <section className={styles.split}>
            <p>{p.overview[0]}</p>
            <p>{p.overview[1]}</p>
          </section>

          {/* ---- Highlights ---- */}
          <section className={styles.highlights}>
            {p.highlights.map((h) => (
              <div key={h} className={styles.highlight}>
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className={styles.highlightText}>{h}</span>
              </div>
            ))}
          </section>

          {/* ---- Closing ---- */}
          <section className={styles.closing}>
            <h2 className={styles.closingStatement}>{p.closing.statement}</h2>
            <p className={styles.closingBody}>{p.closing.body}</p>
          </section>

          {/* ---- Next ---- */}
          <div className={styles.next}>
            <span className={styles.nextLabel}>Next project</span>
            <Link href={`/projects/${next.slug}`} data-cursor data-cursor-label="next">
              <span className={styles.nextName}>{next.name} →</span>
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
