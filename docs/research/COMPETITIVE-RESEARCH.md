# PromptForge — Competitive & Creative-Technology Research

**Research date:** 2026-11-11
**Researcher role:** Lead Agent (competitive research + creative technology)
**Status:** Complete — used as the foundation of the Visual Prompt Studio taxonomy and compiler.

> Method note: this document records *actually inspected* sources (fetched during the
> build session via web research tooling). Where a claim about implementation
> technology could not be verified from the page itself, it is marked **[inferred]**.

---

## 1. Platforms studied

| Platform | URLs investigated | What was extracted |
| --- | --- | --- |
| GetLayers | `getlayers.ai`, `/templates`, `/docs`, `/backgrounds`, `/pricing` | Product model, library taxonomy, live-tuning UX, MCP integration, prompt vs. source-file strategy |
| MotionSites | `motionsites.ai` (homepage via mirrors/reviews), GitHub prompt-library mirror, third-party reviews (stork.ai, chatgate.ai, moge.ai) | Prompt gallery structure, categories, sample prompt anatomy, pricing/gating model, MCP |
| Awwwards ecosystem | awwwards.com categories (via research aggregations of winners), plus winner analyses (Lando Norris, Messenger, Bruno Simon, Scout Motors, Jeton, Stripe, Active Theory) | Winning patterns, judging criteria, technology stacks, 2025–2026 trend data |
| GSAP | gsap.com docs / ScrollTrigger skill docs | Scrub, pinning, containerAnimation, SplitText accessibility pattern |
| Book of Shaders | thebookofshaders.com/13 (fBM) | fBM, domain warping, turbulence formulas |
| Three.js / R3F / WebGL / WebGPU | threejs.org, r3f.docs.pmnd.rs, MDN WebGL/WebGPU (via research aggregation) | Stack roles, WebGPU-in-Three r171+, post-processing chains |
| Generative art galleries | aljazfrancic/generative-art-gallery (p5.js), salvadorurena/generative-playground, vladfa2010/GenerativeLab | Correct param surface per algorithm (Lissajous freqX/freqY/phase, Gray-Scott feed/kill, etc.) |
| Codrops/tympanus, motion.dev, p5.js, Rive, Lottie, Shadertoy | inventoried as technology references | Role mapping for the implementation stack |

---

## 2. GetLayers — findings (Primary Reference 01-class: visual library product)

### 2.1 Product model
GetLayers sells **"layers"** — templates, 3D scenes, sections, backgrounds, gradients —
each copyable as **one prompt** that you paste into Claude Code / Cursor. Key facts
verified from the site and docs:

- The library is organised into five parallel collections: **Templates**
  (59 at inspection, e.g. Lumière, Relay, Laocoon, Baseline, AI Studio, Artefakt),
  **3D Scenes** (e.g. Orb Studio, Refract, "Dither Art"), **Sections** (e.g. Text
  Animations, Image Motion, SVG-to-3D), **Backgrounds** (530 at inspection —
  Metal Human, Purple Desert, Moon Walk, Zen Arch Waterfall, Moss Glass Bubbles),
  and **Gradients** (e.g. Liquid Colour).
- **Live tuning before copy**: scenes and gradients are tunable in the browser, so
  *"the prompt already carries your values"* — the parameter state is baked into the
  copied prompt. This is the single most important UX insight for PromptForge.
- **One search across everything** — library-level unified search w/ favourites.
- **Prompts vs source files**: every layer has a prompt; source (Next.js / standalone
  HTML / video file) is a paid tier. Backgrounds are **video loops**, and the prompt
  *links the video* so the AI embeds the video instead of regenerating one.
- **MCP server**: agents search, preview and pull layers directly.
- **Figma plugin**: templates land as real editable frames (desktop/tablet/phone).
- Fair-use rate limits per day per asset type; weekly drops ("new layers weekly").

### 2.2 GetLayers template examples examined (via public listings)
1. **Lumière** — E-commerce template (~328 elements).
2. **Relay** — SaaS template with device-responsive preview (desktop/laptop/phone).
3. **AI Studio** — AI/Tech template.
4. **Laocoon** — free Portfolio template.
5. **Baseline** — free Sports/Education template.
6. **Orb Studio** — 3D scene (orb-based hero composition).
7. **Refract** — 3D scene (refraction material play) **[inferred: glass/refraction shader]**.
8. **Dither Art** — background (ordered-dither shader aesthetic).
9. **Metal Human** — free background (metallic humanoid video loop).
10. **Purple Desert** — free landscape background.
11. **Moon Walk** — cosmic background.
12. **Liquid Colour** — interactive gradient.
13. **Text Animations / Image Motion / SVG to 3D** — section collections.

