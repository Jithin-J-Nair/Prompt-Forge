# Curated skill ingest (not GitHub copy-paste)

SkillForge does **not** auto-download highest-star GitHub skill repos.

## Correct workflow

1. Humans survey elite public skill ecosystems for **practice patterns**.
2. Distill into SkillForge’s 13-section contract (JSON SkillPackage or SkillSeed).
3. Drop files into `skills/ingest/incoming/*.json`.
4. Run: `npm run ingest:skills`
5. Only validated, non-generic skills can be promoted into `src/lib/skillforge/catalog*.ts`.

## Forbidden

- Pasting copyrighted `SKILL.md` trees wholesale
- Claiming a third-party repo is “the SkillForge skill”
- Empty boilerplate principles

See `src/lib/skillforge/skill-ingest.ts`.
