import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: "PromptForge — AI expertise OS powered by SkillForge",
  description:
    "Turn one project idea into a reviewed skill graph, Project DNA, eleven blueprints, and an agent handoff pack. Elite specialist thinking for AI agents and human teams.",
};

export default function HomePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10">
        <HomeView />
      </main>
      <Footer />
    </>
  );
}
