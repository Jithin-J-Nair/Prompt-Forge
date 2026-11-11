# Performance & Security Quality Bar

## Frontend performance

- **Zero new runtime dependencies for the studio/labs** — every demo is hand-rolled Canvas 2D /
  DOM / SVG (the only added deps are `@fontsource` fonts, `vitest`, `server-only` (a build-time
  marker package), and the existing `lucide-react` icons). No animation library tax.
- **Labs**: DPR capped at 2, IntersectionObserver pause for offscreen tiles, reduced-motion
  self-cancellation, coarse compute grids for per-sample fields (Voronoi/metaballs/plasma/marble),
  particle counts slider-bounded. The heaviest tile (Julia set at ≤ 200 iterations over
  360×225) is one-shot per parameter change, not per frame.
- **Studio**: compile cost is linear in selections (~1.5k words for 14 modules, sub-ms); search
  index is built once (module-level `let INDEX` cache) and queries are O(modules × tokens) with
  small constants. The catalog JSON (~279 modules) loads once per session.
- Pages are statically prerendered (`○` in build output) except APIs — `/studio`, labs, home,
  forge, library ship as static HTML.

## API and compile budgets

- `/api/compile` refuses > 80 selections (413); all free-text inputs are length-capped
  (projectName 160, brief 2000, stackNote 500, param values 4000 chars) — defensive against
  absurd payloads; compile is in-memory only.
- `/api/search` caps results at 200.
- `/api/compositions` POST truncates `compiled` at 120 KB and requires non-empty selections →
  cheap abuse surface closed; memory fallback is LRU-capped at 200.

## Database safety

- `src/db/index.ts` builds the pool **on first query, not at import** — static builds,
  route-metadata collection, and tests work with no `DATABASE_URL` (verified: build green in the
  sandbox without one).
- Storage layer tries the DB, catches, and falls back to memory — and *labels* records
  (`persisted: "database" | "memory"`) instead of lying about durability.
- No cross-user data exists anywhere (single shared catalog; compositions are per-deployment,
  authenticated-layer-free by design — same trust model as the pre-existing `/library`). No
  session/user tables were added.
- Secrets remain in `DATABASE_URL` env only; `.env.example` documents it; nothing secret-shaped
  is committed (checked in final sweep).

## Supply chain

- `next`'s + `drizzle-orm`'s trees unchanged except font packages from `@fontsource` (public,
  license-clean); devDeps add only `vitest`. Lockfile updated and committed in-repo.

## Build integrity

`npm run build` green: 17 routes, type-generation included. ESLint (incl. react-hooks
`set-state-in-effect`, `refs-during-render`) clean project-wide — the two classes of rules that
forced real fixes during development rather than being disabled.
