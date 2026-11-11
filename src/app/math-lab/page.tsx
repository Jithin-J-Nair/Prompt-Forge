import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { MathLab } from "@/components/labs/math-lab";

export const metadata: Metadata = {
  title: "Math Lab — PromptForge",
  description:
    "Generative systems rendered with the real mathematics: RK4 Lorenz, Gray–Scott, marching-squares metaballs, fBM, Voronoi, phyllotaxis. Parameters exposed as sliders.",
};

export default function MathLabPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10">
        <MathLab />
      </main>
      <Footer />
    </>
  );
}
