# SkillForge implementation handoff

## Product stance

**PromptForge** is the brand. **SkillForge** is the expertise-compose engine. Same product: one idea → reviewed expertise package → agent handoff.

## Ready product surface

- `/` — PromptForge home; primary CTA composes via `/skillforge?q=…`
- `/skillforge` — compose, Review Council, browser + **server save**, Markdown export, **Agent pack** download
- `/forge` — mega-prompt surface (resilient if DB persist fails; still returns the spec)
- Catalog **v1.5.0** — 57+ depth-enriched skills (license-audited GitHub adaptations for PM/UX/security/context/marketing/story + WebGL/GSAP; never pasted third-party SKILL.md)
- Immersive categories emit craft-dense blueprints (no placeholder binder pages)
- Craft-first artifacts: `EXPERIENCE_DNA`, `CREATIVE_DIRECTION`, `ART_DIRECTION`, `STORY_SYSTEM`, `REVIEWER_FRAMEWORKS` (architecture stays minimal boundary notes)
- **Creative Director Engine** (deterministic): brief intelligence → multi-concept explore/score/select → Experience DNA → coherence pack → tech direction → focused skill roster → COOK + PromptForge BODY with **max-3 browser critique loop** and category-adaptive quality gates
- Concept directions are **project-specific** (motifs/materials/audience in labels + stances); scores are **computed from brief signals** — no predetermined winners or preset originality tables
- **Real creative evaluation**: directions are judged against the brief; weak/generic foils are hard-rejected; the winner cites brief evidence and an explicit tradeoff vs the runner-up
- **Cook pack**: downloads `COOK.md` (actionable execution blueprint) + handoff + manifest; pair with PromptForge BODY prompt
- Deterministic short-brief expansion for craft/product targets
- Curated skill ingest path: `npm run ingest:skills` (validate distilled JSON — no GitHub paste)
- Sixteen blueprints + craft-aware council gate; `executionReady` / `executionAuthorized` always **false**

## Persistence

- Table `skillforge_packages` (Postgres / Drizzle)
- `GET/POST /api/skillforge/packages`, `GET /api/skillforge/packages/[id]`
- `POST /api/skillforge/handoff` — agent manifest + Markdown pack
- Browser localStorage remains as offline fallback

## How to use

1. Open `/` or `/skillforge`.
2. Enter a brief (optionally `?q=` + `?category=`).
3. Compose → inspect graph, DNA, selected concept, council, artifacts.
4. Save to server and/or browser; Export MD; download **Agent pack**.
5. Paste COOK.md (brain) + PromptForge BODY (critique loop) into an external coding agent.
6. Treat packs as instructional handoffs only.

## God-law product stance (finished for v1 recipe OS)

- Packs are **agent cook books** (including cinematic UI motion + GSAP/R3F when immersive).
- SkillForge does **not** build the finished website in-product.
- See `docs/GOD_LEVEL_SKILLFORGE_BUILD_PROMPT.md` for the locked build law.

## Still later (not blocking ready use)

- Full auth / tenant isolation and retention ops
- GitHub skill ingest pipeline (curated distillation under contract — not copy-paste)
- In-product agent execution runtime / live browser QC inside PromptForge
- Optional LLM brief expansion behind a flag
- Model-provider adapters (compose stays deterministic)

## Verification

- `npm test` (includes three-fixture Creative Director differentiation)
- `npm run validate:contracts`
- `npm run typecheck`
- `npm run build` with a working `DATABASE_URL`
- Ensure `skillforge_packages` exists (drizzle schema / SQL create)
