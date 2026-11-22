import draftTemplateSet from "../../../templates/draft-set-1.0.0.json";
import { CATALOG_VERSION } from "./catalog.ts";
import {
  BLUEPRINT_ARTIFACTS,
  type CompositionPreview,
  type ProjectDnaField,
  type SkillGraphEdge,
  type SkillGraphNode,
} from "./types.ts";

export const TEMPLATE_SET_VERSION = `${draftTemplateSet.templateSetId}@${draftTemplateSet.version}`;

type DnaField = CompositionPreview["projectDna"]["fields"][number];

type DraftTemplate = {
  logicalKey: (typeof BLUEPRINT_ARTIFACTS)[number];
  title: string;
  requiredSections: string[];
  dnaBindings?: Record<string, ProjectDnaField>;
};

const TEMPLATES = draftTemplateSet.templates as DraftTemplate[];

function escapeMarkdownText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function draftBanner(logicalKey: string): string[] {
  return [
    `# ${logicalKey}`,
    "",
    "> DRAFT PREVIEW — not reviewed, accepted, or executable.",
    `> Template set: \`${TEMPLATE_SET_VERSION}\``,
    "",
  ];
}

function renderDnaSection(
  heading: string,
  fieldName: ProjectDnaField,
  fields: readonly DnaField[],
): string[] {
  const field = fields.find((entry) => entry.name === fieldName);
  if (!field) {
    return [`## ${heading}`, "", "- Status: unknown", "- Value: Unknown", ""];
  }
  if (field.status === "unknown" || field.value == null) {
    return [
      `## ${heading}`,
      "",
      "- Status: unknown",
      "- Value: Unknown — not inferred in this draft.",
      `- Source: \`${field.source}\``,
      "",
    ];
  }
  return [
    `## ${heading}`,
    "",
    `- Status: ${field.status}`,
    `- Value: ${escapeMarkdownText(field.value)}`,
    `- Source: \`${field.source}\``,
    "",
  ];
}

function renderUnknownSections(headings: readonly string[]): string[] {
  return headings.flatMap((heading) => [
    `## ${heading}`,
    "",
    "Unknown — not inferred in this draft. Remains open until Project DNA or review evidence resolves it.",
    "",
  ]);
}

function renderMasterSkillPackage(
  brief: string,
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] },
  graphHash: string,
): string {
  const nodeLines = graph.nodes
    .map(
      (node, index) =>
        `${index + 1}. **${node.name}** (\`${node.skillVersion}\`, ${node.priority})\n` +
        `   - Scope: ${node.assignedScope.join(", ")}\n` +
        `   - Rationale: ${node.rationale}`,
    )
    .join("\n");
  const edgeLines = graph.edges.length
    ? graph.edges.map((edge) => `- \`${edge.from}\` → \`${edge.to}\` (${edge.type})`).join("\n")
    : "- No dependency edges.";

  return [
    ...draftBanner("MASTER_SKILL_PACKAGE.md"),
    "## Project intent",
    "",
    ...brief.split(/\r?\n/).map((line) => `> ${escapeMarkdownText(line)}`),
    "",
    "## Selected core expertise",
    "",
    nodeLines,
    "",
    "## Dependency graph",
    "",
    edgeLines,
    "",
    "## Provenance",
    "",
    `- Catalog: \`${CATALOG_VERSION}\``,
    `- Template set: \`${TEMPLATE_SET_VERSION}\``,
    `- Graph SHA-256: \`${graphHash}\``,
    "- Scope: Tier 1 Core Thinking pilot only.",
    "- Review Council: not run.",
    "- Draft package only; not an agent execution handoff.",
    "",
  ].join("\n");
}

function renderProjectDna(fields: readonly DnaField[]): string {
  const rows = fields
    .map((field) => {
      const value = escapeMarkdownText(field.value ?? "Unknown")
        .replace(/\|/g, "\\|")
        .replace(/\r?\n/g, "<br>");
      return `| ${field.name} | ${field.status} | ${value} |`;
    })
    .join("\n");

  return [
    ...draftBanner("PROJECT_DNA.md"),
    "## Field status table",
    "",
    "| Field | Status | Value |",
    "|---|---|---|",
    rows,
    "",
    "## Provenance note",
    "",
    "Only Vision is populated from the user brief. No market, user, business, technical, or risk claims are inferred in this draft.",
    "",
  ].join("\n");
}

function renderBoundArtifact(
  template: DraftTemplate,
  fields: readonly DnaField[],
): string {
  const lines = [...draftBanner(template.logicalKey)];
  for (const section of template.requiredSections) {
    const dnaField = template.dnaBindings?.[section];
    if (dnaField) {
      lines.push(...renderDnaSection(section, dnaField, fields));
    } else {
      lines.push(...renderUnknownSections([section]));
    }
  }
  return lines.join("\n");
}

