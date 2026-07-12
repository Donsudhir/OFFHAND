"use client";

import { useState } from "react";
import Preloader from "@/components/boot/Preloader";
import SiteCursor from "@/components/cursor/SiteCursor";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/home/Hero";
import BrandMarquee from "@/components/home/BrandMarquee";
import TextReveal from "@/components/home/TextReveal";
import IconDraw from "@/components/home/IconDraw";
import AIEngines from "@/components/home/AIEngines";
import BentoFeatures from "@/components/home/BentoFeatures";
import AgentSelect from "@/components/home/AgentSelect";
import AgentDashboard from "@/components/home/AgentDashboard";
import Proofs from "@/components/home/Proofs";
import Telemetry from "@/components/home/Telemetry";
import BeforeAfter from "@/components/home/BeforeAfter";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import Work from "@/components/home/Work";
import Journal from "@/components/home/Journal";
import Faq from "@/components/home/Faq";
import LeadGen from "@/components/home/LeadGen";
import Footer from "@/components/home/Footer";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <Preloader onDone={() => setBooted(true)} />
      <SiteCursor />
      <Navbar />

      <main className="page themeGraphite" data-booted={booted}>
        <Hero />
        <BrandMarquee />
        <TextReveal />
        <IconDraw />
        <AIEngines />
        <BentoFeatures />
        <AgentSelect />
        <AgentDashboard />
        <Proofs />
        <Telemetry />
        <BeforeAfter />
        <Stats />
        <Testimonials />
        <Work />
        <Journal />
        <Faq />
        <LeadGen />
      </main>

      <Footer />
    </>
  );
}
