import type { Metadata } from "next";
import { Atmosphere, Nav } from "@/components/chrome";
import { LexiconWall } from "@/components/lexicon/wall";

export const metadata: Metadata = {
  title: "Lexicon — every prompt keyword, clickable",
  description:
    "The complete prompt-engineering vocabulary as individual, stackable chips. Motion, math, layout, type, color, 3D — click to stack, compile to v0, Cursor, Claude or a raw spec.",
};

export default function LexiconPage() {
  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <Nav />
      <div className="relative z-10">
        <LexiconWall />
      </div>
    </main>
  );
}
