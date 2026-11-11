import { NextResponse } from "next/server";
import { getPreset } from "@/lib/studio";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const preset = getPreset(id);
  if (!preset) {
    return NextResponse.json({ error: `Unknown preset '${id}'.` }, { status: 404 });
  }
  return NextResponse.json({ preset });
}
