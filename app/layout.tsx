import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { SkipLink } from "@/components/a11y/SkipLink";
import "@/styles/globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://godwinbassey.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Godwin Bassey — Full Stack Developer & Digital Strategist",
    template: "%s",
  },
  description:
    "Full Stack Developer, Graphic Designer, and AI Automation Specialist building premium digital products and brands.",
};

/**
 * Deliberately minimal: fonts + global CSS + the skip link only. The
 * public site's motion shell (Cursor, PageLoader, Nav, Footer,
 * analytics) lives in (public)/layout.tsx so /admin never ships that
 * JS or pays for it — matching the original "admin never inherits
 * public motion/cursor overhead" architecture note.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
