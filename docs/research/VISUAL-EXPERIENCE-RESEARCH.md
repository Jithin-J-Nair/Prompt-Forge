# Visual Experience Research — Round 2 (2026-11-11)

Scope: visual execution and interaction evidence from Awwwards collections (WebGL, experimental,
animation, web-interactive), Codrops, Motion.dev, and the technical references consulted in round 1
(GSAP ScrollTrigger docs, Book of Shaders, MDN WebGL/WebGPU). Source names appear here for
attribution only; nothing below is copied, and no external brand names are used in the product.

## What the current SOTD-level sites actually do (Awwwards WebGL/Experimental lists, Nov 2026)

Evidence from the live index pages (title/thumbnail-level observation of ~30 listed sites, incl.
Nov 10–11, 2026 SOTD winners — Active Theory's "Cyera AI Guardian", "Creative Reference Library"):

1. **WebGL is ambient, not ornamental on rails**. Winning sites run a coherent 3D/shader *scene*
   (product object, environment, particle matter) with camera or pointer coupling — not
   decorative loops bolted onto a grid of cards. Decision: our hero runs ONE coherent live
   canvas system (cursor-reactive domain-warped particle field) with DPR cap, IO pause,
   reduced-motion still.
2. **Typography is the interface**. Thumbnail evidence + Codrops features (kinetic type with GSAP,
   arc-curved project carousels) confirm: monumental variable-font display, character/word
   staggers, text-as-navigation. Decision: hero headline uses mask-reveal character stagger with
   weight variation on hover; section numbering as design furniture (01/…09).
3. **Portfolios present work as spatial sequences** (curved rails, arc carousels — e.g. Codrops'
   featured Mathias Adolfsson arc). Decision: the Studio's discovery canvas and the preset strip
   use denser, spatially-varied compositions instead of uniform cards only (asymmetric lead tile).
4. **Restraint pattern**: winners have exactly one signature heavy effect; supporting motion is
   fast (150–600ms) and physical (springs). Decision: enforce performance budgets in the renderer
   registry (perfClass per preview, hover-only animation in cards).
5. **Utility chrome stays invisible**: mono eyebrow labels, hairline separators, no tint-heavy
   cards. Decision: keep obsidian/forge palette; introduce spectral sheen as the one material
   accent (thin iridescent gradients on selection states, borders).

## Motion.dev (evidence from live homepage)

- Springs ship velocity continuity as the core narrative (stiffness/damping/mass sliders on the
  page itself, pointer-follow demo). Decision: our preview cards' hover translation uses spring
  physics constants; sliders in labs already expose stiffness/damping — good convergence.
- Motion.dev demo tiles are laser-focused single-mechanism canvases with ONE code snippet and
  minimal chrome. Decision: module previews must be similarly "one mechanism, honest frame" —
  which our tile format already matches; cards get canvas-first previews.
- Scroll section uses `ScrollTimeline` where supported. Decision: keep IntersectionObserver
  reveals (broad support), note native scroll-timeline upgrade path.

## Codrops (current front page)

- Kinetic typography with GSAP trails; puppet-line figure (points+lines character); mineral
  textures on light grids. Signals: playful physics + editorial textures are converging.
  Decision: labs remain the "playground" surface; studio previews inherit their renderers.

## Technical references (round-1 carryover, re-verified)

- Book of Shaders patterns (fBM, domain warp IQ form, SDF raymarch, plasma) are implemented as
  the GLSL source strings in the WebGL preview renderer — real compiled shaders, executes in the
  browser, labeled by technique.
- MDN WebGL: context loss handling via `webglcontextlost` → renderer marks fallback state.

## Resulting creative direction (established)

**"The Forge Observatory"** — PromptForge as a precision instrument for composing visual
craft. Obsidian ground, forge-fire accents (ember/flare/blood), ivory text, spectral-iridescent
sheen reserved for "live" surfaces (previews, selections, compose states). Typography: Space
Grotesk Variable display (weight axis 300–700), Instrument Serif italic for editorial counterpoint,
JetBrains Mono for technical furniture. Layout: editorial numbering, hairline rules, asymmetric
feature tiles; motion is fast-physical (springs ≤ 600ms) with ONE ambient live canvas per page max.
Previews are the identity: every module card IS a tiny rendered artifact of what it compiles.

## Round 3 — ECC skill distillation (2026-11-11)

Skills audited from affaan-m/ECC: `frontend-design-direction`, `motion-foundations`, `motion-patterns`, `make-interfaces-feel-better`, `taste`, `liquid-glass-design`.

**Adopted contracts:**
- **Motion tokens are law** — `src/lib/motion/tokens.ts` owns every duration/easing/distance/scale + 5 named springs; components import, never invent. Staggers 50–100ms. Exits shorter than entrances (150ms). Transform+opacity only.
- **Direction: forge-industrial editorial** — one warm light (ember) in a black void; grain + blueprint grid; mono instrument labels; serif italics for accent. No purple-gradient slop, no decorative blobs, no card-in-card.
- **Design-craft pass** — `-moz-osx-font-smoothing`, ember `:focus-visible` ring, `text-wrap: balance/pretty`, `.tabular` numerics, `.press` tactile scale(0.96), `.glass` floating chrome, concentric radii tokens, `.glint` ember sheen, image edge outlines.
- **Taste grammar applied to the hero** — one ember "divine flash" bloom at load, spring-staggered glyph reveal (blur→sharp, skew→0), calm scroll-cue line; one accent color in the frame.
