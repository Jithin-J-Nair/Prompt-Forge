import { NextResponse } from "next/server";
import { EXAMPLE_PROMPTS } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ templates: EXAMPLE_PROMPTS });
}
