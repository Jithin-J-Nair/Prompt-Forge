import type { ProjectCategoryKey } from "./categories.ts";
import type { SkillGraphNode } from "./types.ts";

const TIER1 = [
  "product-strategist",
  "business-analyst",
  "systems-thinker",
  "ux-architect",
] as const;

/** Category → ordered skill slug policy (mandatory set for deterministic composition). */
export const CATEGORY_SKILL_POLICY: Record<ProjectCategoryKey, readonly string[]> = {
  "ai-product": [
    ...TIER1,
    "ai-product-manager",
    "agent-architect",
    "prompt-engineer",
    "ml-engineer",
    "evaluation-engineer",
    "prompt-injection-defender",
    "frontend-architect",
    "backend-architect",
    "privacy-engineer",
  ],
  "ai-agent": [
    ...TIER1,
    "agent-architect",
    "context-engineer",
    "prompt-engineer",
    "evaluation-engineer",
    "prompt-injection-defender",
    "security-engineer-skill",
    "trust-safety",
  ],
  "rag-platform": [
    ...TIER1,
    "rag-architect",
    "context-engineer",
    "knowledge-graph-architect",
    "evaluation-engineer",
    "prompt-injection-defender",
    "data-engineer",
    "backend-architect",
    "database-architect",
  ],
  saas: [
    ...TIER1,
    "b2b-saas-expert",
    "plg-expert",
    "retention-expert",
    "design-systems-architect",
    "frontend-architect",
    "backend-architect",
    "api-architect",
    "observability-engineer",
    "qa-architect",
  ],
  "startup-mvp": [
    ...TIER1,
    "ai-product-manager",
    "frontend-architect",
    "backend-architect",
    "growth-designer",
    "qa-architect",
  ],
  "mobile-app": [
    ...TIER1,
    "mobile-architect",
    "frontend-architect",
    "api-architect",
    "cloud-architect",
    "performance-engineer",
    "accessibility-specialist",
  ],
  "web-application": [
    ...TIER1,
    "frontend-architect",
    "backend-architect",
    "api-architect",
    "database-architect",
    "design-systems-architect",
    "performance-engineer",
    "accessibility-specialist",
    "qa-architect",
  ],
  "awwwards-website": [
    ...TIER1,
    "creative-director",
    "art-director",
    "motion-director",
    "storytelling-expert",
    "brand-strategist",
    "content-strategist",
    "gsap-architect",
    "threejs-architect",
    "r3f-architect",
    "shader-engineer",
    "technical-artist",
    "frontend-architect",
    "design-systems-architect",
    "performance-engineer",
    "accessibility-specialist",
    "awwwards-reviewer",
    "creative-direction-reviewer",
    "art-direction-reviewer",
    "story-systems-reviewer",
  ],
  "threejs-experience": [
    ...TIER1,
    "creative-director",
    "art-director",
    "motion-director",
    "storytelling-expert",
    "threejs-architect",
    "r3f-architect",
    "shader-engineer",
    "gsap-architect",
    "technical-artist",
    "rendering-engineer",
    "post-processing-engineer",
    "frontend-architect",
    "performance-engineer",
    "accessibility-specialist",
    "awwwards-reviewer",
    "creative-direction-reviewer",
    "art-direction-reviewer",
    "story-systems-reviewer",
  ],
  "enterprise-platform": [
    ...TIER1,
    "backend-architect",
    "api-architect",
    "database-architect",
    "cloud-architect",
    "security-engineer-skill",
    "privacy-engineer",
    "platform-sre",
    "observability-engineer",
  ],
  "e-commerce": [
    ...TIER1,
    "frontend-architect",
    "backend-architect",
    "api-architect",
    "payments-architect",
    "growth-designer",
    "monetization-expert",
    "performance-engineer",
    "qa-architect",
  ],
  "automation-system": [
    ...TIER1,
    "agent-architect",
    "backend-architect",
    "api-architect",
    "evaluation-engineer",
    "prompt-injection-defender",
    "observability-engineer",
  ],
  "analytics-platform": [
    ...TIER1,
    "data-engineer",
    "database-architect",
    "backend-architect",
    "frontend-architect",
    "evaluation-engineer",
    "privacy-engineer",
  ],
  marketplace: [
    ...TIER1,
    "backend-architect",
    "api-architect",
    "payments-architect",
    "growth-designer",
    "security-engineer-skill",
    "trust-safety",
    "monetization-expert",
    "api-security-specialist",
  ],
  "internal-tool": [
    ...TIER1,
    "frontend-architect",
    "backend-architect",
    "api-architect",
    "design-systems-architect",
    "accessibility-specialist",
  ],
};

