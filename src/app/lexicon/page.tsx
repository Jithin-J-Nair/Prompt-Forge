import type { Metadata } from "next";
import { Atmosphere, Nav } from "@/components/chrome";
import { LexiconWall } from "@/components/lexicon/wall";
import { NebulaField } from "@/components/nebula";

export const metadata: Metadata = {
  title: "Lexicon — every prompt keyword, clickable",
  description:
    "The complete prompt-engineering vocabulary as individual, stackable chips. Motion, math, layout, type, color, 3D — click to stack, compile to v0, Cursor, Claude or a raw spec.",
};

export default function LexiconPage() {
  return (
    <main id="main-content" className="relative min-h-screen">
      <Atmosphere />
      <Nav />
      <NebulaField className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh] w-full opacity-60 [mask-image:linear-gradient(to_bottom,black_20%,transparent_95%)]" />
      <div className="relative z-10">
        <LexiconWall />
      </div>
    </main>
  );
}
