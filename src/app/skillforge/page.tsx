import type { Metadata } from "next";
import { Suspense } from "react";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { SkillForgeComposer } from "@/components/skillforge-composer";

export const metadata: Metadata = {
  title: "Compose — SkillForge expertise packages",
  description:
    "Turn one project idea into a reviewed skill graph, Project DNA, eleven blueprints, and an agent handoff pack.",
};

export default function SkillForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-5 pt-16 pb-20 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <Suspense
            fallback={
              <p className="font-mono text-sm text-base-content/60">
                <span className="loading loading-dots loading-sm" /> Loading SkillForge…
              </p>
            }
          >
            <SkillForgeComposer />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
