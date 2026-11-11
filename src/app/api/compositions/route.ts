import { NextResponse } from "next/server";
import { listCompositions, saveComposition } from "@/lib/studio/storage";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit")) || 50;
  const items = await listCompositions(limit);
  // list view omits the heavy compiled body
  return NextResponse.json({
    compositions: items.map(({ compiled: _compiled, ...rest }) => rest),
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.slice(0, 160) : "";
  const brief = typeof body.brief === "string" ? body.brief.slice(0, 2_000) : "";
  const compiled = typeof body.compiled === "string" ? body.compiled.slice(0, 120_000) : "";
  const selections = Array.isArray(body.selections) ? body.selections : [];
  if (!compiled || selections.length === 0) {
    return NextResponse.json(
      { error: "A composition needs selections and the compiled prompt." },
      { status: 400 },
    );
  }
  const saved = await saveComposition({ name, brief, selections, compiled });
  return NextResponse.json({ composition: saved }, { status: 201 });
}
