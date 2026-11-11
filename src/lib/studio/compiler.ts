import type { CategoryId, ParamDef, ParamValues, PromptModule } from "./schema";
import { CATEGORY_MAP, CATEGORIES } from "./categories";
import { getModule } from "./registry";

/* ------------------------------------------------------------------ */
/*  PromptForge compilation engine.                                     */
/*  Structured selections → coherent, implementation-ready brief.       */
/*  Pure and UI-independent: identical output on server and client.     */
/* ------------------------------------------------------------------ */

export interface SelectionInput {
  id: string;
  params?: ParamValues;
}

export type CompileDepth = "standard" | "detailed" | "extreme";

export interface CompileInput {
  projectName?: string;
  brief?: string;
  selections: SelectionInput[];
  audience?: string;
  /** free-text stack target — defaults to the repo's stack */
  stackNote?: string;
  /**
   * Output depth. standard = lean prompt fragments only; detailed = adds
   * implementation + a11y/responsive/fallback lines (default, current behaviour);
   * extreme = additionally renders module.extreme (technical precision: visual/motion/
   * graphics/architecture/quality contracts) and an architecture ordering note.
   */
  depth?: CompileDepth;
}

export interface ResolvedSelection {
  module: PromptModule;
  params: ParamValues; // fully resolved (defaults + validated overrides)
}

export interface CompileConflict {
  aId: string;
  bId: string;
  reason: string;
}

export interface CompileWarning {
  kind: "heavy" | "coverage" | "unknown" | "suggestion";
  message: string;
}

export interface CompiledSection {
  id: string;
  number: number;
  title: string;
  items: { id: string; heading: string; body: string; meta: string[] }[];
}

export interface CompileOutput {
  sections: CompiledSection[];
  conflicts: CompileConflict[];
  warnings: CompileWarning[];
  suggestions: { when: string; add: string[] }[];
  resolved: ResolvedSelection[];
  unknownIds: string[];
  stats: { modules: number; words: number; heavy: number; withDemo: number };
  markdown: string;
  text: string;
  json: CompiledJson;
}

export interface CompiledJson {
  project: { name: string; brief: string; audience: string | null };
  generatedAt: string;
  version: 1;
  sections: {
    id: string;
    title: string;
    items: { moduleId: string; name: string; prompt: string; params: ParamValues }[];
  }[];
  conflicts: CompileConflict[];
  warnings: CompileWarning[];
}

/* ---------------- step 1+2 · resolve + validate params ---------------- */

function resolveParam(def: ParamDef, raw: ParamValueLike): string | number | boolean {
  if (raw === undefined || raw === null) return def.default;
  switch (def.type) {
    case "range":
    case "number": {
      const v = Number(raw);
      if (!Number.isFinite(v)) return def.default;
      const min = def.min ?? -Infinity;
      const max = def.max ?? Infinity;
      return Math.min(max, Math.max(min, v));
    }
    case "select": {
      const s = String(raw);
      if (def.options?.some((o) => o.value === s)) return s;
      return def.default; // invalid selection falls back to default, never crashes
    }
    case "boolean":
      return typeof raw === "boolean" ? raw : raw === "true";
    case "text":
      return String(raw).slice(0, 200);
    default:
      return def.default;
  }
}
type ParamValueLike = string | number | boolean | undefined;

/** defaults+validated overrides for ONE module — the single resolver used by
 *  compiler, preview surfaces, API compile, and tests. */
export function resolveParams(module: PromptModule, overrides: ParamValues): ParamValues {
  const params: ParamValues = {};
  for (const def of module.params) {
    params[def.key] = resolveParam(def, overrides?.[def.key] as ParamValueLike);
  }
  return params;
}

export function resolveSelections(input: SelectionInput[]): {
  resolved: ResolvedSelection[];
  unknownIds: string[];
} {
  const resolved: ResolvedSelection[] = [];
  const unknownIds: string[] = [];
  const seen = new Set<string>();
  for (const sel of input) {
    const id = sel.id;
    if (seen.has(id)) continue; // duplicates never double-compile
    seen.add(id);
    const mod = getModule(id);
    if (!mod) {
      unknownIds.push(id);
      continue;
    }
    resolved.push({ module: mod, params: resolveParams(mod, sel.params ?? {}) });
  }
  return { resolved, unknownIds };
}

