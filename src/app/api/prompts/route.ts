import { NextResponse } from "next/server";
import { countDbSpecs, listSpecs } from "@/lib/engine/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 24) || 24, 50);

    const items = await listSpecs(limit);
    const dbTotal = await countDbSpecs();

    return NextResponse.json({
      prompts: items.map((r) => ({
        id: r.id,
        rawPrompt: r.rawPrompt,
        title: r.title,
        industry: r.industry,
        industryId: r.industryId,
        brandName: r.brandName,
        wordCount: r.wordCount,
        createdAt: r.createdAt,
        persisted: r.persisted,
      })),
      total: (dbTotal ?? 0) + items.filter((i) => i.persisted === "memory").length,
    });
  } catch (err) {
    console.error("list prompts failed", err);
    return NextResponse.json({ error: "Could not load the forge ledger." }, { status: 500 });
  }
}
