import type { CategoryId, Difficulty, Dimension, PerfClass, PromptModule } from "./schema";
import { MODULES } from "./registry";
import { CATEGORY_MAP } from "./categories";

/* ------------------------------------------------------------------ */
/*  Search — tokenized index with field weighting, synonyms and         */
/*  structured filters. Pure functions: identical on server + client.   */
/* ------------------------------------------------------------------ */

export interface SearchFilters {
  category?: CategoryId | "all";
  subcategory?: string | "all";
  difficulty?: Difficulty | "all";
  perf?: PerfClass | "all";
  dimension?: Dimension | "all";
  /** match modules that have at least one of these interactivity tags */
  interactivity?: string | "all";
  /** only modules with tunable parameters */
  tunable?: boolean;
  /** only modules with a live demo */
  hasDemo?: boolean;
}

export interface SearchResult {
  module: PromptModule;
  score: number;
  where: string[]; // fields that matched (for explanation)
}

/* tiny domain synonym map — extends aliases declared on modules */
const SYNONYMS: Record<string, string[]> = {
  glow: ["bloom", "neon", "emissive"],
  blur: ["frost", "defocus", "soft"],
  animate: ["motion", "animated", "kinetic"],
  "3d": ["three", "webgl", "mesh", "scene"],
  lines: ["stroke", "path", "draw"],
  dots: ["particles", "points", "halftone"],
  wave: ["sine", "ocean", "undulation", "ripple"],
  melt: ["liquid", "goo", "blob"],
  futuristic: ["sci-fi", "futurism", "tech"],
  retro: ["vintage", "y2k", "vaporwave", "brutalist"],
  typing: ["scramble", "typewriter", "decode"],
  hover: ["pointer", "cursor", "mouse"],
  gradient: ["mesh", "aurora", "conic", "linear"],
  chaos: ["attractor", "lorenz", "fractal"],
  organic: ["blob", "biomorphic", "natural", "liquid"],
  grid: ["layout", "columns", "swiss", "modular"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/[\s\-]+/)
    .filter((t) => t.length > 1);
}

interface IndexedModule {
  m: PromptModule;
  name: Set<string>;
  alias: Set<string>;
  tags: Set<string>;
  body: Set<string>;
  stack: Set<string>;
  subName: string;
  catName: string;
}

let INDEX: IndexedModule[] | null = null;

function buildIndex(): IndexedModule[] {
  if (INDEX) return INDEX;
  INDEX = MODULES.map((m) => {
    const cat = CATEGORY_MAP.get(m.category);
    return {
      m,
      name: new Set(tokenize(m.name)),
      alias: new Set((m.aliases ?? []).flatMap(tokenize)),
      tags: new Set(m.tags.flatMap(tokenize)),
      body: new Set([m.tagline, m.description, m.prompt].flatMap(tokenize)),
      stack: new Set(m.stack.flatMap(tokenize)),
      subName: cat?.subcategories.find((s) => s.id === m.subcategory)?.name.toLowerCase() ?? "",
      catName: cat?.name.toLowerCase() ?? "",
    };
  });
  return INDEX;
}

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) {
    for (const s of SYNONYMS[t] ?? []) out.add(s);
  }
  // prefix tolerance: allow 'paral' to hit 'parallax' lazily via startsWith pass below
  return [...out];
}

export function searchModules(query: string, filters: SearchFilters = {}): SearchResult[] {
  const index = buildIndex();
  const qTokens = expand(tokenize(query));

  const results: SearchResult[] = [];
  for (const row of index) {
    const { m } = row;
    // structured filters first (cheap)
    if (filters.category && filters.category !== "all" && m.category !== filters.category) continue;
    if (filters.subcategory && filters.subcategory !== "all" && m.subcategory !== filters.subcategory) continue;
    if (filters.difficulty && filters.difficulty !== "all" && m.difficulty !== filters.difficulty) continue;
    if (filters.perf && filters.perf !== "all" && m.perf !== filters.perf) continue;
    if (filters.dimension && filters.dimension !== "all" && m.dimension !== filters.dimension) continue;
    if (filters.interactivity && filters.interactivity !== "all" && !m.interactivity.includes(filters.interactivity as never)) continue;
    if (filters.tunable && m.params.length === 0) continue;
    if (filters.hasDemo && !m.demo) continue;

    if (qTokens.length === 0) {
      results.push({ module: m, score: 0, where: [] });
      continue;
    }

    let score = 0;
    const where = new Set<string>();
    for (const t of qTokens) {
      let hit = false;
      if (row.name.has(t)) { score += 10; where.add("name"); hit = true; }
      else if ([...row.name].some((n) => n.startsWith(t) && t.length >= 4)) { score += 6; where.add("name"); hit = true; }
      if (row.alias.has(t)) { score += 9; where.add("alias"); hit = true; }
      if (row.tags.has(t)) { score += 7; where.add("tag"); hit = true; }
      else if ([...row.tags].some((g) => g.startsWith(t) && t.length >= 4)) { score += 4; where.add("tag"); hit = true; }
      if (row.subName.includes(t) || row.catName.includes(t)) { score += 3; where.add("category"); hit = true; }
      if (row.stack.has(t)) { score += 4; where.add("stack"); hit = true; }
      if (row.body.has(t)) { score += 2; where.add("description"); hit = true; }
      else if (t.length >= 4 && [...row.body].some((b) => b.startsWith(t))) { score += 1; where.add("description"); hit = true; }
      if (!hit) {
        // token miss is a soft penalty, not elimination — or-ish for exploration
        score -= 1.5;
      }
    }
    if (score > 0) results.push({ module: m, score, where: [...where] });
  }

  results.sort((a, b) => b.score - a.score || a.module.name.localeCompare(b.module.name));
  return results;
}

/** all values of a field for filter menus */
export function distinctTags(): string[] {
  const s = new Set<string>();
  for (const m of MODULES) m.tags.forEach((t) => s.add(t));
  return [...s].sort();
}
