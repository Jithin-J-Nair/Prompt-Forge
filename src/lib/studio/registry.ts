import type { CategoryId, PromptModule } from "./schema";
import { CATEGORIES } from "./categories";
import { WEBSITE_MODULES } from "./modules/websites";
import { DIRECTION_MODULES } from "./modules/direction";
import { LAYOUT_MODULES } from "./modules/layout";
import { TYPOGRAPHY_MODULES } from "./modules/typography";
import { COLOR_MODULES } from "./modules/color";
import { MOTION_MODULES } from "./modules/motion";
import { MATH_MODULES } from "./modules/math";
import { WEBGL_MODULES } from "./modules/webgl";
import { BACKGROUND_MODULES } from "./modules/backgrounds";
import { INTERACTION_MODULES } from "./modules/interaction";
import { ENGINEERING_MODULES } from "./modules/engineering";
import { resolvePreview } from "./previews";

/* ------------------------------------------------------------------ */
/*  Module registry — the single source of truth for the knowledge      */
/*  base. Validates content at import time (fails tests, not users).    */
/* ------------------------------------------------------------------ */

export const MODULES: readonly PromptModule[] = [
  ...WEBSITE_MODULES,
  ...DIRECTION_MODULES,
  ...LAYOUT_MODULES,
  ...TYPOGRAPHY_MODULES,
  ...COLOR_MODULES,
  ...MOTION_MODULES,
  ...MATH_MODULES,
  ...WEBGL_MODULES,
  ...BACKGROUND_MODULES,
  ...INTERACTION_MODULES,
  ...ENGINEERING_MODULES,
];

export const MODULE_MAP: ReadonlyMap<string, PromptModule> = new Map(
  MODULES.map((m) => [m.id, m]),
);

export function getModule(id: string): PromptModule | undefined {
  return MODULE_MAP.get(id);
}

export function modulesByCategory(cat: CategoryId): PromptModule[] {
  return MODULES.filter((m) => m.category === cat);
}

export function modulesBySubcategory(cat: CategoryId, sub: string): PromptModule[] {
  return MODULES.filter((m) => m.category === cat && m.subcategory === sub);
}

export function subcategoryCounts(cat: CategoryId): Map<string, number> {
  const out = new Map<string, number>();
  for (const m of MODULES) {
    if (m.category !== cat) continue;
    out.set(m.subcategory, (out.get(m.subcategory) ?? 0) + 1);
  }
  return out;
}

/* ---------------- developer-time content validation ---------------- */

export interface RegistryIssue {
  level: "error" | "warn";
  module?: string;
  message: string;
}

export function validateRegistry(): RegistryIssue[] {
  const issues: RegistryIssue[] = [];
  const seen = new Set<string>();
  const categoryIds = new Set(CATEGORIES.map((c) => c.id));
  const subcategoryIds = new Map(CATEGORIES.map((c) => [c.id, new Set(c.subcategories.map((s) => s.id))]));

  for (const m of MODULES) {
    if (seen.has(m.id)) issues.push({ level: "error", module: m.id, message: "Duplicate module id" });
    seen.add(m.id);

    if (!m.id.startsWith(`${m.category}/`))
      issues.push({ level: "error", module: m.id, message: `Id '${m.id}' must be prefixed by category '${m.category}/'` });
    if (!categoryIds.has(m.category))
      issues.push({ level: "error", module: m.id, message: `Unknown category '${m.category}'` });
    const subs = subcategoryIds.get(m.category);
    if (subs && !subs.has(m.subcategory))
      issues.push({ level: "error", module: m.id, message: `Unknown subcategory '${m.subcategory}' in ${m.category}` });

    if (!m.name?.trim() || !m.tagline?.trim() || !m.description?.trim())
      issues.push({ level: "error", module: m.id, message: "name/tagline/description must be non-empty" });
    if (m.description.length < 40)
      issues.push({ level: "warn", module: m.id, message: "description is very short (< 40 chars)" });
    if (!m.prompt?.trim() || m.prompt.length < 60)
      issues.push({ level: "error", module: m.id, message: "prompt fragment too short (< 60 chars) — placeholder content is not allowed" });

    // every {token} in prompt must have a matching param
    const tokens = [...m.prompt.matchAll(/\{(\w+)\}/g)].map((t) => t[1]);
    const paramKeys = new Set(m.params.map((p) => p.key));
    for (const t of tokens)
      if (!paramKeys.has(t))
        issues.push({ level: "error", module: m.id, message: `prompt token {${t}} has no matching param definition` });
    // each param key unique
    const pkeys = new Set<string>();
    for (const p of m.params) {
      if (pkeys.has(p.key)) issues.push({ level: "error", module: m.id, message: `duplicate param key '${p.key}'` });
      pkeys.add(p.key);
      if (p.type === "select" && p.options && typeof p.default === "string") {
        if (!p.options.some((o) => o.value === p.default))
          issues.push({ level: "error", module: m.id, message: `param '${p.key}' default '${String(p.default)}' not in options` });
      }
      if ((p.type === "range" || p.type === "number") && typeof p.default === "number" && p.min !== undefined && p.max !== undefined) {
        if (p.default < p.min || p.default > p.max)
          issues.push({ level: "error", module: m.id, message: `param '${p.key}' default out of range` });
      }
    }
    // conflicts resolve to real modules
    for (const c of m.conflicts ?? []) {
      if (!MODULE_MAP.has(c.id))
        issues.push({ level: "error", module: m.id, message: `conflict target '${c.id}' does not exist` });
      if (!c.reason?.trim())
        issues.push({ level: "error", module: m.id, message: `conflict against '${c.id}' lacks a reason` });
    }
    for (const s of m.suggests ?? [])
      if (!MODULE_MAP.has(s))
        issues.push({ level: "error", module: m.id, message: `suggestion '${s}' does not exist` });
  }

  // 100% live-preview coverage: every module must resolve a preview
  for (const m of MODULES) {
    if (!resolvePreview(m))
      issues.push({ level: "error", module: m.id, message: "no live preview resolves for this module" });
  }
  return issues;
}

export const REGISTRY_STATS = {
  modules: MODULES.length,
  categories: CATEGORIES.length,
  demos: MODULES.filter((m) => m.demo).length,
  withParams: MODULES.filter((m) => m.params.length > 0).length,
};
