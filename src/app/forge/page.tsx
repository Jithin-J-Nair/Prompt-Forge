import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { ForgeConsole } from "@/components/forge-console";
import { ForgePageIntro } from "@/components/forge-page-intro";

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
      <main className="relative z-10 mx-auto max-w-[1200px] px-5 pt-16 pb-24 md:px-8 md:pt-20">
        <ForgePageIntro />
        <Suspense fallback={<div className="skeleton h-[420px] rounded-box" />}>
          <ForgeConsole />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