/* ---------------- step 3 · conflicts & suggestions ---------------- */

export function detectConflicts(resolved: ResolvedSelection[]): CompileConflict[] {
  const selected = new Set(resolved.map((r) => r.module.id));
  const out: CompileConflict[] = [];
  const seen = new Set<string>();
  for (const r of resolved) {
    for (const edge of r.module.conflicts ?? []) {
      if (!selected.has(edge.id)) continue;
      const key = [r.module.id, edge.id].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ aId: r.module.id, bId: edge.id, reason: edge.reason });
    }
  }
  return out;
}

function computeSuggestions(resolved: ResolvedSelection[]): { when: string; add: string[] }[] {
  const selected = new Set(resolved.map((r) => r.module.id));
  const out: { when: string; add: string[] }[] = [];
  for (const r of resolved) {
    const missing = (r.module.suggests ?? []).filter((s) => !selected.has(s));
    if (missing.length) out.push({ when: r.module.id, add: missing });
  }
  return out;
}

/* ---------------- step 4 · fragment rendering ---------------- */

function fmtValue(def: ParamDef | undefined, v: string | number | boolean): string {
  if (typeof v === "boolean") return v ? "enabled" : "disabled";
  if (typeof v === "number" && def?.unit) return `${v}${def.unit}`;
  return String(v);
}

export function renderFragment(mod: PromptModule, params: ParamValues): string {
  return interpolate(mod.prompt, mod, params);
}

function interpolate(text: string, mod: PromptModule, params: ParamValues): string {
  let out = text;
  for (const def of mod.params) {
    const v = params[def.key] ?? def.default;
    out = out.replaceAll(`{${def.key}}`, fmtValue(def, v));
  }
  return out;
}

/** tokens may also appear in implementation/a11y/responsive/fallback lines */
function labeledField(label: string, text: string | undefined, mod: PromptModule, params: ParamValues): string | null {
  if (!text) return null;
  return `${label}: ${interpolate(text, mod, params)}`;
}

function paramSummaryLines(module: PromptModule, params: ParamValues): string[] {
  return module.params.map((p) => `${p.label}: ${fmtValue(p, params[p.key] ?? p.default)}`);
}

/* ---------------- extreme-depth rendering ---------------- */

const EXTREME_LABELS: [keyof NonNullable<PromptModule["extreme"]>, string][] = [
  ["visual", "Visual precision"],
  ["motion", "Motion contract"],
  ["graphics", "Graphics contract"],
  ["architecture", "Component architecture"],
  ["quality", "Quality & acceptance"],
];

function extremeLines(mod: PromptModule, params: ParamValues): string[] {
  const lines: string[] = [];
  const ex = mod.extreme;
  if (!ex) return lines;
  for (const [key, label] of EXTREME_LABELS) {
    const txt = ex[key];
    if (!txt) continue;
    lines.push(`${label} — ${interpolate(txt, mod, params)}`);
  }
  return lines;
}

/* ---------------- step 5 · section assembly ---------------- */

const SECTION_ORDER: { cat: CategoryId; title: string }[] = [
  { cat: "websites", title: "PROJECT OBJECTIVE & EXPERIENCE TYPE" },
  { cat: "direction", title: "CREATIVE DIRECTION & DESIGN LANGUAGE" },
  { cat: "layout", title: "LAYOUT ARCHITECTURE" },
  { cat: "typography", title: "TYPOGRAPHY SYSTEM" },
  { cat: "color", title: "COLOR, MATERIALS & TEXTURE" },
  { cat: "backgrounds", title: "BACKGROUNDS & ATMOSPHERE" },
  { cat: "webgl", title: "3D, WEBGL & SHADER REQUIREMENTS" },
  { cat: "math", title: "MATHEMATICAL & GENERATIVE SYSTEMS" },
  { cat: "motion", title: "MOTION & INTERACTION SCORE" },
  { cat: "interaction", title: "INTERACTION DESIGN" },
  { cat: "engineering", title: "RESPONSIVE, ACCESSIBILITY & PERFORMANCE CONTRACTS" },
];

