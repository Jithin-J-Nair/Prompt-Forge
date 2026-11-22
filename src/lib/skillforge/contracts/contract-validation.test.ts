import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG_VERSION, PUBLISHED_SKILLS } from "../catalog.ts";
import { composeProjectPreview } from "../composer.ts";
import { toReviewAssessmentDocument } from "../council.ts";
import { BLUEPRINT_ARTIFACTS, REVIEW_COUNCIL_ROLES } from "../types.ts";
import { CONTRACT_PATHS } from "./paths.ts";
import {
  assertDependencyOrder,
  assertPackageCompleteness,
  readJsonFixture,
  validateContract,
} from "./validate.ts";

const fixtureBrief = "Build an enterprise AI recruiting platform";

test("starter catalog skills validate against skills/skill.schema.json", () => {
  for (const skill of PUBLISHED_SKILLS) {
    const result = validateContract("skill", skill);
    assert.equal(
      result.valid,
      true,
      `${skill.identity.slug}: ${result.errors.join("; ")}`,
    );
  }
});

test("representative Project DNA fixture validates and rejects fabricated unknowns", () => {
  const dna = readJsonFixture(CONTRACT_PATHS.fixtures.projectDna);
  const valid = validateContract("projectDna", dna);
  assert.equal(valid.valid, true, valid.errors.join("; "));

  const invalid = validateContract(
    "projectDna",
    readJsonFixture(CONTRACT_PATHS.fixtures.invalidProjectDna),
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((error) => error.includes("value")));
});

test("composed preview matches pinned skill-graph fixture and graph invariants", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: fixtureBrief,
  });
  const fixture = readJsonFixture(CONTRACT_PATHS.fixtures.skillGraph) as {
    catalogVersion: string;
    graphHash: string;
    nodes: unknown;
    edges: unknown;
  };

  const graphDocument = {
    schemaVersion: "1.0.0",
    fixtureId: "ai-recruiting-platform",
    catalogVersion: CATALOG_VERSION,
    categoryKey: preview.categoryKey,
    brief: preview.brief,
    graphHash: preview.graphHash,
    nodes: preview.graph.nodes,
    edges: preview.graph.edges,
  };

  const schemaResult = validateContract("skillGraph", graphDocument);
  assert.equal(schemaResult.valid, true, schemaResult.errors.join("; "));

  const fixtureResult = validateContract("skillGraph", fixture);
  assert.equal(fixtureResult.valid, true, fixtureResult.errors.join("; "));

  assert.equal(preview.graphHash, fixture.graphHash);
  assert.deepEqual(preview.graph.nodes, fixture.nodes);
  assert.deepEqual(preview.graph.edges, fixture.edges);
  assert.equal(fixture.catalogVersion, CATALOG_VERSION);

  const invariants = assertDependencyOrder(preview.graph);
  assert.equal(invariants.valid, true, invariants.errors.join("; "));
});

test("package fixture is accepted for export, completeness-consistent, and non-executable", () => {
  const pack = readJsonFixture(CONTRACT_PATHS.fixtures.draftPackage) as {
    requiredArtifacts: string[];
    presentArtifacts: string[];
    missingArtifacts: string[];
    accepted: boolean;
    executionReady: boolean;
    packageStatus: string;
    reviewStatus: string;
  };

  const schemaResult = validateContract("packageManifest", pack);
  assert.equal(schemaResult.valid, true, schemaResult.errors.join("; "));

  const completeness = assertPackageCompleteness(pack);
  assert.equal(completeness.valid, true, completeness.errors.join("; "));
  assert.deepEqual(pack.requiredArtifacts, [...BLUEPRINT_ARTIFACTS]);
  assert.equal(pack.presentArtifacts.length, BLUEPRINT_ARTIFACTS.length);
  assert.equal(pack.missingArtifacts.length, 0);
  assert.equal(pack.accepted, true);
  assert.equal(pack.executionReady, false);
  assert.equal(pack.packageStatus, "accepted");
  assert.equal(pack.reviewStatus, "passed");

  const invalidAccepted = validateContract(
    "packageManifest",
    readJsonFixture(CONTRACT_PATHS.fixtures.invalidAcceptedPackage),
  );
  assert.equal(invalidAccepted.valid, false);
});

test("review assessment fixtures cover not_started and passed council states", () => {
  const notStarted = readJsonFixture(CONTRACT_PATHS.fixtures.notStartedReview) as {
    requiredReviewers: string[];
    assessments: unknown[];
    reviewStatus: string;
  };
  const notStartedResult = validateContract("reviewAssessment", notStarted);
  assert.equal(notStartedResult.valid, true, notStartedResult.errors.join("; "));
  assert.deepEqual(notStarted.requiredReviewers, [...REVIEW_COUNCIL_ROLES]);
  assert.equal(notStarted.assessments.length, 0);
  assert.equal(notStarted.reviewStatus, "not_started");

  const passed = readJsonFixture(CONTRACT_PATHS.fixtures.passedReview) as {
    reviewStatus: string;
    assessments: unknown[];
    unresolvedFindings: unknown[];
  };
  const passedResult = validateContract("reviewAssessment", passed);
  assert.equal(passedResult.valid, true, passedResult.errors.join("; "));
  assert.equal(passed.reviewStatus, "passed");
  assert.equal(passed.assessments.length, 8);
  assert.equal(passed.unresolvedFindings.length, 0);
});

test("live composition council output validates against the review assessment contract", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: fixtureBrief,
  });
  const document = toReviewAssessmentDocument({
    schemaVersion: "1.0.0",
    reviewStatus: preview.reviewStatus,
    rubricVersion: preview.rubricVersion,
    requiredReviewers: preview.requiredReviewers,
    assessments: preview.council.assessments,
    unresolvedFindings: preview.council.unresolvedFindings,
    revisionRound: preview.council.revisionRound,
    overallMean: preview.council.overallMean,
    gate: {
      minimumReviewerScore: 80,
      minimumOverallMean: 80,
      passed: preview.council.gatePassed,
      reason: preview.council.gateReason,
    },
    revisionPlan: {
      blocked: !preview.council.gatePassed,
      maxRevisionRounds: preview.council.maxRevisionRounds,
      nextActions: preview.council.nextActions,
    },
  });
  const result = validateContract("reviewAssessment", document);
  assert.equal(result.valid, true, result.errors.join("; "));
});

test("export manifest fixture stays non-executable", () => {
  const handoff = readJsonFixture(CONTRACT_PATHS.fixtures.exportBlocked) as {
    handoffStatus: string;
    packageAccepted: boolean;
    executionAuthorized: boolean;
  };
  const result = validateContract("exportManifest", handoff);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(handoff.executionAuthorized, false);
});

test("preview Project DNA fields validate against the Project DNA contract", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: fixtureBrief,
  });
  const dnaDocument = {
    schemaVersion: "1.0.0",
    fixtureId: "ai-recruiting-platform",
    categoryKey: preview.categoryKey,
    brief: preview.brief,
    fields: preview.projectDna.fields,
  };
  const result = validateContract("projectDna", dnaDocument);
  assert.equal(result.valid, true, result.errors.join("; "));
});
