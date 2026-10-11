import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Flame } from "lucide-react";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import type { EnhancedSpec } from "@/lib/engine/enhancer";
import { Nav, Footer, Atmosphere, Eyebrow } from "@/components/chrome";
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
    description: `A ${row.wordCount.toLocaleString()}-word mega prompt forged from “${row.rawPrompt}”. Brand identity, design system, page blueprints, components, motion, SEO and backend.`,
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
      <main className="relative z-10 mx-auto max-w-[1280px] px-6 pt-32 pb-24 md:px-10 md:pt-40">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-fog uppercase transition-colors hover:text-ember"
          >
            <ArrowLeft className="size-4" />
            Back to library
          </Link>
          <Link
            href="/forge"
            className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-flare"
          >
            <Flame className="size-3.5" />
            Forge another
          </Link>
        </div>
        <Eyebrow>Permanent record · #{String(row.id).padStart(4, "0")}</Eyebrow>
        <SpecRenderer spec={spec} createdAt={row.createdAt} />
      </main>
      <Footer />
    </>
  );
}
