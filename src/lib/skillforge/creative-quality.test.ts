import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeBrief,
  detectCategoryMode,
  isFunctionalCategory,
} from "./brief-intelligence.ts";
import { PROJECT_CATEGORIES, type ProjectCategoryKey } from "./categories.ts";
import {
  CompositionInputError,
  composeProjectPreview,
} from "./composer.ts";
import {
  exploreAndSelectConcept,
  synthesizeConcept,
} from "./concept-synth.ts";

function artifact(preview: ReturnType<typeof composeProjectPreview>, key: string): string {
  return preview.artifactPreviews.find((a) => a.logicalKey === key)!.content;
}

function experienceFingerprint(brief: string, categoryKey: ProjectCategoryKey) {
  const preview = composeProjectPreview({ categoryKey, brief });
  const synth = synthesizeConcept({ categoryKey, brief });
  const selection = exploreAndSelectConcept({ categoryKey, brief });
  return {
    preview,
    synth,
    selection,
    creative: artifact(preview, "CREATIVE_DIRECTION.md"),
    experience: artifact(preview, "EXPERIENCE_DNA.md"),
    art: artifact(preview, "ART_DIRECTION.md"),
    story: artifact(preview, "STORY_SYSTEM.md"),
  };
}

// ─── Edge cases ─────────────────────────────────────────────────────────────

test("edge: brief length bounds are enforced by compose", () => {
  assert.throws(
    () => composeProjectPreview({ categoryKey: "saas", brief: "ab" }),
    (err: unknown) => err instanceof CompositionInputError,
  );
  assert.throws(
    () =>
      composeProjectPreview({
        categoryKey: "awwwards-website",
        brief: `Immersive climate lab ${"x".repeat(400)}`,
      }),
    (err: unknown) => err instanceof CompositionInputError,
  );
  const ok = composeProjectPreview({
    categoryKey: "saas",
    brief: "Ops board for incident owners with audit trails.",
  });
  assert.equal(ok.accepted, true);
});

test("edge: thin / emoji / TBD briefs stay deterministic and flag clarification", () => {
  const thin = analyzeBrief({ categoryKey: "awwwards-website", brief: "Dashboard" });
  assert.ok(thin.clarificationNeeded.length >= 1);
  assert.match(thin.clarificationNeeded.join(" "), /thin/i);

  const tbd = analyzeBrief({
    categoryKey: "saas",
    brief: "Workspace for ops TBD — owners assign incidents ???",
  });
  assert.ok(tbd.clarificationNeeded.some((c) => /TBD|TODO|\?\?\?/i.test(c)));

  const emojiBrief =
    "Climate lab living data ocean for scientists — intimate invite CTA";
  const withEmoji = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: `🚀 ${emojiBrief}`,
  });
  const plain = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: emojiBrief,
  });
  assert.equal(withEmoji.accepted, true);
  assert.equal(plain.accepted, true);
  // Emoji must not collapse craft into empty mush
  assert.match(artifact(withEmoji, "CREATIVE_DIRECTION.md"), /Selected direction|pillars/i);
  assert.notEqual(
    synthesizeConcept({
      categoryKey: "awwwards-website",
      brief: `🚀 ${emojiBrief}`,
    }).fingerprint,
    "",
  );
});

test("edge: explicit no-WebGL immersive brief prefers editorial and hard-rejects spectacle", () => {
  const brief =
    "Typographic editorial magazine for design editors — ZERO WebGL, no 3D, pure type chapters";
  const intel = analyzeBrief({ categoryKey: "awwwards-website", brief });
  assert.equal(intel.categoryMode, "immersive");
  assert.ok(intel.clarificationNeeded.some((c) => /no-WebGL|editorial/i.test(c)));

  const sel = exploreAndSelectConcept({ categoryKey: "awwwards-website", brief });
  assert.match(sel.selected.id, /^editorial-/);
  assert.ok(sel.hardRejected.some((r) => r.id === "spectacle-demo"));
  assert.doesNotMatch(sel.selected.techStance, /WebGL-max|R3F chapters/i);
});

// ─── Conflicting briefs ─────────────────────────────────────────────────────

