import type { Metadata } from "next";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { PromptForgeConsole } from "@/components/promptforge-console";

export const metadata: Metadata = {
  title: "Body — PromptForge agent protocol",
  description:
    "After SkillForge COOK.md (the brain), PromptForge generates the body prompt: phased execution, skill links, and review gates.",
};

export default function PromptForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-5 pt-16 pb-20 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <PromptForgeConsole />
        </div>
      </main>
      <Footer />
    </>
  );
}
