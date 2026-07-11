import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { ARTICLES } from "@/lib/data";
import styles from "../articles.module.css";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  return {
    title: a ? `${a.title} · OFFHAND` : "Journal · OFFHAND",
    description: a?.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  return (
    <PageShell>
      <article className={styles.article}>
        <Link href="/#journal" className={styles.back} data-cursor>
          ← Journal
        </Link>
        <div className={styles.articleMeta}>
          {a.topic && <span className={styles.articleTopic}>{a.topic}</span>}
          <span>{a.date}</span>
          <span className={styles.dot}>·</span>
          <span>{a.readMins} MIN READ</span>
        </div>
        <h1 className={styles.articleTitle}>{a.title}</h1>
        <p className={styles.articleLead}>{a.excerpt}</p>
        <div className={styles.rule} />
        <div className={styles.articleBody}>
          {a.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {a.source && (
          <footer className={styles.sourceNote}>
            <span className={styles.sourceLabel}>Source</span>
            <a
              href={a.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
              data-cursor
            >
              {a.source.label}
            </a>
          </footer>
        )}
      </article>
    </PageShell>
  );
}
