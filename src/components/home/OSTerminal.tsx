"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/hooks";
import {
  PILLARS,
  PROJECTS,
  TELEMETRY,
  NAV_LINKS,
  CONTACT_EMAIL,
} from "@/lib/data";
import styles from "./osterminal.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RowCls = "ok" | "dim" | "err" | "accent" | "head" | "in";

interface Row {
  text: string;
  cls?: RowCls;
  /** Preformatted (monospace, no wrap) — for tables / cards / ascii. */
  pre?: boolean;
  /** Extra pause (ms) before this row streams in. */
  delay?: number;
  /** Live-feed timestamp — presence switches the row to the two-tone feed look. */
  ts?: string;
}

interface Line extends Row {
  id: number;
}

interface Ctx {
  args: string[];
  raw: string;
  navigate: (href: string) => void;
  clear: () => void;
  flashTheme: () => void;
  confetti: () => void;
}

interface Command {
  name: string;
  aliases?: string[];
  group: string;
  help: string;
  hidden?: boolean;
  /** Returns rows to stream; may run a side effect after streaming via `then`. */
  run: (ctx: Ctx) => { rows: Row[]; then?: () => void };
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Two-column aligned row for tables. */
function col(a: string, b: string, w = 16): string {
  return `${a.padEnd(w)}${b}`;
}

/** Draw a boxed card with a title and key/value rows (fixed inner width). */
function card(title: string, rows: [string, string][], inner = 40): Row[] {
  const top = `┌ ${title} ${"─".repeat(Math.max(0, inner - title.length - 3))}┐`;
  const body = rows.map(([k, v]) => {
    const line = ` ${k.padEnd(14)}${v}`;
    return `│${line.padEnd(inner)}│`;
  });
  const bottom = `└${"─".repeat(inner)}┘`;
  return [
    { text: top, pre: true, cls: "accent" },
    ...body.map((t): Row => ({ text: t, pre: true, cls: "ok" })),
    { text: bottom, pre: true, cls: "accent" },
  ];
}

const GLYPHS = "01<>{}[]#$%&*/\\|=+—▮▯░▒▓█◆◇↯⧉";
const randGlyphLine = (n: number) =>
  Array.from({ length: n }, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");

/* ------------------------------------------------------------------ */
/*  Faux-AI knowledge base (offline, on-brand)                         */
/* ------------------------------------------------------------------ */

function answer(q: string): string {
  const s = q.toLowerCase();
  const has = (...k: string[]) => k.some((w) => s.includes(w));

  if (has("price", "cost", "how much", "budget"))
    return "Every build is scoped to what you actually need, so pricing is bespoke. Type `hire` and we'll send a fixed quote fast.";
  if (has("build", "do you", "what can", "services", "offer"))
    return "Eight systems, one machine: websites, CRM, marketing, social, ads, AI automation, SaaS tools and digital presence. Type `services` to inspect each.";
  if (has("automat", "workflow", "agent"))
    return "We wire AI agents into your real tools so the boring 90% runs itself, with checkpoints and fallbacks so it bends instead of breaking.";
  if (has("time", "how long", "fast", "start", "when"))
    return "Most first builds go live in weeks, not months, because we start from proven frameworks and wire them to your logic.";
  if (has("own", "data", "lock", "secure", "security"))
    return "You own everything. We build inside your accounts, document it, and hand you the keys. No lock-in.";
  if (has("who", "about", "human", "team"))
    return "OFFHAND is a small studio that builds one connected system instead of eight disconnected vendors.";
  if (has("contact", "hire", "talk", "call", "email"))
    return `Ready when you are: ${CONTACT_EMAIL}. Type \`hire\` and I'll open the build request for you.`;
  return "I build and run complete digital systems for businesses. Ask me about automation, timelines, or type `services` to look around.";
}

/* ------------------------------------------------------------------ */
/*  Command registry                                                   */
/* ------------------------------------------------------------------ */

const COMMANDS: Command[] = [
  {
    name: "help",
    aliases: ["?", "menu"],
    group: "core",
    help: "list everything this machine can do",
    run: () => {
      const rows: Row[] = [
        { text: "AVAILABLE COMMANDS", cls: "head" },
        { text: "" },
      ];
      const groups = ["core", "explore", "act", "ai"];
      const labels: Record<string, string> = {
        core: "SYSTEM",
        explore: "EXPLORE",
        act: "ACT",
        ai: "INTELLIGENCE",
      };
      for (const g of groups) {
        rows.push({ text: labels[g] ?? g.toUpperCase(), cls: "dim" });
        for (const c of COMMANDS.filter((c) => c.group === g && !c.hidden)) {
          rows.push({ text: col(`  ${c.name}`, c.help, 16), pre: true });
        }
        rows.push({ text: "" });
      }
      rows.push({ text: "tip: try `services`, `run website`, or ask `ai what do you build`", cls: "dim" });
      return { rows };
    },
  },
  {
    name: "services",
    aliases: ["pillars", "systems"],
    group: "explore",
    help: "the 8 systems we build and run",
    run: () => {
      const rows: Row[] = [
        { text: "EIGHT SYSTEMS · ONE MACHINE", cls: "head" },
        { text: "" },
        ...PILLARS.map((p): Row => ({
          text: col(`  ${p.num} ${p.name}`, p.tag, 18),
          pre: true,
          delay: 40,
        })),
        { text: "" },
        { text: "type `open crm` (or any name) to dive into one.", cls: "dim" },
      ];
      return { rows };
    },
  },
  {
    name: "open",
    group: "explore",
    help: "deep-dive one system, e.g. `open crm`",
    run: ({ args }) => {
      const key = (args[0] ?? "").toLowerCase();
      const p =
        PILLARS.find((p) => p.key === key || p.name.toLowerCase() === key) ??
        PILLARS.find((p) => p.key.startsWith(key) && key.length > 0);
      if (!p)
        return {
          rows: [
            { text: `no system named "${args[0] ?? ""}".`, cls: "err" },
            { text: "type `services` to list all eight.", cls: "dim" },
          ],
        };
      return {
        rows: [
          { text: `${p.num} · ${p.name} — ${p.screen}`, cls: "head" },
          { text: "" },
          { text: p.tag, cls: "accent" },
          { text: p.blurb },
          { text: "" },
          { text: `in plain words: ${p.plain}`, cls: "dim" },
          { text: "" },
          { text: "  capabilities", cls: "dim" },
          ...p.capabilities.map((c): Row => ({ text: `   ▸ ${c}`, pre: true })),
        ],
      };
    },
  },
  {
    name: "work",
    aliases: ["projects", "case"],
    group: "explore",
    help: "systems we've shipped",
    run: () => ({
      rows: [
        { text: "SELECTED WORK", cls: "head" },
        { text: "" },
        ...PROJECTS.map((p, i): Row => ({
          text: col(`  ${String(i + 1).padStart(2, "0")} ${p.name}`, `${p.category}  //${p.year}`, 28),
          pre: true,
          delay: 40,
        })),
        { text: "" },
        { text: "type `goto work` to browse them full-screen.", cls: "dim" },
      ],
    }),
  },
  {
    name: "run",
    group: "act",
    help: "simulate a build, e.g. `run website`",
    run: ({ args }) => {
      const what = args[0] || "system";
      return {
        rows: [
          { text: `> initializing build: ${what}`, cls: "dim", delay: 120 },
          { text: "> allocating agents ......... [8/8]", cls: "dim", delay: 320 },
          { text: "> wiring CRM ⇄ site ⇄ ads ... ok", cls: "dim", delay: 320 },
          { text: "> compiling workflows ....... ok", cls: "dim", delay: 300 },
          { text: "> deploying to edge ......... ok", cls: "dim", delay: 300 },
          { text: `[✓] ${what} deployed in 1.24s`, cls: "ok", delay: 260 },
          { text: "" },
          ...card("BUILD COMPLETE", [
            ["uptime", `${TELEMETRY.uptime.value}%`],
            ["throughput", `${TELEMETRY.tokens.value}M / mo`],
            ["latency", "42ms"],
            ["autonomy", "enabled"],
          ]),
          { text: "" },
          { text: "this is literally what we build for you. type `hire`.", cls: "dim" },
        ],
      };
    },
  },
  {
    name: "ai",
    aliases: ["ask", "chat"],
    group: "ai",
    help: "ask the machine anything",
    run: ({ args }) => {
      const q = args.join(" ").trim();
      if (!q)
        return {
          rows: [
            { text: 'usage: ai <question>  e.g. `ai how much does it cost`', cls: "dim" },
          ],
        };
      return {
        rows: [
          { text: "analyzing", cls: "dim", delay: 120 },
          { text: "· thinking", cls: "dim", delay: 360 },
          { text: "· · composing answer", cls: "dim", delay: 420 },
          { text: "" },
          { text: answer(q), cls: "accent", delay: 200 },
        ],
      };
    },
  },
  {
    name: "goto",
    aliases: ["cd", "nav"],
    group: "act",
    help: "jump to a section, e.g. `goto work`",
    run: ({ args }) => {
      const name = (args[0] ?? "").toLowerCase();
      const map: Record<string, string> = {
        home: "/",
        work: "/#work",
        projects: "/#work",
        proofs: "/#proofs",
        journal: "/#journal",
        articles: "/#journal",
        contact: "/contact",
      };
      const href = map[name] ?? NAV_LINKS.find((l) => l.label.toLowerCase() === name)?.href;
      if (!href)
        return {
          rows: [
            { text: `unknown section "${args[0] ?? ""}".`, cls: "err" },
            { text: "try: home · work · proofs · journal · contact", cls: "dim" },
          ],
        };
      return {
        rows: [{ text: `navigating → ${href}`, cls: "ok" }],
        then: () => {},
      };
    },
  },
  {
    name: "hire",
    aliases: ["start", "book"],
    group: "act",
    help: "start your build (opens contact)",
    run: () => ({
      rows: [
        { text: "> opening build request ...", cls: "dim", delay: 200 },
        { text: "[✓] access granted. taking you to contact.", cls: "ok", delay: 300 },
      ],
    }),
  },
  {
    name: "contact",
    aliases: ["email"],
    group: "act",
    help: "how to reach a human",
    run: () => ({
      rows: [
        { text: "TALK TO A HUMAN", cls: "head" },
        { text: "" },
        { text: col("  email", CONTACT_EMAIL, 12), pre: true, cls: "accent" },
        { text: col("  call", "book a 15-min chat → goto contact", 12), pre: true },
        { text: "" },
        { text: "type `copy email` to grab the address · `hire` to begin.", cls: "dim" },
      ],
    }),
  },
  {
    name: "copy",
    group: "act",
    help: "copy the contact email",
    run: ({ args }) => {
      if ((args[0] ?? "").toLowerCase() === "email" || !args[0]) {
        if (typeof navigator !== "undefined" && navigator.clipboard)
          navigator.clipboard.writeText(CONTACT_EMAIL).catch(() => {});
        return { rows: [{ text: `copied ${CONTACT_EMAIL} to clipboard ✓`, cls: "ok" }] };
      }
      return { rows: [{ text: "usage: copy email", cls: "dim" }] };
    },
  },
  {
    name: "about",
    aliases: ["whoami"],
    group: "core",
    help: "who runs the machine",
    run: () => ({
      rows: [
        { text: "OFFHAND — complex, made offhand.", cls: "head" },
        { text: "" },
        { text: "A studio that builds and runs one connected system instead of" },
        { text: "eight disconnected vendors. You do your craft; the machine does" },
        { text: "the boring ninety percent." },
        { text: "" },
        { text: "guest@offhand · visitor with excellent taste.", cls: "dim" },
      ],
    }),
  },
  {
    name: "date",
    group: "core",
    hidden: true,
    help: "current system time",
    run: () => ({ rows: [{ text: new Date().toString(), cls: "dim" }] }),
  },
  {
    name: "echo",
    group: "core",
    hidden: true,
    help: "print text",
    run: ({ args }) => ({ rows: [{ text: args.join(" ") || " " }] }),
  },
  {
    name: "clear",
    aliases: ["cls"],
    group: "core",
    help: "clear the screen",
    run: ({ clear }) => {
      clear();
      return { rows: [] };
    },
  },
  /* ---- easter eggs (hidden) ---- */
  {
    name: "sudo",
    group: "core",
    hidden: true,
    help: "elevated access",
    run: ({ args, confetti }) => {
      if ((args[0] ?? "").toLowerCase() === "hire") {
        return {
          rows: [
            { text: "> escalating privileges ...", cls: "dim", delay: 200 },
            { text: "[✓] ACCESS GRANTED", cls: "ok", delay: 300 },
            { text: randGlyphLine(34), pre: true, cls: "accent", delay: 120 },
          ],
          then: confetti,
        };
      }
      return {
        rows: [
          { text: `guest is not in the sudoers file.`, cls: "err" },
          { text: "this incident will (not) be reported.", cls: "dim" },
        ],
      };
    },
  },
  {
    name: "theme",
    group: "core",
    hidden: true,
    help: "toggle theme",
    run: ({ args, flashTheme }) => {
      if ((args[0] ?? "").toLowerCase() === "light") {
        return {
          rows: [{ text: "> inverting reality for 3s ...", cls: "dim" }],
          then: flashTheme,
        };
      }
      return { rows: [{ text: "usage: theme light", cls: "dim" }] };
    },
  },
  {
    name: "matrix",
    group: "core",
    hidden: true,
    help: "follow the white rabbit",
    run: () => ({
      rows: [
        ...Array.from({ length: 8 }, (_, i): Row => ({
          text: randGlyphLine(40),
          pre: true,
          cls: i % 2 ? "ok" : "dim",
          delay: 70,
        })),
        { text: "" },
        { text: "wake up. type `hire`.", cls: "accent", delay: 200 },
      ],
    }),
  },
];

/** Flat lookup of name/alias → command. */
const LOOKUP: Record<string, Command> = {};
for (const c of COMMANDS) {
  LOOKUP[c.name] = c;
  c.aliases?.forEach((a) => (LOOKUP[a] = c));
}

const SUGGESTIONS = COMMANDS.filter((c) => !c.hidden).map((c) => c.name);

/** Levenshtein-lite: closest command name for a typo. */
function closest(input: string): string | null {
  let best: string | null = null;
  let bestScore = Infinity;
  for (const name of Object.keys(LOOKUP)) {
    const d = lev(input, name);
    if (d < bestScore) {
      bestScore = d;
      best = name;
    }
  }
  return bestScore <= 2 ? best : null;
}
function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[m][n];
}

const INTRO: Row[] = [
  { text: "OFFHAND OS v1.0 — interactive shell", cls: "ok" },
  { text: "(c) 2026 OFFHAND SYSTEMS · 8/8 systems online", cls: "dim" },
  { text: "" },
  { text: "type `help` to see what this machine can do.", cls: "accent" },
  { text: "" },
];

const PLACEHOLDERS = [
  'try "services"',
  'type "help"',
  'run "run website"',
  'ask "ai how much"',
  'try "work"',
  'type "hire"',
];

const CHIPS = ["help", "services", "run website", "work", "hire"];

/* ------------------------------------------------------------------ */
/*  Live agent feed — 70 fabricated tasks that rotate forever.         */
/* ------------------------------------------------------------------ */

const TASKS: string[] = [
  "inbound lead scored · qualified (87/100) · routed to SDR-2",
  "abandoned cart sequence triggered · 47 recipients",
  "daily P&L reconciled · variance 0.3% · within tolerance",
  "anomaly detected · returns rate +2σ · alert dispatched",
  "invoice matched · ERP posted · INV-9320",
  "return request received · order #4821",
  "policy check · within 30d window ✓",
  "refund issued · $84.20 · stripe_re_3M...",
  "customer notified · ticket #4821 closed",
  "low-stock detected · SKU-099 · 12 units left",
  "PO drafted · supplier ACME · 240 units",
  "PO sent for human approval · #PO-7741",
  "landing page A/B test · variant B +18% CVR",
  "ad spend rebalanced · CPA -12% · budget shifted",
  "blog post drafted · \"calm tech\" · queued for review",
  "social post published · IG + LinkedIn · 2 assets",
  "sitemap regenerated · 142 URLs · submitted to Google",
  "lighthouse audit · perf 98 · a11y 100",
  "lead enriched · title=VP Ops · company=Northwind",
  "meeting booked · calendar synced · Thu 14:00",
  "CRM dedupe · 3 records merged · contact_88...",
  "email deliverability · SPF/DKIM pass · 99.2%",
  "nurture step 3 sent · open 41% · click 12%",
  "churn risk flagged · account ORION · score 0.72",
  "usage spike · +240% · autoscaled 2 → 5 nodes",
  "webhook received · stripe.charge.succeeded",
  "subscription upgraded · Engine → Constellation",
  "dunning retry · card updated · payment recovered",
  "review requested · 5★ · Google Business",
  "directory sync · 38 listings · 100% consistent",
  "sentiment scan · mention @northwind · positive",
  "backup completed · 4.2GB · encrypted at rest",
  "SSL renewed · offhand.studio · 90d valid",
  "deploy shipped · build #1183 · 1.24s edge",
  "canary armed · 5% traffic · error rate normal",
  "form submission · route → CRM · tagged \"pricing\"",
  "spam filtered · 0.4% caught · 0 false positives",
  "quote generated · PDF · $4,900/mo · sent",
  "contract e-signed · countersigned · filed",
  "onboarding kickoff · tasks assigned · day 0",
  "data pipeline · 12,400 rows · 0 errors",
  "vector store reindexed · 8,912 chunks",
  "agent tool call · search_orders · 38ms",
  "human-in-loop approval · granted · resumed",
  "SLA check · response 92s · target 5m ✓",
  "incident auto-resolved · retry #2 · recovered",
  "cohort report · week 27 · retention 88%",
  "attribution model · last-touch → data-driven",
  "keyword rank · \"digital agency\" · +4 → #7",
  "creative test · 6 variants · winner selected",
  "inventory sync · Shopify ⇄ ERP · in balance",
  "fraud check · order #4930 · passed · risk 0.03",
  "tax calc · nexus AL · rate applied · 4%",
  "payout scheduled · $12,480 · Fri 09:00",
  "NPS survey sent · 120 recipients · batch 04",
  "call transcript summarized · #221 · 6 actions",
  "FAQ updated · \"who owns data\" · published",
  "cache purged · CDN · 14 edges · 220ms",
  "uptime probe · 8/8 regions · 200 OK",
  "lead routed · territory WEST · owner Priya",
  "upsell detected · plan gap · Engine suggested",
  "content calendar · 12 slots filled · month ahead",
  "image optimized · webp · -64% weight",
  "broken link found · /pricing-old · redirect 301",
  "GDPR export · user 8841 · bundled · delivered",
  "segment built · \"high-intent\" · 342 contacts",
  "drip paused · reply detected · handed to human",
  "anomaly cleared · returns rate normalized",
  "capacity forecast · +18% Q3 · staffing note added",
  "handoff complete · system green · you're free",
];

const MAX_LINES = 240; // scrollback cap so the feed never grows unbounded

/** HH:MM:SS from a Date. */
function fmtClock(d: Date): string {
  return d.toTimeString().slice(0, 8);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OSTerminal() {
  const router = useRouter();
  const reduced = useReducedMotion();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const [status, setStatus] = useState({ lat: 42, lift: 12.4 });
  const [flash, setFlash] = useState(false);
  const [feedOn, setFeedOn] = useState(false);

  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const histIdxRef = useRef(-1);
  const startedRef = useRef(false);
  const feedIdxRef = useRef(0);
  const clockRef = useRef<Date | null>(null);
  const stickRef = useRef(true);
  const busyRef = useRef(false);

  const nextId = () => ++idRef.current;

  const scrollDown = useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  /** Track whether the user is parked at the bottom (so the feed doesn't yank
   *  them away while they read history). */
  const onBodyScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
  }, []);

