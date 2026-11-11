import type { Metadata } from "next";
import { Nav, Atmosphere } from "@/components/chrome";
import { StudioApp } from "@/components/studio/studio-app";

export const metadata: Metadata = {
  title: "Studio — PromptForge Visual Prompt Engineering",
  description:
    "Compose implementation-ready build specifications from 279 typed technique modules. Compatibility-aware compiler, typed parameters, presets, export to Markdown/JSON/text.",
};

export default function StudioPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main id="main-content" className="relative z-10">
        <StudioApp />
      </main>
    </>
  );
}
