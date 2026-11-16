import { NextResponse } from "next/server";
import {
  CompositionInputError,
  composeProjectPreview,
} from "@/lib/skillforge/composer";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: { code: "unsupported_media_type", message: "Send a JSON request body." } },
      { status: 415 },
    );
  }

  const bodyText = await request.text();
  if (bodyText.length > 8_192) {
    return NextResponse.json(
      { error: { code: "request_too_large", message: "Keep the request under 8 KB." } },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "The request body must be valid JSON." } },
      { status: 400 },
    );
  }

  if (
    !isRecord(body) ||
    typeof body.categoryKey !== "string" ||
    typeof body.brief !== "string"
  ) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_request",
          message: "Provide a categoryKey and a brief as strings.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const preview = composeProjectPreview({
      categoryKey: body.categoryKey,
      brief: body.brief,
    });
    return NextResponse.json(preview, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof CompositionInputError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode },
      );
    }
    throw error;
  }
}