export const PRIORITY_BY_SKILL: Record<string, SkillGraphNode["priority"]> = {
  "product-strategist": "P0",
  "systems-thinker": "P0",
  "business-analyst": "P1",
  "ux-architect": "P1",
  "ai-product-manager": "P0",
  "agent-architect": "P0",
  "rag-architect": "P0",
  "evaluation-engineer": "P1",
  "context-engineer": "P1",
  "knowledge-graph-architect": "P1",
  "prompt-engineer": "P1",
  "model-selection-expert": "P2",
  "ml-engineer": "P1",
  "prompt-injection-defender": "P0",
  "frontend-architect": "P1",
  "backend-architect": "P1",
  "api-architect": "P1",
  "database-architect": "P1",
  "cloud-architect": "P2",
  "performance-engineer": "P1",
  "accessibility-specialist": "P1",
  "design-systems-architect": "P1",
  "mobile-architect": "P0",
  "data-engineer": "P1",
  "observability-engineer": "P1",
  "platform-sre": "P1",
  "qa-architect": "P1",
  "creative-director": "P0",
  "art-director": "P1",
  "storytelling-expert": "P2",
  "motion-director": "P1",
  "brand-strategist": "P1",
  "content-strategist": "P1",
  "threejs-architect": "P0",
  "r3f-architect": "P1",
  "gsap-architect": "P1",
  "shader-engineer": "P1",
  "technical-artist": "P1",
  "rendering-engineer": "P2",
  "post-processing-engineer": "P2",
  "product-reviewer": "P3",
  "architecture-reviewer": "P3",
  "ux-reviewer": "P3",
  "performance-reviewer": "P3",
  "security-reviewer": "P3",
  "accessibility-reviewer": "P3",
  "awwwards-reviewer": "P2",
  "creative-direction-reviewer": "P2",
  "art-direction-reviewer": "P2",
  "story-systems-reviewer": "P2",
  "b2b-saas-expert": "P0",
  "plg-expert": "P1",
  "retention-expert": "P1",
  "monetization-expert": "P1",
  "growth-designer": "P1",
  "payments-architect": "P0",
  "security-engineer-skill": "P0",
  "privacy-engineer": "P0",
  "trust-safety": "P0",
  "api-security-specialist": "P0",
};