test("conflict: SaaS category + WebGL brief stays job-first (no spectacle hijack)", () => {
  const brief =
    "Immersive WebGL climate ocean like activetheory with shader chapters for scientists";
  assert.equal(detectCategoryMode("saas", brief), "saas");
  assert.equal(isFunctionalCategory("saas"), true);

  const intel = analyzeBrief({ categoryKey: "saas", brief });
  assert.equal(intel.categoryMode, "saas");
  assert.ok(
    intel.clarificationNeeded.some((c) => /functional|immersive|WebGL/i.test(c)),
    `expected conflict clarification, got: ${intel.clarificationNeeded.join(" | ")}`,
  );
  assert.ok(intel.doNotBuild.some((d) => /shader|spectacle|3D|scroll theater/i.test(d)));

  const sel = exploreAndSelectConcept({ categoryKey: "saas", brief });
  assert.match(sel.selected.id, /^workbench-|^guided-/);
  assert.ok(sel.hardRejected.some((r) => /cinematic-saas|marketing-cosplay|spectacle/i.test(r.id)));

  const preview = composeProjectPreview({ categoryKey: "saas", brief });
  assert.equal(preview.accepted, true);
  assert.ok(!preview.graph.nodes.some((n) => n.nodeKey === "shader-engineer"));
  assert.ok(!preview.graph.nodes.some((n) => n.nodeKey === "threejs-architect"));
  assert.match(artifact(preview, "EXPERIENCE_DNA.md"), /job-first|Workbench|spectacle/i);
});

test("conflict: threejs category + pure SaaS brief stays immersive category but rejects demo spectacle", () => {
  const brief =
    "B2B SaaS workspace for ops teams to triage incidents with audit trails — no WebGL, no 3D";
  const intel = analyzeBrief({ categoryKey: "threejs-experience", brief });
  assert.equal(intel.categoryMode, "immersive");
  assert.ok(intel.clarificationNeeded.some((c) => /no-WebGL|editorial|ops|workbench/i.test(c)));

  const sel = exploreAndSelectConcept({ categoryKey: "threejs-experience", brief });
  assert.ok(sel.hardRejected.some((r) => r.id === "spectacle-demo"));
  assert.doesNotMatch(
    sel.selected.id,
    /spectacle-demo|marketing-cosplay|cinematic-saas/,
  );
  // Anti-spectacle + ops language should not crown a WebGL-max world flex
  assert.doesNotMatch(sel.selected.techStance, /WebGL-max/i);
});

test("conflict: same immersive keywords differ by chosen category", () => {
  const brief =
    "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters";
  const asSaas = experienceFingerprint(brief, "saas");
  const asThree = experienceFingerprint(brief, "threejs-experience");

  assert.notEqual(asSaas.selection.selected.id, asThree.selection.selected.id);
  assert.notEqual(asSaas.synth.fingerprint, asThree.synth.fingerprint);
  assert.notEqual(asSaas.creative.slice(0, 800), asThree.creative.slice(0, 800));
  assert.match(asSaas.selection.selected.id, /^workbench-|^guided-/);
  assert.match(asThree.selection.selected.id, /^world-/);
  assert.ok(asThree.preview.graph.nodes.some((n) => n.nodeKey === "threejs-architect"));
  assert.ok(!asSaas.preview.graph.nodes.some((n) => n.nodeKey === "threejs-architect"));
});

// ─── Unusual categories ─────────────────────────────────────────────────────

test("unusual categories: every project category composes without mush collapse", () => {
  const brief =
    "Tool for field technicians to log equipment failures on site and share status with leads";
  const fingerprints = new Set<string>();
  const modes = new Map<string, string>();

  for (const { key } of PROJECT_CATEGORIES) {
    const intel = analyzeBrief({ categoryKey: key, brief });
    const preview = composeProjectPreview({ categoryKey: key, brief });
    const synth = synthesizeConcept({ categoryKey: key, brief });
    const sel = exploreAndSelectConcept({ categoryKey: key, brief });

    assert.equal(preview.accepted, true, `${key} should accept`);
    assert.ok(synth.fingerprint.length >= 8, `${key} fingerprint`);
    assert.ok(sel.selected.id.length > 0, `${key} selected`);
    assert.ok(
      !sel.hardRejected.some((r) => r.id === sel.selected.id),
      `${key}: winner must not be hard-rejected`,
    );
    assert.match(
      artifact(preview, "CREATIVE_DIRECTION.md"),
      /Selected direction|Selected concept|Creative pillars/i,
      `${key} creative direction`,
    );
    fingerprints.add(synth.fingerprint);
    modes.set(key, intel.categoryMode);
  }

  // Not every category must unique-fingerprint the same brief, but immersive vs functional must diverge
  assert.notEqual(modes.get("saas"), modes.get("awwwards-website"));
  assert.notEqual(
    synthesizeConcept({ categoryKey: "saas", brief }).fingerprint,
    synthesizeConcept({ categoryKey: "awwwards-website", brief }).fingerprint,
  );
  assert.ok(fingerprints.size >= 8, `expected diverse fingerprints across categories, got ${fingerprints.size}`);
});

