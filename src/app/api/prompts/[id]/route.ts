import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { prompts } from "@/db/schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const num = Number(id);
  if (!Number.isInteger(num)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  try {
    const [row] = await db.select().from(prompts).where(eq(prompts.id, num)).limit(1);
    if (!row) return NextResponse.json({ error: "Spec not found." }, { status: 404 });
    return NextResponse.json({ prompt: row });
  } catch (err) {
    console.error("get prompt failed", err);
    return NextResponse.json({ error: "Could not load the spec." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const num = Number(id);
  if (!Number.isInteger(num)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  try {
    const [row] = await db
      .delete(prompts)
      .where(eq(prompts.id, num))
      .returning({ id: prompts.id });
    if (!row) return NextResponse.json({ error: "Spec not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete prompt failed", err);
    return NextResponse.json({ error: "Could not delete the spec." }, { status: 500 });
  }
}
