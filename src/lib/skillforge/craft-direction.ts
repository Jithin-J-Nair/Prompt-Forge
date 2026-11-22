import type { ProjectCategoryKey } from "./categories.ts";
import { isImmersiveCategory } from "./blueprints-content.ts";
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
  const user = fieldValue(fields, "User") ?? "primary visitor";
  const vision = fieldValue(fields, "Vision") ?? briefClip(brief);
  const differentiation =
    fieldValue(fields, "Differentiation") ??
    (isImmersiveCategory(categoryKey)
      ? "Craft-led immersive presence instead of template marketing chrome"
      : "Clear job-to-be-done with distinctive experience cues");

  if (isImmersiveCategory(categoryKey)) {
    return {
      "Experience thesis": [
        `- Promise: ${vision}`,
        `- For: ${user}`,
        `- Why distinctive: ${differentiation}`,
        `- Medium: ${categoryKey === "threejs-experience" ? "WebGL-first experience host + quiet DOM shell" : "Awwwards-class scroll theater with authored motion"}`,
        `- Brief signal: ${briefClip(brief)}`,
      ].join("\n"),
      "Emotional arc": [
        "- Arrival: awe + brand recognition within ~3 seconds (one composition).",
        "- Deepening: curiosity through chapter reveals (craft proof, not feature dump).",
        "- Proof: confidence via work/scene evidence the visitor can feel.",
        "- Invite: calm resolve — clear CTA without hard sell wallpaper.",
      ].join("\n"),
      "Sensory register": [
        "- Sight: atmospheric base, one decisive accent, purposeful display type.",
        "- Motion: 2–5 signature beats; silence between beats is intentional.",
        "- Sound: optional; never required for comprehension; captions if used.",
        "- Touch: pointer/focus feedback on CTAs and focal hotspots only.",
      ].join("\n"),
      "Visitor jobs": [
        `1) ${user} understands what this brand/world stands for.`,
        "2) Experiences craft proof without reading a paragraph wall.",
        "3) Reaches a single primary invite with keyboard-accessible escape routes.",
      ].join("\n"),
      "Anti-experience": [
        "- Card-grid heroes, floating promo chips, stat strips in first viewport.",
        "- Constant scroll-triggered noise on every element.",
        "- SaaS dashboard chrome posing as an immersive brand world.",
        "- Claiming awards or cloning studio signatures.",
      ].join("\n"),
    };
  }

  return {
    "Experience thesis": [
      `- Promise: ${vision}`,
      `- For: ${user}`,
      `- Why distinctive: ${differentiation}`,
      `- Category: ${categoryKey.replace(/-/g, " ")}`,
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
  const differentiation = fieldValue(fields, "Differentiation");
  const immersive = isImmersiveCategory(categoryKey);

  return {
    "North star concept": [
      immersive
        ? `- One bold idea the whole experience serves (not a collage of trends). Brief: ${briefClip(brief)}`
        : `- Product concept in one sentence derived from the brief: ${briefClip(brief)}`,
      differentiation ? `- Differentiation lock: ${differentiation}` : "- Differentiation still hypothesis — label it as such in UI copy.",
      immersive
        ? "- Creative medium lock: immersive web craft (motion + optional WebGL), not a marketing template."
        : `- Creative medium lock: ${categoryKey.replace(/-/g, " ")} product craft.`,
    ].join("\n"),
    "Creative pillars": immersive
      ? [
          "1) Presence — first viewport is one composition.",
          "2) Authored motion — signature beats with owners (GSAP / R3F / shader).",
          "3) Restraint — silence between beats; chrome stays quiet.",
          "4) Honesty — inferences labeled; no fake award claims.",
        ].join("\n")
      : [
          "1) Clarity — primary job visible above the fold of the task.",
          "2) Coherence — tokens, voice, and flows agree.",
          "3) Trust — states and recovery feel deliberate.",
          "4) Honesty — unknowns stay labeled in the package.",
        ].join("\n"),
    "Reference posture": [
      "- Use references as posture (energy, pacing, craft bar), never as clones.",
      "- Forbidden: copying identifiable studio layouts/signatures as if original.",
      "- Prefer inventing from pillars + brief over trend pastiche.",
    ].join("\n"),
    "Decision rules": [
      "- If two ideas compete, keep the one that strengthens the north star.",
      "- Cut decoration that does not serve thesis, pillars, or visitor jobs.",
      "- Immersive claims require budgets, inventories, and reduced-motion paths.",
    ].join("\n"),
    "Forbidden patterns": [
      "- Purple-glow / cream+terracotta AI-default aesthetics unless brief confirms.",
      "- Inter/Roboto/Arial as the display voice for brand-led work.",
      "- Hero card grids, floating badges, and stat strips on experience sites.",
      "- Treating SkillForge compose UI as the product’s user journey.",
    ].join("\n"),
  };
}

/** Art Direction — visual system law agents can execute. */
export function renderArtDirectionBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const immersive = isImmersiveCategory(categoryKey);
  const features = fieldValue(fields, "Core Features");

  return {
    "Art bible": [
      immersive
        ? "- Visual plane: edge-to-edge experience canvas; UI chrome is quiet scaffolding."
        : "- Visual plane: task surface first; chrome second.",
      "- Type pairing: expressive display for brand moments + restrained UI face for chrome.",
      "- Color: atmospheric base + one decisive accent; document hex/oklch candidates as hypotheses until brand confirms.",
      features ? `- Feature-driven motifs: ${features}` : "- Motifs derive from brief nouns/verbs — not generic tech icons.",
      `- Brief cue: ${briefClip(brief)}`,
    ].join("\n"),
    "Composition law": immersive
      ? [
          "- First viewport: brand, one headline, one support line, one CTA group, one dominant full-bleed visual.",
          "- No inset hero cards, side-panel media, or tiled collage as the hero idea.",
          "- Chapters read as acts, not stacked marketing bands.",
        ].join("\n")
      : [
          "- Primary action is visually dominant on each key screen.",
          "- Density serves scanning; avoid ornament that competes with the job.",
          "- Empty states are designed, not blank voids.",
        ].join("\n"),
    "Material & imagery": immersive
      ? [
          "- Prefer custom scene materials / photography direction over stock collage.",
          "- Placeholder media must reserve aspect ratio and reveal with authored motion.",
          "- Texture/noise only when it supports atmosphere; never as filler.",
        ].join("\n")
      : [
          "- Imagery supports comprehension of the job or brand proof.",
          "- Icons only when they speed recognition; avoid icon wallpaper.",
        ].join("\n"),
    "UI chrome rules": [
      "- Navigation is quiet; motion reserved for intentional moments.",
      "- Focus-visible rings required; never color-only status.",
      "- Buttons: hover/press/focus states specified in motion language (see DESIGN_SYSTEM).",
    ].join("\n"),
    "Rejected looks": [
      "- Default AI purple gradients and glow stacks.",
      "- Warm cream + terracotta + generic serif ‘premium’ cliché unless brand confirms.",
      "- Broadsheet hairline newspaper pastiche for product UIs.",
      "- Dark-mode-by-default without brief confirmation.",
    ].join("\n"),
  };
}

