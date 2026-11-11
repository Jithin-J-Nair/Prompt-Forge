# Knowledge Base Architecture

## Design intent

The studio's knowledge base replaces the "bag of fancy words" approach of prompt libraries with
**typed, parameterized technique modules**. Each module is a self-contained specification of one
technique a site can ship — with the engineering surface (params, fallbacks, accessibility,
responsive budgets) written in, so the compiled prompt is an *implementation contract*, not vibes.

## Module contract (`src/lib/studio/schema.ts`)

```ts
PromptModule {
  id            // namespaced slug: "motion/scroll-reveal" — stable, never reused
  category      // one of 11 CategoryId; id is always "<category>/<slug>"
  subcategory   // validated against the category's declared subcategories
  name, tagline, description          // browsable, human layer
  prompt        // composable fragment; may contain {paramKey} tokens
  implementation                    // how to build it (libraries, DOM, shaders)
  a11y?, responsive?, fallback?       // engineering surfacing (interpolated too)
  stack         // concrete tech markers ("GSAP", "Canvas 2D", "GLSL")
  params        // typed ParamDef[]: range | number | select | boolean | text
  tags, aliases?                     // search vocabulary
  conflicts?, suggests?              // compatibility graph edges (both validated)
  difficulty, perf, dimension        // classification
  interactivity                      // "scroll" | "pointer" | "animated" | "static"
  demo?         // lab demo id — key into the real demo registry (tests enforce coverage)
  version
}
```

### Parameters are the point

Tokens are interpolated by the compiler; types make them honest:

- `range {min, max, step, unit}` — clamps at resolve; renders as `12px`, `×0.5`, `62°`
- `number` — same, free-form entry
- `select {options[]}` — default must be a member (validated)
- `boolean`, `text` — for capability flags and short verbatim strings

Wrong values can't leak into a prompt — they clamp to the def's domain. This is why "480ms"
in a compiled prompt always came from a slider with real bounds, not a typo.

## The 11 categories

| # | Category | Modules | Role in compiled output |
|---|----------|---------|--------------|
| 01 | Website Types | 32 | Project objective & experience type |
| 02 | Art Direction | 25 | Creative direction & design language |
| 03 | Layout | 21 | Layout architecture |
| 04 | Typography | 19 | Typography system |
| 05 | Color & Materials | 23 | Color, materials & texture |
| 06 | Motion | 60 | Motion & interaction score |
| 07 | Mathematical Graphics | 44 | Mathematical & generative systems |
| 08 | 3D / WebGL / Shaders | 16 | 3D, WebGL & shader requirements |
| 09 | Backgrounds & Atmosphere | 13 | Backgrounds & atmosphere |
| 10 | Interaction | 13 | Interaction design |
| 11 | Engineering & Quality | 13 | Responsive, a11y & performance contracts |

Motion's 9 subcategories: scroll, type-motion, cursor, physics, particles, threed, transitions,
system, svg.

## Compatibility graph

`conflicts` edges are directed (`A conflicts with B, reason…`) but the compiler reports each pair
**once**, symmetrically, with the reason. The product rule: *never silently drop a selection* —
conflicts are surfaced with an explanation and an explicit suggested resolution, and both modules
stay in the compiled document until the user decides.

`suggests` edges power the "recommended additions" affordance: selecting `webgl/three-scene`
suggests its fallback/budget partners (`engineering/webgl-fallback`, `engineering/lazy-3d`, …).
Suggestions are additions offered, never auto-additions.

## Registry validation (`scripts/validate-registry.ts`, `registry.test.ts`)

At import time (and in CI): unique ids, category/subcategory membership, `{token}` ↔ param
consistency, select defaults in options, number defaults in range, every conflict/suggest target
exists, no empty fragments, no lorem/TODO markers. **Zero errors is the bar; the suite fails
otherwise** — the knowledge base is code, review-gated.

## Authoring conventions

- Fragments are written for an AI builder audience (Lovable/Cursor/v0-class) and for humans.
- Each module ships with *budgets* (durations, counts, thresholds) — the numbers are the craft.
- Cross-category conflicts are cross-checked pairs (glassmorphism ✕ neo-brutalism; chrome ✕ luxury
  minimalism; elastic motion ✕ fintech dashboards, etc.).
- Demos referenced by `demo:` must exist in a lab — enforced by test (58 live demo keys).
