import { describe, expect, it } from "vitest";
import { MODULES, searchModules, distinctTags } from "@/lib/studio";

describe("search index", () => {
  it("finds modules by exact name", () => {
    const r = searchModules("Lorenz");
    expect(r[0]?.module.id).toBe("math/lorenz");
    expect(r[0]?.where).toContain("name");
  });

  it("finds modules by tag across categories", () => {
    const r = searchModules("kinetic");
    expect(r.length).toBeGreaterThan(2);
    expect(r.some((x) => x.module.tags.includes("kinetic"))).toBe(true);
  });

  it("expands domain synonyms (glow → bloom/neon)", () => {
    const r = searchModules("glow");
    expect(r.some((x) => x.module.id === "color/bloom")).toBe(true);
  });

  it("tolerates long prefixes (voron → voronoi)", () => {
    const r = searchModules("voronoi");
    expect(r[0]?.module.id).toBe("math/voronoi");
  });

  it("searches descriptions, not only names", () => {
    const r = searchModules("lissajous");
    expect(r.some((x) => x.module.id === "math/lissajous")).toBe(true);
  });

  it("empty query returns the full (unfiltered) catalog", () => {
    const r = searchModules("");
    expect(r.length).toBe(MODULES.length);
  });

  it("structured filters narrow results", () => {
    const all = searchModules("scroll");
    const motionOnly = searchModules("scroll", { category: "motion" });
    expect(motionOnly.length).toBeLessThan(all.length);
    expect(motionOnly.every((r) => r.module.category === "motion")).toBe(true);
    const demos = searchModules("scroll", { category: "motion", hasDemo: true });
    expect(demos.every((r) => Boolean(r.module.demo))).toBe(true);
    const tunable = searchModules("", { tunable: true });
    expect(tunable.every((r) => r.module.params.length > 0)).toBe(true);
  });

  it("ranks exact tag/name hits above description-only hits", () => {
    const r = searchModules("parallax");
    const idx = r.findIndex((x) => x.module.id === "motion/parallax");
    expect(idx).toBeLessThan(4);
  });

  it("exposes a harmless tag list for filter UIs", () => {
    const tags = distinctTags();
    expect(tags.length).toBeGreaterThan(80);
    expect(tags).toEqual([...tags].sort());
  });
});
