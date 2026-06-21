/**
 * OFFHAND OS — module content config.
 * Single source of truth for the 8 service modules (order = journey order).
 */

export interface ModuleDef {
  num: string; // "01"
  name: string; // short HUD name, matches SECTIONS in useOS
  screen: string; // cinematic screen name
  tag: string; // one-liner shown on the label plate / dock
  blurb: string; // longer line for SEO + dock copy
}

export const MODULES: ModuleDef[] = [
  {
    num: "01",
    name: "WEBSITES",
    screen: "THE BUILD",
    tag: "Sites that build themselves.",
    blurb: "Design, development and deploy — a site that assembles itself in front of you.",
  },
  {
    num: "02",
    name: "CRM",
    screen: "THE PIPELINE",
    tag: "Every lead, on rails.",
    blurb: "Leads captured, scored and moved from first touch to won — automatically.",
  },
  {
    num: "03",
    name: "MARKETING",
    screen: "THE FUNNEL",
    tag: "Attention into revenue.",
    blurb: "Full-funnel strategy that turns strangers into customers and compounds over time.",
  },
  {
    num: "04",
    name: "SOCIAL",
    screen: "THE FEED ENGINE",
    tag: "Always posting. Never tired.",
    blurb: "An always-on content engine that composes, schedules and optimises itself.",
  },
  {
    num: "05",
    name: "ADS",
    screen: "THE BROADCAST",
    tag: "Spend that finds people.",
    blurb: "Paid media that radiates reach and optimises every impression toward revenue.",
  },
  {
    num: "06",
    name: "AUTOMATION",
    screen: "THE LOOM",
    tag: "It runs itself. That's the point.",
    blurb: "AI automation that does the boring 90% — the engine running the whole system.",
  },
  {
    num: "07",
    name: "SAAS",
    screen: "THE PRODUCT",
    tag: "We build the tool, not just the site.",
    blurb: "Custom SaaS tools wired to your logic — the product, not just the page.",
  },
  {
    num: "08",
    name: "PRESENCE",
    screen: "THE CONSTELLATION",
    tag: "One system. Everywhere you are.",
    blurb: "Your complete digital presence, connected into one living system.",
  },
];
