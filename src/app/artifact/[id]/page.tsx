import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTIFACTS } from "@/lib/lexicon";
import { findArtifact } from "@/lib/lexicon/compile";
import { Atmosphere, Nav } from "@/components/chrome";
import { ArtifactDetail } from "@/components/lexicon/artifact-detail";

export function generateStaticParams() {
  return ARTIFACTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = findArtifact(id);
  if (!a) return {};
  return { title: `${a.name} — ${a.industry} artifact`, description: a.blurb };
}

export default async function ArtifactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artifact = findArtifact(id);
  if (!artifact) notFound();
  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <Nav />
      <div className="relative z-10">
        <ArtifactDetail artifact={artifact} />
      </div>
    </main>
  );
}
