# OFFHAND OS — Master Brief (canonical)

> The website itself is the proof of work. The scene shouldn't need to describe itself —
> it demonstrates every service OFFHAND offers, as one impossible, self-running product.

Last updated: 2026-06-21

---

## 1. Brand
- **Agency:** OFFHAND — a digital agency, just starting out (no case studies yet).
- **Services (8):** websites, CRM, digital marketing, social media management,
  complete digital presence, ads, AI automation, SaaS tools.
- **Strategy:** the site = the proof of work. Every service is *shown*, not described.
- **Name insight:** "offhand" = effortless / sleight of hand → **complex digital, made effortless.**
- **Tagline (locked candidate):** "Complex, made offhand."
- **Voice:** brutalist, confident, terse, machine-like. Mono labels, oversized display type.

## 2. Tech & constraints (LOCKED)
- **Stack:** Next.js (App Router, TS, src dir, no Tailwind, Turbopack) + React Three Fiber.
- **Visuals:** 100% procedural / shader-based. **No external 3D assets** (no GLTF/textures/HDRIs).
- **Sound:** designed in, **muted by default**, fully synthesized via Web Audio (no audio files).
- **Aesthetic:** bold brutalist / experimental. Motion language = a **self-running machine**.

## 3. Concept (LOCKED)
- **OFFHAND OS** — the site is an impossible product that fuses everything OFFHAND builds
  (dashboard + CRM + automation + SaaS + site) into one living interface that runs itself.
- **Hub metaphor (LOCKED):** **THE MACHINE ROOM** — a vast, bright brutalist/architectural
  void (newsprint paper, not dark) receding into fog. The 8 services are **ink-black monolith
  modules** floating along a central hall, each with an acid label plate. A tall central
  **OFFHAND CORE** pulses at the far end (= complete digital presence / the finale). Acid
  **light conduits** wire every module back to the core, with pulses travelling them = AI
  automation running the whole room by itself. The camera flies the hall on a spline, parking
  at each module.
- **Signature:** autonomy. The OS is already running when you arrive (modules cycle, routes
  fire, the cursor even drifts on its own before you take control).

## 4. Narrative — four acts (LOCKED)
- **Act 0 — COLD BOOT:** OS power-on. POST log streams; wordmark assembles from the log;
  palette is Phosphor Terminal. First scroll "wakes" the machine → resolves to Newsprint Acid.
- **Act 1 — THE DESKTOP / HUB:** arrive inside the running OS; all 8 services live here.
- **Act 2 — THE DIVE:** scroll dives the camera into each module; each fills the screen and
  has its **own internal scroll** (screens-inside-screens), with one optional deep-dive level.
- **Act 3 — THE HANDOFF / CTA:** all modules converge into one network; OS "hands you the
  controls" → **"> START YOUR BUILD."**

## 5. Defining mechanic — nested scroll (LOCKED)
- **Outer scroll = travel** (camera moves through the world along a spline).
- **Dock** — camera locks onto a module; it fills the viewport.
- **Inner scroll** — scroll now drives that screen's internal content (self-contained world).
- **Deep-dive (L2)** — a screen can contain a smaller screen you dive into. **Cap = 1 level**
  (2 levels of nesting total). Constellation finale uses it as the recursion payoff.
- **Release** — inner content ends → scroll "lets go" → camera travels to next module.
- **State machine:** `Traveling → Docked → InnerScroll → DeepDive → Release → Traveling`.

## 6. The 8 modules (order LOCKED)

| # | Service | Screen name | Inner scroll (L1) | Deep-dive (L2) |
|---|---------|-------------|-------------------|----------------|
| 1 | Websites | **The Build** | a site assembles itself as you descend | beneath the pixels → DOM/code lattice |
| 2 | CRM | **The Pipeline** | lead-cards sort Lead→Won along a conveyor | into one card → a contact record/timeline |
| 3 | Marketing | **The Funnel** | descend funnel; particles convert; counter climbs | one converting particle's full journey |
| 4 | Social | **The Feed Engine** | infinite self-composing feed, reshuffles by perf | one post → engagement breakdown |
| 5 | Ads | **The Broadcast** | scrub campaign; reach radiates across a map | one impression ring → an audience segment |
| 6 | AI Automation | **The Loom** | scrub a flow; tasks execute hands-free | one node → its IF/THEN sub-flow |
| 7 | SaaS | **The Product** | scroll features; live UI responds | one feature → a live mini-app |
| 8 | Digital Presence | **The Constellation** | all modules wire into one network | dive a node → re-enter an earlier module (recursion payoff) |