### 2.3 What PromptForge takes from GetLayers
- A module is worth more than a keyword: **preview + parameters + prompt fragment**.
- Parameter state must flow into the compiled prompt (tune → copy carries values).
- Unified search across categories with favourites.
- Layered taxonomy (type → collection → item) rather than a flat list.
- PromptForge divergence (original): we are **technique-first, not asset-first**.
  Our modules encode *how an effect is built* (algorithm, parameters, fallbacks,
  accessibility), not links to proprietary videos. Everything is original content.

---

## 3. MotionSites — findings (Primary Reference 02-class: prompt library product)

### 3.1 Library structure (verified via GitHub mirror + reviews)
- 350–500+ prompts; categories observed: Agency, SaaS, Portfolio, Landing Page,
  Hero Section, Fintech, Web3, Automotive, Presentations, Component.
- Named prompts inspected in listings: 3D Jack Portfolio, AI Automation Hero,
  AKOR Security, Apex SaaS, ClearInvoice SaaS Hero, Crypto Wealth, Dark Portfolio
  Hero, Datacore SaaS Hero, Framelix 3D Studios, Glassmorphism Agency Hero, Liquid
  Glass Agency, Loader Animation, Mindloop, NOVA Space Systems, NeoVision, New Era
  Automotive Hero, Nike Pro Landing, Orbit Web3, Planet Orbit, Space Voyage, Synapse
  Dark Hero, Terra Geo Map, Veloce Finance, Viktor Portfolio, Yacht Club.
- 159+ looping **animated video backgrounds**; 100+ "3D website" prompts; 40+ Lovable
  templates; MCP server (`claude mcp add`) included in paid plans; free tier = 3 prompts.
- Target builders named in its FAQ: Lovable, Cursor, Bolt, Claude, v0, Replit.

### 3.2 Prompt anatomy (verified from a publicly mirrored example)
A MotionSites prompt is **not** a mood paragraph. It is a structured spec covering:
framework (React) + styling (Tailwind v4) + exact hero dimensions + background video
behaviour + typography + hover states + badge treatment + **motion details**. Vague
prompts ("make it pop") produce generic output; technically detailed motion specs
(name the easing, duration, trigger, transform) produce distinctive output.

### 3.3 MotionSites examples examined (14+ categories × named items)
Representative sample: **Glassmorphism Agency Hero**, **Liquid Glass Agency**
(glass morphism + liquid gradients pattern), **Loader Animation** (component-level
motion), **New Era Automotive Hero** (automotive 3D hero), **Planet Orbit** /
**Space Voyage** (space-themed 3D SaaS), **Crypto Wealth** / **Veloce Finance**
(fintech motion), **Viktor Portfolio** / **Dark Portfolio Hero** (portfolio heroes).

### 3.4 What PromptForge takes from MotionSites
- Motion must be specified as *parameterised engineering* (duration, easing, trigger,
  transform), which became our typed parameter schema.
- Gallery → prompt entry-point flow is proven; we extend it with **composability**
  (MotionSites prompts are monolithic; ours are independently selectable modules
  resolved by a compatibility-aware compiler).
- Categories by website type are the primary mental model of buyers → our Category 01.

---

## 4. Awwwards winners — findings (Primary Reference 03-class: experience quality bar)

### 4.1 Winner autopsies (verified via aggregated winner analyses)
1. **Lando Norris (SOTY 2025, OFF+BRAND)** — Webflow foundation + WebGL 3D rotating
   helmet + Rive motion graphics + GSAP scroll-driven cinematic sequences + full-bleed
   video; lime-on-dark palette. *Pattern: scroll-controlled narrative with 3D hero.*
2. **Messenger (Developer SOTY 2025)** — a miniature real-time 3D planet in WebGL;
   physics, lighting, animation; "gamification of the web experience". *Pattern:
   site as playable scene, not document.*
3. **Bruno Simon Portfolio (SOTM Jan 2026)** — navigation replaced by a drivable 3D
   vehicle in a virtual world. *Pattern: interaction IS the IA.*
4. **Scout Motors (E-commerce SOTY)** — product configurator + heritage storytelling +
   checkout fused into one continuous scroll journey.
5. **Jeton (fintech SOTD)** — serious fintech UX + scroll motion + a *fully morphing*
   desktop→mobile experience (mobile is redesigned, not shrunk).
6. **Stripe (multiple honours)** — animated gradient hero; every micro-interaction
   considered; code examples as content.
7. **Active Theory** — WebGL experiences as art installations; particle systems and
   real-time rendering.
8. **Tore S. Bentsen** — parallax-driven interactive branding portfolio.

### 4.2 Judging & stack data (aggregated, marked where approximate)
- 2025 SOTD winners: ~41% "immersive 3D", 34% flat/traditional, 25% hybrid;
  dominant 3D framework: Three.js **[aggregated estimate]**.