export function compile(input: CompileInput): CompileOutput {
  const depth: CompileDepth = input.depth ?? "detailed";
  const { resolved, unknownIds } = resolveSelections(input.selections ?? []);
  const conflicts = detectConflicts(resolved);
  const suggestions = computeSuggestions(resolved);
  const warnings: CompileWarning[] = [];

  const heavyCount = resolved.filter((r) => r.module.perf === "heavy").length;
  if (heavyCount > 2) {
    warnings.push({
      kind: "heavy",
      message: `${heavyCount} heavy-performance modules selected. Award-grade sites ship ONE signature heavy effect — consider trimming to the strongest, or pair with engineering/gpu-budget and quality governors.`,
    });
  }
  const hasEngineering = resolved.some((r) => r.module.category === "engineering");
  const hasHeavyOrMotion = resolved.some((r) => r.module.perf !== "light" || r.module.category === "motion");
  if (hasHeavyOrMotion && !hasEngineering) {
    warnings.push({
      kind: "coverage",
      message: "Motion/graphics selected without any engineering contracts — add engineering/reduced-motion at minimum so accessibility isn't improvised.",
    });
  }
  if (unknownIds.length) {
    warnings.push({ kind: "unknown", message: `Ignored unknown module ids: ${unknownIds.join(", ")}` });
  }

  // group by role in canonical order; user selection order preserved within a section
  const sections: CompiledSection[] = [];
  const conflictIds = new Set(conflicts.flatMap((c) => [c.aId, c.bId]));
  let n = 0;
  for (const { cat, title } of SECTION_ORDER) {
    const rows = resolved.filter((r) => r.module.category === cat);
    if (!rows.length) continue;
    n += 1;
    sections.push({
      id: cat,
      number: n,
      title,
      items: rows.map((r) => {
        const meta: string[] = [];
        meta.push(`${CATEGORY_MAP.get(cat)?.subcategories.find((s) => s.id === r.module.subcategory)?.name ?? r.module.subcategory}`);
        meta.push(r.module.difficulty);
        meta.push(`perf: ${r.module.perf}`);
        if (r.module.demo) meta.push("live demo in labs");
        const pLines = paramSummaryLines(r.module, r.params);
        if (pLines.length) meta.push(`params — ${pLines.join(" · ")}`);
        if (conflictIds.has(r.module.id)) meta.push("⚠ part of a conflict — see conflict report");
        const bodyParts: (string | null)[] = [renderFragment(r.module, r.params), ""];
        if (depth !== "standard") {
          bodyParts.push(
            labeledField("Implementation", r.module.implementation, r.module, r.params),
            labeledField("Accessibility", r.module.a11y, r.module, r.params),
            labeledField("Responsive", r.module.responsive, r.module, r.params),
            labeledField("Fallback", r.module.fallback, r.module, r.params),
          );
        }
        if (depth === "extreme") {
          bodyParts.push(...extremeLines(r.module, r.params));
        }
        bodyParts.push(r.module.stack.length ? `Stack: ${r.module.stack.join(", ")}` : null);
        return {
          id: r.module.id,
          heading: r.module.name,
          body: bodyParts
            .filter((x): x is string => Boolean(x))
            .join("\n"),
          meta,
        };
      }),
    });
  }

  // derived closing sections
  const closing: CompiledSection[] = [];
  {
    n += 1;
    const stackList = aggregateStacks(resolved);
    closing.push({
      id: "stack",
      number: n,
      title: "TECHNICAL ARCHITECTURE",
      items: [
        {
          id: "stack/target",
          heading: "Target stack",
          body: input.stackNote?.trim() ||
            "Next.js (App Router) + React + TypeScript strict + Tailwind CSS for the document layer; Framer Motion for UI springs; GSAP ScrollTrigger for scroll choreography; Canvas 2D for 2D generative work; Three.js/React Three Fiber + GLSL where 3D/shader modules are selected. Everything below that references libraries is advisory, not a shoppability requirement — pick the listed stack only where it earns its place.",
          meta: stackList.length ? [`module-referenced: ${stackList.join(", ")}`] : [],
        },
        {
          id: "stack/sequence",
          heading: "Implementation sequence",
          body: buildSequence(resolved),
          meta: [],
        },
      ],
    });
  }
  if (conflicts.length || suggestions.length || warnings.length) {
    n += 1;
    closing.push({
      id: "advice",
      number: n,
      title: "CONFLICTS, WARNINGS & RECOMMENDED ADDITIONS",
      items: [
        ...conflicts.map((c) => ({
          id: `conflict/${c.aId}--${c.bId}`,
          heading: `Conflict: ${nameOf(c.aId)} × ${nameOf(c.bId)}`,
          body: `${c.reason} Both were kept (your intent is preserved) — resolve by choosing a lead direction or explicitly staging them in different sections of the site.`,
          meta: ["conflict"],
        })),
        ...warnings.map((w, i) => ({
          id: `warning/${i}`,
          heading: `Note`,
          body: w.message,
          meta: ["warning"],
        })),
        ...suggestions.slice(0, 8).map((s) => ({
          id: `suggest/${s.when}`,
          heading: `Recommended with ${nameOf(s.when)}`,
          body: `Consider adding: ${s.add.map((id) => `${nameOf(id)} (${id})`).join(", ")} — these complete the technique's production story (fallbacks, budgets, or natural partners).`,
          meta: ["suggestion"],
        })),
      ],
    });
  }
  {
    n += 1;
    closing.push({
      id: "acceptance",
      number: n,
      title: "ACCEPTANCE CRITERIA & RESTRICTIONS",
      items: [
        {
          id: "acceptance/criteria",
          heading: "Definition of done",
          body: acceptanceCriteria(resolved),
          meta: [],
        },
        {
          id: "acceptance/avoid",
          heading: "Explicit restrictions",
          body: avoidList(resolved, conflicts),
          meta: [],
        },
      ],
    });
  }

  const all = [...sections, ...closing];
  const words = all
    .flatMap((s) => s.items.map((i) => `${i.heading} ${i.body}`))
    .join(" ")
    .split(/\s+/).length;

  const json: CompiledJson = {
    project: {
      name: input.projectName?.trim() || "Untitled composition",
      brief: input.brief?.trim() || "",
      audience: input.audience?.trim() || null,
    },
    generatedAt: new Date().toISOString(),
    version: 1,
    sections: all.map((s) => ({
      id: s.id,
      title: s.title,
      items: s.items.map((i) => {
        const r = resolved.find((rr) => rr.module.id === i.id);
        return {
          moduleId: i.id,
          name: i.heading,
          prompt: i.body,
          params: r?.params ?? {},
        };
      }),
    })),
    conflicts,
    warnings,
  };

  const markdown = renderMarkdown(input, all, conflicts, warnings);
  const text = renderText(input, all, conflicts, warnings);

  return {
    sections: all,
    conflicts,
    warnings,
    suggestions,
    resolved,
    unknownIds,
    stats: {
      modules: resolved.length,
      words,
      heavy: heavyCount,
      withDemo: resolved.filter((r) => r.module.demo).length,
    },
    markdown,
    text,
    json,
  };
}