function renderAiSystemDesign(): string {
  return [
    ...draftBanner("AI_SYSTEM_DESIGN.md"),
    "## Applicability",
    "",
    "This pilot targets the AI Product category, so an AI system design is expected. Specific model, retrieval, and evaluation choices remain unknown until Project DNA and review evidence resolve them.",
    "",
    "## Models and context",
    "",
    "Unknown — not inferred in this draft.",
    "",
    "## Evaluation and safety",
    "",
    "Unknown — not inferred in this draft. Safety and evaluation gates remain mandatory before any accepted package.",
    "",
    "## Open decisions",
    "",
    "Unknown — not inferred in this draft.",
    "",
  ].join("\n");
}

function renderAgentExecutionPackage(
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] },
  graphHash: string,
): string {
  const taskLines = graph.nodes
    .map(
      (node, index) =>
        `${index + 1}. ${node.name} (${node.priority}) — scope: ${node.assignedScope.join(", ")}`,
    )
    .join("\n");

  return [
    ...draftBanner("AGENT_EXECUTION_PACKAGE.md"),
    "## Bounded task graph",
    "",
    taskLines,
    "",
    "## Prerequisites",
    "",
    "- Accepted package after Review Council (not satisfied).",
    "- Resolved critical Project DNA unknowns needed for the requested tasks.",
    "",
    "## Stop conditions",
    "",
    "- Any mandatory artifact or reviewer gate fails.",
    "- A required Project DNA field remains unknown for a blocking decision.",
    "- Instructions would require secrets, production access, or unrestricted tools.",
    "",
    "## Prohibited operations",
    "",
    "- Execute against production systems.",
    "- Embed or request live credentials.",
    "- Grant unrestricted shell or network permissions.",
    "- Treat draft handoff text as execution authority.",
    "",
    "## Handoff status",
    "",
    "- Status: blocked",
    "- Package accepted: false",
    "- Execution authorized: false",
    `- Graph SHA-256: \`${graphHash}\``,
    "",
  ].join("\n");
}

function renderQualityChecklist(
  presentArtifacts: readonly string[],
  missingArtifacts: readonly string[],
): string {
  return [
    ...draftBanner("QUALITY_CHECKLIST.md"),
    "## Package completeness",
    "",
    `- Present artifacts: ${presentArtifacts.length}/${BLUEPRINT_ARTIFACTS.length}`,
    `- Missing artifacts: ${missingArtifacts.length === 0 ? "none" : missingArtifacts.join(", ")}`,
    "",
    "## Review Council gate",
    "",
    "- Status: evaluated after draft generation by the deterministic council.",
    "- Acceptance requires every mandatory reviewer to pass the versioned rubric with evidence.",
    "",
    "## Evidence requirements",
    "",
    "- Every score must cite artifact, section, rubric version, and rationale.",
    "- Unknown Project DNA fields must remain labeled unknown.",
    "",
    "## Acceptance blockers",
    "",
    "- Review Council has not run.",
    "- Package remains draft and must not be marked accepted.",
    "- Export/handoff remains blocked.",
    "",
  ].join("\n");
}

export function renderDraftBlueprints(input: {
  brief: string;
  graphHash: string;
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] };
  fields: readonly DnaField[];
}): CompositionPreview["artifactPreviews"] {
  const byKey = new Map<string, string>();

  byKey.set(
    "MASTER_SKILL_PACKAGE.md",
    renderMasterSkillPackage(input.brief, input.graph, input.graphHash),
  );
  byKey.set("PROJECT_DNA.md", renderProjectDna(input.fields));

  for (const template of TEMPLATES) {
    if (
      template.logicalKey === "MASTER_SKILL_PACKAGE.md" ||
      template.logicalKey === "PROJECT_DNA.md"
    ) {
      continue;
    }
    if (template.logicalKey === "AI_SYSTEM_DESIGN.md") {
      byKey.set(template.logicalKey, renderAiSystemDesign());
      continue;
    }
    if (template.logicalKey === "AGENT_EXECUTION_PACKAGE.md") {
      byKey.set(
        template.logicalKey,
        renderAgentExecutionPackage(input.graph, input.graphHash),
      );
      continue;
    }
    if (template.logicalKey === "QUALITY_CHECKLIST.md") {
      byKey.set(
        template.logicalKey,
        renderQualityChecklist([...BLUEPRINT_ARTIFACTS], []),
      );
      continue;
    }
    byKey.set(template.logicalKey, renderBoundArtifact(template, input.fields));
  }

  return BLUEPRINT_ARTIFACTS.map((logicalKey) => {
    const content = byKey.get(logicalKey);
    if (!content) {
      throw new Error(`Draft template missing renderer for ${logicalKey}.`);
    }
    return {
      logicalKey,
      content,
      templateVersion: TEMPLATE_SET_VERSION,
    };
  });
}

export function listDraftTemplateKeys(): (typeof BLUEPRINT_ARTIFACTS)[number][] {
  const keys = TEMPLATES.map((template) => template.logicalKey);
  for (const required of BLUEPRINT_ARTIFACTS) {
    if (!keys.includes(required)) {
      throw new Error(`Draft template set is missing ${required}.`);
    }
  }
  return [...BLUEPRINT_ARTIFACTS];
}
