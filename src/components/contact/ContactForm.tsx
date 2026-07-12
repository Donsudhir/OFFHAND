"use client";

import { useState } from "react";
import Magnetic from "@/components/common/Magnetic";
import styles from "./contact.module.css";

/** Where every enquiry is addressed. */
const OFFHAND_EMAIL = "offhand.digital@gmail.com";

/**
 * Deliver an enquiry to OFFHAND via Web3Forms, straight from the browser.
 * (Web3Forms keys are public form IDs by design — client-side is how they're
 * meant to be used; a server proxy gets 403'd by their Cloudflare protection.)
 */
async function sendToWeb3Forms(subject: string, message: string, replyto?: string) {
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
        subject,
        replyto: replyto || undefined,
        message,
      }),
    });
  } catch {
    /* best-effort */
  }
}

const SERVICES = [
  "Website",
  "CRM",
  "Marketing",
  "Social",
  "Ads",
  "Automation",
  "SaaS tool",
  "Full presence",
];

/**
 * ContactForm — a calm, low-pressure enquiry form. On submit it delivers the
 * details to OFFHAND (via Web3Forms) and shows a confirmation state.
 */
export default function ContactForm() {
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [doing, setDoing] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    void sendToWeb3Forms(
      `New enquiry — ${name}`,
      [
        "Source: Contact page",
        `Name: ${name}`,
        `Email: ${email}`,
        `What I do: ${doing || "—"}`,
        `Company website: ${website || "—"}`,
        `Should handle: ${picked.length ? picked.join(", ") : "—"}`,
        "",
        "Anything else:",
        note || "—",
      ].join("\n"),
      email
    );
  }

  if (sent) {
    return (
      <div className={styles.done}>
        <div className={styles.doneMark}>✓</div>
        <h3>Almost there — just hit send.</h3>
        <p>
          We&apos;ve opened a pre-filled email in a new tab with our address
          already in the To field. If it didn&apos;t open (pop-up blocked?),
          email us directly at{" "}
          <a className={styles.doneLink} href={`mailto:${OFFHAND_EMAIL}`}>
            {OFFHAND_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Your name</label>
        <input
          type="text"
          placeholder="Jane Maker"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          placeholder="jane@yourshop.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>What do you do?</label>
        <input
          type="text"
          placeholder="I run a small coffee roastery"
          value={doing}
          onChange={(e) => setDoing(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>Your company&apos;s website</label>
        <input
          type="text"
          placeholder="yourshop.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>What should the machine handle?</label>
        <div className={styles.chips}>
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.chip} ${picked.includes(s) ? styles.chipOn : ""}`}
              onClick={() => toggle(s)}
              data-cursor
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label>Anything else?</label>
        <textarea
          rows={4}
          placeholder="A sentence about where you're stuck…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Magnetic as="span" strength={0.2} className={styles.submitWrap}>
        <button
          type="submit"
          className={styles.submit}
          data-cursor
          data-cursor-label="send"
        >
          Send it, free game plan
          <span>→</span>
        </button>
      </Magnetic>
      <p className={styles.mailNote}>
        Opens a pre-filled email to{" "}
        <a className={styles.mailNoteLink} href={`mailto:${OFFHAND_EMAIL}`}>
          {OFFHAND_EMAIL}
        </a>{" "}
        in a new tab — just press send.
      </p>
      <p className={styles.reassure}>
        Not techy? Perfect. That&apos;s the whole point.
      </p>
    </form>
  );
}
