import type { ProjectCategoryKey } from "./categories.ts";
import { isImmersiveCategory } from "./blueprints-content.ts";
import {
  formatBeatGrid,
  formatChapterTable,
  formatTokenSheet,
  synthesizeConcept,
} from "./concept-synth.ts";
import type { ProjectDnaField, SkillGraphNode } from "./types.ts";
import { REVIEW_COUNCIL_ROLES } from "./types.ts";

type DnaField = {
  name: ProjectDnaField;
  status: string;
  value: string | null;
  source: string;
  confidence?: number;
};

function fieldValue(fields: readonly DnaField[], name: ProjectDnaField): string | null {
  return fields.find((field) => field.name === name)?.value ?? null;
}

function briefClip(brief: string, max = 180): string {
  const trimmed = brief.trim();
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max).trimEnd()}…`;
}

/** Experience DNA — visitor/feeling thesis beyond product Project DNA. */
export function renderExperienceDnaBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const concept = synthesizeConcept({ brief, categoryKey });
  const user = fieldValue(fields, "User") ?? concept.audience;
  const vision = fieldValue(fields, "Vision") ?? briefClip(brief);
  const differentiation =
    fieldValue(fields, "Differentiation") ??
    (isImmersiveCategory(categoryKey)
      ? `Craft-led ${concept.worldNoun} instead of template marketing chrome`
      : "Clear job-to-be-done with distinctive experience cues");

  if (isImmersiveCategory(categoryKey)) {
    return {
      "Experience thesis": [
        `- Promise: ${vision}`,
        `- For: ${user}`,
        `- World: ${concept.worldNoun}`,
        `- Motifs: ${concept.motifs.slice(0, 5).join(", ")}`,
        `- Why distinctive: ${differentiation}`,
        `- Medium: ${categoryKey === "threejs-experience" ? "WebGL-first experience host + quiet DOM shell" : "Awwwards-class scroll theater with authored motion"}`,
        `- Concept fingerprint: \`${concept.fingerprint}\``,
        `- Brief signal: ${briefClip(brief)}`,
      ].join("\n"),
      "Emotional arc": [
        `- Arrival: ${concept.emotionalArc.arrival}`,
        `- Deepening: ${concept.emotionalArc.deepen}`,
        `- Proof: ${concept.emotionalArc.proof}`,
        `- Invite: ${concept.emotionalArc.invite}`,
      ].join("\n"),
      "Sensory register": [
        `- Sight: ${concept.sensory.sight}`,
        `- Motion: ${concept.sensory.motion}`,
        `- Sound: ${concept.sensory.sound}`,
        `- Touch: ${concept.sensory.touch}`,
      ].join("\n"),
      "Visitor jobs": [
        `1) ${user} understands what this ${concept.worldNoun} stands for.`,
        `2) Experiences craft proof through ${concept.motifs.slice(0, 2).join(" / ")} without a paragraph wall.`,
        `3) Reaches invite — ${concept.invite} — with keyboard-accessible escape routes.`,
      ].join("\n"),
      "Anti-experience": concept.antiPatterns.map((item) => `- ${item}`).join("\n"),
    };
  }

  return {
    "Experience thesis": [
      `- Promise: ${vision}`,
      `- For: ${user}`,
      `- Why distinctive: ${differentiation}`,
      `- Category: ${categoryKey.replace(/-/g, " ")}`,
      `- Concept fingerprint: \`${concept.fingerprint}\``,
      `- Brief signal: ${briefClip(brief)}`,
    ].join("\n"),
    "Emotional arc": [
      "- Orient: user knows where they are and what job is possible.",
      "- Progress: each step reduces uncertainty toward the outcome.",
      "- Confidence: empty/loading/error states still feel competent.",
      "- Completion: clear success and next action.",
    ].join("\n"),
    "Sensory register": [
      "- Visual hierarchy serves the primary task first.",
      "- Motion only when it clarifies state change or delight that earns its cost.",
      "- Copy voice matches product stance; no empty hype adjectives.",
    ].join("\n"),
    "Visitor jobs": [
      `- ${user} completes the core job implied by the brief.`,
      "- Operators (if any) can recover from errors without dead ends.",
      "- Secondary explore paths never block the primary job.",
    ].join("\n"),
    "Anti-experience": [
      "- Feature menus without a clear first job.",
      "- Decorative motion that delays task completion.",
      "- Unlabeled assumptions presented as confirmed product facts.",
    ].join("\n"),
  };
}

