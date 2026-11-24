import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promptforge.app"),
  title: {
    default: "PromptForge — Expertise operating system",
    template: "%s · PromptForge",
  },
  description:
    "Compose reviewed skill packages agents can execute. SkillForge builds the COOK brain; PromptForge writes the body protocol — one expertise OS.",
  keywords: [
    "prompt engineering",
    "skill packages",
    "ai expertise",
    "agent handoff",
    "design system generator",
  ],
  openGraph: {
    title: "PromptForge — Expertise operating system",
    description:
      "One project idea becomes a reviewed skill graph, COOK brain, and body protocol.",
    type: "website",
    siteName: "PromptForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge — Expertise operating system",
    description:
      "One project idea becomes a reviewed skill graph, COOK brain, and body protocol.",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef2f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="forge"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="bg-base-100 font-body text-base-content antialiased">
        {children}
      </body>
    </html>
  );
}
