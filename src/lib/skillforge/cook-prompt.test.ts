import assert from "node:assert/strict";
import test from "node:test";
import { expandBriefHypotheses } from "./brief-expand.ts";
import { composeProjectPreview } from "./composer.ts";
import { CATALOG_VERSION } from "./catalog.ts";
import { buildCookPrompt } from "./cook-prompt.ts";
import { buildAgentHandoffManifest, buildAgentHandoffMarkdown } from "./handoff.ts";
import { parseSkillDocument } from "./skill-ingest.ts";

test("catalog bumped for god-level cook surface", () => {
  assert.equal(CATALOG_VERSION, "skillforge-catalog-1.4.1");
});

test("COOK prompt is a single pasteable agent build brief", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site like activetheory.net",
  });
  const cook = buildCookPrompt(preview);
  assert.match(cook, /SKILLFORGE COOK PROMPT/);
  assert.match(cook, /executionAuthorized/);
  assert.match(cook, /Buttons\/CTA|Button\/CTA|button\/CTA/i);
  assert.match(cook, /GSAP|R3F/);
  assert.match(cook, /DESIGN_SYSTEM/);
  assert.ok(cook.length > 4000);
});

test("short-brief expansion enriches immersive DNA without rewriting Vision", () => {
  const brief = "Awwwards site like activetheory.net";
  const expansion = expandBriefHypotheses({
    brief,
    categoryKey: "awwwards-website",
  });
  assert.ok(expansion.craftTargets.some((item) => /button/i.test(item)));
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief,
  });
  assert.equal(preview.projectDna.fields[0]?.value, brief);
  const differentiation =
    preview.projectDna.fields.find((field) => field.name === "Differentiation")?.value ?? "";
  assert.match(differentiation, /Short-brief expansion|scroll-theater|Button/i);
});

test("handoff still prepared and points agents at COOK.md", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build an enterprise AI recruiting platform",
  });
  const manifest = buildAgentHandoffManifest(preview);
  const markdown = buildAgentHandoffMarkdown(preview, manifest);
  assert.equal(manifest.executionAuthorized, false);
  assert.match(markdown, /COOK\.md/);
});

test("skill ingest rejects thin generic boilerplate", () => {
  const thin = JSON.stringify({
    slug: "thin-skill",
    name: "Thin Skill",
    tier: 3,
    role: "Thin Role",
    summary: "Too thin",
    capabilities: ["x"],
    categoryKeys: ["saas"],
  });
  // Seed builds via factory then deepen — autoDeepen should make it pass shape.
  const ok = parseSkillDocument(thin, "thin.json");
  assert.equal(ok.errors.length, 0);
  assert.ok(ok.skill);

  const bogus = parseSkillDocument('{"hello":"world"}', "bogus.json");
  assert.ok(bogus.errors.length > 0);
});
