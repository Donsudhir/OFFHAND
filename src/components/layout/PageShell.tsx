"use client";

import { ReactNode } from "react";
import SiteCursor from "@/components/cursor/SiteCursor";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/home/Footer";

type Theme = "graphite" | "slate" | "paper";
const THEME_CLASS: Record<Theme, string> = {
  graphite: "themeGraphite",
  slate: "themeSlate",
  paper: "themePaper",
};

/**
 * PageShell — consistent chrome for sub-pages: custom cursor, navbar, the
 * scroll-over page body, and the sticky-reveal footer. The optional `theme`
 * re-skins the page background (graphite = black grainy, slate = grey grainy,
 * paper = whitish grainy) with matching foreground contrast.
 */
export default function PageShell({
  children,
  theme = "graphite",
}: {
  children: ReactNode;
  theme?: Theme;
}) {
  return (
    <>
      <SiteCursor />
      <Navbar />
      <main className={`page ${THEME_CLASS[theme]}`}>{children}</main>
      <Footer />
    </>
  );
}
