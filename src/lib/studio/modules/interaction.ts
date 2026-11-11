import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 10 — Interaction Design.                                   */
/* ------------------------------------------------------------------ */

export const INTERACTION_MODULES = [
  M({
    id: "interaction/interactive-cards",
    category: "interaction", subcategory: "pointer",
    name: "Interactive Card System",
    tagline: "Cards that lift, listen and lead somewhere.",
    description:
      "Cards respond to intent: lift with shadow bloom, inner media zooms slightly, arrow slides in — and the whole card is a real link, not a clickable div.",
    prompt:
      "Make cards honestly interactive: hover lifts {lift}px with shadow bloom over {dur}ms and media zooms to {zoom}×; a destination arrow slides 4px revealing direction; the whole card is a single <a> (title stretched-link pattern) with a visible focus state identical in spirit to hover; touch: first tap arms, second navigates, where preview exists.",
    implementation: "transform + box-shadow transitions; stretched-link via ::after absolute inset-0 on the anchor; focus-visible parity with hover.",
    stack: ["CSS"],
    params: [
      num("lift", "Lift", 6, 0, 16, 1, "px"),
      num("dur", "Duration", 220, 100, 600, 20, "ms"),
      range("zoom", "Media zoom", 1.04, 1, 1.15, 0.01, "×"),
    ],
    tags: ["cards", "hover", "lift", "links"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover"],
    a11y: "One anchor per card (not nested interactive divs); focus-visible ring on the card container.",
  }),
  M({
    id: "interaction/tilt-config",
    category: "interaction", subcategory: "pointer",
    name: "Product Configurator",
    tagline: "Choice → live visual → honest price.",
    description:
      "A configurator where every choice (color, size, finish) updates the visual and the price immediately, and the state is shareable by URL.",
    prompt:
      "Build the configurator so choices feel physical: selecting a finish crossfades the material/swatch over {dur}ms, price recalculates with a count-up in tabular numerals, incompatible options explain themselves inline (not silent disabling), the configuration encodes into the URL (shareable), and a summary rail stays mounted on mobile as a bottom bar.",
    implementation: "State → derived product + price via pure function (unit-test it); URL sync via history.replaceState; option compatibility matrix in data.",
    stack: ["Next.js", "TypeScript"],
    params: [num("dur", "Crossfade", 350, 100, 900, 50, "ms")],
    tags: ["configurator", "product", "options", "price"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover", "pointer"],
    suggests: ["motion/camera-orbit"],
  }),
  M({
    id: "interaction/drag-physics",
    category: "interaction", subcategory: "gesture",
    name: "Drag with Physics",
    tagline: "Grab, throw, rubber-band — rails that feel native.",
    description:
      "Pointer-draggable rails/carousels with momentum, rubber-band edges and snap points — indistinguishable-in-spirit from native scroll.",
    prompt:
      "Implement drag physics on rails: pointer capture, translate following 1:1 while held, release with momentum (velocity sampled over last {win}ms, friction {friction}), rubber-band resistance past bounds ({rubber}), snap-to-item {snap} when velocity < threshold; keyboard arrows translate item-by-item with the same physics.",
    implementation: "pointerdown/move/up on the rail; transform translateX; snap = nearest item offset; cancel momentum on re-grab mid-flight.",
    stack: ["pointer events", "rAF"],
    params: [
      num("win", "Velocity window", 90, 30, 200, 10, "ms"),
      range("friction", "Friction", 0.94, 0.85, 0.99, 0.005, "/frame"),
      range("rubber", "Edge rubber", 0.3, 0.1, 0.8, 0.05, ""),
      select("snap", "Snap", "to nearest item", ["to nearest item", "free", "to page"]),
    ],
    tags: ["drag", "momentum", "rail", "carousel"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "The rail is also a real scroll container (overflow-x fallback) so wheel/keyboard/touch all work unscripted.",
    demo: "drag-inertia",
  }),
  M({
    id: "interaction/hover-previews",
    category: "interaction", subcategory: "pointer",
    name: "Contextual Hover Previews",
    tagline: "Peek before you commit.",
    description:
      "Hovering links/list entries shows a preview (image, mini UI, definition) near the pointer — commitment-free browsing.",
    prompt:
      "Attach hover previews to links and list rows: after {delay}ms intent delay, a floating preview ({size}px) appears near the pointer with 120ms fade+scale (0.96→1) and trails at {lerp} lag; dismisses instantly on leave; previews lazy-mount content; keyboard focus triggers the same preview anchored to the element.",
    implementation: "Intent timer on enter; portal-rendered preview layer; position clamped to viewport with 12px margins.",
    stack: ["React portal", "rAF"],
    params: [
      num("delay", "Intent delay", 120, 0, 400, 20, "ms"),
      num("size", "Preview width", 320, 180, 560, 20, "px"),
      range("lerp", "Trail lag", 0.18, 0.05, 0.5, 0.01, ""),
    ],
    tags: ["preview", "hover", "peek", "context"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Also on focus-visible; never the sole carrier of essential info; Esc dismisses.",
  }),
  M({
    id: "interaction/3d-tilt-config-cards",
    category: "interaction", subcategory: "pointer",
    name: "Gallery Tilt + Glare Cards",
    tagline: "Flat cards become objects in the hand.",
    description:
      "Gallery cards with 3D tilt + moving specular glare and a cursor-tracked shine band — tactile browsing for media grids.",
    prompt:
      "Make gallery cards physical: tilt toward pointer (max {max}°, perspective {persp}px), glide a specular shine band across with pointer azimuth, elevate shadow by hover elevation; inner media counter-translates slightly (parallax pop {pop}px) for depth within the card; settle on leave over {reset}ms.",
    implementation: "Same tilt engine as motion/3d-tilt with an added shine ::after; media inner transform opposite sign; no tilt on touch.",
    stack: ["CSS 3D"],
    params: [
      num("max", "Max tilt", 8, 2, 20, 1, "deg"),
      num("persp", "Perspective", 1000, 500, 2000, 50, "px"),
      num("pop", "Media counter-pop", 18, 0, 48, 2, "px"),
      num("reset", "Settle", 400, 150, 900, 50, "ms"),
    ],
    tags: ["tilt", "glare", "gallery", "cards"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["pointer"],
    demo: "tilt",
  }),
  M({
    id: "interaction/expandable",
    category: "interaction", subcategory: "disclosure",
    name: "Honest Disclosure System",
    tagline: "Accordions that respect attention.",
    description:
      "Expandable content (accordions, details) with height-safe animation, one-open policy options, and semantic HTML at its core.",
    prompt:
      "Build disclosure on honest primitives: <details>/<summary> or button+aria-expanded with grid-template-rows 0fr→1fr height animation ({dur}ms); policy {policy} (single-open keeps pages tidy); state survives deep links (id-anchored target opens and scrolls); chevron rotates {chev}° — animation never clips line-height (add padding, not line squash).",
    implementation: "details/summary with ::details-content animation (modern) or measured-height rAF fallback; hashchange listener opens anchors.",
    stack: ["HTML", "CSS"],
    params: [
      num("dur", "Open duration", 260, 120, 600, 20, "ms"),
      select("policy", "Open policy", "one-at-a-time", ["one-at-a-time", "free"]),
      num("chev", "Chevron rotation", 180, 45, 180, 15, "°"),
    ],
    tags: ["accordion", "disclosure", "faq", "details"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover", "animated"],
    a11y: "Semantics first: details/summary work JS-free; aria-expanded mirrors state when custom-built.",
  }),
  M({
    id: "interaction/radial-menu",
    category: "interaction", subcategory: "navigation-ix",
    name: "Radial Command Menu",
    tagline: "Actions arranged in a circle, reached by flick.",
    description:
      "Radial menus fan actions around a trigger: arc layout, staggered bloom, flick-direction selection on touch.",
    prompt:
      "Provide a radial menu for its 4–8 primary actions: on trigger, actions bloom along a {arc}° arc with stagger ({stagger}ms, scale+fade), each target ≥44px with labels right-adjacent; selection by click or directional flick (pointer-up over wedge); Esc/click-outside closes; the layout orients to screen quadrant automatically.",
    implementation: "Polar positioning: item i at angle start+i·step, radius {radius}px; transforms computed at open; focus cycles visibly.",
    stack: ["Framer Motion"],
    params: [
      num("arc", "Arc span", 180, 90, 360, 15, "°"),
      num("stagger", "Bloom stagger", 26, 8, 80, 2, "ms"),
      num("radius", "Menu radius", 120, 80, 220, 10, "px"),
    ],
    tags: ["radial", "menu", "command", "fan"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Pure-button focus order fallback identical to a vertical menu; roving tabindex.",
  }),
  M({
    id: "interaction/scroll-spy-nav",
    category: "interaction", subcategory: "navigation-ix",
    name: "Scroll-Spy Navigation",
    tagline: "The nav always knows where you are.",
    description:
      "Side/section nav highlighting the active section via scroll position — waypoint maps for long pages.",
    prompt:
      "Track sections for the nav: IntersectionObserver rootMargin '{margin}' so the 'active' section flips when its middle crosses viewport center; nav item gets the accent marker (line grows, dot fills) with {dur}ms transition; clicking smooth-scrolls; hash updates silently (history.replace) for deep-linking.",
    implementation: "One observer over section[data-spy]; active id in state; nav marker animates via transform; smooth scroll respects reduced-motion (auto→instant).",
    stack: ["IntersectionObserver"],
    params: [
      select("margin", "Trigger band", "-45% 0px -45% 0px", ["-45% 0px -45% 0px", "-30% 0px -60% 0px", "-50% 0px -50% 0px"]),
      num("dur", "Marker transition", 240, 100, 500, 20, "ms"),
    ],
    tags: ["scroll-spy", "nav", "waypoints", "active"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll"],
    demo: "scroll-spy",
  }),
  M({
    id: "interaction/command-palette",
    category: "interaction", subcategory: "navigation-ix",
    name: "Command Palette",
    tagline: "⌘K: every destination one query away.",
    description:
      "A ⌘K palette: fuzzy-find pages, actions and content with keyboard-first navigation and recent history.",
    prompt:
      "Add a command palette: ⌘K / Ctrl-K opens a centered dialog with context-scoped results (pages, actions, content), fuzzy matching under {budget}ms, grouped headers, arrow navigation with Enter to run, Esc to close, recent items section, and a footer hint bar. Result rows show icon + title + destination breadcrumb.",
    implementation: "Static manifest + runtime search (simple subsequence scoring); focus-trapped dialog (role=dialog aria-modal); ⌘K listener registered globally.",
    stack: ["React"],
    params: [num("budget", "Match budget", 60, 20, 200, 10, "ms")],
    tags: ["command", "palette", "keyboard", "search"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Full keyboard operation; aria-activedescendant on the listbox; mobile: reachable from the header search icon.",
    suggests: ["websites/developer-portfolio", "websites/dashboard"],
  }),
  M({
    id: "interaction/gesture-swipe",
    category: "interaction", subcategory: "gesture",
    name: "Swipe Gestures (Cards)",
    tagline: "Cards obey thumbs, not just mice.",
    description:
      "Swipeable card stacks/rails: directional drag with rotation, threshold commit, and honest affordances for the gesture.",
    prompt:
      "Make card rails swipe-native: horizontal drag with {rotate}° rotation proportional to displacement, commit threshold at {thresh}% of card width, velocity-assisted commit (fast flick = commit at lower distance), return spring (stiffness {stiff}, damping {damp}); visible affordance: card peeking, drag hint on first visit; buttons as gesture alternatives always present.",
    implementation: "Framer Motion drag='x' with dragConstraints + onDragEnd thresholds; keyboard: arrow keys move cards identically.",
    stack: ["Framer Motion"],
    params: [
      num("rotate", "Drag rotation", 6, 0, 20, 1, "°"),
      num("thresh", "Commit threshold", 35, 15, 60, 5, "%"),
      num("stiff", "Return stiffness", 320, 120, 700, 20),
      num("damp", "Return damping", 28, 12, 50, 1),
    ],
    tags: ["swipe", "gesture", "cards", "touch"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Every gesture has a button equivalent; screen readers see a list, not a stack metaphor.",
  }),
  M({
    id: "interaction/realtime-feedback",
    category: "interaction", subcategory: "pointer",
    name: "Live Form & Input Feedback",
    tagline: "Inputs answer while you type, not after you submit.",
    description:
      "Inputs validate on intent (blur/debounce, not keystroke terror), meters show strength, and success states land before submission.",
    prompt:
      "Give inputs live feedback with manners: validate on blur + debounce {deb}ms (never mid-word red), success check draws in {dur}ms, error copy explains the fix ('Add the @ to finish'), strength meters update with springs, and submit is never blocked without the reason visible inline. Autofocus only where the page IS a form.",
    implementation: "Debounce + touched state machine; aria-describedby error linkage; aria-live polite on validation text; icons + text (not color-only).",
    stack: ["React"],
    params: [
      num("deb", "Validate debounce", 350, 100, 900, 50, "ms"),
      num("dur", "Check-draw", 380, 150, 800, 20, "ms"),
    ],
    tags: ["forms", "validation", "feedback", "inputs"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover", "animated"],
    a11y: "Errors announced via aria-live; icons supplementary to text; form errors summarized top-of-form on submit failure.",
  }),
  M({
    id: "interaction/interactive-diagram",
    category: "interaction", subcategory: "disclosure",
    name: "Interactive Diagrams",
    tagline: "Architecture you can poke.",
    description:
      "System diagrams (architecture, process, anatomy) where nodes are hoverable/clickable and connections highlight to explain flow.",
    prompt:
      "Make diagrams interactive: nodes (SVG groups) hover-highlight with connected edges lighting at {edge}% brightness and the explanation rail updating ({dur}ms crossfade); click pins the selection; edges are real paths (arrowheads honest to data flow); tab order follows the data's logical order, not layout position.",
    implementation: "SVG with data-node/data-edge ids; a state → derive lit set → class-toggle; side panel keyed to selection with real copy per node.",
    stack: ["SVG", "React"],
    params: [
      num("edge", "Lit edge brightness", 100, 40, 100, 5, "%"),
      num("dur", "Panel crossfade", 220, 100, 500, 20, "ms"),
    ],
    tags: ["diagram", "architecture", "interactive", "svg"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Each node focusable with its description available to screen readers (aria-describedby).",
  }),
  M({
    id: "interaction/spatial-nav",
    category: "interaction", subcategory: "navigation-ix",
    name: "Spatial / Canvas Navigation",
    tagline: "Fly the content, don't scroll it.",
    description:
      "Navigation as camera movement between content islands on a 2D plane — with full classic-nav parity.",
    prompt:
      "Offer spatial navigation: content islands positioned on a 2D plane; moving between islands flies the camera (lerp {lerp}, {dur}ms) along eased arcs; a classic top nav and keyboard focus order fly the same camera; overview available anytime (zoom-out hotkey/nav item); camera state encodes to URL hash for shareability.",
    implementation: "Camera transform container (translate+scale); focus listener flies camera to focused island; prefers-reduced-motion → instant jump cuts.",
    stack: ["CSS transforms", "rAF"],
    params: [
      range("lerp", "Camera ease", 0.1, 0.04, 0.3, 0.01, ""),
      num("dur", "Flight time", 900, 300, 2000, 50, "ms"),
    ],
    tags: ["spatial", "canvas", "camera", "navigation"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["pointer", "realtime"],
    a11y: "Classic nav + focus-order parity are non-negotiable; overview makes space legible; reduced-motion uses jump cuts.",
    fallback: "A vertical stacked page lists every island fully.",
    suggests: ["layout/infinite-canvas"],
  }),
];
