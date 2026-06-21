import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Display: warm editorial serif. Body: humanist sans. Accent: mono whisper. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OFFHAND — You do your craft. We do the rest.",
  description:
    "You're brilliant at what you do. OFFHAND brings you customers and runs everything online — websites, leads, marketing, social, ads and automation — so you can stay in your genius and become the one-of-one in your field.",
  applicationName: "OFFHAND",
  keywords: [
    "digital agency for small business",
    "get more customers",
    "website design",
    "lead generation",
    "marketing for small business",
    "social media management",
    "google ads",
    "business automation",
  ],
  authors: [{ name: "OFFHAND" }],
  openGraph: {
    title: "OFFHAND — You do your craft. We do the rest.",
    description:
      "We bring you customers and quietly run everything online, so you can focus on the work only you can do.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#efe7d6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${jbMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
