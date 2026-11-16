# First runnable vertical slice

**Status:** Implemented as a local, non-persistent preview<br>
**Route:** `/skillforge`<br>
**API:** `POST /api/skillforge/compose`

## What this slice does

- Accepts a 3–400 character brief for the `ai-product` pilot category.
- Selects four complete Tier 1 Core Thinking skill packages from a deterministic starter catalog.
- Produces an acyclic, deterministically ordered graph with dependency edges, priority, scope, rationale, and a SHA-256 graph fingerprint.
- Produces draft `MASTER_SKILL_PACKAGE.md` and `PROJECT_DNA.md` previews. Vision is copied from the user's brief; all other DNA fields remain explicitly unknown.
- Displays the nine missing canonical artifacts and all eight required Review Council roles.
- Keeps the result explicitly `draft`, `not_persisted`, `not accepted`, and `not execution-ready`.
- Keeps the four complete Tier 1 seed packages as typed source data in `src/lib/skillforge/catalog.ts`; they are not yet published database versions or tenant-owned catalog rows.

## Deliberate boundaries

This pilot makes no database writes, external model calls, user/tenant assumptions, review decisions, or agent handoffs. It supports AI Product only. The other requested categories, Tiers 2–7, the remaining blueprint generators, a real Review Council, identity/tenant authorization, persistence/version lineage, and external exports remain future implementation work. The endpoint must not be treated as production-ready or used to accept or execute a package.

## Verification

`npm test` exercises deterministic output, scope deduplication, dependency ordering, Project DNA unknowns, required skill sections, and input/category rejection. `npm run typecheck` and the Next.js build cover application integration.
