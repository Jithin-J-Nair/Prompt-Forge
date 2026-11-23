import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Syne, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
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
  themeColor: "#e8eef2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="forge">
      <body
        className={`${syne.variable} ${sourceSerif.variable} ${ibmPlex.variable} bg-base-100 text-base-content antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
