import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { skillforgePackages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json(
      { error: { code: "invalid_id", message: "Package id must be a positive integer." } },
      { status: 400 },
    );
  }

  try {
    const [row] = await db
      .select()
      .from(skillforgePackages)
      .where(eq(skillforgePackages.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json(
        { error: { code: "not_found", message: "Package not found." } },
        { status: 404 },
      );
    }

    return NextResponse.json(row, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("skillforge package get failed", error);
    return NextResponse.json(
      { error: { code: "persistence_unavailable", message: "Could not load package." } },
      { status: 503 },
    );
  }
}
