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
  title: {
    default: "PromptForge — Creative Prompt Workbench",
    template: "%s · PromptForge",
  },
  description: "Turn one idea into a concise prompt or compose creative layers into a detailed website build specification.",
  keywords: [
    "prompt engineering",
    "website prompt generator",
    "ai website builder",
    "design system generator",
    "mega prompt",
    "next.js prompt",
  ],
  openGraph: {
    title: "PromptForge — Creative Prompt Workbench",
    description:
      "Create a concise prompt from one idea or compose a detailed website build specification from curated creative layers.",
    type: "website",
    siteName: "PromptForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge — Creative Prompt Workbench",
    description:
      "One lazy sentence in. A 2,000-word, production-ready build spec out.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d09",
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
