# Compiler & API Architecture

## The compiler as a pure pipeline

`src/lib/studio/compiler.ts` is a referentially-transparent function:

```
CompileInput ──► resolveSelections ──► detectConflicts ──► render sections ──► renderers
 { selections }    (validate+clamp)      (symmetric pairs)   (role grouping)    (md/text/json)
```

Same input → same output, in the browser (live composer preview) and the server (API). No
timestamps except a `generatedAt` in JSON metadata; no randomness; no I/O.

### Stages

1. **Resolve** — lookup by id; dedupe preserving user's order; per-param validation:
   numbers clamp to `[min,max]`, unknown select values fall back to the declared default, booleans
   coerce, text is length-capped. `unknownIds` collected, never alternated with crashes.
2. **Conflicts** — declared edges intersected with the selection set; deduped per symmetric pair.
   Consumers: the UI banner (with keep/remove affordances) and a "CONFLICTS, WARNINGS &
   RECOMMENDED ADDITIONS" section in the compiled document — *both*.
3. **Sections** — 11 category-role sections numbered canonically (websites → … → engineering),
   then derived closers: **Technical Architecture** (aggregated stack + build sequence generated
   from which categories were selected) and **Acceptance Criteria & Restrictions** (a
   content-adaptive definition-of-done — mentions p95 histograms only when heavy modules are
   present, INP budgets only when the CWV module is selected).
4. **Rendering** — three renderers from one tree:
   - **Markdown** for AI builders and docs (`## 4 · TYPOGRAPHY SYSTEM` + meta footnotes),
   - **plain-text** for chat boxes,
   - **JSON** for programmatic consumers (`sections[].items[] { moduleId, prompt, params }`).

### Adaptive guidance

The compiler computes **warnings**: `heavy` (3+ heavy modules — explains the one-signature-effect
rule and points to the GPU budget module), `coverage` (motion/heavy selections without any
engineering contracts), `unknown` (unresolved ids). And **suggestions** — per-selection
recommended additions with "when" context. Both appear in output and UI.

## HTTP API

All routes are `force-dynamic`, JSON, and share the library — no duplicated logic.

| Route | Purpose | Guardrails |
|-------|---------|-----------|
| `GET /api/kb` | Full catalog: categories + modules (summary by default, `?full=1` for fragments) + stats | none (public data) |
| `GET /api/kb/[...id]` | One module fully (catch-all because ids contain `/`) | 404 unknown |
| `GET /api/search` | `searchModules(q, filters)` server-side; returns scored results + `where` field commentary | limit ≤ 200 |
| `POST /api/compile` | Compile selections → sections/markdown/text/json + conflicts + warnings | ≤ 80 selections → 413; long strings truncated |
| `GET /api/presets`, `/api/presets/[id]` | Curated presets (ids only) | 404 unknown |
| `GET/POST /api/compositions`, `GET/DELETE /api/compositions/[id]` | Save/restore compositions | POST requires selections + compiled → 400 otherwise |

### Compositions persistence (`lib/studio/storage.ts`)

- Marked `server-only` (stubbed in vitest config so the suite can exercise it).
- With `DATABASE_URL`: writes/reads `compositions` via Drizzle (dynamic imports — the module can
  be `import`ed without a pool springing to life).
- Without: capped in-memory `Map` on `globalThis` (200 entries, LRU-ish eviction), records are
  tagged `persisted: "memory"` so the UI can be honest about durability.

## The studio UI contract (`components/studio/studio-app.tsx`)

- **Three panels**: explorer (category tree) / browser (cards + search) / composer.
- Composer state: `useReducer` with add/remove/move/setParam/load/clear. Compile is `useMemo` —
  cursor-position-live.
- **Manual edits are sacred**: typing in the edit textarea switches the composer into edited mode;
  subsequent selection changes never overwrite it; a banner offers "regenerate" that discards edits
  explicitly. Copy/export use whatever text the user currently sees.
- **Conflicts never silently resolve**: banners list reasons + remove-A/remove-B/keep-both chips.
- Exports: clipboard copy, `.md`, `.txt`, `.json` downloads; save → `/api/compositions`; saved
  drawer restores full param state.
- Responsive: ≤ lg collapses panels into Explore/Browse/Compose tabs; ≥ xl is a fixed three-pane
  studio.
