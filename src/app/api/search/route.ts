import { NextResponse } from "next/server";
import { searchModules, distinctTags } from "@/lib/studio";
import type { SearchFilters } from "@/lib/studio";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filters: SearchFilters = {};
  const cat = url.searchParams.get("category");
  if (cat) filters.category = cat as SearchFilters["category"];
  const sub = url.searchParams.get("subcategory");
  if (sub) filters.subcategory = sub;
  const diff = url.searchParams.get("difficulty");
  if (diff) filters.difficulty = diff as SearchFilters["difficulty"];
  const perf = url.searchParams.get("perf");
  if (perf) filters.perf = perf as SearchFilters["perf"];
  const dim = url.searchParams.get("dimension");
  if (dim) filters.dimension = dim as SearchFilters["dimension"];
  if (url.searchParams.get("tunable") === "1") filters.tunable = true;
  if (url.searchParams.get("hasDemo") === "1") filters.hasDemo = true;

  const q = url.searchParams.get("q") ?? "";
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit")) || 120));
  const results = searchModules(q, filters).slice(0, limit).map((r) => ({
    score: r.score,
    where: r.where,
    module: {
      id: r.module.id,
      name: r.module.name,
      tagline: r.module.tagline,
      description: r.module.description,
      category: r.module.category,
      subcategory: r.module.subcategory,
      tags: r.module.tags,
      difficulty: r.module.difficulty,
      perf: r.module.perf,
      dimension: r.module.dimension,
      interactivity: r.module.interactivity,
      demo: r.module.demo ?? null,
      paramCount: r.module.params.length,
    },
  }));
  return NextResponse.json({ query: q, count: results.length, results, tags: distinctTags() });
}
