import { M, num, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 03 — Layout & Composition.                                 */
/* ------------------------------------------------------------------ */

export const LAYOUT_MODULES = [
  M({
    id: "layout/bento-grid",
    category: "layout", subcategory: "grids",
    name: "Bento Grid",
    tagline: "Apple-style feature boxes with sized importance.",
    description:
      "A bento grid composes a section from rectangular cells of varying spans, each a self-contained mini-experience: feature name, mini-UI, or stat.",
    prompt:
      "Compose the section as a bento grid: a 12-column grid where feature cells span 4/6/8 columns and 1–2 rows by importance, every cell a self-contained mini-experience (label, one-line value, and a small live artifact — mini chart, snippet, toggle demo). Cells share 1px borders and consistent radius; one hero cell carries the primary feature.",
    implementation: "CSS Grid: grid-template-columns: repeat(12, 1fr) with col/row spans per cell; cells 1px-border, radius 16–20px, aspect stability during hover loops.",
    stack: ["Tailwind CSS"],
    params: [
      num("cols", "Desktop columns", 12, 4, 12, 2, undefined, "Grid columns on ≥1024px"),
      num("gap", "Cell gap (px)", 16, 8, 40, 4, "px"),
    ],
    tags: ["bento", "grid", "features", "cards"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover"],
    responsive: "Collapse to 2 columns at 768px and single column under 560px; span order follows visual importance, not DOM luck.",
  }),
  M({
    id: "layout/asymmetric-grid",
    category: "layout", subcategory: "grids",
    name: "Asymmetric Grid",
    tagline: "Deliberate imbalance with engineered tension.",
    description:
      "Asymmetric layout places primary content off-center (roughly 62/38) and uses the imbalance productively: secondary content, meta and whitespace in counterpoint.",
    prompt:
      "Compose key sections on an asymmetric grid: primary content occupies the golden-ratio majority (~62%), secondary/meta content the remainder, with a visible tension axis along the divide. Keep the baseline rhythm aligned so asymmetry reads as intent, not accident.",
    implementation: "CSS Grid with 5fr-3fr style tracks; alignment to a shared baseline grid; divide axis occasionally inverted for rhythm.",
    stack: ["CSS Grid"],
    tags: ["asymmetric", "grid", "tension", "golden-ratio"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "Under 900px asymmetry collapses to stacked order: primary first, counterpoint second.",
  }),
  M({
    id: "layout/modular-grid",
    category: "layout", subcategory: "grids",
    name: "Modular Grid",
    tagline: "Bauhaus-grade rows × columns discipline.",
    description:
      "A modular grid divides space into repeated modules (rows × columns) with content snapping to module boundaries — the backbone of editorial and dashboard order.",
    prompt:
      "Use a modular grid: repeated square-ish modules (e.g. 12 columns with consistent row units of 8px multiples), all content blocks sized in whole modules, captions and meta aligned to module edges. The grid should be visible enough to feel (use hairline borders or background ticks) without turning into a cage.",
    implementation: "grid-template-columns: repeat(12, 1fr); row spans via grid-row: span N; baseline unit 8px; debug overlay available in dev.",
    stack: ["CSS Grid"],
    tags: ["modular", "grid", "discipline", "editorial"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "layout/masonry",
    category: "layout", subcategory: "grids",
    name: "Masonry",
    tagline: "Pinterest flow for mixed-aspect media.",
    description:
      "Masonry packs mixed-aspect media into columns without forced cropping, preserving each item's natural shape.",
    prompt:
      "Lay out the media collection as masonry: items keep natural aspect ratios and pack into 2–4 columns with consistent gutters; order flows column-balanced rather than strictly left-to-right. Lazy-load with aspect-ratio boxes reserved to avoid layout shift; on load items fade-rise gently.",
    implementation: "CSS columns for pure masonry or grid + row-span estimation; reserve space via aspect-ratio attr; loading=lazy with decode=async.",
    stack: ["CSS"],
    params: [num("cols", "Columns", 3, 2, 5, 1, undefined, "Desktop column count")],
    tags: ["masonry", "gallery", "media", "grid"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    responsive: "2 columns at tablet, 1 on small phones; never crop media to force alignment.",
  }),
  M({
    id: "layout/swiss-grid",
    category: "layout", subcategory: "grids",
    name: "Swiss Grid",
    tagline: "The canonical 12-column discipline.",
    description:
      "The Swiss grid: fixed columns and gutters, flush-left alignment, margins as active whitespace, and every element justified against the verticals.",
    prompt:
      "Use a canonical Swiss grid: 12 columns, fixed gutters (24px desktop / 16px mobile), content max-width 1200px, all elements flush to column edges, margins treated as active compositional whitespace. Nothing centers unless it's a deliberate plate (a figure, a quote).",
    implementation: "Container max-w-[1200px] px-6; grid-cols-12 gap-6; images and figures snap to column spans; no fractional spans.",
    stack: ["Tailwind CSS"],
    tags: ["swiss", "grid", "columns", "discipline"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/swiss"],
  }),
  M({
    id: "layout/broken-grid",
    category: "layout", subcategory: "grids",
    name: "Broken Grid",
    tagline: "Overlap and interrupt the grid on purpose.",
    description:
      "A broken grid keeps a real grid underneath, then lets select elements overlap, rotate or spill — productive disruption with a safety net.",
    prompt:
      "Use a broken grid with discipline: establish a normal grid, then let 1–2 elements per viewport break it — overlapping imagery, media spilling into margins, captions rotated across column lines. The breaks must be anchored (still snapping to the grid at some edges) so the tension reads designed, not buggy.",
    implementation: "Grid + negative margins / absolute anchors tied to grid lines; z-index documented; overlaps never cover interactive elements.",
    stack: ["CSS Grid"],
    tags: ["broken-grid", "overlap", "disruption", "avant"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static", "scroll"],
    responsive: "Breaks reduce on tablet and vanish on mobile — mobile gets a single calm column.",
  }),
  M({
    id: "layout/full-bleed",
    category: "layout", subcategory: "heroes",
    name: "Full-Bleed Composition",
    tagline: "Media touches glass to glass.",
    description:
      "Full-bleed sections let imagery run edge to edge, breaking the container rhythm for moments of scale and cinema.",
    prompt:
      "Use full-bleed composition for hero and act-break moments: media runs edge-to-edge of the viewport (no container), with text either overlaid on a scrimmed zone or clearly separated before/after the bleed. Pair with narrow-measure prose sections so the contrast between cinematic and intimate reading becomes a rhythm.",
    implementation: "width: 100vw breakout from column layout; overlaid text protected by gradient scrim (~45% black) verified for WCAG contrast.",
    stack: ["CSS"],
    tags: ["full-bleed", "cinema", "edge-to-edge", "hero"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll"],
    a11y: "Verify overlaid text contrast 4.5:1 against the brightest part of the image; scrim is required, not optional.",
  }),
  M({
    id: "layout/split-screen",
    category: "layout", subcategory: "space",
    name: "Split-Screen",
    tagline: "Two worlds divided by one axis.",
    description:
      "Split-screen divides the viewport vertically: media on one side, narrative on the other — sticky variants let each half scroll independently.",
    prompt:
      "Compose hero/feature sections as split-screen: a vertical divide (50/50 or 62/38) with media on one side and narrative content on the other; the media side may be sticky while narrative scrolls. The divide is a design element — a hairline, a color change, or a full-bleed contrast.",
    implementation: "Two-pane grid; sticky media pane optional (position: sticky top-0 h-screen); content pane normal scroll; invert sides alternately per section.",
    stack: ["CSS"],
    params: [select("ratio", "Split ratio", "50/50", ["50/50", "62/38", "38/62"])],
    tags: ["split", "dual", "side-by-side", "sticky"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll"],
    responsive: "Stacks under 860px with media first, then content; dividers become horizontal hairlines.",
  }),
  M({
    id: "layout/overlap",
    category: "layout", subcategory: "space",
    name: "Overlapping Composition",
    tagline: "Elements in dialogue, not in boxes.",
    description:
      "Overlapping composition lets text, media and captions share space deliberately — a type block overlapping an image's empty zone creates depth without 3D.",
    prompt:
      "Compose features with deliberate overlap: headline blocks overlapping image dead-zones, caption plates crossing media borders, thumbnails layered over section dividers. Every overlap needs a depth decision (which layer is in front and why) and a repeat-safe rule so text remains selectable and readable.",
    implementation: "Grid cells with negative offsets; z-index scale documented; readability check: overlapped text over imagery requires 60%+ quiet zone behind.",
    stack: ["CSS Grid"],
    tags: ["overlap", "depth", "layers", "composition"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "Overlaps simplify under 768px — text detaches below media rather than clashing on small screens.",
  }),
  M({
    id: "layout/floating-panels",
    category: "layout", subcategory: "space",
    name: "Floating Panels",
    tagline: "Content plates hovering over atmosphere.",
    description:
      "Floating panels hover content cards over an atmospheric background (gradient, field or image), with soft elevation shadows and parallax separation.",
    prompt:
      "Compose the page from floating panels: rounded content plates elevated above an atmospheric backdrop (mesh gradient, field, or graded image) with soft multi-stop shadows; panels drift at 2–6% pointer parallax to sell the float. Keep panel surfaces calmer than the backdrop so content remains authoritative.",
    implementation: "Panels: radius 16–24px, shadow 0 24px 60px rgba(0,0,0,.35) + 1px top highlight; parallax via transform only, clamped to ±12px.",
    stack: ["CSS", "Framer Motion"],
    tags: ["floating", "panels", "elevation", "depth"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    suggests: ["backgrounds/mesh-gradient", "motion/pointer-parallax"],
  }),
  M({
    id: "layout/layered-depth",
    category: "layout", subcategory: "space",
    name: "Layered Depth",
    tagline: "Foreground, midground, background choreography.",
    description:
      "A layered composition with explicit depth planes: background atmosphere, midground structure, foreground content — each moving at its own scroll speed.",
    prompt:
      "Compose in explicit depth planes: background (atmosphere/gradient at slowest scroll speed), midground (large shapes or imagery at mid speed), foreground (content at full speed). Depth is consistent site-wide — document the three-plane rule so the whole site shares one optical physics.",
    implementation: "Planes as fixed/absolute layers transformed on scroll progress (translateY factors ~0.3/0.6/1.0); respects reduced-motion (all planes lock to 1.0).",
    stack: ["Framer Motion"],
    tags: ["layers", "depth", "parallax", "planes"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
    a11y: "Under prefers-reduced-motion all planes move at content speed (no relative drift).",
    suggests: ["motion/multi-layer-parallax"],
  }),
  M({
    id: "layout/horizontal-story",
    category: "layout", subcategory: "flow",
    name: "Horizontal Storytelling",
    tagline: "The page reads sideways, driven by the wheel.",
    description:
      "Horizontal scroll sections translate vertical wheel input into lateral movement through panels — galleries, timelines and collections read like filmstrips.",
    prompt:
      "Present the collection as a horizontal storytelling sequence: vertical scroll drives lateral translation through full-height panels (pinned section, container translateX proportional to scroll progress, ease none). Panel count 3–7; each panel is a complete scene; a progress tick indicates position; native horizontal swipe on touch.",
    implementation: "Pin wrapper, animate inner x from 0 to -(scrollWidth - viewportWidth) with scroll scrub; nested element triggers reference containerAnimation; touch falls back to native overflow-x scroll-snap.",
    stack: ["GSAP ScrollTrigger"],
    params: [num("panels", "Panel count", 4, 3, 7, 1, undefined, "Number of lateral scenes")],
    tags: ["horizontal", "scroll", "filmstrip", "gallery"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "All panels remain reachable by keyboard (focus moves scroll); provide a vertical-layout toggle link.",
    responsive: "On ≤820px switch to native horizontal swipe rail with scroll-snap — no pinned hijacking on touch.",
    fallback: "Without JS the panels render as a normal vertical stack.",
    demo: "scroll-pin",
  }),
  M({
    id: "layout/infinite-canvas",
    category: "layout", subcategory: "flow",
    name: "Infinite Canvas",
    tagline: "Zoomable space instead of a page.",
    description:
      "An infinite canvas replaces page scroll with pannable/zoomable space: content clusters as islands in a 2D world with a minimap.",
    prompt:
      "Design the experience as an infinite canvas: content lives as islands on a pannable, zoomable 2D plane with a dotted or faint-grid floor, inertia on pan, zoom limits (25–200%), and a semantic DOM mirror of every island for keyboard/screen-reader access. Provide an initial camera fit, a minimap, and 'reset view' affordance.",
    implementation: "Transform-based canvas (translate/scale container) or canvas-rendered; wheel = zoom toward cursor, drag = pan with inertia; DOM mirror via visually-hidden list linking to camera moves.",
    stack: ["TypeScript", "Canvas/SVG"],
    tags: ["infinite-canvas", "zoom", "pan", "spatial"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["pointer", "realtime"],
    a11y: "The DOM mirror is mandatory: every island focusable in a sensible order with an activate-to-fly-the-camera behavior.",
    fallback: "A conventional stacked page lists all islands fully when JS/transform unsupported.",
  }),
  M({
    id: "layout/fullscreen-hero",
    category: "layout", subcategory: "heroes",
    name: "Full-Screen Hero",
    tagline: "One viewport, one statement, complete commitment.",
    description:
      "A 100svh hero occupying the entire first viewport: one headline, one support line, one primary action, media or an atmosphere behind.",
    prompt:
      "Open with a full-screen hero: exactly 100svh, one display headline (clamp 2.75rem–6rem), one support line (max 64ch), one primary CTA cluster, and media/atmosphere behind with a scrim for text contrast. Include a scroll cue. The hero must meaningfully answer 'what is this' in 3 seconds.",
    implementation: "min-height: 100svh (svh for mobile chrome); headline via clamp(); scroll cue hidden after first scroll; LCP media prioritized (fetchpriority=high).",
    stack: ["CSS"],
    tags: ["hero", "fullscreen", "above-fold", "landing"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    responsive: "Use svh units so mobile browser chrome doesn't crop the statement; CTA reachable without scrolling at 360px height.",
  }),
  M({
    id: "layout/asymmetric-hero",
    category: "layout", subcategory: "heroes",
    name: "Asymmetric Hero",
    tagline: "Statement hard-left, spectacle bleeding right.",
    description:
      "An asymmetric hero anchors text in one third and lets media bleed or occupy the other two thirds with an intentional crop.",
    prompt:
      "Compose an asymmetric hero: text block anchored in the left (or right) third on the baseline grid, media occupying the remaining width with an art-directed crop that may bleed off edges; a meta strip (mono, small) runs along the bottom edge. The empty quadrant is compositional mass, not unused space.",
    implementation: "12-col grid — text spans 4, media spans 8 with negative right margin to viewport edge; meta strip as bottom border row.",
    stack: ["Tailwind CSS"],
    tags: ["hero", "asymmetric", "editorial", "bleed"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "Stacks at ≤860px: media as 4:3 banner above text.",
  }),
  M({
    id: "layout/centered-hero",
    category: "layout", subcategory: "heroes",
    name: "Centered Hero",
    tagline: "Symmetric focus, nothing to hide behind.",
    description:
      "A centered hero: type and media aligned on the central axis, ideal for product-first or announce-style pages.",
    prompt:
      "Compose a centered hero: eyebrow chip, giant centered headline (max 5 words per line ideal), support line, centered CTA pair (one filled, one ghost), then the product/proof media centered below with staged reveal. Symmetry demands typographic perfection — letterspacing and measure must be immaculate.",
    implementation: "text-align:center with max-width measures (headline 16ch, support 56ch); CTA cluster horizontally centered with gap-3.",
    stack: ["Tailwind CSS"],
    tags: ["hero", "centered", "product", "announce"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "layout/diagonal",
    category: "layout", subcategory: "heroes",
    name: "Diagonal Composition",
    tagline: "The horizon tilts; energy appears.",
    description:
      "Diagonal composition tilts section boundaries (2–6°) or arranges content on diagonals for kinetic energy.",
    prompt:
      "Introduce diagonal energy: section dividers cut at 2–6 degrees via clip-path, imagery tilted with consistent tilt logic (always the same direction per page), and a diagonal reading path from primary headline to primary CTA. Keep text horizontal — only surfaces and imagery tilt.",
    implementation: "clip-path: polygon() on section wrappers with overlap padding to hide seams; container queries guard small screens.",
    stack: ["CSS"],
    params: [num("angle", "Tilt angle", 4, 2, 8, 1, "deg")],
    tags: ["diagonal", "tilt", "energy", "composition"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
    responsive: "Diagonals flatten to 0–1° under 640px where clipping artifacts are most visible.",
  }),
  M({
    id: "layout/magazine-spread",
    category: "layout", subcategory: "heroes",
    name: "Magazine Spread",
    tagline: "Two-page logic in one viewport.",
    description:
      "The magazine spread composes a viewport like a print spread: folio numbers, kickers, a dominant image plate, and a mix of column widths.",
    prompt:
      "Compose sections like magazine spreads: one dominant image plate (60%+ of space), folio-style page furniture (section number, running title in tiny mono), text in mixed column widths (a wide intro column and narrow note columns), and captions treated as designed objects. Each 'spread' should feel turnable.",
    implementation: "Grid with named areas; folio strips as border rows; captions absolutely positioned relative to plates.",
    stack: ["CSS Grid"],
    tags: ["magazine", "spread", "folio", "editorial"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["direction/editorial", "websites/magazine"],
  }),
  M({
    id: "layout/pinned-storytelling",
    category: "layout", subcategory: "flow",
    name: "Pinned Storytelling Sections",
    tagline: "The stage stays; the story passes through it.",
    description:
      "Pinned sections hold a visual stage fixed while scrolling content advances the scene state — the engine of scrollytelling.",
    prompt:
      "Use pinned storytelling: a full-viewport stage pins while N scroll steps (100vh each) advance its state — media swaps, charts redraw, text steps highlight in passing. Steps count 3–6; transitions between states scrub with scroll so reversing feels correct; a step indicator shows progress.",
    implementation: "position: sticky stage + step blocks each 100vh; IntersectionObserver with rootMargin -50% picks active step; state transitions are transform/opacity only.",
    stack: ["CSS", "IntersectionObserver"],
    params: [num("steps", "Story steps", 4, 2, 8, 1, undefined, "How many scenes the pin contains")],
    tags: ["pinned", "scrollytelling", "sticky", "steps"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "All step content must exist in the DOM in reading order; pinning cosmetics only — content readable with CSS disabled.",
    responsive: "Below 768px pinning disables; stage becomes a normal figure above each step's text.",
    demo: "scroll-pin",
    suggests: ["websites/scrollytelling", "motion/scroll-scrub"],
  }),
  M({
    id: "layout/fullscreen-nav",
    category: "layout", subcategory: "space",
    name: "Fullscreen Navigation Overlay",
    tagline: "The menu is a page, not a dropdown.",
    description:
      "A fullscreen nav overlay: menu opens as a full-viewport scene with oversized links, meta info, and staged reveal animation.",
    prompt:
      "Design navigation as a fullscreen overlay: opening the menu covers the viewport with a scene (background treatment consistent with art direction), oversized staggered link list (display type, 40–72px), secondary meta (contact, socials, status) in mono, and a disciplined open/close choreography (350–500ms, links stagger 40–60ms). Focus is trapped while open; Esc closes.",
    implementation: "Dialog semantics: role=dialog aria-modal; focus trap; body scroll lock; links staggered via transition-delay; backdrop blur optional.",
    stack: ["Framer Motion"],
    tags: ["navigation", "menu", "overlay", "fullscreen"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "aria-modal + focus trap + Esc-to-close + return focus to the trigger on close.",
    demo: "menu-overlay",
  }),
  M({
    id: "layout/spatial-z",
    category: "layout", subcategory: "space",
    name: "Z-Space Paging",
    tagline: "Forward/backward through depth, not just down.",
    description:
      "Sections transition along the z-axis: the page zooms into the next scene or pulls back from the current one.",
    prompt:
      "Choreograph key section transitions along the z-axis: as the next section enters, it approaches from slight depth (scale 0.92→1, blur→0) or the current recedes (scale 1→1.06 fading). Use sparingly for act breaks (home→work, work→case). The effect sells camera logic; the DOM remains a normal vertical page.",
    implementation: "transform: scale + filter: blur(4px→0) on entering section, scroll-scrubbed over 30vh; GPU-friendly (transform+opacity only at high traffic).",
    stack: ["Framer Motion"],
    tags: ["z-space", "depth", "zoom", "transitions"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll", "animated"],
    a11y: "Reduced-motion: sections crossfade instead of zoom.",
  }),
  M({
    id: "layout/vertical-flow",
    category: "layout", subcategory: "flow",
    name: "Vertical Editorial Flow",
    tagline: "The classic scroll, optimized to the millimeter.",
    description:
      "A disciplined vertical flow: alternating density (media-heavy ↔ type-quiet), section rhythm of 96–128px, and consistent eyebrow→headline→content ladders.",
    prompt:
      "Structure the page as a disciplined vertical editorial flow: consistent section architecture (eyebrow → headline → lead → content), vertical rhythm of py-24→py-32 on desktop, alternating density (a media-heavy section followed by a quiet type section), and a footer that works as a designed final scene rather than an afterthought.",
    implementation: "Section component enforcing the ladder; rhythm tokens; density alternation audited at page level.",
    stack: ["Tailwind CSS"],
    tags: ["vertical", "flow", "rhythm", "editorial"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll"],
  }),
];
