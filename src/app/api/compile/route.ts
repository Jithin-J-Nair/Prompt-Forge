import { NextResponse } from "next/server";
import { compile, type CompileInput } from "@/lib/studio";

export const dynamic = "force-dynamic";

const MAX_SELECTIONS = 80;
const MAX_CHARS = 4_000;

export async function POST(req: Request) {
  let body: Partial<CompileInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const selections = Array.isArray(body.selections) ? body.selections : [];
  if (selections.length > MAX_SELECTIONS) {
    return NextResponse.json(
      { error: `Too many selections (max ${MAX_SELECTIONS}).` },
      { status: 413 },
    );
  }

  const input: CompileInput = {
    projectName: typeof body.projectName === "string" ? body.projectName.slice(0, 160) : undefined,
    brief: typeof body.brief === "string" ? body.brief.slice(0, 2_000) : undefined,
    audience: typeof body.audience === "string" ? body.audience.slice(0, 240) : undefined,
    stackNote: typeof body.stackNote === "string" ? body.stackNote.slice(0, 500) : undefined,
    selections: selections
      .filter((s) => s && typeof s.id === "string")
      .map((s) => ({
        id: String(s.id).slice(0, 80),
        params:
          s.params && typeof s.params === "object"
            ? Object.fromEntries(
                Object.entries(s.params).map(([k, v]) => [
                  String(k).slice(0, 40),
                  typeof v === "string" ? v.slice(0, MAX_CHARS) : v,
                ]),
              )
            : undefined,
      })),
  };

  const output = compile(input);
  return NextResponse.json(output);
}