/** Story System — narrative beats and chapter map. */
export function renderStorySystemBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  const user = fieldValue(fields, "User") ?? "visitor";
  const immersive = isImmersiveCategory(categoryKey);

  if (immersive) {
    return {
      "Narrative premise": [
        `- Protagonist: ${user}`,
        `- World promise from brief: ${briefClip(brief)}`,
        "- Conflict: indifference / sameness of the web; resolution: memorable craft presence + clear invite.",
      ].join("\n"),
      "Beat sheet": [
        "1) Hook — arrival world establishes brand in one composition.",
        "2) Turn — first chapter proves craft (scene / work / capability).",
        "3) Deepen — optional interaction or case chapter with evidence.",
        "4) Resolve — invite/contact landing with one primary CTA.",
        "5) Escape — skip-to-content / reduced-motion path always available.",
      ].join("\n"),
      "Chapter map": [
        "| Chapter | Job | Proof | CTA posture |",
        "|---|---|---|---|",
        "| Arrival | Orient + feel | Brand world visual | Soft or delayed |",
        "| Craft proof | Believe | Scene / motion signature | None or tertiary |",
        "| Evidence | Trust | Work / case chapter | Optional deep link |",
        "| Invite | Act | Clear next step | Primary CTA |",
      ].join("\n"),
      "Message hierarchy": [
        "- L1: Brand / product name (hero-level).",
        "- L2: One promise line.",
        "- L3: One supporting sentence.",
        "- L4: Chapter captions — short, timed with motion ownership.",
        "- Never let secondary marketing blocks outrank L1–L3 in the first viewport.",
      ].join("\n"),
      "Voice & tone": [
        "- Confident, specific, sparse — craft speaks louder than adjectives.",
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
          "- **Creative Director** → CREATIVE_DIRECTION.md: north star, pillars, forbidden patterns.",
          "- **Awwwards Reviewer** → EXPERIENCE_DNA.md + ART_DIRECTION.md: thesis, composition law, anti-experience.",
          "- **UX Architect** → STORY_SYSTEM.md + USER_FLOWS.md: beats, chapter map, visitor journey.",
          "- **Accessibility Reviewer** → DESIGN_SYSTEM.md: reduced-motion, focus, contrast.",
          "- **Performance Engineer** → ARCHITECTURE.md / QUALITY_CHECKLIST.md: budgets only as needed — do not expand architecture theater.",
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
        ? "- Immersive packages must show Experience DNA, Creative Direction, Art Direction, Story System density — not architecture essays alone."
        : "- Packages must show coherent strategy + story + design evidence.",
    ].join("\n"),
    "Fail conditions": [
      "- Empty binders with high scores.",
      "- First viewport that fails the brand/composition test on immersive work.",
      "- USER_FLOWS describing SkillForge compose loop as the product journey.",
      "- Missing reduced-motion guidance on motion-led packages.",
      "- Any path that treats handoff text as execution authority.",
    ].join("\n"),
    "Selected reviewer skills": skillLines,
  };
}
