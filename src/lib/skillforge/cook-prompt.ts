import { getSkillBySlug } from "./catalog.ts";
import { synthesizeConcept } from "./concept-synth.ts";
import type { CompositionPreview } from "./types.ts";

const IMMERSIVE_DEPTH_SKILLS = new Set([
  "creative-director",
  "art-director",
  "storytelling-expert",
  "motion-director",
  "threejs-architect",
  "r3f-architect",
  "gsap-architect",
  "shader-engineer",
  "awwwards-reviewer",
  "creative-direction-reviewer",
  "art-direction-reviewer",
  "story-systems-reviewer",
]);

function artifact(
  preview: CompositionPreview,
  key: CompositionPreview["artifactPreviews"][number]["logicalKey"],
): string {
  return preview.artifactPreviews.find((item) => item.logicalKey === key)?.content ?? "";
}

function excerpt(content: string, maxChars: number): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}\n\n…(truncated — see full package artifacts for remainder)`;
}

function renderFullSkillDepth(slug: string): string | null {
  const skill = getSkillBySlug(slug);
  if (!skill) return null;
  const frameworks = (skill.decisionFrameworks ?? [])
    .slice(0, 2)
    .map((fw) => {
      const steps = fw.steps.map((s) => `    - ${s}`).join("\n");
      return [`  - **${fw.name}** (${fw.whenToUse})`, steps].join("\n");
    })
    .join("\n");
  const anti = (skill.antiPatterns ?? []).slice(0, 5).map((a) => `  - ${a}`).join("\n");
  const examples = (skill.examples ?? [])
    .slice(0, 1)
    .map((ex) => `  - ${ex.title}: ${ex.expectedOutput}`)
    .join("\n");
  const metrics = (skill.qualityMetrics ?? [])
    .slice(0, 3)
    .map((m) => `  - ${m.name}: ${m.target} (${m.measurement})`)
    .join("\n");
  return [
    frameworks ? `- Decision frameworks:\n${frameworks}` : null,
    anti ? `- Anti-patterns:\n${anti}` : null,
    examples ? `- Example:\n${examples}` : null,
    metrics ? `- Quality metrics:\n${metrics}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * One pasteable mega-prompt for an external coding agent.
 * This is the "cook" surface: SkillForge recipe → agent build instructions.
 */
