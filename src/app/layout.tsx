import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promptforge.app"),
  title: {
    default: "PromptForge — God-Tier Website Prompt Engine",
    template: "%s · PromptForge",
  },
  description:
    "Turn one lazy sentence into a production-ready, developer-grade website build spec. Brand identity, design system, page-by-page UX, components, motion, SEO and backend — forged in seconds.",
  keywords: [
    "prompt engineering",
    "website prompt generator",
    "ai website builder",
    "design system generator",
    "mega prompt",
    "next.js prompt",
  ],
  openGraph: {
    title: "PromptForge — God-Tier Website Prompt Engine",
    description:
      "One lazy sentence in. A 2,000-word, production-ready build spec out.",
    type: "website",
    siteName: "PromptForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge — God-Tier Website Prompt Engine",
    description:
      "One lazy sentence in. A 2,000-word, production-ready build spec out.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrains.variable} ${instrument.variable} bg-ink text-ivory antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
