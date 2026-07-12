import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono, Ultra, Playfair_Display } from "next/font/google";
import "./globals.css";

/* Display: confident modern grotesque for headings + cards. */
const sora = Sora({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

/* Accent: editorial serif for italic keyword accents inside headings
   (the premium dual-font "sans structure + serif keyword" treatment). */
const playfair = Playfair_Display({
  variable: "--font-serif-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Body: crisp, highly-legible neo-grotesque. */
const inter = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Brand: "Ultra" — bold fatface serif for the OFFHAND wordmark. */
const ultra = Ultra({
  variable: "--font-brand-src",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/* Mono: data / system labels. */
const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OFFHAND · Complex, made offhand.",
  description:
    "OFFHAND is a digital agency that builds websites, CRMs, automations, ads and SaaS tools. Complex digital systems, made effortless.",
  applicationName: "OFFHAND OS",
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
    title: "OFFHAND · Complex, made offhand.",
    description:
      "We bring you customers and quietly run everything online, so you can focus on the work only you can do.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060607",
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
      data-mode="boot"
      className={`${sora.variable} ${inter.variable} ${ultra.variable} ${jbMono.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
