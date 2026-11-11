import { M } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 02 — Art Direction & Design Language.                      */
/*  Each module defines visual characteristics AND anti-patterns, with  */
/*  conflict edges so the compiler can warn on contradictory mixes.     */
/* ------------------------------------------------------------------ */

export const DIRECTION_MODULES = [
  M({
    id: "direction/minimalism",
    category: "direction", subcategory: "restraint",
    name: "Minimalism",
    tagline: "Remove until it breaks, then stop.",
    description:
      "Extreme reduction: one idea per viewport, whitespace as structure, a single accent color, and typography doing all the expressive work.",
    prompt:
      "Apply strict minimalism: generous negative space (whitespace is a layout element, not leftover), one accent color maximum, a two-family type system, hairline dividers instead of boxes, and a hard rule of one idea per viewport. Remove decoration until the design nearly breaks; the remaining elements must justify themselves.",
    implementation: "Audit every element against 'does this carry information or feeling the copy cannot?' — delete otherwise. Spacing scale drives all rhythm.",
    stack: ["Tailwind CSS"],
    tags: ["minimal", "restraint", "whitespace", "clean"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    conflicts: [
      { id: "direction/maximalism", reason: "Maximalism layers density and ornament; minimalism deletes them. Combining both produces visual noise without a voice." },
      { id: "direction/memphis", reason: "Memphis' playful confetti geometry contradicts minimal restraint." },
    ],
    suggests: ["typography/geometric-sans", "layout/swiss-grid"],
  }),
  M({
    id: "direction/swiss",
    category: "direction", subcategory: "restraint",
    name: "Swiss Design",
    tagline: "Grid, grotesk, and asymmetric rigor.",
    description:
      "The International Typographic Style: mathematical grids, flush-left rag-right grotesk type, objective photography, and information hierarchy through size and position alone.",
    prompt:
      "Apply Swiss design: a strict mathematical grid, flush-left/rag-right grotesk typography (never centered, never justified), hierarchy achieved by size and position rather than color or ornament, objective photography treated as information, and generous margins. Red, black and white is the canonical palette — use color as a routing signal only.",
    implementation: "12-col grid with rigid gutters; type scale from a single base ratio; photographs full-bleed within grid columns; no rounded corners above 2px, no shadows.",
    stack: ["Tailwind CSS"],
    tags: ["swiss", "international-style", "grid", "grotesk"],
    aliases: ["international typographic style"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    conflicts: [
      { id: "direction/organic", reason: "Organic design's flowing curves intentionally break grid rigor — Swiss demands the grid be law." },
      { id: "direction/vaporwave", reason: "Vaporwave's nostalgic gradients and kitsch contradict Swiss objectivity." },
    ],
    suggests: ["layout/swiss-grid", "typography/geometric-sans"],
  }),
  M({
    id: "direction/neo-brutalism",
    category: "direction", subcategory: "expressive",
    name: "Neo-Brutalism",
    tagline: "Raw borders, hard shadows, zero apology.",
    description:
      "The web-native brutalism: thick borders, hard offset shadows (no blur), saturated solid colors, system-font honesty, and visible structure.",
    prompt:
      "Apply neo-brutalism: 2–3px solid borders everywhere, hard offset shadows (pure translation, zero blur), saturated flat colors (no gradients), honest system or mono typography, visible boxes and seams — the interface exposes its own structure. Elements press physically on interaction (shadow reduces on :active like a stamp).",
    implementation: "border: 2px solid; box-shadow: 4px 4px 0. Active state translates the element by the shadow offset. Saturated primaries on off-white.",
    stack: ["Tailwind CSS"],
    tags: ["neo-brutalism", "brutalist", "borders", "raw"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover"],
    conflicts: [
      { id: "direction/luxury-minimalism", reason: "Luxury minimalism is polished ceremony; neo-brutalism is raw exposure — the voices contradict." },
      { id: "color/glass", reason: "Glassmorphism's translucency and blur are the opposite of brutalism's opaque hard edges." },
    ],
  }),
  M({
    id: "direction/brutalism",
    category: "direction", subcategory: "expressive",
    name: "Web Brutalism",
    tagline: "The unstyled web, weaponized.",
    description:
      "Raw web brutalism: default-look elements, visible hyperlinks, Times/Monospace stacks, and deliberate refusal of polish as an artistic statement.",
    prompt:
      "Apply web brutalism as a deliberate aesthetic: raw default-form elements, underlined blue/purple links, Times New Roman and monospace, unapologetic walls of structure, marquee-adjacent energy, and layouts that expose the document nature of the web. This is a designed choice — keep it rigorous, consistent and fast, never accidental.",
    implementation: "Keep semantics hyper-clean (it must work with CSS disabled); style restraint as a system, not neglect. Performance will be superb — say so.",
    stack: ["CSS"],
    tags: ["brutalism", "raw", "anti-design", "default"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    conflicts: [{ id: "direction/luxury-minimalism", reason: "Opposite poles of polish — combining produces an unfinished-looking result, not tension." }],
  }),
  M({
    id: "direction/maximalism",
    category: "direction", subcategory: "expressive",
    name: "Maximalism",
    tagline: "More, but orchestrated.",
    description:
      "Deliberate abundance: layered imagery, pattern mixing, rich color chords, and ornament — held together by a strict underlying rhythm.",
    prompt:
      "Apply orchestrated maximalism: layered imagery and textures, multiple type voices in controlled chorus, saturated color chords, and ornamental detail — but bound by a strict rhythm (consistent spacing scale and grid anchoring) so the richness reads as generosity, not chaos. Every viewport offers at least three things to discover.",
    implementation: "One rigid grid beneath the ornament; cap simultaneous type families at 3; pattern density highest in transitions and footer.",
    stack: ["Tailwind CSS"],
    tags: ["maximalism", "ornate", "layered", "rich"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["static", "hover"],
    conflicts: [{ id: "direction/minimalism", reason: "Opposite density philosophies — pick one density voice and let it lead." }],
  }),
  M({
    id: "direction/editorial",
    category: "direction", subcategory: "fine-art",
    name: "Editorial Direction",
    tagline: "Magazine logic: kicker, headline, deck, art.",
    description:
      "Magazine-grade art direction: strong story hierarchy, mixed typography (sans kickers, serif headlines), image direction with cropping intent, and pacing like a print issue.",
    prompt:
      "Apply editorial art direction: every section reads like a magazine spread — kicker (mono caps) over headline (display serif) over deck (one-sentence italic), images art-directed with deliberate crops and captions, pull quotes that interrupt measure intentionally, and pacing that alternates dense and quiet moments like a well-edited issue.",
    implementation: "Design tokens for kicker/headline/deck; art direction via <picture> crops; pull quotes at 140% measure with hairline rules.",
    stack: ["Tailwind CSS"],
    tags: ["editorial", "magazine", "print", "hierarchy"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "scroll"],
    suggests: ["typography/editorial-serif", "websites/editorial"],
  }),
  M({
    id: "direction/experimental-typography",
    category: "direction", subcategory: "expressive",
    name: "Experimental Typography",
    tagline: "Type as the primary visual material.",
    description:
      "Typography-first direction where letterforms carry the imagery: oversized, cropped, layered, rotated or distorted type as the dominant visual.",
    prompt:
      "Make typography the primary visual material: letterforms at image scale (20vw+), cropped at viewport edges, layered with overlap, mixed axes (weight/width/optical size), and kinetic treatments on key words. Imagery, when present, is subordinate to type. Legibility rules: hero type may flirt with abstraction, but navigation and body stay pristine.",
    implementation: "Variable fonts with font-variation-settings; text as clip masks for media; per-character split for animation only on display sizes.",
    stack: ["CSS", "Variable fonts"],
    tags: ["type", "experimental", "display", "kinetic"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    suggests: ["typography/kinetic", "typography/character-animation"],
  }),
  M({
    id: "direction/futurism",
    category: "direction", subcategory: "temporal",
    name: "Near-Future Tech",
    tagline: "Clean, weightless, quietly computational.",
    description:
      "Contemporary tech futurism: airy layouts, precise thin lines, glass-adjacent surfaces, soft glows, and interface-precision spacing.",
    prompt:
      "Apply near-future tech direction: weightless layouts with hairline precision, soft depth (diffuse shadows, glass-adjacent panels), a luminous accent on deep neutral, mono labels for anything systemic, and motion that feels engineered (springs, never bounce-kitsch). The future here is calm and inevitable, not neon.",
    implementation: "1px borders at low alpha; radial glow accents; tabular data styling; springs with stiffness 120–220.",
    stack: ["Tailwind CSS"],
    tags: ["futuristic", "tech", "clean", "quieter"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    suggests: ["color/frosted-glass", "motion/spring-physics"],
  }),
  M({
    id: "direction/retrofuturism",
    category: "direction", subcategory: "temporal",
    name: "Retrofuturism",
    tagline: "Yesterday's tomorrow: optimism in chrome.",
    description:
      "Mid-century space-age aesthetics: atomic motifs, boomerang shapes, optimistic pastels or chrome, and typography from an imagined 1965 future.",
    prompt:
      "Apply retrofuturism: atomic-age optimism — starbursts, boomerangs and orbital ellipses as motifs; pastel or chrome-on-dark palettes; display type channeling 1960s space-age advertising; rounded spacecraft geometry. Keep it affectionate, not ironic: the future it imagines is hopeful.",
    implementation: "Motifs as inline SVG with consistent stroke; pastel palette with one saturated starburst accent; elliptical arcs as section dividers.",
    stack: ["SVG", "CSS"],
    tags: ["retrofuturism", "atomic", "space-age", "retro"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "animated"],
  }),
  M({
    id: "direction/cyberpunk",
    category: "direction", subcategory: "temporal",
    name: "Cyberpunk",
    tagline: "Neon voltage against rain-black asphalt.",
    description:
      "High-tech low-life visuals: neon magenta/cyan on near-black, scanlines, glitch moments, terminal text, and urban density.",
    prompt:
      "Apply cyberpunk: neon voltage (magenta/cyan/acid green) against near-black surfaces, scanline and glitch textures used like seasoning, terminal-monospace data streams, chrome kanji-adjacent ornamentation (original glyphs, not appropriated text), and UI that feels like infrastructure in a dense city at night. Motion includes occasional digital interference — but sparingly.",
    implementation: "Neon via layered text-shadow/box-shadow glows; glitch via clip-path keyframes at low frequency (every 6–10s); scanlines as repeating-linear-gradient overlay at 4–6% opacity.",
    stack: ["CSS"],
    tags: ["cyberpunk", "neon", "glitch", "noir"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    conflicts: [{ id: "direction/organic", reason: "Organic nature-warmth contradicts cyberpunk's synthetic urban voltage." }],
    suggests: ["color/chromatic-aberration", "typography/monospaced"],
    a11y: "Glitch effects must pause under prefers-reduced-motion and never flash faster than 3Hz (photosensitivity).",
  }),
  M({
    id: "direction/sci-fi-industrial",
    category: "direction", subcategory: "temporal",
    name: "Sci-Fi Industrial",
    tagline: "Spacecraft manufacturing: rivets, stencils, warnings.",
    description:
      "Heavy-industrial sci-fi: stenciled labels, warning-stripe accents, panel lines, riveted seams, and utilitarian mono readouts.",
    prompt:
      "Apply sci-fi industrial direction: interfaces that feel manufactured — stenciled uppercase labels, panel seams and rivet details at low contrast, warning-stripe accents (diagonal hazard bands) used sparingly on critical actions, monospaced telemetry readouts, and surfaces that imply mass and machinery rather than glassy lightness.",
    implementation: "Stencil via letter-spaced all-caps with subtle texture; panel lines via borders + inner shadows; telemetry blocks in monospace with fixed-width columns.",
    stack: ["CSS"],
    tags: ["sci-fi", "industrial", "stencil", "machinery"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "animated"],
  }),
  M({
    id: "direction/luxury-minimalism",
    category: "direction", subcategory: "restraint",
    name: "Luxury Minimalism",
    tagline: "Whispered wealth: serif, space, ceremony.",
    description:
      "Quiet-luxury direction: hairline-serif display type, vast negative space, muted metallics or deep neutrals, and interactions that feel like a private viewing.",
    prompt:
      "Apply luxury minimalism: vast negative space, hairline serif display type at large sizes, a muted palette (bone, charcoal, one metallic accent), interactions staged like a private viewing (long easings, reveal-on-scroll ceremony), no visible buttons-as-buttons (text links with hairline underlines where possible), and photography with gallery-grade color grading.",
    implementation: "Motion tokens: 600–1200ms ease-out-quint; underline reveals via background-size animation; letter-spacing -0.02em on display serif.",
    stack: ["Tailwind CSS", "Framer Motion"],
    tags: ["luxury", "quiet", "serif", "premium"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll", "animated"],
    conflicts: [
      { id: "direction/neo-brutalism", reason: "Hard borders and stamp-shadows break luxury's polished quiet." },
      { id: "direction/y2k", reason: "Y2K maximal nostalgia contradicts quiet luxury." },
    ],
    suggests: ["websites/luxury-brand", "typography/editorial-serif"],
  }),
  M({
    id: "direction/avant-garde",
    category: "direction", subcategory: "fine-art",
    name: "Avant-Garde",
    tagline: "Gallery logic: rules exist to be interrogated.",
    description:
      "Gallery-experimental direction: unconventional reading orders, collisions of scale, intentional asymmetry, and ideas-first layouts.",
    prompt:
      "Apply avant-garde direction: challenge one layout convention per section (rotated text columns, colliding scales, captions promoted to titles), asymmetric compositions that create productive tension, and a clear reading logic underneath the provocation. The work must remain navigable — experimentation framed by usability.",
    implementation: "Establish a usable baseline grid, then break it deliberately in 20% of compositions, documenting the 'rules' you chose to break.",
    stack: ["CSS"],
    tags: ["avant-garde", "experimental", "gallery", "provocation"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["static", "scroll"],
    conflicts: [{ id: "direction/swiss", reason: "Swiss rigor forbids the convention-breaking that avant-garde requires." }],
  }),
  M({
    id: "direction/surrealism",
    category: "direction", subcategory: "fine-art",
    name: "Surrealism",
    tagline: "Dream logic: impossible scale, floating reality.",
    description:
      "Dreamlike composition: impossible scale relationships, floating elements, melting transitions, and familiar objects in uncanny arrangements.",
    prompt:
      "Apply surrealist direction: impossible scale relationships (giant objects in small rooms of layout), elements floating with soft shadows in empty space, transitions that melt or morph unexpectedly, and familiar iconography in uncanny juxtaposition. Keep interactions slightly uncanny but never broken-feeling — dream logic, not bug logic.",
    implementation: "Layered parallax at non-natural depth ratios; morph transitions via border-radius/blob keyframes; grain overlay for dream texture.",
    stack: ["Framer Motion", "CSS"],
    tags: ["surrealism", "dream", "uncanny", "floating"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated", "scroll"],
  }),
  M({
    id: "direction/cinematic",
    category: "direction", subcategory: "fine-art",
    name: "Cinematic",
    tagline: "Frames, not pages: scope, grain, and score.",
    description:
      "Film-language direction: widescreen letterboxing, controlled aspect ratios, film grain, title-card typography, and pacing like a trailer.",
    prompt:
      "Apply cinematic direction: sections composed as frames — widescreen aspect ratios with letterbox bands, film grain overlay, title-card typography moments, a fade-to/from-black between acts, and pacing that alternates wide establishing shots with close detail. Motion follows camera logic (dolly, pan, rack focus) rather than UI logic.",
    implementation: "2.39:1 hero frames; grain via animated procedural noise at 5% opacity; scroll sections framed with black bands; transitions fade through near-black.",
    stack: ["Framer Motion", "Canvas"],
    tags: ["cinematic", "film", "letterbox", "grain"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
    suggests: ["color/film-grain", "motion/scene-morph"],
  }),
  M({
    id: "direction/organic",
    category: "direction", subcategory: "fine-art",
    name: "Organic / Biomorphic",
    tagline: "Curves grown, not drawn.",
    description:
      "Nature-derived design: flowing organic curves, soft blob geometries, earthy palettes, and motion that grows and breathes.",
    prompt:
      "Apply organic/biomorphic direction: flowing curves instead of straight edges (blob dividers, rounded asymmetric shapes), an earth-derived palette (clay, moss, sand, deep green), soft diffuse shadows, and motion that grows and breathes (scale-from-origin reveals, slow drift). No sharp 90° corners anywhere in the system.",
    implementation: "Section dividers via SVG organic paths or border-radius blobs (60% 40% 55% 45% / 55% 45% 60% 40%); shadows large and diffuse.",
    stack: ["CSS", "SVG"],
    tags: ["organic", "biomorphic", "natural", "curves"],
    aliases: ["biomorphism"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    conflicts: [{ id: "direction/swiss", reason: "Swiss grid rigor vs grown organic curves — the philosophies fight each other." }],
  }),
  M({
    id: "direction/memphis",
    category: "direction", subcategory: "expressive",
    name: "Memphis Design",
    tagline: "Playful geometry confetti, 1981 forever.",
    description:
      "Memphis Group revival: squiggles, confetti dots, bold primary clashes, thick outlines, and unserious geometry placed with serious rhythm.",
    prompt:
      "Apply Memphis design: playful geometric confetti (squiggles, triangles, dots, plus signs) scattered with intentional rhythm, bold clashing primaries, thick outline treatments, patterns mixing polka dots and zigs, and chunky friendly type. Under the play, keep typographic hierarchy and spacing strict — Memphis is rhythm, not randomness.",
    implementation: "Confetti SVG sprite placed on a loose diagonal grid; primary palette triad; 3px outlines; patterns as repeating backgrounds at 15% opacity behind content zones.",
    stack: ["SVG", "CSS"],
    tags: ["memphis", "playful", "retro", "patterns"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "hover"],
    conflicts: [{ id: "direction/minimalism", reason: "Confetti density violates minimal reduction." }],
  }),
  M({
    id: "direction/bauhaus",
    category: "direction", subcategory: "restraint",
    name: "Bauhaus-Inspired",
    tagline: "Circle, triangle, square: primary forms, primary colors.",
    description:
      "Bauhaus discipline: primary geometric forms as compositional actors, primary colors with meaning, diagonals for dynamism, and functional elegance.",
    prompt:
      "Apply Bauhaus-inspired direction: composition built from primary forms (circle, triangle, square, bar) acting as real layout elements, the primary triad (red/yellow/blue) plus black used semantically, dynamic diagonals for emphasis, and type as functional grid citizen. Every geometric element must do structural work (divide, point, frame) — never confetti.",
    implementation: "Geometry as absolute-positioned CSS shapes anchored to grid intersections; diagonals via clipped sections; colors mapped to functional roles.",
    stack: ["CSS"],
    tags: ["bauhaus", "geometry", "primary", "functional"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "hover"],
  }),
  M({
    id: "direction/y2k",
    category: "direction", subcategory: "temporal",
    name: "Y2K",
    tagline: "Millennium chrome, pixel hearts, iridescent plastic.",
    description:
      "Turn-of-millennium nostalgia: chrome text, iridescent gradients, pixel details, sticker energy, and optimistic tech-kitsch.",
    prompt:
      "Apply Y2K direction: chrome and iridescent gradient treatments on display type, pixel-art accents and dithered textures, sticker-like UI elements with thick white outlines, bubbly or techno display faces, and millennium-tech optimism. Anchor the nostalgia with modern craft — clean grid, fast loads, real accessibility.",
    implementation: "Chrome text via gradient + background-clip; iridescence via conic gradient shimmer; pixel elements as SVG shape-rendering: crispEdges.",
    stack: ["CSS", "SVG"],
    tags: ["y2k", "retro", "chrome", "nostalgia"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "hover"],
    conflicts: [
      { id: "direction/luxury-minimalism", reason: "Quiet luxury and Y2K kitsch are opposite cultural signals." },
      { id: "websites/luxury-brand", reason: "A luxury brand voice conflicts with Y2K's playful nostalgia." },
    ],
    suggests: ["color/iridescence", "color/chrome"],
  }),
  M({
    id: "direction/vaporwave",
    category: "direction", subcategory: "temporal",
    name: "Vaporwave",
    tagline: "Dream-mall ambience: marble, grids, pink and teal.",
    description:
      "Vaporwave aesthetics: pink/teal duotomes, Greek marble busts reimagined as geometric abstraction, perspective grids into sunsets, and lo-fi texture.",
    prompt:
      "Apply vaporwave: pink/teal/purple gradient duotomes, infinite perspective grids receding to a gradient sun, classical references abstracted into geometry (columns as wireframes, busts as low-poly silhouettes), VHS/lo-fi texture overlays, and slowed-down motion. Keep content legible above the ambience — the haze is backdrop, not foreground.",
    implementation: "Perspective grid via CSS transform: rotateX(60deg) repeating gradient animated toward viewer; sun via radial gradient with mask lines.",
    stack: ["CSS"],
    tags: ["vaporwave", "retro", "lofi", "synthwave-adjacent"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    conflicts: [{ id: "direction/swiss", reason: "Swiss objectivity is the antithesis of vaporwave's ironic ambience." }],
  }),
  M({
    id: "direction/technical-blueprint",
    category: "direction", subcategory: "technical",
    name: "Technical Blueprint",
    tagline: "Schematic precision: grids, annotations, cyan lines.",
    description:
      "Engineering-drawing aesthetics: blueprint or graphite schematics, measurement marks, annotation callouts, and drafting-grid backgrounds.",
    prompt:
      "Apply technical blueprint direction: drafting-grid background at low opacity, schematic line work (1px stroked geometry with dimension marks), annotation callouts with leader lines for features, label type in technical mono, and a cyan-on-navy (or graphite-on-paper) scheme. Everything should feel measurable — include actual measurements in the design.",
    implementation: "Grid via layered repeating-linear-gradients; dimension marks as SVG; annotations absolutely positioned with 1px leader lines.",
    stack: ["CSS", "SVG"],
    tags: ["blueprint", "schematic", "technical", "engineering"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "hover"],
    suggests: ["typography/monospaced", "layout/modular-grid"],
  }),
  M({
    id: "direction/architectural-minimalism",
    category: "direction", subcategory: "technical",
    name: "Architectural Minimalism",
    tagline: "Concrete, light and shadow as the only materials.",
    description:
      "Tadao-Ando-grade restraint: concrete neutrals, hard planes of light and shadow, monumental scale, and typography set like building signage.",
    prompt:
      "Apply architectural minimalism: a concrete-and-light palette (warm grays, shadow blacks, one daylight white), composition in monumental planes, shadows treated as material (long, hard-edged, directional), typography set like incised signage, and imagery of space and mass over decoration. Layouts should feel walkable — like moving through rooms.",
    implementation: "Shadows: single-direction, hard-edged, long. Transitions choreographed room-to-room. Whitespace structured as mass.",
    stack: ["CSS"],
    tags: ["architectural", "concrete", "minimal", "monumental"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll"],
    suggests: ["websites/architecture-portfolio", "layout/swiss-grid"],
  }),
  M({
    id: "direction/collage",
    category: "direction", subcategory: "fine-art",
    name: "Digital Collage",
    tagline: "Cut, paste, tape, tear: assembled on screen.",
    description:
      "Assemblage aesthetics: overlapping cut-out imagery, tape and paper fragments, rotated placements, handwriting accents, and zine energy.",
    prompt:
      "Apply digital collage: imagery treated as cut-outs (subtle rotation, white border 'prints', drop shadows like layered paper), tape-strip and torn-paper textures at seams, handwritten or marker accents for annotations, and zine-style layout freedom kept on a hidden grid. Layers should respond to pointer or scroll with slight independent drift.",
    implementation: "Layered figures with transform: rotate(±2–4deg) and paper shadows; drift via pointer parallax at low depth factors.",
    stack: ["CSS", "Framer Motion"],
    tags: ["collage", "zine", "cutout", "tape"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["pointer", "scroll"],
    suggests: ["motion/pointer-parallax"],
  }),
  M({
    id: "direction/generative",
    category: "direction", subcategory: "technical",
    name: "Generative Design",
    tagline: "Systems that draw the brand, live.",
    description:
      "Generative identity: procedural marks, seeded variation, and layouts where parts of the visual system are computed live rather than static.",
    prompt:
      "Apply generative design: define a procedural visual system (seeded variation of marks, patterns or fields) and let it generate brand visuals live in the browser — every visit subtly unique but recognisably one system. Expose the system honestly: show the seed, allow regeneration where playful, and keep typography and copy stable so identity survives the variation.",
    implementation: "Seeded PRNG (mulberry32) driving canvas/SVG generation; seed in URL for shareability; static SSR fallback render for no-JS.",
    stack: ["Canvas", "TypeScript"],
    tags: ["generative", "procedural", "identity", "systems"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["realtime", "animated"],
    suggests: ["math/flow-field", "math/perlin-noise"],
  }),
  M({
    id: "direction/monochromatic",
    category: "direction", subcategory: "technical",
    name: "Monochromatic",
    tagline: "One hue, a full orchestra of values.",
    description:
      "Single-hue discipline: an entire system built from one color's tints and shades, with contrast choreography carrying hierarchy.",
    prompt:
      "Apply monochromatic discipline: build the entire interface from one hue — 6–9 steps from near-black to near-white of a single color, hierarchy carried by value contrast and scale alone. The single accent exception (e.g., a status green or link tint) must be rationed to one-per-viewport.",
    implementation: "Generate the ramp programmatically (HSL lightness steps); enforce via design tokens; check all pairs against WCAG AA.",
    stack: ["CSS"],
    tags: ["monochrome", "single-hue", "value", "discipline"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["color/monochrome-ramp"],
  }),
  M({
    id: "direction/high-contrast",
    category: "direction", subcategory: "technical",
    name: "High-Contrast Duo",
    tagline: "Black ink, white paper, zero apologia.",
    description:
      "Pure black-on-white (or inverted) drama: no grays in critical paths, enormous weight differences, and poster-like certainty.",
    prompt:
      "Apply high-contrast duo discipline: true black and true white as the only values in critical paths (no mid-gray mush), hierarchy through extreme weight and scale contrast, imagery thresholded or duotoned into the same system, and inversion moments (black section → white section) as dramatic punctuation.",
    implementation: "Hard inversion sections via CSS custom property swaps; duotone imagery via CSS filter chain or SVG feColorMatrix.",
    stack: ["CSS"],
    tags: ["high-contrast", "black-white", "poster", "bold"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "scroll"],
  }),
];
