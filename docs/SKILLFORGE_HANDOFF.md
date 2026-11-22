# SkillForge implementation handoff

## Merged state

SkillForge is the expertise-compose engine of **PromptForge** (same product). Usable compose on `main` for all 15 project categories:

- Architecture, contracts, templates, and catalog boundaries.
- Deterministic composition with curated multi-tier skill policies.
- Published catalog **v1.2.0** — core starters plus elite specialists (performance, a11y, privacy, payments, ML, prompt-injection defense, etc.).
- Project DNA enrichment (confirmed + inferred, unknowns labeled).
- All eleven canonical artifacts generated from versioned templates.
- Review Council with revision rounds; packages can become **accepted for export**.
- Browser save + Markdown export UX on `/skillforge`.
- Primary nav CTA points at SkillForge compose; `/forge` remains the mega-prompt surface.
- **Execution remains unauthorized** (`executionReady: false`).

## How to use

1. Open `/skillforge` (or **Compose package** in the nav).
2. Choose a project category and enter a brief (3–400 chars).
3. Compose → inspect skill graph, DNA, council scores, artifacts.
4. Save in-browser and/or Export Markdown.
5. Treat accepted packages as instructional handoffs only.

## Incomplete / next

- Deeper human-authored skill prose and optional GitHub-sourced skill ingestion under the same contract.
- Cloud persistence ledger + auth/tenant isolation (browser save is still the ready path).
- Unified intake that folds mega-prompt output into the same package flow.
- In-product agent execution runtime (export/handoff only today).
- Model-provider adapters (compose stays deterministic).

## Verification

- `npm test`
- `npm run validate:contracts`
- `npm run typecheck`
- ESLint on SkillForge modules
- `npm run build` with a working `DATABASE_URL` when `/forge` persistence is needed
