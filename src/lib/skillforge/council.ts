import councilRubric from "../../../reviewers/council-rubric-1.0.0.json";
import {
  BLUEPRINT_ARTIFACTS,
  REVIEW_COUNCIL_ROLES,
  type BlueprintArtifactKey,
  type CompositionPreview,
  type ProjectDnaField,
} from "./types.ts";

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
    passed: false;
    reason: string;
  };
  revisionPlan: {
    blocked: true;
    maxRevisionRounds: number;
    nextActions: string[];
  };
}

type DnaField = CompositionPreview["projectDna"]["fields"][number];
type ArtifactPreview = CompositionPreview["artifactPreviews"][number];

const UNKNOWN_MARKERS = [
  "Unknown — not inferred in this draft",
  "| unknown |",
  "Status: unknown",
];

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
      notes: penalty?.notes ?? "Deterministic baseline for draft package review.",
    };
  });
}

function assessReviewer(input: {
  role: ReviewerRole;
  focusArtifact: BlueprintArtifactKey;
  dimensions: readonly string[];
  artifacts: readonly ArtifactPreview[];
  unknownFields: readonly ProjectDnaField[];
  missingArtifacts: readonly BlueprintArtifactKey[];
}): CouncilAssessment {
  const artifact = artifactByKey(input.artifacts, input.focusArtifact);
  const penalties: { name: string; delta: number; notes: string }[] = [];
  let score = 88;

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
      score -= Math.min(50, 12 * unknownHits);
      penalties.push({
        name: input.dimensions[0] ?? "requirementCoverage",
        delta: -Math.min(40, 10 * unknownHits),
        notes: `${unknownHits} unresolved unknown marker(s) in ${input.focusArtifact}.`,
      });
    }
    if (!artifact.content.includes("DRAFT PREVIEW")) {
      score -= 15;
      penalties.push({
        name: input.dimensions[1] ?? input.dimensions[0] ?? "clarity",
        delta: -10,
        notes: "Draft banner missing; package status is unclear.",
      });
    }
  }

  if (input.missingArtifacts.length > 0) {
    score -= 25;
    penalties.push({
      name: input.dimensions[0] ?? "requirementCoverage",
      delta: -20,
      notes: `Package still missing ${input.missingArtifacts.length} required artifact(s).`,
    });
  }

  if (input.unknownFields.length >= 8) {
    score -= 20;
    penalties.push({
      name: input.dimensions[1] ?? input.dimensions[0] ?? "evidence",
      delta: -15,
      notes: `${input.unknownFields.length} Project DNA fields remain unknown.`,
    });
  }

  if (input.role === "Security Engineer") {
    const handoff = artifactByKey(input.artifacts, "AGENT_EXECUTION_PACKAGE.md");
    if (handoff?.content.includes("Execution authorized: false")) {
      score += 8;
      penalties.push({
        name: "safeHandoff",
        delta: 5,
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

  if (input.role === "Awwwards Reviewer" || input.role === "Creative Director") {
    // Aesthetic judgment cannot override unresolved product/system unknowns.
    if (input.unknownFields.length > 0) {
      score = Math.min(score, 55);
      penalties.push({
        name: input.dimensions[0] ?? "craft",
        delta: -20,
        notes: "Craft scoring capped while core Project DNA remains unresolved.",
      });
    }
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
      severity: "high",
      summary: `Project DNA still unknown for: ${unknownFields.join(", ")}`,
      acceptanceCondition:
        "Resolve or explicitly mark not_applicable with rationale for blocking DNA fields; do not invent facts.",
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

  findings.push({
    severity: "critical",
    summary: "Package remains draft and must not be accepted without a passing Review Council gate.",
    acceptanceCondition:
      "All mandatory reviewers pass thresholds with zero unresolved critical/high findings.",
  });

  return findings;
}

export function runReviewCouncil(input: {
  artifacts: readonly ArtifactPreview[];
  fields: readonly DnaField[];
  missingArtifacts: readonly BlueprintArtifactKey[];
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
    }),
  );

  const overallMean = clampScore(mean(assessments.map((assessment) => assessment.score)));
  const unresolvedFindings = findingsFromAssessments(
    assessments,
    unknownFields,
    missingArtifacts,
    councilRubric.gates.minimumReviewerScore,
  );
  const hasBlockingFinding = unresolvedFindings.some(
    (finding) => finding.severity === "critical" || finding.severity === "high",
  );
  const belowThreshold = assessments.some(
    (assessment) => assessment.score < councilRubric.gates.minimumReviewerScore,
  );
  const reviewStatus: CouncilResult["reviewStatus"] =
    hasBlockingFinding || belowThreshold || overallMean < councilRubric.gates.minimumOverallMean
      ? "blocked"
      : "failed";

  // Acceptance is intentionally unreachable in this phase while DNA unknowns remain and
  // revision regeneration is not yet implemented.
  const nextActions = [
    "Keep package status draft; do not export or execute.",
    "Resolve blocking Project DNA unknowns with confirmed evidence or explicit not_applicable rationale.",
    "Regenerate affected draft artifacts after DNA updates, then re-run the Review Council.",
    `Revision budget remaining: ${councilRubric.gates.maxRevisionRounds} automated rounds (none consumed).`,
  ];

  return {
    schemaVersion: "1.0.0",
    reviewStatus,
    rubricVersion: RUBRIC_VERSION,
    requiredReviewers: [...REVIEW_COUNCIL_ROLES],
    assessments,
    unresolvedFindings,
    revisionRound: 0,
    overallMean,
    gate: {
      minimumReviewerScore: councilRubric.gates.minimumReviewerScore,
      minimumOverallMean: councilRubric.gates.minimumOverallMean,
      passed: false,
      reason:
        "Review Council blocked acceptance: unresolved high/critical findings remain and package stays draft.",
    },
    revisionPlan: {
      blocked: true,
      maxRevisionRounds: councilRubric.gates.maxRevisionRounds,
      nextActions,
    },
  };
}

export function toReviewAssessmentDocument(
  council: CouncilResult,
  fixtureId = "ai-recruiting-platform",
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
