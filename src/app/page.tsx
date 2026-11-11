import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: "PromptForge — One idea in. A creative build brief out.",
  description: "Create a concise website prompt from one sentence, or compose creative layers into a detailed build specification for your AI coding agent.",
};

export default function HomePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main id="main-content" className="relative z-10">
        <HomeView />
      </main>
      <Footer />
    </>
  );
}
