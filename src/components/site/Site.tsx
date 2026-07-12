"use client";

import dynamic from "next/dynamic";
import Landing from "@/components/site/Landing";
import SmoothScroll from "@/components/site/SmoothScroll";

/* R3F must not server-render — load the warm atmosphere client-side only. */
const Atelier = dynamic(() => import("@/components/site/Atelier"), {
  ssr: false,
});

/**
 * Site (v2) — the warm, cinematic "one-of-one" experience.
 *   1. SmoothScroll — Lenis-driven scroll → 0..1 progress store
 *   2. Atelier      — golden-hour 3D living diorama (fixed background, z:0)
 *   3. Landing      — editorial content + cinematic interludes (z:1+)
 * Plus a visually-hidden semantic mirror for SEO / assistive tech.
 */
export default function Site() {
  return (
    <main id="top" className="app-root">
      <SmoothScroll />
      <Atelier />
      <Landing />

      <div className="sr-only">
        <h1>OFFHAND — you do your craft, we do the rest.</h1>
        <p>
          OFFHAND is a digital studio for small businesses and solo founders. We
          bring you customers and quietly run everything online — your website,
          lead follow-up, marketing, SEO, social media, ads and automation — so
          you can focus on the work only you can do and become the one-of-one in
          your field.
        </p>
        <h2>What we do</h2>
        <ul>
          <li>A website that actually brings you customers</li>
          <li>Never miss a lead or follow-up</li>
          <li>Get found by people ready to buy</li>
          <li>Show up on social without lifting a finger</li>
          <li>Reach the right people with ads</li>
          <li>Automate the work that runs your business</li>
          <li>Custom tools built around how you work</li>
          <li>A complete, professional online presence</li>
        </ul>
        <p>
          Not technical? Perfect — that&apos;s the point. Start with a free game
          plan: {""}
          <a href="mailto:hello@offhand.studio">hello@offhand.studio</a>.
        </p>
      </div>
    </main>
  );
}
