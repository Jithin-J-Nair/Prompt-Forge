import type { Metadata } from "next";
import { Nav, Footer, Atmosphere } from "@/components/chrome";
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
        <LibraryView />
      </main>
      <Footer />
    </>
  );
}
