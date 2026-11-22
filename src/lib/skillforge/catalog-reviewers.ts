import { buildSkill } from "./skill-factory.ts";
import type { SkillPackage } from "./types.ts";

const REVIEW_CATEGORIES = [
  "ai-product",
  "ai-agent",
  "rag-platform",
  "saas",
  "startup-mvp",
  "mobile-app",
  "web-application",
  "awwwards-website",
  "threejs-experience",
  "enterprise-platform",
  "e-commerce",
  "automation-system",
  "analytics-platform",
  "marketplace",
  "internal-tool",
] as const;

/**
 * Tier-7 reviewer skills from the SkillForge vision.
 * These encode review lenses; runtime Review Council roles remain authoritative for gates.
 */
export const REVIEWER_SKILLS: SkillPackage[] = [
  buildSkill({
    slug: "product-reviewer",
    name: "Product Reviewer",
    tier: 7,
    role: "Product Reviewer",
    summary: "Scores whether the package solves a real user job with clear outcomes.",
    capabilities: ["outcome-review", "scope-integrity", "strategy-coherence"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["product-strategist"],
    mission: "Reject packages that look complete but do not serve a clear user outcome.",
    principles: [
      "Outcomes beat feature lists.",
      "Scope cuts must be intentional.",
      "Strategy and DNA must agree.",
    ],
    decisionFrameworks: [
      {
        name: "Product gate",
        whenToUse: "Before export acceptance.",
        steps: [
          "Check user/problem/outcome consistency.",
          "Flag solutionizing without a job-to-be-done.",
          "Require labeled assumptions.",
        ],
        outcomes: ["Product review findings with severity."],
      },
    ],
    reviewCriteria: [
      {
        criterion: "User, problem, and outcomes align across DNA and strategy.",
        evidence: "PRODUCT_STRATEGY.md and PROJECT_DNA.md",
        severityIfMissed: "critical",
      },
    ],
  }),
  buildSkill({
    slug: "architecture-reviewer",
    name: "Architecture Reviewer",
    tier: 7,
    role: "Architecture Reviewer",
    summary: "Scores whether architecture matches the product medium and budgets.",
    capabilities: ["architecture-fit", "boundary-review", "budget-review"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["systems-thinker"],
    mission: "Reject architecture that ignores the real medium (e.g. SaaS monolith for WebGL).",
    principles: [
      "Architecture must match category and brief signals.",
      "Budgets and fallbacks are architectural.",
      "Boundaries beat buzzwords.",
    ],
    antiPatterns: ["Defaulting every site to Next.js + Postgres modular monolith."],
    reviewCriteria: [
      {
        criterion: "Architecture describes the actual experience medium and boundaries.",
        evidence: "ARCHITECTURE.md",
        severityIfMissed: "critical",
      },
    ],
  }),
  buildSkill({
    slug: "ux-reviewer",
    name: "UX Reviewer",
    tier: 7,
    role: "UX Reviewer",
    summary: "Scores flows, states, and visitor journeys for clarity and recovery.",
    capabilities: ["flow-review", "state-coverage", "recovery-paths"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["ux-architect"],
    mission: "Ensure flows describe the user's journey—not the composer’s internal loop.",
    antiPatterns: ["Documenting compose→council→export as the product user flow."],
    reviewCriteria: [
      {
        criterion: "Primary tasks match the product’s end user.",
        evidence: "USER_FLOWS.md",
        severityIfMissed: "high",
      },
    ],
  }),
  buildSkill({
    slug: "performance-reviewer",
    name: "Performance Reviewer",
    tier: 7,
    role: "Performance Reviewer",
    summary: "Scores presence and realism of performance budgets and degradation paths.",
    capabilities: ["budget-audit", "degradation-review", "vitals-review"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["performance-engineer"],
    mission: "Block acceptance when media-heavy packages lack budgets.",
    reviewCriteria: [
      {
        criterion: "Performance budgets exist and match the medium.",
        evidence: "QUALITY_CHECKLIST.md / ARCHITECTURE.md",
        severityIfMissed: "high",
      },
    ],
  }),
  buildSkill({
    slug: "security-reviewer",
    name: "Security Reviewer",
    tier: 7,
    role: "Security Reviewer",
    summary: "Scores safe handoff boundaries and least-privilege posture of the package.",
    capabilities: ["handoff-security", "permission-boundary-review", "threat-coverage-review"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["security-engineer-skill"],
    mission: "Ensure executionAuthorized stays false and secrets stay out of prompts.",
    reviewCriteria: [
      {
        criterion: "Execution remains unauthorized; prohibited ops listed.",
        evidence: "AGENT_EXECUTION_PACKAGE.md",
        severityIfMissed: "critical",
      },
    ],
  }),
  buildSkill({
    slug: "accessibility-reviewer",
    name: "Accessibility Reviewer",
    tier: 7,
    role: "Accessibility Reviewer",
    summary: "Scores inclusive interaction, semantics, and reduced-motion paths.",
    capabilities: ["a11y-gate-review", "reduced-motion-review", "semantics-review"],
    categoryKeys: [...REVIEW_CATEGORIES],
    dependencies: ["accessibility-specialist"],
    mission: "Reject immersive packages that ignore keyboard, SR, or reduced-motion.",
    reviewCriteria: [
      {
        criterion: "Accessibility and reduced-motion guidance present.",
        evidence: "DESIGN_SYSTEM.md / USER_FLOWS.md",
        severityIfMissed: "high",
      },
    ],
  }),
  buildSkill({
    slug: "awwwards-reviewer",
    name: "Awwwards Reviewer",
    tier: 7,
    role: "Awwwards Reviewer",
    summary: "Scores craft density, distinctiveness, and immersive experience integrity.",
    capabilities: ["craft-density-review", "distinctiveness-review", "experience-integrity"],
    categoryKeys: ["awwwards-website", "threejs-experience", "web-application"],
    dependencies: ["creative-director"],
    mission: "Fail empty design systems and template SaaS layouts posing as award craft.",
    principles: [
      "Craft density over adjectives.",
      "First viewport must be one composition.",
      "Motion and WebGL claims need budgets and inventories.",
    ],
    antiPatterns: [
      "Accepted packages with placeholder design sections.",
      "Card-grid heroes labeled award-winning.",
    ],
    reviewCriteria: [
      {
        criterion: "Design system contains concrete visual and motion constraints.",
        evidence: "DESIGN_SYSTEM.md craft sections",
        severityIfMissed: "critical",
      },
    ],
  }),
];
