import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 04 — Typography Systems.                                   */
/* ------------------------------------------------------------------ */

export const TYPOGRAPHY_MODULES = [
  M({
    id: "typography/oversized",
    category: "typography", subcategory: "scale",
    name: "Oversized Display Type",
    tagline: "Headlines at architectural scale.",
    description:
      "Display type at 10–20vw sizes, cropped or bleeding, turns headlines into the primary visual element of a section.",
    prompt:
      "Set key headlines at architectural scale: clamp(4rem, {size}vw, 12rem) with tight tracking ({tracking}em) and line-height {lineHeight}, allowed to touch or crop at viewport edges where art direction calls for it. Oversized type must stay fluid — never fixed pixel sizes — and container-query awareness prevents blowouts at mid viewports.",
    implementation: "font-size: clamp() with vw middle term; letter-spacing negative at large sizes; check 768–1024px manually (the danger zone).",
    stack: ["CSS clamp()"],
    params: [
      range("size", "Scale (vw)", 14, 6, 22, 1, "vw", "Viewport-relative size driver"),
      range("tracking", "Tracking (em)", -0.03, -0.06, 0.05, 0.01, "em"),
      range("lineHeight", "Line height", 0.95, 0.85, 1.2, 0.01, ""),
    ],
    tags: ["oversized", "display", "big-type", "headline"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "vw-driven sizes never shrink below ~2.75rem; test at exactly 768px where vw math under-serves tablets.",
  }),
  M({
    id: "typography/kinetic",
    category: "typography", subcategory: "kinetic",
    name: "Kinetic Typography",
    tagline: "Type that performs the meaning.",
    description:
      "Kinetic type animates display text in loops or scrubs — cycling words, rippling lines, size waves — so type behavior carries meaning.",
    prompt:
      "Deploy kinetic typography for key statements: word cycling (masked vertical slide each {interval}s), size/weight waves rippling across letters, or scroll-scrubbed type growth. The animation must perform the message (LOUD gets louder, small shrinks). One kinetic hero element per page — typographic noise is worse than none.",
    implementation: "Split boundary: whole words via wrapping <span> overflow hidden; transform y-axis slides; font-variation-settings for weight waves; rAF or CSS keyframes only.",
    stack: ["CSS", "GSAP"],
    params: [
      range("interval", "Cycle interval", 2.4, 1.2, 6, 0.2, "s", "Seconds between word cycles"),
      select("behavior", "Behavior", "masked-cycle", ["masked-cycle", "weight-wave", "scroll-grow"]),
    ],
    tags: ["kinetic", "type-motion", "display", "loop"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "scroll"],
    a11y: "aria-label with the full static sentence on the animated element; reduced-motion shows the final state statically.",
    demo: "scramble",
  }),
  M({
    id: "typography/variable",
    category: "typography", subcategory: "scale",
    name: "Variable Font System",
    tagline: "One file, infinite weight — animated live.",
    description:
      "Variable fonts expose weight/width/optical axes that can be interpolated live: hover inflates a headline, scroll narrows a column width axis.",
    prompt:
      "Build the type system on variable fonts: use font-variation-settings axes (wght {wghtMin}–{wghtMax}, wdth where available) and animate axes on interaction — hover inflates display weight over 250ms, scroll progress can modulate wdth subtly. Pair with static fallbacks (nearest weight) for fonts without variable support.",
    implementation: "@font-face with font-variation-settings ranges; transitions on font-variation-settings directly; prefers-reduced-motion freezes axis animation.",
    stack: ["Variable fonts", "CSS"],
    params: [
      num("wghtMin", "Min weight", 300, 100, 900, 50),
      num("wghtMax", "Max weight", 800, 100, 900, 50),
    ],
    tags: ["variable-font", "weight", "interpolation", "axis"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["hover", "scroll", "animated"],
    a11y: "Weight animation never applies to body text — display sizes only.",
    fallback: "Nearest static weights via font-matched @font-face declarations.",
  }),
  M({
    id: "typography/condensed",
    category: "typography", subcategory: "scale",
    name: "Condensed Grotesk",
    tagline: "Poster density: more words per meter.",
    description:
      "Condensed grotesk display faces (Anton-style) pack uppercase headlines densely — the voice of posters, sports and streetwear.",
    prompt:
      "Set display headlines in a condensed grotesk at uppercase: high x-height, tight leading ({lineHeight}), slight positive tracking at small sizes only. Voice: poster-certain. Pair with a neutral text grotesk at body sizes and a mono for data. Condensed display never below 28px and never for body.",
    implementation: "display face via fontsource/woff2, font-stretch descriptors if variable-width available; body face separate family.",
    stack: ["Web fonts"],
    params: [range("lineHeight", "Caps line-height", 0.92, 0.85, 1.05, 0.01, "")],
    tags: ["condensed", "grotesk", "poster", "uppercase"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "typography/monospaced",
    category: "typography", subcategory: "scale",
    name: "Monospaced Data Layer",
    tagline: "Mono for everything systemic: labels, numbers, meta.",
    description:
      "A monospace layer reserved for systemic information: labels, captions, metrics, prices, timestamps — set small with wide tracking.",
    prompt:
      "Establish a monospaced data layer: all labels, captions, metrics, prices, IDs and timestamps set in mono at 11–13px, uppercase with tracking 0.08–0.14em and tabular numerals. Mono is the interface's measurement voice — it never sets prose, and display headlines stay in the display face.",
    implementation: "font-variant-numeric: tabular-nums; letter-spacing scale by size; cap line length for mono blocks at 60ch.",
    stack: ["Web fonts"],
    tags: ["mono", "data", "labels", "tabular"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/technical-blueprint"],
  }),
  M({
    id: "typography/editorial-serif",
    category: "typography", subcategory: "scale",
    name: "Editorial Serif Pairing",
    tagline: "Literary contrast: high-drama serif + quiet sans.",
    description:
      "The classic editorial pairing: a high-contrast serif with italic drama for headlines, a quiet humanist sans for UI and body.",
    prompt:
      "Pair an editorial serif with a quiet sans: serif carries headlines/decks with optical-size awareness (high contrast at display, sturdier at text), true italics used as emphasis events (single-word italic flicks), sans carries UI, captions, meta. Line-height 1.02–1.1 display, 1.5–1.6 body; punctuation hung where supported.",
    implementation: "font-optical-sizing: auto; hanging-punctuation: first; italic usage guideline: ≤3 words per viewport.",
    stack: ["Web fonts"],
    tags: ["serif", "editorial", "pairing", "literary"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/editorial", "websites/editorial"],
  }),
  M({
    id: "typography/geometric-sans",
    category: "typography", subcategory: "scale",
    name: "Geometric Sans System",
    tagline: "Circular o, engineered calm, universal confidence.",
    description:
      "Geometric sans-serifs project engineered clarity — ideal default for product and tech narratives, paired with mono for data.",
    prompt:
      "Set the system in a geometric sans: near-perfect circles and engineered proportions for display and UI, body at 16–18px/1.55, display tracking tightened (-0.02 to -0.03em) above 40px. Pair with a mono for data. The voice is competent calm — add attitude through layout and color, not letterform drama.",
    implementation: "Type scale 12/13/14/16/18/24/32/48/72 with role tokens; single family discipline (weights carry hierarchy).",
    stack: ["Web fonts"],
    tags: ["geometric", "sans", "clean", "product"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "typography/brutalist-type",
    category: "typography", subcategory: "scale",
    name: "Brutalist Type Stack",
    tagline: "System fonts and giant caps without manners.",
    description:
      "Brutalist typography: default system stacks (Times, Arial, monospace) at violent scale contrasts, unstyled-link energy, intentional rawness.",
    prompt:
      "Set brutalist typography: system stacks only (Times New Roman, Arial, ui-monospace), violent scale contrast (12px captions under 96px caps), zero tracking games, underlined links, and uppercase declarations. The rawness must be consistent and fast — this is a designed aesthetic, not a missing stylesheet.",
    implementation: "font-family: Times/Arial/mono stacks; line-height tight 0.9–1.0; no webfont requests at all (performance feature).",
    stack: ["System fonts"],
    tags: ["brutalist", "system-fonts", "raw", "caps"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/brutalism"],
  }),
  M({
    id: "typography/outline",
    category: "typography", subcategory: "treatment",
    name: "Outline / Stroke Type",
    tagline: "Hollow letterforms at mural scale.",
    description:
      "Outlined type renders huge letterforms as transparent fills with a stroke — massive scale without massive visual weight.",
    prompt:
      "Use outline/stroke type for mural-scale text: transparent fill with a {stroke}px stroke in the primary text color, typically as background statements or marquee content. Outline text is decorative and must duplicate real, accessible text (aria-hidden on the outline, real text in DOM).",
    implementation: "-webkit-text-stroke: {stroke}px + color: transparent; fallback: SVG stroke text for non-webkit engines.",
    stack: ["CSS"],
    params: [num("stroke", "Stroke width", 1, 1, 3, 0.5, "px")],
    tags: ["outline", "stroke", "hollow", "display"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "animated"],
    a11y: "Never use outline text as the sole carrier of information — always pair with visually-available real text.",
    demo: "marquee",
  }),
  M({
    id: "typography/stacked",
    category: "typography", subcategory: "treatment",
    name: "Stacked Type Blocks",
    tagline: "Three words, three lines, one monument.",
    description:
      "Stacked type breaks a statement into stacked full-width lines of equal width (justified via size), forming a monumental type block.",
    prompt:
      "Compose hero statements as stacked type: break the statement into {lines} lines, each sized to fill the same width (per-line font-size), uppercase, tight leading, each line optionally revealed in sequence. The block reads as one typographic monument and crops cleanly at section edges.",
    implementation: "Measure container width, compute per-line font-size for equal measure (fit-text technique); update on resize; reveal lines with 80ms stagger.",
    stack: ["CSS", "TypeScript"],
    params: [num("lines", "Line count", 3, 2, 5, 1)],
    tags: ["stacked", "block", "poster", "justify"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    responsive: "Line count may increase (re-wrap) under 640px before sizes are shrunk below legibility.",
  }),
  M({
    id: "typography/vertical",
    category: "typography", subcategory: "treatment",
    name: "Vertical Text",
    tagline: "Rotated rails of text along the margins.",
    description:
      "Vertical text runs along viewport or component edges — wayfinding labels, dates, folios — set with writing-mode or transform.",
    prompt:
      "Use vertical text for wayfinding rails: section labels, dates and folios set vertically along margins (writing-mode: vertical-rl) in mono caps with wide tracking. Vertical text is furniture, not content: it never carries primary information, and its hit area must not obstruct content on touch screens.",
    implementation: "writing-mode: vertical-rl with text-orientation: mixed; cap at ~20 characters; letter-spacing 0.15em+.",
    stack: ["CSS"],
    tags: ["vertical", "rotated", "rails", "folio"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "Hidden or rotated back to horizontal under 768px where margins don't exist.",
  }),
  M({
    id: "typography/text-mask",
    category: "typography", subcategory: "treatment",
    name: "Text as Image Mask",
    tagline: "Video or gradient lives inside the letterforms.",
    description:
      "Text masking clips imagery, video or animated gradients to the shape of giant letterforms — type as a window into media.",
    prompt:
      "Clip living media to letterforms: giant display text acts as a mask revealing video, an animated gradient, or a shader field inside the glyphs (background-clip: text with animated background, or SVG <mask>/<clipPath> for video). Text remains crisp at all sizes; media inside must be subtle enough that letterforms stay readable.",
    implementation: "background: url/video → background-clip: text + transparent fill for gradients/images; SVG mask for <video>; contrast floor: media luminance mid-range so edge detection survives.",
    stack: ["CSS", "SVG"],
    tags: ["mask", "clip", "video-text", "display"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Real text in DOM (visually-hidden if duplicates the mask); the masked instance is aria-hidden.",
    fallback: "Solid-color display text with the media as a separate figure.",
  }),
  M({
    id: "typography/text-on-path",
    category: "typography", subcategory: "treatment",
    name: "Text on a Path",
    tagline: "Sentences that orbit, arc and spiral.",
    description:
      "SVG textPath sets type along arbitrary curves — circular badges, arcing headlines, spiral annotations — and can animate along the path.",
    prompt:
      "Set selected display strings on SVG paths: circular badge text ('ROASTED IN SMALL BATCHES' orbiting a logo), arcing headline curves, or spiral annotation. Path geometry must be generous (radius ≥ 60px) so letters don't cramp; animate startOffset for slow orbiting loops.",
    implementation: "<text><textPath href=#path>; letter-spacing tuned per radius; animation on startOffset at 2–6%/s; decorative instances aria-hidden with real text elsewhere.",
    stack: ["SVG"],
    tags: ["textpath", "circular", "arc", "orbit"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "path-text",
  }),
  M({
    id: "typography/character-animation",
    category: "typography", subcategory: "kinetic",
    name: "Character Stagger Reveal",
    tagline: "Letters arrive one-by-one with intent.",
    description:
      "Character-level animation splits headlines into letters that arrive with stagger — the signature move of premium hero sequences.",
    prompt:
      "Animate hero headlines character-by-character: split into letters (grapheme-safe), each rising {rise}% with opacity 0→1 over {duration}ms, staggered {stagger}ms, easing {easing}. Trigger on load after fonts ready (avoid FOUC splits). Set aria-label on the parent with the intact string and aria-hidden on split children.",
    implementation: "Split via Intl.Segmenter or SplitText; inline-block per char in overflow-hidden wrappers; transform-only animation on compositor thread.",
    stack: ["GSAP SplitText", "Framer Motion"],
    params: [
      range("stagger", "Stagger", 24, 8, 80, 4, "ms"),
      range("duration", "Duration", 600, 200, 1400, 50, "ms"),
      range("rise", "Rise", 110, 40, 140, 5, "%"),
      select("easing", "Easing", "power4.out", ["power2.out", "power3.out", "power4.out", "expo.out", "cubic-bezier(0.22, 1, 0.36, 1)"]),
    ],
    tags: ["character", "stagger", "split-text", "reveal"],
    aliases: ["split text", "char animation"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Split children aria-hidden; parent carries aria-label; reduced-motion renders text fully formed.",
    demo: "char-stagger",
    suggests: ["typography/oversized"],
  }),
  M({
    id: "typography/word-scramble",
    category: "typography", subcategory: "kinetic",
    name: "Text Scramble Decode",
    tagline: "Glyphs permute, then resolve into words.",
    description:
      "Text scramble cycles random glyphs through each character slot before locking the real character — a decode effect with terminal/hacker energy.",
    prompt:
      "Apply a text-scramble decode to short strings (labels, section titles, status lines): each character slot cycles random glyphs from a charset for {duration}ms, locking in the real characters left-to-right (or random order), at {fps} glyph fps. Use for emphasis moments only; never body text; total effect under 1.2s.",
    implementation: "rAF loop with per-char lock timers; charset like '!<>-_\\/[]{}—=+*^?#'; pause off-screen via IntersectionObserver.",
    stack: ["TypeScript", "rAF"],
    params: [
      range("duration", "Total decode time", 900, 300, 2000, 50, "ms"),
      range("fps", "Glyph updates/sec", 24, 8, 60, 2, "fps"),
    ],
    tags: ["scramble", "decode", "hacker", "terminal"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "aria-label with final string; reduced-motion skips to final string instantly.",
    demo: "scramble",
  }),
  M({
    id: "typography/text-morph",
    category: "typography", subcategory: "kinetic",
    name: "Word Morph / Swap",
    tagline: "One word dissolves into the next.",
    description:
      "Word morphing swaps a rotating keyword within a sentence using blur/opacity/weight transitions — 'We build brands / interfaces / worlds.'",
    prompt:
      "Rotate a keyword in the hero sentence via morph: the outgoing word blurs+falls, the incoming rises+sharpens over {duration}ms every {interval}s, or interpolate font-variation weight/width between states when the face allows. The swap point is grammatical (same part of speech) so the sentence never breaks.",
    implementation: "Fixed-width slot with overflow hidden; exit/enter as transform+filter:blur(6px); layout width reserved by max word.",
    stack: ["Framer Motion"],
    params: [
      range("duration", "Morph duration", 450, 200, 1200, 50, "ms"),
      range("interval", "Hold interval", 2.6, 1.4, 6, 0.2, "s"),
    ],
    tags: ["morph", "swap", "rotate", "words"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "Rotation pauses when focused/hovered; aria-live=off (don't announce the churn); reduced-motion shows the first option.",
  }),
  M({
    id: "typography/gradient-type",
    category: "typography", subcategory: "treatment",
    name: "Gradient Typography",
    tagline: "Letterforms filled with moving light.",
    description:
      "Gradient-filled display type with optional animated sweep — color does expressive work inside the glyph shapes.",
    prompt:
      "Fill display type with a gradient: {stops} stops across a {angle}° angle, optionally animated with a slow position sweep ({speed}s loop) so light moves through the letters. Gradient stops must preserve 4.5:1 contrast of the effective average against the background; body text never gets gradient fills.",
    implementation: "background: linear-gradient + background-clip: text + color: transparent; sweep via animating background-position with oversized background-size; forced-colors mode falls back to solid text.",
    stack: ["CSS"],
    params: [
      num("stops", "Color stops", 3, 2, 5, 1),
      range("angle", "Angle", 100, 0, 360, 10, "deg"),
      range("speed", "Sweep duration", 8, 0, 30, 1, "s", "0 = static gradient"),
    ],
    tags: ["gradient", "color", "display", "sweep"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Contrast computed on the gradient's average luminance; in forced-colors/high-contrast mode render solid CanvasText.",
    demo: "gradient-sweep",
  }),
  M({
    id: "typography/text-wave",
    category: "typography", subcategory: "kinetic",
    name: "Sine Wave Text",
    tagline: "Letters riding an actual sine.",
    description:
      "Characters displace along a traveling sine — y-offset per glyph computed as sin(phase + index·freq) — giving literal liquid typography.",
    prompt:
      "Animate a display string as a literal sine wave: each character's y-offset = amplitude({amplitude}px) · sin(time·{speed} + index·{freq}), with optional per-char rotation proportional to the derivative. Wave parameters are real values the implementer can tune; amplitude stays under 0.5em to preserve readability.",
    implementation: "Per-char spans transformed per frame via rAF; single transform string per char; skip work when offscreen; amplitude capped at 0.5em.",
    stack: ["rAF", "TypeScript"],
    params: [
      range("amplitude", "Amplitude", 12, 2, 40, 1, "px"),
      range("freq", "Spatial frequency", 0.5, 0.1, 2, 0.1, "rad/char"),
      range("speed", "Wave speed", 1.4, 0.2, 6, 0.1, "rad/s"),
    ],
    tags: ["sine", "wave", "liquid", "letters"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Reduced-motion renders static text; maximum 24 chars treated to cap cost.",
    demo: "char-stagger",
  }),
  M({
    id: "typography/distortion",
    category: "typography", subcategory: "kinetic",
    name: "Distortion Type (WebGL)",
    tagline: "Letterforms kneaded by shaders.",
    description:
      "WebGL text distortion renders display copy to a texture and displaces it in a fragment shader — ripples, smears or melt driven by pointer or noise.",
    prompt:
      "Distort hero text via WebGL: render the exact display string to an offscreen texture (draw text to canvas at 2x), then displace UVs in a fragment shader driven by {driver} (pointer velocity, sonic sine, or fBM noise) with intensity {intensity}. Keep the effect subtle (UV offset < 4% of size) and provide the plain-text DOM fallback beneath.",
    implementation: "Canvas texture → PlaneGeometry + custom ShaderMaterial in Three/R3F; pointer velocity as uniform; DOM text remains for a11y/SEO (visually hidden).",
    stack: ["Three.js", "GLSL"],
    params: [
      select("driver", "Distortion driver", "pointer-velocity", ["pointer-velocity", "sine-field", "fbm-noise"]),
      range("intensity", "Intensity", 1.6, 0.2, 4, 0.1, "x"),
    ],
    tags: ["distortion", "webgl", "shader", "melt"],
    difficulty: "advanced", perf: "heavy", dimension: "both", interactivity: ["pointer", "animated"],
    fallback: "Plain styled display text; the shader is an enhancement layer.",
    suggests: ["webgl/distortion-shader", "engineering/webgl-fallback"],
  }),
];
