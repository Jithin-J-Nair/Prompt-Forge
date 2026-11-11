import { NextResponse } from "next/server";
import { enhancePrompt } from "@/lib/engine/enhancer";
import { saveSpec } from "@/lib/engine/store";

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
    // persistence is best-effort: without DATABASE_URL the spec is kept in the
    // process ledger so the forge never cracks just because a DB is missing
    const record = await saveSpec(spec);

    return NextResponse.json({
      id: record.id,
      createdAt: record.createdAt,
      persisted: record.persisted,
      spec,
    });
  } catch (err) {
    console.error("enhance failed", err);
    return NextResponse.json(
      { error: "The forge cracked. Try again in a moment." },
      { status: 500 },
    );
  }
}
