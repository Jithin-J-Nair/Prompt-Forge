import assert from "node:assert/strict";
import test from "node:test";
import { analyzeBrief } from "./brief-intelligence.ts";
import { composeProjectPreview } from "./composer.ts";
import { exploreAndSelectConcept, synthesizeConcept } from "./concept-synth.ts";
import { buildCookPrompt } from "./cook-prompt.ts";
import { buildOrchestratorPrompt } from "../promptforge/orchestrator-prompt.ts";

const FIXTURES = {
  immersive3d: {
    categoryKey: "threejs-experience" as const,
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  },
  saas: {
    categoryKey: "saas" as const,
    brief:
      "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
  },
  brand: {
    categoryKey: "awwwards-website" as const,
    brief:
      "Visually distinctive consumer perfume atelier brand site with glass materials, scent chapters, and intimate invite",
  },
};

test("brief intelligence differs across immersive / SaaS / brand fixtures", () => {
  const a = analyzeBrief(FIXTURES.immersive3d);
  const b = analyzeBrief(FIXTURES.saas);
  const c = analyzeBrief({
    categoryKey: "e-commerce",
    brief: FIXTURES.brand.brief,
  });
  assert.equal(a.categoryMode, "immersive");
  assert.equal(b.categoryMode, "saas");
  assert.ok(c.categoryMode === "brand" || c.categoryMode === "ecommerce");
  assert.notEqual(a.doNotBuild.join("|"), b.doNotBuild.join("|"));
  assert.ok(b.doNotBuild.some((line) => /shader|spectacle|3D/i.test(line)));
  assert.ok(a.doNotBuild.some((line) => /SaaS dashboard|clone/i.test(line)));
  assert.equal(a.audience.status === "explicit" || a.audience.status === "inferred", true);
  assert.ok(a.clarificationNeeded.length === 0);
});

test("concept selection explores alternatives and picks mode-appropriate winners", () => {
  const immersive = exploreAndSelectConcept(FIXTURES.immersive3d);
  const saas = exploreAndSelectConcept(FIXTURES.saas);
  const brand = exploreAndSelectConcept({
    categoryKey: "e-commerce",
    brief: FIXTURES.brand.brief,
    mode: "brand",
  });
  assert.ok(immersive.explored.length >= 3);
  assert.ok(saas.explored.length >= 3);
  assert.match(immersive.selected.label, /world-as-product|Climate/i);
  assert.match(saas.selected.label, /Job-first/i);
  assert.match(brand.selected.label, /Sensory|Brand-first|perfume/i);
  assert.notEqual(immersive.selected.id, saas.selected.id);
  assert.notEqual(immersive.selected.id, brand.selected.id);
  assert.ok(immersive.why.length > 40);
  assert.match(immersive.why, /Scored from brief signals/i);
  assert.ok(saas.rejectedOneLiners.length >= 1);
});

test("three fixtures compose into materially different creative directions", () => {
  const immersive = composeProjectPreview(FIXTURES.immersive3d);
  const saas = composeProjectPreview(FIXTURES.saas);
  const brand = composeProjectPreview(FIXTURES.brand);

  assert.equal(immersive.accepted, true);
  assert.equal(saas.accepted, true);
  assert.equal(brand.accepted, true);

  const creative = (preview: typeof immersive) =>
    preview.artifactPreviews.find((a) => a.logicalKey === "CREATIVE_DIRECTION.md")!.content;
  const experience = (preview: typeof immersive) =>
    preview.artifactPreviews.find((a) => a.logicalKey === "EXPERIENCE_DNA.md")!.content;
  const architecture = (preview: typeof immersive) =>
    preview.artifactPreviews.find((a) => a.logicalKey === "ARCHITECTURE.md")!.content;

  const cImm = creative(immersive);
  const cSaas = creative(saas);
  const cBrand = creative(brand);

  assert.match(cImm, /Selected direction|Selected concept/i);
  assert.match(cSaas, /Selected direction|Selected concept/i);
  assert.match(cBrand, /Selected direction|Selected concept/i);

  const pillarImm = cImm.split("## Creative pillars")[1]?.slice(0, 500) ?? "";
  const pillarSaas = cSaas.split("## Creative pillars")[1]?.slice(0, 500) ?? "";
  const pillarBrand = cBrand.split("## Creative pillars")[1]?.slice(0, 500) ?? "";
  assert.notEqual(pillarImm, pillarSaas);
  assert.notEqual(pillarSaas, pillarBrand);
  assert.notEqual(pillarImm, pillarBrand);

  const eImm = experience(immersive);
  const eSaas = experience(saas);
  const eBrand = experience(brand);
  assert.match(eImm, /Brief intelligence/);
  assert.match(eSaas, /Brief intelligence/);
  assert.match(eBrand, /Brief intelligence/);
  assert.match(eSaas, /job-first|Workbench|spectacle/i);
  assert.match(eImm, /World:|WebGL|scroll theater/i);
  assert.notEqual(eImm.slice(0, 600), eSaas.slice(0, 600));

  const aImm = architecture(immersive);
  const aSaas = architecture(saas);
  assert.match(aImm, /Technical creative direction|Scene inventory/i);
  assert.match(aSaas, /Technical creative direction/);
  assert.doesNotMatch(aSaas, /Scene inventory/);
  assert.ok(!saas.graph.nodes.some((n) => n.nodeKey === "shader-engineer"));
  assert.ok(immersive.graph.nodes.some((n) => n.nodeKey === "threejs-architect"));

  const fpImm = synthesizeConcept(FIXTURES.immersive3d).fingerprint;
  const fpSaas = synthesizeConcept(FIXTURES.saas).fingerprint;
  const fpBrand = synthesizeConcept(FIXTURES.brand).fingerprint;
  assert.notEqual(fpImm, fpSaas);
  assert.notEqual(fpSaas, fpBrand);
  assert.notEqual(fpImm, fpBrand);
});

test("COOK + BODY include critique loop, selected concept, and coherence", () => {
  const preview = composeProjectPreview(FIXTURES.immersive3d);
  const cook = buildCookPrompt(preview);
  const body = buildOrchestratorPrompt(preview);
  assert.match(cook, /Selected concept/);
  assert.match(cook, /Brief intelligence/);
  assert.match(cook, /Technical creative direction/);
  assert.match(cook, /Critique loop contract/);
  assert.match(cook, /max \*\*three\*\*|Max \*\*three\*\*|max three/i);
  assert.match(body, /Browser critique loop/);
  assert.match(body, /max 3|THREE|three focused/i);
  assert.match(body, /UNVERIFIED \(no browser\)/);
  assert.match(body, /Category-adaptive gates|critical fails/i);
});

test("SaaS BODY critique loop present without Active Theory bar", () => {
  const preview = composeProjectPreview(FIXTURES.saas);
  const body = buildOrchestratorPrompt(preview);
  assert.match(body, /Browser critique loop/);
  assert.match(body, /job-first|Usability/i);
  assert.doesNotMatch(body, /Active Theory/);
  assert.match(body, /Pass N\/3/);
});