- Consistent winning stack: **Three.js + GSAP ScrollTrigger** for timelines, custom
  post-processing passes (bloom, grade, vignette), camera spline paths driven by
  scroll, pre-computed heavy work (instancing, texture atlases, baked shadow maps) so
  scroll playback only updates uniforms.
- Judges penalise frame drops during scroll; winning sites keep 60fps on mid-range
  hardware and degrade gracefully (functional fallback on low-power devices).
- Typography: variable fonts dominant (PP Neue Montreal, ABC Diatype, GT Flexa;
  serif: GT Sectra, Editorial New); `font-variation-settings` animated on hover/scroll.
- Page transitions: native **View Transitions API** (scoped `element.startViewTransition`,
  `view-transition-class`) rising; Barba.js + GSAP (~7KB) still common for MPA.
- **Lenis** (~2KB) replaced Locomotive Scroll as the standard smooth-scroll library.
- CSS Scroll-Driven Animations API (`animation-timeline: scroll()/view()`) runs off
  the main thread; Chrome 115+, Interop 2026 target.
- Trend counter-current: organic shapes, anti-grid, grain/noise overlays — increasingly
  *procedural, animated* grain via Canvas/WebGL instead of static PNG overlays.

### 4.3 What PromptForge takes from Awwwards
- Every motion/graphics module states **what actually renders** and its cost model.
- "One signature interaction" beats ten decorations → our compiler warns when the
  selection count in heavy categories exceeds budget.
- Graceful degradation is a judging criterion → first-class **fallback** and
  **reduced-motion** fields in every module, surfaced in the compiled prompt.
- Mobile is redesigned, not responsive-shrunk → responsive behaviour per module.

---

## 5. Creative-technology reference findings

### 5.1 GSAP / ScrollTrigger (verified from official skill docs)
- `scrub: true|number` binds tween progress to scroll; numeric scrub adds
  catch-up lag (0.5–1 reads "luxurious", >1.5 risks frustration).
- **Pinning**: `pin: true` with `end: "+=1000"`; `pinSpacing` default true preserves
  layout. Pinned section DOM height must be defined explicitly for sequences.
- **Horizontal scroll** pattern: pin the wrapper, tween inner `x` with `ease: "none"`,
  `end` = scrollWidth − viewport; nested triggers use `containerAnimation`.
- **SplitText** character reveals: stagger opacity+y with scrub 0.5; parent gets
  `aria-label`, split children `aria-hidden="true"` (we encode this as the standard
  accessibility note in all text-splitting modules).
- React: `useGSAP()` or `gsap.context()` cleanup; never `scrub` + `toggleActions`
  on the same trigger.

### 5.2 Shaders / procedural graphics (Book of Shaders + SDF practice notes)
- **fBM**: octave stacking — value `+= amplitude * noise(st)`, `st *= 2`
  (lacunarity), `amplitude *= gain` (usually 0.5). Turbulence = fBM over `abs()` of
  signed noise → sharp valleys.
- **Domain warping** (Quilez): `f(p) = fbm(p + fbm(p + fbm(p)))`; warp amplitude
  raises effective Lipschitz constant → ray-march steps must shrink.
- **Voronoi** in shaders = hash-labelled nearest-neighbour points; yields cells,
  crystal, shatter patterns for sci-fi UI.
- **Marble** = `sin(x + fbm(p) * strength)`.
- **Ray marching cost model**: fragment shader runs per-pixel; fullscreen 1080p ≈ 2M
  invocations; cap raymarch steps, hoist invariants, prefer `smoothstep` over
  branches, use bounding volumes/detail SDF switches. Displacement amplitude must
  stay below Lipschitz headroom or rays tunnel.
- **SDF composition**: `min` union / `max` intersection / smooth-min blends;
  primitives (sphere, capsule, box, torus) + repetition (`mod`) + space folding.

### 5.3 Generative mathematics (verified parameter surfaces from OSS galleries)
- **Lissajous**: `x = A·sin(a·t + δ)`, `y = B·sin(b·t)` — params (a, b, δ, trail).
- **Fourier epicycles**: harmonic count drives square/triangle-wave tracing.
- **Gray-Scott reaction–diffusion**: `feed`/`kill`/(steps) drive morphology
  (coral, spots, labyrinth); standard Du/Dv = 0.16/0.08 with Laplacian diffusion.
- **Lorenz attractor**: `dx=σ(y−x), dy=x(ρ−z)−y, dz=xy−βz`, σ=10, ρ=28, β=8/3.
- **Julia/Mandelbrot**: `z ← z² + c`, escape radius 2, iteration cap for colouring.
- **Flow fields**: particles advected by Perlin/curl noise angle field, trails via
  destination-out fade.
- **Voronoi (canvas)**: exact cells via half-plane clipping or pixel-nearest-seed
  rasterisation; Delaunay = dual triangulation.