export const PRIORITY_RATIONALE: Record<string, string> = {
  "product-strategist": "Frames the user problem before downstream decisions.",
  "business-analyst": "Makes business assumptions and success measures explicit.",
  "systems-thinker": "Surfaces boundaries and risks before solution design.",
  "ux-architect": "Frames user goals and interaction questions before interface work.",
  "ai-product-manager": "Shapes AI product outcomes, eval gates, and model-use boundaries.",
  "agent-architect": "Defines agent responsibilities, tools, and stop conditions.",
  "rag-architect": "Designs retrieval, grounding, and citation boundaries.",
  "evaluation-engineer": "Defines measurable quality and regression checks.",
  "context-engineer": "Controls context budgets and memory boundaries.",
  "knowledge-graph-architect": "Structures knowledge relations for grounded reasoning.",
  "prompt-engineer": "Specifies prompt contracts without granting authority.",
  "model-selection-expert": "Chooses model classes against task and risk constraints.",
  "ml-engineer": "Defines model lifecycle, drift checks, and serving contracts.",
  "prompt-injection-defender": "Keeps untrusted text from becoming system policy or tool authority.",
  "frontend-architect": "Owns client architecture and interaction integrity.",
  "backend-architect": "Owns services, reliability, and domain boundaries.",
  "api-architect": "Defines API contracts and compatibility rules.",
  "database-architect": "Defines data model, access, and retention concerns.",
  "cloud-architect": "Defines deployment topology and operability.",
  "performance-engineer": "Locks user-perceived performance budgets and regression gates.",
  "accessibility-specialist": "Enforces inclusive interaction and WCAG acceptance checks.",
  "design-systems-architect": "Defines tokens and component contracts for consistent craft.",
  "mobile-architect": "Owns mobile navigation, offline, and permission boundaries.",
  "data-engineer": "Owns pipelines, freshness SLAs, and lineage.",
  "observability-engineer": "Defines SLOs and redacted telemetry.",
  "platform-sre": "Owns deploy safety, rollback, and runbooks.",
  "qa-architect": "Attaches risk-based release quality gates.",
  "creative-director": "Sets coherent creative direction and craft standards.",
  "art-director": "Translates creative direction into visual systems.",
  "storytelling-expert": "Shapes narrative arcs for product and brand experiences.",
  "motion-director": "Defines motion language and timing principles.",
  "brand-strategist": "Aligns brand meaning with product outcomes.",
  "content-strategist": "Structures voice, hierarchy, and conversion-safe copy.",
  "threejs-architect": "Owns WebGL experience architecture.",
  "r3f-architect": "Structures React Three Fiber scene systems.",
  "gsap-architect": "Coordinates timeline-driven motion systems.",
  "shader-engineer": "Implements GPU shading with performance budgets.",
  "technical-artist": "Bridges art direction and realtime constraints.",
  "rendering-engineer": "Owns rendering pipeline performance and fidelity.",
  "post-processing-engineer": "Defines post-process stacks and budgets.",
  "b2b-saas-expert": "Frames B2B packaging, seats, and enterprise buying.",
  "plg-expert": "Designs product-led activation loops.",
  "retention-expert": "Defines retention levers and habit loops.",
  "monetization-expert": "Frames pricing and packaging hypotheses.",
  "growth-designer": "Designs growth surfaces without dark patterns.",
  "payments-architect": "Frames checkout, ledgers, and PCI-aware boundaries.",
  "security-engineer-skill": "Enforces least privilege and safe handoff boundaries.",
  "privacy-engineer": "Defines minimization, consent, and retention boundaries.",
  "trust-safety": "Defines abuse controls and escalation paths.",
  "api-security-specialist": "Hardens authz, rate limits, and injection defenses on APIs.",
  "product-reviewer": "Reviews outcome clarity and strategy coherence before export.",
  "architecture-reviewer": "Reviews architecture fit to medium and budgets.",
  "ux-reviewer": "Reviews visitor/user journeys and recovery paths.",
  "performance-reviewer": "Reviews performance budgets and degradation paths.",
  "security-reviewer": "Reviews safe handoff and permission boundaries.",
  "accessibility-reviewer": "Reviews inclusive interaction and reduced-motion paths.",
  "awwwards-reviewer": "Reviews craft density and immersive experience integrity.",
  "creative-direction-reviewer": "Reviews north star, pillars, and forbidden creative patterns.",
  "art-direction-reviewer": "Reviews art bible, composition law, and rejected looks.",
  "story-systems-reviewer": "Reviews beat sheets, chapter maps, and message hierarchy.",
};

/** Extra skills injected when the brief signals immersive/WebGL craft. */
export const IMMERSIVE_BRIEF_SKILLS = [
  "creative-director",
  "art-director",
  "motion-director",
  "gsap-architect",
  "threejs-architect",
  "r3f-architect",
  "shader-engineer",
  "technical-artist",
  "performance-engineer",
  "awwwards-reviewer",
] as const;

