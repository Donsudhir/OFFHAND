# OFFHAND OS — Build Log

A running, chronological record of every build step so context is never lost.
Newest entries at the bottom of each session.

> **Published to GitHub** — `git@github.com:Donsudhir/OFFHAND.git` (branch `main`,
> commit `0cf1625`, 2026-06-21). v1 cinematic "OFFHAND OS" snapshotted before the v2
> warm "one-of-one" redesign begins. Remote `origin` set; `main` tracks `origin/main`.

---

## Session 1 — 2026-06-21 — Foundation

### Environment
- OS: Linux. Node `v22.22.2`, npm `10.9.7`. No pnpm.
- Project root: `/home/sudhir/Desktop/offhand`.

### Step 1 — Scaffold Next.js (DONE)
- Command: `create-next-app@latest offhand --typescript --app --src-dir --import-alias "@/*" --eslint --no-tailwind --use-npm --turbopack`
- Result: Next.js **16.2.9**, React **19.2.4**, TypeScript, App Router, `src/` dir, ESLint, Turbopack.
- Chose **no Tailwind** → hand-authored CSS for precise brutalist control.

### Step 2 — Install 3D / animation stack (DONE)
- `three@0.184.0`, `@react-three/fiber@9.6.1`, `@react-three/drei@10.7.7`,
  `@react-three/postprocessing@3.0.4`, `postprocessing@6.39.1`, `gsap@3.15.0`,
  `lenis@1.3.23`, `@types/three@0.184.1` (dev).
- `zustand` added for state across the R3F canvas boundary (also a drei dep).
- Compatibility verified: R3F v9 + React 19 + drei v10 are aligned.

### Step 3 — Design tokens & global brutalist styles (DONE)
- `src/app/globals.css`: dual-palette tokens (Newsprint Acid world + Phosphor boot via
  `:root[data-mode="boot"]`), fluid type scale, spacing scale, motion easings, layer z-index,
  brutalist reset, typographic + HUD primitives, reduced-motion hard switch.
- `src/app/layout.tsx`: wired **Archivo** (display) + **JetBrains Mono** (data) via `next/font`,
  full SEO metadata + viewport, `data-mode="boot"` initial palette.

### Step 4 — State, HUD frame & base Canvas (DONE)
- `src/state/useOS.ts`: zustand store (phase, progress, section, cursor, pointer, sound,
  reducedMotion, booted) shared across the R3F canvas boundary; `wake()` flips palette.
- `src/components/hud/Hud.tsx` + `hud.module.css`: always-on framed HUD with corner ticks,
  identity (TL), telemetry + live clock (TR), module + live cursor coords (BL), SECTOR x/08
  progress (BR), sound toggle. Pointer coords update via store subscription (no re-render).
- `src/components/Scene.tsx`: R3F `<Canvas>` (DPR clamp 1–1.75), `BackgroundRig` lerps world
  from void→paper on wake, `PointerBridge` feeds the store, `World` = ink monolith + acid
  wireframe + 80 instanced drifting bits + receding acid grid + handheld camera noise +
  pointer parallax + reveal-on-wake, `Post` stack (Bloom, ChromaticAberration, Scanline,
  Noise grain, Vignette) tuned for the light newsprint background.
- `src/components/Experience.tsx`: composites Scene + Hud + ColdBoot; hidden semantic SEO mirror.
- `src/app/page.tsx`: renders `<Experience/>` (legacy scaffold removed).

### Step 5 — Act 0 Cold Boot (DONE)
- `src/components/boot/ColdBoot.tsx` + `boot.module.css`: phosphor CRT terminal that streams a
  16-line POST log, assembles the **OFFHAND** wordmark (per-glyph stagger), shows
  "Complex, made offhand." + "press scroll to wake". First wheel/key/touch/click → `wake()` →
  CRT power-off collapse → `phase = live`. Scanlines + flicker + glow; reduced-motion path
  reveals instantly and skips the collapse.

### Step 6 — Run dev server & validate (DONE)
- `npm run dev` (Turbopack) → Ready in 417ms, `GET / 200`. Only warning: harmless
  `THREE.Clock` deprecation from three.js internals.
