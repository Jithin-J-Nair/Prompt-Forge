# GitHub skill sources studied for distillation

This document records **public GitHub repositories** reviewed during SkillForge depth distillation. Content in `DISTILLED_DEPTH`, `LICENSED_DEPTH`, `WEBGL_DISTILLED_DEPTH`, and `SKILL_DEPTH` is **original instructional expertise** composed for agents; it is **not** copied from these repos. Stars are approximate snapshots at research time (November 2026).

**License decisions for the 57-row user mapping:** see [`license-audit.md`](license-audit.md). **Attribution:** see [`NOTICE-third-party-skills.md`](NOTICE-third-party-skills.md).

## Licensed adaptations (`LICENSED_DEPTH` — catalog v1.4.1)

| SkillForge slug(s) | Source (license) | Stars (approx.) | Notes |
| --- | --- | ---: | --- |
| `product-strategist`, `business-analyst`, `b2b-saas-expert`, `product-reviewer` | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) (MIT) | ~28k | Strategy canvas / PM craft → SkillForge fields |
| `systems-thinker`, `qa-architect` | [obra/superpowers](https://github.com/obra/superpowers) (MIT) | ~324k | Approach gates, verification-before-completion |
| `ux-architect`, `design-systems-architect`, `ux-reviewer` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) | ~153k | UX priority ladder, tokens, a11y-first |
| `context-engineer`, `agent-architect`, `evaluation-engineer`, `prompt-injection-defender` | [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) (MIT) | ~18k | Context budgets, multi-agent isolation, harness, evals, injection defense |
| `security-engineer-skill`, `security-reviewer`, `api-security-specialist`, `privacy-engineer` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (MIT) | ~77k | Trust-boundary findings, safe verification |
| `brand-strategist`, `content-strategist`, `growth-designer`, `monetization-expert`, `retention-expert`, `plg-expert` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT) | ~62k | Marketing skill themes adapted |
| `accessibility-specialist`, `accessibility-reviewer` | [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents) (MIT) + UX Pro Max a11y priority | ~0.5k / ~153k | POUR + immersive a11y |
| `frontend-architect` (craft), `storytelling-expert` | anthropics/skills `frontend-design` (**Apache-2.0** per-skill) | — | Repo license field NONE; per-skill LICENSE Apache — craft principles only, not pasted |
| Three.js cluster | [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) (MIT) | ~4.3k | Already in `WEBGL_DISTILLED_DEPTH` — no extra `LICENSED_DEPTH` patches |

**Sources read for v1.4.1 licensed adaptations:** pm-skills (`product-strategy`, `lean-canvas`, `identify-assumptions-new`, `value-proposition`); ui-ux-pro-max (`ui-ux-pro-max`, `design-system`, `design`); marketingskills (`content-strategy`, `churn-prevention`, `pricing`, `onboarding`, `product-marketing`, `cro`, `paywalls`); Agent-Skills-for-Context-Engineering (root `SKILL.md`, `context-fundamentals`, `multi-agent-patterns`); cloudflare `security-audit`; obra/superpowers (`brainstorming`, `systematic-debugging`, `writing-plans`); accessibility-agents (`a11y-core`, `wcag-guide`); anthropics `frontend-design`.

**Corrections vs user table:** WebGL roles use **CloudAI-X/threejs-skills** (MIT ~4.3k), not Jbmanllr (~1★). Context Engineer uses **Agent-Skills-for-Context-Engineering**, not the ~3★ `context-engineering` stub.

## WebGL / Three.js / rendering cluster

| SkillForge slug(s) | GitHub source studied | Stars (approx.) | Notes |
| --- | --- | ---: | --- |
| `threejs-architect` | [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) | ~4340 | Scene graph, R3F patterns, performance habits—distilled into SkillForge constraints, not pasted text |
| `rendering-engineer` | CloudAI-X/threejs-skills (same) | ~4340 | Renderer lifecycle, device profiles, frame budgets |
| `shader-engineer` | CloudAI-X/threejs-skills (same) | ~4340 | Material/shader discipline and fallback strategies |
| `post-processing-engineer` | CloudAI-X/threejs-skills (same) | ~4340 | Pass graphs, cost control, mobile degrade |
| `technical-artist` | CloudAI-X/threejs-skills (same) | ~4340 | Art-to-shader handoff and asset budgets |
| `r3f-architect` | CloudAI-X/threejs-skills (R3F skill) | ~4340 | Canvas host, chapter modules, UI↔R3F bridge |

