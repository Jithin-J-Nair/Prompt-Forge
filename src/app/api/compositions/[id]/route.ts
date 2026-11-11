import { NextResponse } from "next/server";
import { deleteComposition, getComposition } from "@/lib/studio/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const composition = await getComposition(id);
  if (!composition) {
    return NextResponse.json({ error: "Composition not found." }, { status: 404 });
  }
  return NextResponse.json({ composition });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const ok = await deleteComposition(id);
  if (!ok) {
    return NextResponse.json({ error: "Composition not found." }, { status: 404 });
  }
  return NextResponse.json({ deleted: id });
}
