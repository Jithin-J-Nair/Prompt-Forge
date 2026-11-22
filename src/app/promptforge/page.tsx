import type { Metadata } from "next";
import { Atmosphere, Footer, Nav } from "@/components/chrome";
import { PromptForgeConsole } from "@/components/promptforge-console";

export const metadata: Metadata = {
  title: "PromptForge — Body prompt for agentic builds",
  description:
    "After SkillForge COOK.md (the brain), PromptForge generates the body prompt: phased execution, skill links, and review gates for category-best craft.",
};

export default function PromptForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 min-h-screen px-6 pt-24 pb-20 md:px-10">
        <div className="mx-auto max-w-[1120px]">
          <PromptForgeConsole />
        </div>
      </main>
      <Footer />
    </>
  );
}
