import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG_VERSION, STARTER_SKILLS } from "../catalog.ts";
import { composeProjectPreview } from "../composer.ts";
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
  for (const skill of STARTER_SKILLS) {
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

test("draft package fixture is complete as drafts, non-accepted, and completeness-consistent", () => {
  const draft = readJsonFixture(CONTRACT_PATHS.fixtures.draftPackage) as {
    requiredArtifacts: string[];
    presentArtifacts: string[];
    missingArtifacts: string[];
    accepted: boolean;
    executionReady: boolean;
    packageStatus: string;
    reviewStatus: string;
  };

  const schemaResult = validateContract("packageManifest", draft);
  assert.equal(schemaResult.valid, true, schemaResult.errors.join("; "));

  const completeness = assertPackageCompleteness(draft);
  assert.equal(completeness.valid, true, completeness.errors.join("; "));
  assert.deepEqual(draft.requiredArtifacts, [...BLUEPRINT_ARTIFACTS]);
  assert.equal(draft.presentArtifacts.length, BLUEPRINT_ARTIFACTS.length);
  assert.equal(draft.missingArtifacts.length, 0);
  assert.equal(draft.accepted, false);
  assert.equal(draft.executionReady, false);
  assert.equal(draft.packageStatus, "draft");
  assert.equal(draft.reviewStatus, "not_started");

  const invalidAccepted = validateContract(
    "packageManifest",
    readJsonFixture(CONTRACT_PATHS.fixtures.invalidAcceptedPackage),
  );
  assert.equal(invalidAccepted.valid, false);
});

test("review assessment fixture requires all council roles and stays not_started", () => {
  const review = readJsonFixture(CONTRACT_PATHS.fixtures.notStartedReview) as {
    requiredReviewers: string[];
    assessments: unknown[];
    reviewStatus: string;
  };
  const result = validateContract("reviewAssessment", review);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.deepEqual(review.requiredReviewers, [...REVIEW_COUNCIL_ROLES]);
  assert.equal(review.assessments.length, 0);
  assert.equal(review.reviewStatus, "not_started");
});

test("export manifest fixture stays blocked and never authorizes execution", () => {
  const handoff = readJsonFixture(CONTRACT_PATHS.fixtures.exportBlocked) as {
    handoffStatus: string;
    packageAccepted: boolean;
    executionAuthorized: boolean;
    artifacts: unknown[];
  };
  const result = validateContract("exportManifest", handoff);
  assert.equal(result.valid, true, result.errors.join("; "));
  assert.equal(handoff.handoffStatus, "blocked");
  assert.equal(handoff.packageAccepted, false);
  assert.equal(handoff.executionAuthorized, false);
  assert.equal(handoff.artifacts.length, 0);
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
