import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { ForgeWorkspace } from "@/components/forge-workspace";

export const metadata: Metadata = {
  title: "Forge — Quick prompts and creative mega specs",
  description:
    "Start with one sentence or compose creative layers across motion, typography, layout, color, 3D and engineering. Forge a concise prompt or a deeply structured website build specification.",
};

export default function ForgePage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main id="main-content" className="relative z-10 px-4 pb-24 pt-32 md:px-8 md:pt-36">
        <ForgeWorkspace />
      </main>
      <Footer />
    </>
  );
}
