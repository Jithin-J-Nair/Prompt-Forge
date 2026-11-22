import { NextResponse } from "next/server";
import {
  buildAgentHandoffManifest,
  buildAgentHandoffMarkdown,
  buildCookPrompt,
} from "@/lib/skillforge/handoff";
import type { CompositionPreview } from "@/lib/skillforge/types";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCompositionPreview(value: unknown): value is CompositionPreview {
  return (
    isRecord(value) &&
    typeof value.categoryKey === "string" &&
    typeof value.brief === "string" &&
    typeof value.exportMarkdown === "string" &&
    typeof value.graphHash === "string" &&
    typeof value.catalogVersion === "string" &&
    typeof value.accepted === "boolean" &&
    Array.isArray(value.artifactPreviews)
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "The request body must be valid JSON." } },
      { status: 400 },
    );
  }

  const preview = isRecord(body) ? body.preview : null;
  if (!isCompositionPreview(preview)) {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Provide a composition preview." } },
      { status: 400 },
    );
  }

  const manifest = buildAgentHandoffManifest(preview);
  const markdown = buildAgentHandoffMarkdown(preview, manifest);
  const cookPrompt = buildCookPrompt(preview);
  return NextResponse.json(
    { manifest, markdown, cookPrompt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
