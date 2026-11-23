import assert from "node:assert/strict";
import test from "node:test";
import { composeProjectPreview } from "./composer.ts";
import { exploreAndSelectConcept, synthesizeConcept } from "./concept-synth.ts";
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
  assert.match(body, /Browser critique loop/);
  assert.match(body, /UNVERIFIED \(no browser\)/);
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

test("different briefs produce different winners and project-specific directions", () => {
  const climate = exploreAndSelectConcept({
    categoryKey: "threejs-experience",
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  });
  const perfume = exploreAndSelectConcept({
    categoryKey: "awwwards-website",
    brief:
      "Visually distinctive consumer perfume atelier brand site with glass materials, scent chapters, and intimate invite",
  });
  const editorial = exploreAndSelectConcept({
    categoryKey: "awwwards-website",
    brief:
      "Typographic editorial scroll site for a design magazine — long-form chapter storytelling without WebGL",
  });
  const ops = exploreAndSelectConcept({
    categoryKey: "saas",
    brief:
      "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
  });
  const hr = exploreAndSelectConcept({
    categoryKey: "saas",
    brief:
      "SaaS onboarding checklist for HR teams to guide employee step-by-step training wizards",
  });

  // Not the same predetermined archetype id for every brief
  const winnerIds = [climate, perfume, editorial, ops, hr].map((s) => s.selected.id);
  assert.equal(new Set(winnerIds).size, winnerIds.length);

  assert.match(climate.selected.id, /^world-/);
  assert.match(perfume.selected.id, /^sensory-/);
  assert.match(editorial.selected.id, /^editorial-/);
  assert.match(ops.selected.id, /^workbench-/);
  assert.match(hr.selected.id, /^guided-/);

  // Directions are project-shaped, not template recolors
  assert.match(climate.selected.artDirection, /climate|ocean|data/i);
  assert.match(perfume.selected.artDirection, /perfume|glass|scent/i);
  assert.match(editorial.selected.label, /editorial|design|magazine/i);
  assert.match(ops.selected.label, /incident|triage|Job-first/i);
  assert.match(hr.selected.label, /Guided|onboarding/i);

  assert.notEqual(climate.selected.artDirection, perfume.selected.artDirection);
  assert.notEqual(climate.selected.spaceMetaphor, editorial.selected.spaceMetaphor);
  assert.notEqual(ops.selected.label, hr.selected.label);
});

test("concept scores are computed from brief context, not preset constants", () => {
  const climate = exploreAndSelectConcept({
    categoryKey: "threejs-experience",
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  });
  const editorial = exploreAndSelectConcept({
    categoryKey: "awwwards-website",
    brief:
      "Typographic editorial scroll site for a design magazine — long-form chapter storytelling without WebGL",
  });
  const ops = exploreAndSelectConcept({
    categoryKey: "saas",
    brief:
      "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
  });

  // Originality is not a fixed preset shared across all winning directions
  assert.notEqual(climate.selected.scores.originality, editorial.selected.scores.originality);
  assert.notEqual(climate.selected.scores.originality, ops.selected.scores.originality);

  // Within one explore, foil directions score below the winner (not theater-ranked equals)
  const ranked = climate.explored.map((c) => c.total);
  assert.ok(ranked[0]! > ranked[ranked.length - 1]!);
  const spectacle = climate.explored.find((c) => c.id === "spectacle-demo");
  assert.ok(spectacle);
  assert.ok(spectacle.total < climate.selected.total);
  assert.ok(spectacle.scores.originality < climate.selected.scores.originality);

  // Why cites computed scoring, not a canned rank table
  assert.match(climate.why, /Scored from brief signals/i);
  assert.match(climate.why, /climate|ocean|data|immersive/i);
});

