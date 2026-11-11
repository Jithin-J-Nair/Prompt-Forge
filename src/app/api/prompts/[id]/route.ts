import { NextResponse } from "next/server";
import { deleteSpec, getSpec } from "@/lib/engine/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9_]+$/i.test(id) || id.length > 64) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  try {
    const row = await getSpec(id);
    if (!row) return NextResponse.json({ error: "Spec not found." }, { status: 404 });
    return NextResponse.json({ prompt: row });
  } catch (err) {
    console.error("get prompt failed", err);
    return NextResponse.json({ error: "Could not load the spec." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9_]+$/i.test(id) || id.length > 64) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  try {
    const ok = await deleteSpec(id);
    if (!ok) return NextResponse.json({ error: "Spec not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete prompt failed", err);
    return NextResponse.json({ error: "Could not delete the spec." }, { status: 500 });
  }
}
