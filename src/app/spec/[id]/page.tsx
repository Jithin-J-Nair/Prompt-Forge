import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Flame } from "lucide-react";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import type { EnhancedSpec } from "@/lib/engine/enhancer";
import { Nav, Footer, Atmosphere, SectionLabel } from "@/components/chrome";
import { SpecRenderer } from "@/components/spec-renderer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const num = Number(id);
  if (!Number.isInteger(num)) return null;
  const [row] = await db.select().from(prompts).where(eq(prompts.id, num)).limit(1);
  return row ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const row = await load(id);
  if (!row) return { title: "Spec not found" };
  return {
    title: `${row.brandName} — ${row.industry} Build Spec`,
    description: `A ${row.wordCount.toLocaleString()}-word mega prompt forged from “${row.rawPrompt}”.`,
  };
}

export default async function SpecPage({ params }: Props) {
  const { id } = await params;
  const row = await load(id);
  if (!row) notFound();

  const spec = row.spec as unknown as EnhancedSpec;

  return (
    <>
      <Atmosphere />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1120px] px-4 pt-16 pb-24 md:px-8 md:pt-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/library" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="size-4" />
            Back to library
          </Link>
          <Link href="/forge" className="btn btn-primary btn-sm gap-2">
            <Flame className="size-3.5" />
            Forge another
          </Link>
        </div>
        <SectionLabel>Permanent record · #{String(row.id).padStart(4, "0")}</SectionLabel>
        <SpecRenderer spec={spec} createdAt={row.createdAt} />
      </main>
      <Footer />
    </>
  );
}
