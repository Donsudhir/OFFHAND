/**
 * OFFHAND — site content (fabricated demo data).
 *
 * NOTE: every client, project, testimonial, metric and article below is
 * INVENTED for demonstration. Names/logos are fictional. Nothing here maps to
 * a real company or person.
 */

/* ------------------------------------------------------------------ */
/*  The 8 pillars — what OFFHAND actually does (all of it, offhand).    */
/* ------------------------------------------------------------------ */
export interface Pillar {
  num: string;
  key: string;
  name: string;
  screen: string;
  tag: string;
  blurb: string;
  plain: string; // grandma-proof one-liner
  capabilities: string[];
}

export const PILLARS: Pillar[] = [
  {
    num: "01",
    key: "websites",
    name: "WEBSITES",
    screen: "THE BUILD",
    tag: "Sites that build themselves.",
    blurb:
      "Design, development and deploy. A site that assembles itself in front of you.",
    plain: "A website that actually brings you customers.",
    capabilities: ["Design systems", "Next.js / headless", "SEO baked in", "Analytics"],
  },
  {
    num: "02",
    key: "crm",
    name: "CRM",
    screen: "THE PIPELINE",
    tag: "Every lead, on rails.",
    blurb:
      "Leads captured, scored and moved from first touch to won, automatically.",
    plain: "Never miss a lead or a follow-up again.",
    capabilities: ["Lead capture", "Scoring", "Pipelines", "Auto follow-up"],
  },
  {
    num: "03",
    key: "marketing",
    name: "MARKETING",
    screen: "THE FUNNEL",
    tag: "Attention into revenue.",
    blurb:
      "Full-funnel strategy that turns strangers into customers and compounds over time.",
    plain: "Get found by people who are ready to buy.",
    capabilities: ["Strategy", "Content", "Email", "Attribution"],
  },
  {
    num: "04",
    key: "social",
    name: "SOCIAL",
    screen: "THE FEED ENGINE",
    tag: "Always posting. Never tired.",
    blurb:
      "An always-on content engine that composes, schedules and optimises itself.",
    plain: "Show up online without lifting a finger.",
    capabilities: ["Calendars", "Auto-compose", "Scheduling", "Reporting"],
  },
  {
    num: "05",
    key: "ads",
    name: "ADS",
    screen: "THE BROADCAST",
    tag: "Spend that finds people.",
    blurb:
      "Paid media that radiates reach and optimises every impression toward revenue.",
    plain: "Reach the right people, not everyone.",
    capabilities: ["Paid search", "Paid social", "Retargeting", "Creative testing"],
  },
  {
    num: "06",
    key: "automation",
    name: "AUTOMATION",
    screen: "THE LOOM",
    tag: "It runs itself. That's the point.",
    blurb:
      "AI automation that does the boring 90%, the engine running the whole system.",
    plain: "Your business runs while you sleep.",
    capabilities: ["AI agents", "Workflows", "Integrations", "Error recovery"],
  },
  {
    num: "07",
    key: "saas",
    name: "SAAS",
    screen: "THE PRODUCT",
    tag: "We build the tool, not just the site.",
    blurb:
      "Custom SaaS tools wired to your logic. The product, not just the page.",
    plain: "Your own simple tool, built around how you work.",
    capabilities: ["Product design", "Full-stack", "Billing", "Dashboards"],
  },
  {
    num: "08",
    key: "presence",
    name: "PRESENCE",
    screen: "THE CONSTELLATION",
    tag: "One system. Everywhere you are.",
    blurb:
      "Your complete digital presence, connected into one living system.",
    plain: "Look as legit as the big brands.",
    capabilities: ["Brand", "Directories", "Reviews", "One source of truth"],
  },
];

/* ------------------------------------------------------------------ */
/*  Headline stats (count-up on view).                                 */
/* ------------------------------------------------------------------ */
export interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

export const STATS: Stat[] = [
  { value: 8, suffix: "", label: "Systems, one operator", decimals: 0 },
  { value: 312, suffix: "%", label: "Avg. pipeline lift", decimals: 0 },
  { value: 90, suffix: "%", label: "Busywork automated away", decimals: 0 },
  { value: 24, suffix: "/7", label: "The machine never sleeps", decimals: 0 },
];

/* ------------------------------------------------------------------ */
/*  Telemetry-style dashboard cards (live-ish gauges).                 */
/* ------------------------------------------------------------------ */
export const TELEMETRY = {
  systemLoad: { value: 98.7, label: "System load", sub: "Active neural processing", core: 15 },
  uptime: { value: 99.99, label: "SLA response", sub: "Global uptime monitoring" },
  tokens: { value: 8.4, label: "Throughput", sub: "Monthly volume", queries: 152, nodes: 115, gauge: 345 },
};

