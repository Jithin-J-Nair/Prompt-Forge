import type { Metadata } from "next";
import { Nav, Footer, Atmosphere, SectionLabel } from "@/components/chrome";
import { LibraryView } from "@/components/library-view";

export const metadata: Metadata = {
  title: "Library — Every spec ever forged",
  description:
    "The living ledger of enhanced prompts: brand names, industries, word counts and permanent links.",
};

export default function LibraryPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1200px] px-5 pt-16 pb-24 md:px-8 md:pt-20">
        <header className="mb-10 md:mb-14">
          <SectionLabel>Library</SectionLabel>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] md:text-6xl">
            Every spec, on record.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70">
            Each forged prompt is filed with its minted brand, industry verdict, and full mega
            prompt — permanent links included.
          </p>
        </header>
        <LibraryView />
      </main>
      <Footer />
    </>
  );
}
