/* ------------------------------------------------------------------ */
/*  PromptForge LEXICON — the keyword layer.                            */
/*  A Keyword is the atomic, individually-clickable unit of prompting:  */
/*  "liquid glass", "magnetic cursor", "fBM warp" — each ownable.       */
/*  Keywords derive from the 279-module registry AND add curated        */
/*  micro-keywords for motion graphics + mathematical graphics.         */
/* ------------------------------------------------------------------ */

import { MODULES, type PromptModule } from "@/lib/studio";
import { resolveParams } from "@/lib/studio/params";

export type Energy = "calm" | "kinetic" | "extreme";

export interface Keyword {
  /** unique id, e.g. "kw:motion/scroll-reveal" or "kw:micro/liquid-glass" */
  id: string;
  /** chip label */
  name: string;
  /** ready-to-inject prompt sentence(s) */
  phrase: string;
  /** family = top group on the wall */
  fam: "Objective" | "Direction" | "Layout" | "Typography" | "Color" |
       "Motion" | "Math" | "3D & Shaders" | "Backgrounds" | "Interaction" | "Quality";
  /** subcategory label inside the family */
  sub: string;
  tags: string[];
  energy: Energy;
  /** source module id when derived from the registry (gives live previews) */
  module?: string;
}

const FAM_MAP: Record<string, Keyword["fam"]> = {
  websites: "Objective", direction: "Direction", layout: "Layout",
  typography: "Typography", color: "Color", motion: "Motion", math: "Math",
  webgl: "3D & Shaders", backgrounds: "Backgrounds", interaction: "Interaction",
  engineering: "Quality",
};

const ENERGY_MAP: Record<string, Energy> = {
  motion: "kinetic", math: "kinetic", webgl: "extreme", interaction: "kinetic",
  direction: "calm", color: "calm", layout: "calm", typography: "calm",
  websites: "calm", backgrounds: "kinetic", engineering: "calm",
};

function phraseOf(mod: PromptModule): string {
  // interpolate the module's prompt template with its validated defaults
  const params = resolveParams(mod, {});
  return mod.prompt.replace(/\{(\w+)\}/g, (m, k) =>
    params[k] !== undefined ? String(params[k]) : m.replace(/[{}]/g, ""));
}

/* ---------------------- derived keywords (279) ---------------------- */

export const MODULE_KEYWORDS: Keyword[] = MODULES.map((mod) => ({
  id: `kw:${mod.id}`,
  name: mod.name,
  phrase: phraseOf(mod),
  fam: FAM_MAP[mod.category] ?? "Quality",
  sub: mod.subcategory,
  tags: [mod.category, mod.subcategory, ...(mod.aliases ?? [])].map((t) => t.toLowerCase()),
  energy: ENERGY_MAP[mod.category] ?? "calm",
  module: mod.id,
}));

/* --------------- curated micro-keywords (the lexicon the --------------- */
/* --------------- awwwards vocabulary actually speaks) --------------- */

function kw(
  id: string, name: string, phrase: string,
  fam: Keyword["fam"], sub: string, energy: Energy, tags: string[] = [],
): Keyword {
  return { id: `kw:micro/${id}`, name, phrase, fam, sub, tags: tags.map((t) => t.toLowerCase()), energy };
}