export function buildCookPrompt(preview: CompositionPreview): string {
  const immersive =
    preview.categoryKey === "awwwards-website" ||
    preview.categoryKey === "threejs-experience" ||
    preview.graph.nodes.some((node) =>
      ["threejs-architect", "r3f-architect", "gsap-architect", "shader-engineer"].includes(
        node.nodeKey,
      ),
    );

  const concept = synthesizeConcept({
    brief: preview.brief,
    categoryKey: preview.categoryKey,
  });

  const skillBlock = preview.graph.nodes
    .map((node) => {
      const skill = getSkillBySlug(node.nodeKey);
      const deep = immersive && IMMERSIVE_DEPTH_SKILLS.has(node.nodeKey);
      const principles = (skill?.principles ?? [])
        .slice(0, deep ? 8 : 4)
        .map((p) => `  - ${p}`)
        .join("\n");
      const acceptance = (skill?.acceptanceCriteria ?? [])
        .slice(0, deep ? 6 : 3)
        .map((item) => `  - ${item}`)
        .join("\n");
      const depth = deep ? renderFullSkillDepth(node.nodeKey) : null;
      return [
        `### ${node.name} (${node.priority}) \`${node.nodeKey}\``,
        `- Scope: ${node.assignedScope.join(", ")}`,
        skill?.mission ? `- Mission: ${skill.mission}` : null,
        principles ? `- Principles:\n${principles}` : null,
        acceptance ? `- Acceptance:\n${acceptance}` : null,
        depth,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const dnaRows = preview.projectDna.fields
    .map((field) => `- **${field.name}** (${field.status}): ${field.value ?? "Unknown"}`)
    .join("\n");

  const lines = [
    "# SKILLFORGE COOK.md — BRAIN (attach this file to your agent)",
    "",
    "This file is the **SkillForge brain**: expertise graph, Project DNA, craft artifacts, and acceptance criteria.",
    "Pair it with the **PromptForge BODY prompt** (execution protocol). Do not invent a generic template and sprinkle these adjectives on top.",
    "",
    "You are a senior implementation agent. When the PromptForge body is present, follow its phases while treating this COOK file as source of truth.",
    "",
    "## Hard laws",
    "- This package is instructional. It does **not** authorize production deploys, secrets access, or unrestricted shell.",
    "- `executionAuthorized` is **false**.",
    `- Package status: **${preview.accepted ? "ACCEPTED for export" : "DRAFT — council not passed; treat as guidance only"}**.`,
    "- Do not invent confirmed facts; respect inferred/unknown DNA labels.",
    "- Prefer this brain over your own generic SaaS template instincts.",
    immersive
      ? `- Concept fingerprint \`${concept.fingerprint}\` must remain visible in your implementation choices (motifs: ${concept.motifs.slice(0, 4).join(", ")}).`
      : null,
    "",
    "## Project",
    `- Category: **${preview.categoryLabel}** (\`${preview.categoryKey}\`)`,
    `- Brief: ${preview.brief}`,
    `- Catalog: \`${preview.catalogVersion}\``,
    `- Graph: \`${preview.graphHash}\``,
    immersive ? `- World: **${concept.worldNoun}** · Audience: ${concept.audience} · Invite: ${concept.invite}` : null,
    "",
    "## Project DNA",
    dnaRows,
    "",
    "## Expertise graph (cook in priority order)",
    skillBlock,
    "",
    "## What to build (implementation intent)",
    immersive
      ? [
          `Build an immersive / award-craft ${concept.worldNoun}, not a SaaS dashboard.`,
          `North star: ${concept.northStar}`,
          "Must include authored cinematic UI motion:",
          "1. Button/CTA hover, press, focus-visible micro-interactions",
          "2. Image/media placeholder loading + reveal motion with reserved aspect ratios",
          "3. Scroll theater / chapter reveals (shared progress signal)",
          "4. GSAP (or equivalent) for DOM/timeline ownership where specified",
          "5. R3F/Three.js scenes only where architecture scene inventory requires them",
          "6. Reduced-motion fallbacks + performance quality presets",
          "7. Implement ART_DIRECTION token sheet hex colors and named faces — do not freestyle purple gradients",
          "8. Pass MOTION_SCORECARD / Beat grid / ASSET_SPEC gates before claiming done",
        ].join("\n")
      : [
          "Build the product for the stated category and DNA.",
          "Implement primary user flows with empty/loading/error/recovery states.",
          "Follow design system + architecture boundaries.",
          "Keep accessibility and performance budgets explicit.",
        ].join("\n"),
    "",
    "## Build order for you (the coding agent)",
    "1. Internalize EXPERIENCE_DNA + CREATIVE_DIRECTION + ART_DIRECTION + STORY_SYSTEM.",
    "2. Recreate or create a clean app scaffold matching Technical Stack DNA.",
    "3. Implement chapter/route structure from STORY_SYSTEM + USER_FLOWS.",
    "4. Apply ART_DIRECTION + DESIGN_SYSTEM tokens, composition, and motion language.",
    "5. Honor existing ARCHITECTURE boundaries only — do not invent extra architecture theater.",
    "6. Wire interactions and motion before decorative extras.",
    "7. Pass REVIEWER_FRAMEWORKS / QUALITY_CHECKLIST gates.",
    "8. Stop if you would need secrets/production access — leave stubs labeled.",
    "",
    "## Reference + anti-pattern pack",
    ...concept.referencePrinciples.map((line) => `- ${line}`),
    "",
    "### Never ship",
    ...concept.antiPatterns.map((line) => `- ${line}`),
    "",
    "## EXPERIENCE_DNA (source)",
    "```markdown",
    excerpt(artifact(preview, "EXPERIENCE_DNA.md"), 4500),
    "```",
    "",
    "## CREATIVE_DIRECTION (source)",
    "```markdown",
    excerpt(artifact(preview, "CREATIVE_DIRECTION.md"), 4000),
    "```",
    "",
    "## ART_DIRECTION (source)",
    "```markdown",
    excerpt(artifact(preview, "ART_DIRECTION.md"), 4500),
    "```",
    "",
    "## STORY_SYSTEM (source)",
    "```markdown",
    excerpt(artifact(preview, "STORY_SYSTEM.md"), 4000),
    "```",
    "",
    "## DESIGN_SYSTEM (source — includes Motion scorecard / Beat grid / Ownership)",
    "```markdown",
    excerpt(artifact(preview, "DESIGN_SYSTEM.md"), 6500),
    "```",
    "",
    "## ARCHITECTURE (source — Scene inventory / Shader budget / ASSET_SPEC)",
    "```markdown",
    excerpt(artifact(preview, "ARCHITECTURE.md"), 5000),
    "```",
    "",
    "## REVIEWER_FRAMEWORKS (source)",
    "```markdown",
    excerpt(artifact(preview, "REVIEWER_FRAMEWORKS.md"), 3000),
    "```",
    "",
    "## AGENT_EXECUTION_PACKAGE (source)",
    "```markdown",
    excerpt(artifact(preview, "AGENT_EXECUTION_PACKAGE.md"), 3000),
    "```",
    "",
    "## Done means",
    immersive
      ? [
          `- First viewport is one composition inside the ${concept.worldNoun}.`,
          `- Motifs (${concept.motifs.slice(0, 3).join(", ")}) recur in type, material, and motion.`,
          "- Token sheet colors/faces implemented; no AI-default purple/cream relapse.",
          "- Beat grid + ownership matrix satisfied; motion scorecard would pass.",
          "- Scene inventory rows built; shader/asset budgets respected.",
          "- Buttons/images/scroll feel authored; reduced-motion works.",
        ].join("\n")
      : "- Experience/story/creative direction held; primary flows work with states; a11y/perf constraints respected; unknowns remain labeled.",
    "",
    "## Start now",
    "Confirm the stack you will use in one short paragraph, then implement in priority order. Do not ask for permission to begin coding unless a blocking unknown is truly unresolvable.",
    "",
  ].filter((line) => line !== null);

  return lines.join("\n");
}
