import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
  Noto_Sans_JP,
} from "next/font/google";
import { Providers } from "@/components/providers";
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

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-jp",
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
  other: {
    "page-type": "software",
    "site-kind": "software",
  },
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
      data-type="software"
      data-radius="soft"
      data-buttons="tonal"
      data-motion="on"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} ${notoJp.variable}`}
    >
      <body className="bg-base-100 font-body text-base-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
