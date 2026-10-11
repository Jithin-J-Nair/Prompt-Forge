import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { prompts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 24) || 24, 50);

    const rows = await db
      .select({
        id: prompts.id,
        rawPrompt: prompts.rawPrompt,
        title: prompts.title,
        industry: prompts.industry,
        industryId: prompts.industryId,
        brandName: prompts.brandName,
        wordCount: prompts.wordCount,
        createdAt: prompts.createdAt,
      })
      .from(prompts)
      .orderBy(desc(prompts.createdAt))
      .limit(limit);

    const [agg] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(prompts);

    return NextResponse.json({ prompts: rows, total: agg?.total ?? rows.length });
  } catch (err) {
    console.error("list prompts failed", err);
    return NextResponse.json({ error: "Could not load the forge ledger." }, { status: 500 });
  }
}
