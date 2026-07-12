import Link from "next/link";
import Orb from "@/components/common/Orb";
import { ARTICLES } from "@/lib/data";
import styles from "./journal.module.css";
import cards from "@/app/articles/articles.module.css";

/**
 * Journal — homepage articles section. Same dark theme as the rest of the
 * page (no paper background). Reuses the article card styling; each card opens
 * a reading page.
 */
export default function Journal() {
  return (
    <section className={styles.section} id="journal">
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span />
          [ 06 · THE JOURNAL ]
        </div>
        <h2 className={styles.title}>
          From the <em className="serifAccent">automation frontier.</em>
        </h2>
        <p className={styles.lead}>
          Quiet, practical thinking on agentic workflows, calm technology, and
          building systems that run themselves.
        </p>
      </div>

      <div className={cards.grid}>
        {ARTICLES.map((a, i) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className={cards.card}
            data-cursor
            data-cursor-label="read"
          >
            <div className={cards.orb}>
              <Orb seed={(i + 3) * 23} spin={false} />
            </div>
            <div className={cards.meta}>
              {a.topic && <span className={cards.topic}>{a.topic}</span>}
              <span className={cards.metaSpacer} />
              <span>{a.date}</span>
              <span className={cards.dot}>·</span>
              <span>{a.readMins} MIN</span>
            </div>
            <h3 className={cards.cardTitle}>{a.title}</h3>
            <p className={cards.excerpt}>{a.excerpt}</p>
            <span className={cards.more}>Read article →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
