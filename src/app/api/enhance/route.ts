import { NextResponse } from "next/server";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { enhancePrompt } from "@/lib/engine/enhancer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { prompt?: string } | null;
    const prompt = body?.prompt?.trim();

    if (!prompt || prompt.length < 3) {
      return NextResponse.json(
        { error: "Give the forge at least 3 characters to work with." },
        { status: 400 },
      );
    }
    if (prompt.length > 400) {
      return NextResponse.json(
        { error: "Keep the raw brief under 400 characters. Lazy is the point." },
        { status: 400 },
      );
    }

    const spec = enhancePrompt(prompt);

    const [row] = await db
      .insert(prompts)
      .values({
        rawPrompt: spec.rawPrompt,
        title: spec.title,
        industry: spec.industry,
        industryId: spec.industryId,
        brandName: spec.brand.name,
        spec: spec as unknown as Record<string, unknown>,
        megaPrompt: spec.megaPrompt,
        wordCount: spec.stats.words,
      })
      .returning({ id: prompts.id, createdAt: prompts.createdAt });

    return NextResponse.json({ id: row.id, createdAt: row.createdAt, spec });
  } catch (err) {
    console.error("enhance failed", err);
    return NextResponse.json(
      { error: "The forge cracked. Try again in a moment." },
      { status: 500 },
    );
  }
}