- Validated in-browser with screenshots:
  - Cold boot: phosphor POST log + glowing wordmark + tagline + wake prompt all fit viewport.
  - Wake: HUD → WAKING → ONLINE, cursor → [ FLY ], clock + sound toggle live.
  - World: newsprint paper bg w/ grain, ink monolith + acid wireframe, drifting bits,
    receding acid grid, **ink HUD legible on paper**. Boot→world palette resolve confirmed.
- **Foundation milestone COMPLETE and validated.**

### Next up (Session 2)
- Resolve hub metaphor (THE BOARD vs alternatives) — `docs/02-OPEN-QUESTIONS.md`.
- Lenis + GSAP ScrollTrigger scroll engine (Traveling/Docked/InnerScroll/DeepDive/Release).
- Build Act 1 hub + first module (Websites “The Build”) with a real portal (MeshPortalMaterial).
- Synthesized Web Audio sound layer (boot beeps, dock thunk, etc.).

---

## Decisions captured
- Building **desktop experience first**; foundation (setup, tokens, HUD, scroll engine,
  Cold Boot) is metaphor-agnostic so hub-metaphor refinement won't block the build.
- Hub metaphor still open (THE BOARD vs alternatives) — tracked in `02-OPEN-QUESTIONS.md`.

---

## Session 2 — 2026-06-21 — Machine Room hub + scroll engine

### Decision — Hub metaphor LOCKED: THE MACHINE ROOM
- Bright newsprint architectural void (not dark); 8 ink monolith modules along a hall;
  central pulsing OFFHAND core at the far end (= presence/finale); acid conduits with
  travelling pulses (= AI automation running the room). Camera flies a spline, parks at
  each module. Chosen over THE BOARD / Terminal Desktop / Control Deck / Grid City.

### Step 7 — Content + layout config (DONE)
- `src/config/modules.ts`: the 8 modules (num, name, screen name, tag, blurb) — single
  source of truth for content (journey order).
- `src/config/layout.ts`: Machine Room geometry — module positions (alternating L/R down
  the hall), core position, camera waypoints, Catmull-Rom `cameraCurve`, segment count.

### Step 8 — The Machine Room scene (DONE)
- `src/components/three/MachineRoom.tsx`: architectural lighting (ambient + hemisphere +
  directional + acid fill); receding floor + faint ceiling grids; 8 `ModuleBlock`s (ink slab
  + acid wireframe edge + canvas-texture label plate drawn in the brand mono font, active
  module warms its emissive); pulsing `Core` (ink body, acid emissive + point light);
  `Conduits` (acid beams module→core with a travelling pulse dot each = autonomy); `Dust` motes.

### Step 9 — Scroll engine + camera rig (DONE)
- `src/components/scroll/ScrollController.tsx`: tall spacer ((N+2)*100svh) + **Lenis** smooth
  scroll → writes 0..1 progress to the store; resets to top on wake; native-scroll fallback
  for reduced-motion. Lenis CSS added to `globals.css`.
- `src/components/three/CameraRig.tsx`: drives the camera along `cameraCurve` from progress
  with `easeThroughStations` dwell (decel-in/accel-out = parking), frames the nearest module,
  settles on the core at the end, adds pointer parallax + handheld noise, reports active
  section to the store (throttled).
- `src/components/hero/HeroIntro.tsx`: Act 1 "EIGHT SYSTEMS. ONE MACHINE." overlay + scroll
  hint; fades once travel begins.
- `Scene.tsx` now composes `MachineRoom` + `CameraRig` (placeholder World removed; fog widened
  to 12–120; camera fov 46, far 400). `Experience.tsx` adds ScrollController + HeroIntro.

### Step 10 — Validate (DONE)
- Verified in-browser via Playwright-driven scroll + screenshots:
  - Establishing shot: hall, grids, modules + core behind the hero — OK.
  - Travel: HUD section + SECTOR x/08 + % advance with scroll; modules park & frame; label
    plates crisp in brand font ("THE PIPELINE / Every lead, on rails.") — OK.
  - Fixed: active module was glowing fully acid (lowered emissive → ink body w/ acid edge);
    pulled camera back for framing; fixed end-of-path look so the **core finale** settles
    centered; reduced olive tint.
- Dev server clean (`GET / 200`); only harmless `THREE.Clock` deprecation warning.
- **Session 2 milestone COMPLETE and validated.**

### Next up (Session 3)
- Dock + inner-scroll for the first module (Websites “The Build”) using `MeshPortalMaterial`
  — the real “screens-inside-screens”, with one deep-dive (L2).
