import assert from "node:assert/strict";
import test from "node:test";
import { composeProjectPreview } from "./composer.ts";
import { synthesizeConcept } from "./concept-synth.ts";
import { buildCookPrompt } from "./cook-prompt.ts";
import { buildOrchestratorPrompt } from "../promptforge/orchestrator-prompt.ts";

test("two immersive briefs produce different concept fingerprints and pillars", () => {
  const climate = synthesizeConcept({
    categoryKey: "awwwards-website",
    brief: "Awwards site for a climate lab — living data ocean like activetheory.net",
  });
  const festival = synthesizeConcept({
    categoryKey: "awwwards-website",
    brief: "Immersive music festival site with stage haze and ticket invite",
  });
  assert.notEqual(climate.fingerprint, festival.fingerprint);
  assert.notEqual(climate.pillars.join("|"), festival.pillars.join("|"));
  assert.notEqual(climate.artTokens.accent, festival.artTokens.accent);
  assert.match(climate.northStar, /ocean|climate|data/i);
  assert.match(festival.northStar, /music|festival|stage/i);
  assert.ok(climate.chapters.every((c) => c.camera && c.heroAsset));
  assert.ok(/#([0-9A-Fa-f]{6})/.test(climate.artTokens.accent));
});

test("composed immersive package embeds token sheet, beat grid, scene cameras, fingerprint", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site for a climate lab — living data ocean like activetheory.net",
  });
  assert.equal(preview.accepted, true);
  const creative = preview.artifactPreviews.find((a) => a.logicalKey === "CREATIVE_DIRECTION.md")!.content;
  const art = preview.artifactPreviews.find((a) => a.logicalKey === "ART_DIRECTION.md")!.content;
  const story = preview.artifactPreviews.find((a) => a.logicalKey === "STORY_SYSTEM.md")!.content;
  const design = preview.artifactPreviews.find((a) => a.logicalKey === "DESIGN_SYSTEM.md")!.content;
  const architecture = preview.artifactPreviews.find((a) => a.logicalKey === "ARCHITECTURE.md")!.content;

  assert.match(creative, /Concept fingerprint/);
  assert.match(creative, /Motif lock/i);
  assert.doesNotMatch(
    creative,
    /Presence — first viewport is one composition\.\n2\) Authored motion — signature beats/,
  );
  assert.match(art, /Token sheet/);
  assert.match(art, /#[0-9A-Fa-f]{6}/);
  assert.match(art, /Display face:/i);
  assert.match(story, /arrival|craft-proof|evidence|invite/i);
  assert.match(design, /Motion scorecard/);
  assert.match(design, /Beat grid/);
  assert.match(design, /Ownership matrix/);
  assert.match(architecture, /Camera:/);
  assert.match(architecture, /ASSET_SPEC/);
  assert.match(architecture, /Shader & render budget|caustic|fog/i);
});

test("COOK includes full immersive skill depth and ARCHITECTURE excerpt", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site like activetheory.net",
  });
  const cook = buildCookPrompt(preview);
  assert.match(cook, /Decision frameworks/);
  assert.match(cook, /Anti-patterns/);
  assert.match(cook, /Concept fingerprint/);
  assert.match(cook, /ARCHITECTURE \(source/);
  assert.match(cook, /Never ship/);
  assert.ok(cook.length > 12000);
});

test("BODY prompt hard-gates Phase 0 and Phase 3 for immersive", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site like activetheory.net",
  });
  const body = buildOrchestratorPrompt(preview);
  assert.match(body, /HARD GATE/);
  assert.match(body, /BLOCKED: COOK craft incomplete/);
  assert.match(body, /Motion scorecard/);
  assert.match(body, /Ownership matrix/);
});

test("two composed creative artifacts must not share identical pillar blocks", () => {
  const a = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Climate lab living data ocean experience for scientists",
  });
  const b = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Boutique perfume atelier scroll theater with glass materials",
  });
  const ca = a.artifactPreviews.find((x) => x.logicalKey === "CREATIVE_DIRECTION.md")!.content;
  const cb = b.artifactPreviews.find((x) => x.logicalKey === "CREATIVE_DIRECTION.md")!.content;
  const pillarA = ca.split("## Creative pillars")[1]?.slice(0, 400) ?? "";
  const pillarB = cb.split("## Creative pillars")[1]?.slice(0, 400) ?? "";
  assert.notEqual(pillarA, pillarB);
});