export const MICRO_KEYWORDS: Keyword[] = [
  /* Motion grammar */
  kw("liquid-wipe", "Liquid Wipe", "Scene transitions use a liquid wipe: an SVG turbulence-displaced mask sweeps the frame over 900ms with an ease-out-expo curve, content crossfading through the displacement mid-sweep.", "Motion", "Transitions", "extreme", ["liquid", "transition", "svg"]),
  kw("goo-morph", "Goo Morph", "Interactive elements morph with a goo filter (SVG feGaussianBlur + feColorMatrix contrast): elements merge and separate like liquid metal on proximity.", "Motion", "Micro-interactions", "extreme", ["goo", "svg filter"]),
  kw("magnetic-cursor", "Magnetic Cursor", "The cursor is a custom ring that lerps to the pointer; interactive elements magnetically attract its center within a 120px field, springing back on leave (stiffness 190, damping 16).", "Motion", "Cursor", "kinetic", ["cursor", "magnetic"]),
  kw("spring-entrance", "Spring Entrances", "Every entrance uses physics springs, never bezier tweens: stiffness 180–420, damping tuned to zero overshoot for UI and playful overshoot for hero moments.", "Motion", "Grammar", "kinetic", ["spring", "physics"]),
  kw("char-cascade", "Per-Character Cascade", "Headlines animate glyph-by-glyph: each character rises 0.4em, de-blurs and un-skews on an 18–24ms stagger, blur 6px→0, skewY 5°→0.", "Motion", "Kinetic Type", "kinetic", ["type", "stagger"]),
  kw("scroll-jacked-gallery", "Scroll-Jacked Gallery", "A pinned horizontal gallery driven by vertical scroll: scroll distance maps 1:1 to gallery translation with spring smoothing; sections snap with explicit thresholds.", "Motion", "Scroll", "extreme", ["scroll", "gallery", "pinned"]),
  kw("velocity-skew", "Scroll Velocity Skew", "Cards and media skew (max 4°) and subtly compress proportional to scroll velocity, easing back to rest in 300ms when scrolling stops.", "Motion", "Scroll", "kinetic", ["velocity", "skew"]),
  kw("hover-distortion", "Hover Distortion", "Media distorts on hover via WebGL displacement: a drifting noise texture drives vertex displacement; pointer leave eases amplitude to zero over 400ms.", "Motion", "Hover", "extreme", ["webgl", "displacement"]),
  kw("index-flip", "Index Flip Counters", "Numbers flip like a split-flap board: each digit rotates through its column on value change, 60ms per flip, tabular-nums enforced so layout never jiggles.", "Motion", "Numbers", "kinetic", ["counter", "numbers"]),
  kw("page-bloom", "Bloom Page Reveal", "The initial page load runs a single bloom flash: a warm radial gradient scales 0.6→1.6 and fades over 1.8s, then never repeats.", "Motion", "Load", "kinetic", ["load", "bloom", "preloader"]),
  kw("text-scramble-loop", "Idle Text Scramble", "Key labels scramble through random glyphs then resolve on hover; idle loops are forbidden — scramble only fires on interaction.", "Motion", "Kinetic Type", "kinetic", ["scramble", "type"]),
  kw("drag-inertia", "Drag with Inertia", "Draggable elements use real physics: drag follows the pointer 1:1, release applies momentum with stiffness 260 / damping 24 springs, edges rubber-band.", "Motion", "Gestures", "kinetic", ["drag", "physics"]),

  /* Mathematical graphics */
  kw("fbm-warp-bg", "fBM Domain-Warp Background", "The hero background is a full-screen GLSL fBM shader: 5-octave fractal noise domain-warped twice, drifting slowly; palette maps noise amplitude to the brand ramp.", "Math", "Shaders", "extreme", ["fbm", "noise", "shader", "background"]),
  kw("voronoi-cells", "Voronoi Cell Field", "Surfaces are partitioned by an animated Voronoi diagram: cell sites drift on curl noise, edge lines brighten near the pointer, cell fill tracks pointer distance.", "Math", "Fields", "extreme", ["voronoi", "cells"]),
  kw("sdf-raymarch", "SDF Raymarched Object", "The centerpiece is a raymarched signed-distance-field object (torus knot or metaball cluster) with soft shadows and one rim light; resolution scales to device.", "Math", "Raymarching", "extreme", ["sdf", "raymarch", "3d"]),
  kw("lissajous-trails", "Lissajous Trails", "Ambient motion follows Lissajous curves (a=3, b=4): a particle head with an 80-frame fading trail draws harmonic figures behind content, opacity under 0.2.", "Math", "Curves", "kinetic", ["lissajous", "particles"]),
  kw("golden-spiral-layout", "Golden-Ratio Spiral Rhythm", "Card and image placements step around a golden-ratio spiral: each successive block scales by 0.618 and rotates 90° around the composition's focal point.", "Math", "Composition", "calm", ["golden ratio", "layout"]),
  kw("matrix-rain-tokens", "Token Rain", "A background column-rain of the project's own tokens (color hexes, easing names) falls at staggered speeds in 9px mono, alpha 0.08 — homage to matrix rain, but it speaks brand.", "Math", "Ambient", "kinetic", ["matrix", "rain", "mono"]),
  kw("bezier-ruler-lines", "Bézier Connector Ink", "Related cards are connected by animated cubic-Bézier ink strokes that draw on (pathLength 0→1) when both endpoints are in view.", "Math", "SVG", "kinetic", ["bezier", "svg", "paths"]),
  kw("perlin-flow-field", "Perlin Flow Particles", "Hundreds of particles follow a Perlin flow field, speed mapped to field curl; the field slowly rotates. Particles wrap edges; color shifts with velocity.", "Math", "Fields", "kinetic", ["perlin", "flow", "particles"]),
  kw("easing-exhibit", "Easing Exhibit", "Complex UIs expose their motion: hover any animated element to reveal its easing curve plotted live on a mini graph with the cubic-bezier values labeled.", "Math", "Data-viz", "kinetic", ["easing", "graph", "data"]),

  /* UI craft — the missing vocabulary */
  kw("glass-command-bar", "Glass Command Nav", "Navigation is a frosted-glass command bar: 16px backdrop blur with 160% saturation, 1px hairline border, active route carries a sliding pill indicator via layout animation.", "Layout", "Navigation", "calm", ["nav", "glass"]),
  kw("ghost-preloader", "Minimal Preloader", "If loading exceeds 400ms, show a minimal preloader: wordmark + a single progress percentage counting to 100, then a 300ms fade; never block interaction on cache hits.", "Motion", "Load", "calm", ["preloader", "loading"]),
  kw("empty-state-poetry", "Designed Empty States", "Every empty, error and loading state is designed: a one-line explanation, one illustrative mark, one safe next action. Nothing renders a blank box.", "Quality", "States", "calm", ["empty state", "error"]),
  kw("microcopy-voice", "Voice-Consistent Microcopy", "All microcopy obeys one voice: short imperative verbs for actions, warm declaratives for confirmations, no jargon, no exclamation-mark inflation.", "Typography", "Copy", "calm", ["copy", "tone"]),
  kw("hairline-grid", "Hairline Grid System", "Sections divide on 1px hairlines (8% white on dark) with 72px baseline rhythm; content never touches a hairline — 24px minimum inset.", "Layout", "Grid", "calm", ["grid", "hairline"]),
  kw("stacked-pricing", "Comparison Pricing", "Pricing presents three tiers as a comparison system: middle tier elevated and ember-accented, annual/monthly toggle with a layout-animated highlight, feature rows in tabular numerals.", "Layout", "Commerce", "calm", ["pricing", "commerce"]),
  kw("cart-drawer", "Slide-In Cart", "Commerce flows use a right-edge drawer: items list with thumbnail hairlines, quantity steppers, a sticky total bar, and ESC/backdrop dismissal with scroll lock.", "Interaction", "Commerce", "kinetic", ["cart", "ecommerce", "drawer"]),
  kw("chroma-aberration", "Chromatic Aberration Focus", "On hero moments only, edges carry 2px RGB chromatic aberration that collapses to zero as content settles — the lens focusing metaphor.", "3D & Shaders", "Post-FX", "extreme", ["chromatic", "postfx"]),
  kw("dithered-gradient", "Dithered Gradients", "Large gradients are ordered-dithered (8×8 Bayer matrix) to kill banding; the dither pattern is part of the aesthetic, visible at 200% zoom.", "Color", "Texture", "calm", ["gradient", "dither"]),
  kw("noise-tattoo", "Grain Tattoo Overlay", "The whole page carries a film-grain overlay (SVG turbulence, 5% opacity, overlay blend) — texture unifies every surface like one printed object.", "Backgrounds", "Texture", "calm", ["grain", "noise"]),
];