- Synthesized Web Audio sound layer (boot beeps, dock thunk, trace ticks, etc.).
- Then replicate the dock/inner-scroll pattern across the remaining 7 modules.
- Polish: core detailing (wordmark on core), conduit density, mobile pinned-sections pass.

---

## Session 3 — 2026-06-21 — Complete the experience ("complete everything")

User asked to build the entire remaining experience. Delivered the full journey:
dock + inner-scroll for all 8 modules, deep-dives, Act 3 CTA, custom cursor, synthesized
sound, and responsive/reduced-motion handling.

### Architecture decision — nested scroll on one continuous timeline
Implemented the "screens-inside-screens" as a **single continuous scroll timeline** (robust,
how most award sites actually do it) instead of brittle scroll-hijacking. `src/config/timeline.ts`
`journeyState(progress)` maps the one 0..1 progress into:
`intro → [ approach module i (camera travels) → dwell module i (camera holds, screen drives
inner scroll) ] × 8 → outro/CTA`. Deep-dive (L2) lives in the dwell tail (`DEEP_DIVE_AT=0.78`).
Both the camera rig and the DOM screen layer derive from this one pure function, so they agree.

**Medium decision:** module inner-worlds are **brutalist HTML/CSS/SVG "screens"** composited
over the 3D hall (scrim focuses attention; camera dollies into the monolith behind). Chosen
over per-module `MeshPortalMaterial` worlds for reliability, crisp readable text (an agency
selling websites!), performance, and to ship all 8 + deep-dives + CTA cohesively. The 3D hall
remains the connective tissue; the felt experience (travel → dock → inner scroll → release) is
identical.

### Files added
- `src/config/timeline.ts` — journey math (`journeyState`, `innerL1/innerL2`, dock params).
- `src/components/screens/util.ts` — clamp/lerp/seg/count/stagger/fmt helpers.
- `src/components/screens/screens.module.css` — window chrome + scrim + deep-dive + all
  shared brutalist primitives (cols, cards, tiles, bars, svg, code, record, timeline).
- `src/components/screens/ScreenFrame.tsx` — the "monitor" chrome wrapper (header/body/footer
  rail), entrance + L1/L2 state driven by dwell.
- `src/components/screens/ModuleScreens.tsx` — controller: one rAF loop reads progress →
  journeyState; mounts only the active screen; quantizes dwell to limit re-renders; fades the
  scrim; sets cursor mode; fires sounds.
- `src/components/screens/content/*` — the 8 inner worlds, each scroll-driven with a deep-dive:
  - Websites "THE BUILD" — site assembles (wireframe→type→media→styled) + DEPLOY stamp; L2 = code/DOM lattice.
  - CRM "THE PIPELINE" — lead cards sort Lead→Won across 4 columns; L2 = one contact record + timeline.
  - Marketing "THE FUNNEL" — SVG funnel fills, particles, revenue/conv counters; L2 = one customer journey.
  - Social "THE FEED ENGINE" — self-composing post grid, BOOSTED tag; L2 = one post's engagement bars.
  - Ads "THE BROADCAST" — radiating SVG rings over targeting nodes, reach↑/CPA↓; L2 = one audience segment.
  - Automation "THE LOOM" — SVG node graph lights edges sequentially, ✓ tasks; L2 = one node IF/THEN.
  - SaaS "THE PRODUCT" — live dashboard (toggles, slider, bar chart); L2 = a feature panel w/ live usage.
  - Presence "THE CONSTELLATION" — 8 nodes wire into one network; L2 = re-enter any system (recursion).
- `src/audio/sound.ts` — synthesized Web Audio (muted by default, lazy ctx on gesture): tick,
  thunk, dive, hover, beep, powerOn, chord.
- `src/components/cursor/Cursor.tsx` (+css) — brutalist crosshair w/ live coords, morphs
  FLY/SCROLL/DIVE, hidden on touch.
- `src/components/cta/Handoff.tsx` (+css) — Act 3: "HANDS OFF. WE'VE GOT IT." + START YOUR
  BUILD / BOOK A CALL (mailto stubs) + footer (contact, socials, © line).

### Files changed
- `CameraRig.tsx` — rewritten to use `journeyState`: travel on approach, hold + dolly-in on
  dwell, settle on core for CTA, damp parallax while docked.