/* ------------------------------------------------------------------ */
/*  Fabricated clients / projects.                                     */
/* ------------------------------------------------------------------ */
export interface Project {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string; // hero sub-line
  description: string; // list-hover / SEO blurb
  seed: number; // drives the procedural backdrop
  image: string; // cover photo (hero + list reveal)
  /* Case-study detail fields (shown on /projects/[slug]). */
  industries: [string, string, string]; // three industry tags
  timeline: string;
  platform: string;
  liveUrl: string; // display text only (no real link)
  bigMetrics: { value: string; label: string; blurb: string }[]; // 4
  quote: { text: string; author: string; role: string };
  overview: [string, string]; // two body paragraphs
  highlights: string[]; // checkmark bullets
  closing: { statement: string; body: string };
}

export const PROJECTS: Project[] = [
  {
    slug: "northwind-commerce",
    name: "Northwind Commerce",
    year: "2026",
    category: "E-commerce · Websites",
    summary:
      "We rebuilt a fragmented storefront into one self-running commerce engine with headless checkout and live inventory.",
    description:
      "Northwind sold across five channels with five sources of truth. We unified everything into a single headless commerce layer and let automation handle the busywork.",
    seed: 12,
    image: "/project1.jpg",
    industries: ["Retail", "E-commerce", "Logistics"],
    timeline: "5 Months",
    platform: "Headless Web",
    liveUrl: "northwind.store",
    bigMetrics: [
      {
        value: "+41%",
        label: "Conversion",
        blurb:
          "A rebuilt checkout and sub-second page loads lifted store-wide conversion within the first quarter.",
      },
      {
        value: "0.8s",
        label: "Load time",
        blurb:
          "Edge rendering and an automated image pipeline cut median mobile load to under a second.",
      },
      {
        value: "24x",
        label: "Faster sync",
        blurb:
          "Inventory now reconciles across every channel in real time instead of overnight batches.",
      },
      {
        value: "-70%",
        label: "Manual work",
        blurb:
          "Order routing, restock alerts and cart recovery run unattended, freeing the whole ops team.",
      },
    ],
    quote: {
      text:
        "OFFHAND turned five disconnected tools into one system that just runs. Our team stopped firefighting and started actually growing the business.",
      author: "Marco Vela",
      role: "OWNER, NORTHWIND",
    },
    overview: [
      "The goal was to collapse a tangle of plugins, spreadsheets and manual uploads into a single source of truth. We built a headless commerce core, wired live inventory across every sales channel, and layered an automation engine on top that recovers abandoned carts and reorders stock before it runs out.",
      "The storefront was rebuilt for speed first: server-rendered at the edge, images optimised on the fly, and a checkout stripped down to the fewest possible steps. The result is a store that feels instant and effectively runs itself.",
    ],
    highlights: [
      "Headless checkout reduced cart abandonment by nearly a third.",
      "Real-time inventory eliminated overselling across channels.",
      "Automated cart recovery now runs with zero manual effort.",
      "One dashboard replaced five disconnected admin tools.",
    ],
    closing: {
      statement:
        "The rebuild proved a small retailer could operate with the speed and polish of a category leader.",
      body:
        "Northwind now ships faster, sells more and spends less time on admin. The system doesn't just host the store, it actively runs it, leaving the team free to focus on product and customers.",
    },
  },
  {
    slug: "vireo-health",
    name: "Vireo Health",
    year: "2026",
    category: "Automation · SaaS",
    summary:
      "We automated member data management with secure AI to deliver personalised care and earlier clinical insight.",
    description:
      "Vireo's member data was fragmented and reactive. We unified it into a single AI-powered source of truth that flags high-risk patterns early.",
    seed: 47,
    image: "/project2.jpg",
    industries: ["Healthcare", "Telemedicine", "Insurance"],
    timeline: "6 Months",
    platform: "Web Application",
    liveUrl: "vireo.health/portal",
    bigMetrics: [
      {
        value: "-88%",
        label: "Admin friction",
        blurb:
          "Moving from reactive to proactive care removed nearly all repetitive administrative work.",
      },
      {
        value: "30%",
        label: "Earlier detection",
        blurb:
          "Predictive modelling improved early disease detection rates across the member base.",
      },
      {
        value: "99.9%",
        label: "Compliance",
        blurb:
          "End-to-end encryption kept the platform fully HIPAA-compliant throughout the AI migration.",
      },
      {
        value: "3.2x",
        label: "Faster response",
        blurb:
          "Real-time analytics let staff respond to urgent member inquiries in a fraction of the time.",
      },
    ],
    quote: {
      text:
        "OFFHAND's ability to navigate the complexities of healthcare data is unmatched. Their AI has streamlined our workflows and measurably improved member engagement.",
      author: "Sarah Chen",
      role: "VP INNOVATION, VIREO",
    },
    overview: [
      "The primary objective was to unify fragmented member data into a single, AI-powered source of truth. We built a proprietary data pipeline that uses machine learning to identify high-risk health patterns early, shifting the whole organisation from reactive to proactive care.",
      "The final phase focused on a provider dashboard that translates complex AI predictions into clear, actionable care plans, bridging the gap between raw data and meaningful patient interactions every day.",
    ],
    highlights: [
      "Predictive modelling improved early disease detection rates.",
      "Automated outreach increased annual wellness visit bookings.",
      "End-to-end encryption ensured total security during migration.",
      "Real-time analytics enabled faster responses to urgent cases.",
    ],
    closing: {
      statement:
        "The project redefined what is possible in digital health, letting a careful provider move like a specialised AI startup.",
      body:
        "Vireo now leads on personalised member experiences. The system doesn't just manage data, it actively interprets it to improve lives, with the flexibility to fold in new medical breakthroughs as they arrive.",
    },
  },
  {
    slug: "beacon-finance",
    name: "Beacon Finance",
    year: "2025",
    category: "CRM · Automation",
    summary:
      "We turned a cold, dead pipeline into a self-scoring engine that qualifies and books meetings while the team sleeps.",
    description:
      "Beacon captured leads but let them rot. We built an engine that scores every signal and routes it through sequences that adapt to replies.",
    seed: 83,
    image: "/project3.jpg",
    industries: ["Fintech", "Banking", "Investments"],
    timeline: "4 Months",
    platform: "CRM + Automation",
    liveUrl: "beacon.finance",
    bigMetrics: [
      {
        value: "3.4x",
        label: "More meetings",
        blurb:
          "Automated scoring and follow-up more than tripled qualified meetings booked each month.",
      },
      {
        value: "90s",
        label: "Response time",
        blurb:
          "Every inbound lead now gets a personalised reply within ninety seconds, day or night.",
      },
      {
        value: "38%",
        label: "Reply rate",
        blurb:
          "Sequences that adapt to each reply pushed engagement far above the industry benchmark.",
      },
      {
        value: "-46%",
        label: "Cost per lead",
        blurb:
          "Better targeting and zero manual chasing cut the effective cost of every booked meeting.",
      },
    ],
    quote: {
      text:
        "We handed OFFHAND a dead pipeline and got back a machine. It qualifies, follows up and books meetings on its own. It genuinely feels unfair to our competitors.",
      author: "Priya Nair",
      role: "HEAD OF GROWTH, BEACON",
    },
    overview: [
      "Beacon was capturing plenty of interest but had no system to act on it. We built a lead engine that enriches and scores every inbound signal, then routes it into multi-step sequences that read replies and adapt tone and timing automatically.",
      "Compliance mattered as much as speed. Every message is logged, every workflow has fallbacks, and sensitive financial data stays encrypted end to end, so the machine can move fast without ever cutting a corner.",
    ],
    highlights: [
      "Lead scoring routed the best opportunities to reps first.",
      "Adaptive sequences replied and followed up automatically.",
      "Meetings booked straight into the calendar, no chasing.",
      "Every touchpoint logged for full audit and compliance.",
    ],
    closing: {
      statement:
        "The engine proved a lean finance team could out-book rivals many times its size.",
      body:
        "Beacon's reps stopped chasing and started closing. The pipeline now qualifies and nurtures itself, surfacing only the conversations that are ready to become revenue.",
    },
  },
];


