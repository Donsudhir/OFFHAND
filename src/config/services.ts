/**
 * OFFHAND v2 — site content (warm, plain-language, outcome-first).
 * The hero is the customer; OFFHAND is the calm guide. No jargon.
 */

export interface Service {
  num: string;
  /** Plain-language outcome (the headline the owner cares about). */
  outcome: string;
  /** Quiet "what it is" so they connect it to a known thing. */
  what: string;
  /** One warm supporting line. */
  line: string;
}

export const SERVICES: Service[] = [
  {
    num: "01",
    outcome: "A website that actually brings you customers",
    what: "Websites",
    line: "Not just pretty — built to turn visitors into booked, paying customers.",
  },
  {
    num: "02",
    outcome: "Never miss a lead or forget a follow-up",
    what: "CRM & follow-up",
    line: "Every enquiry captured and gently chased, so nothing slips through the cracks.",
  },
  {
    num: "03",
    outcome: "Get found by people ready to buy",
    what: "Marketing & SEO",
    line: "Show up when someone in your area is searching for exactly what you do.",
  },
  {
    num: "04",
    outcome: "Show up online — without lifting a finger",
    what: "Social media",
    line: "We post, reply and keep you present, while you stay focused on the work.",
  },
  {
    num: "05",
    outcome: "Reach the right people, not everyone",
    what: "Ads & paid reach",
    line: "Spend that finds real buyers near you — never wasted on the wrong crowd.",
  },
  {
    num: "06",
    outcome: "Your business keeps working while you rest",
    what: "Automation",
    line: "The quiet stuff — reminders, bookings, replies — handled in the background.",
  },
  {
    num: "07",
    outcome: "Your own simple tool, built around how you work",
    what: "Custom tools",
    line: "If an app would make your day easier, we build it — shaped to your way.",
  },
  {
    num: "08",
    outcome: "Look as legit as the big brands",
    what: "Complete presence",
    line: "One polished, consistent presence everywhere people look for you.",
  },
];

/** "How it works" — disarm the fear of the unknown with a plain 3-step path. */
export const STEPS = [
  {
    num: "01",
    title: "A friendly chat",
    body: "Tell us about your business in plain words. No tech talk, no pressure. We listen.",
  },
  {
    num: "02",
    title: "We build your game plan",
    body: "You get a clear, one-page plan of exactly what we'd do — and what it's worth to you.",
  },
  {
    num: "03",
    title: "We handle it. You get back to work.",
    body: "We set everything up and quietly keep it running. You just watch the customers arrive.",
  },
];

/** Grandma-proof FAQ — answer the real fears, out loud. */
export const FAQS = [
  {
    q: "I'm not techy at all. Is that a problem?",
    a: "It's the whole point. You never touch a dashboard or learn a tool. You do your work; we handle everything online.",
  },
  {
    q: "I've been burned by an agency before.",
    a: "Fair. That's why we start with a free, no-strings game plan and keep everything in plain language — so you always know exactly what's happening and why.",
  },
  {
    q: "I don't have time for this.",
    a: "That's exactly why we exist. After one short chat, the rest is on us. Your time stays yours.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on what you actually need — no bloated packages. We'll tell you straight in your game plan, with no surprises.",
  },
  {
    q: "How soon will I see results?",
    a: "We get the essentials live quickly, then keep improving. You'll feel the difference in weeks, not months.",
  },
];

/** Rotating examples of the calm machine "singing" with good news. */
export const WHISPERS = [
  "3 new leads came in while you were reading this.",
  "12 enquiries answered for you today.",
  "Your page reached 4,200 nearby people this week.",
  "2 bookings landed overnight.",
  "Your follow-ups went out — automatically.",
];

export const CONTACT_EMAIL = "hello@offhand.studio";
export const CTA_PRIMARY = "See what we'd do for you — free";
export const CTA_SECONDARY = "Grab a 15-min chat";
