import { describe, expect, it } from "vitest";
import {
  compile,
  detectConflicts,
  getModule,
  renderFragment,
  resolveSelections,
} from "@/lib/studio";

describe("compilation engine", () => {
  it("produces sectioned output in canonical role order", () => {
    const out = compile({
      selections: [
        { id: "motion/scroll-reveal" },
        { id: "websites/creative-portfolio" },
        { id: "layout/broken-grid" },
      ],
    });
    const ids = out.sections.map((s) => s.id);
    expect(ids[0]).toBe("websites");
    expect(ids.indexOf("layout")).toBeLessThan(ids.indexOf("motion"));
    // closing sections exist
    expect(ids).toContain("stack");
    expect(ids).toContain("acceptance");
  });

  it("interpolates typed params with defaults and formatting", () => {
    const mod = getModule("motion/scroll-reveal")!;
    const frag = renderFragment(mod, { duration: 700, rise: 24, easing: "expo.out", stagger: 40, threshold: 25 });
    expect(frag).toContain("700ms");
    expect(frag).toContain("24px");
    expect(frag).not.toMatch(/\{\w+\}/); // no leaked tokens
  });

  it("clamps out-of-range params instead of compiling garbage", () => {
    const { resolved } = resolveSelections([
      { id: "motion/scroll-reveal", params: { duration: 99999, rise: -50 } },
    ]);
    const p = resolved[0].params;
    expect(p.duration).toBe(1600); // max of the range
    expect(p.rise).toBe(0); // min of the range
  });

  it("never crashes on unknown ids — reports them", () => {
    const out = compile({ selections: [{ id: "websites/ghost" }, { id: "layout/swiss-grid" }] });
    expect(out.unknownIds).toEqual(["websites/ghost"]);
    expect(out.resolved.map((r) => r.module.id)).toEqual(["layout/swiss-grid"]);
    expect(out.warnings.some((w) => w.kind === "unknown")).toBe(true);
  });

  it("deduplicates repeated selections", () => {
    const { resolved } = resolveSelections([
      { id: "motion/marquee" },
      { id: "motion/marquee" },
    ]);
    expect(resolved.length).toBe(1);
  });

  it("detects conflicts symmetrically and exactly once (never drops modules)", () => {
    const { resolved } = resolveSelections([{ id: "color/glass" }, { id: "direction/neo-brutalism" }]);
    const conflicts = detectConflicts(resolved);
    expect(conflicts.length).toBe(1);
    expect(new Set([conflicts[0].aId, conflicts[0].bId])).toEqual(
      new Set(["color/glass", "direction/neo-brutalism"]),
    );
    expect(conflicts[0].reason.length).toBeGreaterThan(10);
    // both modules remain resolved — conflict must be *explained*, not silently fixed
    expect(resolved.length).toBe(2);
  });

  it("emits sections in markdown with numbered headings and meta lines", () => {
    const out = compile({
      projectName: "Test Project",
      selections: [
        { id: "websites/saas" },
        { id: "engineering/reduced-motion" },
        { id: "engineering/core-web-vitals" },
      ],
    });
    expect(out.markdown).toMatch(/^# PROMPTFORGE BUILD SPECIFICATION — Test Project/m);
    expect(out.markdown).toMatch(/## \d+ · /);
    expect(out.markdown).toContain("perf:");
    expect(out.markdown).not.toMatch(/\{\w+\}/);
    expect(out.text).toContain("PROMPTFORGE BUILD SPECIFICATION");
    expect(out.json.version).toBe(1);
    expect(out.json.sections.length).toBeGreaterThan(0);
  });

  it("acceptance criteria scales with selection content", () => {
    const light = compile({ selections: [{ id: "websites/personal-portfolio" }] });
    const heavy = compile({
      selections: [
        { id: "websites/personal-portfolio" },
        { id: "webgl/fluid-shader" },
        { id: "engineering/core-web-vitals" },
      ],
    });
    expect(light.markdown).not.toContain("p95 histogram");
    expect(heavy.markdown).toContain("p95 histogram");
    expect(heavy.markdown).toContain("INP ≤ 200ms");
  });

  it("warns when motion/heavy selects lack engineering contracts", () => {
    const out = compile({ selections: [{ id: "motion/spring-physics" }] });
    expect(out.warnings.some((w) => w.kind === "coverage")).toBe(true);
    const covered = compile({
      selections: [{ id: "motion/spring-physics" }, { id: "engineering/reduced-motion" }],
    });
    expect(covered.warnings.some((w) => w.kind === "coverage")).toBe(false);
  });

  it("surfaces module suggestions as additions, never auto-adds", () => {
    const out = compile({ selections: [{ id: "webgl/three-scene" }] });
    expect(out.suggestions.length).toBeGreaterThan(0);
    expect(out.resolved.length).toBe(1); // suggestions don't mutate selections
  });

  it("renders different output formats consistently", () => {
    const input = {
      selections: [{ id: "typography/oversized", params: { size: 14 } }],
      brief: "A test brief",
    };
    const out = compile(input);
    expect(out.markdown).toContain("A test brief");
    expect(out.text).toContain("A test brief");
    expect(JSON.stringify(out.json)).toContain("14vw");
  });
});
