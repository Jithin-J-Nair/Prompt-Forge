import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 05 — Color, Materials & Texture.                           */
/* ------------------------------------------------------------------ */

export const COLOR_MODULES = [
  M({
    id: "color/monochrome-ramp",
    category: "color", subcategory: "palettes",
    name: "Monochrome Ramp",
    tagline: "9 steps of one hue, nothing else.",
    description:
      "A single-hue ramp from near-black to near-white drives every surface, text and border value in the interface.",
    prompt:
      "Build the palette as a monochrome ramp: define {steps} steps of the base hue (HSL lightness from 4% to 98%) as CSS custom properties (--c-050…--c-950); every color in the UI maps to exactly one ramp token. Hierarchy comes from value contrast. One rationed accent may exist for interactive affordance only.",
    implementation: "Generate ramp in HSL lightness stops; document pairing rules (text 950 on 050 etc.); verify every pair ≥ 4.5:1 for text.",
    stack: ["CSS custom properties"],
    params: [num("steps", "Ramp steps", 9, 5, 11, 2)],
    tags: ["monochrome", "palette", "ramp", "minimal"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
    suggests: ["direction/monochromatic"],
  }),
  M({
    id: "color/duotone",
    category: "color", subcategory: "palettes",
    name: "Duotone Imagery",
    tagline: "Two inks rebuild every photograph.",
    description:
      "Duotone maps image luminance to a two-color gradient — photographs, staff portraits and product shots unify into the brand system.",
    prompt:
      "Apply duotone treatment to photography: map image shadows to {shadow} and highlights to {highlight} so all imagery becomes two-ink. Keep skin tones bearable by biasing the midtone; provide full-color reveal on hover/focus at PDP or portrait level where identity matters.",
    implementation: "SVG feColorMatrix (luminance→alpha over a two-stop gradient) or CSS filter: grayscale(1) + multiply/screen layers; precompute with a build-time transform for performance.",
    stack: ["SVG filters", "CSS"],
    params: [
      select("shadow", "Shadow ink", "ink #0B0B12", ["ink #0B0B12", "forest #0E1F16", "plum #1C0E24", "espresso #160E07"]),
      select("highlight", "Highlight ink", "ivory #F2EDE6", ["ivory #F2EDE6", "paper #F7F4EC", "blush #F5E3E0", "sky #E3EEF7"]),
    ],
    tags: ["duotone", "photography", "ink", "treatment"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["hover"],
    a11y: "Duotone must not destroy content legibility of informational images (charts stay full-fidelity).",
  }),
  M({
    id: "color/multicolor-gradient",
    category: "color", subcategory: "gradients",
    name: "Multicolor Gradient",
    tagline: "A chord of colors, not a chord of noise.",
    description:
      "Multicolor gradients blend 3–5 brand colors along one axis; stop discipline (values in the same lightness family) keeps them expensive rather than garish.",
    prompt:
      "Deploy a multicolor brand gradient: {stops} stops at a {angle}° angle with all stops in the same lightness family (avoid rainbow mud) — commonly across CTAs, section glows or display text. Specify exact hexes and stop positions; the gradient is a brand asset and never improvised per-component.",
    implementation: "linear-gradient({angle}deg, c1 0%, c2 38%, c3 69%, c4 100%); locked in tokens; test against APCA for any text usage.",
    stack: ["CSS"],
    params: [
      num("stops", "Stops", 3, 2, 5, 1),
      range("angle", "Angle", 115, 0, 360, 15, "deg"),
    ],
    tags: ["gradient", "multicolor", "brand", "chord"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "color/mesh-gradient",
    category: "color", subcategory: "gradients",
    name: "Mesh Gradient",
    tagline: "Freeform color fields with focal blooms.",
    description:
      "Mesh gradients place multiple radial color blooms that blend into a continuous field — the contemporary 'ambient brand' backdrop.",
    prompt:
      "Compose a mesh gradient: {blooms} radial blooms positioned at art-directed anchor points, each fading to transparent, layered over a base color; optional slow drift ({speed}s cycle) via animating bloom positions. The result reads as atmosphere, not a stripe. Bake to CSS layered radial-gradients or a canvas render for animation.",
    implementation: "Layered radial-gradient backgrounds (background-blend optional) or an offscreen canvas blurred; animation via transform on a 120%-sized layer to avoid repaints.",
    stack: ["CSS", "Canvas"],
    params: [
      num("blooms", "Bloom count", 4, 2, 8, 1),
      range("speed", "Drift cycle", 24, 0, 60, 2, "s", "0 = static"),
    ],
    tags: ["mesh", "gradient", "ambient", "bloom"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Background layer is decorative (aria-hidden); never sits under small text without a surface scrim.",
    demo: "mesh-gradient",
    suggests: ["color/aurora"],
  }),
  M({
    id: "color/aurora",
    category: "color", subcategory: "gradients",
    name: "Aurora Gradient",
    tagline: "Northern-lights bands sweeping slowly.",
    description:
      "Aurora gradients animate broad, soft color bands with slow sinusoidal sweep — ethereal but controllable.",
    prompt:
      "Create an aurora backdrop: 2–3 elongated, heavily blurred bands of color drifting on slow sinusoidal paths ({speed}s cycles, out of phase), blended softly (screen or normal at 60–80% opacity) and masked to the hero zone. Motion is glacial; the aurora should be felt more than watched.",
    implementation: "Oversized blurred gradient divs animated with transform keyframes; blur via SVG filter or CSS blur(80px+) at low opacity; transform-only.",
    stack: ["CSS"],
    params: [range("speed", "Cycle", 28, 12, 90, 2, "s")],
    tags: ["aurora", "northern-lights", "gradient", "ambient"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Static under prefers-reduced-motion — the aurora freezes as a still field.",
    demo: "aurora",
  }),
  M({
    id: "color/conic-gradient",
    category: "color", subcategory: "gradients",
    name: "Conic Gradient",
    tagline: "Color wrapped around a pivot point.",
    description:
      "Conic gradients sweep colors around a center — color wheels, donalds, beam sweeps and loading orbits.",
    prompt:
      "Use conic gradients where color should orbit: color-wheel moments, loading sweeps, 'beam' accents rotating slowly behind focal elements. A rotating conic beam behind a CTA (mask to a ring) is the single signature use — more than one conic animation per viewport is a carnival.",
    implementation: "conic-gradient(from θ at x y, stops); rotation via animating a custom @property --angle for smooth GPU-friendly spin.",
    stack: ["CSS @property"],
    tags: ["conic", "wheel", "beam", "orbit"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "color/holographic",
    category: "color", subcategory: "light",
    name: "Holographic / Iridescent Foil",
    tagline: "Oil-slick color that answers the pointer.",
    description:
      "Holographic materials shift hue with angle — a thin prism film over surfaces that reacts to device tilt or pointer position.",
    prompt:
      "Apply holographic foil to select surfaces (cards, badges, emblem): a prismatic gradient overlay (multi-hue, 40° rotated) whose hue-rotation/position follows pointer x/y or deviceorientation; effect opacity {opacity}% so the base material survives. Foil accents only ever cover 10–20% of a viewport.",
    implementation: "Overlay layer: linear-gradient(115deg, spectral stops) + mix-blend-mode: color-dodge/overlay, CSS vars updated from pointermove (rAF-throttled).",
    stack: ["CSS", "pointer events"],
    params: [range("opacity", "Foil intensity", 55, 15, 90, 5, "%")],
    tags: ["holographic", "iridescent", "foil", "prism"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    responsive: "On touch, foil animates on a slow autonomous loop instead of pointer-tracking.",
  }),
  M({
    id: "color/chrome",
    category: "color", subcategory: "materials",
    name: "Chrome / Liquid Metal",
    tagline: "Polished metal text and emblems.",
    description:
      "Chrome styling fakes polished metal on display type or emblems using stacked gradients: hot band, cool band, reflection line.",
    prompt:
      "Render display type or emblems as chrome: a vertical multi-band gradient (dark → bright highlight band at 40% → mid → secondary highlight → dark base) with a 1px lighter top edge and darker bottom edge for bevel; add a subtle {drift}s position drift for liquid-metal life. Reserve chrome for ≤ 3 words or one emblem per viewport.",
    implementation: "background: linear-gradient band stack + background-clip:text; bevel via text-shadow 0 1px 0 light / 0 -1px 0 dark; drift via background-position keyframes.",
    stack: ["CSS"],
    params: [range("drift", "Liquid drift", 12, 0, 40, 1, "s")],
    tags: ["chrome", "metal", "liquid-metal", "y2k"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    conflicts: [{ id: "direction/luxury-minimalism", reason: "Chrome's loud reflectivity fights quiet-luxury restraint." }],
    suggests: ["direction/y2k", "color/iridescence"],
  }),
  M({
    id: "color/glass",
    category: "color", subcategory: "materials",
    name: "Glassmorphism",
    tagline: "Frosted panes over living color.",
    description:
      "Glass surfaces: translucent panels with backdrop blur and saturation over colorful backdrops, 1px refracted-edge highlights.",
    prompt:
      "Use glass surfaces for overlays on colorful backdrops: background {tint}, backdrop-filter: blur({blur}px) saturate({sat}%), a 1px inner top highlight (white at 20–35%) and a 1px outer border at 8–12% white. Glass only reads over motion/color — on flat backgrounds it vanishes; provide opaque fallbacks where backdrop-filter is unsupported.",
    implementation: "backdrop-filter with @supports fallback to solid surface; border via border + inset shadow; keep blur ≤ 24px for performance.",
    stack: ["CSS backdrop-filter"],
    params: [
      range("blur", "Blur", 16, 6, 30, 1, "px"),
      range("sat", "Saturation", 160, 100, 220, 10, "%"),
      select("tint", "Tint", "rgba(255,255,255,.08)", ["rgba(255,255,255,.08)", "rgba(12,12,16,.35)", "rgba(255,255,255,.18)"]),
    ],
    tags: ["glass", "frosted", "translucent", "backdrop"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["static", "pointer"],
    fallback: "@supports not (backdrop-filter) → solid surface with 92% opacity.",
    conflicts: [{ id: "direction/neo-brutalism", reason: "Glass' soft translucency contradicts brutalism's opaque hard edges." }],
  }),
  M({
    id: "color/frosted-glass",
    category: "color", subcategory: "materials",
    name: "Heavy Frost",
    tagline: "Deep-blur privacy glass with visible depth hints.",
    description:
      "Heavy frosted glass blurs the backdrop strongly (30–60px) — silhouettes and color move behind, but nothing is identifiable.",
    prompt:
      "Use heavy frost when the backdrop must stay alive but illegible: backdrop blur {blur}px with a surface tint and visible refraction ridge at edges. Ideal for sticky headers over media, command palettes, and modal scrims. The frosted layer needs its own 1px edge highlight or it becomes indistinguishable from flat dimming.",
    implementation: "backdrop-filter: blur() + saturate(); ridge via box-shadow inset 0 1px 0 rgba(255,255,255,.12); performance: blur radius ≥ 40px is expensive on low-end GPUs — clamp per breakpoint.",
    stack: ["CSS backdrop-filter"],
    params: [range("blur", "Blur radius", 40, 24, 64, 2, "px")],
    tags: ["frost", "blur", "glass", "scrim"],
    difficulty: "beginner", perf: "heavy", dimension: "2d", interactivity: ["static"],
    responsive: "Halve the blur radius under 768px and on low-power mode to avoid GPU thrash.",
    suggests: ["engineering/low-power-mode"],
  }),
  M({
    id: "color/brushed-metal",
    category: "color", subcategory: "materials",
    name: "Brushed Metal",
    tagline: "Directional micro-streaks: machined surfaces.",
    description:
      "Brushed metal via fine repeating gradients in one direction with soft anisotropic highlights — instruments and automotive UI.",
    prompt:
      "Apply brushed metal to instrument-like surfaces: repeating-linear-gradient micro streaks (1–2px period, {contrast}% contrast) along one axis, a broad soft highlight band crossing perpendiculars, and edge bevels. Use for control surfaces, dividers or badges — never backgrounds under text.",
    implementation: "Two layered gradients (streak base + slow highlight), noise overlay at 3% to break periodicity; anisotropy axis documented.",
    stack: ["CSS"],
    params: [range("contrast", "Streak contrast", 8, 3, 18, 1, "%")],
    tags: ["metal", "brushed", "machined", "instrument"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "color/marble",
    category: "color", subcategory: "materials",
    name: "Marble / Stone Vein",
    tagline: "sin(x + fbm) — geology as arithmetic.",
    description:
      "Procedural marble via the classic formula color = sin(x·scale + fbm(p)·strength): authentic veined stone without image assets.",
    prompt:
      "Generate marble/stone procedurally: vein field c = |sin(p.x·{vein} + {strength}·fbm(p, {octaves}))| mapped into a stone palette (bone base, warm gray veins, one gold vein at 4% coverage). Compute on a canvas at load (static tile) or in a fragment shader for animation; seamless tiling for surfaces.",
    implementation: "fBM over value/simplex noise, octave-attentuated; canvas 512² tile generated once; shader path: one fragment pass with uniforms (scale, strength, seed).",
    stack: ["Canvas", "GLSL"],
    params: [
      range("vein", "Vein frequency", 3.2, 0.5, 8, 0.1, ""),
      range("strength", "Warp strength", 4.5, 1, 10, 0.5, ""),
      num("octaves", "fBM octaves", 5, 1, 8, 1),
    ],
    tags: ["marble", "stone", "procedural", "fbm"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["static", "animated"],
    demo: "marble",
    suggests: ["math/perlin-noise", "math/fbm"],
  }),
  M({
    id: "color/paper",
    category: "color", subcategory: "materials",
    name: "Paper & Print Stock",
    tagline: "Warm rag textures and deckle honesty.",
    description:
      "Paper materiality: warm off-whites, fibrous grain texture, deckle edges on cards, and ink behavior (slight text-shadow 'impression').",
    prompt:
      "Give surfaces paper materiality: warm off-white base ({warmth}), fibrous grain overlay at 4–6% opacity, deckle or torn edges on select elements, and ink-like text rendering (rich black, letterpress 0.5px shadow where print metaphor matters). Photographs get print borders (4–8% white mats).",
    implementation: "SVG feTurbulence grain tile baked to data-URI at 120px; deckle via clip-path polygon jitter; mats via border + shadow.",
    stack: ["CSS", "SVG"],
    params: [select("warmth", "Stock warmth", "cream #F6F2E9", ["cream #F6F2E9", "recycled #EFEAE0", "cotton #FAF8F4", "kraft #D9C7A7"])],
    tags: ["paper", "print", "stock", "grain"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["color/film-grain"],
  }),
  M({
    id: "color/concrete",
    category: "color", subcategory: "materials",
    name: "Concrete",
    tagline: "Cast gray permanence with form-tie honesty.",
    description:
      "Concrete surfaces: mid-gray mineral texture with subtle pore noise and cold shadows — the material of architectural weight.",
    prompt:
      "Apply concrete surfaces to structural zones: mid-gray (#8A8A8C ± value variants) mineral texture with pore noise, cold hard shadows, and edges crisp as cast. Pair with one warm material (wood tone or brass) to avoid institutional coldness.",
    implementation: "Procedural grain (fBM at high frequency, low amplitude) as tile; shadows single-direction hard; warm accent in hardware/CTA only.",
    stack: ["CSS", "Canvas"],
    tags: ["concrete", "architectural", "mineral", "gray"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/architectural-minimalism"],
  }),
  M({
    id: "color/film-grain",
    category: "color", subcategory: "texture",
    name: "Animated Film Grain",
    tagline: "Living emulsion over everything.",
    description:
      "Animated grain regenerates an noise tile every few frames at low opacity — the texture of celluloid, not a static JPEG.",
    prompt:
      "Overlay living film grain: a procedural noise tile (feTurbulence or canvas) subtly animated by frame-hopping {fps} fps at {opacity}% opacity, blend mode overlay/soft-light, covering the full viewport in a pointer-events:none layer. Regenerate rather than pan the tile to avoid moiré; pause when document hidden.",
    implementation: "Canvas 128² regenerated per nth frame or 3–4 pre-baked tiles rotated via steps(); cap devicePixelRatio cost; prefers-reduced-motion → static single frame.",
    stack: ["Canvas", "CSS"],
    params: [
      range("opacity", "Opacity", 6, 2, 18, 1, "%"),
      range("fps", "Grain rate", 8, 2, 24, 1, "fps"),
    ],
    tags: ["grain", "film", "noise", "texture"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated"],
    a11y: "Static grain frame under reduced motion; opacity cap 18% so text contrast is unaffected.",
    demo: "grain",
  }),
  M({
    id: "color/halftone",
    category: "color", subcategory: "texture",
    name: "Halftone",
    tagline: "Newspaper dots as a tonal language.",
    description:
      "Halftone renders tonal images as dot fields — retro-print texture for backgrounds, section art, and image treatments.",
    prompt:
      "Apply halftone processing to selected imagery or shapes: tonal regions become dot grids (dot radius proportional to luminance, {lpi} lines-per-inch equivalent, angle {angle}°). Use for print-punk illustration moments, section dividers, or portrait treatment; keep UI chrome free of halftone.",
    implementation: "Canvas pass: sample luminance on a grid, draw circles radius ∝ (1-L); or SVG pattern thresholding; precompute at build where possible.",
    stack: ["Canvas"],
    params: [
      num("lpi", "Density (cells/inch-equiv)", 48, 16, 120, 4, "lpi"),
      range("angle", "Screen angle", 45, 0, 90, 7, "deg"),
    ],
    tags: ["halftone", "print", "dots", "retro"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["static"],
    demo: "halftone",
  }),
  M({
    id: "color/dithering",
    category: "color", subcategory: "texture",
    name: "Ordered Dithering",
    tagline: "1-bit beauty: Bayer matrices as aesthetic.",
    description:
      "Ordered dithering quantizes images to the palette using a Bayer matrix — retro-tech texture with real information density.",
    prompt:
      "Apply ordered dithering: quantize target imagery or gradients through a {matrix}×{matrix} Bayer matrix into a {colors}-color palette; use for backgrounds, hover states (cross-dissolve between clean and dithered) or loader art. The Bayer threshold pattern is the aesthetic — don't blur after dithering.",
    implementation: "Canvas ImageData pass: palette snap by nearest color + bayer threshold jitter; render at 0.5× res and upscale with image-rendering: pixelated.",
    stack: ["Canvas"],
    params: [
      select("matrix", "Bayer matrix", "4", ["2", "4", "8"]),
      num("colors", "Palette size", 4, 2, 8, 1),
    ],
    tags: ["dither", "1-bit", "bayer", "retro-tech"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover"],
    demo: "dither",
  }),
  M({
    id: "color/noise",
    category: "color", subcategory: "texture",
    name: "Static Noise Texture",
    tagline: "Micro-contrast that stops gradients from banding.",
    description:
      "A single static noise overlay (3–5% opacity) adds tactile micro-contrast and kills gradient banding on dark surfaces.",
    prompt:
      "Add a static noise layer across surfaces: feTurbulence-generated tile at {opacity}% opacity, blend overlay, tile size ~120px. Primary purpose beyond texture: it destroys gradient banding on large dark areas. One global implementation; never per-component duplicates.",
    implementation: "Single data-URI SVG turbulence tile as body::after overlay; pointer-events:none; prefers-contrast respected (opacity halves).",
    stack: ["SVG", "CSS"],
    params: [range("opacity", "Opacity", 4, 1, 10, 0.5, "%")],
    tags: ["noise", "texture", "banding", "overlay"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "color/refraction",
    category: "color", subcategory: "light",
    name: "Refraction & Dispersion",
    tagline: "Light splits through the interface.",
    description:
      "Refraction effects bend backdrop content through glass-like lenses with RGB channel dispersion — prismatic realism at edges.",
    prompt:
      "Apply prismatic refraction to lens-like elements: backdrop content bends through the element (backdrop-filter with SVG displacement or WebGL pass) with channel-split dispersion ({dispersion}px RGB offset) strongest at edges, following a fresnel-ish ramp. Use on hero lenses, image transforms or nav glass — one prismatic element per viewport.",
    implementation: "WebGL: sample backdrop texture thrice with per-channel UV offsets scaled by edge factor; CSS-only approximation: backdrop-filter + chromatic box-shadows.",
    stack: ["WebGL", "GLSL", "SVG filters"],
    params: [range("dispersion", "Dispersion", 6, 1, 20, 1, "px")],
    tags: ["refraction", "dispersion", "prism", "lens"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["pointer", "animated"],
    fallback: "Plain frosted glass — no displacement.",
    suggests: ["webgl/refraction-shader", "color/glass"],
  }),
  M({
    id: "color/iridescence",
    category: "color", subcategory: "light",
    name: "Iridescence",
    tagline: "Thin-film color that flows with view angle.",
    description:
      "Iridescent surfaces interpolate color across a spectral ramp driven by view angle or time — soap-bubble materiality.",
    prompt:
      "Apply iridescent material to select surfaces: color = spectral ramp(t) where t derives from view angle (dot(N, V) in 3D) or slow time loop ({speed}s); hues flow along the ramp rather than jump. Confine to feature emblems, gradient headers or 3D materials; body surfaces stay neutral.",
    implementation: "HSL/LCH ramp lookup by uniform; WebGL: mix along ramp by fresnel term; CSS approximation: hue-rotate animation on a spectral gradient.",
    stack: ["GLSL", "CSS"],
    params: [range("speed", "Flow cycle", 14, 4, 40, 1, "s")],
    tags: ["iridescent", "thin-film", "soap", "spectral"],
    difficulty: "advanced", perf: "medium", dimension: "both", interactivity: ["animated", "pointer"],
    suggests: ["color/holographic", "webgl/fresnel"],
  }),
  M({
    id: "color/chromatic-aberration",
    category: "color", subcategory: "light",
    name: "Chromatic Aberration",
    tagline: "Lens fringe: RGB split at the edges.",
    description:
      "Chromatic aberration splits RGB channels with increasing offset toward frame edges — a lens-physics fingerprint on imagery or the whole stage.",
    prompt:
      "Apply chromatic aberration like real lens fringe: RGB channel offsets that grow from 0 at center to {strength}px at frame corners, applied to hero imagery or a full post-processing pass. Never on readable text; momentary spikes (on glitch/transition) may double the offset for <300ms.",
    implementation: "Post shader: 3 texture samples with radial-scaled offsets; CSS approximation for images: two hue-rotated blended copies offset radially via masks.",
    stack: ["GLSL", "CSS"],
    params: [range("strength", "Edge offset", 5, 1, 16, 1, "px")],
    tags: ["chromatic", "aberration", "lens", "rgb-split"],
    difficulty: "intermediate", perf: "medium", dimension: "both", interactivity: ["animated"],
    a11y: "Removed entirely under prefers-reduced-motion and forced-colors.",
    suggests: ["direction/cyberpunk", "webgl/post-processing"],
  }),
  M({
    id: "color/bloom",
    category: "color", subcategory: "light",
    name: "Bloom (Light Bleed)",
    tagline: "Bright things bleed into the dark.",
    description:
      "Bloom lets luminance bleed past object boundaries: threshold + blur + add — the signature of neon, emissive UI and night scenes.",
    prompt:
      "Apply bloom to emissive elements: luminance above threshold {threshold} bleeds into a soft halo (two blur radii: tight {r1}px + wide {r2}px, additive). Real bloom needs HDR-ish contrast — dark backgrounds and point brights. CSS approximation: layered box-shadow glows on the few designated emissive elements.",
    implementation: "WebGL: bright-pass → separable gaussian blur pyramid → additive composite. CSS: box-shadow layers; cap to ~5 bright elements per view.",
    stack: ["GLSL", "CSS"],
    params: [
      range("threshold", "Luminance gate", 0.72, 0.4, 0.95, 0.02, ""),
      num("r1", "Tight radius", 12, 4, 32, 2, "px"),
      num("r2", "Wide radius", 60, 20, 140, 10, "px"),
    ],
    tags: ["bloom", "glow", "emissive", "neon"],
    difficulty: "intermediate", perf: "heavy", dimension: "both", interactivity: ["static", "animated"],
    suggests: ["webgl/post-processing", "direction/cyberpunk"],
  }),
  M({
    id: "color/caustics",
    category: "color", subcategory: "light",
    name: "Caustic Light Patterns",
    tagline: "Water-light dancing across surfaces.",
    description:
      "Caustics project animated net-like light patterns (overlapping sine/noise interference) onto surfaces — pool-light, canopy light.",
    prompt:
      "Project caustic light patterns: interference of 2–3 sine/noise fields (or a Voronoi-distance difference field) produces net-like bright lines that drift slowly ({speed}s cycle); apply as additive overlay at {opacity}% on floors of hero sections, behind glass objects, or under water-adjacent brands. Keep the pattern low-frequency enough to feel liquid, not moiré.",
    implementation: "Fragment: abs(d1-d2) of two animated Voronoi F1 fields → smoothstep to thin lines; CSS approximation: repeating radial mask layers animated out of phase.",
    stack: ["GLSL", "Canvas"],
    params: [
      range("speed", "Drift cycle", 18, 6, 60, 2, "s"),
      range("opacity", "Light intensity", 22, 5, 60, 1, "%"),
    ],
    tags: ["caustics", "water", "light", "interference"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["animated"],
    fallback: "Static caustic texture baked once to a PNG/data-URI.",
  }),
];
