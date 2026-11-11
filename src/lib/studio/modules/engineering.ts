import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 11 — Responsiveness, Accessibility & Performance.          */
/*  Modules here compile into hard engineering requirements.            */
/* ------------------------------------------------------------------ */

export const ENGINEERING_MODULES = [
  M({
    id: "engineering/reduced-motion",
    category: "engineering", subcategory: "access",
    name: "Reduced-Motion Contract",
    tagline: "prefers-reduced-motion is a design brief, not a bugfix.",
    description:
      "A global contract: under prefers-reduced-motion, every animation collapses to crossfades or stills, scroll-jacking disables, ambient loops freeze.",
    prompt:
      "Implement the reduced-motion contract: prefers-reduced-motion turns travel animations into ≤{fade}ms crossfades, disables scroll-hijacking/parallax/video autoplay, freezes ambient loops to a chosen still, and preserves all content and function. Audit route-by-route; the motion score must degrade to an editorial static design, not a half-broken one.",
    implementation: "Global CSS media query + framer/gsap motion context swap; each animated module ships an explicit static counterpart; smoke-test with forced reduced motion.",
    stack: ["CSS media-query", "matchMedia"],
    params: [num("fade", "Crossfade budget", 120, 60, 300, 10, "ms")],
    tags: ["reduced-motion", "accessibility", "vestibular", "a11y"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/keyboard-access",
    category: "engineering", subcategory: "access",
    name: "Full Keyboard Operation",
    tagline: "Every pixel of function reachable by Tab.",
    description:
      "Complete keyboard access: logical tab order, visible focus rings, roving tabindex widgets, Esc closes layers, skip-link first focusable.",
    prompt:
      "Guarantee full keyboard operation: skip-to-content as first focusable element, 2px focus-visible rings (never outline:none without replacement), correct tab order mirroring visual logic, roving tabindex on toolbars/lists/menus, focus trap + Esc in dialogs and menus, and hover-only affordances with focus equivalents.",
    implementation: ":focus-visible tokens; focus-trap util for modals; e2e keyboard pass: reach and operate every control without a mouse.",
    stack: ["HTML", "ARIA"],
    tags: ["keyboard", "focus", "tab-order", "a11y"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/screen-reader",
    category: "engineering", subcategory: "access",
    name: "Screen-Reader Integrity",
    tagline: "The DOM reads as well as the page looks.",
    description:
      "Screen-reader hygiene: landmarks, heading ladder, live regions for async changes, decorative layers hidden, split-text labeled correctly.",
    prompt:
      "Enforce screen-reader integrity: header/nav/main/footer landmarks on every route, one h1 per page with logical h2→h3 ladder, aria-live=polite on async regions (counters, validation, cart), decorative canvases/animations aria-hidden, split-character text aria-hidden with the intact string as aria-label on the parent, images with meaningful alt or alt=''.",
    implementation: "Landmark audit + axe runs per route; custom 'split text' component encapsulates the label/hidden contract once.",
    stack: ["ARIA", "axe"],
    tags: ["screen-reader", "aria", "landmarks", "a11y"],
    difficulty: "intermediate", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/touch-targets",
    category: "engineering", subcategory: "access",
    name: "Touch & Target Standards",
    tagline: "44px minimums, no hover-only secrets.",
    description:
      "Touch standards: ≥44×44px targets, 8px spacing, hover-only affordances get tap equivalents, devicehover detection swaps patterns.",
    prompt:
      "Apply touch standards: all interactive targets ≥ {size}×{size}px (visual target may be smaller if hit area is padded), adjacent targets separated ≥ 8px, hover-only content (previews, tooltips) duplicated behind tap/focus, @media (hover:none) swaps cursor-reactive embellishments for autonomous states, and double-tap zoom is never implied as navigation.",
    implementation: "Hit-area audit (pseudo-element padding where needed); (hover:hover)/(pointer:fine) gates for cursor features.",
    stack: ["CSS", "media queries"],
    params: [num("size", "Minimum target", 44, 40, 56, 2, "px")],
    tags: ["touch", "targets", "mobile", "a11y"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/responsive-typography",
    category: "engineering", subcategory: "perf",
    name: "Fluid Responsiveness",
    tagline: "clamp() type and container-aware layout, no breakpoints soup.",
    description:
      "Fluid design: type and spacing scale via clamp() between 360px and 1600px with a few meaningful breakpoints, not dozens.",
    prompt:
      "Engineer fluid responsiveness: type and spacing interpolate via clamp(min, vw-term, max) between {minW}px and {maxW}px viewports; layout intention changes at ≤3 breakpoints (e.g. 640/1024); container queries for component-internal shifts; zero horizontal overflow at every width 360–2560; test the 768px tablet 'awkward zone' explicitly.",
    implementation: "Design tokens computed as clamp() pairs from the editorial scale; visual regression at 360/390/768/1024/1440/1920.",
    stack: ["CSS clamp()"],
    params: [
      num("minW", "Fluid from", 360, 320, 480, 10, "px"),
      num("maxW", "Fluid to", 1440, 1100, 1920, 20, "px"),
    ],
    tags: ["responsive", "fluid", "clamp", "breakpoints"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/gpu-budget",
    category: "engineering", subcategory: "perf",
    name: "GPU & Frame Budget",
    tagline: "60fps target with an honest throttle plan.",
    description:
      "A rendering budget: 60fps target on mid hardware, 16ms frame accounting, DPR caps, and an auto-quality governor when frames overrun.",
    prompt:
      "Enforce a GPU/frame budget: target {fps}fps on a mid-range laptop (M1 Air class) — measure with a real frame-time histogram; cap devicePixelRatio at {dpr}; heavy shaders render ≤ 75% of viewport area or at reduced internal resolution; auto-governor: {policy} when p95 frame exceeds {budget}ms for 2s (drop DPR → halve effects → freeze to still).",
    implementation: "Frame-time sampler (rolling p95), adaptive renderer loop; document the three quality tiers and their triggers.",
    stack: ["rAF", "WebGL"],
    params: [
      num("fps", "Target", 60, 30, 120, 5, "fps"),
      num("dpr", "Max DPR", 2, 1, 3, 0.25, ""),
      num("budget", "Frame budget", 20, 12, 40, 1, "ms "),
      select("policy", "Governor policy", "drop DPR then freeze", ["drop DPR then freeze", "halve effects then still", "user prompt to disable"]),
    ],
    tags: ["gpu", "performance", "budget", "fps"],
    difficulty: "advanced", perf: "light", dimension: "none", interactivity: ["static"],
    suggests: ["webgl/three-scene"],
  }),
  M({
    id: "engineering/lazy-3d",
    category: "engineering", subcategory: "perf",
    name: "Lazy 3D Mounting",
    tagline: "WebGL loads when it's near the viewport, not on entry.",
    description:
      "3D scenes lazy-mount: libraries dynamically imported, canvases mount in view, dispose and release WebGL contexts on leave.",
    prompt:
      "Lazy-mount all 3D: dynamic-import Three/R3F modules (out of the initial bundle), mount the WebGL canvas when its section is {margin} from the viewport, fully dispose (geometry/material/context) when scrolled away for >{ttl}s; first 3D paint has a static poster already in place, so users never see a void.",
    implementation: "next/dynamic ssr:false + IntersectionObserver gate; dispose on intersection exit; context-count discipline (< 8 live contexts).",
    stack: ["Next.js dynamic", "IntersectionObserver"],
    params: [
      num("margin", "Pre-mount margin", 600, 0, 1600, 50, "px"),
      num("ttl", "Dispose after", 4, 0, 30, 1, "s offscreen"),
    ],
    tags: ["lazy", "3d", "bundle", "webgl-lifecycle"],
    difficulty: "intermediate", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/adaptive-particles",
    category: "engineering", subcategory: "perf",
    name: "Adaptive Density Scaling",
    tagline: "Particle counts that respect the device.",
    description:
      "Effects auto-scale density (particles, instances, cells) to device capability and viewport area instead of fixed counts everywhere.",
    prompt:
      "Scale effect density adaptively: count = clamp(area / {density}, {floor}, {ceiling}) with tier multipliers (low-power ×{low}, mobile ×{mobile}, save-data ×0); devices report reduced motion/data-saver and counts respect them; density changes re-seed smoothly (no visible pop).",
    implementation: "Tier detection via hardwareConcurrency/deviceMemory/saveData/matchMedia; counts recomputed on resize debounce.",
    stack: ["Canvas/WebGL"],
    params: [
      num("density", "Px per particle", 18000, 6000, 60000, 1000),
      num("floor", "Minimum", 40, 8, 200, 4),
      num("ceiling", "Maximum", 260, 40, 1200, 20),
      num("low", "Low-power multiplier", 0.4, 0.1, 1, 0.05, "×"),
      num("mobile", "Mobile multiplier", 0.6, 0.2, 1, 0.05, "×"),
    ],
    tags: ["adaptive", "particles", "density", "mobile"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "engineering/media-optimization",
    category: "engineering", subcategory: "media-opt",
    name: "Media Optimization Standard",
    tagline: "AVIF, srcset, facades — pixels serve intent.",
    description:
      "Image/video discipline: next/image with real sizes, AVIF/WebP, video facades, no auto-playing backgrounds without posters.",
    prompt:
      "Apply the media standard: all imagery via responsive srcset → AVIF/WebP with {lqip} (LQIP/blur) placeholders; sizes attribute authored per layout (never 100vw lazy-default above the fold); hero media fetchpriority=high; videos facade-load (poster + play button) unless they ARE the hero (then muted, playsinline, ≤ {heroDur}s loops, poster always); no media ships without explicit width/height.",
    implementation: "next/image everywhere; video facade component; CLS zero-tolerance via reserved aspect boxes; LCP budget {lcp}s on 4G.",
    stack: ["next/image", "video facades"],
    params: [
      select("lqip", "Placeholder", "blur (data-uri)", ["blur (data-uri)", "solid dominant color", "shimmer skeleton"]),
      num("heroDur", "Hero loop cap", 24, 8, 60, 2, "s"),
      range("lcp", "LCP budget", 2.5, 1.5, 4, 0.1, "s (fast 4G)"),
    ],
    tags: ["images", "avif", "video", "lcp"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/webgl-fallback",
    category: "engineering", subcategory: "resilience",
    name: "WebGL Fallback Layer",
    tagline: "No GPU? The page still tells the story.",
    description:
      "WebGL failure plan: feature-detect, poster renders for visuals, full DOM content underneath, zero white screens.",
    prompt:
      "Implement WebGL fallback tiers: feature-detect WebGL2/WebGL1 at boot; visual scenes each provide {mode} (CSS/canvas substitute or rendered poster); DOM content must be complete and styled without the 3D layer (3D is enhancement); context-loss events restore gracefully (listen webglcontextlost, rebuild or degrade); log nothing scary to console for users without GPUs.",
    implementation: "Detection utility: try new WebGLRenderingContext in a temp canvas; per-scene fallback prop mandatory; context-loss handler per renderer.",
    stack: ["WebGL detection"],
    params: [select("mode", "Fallback mode", "poster image", ["poster image", "CSS gradient approximation", "2D canvas approximation"])],
    tags: ["fallback", "webgl", "resilience", "context-loss"],
    difficulty: "intermediate", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/low-power-mode",
    category: "engineering", subcategory: "resilience",
    name: "Low-Power / Data-Saver Mode",
    tagline: "The site senses weak conditions and calms down.",
    description:
      "Respect device constraints: Save-Data header, battery status, reduced-power toggles one 'calm mode' that dims effects.",
    prompt:
      "Add a calm-mode layer: triggers {triggers} (Save-Data, low battery, prefers-reduced-motion, manual toggle) converge on one 'calm' flag that halves particle densities, caps DPR at {dpr}, swaps video/3D for posters, and pauses ambient loops; flag exposed in the footer/status so users can override.",
    implementation: "navigator.saveData + getBattery() + matchMedia, merged into a useCalmMode() hook consumed by every effect module.",
    stack: ["Web APIs"],
    params: [
      select("triggers", "Trigger set", "save-data + reduced-motion", ["save-data + reduced-motion", "save-data + battery", "all four signals"]),
      num("dpr", "Calm DPR cap", 1.25, 1, 2, 0.25, ""),
    ],
    tags: ["low-power", "save-data", "calm", "resilience"],
    difficulty: "intermediate", perf: "light", dimension: "none", interactivity: ["static"],
    suggests: ["engineering/adaptive-particles", "engineering/gpu-budget"],
  }),
  M({
    id: "engineering/core-web-vitals",
    category: "engineering", subcategory: "perf",
    name: "Core Web Vitals Contract",
    tagline: "LCP, INP, CLS as acceptance criteria.",
    description:
      "Hard thresholds: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 — measured on throttled mobile, with the optimizations behind each number.",
    prompt:
      "Commit to Core Web Vitals as acceptance criteria: LCP ≤ {lcp}s (hero prioritized, fonts display=swap, no blocking third-party), INP ≤ {inp}ms (no long tasks > 50ms on interaction paths; heavy work in workers/rAF-idle), CLS ≤ {cls} (reserved media boxes, font metric overrides, no injected banners late); measure on 4G throttling + mid-tier mobile emulation in CI.",
    implementation: "web-vitals reporting in production (console/beacon); budgets reviewed per route; regression = build warning with the offending asset traced.",
    stack: ["web-vitals", "lighthouse CI"],
    params: [
      range("lcp", "LCP budget", 2.5, 1.8, 4, 0.1, "s"),
      num("inp", "INP budget", 200, 100, 400, 10, "ms"),
      num("cls", "CLS budget", 0.1, 0.02, 0.25, 0.01, ""),
    ],
    tags: ["vitals", "lcp", "inp", "cls", "performance"],
    difficulty: "intermediate", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/keyboard-focus-motion",
    category: "engineering", subcategory: "access",
    name: "Focus-Motion Pairing",
    tagline: "What hover does, focus gets.",
    description:
      "Every pointer-driven affordance has a focus twin: previews appear on focus, spotlights light up, drag rails arrow-key — parity as policy.",
    prompt:
      "Enforce focus/motion parity: inventory every hover/pointer affordance and give it a focus equivalent (previews on focus-visible, rail arrows as buttons, tilt→static elevation, spotlight→ambient highlight); keyboard users never discover content later than pointer users; focus indicators survive all themes (2px ring + offset, contrast-checked).",
    implementation: "Affordance inventory table in the styleguide; :focus-visible pair styles co-located with :hover so PRs can't ship hover-only.",
    stack: ["CSS", "ARIA"],
    tags: ["focus", "parity", "keyboard", "hover"],
    difficulty: "beginner", perf: "light", dimension: "none", interactivity: ["static"],
  }),
  M({
    id: "engineering/asset-budget",
    category: "engineering", subcategory: "perf",
    name: "Asset & Font Budget",
    tagline: "Every byte of identity justified in kilobytes.",
    description:
      "Font and asset budgets: self-hosted woff2 subsets, ≤3 families, zero icon fonts, sprites for illustration sets, total route weight capped.",
    prompt:
      "Set asset budgets: fonts self-hosted woff2, subset to latin(+ext as needed), ≤ {fams} families / {weights} weights total (variable fonts preferred), font-display: swap with size-adjust metric overrides to kill CLS; one icon system (SVG stroke, ≤1.5px); illustrations as optimized SVG or sprite; route first-load ≤ {kb}KB JS (reported per build), images excluded but each justified by its LCP role.",
    implementation: "next/font or @fontsource variable stacks; bundle analyzer report committed per release; per-route JS budget wired into CI.",
    stack: ["next/font", "bundle analysis"],
    params: [
      num("fams", "Max families", 3, 1, 5, 1),
      num("weights", "Max weights", 6, 2, 10, 1),
      num("kb", "First-load JS", 220, 100, 400, 10, "KB"),
    ],
    tags: ["fonts", "assets", "bundle", "budget"],
    difficulty: "intermediate", perf: "medium", dimension: "none", interactivity: ["static"],
  }),
];
