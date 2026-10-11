import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: "PromptForge — Turn one lazy sentence into a god-tier website spec",
  description:
    "The website prompt enhancement engine. Type “make a website for a gym” — receive a 2,000-word production blueprint: brand identity, design tokens, page-by-page UX, components, motion score, SEO and backend schema.",
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
