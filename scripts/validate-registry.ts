import { MODULES, REGISTRY_STATS, validateRegistry } from "../src/lib/studio/registry";
import { PRESETS } from "../src/lib/studio/presets";
import { MODULE_MAP } from "../src/lib/studio/registry";

const issues = validateRegistry();
const errors = issues.filter(i => i.level === "error");
console.log("STATS", REGISTRY_STATS);
console.log("errors:", errors.length, "warnings:", issues.filter(i=>i.level==="warn").length);
for (const e of errors.slice(0, 40)) console.log("ERR", e.module, e.message);

// validate presets
let perr = 0;
for (const p of PRESETS) {
  const seen = new Set<string>();
  for (const s of p.selections) {
    if (!MODULE_MAP.has(s.id)) { console.log("PRESET BAD ID", p.id, s.id); perr++; }
    if (seen.has(s.id)) { console.log("PRESET DUP", p.id, s.id); perr++; }
    seen.add(s.id);
    const m = MODULE_MAP.get(s.id);
    if (m && s.params) for (const k of Object.keys(s.params)) {
      if (!m.params.some(d => d.key === k)) { console.log("PRESET BAD PARAM", p.id, s.id, k); perr++; }
    }
  }
}
console.log("preset errors:", perr, "presets:", PRESETS.length, "modules:", MODULES.length);
