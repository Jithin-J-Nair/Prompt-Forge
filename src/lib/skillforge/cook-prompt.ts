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
    "1. Recreate or create a clean app scaffold matching Technical Stack DNA.",
    "2. Implement information architecture / routes from USER_FLOWS.",
    "3. Apply DESIGN_SYSTEM tokens, composition, and motion language.",
    "4. Implement ARCHITECTURE boundaries (shell vs experience host if immersive).",
    "5. Wire interactions and motion before decorative extras.",
    "6. Add quality gates from QUALITY_CHECKLIST.",
    "7. Stop if you would need secrets/production access — leave stubs labeled.",
    "",
    "## DESIGN_SYSTEM (source)",
    "```markdown",
    excerpt(artifact(preview, "DESIGN_SYSTEM.md"), 4500),
    "```",
    "",
    "## ARCHITECTURE (source)",
    "```markdown",
    excerpt(artifact(preview, "ARCHITECTURE.md"), 4000),
    "```",
    "",
    "## USER_FLOWS (source)",
    "```markdown",
    excerpt(artifact(preview, "USER_FLOWS.md"), 3000),
    "```",
    "",
    "## AGENT_EXECUTION_PACKAGE (source)",
    "```markdown",
    excerpt(artifact(preview, "AGENT_EXECUTION_PACKAGE.md"), 3500),
    "```",
    "",
    "## QUALITY_CHECKLIST (source)",
    "```markdown",
    excerpt(artifact(preview, "QUALITY_CHECKLIST.md"), 2000),
    "```",
    "",
    "## Done means",
    immersive
      ? "- First viewport is one composition; buttons/images/scroll feel authored; GSAP/R3F used where the pack requires; reduced-motion works; no placeholder SaaS card-grid hero."
      : "- Primary flows work with states; architecture matches DNA; a11y/perf constraints respected; unknowns remain labeled.",
    "",
    "## Start now",
    "Confirm the stack you will use in one short paragraph, then implement in priority order. Do not ask for permission to begin coding unless a blocking unknown is truly unresolvable.",
    "",
  ];

  return lines.join("\n");
}