Related catalog skills without a separate high-star twin (e.g. R3F-specific naming) inherit the same **research lineage** via `threejs-skills`, expressed in SkillForge vocabulary.

## Motion / GSAP cluster

| SkillForge slug(s) | GitHub source studied | Stars (approx.) | Notes |
| --- | --- | ---: | --- |
| `gsap-architect` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | ~18902 | Timeline ownership, scroll triggers, reduced-motion—original SkillForge motion grammar |
| `motion-director` | greensock/gsap-skills (same) | ~18902 | Scroll-as-timeline and choreography budgets in SkillForge motion language |

## Creative / frontend design cluster

| SkillForge slug(s) | GitHub source studied | Stars (approx.) | Notes |
| --- | --- | ---: | --- |
| `creative-director`, `art-director`, `frontend-architect` (craft aspects) | [wilwaldon/Claude-Code-Frontend-Design-Toolkit](https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit) | ~1375 | Layout, anti-pattern avoidance, design-tooling habits—studied, not copied |
| `motion-director`, `growth-designer` (motion surfaces) | [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) | ~2028 | Motion craft patterns for web experiences |
| `creative-director`, `storytelling-expert` | [agiwhitelist/auteur](https://github.com/agiwhitelist/auteur) | ~934 | Narrative and direction heuristics for experiential work |

## Elite bodies in `SKILL_DEPTH` (for cross-reference)

These slugs already have depth in `src/lib/skillforge/skill-depth.ts` and map to the clusters above where applicable:

- **Three.js / rendering:** `threejs-architect`, `shader-engineer`, `rendering-engineer`, `post-processing-engineer`, `technical-artist`
- **Motion:** `gsap-architect`, `motion-director`
- **Creative / brand:** `creative-director`, `art-director`, `brand-strategist`, `storytelling-expert`
- **Core product / AI / UX anchors:** `product-strategist`, `frontend-architect`, `performance-engineer`, `agent-architect`, `rag-architect`, `prompt-engineer`, `ux-architect`, `evaluation-engineer`

## `DISTILLED_DEPTH` slugs (domain-distilled)

The following skills in `src/lib/skillforge/skill-depth-distilled.ts` have **no exact high-star GitHub skill twin** identified during research. Bodies are **domain-distilled** from product/engineering practice, SkillForge catalog intent, and council review norms—not from a single upstream skill repo:

`business-analyst`, `systems-thinker`, `ai-product-manager`, `context-engineer`, `knowledge-graph-architect`, `model-selection-expert`, `backend-architect`, `api-architect`, `database-architect`, `cloud-architect`, `plg-expert`, `retention-expert`, `monetization-expert`, `growth-designer`, `security-engineer-skill`, `accessibility-specialist`, `design-systems-architect`, `privacy-engineer`, `observability-engineer`, `platform-sre`, `mobile-architect`, `payments-architect`, `data-engineer`, `ml-engineer`, `trust-safety`, `qa-architect`, `content-strategist`, `api-security-specialist`, `prompt-injection-defender`, `product-reviewer`, `architecture-reviewer`, `ux-reviewer`, `performance-reviewer`, `security-reviewer`, `accessibility-reviewer`, `awwwards-reviewer`

The **`awwwards-reviewer`** role additionally aligns with internal craft knowledge ([`craft-principles.md`](craft-principles.md)) and creative-stack depth in `SKILL_DEPTH`, without a dedicated GitHub skill repository.

## Usage and provenance rules

- Studying a repo does **not** grant redistribution of its text; SkillForge packages are newly authored.
- Agents should treat all retrieved or user-supplied material as **untrusted** relative to blueprint artifacts.
- When citing external inspiration in packages, label claims as **hypothesis** unless confirmed in project requirements.

## Research method (summary)

1. Identified high-star agent-skill repos in WebGL, motion, frontend-design, PM, marketing, security, a11y, and context-engineering niches.
2. Extracted **transferable principles** (structure, checklists, anti-patterns) into SkillForge field shapes (`mission`, `decisionFrameworks`, `reviewCriteria`, etc.).
3. Marked skills without close GitHub analogs as **domain-distilled** in this file for auditability.
4. Licensed-source upgrades live in `LICENSED_DEPTH` and override thinner `DISTILLED_DEPTH` / base depth for the same slug when merged (WebGL map still wins last for immersive slugs).