/* ------------------------------------------------------------------ */
/*  Fabricated testimonials.                                           */
/* ------------------------------------------------------------------ */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We handed OFFHAND the mess and got back a machine. Leads route themselves, the site sells while we sleep. It genuinely feels unfair.",
    author: "Dana Okoro",
    role: "Founder",
    company: "Brightly Studio",
    rating: 5,
  },
  {
    quote:
      "Instead of hiring five vendors we hired one system. Everything talks to everything. We look ten times our size.",
    author: "Marco Vela",
    role: "Owner",
    company: "Northwind Coffee",
    rating: 5,
  },
  {
    quote:
      "The automation alone paid for the whole engagement in the first month. Now I actually do the work I love again.",
    author: "Priya Nair",
    role: "Director",
    company: "Cadence Physio",
    rating: 5,
  },
  {
    quote:
      "Not techy at all, that was the point. They hid the cockpit and just showed me more of the right customers.",
    author: "Sam Ellery",
    role: "Co-founder",
    company: "Halcyon Goods",
    rating: 5,
  },
];

/* ------------------------------------------------------------------ */
/*  Fabricated articles.                                               */
/* ------------------------------------------------------------------ */
export interface Article {
  slug: string;
  title: string;
  date: string;
  readMins: number;
  excerpt: string;
  body: string[];
  /** Optional external inspiration credited at the foot of the piece. */
  source?: { label: string; href: string };
  /** Optional short topic label shown on the card + detail hero. */
  topic?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "efficiency-is-a-ceiling-growth-is-not",
    title: "Efficiency is a ceiling. Growth is not.",
    date: "JUN 2026",
    readMins: 5,
    topic: "Strategy",
    excerpt:
      "Most companies point AI at cost-cutting. The far bigger prize, the one investors actually pay for, is using it to grow.",
    body: [
      "Ask a room of executives what AI is for and the answers cluster around the same word: efficiency. Lower costs, leaner teams, faster processes. It is an almost universal reflex, and it quietly caps the value AI can create.",
      "The arithmetic is unforgiving. Costs can only ever be cut to zero; revenue has no ceiling. Even generous assumptions about automating a chunk of the cost base tend to move overall firm value by a low double-digit percentage at best. A sustained lift in organic growth can be worth several times that, because markets reward what a company is expected to earn tomorrow, not just what it banks today.",
      "There is field evidence for the growth case. In marketing experiments, AI systems generated and pre-tested dozens of ad concepts, then the winners were run for real, roughly tripling click-through rates. Turn one underperforming channel into a proven growth engine and a few points of organic growth follow, and with them, a step-change in valuation.",
      "That is the shift we build for. Not AI bolted on to shave minutes off a task, but AI wired into the parts of the business that actually compound: better targeting, faster follow-up, sharper matching of the right offer to the right person. Efficiency is a floor worth having. Growth is the ceiling worth chasing.",
    ],
    source: {
      label: "Inspired by \u201CCompanies Are Using AI for Efficiency. They Should Use It to Grow.\u201D — Harvard Business Review",
      href: "https://hbr.org/2026/06/companies-are-using-ai-for-efficiency-they-should-use-it-to-grow",
    },
  },
  {
    slug: "where-ai-actually-creates-value",
    title: "Where AI actually creates value",
    date: "MAY 2026",
    readMins: 4,
    topic: "Analysis",
    excerpt:
      "The winners are not the ones with the most pilots. They are the ones who point AI at a real value driver and rebuild the workflow around it.",
    body: [
      "For all the noise, the value from AI is remarkably concentrated. It shows up where the technology is aimed squarely at a core driver of the business, and where the surrounding workflow is redesigned to let it work. Everywhere else, it stalls in the pilot stage and quietly disappears.",
      "The pattern separating value from theatre is consistent. Isolated experiments, however clever, rarely reach the P&L. Impact comes from picking the handful of use cases that genuinely move revenue, cost or risk, and committing to them properly, with the data, the integrations and the human oversight that real deployment demands.",
      "It also means being honest about where AI won't create value, at least not yet. Not every process is worth automating, and forcing it produces fragile systems that cost more attention than they save. Knowing what to leave alone is as much a part of the work as knowing what to build.",
      "Our bias is toward the few things that compound. We would rather ship one automation that reliably runs a revenue-critical workflow than a dozen demos that impress in a meeting and break in production.",
    ],
    source: {
      label: "Inspired by \u201CWhere AI Will Create Value\u2014and Where It Won\u2019t\u201D — McKinsey",
      href: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/where-ai-will-create-value-and-where-it-wont",
    },
  },
  {
    slug: "from-experiments-to-transformation",
    title: "From experiments to transformation",
    date: "APR 2026",
    readMins: 5,
    topic: "Operations",
    excerpt:
      "Nearly everyone is experimenting with AI. Very few are seeing it in the numbers. The gap is not the model, it's the operating system around it.",
    body: [
      "Generative AI went from novelty to boardroom priority in record time. Adoption is nearly universal. Yet for most companies the bottom-line improvement has not kept pace with the capability, and the reason is rarely the technology itself.",
      "Experimentation and transformation are different sports. A scatter of pilots proves that something is possible; transformation is what happens when workflows, governance and incentives are rebuilt so the capability becomes the default way work gets done. Without that, promising demos stay demos.",
      "The move from one to the other is deliberate. It means choosing the workflows that matter, redesigning them end to end rather than pasting AI on top, instrumenting them so you can see what's working, and giving people a version of their job that is genuinely better, not just newly surveilled.",
      "That is the whole point of what we do: not to hand over another tool to babysit, but to install the operating system around it, so the results show up where they are supposed to, in the numbers, quietly, every day.",
    ],
    source: {
      label: "Inspired by \u201CHow to Move from AI Experimentation to AI Transformation\u201D — Harvard Business Review",
      href: "https://hbr.org/2026/04/how-to-move-from-ai-experimentation-to-ai-transformation",
    },
  },
  {
    slug: "systems-over-tools",
    title: "Systems beat tools every time",
    date: "APR 29, 2026",
    readMins: 3,
    topic: "Playbook",
    excerpt:
      "Buying software is easy. Turning it into something that quietly runs your business is a design problem, not a purchase.",
    body: [
      "Most businesses don't have a tools problem, they have a systems problem. Ten apps that don't talk to each other is not a stack; it's a liability.",
      "A system is a set of tools wired so that the output of one becomes the input of the next, with no human copy-paste in between. That's where the leverage lives.",
      "OFFHAND builds the wiring, not just the boxes. The felt result is simple: fewer things to babysit, more of the right customers.",
    ],
  },
  {
    slug: "why-outputs-feel-random",
    title: "Why your automations feel random",
    date: "APR 29, 2026",
    readMins: 2,
    topic: "Playbook",
    excerpt:
      "If your setup works one day and breaks the next, the problem isn't luck. It's a missing feedback loop.",
    body: [
      "Inconsistency is almost always a design gap: no error recovery, no logging, no single source of truth.",
      "We design every flow with checkpoints and fallbacks, so when reality gets weird, the machine bends instead of breaking.",
    ],
  },
  {
    slug: "hide-the-cockpit",
    title: "Hide the cockpit, show the craft",
    date: "APR 22, 2026",
    readMins: 4,
    topic: "Philosophy",
    excerpt:
      "The best technology asks for the least attention. Your job is your craft, not babysitting dashboards.",
    body: [
      "Sophistication should live in beauty and smoothness, never in coldness or jargon.",
      "We keep the machinery in the periphery. It only speaks up with good news.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ (grouped, accordion).                                          */
/* ------------------------------------------------------------------ */
export interface Faq {
  group: string;
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    group: "Overview",
    q: "What does OFFHAND actually do?",
    a: "We build and run the whole digital machine for a business: website, CRM, marketing, social, ads, AI automation, custom tools and your overall presence, all as one connected system, not eight disconnected vendors.",
  },
  {
    group: "Overview",
    q: "I'm not technical at all. Is that a problem?",
    a: "That's the entire point. We hide the cockpit. You do the work only you can do; the system handles the rest and only speaks up with good news.",
  },
  {
    group: "Security",
    q: "Who owns the accounts and data?",
    a: "You do, always. We build inside your accounts, document everything, and hand you the keys. No lock-in, no hostage situations.",
  },
  {
    group: "Protocols",
    q: "How fast can you start?",
    a: "Most first builds go live in weeks, not months, because we work from pre-built frameworks and wire them to your logic.",
  },
  {
    group: "Protocols",
    q: "What if something breaks?",
    a: "Every flow ships with checkpoints, logging and fallbacks. When reality gets weird, the machine bends instead of breaking, and we're notified before you are.",
  },
  {
    group: "Licensing",
    q: "Is there a long contract?",
    a: "No. Project work is fixed-scope; the ongoing Engine plan is month-to-month. Stay because it works, not because you're trapped.",
  },
];

/* ------------------------------------------------------------------ */
/*  Fabricated brand names for the infinite marquee.                   */
/* ------------------------------------------------------------------ */
export const BRANDS: string[] = [
  "NORTHWIND",
  "VERTEX",
  "BRIGHTLY",
  "MONOLITH",
  "HALCYON",
  "CADENCE",
  "PILLAR",
  "HELIA",
  "VANTABLACK",
  "SENTINEL",
  "FLOWSTATE",
  "AETHER",
];

/* ------------------------------------------------------------------ */
/*  Navigation.                                                        */
/* ------------------------------------------------------------------ */
export interface NavLink {
  label: string;
  href: string;
  desc?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", desc: "The machine, running." },
  { label: "Proofs", href: "/#proofs", desc: "Systems we've deployed." },
  { label: "Work", href: "/#work", desc: "Systems we've shipped." },
  { label: "Journal", href: "/#journal", desc: "Notes on building systems." },
  { label: "Contact", href: "/#deploy", desc: "Start your build." },
];

export const CONTACT_EMAIL = "offhand.digital@gmail.com";