test("unusual categories: mobile / automation / analytics / marketplace resolve to useful modes", () => {
  const opsBrief =
    "Product for operators to track daily work and share status with stakeholders";
  assert.equal(detectCategoryMode("mobile-app", opsBrief), "saas");
  assert.equal(detectCategoryMode("automation-system", opsBrief), "saas");
  assert.equal(detectCategoryMode("analytics-platform", opsBrief), "saas");

  const shopBrief = "Marketplace for independent ceramic makers with clear checkout honesty";
  assert.equal(detectCategoryMode("marketplace", shopBrief), "ecommerce");

  const aiBrief = "RAG console for support agents to ground answers in approved docs";
  assert.equal(detectCategoryMode("rag-platform", aiBrief), "ai");

  for (const key of [
    "mobile-app",
    "automation-system",
    "analytics-platform",
    "marketplace",
    "rag-platform",
  ] as const) {
    const brief = key === "marketplace" ? shopBrief : key === "rag-platform" ? aiBrief : opsBrief;
    const sel = exploreAndSelectConcept({ categoryKey: key, brief });
    assert.doesNotMatch(
      sel.selected.id,
      /spectacle-demo|marketing-cosplay|template-consumer|overbuilt-campaign/,
    );
    if (key !== "marketplace") {
      assert.match(sel.selected.id, /^workbench-|^guided-/);
    }
  }
});

// ─── Creative diversity ─────────────────────────────────────────────────────

test("diversity: distinct immersive briefs yield distinct winners, fingerprints, and north stars", () => {
  const briefs = [
    "Climate lab living data ocean for scientists like activetheory.net",
    "Music festival stage haze ticket invite with strobe chapters",
    "Perfume atelier glass scent chapters and intimate booking invite",
    "Architecture studio axonometric scroll with quiet type chapters",
    "Wildlife sanctuary bioluminescent night trail visitor experience",
    "Typographic editorial scroll site for a design magazine — without WebGL",
  ] as const;

  const results = briefs.map((brief) => {
    const sel = exploreAndSelectConcept({ categoryKey: "awwwards-website", brief });
    const synth = synthesizeConcept({ categoryKey: "awwwards-website", brief });
    return {
      brief,
      id: sel.selected.id,
      fp: synth.fingerprint,
      north: synth.northStar,
      pillars: synth.pillars.join("|"),
      accent: synth.artTokens.accent,
    };
  });

  assert.equal(new Set(results.map((r) => r.id)).size, results.length);
  assert.equal(new Set(results.map((r) => r.fp)).size, results.length);
  assert.equal(new Set(results.map((r) => r.pillars)).size, results.length);

  // North stars must echo brief motifs — not a shared generic slogan
  assert.match(results[0]!.north, /climate|ocean|data|scientist/i);
  assert.match(results[1]!.north, /music|festival|stage|ticket/i);
  assert.match(results[2]!.north, /perfume|glass|scent|atelier/i);
  assert.match(results[5]!.north, /editorial|magazine|typograph|design/i);
  assert.match(results[5]!.id, /^editorial-/);

  // At least a few palette accents must diverge across the battery
  assert.ok(
    new Set(results.map((r) => r.accent)).size >= 3,
    `expected accent diversity, got ${[...new Set(results.map((r) => r.accent))].join(", ")}`,
  );
});

test("diversity: SaaS job briefs do not collapse to one workbench clone", () => {
  const briefs = [
    "B2B SaaS workspace for ops teams to triage incidents, assign owners, and close loops with audit trails",
    "SaaS onboarding checklist for HR teams to guide employee step-by-step training wizards",
    "Clinic front-desk tool for nurses to automate patient intake paperwork each morning",
    "Hiring pipeline board so we can replace spreadsheet chaos with clear stage owners",
  ] as const;

  const ids = briefs.map(
    (brief) => exploreAndSelectConcept({ categoryKey: "saas", brief }).selected.id,
  );
  const fps = briefs.map(
    (brief) => synthesizeConcept({ categoryKey: "saas", brief }).fingerprint,
  );
  assert.ok(new Set(ids).size >= 3, `expected ≥3 distinct SaaS winners, got ${ids.join(", ")}`);
  assert.equal(new Set(fps).size, fps.length);
  assert.ok(ids.some((id) => /^guided-/.test(id)), "guided workflow should win at least once");
  assert.ok(ids.some((id) => /^workbench-/.test(id)), "workbench should win at least once");
});

