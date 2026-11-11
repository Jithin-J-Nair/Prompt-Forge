import { EASINGS, M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 06 — Motion Graphics. The largest library in the studio.   */
/*  Every module carries typed, technique-appropriate parameters.       */
/* ------------------------------------------------------------------ */

export const MOTION_MODULES = [
  /* ---------------- A. Scroll-based ---------------- */
  M({
    id: "motion/scroll-reveal",
    category: "motion", subcategory: "scroll",
    name: "Scroll Reveal",
    tagline: "Content rises into view, once, with manners.",
    description:
      "Elements fade and rise as they enter the viewport — the foundational scroll choreography. Fires once per element, never re-hides on scroll-up flicker.",
    prompt:
      "Reveal content on scroll: elements enter with opacity 0→1 and translateY({rise}px→0) over {duration}ms using {easing}, staggered {stagger}ms among siblings, triggered when {threshold}% of the element is visible. Fire once; elements never re-hide. Use IntersectionObserver, not scroll listeners.",
    implementation: "IntersectionObserver (threshold {threshold}%) toggles an 'in' class; CSS transition handles the move; observer unobserves after firing.",
    stack: ["IntersectionObserver", "CSS"],
    params: [
      range("rise", "Rise", 24, 0, 80, 2, "px"),
      range("duration", "Duration", 700, 200, 1600, 50, "ms"),
      range("stagger", "Stagger", 60, 0, 160, 10, "ms"),
      num("threshold", "Trigger threshold", 20, 5, 60, 5, "%"),
      select("easing", "Easing", "cubic-bezier(0.22, 1, 0.36, 1)", EASINGS),
    ],
    tags: ["scroll", "reveal", "fade-rise", "inview"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll"],
    a11y: "Under prefers-reduced-motion, elements render fully visible without transform.",
    demo: "reveal",
  }),
  M({
    id: "motion/scroll-scrub",
    category: "motion", subcategory: "scroll",
    name: "Scroll Scrub",
    tagline: "Animation progress IS scroll progress.",
    description:
      "Scrubbing binds animation progress directly to scroll position within a range — reverse the scroll, reverse the animation. The engine of cinematic sites.",
    prompt:
      "Scrub the target animation to scroll: progress = (scrollY − start) / (end − start) mapped 1:1 to the timeline with scrub smoothing of {lag}s (lag = catch-up ease, 0 = hard-linked). Animate transform/opacity only. Range: start '{start}', end '{end}'. Kill and revert the trigger on unmount.",
    implementation: "GSAP ScrollTrigger with scrub: {lag}, or CSS animation-timeline: scroll()/view() where supported (progressive enhancement); transform-only properties.",
    stack: ["GSAP ScrollTrigger", "CSS scroll-timeline"],
    params: [
      range("lag", "Scrub smoothing", 0.5, 0, 1.5, 0.1, "s", "0 = hard-locked to scroll"),
      select("start", "Range start", "top 80%", ["top bottom", "top 80%", "top center", "top top"]),
      select("end", "Range end", "bottom 30%", ["bottom bottom", "bottom 60%", "bottom 30%", "+=100%"]),
    ],
    tags: ["scrub", "scroll", "linked", "cinematic"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "Reduced-motion: the end state renders statically at full opacity.",
    demo: "scroll-scrub",
  }),
  M({
    id: "motion/sticky-pinning",
    category: "motion", subcategory: "scroll",
    name: "Sticky Pinning",
    tagline: "The stage holds still while the story scrolls.",
    description:
      "Pinning locks a section in the viewport for a scroll duration while internal animation advances — the pinned hero, the pinned product stage.",
    prompt:
      "Pin the section while its internal sequence plays: element stays fixed for {distance}vh of scroll; progress through that distance drives the internal timeline (scrub-linked). Reserve exact space (pin spacer) so layout doesn't jump; on release, the section scrolls away naturally.",
    implementation: "ScrollTrigger pin: true, end: '+=' + vh·{distance}/100 with pinSpacing true, or pure-CSS position: sticky inside a tall wrapper for scrub-free variants.",
    stack: ["GSAP ScrollTrigger", "CSS sticky"],
    params: [range("distance", "Pin distance", 200, 100, 600, 50, "vh")],
    tags: ["pin", "sticky", "stage", "scrollytelling"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "Content inside pinned regions stays in normal DOM order and focusable without visual pinning.",
    responsive: "Disable pinning below 820px: sections play as stacked static states.",
    demo: "scroll-pin",
    suggests: ["layout/pinned-storytelling"],
  }),
  M({
    id: "motion/parallax",
    category: "motion", subcategory: "scroll",
    name: "Parallax Drift",
    tagline: "Elements drift at different speeds, depth appears.",
    description:
      "Classic parallax: background elements translate slower than foreground as you scroll. Subtlety is the craft — 0.9 speed factors, not 0.3.",
    prompt:
      "Apply parallax drift: designated elements translate at {speed}× scroll speed (transform: translateY proportional to scroll progress within the section range). Speeds between 0.85–0.95 read as premium depth; below 0.7 risks nausea and breakage. Transform-only; never top/margin.",
    implementation: "Scroll-scrubbed translateY = (elementCenter − viewportCenter) × (1 − speed); rAF-throttled; clamped to ±60px.",
    stack: ["GSAP ScrollTrigger", "rAF"],
    params: [range("speed", "Speed factor", 0.9, 0.5, 1.1, 0.05, "×")],
    tags: ["parallax", "depth", "scroll", "drift"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "Disabled under prefers-reduced-motion (speed locked to 1).",
    demo: "parallax",
  }),
  M({
    id: "motion/multi-layer-parallax",
    category: "motion", subcategory: "scroll",
    name: "Multi-Layer Parallax",
    tagline: "Three planes at three speeds, one optics.",
    description:
      "Explicit depth planes (background 0.3×, midground 0.6×, foreground 1×) scrolling at different rates create cinematic depth on ordinary pages.",
    prompt:
      "Compose a three-plane parallax: background atmosphere at {bg}×, midground shapes at {mid}×, foreground content at 1×, all translated on scroll. Planes must tile or be oversized to never reveal edges; the effect concentrates in the hero and act breaks, not every section.",
    implementation: "Three absolutely-positioned layers; progress-driven translateY = range × (1 − factor); oversize layers by computed overshoot; reduced-motion collapses all to 1×.",
    stack: ["GSAP ScrollTrigger", "CSS"],
    params: [
      range("bg", "Background speed", 0.3, 0.1, 0.9, 0.05, "×"),
      range("mid", "Midground speed", 0.6, 0.2, 0.95, 0.05, "×"),
    ],
    tags: ["parallax", "layers", "cinematic", "depth"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["scroll"],
    a11y: "Reduced-motion locks all planes at 1×.",
    suggests: ["layout/layered-depth"],
  }),
  M({
    id: "motion/scroll-typography",
    category: "motion", subcategory: "scroll",
    name: "Scroll-Driven Typography",
    tagline: "Type grows, fills or condenses as you read.",
    description:
      "Scroll drives typographic state: weight, size, tracking or color-fill linked to reading progress — the manifesto reveal is the canonical use.",
    prompt:
      "Drive typography by scroll: for manifesto-style statements, each word's opacity/color animates {from}→{to} tied to its position in the scroll range (word-by-word fill), or display type weight interpolates wght {w0}→{w1} across a pinned range. The reader literally advances the statement.",
    implementation: "Per-word spans, progress = scroll range mapped per word index (GSAP scrub or CSS view() timeline per word); font-variation-settings for weight ramps.",
    stack: ["GSAP ScrollTrigger", "CSS view-timeline"],
    params: [
      select("from", "From state", "15% opacity", ["15% opacity", "outline stroke", "wght 300"]),
      select("to", "To state", "100% opacity", ["100% opacity", "solid fill", "wght 800"]),
      num("w0", "Weight start", 300, 100, 900, 50),
      num("w1", "Weight end", 800, 100, 900, 50),
    ],
    tags: ["scroll", "typography", "manifesto", "fill"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    a11y: "aria-label carries the full sentence; word spans aria-hidden; reduced-motion shows the filled final state.",
    demo: "scroll-scrub",
  }),
  M({
    id: "motion/scroll-3d-camera",
    category: "motion", subcategory: "scroll",
    name: "Scroll-Driven Camera",
    tagline: "The scrollbar flies the virtual camera.",
    description:
      "Scroll progress moves a WebGL camera along a spline path through the scene — the award-site move: environments revealed as narration advances.",
    prompt:
      "Bind camera to scroll: define a camera spline (Catmull-Rom through {waypoints} waypoints with lookAt targets per waypoint); scroll progress (0→1 across the pinned range) = spline parameter; pre-compute geometry/instancing at load so scroll playback only updates uniforms. Frame-rate target 60fps on mid-range mobile with adaptive DPR.",
    implementation: "Three.js/R3F: camera.position along spline via useFrame reading scroll uniform; ScrollTrigger provides progress; damp motion with lerp 0.08–0.12 for cinematic lag.",
    stack: ["Three.js", "GSAP ScrollTrigger"],
    params: [
      num("waypoints", "Camera waypoints", 4, 2, 8, 1),
      range("damping", "Camera damping", 0.08, 0.02, 0.3, 0.01, ""),
    ],
    tags: ["camera", "3d", "scroll", "spline", "webgl"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["scroll"],
    fallback: "Without WebGL, the same content renders as a pinned sequence of still frames (rendered images).",
    suggests: ["webgl/three-scene", "engineering/webgl-fallback", "engineering/gpu-budget"],
  }),
  M({
    id: "motion/horizontal-scroll",
    category: "motion", subcategory: "scroll",
    name: "Pinned Horizontal Scroll",
    tagline: "The wheel scrolls down; the world moves sideways.",
    description:
      "Vertical scroll translates a pinned panel-train horizontally — cinematic lateral movement with correct math (end = track width − viewport).",
    prompt:
      "Implement pinned horizontal scroll: pin the wrapper for the exact distance (trackWidth − viewportWidth), translate the inner track x: 0→−(trackWidth − vw) with ease none and scrub {lag}s. Panels keep full height; touch devices fall back to native overflow-x + scroll-snap; nested animations use containerAnimation.",
    implementation: "GSAP: gsap.to(track, {x: () => -(track.scrollWidth - innerWidth), scrollTrigger: {pin, scrub, end: '+=' + distance, invalidateOnRefresh}}).",
    stack: ["GSAP ScrollTrigger"],
    params: [range("lag", "Scrub lag", 0.6, 0, 1.6, 0.1, "s")],
    tags: ["horizontal", "pinned", "lateral", "panels"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    responsive: "≤820px: native horizontal swipe rail, no scroll hijacking.",
    fallback: "No-JS: panels stack vertically.",
    suggests: ["layout/horizontal-story"],
  }),
  M({
    id: "motion/progressive-image",
    category: "motion", subcategory: "scroll",
    name: "Progressive Image Reveal",
    tagline: "Images develop like prints in a tray.",
    description:
      "Scroll-linked image treatment: images sharpen from blur, resolve from pixelation, or wipe via mask as they enter — media feels developed, not loaded.",
    prompt:
      "Reveal images progressively on scroll: as an image enters {threshold}%, it develops over {duration}ms via {style} (blur 18px→0, scale 1.08→1, clip-path inset(12%)→0, or grayscale→color). One treatment per site, applied consistently; images above the fold load sharp without ceremony.",
    implementation: "IntersectionObserver + CSS transitions on filter/clip-path; the effect must not delay LCP — hero images skip it.",
    stack: ["CSS", "IntersectionObserver"],
    params: [
      select("style", "Development style", "blur-resolve", ["blur-resolve", "scale-settle", "mask-inset", "grayscale-resolve", "pixelate-up"]),
      range("duration", "Duration", 900, 300, 2000, 50, "ms"),
      num("threshold", "Trigger at", 25, 5, 60, 5, "%"),
    ],
    tags: ["image", "reveal", "blur", "mask"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    demo: "mask-reveal",
  }),
  M({
    id: "motion/scene-morph",
    category: "motion", subcategory: "scroll",
    name: "Scroll Scene Morphing",
    tagline: "One scene melts into the next as you pass through.",
    description:
      "Boundary-crossing transitions: as the scroll crosses a section boundary, the outgoing scene morphs (scale, hue, dissolve) into the incoming one.",
    prompt:
      "Morph scenes at section boundaries: over a {range}vh handoff window centered on the boundary, the outgoing scene scales {scale}→1.04 and dissolves while the incoming crossfades up; a shared accent color eases across the boundary to bind the two scenes. Choreograph at most two such morphs per page.",
    implementation: "Scroll progress across boundary window drives two counter-tweens (transform+opacity); keep both sections transform-only during handoff.",
    stack: ["GSAP ScrollTrigger"],
    params: [
      range("range", "Handoff window", 40, 20, 100, 5, "vh"),
      range("scale", "Initial scale", 0.96, 0.85, 1, 0.01, ""),
    ],
    tags: ["morph", "scene", "transition", "scroll"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
  }),

  /* ---------------- B. Typography motion ---------------- */
  M({
    id: "motion/line-reveal",
    category: "motion", subcategory: "type-motion",
    name: "Line-by-Line Reveal",
    tagline: "Each line rises out of its own mask.",
    description:
      "Multiline text reveals per line from masked containers — each line slides up out of overflow hidden, staggered, on entry or scroll.",
    prompt:
      "Reveal text line-by-line: wrap each line in an overflow-hidden mask; lines translateY 100%→0 over {duration}ms, staggered {stagger}ms, easing {easing}, on viewport entry. Split lines responsively (recompute on resize before revealing). Parent keeps aria-label, lines aria-hidden.",
    implementation: "Line splitting via range measurement or SplitText lines type; masks block overflow hidden; transform-only.",
    stack: ["GSAP SplitText", "CSS"],
    params: [
      range("duration", "Line duration", 800, 300, 1500, 50, "ms"),
      range("stagger", "Line stagger", 90, 30, 220, 10, "ms"),
      select("easing", "Easing", "power4.out", EASINGS),
    ],
    tags: ["lines", "mask", "reveal", "text"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "scroll"],
    a11y: "aria-label intact string on parent; reduced-motion renders all lines immediately.",
    demo: "char-stagger",
  }),
  M({
    id: "motion/text-mask-reveal",
    category: "motion", subcategory: "type-motion",
    name: "Clip-Path Text Reveal",
    tagline: "Text wipes in behind a traveling blade.",
    description:
      "Clip-path reveals wipe text or blocks in from an edge (inset animation) — like a blade uncovering content.",
    prompt:
      "Reveal elements via clip-path wipe: animate clip-path from inset(0 {from}% 0 0) to inset(0 0% 0 0) over {duration}ms with {easing}; direction {direction}. A thin accent blade (2px line at the wipe edge) may ride the wave for extra intent.",
    implementation: "clip-path transition (compositor-friendly in modern engines); blade as pseudo-element tracking the same keyframes.",
    stack: ["CSS"],
    params: [
      num("from", "Hidden %", 100, 50, 100, 5, "%"),
      range("duration", "Duration", 700, 250, 1600, 50, "ms"),
      select("direction", "Wipe direction", "left-to-right", ["left-to-right", "right-to-left", "top-down", "bottom-up"]),
      select("easing", "Easing", "cubic-bezier(0.22, 1, 0.36, 1)", EASINGS),
    ],
    tags: ["clip-path", "wipe", "mask", "reveal"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "scroll"],
    demo: "mask-reveal",
  }),
  M({
    id: "motion/text-displacement",
    category: "motion", subcategory: "type-motion",
    name: "Text Displacement Field",
    tagline: "Glyphs scatter, then recall to formation.",
    description:
      "Characters start scattered by a noise field (random offsets/rotations) and animate to perfect formation on entry or scroll — entropy to order.",
    prompt:
      "Scatter-to-form text: each character starts at a noise-driven offset (±{spread}px translate, ±{rot}° rotate, opacity 0) and animates to identity over {duration}ms with stagger {stagger}ms, easing {easing}. Deterministic per-character seeds (char code based) so SSR/CSR and re-renders match.",
    implementation: "Seeded PRNG per character index; initial styles inline; tween to identity; cleanup transforms to none on completion (avoid blurry text at rest).",
    stack: ["GSAP", "Framer Motion"],
    params: [
      num("spread", "Scatter spread", 60, 10, 200, 10, "px"),
      num("rot", "Max rotation", 30, 0, 90, 5, "deg"),
      range("duration", "Duration", 900, 300, 2000, 50, "ms"),
      range("stagger", "Stagger", 18, 4, 60, 2, "ms"),
      select("easing", "Easing", "power3.out", EASINGS),
    ],
    tags: ["displacement", "scatter", "entropy", "text"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "scroll"],
    a11y: "Final state removes transforms; parent carries accessible label.",
  }),
  M({
    id: "motion/variable-font-anim",
    category: "motion", subcategory: "type-motion",
    name: "Variable Font Animation",
    tagline: "Weight breathes along the sentence.",
    description:
      "Animating font-variation-settings (wght/wdth) across characters or over time — type that flexes muscle without moving a pixel.",
    prompt:
      "Animate font axes: oscillate wght between {w0} and {w1} across {cycle}s with a per-character phase offset for wave effects, or drive wght from hover proximity (pointer distance → weight ramp within {radius}px). Requires a variable font with the axis; provide nearest static weight otherwise.",
    implementation: "per-char font-variation-settings: 'wght' v; rAF wave or pointer-proximity mapping; cap repaints by transforming a cheap compositing hint (content-visibility).",
    stack: ["Variable fonts", "rAF"],
    params: [
      num("w0", "Weight from", 300, 100, 900, 50),
      num("w1", "Weight to", 750, 100, 900, 50),
      range("cycle", "Cycle", 4, 1.5, 12, 0.5, "s"),
      num("radius", "Hover radius", 180, 60, 400, 20, "px"),
    ],
    tags: ["variable-font", "weight", "wave", "hover"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    a11y: "Weight-only animation is motion-safe but still pauses under reduced-motion for vestibular comfort.",
    fallback: "Two static weights swapped on hover.",
  }),
  M({
    id: "motion/type-on-scroll-path",
    category: "motion", subcategory: "type-motion",
    name: "Type Riding a Scroll Path",
    tagline: "Headlines travel along a curve as you scroll.",
    description:
      "Text elements translate along an SVG path as scroll advances — headlines arc across the hero instead of merely rising.",
    prompt:
      "Move display elements along an SVG path tied to scroll: getPointAtLength(progress × pathLength) gives position per frame; element rotates to the path tangent by {tangent}% strength. Define the path in viewBox coordinates and scale responsively; the move ends settled (element must finish readable, never mid-curve).",
    implementation: "SVGPathElement.getPointAtLength per rAF within the scroll range; rotate via atan2 of delta; path scaled by aspect-preserving factor.",
    stack: ["SVG", "GSAP ScrollTrigger"],
    params: [range("tangent", "Tangent rotation", 40, 0, 100, 5, "%")],
    tags: ["path", "scroll", "motion-path", "arc"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["scroll"],
    fallback: "Reduced-motion: element travels a straight line (or simply fades in place).",
  }),

  /* ---------------- C. Cursor & pointer ---------------- */
  M({
    id: "motion/custom-cursor",
    category: "motion", subcategory: "cursor",
    name: "Custom Cursor",
    tagline: "A ring and a dot, trailing with physics.",
    description:
      "A custom cursor replaces or accompanies the native pointer: a dot plus a trailing ring that lags with lerp, morphing state over interactive elements.",
    prompt:
      "Implement a custom cursor: a small dot tracking the pointer 1:1 and a {size}px ring following with lerp factor {lerp} (frame-rate independent via delta-time correction). States: default, hover (ring scales {hoverScale}×), text (I-beam hint), drag. Native cursor stays visible at OS level unless the brand fully commits; hide the custom layer on touch/coarse pointers.",
    implementation: "position: fixed divs; pointermove → rAF lerp; mix-blend-mode: difference optional; media (pointer: fine) gate.",
    stack: ["rAF", "CSS"],
    params: [
      num("size", "Ring size", 36, 16, 80, 2, "px"),
      range("lerp", "Follow lag", 0.16, 0.05, 0.5, 0.01, ""),
      range("hoverScale", "Hover scale", 1.6, 1.1, 3, 0.1, "×"),
    ],
    tags: ["cursor", "custom", "ring", "pointer"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Purely decorative: never replace focus styles, never hide the OS cursor over form fields; hidden entirely for keyboard/touch users.",
    demo: "cursor",
  }),
  M({
    id: "motion/magnetic-elements",
    category: "motion", subcategory: "cursor",
    name: "Magnetic Elements",
    tagline: "Buttons lean toward your cursor; labels lag behind.",
    description:
      "Magnetic hover: elements translate toward the pointer within a capture radius and spring back on exit — a signature premium micro-interaction.",
    prompt:
      "Make primary CTAs magnetic: within a {radius}px capture zone, the element translates toward the pointer by strength {strength} (0–1 of the offset), its inner label follows at reduced strength ({inner}×), and on exit everything springs home (stiffness {stiffness}, damping {damping}). Clamp translation to ±18px; disable on touch.",
    implementation: "pointermove within bounds → dx,dy × strength; rAF transform; spring-back via critically-damped tween; prefers-reduced-motion disables.",
    stack: ["Framer Motion", "rAF"],
    params: [
      num("radius", "Capture radius", 120, 40, 260, 10, "px"),
      range("strength", "Pull strength", 0.35, 0.1, 0.8, 0.05, ""),
      range("inner", "Label factor", 0.5, 0, 1, 0.05, "×"),
      num("stiffness", "Spring stiffness", 220, 60, 500, 10),
      num("damping", "Spring damping", 18, 6, 40, 1),
    ],
    tags: ["magnetic", "button", "hover", "spring"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "The focus outline never translates with the magnet — focus ring stays layout-true.",
    demo: "magnetic",
  }),
  M({
    id: "motion/cursor-spotlight",
    category: "motion", subcategory: "cursor",
    name: "Cursor Spotlight",
    tagline: "A radial light follows the pointer across cards.",
    description:
      "A soft radial highlight tracks the pointer within or across cards — the 'sheen card' pattern that sells premium dashboards.",
    prompt:
      "Add a cursor spotlight: a radial gradient ({radius}px) at the pointer position brightens surfaces within its falloff — implemented as a CSS variable-driven (--mx/--my) pseudo-element per card or one shared layer across a card grid (border-glow variant reveals a 1px bright edge only where the ring crosses borders).",
    implementation: "pointermove sets --mx/--my custom properties (rAF-throttled); card::before radial-gradient at var position; border-glow: separate 1px-inset layer masked to borders.",
    stack: ["CSS variables", "rAF"],
    params: [num("radius", "Spotlight radius", 420, 200, 900, 20, "px")],
    tags: ["spotlight", "glow", "cards", "sheen"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["pointer"],
    demo: "spotlight",
  }),
  M({
    id: "motion/cursor-media-trail",
    category: "motion", subcategory: "cursor",
    name: "Cursor Image Preview Trail",
    tagline: "Hover a list; the image chases your hand.",
    description:
      "On list/index hover, a floating image preview trails the cursor with lag — the classic portfolio index interaction.",
    prompt:
      "Attach a floating image preview to the work index: hovering a row reveals a {size}px (3:4 or 16:10) preview that trails the cursor with {lerp} lerp lag and a slight tilt proportional to velocity ({tilt}° max); image swaps crossfade {fade}ms on row change. Pointer-fine devices only; rows must also work with keyboard focus (preview appears anchored near the row).",
    implementation: "Fixed-position figure; rAF lerp toward pointer; tilt = clamp(vx × k); preloads neighbors' images on row enter.",
    stack: ["rAF", "CSS"],
    params: [
      num("size", "Preview width", 420, 240, 640, 20, "px"),
      range("lerp", "Trail lag", 0.12, 0.05, 0.4, 0.01, ""),
      num("tilt", "Velocity tilt", 8, 0, 20, 1, "deg"),
      range("fade", "Swap crossfade", 160, 60, 500, 20, "ms"),
    ],
    tags: ["preview", "trail", "portfolio", "hover-media"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    a11y: "Keyboard focus on a row shows the preview statically near the row; previews are aria-hidden decoration.",
    demo: "cursor-preview",
    suggests: ["websites/creative-portfolio"],
  }),
  M({
    id: "motion/cursor-distortion",
    category: "motion", subcategory: "cursor",
    name: "Pointer Distortion Field",
    tagline: "The medium warps around your pointer.",
    description:
      "A WebGL distortion field around the pointer warps underlying imagery — mouseflow as fluid displacement or ripple.",
    prompt:
      "Warp the hero medium around the pointer: maintain a flow/displacement texture updated from pointer velocity (speed-scaled splats of {strength} radius {radius}px), and displace the image UVs by that field with decay {decay}s. Subtlety: UV offsets under 3%; the field must settle to rest within ~1s of pointer stop.",
    implementation: "WebGL ping-pong FBO for the flow field (advect + decay), image pass samples flow; Three.js/R3F or raw WebGL; low-res field (1/4 res) is plenty.",
    stack: ["WebGL", "GLSL"],
    params: [
      num("radius", "Splat radius", 90, 30, 240, 10, "px"),
      range("strength", "Strength", 1.4, 0.3, 4, 0.1, ""),
      range("decay", "Decay", 0.94, 0.85, 0.995, 0.005, "/frame"),
    ],
    tags: ["distortion", "pointer", "webgl", "flow"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["pointer"],
    fallback: "Undistorted image; effect off on touch and reduced-motion.",
    suggests: ["webgl/fluid-shader", "engineering/webgl-fallback"],
  }),
  M({
    id: "motion/pointer-parallax",
    category: "motion", subcategory: "cursor",
    name: "Pointer Parallax",
    tagline: "Elements lean a few px toward the pointer.",
    description:
      "Subtle whole-scene lean: layers translate a few pixels opposite/proportional to pointer position — cheap depth on flat pages.",
    prompt:
      "Add pointer parallax: scene layers translate with pointer offset at depth factors {depths} (each ±{range}px max), easing with lerp 0.06–0.1 toward target. Respects pointer idle (drifts back), disables on touch (or maps to deviceorientation at half strength), and never moves text used for reading.",
    implementation: "pointermove normalized (-1..1) → per-layer factor × range; rAF lerp; coarse-pointer media query swaps to deviceorientation or disables.",
    stack: ["rAF", "CSS"],
    params: [
      select("depths", "Depth set", "0.3 / 0.6 / 1.0", ["0.2 / 0.5 / 0.9", "0.3 / 0.6 / 1.0", "0.15 / 0.4 / 0.75"]),
      num("range", "Max travel", 14, 4, 40, 2, "px"),
    ],
    tags: ["pointer", "parallax", "lean", "depth"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["pointer"],
    demo: "tilt",
  }),
  M({
    id: "motion/3d-tilt",
    category: "motion", subcategory: "cursor",
    name: "3D Tilt Cards",
    tagline: "Cards rotate toward the pointer with glare.",
    description:
      "Perspective tilt on hover: rotateX/rotateY proportional to pointer position within the card, plus an optional moving specular glare.",
    prompt:
      "Add 3D tilt to feature cards: on hover, rotateY = ((px−0.5)×{max}°), rotateX = ((0.5−py)×{max}°) with perspective {persp}px; add a specular glare layer tracking the pointer (radial highlight at 12% white). Transition back with a {reset}ms ease-out; transform-style preserve-3d for inner content pop (translateZ {pop}px on children).",
    implementation: "pointer position normalized within card rect; rAF or direct transform with 60ms transition; glare as ::after radial-gradient.",
    stack: ["CSS 3D", "rAF"],
    params: [
      num("max", "Max tilt", 10, 2, 25, 1, "deg"),
      num("persp", "Perspective", 900, 400, 1600, 50, "px"),
      num("pop", "Content pop (translateZ)", 24, 0, 60, 4, "px"),
      range("reset", "Reset time", 450, 150, 900, 50, "ms"),
    ],
    tags: ["tilt", "3d-card", "hover", "glare"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["pointer"],
    a11y: "Tilt on hover only — keyboard focus gets a static elevated state instead.",
    demo: "tilt",
  }),
  M({
    id: "motion/interactive-spotlight-hero",
    category: "motion", subcategory: "cursor",
    name: "Hero Spotlight Reveal",
    tagline: "The hero illuminates only where you point.",
    description:
      "A dark hero where a radial mask tied to the pointer reveals imagery or text underneath — exploration mechanics for the first screen.",
    prompt:
      "Build a spotlight hero: the hero scene sits dark (5–10% visibility) and a radial mask ({radius}px, soft falloff) at the pointer reveals the full-color layer beneath; mask position lerps ({lerp}) for weight. Content must be fully readable without interaction after {timeout}s idle (mask expands gently) and always on touch.",
    implementation: "Two stacked layers; top dark layer masked via mask-image: radial-gradient at CSS vars; idle timer expands mask; touch shows full layer.",
    stack: ["CSS masks", "rAF"],
    params: [
      num("radius", "Spot radius", 260, 120, 600, 20, "px"),
      range("lerp", "Follow lag", 0.2, 0.05, 0.6, 0.05, ""),
      num("timeout", "Idle reveal", 6, 2, 20, 1, "s"),
    ],
    tags: ["spotlight", "hero", "reveal", "mask"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    a11y: "Non-interactive users (keyboard/touch/reduced-motion) always see the fully revealed hero.",
  }),

  /* ---------------- D. Physics ---------------- */
  M({
    id: "motion/spring-physics",
    category: "motion", subcategory: "physics",
    name: "Spring Motion Tokens",
    tagline: "Physics-based easing as a design token.",
    description:
      "Springs replace duration-based easing for UI interactions: motion with mass, stiffness and damping that feels material.",
    prompt:
      "Use spring motion as the interaction default: hovers, menus, toasts and state changes animate with spring(stiffness {stiffness}, damping {damping}, mass {mass}) instead of cubic-bezier durations; the settle must not wobble visible past {settle}ms. Springs interrupt gracefully (velocity carries) — that's the point.",
    implementation: "Framer Motion transition {type: 'spring', stiffness, damping, mass}; or motion.dev; never animate layout properties with springs above 60 elements.",
    stack: ["Framer Motion", "motion.dev"],
    params: [
      num("stiffness", "Stiffness", 260, 60, 600, 10),
      num("damping", "Damping", 26, 8, 60, 1),
      range("mass", "Mass", 0.9, 0.3, 3, 0.1, ""),
      num("settle", "Max settle time", 600, 200, 1500, 50, "ms"),
    ],
    tags: ["spring", "physics", "tokens", "microinteraction"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover", "animated"],
    demo: "spring",
  }),
  M({
    id: "motion/elastic-movement",
    category: "motion", subcategory: "physics",
    name: "Elastic Overshoot",
    tagline: "Elements arrive past the target, then settle.",
    description:
      "Elastic motion overshoots the destination and oscillates back — playful energy for badges, toasts and confirmations.",
    prompt:
      "Use elastic overshoot for celebratory or playful moments: arrive past target by {overshoot}% and settle with elastic.out(1, {period}) over {duration}ms. Reserve for small elements (badges, chips, confirms) — never for large panels or anywhere trust matters (finance, health).",
    implementation: "GSAP elastic.out or spring with low damping (damping < 12); element scale 0.8→1 with overshoot.",
    stack: ["GSAP", "Framer Motion"],
    params: [
      num("overshoot", "Overshoot", 20, 5, 60, 5, "%"),
      range("period", "Oscillation period", 0.45, 0.2, 1, 0.05, "s"),
      range("duration", "Duration", 700, 300, 1500, 50, "ms"),
    ],
    tags: ["elastic", "overshoot", "playful", "bounce"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    conflicts: [{ id: "websites/fintech-dashboard", reason: "Elastic bounce reads as instability in financial UI." }],
  }),
  M({
    id: "motion/inertia-scroll",
    category: "motion", subcategory: "physics",
    name: "Inertia / Momentum",
    tagline: "Drag it, fling it, watch it glide and rest.",
    description:
      "Momentum physics for draggable/swipable surfaces: velocity carries after release with friction-based decay and boundary bounce.",
    prompt:
      "Give draggable surfaces real inertia: on release, position integrates pointer velocity with friction decay ({friction}/frame), boundary overshoot rubber-bands (resistance {rubber}), and rest snaps within 2px. Velocity measured over the last {window}ms of movement to avoid twitchy flings.",
    implementation: "Track last N pointer samples; release → per-frame v *= friction; clamp with rubber-band function min(1, r/d); cancel on pointerdown.",
    stack: ["rAF", "pointer events"],
    params: [
      range("friction", "Friction", 0.95, 0.85, 0.99, 0.005, "/frame"),
      range("rubber", "Rubber-band", 0.35, 0.1, 0.8, 0.05, ""),
      num("window", "Velocity window", 80, 30, 200, 10, "ms"),
    ],
    tags: ["inertia", "momentum", "drag", "fling"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer"],
    demo: "drag-inertia",
  }),
  M({
    id: "motion/damped-follow",
    category: "motion", subcategory: "physics",
    name: "Critically-Damped Followers",
    tagline: "Elements chase targets without ever oscillating.",
    description:
      "Critical damping = fastest settle without wobble: the follower (cursor, tooltip, panel) glides to its target like it's on rails of oil.",
    prompt:
      "Tune follower elements with critical damping: any element chasing the pointer/scroll (tooltips, floaters, reading companions) uses a spring at stiffness {stiffness}, damping exactly 2√(stiffness·mass) (critical), so it arrives fast with zero overshoot. Frame-rate independent integration (semi-implicit Euler, dt clamped to 1/30).",
    implementation: "Semi-implicit Euler: v += (k(x−target) − c·v)·dt; x += v·dt; c = 2·sqrt(k·m); dt = min(frame, 33ms).",
    stack: ["rAF", "TypeScript"],
    params: [num("stiffness", "Stiffness", 180, 40, 600, 10)],
    tags: ["damping", "follow", "physics", "spring"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["pointer", "animated"],
  }),
  M({
    id: "motion/soft-body",
    category: "motion", subcategory: "physics",
    name: "Soft-Body Squish",
    tagline: "UI that squashes and stretches like matter.",
    description:
      "Soft-body squish: elements deform (scaleX/scaleY) in response to velocity and impact — press squashes, release jiggles.",
    prompt:
      "Add soft-body squish to tactile elements: on press, squash scaleY {squash}% with compensating scaleX (volume conservation-ish); on release, jiggle with low-damping spring ({jiggle}s); while dragging fast, stretch along velocity vector up to {stretch}%. Apply to buttons, blobs and cards meant to feel touchable.",
    implementation: "Derived scale from velocity: sx = 1 + k·|vx|; sy = 1 − k·|vx|·0.6; clamped; spring on release via damping 8–12.",
    stack: ["Framer Motion", "rAF"],
    params: [
      num("squash", "Press squash", 88, 70, 98, 1, "% of Y"),
      range("jiggle", "Release jiggle", 0.5, 0.2, 1.2, 0.1, "s"),
      num("stretch", "Drag stretch", 15, 0, 40, 5, "%"),
    ],
    tags: ["soft-body", "squish", "tactile", "deform"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    a11y: "Deformation never exceeds readability bounds; off under reduced-motion.",
  }),
  M({
    id: "motion/gravity-float",
    category: "motion", subcategory: "physics",
    name: "Floating Object Field",
    tagline: "Chips and cards drift on sinusoidal orbits.",
    description:
      "Floating elements bob gently on phase-offset sine paths — KPI chips, badges and decorative objects hover with independent life.",
    prompt:
      "Float selected elements on sine orbits: each floater animates translateY ±{amp}px over {period}s with a random phase offset and ±{rot}° rotation drift; collisions avoided by design spacing; pointer proximity may add tiny repulsion ({repulse}px max). Offscreen floaters pause (IntersectionObserver).",
    implementation: "CSS keyframes with per-element animation-delay/duration variance, or rAF for pointer-repulsion variant; transform-only.",
    stack: ["CSS", "rAF"],
    params: [
      num("amp", "Bob amplitude", 10, 2, 30, 1, "px"),
      range("period", "Period", 7, 3, 20, 0.5, "s"),
      num("rot", "Rotation drift", 3, 0, 12, 1, "deg"),
      num("repulse", "Pointer repulsion", 12, 0, 40, 2, "px"),
    ],
    tags: ["float", "bob", "orbit", "ambient"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "float",
  }),
  M({
    id: "motion/rope-curve",
    category: "motion", subcategory: "physics",
    name: "Rope / String Physics",
    tagline: "Verlet strings that dangle and follow.",
    description:
      "Verlet-integrated point chains simulate ropes, strings and hanging elements — nav threads, dangled badges, drawn vines.",
    prompt:
      "Simulate ropes/strings with Verlet integration: a chain of {segments} points with distance constraints ({iter} relaxation iterations per frame), gravity {gravity}px/s², one end anchored (or following the pointer), rendered as a smooth quadratic curve (Catmull-Rom through points). Cost is trivial; the craft is constraint tuning.",
    implementation: "Verlet: x += (x−px)·(1−damp) + a·dt²; constraints iterated; canvas or SVG path render; pause offscreen.",
    stack: ["Canvas/SVG", "TypeScript"],
    params: [
      num("segments", "Segments", 24, 6, 64, 2),
      num("iter", "Constraint iterations", 3, 1, 10, 1),
      num("gravity", "Gravity", 900, 0, 3000, 50, "px/s²"),
    ],
    tags: ["rope", "verlet", "string", "dangle"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["pointer", "animated"],
    demo: "rope",
  }),
  M({
    id: "motion/collision-play",
    category: "motion", subcategory: "physics",
    name: "Collision Sandbox",
    tagline: "Elements that bump, stack and pile.",
    description:
      "Lightweight rigid-body play: draggable elements collide and settle under gravity — playgrounds, sticker walls, playful 404s.",
    prompt:
      "Create a collision sandbox: {bodies} rigid bodies (circles/rounded rects) under gravity {g}, restitution {bounce}, friction {friction}; user can drag and fling bodies (velocity from pointer); walls at container bounds (floor optional). Keep it contained: ≤ 40 bodies, sleep bodies at rest, and never trap UI the user needs.",
    implementation: "Simple impulse solver (circle/AABB) or matter-js if complexity grows; fixed timestep (1/60) accumulator; bodies sleep below velocity threshold.",
    stack: ["Canvas", "matter-js (optional)"],
    params: [
      num("bodies", "Body count", 16, 4, 40, 2),
      range("g", "Gravity", 1, 0, 2.5, 0.1, ""),
      range("bounce", "Restitution", 0.5, 0, 0.95, 0.05, ""),
      range("friction", "Surface friction", 0.1, 0, 0.6, 0.02, ""),
    ],
    tags: ["collision", "physics", "sandbox", "playful"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["pointer"],
    a11y: "Sandbox content duplicates in an accessible static list; the physics layer is decorative.",
  }),

  /* ---------------- E. Particles ---------------- */
  M({
    id: "motion/particle-field",
    category: "motion", subcategory: "particles",
    name: "Ambient Particle Field",
    tagline: "Drifting points of light with depth.",
    description:
      "A canvas of drifting particles at varied sizes/opacities simulating depth of field — the universal ambient backdrop.",
    prompt:
      "Render an ambient particle field: {count} particles drifting slowly (velocity {speed}px/s with slight per-particle variance), size {size}px ± 60%, opacity keyed to size for depth (small = dimmer); soft wrap at edges. Deterministic seed per session; density auto-scales with viewport area and devicePixelRatio capping.",
    implementation: "Canvas 2D with batched draw (single path per opacity bucket) or WebGL points; adapt count = clamp(area/18000, 40, cap); pause when hidden.",
    stack: ["Canvas"],
    params: [
      num("count", "Particles", 120, 20, 600, 10),
      range("speed", "Drift speed", 8, 1, 40, 1, "px/s"),
      num("size", "Base size", 2.4, 1, 8, 0.2, "px"),
    ],
    tags: ["particles", "field", "ambient", "depth"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "particles",
    suggests: ["engineering/adaptive-particles"],
  }),
  M({
    id: "motion/particle-network",
    category: "motion", subcategory: "particles",
    name: "Particle Network",
    tagline: "Points connect when close — constellation logic.",
    description:
      "The classic constellation: particles drift and link with lines whose opacity falls with distance; pointer joins the constellation.",
    prompt:
      "Render a particle network: {count} drifting points connect pairwise when within {link}px, line opacity ∝ (1 − d/link); pointer acts as an extra node with radius {pointerRadius}px. Quadratic pairwise cost means count caps at ~{cap} on mobile — enforce adaptive density.",
    implementation: "Spatial hash grid for neighbor queries (O(n) avg); single canvas stroke batch by opacity bucket; adaptive count by area/device.",
    stack: ["Canvas"],
    params: [
      num("count", "Particles", 90, 20, 220, 10),
      num("link", "Link distance", 120, 60, 220, 10, "px"),
      num("pointerRadius", "Pointer radius", 160, 0, 320, 10, "px"),
      num("cap", "Mobile cap", 60, 20, 120, 5),
    ],
    tags: ["network", "constellation", "links", "particles"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "particle-network",
  }),
  M({
    id: "motion/particle-mouse",
    category: "motion", subcategory: "particles",
    name: "Mouse-Reactive Particles",
    tagline: "The pointer stirs the medium.",
    description:
      "Particles attract to or repel from the pointer with falloff — the hero field that feels alive under the hand.",
    prompt:
      "Make the particle field pointer-reactive: within {radius}px, apply {mode} force scaled by (1 − d/radius)² to velocity, capped at {force} px/s²; particles keep ambient drift otherwise and velocities damp ({damp}) toward rest so the field settles when the hand stops.",
    implementation: "Per-frame force accumulation toward/away from pointer with quadratic falloff; velocity clamp + exponential damp; rAF loop paused when tab hidden.",
    stack: ["Canvas"],
    params: [
      select("mode", "Mode", "repel", ["repel", "attract", "orbit"]),
      num("radius", "Influence radius", 160, 60, 400, 10, "px"),
      num("force", "Max force", 240, 60, 900, 20, "px/s²"),
      range("damp", "Damping", 0.94, 0.8, 0.99, 0.01, "/frame"),
    ],
    tags: ["particles", "pointer", "reactive", "field"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["pointer", "animated"],
    demo: "particles",
  }),
  M({
    id: "motion/particle-trails",
    category: "motion", subcategory: "particles",
    name: "Particle Trails",
    tagline: "Motion leaves luminous history.",
    description:
      "Trails render by fading the previous frame instead of clearing — particles draw comet paths through the field.",
    prompt:
      "Render particle trails: instead of clearing, overlay a translucent background rectangle (alpha {fade}) each frame so motion leaves fading history; particles then read as luminous strokes. Combine with pointer-emitted sparkles ({rate}/s while moving) for signature hero moments.",
    implementation: "fillRect with globalAlpha=fade in background color (destination-over variant for transparent canvases); emitted pool recycled ring-buffer style.",
    stack: ["Canvas"],
    params: [
      range("fade", "Trail persistence", 0.08, 0.02, 0.3, 0.01, "alpha"),
      num("rate", "Emission rate", 40, 0, 200, 5, "/s"),
    ],
    tags: ["trails", "fade", "history", "comet"],
    difficulty: "beginner", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "particles",
  }),
  M({
    id: "motion/particle-morph",
    category: "motion", subcategory: "particles",
    name: "Particle Morphing",
    tagline: "One shape dissolves into another, point by point.",
    description:
      "Particles carry two home positions (shape A and B sampled from text/SVG paths); a morph parameter interpolates the field between forms.",
    prompt:
      "Morph a particle field between forms: sample {count} target points from shape A (text rendered offscreen / SVG path sampling) and shape B; each particle lerps home = mix(A_i, B_i, ease(morph)) with individual noise jitter {jitter}%; morph driven by {trigger}. Unmatched particles interpolate polarly through center for pleasing swirl.",
    implementation: "Offscreen canvas text → getImageData alpha sampling for point sets; pad to equal counts; per-particle i→i mapping with jitter; GPU (transform feedback) only beyond ~20k points.",
    stack: ["Canvas", "WebGL (heavy)"],
    params: [
      num("count", "Particles", 3000, 500, 12000, 250),
      num("jitter", "Jitter", 12, 0, 40, 1, "%"),
      select("trigger", "Morph trigger", "scroll progress", ["scroll progress", "timed loop", "click", "hover zone"]),
    ],
    tags: ["morph", "particles", "shapes", "text-particles"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["scroll", "animated"],
    demo: "image-particles",
  }),
  M({
    id: "motion/image-particles",
    category: "motion", subcategory: "particles",
    name: "Image-to-Particle Conversion",
    tagline: "The picture exists only as a swarm.",
    description:
      "An image is sampled into particles that hold its colors — assemble on load, disperse on hover, reform on leave.",
    prompt:
      "Convert the key image to particles: sample pixel grid positions/colors (stride for {count} points), render as a point cloud; particles assemble from scatter on load ({assemble}s), disperse within {radius}px of the pointer (spring return), and reform on pointer leave. Canvas 2D is fine under ~4k points; beyond, use WebGL GL_POINTS.",
    implementation: "Offscreen draw → getImageData sampling with stride; particle = {home, pos, vel, color}; spring-home k≈0.02, damp≈0.9; pointer repulsion falloff quadratic.",
    stack: ["Canvas", "WebGL (heavy)"],
    params: [
      num("count", "Sample points", 2500, 400, 10000, 100),
      range("assemble", "Assemble time", 1.4, 0.4, 4, 0.1, "s"),
      num("radius", "Pointer radius", 90, 30, 240, 10, "px"),
    ],
    tags: ["image", "particles", "sampling", "disperse"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["pointer", "animated"],
    fallback: "The plain image renders beneath; particles are an enhancement layer.",
    demo: "image-particles",
  }),
  M({
    id: "motion/particle-explosion",
    category: "motion", subcategory: "particles",
    name: "Particle Burst Micro-FX",
    tagline: "Twelve sparks, six hundred milliseconds, once.",
    description:
      "Tiny particle bursts on meaningful events (confirm, save, add-to-cart) — 10–16 sparks, subsecond, single-shot, respectful.",
    prompt:
      "Fire particle bursts on meaningful events only: {count} sparks from the event point, radial velocity {velocity}±40% px/s, gravity {gravity}px/s², life {life}ms, size 2–4px in the accent color. Single-shot (no loop), respects reduced-motion (skip entirely), and never obscures the result text of the action.",
    implementation: "Fixed pool (≤64 live sparks); pooled objects reused; canvas absolutely positioned in the component or portal overlay.",
    stack: ["Canvas"],
    params: [
      num("count", "Sparks", 14, 6, 32, 1),
      num("velocity", "Velocity", 260, 80, 700, 20, "px/s"),
      num("gravity", "Gravity", 500, 0, 1400, 50, "px/s²"),
      num("life", "Life", 650, 200, 1500, 50, "ms"),
    ],
    tags: ["burst", "confetti", "celebration", "micro"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "Skipped entirely under prefers-reduced-motion; the state change itself (check icon, toast) carries the feedback.",
  }),
  M({
    id: "motion/audio-reactive-particles",
    category: "motion", subcategory: "particles",
    name: "Audio-Reactive Particles",
    tagline: "The swarm answers the music.",
    description:
      "WebAudio FFT bins drive particle behavior — bass pushes out, highs sparkle — for artists, players and event pages.",
    prompt:
      "Make the particle field audio-reactive: AnalyserNode FFT ({fft} bins) → 3 bands (bass/mid/treble averages); bass scales particle size/speed ({bassAmp}×), treble adds spawn sparkle; analysis smooths with timeConstant {smoothing}. Require explicit user play (autoplay policy); provide silent default motion when audio is off.",
    implementation: "AudioContext created on user gesture; getByteFrequencyData per frame into band averages; uniforms/params map into the particle update.",
    stack: ["WebAudio", "Canvas"],
    params: [
      select("fft", "FFT size", "256", ["128", "256", "512", "1024"]),
      range("smoothing", "Smoothing", 0.8, 0.5, 0.95, 0.02, ""),
      range("bassAmp", "Bass amplitude", 1.6, 0.5, 4, 0.1, "×"),
    ],
    tags: ["audio", "fft", "reactive", "music"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["realtime"],
    a11y: "Audio never required for content; visual reactivity is strictly an enhancement.",
  }),
  M({
    id: "motion/flow-field-particles",
    category: "motion", subcategory: "particles",
    name: "Flow-Field Particles",
    tagline: "Particles surf an invisible noise river.",
    description:
      "Particles advected by a noise-based angle field leave trails that reveal the flow — living ink, mathematically real.",
    prompt:
      "Advect particles through a flow field: angle(x, y, t) = noise3(x·{scale}, y·{scale}, t·{timeScale})·2π·{turns}; step particles along the angle at {speed}px/s, leaving trails via frame-fade ({fade} alpha). Field evolves over time so currents slowly reroute; particles respawn at edges when they stall.",
    implementation: "Canvas 2D: value/simplex noise (CPU ok at ~{count} particles) or WebGL for >10k; trail persistence via translucent fill.",
    stack: ["Canvas", "noise"],
    params: [
      range("scale", "Field scale", 0.0022, 0.0005, 0.01, 0.0001, "/px"),
      range("timeScale", "Time evolution", 0.08, 0, 0.5, 0.01, ""),
      num("turns", "Angle turns", 2, 1, 6, 0.5, "π×"),
      num("speed", "Particle speed", 60, 10, 240, 5, "px/s"),
      range("fade", "Trail fade", 0.06, 0.01, 0.25, 0.005, "alpha"),
      num("count", "Particles", 900, 100, 4000, 100),
    ],
    tags: ["flow-field", "noise", "particles", "ink"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "flow-field",
    suggests: ["math/curl-noise"],
  }),

  /* ---------------- F. 3D motion ---------------- */
  M({
    id: "motion/object-rotation",
    category: "motion", subcategory: "threed",
    name: "Ceremonial Object Rotation",
    tagline: "The product turns slowly, like it's on a plinth.",
    description:
      "A 3D object rotates slowly on display (turntable), optionally pausing or accelerating under pointer influence.",
    prompt:
      "Mount the hero object on a turntable: rotateY advances {degPerSec}°/s with ease-in on entry; pointer drag adds manual rotation with inertia (velocity decays {decay}/frame); paused during tab-hidden and reduced-motion (static 3/4 view). Lighting stays fixed — the object turns, the world doesn't.",
    implementation: "R3F useFrame: mesh.rotation.y += dt·speed; drag → angular velocity with damping; devicePixelRatio capped at 2.",
    stack: ["React Three Fiber"],
    params: [
      range("degPerSec", "Turntable speed", 12, 0, 60, 1, "°/s"),
      range("decay", "Drag inertia decay", 0.95, 0.8, 0.99, 0.01, "/frame"),
    ],
    tags: ["rotation", "turntable", "product", "3d"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated", "pointer"],
  }),
  M({
    id: "motion/object-morph",
    category: "motion", subcategory: "threed",
    name: "Object Morph (Shape Keys)",
    tagline: "Geometry crossfades between forms.",
    description:
      "Morph targets interpolate mesh vertices between authored forms — product variants, brand marks, abstract states.",
    prompt:
      "Morph the central object between {states} authored states: vertex interpolation via morph targets (influence animated over {duration}s with ease), driven by {driver}; topology must match between states (same vertex count/order) — author forms accordingly.",
    implementation: "GLTF morphTargets or BufferAttribute lerp; R3F: update morphTargetInfluences in useFrame from driver progress.",
    stack: ["Three.js", "GLTF"],
    params: [
      num("states", "Form states", 3, 2, 6, 1),
      range("duration", "Morph duration", 1.2, 0.3, 4, 0.1, "s"),
      select("driver", "Driver", "scroll progress", ["scroll progress", "timed loop", "selection state"]),
    ],
    tags: ["morph", "3d", "shape-keys", "gltf"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["scroll", "animated"],
  }),
  M({
    id: "motion/camera-orbit",
    category: "motion", subcategory: "threed",
    name: "Constrained Camera Orbit",
    tagline: "Drag to orbit, within dignity limits.",
    description:
      "User-orbitable camera with constrained polar angles, damping, and auto-recenter — product inspection without disorientation.",
    prompt:
      "Let users orbit the object: azimuth free, polar clamped to {polar}°–{polarMax}°, distance clamp {dist}–{distMax}m, damping factor {damp}; auto-return to the composed 3/4 view after {idle}s idle. Zoom via pinch/wheel with the same clamps; orbit must never show the model's unauthored underside/backside if those are unfinished.",
    implementation: "R3F OrbitControls (enableDamping, min/maxPolarAngle, min/maxDistance) or custom spherical coords + lerp; idle timer re-tweens to home pose.",
    stack: ["React Three Fiber", "drei OrbitControls"],
    params: [
      num("polar", "Min polar", 55, 10, 85, 5, "°"),
      num("polarMax", "Max polar", 85, 60, 120, 5, "°"),
      range("damp", "Damping", 0.08, 0.02, 0.3, 0.01, ""),
      num("idle", "Auto-rehome", 6, 2, 20, 1, "s"),
      num("dist", "Min distance", 1.6, 0.5, 8, 0.1, "m"),
      num("distMax", "Max distance", 4, 1, 12, 0.5, "m"),
    ],
    tags: ["orbit", "camera", "inspect", "3d"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["pointer"],
  }),
  M({
    id: "motion/material-transition",
    category: "motion", subcategory: "threed",
    name: "Material State Transitions",
    tagline: "The object changes skin: matte → chrome → glass.",
    description:
      "Materials interpolate between authored states (roughness/metalness/transmission ramps) on configurator change or scroll stage.",
    prompt:
      "Transition materials between states: interpolate roughness, metalness, transmission and color over {duration}s toward the selected state (e.g. matte polymer → brushed metal → tinted glass) with env-map intensity following for continuity; avoid hard shader swaps — always interpolate uniforms.",
    implementation: "MeshPhysicalMaterial uniforms lerped in useFrame; envMapIntensity compensates during transmission ramps; KHR_materials_transmission for glass states.",
    stack: ["Three.js"],
    params: [range("duration", "Transition", 0.8, 0.2, 3, 0.1, "s")],
    tags: ["material", "transition", "pbr", "configurator"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated"],
  }),
  M({
    id: "motion/procedural-deformation",
    category: "motion", subcategory: "threed",
    name: "Procedural Mesh Deformation",
    tagline: "Vertices breathe with noise in the vertex shader.",
    description:
      "Vertex displacement by animated noise deforms spheres/planes into living blobs — GPU-cheap organic life.",
    prompt:
      "Deform the base mesh procedurally: vertex shader displaces along normals by amp({amp}·base radius) × fBm(position·{freq} + t·{speed}, {oct} octaves), normals recomputed in-shader (or screen-space derived) for lighting correctness. The form stays genus-0 (displacement, not tearing); amplitude < 30% of base radius.",
    implementation: "Custom ShaderMaterial with noise in vertex pass; use flat-suited shading or derivative normals; uniform clamps prevent self-intersection.",
    stack: ["GLSL", "Three.js"],
    params: [
      range("amp", "Amplitude", 0.22, 0.02, 0.5, 0.01, "×R"),
      range("freq", "Noise frequency", 1.8, 0.3, 6, 0.1, ""),
      range("speed", "Evolution speed", 0.35, 0, 2, 0.05, ""),
      num("oct", "fBM octaves", 4, 1, 6, 1),
    ],
    tags: ["deformation", "vertex", "blob", "noise-3d"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated"],
    demo: "blob",
  }),

  /* ---------------- G. Cinematic transitions ---------------- */
  M({
    id: "motion/page-wipe",
    category: "motion", subcategory: "transitions",
    name: "Page Wipe Transitions",
    tagline: "A panel sweeps; the page changes underneath.",
    description:
      "Route changes choreographed as a wipe: a solid or gradient panel sweeps across while content swaps at the moment of cover.",
    prompt:
      "Wipe between routes: on navigation, a full-viewport panel sweeps in ({direction}, {duration}ms, {easing}), covers 100%, content swaps at the cover moment, then the panel sweeps out. Reduce layout thrash: the wipe layer is a single fixed transform-animated element; total choreography under {total}ms.",
    implementation: "Next.js: intercept route push, run cover tween, router.push at cover, reveal tween in template; or View Transitions API where available.",
    stack: ["Framer Motion", "View Transitions API"],
    params: [
      select("direction", "Sweep direction", "left-to-right", ["left-to-right", "bottom-up", "diagonal"]),
      range("duration", "Sweep duration", 420, 200, 900, 20, "ms"),
      num("total", "Total budget", 900, 400, 1800, 50, "ms"),
      select("easing", "Easing", "cubic-bezier(0.22, 1, 0.36, 1)", EASINGS),
    ],
    tags: ["wipe", "page-transition", "sweep", "route"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "Reduced-motion: instant crossfade (80ms opacity) with no travel.",
  }),
  M({
    id: "motion/liquid-transition",
    category: "motion", subcategory: "transitions",
    name: "Liquid / Blob Transition",
    tagline: "The next state pours over the current one.",
    description:
      "Liquid transitions animate an organic mask boundary (wobbling blob or rising tide) between views or images.",
    prompt:
      "Transition via liquid mask: the incoming view/image reveals through an organic boundary — a displaced circle or rising tide edge perturbed by noise ({wobble}px amplitude, {speed} evolution) — over {duration}s. Implement as SVG mask + turbulence displacement or a shader mix; ensure full reveal completes (no permanent residue).",
    implementation: "feTurbulence-displaced mask path animated on radius, or fragment shader: mix(a, b, smoothstep(edge−w, edge+w, n(p) + progress));",
    stack: ["SVG filters", "GLSL"],
    params: [
      num("wobble", "Edge wobble", 24, 4, 80, 4, "px"),
      range("speed", "Turbulence speed", 0.6, 0.1, 2, 0.1, ""),
      range("duration", "Transition", 1.1, 0.4, 2.5, 0.1, "s"),
    ],
    tags: ["liquid", "blob", "transition", "organic"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "motion/image-displacement-transition",
    category: "motion", subcategory: "transitions",
    name: "Displacement Image Transition",
    tagline: "Photos cross-dissolve through a noise warp.",
    description:
      "The classic WebGL gallery transition: two images mix through a displacement map so pixels travel rather than fade.",
    prompt:
      "Transition images with displacement: mix(imgA, imgB, progress) where each sample's UV is offset by disp(sample)·(progress·(1−progress))·{intensity}; progress eases {easing} over {duration}s. Use a seamless noise texture as the displacement map; the midpoint warp is the signature — keep intensity under 12% of frame.",
    implementation: "Fragment shader with three samplers (A, B, disp map); hover or click drives progress; Three.js plane or regl minimal.",
    stack: ["GLSL", "Three.js"],
    params: [
      range("intensity", "Warp intensity", 0.6, 0.1, 1.5, 0.05, ""),
      range("duration", "Duration", 1.2, 0.4, 3, 0.1, "s"),
      select("easing", "Easing", "power2.inOut", ["power2.inOut", "power3.inOut", "expo.inOut", "circ.inOut"]),
    ],
    tags: ["displacement", "image", "transition", "webgl"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover", "animated"],
    fallback: "Plain crossfade when WebGL unavailable.",
    demo: "displacement",
  }),
  M({
    id: "motion/shared-element",
    category: "motion", subcategory: "transitions",
    name: "Shared-Element Continuity",
    tagline: "The card IS the hero; it just moved.",
    description:
      "Shared elements (image, title) morph from list position into detail position on navigation — continuity instead of cut.",
    prompt:
      "Carry shared elements across navigation: the tapped card's image + title animate from grid position to detail hero position (FLIP or View Transitions), {duration}ms with {easing}; non-shared content crossfades. The element's aspect/crop must reconcile mid-flight (object-fit continuity) to avoid a snap.",
    implementation: "document.startViewTransition with view-transition-name on the shared element, or manual FLIP (measure → invert → play); fallback crossfade.",
    stack: ["View Transitions API", "FLIP"],
    params: [
      range("duration", "Travel", 520, 200, 1000, 20, "ms"),
      select("easing", "Easing", "cubic-bezier(0.22, 1, 0.36, 1)", EASINGS),
    ],
    tags: ["shared-element", "flip", "continuity", "morph"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "Respect reduced-motion: crossfade only; view-transition CSS media-gated.",
  }),
  M({
    id: "motion/infinite-zoom",
    category: "motion", subcategory: "transitions",
    name: "Infinite Zoom Narrative",
    tagline: "Each frame is inside the previous one.",
    description:
      "Zooming transitions dive endlessly into nested scenes — scale compounds as the camera passes 'through' each layer.",
    prompt:
      "Build an infinite-zoom narrative: {layers} nested layers, each revealing inside the previous as scroll/click advances scale by factor {zoom}× per layer; keep sharpness by resolving each layer's detail as it approaches (crossfade between LODs). Total scale budget must stay float-safe (reset by modulo after full cycle).",
    implementation: "Layer scale = base^((progress+i)/L) mod cycle; opacity crossfades between LOD twins at the singularity point.",
    stack: ["Canvas/WebGL", "GSAP"],
    params: [
      num("layers", "Nesting layers", 4, 3, 8, 1),
      range("zoom", "Zoom per layer", 4, 2, 10, 0.5, "×"),
    ],
    tags: ["infinite-zoom", "dive", "nested", "scale"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["scroll", "animated"],
    a11y: "Vestibular risk: zoom speed reduced 50% under reduced-motion, or replaced by fades.",
  }),

  /* ---------------- H. SVG & vector motion ---------------- */
  M({
    id: "motion/svg-path-draw",
    category: "motion", subcategory: "svg",
    name: "SVG Line Drawing",
    tagline: "Strokes draw themselves along their true paths.",
    description:
      "stroke-dashoffset animation draws SVG strokes along their real geometry — signatures, underlines, schematics animating.",
    prompt:
      "Draw SVG strokes on entry/scroll: set stroke-dasharray/offset to pathLength ({len}px via getTotalLength) and animate offset →0 over {duration}s with {easing}; multiple paths stagger {stagger}ms in drawing order. Use pathLength={len} normalization so geometry edits don't break the math.",
    implementation: "pathLength attribute normalization; CSS transition on stroke-dashoffset or GSAP DrawSVG; trigger via IO at {threshold}%.",
    stack: ["SVG", "CSS/GSAP"],
    params: [
      num("len", "Path length", 1000, 100, 4000, 100, "px"),
      range("duration", "Draw time", 1.4, 0.3, 5, 0.1, "s"),
      range("stagger", "Path stagger", 120, 0, 600, 20, "ms"),
      num("threshold", "Trigger at", 30, 5, 70, 5, "%"),
      select("easing", "Easing", "power2.out", EASINGS),
    ],
    tags: ["svg", "draw", "stroke", "signature"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll", "animated"],
    demo: "path-draw",
  }),
  M({
    id: "motion/svg-morph",
    category: "motion", subcategory: "svg",
    name: "SVG Shape Morph",
    tagline: "One icon melts into another.",
    description:
      "Morph between SVG paths with matched point counts — icons, blobs, and logo states that interpolate.",
    prompt:
      "Morph between SVG paths: normalize both paths to equal command counts (same structure), then interpolate 'd' over {duration}ms with {easing}; drivers: {driver}. For organic blobs, keep point count identical and winding consistent or the morph cross-folds.",
    implementation: "flubber or hand-matched commands; animate attribute d per frame; test midpoint shape for fold artifacts.",
    stack: ["SVG", "flubber"],
    params: [
      range("duration", "Morph time", 640, 200, 1600, 40, "ms"),
      select("easing", "Easing", "power2.out", EASINGS),
      select("driver", "Driver", "state change", ["state change", "hover", "scroll progress", "timed loop"]),
    ],
    tags: ["morph", "svg", "icons", "blob"],
    difficulty: "advanced", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "motion/path-follow",
    category: "motion", subcategory: "svg",
    name: "Motion Path Following",
    tagline: "Objects travel drawn routes, banking into curves.",
    description:
      "Elements travel along SVG paths (CSS offset-path or GSAP MotionPath) with optional auto-rotation along tangents.",
    prompt:
      "Move elements along drawn paths: offset-path: path('…') with scroll- or time-driven offset-distance; auto-rotate to tangent {rotate}%. Paths authored in the same coordinate space as the container (percent viewBox pitfalls avoided via explicit px mapping); the journey must end at a stable, readable position.",
    implementation: "CSS offset-path/offset-distance (animatable), or GSAP MotionPathPlugin for rotation + scrub; path invisible or styled as a guide line.",
    stack: ["CSS offset-path", "GSAP MotionPath"],
    params: [range("rotate", "Tangent rotation", 100, 0, 100, 5, "%")],
    tags: ["motion-path", "follow", "route", "travel"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll", "animated"],
  }),

  /* ---------------- I. System motion ---------------- */
  M({
    id: "motion/preloader",
    category: "motion", subcategory: "system",
    name: "Designed Preloader",
    tagline: "A counting curtain that earns its seconds.",
    description:
      "A branded loading sequence: progress counter tied to real asset loading, curtain lift on completion, hard time cap.",
    prompt:
      "Design the preloader: minimal brand mark + a real progress counter (0→100 tied to actual asset bytes via preload manifests, not fake timers), total experience capped at {cap}s even if loading lags (counter honest about it), exit via {exit} ({exitMs}ms). Session returns skip the counter (curtain only). Reduced-motion: instant fade.",
    implementation: "Preload critical list (fonts, hero media) with byte-weighted progress; Promise.race with cap timeout; sessionStorage flag for returns.",
    stack: ["Framer Motion", "preload APIs"],
    params: [
      num("cap", "Hard cap", 2.8, 1, 6, 0.2, "s"),
      select("exit", "Exit choreography", "curtain lift", ["curtain lift", "iris close", "fade-through", "split open"]),
      num("exitMs", "Exit duration", 720, 200, 1400, 40, "ms"),
    ],
    tags: ["preloader", "loading", "counter", "curtain"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "aria-busy on the app root during load; screen readers announce completion; never blocks keyboard access to skip.",
  }),
  M({
    id: "motion/menu-stagger",
    category: "motion", subcategory: "system",
    name: "Menu Link Cascade",
    tagline: "Links arrive like they're being introduced.",
    description:
      "Menu items cascade in with staggered rise/rotate when the overlay opens, reverse-cascade on close.",
    prompt:
      "Cascade menu links on open: each link rises {rise}px (clipped by line-mask) with {rotate}° settle rotation, staggered {stagger}ms, over {duration}ms; reverse on close at 0.6× duration. Focus moves to the first link when open; stagger must not delay Esc/close responsiveness.",
    implementation: "Framer Motion variants with staggerChildren; will-change removed post-animation; open/close durations asymmetric by design.",
    stack: ["Framer Motion"],
    params: [
      num("rise", "Rise", 60, 20, 120, 5, "px"),
      num("rotate", "Rotate", 4, 0, 15, 1, "deg"),
      range("stagger", "Stagger", 55, 20, 140, 5, "ms"),
      range("duration", "Duration", 650, 250, 1200, 50, "ms"),
    ],
    tags: ["menu", "cascade", "stagger", "overlay"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "menu-overlay",
    suggests: ["layout/fullscreen-nav"],
  }),
  M({
    id: "motion/micro-interactions",
    category: "motion", subcategory: "system",
    name: "Micro-Interaction Standard",
    tagline: "Every control answers within 200ms.",
    description:
      "The micro-interaction baseline: hover feedback in one frame, press squash, focus rings, state morphs — the invisible craft layer.",
    prompt:
      "Standardize micro-interactions: hover states visible within one frame ({hover}ms ease-out), press feedback as scale {press} with 120ms ease, focus-visible 2px ring + {offset}px offset, toggle morphs {toggle}ms, success states check-draw + subtle scale. Transitions affect transform/opacity; color transitions ≤ 250ms.",
    implementation: "Global CSS transition tokens; press feedback via :active transform; focus-visible only (never :focus) rings.",
    stack: ["CSS"],
    params: [
      num("hover", "Hover response", 200, 100, 400, 10, "ms"),
      range("press", "Press scale", 0.97, 0.9, 1, 0.005, ""),
      num("offset", "Focus ring offset", 2, 0, 6, 1, "px"),
      num("toggle", "Toggle morph", 240, 100, 500, 20, "ms"),
    ],
    tags: ["micro", "feedback", "buttons", "states"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["hover"],
    demo: "micro",
  }),
  M({
    id: "motion/marquee",
    category: "motion", subcategory: "system",
    name: "Infinite Marquee",
    tagline: "Content loops laterally, seamless forever.",
    description:
      "Seamless horizontal loops for capabilities, clients, or words: content duplicated ×2 translating −50%, pausing on hover.",
    prompt:
      "Loop content in a seamless marquee: duplicate the strip twice, animate translateX 0→−50% linearly over {duration}s, direction {direction}; pause on hover/focus ({pause}), slow gracefully on reduced-motion (static). Content tolerant of cropping: edge masks fade 5% in/out.",
    implementation: "Pure CSS keyframes on a doubled flex strip; width measured so the half-point translation is exact; mask-fade-x on the container.",
    stack: ["CSS"],
    params: [
      num("duration", "Loop duration", 28, 8, 90, 1, "s"),
      select("direction", "Direction", "left", ["left", "right"]),
      select("pause", "Pause on hover", "yes", ["yes", "no"]),
    ],
    tags: ["marquee", "loop", "ticker", "lateral"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    a11y: "Static (non-moving) under prefers-reduced-motion; duplicated content aria-hidden.",
    demo: "marquee",
  }),
  M({
    id: "motion/scroll-velocity",
    category: "motion", subcategory: "scroll",
    name: "Scroll-Velocity Reaction",
    tagline: "The interface leans into fast scrolling.",
    description:
      "Elements skew, stretch or accelerate proportional to scroll velocity — speed becomes visible, then settles.",
    prompt:
      "React to scroll velocity: compute v = ΔscrollY/Δt smoothed (EMA {smooth}); map |v| to skewY up to {skew}° (clamped) on designated hero/list elements, easing back to 0 as velocity decays; marquees may accelerate +{boost}% at high velocity. Subtlety threshold: effects invisible below {minV}px/s.",
    implementation: "Scroll listener (passive) → rAF; skew via transform; velocity clamped; reduced-motion disables.",
    stack: ["rAF"],
    params: [
      num("skew", "Max skew", 4, 1, 12, 0.5, "deg"),
      range("smooth", "Velocity smoothing", 0.12, 0.02, 0.5, 0.01, "EMA"),
      num("boost", "Marquee boost", 30, 0, 100, 5, "%"),
      num("minV", "Dead zone", 60, 0, 300, 10, "px/s"),
    ],
    tags: ["velocity", "skew", "scroll", "reaction"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["scroll"],
  }),
  M({
    id: "motion/count-up",
    category: "motion", subcategory: "system",
    name: "Number Count-Up",
    tagline: "Statistics earn themselves on arrival.",
    description:
      "Numbers animate from 0 (or previous) to their value when in view — with honest formatting and easing toward rest.",
    prompt:
      "Count statistics up on view: value tweens 0→N over {duration}ms with ease-out-cubic (fast start, honest settle), formatted with Intl.NumberFormat ({locale}), tabular numerals to prevent width jitter; starts when {threshold}% visible; deltas re-tween from the current value rather than restarting.",
    implementation: "rAF tween with easeOutCubic; tabular-nums (font-variant-numeric); respect reduced-motion (render final value).",
    stack: ["rAF"],
    params: [
      range("duration", "Duration", 1100, 300, 2600, 100, "ms"),
      num("threshold", "Trigger at", 40, 10, 80, 5, "%"),
      select("locale", "Format", "en-US", ["en-US", "de-DE", "fr-FR", "ja-JP"]),
    ],
    tags: ["count", "numbers", "stats", "tween"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["scroll", "animated"],
    demo: "count-up",
  }),
  M({
    id: "motion/ui-state-transitions",
    category: "motion", subcategory: "system",
    name: "UI State Transition Grammar",
    tagline: "Enter, exit, move — three verbs, one grammar.",
    description:
      "A consistent transition grammar for component state: enter (rise+fade), exit (fall+fade), move (layout spring) across the whole app.",
    prompt:
      "Define the state-transition grammar: ENTER = opacity 0→1 + y {enter}px→0 over {dur}ms; EXIT = reverse at 0.7× duration; MOVE/reorder = layout spring (stiffness {stiff}, damping {damp}). Lists animate with stagger ≤ 30ms; grammar applies app-wide via shared variants — exceptions documented.",
    implementation: "Framer Motion shared variants (AnimatePresence for exit); layout animations for reorders; reduced-motion collapses all to fades.",
    stack: ["Framer Motion"],
    params: [
      num("enter", "Enter rise", 16, 4, 48, 2, "px"),
      num("dur", "Enter duration", 320, 120, 800, 20, "ms"),
      num("stiff", "Move stiffness", 300, 100, 700, 20),
      num("damp", "Move damping", 30, 12, 60, 1),
    ],
    tags: ["transitions", "grammar", "enter-exit", "layout"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
];
