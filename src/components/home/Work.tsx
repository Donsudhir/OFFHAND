import ProjectsList from "@/components/projects/ProjectsList";
import styles from "./work.module.css";

/**
 * Work — homepage "selected work" section. Heading + the hover-reactive
 * ProjectsList index (each row opens a case-study detail page).
 */
export default function Work() {
  return (
    <section className={styles.section} id="work">
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span />
          [ 05 · SELECTED WORK ]
        </div>
        <h2 className={styles.title}>
          Orchestrating the <em className="serifAccent">invisible workforce.</em>
        </h2>
        <p className={styles.lead}>
          A curated selection of autonomous systems and digital infrastructure
          engineered for high-leverage operations. Hover any entry to look
          inside; open one to read the full case study.
        </p>
      </div>

      <ProjectsList />
    </section>
  );
}
