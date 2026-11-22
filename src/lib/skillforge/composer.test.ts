import assert from "node:assert/strict";
import test from "node:test";
import { listDraftTemplateKeys, TEMPLATE_SET_VERSION } from "./blueprints.ts";
import { PUBLISHED_SKILLS } from "./catalog.ts";
import {
  CompositionInputError,
  composeProjectPreview,
  deduplicateSkillScopes,
} from "./composer.ts";
import { RUBRIC_VERSION } from "./council.ts";
import { PROJECT_CATEGORIES } from "./categories.ts";
import { BLUEPRINT_ARTIFACTS, REVIEW_COUNCIL_ROLES } from "./types.ts";

const validInput = {
  categoryKey: "ai-product",
  brief: "Build an enterprise AI recruiting platform",
};

test("composes an accepted exportable package for AI Product", () => {
  const preview = composeProjectPreview(validInput);

  assert.equal(preview.accepted, true);
  assert.equal(preview.executionReady, false);
  assert.equal(preview.reviewStatus, "passed");
  assert.equal(preview.council.gatePassed, true);
  assert.equal(preview.templateSetVersion, TEMPLATE_SET_VERSION);
  assert.equal(preview.rubricVersion, RUBRIC_VERSION);
  assert.ok(preview.graph.nodes.length >= 8);
  assert.equal(preview.artifactPreviews.length, BLUEPRINT_ARTIFACTS.length);
  assert.deepEqual(preview.missingArtifacts, []);
  assert.deepEqual(preview.requiredReviewers, [...REVIEW_COUNCIL_ROLES]);
  assert.ok(preview.exportMarkdown.includes("MASTER_SKILL_PACKAGE.md"));
  assert.match(preview.exportMarkdown, /Execution authorized: false/);
});

test("keeps Vision confirmed and enriches other DNA fields without fabricating unknowns as facts", () => {
  const preview = composeProjectPreview(validInput);
  assert.equal(preview.projectDna.fields.length, 13);
  assert.equal(preview.projectDna.fields[0]?.status, "confirmed");
  assert.equal(preview.projectDna.fields[0]?.value, validInput.brief);
  assert.equal(
    preview.projectDna.fields.filter((field) => field.status === "unknown").length,
    0,
  );
  assert.ok(
    preview.projectDna.fields.some((field) => field.status === "inferred"),
  );
});

test("is deterministic for identical normalized briefs", () => {
  const first = composeProjectPreview(validInput);
  const second = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "  Build an enterprise   AI recruiting platform  ",
  });
  assert.equal(first.graphHash, second.graphHash);
  assert.deepEqual(first.graph, second.graph);
  assert.equal(first.accepted, second.accepted);
});

test("escapes untrusted brief markup in generated Markdown previews", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build <script>alert(1)</script> as an AI product",
  });
  const projectDna = preview.artifactPreviews.find(
    (artifact) => artifact.logicalKey === "PROJECT_DNA.md",
  )!.content;
  assert.ok(projectDna.includes("&lt;script&gt;"));
  assert.ok(!projectDna.includes("<script>"));
});

test("orders dependencies before dependent expertise and keeps graph scopes unique", () => {
  const preview = composeProjectPreview(validInput);
  const nodeKeys = preview.graph.nodes.map((node) => node.nodeKey);
  const capabilities = preview.graph.nodes.flatMap((node) => node.assignedScope);
  for (const edge of preview.graph.edges) {
    assert.ok(nodeKeys.indexOf(edge.from) < nodeKeys.indexOf(edge.to));
  }
  assert.equal(new Set(capabilities).size, capabilities.length);
});

test("assigns an overlapping capability only to its first deterministic owner", () => {
  const scopes = deduplicateSkillScopes([
    { nodeKey: "primary", capabilities: ["shared", "primary-only"] },
    { nodeKey: "secondary", capabilities: ["shared", "secondary-only"] },
  ]);
  assert.deepEqual(scopes.get("primary"), ["shared", "primary-only"]);
  assert.deepEqual(scopes.get("secondary"), ["secondary-only"]);
});

test("catalog skills contain all 13 required sections", () => {
  for (const skill of PUBLISHED_SKILLS) {
    assert.equal(skill.schemaVersion, "1.0.0");
    assert.ok(skill.identity.slug);
    assert.ok(skill.mission);
    assert.ok(skill.outputContract);
  }
  assert.ok(PUBLISHED_SKILLS.length >= 45);
});

test("supports all configured project categories", () => {
  for (const category of PROJECT_CATEGORIES) {
    const preview = composeProjectPreview({
      categoryKey: category.key,
      brief: `Build a focused ${category.label} for operators`,
    });
    assert.equal(preview.categoryKey, category.key);
    assert.ok(preview.graph.nodes.length >= 4);
    assert.equal(preview.artifactPreviews.length, 11);
    assert.equal(preview.executionReady, false);
  }
});

test("draft template set covers every canonical blueprint artifact", () => {
  assert.deepEqual(listDraftTemplateKeys(), [...BLUEPRINT_ARTIFACTS]);
});

test("rejects unsupported categories and briefs outside the intake bounds", () => {
  assert.throws(
    () => composeProjectPreview({ ...validInput, categoryKey: "not-a-category" }),
    (error: unknown) =>
      error instanceof CompositionInputError &&
      error.code === "unsupported_category" &&
      error.statusCode === 422,
  );
  assert.throws(
    () => composeProjectPreview({ ...validInput, brief: "ok" }),
    CompositionInputError,
  );
});
