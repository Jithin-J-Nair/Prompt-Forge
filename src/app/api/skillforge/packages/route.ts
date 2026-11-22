import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { skillforgePackages } from "@/db/schema";
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
    (value.previewStatus === "draft" || value.previewStatus === "accepted")
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "12") || 12, 50);

  try {
    const rows = await db
      .select({
        id: skillforgePackages.id,
        title: skillforgePackages.title,
        brief: skillforgePackages.brief,
        categoryKey: skillforgePackages.categoryKey,
        categoryLabel: skillforgePackages.categoryLabel,
        accepted: skillforgePackages.accepted,
        previewStatus: skillforgePackages.previewStatus,
        graphHash: skillforgePackages.graphHash,
        catalogVersion: skillforgePackages.catalogVersion,
        createdAt: skillforgePackages.createdAt,
      })
      .from(skillforgePackages)
      .orderBy(desc(skillforgePackages.createdAt))
      .limit(limit);

    return NextResponse.json(
      { packages: rows, total: rows.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("skillforge packages list failed", error);
    return NextResponse.json(
      { error: { code: "persistence_unavailable", message: "Could not list saved packages." } },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: { code: "unsupported_media_type", message: "Send a JSON request body." } },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "The request body must be valid JSON." } },
      { status: 400 },
    );
  }

  if (!isRecord(body) || !isCompositionPreview(body.preview)) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_request",
          message: "Provide a CompositionPreview under preview.",
        },
      },
      { status: 400 },
    );
  }

  const preview = body.preview;
  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 240)
      : preview.brief.slice(0, 80);

  try {
    const [row] = await db
      .insert(skillforgePackages)
      .values({
        title,
        brief: preview.brief,
        categoryKey: preview.categoryKey,
        categoryLabel: preview.categoryLabel,
        accepted: preview.accepted,
        previewStatus: preview.previewStatus,
        graphHash: preview.graphHash,
        catalogVersion: preview.catalogVersion,
        exportMarkdown: preview.exportMarkdown,
        preview,
      })
      .returning({
        id: skillforgePackages.id,
        createdAt: skillforgePackages.createdAt,
        title: skillforgePackages.title,
        accepted: skillforgePackages.accepted,
        categoryKey: skillforgePackages.categoryKey,
      });

    return NextResponse.json(
      { id: row.id, createdAt: row.createdAt, title: row.title, accepted: row.accepted, categoryKey: row.categoryKey },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("skillforge package save failed", error);
    return NextResponse.json(
      {
        error: {
          code: "persistence_unavailable",
          message: "Could not save package. Browser save still works.",
        },
      },
      { status: 503 },
    );
  }
}