export const LEXICON: Keyword[] = [...MODULE_KEYWORDS, ...MICRO_KEYWORDS];
export const LEXICON_MAP = new Map(LEXICON.map((k) => [k.id, k]));

export const FAMILIES = [...new Set(LEXICON.map((k) => k.fam))];
export function familyCount(fam: string) {
  return LEXICON.filter((k) => k.fam === fam).length;
}
export function searchLexicon(q: string, fam?: string, energy?: Energy): Keyword[] {
  const n = q.trim().toLowerCase();
  return LEXICON.filter(
    (k) =>
      (!fam || k.fam === fam) &&
      (!energy || k.energy === energy) &&
      (!n || k.name.toLowerCase().includes(n) || k.tags.some((t) => t.includes(n)) ||
        k.phrase.toLowerCase().includes(n)),
  );
}

/* ------------------------- named whole sites ------------------------- */
/*  Flagship artifacts that decompose INTO the keyword stack.           */

export interface Artifact {
  id: string;
  name: string;
  blurb: string;
  industry: string;
  tone: "Dark" | "Light";
  /** headline keyword ids composing this site */
  stack: string[];
  /** curation date (authored metadata) — powers the Recent tab */
  added: string;
}

const A = (
  id: string, name: string, blurb: string, industry: string,
  tone: "Dark" | "Light", stack: string[], added: string,
): Artifact => ({ id, name, blurb, industry, tone, stack, added });