  /** Push one rotating live-feed task with a ticking timestamp. */
  const pushFeed = useCallback(() => {
    if (!clockRef.current) clockRef.current = new Date();
    clockRef.current = new Date(
      clockRef.current.getTime() + 2000 + Math.floor(Math.random() * 3000)
    );
    const ts = fmtClock(clockRef.current);
    const text = TASKS[feedIdxRef.current % TASKS.length];
    feedIdxRef.current += 1;
    setLines((prev) => {
      const next = [...prev, { text, ts, id: nextId() }];
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
    });
    if (stickRef.current) requestAnimationFrame(scrollDown);
  }, [scrollDown]);

  /** Stream rows into the scrollback one at a time. */
  const stream = useCallback(
    async (rows: Row[]) => {
      for (const r of rows) {
        if (!reduced) await sleep(r.delay ?? 34);
        setLines((prev) => [...prev, { ...r, id: nextId() }]);
        scrollDown();
      }
    },
    [reduced, scrollDown]
  );

  const pushInstant = useCallback((rows: Row[]) => {
    setLines((prev) => [...prev, ...rows.map((r) => ({ ...r, id: nextId() }))]);
  }, []);

  const clearScreen = useCallback(() => {
    setLines([]);
    idRef.current = 0;
  }, []);

  const flashTheme = useCallback(() => {
    const root = document.documentElement;
    root.style.filter = "invert(1) hue-rotate(180deg)";
    root.style.transition = "filter 0.4s ease";
    setTimeout(() => {
      root.style.filter = "";
    }, 3000);
  }, []);

