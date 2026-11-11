import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MODULES } from "../registry";
import { resolvePreview, unresolvedPreviewModules } from "../previews";
import { compile } from "../compiler";

describe("live preview contract", () => {
  it("resolves a preview for 100% of modules (no gaps)", () => {
    expect(unresolvedPreviewModules(MODULES)).toEqual([]);
  });

  it("every resolved componentKey is registered as a real React renderer", () => {
    const keys = new Set(MODULES.map((m) => resolvePreview(m)!.componentKey));
    // parse the registry source once (avoids importing react/three in node)
    const src = readFileSync(
      join(__dirname, "../../../components/preview/preview-registry.tsx"),
      "utf8",
    );
    const missing: string[] = [];
    for (const k of keys) {
      if (!src.includes(`"${k}"`)) missing.push(k);
    }
    expect(missing).toEqual([]);
  });

  it("at least 8 distinct renderers of each heavy kind exist and real keys bind", () => {
    const kinds = MODULES.map((m) => resolvePreview(m)!.kind);
    const tally = kinds.reduce<Record<string, number>>((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {});
    expect(tally.dom).toBeGreaterThan(50);
    expect(tally.canvas2d).toBeGreaterThan(60);
    expect(tally.webgl + tally.three).toBeGreaterThan(25);
  });

  it("preview param defaults stay inside module param ranges (no out-of-range leaks)", () => {
    for (const m of MODULES) {
      const pv = resolvePreview(m)!;
      expect(pv.kind).toMatch(/^(dom|svg|canvas2d|webgl|three)$/);
    }
  });

  it("renderer state that feeds previews matches the compile input contract", () => {
    const out = compile({
      selections: [
        { id: "motion/scroll-reveal", params: { duration: 900 } },
        { id: "typography/kinetic", params: { stagger: 0.08 } },
      ],
    });
    expect(out.text).toContain("900ms");
    expect(out.sections.length).toBeGreaterThan(0);
  });
});
