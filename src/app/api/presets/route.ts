import { NextResponse } from "next/server";
import { PRESETS } from "@/lib/studio";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    presets: PRESETS.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      hue: p.hue,
      recommendedFor: p.recommendedFor,
      brief: p.brief,
      moduleIds: p.selections.map((s) => s.id),
      count: p.selections.length,
    })),
  });
}
