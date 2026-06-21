# OFFHAND OS — Open Questions & Refinements

Things still being decided. Resolve, then fold into `00-MASTER-BRIEF.md`.

---

## OPEN — Hub metaphor (Act 1 / The Desktop)
**RESOLVED → THE MACHINE ROOM** (see RESOLVED section). Alternatives kept for reference only:
1. THE BOARD — motherboard/PCB; chips = services.
2. THE TERMINAL / DESKTOP — tiled app windows.
3. **THE MACHINE ROOM — CHOSEN.** Architectural void, floating monolith modules, light conduits.
4. THE CONTROL DECK — single console of instruments.
5. THE GRID CITY — iso wireframe city.

## REFINE — requested polish passes (from user)
- Copy / voice across all screens. — DELIVERED (per-module screen + tag copy in `config/modules.ts`).
- Deep-dive (L2) ideas per module. — DELIVERED (all 8 have an L2 beat).
- Boot + CTA moments. — DELIVERED (Cold Boot + Act 3 Handoff).
- Motion / easing feel. — DELIVERED (snap easings, dock dwell, brutalist wipes).

## TODO — visual concept boards
Skipped in favour of building + validating live screenshots. Can still generate if wanted.

## FOLLOW-UPS (optional)
- Swap mailto stubs in `Handoff.tsx` for the real contact/booking target.
- Optionally promote 1–2 modules to true `MeshPortalMaterial` 3D worlds.
- Replace placeholder stats/copy with real OFFHAND numbers.
- Deeper mobile + cross-browser audio testing.

## RESOLVED
- **Full desktop experience built + validated (Session 3)** — dock/inner-scroll for all 8
  modules, deep-dives, Act 3 CTA, custom cursor, synthesized sound, reduced-motion.
- **Nested scroll** implemented as one continuous timeline (`config/timeline.ts`); module
  inner-worlds are brutalist HTML/CSS/SVG screens over the 3D hall (hybrid; reliable + crisp).
- **Hub metaphor: THE MACHINE ROOM** — LOCKED (2026-06-21).
- Narrative four-act spine — LOCKED.
- Palette: Newsprint Acid world + Phosphor boot — LOCKED.
- Recursion depth: 2 levels total (dock + inner + one deep-dive) — LOCKED.
- Module set, names, and order — LOCKED.
- Sound designed in, muted by default — LOCKED.
- Stack: Next.js + R3F, procedural only — LOCKED.