/** Creative Direction — north star concept and craft law. */
export function renderCreativeDirectionBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const concept = synthesizeConcept({ brief, categoryKey });
  const differentiation = fieldValue(fields, "Differentiation");
  const immersive = isImmersiveCategory(categoryKey);

  return {
    "North star concept": [
      `- ${concept.northStar}`,
      differentiation ? `- Differentiation lock: ${differentiation}` : "- Differentiation still hypothesis — label it as such in UI copy.",
      immersive
        ? `- Creative medium lock: immersive web craft (${concept.worldNoun}), not a marketing template.`
        : `- Creative medium lock: ${categoryKey.replace(/-/g, " ")} product craft.`,
      `- Concept fingerprint: \`${concept.fingerprint}\``,
    ].join("\n"),
    "Creative pillars": concept.pillars.map((p, i) => `${i + 1}) ${p}`).join("\n"),
    "Reference posture": [
      ...concept.referencePrinciples.map((line) => `- ${line}`),
      concept.referenceLabel
        ? `- Named reference signal: “${concept.referenceLabel}” (posture only).`
        : "- No named reference — invent from pillars + brief.",
    ].join("\n"),
    "Decision rules": [
      "- If two ideas compete, keep the one that strengthens the north star.",
      `- Prefer motif recurrence (${concept.motifs.slice(0, 3).join(", ")}) over trend pastiche.`,
      "- Cut decoration that does not serve thesis, pillars, or visitor jobs.",
      "- Immersive claims require budgets, inventories, and reduced-motion paths.",
    ].join("\n"),
    "Forbidden patterns": concept.antiPatterns.map((item) => `- ${item}`).join("\n"),
  };
}

/** Art Direction — visual system law agents can execute. */
export function renderArtDirectionBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const concept = synthesizeConcept({ brief, categoryKey });
  const immersive = isImmersiveCategory(categoryKey);
  const features = fieldValue(fields, "Core Features");

  return {
    "Art bible": [
      immersive
        ? `- Visual plane: edge-to-edge ${concept.worldNoun}; UI chrome is quiet scaffolding.`
        : "- Visual plane: task surface first; chrome second.",
      features ? `- Feature-driven motifs: ${features}` : `- Motifs: ${concept.motifs.join(", ")}`,
      `- Brief cue: ${briefClip(brief)}`,
      `- Concept fingerprint: \`${concept.fingerprint}\``,
    ].join("\n"),
    "Token sheet": formatTokenSheet(concept.artTokens),
    "Composition law": immersive
      ? [
          "- First viewport: brand, one headline, one support line, one CTA group, one dominant full-bleed visual.",
          "- No inset hero cards, side-panel media, or tiled collage as the hero idea.",
          `- Chapters read as acts mapped to: ${concept.chapters.map((c) => c.id).join(" → ")}.`,
        ].join("\n")
      : [
          "- Primary action is visually dominant on each key screen.",
          "- Density serves scanning; avoid ornament that competes with the job.",
          "- Empty states are designed, not blank voids.",
        ].join("\n"),
    "Material & imagery": immersive
      ? [
          ...concept.artTokens.materials.map((m) => `- Material: ${m}`),
          `- Lighting: ${concept.artTokens.lighting}`,
          ...concept.artTokens.imageryPlates.map((p) => `- Plate: ${p}`),
          "- Placeholder media must reserve aspect ratio and reveal with authored motion.",
        ].join("\n")
      : [
          "- Imagery supports comprehension of the job or brand proof.",
          "- Icons only when they speed recognition; avoid icon wallpaper.",
          formatTokenSheet(concept.artTokens),
        ].join("\n"),
    "UI chrome rules": [
      "- Navigation is quiet; motion reserved for intentional moments.",
      "- Focus-visible rings required; never color-only status.",
      `- Accent usage locked to \`${concept.artTokens.accent}\` for focal CTAs/hotspots.`,
      "- Buttons: hover/press/focus states specified in motion language (see DESIGN_SYSTEM).",
    ].join("\n"),
    "Rejected looks": concept.antiPatterns.map((item) => `- ${item}`).join("\n"),
  };
}

