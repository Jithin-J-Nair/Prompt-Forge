# SkillForge implementation handoff

## Merged state

The SkillForge design and early implementation phases are on `main`. Preserved checkpoints include:

- `4c1b02a` — architecture and foundational design documentation.
- `2f24583` — first runnable composition preview (`/skillforge`, `POST /api/skillforge/compose`).
- Contract validation phase — fixture-driven schemas and validators.
- Draft blueprint templates phase — versioned template set generating all eleven canonical artifacts as draft shells.
- Review Council phase — deterministic evidence-backed assessments that block acceptance while unknowns/findings remain.

GitHub may report no status checks on earlier pull requests. Local verification listed in each phase section is authoritative until CI is configured.

## Architecture package

The design source of truth is [`SKILLFORGE_ARCHITECTURE.md`](SKILLFORGE_ARCHITECTURE.md). Supporting contracts are:

- [`architecture/schema.sql`](architecture/schema.sql) — proposed PostgreSQL model; design reference only, not an applied migration.
- [`../skills/skill.schema.json`](../skills/skill.schema.json) — versioned skill package contract with all 13 required sections.
- [`../projects/project-dna.schema.json`](../projects/project-dna.schema.json) — Project DNA contract.
- [`../composer/skill-graph.schema.json`](../composer/skill-graph.schema.json) — composed skill graph contract.
- [`../blueprints/package-manifest.schema.json`](../blueprints/package-manifest.schema.json) — package completeness / acceptance gate contract.
- [`../reviewers/review-assessment.schema.json`](../reviewers/review-assessment.schema.json) — Review Council assessment contract.
- [`../reviewers/council-rubric-1.0.0.json`](../reviewers/council-rubric-1.0.0.json) — published council rubric defaults.
- [`../agents/export-manifest.schema.json`](../agents/export-manifest.schema.json) — export handoff contract (`executionAuthorized` is always false).
- [`../templates/draft-set-1.0.0.json`](../templates/draft-set-1.0.0.json) — published draft blueprint template set.
- [`../skill-categories/catalog.yaml`](../skill-categories/catalog.yaml) — requested project-category and role taxonomy.
- README boundaries in `agents/`, `blueprints/`, `composer/`, `knowledge/`, `projects/`, `reviewers/`, `skill-categories/`, `skills/`, and `templates/`.

The architecture distinguishes confirmed requirements from proposed defaults and records unresolved decisions, including identity, model-provider policy, retention/compliance, reviewer thresholds, and the long-term execution boundary.

## Implemented vertical slice

- UI: `/skillforge`
- API: `POST /api/skillforge/compose`
- Scope: the `ai-product` pilot category and four complete Tier 1 Core Thinking seed skills in `src/lib/skillforge/catalog.ts`.
- Output: deterministic skill graph, all eleven draft artifacts from `templates/draft-set-1.0.0.json`, and a Review Council result from `reviewers/council-rubric-1.0.0.json`.
- Unknown Project DNA values remain explicitly unknown; only Vision is sourced from the brief.
- The result is `draft`, `not_persisted`, `accepted: false`, `executionReady: false`. Council status is `blocked` while unresolved high/critical findings remain. Export/handoff remains blocked.

The slice makes no database writes or external model calls and performs no agent handoff. Automated revision regeneration is not implemented yet; the council returns a blocked revision plan only.

## Contract validation phase

Fixture-driven schemas and validators for Project DNA, skill graph, package completeness, review assessment, and export manifest. Commands: `npm test`, `npm run validate:contracts`.

## Draft blueprint templates phase

Versioned template set `skillforge-draft@1.0.0` renders all eleven canonical artifacts as draft shells without inventing unknown DNA.

## Review Council phase

Handoff recommended next step 5 / original brief requirement that nothing is accepted without review:

- Rubric: `council-defaults-proposed@1.0.0` with proposed 80/100 gates and eight mandatory reviewers.
- Deterministic evaluator in `src/lib/skillforge/council.ts` produces scores, evidence, findings, and a blocked revision plan.
- Compose preview includes council assessments; acceptance remains false.
- Fixture: `reviewers/fixtures/ai-recruiting.blocked-review.json`.

## Incomplete work

- Automated revision loops that regenerate affected artifacts and re-run reviewers.
- Persistence, immutable run/artifact lineage, identity, authorization, tenant isolation, and retention.
- The other 14 project categories, Tier 2–7 skills, and catalog publication lifecycle.
- Enriching draft artifacts beyond unknown-preserving shells once Project DNA fields are confirmed.
- Safe external export and any future agent execution runtime.
- Resolution of open v1 product decisions (auth/tenant model, model-provider stance, retention, frozen reviewer thresholds).

## Recommended next steps

1. Resolve the v1 design decisions recorded in the architecture before introducing persistence, external model providers, or execution authority.
2. Establish tenant-scoped projects and immutable skill/catalog versions on top of the validated contracts.
3. Expand deterministic composition by category and capability (especially Tier 2 AI skills for the AI Product pilot), with tested deduplication, conflict resolution, provenance, and graph invariants.
4. ~~Add versioned templates and generate the remaining canonical artifacts; keep every incomplete package in draft.~~ **Done for the AI Product pilot draft set.**
5. ~~Implement the evidence-backed Review Council and bounded revision/blocked flow.~~ **Deterministic council + blocked flow done; automated revision regeneration still open.**
6. Add authenticated, scoped export only after review; keep generated instructions separate from executable permissions.
7. Establish privacy, retention, operational, and evaluation controls before production rollout.
