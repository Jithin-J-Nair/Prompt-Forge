# PromptForge — Brutal Gap Analysis (2026-11-11)

Analyst pass: current build audited line-by-line; competitor surfaces read live
(motionsites.ai, getlayers.ai/templates, awwwards). This document says what is
missing, not what is nice.

## 1. What the build actually is today

- **Registry:** 279 modules / 66 subcategories / **11 top-level categories**:
  Website Types, Art Direction, Layout, Typography, Color/Materials, Motion (61 mods),
  Mathematical Graphics (44), 3D/WebGL/Shaders (16), Backgrounds, Interaction (13),
  Engineering/Quality (14). Distribution is lopsided — Motion 61 vs Interaction 13.
- **Compiler:** deterministic, depth-gated (standard/detailed/extreme), conflict-aware.
- **UX:** Studio = category rail → card grid → inspector → compiled output.
- **Previews:** 100% module coverage, canvas/WebGL/SVG/three lazy-loaded.

## 2. The brutal gap list

### A. Product/vision gaps (the vision you described ≠ what exists)

1. **No true keyword lexicon.** Modules are chunky "modules" (19–61 per category).
   Awwwards-tier prompting is *keyword-granular*: "liquid glass", "drift distortion",
   "chromatic aberration bloom", "magnetic cursor", "scroll-jacked gallery".
   You want: click category → wall of clickable keyword chips → stack chips → generate.
   Today the atomic unit is too coarse, and micro-keywords live buried inside module
   copy instead of being first-class selectable objects.
2. **No layered composition model.** getlayers' entire insight: a site = stacked
   *layers* (background + section + hero + treatment), each exchanging. PromptForge
   composes linear selections, not swappable layers with named roles.
3. **No gallery-of-wholes.** Motionsites/getlayers lead with finished, named artifacts
   ("AXON", "Lumière", "Golden Portal") with video-grade previews, then back into prompts.
   PromptForge's presets are anonymous bundles — none feel like a named, covetable thing.
4. **No motion-graphics-first surface.** Motion Lab exists, but motion keywords are not
   pickable primitives in the studio flow (spring presets, stagger grammar, easings,
   scene transitions, scroll choreography names).
5. **No math-graphics-first surface.** Math Lab demos exist; the 44 math modules aren't
   presented as *click to inject Voronoi / fBM / SDF raymarch into my site prompt*.
6. **No export targets.** No "Copy for v0 / Cursor / Claude / GPT-5 / Midjourney-style"
   formatter variants. One output shape only.
7. **No share/favorite/persistence loop.** Selections die on refresh (localStorage-only
   at best); no shareable link encoding the exact chip stack; no favorites.
8. **No freshness engine.** Competitors drop weekly. Nothing trend-dated, nothing
   "new this week", no counts, no popular/featured tabs.

### B. Coverage gaps in the taxonomy itself

- UI component prompts: navbars, footers, cards, menus, pricing — absent.
- Audio/sound design, cursor systems (only partial), WebGPU-first, accessibility
  statements per keyword, i18n/RTL, e-commerce flows (cart/checkout), data-viz,
  map/geospatial, print/poster crossovers, loading/preloader vocabulary,
  error/empty-state vocabulary, microcopy/tone-of-voice keywords.
- Industry verticals exist in Website Types but keyword density per vertical is thin
  (fintech dashboards, medical, legal, devtools).

### C. Engineering gaps

- Preview cost: hundreds of simultaneous live canvases will chug; needs prioritized
  rendering budget if the wall goes keyword-dense.
- No analytics of what's picked most (can't rank "popular" honestly).
- Registry authoring friction: each new keyword needs schema+preview+tests — will not
  scale to a 2,000-keyword lexicon without a generator/templates.
- IP: competitor prompts are proprietary — must write original equivalents, never scrape.

## 3. What competitors prove users pay for

- **motionsites.ai:** category filter rail (Hero/Landing/SaaS/3D/Portfolio/AI/…),
  Featured/Popular/Recent tabs, video loop previews, an **MCP server**, backgrounds
  library, academy (education = retention).
- **getlayers.ai:** 59 templates, facet filters (tone dark/light × industry), layer
  counts on cards, sections/backgrounds/gradients as separate pickable asset types,
  favorites, weekly drops, freemium ($249).
- **awwwards:** the vocabulary the keywords must name — that's the moat.

## 4. The build that closes the gap (insane version)

**Prompt Lexicon OS** — new first-class entity `Keyword`:
category → subcategory → keyword (e.g. motion/transitions → "liquid wipe", "goo morph"),
each with: description sentence, compatible-with, aesthetic tags, intensity range,
live micro-preview recipe, LLM-export phrasing. Target 1,500–2,500 keywords, mostly
generated from typed templates + human-curated top 300.

New surfaces:
1. `/lexicon` — the entire wall: facet rail (category · tone · energy · tech) +
   chip wall + "stack tray" bottom bar. Click chips → stack builds → Compile.
2. Stack tray = the product. Persistent across pages, shareable (state in URL),
   export formats: v0 / Cursor / Claude / raw spec.
3. Motion picker & Math picker become studio-native: keyword families with
   curve/parameter chips visible on the card.
4. Named, curated "Whole Sites" (20–30 flagship artifacts) that decompose INTO the
   keyword stack — reverse-engineer any flagship into chips, edit, recompile.
5. Weekly drop cadence + Popular tab (anonymous local vote counts).

## 5. Risks

Content authoring at lexicon scale; preview render budget on dense walls; honesty
(do not claim competitor prompts are included); keyboard/a11y on chip walls; staying
deterministic+free while competitors charge.