/** Story System — narrative beats and chapter map. */
export function renderStorySystemBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const concept = synthesizeConcept({ brief, categoryKey });
  const user = fieldValue(fields, "User") ?? concept.audience;
  const immersive = isImmersiveCategory(categoryKey);

  if (immersive) {
    return {
      "Narrative premise": [
        `- Protagonist: ${user}`,
        `- World: ${concept.worldNoun}`,
        `- World promise from brief: ${briefClip(brief)}`,
        `- Verb spine: ${concept.verbs.join(" → ")}`,
        `- Conflict: sameness of the web vs memorable ${concept.motifs[0] ?? "craft"} presence.`,
        `- Resolution: ${concept.invite}`,
        `- Concept fingerprint: \`${concept.fingerprint}\``,
      ].join("\n"),
      "Beat sheet": concept.chapters
        .map((c, i) => `${i + 1}) ${c.id} — ${c.job} / proof: ${c.proof}`)
        .concat(["5) Escape — skip-to-content / reduced-motion path always available."])
        .join("\n"),
      "Chapter map": formatChapterTable(concept.chapters),
      "Message hierarchy": [
        `- L1: Brand / product name inside ${concept.worldNoun} (hero-level).`,
        "- L2: One promise line derived from north star.",
        "- L3: One supporting sentence.",
        `- L4: Chapter captions timed to beat grid (${concept.motifs.slice(0, 2).join(", ")} language).`,
        "- Never let secondary marketing blocks outrank L1–L3 in the first viewport.",
      ].join("\n"),
      "Voice & tone": [
        "- Confident, specific, sparse — craft speaks louder than adjectives.",
        `- Prefer concrete nouns from motifs (${concept.motifs.slice(0, 4).join(", ")}) over empty hype.`,
        "- Ban empty hype (‘revolutionary’, ‘next-gen’) without evidence.",
        "- Inferred claims labeled; unknowns not narrated as facts.",
      ].join("\n"),
    };
  }

  return {
    "Narrative premise": [
      `- Protagonist: ${user}`,
      `- Job story from brief: ${briefClip(brief)}`,
      "- Conflict: friction/uncertainty in the current workflow; resolution: clearer path to outcome.",
      `- Concept fingerprint: \`${concept.fingerprint}\``,
    ].join("\n"),
    "Beat sheet": [
      "1) Orient — land on the job and trust cues.",
      "2) Configure — gather inputs with progressive disclosure.",
      "3) Act — complete the primary task.",
      "4) Confirm — success state + next step.",
      "5) Recover — error paths with explicit remedies.",
    ].join("\n"),
    "Chapter map": [
      "| Stage | User intent | System response |",
      "|---|---|---|",
      "| Entry | Understand offer / job | Clear value + primary action |",
      "| Core loop | Complete job | Guided steps + states |",
      "| Edge | Handle failure | Recovery + escalation |",
      "| Return | Come back | Continuity / saved progress if applicable |",
    ].join("\n"),
    "Message hierarchy": [
      "- Outcome-first headlines; features as proof, not the lead.",
      "- Error copy names the problem and the next action.",
      "- Empty states teach the job, not just ‘no data’.",
    ].join("\n"),
    "Voice & tone": [
      "- Direct and human; match category seriousness.",
      "- No fake certainty on unknown DNA fields.",
    ].join("\n"),
  };
}

/** Motion scorecard + ownership matrix for immersive packages (appended via design system extras). */
export function renderMotionScorecardBody(
  categoryKey: ProjectCategoryKey,
  brief: string,
): Record<string, string> {
  const concept = synthesizeConcept({ brief, categoryKey });
  if (!isImmersiveCategory(categoryKey)) {
    return {
      "Motion scorecard": "- Motion only when it clarifies state change; no decorative theater required.",
    };
  }
  return {
    "Motion scorecard": concept.motionScorecard.map((line) => `- ${line}`).join("\n"),
    "Beat grid": formatBeatGrid(concept.beatGrid),
    "Ownership matrix": [
      "- DOM captions / progress UI → GSAP ScrollTrigger (single progress publisher).",
      "- Camera / object transforms in canvas → R3F only.",
      "- Material dissolves / caustics → shader uniforms driven by the same progress signal.",
      "- CTA micro-interactions → DOM/CSS or GSAP; never R3F for button scale.",
      "- Fail closed if two owners write the same property in one frame.",
    ].join("\n"),
    "ASSET_SPEC": [
      ...concept.assetSpecs.map(
        (s) => `- **${s.name}** (${s.kind}): ${s.budget}; ${s.format}; ${s.notes}`,
      ),
    ].join("\n"),
  };
}

