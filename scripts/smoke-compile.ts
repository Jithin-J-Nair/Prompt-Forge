import { compile } from "../src/lib/studio/compiler";
import { getPreset } from "../src/lib/studio/presets";
import { searchModules } from "../src/lib/studio/search";

const p = getPreset("awwwards-portfolio")!;
const out = compile({ projectName: "Smoke Test", selections: p.selections, brief: "A test" });
console.log("sections:", out.sections.map(s => `${s.number}.${s.id}(${s.items.length})`).join(" "));
console.log("words:", out.stats.words, "modules:", out.stats.modules, "conflicts:", out.conflicts.length, "warnings:", out.warnings.length);
// token leakage check
const leaked = out.markdown.match(/\{\w+\}/g);
console.log("leaked tokens:", leaked);
// clamp test
const out2 = compile({ selections: [{ id: "motion/scroll-reveal", params: { duration: 99999, rise: -5 } }, { id: "websites/nope" } as never] });
const r = out2.resolved[0];
console.log("clamped duration:", r.params.duration, "rise:", r.params.rise, "unknown:", out2.unknownIds);
// conflict test
const out3 = compile({ selections: [{ id: "color/glass" }, { id: "direction/neo-brutalism" }] });
console.log("conflict detected:", JSON.stringify(out3.conflicts));
// search test
console.log("search 'glow':", searchModules("glow").slice(0, 3).map(r => r.module.id));
console.log("search 'attractor':", searchModules("attractor chaos").slice(0, 3).map(r => r.module.id));
console.log("search filtered:", searchModules("scroll", { category: "motion", hasDemo: true }).slice(0, 3).map(r => r.module.id));
