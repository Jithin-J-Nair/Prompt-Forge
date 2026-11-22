import assert from "node:assert/strict";
import test from "node:test";
import { PLACEHOLDER_BAN_PHRASE } from "./blueprints-content.ts";
import { CATALOG_VERSION, PUBLISHED_SKILLS, getSkillBySlug } from "./catalog.ts";
import { composeProjectPreview } from "./composer.ts";

test("catalog v1.4 deepens creative skills beyond generic boilerplate", () => {
  assert.ok(CATALOG_VERSION.startsWith("skillforge-catalog-1.4"));
  const creative = getSkillBySlug("creative-director");
  assert.ok(creative);
  assert.ok(!creative.principles.includes("Separate confirmed facts from inferences."));
  assert.ok(creative.principles.some((principle) => /bold idea|first viewport|AI-default/i.test(principle)));
  assert.ok(creative.examples?.[0]?.expectedOutput.includes("scroll theater"));
});

test("threejs and gsap skills carry distilled modern craft (not generic stubs)", () => {
  const three = getSkillBySlug("threejs-architect");
  const gsap = getSkillBySlug("gsap-architect");
  assert.ok(three);
  assert.ok(gsap);
  assert.ok(three.principles.some((p) => /dispose|animation loop|compression|Draco|meshopt/i.test(p)));
  assert.ok(three.antiPatterns.some((p) => /requestAnimationFrame|many canvases|unoptimized/i.test(p)));
  assert.ok(gsap.principles.some((p) => /timeline|ScrollTrigger|autoAlpha|cleanup|reduced-motion/i.test(p)));
  assert.match(three.provenance?.source ?? "", /distilled|v1\.4/);
});

test("every published skill has a merged depth patch", async () => {
  const { MERGED_SKILL_DEPTH } = await import("./skill-depth.ts");
  for (const skill of PUBLISHED_SKILLS) {
    assert.ok(
      MERGED_SKILL_DEPTH[skill.identity.slug],
      `missing merged depth for ${skill.identity.slug}`,
    );
  }
});

test("tier-7 reviewer skills are published", () => {
  for (const slug of [
    "product-reviewer",
    "architecture-reviewer",
    "ux-reviewer",
    "performance-reviewer",
    "security-reviewer",
    "accessibility-reviewer",
    "awwwards-reviewer",
  ]) {
    assert.ok(getSkillBySlug(slug), `missing ${slug}`);
  }
  assert.ok(PUBLISHED_SKILLS.length >= 57);
});

test("awwwards short brief yields immersive skills, dense design system, visitor flows", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site like activetheory.net",
  });

  assert.equal(preview.accepted, true);
  assert.equal(preview.reviewStatus, "passed");

  const slugs = preview.graph.nodes.map((node) => node.nodeKey);
  for (const required of [
    "creative-director",
    "threejs-architect",
    "shader-engineer",
    "gsap-architect",
    "motion-director",
  ]) {
    assert.ok(slugs.includes(required), `missing skill ${required}`);
  }

  const design = preview.artifactPreviews.find((a) => a.logicalKey === "DESIGN_SYSTEM.md")!.content;
  const architecture = preview.artifactPreviews.find((a) => a.logicalKey === "ARCHITECTURE.md")!.content;
  const flows = preview.artifactPreviews.find((a) => a.logicalKey === "USER_FLOWS.md")!.content;
  const master = preview.artifactPreviews.find((a) => a.logicalKey === "MASTER_SKILL_PACKAGE.md")!.content;

  assert.ok(!design.includes(PLACEHOLDER_BAN_PHRASE));
  assert.ok(design.includes("Motion language"));
  assert.ok(design.includes("full-bleed"));
  assert.ok(design.includes("Buttons / CTAs"));
  assert.ok(design.includes("Image / media placeholders"));
  assert.ok(design.includes("Scroll theater"));
  assert.ok(design.length > 1200);
  assert.ok(architecture.includes("Scene inventory"));
  assert.ok(/WebGL|Experience-host|ExperienceCanvas/i.test(architecture));
  assert.ok(!/composes expertise package/i.test(flows));
  assert.ok(/lands in the arrival world|arrival world/i.test(flows));
  assert.ok(master.includes("Key principles"));

  const agent = preview.artifactPreviews.find((a) => a.logicalKey === "AGENT_EXECUTION_PACKAGE.md")!
    .content;
  assert.ok(agent.includes("How an external agent should cook this package"));
  assert.ok(/GSAP|R3F/i.test(agent));
  assert.ok(/button\/CTA micro-interactions/i.test(agent));

  const features = preview.projectDna.fields.find((field) => field.name === "Core Features")?.value ?? "";
  assert.ok(/scroll-driven|WebGL|motion/i.test(features));
  assert.ok(!features.includes("expressive interactive experience"));
});

test("accepted packages never contain the banned placeholder phrase", () => {
  for (const categoryKey of ["ai-product", "saas", "awwwards-website", "threejs-experience"] as const) {
    const preview = composeProjectPreview({
      categoryKey,
      brief: `Build a focused ${categoryKey.replace(/-/g, " ")} for operators and visitors`,
    });
    assert.equal(preview.accepted, true, categoryKey);
    for (const artifact of preview.artifactPreviews) {
      assert.ok(
        !artifact.content.includes(PLACEHOLDER_BAN_PHRASE),
        `${categoryKey} ${artifact.logicalKey} still has placeholder`,
      );
    }
  }
});
