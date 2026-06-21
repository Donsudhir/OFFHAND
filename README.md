# OFFHAND — Complex, made offhand.

> The website **is** the proof of work. OFFHAND is a digital agency; this site is an
> immersive, procedurally-rendered experience that demonstrates everything we build.

Built with **Next.js + React Three Fiber**, fully procedural (no external 3D assets),
with a synthesized Web Audio layer and a brutalist "OFFHAND OS" art direction.

## The experience (v1 — "OFFHAND OS")

A single scroll-driven journey:

1. **Cold Boot** — a phosphor CRT terminal boots "OFFHAND OS" and assembles the wordmark.
2. **The Machine Room** — fly a hall of 8 service monoliths wired to a pulsing core.
3. **The 8 dives** — dock into each service's live screen, each with a deep-dive:
   Websites · CRM · Marketing · Social · Ads · AI Automation · SaaS · Digital Presence.
4. **The Handoff** — "HANDS OFF. WE'VE GOT IT." → start your build.

Includes an always-on HUD, a custom crosshair cursor, synthesized sound (muted by
default), and reduced-motion + SEO fallbacks.

## Tech

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **React Three Fiber** + **drei** + **@react-three/postprocessing**
- **GSAP** + **Lenis** (smooth scroll) + **Zustand** (cross-canvas state)
- Hand-authored CSS (no Tailwind) for precise brutalist control

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Project structure

```
src/
  app/           # Next.js app router, global styles, layout
  components/
    boot/        # Act 0 — cold boot
    three/       # Machine Room scene + camera rig
    screens/     # docked module screens + the 8 inner worlds
    scroll/      # Lenis scroll controller
    hud/         # OS HUD overlay
    cursor/      # custom crosshair cursor
    cta/         # Act 3 — handoff / CTA
  config/        # modules, layout, journey timeline
  state/         # zustand store
  audio/         # synthesized Web Audio
docs/            # canonical brief, build log, art direction
public/
  moodboard.html # v2 warm art-direction style tiles
```

## Documentation

- [`docs/00-MASTER-BRIEF.md`](docs/00-MASTER-BRIEF.md) — canonical spec
- [`docs/01-BUILD-LOG.md`](docs/01-BUILD-LOG.md) — chronological build log
- [`docs/02-OPEN-QUESTIONS.md`](docs/02-OPEN-QUESTIONS.md) — decisions & open items
- [`docs/03-ART-DIRECTION-V2.md`](docs/03-ART-DIRECTION-V2.md) — warm "one-of-one" redesign direction

---

© 2026 OFFHAND. All rights reserved.