- `ScrollController.tsx` — scroll length → `MODULE_COUNT*150+260` vh for comfortable dwell.
- `Experience.tsx` — composes ModuleScreens + Handoff + Cursor.
- `Hud.tsx` — sound toggle now enables the audio engine; `ColdBoot.tsx` plays `powerOn` on wake.

### Validation (Playwright scroll + screenshots)
- Boot → wake → Websites L1 (clean build view) → Websites L2 (code lattice) → Marketing
  (funnel + journey) → Automation (node graph) → CTA finale (core pillar framing the headline).
- Fixed: deep-dive overlay cross-fade overlap → now snaps up fast (brutalist wipe) to cover L1.
- `npx tsc --noEmit` passes project-wide. Dev server clean (`GET / 200`); only harmless
  `THREE.Clock` deprecation + a browser `service-worker.js` 404 probe.
- Cursor modes, HUD section/SECTOR/%, sound toggle all live.
- **Session 3 COMPLETE — full desktop experience shipped end-to-end.**

### Known follow-ups (optional polish)
- Real contact target (swap mailto stubs in `Handoff.tsx`).
- Optional: promote one or two modules to true `MeshPortalMaterial` 3D worlds.
- Deeper mobile tuning (tap-to-expand deep-dive); cross-browser audio test.
- Replace placeholder stats/copy with real OFFHAND numbers when available.


---

## Session 4 — 2026-06-21 — v2 build + cinematic restore

### v2 aesthetic pivot (warm / premium / calm) — BUILT
Reskinned the soul (kept the R3F engine) per `docs/03-ART-DIRECTION-V2.md`:
- `globals.css` — Palette A "Bone & Honey" tokens (paper #efe7d6, espresso #2a2118,
  honey #d99a4e, clay #b06a43); editorial serif + humanist sans; calm easings; paper grain.
- `layout.tsx` — fonts Fraunces (display) + Hanken Grotesk (body) + JetBrains Mono (accent);
  warm metadata/title "You do your craft. We do the rest."
- `config/services.ts` — services rewritten as plain-language OUTCOMES + STEPS + FAQS + WHISPERS.
- `components/site/Atelier.tsx` — "The Atelier at Daybreak" 3D world.
- `components/site/Landing.tsx` + `site.module.css` — editorial landing (hero, story, services,
  steps, trust, FAQ, CTA, footer); `Site.tsx`; `page.tsx` → `<Site/>`.

### Feedback: "too simple, not one-of-one, 3D/motion/art/cinema missing" — FIXED
First v2 pass buried the 3D behind a scrim and read as a flat template. Rebuilt for cinema:
- `useSiteScroll.ts` + `SmoothScroll.tsx` — Lenis smooth scroll → 0..1 progress store.
- `Atelier.tsx` rebuilt as a **living miniature**: crafted little town on a worktable
  (9 buildings incl. honey hero w/ glowing sign + chimney, lamps, trees, looping car, chimney
  smoke, birds, dust), **scroll-driven cinematic camera** (Catmull-Rom fly: wide → into the
  streets → pull-back finale), **daybreak sunrise** (sun climbs/warms, windows + lamps switch
  on with scroll), tilt-shift **DepthOfField** + warm bloom + grain + vignette.
- `Landing.tsx` — cinematic hero (masked line-by-line reveal, floating live-activity chip),
  transparent **interludes** between opaque content bands so the evolving 3D shows through,
  CTA over the 3D finale. Full-bleed `.band` panels keep copy readable.

### Validation (Playwright + screenshots)
- Hero: big editorial serif over the warm lit diorama + activity chip — strong.
- Mid: camera flew INTO the streets, hero building lit, interlude line overlaid — cinematic.
- Finale: pull-back to the whole glowing town behind "Become the one-of-one." + CTAs.
- `npx tsc --noEmit` clean. Dev server clean (only harmless THREE.Clock + PCFSoftShadowMap
  deprecation warnings).

### Notes / follow-ups
- v1 cinematic "OFFHAND OS" components remain in `src/components/` (boot/three/screens/hud/
  cursor/cta) but are no longer mounted; kept for reference/reuse. Can be pruned later.
- Contact = mailto stubs (hello@offhand.studio) — swap for real booking link.
- Optional: per-service "scene" focus as you pass each (camera could frame a building per
  service), real testimonials/faces when available, deeper mobile tuning.
