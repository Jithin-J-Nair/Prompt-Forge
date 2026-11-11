# PromptForge redesign — execution record

**Working branch:** `codex/promptforge-redesign`  
**Starting point:** `arena/74dc3801-prompt-forge` at `cc2b2b59d76059be522359e96d642f334ec28da5`  
**Scope:** Product architecture, prompt creation UX, visual system, compiler correctness, shared-stack data integrity and verification.

## What changed in this pass

### Product experience
- [x] Added a dedicated `/forge` workbench with two clear paths: Quick Prompt and Mega Prompt.
- [x] Preserved the original deterministic twelve-section generator and library persistence at `/enhance`; legacy `/forge?q=` links redirect to it.
- [x] Quick Prompt produces a concise, copy-ready instruction from one brief.
- [x] Mega Prompt combines the brief, audience, project name, target environment, depth, typed modules and curated micro-directives.
- [x] Added category-level add/remove, select-all, clear-stack and keyword search controls.
- [x] Added one-click copy for each individual creative directive; module-backed cards copy a compiled, parameterized module prompt.
- [x] Added search and a real empty state to the curated-build gallery.
- [x] Replaced the fake Popular tab and local-only vote counters with Featured, Recent and All.
- [x] Replaced placeholder social proof with factual layer counts.
- [x] Added mobile primary navigation action, keyboard-operable mobile menu with focus trapping/restoration, and a global skip link target.

### Compiler and data integrity
- [x] Unified Forge, the stack tray and artifact detail around the same mega-prompt compiler.
- [x] Preserved tuned Studio parameter overrides when modules are added to the shared stack.
- [x] Carried parameter overrides through compilation, local persistence and share URLs.
- [x] Changed share links to versioned stable keyword IDs; legacy base36 links still decode.
- [x] Added explicit unresolved-selection reporting instead of silently dropping unknown keyword IDs.
- [x] Added tests for Quick/Mega output, typed modules, micro-directives, tuned parameters, unknown IDs and stable share links.

### Visual system and accessibility
- [x] Shifted the interface from generic violet/cyan SaaS styling to ink/charcoal, warm neutral text and restrained chartreuse.
- [x] Removed decorative blurred orbs, gradient text, glass blur and colored glow halos from the main visual system.
- [x] Added focus-visible outlines, touch-action behavior, dark color-scheme and reduced decorative motion.
- [x] Added labeled, named inputs with autocomplete disabled, mobile-readable text sizes, inline brief validation and Cmd/Ctrl+Enter behavior.
- [x] Added empty states and confirmation before clearing the full stack.
- [x] Added main landmarks and skip-link targets across routes.
- [x] Added content-visibility hints to the large lexicon card list.

### Project governance
- [x] Added root `AGENTS.md` with product, design, accessibility, compiler and verification rules.
- [x] Updated README to explain the two prompt-creation modes.
- [x] Added GitHub Actions CI for install, lint, typecheck, unit tests and production build.
- [x] Added this execution record.

## Skills reviewed and applied selectively

The relevant checked-in skill set was read: `design-taste-frontend`, `frontend-design`, `hallmark`, `impeccable`, `ui-ux-pro-max`, `improve-ui`, `web-design-guidelines`, `fixing-motion-performance`, the GSAP performance/React/ScrollTrigger/timeline guidance, and the website-cloning workflow.

Application notes:
- The app is an interactive prompt workbench, so the Operate/tool-UI guidance was prioritized over portfolio-style animation recipes.
- The Impeccable craft-floor and Hallmark gates informed the removal of generic eyebrow copy, gradient text, glass blur, ambient orbs and gratuitous glow.
- UI/UX and web-interface guidance informed labeled inputs, 16px mobile text, visible focus, touch targets, semantic navigation, keyboard shortcuts and empty/error states.
- Motion guidance was applied as restraint and performance hygiene. GSAP was not added because this pass did not require a new scroll-animation system and the project already uses Framer Motion.
- `improve-ui` is audit-only/read-only and was not treated as permission to edit product source.
- The `design-taste-frontend` app-screen reference file mentioned by its own instructions is absent from the checked-in skill bundle. No contents were invented to fill that gap.

## Competitive research and product translation

The research was used to extract workflows, not to copy a competitor's visual identity.

- **MotionSites:** a searchable prompt gallery with Featured/Popular/Recent sorting, category filters (including hero, landing page, SaaS, 3D, portfolio and agency) and copy-ready prompt cards. PromptForge now has a searchable curated-build gallery, category selection and individual directive copy. A true Popular ranking is intentionally deferred until votes are persisted and abuse-protected.
- **GetLayers:** separates templates, 3D scenes, sections, backgrounds and gradients; supports real sandboxed Three.js previews, color/parameter controls, presets, copy-prompt and copy-prompt-plus-UI workflows, favourites and source downloads. PromptForge has typed modules, parameter controls, preview families and parameter-aware copying, but still lacks full-scene sandbox previews, UI-over-scene composition, persisted presets/favourites and source-code downloads.
- **Awwwards-style quality:** the mega-prompt now asks the implementation agent to self-audit Design (40%), Usability (30%), Creativity (20%) and Content (10%) with evidence, rather than promising an award or inventing a score.

Reference pages: [MotionSites](https://motionsites.ai/), [GetLayers scene library](https://www.getlayers.ai/layer/blob), [GetLayers preview workflow](https://www.getlayers.ai/layer/pinwheel-galaxy), [Awwwards evaluation overview](https://www.awwwards.com/about-evaluation/).

## Verification status — not yet complete

- [ ] GitHub Actions CI result observed and green.
- [ ] Production build independently verified.
- [ ] Browser screenshots captured at 1440×900, 1024×768 and 390×844.
- [ ] Keyboard, focus, reduced-motion and mobile menu behavior verified in a real browser.
- [ ] Console, network and runtime errors checked.
- [ ] Performance and accessibility measurements recorded.

Source edits and test additions are not evidence that those checks passed. Do not claim visual completion or award-level quality until rendered evidence exists.

## Remaining product work

### Critical
- [ ] Run CI and repair any type, lint, test or build failures.
- [ ] Complete browser-based visual and interaction verification.
- [ ] Review composition API ownership/authentication. Current public endpoints need a real identity/authorization model before private user compositions are safe.
- [ ] Build full composite previews for named artifacts. A single technique preview is not a complete website preview.

### High value
- [ ] Expand the curated micro-keyword library with research-backed, previewable entries; quality and coverage matter more than a raw keyword count.
- [ ] Add persisted favourites and real, abuse-protected community signals only if a genuine account model is introduced.
- [ ] Add parameter-aware visual snapshots and regression tests for every export target.
- [ ] Profile compilation with the full library selected; move expensive work off the main thread if measured latency warrants it.
- [ ] Audit the full Studio, Motion Lab and Math Lab experience for consistency, mobile usability and accessibility.

## Guardrails

- No dependency was added in this pass.
- No repository source was described as visually verified.
- No award, score, performance metric or completion result is claimed without evidence.
- Preserve the existing typed module library, preview engines and Studio architecture. Continue with small, testable changes.
