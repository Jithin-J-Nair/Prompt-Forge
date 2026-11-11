# Labs Architecture — Motion Lab & Math Lab

## Purpose

The labs exist to keep the knowledge base honest: every motion/math module that references a
`demo` id has a **real implementation running on the page** — canvas 2D engines, real DOM/SVG/CSS
mechanics — not screenshots, iframes of third parties, or stock videos. The registry test suite
asserts that every referenced demo id is registered.

## Shared shell (`components/labs/lab-shell.tsx`)

Every canvas demo runs through one host hook:

- **`useCanvas(ref, draw, opts, deps)`** — owns the rAF loop; each frame the draw callback
  receives `{ ctx, w, h, t, dpr, pointer {x,y,vx,vy,inside}, reduced }`.
- **DPR capped at 2**; transform preset so draws are in CSS pixels.
- **`ResizeObserver`** on the canvas handles responsive tile sizes — no canvases sized at mount
  time and forgotten.
- **`IntersectionObserver` pause** — offscreen tiles cost zero GPU/CPU.
- **Reduced-motion protocol**: when `prefers-reduced-motion: reduce`, the loop renders a
  representative ~1.6s frame then **cancels itself**; DOM demos switch to their static variant
  via the `useReducedMotion` hook (e.g. scramble prints instantly — enforced in tests of intent,
  visible in the DOM demos' code paths).
- **Pointer plumbing** mirrors what the real modules compile into prompts (pointer velocity for
  repulsion shaders etc.).

Shared deterministic math (`mulberry32` PRNG, gradient `value noise`, `fbm(octaves, gain=0.5,
lacunarity=2)`) keeps the labs in exact correspondence with the specs the compiler emits —
the demo of fBM **is** the fBM the module describes: same constants.

## Demo inventory (58 keys)

### Motion Lab (35 tiles, 5 groups)
Typography in Motion — scramble (grapheme-safe reveal on click), char stagger (overflow-mask
rise), gradient sweep (`background-clip: text`, real keyframes), text-on-path (SMIL
`startOffset` animation), marquee (content-doubling translate −50%).
Scroll Choreography — scroll reveal (IntersectionObserver in an embedded scrollport), scrub
(progress-bound ring/fill), sticky pin with stage swap, three-factor parallax (0.28/0.55/1.0),
scroll-spy (section ownership ≥ 50%).
Cursor & Physics — dual-layer cursor (two follow constants), magnetic pull (radial falloff +
spring-back), spotlight (CSS-var radial), cursor-chasing preview, 3D tilt (rotateX/Y + glare),
**spring follow (real k/c integration)**, drag-throw-bounce (pointer-captured inertia, wall
restitution 0.6), gravity float, **verlet rope** (constraint relaxation ×3, gravity).
Particles — field (respawn/shimmer), network (O(n²) links, distance-fade, pointer repulsion),
image particles (offscreen rasterization → pixel sampling → spring homing + pointer shatter).
Masks & Texture — clip inset mask reveal, SVG `pathLength` self-draw with `animateMotion` pen,
noise-modulated blob (Catmull-Rom → cubic Bézier), scanline displacement (labeled *illustrative*
approximation of the GLSL version), mesh gradient (additive radial fields), aurora (conic
curtains, blur, screen blend), **procedural film grain** (12fps regenerated tiles, overlay
composite), halftone from a live source field, **Bayer 4×4 ordered dithering**, Perlin marble
(`sin(π(x + fbm·k))` turbulence), count-up with ease-out cubic + `Intl.NumberFormat` +
tabular-nums, staggered menu overlay, micro-interaction set (press states, ping burst, live dot).

### Math Lab (23 tiles, 6 groups)
Parametric — **Lissajous** (a/b sliders, pen + trail), **Fourier epicycles** (square/sawthooth
coefficient stacks, n-term slider, orthographic wave trace), **Maurer/polar rose** (r=cos(kθ),
chord caustics).
Computational geometry — **Voronoi** (brute-force nearest-seed at 72×46 samples + edge pass,
jittered seeds, two render modes), **metaballs** (field Σ r²/d² + marching-squares isolines with
linear interpolation at iso 1).
Fractals — **Julia** (per-pixel escape iteration, smooth coloring ν = i + 1 − log₂(log₂|z|),
pointer-morphable c), **Sierpinski chaos game** (20k points/frame, rotating), recursive fractal
tree (depth/angle sliders, Perlin wind gusts).
Dynamical systems — **Lorenz** (RK4 at h=0.01 ×5 substeps, σ=10, β=8/3, ρ slider), **boids**
(separation/alignment/cohesion, predator pointer), **force-directed graph** (repulsion +
spring edges + centering, damped).
Procedural fields — value noise, **fBM with octave slider**, **IQ domain warping**
f(p+fbm(p+fbm(p))), perspective terrain flyover, **Gray–Scott reaction-diffusion** (feed 0.055 /
kill 0.062, 6 substeps), **flow-field** advection particle streaks.
Distribution & ambient — **phyllotaxis** (golden angle 137.5077°, n slider, parastichy emergence),
wave interference field, demo-scene plasma, 3D projection starfield (pointer drift), cursor-linked
constellation, reusable shader field.

## Where illustrative labeling applies

Exactly one tile — *Scanline Displacement* — is a 2D-canvas analog of a shader technique (real
GL displacement belongs to the WebGL modules, which the studio doesn't execute in-browser); its
note says so explicitly. All other 57 tiles implement their named algorithm.

## Performance envelope

All tiles run at 60fps on the reference mid-tier laptop in this environment's browser class:
worst offending tiles (Voronoi, metaballs, plasma, marble) sample at coarse grids
(72–110 columns) and upscale-fill rectangles; Julia rasterizes 360×225 at ≤ 200 iterations.
Adaptive-density discipline from `engineering/adaptive-particles` is modeled by every particle
demo exposing a count slider bounded sanely.