export const ARTIFACTS: Artifact[] = [
  A("obsidian-forge", "Obsidian Forge", "Dev-tool launch site: ember bloom hero, char-cascade type, SDF orb centerpiece.", "AI / Tech", "Dark",
    ["kw:micro/page-bloom", "kw:micro/char-cascade", "kw:micro/sdf-raymarch", "kw:micro/spring-entrance", "kw:micro/hairline-grid"], "2026-11-08"),
  A("lumiere-atelier", "Lumière", "Light-tone luxury e-commerce: liquid wipes between scenes, magnetic cursor, dithered silk gradients.", "E-commerce", "Light",
    ["kw:micro/liquid-wipe", "kw:micro/magnetic-cursor", "kw:micro/dithered-gradient", "kw:micro/cart-drawer", "kw:micro/microcopy-voice"], "2026-11-05"),
  A("golden-spiral", "Golden Portal", "Architecture portfolio arranged on the golden-ratio spiral; scroll velocity skews the masonry.", "Portfolio", "Dark",
    ["kw:micro/golden-spiral-layout", "kw:micro/velocity-skew", "kw:micro/scroll-jacked-gallery", "kw:micro/noise-tattoo"], "2026-10-29"),
  A("saffron-field", "Saffron Field", "Wellness brand over a breathing Perlin flow field; goo-morph buttons; whisper-quiet microcopy.", "Health", "Light",
    ["kw:micro/perlin-flow-field", "kw:micro/goo-morph", "kw:micro/microcopy-voice", "kw:micro/ghost-preloader"], "2026-11-03"),
  A("axon-ledger", "AXON Ledger", "Fintech dashboard: split-flap counters, easing-exhibit transparency, hairline grid discipline.", "Fintech", "Dark",
    ["kw:micro/index-flip", "kw:micro/easing-exhibit", "kw:micro/hairline-grid", "kw:micro/empty-state-poetry", "kw:websites/fintech-dashboard"], "2026-10-21"),
  A("ink-reveal", "Ink Reveal", "Editorial magazine: Bézier ink connects related stories; headlines scramble on hover.", "Editorial", "Dark",
    ["kw:micro/bezier-ruler-lines", "kw:micro/text-scramble-loop", "kw:micro/char-cascade", "kw:typography/word-scramble"], "2026-10-19"),
  A("terra-node", "Terra Node", "Climate data story over an animated Voronoi territory field that reacts to the pointer.", "Science", "Dark",
    ["kw:micro/voronoi-cells", "kw:micro/velocity-skew", "kw:micro/easing-exhibit", "kw:math/voronoi"], "2026-10-17"),
  A("velvet-static", "Velvet Static", "Music label site: token-rain of release codes, fBM warp hero, drag-inertia release carousel.", "Music", "Dark",
    ["kw:micro/matrix-rain-tokens", "kw:micro/fbm-warp-bg", "kw:micro/drag-inertia", "kw:micro/chroma-aberration"], "2026-10-13"),
  A("house-of-lines", "House of Lines", "Design studio: everything on a hairline grid, spring entrances only, ghost preloader under 400ms.", "Agency", "Light",
    ["kw:micro/hairline-grid", "kw:micro/spring-entrance", "kw:micro/ghost-preloader", "kw:micro/glass-command-bar"], "2026-10-07"),
  A("petal-index", "Petal Index", "Fragrance e-commerce with lissajous halo ambience and a slide-in cart.", "E-commerce", "Light",
    ["kw:micro/lissajous-trails", "kw:micro/cart-drawer", "kw:micro/magnetic-cursor", "kw:micro/stacked-pricing"], "2026-10-02"),
  A("mono-forge", "Mono Forge", "Docs platform wearing mono as couture: token rain background, scramble resolve, empty-state poetry.", "DevTools", "Dark",
    ["kw:micro/matrix-rain-tokens", "kw:micro/text-scramble-loop", "kw:micro/empty-state-poetry", "kw:micro/glass-command-bar"], "2026-09-28"),
  A("kernel-harbor", "Kernel Harbor", "SaaS with a scroll-jacked product tour and spring-snap section thresholds.", "SaaS", "Dark",
    ["kw:micro/scroll-jacked-gallery", "kw:micro/spring-entrance", "kw:micro/ghost-preloader", "kw:micro/stacked-pricing"], "2026-09-24"),

  /* -- "our own takes" wave: original PromptForge builds in the styles  */
  /* -- the showcase galleries made famous. Every stack keys a real      */
  /* -- registry module, so every card and theatre previews LIVE.        */
  A("synapse-portrait", "Synapse Portrait", "A human silhouette authored from 60k drifting particles that scatter from the pointer and reform on a spring — scroll descends the camera through the head into the work.", "Portfolio", "Dark",
    ["kw:motion/particle-morph", "kw:motion/image-particles", "kw:micro/char-cascade", "kw:micro/page-bloom", "kw:motion/scroll-3d-camera"], "2026-11-10"),
  A("aurelia-orb", "Aurelia Orb", "A chrome point-cloud sphere built from the site's own media, rotating in three-space; panels orbit it as scroll scrubs the camera path.", "Interactive", "Dark",
    ["kw:webgl/point-cloud", "kw:motion/camera-orbit", "kw:motion/scroll-scrub", "kw:micro/magnetic-cursor"], "2026-11-09"),
  A("static-age", "Static Age", "Archive-culture vaporwave: CRT plasma haze, tracking-error image treatment, per-character index typography.", "Portfolio", "Dark",
    ["kw:backgrounds/plasma-field", "kw:typography/character-animation", "kw:micro/noise-tattoo", "kw:micro/text-scramble-loop"], "2026-11-06"),
  A("valley-of-forms", "Valley of Forms", "A procedurally-grown meadow: flow-field blooms and fog depth respond to scroll; nothing is a video, everything is math.", "Creative", "Dark",
    ["kw:math/procedural-landscape", "kw:math/flow-field", "kw:math/volumetric-fog-math", "kw:micro/perlin-flow-field"], "2026-11-04"),
  A("mercury-store", "Mercury Store", "Liquid-metal e-commerce: product cards skim over a mercury pond; hover displacement ripples the material; cart slides from the right.", "E-commerce", "Dark",
    ["kw:backgrounds/liquid-metal-bg", "kw:micro/hover-distortion", "kw:micro/cart-drawer", "kw:micro/spring-entrance"], "2026-11-01"),
  A("ribbon-reel", "Ribbon Reel", "A fashion lookbook carried on an endless media ribbon: horizontal scrub, velocity skew, per-look pinning.", "Fashion", "Light",
    ["kw:motion/horizontal-scroll", "kw:micro/velocity-skew", "kw:micro/scroll-jacked-gallery", "kw:motion/scroll-velocity"], "2026-10-30"),
  A("mind-fold", "Mind Fold", "AI landing page under a living fBM sky: domain-warped clouds resolve to the product wordmark as you pass the hero fold.", "AI", "Dark",
    ["kw:math/fbm", "kw:math/domain-warping", "kw:micro/fbm-warp-bg", "kw:motion/text-mask-reveal"], "2026-10-26"),
  A("coral-synapse", "Coral Synapse", "A reaction-diffusion organism coats the background and grows toward the cursor; pricing floats as hairline cards above it.", "SaaS", "Dark",
    ["kw:math/reaction-diffusion", "kw:micro/stacked-pricing", "kw:micro/hairline-grid", "kw:micro/noise-tattoo"], "2026-10-23"),
  A("ink-office", "Ink Office", "Charcoal-and-paper agency: Bézier ink connects case studies, chapters wipe with a liquid mask.", "Agency", "Light",
    ["kw:micro/bezier-ruler-lines", "kw:motion/liquid-transition", "kw:micro/microcopy-voice", "kw:micro/goo-morph"], "2026-10-18"),
  A("halo-index", "Halo Index", "Photography index where the cursor drags a trail of thumbnails that resolve and stack, then wipe into the full piece.", "Portfolio", "Dark",
    ["kw:motion/cursor-media-trail", "kw:micro/page-bloom", "kw:motion/inertia-scroll", "kw:micro/chroma-aberration"], "2026-10-15"),
  A("terrain-atlas", "Terrain Atlas", "Travel journal over marching-cubes terrain; each chapter carves a new contour band as you read.", "Travel", "Dark",
    ["kw:math/marching-cubes", "kw:math/procedural-landscape", "kw:motion/scroll-typography", "kw:micro/char-cascade"], "2026-10-11"),
  A("echo-chamber", "Echo Chamber", "Audio-visual label: particles pump to the track's spectrum; every transition lands on the kick.", "Music", "Dark",
    ["kw:motion/audio-reactive-particles", "kw:backgrounds/audio-reactive-bg", "kw:micro/drag-inertia", "kw:micro/magnetic-cursor"], "2026-10-08"),
];