**Meta-roles:** AI Automation = *why the OS self-runs* (ambient autonomy originates here).
Digital Presence = *the hub that connects everything* (finale literally nests earlier screens).

## 7. Palette (LOCKED)
- **World — "Newsprint Acid":** paper `#EDE8DF` · ink `#0B0B0B` · acid `#C8FF00`
  (electric-blue alt `#4D5DFF`). High contrast, no soft gradients.
- **Boot only — "Phosphor Terminal":** void `#0A0A0A` · phosphor `#00FF88` (amber alt `#FFB000`).
- Boot powers on green, then **resolves** into the premium newsprint world.

## 8. Type (LOCKED direction)
- **Display:** tight grotesk (Archivo / Anton / Neue Montréal vibe).
- **Data / labels:** mono (Geist Mono / JetBrains Mono).
- Hard grid, visible rules/borders, data-style labels everywhere.

## 9. Motion signature (LOCKED)
- **"Offhand" autonomy:** modules cycle, routes fire, cursor twitches on its own.
- **Snap easing:** fast in, hard stop — never floaty. Cuts/glitch/dither wipes over fades.
- **Camera:** deliberate dolly with faint handheld Perlin noise.

## 10. Global systems
- **OS HUD (always on):** framed border + corner ticks; top-left `OFFHAND OS v1.0`;
  top-right telemetry (`AUTONOMY: ON`, time, render stats); bottom-left module + cursor coords;
  bottom-right `SECTOR 0X / 08` progress.
- **Cursor:** crosshair reticle w/ live coords; morphs `[ FLY ] / [ SCROLL ] / [ DIVE ]`.
- **Post stack:** film grain + scanlines + chromatic aberration on edges + vignette +
  bloom on accent; glitch/dither wipes on transitions; CRT curvature **boot only**.
- **Scroll engine:** Lenis (smooth virtual scroll) → GSAP ScrollTrigger (pin + scrub).
- **Screens-inside-screens:** drei `MeshPortalMaterial` / `RenderTexture`; render targets;
  `Html` transform for crisp UI where needed.
- **Sound (muted default):** synthesized Web Audio — room hum, trace ticks, dock "thunk",
  per-section clicks, deep-dive whoosh+sub, boot beeps, CTA power-chord.

## 11. Performance
- Only the focused module renders its portal scene at full res; others = cheap silkscreen face.
- Off-screen portals unmount; instanced traces/particles; DPR clamp.

## 12. Accessibility & responsive
- `prefers-reduced-motion` → flatten into a tall scrollable brutalist page (stills + copy,
  no autoplay); keyboard nav (arrows move, Enter docks, Esc exits); plain-text/SEO version.
- **Mobile:** no free camera — vertical stack of pinned sections; inner scroll = keep
  scrolling; deep-dive = tap-to-expand overlay; reduced particles/post.

## 13. Conversion
- Primary CTA: **`> START YOUR BUILD`**; secondary `> book a call`.
- Footer: mono contact line, socials as `[ ]` brackets, `OFFHAND OS v1.0 — © 2026`.

---

## Copy bank (draft, per screen)
- Hero/Board: "EIGHT SYSTEMS. ONE MACHINE." / `scroll to dive`
- Websites: "SITES THAT BUILD THEMSELVES." / "design → dev → deploy."
- CRM: "EVERY LEAD, ON RAILS." / "captured, scored, moved — automatically."
- Marketing: "ATTENTION → REVENUE." / "strategy that compounds."
- Social: "ALWAYS POSTING. NEVER TIRED." / "content engine on autopilot."
- Ads: "SPEND THAT FINDS PEOPLE." / "every impression earns its place."
- Automation: "IT RUNS ITSELF. THAT'S THE POINT." / "automation that does the boring 90%."
- SaaS: "WE BUILD THE TOOL, NOT JUST THE SITE." / "custom SaaS, your logic."
- Presence: "ONE SYSTEM. EVERYWHERE YOU ARE." / "your complete digital presence, handled."
- CTA: "HANDS OFF. WE'VE GOT IT." → `> START YOUR BUILD`