  const confetti = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 900);
  }, []);

  /* Intro (once). */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      historyRef.current = JSON.parse(localStorage.getItem("offhand:term") || "[]");
    } catch {
      historyRef.current = [];
    }
    if (reduced) {
      pushInstant(INTRO);
      // Seed a static batch of feed lines (no rotation under reduced motion).
      let d = new Date();
      const seed: Line[] = [];
      for (let i = 0; i < 14; i++) {
        d = new Date(d.getTime() + 2500);
        seed.push({ text: TASKS[i % TASKS.length], ts: fmtClock(d), id: nextId() });
      }
      setLines((prev) => [...prev, ...seed]);
      feedIdxRef.current = 14;
    } else {
      void stream(INTRO).then(() => setFeedOn(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Deep-link: /?cmd=pricing auto-runs once ready. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("cmd");
    if (p) {
      const t = setTimeout(() => execute(p), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Cycle placeholder while idle. */
  useEffect(() => {
    if (busy || input) return;
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(t);
  }, [busy, input]);

  /* Live status drift. */
  useEffect(() => {
    const t = setInterval(() => {
      setStatus({
        lat: 38 + Math.round(Math.random() * 12),
        lift: 11 + +(Math.random() * 3).toFixed(1),
      });
    }, 2200);
    return () => clearInterval(t);
  }, []);

  /* Keep a ref of busy for the feed/event guards. */
  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  /* Live agent feed — rotates a new task through the console forever. Paused
     while a command runs so the two don't collide, then resumes. */
  useEffect(() => {
    if (!feedOn || reduced || busy) return;
    const t = setInterval(pushFeed, 2100);
    return () => clearInterval(t);
  }, [feedOn, reduced, busy, pushFeed]);

  /* Global "/" focuses the shell. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- command execution ---- */
  const execute = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      // A command should always jump the view to the bottom.
      stickRef.current = true;
      // Echo the prompt line.
      pushInstant([{ text: `offhand:~$ ${trimmed}`, cls: "in", pre: true }]);
      scrollDown();
      if (!trimmed) return;

      // History.
      historyRef.current = [trimmed, ...historyRef.current.filter((h) => h !== trimmed)].slice(0, 40);
      histIdxRef.current = -1;
      try {
        localStorage.setItem("offhand:term", JSON.stringify(historyRef.current));
      } catch {
        /* ignore */
      }

      const [name, ...args] = trimmed.split(/\s+/);
      const cmd = LOOKUP[name.toLowerCase()];

      setBusy(true);

      if (!cmd) {
        const near = closest(name.toLowerCase());
        await stream([
          { text: `command not found: ${name}`, cls: "err" },
          ...(near ? [{ text: `did you mean \`${near}\`?`, cls: "dim" as RowCls }] : []),
          { text: "type `help` for the full list.", cls: "dim" },
        ]);
        setBusy(false);
        return;
      }

      const ctx: Ctx = {
        args,
        raw: trimmed,
        navigate: (href) => router.push(href),
        clear: clearScreen,
        flashTheme,
        confetti,
      };

      const { rows, then } = cmd.run(ctx);
      await stream(rows);

      // Post-stream side effects (navigation etc.).
      if (cmd.name === "goto") {
        const map: Record<string, string> = {
          home: "/", work: "/projects", projects: "/projects", pricing: "/pricing",
          journal: "/articles", articles: "/articles", studio: "/about", about: "/about",
          contact: "/contact",
        };
        const href = map[(args[0] ?? "").toLowerCase()];
        if (href) setTimeout(() => router.push(href), 380);
      }
      if (cmd.name === "hire" || (cmd.name === "sudo" && (args[0] ?? "").toLowerCase() === "hire")) {
        setTimeout(() => router.push("/contact"), 650);
      }
      then?.();
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [pushInstant, scrollDown, stream, router, clearScreen, flashTheme, confetti]
  );

  /* External buttons (e.g. the "try" hints beside the terminal) can run a
     command by dispatching `offhand:term-run` with the command string. */
  useEffect(() => {
    const onRun = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      if (cmd && !busyRef.current) void execute(cmd);
    };
    window.addEventListener("offhand:term-run", onRun as EventListener);
    return () =>
      window.removeEventListener("offhand:term-run", onRun as EventListener);
  }, [execute]);

  /* ---- ghost autocomplete ---- */
  const ghost = useMemo(() => {
    const v = input.toLowerCase();
    if (!v || v.includes(" ")) return "";
    const hit = SUGGESTIONS.find((s) => s.startsWith(v) && s !== v);
    return hit ? hit.slice(input.length) : "";
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (busy) return;
      const val = input;
      setInput("");
      void execute(val);
    } else if (e.key === "Tab") {
      if (ghost) {
        e.preventDefault();
        setInput((v) => v + ghost);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (!h.length) return;
      histIdxRef.current = Math.min(histIdxRef.current + 1, h.length - 1);
      setInput(h[histIdxRef.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = historyRef.current;
      histIdxRef.current = Math.max(histIdxRef.current - 1, -1);
      setInput(histIdxRef.current === -1 ? "" : h[histIdxRef.current] ?? "");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      clearScreen();
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.window} accentFrame ${flash ? styles.flash : ""}`}
        onClick={() => {
          stickRef.current = true;
          scrollDown();
          inputRef.current?.focus();
        }}
        role="group"
        aria-label="OFFHAND OS interactive terminal"
      >
        {/* Title bar — mac traffic lights */}
        <div className={styles.titlebar}>
          <span className={styles.dots} aria-hidden="true">
            <i className={styles.red} />
            <i className={styles.yellow} />
            <i className={styles.green} />
          </span>
          <span className={styles.titleText}>offhand — zsh — 80×24</span>
          <span className={styles.titleRight} aria-hidden="true">
            ⌘ live
          </span>
        </div>

        {/* Scrollback */}
        <div className={styles.body} ref={bodyRef} onScroll={onBodyScroll}>
          {lines.map((l) =>
            l.ts ? (
              <div key={l.id} className={styles.feedRow}>
                <span className={styles.feedTs}>{l.ts}</span>
                <span className={styles.feedArrow}>›</span>
                <span className={styles.feedText}>{l.text}</span>
              </div>
            ) : (
              <div
                key={l.id}
                className={`${styles.row} ${l.cls ? styles[l.cls] : ""} ${
                  l.pre ? styles.pre : ""
                }`}
              >
                {l.text || "\u00A0"}
              </div>
            )
          )}

          {/* Input row */}
          <div className={styles.inputRow}>
            <span className={styles.prompt}>offhand:~$</span>
            <div className={styles.field}>
              <input
                ref={inputRef}
                className={styles.hiddenInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
                disabled={busy}
              />
              <span className={styles.display}>
                <span>{input}</span>
                {!busy && <span className={styles.caret} aria-hidden="true" />}
                {ghost && <span className={styles.ghost}>{ghost}</span>}
                {!input && !busy && (
                  <span className={styles.placeholder}>{PLACEHOLDERS[phIdx]}</span>
                )}
                {busy && <span className={styles.working}>running…</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / quick command chips */}
        <div className={styles.chips}>
          {CHIPS.map((c) => (
            <button
              key={c}
              className={styles.chip}
              onClick={(e) => {
                e.stopPropagation();
                if (!busy) void execute(c);
              }}
              data-cursor
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div className={styles.statusbar} aria-hidden="true">
          <span className={styles.stat}>
            <i className={styles.pulse} />
            SYSTEMS 8/8 ONLINE
          </span>
          <span className={styles.statMid}>LAT {status.lat}ms</span>
          <span className={styles.stat}>▲ PIPELINE +{status.lift}%</span>
        </div>
      </div>
    </div>
  );
}
