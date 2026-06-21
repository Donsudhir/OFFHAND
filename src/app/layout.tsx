import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Display: tight grotesk. Mono: data/labels. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OFFHAND — Complex, made offhand.",
  description:
    "OFFHAND is a digital agency that builds websites, CRMs, automations, ads and SaaS tools — complex digital systems, made effortless.",
  applicationName: "OFFHAND OS",
  keywords: [
    "digital agency",
    "web development",
    "CRM",
    "AI automation",
    "SaaS",
    "digital marketing",
    "ads",
    "social media management",
  ],
  authors: [{ name: "OFFHAND" }],
  openGraph: {
    title: "OFFHAND — Complex, made offhand.",
    description:
      "A digital agency that makes complex digital systems look effortless.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="boot"
      className={`${archivo.variable} ${jbMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
