import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ContactForm from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/data";
import sub from "@/components/layout/subpage.module.css";
import styles from "./contactPage.module.css";

export const metadata: Metadata = {
  title: "Contact · OFFHAND",
  description: "Start your build. Tell us where you're stuck and get a free one-page game plan.",
};

export default function ContactPage() {
  return (
    <PageShell theme="graphite">
      <section className={sub.hero}>
        <div className={sub.heroGlow} />
        <div className={sub.heroInner}>
          <div className={sub.eyebrow}>
            <span />
            START YOUR BUILD
          </div>
          <h1 className={sub.title}>
            Put it down.
            <br />
            We&apos;ve got it.
          </h1>
          <p className={sub.lead}>
            You&apos;re brilliant at what you do. Running a business shouldn&apos;t
            mean juggling a website, a CRM, ads, socials and a hundred other
            parts. Tell us where you&apos;re stuck and we&apos;ll bring back a plan.
          </p>
        </div>
      </section>

      <div className={styles.grid}>
        <ContactForm />
        <aside className={styles.aside}>
          <div className={styles.block}>
            <span className={styles.blockHead}>Prefer to talk?</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
              {CONTACT_EMAIL}
            </a>
            <p>We reply within one working day.</p>
          </div>
          <div className={styles.block}>
            <span className={styles.blockHead}>How it goes</span>
            <ol className={styles.steps}>
              <li>You tell us where it hurts.</li>
              <li>We send a free one-page game plan.</li>
              <li>If it fits, we build the machine.</li>
              <li>You get back to your craft.</li>
            </ol>
          </div>
          <div className={styles.block}>
            <span className={styles.blockHead}>No-risk</span>
            <p>
              The first plan costs nothing and there&apos;s no long contract.
              Stay because it works.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
