import type { Metadata } from "next";
import { Suspense } from "react";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { SkillForgeComposer } from "@/components/skillforge-composer";

export const metadata: Metadata = {
  title: "SkillForge — Compose AI expertise packages",
  description:
    "Turn one project idea into a reviewed skill graph, Project DNA, eleven blueprints, and an agent handoff pack.",
};

export default function SkillForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-6 pt-24 pb-20 md:px-10">
        <div className="mx-auto max-w-[1120px]">
          <Suspense
            fallback={
              <p className="font-mono text-sm tracking-[0.14em] text-fog uppercase">
                Loading SkillForge…
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
