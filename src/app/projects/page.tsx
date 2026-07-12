import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ProjectsList from "@/components/projects/ProjectsList";
import sub from "@/components/layout/subpage.module.css";

export const metadata: Metadata = {
  title: "Projects · OFFHAND",
  description:
    "Selected work: full-stack builds where design, engineering, and operations arrive as one delivery.",
};

export default function ProjectsIndexPage() {
  return (
    <PageShell theme="graphite">
      <section className={sub.hero}>
        <div className={sub.heroGlow} />
        <div className={sub.heroInner}>
          <div className={sub.eyebrow}>
            <span />
            SELECTED WORK
          </div>
          <h1 className={sub.title}>
            Builds that <em>shipped</em>.
          </h1>
          <p className={sub.lead}>
            A short list. Each one is a full delivery — brand, product, and the
            operational machinery around it — put into the client&apos;s hands
            and left running.
          </p>
        </div>
      </section>

      <div className={sub.body}>
        <ProjectsList />
      </div>
    </PageShell>
  );
}
