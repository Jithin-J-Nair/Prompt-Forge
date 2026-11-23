import { analyzeBrief } from "./brief-intelligence.ts";
import type { ProjectCategoryKey } from "./categories.ts";

/**
 * Deterministic short-brief expansion.
 * Turns thin user intent into richer craft/product hypotheses (still inferred, not confirmed).
 */
export function expandBriefHypotheses(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
}): {
  expandedIntent: string;
  craftTargets: string[];
  productTargets: string[];
  referenceHypothesis: string | null;
} {
  const brief = input.brief.trim();
  const lower = brief.toLowerCase();
  const intel = analyzeBrief({ brief, categoryKey: input.categoryKey });
  const immersive = intel.categoryMode === "immersive";

  const reference =
    brief.match(/\blike\s+([a-z0-9][a-z0-9.-]{2,60})/i)?.[1] ??
    brief.match(/\binspired by\s+([^.!?]{3,60})/i)?.[1] ??
    null;

  const craftTargets = immersive
    ? [
        "First viewport: one composition (brand, headline, line, CTA, full-bleed visual)",
        "Button/CTA micro-interactions with focus-visible states",
        "Image/placeholder load + reveal motion",
        "Scroll theater with 3–6 narrative chapters",
        "GSAP timeline ownership for DOM captions/progress",
        "R3F/Three scene chapters where craft requires, with FPS budgets",
        "Reduced-motion and low-power quality presets",
        "Selected concept + coherence checklist enforced",
      ]
    : intel.categoryMode === "saas"
      ? [
          "Clear primary task path with empty/loading/error/recovery states",
          "Job-first hierarchy; no spectacle cosplay",
          "Consistent design tokens (type, color, space)",
          "Accessible keyboard flows for critical tasks",
          "Performance budgets on primary routes",
          ...intel.doNotBuild.slice(0, 2),
        ]
      : intel.categoryMode === "brand"
        ? [
            "Brand-first first viewport (pass brand-swap test)",
            "Distinctive material/type thesis from brief motifs",
            "Proof chapters without promo clutter",
            "Invite CTA as narrative landing",
            "Coherence checklist over feature count",
          ]
        : [
            "Clear primary task path with empty/loading/error/recovery states",
            "Consistent design tokens (type, color, space)",
            "Accessible keyboard flows for critical tasks",
            "Performance budgets on primary routes",
          ];

  const productTargets = immersive
    ? [
        "Brand/experience promise readable in seconds",
        "Proof of craft through interactive chapters (not brochure walls)",
        "Invite/contact landing as narrative CTA",
      ]
    : input.categoryKey.startsWith("ai") || input.categoryKey === "rag-platform"
      ? [
          "Explicit AI job-to-be-done and eval gates",
          "Trust boundaries for untrusted text vs tools",
          "Operator + end-user paths labeled",
        ]
      : [
          "Observable user outcomes before feature sprawl",
          "Scoped v1 vs later",
          "Success metrics hypotheses",
          `Audience hypothesis: ${intel.audience.text}`,
        ];

  const expandedIntent = [
    `User brief: ${brief}`,
    `Category lens: ${input.categoryKey.replace(/-/g, " ")} (${intel.categoryMode}).`,
    `Why (hypothesis): ${intel.why.text}.`,
    immersive
      ? "Expanded intent (hypothesis): deliver a craft-led immersive web experience with authored motion and optional WebGL chapters that an external agent can implement from SkillForge artifacts."
      : `Expanded intent (hypothesis): deliver a bounded ${intel.categoryMode} outcome with clear users, flows, architecture, and quality gates an external agent can implement.`,
    reference
      ? `Reference signal (hypothesis, not a clone requirement): principles inspired by “${reference}”.`
      : null,
    `Do-not-build lock: ${intel.doNotBuild.slice(0, 2).join("; ")}.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    expandedIntent,
    craftTargets,
    productTargets,
    referenceHypothesis: reference,
  };
}
