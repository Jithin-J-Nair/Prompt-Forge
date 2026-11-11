import { NextResponse } from "next/server";
import { getModule } from "@/lib/studio";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string[] }> },
) {
  const parts = (await ctx.params).id;
  const decoded = decodeURIComponent(parts.join("/"));
  const mod = getModule(decoded);
  if (!mod) {
    return NextResponse.json({ error: `Unknown module '${decoded}'.` }, { status: 404 });
  }
  return NextResponse.json({ module: mod });
}
