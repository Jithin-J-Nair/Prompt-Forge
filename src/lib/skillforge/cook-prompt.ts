import { getSkillBySlug } from "./catalog.ts";
import type { CompositionPreview } from "./types.ts";

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

  const skillBlock = preview.graph.nodes
    .map((node) => {
      const skill = getSkillBySlug(node.nodeKey);
      const principles = (skill?.principles ?? []).slice(0, 4).map((p) => `  - ${p}`).join("\n");
      const acceptance = (skill?.acceptanceCriteria ?? [])
        .slice(0, 3)
        .map((item) => `  - ${item}`)
        .join("\n");
      return [
        `### ${node.name} (${node.priority})`,
        `- Scope: ${node.assignedScope.join(", ")}`,
        skill?.mission ? `- Mission: ${skill.mission}` : null,
        principles ? `- Principles:\n${principles}` : null,
        acceptance ? `- Acceptance:\n${acceptance}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const dnaRows = preview.projectDna.fields
    .map((field) => `- **${field.name}** (${field.status}): ${field.value ?? "Unknown"}`)
    .join("\n");

  const lines = [
    "# SKILLFORGE COOK PROMPT — paste into a coding AI agent",
    "",
    "You are a senior implementation agent. Your job is to **build the product described below** from this SkillForge package.",
    "",
    "## Hard laws",
    "- This package is instructional. It does **not** authorize production deploys, secrets access, or unrestricted shell.",
    "- `executionAuthorized` is **false**.",
    `- Package status: **${preview.accepted ? "ACCEPTED for export" : "DRAFT — council not passed; treat as guidance only"}**.`,
    "- Do not invent confirmed facts; respect inferred/unknown DNA labels.",
    "- Prefer the package over your own generic SaaS template instincts.",
    "",
    "## Project",
    `- Category: **${preview.categoryLabel}** (\`${preview.categoryKey}\`)`,
    `- Brief: ${preview.brief}`,
    `- Catalog: \`${preview.catalogVersion}\``,
    `- Graph: \`${preview.graphHash}\``,
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
          "Build an immersive / award-craft web experience, not a SaaS dashboard.",
          "Must include authored cinematic UI motion:",
          "1. Button/CTA hover, press, focus-visible micro-interactions",
          "2. Image/media placeholder loading + reveal motion with reserved aspect ratios",
          "3. Scroll theater / chapter reveals (shared progress signal)",
          "4. GSAP (or equivalent) for DOM/timeline ownership where specified",
          "5. R3F/Three.js scenes only where architecture scene inventory requires them",
          "6. Reduced-motion fallbacks + performance quality presets",
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
    "## EXPERIENCE_DNA (source)",
    "```markdown",
    excerpt(artifact(preview, "EXPERIENCE_DNA.md"), 3500),
    "```",
    "",
    "## CREATIVE_DIRECTION (source)",
    "```markdown",
    excerpt(artifact(preview, "CREATIVE_DIRECTION.md"), 3000),
    "```",
    "",
    "## ART_DIRECTION (source)",
    "```markdown",
    excerpt(artifact(preview, "ART_DIRECTION.md"), 3000),
    "```",
    "",
    "## STORY_SYSTEM (source)",
    "```markdown",
    excerpt(artifact(preview, "STORY_SYSTEM.md"), 3000),
    "```",
    "",
    "## DESIGN_SYSTEM (source)",
    "```markdown",
    excerpt(artifact(preview, "DESIGN_SYSTEM.md"), 4000),
    "```",
    "",
    "## REVIEWER_FRAMEWORKS (source)",
    "```markdown",
    excerpt(artifact(preview, "REVIEWER_FRAMEWORKS.md"), 2500),
    "```",
    "",
    "## AGENT_EXECUTION_PACKAGE (source)",
    "```markdown",
    excerpt(artifact(preview, "AGENT_EXECUTION_PACKAGE.md"), 3000),
    "```",
    "",
    "## Done means",
    immersive
      ? "- First viewport is one composition; story beats land; art direction holds; buttons/images/scroll feel authored; GSAP/R3F used where required; reduced-motion works; no SaaS card-grid hero."
      : "- Experience/story/creative direction held; primary flows work with states; a11y/perf constraints respected; unknowns remain labeled.",
    "",
    "## Start now",
    "Confirm the stack you will use in one short paragraph, then implement in priority order. Do not ask for permission to begin coding unless a blocking unknown is truly unresolvable.",
    "",
  ];

  return lines.join("\n");
}