function nameOf(id: string): string {
  return getModule(id)?.name ?? id;
}

function aggregateStacks(resolved: ResolvedSelection[]): string[] {
  const s = new Set<string>();
  for (const r of resolved) for (const t of r.module.stack) s.add(t);
  return [...s].sort();
}

function buildSequence(resolved: ResolvedSelection[]): string {
  const has = (cat: CategoryId) => resolved.some((r) => r.module.category === cat);
  const steps: string[] = [
    "1. Establish tokens first: palette, spacing scale, radius, type ramp, motion durations — everything later is composition of tokens.",
  ];
  if (has("layout")) steps.push("2. Build the layout systems in isolation (storybook-style fixtures) before feeding real content.");
  steps.push(
    `${steps.length + 1}. Compose page structure semantically (landmarks, heading ladder) with zero effects applied — the page must read well naked.`,
  );
  if (has("typography")) steps.push(`${steps.length + 1}. Apply the typography system; verify measures, tracking and hierarchy at 360/768/1440px.`);
  if (has("color") || has("backgrounds")) steps.push(`${steps.length + 1}. Apply color/material/background treatments; verify WCAG contrast pairs before any motion exists.`);
  if (has("motion")) steps.push(`${steps.length + 1}. Implement motion in order: micro-interactions → scroll reveals → signature set-pieces. Gate everything behind reduced-motion.`);
  if (has("math") || has("webgl")) steps.push(`${steps.length + 1}. Mount generative/3D systems last, lazily, with their documented fallbacks; profile frame budgets immediately.`);
  steps.push(`${steps.length + 1}. Final pass: keyboard-only walkthrough, screen-reader pass, 360–1920px visual sweep, Lighthouse budgets.`);
  return steps.join("\n");
}

