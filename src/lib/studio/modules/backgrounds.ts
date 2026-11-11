import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 09 — Backgrounds & Visual Effects.                         */
/* ------------------------------------------------------------------ */

export const BACKGROUND_MODULES = [
  M({
    id: "backgrounds/mesh-gradient",
    category: "backgrounds", subcategory: "gradient-bg",
    name: "Animated Mesh Backdrop",
    tagline: "The brand atmosphere, living slowly behind everything.",
    description:
      "A full-viewport mesh gradient backdrop with slow bloom drift — the ambient brand field behind hero sections.",
    prompt:
      "Set an animated mesh-gradient backdrop: {blooms} blurred color blooms drifting on slow out-of-phase paths ({speed}s cycles) over the base surface; content surfaces sit above with their own calm; text zones guarantee contrast via local scrims; backdrop sits in a fixed, pointer-events:none layer and pauses off-screen.",
    implementation: "Oversized layer transformed (not background-position) for GPU compositing; prefers-reduced-motion freezes the field.",
    stack: ["CSS"],
    params: [
      num("blooms", "Blooms", 4, 2, 8, 1),
      range("speed", "Cycle", 26, 8, 80, 2, "s"),
    ],
    tags: ["mesh", "gradient", "backdrop", "ambient"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "mesh-gradient",
    suggests: ["color/mesh-gradient"],
  }),
  M({
    id: "backgrounds/starfield",
    category: "backgrounds", subcategory: "field-bg",
    name: "Layered Starfield",
    tagline: "Three-depth star sky with subtle parallax.",
    description:
      "A canvas starfield with three parallax depth layers (far small dim, near larger brighter), drifting slowly and twinkling.",
    prompt:
      "Render a layered starfield: {stars} stars in 3 depth layers (speeds {speeds}×), per-star twinkle (sin(t·f + φ) opacity 0.4–1), optional slow drift or scroll parallax; sized to viewport area with device caps; a rare shooting star every {meteor}s (single streak, 400ms life, randomized) as a reward for attention.",
    implementation: "Canvas 2D single ctx; precomputed star table; twinkle by per-star phase; DPR-aware with cap 2.",
    stack: ["Canvas"],
    params: [
      num("stars", "Stars", 300, 60, 1200, 20),
      select("speeds", "Layer speeds", "0.2/0.5/1.0", ["0.2/0.5/1.0", "0.1/0.3/0.7", "0.4/0.7/1.2"]),
      num("meteor", "Meteor interval", 14, 4, 60, 1, "s"),
    ],
    tags: ["stars", "space", "field", "parallax"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "scroll"],
    demo: "starfield",
  }),
  M({
    id: "backgrounds/wave-field",
    category: "backgrounds", subcategory: "field-bg",
    name: "Sine Wave Field",
    tagline: "Layered harmonic waves breathing horizontally.",
    description:
      "Horizontally-flowing stacked sine waves (varying amplitude/phase/speed) — calm water, audio-adjacent atmosphere.",
    prompt:
      "Render a wave field: {lines} stacked sine lines across the viewport, each y(x,t) = base + Aᵢ·sin(x·kᵢ + t·sᵢ + φᵢ) with per-line amplitude {amp}px ± 40% and phase offsets; line opacity falls with depth (front boldest); optional pointer y-influence {pointer}px around the cursor x-position.",
    implementation: "Canvas polyline per line (sample every 4–8px); per-line phase; pause hidden; reduced-motion draws one calm static frame.",
    stack: ["Canvas"],
    params: [
      num("lines", "Wave lines", 5, 2, 12, 1),
      num("amp", "Amplitude", 26, 6, 90, 2, "px"),
      num("pointer", "Pointer influence", 0, 0, 60, 5, "px"),
    ],
    tags: ["waves", "sine", "ocean", "ambient"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "wave-field",
  }),
  M({
    id: "backgrounds/grid-perspective",
    category: "backgrounds", subcategory: "field-bg",
    name: "Perspective Grid",
    tagline: "The synthwave floor, scrolling toward you.",
    description:
      "An infinite perspective grid plane scrolling toward the viewer — retro-tech runway beneath heroes.",
    prompt:
      "Render a perspective grid floor: a plane in rotateX({tilt}°) with repeating grid lines scrolling toward the viewer at {speed}px/s (offset modulo cell so the loop is seamless), horizon line softened by a vertical fade mask; color the lines {line} on transparent; pair with a radial sun/glow at the horizon for full commitment.",
    implementation: "CSS-only: one oversized grid layer (repeating-linear-gradient both axes) on a 3D-transform parent, animated via background-position or translateY modulo the cell size; horizon fade via mask-image linear-gradient.",
    stack: ["CSS"],
    params: [
      range("tilt", "Tilt", 62, 40, 78, 1, "°"),
      num("speed", "Scroll speed", 60, 0, 240, 10, "px/s"),
      select("line", "Line color", "brand accent 35%", ["brand accent 35%", "white 12%", "vapor pink 45%"]),
    ],
    tags: ["grid", "perspective", "synthwave", "floor"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    suggests: ["direction/vaporwave"],
  }),
  M({
    id: "backgrounds/plasma-field",
    category: "backgrounds", subcategory: "field-bg",
    name: "Plasma Field",
    tagline: "Summed sines interference: the demoscene classic.",
    description:
      "Plasma fields sum multiple sines (Σ sin(axes + time)) into interference fields mapped through a cycling palette.",
    prompt:
      "Render a plasma field: v = Σ sin(aᵢ·x + bᵢ·y + cᵢ·t) over {terms} terms, normalized and mapped through a {palette} palette (cycling hue phase slowly); compute at low res ({res} px cells) with CSS upscaling — the blur between cells is a feature, making the plasma creamy.",
    implementation: "Canvas ImageData at low res + ctx.drawImage upscale with smoothing on; palette LUT precomputed 256 entries.",
    stack: ["Canvas"],
    params: [
      num("terms", "Sine terms", 4, 2, 8, 1),
      select("palette", "Palette", "violet-fire", ["violet-fire", "ocean-ember", "acid-mint", "mono plasma"]),
      num("res", "Cell size", 4, 2, 12, 1, "px"),
    ],
    tags: ["plasma", "sine", "interference", "demoscene"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "plasma",
  }),
  M({
    id: "backgrounds/light-rays",
    category: "backgrounds", subcategory: "field-bg",
    name: "Light Ray Fan",
    tagline: "Crepuscular beams from a hidden sun.",
    description:
      "A fan of soft light beams radiating from an off-screen source, slowly sweeping — stage-light atmosphere for heroes.",
    prompt:
      "Compose light rays: {rays} soft-edged beams radiating from a source point {origin} (typically top-center off-canvas), additive-blended at {opacity}% with slow sweep oscillation (±{sweep}°, {period}s) ; beams masked by a vertical depth gradient (strong at source, gone at 70% viewport); no ray may sit directly behind body text.",
    implementation: "Conic-gradient wedges or rotated linear columns with blur(20px+), mix-blend screen/plus-lighter; transform-only sweep animation.",
    stack: ["CSS/Canvas"],
    params: [
      num("rays", "Beam count", 6, 3, 14, 1),
      select("origin", "Source", "top center", ["top center", "top left", "center", "follow pointer slowly"]),
      range("opacity", "Beam opacity", 18, 4, 45, 1, "%"),
      num("sweep", "Sweep", 8, 0, 30, 1, "°"),
      num("period", "Sweep period", 22, 8, 60, 2, "s"),
    ],
    tags: ["rays", "godrays", "beams", "light"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "backgrounds/volumetric-fog",
    category: "backgrounds", subcategory: "simulation-bg",
    name: "Drifting Fog Banks",
    tagline: "fBM fog layers sliding at different speeds.",
    description:
      "Layered fog: 2–4 fBM noise sheets with per-layer speed and opacity, soft-masking the edges of scenes.",
    prompt:
      "Layer drifting fog: {layers} fBM noise sheets (scale per layer) translated at speeds {speeds} px/s with opacities stepping 12%/9%/6%, blend screen on dark scenes / multiply on light; fog density highest at section edges forming natural vignettes; the field scrolls horizontally with slight vertical breathing.",
    implementation: "Pre-rendered noise PNGs (tileable, generated at build) as translating layers — runtime cost is transform-only; generate variants per palette.",
    stack: ["CSS", "Canvas (generation)"],
    params: [
      num("layers", "Fog layers", 3, 2, 5, 1),
      select("speeds", "Layer speeds", "8/14/22", ["8/14/22", "4/9/16", "12/20/30"]),
    ],
    tags: ["fog", "atmosphere", "fbm", "vignette"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "backgrounds/liquid-metal-bg",
    category: "backgrounds", subcategory: "simulation-bg",
    name: "Liquid Metal Pool",
    tagline: "Mercury undulating in the background.",
    description:
      "A liquid-metal surface shader: domain-warped normals with sharp specular highlights flowing as if mercury pools.",
    prompt:
      "Render a liquid-metal backdrop: a warped height-field (fBM-driven) with lighting that favors sharp specular streaks (high gloss, cool white) over a mid-gray diffuse; undulation speed {speed}; brightness floor keeps the metal mid-dark so foreground content dominates; treat as hero-zone only, fading out before content sections.",
    implementation: "Fragment shader: h=fbm(p+t), n from gradient, spec = pow(max(dot(reflect(L,n),V),0), {gloss}); static frame fallback.",
    stack: ["GLSL"],
    params: [
      range("speed", "Undulation", 0.3, 0, 1.4, 0.05, ""),
      range("fog", "Mid-tone floor", 0.45, 0.2, 0.8, 0.05, ""),
      num("gloss", "Gloss exponent", 48, 8, 128, 4),
    ],
    tags: ["liquid", "metal", "mercury", "specular"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["animated"],
    fallback: "Single rendered frame + CSS radial sheen.",
    conflicts: [{ id: "direction/minimalism", reason: "Liquid metal spectacle contradicts flat minimal quiet." }],
  }),
  M({
    id: "backgrounds/cellular",
    category: "backgrounds", subcategory: "simulation-bg",
    name: "Cellular Automata Backdrop",
    tagline: "The background itself runs Life.",
    description:
      "A dim cellular automaton running behind content — civilization-scale texture that grows, dies and regrows on a slow clock.",
    prompt:
      "Run a cellular automaton backdrop: {cell}px cells, rule {rule}, tick every {tick}ms, alpha 4–10% so it reads as texture not screensaver; reseed periodically ({reseed}s) or on user click; cells near pointer may awaken ({wake}px radius); text zones gain an extra surface scrim for contrast.",
    implementation: "Canvas at device-capped DPR running B3/S23; throttle to interval; pause when tab hidden or reduced-motion (static pattern).",
    stack: ["Canvas"],
    params: [
      num("cell", "Cell size", 10, 4, 30, 1, "px"),
      select("rule", "Rule", "Life (B3/S23)", ["Life (B3/S23)", "HighLife", "Day & Night", "Seeds (B2/S)"]),
      num("tick", "Tick", 240, 60, 1000, 20, "ms"),
      num("reseed", "Reseed interval", 30, 10, 120, 5, "s"),
      num("wake", "Pointer wake radius", 90, 0, 300, 10, "px"),
    ],
    tags: ["automata", "life", "cellular", "backdrop"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    suggests: ["math/cellular-automata"],
  }),
  M({
    id: "backgrounds/fractal-bg",
    category: "backgrounds", subcategory: "simulation-bg",
    name: "Living Fractal Field",
    tagline: "A Julia set slowly breathing behind the hero.",
    description:
      "An escape-time fractal as a dimmed hero backdrop — c parameter drifts slowly so the structure morphs imperceptibly.",
    prompt:
      "Set a living fractal backdrop: escape-time render (Julia at c={cr}+{ci}i) presented at {opacity}% brightness behind the hero, blurred {blur}px so structure reads as texture; c drifts at {speed}/s so the pattern breathes; periodic epoch shifts welcome (jump c to a new island every {epoch}s with a 2s crossfade).",
    implementation: "Fragment shader or pre-rendered sequence; blur separates it from foreground text; contrast check at all settle states.",
    stack: ["GLSL", "Canvas"],
    params: [
      range("cr", "c real", -0.7269, -1.2, 0.2, 0.0001, ""),
      range("ci", "c imag", 0.1889, -0.5, 1.0, 0.0001, ""),
      range("opacity", "Brightness", 34, 10, 80, 2, "%"),
      num("blur", "Blur", 6, 0, 24, 1, "px"),
      range("speed", "Drift", 0.01, 0, 0.08, 0.002, "/s"),
      num("epoch", "Epoch shift", 45, 20, 180, 5, "s"),
    ],
    tags: ["fractal", "julia", "backdrop", "hero"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "julia",
    suggests: ["math/julia"],
  }),
  M({
    id: "backgrounds/cursor-reactive-bg",
    category: "backgrounds", subcategory: "reactive-bg",
    name: "Cursor-Reactive Field",
    tagline: "The backdrop knows where your hand is.",
    description:
      "Backgrounds responding to pointer position: gradient centers following, dot grids deforming, constellation lines connecting to the cursor.",
    prompt:
      "Make the backdrop cursor-aware: track pointer → CSS vars/GLSL uniforms ({mode}: gradient center follows at {lerp} lag, dot grid displaces within radius {radius}px, or a light source repositions affecting shading); always lerp — raw 1:1 tracking feels jumpy; idle behavior returns to autonomous drift.",
    implementation: "pointermove → normalized coords → rAF lerp → style vars; shader path: u_pointer uniform; coarse pointers use slow autonomous orbit.",
    stack: ["CSS vars", "GLSL"],
    params: [
      select("mode", "Reactivity", "gradient follows", ["gradient follows", "dot-grid deform", "light source", "constellation links"]),
      range("lerp", "Follow lag", 0.12, 0.03, 0.5, 0.01, ""),
      num("radius", "Influence radius", 200, 60, 500, 20, "px"),
    ],
    tags: ["reactive", "cursor", "pointer", "backdrop"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    demo: "constellation-cursor",
  }),
  M({
    id: "backgrounds/scroll-reactive-bg",
    category: "backgrounds", subcategory: "reactive-bg",
    name: "Scroll-Reactive Atmosphere",
    tagline: "The sky changes as the story advances.",
    description:
      "The backdrop evolves with scroll: hue drifts, density builds, stars emerge — atmosphere as narrative instrument.",
    prompt:
      "Bind backdrop state to scroll: global scroll progress (0→1) drives {property} — hue shift {hueDelta}°, field density {density}%, drift speed multiplier, or star fade-in; interpolation smooth (damp 0.08) so fast scrolling doesn't strobe the sky; the atmosphere tells readers where they are.",
    implementation: "Progress via scroll listener → damped value → style vars/uniforms; properties pre-registered so interpolation is valid end-to-end.",
    stack: ["CSS vars", "rAF"],
    params: [
      select("property", "Driven property", "hue + density", ["hue + density", "speed + turbulence", "star fade-in", "fog thickness"]),
      range("hueDelta", "Hue travel", 60, 0, 240, 10, "°"),
      num("density", "Peak density", 70, 10, 100, 5, "%"),
    ],
    tags: ["scroll", "reactive", "atmosphere", "narrative"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll"],
    a11y: "Hue shifts stay subtle (<2Hz rate of change); no strobing under any scroll velocity.",
  }),
  M({
    id: "backgrounds/audio-reactive-bg",
    category: "backgrounds", subcategory: "reactive-bg",
    name: "Audio-Reactive Backdrop",
    tagline: "The room answers the track.",
    description:
      "WebAudio analysis drives the backdrop: bass swells, treble sparkles — for music, events and experience pages.",
    prompt:
      "Make the backdrop audio-reactive: AnalyserNode (fft {fft}) → 3 band averages; bass scales {bass} and glow radius, mids shift hue ±{mids}°, treble adds shimmer rate; all mappings smoothed (timeConstant {smooth}); silent/no-permission state = autonomous slow ambient; activation requires explicit user play affordance.",
    implementation: "AudioContext on gesture; AnalyserNode smoothingTimeConstant; map bands → CSS vars at ≤30Hz; no audio = no requirement.",
    stack: ["WebAudio"],
    params: [
      select("fft", "FFT size", "512", ["256", "512", "1024"]),
      range("bass", "Bass scale", 1.5, 0.2, 3, 0.1, "×"),
      num("mids", "Mid hue shift", 20, 0, 80, 5, "°"),
      range("smooth", "Smoothing", 0.82, 0.5, 0.95, 0.01, ""),
    ],
    tags: ["audio", "reactive", "music", "fft"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["realtime"],
    a11y: "Zero flashing <3Hz... bass scaling capped to luminance changes < 10%/frame.",
    suggests: ["motion/audio-reactive-particles"],
  }),
];
