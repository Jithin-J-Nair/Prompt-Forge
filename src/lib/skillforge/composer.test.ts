import assert from "node:assert/strict";
import test from "node:test";
import { listDraftTemplateKeys, TEMPLATE_SET_VERSION } from "./blueprints.ts";
import { STARTER_SKILLS } from "./catalog.ts";
import {
  CompositionInputError,
  composeProjectPreview,
  deduplicateSkillScopes,
} from "./composer.ts";
import { BLUEPRINT_ARTIFACTS, REVIEW_COUNCIL_ROLES } from "./types.ts";

const validInput = {
  categoryKey: "ai-product",
  brief: "Build an enterprise AI recruiting platform",
};

test("composes an explicitly incomplete, non-persisted draft package", () => {
  const preview = composeProjectPreview(validInput);

  assert.equal(preview.previewStatus, "draft");
  assert.equal(preview.persistence, "not_persisted");
  assert.equal(preview.accepted, false);
  assert.equal(preview.executionReady, false);
  assert.equal(preview.reviewStatus, "not_started");
  assert.equal(preview.templateSetVersion, TEMPLATE_SET_VERSION);
  assert.equal(preview.graph.nodes.length, 4);
  assert.equal(preview.artifactPreviews.length, BLUEPRINT_ARTIFACTS.length);
  assert.deepEqual(preview.missingArtifacts, []);
  assert.deepEqual(preview.requiredReviewers, [...REVIEW_COUNCIL_ROLES]);
  assert.ok(
    preview.artifactPreviews.every(
      (artifact) => artifact.templateVersion === TEMPLATE_SET_VERSION,
    ),
  );
});

test("keeps all Project DNA fields and labels unsupported knowledge unknown", () => {
  const preview = composeProjectPreview(validInput);

  assert.equal(preview.projectDna.fields.length, 13);
  assert.deepEqual(preview.projectDna.fields[0], {
    name: "Vision",
    status: "confirmed",
    value: validInput.brief,
    source: "user_brief",
  });
  assert.equal(
    preview.projectDna.fields.filter((field) => field.status === "unknown").length,
    12,
  );
  assert.match(
    preview.artifactPreviews.find((artifact) => artifact.logicalKey === "PROJECT_DNA.md")!.content,
    /\| Market \| unknown \| Unknown \|/,
  );
  assert.match(
    preview.artifactPreviews.find((artifact) => artifact.logicalKey === "PRODUCT_STRATEGY.md")!
      .content,
    /Unknown — not inferred in this draft/,
  );
});

test("is deterministic and normalizes whitespace before hashing", () => {
  const first = composeProjectPreview(validInput);
  const second = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "  Build an enterprise   AI recruiting platform  ",
  });

  assert.equal(first.graphHash, second.graphHash);
  assert.deepEqual(first.graph, second.graph);
  assert.deepEqual(
    first.artifactPreviews.map((artifact) => artifact.logicalKey),
    second.artifactPreviews.map((artifact) => artifact.logicalKey),
  );
});

test("escapes untrusted brief markup in generated Markdown previews", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build <script>alert(1)</script> as an AI product",
  });
  const projectDna = preview.artifactPreviews.find(
    (artifact) => artifact.logicalKey === "PROJECT_DNA.md",
  )!.content;
  const masterPackage = preview.artifactPreviews.find(
    (artifact) => artifact.logicalKey === "MASTER_SKILL_PACKAGE.md",
  )!.content;

  assert.ok(projectDna.includes("&lt;script&gt;"));
  assert.ok(masterPackage.includes("&lt;script&gt;"));
  assert.ok(!projectDna.includes("<script>"));
  assert.ok(!masterPackage.includes("<script>"));
});

test("orders dependencies before dependent expertise and keeps graph scopes unique", () => {
  const preview = composeProjectPreview(validInput);
  const nodeKeys = preview.graph.nodes.map((node) => node.nodeKey);
  const capabilities = preview.graph.nodes.flatMap((node) => node.assignedScope);

  for (const edge of preview.graph.edges) {
    assert.ok(nodeKeys.indexOf(edge.from) < nodeKeys.indexOf(edge.to));
  }
  assert.equal(new Set(capabilities).size, capabilities.length);
  assert.deepEqual(
    preview.graph.edges.map((edge) => [edge.from, edge.to]),
    [
      ["product-strategist", "business-analyst"],
      ["product-strategist", "systems-thinker"],
      ["product-strategist", "ux-architect"],
    ],
  );
});

test("assigns an overlapping capability only to its first deterministic owner", () => {
  const scopes = deduplicateSkillScopes([
    { nodeKey: "primary", capabilities: ["shared", "primary-only"] },
    { nodeKey: "secondary", capabilities: ["shared", "secondary-only"] },
  ]);

  assert.deepEqual(scopes.get("primary"), ["shared", "primary-only"]);
  assert.deepEqual(scopes.get("secondary"), ["secondary-only"]);
});

test("starter catalog packages contain all 13 required skill sections", () => {
  const sectionNames = [
    "identity",
    "mission",
    "principles",
    "mentalModels",
    "decisionFrameworks",
    "bestPractices",
    "antiPatterns",
    "reviewCriteria",
    "qualityMetrics",
    "acceptanceCriteria",
    "outputContract",
    "examples",
    "failureStates",
  ];

  for (const skill of STARTER_SKILLS) {
    for (const section of sectionNames) {
      assert.ok(section in skill, `${skill.identity.slug} is missing ${section}`);
    }
    assert.equal(skill.schemaVersion, "1.0.0");
    assert.equal(skill.identity.tier, 1);
  }
});

test("draft template set covers every canonical blueprint artifact", () => {
  assert.deepEqual(listDraftTemplateKeys(), [...BLUEPRINT_ARTIFACTS]);
});

test("agent execution package draft stays blocked and non-executable", () => {
  const preview = composeProjectPreview(validInput);
  const handoff = preview.artifactPreviews.find(
    (artifact) => artifact.logicalKey === "AGENT_EXECUTION_PACKAGE.md",
  )!.content;

  assert.match(handoff, /Status: blocked/);
  assert.match(handoff, /Execution authorized: false/);
  assert.match(handoff, /Treat draft handoff text as execution authority/);
});

test("rejects unsupported categories and briefs outside the intake bounds", () => {
  assert.throws(
    () => composeProjectPreview({ ...validInput, categoryKey: "ai-agent" }),
    (error: unknown) =>
      error instanceof CompositionInputError &&
      error.code === "unsupported_category" &&
      error.statusCode === 422,
  );
  assert.throws(
    () => composeProjectPreview({ ...validInput, brief: "ok" }),
    (error: unknown) =>
      error instanceof CompositionInputError &&
      error.code === "invalid_brief" &&
      error.statusCode === 400,
  );
  assert.throws(
    () => composeProjectPreview({ ...validInput, brief: "x".repeat(401) }),
    CompositionInputError,
  );
  assert.throws(
    () => composeProjectPreview({ ...validInput, brief: `a${" ".repeat(400)}b` }),
    CompositionInputError,
  );
});