- **Fractal trees / L-systems**: recursive branching angle/length decay + wind sway.
- **Phyllotaxis**: golden-angle (137.5077°) spiral dot fields.
- **Cellular automata**: Life / HighLife / Day&Night rule variants on toroidal grid.
- **Boids**: separation/alignment/cohesion steering.
- **Metaballs**: iso-contour of `Σ rᵢ²/dᵢ²` field (marching squares) or CSS
  blur+contrast goo trick for DOM-only.

### 5.4 Technology role map (what to use when — encoded into module `stack` fields)
| Need | Right tool | Avoid |
| --- | --- | --- |
| Scroll choreography | GSAP ScrollTrigger / CSS scroll-timeline | scroll listeners mutating layout |
| Physics-feel micro-interactions | Framer Motion springs | linear CSS transitions |
| Continuous loops / marquees | Pure CSS keyframes | JS-driven per-frame DOM writes |
| 2D generative art | Canvas 2D | DOM nodes per particle |
| Heavy 2D particle/image FX | WebGL fragment shader (Three/R3F) | Canvas per-pixel CPU at full res |
| 3D scenes | Three.js / React Three Fiber | CSS 3D transforms for real scenes |
| Post-processing | EffectComposer (bloom/DoF/grain) | stacked CSS filters over fullscreen video |
| UI animation | framer-motion / motion.dev | GSAP for React state micro-interactions |
| Characterful UI-mascot animation | Rive / Lottie (JSON) | hand-rolled sprite sequences |
| Smooth scrolling | Lenis | Locomotive Scroll (deprecated) |
| Audio-reactive | WebAudio AnalyserNode → uniform | per-sample DOM updates |

---

## 6. Missing features in pre-transformation PromptForge (gap analysis)

1. Library was a single free-text input → **no explorable knowledge base**.
2. No categories/subcategories, no search, no filters, no tags, no synonyms.
3. No parameter system — motion/intensity not user-controllable.
4. No compatibility awareness (conflicting styles could be combined silently).
5. No presets, no favourites, no recent, no undo.
6. No real demos — nothing showing what an effect actually does.
7. No motion lab, no mathematical graphics, no 3D/shader treatment.
8. No compile-time conflict reporting, no multi-format export.
9. Saved specs were globally listed with no ownership isolation.
10. No automated tests at all; build depended on runtime Google Fonts fetch.

---

## 7. Original ideas implemented in PromptForge (beyond the references)

1. **Technique-first knowledge modules** — every module carries algorithm, typed
   parameters, fallbacks, a11y, difficulty, and a prompt fragment with token
   interpolation; not a link to an asset.
2. **Compatibility-aware compiler** — conflicts/suggestions are *resolved and
   explained* in the output instead of silently merged or dropped.
3. **Sectioned studio prompt** — the compiler emits an implementation-ready brief
   (17 sections) with an explicit "avoid" list derived from conflicts.
4. **Live Math Lab with real algorithms** — Lissajous, Fourier epicycles, exact
   Voronoi (half-plane clipping), Julia, Lorenz RK4, flow field, phyllotaxis,
   Sierpinski, metaball fields — all computed correctly in-canvas.
5. **Motion Lab with honest controls** — every parameter actually drives the demo
   via CSS variables / rAF, with reduced-motion collapse.
6. **Offline-first persistence** — compositions persist to Postgres when configured
   with owner isolation, and degrade to a documented in-memory store otherwise.

---

## 8. Uncertainties and honest limitations

- Exact implementation stacks of individual GetLayers/MotionSites items are
  **[inferred]** from category pages; proprietary prompt text was never copied.
- Awwwards percentage data (41% immersive etc.) comes from an aggregated industry
  analysis, not an official Awwwards report — treated as directional.
- Some reference sites sit behind sign-in walls (MotionSites full prompts,
  GetLayers premium); only public listings/docs were used. All PromptForge module
  content written for this project is original.

## 9. Source list

- getlayers.ai — `/`, `/templates`, `/docs`, `/backgrounds`, `/pricing` (fetched 2026-11-11).
- motionsites.ai — via GitHub mirror `TheSatyam-Singh/motionsites.ai`, stork.ai review, chatgate.ai launch analysis, moge.ai product page, craftwork.design listing.
- Awwwards winner analyses — coroboros/research "Award-Winning Websites 2025–2030", digitalstrategyforce.com immersive-2026 analysis, sliderrevolution.com award examples, spinxdigital.com "Best Website Designs 2026", ezeegrowth.com top-10 2026.
- GSAP — greensock/gsap-skills ScrollTrigger SKILL.md; genosapp.com scroll-animation guide.
- Shaders — thebookofshaders.com/13; jeromem.dev ray-marching notes; devtools.tools fragment-shader essay.
- Generative — aljazfrancic/generative-art-gallery; salvadorurena/generative-playground; vladfa2010/GenerativeLab.
