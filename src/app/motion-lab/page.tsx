import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { MotionLab } from "@/components/labs/motion-lab";

export const metadata: Metadata = {
  title: "Motion Lab — PromptForge",
  description:
    "Every motion technique in the knowledge base, actually running: IO-driven reveals, spring physics, verlet rope, particle networks, scroll choreography. No fake previews.",
};

export default function MotionLabPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main id="main-content" className="relative z-10">
        <MotionLab />
      </main>
      <Footer />
    </>
  );
}
