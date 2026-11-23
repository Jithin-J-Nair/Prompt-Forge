import councilRubric from "../../../reviewers/council-rubric-1.0.0.json";
import { PLACEHOLDER_BAN_PHRASE } from "./blueprints-content.ts";
import {
  BLUEPRINT_ARTIFACTS,
  REVIEW_COUNCIL_ROLES,
  type BlueprintArtifactKey,
  type CompositionPreview,
  type ProjectDnaField,
} from "./types.ts";

const MUSH_MARKERS = [
  PLACEHOLDER_BAN_PHRASE,
  "Derive visual/interaction principles from core features:",
  "system composes expertise package",
  "expressive interactive experience",
];

const IMMERSIVE_CRAFT_MARKERS = [
  "Motion language",
  "full-bleed",
  "Scene inventory",
  "60fps",
  "reduced-motion",
  "Buttons / CTAs",
  "Image / media placeholders",
  "Scroll theater",
  "Experience thesis",
  "North star concept",
  "Art bible",
  "Beat sheet",
  "Craft lenses",
  "Token sheet",
  "Motion scorecard",
  "Beat grid",
  "Ownership matrix",
  "ASSET_SPEC",
  "Concept fingerprint",
  "Selected concept",
  "Creative coherence",
  "Brief intelligence",
  "Technical creative direction",
];

const FUNCTIONAL_CRAFT_MARKERS = [
  "Experience thesis",
  "Concept fingerprint",
  "Selected concept",
  "Creative coherence",
  "Brief intelligence",
  "Token sheet",
  "Technical creative direction",
  "What NOT to build",
];

const BRAND_CRAFT_MARKERS = [
  "Experience thesis",
  "Concept fingerprint",
  "Selected concept",
  "Brand test",
  "Creative coherence",
  "Token sheet",
  "Brief intelligence",
];

/** Frozen boilerplate pillars from the pre-synth era — must not be the only creative law. */
const BOILERPLATE_PILLAR_MARKERS = [
  "Presence — first viewport is one composition.",
  "Authored motion — signature beats with owners (GSAP / R3F / shader).",
  "Restraint — silence between beats; chrome stays quiet.",
  "Honesty — inferences labeled; no fake award claims.",
];

export const RUBRIC_VERSION = `${councilRubric.rubricId}@${councilRubric.version}`;

export type ReviewerRole = (typeof REVIEW_COUNCIL_ROLES)[number];

export interface CouncilAssessment {
  reviewer: ReviewerRole;
  score: number;
  evidence: string;
  artifactLogicalKey: BlueprintArtifactKey;
  dimensionScores: { name: string; score: number; notes: string }[];
}

export interface CouncilFinding {
  severity: "critical" | "high" | "medium" | "low";
  summary: string;
  acceptanceCondition: string;
  artifactLogicalKey?: BlueprintArtifactKey;
  reviewer?: ReviewerRole;
}

export interface CouncilResult {
  schemaVersion: "1.0.0";
  reviewStatus: "failed" | "blocked" | "passed";
  rubricVersion: string;
  requiredReviewers: ReviewerRole[];
  assessments: CouncilAssessment[];
  unresolvedFindings: CouncilFinding[];
  revisionRound: number;
  overallMean: number;
  gate: {
    minimumReviewerScore: number;
    minimumOverallMean: number;
    passed: boolean;
    reason: string;
  };
  revisionPlan: {
    blocked: boolean;
    maxRevisionRounds: number;
    nextActions: string[];
  };
}

type DnaField = CompositionPreview["projectDna"]["fields"][number];
type ArtifactPreview = CompositionPreview["artifactPreviews"][number];

const UNKNOWN_MARKERS = ["Unknown — not inferred in this draft", "Status: unknown"];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function artifactByKey(
  artifacts: readonly ArtifactPreview[],
  key: BlueprintArtifactKey,
): ArtifactPreview | undefined {
  return artifacts.find((artifact) => artifact.logicalKey === key);
}

function countUnknownMarkers(content: string): number {
  return UNKNOWN_MARKERS.reduce(
    (count, marker) => count + (content.includes(marker) ? 1 : 0),
    0,
  );
}

function unknownDnaFields(fields: readonly DnaField[]): ProjectDnaField[] {
  return fields.filter((field) => field.status === "unknown").map((field) => field.name);
}

