import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { StackProvider, StackTray } from "@/components/lexicon/stack";
import "./globals.css";

/**
 * Fonts are self-hosted via @fontsource packages (imported in globals.css).
 * This keeps the build hermetic (no runtime Google Fonts fetch) and removes
 * third-party font requests entirely — faster LCP and offline-safe builds.
 */

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
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="bg-ink text-ivory antialiased">
        <StackProvider>
          {children}
          <StackTray />
        </StackProvider>
      </body>
    </html>
  );
}
