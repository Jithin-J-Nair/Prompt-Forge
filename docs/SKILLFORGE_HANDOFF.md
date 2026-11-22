# SkillForge implementation handoff

## Product stance

**PromptForge** is the brand. **SkillForge** is the expertise-compose engine. Same product: one idea → reviewed expertise package → agent handoff.

## Ready product surface

- `/` — PromptForge home; primary CTA composes via `/skillforge?q=…`
- `/skillforge` — compose, Review Council, browser + **server save**, Markdown export, **Agent pack** download
- `/forge` — mega-prompt surface (resilient if DB persist fails; still returns the spec)
- Catalog **v1.3.0** — 57+ depth-enriched skills (including Tier-7 reviewers) across 15 categories
- Immersive categories emit craft-dense blueprints (no placeholder binder pages)
- Eleven blueprints + craft-aware council gate; `executionReady` / `executionAuthorized` always **false**

## Persistence

- Table `skillforge_packages` (Postgres / Drizzle)
- `GET/POST /api/skillforge/packages`, `GET /api/skillforge/packages/[id]`
- `POST /api/skillforge/handoff` — agent manifest + Markdown pack
- Browser localStorage remains as offline fallback

## How to use

1. Open `/` or `/skillforge`.
2. Enter a brief (optionally `?q=` + `?category=`).
3. Compose → inspect graph, DNA, council, artifacts.
4. Save to server and/or browser; Export MD; download **Agent pack**.
5. Treat packs as instructional handoffs only.

## Still later (not blocking ready use)

- Full auth / tenant isolation and retention ops
- GitHub skill ingest pipeline (curated import under contract)
- In-product agent execution runtime
- Model-provider adapters (compose stays deterministic)

## Verification

- `npm test`
- `npm run validate:contracts`
- `npm run typecheck`
- `npm run build` with a working `DATABASE_URL`
- Ensure `skillforge_packages` exists (drizzle schema / SQL create)
