import type { Metadata } from "next";
import { Nav, Footer, Atmosphere, Eyebrow } from "@/components/chrome";
import { LibraryView } from "@/components/library-view";

export const metadata: Metadata = {
  title: "Library — Every spec ever forged",
  description:
    "The living ledger of enhanced prompts: brand names, industries, word counts and permanent links to every mega prompt the forge has produced.",
};

export default function LibraryPage() {
  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1280px] px-6 pt-32 pb-24 md:px-10 md:pt-40">
        <header className="mb-12 md:mb-16">
          <Eyebrow>The ledger · persisted in postgres</Eyebrow>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.98] font-bold tracking-tight uppercase md:text-7xl">
            Every spec, <span className="text-gradient-ember">on record.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-fog">
            Each forged prompt is filed with its minted brand, industry verdict
            and full mega prompt — permanent links included.
          </p>
        </header>
        <LibraryView />
      </main>
      <Footer />
    </>
  );
}