function scoreDimensions(
  names: readonly string[],
  base: number,
  penalties: { name: string; delta: number; notes: string }[],
): { name: string; score: number; notes: string }[] {
  return names.map((name) => {
    const penalty = penalties.find((entry) => entry.name === name);
    const score = Math.max(1, Math.min(5, Math.round((base + (penalty?.delta ?? 0)) / 20)));
    return {
      name,
      score,
      notes: penalty?.notes ?? "Deterministic baseline for package review.",
    };
  });
}

function detectPackageMode(artifacts: readonly ArtifactPreview[]): "immersive" | "saas" | "brand" | "general" {
  const all = artifacts.map((artifact) => artifact.content).join("\n").toLowerCase();
  if (/category mode:\s*immersive|awwwards-class|webgl-first|scene inventory/.test(all)) {
    return "immersive";
  }
  if (/category mode:\s*saas|job-first|product workbench|spectacle cosplay/.test(all)) {
    return "saas";
  }
  if (/category mode:\s*brand|brand-swap|brand-first composition/.test(all)) {
    return "brand";
  }
  return "general";
}

function assessCraftDensity(
  artifacts: readonly ArtifactPreview[],
  role: ReviewerRole,
  immersiveCategory: boolean,
): { delta: number; notes: string }[] {
  const penalties: { delta: number; notes: string }[] = [];
  const design = artifactByKey(artifacts, "DESIGN_SYSTEM.md");
  const experience = artifactByKey(artifacts, "EXPERIENCE_DNA.md");
  const creative = artifactByKey(artifacts, "CREATIVE_DIRECTION.md");
  const art = artifactByKey(artifacts, "ART_DIRECTION.md");
  const story = artifactByKey(artifacts, "STORY_SYSTEM.md");
  const architecture = artifactByKey(artifacts, "ARCHITECTURE.md");
  const flows = artifactByKey(artifacts, "USER_FLOWS.md");
  const all = artifacts.map((artifact) => artifact.content).join("\n");
  const mode = immersiveCategory ? "immersive" : detectPackageMode(artifacts);

  for (const marker of MUSH_MARKERS) {
    if (all.includes(marker)) {
      penalties.push({
        delta: marker === PLACEHOLDER_BAN_PHRASE ? -50 : -18,
        notes: `Craft density failure: mush/placeholder marker present (${marker.slice(0, 48)}…).`,
      });
    }
  }

  // Critical coherence failures — only when AI-default looks are prescribed, not when forbidden.
  // Anti-pattern sections intentionally mention purple/glassmorphism; do not false-positive those.
  const prescribedAiDefault =
    /\b(use|ship|apply|default to)\b[^.\\n]{0,80}\b(purple gradient|glassmorphism-by-default|lorem ipsum)\b/i.test(
      all,
    ) || /\blorem ipsum\b/i.test(all.replace(/never ship[\s\S]*?(?=\\n## |$)/gi, ""));
  if (prescribedAiDefault) {
    penalties.push({
      delta: -40,
      notes: "Critical coherence failure: pack appears to prescribe AI-default / placeholder content.",
    });
  }

  if (immersiveCategory && design && design.content.length < 1200) {
    penalties.push({
      delta: -22,
      notes: `DESIGN_SYSTEM.md too thin (${design.content.length} chars) for immersive craft export.`,
    });
  } else if (!immersiveCategory && design && design.content.length < 450) {
    penalties.push({
      delta: -16,
      notes: `DESIGN_SYSTEM.md too thin (${design.content.length} chars).`,
    });
  }

  if (immersiveCategory) {
    for (const [key, artifact, min] of [
      ["EXPERIENCE_DNA.md", experience, 700],
      ["CREATIVE_DIRECTION.md", creative, 650],
      ["ART_DIRECTION.md", art, 650],
      ["STORY_SYSTEM.md", story, 700],
    ] as const) {
      if (artifact && artifact.content.length < min) {
        penalties.push({
          delta: -18,
          notes: `${key} too thin (${artifact.content.length} chars) for immersive craft export.`,
        });
      }
    }
  } else if (mode === "saas" || mode === "brand") {
    if (experience && experience.content.length < 900) {
      penalties.push({
        delta: -20,
        notes: `EXPERIENCE_DNA.md too thin (${experience.content.length} chars) for ${mode} craft export.`,
      });
    }
    if (creative && !/Selected direction|Selected concept/i.test(creative.content)) {
      penalties.push({
        delta: -24,
        notes: "CREATIVE_DIRECTION missing selected concept — no concept selection evidence.",
      });
    }
  }

  if (
    immersiveCategory &&
    (role === "Awwwards Reviewer" ||
      role === "Creative Director" ||
      role === "Systems Architect" ||
      role === "Performance Engineer")
  ) {
    const missing = IMMERSIVE_CRAFT_MARKERS.filter((marker) => !all.includes(marker));
    if (missing.length > 0) {
      penalties.push({
        delta: -12 * Math.min(4, missing.length),
        notes: `Immersive craft markers missing: ${missing.join(", ")}.`,
      });
    }
    if (
      architecture &&
      /Modular monolith with clear domain boundaries/i.test(architecture.content) &&
      !/Experience-host|Scene inventory/i.test(architecture.content)
    ) {
      penalties.push({
        delta: -28,
        notes: "Architecture still describes generic SaaS monolith for an immersive package.",
      });
    }
    if (flows && /composes expertise package/i.test(flows.content)) {
      penalties.push({
        delta: -24,
        notes: "USER_FLOWS describes SkillForge compose loop instead of visitor journey.",
      });
    }

    const boilerplateHits = BOILERPLATE_PILLAR_MARKERS.filter((marker) => all.includes(marker));
    const hasFingerprint = /Concept fingerprint/i.test(all);
    const hasMotifPillar = /Motif lock/i.test(all);
    if (boilerplateHits.length >= 3 && !hasMotifPillar) {
      penalties.push({
        delta: -35,
        notes: "Creative pillars match frozen category boilerplate — not brief-specific concept synth.",
      });
    }
    if (!hasFingerprint) {
      penalties.push({
        delta: -20,
        notes: "Missing Concept fingerprint — creative artifacts are not brief-locked.",
      });
    }

    const artContent = art?.content ?? "";
    if (!/#[0-9A-Fa-f]{6}/.test(artContent) && !/oklch\(/i.test(artContent)) {
      penalties.push({
        delta: -30,
        notes: "ART_DIRECTION missing hex/oklch token sheet — agents will freestyle AI-default looks.",
      });
    }
    if (!/Display face:/i.test(artContent) && !/display face/i.test(all)) {
      penalties.push({
        delta: -18,
        notes: "ART_DIRECTION / DESIGN_SYSTEM missing named display face.",
      });
    }
    if (
      architecture &&
      /Arrival \/ brand world/i.test(architecture.content) &&
      !/Camera:/i.test(architecture.content)
    ) {
      penalties.push({
        delta: -26,
        notes: "Scene inventory still generic act names without camera/asset/shader rows.",
      });
    }
    if (!/Motion scorecard/i.test(all) || !/Beat grid/i.test(all)) {
      penalties.push({
        delta: -22,
        notes: "Missing Motion scorecard / Beat grid — authored motion cannot be enforced.",
      });
    }
  }

  if (
    !immersiveCategory &&
    (mode === "saas" || mode === "general") &&
    (role === "Creative Director" ||
      role === "Product Strategist" ||
      role === "UX Architect" ||
      role === "Systems Architect")
  ) {
    const missing = FUNCTIONAL_CRAFT_MARKERS.filter((marker) => !all.includes(marker));
    if (missing.length > 0) {
      penalties.push({
        delta: -10 * Math.min(4, missing.length),
        notes: `Functional craft markers missing: ${missing.join(", ")}.`,
      });
    }
    if (/Scene inventory|shader accent|WebGL-first/i.test(all) && /spectacle cosplay|job-first/i.test(all) === false) {
      // spectacle leaking into functional packs without justification
      if (/three\.js|R3F|shader budget/i.test(architecture?.content ?? "") && mode === "saas") {
        penalties.push({
          delta: -28,
          notes: "Critical: SaaS/functional package recommends WebGL/shader spectacle without job justification.",
        });
      }
    }
  }

  if (
    !immersiveCategory &&
    mode === "brand" &&
    (role === "Creative Director" || role === "Awwwards Reviewer" || role === "UX Architect")
  ) {
    const missing = BRAND_CRAFT_MARKERS.filter((marker) => !all.includes(marker));
    if (missing.length > 0) {
      penalties.push({
        delta: -10 * Math.min(4, missing.length),
        notes: `Brand craft markers missing: ${missing.join(", ")}.`,
      });
    }
  }

  if (!/Selected concept/i.test(all) && (role === "Creative Director" || role === "Awwwards Reviewer")) {
    penalties.push({
      delta: -22,
      notes: "Missing Selected concept — creative exploration/selection did not land in artifacts.",
    });
  }

  return penalties;
}

function assessReviewer(input: {
  role: ReviewerRole;
  focusArtifact: BlueprintArtifactKey;
  dimensions: readonly string[];
  artifacts: readonly ArtifactPreview[];
  unknownFields: readonly ProjectDnaField[];
  missingArtifacts: readonly BlueprintArtifactKey[];
  immersiveCategory: boolean;
}): CouncilAssessment {
  const artifact = artifactByKey(input.artifacts, input.focusArtifact);
  const penalties: { name: string; delta: number; notes: string }[] = [];
  let score = 90;

  if (!artifact) {
    score = 20;
    penalties.push({
      name: input.dimensions[0] ?? "requirementCoverage",
      delta: -60,
      notes: `Focus artifact ${input.focusArtifact} is missing.`,
    });
  } else {
    const unknownHits = countUnknownMarkers(artifact.content);
    if (unknownHits > 0) {
      score -= Math.min(36, 8 * unknownHits);
      penalties.push({
        name: input.dimensions[0] ?? "requirementCoverage",
        delta: -Math.min(24, 6 * unknownHits),
        notes: `${unknownHits} unresolved unknown marker(s) in ${input.focusArtifact}.`,
      });
    }
    if (
      !artifact.content.includes("DRAFT PACKAGE") &&
      !artifact.content.includes("ACCEPTED FOR EXPORT")
    ) {
      score -= 10;
      penalties.push({
        name: input.dimensions[1] ?? input.dimensions[0] ?? "clarity",
        delta: -8,
        notes: "Package status banner missing.",
      });
    }
  }

  for (const craftPenalty of assessCraftDensity(
    input.artifacts,
    input.role,
    input.immersiveCategory,
  )) {
    score += craftPenalty.delta;
    penalties.push({
      name: input.dimensions[0] ?? "craft",
      delta: craftPenalty.delta,
      notes: craftPenalty.notes,
    });
  }

  if (input.missingArtifacts.length > 0) {
    score -= 25;
    penalties.push({
      name: input.dimensions[0] ?? "requirementCoverage",
      delta: -20,
      notes: `Package still missing ${input.missingArtifacts.length} required artifact(s).`,
    });
  }

  if (input.unknownFields.length >= 5) {
    score -= 18;
    penalties.push({
      name: input.dimensions[1] ?? input.dimensions[0] ?? "evidence",
      delta: -12,
      notes: `${input.unknownFields.length} Project DNA fields remain unknown.`,
    });
  } else if (input.unknownFields.length > 0) {
    score -= 6 * input.unknownFields.length;
    penalties.push({
      name: input.dimensions[1] ?? input.dimensions[0] ?? "evidence",
      delta: -4 * input.unknownFields.length,
      notes: `${input.unknownFields.length} Project DNA field(s) remain unknown.`,
    });
  }

  if (input.role === "Security Engineer") {
    const handoff = artifactByKey(input.artifacts, "AGENT_EXECUTION_PACKAGE.md");
    if (handoff?.content.includes("Execution authorized: false")) {
      score += 6;
      penalties.push({
        name: "safeHandoff",
        delta: 4,
        notes: "Execution remains unauthorized; safe handoff boundary preserved.",
      });
    } else {
      score -= 40;
      penalties.push({
        name: "safeHandoff",
        delta: -30,
        notes: "Execution authorization boundary is not explicitly false.",
      });
    }
  }

  if (
    (input.role === "Awwwards Reviewer" || input.role === "Creative Director") &&
    input.unknownFields.length >= 3
  ) {
    score = Math.min(score, 72);
    penalties.push({
      name: input.dimensions[0] ?? "craft",
      delta: -10,
      notes: "Craft scoring tempered while multiple DNA unknowns remain.",
    });
  }

  const finalScore = clampScore(score);
  const dimensionScores = scoreDimensions(input.dimensions, finalScore, penalties);
  const evidence = [
    `Reviewed \`${input.focusArtifact}\` against rubric \`${RUBRIC_VERSION}\`.`,
    `Deterministic score ${finalScore}/100.`,
    ...penalties.map((penalty) => penalty.notes),
  ].join(" ");

  return {
    reviewer: input.role,
    score: finalScore,
    evidence,
    artifactLogicalKey: input.focusArtifact,
    dimensionScores,
  };
}

function findingsFromAssessments(
  assessments: readonly CouncilAssessment[],
  unknownFields: readonly ProjectDnaField[],
  missingArtifacts: readonly BlueprintArtifactKey[],
  minimumReviewerScore: number,
): CouncilFinding[] {
  const findings: CouncilFinding[] = [];

  if (missingArtifacts.length > 0) {
    findings.push({
      severity: "critical",
      summary: `Missing required artifacts: ${missingArtifacts.join(", ")}`,
      acceptanceCondition: "Generate every canonical artifact before acceptance.",
    });
  }

  if (unknownFields.length > 0) {
    findings.push({
      severity: unknownFields.length >= 3 ? "high" : "medium",
      summary: `Project DNA still unknown for: ${unknownFields.join(", ")}`,
      acceptanceCondition:
        "Resolve remaining unknowns or mark not_applicable with rationale.",
      artifactLogicalKey: "PROJECT_DNA.md",
    });
  }

  for (const assessment of assessments) {
    if (assessment.score < minimumReviewerScore) {
      findings.push({
        severity: assessment.score < 50 ? "critical" : "high",
        summary: `${assessment.reviewer} scored ${assessment.score}/100 (below ${minimumReviewerScore}).`,
        acceptanceCondition: `${assessment.reviewer} must reach at least ${minimumReviewerScore}/100 with evidence on ${assessment.artifactLogicalKey}.`,
        artifactLogicalKey: assessment.artifactLogicalKey,
        reviewer: assessment.reviewer,
      });
    }
    for (const dimension of assessment.dimensionScores) {
      if (dimension.score < councilRubric.gates.minimumDimensionScore) {
        findings.push({
          severity: "high",
          summary: `${assessment.reviewer} dimension ${dimension.name} scored ${dimension.score}/5.`,
          acceptanceCondition: `Raise ${dimension.name} to at least ${councilRubric.gates.minimumDimensionScore}/5 with cited evidence.`,
          artifactLogicalKey: assessment.artifactLogicalKey,
          reviewer: assessment.reviewer,
        });
      }
    }
  }

  return findings;
}

export function runReviewCouncil(input: {
  artifacts: readonly ArtifactPreview[];
  fields: readonly DnaField[];
  missingArtifacts: readonly BlueprintArtifactKey[];
  revisionRound?: number;
  categoryKey?: string;
}): CouncilResult {
  const unknownFields = unknownDnaFields(input.fields);
  const presentKeys = new Set(input.artifacts.map((artifact) => artifact.logicalKey));
  const missingArtifacts = [
    ...input.missingArtifacts,
    ...BLUEPRINT_ARTIFACTS.filter(
      (required) =>
        !presentKeys.has(required) && !input.missingArtifacts.includes(required),
    ),
  ];
  const immersiveCategory =
    input.categoryKey === "awwwards-website" || input.categoryKey === "threejs-experience";

  const assessments = (councilRubric.reviewers as {
    role: ReviewerRole;
    focusArtifact: BlueprintArtifactKey;
    dimensions: string[];
  }[]).map((reviewer) =>
    assessReviewer({
      role: reviewer.role,
      focusArtifact: reviewer.focusArtifact,
      dimensions: reviewer.dimensions,
      artifacts: input.artifacts,
      unknownFields,
      missingArtifacts,
      immersiveCategory,
    }),
  );

  const overallMean = clampScore(mean(assessments.map((assessment) => assessment.score)));
  let unresolvedFindings = findingsFromAssessments(
    assessments,
    unknownFields,
    missingArtifacts,
    councilRubric.gates.minimumReviewerScore,
  );

  // Category-adaptive: critical craft failures in evidence cannot be hidden by mean scores.
  for (const assessment of assessments) {
    if (/Critical(?:\s+coherence)?(?:\s+failure)?:/i.test(assessment.evidence)) {
      unresolvedFindings.push({
        severity: "critical",
        summary: `${assessment.reviewer}: critical craft/coherence failure (not averageable).`,
        acceptanceCondition:
          "Resolve critical craft/coherence failures; mean score alone cannot pass the gate.",
        artifactLogicalKey: assessment.artifactLogicalKey,
        reviewer: assessment.reviewer,
      });
    }
  }

  const belowThreshold = assessments.some(
    (assessment) => assessment.score < councilRubric.gates.minimumReviewerScore,
  );
  const hasCriticalFinding = unresolvedFindings.some((finding) => finding.severity === "critical");
  const hasBlockingFinding = unresolvedFindings.some(
    (finding) => finding.severity === "critical" || finding.severity === "high",
  );
  const meanOk = overallMean >= councilRubric.gates.minimumOverallMean;
  // Critical findings always block — even if overall mean looks fine.
  const passed =
    !belowThreshold &&
    !hasBlockingFinding &&
    !hasCriticalFinding &&
    meanOk &&
    missingArtifacts.length === 0;

  if (!passed) {
    unresolvedFindings = [
      ...unresolvedFindings,
      {
        severity: "critical",
        summary: "Package is not accepted for export yet.",
        acceptanceCondition:
          "Clear all critical/high findings and meet reviewer score thresholds.",
      },
    ];
  }

  const reviewStatus: CouncilResult["reviewStatus"] = passed
    ? "passed"
    : hasBlockingFinding || belowThreshold
      ? "blocked"
      : "failed";

  const nextActions = passed
    ? [
        "Export the accepted instructional package.",
        "Do not treat export as execution authority.",
        "Keep executionAuthorized=false for any external agent.",
      ]
    : [
        "Keep package status draft; do not execute.",
        "Resolve blocking Project DNA unknowns or lower-severity open questions.",
        "Regenerate affected artifacts and re-run Review Council.",
        `Revision budget remaining: ${Math.max(0, councilRubric.gates.maxRevisionRounds - (input.revisionRound ?? 0))}.`,
      ];

  return {
    schemaVersion: "1.0.0",
    reviewStatus,
    rubricVersion: RUBRIC_VERSION,
    requiredReviewers: [...REVIEW_COUNCIL_ROLES],
    assessments,
    unresolvedFindings,
    revisionRound: input.revisionRound ?? 0,
    overallMean,
    gate: {
      minimumReviewerScore: councilRubric.gates.minimumReviewerScore,
      minimumOverallMean: councilRubric.gates.minimumOverallMean,
      passed,
      reason: passed
        ? "Review Council passed export acceptance gates. Execution remains unauthorized."
        : buildBlockedReason(unresolvedFindings, overallMean, assessments),
    },
    revisionPlan: {
      blocked: !passed,
      maxRevisionRounds: councilRubric.gates.maxRevisionRounds,
      nextActions,
    },
  };
}

function buildBlockedReason(
  findings: readonly CouncilFinding[],
  overallMean: number,
  assessments: readonly CouncilAssessment[],
): string {
  const actionable = findings.find(
    (finding) =>
      finding.severity === "critical" ||
      finding.severity === "high" ||
      finding.severity === "medium",
  );
  const weakest = [...assessments].sort((a, b) => a.score - b.score)[0];
  const parts = [
    "Review Council blocked acceptance.",
    actionable ? actionable.summary : `Overall mean ${overallMean}/100.`,
  ];
  if (weakest && weakest.score < councilRubric.gates.minimumReviewerScore) {
    parts.push(
      `Weakest reviewer: ${weakest.reviewer} at ${weakest.score}/100 (need ${councilRubric.gates.minimumReviewerScore}).`,
    );
  }
  parts.push("Add a clearer user/problem in the brief, then compose again.");
  return parts.join(" ");
}

export function toReviewAssessmentDocument(
  council: CouncilResult,
  fixtureId = "composition-run",
) {
  return {
    schemaVersion: "1.0.0" as const,
    fixtureId,
    reviewStatus: council.reviewStatus,
    rubricVersion: council.rubricVersion,
    requiredReviewers: council.requiredReviewers,
    assessments: council.assessments.map((assessment) => ({
      reviewer: assessment.reviewer,
      score: assessment.score,
      evidence: assessment.evidence,
      artifactLogicalKey: assessment.artifactLogicalKey,
    })),
    unresolvedFindings: council.unresolvedFindings.map((finding) => ({
      severity: finding.severity,
      summary: finding.summary,
      acceptanceCondition: finding.acceptanceCondition,
      artifactLogicalKey: finding.artifactLogicalKey,
    })),
    revisionRound: council.revisionRound,
  };
}
