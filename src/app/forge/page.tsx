import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav, Footer, Atmosphere, SectionLabel } from "@/components/chrome";
import { ForgeConsole } from "@/components/forge-console";

export const metadata: Metadata = {
  title: "Legacy forge — Enhance any website prompt",
  description:
    "Type a vague one-line brief. Receive a complete brand identity, design system, page blueprints, and backend schema as one copy-ready mega prompt.",
};

export default function ForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1120px] px-4 pt-16 pb-24 md:px-8 md:pt-20">
        <header className="mb-10 md:mb-14">
          <SectionLabel>Legacy forge</SectionLabel>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            Feed it something lazy.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70">
            One vague sentence becomes a twelve-section build spec — forged, filed to your library,
            and ready to paste into any AI site builder.
          </p>
        </header>
        <Suspense fallback={<div className="skeleton h-[420px] rounded-box" />}>
          <ForgeConsole />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