test("reject-weak: hard-rejects generic/spectacle foils so they cannot win", () => {
  const climate = exploreAndSelectConcept({
    categoryKey: "threejs-experience",
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  });
  const ops = exploreAndSelectConcept({
    categoryKey: "saas",
    brief:
      "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
  });
  const brand = exploreAndSelectConcept({
    categoryKey: "awwwards-website",
    brief:
      "Visually distinctive consumer perfume atelier brand site with glass materials, scent chapters, and intimate invite",
    mode: "brand",
  });
  const ecommerce = exploreAndSelectConcept({
    categoryKey: "e-commerce",
    brief: "Online shop for ceramic tableware with clear add-to-cart and shipping honesty",
    mode: "ecommerce",
  });

  assert.ok(
    climate.hardRejected.some((r) => r.id === "spectacle-demo"),
    "spectacle-demo must be hard-rejected",
  );
  assert.ok(
    climate.hardRejected.every((r) => r.verdict === "rejected-weak" || r.verdict === "rejected-generic"),
  );
  assert.ok(!climate.hardRejected.some((r) => r.id === climate.selected.id));
  assert.match(climate.rejectedOneLiners.join("\n"), /spectacle|generic|weak/i);

  assert.ok(
    ops.hardRejected.some((r) => /marketing-cosplay|cinematic-saas/.test(r.id)),
    "SaaS must hard-reject marketing/cinematic foils",
  );
  assert.ok(
    brand.hardRejected.some((r) => r.id === "spectacle-demo"),
    "brand mode must hard-reject spectacle foil",
  );
  assert.ok(
    ecommerce.hardRejected.some((r) => /template-consumer|overbuilt/.test(r.id)),
    "ecommerce must hard-reject template/overbuilt foils",
  );

  // Winner is never a foil id
  for (const sel of [climate, ops, brand, ecommerce]) {
    assert.doesNotMatch(
      sel.selected.id,
      /spectacle-demo|marketing-cosplay|cinematic-saas|template-consumer|overbuilt-campaign/,
    );
  }
});

test("evidence-based winner: cites brief evidence and an explicit tradeoff", () => {
  const climate = exploreAndSelectConcept({
    categoryKey: "threejs-experience",
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  });
  const editorial = exploreAndSelectConcept({
    categoryKey: "awwwards-website",
    brief:
      "Typographic editorial scroll site for a design magazine — long-form chapter storytelling without WebGL",
  });
  const ops = exploreAndSelectConcept({
    categoryKey: "saas",
    brief:
      "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
  });

  assert.ok(climate.evidence.length >= 2);
  assert.ok(
    climate.evidence.some((e) => /climate|ocean|data|WebGL|R3F|activetheory|scientists|immersive/i.test(e)),
    `climate evidence should cite brief: ${climate.evidence.join(" | ")}`,
  );
  assert.match(climate.tradeoff, /Tradeoff/i);
  assert.match(climate.why, /Evidence from brief/i);
  assert.match(climate.why, /Tradeoff/i);
  assert.match(climate.why, /Hard-rejected weak\/generic/i);

  assert.ok(editorial.evidence.some((e) => /editorial|typograph|magazine|without WebGL|scroll/i.test(e)));
  assert.match(editorial.tradeoff, /Tradeoff/i);
  assert.match(editorial.selected.id, /^editorial-/);

  assert.ok(ops.evidence.some((e) => /ops|incident|triage|Audience|job/i.test(e)));
  assert.match(ops.tradeoff, /Tradeoff/i);
  assert.match(ops.selected.id, /^workbench-/);

  // COOK surfaces evidence + tradeoff
  const preview = composeProjectPreview({
    categoryKey: "threejs-experience",
    brief:
      "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net",
  });
  const cook = buildCookPrompt(preview);
  assert.match(cook, /Evidence:/);
  assert.match(cook, /Tradeoff:/);
  const creative = preview.artifactPreviews.find((a) => a.logicalKey === "CREATIVE_DIRECTION.md")!.content;
  assert.match(creative, /Brief evidence|Tradeoff/i);
});
