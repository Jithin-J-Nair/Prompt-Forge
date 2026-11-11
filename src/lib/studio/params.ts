import type { ParamDef, ParamValues, PromptModule } from "./schema";

/* ------------------------------------------------------------------ */
/*  Parameter resolution — leaf module (no registry imports).           */
/*  This is THE single resolver used by the compiler, studio previews,  */
/*  API compile and tests: one source of truth for defaults + clamping. */
/* ------------------------------------------------------------------ */

export type ParamValueLike = string | number | boolean | undefined;

/** clamp/validate one raw override against its definition */
export function resolveParam(def: ParamDef, raw: ParamValueLike): string | number | boolean {
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

/** defaults+validated overrides for ONE module */
export function resolveParams(module: PromptModule, overrides: ParamValues): ParamValues {
  const params: ParamValues = {};
  for (const def of module.params) {
    params[def.key] = resolveParam(def, overrides?.[def.key] as ParamValueLike);
  }
  return params;
}

/** type-stable default bundle for renderers (identical to resolveParams(m, {})) */
export function defaultParams(module: PromptModule): ParamValues {
  return resolveParams(module, {});
}
