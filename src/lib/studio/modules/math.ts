import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 07 — Mathematical & Generative Graphics.                   */
/*  Mathematically correct modules: formula, parameters, rendering,     */
/*  interaction, performance and fallback for every system.             */
/* ------------------------------------------------------------------ */

export const MATH_MODULES = [
  /* ---------------- A. Parametric geometry ---------------- */
  M({
    id: "math/lissajous",
    category: "math", subcategory: "parametric",
    name: "Lissajous Curves",
    tagline: "x = A·sin(a·t + δ), y = B·sin(b·t) — oscilloscope calligraphy.",
    description:
      "Lissajous figures trace perpendicular sinusoids at integer frequency ratios; changing a:b morphs the bow-ties and meshes, δ rotates the phase.",
    prompt:
      "Render Lissajous curves: x = cx + A·sin(a·t + δ), y = cy + B·sin(b·t) with a={a}, b={b}, δ={delta} rad, A,B fit to the panel; trace t∈[0,2π·period(a,b)] with {trails} fading trails (frame-fade alpha {fade}); ratio a:b should be presented to the user (e.g. 3:2) since integer ratios define the figure's topology.",
    implementation: "Canvas polyline sampled at ≥2048 steps; trails via translucent fill; note period = lcm heuristic — for integer a,b close after 2π·min-period.",
    stack: ["Canvas", "TypeScript"],
    params: [
      num("a", "Frequency a", 3, 1, 12, 1),
      num("b", "Frequency b", 4, 1, 12, 1),
      range("delta", "Phase δ", 1.5708, 0, 6.2832, 0.01, "rad"),
      num("trails", "Trail layers", 1, 1, 8, 1),
      range("fade", "Trail fade", 0.08, 0.01, 0.3, 0.01, "alpha"),
    ],
    tags: ["lissajous", "parametric", "harmonic", "curve"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "lissajous",
  }),
  M({
    id: "math/fourier-epicycles",
    category: "math", subcategory: "parametric",
    name: "Fourier Epicycles",
    tagline: "Rotating circles drawing any closed path.",
    description:
      "Epicycle chains visualize the Fourier series: circles riding circles, whose tip traces the target waveform as harmonics accumulate.",
    prompt:
      "Render Fourier epicycles: the path is synthesized as Σ Cₙ·e^(i·fₙ·t); draw {harmonics} circles as chained rotating vectors (radius |Cₙ|, angular speed fₙ), the final tip tracing the target contour ({wave}); leave a persistent trace of the tip; display harmonic count honestly — increasing terms converges the trace toward the exact wave.",
    implementation: "Precompute DFT of the target path (square/triangle/custom SVG); sort terms by amplitude; per-frame rotate and accumulate vectors, append tip position to a ring-buffer polyline.",
    stack: ["Canvas"],
    params: [
      num("harmonics", "Harmonics", 6, 1, 40, 1),
      select("wave", "Target wave", "square", ["square", "triangle", "sawtooth", "circle-double"]),
      range("speed", "Cycle speed", 1, 0.1, 4, 0.1, "×"),
    ],
    tags: ["fourier", "epicycles", "dft", "series"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "fourier",
    extreme: {
      visual: "Canvas in the hero block, devicePixelRatio-aware, letterboxed to the panel. Each epicycle drawn as a hairline circle (rgba(242,237,230,0.18)) with a radius arm to its current tip; harmonic arms in amber (#ffb85c) at 60% opacity; the accumulated trace a 2 px stroke in ember (#ff5c1c) with additive glow behind. Axes hairlines only — no grid noise.",
      motion: "Tip never jumps: vectors simulated at 60 fps with fixed-dt integration; cycle speed param scales θ̇ linearly ({speed}× ≈ {speed}s per 2π). Pausing freezes θ — trace persists. On reduced-motion: render one full cycle at {harmonics} harmonics as a single static frame, no animation loop.",
      graphics: "2D canvas, additive 'lighter' composite for the trace, DPR ≤ 2 cap, vector count equals {harmonics} + target-wave polyline ≤ 2 048 points (ring buffer, decimated when exceeded). Path DFT precomputed once per wave at {harmonics} terms; zero per-frame allocs in the hot loop.",
      architecture: "FourierTrail component: useFourierSeries(wave, harmonics) returns complex coefficients ordered by |Cₙ|; per-frame rAF advances phase, accumulates Σ Re/Im Cₙ·e^(i·fₙ·t), pushes tip to a ring buffer, paints. Params via zustand-style ref so slider edits re-render without replaying phase.",
      quality: "Works Canvas2D-only (float32 math); graceful FPS drop handled by dt clamp (≤ 40 ms). Snapshot test: for 5 harmonics at t=π/4 the predicted tip is within 1e-3 of analytic Fourier evaluation. Runs under prefers-reduced-motion with a still frame. No audio, no network.",
    },
  }),
  M({
    id: "math/bezier-curves",
    category: "math", subcategory: "parametric",
    name: "Bézier Construction",
    tagline: "de Casteljau's algorithm, shown working.",
    description:
      "Animated Bézier construction: control points, lerped scaffolds, and the drawing point sliding along — the math made visible.",
    prompt:
      "Show Bézier curves as living constructions: control polygon visible (draggable points P0..P{order}), de Casteljau scaffolding lines fading at {scaffold}% opacity, and the curve itself stroked; an animated point rides t∈[0,1] over {period}s. Formula rendered honestly: B(t) = Σᵢ C(n,i)(1−t)^(n−i)t^i·Pᵢ.",
    implementation: "Canvas/SVG; scaffolding computed by recursive lerp (no lib needed); draggable control points with pointer capture.",
    stack: ["Canvas/SVG"],
    params: [
      num("order", "Order (3=cubic)", 3, 2, 5, 1),
      range("scaffold", "Scaffold opacity", 35, 0, 100, 5, "%"),
      range("period", "t cycle", 5, 2, 12, 0.5, "s"),
    ],
    tags: ["bezier", "decasteljau", "curve", "construction"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated", "pointer"],
  }),
  M({
    id: "math/catmull-rom",
    category: "math", subcategory: "parametric",
    name: "Catmull-Rom Splines",
    tagline: "The spline that passes through its points.",
    description:
      "Catmull-Rom splines interpolate (not approximate) control points — the standard for camera paths and organic connectors.",
    prompt:
      "Use Catmull-Rom splines for camera paths and organic connectors: for points P₀..Pₙ, segment t interpolates with tension τ={tau} via the Hermite form using neighbors; produce smooth C¹ continuous curves passing exactly through data points. Compare against straight polylines to justify the choice; expose tension for tighter/looser bends.",
    implementation: "Segment: 0.5·[(2P1) + (−P0+P2)t + (2P0−5P1+4P2−P3)t² + (−P0+3P1−3P2+P3)t³]; resample arc-length for constant speed; canvas polyline render.",
    stack: ["TypeScript"],
    params: [range("tau", "Tension", 0.5, 0, 1, 0.05, "")],
    tags: ["spline", "catmull-rom", "interpolation", "camera-path"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["static"],
    suggests: ["motion/scroll-3d-camera"],
  }),
  M({
    id: "math/polar-rose",
    category: "math", subcategory: "parametric",
    name: "Polar Roses & Spirographs",
    tagline: "r = cos(k·θ): petals from pure ratio.",
    description:
      "Polar curves r(θ) = a·cos(kθ + φ) create rose petals whose count and phasing follow k; hypotrochoids extend to spirograph flowers.",
    prompt:
      "Render polar roses: plot r = a·cos(k·θ + φ) for θ up to the closure period (2π when k integer; 2π·denominator otherwise) — expose k={k} (petals = k for odd k, 2k for even) and φ={phi}; strokes at {lineWidth}px with hue keyed to θ; spirograph mode overlays hypotrochoid R={R}, r={r}, d={d}.",
    implementation: "Canvas polyline sampling 4096 points; closure computed from rational k decomposition; optional radial gradient stroke for depth.",
    stack: ["Canvas"],
    params: [
      range("k", "Rose k", 5, 1, 12, 0.5, ""),
      range("phi", "Phase φ", 0, 0, 6.28, 0.01, "rad"),
      num("R", "Spiro R", 140, 40, 300, 5, "px"),
      num("r", "Spiro r", 52, 5, 140, 1, "px"),
      num("d", "Pen distance", 90, 5, 200, 5, "px"),
      num("lineWidth", "Stroke", 1.4, 0.5, 4, 0.1, "px"),
    ],
    tags: ["polar", "rose", "spirograph", "curve"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "polar-rose",
  }),
  M({
    id: "math/spiral-systems",
    category: "math", subcategory: "parametric",
    name: "Spiral Systems",
    tagline: "Archimedean, logarithmic and Fermat spirals layered.",
    description:
      "Spiral families: r=aθ (Archimedean), r=ae^(bθ) (logarithmic/golden), r=a√θ (Fermat) — single-parameter morphs between geometry personalities.",
    prompt:
      "Render a spiral explorer: r(θ) per family {family} with growth b={b}, θ up to {winds} winds, stroke fading with θ; demonstrate that the golden ratio appears as the logarithmic spiral with b = ln(φ)/(π/2) ≈ 0.30635. Layer up to {layers} phase-offset copies for interference patterns.",
    implementation: "Canvas polyline; color = HSL(θ·k mod 360); animation via b or θ-max easing; cheap enough for 60fps on any device.",
    stack: ["Canvas"],
    params: [
      select("family", "Family", "logarithmic", ["archimedean", "logarithmic", "fermat"]),
      range("b", "Growth b", 0.30635, 0.05, 0.6, 0.005, ""),
      num("winds", "Winds", 6, 2, 20, 1),
      num("layers", "Layer copies", 1, 1, 6, 1),
    ],
    tags: ["spiral", "golden-ratio", "logarithmic", "polar"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "math/torus-knots",
    category: "math", subcategory: "parametric",
    name: "Torus & Torus Knots",
    tagline: "(p,q)-wound ribbons through 3-space.",
    description:
      "Parametric torus knots wind p times around and q times through a torus — elegant 3D line sculpture with two integer params.",
    prompt:
      "Render a (p={p}, q={q}) torus knot: r₀ = R(2+cos(q·θ))/3; position = r₀·cos(pθ), r₀·sin(pθ), −R·sin(qθ)/3 sampled ≥ 2000 points, tube radius {tube}; rotate slowly; surface shading via simple Lambert from a key light. p and q coprime → single closed knot — say so; also offer the plain torus (p=1, q=0 family).",
    implementation: "Three.js TubeGeometry over the parametric curve (CatmullRomCurve3 through samples), MeshStandardMaterial; or Line2 for hairline aesthetic; slow rotation 10°/s.",
    stack: ["Three.js"],
    params: [
      num("p", "Winds p", 2, 1, 9, 1),
      num("q", "Winds q", 3, 1, 9, 1),
      range("tube", "Tube radius", 0.08, 0.01, 0.4, 0.01, ""),
    ],
    tags: ["torus", "knot", "parametric-3d", "tube"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated"],
  }),
  M({
    id: "math/mobius-strip",
    category: "math", subcategory: "parametric",
    name: "Möbius Strip",
    tagline: "One side, one edge — walk it to believe it.",
    description:
      "The Möbius strip: a non-orientable parametric surface where a traveling frame visibly returns flipped after one circuit.",
    prompt:
      "Render a Möbius strip (parametric: x=(R+w·cos(u/2))·cos(u), y=(R+w·cos(u/2))·sin(u), z=w·sin(u/2), u∈[0,2π), w∈[−1,1]·{halfWidth}); animate a marker traveling u to demonstrate single-sidedness (returns inverted after 2π, normal after 4π); two-tone surface via slight hue shift with w to sell the twist.",
    implementation: "Three.js ParametricGeometry or generated BufferGeometry grid 200×20; marker = small mesh riding u; lighting standard.",
    stack: ["Three.js"],
    params: [range("halfWidth", "Strip half-width", 0.35, 0.1, 1, 0.05, "")],
    tags: ["mobius", "non-orientable", "topology", "surface"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated"],
  }),

  /* ---------------- B. Computational geometry ---------------- */
  M({
    id: "math/voronoi",
    category: "math", subcategory: "computational",
    name: "Voronoi Diagram",
    tagline: "Every point owns its nearest territory.",
    description:
      "A Voronoi diagram partitions the plane into cells of everything closest to each seed — organic tiling for backgrounds, maps, shatter patterns.",
    prompt:
      "Render a Voronoi diagram: {seeds} seed points (poisson-ish distribution or drifting at {drift}px/s), cells computed exactly (half-plane clipping against perpendicular bisectors, or d3-delaunay), stroked {stroke}px with fills keyed to {colorMode} (seed hue / distance ramp / none). Lloyd-relaxation passes ({lloyd}) even the cell sizes for premium calm.",
    implementation: "Exact cells via Sutherland–Hodgman clipping per seed (O(n²) fine to ~200 seeds) or d3-delaunay; animate by drifting seeds with wrap; Lloyd: reseed at cell centroids k times.",
    stack: ["Canvas", "d3-delaunay (optional)"],
    params: [
      num("seeds", "Seed count", 42, 8, 200, 2),
      range("drift", "Seed drift", 6, 0, 40, 1, "px/s"),
      num("stroke", "Stroke", 1, 0, 4, 0.5, "px"),
      select("colorMode", "Fill", "distance ramp", ["distance ramp", "seed hue", "none (wire)"]),
      num("lloyd", "Relaxation passes", 1, 0, 4, 1),
    ],
    tags: ["voronoi", "cells", "tiling", "computational"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "voronoi",
    suggests: ["math/delaunay"],
  }),
  M({
    id: "math/delaunay",
    category: "math", subcategory: "computational",
    name: "Delaunay Triangulation",
    tagline: "The dual mesh: triangles with fat, honest angles.",
    description:
      "Delaunay triangulation connects seeds into the mesh that maximizes minimum angles — Voronoi's dual, and the low-poly look's correct engine.",
    prompt:
      "Render the Delaunay triangulation of the point set ({seeds} points): triangles stroked/filled with per-facet gradient or elevation-keyed color; Delaunay property (no point inside any circumcircle) makes triangles fat and stable — the correct basis for low-poly aesthetics, not random chords. Toggle circumcircles for educational overlay.",
    implementation: "d3-delaunay (or Bowyer–Watson); fill via barycentric gradient between vertex colors; animate by perturbing points and re-triangulating (≤ 60Hz ok to ~300 pts).",
    stack: ["Canvas", "d3-delaunay"],
    params: [
      num("seeds", "Points", 60, 12, 300, 4),
      select("fill", "Facet fill", "vertex-blend", ["vertex-blend", "elevation-keyed", "wireframe"]),
    ],
    tags: ["delaunay", "triangulation", "low-poly", "mesh"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "voronoi",
  }),
  M({
    id: "math/tessellation",
    category: "math", subcategory: "computational",
    name: "Truchet Tiles",
    tagline: "Quarter-arc tiles rotated into rivers.",
    description:
      "Truchet tiling: a grid of identical tiles (quarter-circle arcs) each randomly rotated — mazes and weaves emerge from one simple rule.",
    prompt:
      "Generate a Truchet pattern: {cells}×{rows} grid; each cell hosts a {tile} tile (quarter-circle arcs connecting edge midpoints) rotated randomly among 4 orientations (seeded PRNG {seeded}); stroke {lineWidth}px; adjacent arcs connect into continuous paths — the weave emerges, never designed cell-by-cell. Regenerate on click with a new seed.",
    implementation: "Canvas: per-cell ctx.drawarc pair; seeded mulberry32; variant 'multi-scale' nests coarser grids inside coarse cells.",
    stack: ["Canvas"],
    params: [
      num("cells", "Columns", 16, 6, 48, 1),
      num("rows", "Rows", 10, 4, 32, 1),
      select("tile", "Tile type", "quarter-circle", ["quarter-circle", "diagonal", "triangle-truchet"]),
      select("seeded", "Seeded", "yes", ["yes", "random"]),
      num("lineWidth", "Stroke", 2.5, 1, 8, 0.5, "px"),
    ],
    tags: ["truchet", "tiles", "pattern", "maze"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "pointer"],
  }),
  M({
    id: "math/subdivision",
    category: "math", subcategory: "computational",
    name: "Recursive Subdivision",
    tagline: "Split, split, split — structure from one rule.",
    description:
      "Recursive geometric subdivision: split rectangles/triangles by a rule, recursively, with depth-dependent styling — generative posters from one function.",
    prompt:
      "Generate recursive subdivision art: start with the frame; each region splits ({axis}) by ratio r∈[{rMin},{rMax}] with probability p={p}; recurse to depth {depth}; leaves filled from a restrained palette or stroked only; seed-exposed regeneration. Treemap-like discipline keeps it ordered rather than confetti.",
    implementation: "Recursive split queue; leaf render with margin insets; seeded PRNG; cap leaf count at ~500 for DOM/SVG or render to canvas beyond that.",
    stack: ["Canvas/SVG"],
    params: [
      select("axis", "Split rule", "longest axis", ["longest axis", "alternate", "random"]),
      range("rMin", "Min split ratio", 0.28, 0.1, 0.45, 0.01, ""),
      range("rMax", "Max split ratio", 0.72, 0.55, 0.9, 0.01, ""),
      range("p", "Split probability", 0.85, 0.3, 1, 0.05, ""),
      num("depth", "Max depth", 5, 2, 8, 1),
    ],
    tags: ["subdivision", "recursive", "treemap", "generative"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static"],
  }),
  M({
    id: "math/convex-hull",
    category: "math", subcategory: "computational",
    name: "Convex Hull Gifts",
    tagline: "Gift-wrap the point cloud; draw the envelope.",
    description:
      "Convex hull via gift-wrapping or Graham scan — visualize the algorithm marching around the outermost points.",
    prompt:
      "Visualize convex-hull construction: {points} scattered points; animate {algo} (gift-wrapping: the walking edge sweeps point-to-point; Graham: sort by polar angle then scan) at {speed} steps/sec; hull stroked boldly, interior points dimmed, rejected candidates flash briefly. Terminate by closing the loop with a settle animation.",
    implementation: "Canvas; algorithm stepped via timer for pedagogy; O(nh) gift wrapping fine for n≤300.",
    stack: ["Canvas"],
    params: [
      num("points", "Point count", 60, 12, 300, 4),
      select("algo", "Algorithm", "gift-wrapping (Jarvis)", ["gift-wrapping (Jarvis)", "Graham scan"]),
      num("speed", "Steps/sec", 12, 2, 60, 1),
    ],
    tags: ["convex-hull", "algorithm", "graham", "jarvis"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),

  /* ---------------- C. Fractals ---------------- */
  M({
    id: "math/mandelbrot",
    category: "math", subcategory: "fractals",
    name: "Mandelbrot Set",
    tagline: "z ← z² + c: the infinite coastline.",
    description:
      "The Mandelbrot set rendered by escape-time iteration: pixels classified by how fast |z| escapes 2 — zoomable into infinite detail.",
    prompt:
      "Render the Mandelbrot set: for each pixel c, iterate z ← z² + c from z=0 up to {iters} iterations; escaped (|z|>2) points colored by smooth iteration count n + 1 − log₂(log₂|z|) mapped through the palette ({palette}); bounded set in solid black; progressive refinement (coarse pass at 1/4 res, refine) keeps interaction fluid while exploring center=({x0}, {y0}i) at scale {zoom}.",
    implementation: "Canvas ImageData per-tile workers or WebGL fragment; smooth coloring; palette cycling optional; perturbation theory NOT required at these depths.",
    stack: ["Canvas/WebGL"],
    params: [
      num("iters", "Max iterations", 120, 40, 800, 10),
      range("x0", "Center Re", -0.6, -2.2, 1, 0.001, ""),
      range("y0", "Center Im", 0, -1.5, 1.5, 0.001, ""),
      range("zoom", "Log₂ zoom", 1, 0, 18, 0.5, ""),
      select("palette", "Palette", "fire-ocean", ["fire-ocean", "mono", "ultraviolet", "earthen"]),
    ],
    tags: ["mandelbrot", "fractal", "escape-time", "zoom"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["pointer", "realtime"],
    demo: "julia",
    responsive: "Render at capped DPR (≤1.5) with progressive refinement; pinch-zoom via transform re-rendered at settle.",
  }),
  M({
    id: "math/julia",
    category: "math", subcategory: "fractals",
    name: "Julia Set",
    tagline: "One constant c, a whole universe per value.",
    description:
      "Julia sets fix the constant c and vary the starting point — each c unlocks a different fractal personality, ideal as animated brand fields.",
    prompt:
      "Render a Julia set: fix c = ({cr} + {ci}i), iterate z ← z² + c per pixel up to {iters}; color via smooth iteration count through {palette}; animate c slowly along a cardioid-adjacent path ({motor} speed) for continuous metamorphosis (values outside the Mandelbrot set dissolve to dust — use that as a deliberate act break).",
    implementation: "Fragment shader or canvas tile pass; smooth coloring n + 1 − log₂(log₂|z|); c path: circle/cardioid lerp; clamp dt, adaptive iterations under motion.",
    stack: ["Canvas/WebGL"],
    params: [
      range("cr", "c (real)", -0.7269, -1.5, 1, 0.0001, ""),
      range("ci", "c (imag)", 0.1889, -1.2, 1.2, 0.0001, ""),
      num("iters", "Iterations", 140, 40, 600, 10),
      select("palette", "Palette", "ultraviolet", ["ultraviolet", "fire-ocean", "mono", "earthen"]),
      range("motor", "c drift speed", 0.02, 0, 0.2, 0.005, "/s"),
    ],
    tags: ["julia", "fractal", "escape-time", "generative"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "julia",
  }),
  M({
    id: "math/mandelbulb",
    category: "math", subcategory: "fractals",
    name: "Mandelbulb (3D Fractal)",
    tagline: "The Mandelbrot formula, ray-marched in 3D.",
    description:
      "The Mandelbrot power-8 3D analogue rendered by ray marching its distance estimator — fractal geology floating in space.",
    prompt:
      "Ray-march the Mandelbulb: distance estimator DE = 0.5·log(r)·r/dr with power n={power}, bail {iters} iterations in the estimator and {steps} max ray steps; shade via orbit traps or simple AO+rim; rotate slowly; auto-quality: halves steps when frame time > 16ms; this is a showcase piece — give it a dedicated stage, not a page-wide background.",
    implementation: "Fragment-shader sphere tracing with power-n triplex math (θ=atan2, φ=asin formulation); epsilon normal via gradient; bounded in sphere r=1.3 for early-out.",
    stack: ["WebGL", "GLSL"],
    params: [
      range("power", "Power n", 8, 2, 16, 1, ""),
      num("iters", "DE iterations", 8, 4, 16, 1),
      num("steps", "Ray steps", 96, 32, 256, 8),
    ],
    tags: ["mandelbulb", "raymarching", "3d-fractal", "shader"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    fallback: "Pre-rendered 720p loop video or still poster where WebGL unavailable/weak.",
    suggests: ["math/ray-marching", "engineering/gpu-budget", "engineering/webgl-fallback"],
  }),
  M({
    id: "math/sierpinski",
    category: "math", subcategory: "fractals",
    name: "Sierpinski Triangle",
    tagline: "Chaos game: random walks that draw perfect order.",
    description:
      "The Sierpinski triangle via the chaos game: plot midpoint jumps toward random vertices — fractal emerges from pure randomness.",
    prompt:
      "Render the Sierpinski triangle via the chaos game: start at any point; each step moves halfway toward a random vertex of the base triangle; after a {burn}-step burn-in, plot {points} points accumulating into the gasket; alternatively render the {depth}-level recursive gasket with shapes removed. Both demonstrate the same fractal — showing side-by-side is a lovely teaching moment.",
    implementation: "Canvas accumulation (1×1 rects, batched); recursion alternative trivial; points count adapts to canvas area.",
    stack: ["Canvas"],
    params: [
      num("points", "Chaos points", 40000, 5000, 200000, 5000),
      num("burn", "Burn-in steps", 20, 0, 100, 5),
      num("depth", "Recursion depth (alt)", 6, 2, 9, 1),
    ],
    tags: ["sierpinski", "chaos-game", "fractal", "accumulation"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated", "static"],
    demo: "sierpinski",
  }),
  M({
    id: "math/koch-snowflake",
    category: "math", subcategory: "fractals",
    name: "Koch Snowflake",
    tagline: "Infinite perimeter, finite area, four rules.",
    description:
      "The Koch snowflake: each segment replaced by 4 smaller (bump out 60°) — iteration depth makes the coastline infinitely crinkly.",
    prompt:
      "Render the Koch snowflake to depth {depth}: each line segment subdivides into 4 (thirds with an equilateral bump); points grow 4^depth — beyond depth 6 (≈12k segments) render to canvas rather than SVG; animate depth increase or per-vertex phase breathing; state the paradox (infinite perimeter, finite area) as caption content.",
    implementation: "Iterative point expansion (no recursion needed); stroke-only render; depth slider recomputes.",
    stack: ["Canvas/SVG"],
    params: [num("depth", "Iterations", 4, 1, 7, 1)],
    tags: ["koch", "snowflake", "fractal", "iteration"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "math/l-systems",
    category: "math", subcategory: "fractals",
    name: "L-System Botany",
    tagline: "Rewrite rules growing literal plants.",
    description:
      "Lindenmayer systems: string rewriting (F→FF+[+F−F−F]−[−F+F+F]) interpreted as turtle graphics grows branching structures.",
    prompt:
      "Grow L-system plants: axiom '{axiom}', rule {rule}, angle {angle}°, iterate {iters}× then interpret as turtle graphics (F=forward, ±=turn, []=push/pop); thickness tapers along depth; add wind sway by time-varying the angle ±{wind}°. Deterministic per seed; a depth-colored gradient sells the growth.",
    implementation: "String rewrite (exponential — guard max length ~100k), turtle interpretation to polylines, canvas stroke with depth→color; web worker for iters ≥ 6.",
    stack: ["Canvas"],
    params: [
      select("axiom", "Axiom", "X", ["X", "F", "F−F−F−F"]),
      select("rule", "Ruleset", "X→F+[[X]−X]−F[−FX]+X, F→FF", ["X→F+[[X]−X]−F[−FX]+X, F→FF", "F→FF+[+F−F−F]−[−F+F+F]", "F→F[+F]F[−F]F"]),
      range("angle", "Branch angle", 25.7, 10, 45, 0.1, "°"),
      num("iters", "Iterations", 5, 2, 8, 1),
      range("wind", "Wind sway", 3, 0, 12, 0.5, "°"),
    ],
    tags: ["l-system", "lindenmayer", "turtle", "plant"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "fractal-tree",
  }),
  M({
    id: "math/recursive-tree",
    category: "math", subcategory: "fractals",
    name: "Recursive Branching Tree",
    tagline: "Depth-first doodles: angle, decay, bloom.",
    description:
      "The canonical recursive tree: branches split at an angle with length decay per depth — swaying, seasonable, endlessly generative.",
    prompt:
      "Draw a recursive tree: branch(x, y, θ, len, depth) draws then recurses at θ±{angle}°, len×{decay}, until depth {depth}; stroke width ∝ len (trunk thick, tips hairline), tip color shifts toward {tipHue}; animate sway as θ += sin(t + depth)·{sway}° — displacement grows toward tips, trunk stays planted.",
    implementation: "Canvas recursion (depth ≤ 12 keeps segments ≤ 8k); sway = per-frame parameter, not restructure; regrow button reseeds randomness.",
    stack: ["Canvas"],
    params: [
      num("angle", "Branch angle", 24, 8, 45, 1, "°"),
      range("decay", "Length decay", 0.72, 0.5, 0.9, 0.01, ""),
      num("depth", "Depth", 10, 4, 13, 1),
      range("sway", "Wind sway", 4, 0, 15, 0.5, "°"),
      num("tipHue", "Tip hue", 340, 0, 360, 10, "°"),
    ],
    tags: ["tree", "recursion", "branching", "fractal"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "fractal-tree",
  }),
  M({
    id: "math/ifs",
    category: "math", subcategory: "fractals",
    name: "Iterated Function Systems",
    tagline: "The Barnsley fern: four affine maps, one fern.",
    description:
      "IFS fractals apply a small set of affine transformations with fixed probabilities — the Barnsley fern is the canonical miracle.",
    prompt:
      "Render the {system} IFS: apply its affine maps with their published probabilities, plotting {points} points after burn-in; Barnsley fern maps: stem 1%, smaller leaflets 7%/7%, main leaflets 85% — the fern literally assembles itself from four matrix rules. Render as accumulation with slight brightness per hit for depth.",
    implementation: "Canvas accumulation loop; exact published coefficient tables; pace via points/frame budget.",
    stack: ["Canvas"],
    params: [
      select("system", "System", "Barnsley fern", ["Barnsley fern", "Sierpinski carpet", "Dragon (twin)"]),
      num("points", "Points", 60000, 10000, 300000, 10000),
    ],
    tags: ["ifs", "barnsley", "fern", "affine"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated", "static"],
    demo: "sierpinski",
  }),

  /* ---------------- D. Dynamical systems ---------------- */
  M({
    id: "math/lorenz",
    category: "math", subcategory: "dynamical",
    name: "Lorenz Attractor",
    tagline: "The butterfly, integrated live.",
    description:
      "The Lorenz strange attractor (σ=10, ρ=28, β=8/3) integrated by RK4 — chaos rendered as a continuous ribbon.",
    prompt:
      "Integrate and render the Lorenz attractor: ẋ=σ(y−x), ẏ=x(ρ−z)−y, ż=xy−βz with σ={sigma}, ρ={rho}, β={beta}; RK4 at dt={dt}, {speed} steps/s, projected (orbit camera or fixed 3/4) with the trail fading over {trail}s of history; color by velocity magnitude |v| for heat-map beauty; note that nearby seeds diverge visibly — chaos is the exhibit.",
    implementation: "RK4 integrator (no Euler — it spirals out); trail as ring-buffer polyline (N≈8–20k points), canvas or WebGL line; ρ slider crossing 24.74 bifurcates — call it the honest 'chaos boundary'.",
    stack: ["Canvas/WebGL", "TypeScript"],
    params: [
      range("sigma", "σ", 10, 1, 30, 0.5, ""),
      range("rho", "ρ", 28, 10, 60, 0.5, ""),
      range("beta", "β", 2.6667, 1, 4, 0.01, ""),
      num("dt", "dt", 0.008, 0.002, 0.02, 0.001),
      num("speed", "Steps/s", 2400, 600, 9600, 100),
      range("trail", "Trail window", 12, 2, 40, 1, "s"),
    ],
    tags: ["lorenz", "attractor", "chaos", "rk4"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated", "realtime"],
    demo: "lorenz",
  }),
  M({
    id: "math/rossler",
    category: "math", subcategory: "dynamical",
    name: "Rössler Attractor",
    tagline: "The quieter strange attractor: folded bands.",
    description:
      "Rössler's attractor (ẋ=−y−z, ẏ=x+ay, ż=b+z(x−c)) draws folded band structures — chaos with more legible geometry than Lorenz.",
    prompt:
      "Render the Rössler attractor: ẋ=−y−z, ẏ=x+a·y, ż=b+z(x−c) with a={a}, b={b}, c={c}; RK4 integration; the band-folding geometry is more legible than Lorenz for teaching chaos; velocity-colored trail, slowly orbiting camera.",
    implementation: "Same integrator as Lorenz; parameters near a=b=0.2, c=5.7 classic chaos; c<4.2 settles into limit cycles (demonstrate both).",
    stack: ["Canvas/WebGL"],
    params: [
      range("a", "a", 0.2, 0.05, 0.4, 0.01, ""),
      range("b", "b", 0.2, 0.05, 0.4, 0.01, ""),
      range("c", "c", 5.7, 2, 10, 0.1, ""),
    ],
    tags: ["rossler", "attractor", "chaos", "banding"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated"],
    demo: "lorenz",
  }),
  M({
    id: "math/double-pendulum",
    category: "math", subcategory: "dynamical",
    name: "Double Pendulum",
    tagline: "Two arms, total chaos, beautiful trace.",
    description:
      "The double pendulum: two links under gravity exhibiting extreme sensitivity; the tip trace becomes chaotic calligraphy.",
    prompt:
      "Simulate a double pendulum: links L1={l1}, L2={l2}, masses m1={m1}, m2={m2}, g={g}; integrate the coupled ODEs (RK4) at dt={dt}; render both arms with the tip leaving a fading trace ({trace}s); run a ghost pendulum 1° offset to visualize sensitive dependence — two identical releases diverge within seconds, and that IS the lesson.",
    implementation: "Lagrangian-derived equations (standard form), RK4; trace as fading polyline; ghost overlay offset 1° in initial θ2.",
    stack: ["Canvas"],
    params: [
      range("l1", "Link 1", 120, 40, 240, 5, "px"),
      range("l2", "Link 2", 120, 40, 240, 5, "px"),
      range("m1", "Mass 1", 1.2, 0.2, 4, 0.1, ""),
      range("m2", "Mass 2", 1, 0.2, 4, 0.1, ""),
      range("g", "Gravity", 1, 0.1, 3, 0.05, "× earth"),
      num("dt", "dt", 0.006, 0.002, 0.02, 0.001),
      range("trace", "Trace window", 14, 2, 60, 1, "s"),
    ],
    tags: ["pendulum", "chaos", "physics", "trace"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "math/n-body",
    category: "math", subcategory: "dynamical",
    name: "N-Body Orbits",
    tagline: "Every mass tugs every mass — galaxies negotiate.",
    description:
      "N-body gravitation: bodies attract pairwise (softened inverse-square), merging momentum into spirals, slingshots and clusters.",
    prompt:
      "Simulate N-body gravitation: {bodies} bodies with masses m∈[{mMin},{mMax}], force Σ G·mᵢmⱼ/(d²+ε²) with softening ε={eps}; symplectic (leapfrog) integration to preserve orbital energy; trails on; bodies merge on contact with momentum conserved; G set so a central heavy body yields stable-orbiting satellites — the user can fling new bodies by drag-release.",
    implementation: "O(n²) for n ≤ 400 is fine per frame at 60Hz with typed arrays; leapfrog kick-drift-kick; canvas render with mass→radius.",
    stack: ["Canvas"],
    params: [
      num("bodies", "Bodies", 120, 10, 400, 10),
      range("mMin", "Min mass", 1, 0.2, 10, 0.2, ""),
      range("mMax", "Max mass", 600, 50, 5000, 50, ""),
      range("eps", "Softening ε", 8, 1, 40, 1, "px"),
    ],
    tags: ["n-body", "gravity", "orbits", "simulation"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
  }),
  M({
    id: "math/boids",
    category: "math", subcategory: "dynamical",
    name: "Boids Flocking",
    tagline: "Three rules: separate, align, cohere — flocks emerge.",
    description:
      "Reynolds' boids: separation/alignment/cohesion steering produces flocking with no central control — emergence you can watch.",
    prompt:
      "Simulate boids: {count} agents steered by separation (weight {sep}), alignment ({ali}), cohesion ({coh}) within perception radius {percept}px; max speed {speed}, max force cap; wrap or soft-bounce edges; variants: leader boid the pointer can guide, predator key to scatter. Emergence happens honestly — no scripted paths.",
    implementation: "Spatial hash neighbors; per-boid steering clamp; canvas instanced triangles oriented by velocity; 60fps to ~1500 boids in 2D.",
    stack: ["Canvas"],
    params: [
      num("count", "Boids", 220, 40, 1500, 20),
      range("sep", "Separation", 1.6, 0, 4, 0.1, ""),
      range("ali", "Alignment", 1.0, 0, 4, 0.1, ""),
      range("coh", "Cohesion", 1.0, 0, 4, 0.1, ""),
      num("percept", "Perception radius", 60, 20, 200, 5, "px"),
      num("speed", "Max speed", 140, 40, 420, 10, "px/s"),
    ],
    tags: ["boids", "flocking", "emergence", "agents"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "boids",
  }),
  M({
    id: "math/cellular-automata",
    category: "math", subcategory: "dynamical",
    name: "Cellular Automata",
    tagline: "Local rules, global civilizations.",
    description:
      "Grid-based automata (Game of Life, HighLife, Day & Night): cell states flip by neighbor-count rules each generation.",
    prompt:
      "Run a cellular automaton: {cell}px cells, rule {rule} (Life B3/S23 the default), generation tick {fps}/s on a toroidal grid; draw with age-based fading (cells dim as they persist) for temporal depth; interaction: click/drag seeds cells, famous patterns (glider, pulsar, Gosper gun) available as stamps.",
    implementation: "Double-buffered Uint8 grids; neighbor sums via typed-array loops; torus wrap; canvas ImageData or rect batches.",
    stack: ["Canvas"],
    params: [
      num("cell", "Cell size", 6, 2, 20, 1, "px"),
      select("rule", "Rule", "Life (B3/S23)", ["Life (B3/S23)", "HighLife (B36/S23)", "Day & Night (B3678/S34678)"]),
      num("fps", "Generations/s", 12, 1, 60, 1),
    ],
    tags: ["automata", "game-of-life", "conway", "grid"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
  }),
  M({
    id: "math/logistic-map",
    category: "math", subcategory: "dynamical",
    name: "Logistic Map Bifurcation",
    tagline: "x → r·x(1−x): the road to chaos, diagrammed.",
    description:
      "The bifurcation diagram of the logistic map — the most information-dense image in chaos theory, computed per column.",
    prompt:
      "Render the logistic-map bifurcation diagram: for each column r∈[{rMin}, {rMax}] iterate x→r·x(1−x) ({burn} burn-in, plot {plot} points); period-doubling cascade builds left-to-right, chaos at r≈3.57 with visible windows of order (period-3 at 3.83) — annotate the period-3 window; click-zoom into any r-range.",
    implementation: "Per-column burn-in + accumulation into an alpha canvas; hover crosshair reads r and observed period.",
    stack: ["Canvas"],
    params: [
      range("rMin", "r from", 2.4, 0, 4, 0.01, ""),
      range("rMax", "r to", 4, 2.9, 4, 0.01, ""),
      num("burn", "Burn-in", 300, 50, 2000, 50),
      num("plot", "Points plotted/col", 260, 50, 1000, 20),
    ],
    tags: ["logistic", "bifurcation", "chaos", "diagram"],
    difficulty: "intermediate", perf: "light", dimension: "2d", interactivity: ["pointer", "static"],
  }),

  /* ---------------- E. Procedural ---------------- */
  M({
    id: "math/perlin-noise",
    category: "math", subcategory: "procedural",
    name: "Perlin / Value Noise Fields",
    tagline: "The atom of procedural nature.",
    description:
      "Gradient/value noise generates smooth random fields — the substrate of terrain, clouds, wood, marble, and every 'organic' procedural texture.",
    prompt:
      "Generate noise fields: {dim}D noise ({algo}) sampled across scale {scale}; visualize as a height-shaded field or contour bands; expose octaves={oct} (each octave doubles frequency, halves amplitude) so fBM emerges from the same control; seeded ({seed}) for reproducibility; explain that noise ≠ random: continuity is the entire point.",
    implementation: "Value noise with quintic smoothing or true gradient noise (Perlin 2002); permutation-table seeded; canvas ImageData render; tileable variant via period wrap.",
    stack: ["Canvas", "TypeScript"],
    params: [
      select("algo", "Algorithm", "perlin", ["value", "perlin", "simplex"]),
      select("dim", "Dimensions", "2", ["2", "3 (time-animated)"]),
      range("scale", "Base scale", 0.006, 0.001, 0.03, 0.0005, "/px"),
      num("oct", "fBM octaves", 4, 1, 8, 1),
      num("seed", "Seed", 1337, 0, 99999, 1),
    ],
    tags: ["perlin", "noise", "fbm", "field"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["static", "animated"],
    demo: "noise-field",
  }),
  M({
    id: "math/fbm",
    category: "math", subcategory: "procedural",
    name: "Fractal Brownian Motion (fBM)",
    tagline: "Octaves stacked into geology and cloud.",
    description:
      "fBM stacks noise octaves (lacunarity 2, gain 0.5) into detail-rich fields — the standard recipe for terrain, clouds and texture.",
    prompt:
      "Render fBM fields: value = Σᵢ amp·gⁱ·noise(x·lⁱ) with gain g={gain}, lacunarity l={lac}, {oct} octaves; visualize as grayscale field, contour bands ({bands}) or domain-elevation coloring; ridge variant (|2n−1|) gives mountain-backbone structure; this single function replaces thousands of texture assets.",
    implementation: "Octave loop over the noise primitive; canvas or one-pass shader; ridges via abs-transform; tileable via 4D-domain trick if needed.",
    stack: ["Canvas", "GLSL"],
    params: [
      range("gain", "Gain", 0.5, 0.2, 0.8, 0.02, ""),
      range("lac", "Lacunarity", 2, 1.2, 3.5, 0.05, ""),
      num("oct", "Octaves", 5, 1, 9, 1),
      num("bands", "Contour bands (0=continuous)", 0, 0, 24, 1),
      select("flavor", "Flavor", "standard", ["standard", "ridged", "turbulence (abs)"]),
    ],
    tags: ["fbm", "octaves", "terrain", "clouds"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["static", "animated"],
    demo: "fbm-field",
    suggests: ["color/marble", "math/domain-warping"],
  }),
  M({
    id: "math/domain-warping",
    category: "math", subcategory: "procedural",
    name: "Domain Warping",
    tagline: "f(p + fbm(p + fbm(p))): Quilez's swirl.",
    description:
      "Domain warping feeds noise into noise (f(p)=fbm(p + fbm(p + fbm(p)))) producing the marbled, fluid swirl of premium generative art.",
    prompt:
      "Apply domain warping: color(p) = fbm(p + {w1}·fbm(p + {w2}·fbm(p·base))): inner warp amplitude {w2}, outer {w1}; the double-warp produces the famous liquified-marble topology; animate by sliding time through the innermost domain; strength discipline — warps beyond ~6× base scale turn to soup.",
    implementation: "Single fragment pass or progressive canvas; uniforms w1/w2/base; palette maps the warped scalar through brand colors.",
    stack: ["GLSL", "Canvas"],
    params: [
      range("w1", "Outer warp", 4, 0, 10, 0.1, ""),
      range("w2", "Inner warp", 4, 0, 10, 0.1, ""),
      range("speed", "Time flow", 0.05, 0, 0.4, 0.01, "/s"),
    ],
    tags: ["domain-warping", "fbm", "swirl", "marble"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "domain-warp",
    suggests: ["math/fbm"],
  }),
  M({
    id: "math/flow-field",
    category: "math", subcategory: "procedural",
    name: "Procedural Flow Field",
    tagline: "A continuous angle field rivers are born from.",
    description:
      "A flow field maps every point to an angle via noise — used to advect particles, hair, vines, and calligraphic strokes.",
    prompt:
      "Build the flow field: angle(p, t) = noise3(p·{scale}, t·{timeScale})·2π·{turns}; visualize as short tangents on a grid ({grid}px) or by advected tracers; field evolves with time so currents slowly reroute; document vs. curl-noise (divergence-free) — flow fields compress, curl noise swirls without sources/sinks.",
    implementation: "noise3 → angle; grid tangents or particle tracers; render canvas; see motion/flow-field-particles for the swarm use.",
    stack: ["Canvas"],
    params: [
      range("scale", "Spatial scale", 0.0022, 0.0005, 0.01, 0.0001, "/px"),
      range("timeScale", "Time evolution", 0.08, 0, 0.5, 0.01, ""),
      range("turns", "Angle range", 2, 1, 6, 0.5, "×2π"),
      num("grid", "Visual grid", 28, 12, 64, 2, "px"),
    ],
    tags: ["flow-field", "noise", "vectors", "tracers"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "flow-field",
    suggests: ["motion/flow-field-particles"],
  }),
  M({
    id: "math/curl-noise",
    category: "math", subcategory: "procedural",
    name: "Curl Noise",
    tagline: "Divergence-free flow: swirls without sinks.",
    description:
      "Curl noise derives flow from the curl of a noise potential field — particles swirl in eddies instead of collecting in blobs.",
    prompt:
      "Use curl noise for fluid-feel particle motion: v = ∇×Ψ computed numerically from the noise potential (finite difference, h={h}); particles advected show eddies and shears without compression artifacts (no clogging); perceptibly 'wetter' than plain noise steering — worth the 4× noise samples per frame.",
    implementation: "curl at (x,y): [∂Ψ/∂y, −∂Ψ/∂x] via central differences; advect particles; pair with trail fade.",
    stack: ["Canvas", "noise"],
    params: [
      range("h", "Finite-diff step", 0.5, 0.1, 2, 0.1, "px-equiv"),
      range("scale", "Field scale", 0.002, 0.0005, 0.01, 0.0001, "/px"),
      range("speed", "Advection", 90, 20, 300, 10, "px/s"),
    ],
    tags: ["curl", "noise", "fluid", "divergence-free"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated"],
    demo: "flow-field",
  }),
  M({
    id: "math/procedural-landscape",
    category: "math", subcategory: "procedural",
    name: "Procedural Terrain",
    tagline: "Heightfields carved from stacked noise.",
    description:
      "fBM heightfields rendered as wireframe flyover or shaded relief — terrain that exists only as mathematics.",
    prompt:
      "Generate procedural terrain: height(x,y) = fBM with {oct} octaves, gain {gain}; render as {mode} (retro wireframe flyover scrolling in z, or shaded relief with hypsometric tint and hillshade); moisture field optional (second noise, lower scale) tinting valleys verdant; seed-exposed for reproducibility.",
    implementation: "Wireframe: projected grid rows with painter's order (classic 80s mode); relief: canvas ImageData with normal-dot-light hillshade; flyover = sampling window slides through the field.",
    stack: ["Canvas"],
    params: [
      num("oct", "Octaves", 5, 2, 8, 1),
      range("gain", "Gain", 0.5, 0.3, 0.7, 0.02, ""),
      select("mode", "Render mode", "wireframe flyover", ["wireframe flyover", "shaded relief", "contour lines"]),
      range("speed", "Flyover speed", 30, 0, 120, 5, "units/s"),
    ],
    tags: ["terrain", "heightfield", "landscape", "wireframe"],
    difficulty: "intermediate", perf: "medium", dimension: "both", interactivity: ["animated"],
    demo: "terrain",
  }),
  M({
    id: "math/reaction-diffusion",
    category: "math", subcategory: "procedural",
    name: "Reaction-Diffusion (Gray-Scott)",
    tagline: "Two chemicals negotiating into leopard spots.",
    description:
      "The Gray-Scott model simulates two reacting chemicals on a grid — feed/kill parameters steer between spots, stripes, coral and labyrinth.",
    prompt:
      "Simulate Gray-Scott reaction-diffusion: chemicals U,V diffuse (Du={du}, Dv={dv}) with Laplacian stencil on a {grid}² grid; reaction U·V²; feed F={feed}, kill k={kill} — publish the morphology map honestly: (F≈0.055,k≈0.062) coral, (0.037, 0.06) spots, (0.03, 0.062) maze; iterate {steps} sim-steps/frame; seed disturbances for organic asymmetry; color by V through the brand ramp.",
    implementation: "Typed-array ping-pong buffers, 5-point Laplacian; toroidal wrap optional; render ImageData scaled ×2–3 with smoothing off for cellular honesty; workers for 256²+.",
    stack: ["Canvas", "WebGL (fast path)"],
    params: [
      num("grid", "Grid", 192, 96, 512, 32),
      range("du", "Du", 0.16, 0.1, 0.3, 0.005, ""),
      range("dv", "Dv", 0.08, 0.04, 0.15, 0.002, ""),
      range("feed", "Feed F", 0.055, 0.01, 0.09, 0.001, ""),
      range("kill", "Kill k", 0.062, 0.03, 0.07, 0.0005, ""),
      num("steps", "Steps/frame", 10, 2, 30, 1),
    ],
    tags: ["reaction-diffusion", "gray-scott", "turing", "pattern"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "reaction-diffusion",
  }),

  /* ---------------- F. Mathematical rendering ---------------- */
  M({
    id: "math/sdf",
    category: "math", subcategory: "rendering",
    name: "Signed Distance Fields",
    tagline: "Geometry as one function: distance to the surface.",
    description:
      "SDFs describe shapes as distance functions — compose with min/max/smooth-min, render by marching along rays or by 2D contouring.",
    prompt:
      "Build the hero visual from SDFs: primitives sdSphere/sdBox/sdTorus composed with soft-union (smin k={k}) into a metaball-ish sculpture; in 2D render the field's contour rings every {ring}px (marching-squares brackets at iso=0 crisp-stroked); animate by orbiting primitive centers; explain that SDF composition is how 'morphing objects' are actually built.",
    implementation: "2D: evaluate field on grid → isolines via marching squares or sign-change shading; 3D: sphere-tracing loop capped {steps} steps with ε={eps} hit threshold.",
    stack: ["GLSL", "Canvas"],
    params: [
      range("k", "Smooth union k", 0.4, 0.05, 1.5, 0.05, ""),
      num("ring", "Contour spacing", 18, 4, 60, 2, "px"),
      num("steps", "Max ray steps", 96, 32, 256, 8),
      num("eps", "Hit epsilon", 0.001, 0.0005, 0.01, 0.0005),
    ],
    tags: ["sdf", "distance-field", "smin", "implicit"],
    difficulty: "advanced", perf: "medium", dimension: "both", interactivity: ["animated"],
    demo: "metaballs",
  }),
  M({
    id: "math/ray-marching",
    category: "math", subcategory: "rendering",
    name: "Ray Marching",
    tagline: "Rendering by walking rays through distance fields.",
    description:
      "Sphere tracing: rays advance by the SDF value each step — full 3D renders (soft shadows, AO) from pure math, no meshes.",
    prompt:
      "Render the scene by ray marching SDFs: each pixel's ray steps by the current distance estimate (sphere tracing) up to {steps} steps, hit at |d|<{eps}; shade with gradient normals (tetrahedron technique), one key light with {shadow} soft shadows (secondary march, penumbra k={pkw}), and AO from march iterations; camera orbits slowly; cost discipline: render ≤ 75% DPR with dynamic resolution if frame > 16ms.",
    implementation: "Single fragment pass; field function composed of primitives + repetition via mod-space folding; soft shadow march weighted by k·h/t.",
    stack: ["WebGL", "GLSL"],
    params: [
      num("steps", "Ray steps", 128, 48, 320, 8),
      num("eps", "Hit epsilon", 0.001, 0.0005, 0.005, 0.0005),
      select("shadow", "Shadows", "soft", ["soft", "hard", "none"]),
      range("pkw", "Penumbra k", 8, 2, 24, 1, ""),
    ],
    tags: ["raymarching", "sphere-tracing", "sdf-3d", "shader"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    fallback: "Pre-rendered loop video; never ship ray marching as a full-page background without an adaptive-quality governor.",
    suggests: ["engineering/gpu-budget", "motion/camera-orbit"],
  }),
  M({
    id: "math/metaballs",
    category: "math", subcategory: "rendering",
    name: "Metaballs / Marching Squares",
    tagline: "Blobs merge by field math, not tricks.",
    description:
      "Metaballs render the iso-contour of a scalar field Σ rᵢ²/dᵢ² — true field-based merge in 2D (marching squares) or 3D (marching cubes).",
    prompt:
      "Render metaballs honestly: field(p) = Σᵢ rᵢ²/|p−cᵢ|², iso-contour at {iso} extracted by marching squares on a {grid}px cell grid ({balls} balls orbiting with soft velocity); fill inside-contour with the brand gradient; the CSS goo trick (blur+contrast) is the cheap clone — use this field method when contours must be exact or interactive.",
    implementation: "Grid field evaluation (Uint16 or Float32), marching-squares linear interpolation on edges, canvas path fill; balls integrate with wrap/bounce.",
    stack: ["Canvas"],
    params: [
      num("balls", "Balls", 6, 2, 20, 1),
      range("iso", "Iso threshold", 1, 0.4, 2.4, 0.05, ""),
      num("grid", "Cell grid", 6, 2, 16, 1, "px"),
    ],
    tags: ["metaballs", "marching-squares", "iso", "field"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["animated", "pointer"],
    demo: "metaballs",
  }),
  M({
    id: "math/marching-cubes",
    category: "math", subcategory: "rendering",
    name: "Marching Cubes Isosurfaces",
    tagline: "3D fields triangulated into skin.",
    description:
      "Marching cubes triangulates a 3D scalar field's iso-surface — the 3D honest version of metaballs for fluid blobs at mesh quality.",
    prompt:
      "Extract a 3D isosurface by marching cubes: scalar field (e.g. Σ rᵢ²/dᵢ² or animated noise) on a {res}³ lattice, polygonize cells via the 256-case lookup, normals from field gradient; mesh quality targets {tris}k tris; for hero-level organic blobs with real lighting/reflections this beats vertex-noise hacks.",
    implementation: "Standard MC tables; recompute per frame only for small lattices (≤48³) or use compute path; surface nets alternative for simpler code.",
    stack: ["Three.js", "WebGL"],
    params: [
      num("res", "Lattice", 32, 16, 64, 4),
      num("tris", "Triangle budget", 60, 10, 200, 10, "k"),
    ],
    tags: ["marching-cubes", "isosurface", "3d", "mesh"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    suggests: ["math/metaballs"],
  }),
  M({
    id: "math/volumetric-fog-math",
    category: "math", subcategory: "rendering",
    name: "Volumetric Light (Ray-Sampled)",
    tagline: "God rays computed, not painted.",
    description:
      "Volumetric shafts: rays sampled through a density field accumulate scattering — true god rays through fog and windows.",
    prompt:
      "Render volumetric light: along each pixel's ray, sample the density/occlusion field {samples} times accumulating in-scatter (single-scatter approximation, extinction σ={sigma}); god rays emerge from the geometry itself (light shafts from occluders rotate correctly with the sun); render at 1/2 res upsampled bilaterally for performance.",
    implementation: "Radial-blur cheap alternative exists, but honest path: ray-sample the occlusion map; noise-jitter samples to hide banding; half-res + upscale.",
    stack: ["GLSL", "WebGL"],
    params: [
      num("samples", "Ray samples", 48, 12, 128, 4),
      range("sigma", "Extinction σ", 0.06, 0.01, 0.3, 0.005, ""),
    ],
    tags: ["volumetric", "god-rays", "scattering", "fog"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    fallback: "Static radial-burst gradient in the light direction.",
  }),

  /* ---------------- G. Data & network ---------------- */
  M({
    id: "math/force-graph",
    category: "math", subcategory: "dataviz",
    name: "Force-Directed Graph",
    tagline: "Springs + repulsion = legible networks.",
    description:
      "Force-directed layout lets networks self-organize: nodes repel (Coulomb-ish), links spring — structure emerges without placement.",
    prompt:
      "Visualize the network force-directed: {nodes} nodes repel pairwise (strength {repulse}) while {links} links act as springs (rest {rest}px, stiffness {spring}); velocity decays {damp}; nodes sized by degree or data value with labels at threshold zoom; drag pins nodes; cluster tinting by community (modularity run offline).",
    implementation: "Custom velocity Verlet with Barnes-Hut quadtree for n>300 (or d3-force); canvas render; hover picks nearest node via quadtree too.",
    stack: ["Canvas", "d3-force (optional)"],
    params: [
      num("nodes", "Nodes", 140, 20, 2000, 20),
      num("links", "Links", 220, 20, 4000, 20),
      range("repulse", "Repulsion", 900, 100, 5000, 100, ""),
      num("rest", "Link rest length", 90, 30, 240, 10, "px"),
      range("spring", "Link stiffness", 0.08, 0.01, 0.4, 0.01, ""),
      range("damp", "Velocity decay", 0.6, 0.2, 0.95, 0.02, "/tick"),
    ],
    tags: ["force-directed", "graph", "network", "layout"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["pointer", "animated"],
    demo: "force-graph",
    a11y: "Provide an adjacency-list or tabular representation of the same network data.",
  }),
  M({
    id: "math/vector-field-viz",
    category: "math", subcategory: "dataviz",
    name: "Vector Field Visualization",
    tagline: "Glyph fields and streamlines telling flow truth.",
    description:
      "Visualize 2D vector data (wind, traffic, gradients) via glyph arrows, LIC-style streaks, or advected particle streams.",
    prompt:
      "Visualize the vector field: arrows on a {grid}px grid with length/color keyed to magnitude, plus {streams} animated streamlines (short particle trails following v(p)); divergence/curl tint optional for analytic depth; bind vectors to real data where present (simulated noise field is the presented fallback — label it).",
    implementation: "Canvas glyphs; streamlines via RK2 along field, fixed step; data adapter interface separates field source from renderer.",
    stack: ["Canvas"],
    params: [
      num("grid", "Glyph grid", 40, 16, 80, 4, "px"),
      num("streams", "Stream tracers", 240, 40, 1200, 20),
    ],
    tags: ["vector-field", "streamlines", "wind", "dataviz"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["animated"],
  }),
  M({
    id: "math/heatmap",
    category: "math", subcategory: "dataviz",
    name: "Density Heatmap",
    tagline: "Point masses blurred into truth.",
    description:
      "Kernel-density heatmaps turn point data into continuous intensity fields with honest color ramps and legends.",
    prompt:
      "Render density as a heatmap: each of {points} points splats a gaussian kernel (radius {radius}px) into an accumulation buffer; map values through a perceptually-ordered ramp ({ramp}) with a legend and real value ticks; additive blending in linear space — never map through rainbow/jet (perceptual crime).",
    implementation: "Offscreen accumulation canvas with radial-gradient splats; LUT apply pass; legend with quantile ticks from the actual data.",
    stack: ["Canvas"],
    params: [
      num("points", "Data points", 4000, 100, 50000, 100),
      num("radius", "Kernel radius", 28, 6, 80, 2, "px"),
      select("ramp", "Color ramp", "viridis-like", ["viridis-like", "magma-like", "mono heat"]),
    ],
    tags: ["heatmap", "density", "kernel", "dataviz"],
    difficulty: "intermediate", perf: "medium", dimension: "2d", interactivity: ["static", "animated"],
    a11y: "Ramp accompanied by value legend; data table alternative linked.",
  }),
  M({
    id: "math/phyllotaxis",
    category: "math", subcategory: "parametric",
    name: "Phyllotaxis Sunflower",
    tagline: "137.5077° between seeds: nature's packing.",
    description:
      "Fermat spiral phyllotaxis: point n sits at angle n·137.5077°, radius c·√n — the sunflower pattern that packs without gaps.",
    prompt:
      "Render phyllotaxis: for n∈[0,{count}), position r=c·√n, θ=n·{angle}° (golden = 137.5077°); dot size tapers by √n zone; animate the angle drifting around {angle}±1.5° to show how irrationality prevents spokes (visible integers make spokes, golden angle never) — that comparison IS the product story.",
    implementation: "Canvas dots; per-frame angle offset animation; count scaled to area; color ramp by n.",
    stack: ["Canvas"],
    params: [
      num("count", "Seeds", 800, 100, 5000, 50),
      range("angle", "Divergence angle", 137.5077, 136, 139, 0.001, "°"),
    ],
    tags: ["phyllotaxis", "golden-angle", "sunflower", "packing"],
    difficulty: "beginner", perf: "light", dimension: "2d", interactivity: ["animated"],
    demo: "phyllotaxis",
  }),
];
