import { NextResponse } from "next/server";
import { CATEGORIES, MODULES, REGISTRY_STATS } from "@/lib/studio";
import type { PromptModule } from "@/lib/studio";

export const dynamic = "force-dynamic";

/** Catalog entry: everything except the long composition strings. */
function summarize(m: PromptModule) {
  return {
    id: m.id,
    name: m.name,
    tagline: m.tagline,
    description: m.description,
    category: m.category,
    subcategory: m.subcategory,
    tags: m.tags,
    aliases: m.aliases ?? [],
    difficulty: m.difficulty,
    perf: m.perf,
    dimension: m.dimension,
    interactivity: m.interactivity,
    demo: m.demo ?? null,
    stack: m.stack,
    paramDefs: m.params.map((p) => ({
      key: p.key,
      label: p.label,
      type: p.type,
      default: p.default,
      min: p.min,
      max: p.max,
      step: p.step,
      unit: p.unit,
      options: p.options,
      help: p.help,
    })),
    conflicts: (m.conflicts ?? []).map((c) => ({ id: c.id, reason: c.reason })),
    suggests: m.suggests ?? [],
    version: m.version,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const full = url.searchParams.get("full") === "1";

  return NextResponse.json({
    categories: CATEGORIES,
    modules: MODULES.map((m) => (full ? m : summarize(m))),
    stats: REGISTRY_STATS,
  });
}