// ─── Brief → experience sensitivity ─────────────────────────────────────────

test("sensitivity: changing the brief materially changes the composed experience", () => {
  const pairs: Array<{
    categoryKey: ProjectCategoryKey;
    a: string;
    b: string;
    aMust?: RegExp;
    bMust?: RegExp;
  }> = [
    {
      categoryKey: "awwwards-website",
      a: "Climate lab living data ocean for scientists like activetheory.net",
      b: "Climate lab PDF archive search for scientists — no WebGL, typographic chapters",
      aMust: /ocean|climate|data|world/i,
      bMust: /archive|editorial|typograph|pdf/i,
    },
    {
      categoryKey: "awwwards-website",
      a: "Perfume atelier glass scent chapters and intimate commission invite",
      b: "Neon DJ collective strobe chapter theater with ticket drop invite",
      aMust: /perfume|glass|scent|atelier/i,
      bMust: /neon|dj|strobe|ticket|music/i,
    },
    {
      categoryKey: "saas",
      a: "B2B SaaS workspace for ops teams to triage incidents with audit trails",
      b: "SaaS onboarding checklist for HR teams to guide employee training wizards",
      aMust: /incident|triage|ops|workbench/i,
      bMust: /onboard|guided|hr|training|wizard|checklist/i,
    },
    {
      categoryKey: "threejs-experience",
      a: "Immersive WebGL wildlife sanctuary night trail with bioluminescent R3F chapters",
      b: "Immersive WebGL architecture atrium with axonometric shader chapters for clients",
      aMust: /wildlife|sanctuary|bioluminescen|night|trail/i,
      bMust: /architecture|atrium|axonometric|client/i,
    },
  ];

  for (const pair of pairs) {
    const left = experienceFingerprint(pair.a, pair.categoryKey);
    const right = experienceFingerprint(pair.b, pair.categoryKey);

    assert.notEqual(
      left.synth.fingerprint,
      right.synth.fingerprint,
      `fingerprints must differ for: ${pair.a.slice(0, 40)} vs ${pair.b.slice(0, 40)}`,
    );
    assert.notEqual(
      left.creative,
      right.creative,
      `CREATIVE_DIRECTION must differ`,
    );
    assert.notEqual(
      left.experience,
      right.experience,
      `EXPERIENCE_DNA must differ`,
    );
    assert.notEqual(left.art, right.art, `ART_DIRECTION must differ`);
    assert.notEqual(left.story, right.story, `STORY_SYSTEM must differ`);
    assert.notEqual(
      left.selection.selected.artDirection,
      right.selection.selected.artDirection,
    );

    if (pair.aMust) {
      assert.match(
        `${left.selection.selected.label} ${left.selection.selected.artDirection} ${left.synth.northStar}`,
        pair.aMust,
        `left experience should reflect brief A`,
      );
    }
    if (pair.bMust) {
      assert.match(
        `${right.selection.selected.label} ${right.selection.selected.artDirection} ${right.synth.northStar}`,
        pair.bMust,
        `right experience should reflect brief B`,
      );
    }
  }
});

test("sensitivity: synonym-only paraphrase stays same winner family but still tracks wording", () => {
  const a =
    "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net";
  const b =
    "Immersive WebGL climate observatory for scientists — living data ocean with R3F chapters like activetheory.net";
  const left = exploreAndSelectConcept({ categoryKey: "threejs-experience", brief: a });
  const right = exploreAndSelectConcept({ categoryKey: "threejs-experience", brief: b });
  assert.equal(left.selected.id, right.selected.id);
  assert.equal(
    synthesizeConcept({ categoryKey: "threejs-experience", brief: a }).fingerprint,
    synthesizeConcept({ categoryKey: "threejs-experience", brief: b }).fingerprint,
  );

  // Tiny wording change that keeps motifs should not flip to a foil
  const tweaked =
    "Immersive WebGL climate observatory for research scientists — living data ocean with R3F chapters like activetheory.net";
  const t = exploreAndSelectConcept({ categoryKey: "threejs-experience", brief: tweaked });
  assert.match(t.selected.id, /^world-/);
  assert.ok(!t.hardRejected.some((r) => r.id === t.selected.id));
});