export function briefSignalsImmersive(brief: string): boolean {
  if (
    /\b(?:without\s+(?:any\s+)?(?:webgl|three\.?js|r3f|shaders?|3d)|no\s+(?:webgl|three\.?js|r3f|shaders?|3d)|zero\s+(?:webgl|3d))\b/i.test(
      brief,
    )
  ) {
    return false;
  }
  return /\b(webgl|three\.?js|r3f|shader|immersive|scroll\s*theater|awwwards|active\s*theory|gsap|canvas\s*experience)\b/i.test(
    brief,
  );
}

const FUNCTIONAL_CATEGORIES = new Set([
  "saas",
  "startup-mvp",
  "web-application",
  "internal-tool",
  "enterprise-platform",
]);

export function isFunctionalProjectCategory(categoryKey: ProjectCategoryKey): boolean {
  return FUNCTIONAL_CATEGORIES.has(categoryKey);
}

/** Skills that are spectacle-heavy — demote on SaaS/functional briefs unless immersive signaled. */
const SPECTACLE_SKILLS = new Set([
  "threejs-architect",
  "r3f-architect",
  "shader-engineer",
  "technical-artist",
  "rendering-engineer",
  "post-processing-engineer",
  "gsap-architect",
  "motion-director",
  "awwwards-reviewer",
]);

/**
 * Focused project-specific roster: keep category policy, drop spectacle spam on functional briefs,
 * and attach boundaries so agents do not duplicate work.
 */
export function focusSkillRoster(input: {
  categoryKey: ProjectCategoryKey;
  brief: string;
  slugs: readonly string[];
}): { slugs: string[]; boundaries: Record<string, string> } {
  const categoryImmersive =
    input.categoryKey === "awwwards-website" ||
    input.categoryKey === "threejs-experience";
  // Functional categories stay job-first even when the brief name-drops WebGL.
  const immersive =
    categoryImmersive ||
    (briefSignalsImmersive(input.brief) &&
      !isFunctionalProjectCategory(input.categoryKey));
  const functional =
    !immersive &&
    (isFunctionalProjectCategory(input.categoryKey) ||
      /\b(saas|dashboard|ops|crm|admin|b2b)\b/i.test(input.brief));

  let slugs = [...input.slugs];
  if (functional) {
    slugs = slugs.filter((slug) => !SPECTACLE_SKILLS.has(slug));
  }

  // Cap roster to avoid skill dumping while keeping P0 strategists + reviewers.
  const MAX = immersive ? 22 : 14;
  if (slugs.length > MAX) {
    const priorityRank = (slug: string) => {
      const p = PRIORITY_BY_SKILL[slug] ?? "P2";
      return p === "P0" ? 0 : p === "P1" ? 1 : p === "P2" ? 2 : 3;
    };
    slugs = [...slugs].sort((a, b) => priorityRank(a) - priorityRank(b) || a.localeCompare(b));
    const kept = new Set(slugs.slice(0, MAX));
    // Always keep core strategists if present in original.
    for (const must of ["product-strategist", "systems-thinker", "ux-architect", "frontend-architect"]) {
      if (input.slugs.includes(must)) kept.add(must);
    }
    slugs = input.slugs.filter((slug) => kept.has(slug));
  }

  const boundaries: Record<string, string> = {};
  for (const slug of slugs) {
    boundaries[slug] =
      PRIORITY_RATIONALE[slug] ??
      "Selected by focused composition policy; do not expand into sibling skill scopes.";
  }
  if (functional) {
    boundaries["__roster__"] =
      "Functional brief: spectacle/WebGL specialists omitted. Do not invent Three.js work.";
  } else if (immersive) {
    boundaries["__roster__"] =
      "Immersive brief: craft + WebGL specialists included. DOM shell stays quiet; no SaaS dashboard cosplay.";
  }

  return { slugs, boundaries };
}
