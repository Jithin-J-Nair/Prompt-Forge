import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav, Footer, Atmosphere, Eyebrow } from "@/components/chrome";
import { ForgeConsole } from "@/components/forge-console";

export const metadata: Metadata = {
  title: "The Forge — Enhance any website prompt",
  description:
    "Type a vague one-line brief. Receive a complete brand identity, design system, page blueprints, component contracts, motion score, SEO plan and backend schema — as one copy-ready mega prompt.",
};

export default function ForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1280px] px-6 pt-32 pb-24 md:px-10 md:pt-40">
        <header className="mb-12 md:mb-16">
          <Eyebrow>The forge · input → enhancement</Eyebrow>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.98] font-bold tracking-tight uppercase md:text-7xl">
            Feed it <span className="text-stroke">something</span>{" "}
            <span className="text-gradient-ember">lazy.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-fog">
            One vague sentence becomes a twelve-section, production-grade build
            spec — forged, filed to your library, and ready to paste into any
            AI site builder or sprint plan.
          </p>
        </header>
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl border border-line bg-carbon/40" />}>
          <ForgeConsole />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
