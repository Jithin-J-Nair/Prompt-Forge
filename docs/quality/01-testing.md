# Testing & Verification Quality Bar

## What's covered (vitest, `npm test`, 33 tests)

### Registry (`registry.test.ts`, 11 tests + content sweep)
- ≥ 150 modules (actual: 279) and exactly 11 categories populated
- `validateRegistry()` zero-error sweep: unique ids, token↔param consistency, select defaults in
  options, numeric defaults in range, all conflict/suggest targets exist
- no-placeholder sweep: prompts ≥ 60 chars, descriptions ≥ 40, implementations ≥ 20; rejects
  lorem/TODO/FIXME markers across every text field
- motion has its 9 required subcategories
- **demo coverage**: every module `demo:` id is a registered lab demo (58 known keys) — the tests
  would fail if a module promises a demo that doesn't exist

### Compiler (`compiler.test.ts`, 11 tests)
- canonical section order (websites → motion → … → engineering) + derived closers
- token interpolation with unit formatting; no `{leaked}` tokens in outputs
- param clamping (99999ms → 1600ms), select-default fallback, dedupe, unknown-id reporting
- **conflict contract**: detected once per symmetric pair, reason carried, *nothing deleted* —
  both modules remain in compiled output
- adaptive acceptance criteria (p95 histograms appear iff a heavy module is selected; INP budgets
  iff the CWV module is selected)
- coverage warning (motion selected without engineering) appears and clears correctly
- suggestions surface but never auto-add
- markdown/text/JSON renderer parity (same brief string in all three)

### Search (`search.test.ts`, 9 tests)
- exact name, tag, synonym expansion (glow → bloom/neon), description body, prefix tolerance
- structured filters (category, hasDemo, tunable) compose with the query
- ranking: exact hits above description-only hits; empty query = full catalog; tag list sorted

### Storage (`storage.test.ts`, 2 tests)
- memory-fallback CRUD round-trip (this sandbox has no DATABASE_URL — exercises the exact path
  offline developers hit)
- input caps: names trimmed to 160 chars, empty names → "Untitled composition"

## Toolchain gates

| Gate | Command | Status |
|------|---------|--------|
| TypeScript strict | `npx tsc --noEmit` | clean |
| ESLint (Next core-web-vitals + react-hooks) | `npm run lint` | clean |
| Unit tests | `npm test` | 33/33 |
| Production build | `npm run build` | green, 17 routes |

## Live API verification (against the dev server)

Exercised by hand during development (recorded in `IMPLEMENTATION-REPORT.md`):
`/api/health` (degraded-honest 500 without DB), `/api/kb` (279 modules), `/api/kb/math/lorenz`,
`/api/kb/motion/nope` → 404, `/api/search?q=voronoi&category=motion&hasDemo=1`,
`/api/compile` (conflict + clamp + unknown-id handling, 413 at > 80 selections),
`/api/presets` (21) + detail, `/api/compositions` full memory CRUD incl. 400 on empty POST and
404 after delete.

## Honest limits

- No browser-automation (Playwright) tier in this sandbox — UI verification is through renders,
  type contracts, and the live smoke passes recorded in the report.
- DB-backed composition persistence (`persisted: "database"`) is coded and follows the same
  interface as the tested memory path, but a real Postgres round-trip was not available in the
  sandbox; `/api/health` exists precisely to observe that in a real environment.
