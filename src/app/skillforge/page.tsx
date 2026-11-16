import type { Metadata } from "next";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { SkillForgeComposer } from "@/components/skillforge-composer";

export const metadata: Metadata = {
  title: "SkillForge Preview — Compose AI expertise",
  description:
    "Preview a deterministic Tier 1 skill graph and draft Project DNA for an AI Product idea.",
};

export default function SkillForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-6 pt-28 pb-20 md:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SkillForgeComposer />
        </div>
      </main>
      <Footer />
    </>
  );
}
