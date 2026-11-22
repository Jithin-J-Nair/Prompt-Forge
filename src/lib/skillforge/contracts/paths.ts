import path from "node:path";

/** Repository root resolved from this module (`src/lib/skillforge/contracts`). */
export const REPO_ROOT = path.resolve(import.meta.dirname, "../../../..");

export const CONTRACT_PATHS = {
  skillSchema: path.join(REPO_ROOT, "skills/skill.schema.json"),
  projectDnaSchema: path.join(REPO_ROOT, "projects/project-dna.schema.json"),
  skillGraphSchema: path.join(REPO_ROOT, "composer/skill-graph.schema.json"),
  packageManifestSchema: path.join(
    REPO_ROOT,
    "blueprints/package-manifest.schema.json",
  ),
  reviewAssessmentSchema: path.join(
    REPO_ROOT,
    "reviewers/review-assessment.schema.json",
  ),
  exportManifestSchema: path.join(
    REPO_ROOT,
    "agents/export-manifest.schema.json",
  ),
  fixtures: {
    projectDna: path.join(
      REPO_ROOT,
      "projects/fixtures/ai-recruiting.project-dna.json",
    ),
    invalidProjectDna: path.join(
      REPO_ROOT,
      "projects/fixtures/invalid-unknown-with-value.project-dna.json",
    ),
    skillGraph: path.join(
      REPO_ROOT,
      "composer/fixtures/ai-recruiting.skill-graph.json",
    ),
    draftPackage: path.join(
      REPO_ROOT,
      "blueprints/fixtures/ai-recruiting.draft-package.json",
    ),
    invalidAcceptedPackage: path.join(
      REPO_ROOT,
      "blueprints/fixtures/invalid-accepted-incomplete.package.json",
    ),
    notStartedReview: path.join(
      REPO_ROOT,
      "reviewers/fixtures/ai-recruiting.not-started-review.json",
    ),
    passedReview: path.join(
      REPO_ROOT,
      "reviewers/fixtures/ai-recruiting.passed-review.json",
    ),
    exportBlocked: path.join(
      REPO_ROOT,
      "agents/fixtures/ai-recruiting.export-blocked.json",
    ),
  },
} as const;
