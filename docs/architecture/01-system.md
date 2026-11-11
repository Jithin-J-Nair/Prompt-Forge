# System Architecture — PromptForge Visual Prompt Studio

## Overview

PromptForge is a Next.js 16 (App Router) application with two cooperating engines:

1. **The Foundry** (pre-existing) — deterministic industry-specific website spec generator (`src/lib/engine/*`), preserved untouched as one mode of the product.
2. **The Studio** (new) — a *visual prompt engineering* environment: a typed knowledge base of technique modules, a pure compilation engine that assembles selections into production build specifications, and browser interfaces (Studio, Motion Lab, Math Lab) over those data layers.

```
┌──────────────────────────── App Router (Next.js 16 / React 19) ────────────────────────────┐
│                                                                                            │
│   Pages                       Client views                  Pure libraries                 │
│   ──────                      ─────────────                 ──────────────                 │
│   /            →              home-view                     lib/templates                  │
│   /forge       →              forge-console    ── API ─→    lib/engine (enhnr/industries)  │
│   /library     →              library-view                  db (lazy pg)                   │
│   /spec/[id]   →              spec-renderer                                                │
│   /studio      →              studio-app      ──────────┐                                  │
│   /motion-lab  →              labs/motion-demos         │  lib/studio (PURE, no I/O):      │
│   /math-lab    →              labs/math-demos           │    schema · categories ·         │
│                                                         ├─→  modules/… (279 modules)       │
│   API routes (server)                                   │    registry · search ·           │
│   ──────────────────                                    │    compiler · presets            │
│   /api/kb, /api/kb/[...id] ─────────────────────────────┘                                  │
│   /api/search, /api/compile, /api/presets(+[id])                                           │
│   /api/compositions(+[id]) → lib/studio/storage (server-only: DB or memory)                │
│   /api/enhance, /api/prompts(+[id]), /api/templates, /api/health → engine + db             │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Load-bearing boundary: purity of `lib/studio`

The studio's knowledge layer (`schema`, `categories`, `modules/*`, `registry`, `search`,
`compiler`, `presets`) contains **zero I/O and zero imports from `@/db` or `server-only` code**.
This is deliberate and enforced:

- the same compiler runs in the *browser* (live preview in the Studio composer) and on the
  *server* (`/api/compile`), bit-for-bit identical output;
- importing `pg` into a client bundle would break the build and balloon it;
- tests exercise the entire layer in plain Node via vitest — no request mocking.

Persistence is isolated in `lib/studio/storage.ts`, which is marked `server-only` and dynamic-imports
`@/db`. With no `DATABASE_URL`, it degrades to a capped in-memory LRU (~200 entries on
`globalThis`) instead of erroring, so the Studio is **fully functional offline**.

## Data flow: selection → specification

1. **Selection** — Studio UI maintains `ComposerSel[] { moduleId, params }` (client state).
2. **Resolution** — `resolveSelections` dedupes preserving order, looks up modules, and resolves
   every parameter to a validated value (defaults for missing; clamping for out-of-range;
   option-membership for selects).
3. **Conflict detection** — declared directed conflict edges are evaluated over the selection set
   and reported **once per symmetric pair with their explained reason**. Nothing is removed. The UI
   offers explicit resolutions ("remove A" / "remove B" / keep both).
4. **Section assembly** — modules are grouped by category role into 11 canonical sections and two
   derived closing sections (Technical Architecture; Acceptance Criteria & Restrictions), keeping
   user order within a section.
5. **Interpolation** — `{paramKey}` tokens inside prompt/implementation/a11y/responsive/fallback
   strings are replaced with formatted values (`14vw`, `700ms`, select labels).
6. **Rendering** — one intermediate `CompiledSection[]` tree fans out to Markdown, plain-text and
   structured JSON renderers.

## Database

- Postgres via Drizzle ORM; `src/db/index.ts` exposes a **lazy-initialized** client: the pool is
  constructed on first query, never at import time. Builds, static generation and every KB feature
  work without a database.
- Tables: `prompts` (foundry), `compositions` (studio saves; added non-destructively — sheer
  additive migration, no alterations to `prompts`).
- `/api/health` intentionally reports `ok:false` + 500 when no DB is configured — it is a
  *database* liveness probe, not a process probe.

## Frontend runtime

- Fonts self-hosted via `@fontsource/*` imports (no `next/font/google` network dependency).
- Design tokens live in `globals.css` `@theme` (ink/ember/ivory palette, Space Grotesk /
  JetBrains Mono / Instrument Serif, blueprint-grid + noise atmosphere utilities).
- All heavy client views (studio-app, demos) are React client components using only vanilla
  `canvas 2d`, `IntersectionObserver`, `ResizeObserver` and CSS — **no animation library
  dependency** was added for the labs.
