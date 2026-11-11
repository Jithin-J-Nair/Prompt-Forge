/* ------------------------------------------------------------------ */
/*  PromptForge Studio — knowledge module schema.                      */
/*  Strongly-typed contract for every selectable prompt module.        */
/* ------------------------------------------------------------------ */

export type CategoryId =
  | "websites"
  | "direction"
  | "layout"
  | "typography"
  | "color"
  | "motion"
  | "math"
  | "webgl"
  | "backgrounds"
  | "interaction"
  | "engineering";

export type ParamType = "range" | "number" | "select" | "boolean" | "text";

export interface ParamOption {
  value: string;
  label: string;
}

export interface ParamDef {
  /** token name interpolated into the prompt fragment as {key} */
  key: string;
  label: string;
  type: ParamType;
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: ParamOption[];
  /** one-line explanation shown beside the control */
  help?: string;
  /** when the rendered value needs phrasing: prefix/suffix wrap */
  phrase?: string;
}

export type ParamValue = string | number | boolean;
export type ParamValues = Record<string, ParamValue>;

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PerfClass = "light" | "medium" | "heavy";
export type Dimension = "2d" | "3d" | "both" | "none";
export type Interactivity =
  | "static"
  | "hover"
  | "scroll"
  | "pointer"
  | "animated"
  | "realtime";

export interface ConflictEdge {
  /** module id this module conflicts with */
  id: string;
  /** human explanation surfaced in the compiled prompt */
  reason: string;
}

export type PreviewRendererKind = "dom" | "svg" | "canvas2d" | "webgl" | "three";

/**
 * Live-preview contract. Every module must have one; the registry test suite
 * asserts resolvable component keys and param coverage (100% coverage).
 * componentKey resolves through the preview component registry
 * (src/components/preview/preview-registry.tsx); paramMap maps module param
 * keys to preview prop names — the SAME state feeds preview + compiler.
 */
export interface PreviewDefinition {
  kind: PreviewRendererKind;
  /** registry key, e.g. "type/oversized", "canvas/flow-field", "gl/domain-warp" */
  componentKey: string;
  /** moduleParamKey -> preview prop name (identity mapping when omitted) */
  paramMap?: Record<string, string>;
  /** deterministic seed for reproducible procedural previews */
  seed?: number;
  /** honest note when the preview is an illustrative approximation */
  approximationNote?: string;
  /** what to show under prefers-reduced-motion (defaults used if omitted) */
  reducedMotionFallback?: "still" | "simplified";
}

/** Expert-grade structured expansion used by the compiler's EXTREME depth. */
export interface ExtremeSpec {
  /** exact visual outcome: composition, geometry, color, light, texture */
  visual?: string;
  /** motion contract: trigger, states, durations, easings, physics, loops */
  motion?: string;
  /** rendering contract: tech, shader architecture, uniforms, camera, post */
  graphics?: string;
  /** component architecture: structure, state model, lifecycle, data flow */
  architecture?: string;
  /** acceptance hooks: tests, budgets, browser matrix */
  quality?: string;
}

export interface PromptModule {
  /** stable, namespaced: e.g. "motion/scroll-reveal" — never reuse ids */
  id: string;
  category: CategoryId;
  subcategory: string;
  name: string;
  /** one-line plain-language summary for cards */
  tagline: string;
  /** what the user actually sees — 1–3 sentences */
  description: string;
  /**
   * The original prompt fragment contributed to the compiled spec.
   * May embed {paramKey} tokens — the compiler substitutes resolved values.
   * Must describe the technique precisely enough for an AI coding agent to
   * implement it without guessing.
   */
  prompt: string;
  /** recommended implementation approach + libraries */
  implementation: string;
  /** technologies this module assumes or recommends */
  stack: string[];
  params: ParamDef[];
  tags: string[];
  aliases?: string[];
  difficulty: Difficulty;
  perf: PerfClass;
  dimension: Dimension;
  interactivity: Interactivity[];
  /** mandatory accessibility behaviour, encoded into the output */
  a11y?: string;
  /** required responsive behaviour */
  responsive?: string;
  /** graceful-degradation story */
  fallback?: string;
  conflicts?: ConflictEdge[];
  suggests?: string[];
  /** id of a functional demo in the labs, when one exists */
  demo?: string;
  /**
   * Explicit live preview override. When omitted, the registry resolves one
   * from the preview map (then subcategory default) — resolution via
   * getPreview() is mandatory-coverage (registry validation fails otherwise).
   * The same resolved param values drive both preview and compiled prompt.
   */
  preview?: PreviewDefinition;
  /** extra expert detail consumed by compiler depth:"extreme" */
  extreme?: ExtremeSpec;
  /** content version — bump when the fragment changes materially */
  version: number;
}

export interface SubcategoryDef {
  id: string;
  name: string;
  blurb: string;
}

/** which compiled section a category feeds */
export type SectionRole =
  | "objective"
  | "direction"
  | "layout"
  | "typography"
  | "color"
  | "backgrounds"
  | "webgl"
  | "math"
  | "motion"
  | "interaction"
  | "engineering";

export interface CategoryDef {
  id: CategoryId;
  number: string;
  name: string;
  tagline: string;
  role: SectionRole;
  subcategories: SubcategoryDef[];
}

/* ------------------------- parameter helpers ------------------------- */

export function range(
  key: string,
  label: string,
  def: number,
  min: number,
  max: number,
  step: number,
  unit: string,
  help?: string,
): ParamDef {
  return { key, label, type: "range", default: def, min, max, step, unit, help };
}

export function num(
  key: string,
  label: string,
  def: number,
  min: number,
  max: number,
  step: number,
  unit?: string,
  help?: string,
): ParamDef {
  return { key, label, type: "number", default: def, min, max, step, unit, help };
}

export function select(
  key: string,
  label: string,
  def: string,
  options: string[],
  help?: string,
): ParamDef {
  return {
    key,
    label,
    type: "select",
    default: def,
    options: options.map((o) => ({ value: o, label: o })),
    help,
  };
}

export function flag(key: string, label: string, def: boolean, help?: string): ParamDef {
  return { key, label, type: "boolean", default: def, help };
}

export function text(key: string, label: string, def: string, help?: string): ParamDef {
  return { key, label, type: "text", default: def, help };
}

export const EASINGS = [
  "power2.out",
  "power3.out",
  "power4.out",
  "expo.out",
  "back.out(1.7)",
  "elastic.out(1, 0.6)",
  "circ.out",
  "cubic-bezier(0.22, 1, 0.36, 1)",
];

export const TRIGGERS = [
  "on viewport entry",
  "on scroll progress",
  "on hover",
  "on click",
  "on load",
  "continuous",
];

/* ------------------- module factory with defaults ------------------- */

type ModuleInput = Omit<PromptModule, "version" | "params" | "tags" | "stack" | "interactivity"> &
  Partial<Pick<PromptModule, "version" | "params" | "tags" | "stack" | "interactivity">>;

export function M(input: ModuleInput): PromptModule {
  return {
    version: 1,
    params: [],
    tags: [],
    stack: [],
    interactivity: ["static"],
    ...input,
  };
}
