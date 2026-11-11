import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { ForgeConsole } from "@/components/forge-console";

export const metadata: Metadata = {
  title: "Deep Spec — Full website blueprint",
  description:
    "Turn one short brief into a deterministic, twelve-section website blueprint covering brand identity, design system, pages, components, interactions, technology, SEO and backend planning.",
};

function DeepSpecFallback() {
  return (
    <div className="min-h-[420px] rounded-xl border border-line bg-carbon/40 p-8" role="status" aria-live="polite">
      Preparing the full-site blueprint workspace…
    </div>
  );
}

export default function DeepSpecPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main id="main-content" className="relative z-10 mx-auto max-w-[1280px] px-4 pb-24 pt-32 md:px-8 md:pt-36">
        <header className="mb-10 border-b border-line pb-8">
          <h1 className="text-balance font-display text-5xl font-semibold tracking-[-0.04em] text-ivory md:text-6xl">
            Full site blueprint.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fog">
            A deterministic generator that turns a short brief into a structured twelve-section specification. It does not call an external AI model; review its assumptions and tailor the result before implementation.
          </p>
        </header>
        <Suspense fallback={<DeepSpecFallback />}>
          <ForgeConsole />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
