import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  MODULES,
  MODULE_MAP,
  PRESETS,
  REGISTRY_STATS,
  getModule,
  modulesByCategory,
  validateRegistry,
} from "@/lib/studio";

describe("knowledge-base registry", () => {
  it("contains at least 150 substantial modules", () => {
    expect(MODULES.length).toBeGreaterThanOrEqual(150);
    expect(REGISTRY_STATS.modules).toBe(MODULES.length);
  });

  it("covers all 11 categories with modules", () => {
    expect(CATEGORIES.length).toBe(11);
    for (const c of CATEGORIES) {
      expect(modulesByCategory(c.id).length, `category ${c.id} empty`).toBeGreaterThan(0);
    }
  });

  it("passes full content validation with zero errors", () => {
    const errors = validateRegistry().filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });

  it("uses unique namespaced ids", () => {
    const ids = MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of MODULES) {
      expect(m.id).toMatch(/^[a-z]+\/[a-z0-9-]+$/);
    }
  });

  it("has no placeholder content: prompts and descriptions are substantial", () => {
    for (const m of MODULES) {
      expect(m.prompt.length, `${m.id} prompt too short`).toBeGreaterThanOrEqual(60);
      expect(m.description.length, `${m.id} description too short`).toBeGreaterThanOrEqual(40);
      expect(m.implementation.length, `${m.id} implementation too short`).toBeGreaterThanOrEqual(20);
      expect(m.name.trim().length).toBeGreaterThan(2);
      expect(m.tagline.trim().length).toBeGreaterThan(5);
    }
  });

  it("no lorem/ipsum/TODO markers anywhere in module text", () => {
    for (const m of MODULES) {
      const blob = `${m.name} ${m.tagline} ${m.description} ${m.prompt} ${m.implementation}`;
      expect(blob.toLowerCase()).not.toMatch(/lorem|ipsum|todo|fixme|placeholder text/);
    }
  });

  it("motion category has the required 9 subcategories", () => {
    const motion = CATEGORIES.find((c) => c.id === "motion")!;
    const subs = new Set(motion.subcategories.map((s) => s.id));
    for (const req of ["scroll", "type-motion", "cursor", "physics", "particles", "threed", "transitions", "system", "svg"]) {
      expect(subs.has(req), `missing motion subcategory ${req}`).toBe(true);
    }
  });

  it("every demo id is a real, registered lab demo key", () => {
    // labs implement exactly these demo ids — keep this list in sync with lab pages
    const known = new Set([
      "scramble","marquee","char-stagger","gradient-sweep","path-text","mesh-gradient","aurora",
      "marble","grain","halftone","dither","reveal","scroll-scrub","scroll-pin","parallax",
      "mask-reveal","cursor","magnetic","spotlight","cursor-preview","tilt","spring","drag-inertia",
      "float","rope","particles","particle-network","image-particles","flow-field","blob",
      "displacement","path-draw","count-up","menu-overlay","micro","scroll-spy",
      "lissajous","fourier","voronoi","polar-rose","julia","sierpinski","fractal-tree","lorenz",
      "boids","noise-field","fbm-field","domain-warp","terrain","reaction-diffusion","metaballs",
      "phyllotaxis","force-graph","constellation-cursor","shader-field","starfield","wave-field","plasma",
    ]);
    for (const m of MODULES) {
      if (m.demo) expect(known.has(m.demo), `${m.id} references unknown demo '${m.demo}'`).toBe(true);
    }
  });
});

describe("presets", () => {
  it("has at least 20 presets", () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(20);
  });

  it("every preset composes only existing module ids", () => {
    for (const p of PRESETS) {
      expect(p.selections.length, `${p.id} has no selections`).toBeGreaterThan(0);
      for (const s of p.selections) {
        expect(MODULE_MAP.has(s.id), `preset ${p.id} references missing module ${s.id}`).toBe(true);
      }
    }
  });

  it("preset param overrides reference real param keys", () => {
    for (const p of PRESETS) {
      for (const s of p.selections) {
        if (!s.params) continue;
        const m = getModule(s.id)!;
        for (const key of Object.keys(s.params)) {
          expect(
            m.params.some((d) => d.key === key),
            `preset ${p.id} → ${s.id} has unknown param ${key}`,
          ).toBe(true);
        }
      }
    }
  });
});
