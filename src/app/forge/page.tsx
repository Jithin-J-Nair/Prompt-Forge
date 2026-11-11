import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
import { ForgeWorkspace } from "@/components/forge-workspace";

export const metadata: Metadata = {
  title: "Forge — Quick prompts and creative mega specs",
  description:
    "Start with one sentence or compose creative layers across motion, typography, layout, color, 3D and engineering. Forge a concise prompt or a deeply structured website build specification.",
};

export default async function ForgePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const query = (await searchParams).q;
  const legacyBrief = Array.isArray(query) ? query[0] : query;
  if (legacyBrief) redirect(`/enhance?q=${encodeURIComponent(legacyBrief.slice(0, 400))}`);

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
