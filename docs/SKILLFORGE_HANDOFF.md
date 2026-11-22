# SkillForge implementation handoff

## Merged state

SkillForge is a usable compose product on `main` for all 15 project categories:

- Architecture, contracts, templates, and catalog boundaries.
- Deterministic composition with curated multi-tier skill policies.
- Project DNA enrichment (confirmed + inferred, unknowns labeled).
- All eleven canonical artifacts generated from versioned templates.
- Review Council with revision rounds; packages can become **accepted for export**.
- Browser save + Markdown export UX on `/skillforge`.
- **Execution remains unauthorized** (`executionReady: false`).

## How to use

1. Open `/skillforge`.
2. Choose a project category and enter a brief (3–400 chars).
3. Compose → inspect skill graph, DNA, council scores, artifacts.
4. Save in-browser and/or Export Markdown.
5. Treat accepted packages as instructional handoffs only.

## Incomplete / non-goals for this release

- In-product agent execution runtime.
- Full auth/tenant isolation and production retention operations.
- Model-provider adapters (compose stays deterministic).
- Exhaustive human-authored skill prose for every role (catalog uses structured published skill packages).
- Automated cloud persistence ledger (browser save is the ready path).

## Verification

- `npm test`
- `npm run validate:contracts`
- `npm run typecheck`
- ESLint on SkillForge modules
- `npm run build` with placeholder `DATABASE_URL` when required by `/api/health`
