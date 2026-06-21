"use client";

import dynamic from "next/dynamic";
import Hud from "@/components/hud/Hud";
import ColdBoot from "@/components/boot/ColdBoot";
import HeroIntro from "@/components/hero/HeroIntro";
import ScrollController from "@/components/scroll/ScrollController";
import ModuleScreens from "@/components/screens/ModuleScreens";
import Handoff from "@/components/cta/Handoff";
import Cursor from "@/components/cursor/Cursor";

/* R3F must not server-render — load the canvas client-side only. */
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

/**
 * Experience — composites the layers of OFFHAND OS:
 *   1. Scene             (R3F canvas, fixed, z:0)
 *   2. ScrollController  (tall spacer that drives Lenis scroll → progress)
 *   3. ModuleScreens     (docked inner-scroll screens + scrim, z:12–14)
 *   4. HeroIntro         (Act 1 headline overlay, z:15)
 *   5. Handoff           (Act 3 CTA, z:16)
 *   6. Hud               (DOM telemetry frame, z:20)
 *   7. ColdBoot          (Act 0 overlay, z:40)
 *   8. Cursor            (custom crosshair, z:50)
 * Plus a visually-hidden semantic mirror for SEO / screen readers.
 */
export default function Experience() {
  return (
    <main className="app-root">
      <Scene />
      <ScrollController />
      <ModuleScreens />
      <HeroIntro />
      <Handoff />
      <Hud />
      <ColdBoot />
      <Cursor />

      {/* Real content for crawlers & assistive tech (not shown visually). */}
      <div className="sr-only">
        <h1>OFFHAND — Complex, made offhand.</h1>
        <p>
          OFFHAND is a digital agency that designs and builds complete digital
          systems and makes them look effortless.
        </p>
        <h2>Services</h2>
        <ul>
          <li>Website design &amp; development</li>
          <li>CRM setup &amp; automation</li>
          <li>Digital marketing</li>
          <li>Social media management</li>
          <li>Complete digital presence</li>
          <li>Advertising &amp; paid media</li>
          <li>AI automation</li>
          <li>Custom SaaS tools</li>
        </ul>
        <p>Start your build — get in touch with OFFHAND.</p>
      </div>
    </main>
  );
}