/** Reviewer Frameworks — how council lenses score craft packages. */
export function renderReviewerFrameworksBody(
  categoryKey: ProjectCategoryKey,
  graphNodes: readonly SkillGraphNode[],
): Record<string, string> {
  const immersive = isImmersiveCategory(categoryKey);
  const reviewerSkills = graphNodes.filter((node) =>
    [
      "product-reviewer",
      "architecture-reviewer",
      "ux-reviewer",
      "performance-reviewer",
      "security-reviewer",
      "accessibility-reviewer",
      "awwwards-reviewer",
      "creative-direction-reviewer",
      "art-direction-reviewer",
      "story-systems-reviewer",
    ].includes(node.nodeKey),
  );

  const skillLines =
    reviewerSkills.length > 0
      ? reviewerSkills
          .map(
            (node) =>
              `- **${node.name}** (${node.priority}): ${node.rationale} Scope: ${node.assignedScope.join(", ")}.`,
          )
          .join("\n")
      : "- Tier-7 reviewer skills may be selected by policy; council roles below remain mandatory gates.";

  return {
    "Council roster": [
      ...REVIEW_COUNCIL_ROLES.map((role) => `- ${role}`),
      "",
      "Gates (proposed defaults): minimum reviewer 80/100 · overall mean 80/100 · max 3 revision rounds.",
      "executionAuthorized remains false even when council passes.",
    ].join("\n"),
    "Craft lenses": immersive
      ? [
          "- **Creative Director** → CREATIVE_DIRECTION.md: north star, pillars, forbidden patterns, concept fingerprint uniqueness.",
          "- **Awwwards Reviewer** → EXPERIENCE_DNA.md + ART_DIRECTION.md: thesis, token sheet (#/oklch), composition law.",
          "- **UX Architect** → STORY_SYSTEM.md + USER_FLOWS.md: brief-specific chapter map, visitor journey.",
          "- **Accessibility Reviewer** → DESIGN_SYSTEM.md: reduced-motion, focus, contrast.",
          "- **Performance Engineer** → ARCHITECTURE.md scene inventory + shader budget + ASSET_SPEC.",
          "- **Security Engineer** → AGENT_EXECUTION_PACKAGE.md: safe handoff boundaries.",
        ].join("\n")
      : [
          "- **Product Strategist** → PRODUCT_STRATEGY.md: user/problem/outcome coherence.",
          "- **Creative Director** → CREATIVE_DIRECTION.md: concept clarity and forbidden patterns.",
          "- **UX Architect** → STORY_SYSTEM.md + USER_FLOWS.md: job narrative and recovery.",
          "- **Systems Architect** → ARCHITECTURE.md: boundaries matching the medium.",
          "- **Security / Performance / A11y** → respective artifacts with evidence citations.",
        ].join("\n"),
    "Evidence rules": [
      "- Every score cites artifact logical key + rubric version + rationale.",
      "- Critical/high findings block acceptance until resolved or explicitly deferred.",
      "- Mush/placeholder phrases fail craft density automatically.",
      immersive
        ? "- Immersive packages must show brief-specific pillars, token sheet with hex colors, filled scene inventory, beat grid, and motion scorecard — not category policy alone."
        : "- Packages must show coherent strategy + story + design evidence.",
    ].join("\n"),
    "Fail conditions": [
      "- Empty binders with high scores.",
      "- Creative pillars identical to frozen boilerplate (Presence / Authored motion / Restraint / Honesty only).",
      "- ART_DIRECTION missing `#` hex or named display face.",
      "- Scene inventory still listing only generic act names without camera/asset/shader rows.",
      "- First viewport that fails the brand/composition test on immersive work.",
      "- USER_FLOWS describing SkillForge compose loop as the product journey.",
      "- Missing reduced-motion guidance on motion-led packages.",
      "- Any path that treats handoff text as execution authority.",
    ].join("\n"),
    "Selected reviewer skills": skillLines,
  };
}
