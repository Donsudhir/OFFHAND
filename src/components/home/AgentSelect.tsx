"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks";
import styles from "./agentSelect.module.css";

/* ------------------------------------------------------------------ */
/*  Roster — 8 specialists, each with a cover portrait.                 */
/* ------------------------------------------------------------------ */

interface Agent {
  img: string;
  codename: string;
  pillar: string;
  role: "DUELIST" | "SENTINEL" | "INITIATOR" | "CONTROLLER";
  signature: string;
  line: string;
  stat: { value: string; label: string };
  glow: string; // radiant hue behind the section, matched to the cover art
}

const AGENTS: Agent[] = [
  {
    img: "/pokemons/download.jpeg",
    codename: "IGNIS",
    pillar: "WEBSITES",
    role: "DUELIST",
    signature: "RUN IT BACK",
    line: "Ships fast, self-heals on failure, comes back stronger every deploy.",
    stat: { value: "0.8s", label: "PAGE SPEED" },
    glow: "#ff6a1a",
  },
  {
    img: "/pokemons/download5.jpeg",
    codename: "VERDANT",
    pillar: "CRM",
    role: "SENTINEL",
    signature: "RESURRECTION",
    line: "Brings dead leads back to life. No contact ever goes cold.",
    stat: { value: "1,240", label: "LEADS REVIVED" },
    glow: "#54d76a",
  },
  {
    img: "/pokemons/3.jpeg",
    codename: "ORACLE",
    pillar: "MARKETING",
    role: "INITIATOR",
    signature: "RECON",
    line: "Reveals exactly where your buyers hide, then aims every dollar at them.",
    stat: { value: "+312%", label: "PIPELINE LIFT" },
    glow: "#b06bff",
  },
  {
    img: "/pokemons/download1.jpeg",
    codename: "TEMPEST",
    pillar: "SOCIAL",
    role: "DUELIST",
    signature: "SHOWSTOPPER",
    line: "Goes loud on every feed, all day, never tired. Content that detonates.",
    stat: { value: "64/mo", label: "POSTS SHIPPED" },
    glow: "#3aa0ff",
  },
  {
    img: "/pokemons/download2.jpeg",
    codename: "SALVO",
    pillar: "ADS",
    role: "DUELIST",
    signature: "SOUL HARVEST",
    line: "Every conversion feeds the next. Spend that compounds itself into profit.",
    stat: { value: "6.1x", label: "RETURN ON AD SPEND" },
    glow: "#21c7ff",
  },
  {
    img: "/pokemons/download8.jpeg",
    codename: "NOCTURNE",
    pillar: "AUTOMATION",
    role: "INITIATOR",
    signature: "SUPPRESS",
    line: "Runs the boring ninety percent while you sleep. Wakes you only for good news.",
    stat: { value: "160/mo", label: "HOURS SAVED" },
    glow: "#ffcf3a",
  },
  {
    img: "/pokemons/download7.jpeg",
    codename: "NEXUS",
    pillar: "SAAS",
    role: "SENTINEL",
    signature: "LOCKDOWN",
    line: "Deploys custom tools that guard and run your operations end to end.",
    stat: { value: "1,240", label: "TASKS / DAY" },
    glow: "#00e0c6",
  },
  {
    img: "/pokemons/download4.jpeg",
    codename: "HALO",
    pillar: "PRESENCE",
    role: "CONTROLLER",
    signature: "GATECRASH",
    line: "Teleports your brand into every channel at once. One source of truth.",
    stat: { value: "+88%", label: "LOCAL REACH" },
    glow: "#8ea2ff",
  },
];

/* ------------------------------------------------------------------ */
/*  Section — an "AGENT SELECT" pick screen with cover portraits.       */
/* ------------------------------------------------------------------ */

export default function AgentSelect() {
  const [sel, setSel] = useState(0);
  const [active, setActive] = useState(false);
  const [hot, setHot] = useState(false);
  const [cut, setCut] = useState(0); // bump to replay the swap flourish
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const pick = useCallback((i: number) => {
    setSel((prev) => {
      if (prev !== i) setCut((c) => c + 1);
      return i;
    });
  }, []);

  useEffect(() => {
    if (reduced) {
      setActive(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      pick((sel + 1) % AGENTS.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      pick((sel - 1 + AGENTS.length) % AGENTS.length);
    }
  };

  const a = AGENTS[sel];

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Our agents"
      data-active={active ? "true" : "false"}
      data-hot={hot ? "true" : "false"}
      style={{ ["--gc" as string]: a.glow }}
    >
      {/* Radiant glow behind the WHOLE section, tinted to the active cover. */}
      <div className={styles.glowField} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>
            <span />
            SELECT YOUR AGENT · 8 SPECIALISTS
          </div>
          <h2 className={styles.title} data-text="Our agents">
            Our agents
          </h2>
          <p className={styles.lead}>
            Eight specialists, one squad. Each runs a corner of your operation
            with its own signature play. Hover a name or the card to read the
            intel.
          </p>
        </div>

        <div
          className={styles.lobby}
          data-active={active ? "true" : "false"}
          onKeyDown={onKey}
          onMouseEnter={() => setHot(true)}
          onMouseLeave={() => setHot(false)}
        >
          {/* Roster */}
          <div className={styles.roster} role="listbox" aria-label="Agent roster">
            {AGENTS.map((ag, i) => (
              <button
                key={ag.codename}
                className={styles.rosterItem}
                data-on={i === sel}
                style={{ ["--i" as string]: i }}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                role="option"
                aria-selected={i === sel}
                data-cursor
              >
                <span className={styles.rNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.rBody}>
                  <span className={styles.rName}>{ag.codename}</span>
                  <span className={styles.rRole}>{ag.role}</span>
                </span>
                <span className={styles.rTick} aria-hidden="true" />
              </button>
            ))}
          </div>

          {/* Stage — a single image-width cover card */}
          <div className={styles.stage}>
            <div className={styles.stageGrid} aria-hidden="true" />

            <article
              key={cut}
              className={styles.card}
              data-cursor
              data-cursor-label="intel"
            >
              {/* Stacked covers crossfade so switching is instant + smooth */}
              <div className={styles.covers} aria-hidden="true">
                {AGENTS.map((ag, i) => (
                  <Image
                    key={ag.codename}
                    src={ag.img}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 88vw, 460px"
                    priority={i === 0}
                    className={styles.cover}
                    data-on={i === sel}
                  />
                ))}
                <div className={styles.grain} />
                <div className={styles.vignette} />
              </div>

              {/* Corner HUD */}
              <div className={styles.cardTop}>
                <span className={styles.roleTag}>{a.role}</span>
                <span className={styles.idTag}>
                  {String(sel + 1).padStart(2, "0")} / 08
                </span>
              </div>

              {/* Detail — revealed on hover */}
              <div className={styles.detail}>
                <span className={styles.pillarTag}>{a.pillar}</span>
                <h3 className={styles.codename}>{a.codename}</h3>
                <div className={styles.signature}>
                  <b>›</b> {a.signature}
                </div>

                <div className={styles.reveal}>
                  <p className={styles.line}>{a.line}</p>
                  <div className={styles.foot}>
                    <div className={styles.stat}>
                      <b>{a.stat.value}</b>
                      <span>{a.stat.label}</span>
                    </div>
                    <Link
                      href="/contact"
                      className={styles.lockin}
                      data-cursor
                      data-cursor-label="lock in"
                    >
                      LOCK IN <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