function acceptanceCriteria(resolved: ResolvedSelection[]): string {
  const lines = [
    "- All selections above are implemented with their specified parameters (a reviewer can hold this document against the build).",
    "- Zero horizontal overflow at 360/390/768/1024/1440/1920px.",
    "- prefers-reduced-motion collapses every animated behavior to its documented static variant, with content loss = zero.",
    "- Full keyboard operation: every control reachable and usable; visible focus states; Esc closes overlays.",
    "- Every WebGL/heavy effect carries its documented fallback and never gates content.",
  ];
  if (resolved.some((r) => r.module.id === "engineering/core-web-vitals"))
    lines.push("- Lighthouse mobile budgets hit: LCP ≤ 2.5s (or as configured), INP ≤ 200ms, CLS ≤ 0.1.");
  if (resolved.some((r) => r.module.perf === "heavy"))
    lines.push("- Frame budget verified with an on-device p95 histogram for every heavy module (60fps target unless documented otherwise).");
  return lines.join("\n");
}

function avoidList(resolved: ResolvedSelection[], conflicts: CompileConflict[]): string {
  const lines = [
    "- No placeholder or lorem ipsum content; every copy block is written for the actual project.",
    "- No dead controls: every visible button, slider, filter and export works or is absent.",
    "- No motion without reduced-motion handling; no webfonts without swap + metric overrides.",
    "- No generic purple/blue default-AI gradient themes as the art direction; the selected direction governs.",
  ];
  for (const c of conflicts) {
    lines.push(`- Avoid freely mixing ${nameOf(c.aId)} with ${nameOf(c.bId)} (${c.reason})`);
  }
  const cats = new Set(resolved.map((r) => r.module.category));
  if (!cats.has("engineering"))
    lines.push("- Avoid shipping heavy effects without the engineering contracts (accessibility/performance) defined as modules.");
  return lines.join("\n");
}

/* ---------------- step 6 · renderers ---------------- */

function renderHeader(input: CompileInput): string[] {
  const name = input.projectName?.trim() || "Untitled composition";
  const brief = input.brief?.trim();
  const lines = [
    `# PROMPTFORGE BUILD SPECIFICATION — ${name}`,
    "",
    "You are a senior creative technologist and principal front-end engineer. Build the experience described below to production quality. Every section is a contract; every parameter is deliberate. Where choices must be made, prefer the documented intent over generic defaults.",
  ];
  if (brief) lines.push("", `Project brief (user intent — anchor every decision to this): ${brief}`);
  if (input.audience?.trim()) lines.push("", `Audience: ${input.audience.trim()}`);
  lines.push("");
  return lines;
}

function renderMarkdown(input: CompileInput, sections: CompiledSection[], conflicts: CompileConflict[], warnings: CompileWarning[]): string {
  const L = renderHeader(input);
  for (const s of sections) {
    L.push(`## ${s.number} · ${s.title}`, "");
    for (const item of s.items) {
      L.push(`### ${item.heading}`, "");
      L.push(item.body, "");
      if (item.meta.length) L.push(`*${item.meta.join(" · ")}*`, "");
    }
  }
  return L.join("\n");
}

function renderText(input: CompileInput, sections: CompiledSection[], _conflicts: CompileConflict[], _warnings: CompileWarning[]): string {
  const L = [
    `PROMPTFORGE BUILD SPECIFICATION — ${input.projectName?.trim() || "Untitled composition"}`,
    "",
  ];
  if (input.brief?.trim()) L.push(`Brief: ${input.brief.trim()}`, "");
  for (const s of sections) {
    L.push(`═══ ${s.number}. ${s.title} ${"═".repeat(Math.max(2, 40 - s.title.length))}`, "");
    for (const item of s.items) {
      L.push(`▸ ${item.heading}`);
      L.push(item.body);
      if (item.meta.length) L.push(`  [${item.meta.join(" · ")}]`);
      L.push("");
    }
  }
  return L.join("\n");
}

/* category-order helper used by the UI */
export function categoryOrderedModules(resolved: ResolvedSelection[]): ResolvedSelection[] {
  const order = new Map(CATEGORIES.map((c, i) => [c.id, i]));
  return [...resolved].sort(
    (a, b) => (order.get(a.module.category) ?? 99) - (order.get(b.module.category) ?? 99),
  );
}
