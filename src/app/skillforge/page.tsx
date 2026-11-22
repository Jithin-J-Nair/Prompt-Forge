import type { Metadata } from "next";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { SkillForgeComposer } from "@/components/skillforge-composer";

export const metadata: Metadata = {
  title: "SkillForge — Compose AI expertise packages",
  description:
    "Turn project intent into a reviewed skill graph, Project DNA, and exportable blueprint package.",
};

export default function SkillForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-6 pt-24 pb-20 md:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SkillForgeComposer />
        </div>
      </main>
      <Footer />
    </>
  );
}
