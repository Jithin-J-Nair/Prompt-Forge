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

function packageBanner(logicalKey: string, accepted: boolean): string[] {
  return [
    `# ${logicalKey}`,
    "",
    accepted
      ? "> ACCEPTED FOR EXPORT — instructional handoff only; executionAuthorized remains false."
      : "> DRAFT PACKAGE — Review Council gate not yet passed.",
    `> Template set: \`${TEMPLATE_SET_VERSION}\``,
    "",
  ];
}

function fieldValue(fields: readonly DnaField[], name: ProjectDnaField): DnaField | undefined {
  return fields.find((field) => field.name === name);
}

function renderDnaSection(
  heading: string,
  fieldName: ProjectDnaField,
  fields: readonly DnaField[],
): string[] {
  const field = fieldValue(fields, fieldName);
  if (!field || field.status === "unknown" || field.value == null) {
    return [
      `## ${heading}`,
      "",
      "- Status: unknown",
      "- Value: Unknown — not inferred in this draft.",
      `- Source: \`${field?.source ?? "unresolved"}\``,
      "",
    ];
  }
  return [
    `## ${heading}`,
    "",
    `- Status: ${field.status}`,
    `- Value: ${escapeMarkdownText(field.value)}`,
    `- Source: \`${field.source}\``,
    ...(field.confidence != null ? [`- Confidence: ${field.confidence}`] : []),
    "",
  ];
}

function renderGuidanceSection(heading: string, body: string): string[] {
  return [`## ${heading}`, "", body, ""];
}

function renderMasterSkillPackage(
  brief: string,
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] },
  graphHash: string,
  accepted: boolean,
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
    ...packageBanner("MASTER_SKILL_PACKAGE.md", accepted),
    "## Project intent",
    "",
    ...brief.split(/\r?\n/).map((line) => `> ${escapeMarkdownText(line)}`),
    "",
    "## Selected expertise",
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
    `- Package status: ${accepted ? "accepted_for_export" : "draft"}`,
    "- Execution authorized: false",
    "",
  ].join("\n");
}

function renderProjectDna(fields: readonly DnaField[], accepted: boolean): string {
  const rows = fields
    .map((field) => {
      const value = escapeMarkdownText(field.value ?? "Unknown")
        .replace(/\|/g, "\\|")
        .replace(/\r?\n/g, "<br>");
      return `| ${field.name} | ${field.status} | ${value} |`;
    })
    .join("\n");

  return [
    ...packageBanner("PROJECT_DNA.md", accepted),
    "## Field status table",
    "",
    "| Field | Status | Value |",
    "|---|---|---|",
    rows,
    "",
    "## Provenance note",
    "",
    "Vision is confirmed from the user brief. Other fields may be inferred with explicit confidence; unknowns stay labeled.",
    "",
  ].join("\n");
}

function renderBoundArtifact(
  template: DraftTemplate,
  fields: readonly DnaField[],
  accepted: boolean,
): string {
  const lines = [...packageBanner(template.logicalKey, accepted)];
  for (const section of template.requiredSections) {
    const dnaField = template.dnaBindings?.[section];
    if (dnaField) {
      lines.push(...renderDnaSection(section, dnaField, fields));
      continue;
    }
    if (section === "Open decisions") {
      const unknowns = fields.filter((field) => field.status === "unknown").map((f) => f.name);
      lines.push(
        ...renderGuidanceSection(
          section,
          unknowns.length
            ? `Still open: ${unknowns.join(", ")}.`
            : "No blocking DNA unknowns remain; continue monitoring review findings.",
        ),
      );
      continue;
    }
    if (section.toLowerCase().includes("accessib")) {
      lines.push(
        ...renderGuidanceSection(
          section,
          "Meet applicable WCAG-oriented acceptance checks; treat unverified claims as open.",
        ),
      );
      continue;
    }
    if (section.toLowerCase().includes("visual") || section.toLowerCase().includes("interaction")) {
      const features = fieldValue(fields, "Core Features")?.value;
      lines.push(
        ...renderGuidanceSection(
          section,
          features
            ? `Derive visual/interaction principles from core features: ${features}.`
            : "Define principles after core features are confirmed.",
        ),
      );
      continue;
    }
    lines.push(
      ...renderGuidanceSection(
        section,
        "Structured placeholder derived from composition policy; refine with confirmed evidence before production claims.",
      ),
    );
  }
  return lines.join("\n");
}

function renderAiSystemDesign(fields: readonly DnaField[], accepted: boolean): string {
  const stack = fieldValue(fields, "Technical Stack");
  const applicable =
    (stack?.value ?? "").toLowerCase().includes("model") ||
    (stack?.value ?? "").toLowerCase().includes("retrieval") ||
    (stack?.value ?? "").toLowerCase().includes("eval");

  return [
    ...packageBanner("AI_SYSTEM_DESIGN.md", accepted),
    "## Applicability",
    "",
    applicable
      ? "AI capabilities are in scope for this category/brief."
      : "AI may be optional; state not_applicable only with rationale if no model use is required.",
    "",
    ...renderDnaSection("Models and context", "Technical Stack", fields),
    ...renderGuidanceSection(
      "Evaluation and safety",
      fieldValue(fields, "Success Metrics")?.value
        ? `Tie evals to: ${fieldValue(fields, "Success Metrics")?.value}. Keep unsafe tool use blocked.`
        : "Define evals before trusting model output; keep unsafe tool use blocked.",
    ),
    ...renderGuidanceSection(
      "Open decisions",
      "Provider choice, retention of prompts, and customer-managed credentials remain product decisions.",
    ),
  ].join("\n");
}

function renderAgentExecutionPackage(
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] },
  graphHash: string,
  accepted: boolean,
): string {
  const taskLines = graph.nodes
    .map(
      (node, index) =>
        `${index + 1}. ${node.name} (${node.priority}) — scope: ${node.assignedScope.join(", ")}`,
    )
    .join("\n");

  return [
    ...packageBanner("AGENT_EXECUTION_PACKAGE.md", accepted),
    "## Bounded task graph",
    "",
    taskLines,
    "",
    "## Prerequisites",
    "",
    accepted
      ? "- Package accepted for export by Review Council."
      : "- Accepted package after Review Council (not satisfied yet).",
    "- Critical DNA unknowns resolved or explicitly deferred.",
    "",
    "## Stop conditions",
    "",
    "- Any mandatory artifact or reviewer gate fails.",
    "- Instructions would require secrets, production access, or unrestricted tools.",
    "",
    "## Prohibited operations",
    "",
    "- Execute against production systems.",
    "- Embed or request live credentials.",
    "- Grant unrestricted shell or network permissions.",
    "- Treat handoff text as execution authority.",
    "",
    "## Handoff status",
    "",
    `- Status: ${accepted ? "prepared" : "blocked"}`,
    `- Package accepted: ${accepted}`,
    "- Execution authorized: false",
    `- Graph SHA-256: \`${graphHash}\``,
    "",
  ].join("\n");
}

function renderQualityChecklist(
  accepted: boolean,
  unknownCount: number,
): string {
  return [
    ...packageBanner("QUALITY_CHECKLIST.md", accepted),
    "## Package completeness",
    "",
    `- Present artifacts: ${BLUEPRINT_ARTIFACTS.length}/${BLUEPRINT_ARTIFACTS.length}`,
    "- Missing artifacts: none",
    "",
    "## Review Council gate",
    "",
    accepted
      ? "- Status: passed for export."
      : "- Status: pending/blocked until thresholds and findings clear.",
    "",
    "## Evidence requirements",
    "",
    "- Every score must cite artifact, rubric version, and rationale.",
    `- Unknown DNA fields remaining: ${unknownCount}`,
    "",
    "## Acceptance blockers",
    "",
    accepted
      ? "- None for export acceptance; execution remains unauthorized."
      : "- Review Council gate has not passed.",
    "",
  ].join("\n");
}

export function renderDraftBlueprints(input: {
  brief: string;
  graphHash: string;
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] };
  fields: readonly DnaField[];
  accepted?: boolean;
}): CompositionPreview["artifactPreviews"] {
  const accepted = input.accepted ?? false;
  const unknownCount = input.fields.filter((field) => field.status === "unknown").length;
  const byKey = new Map<string, string>();

  byKey.set(
    "MASTER_SKILL_PACKAGE.md",
    renderMasterSkillPackage(input.brief, input.graph, input.graphHash, accepted),
  );
  byKey.set("PROJECT_DNA.md", renderProjectDna(input.fields, accepted));

  for (const template of TEMPLATES) {
    if (
      template.logicalKey === "MASTER_SKILL_PACKAGE.md" ||
      template.logicalKey === "PROJECT_DNA.md"
    ) {
      continue;
    }
    if (template.logicalKey === "AI_SYSTEM_DESIGN.md") {
      byKey.set(template.logicalKey, renderAiSystemDesign(input.fields, accepted));
      continue;
    }
    if (template.logicalKey === "AGENT_EXECUTION_PACKAGE.md") {
      byKey.set(
        template.logicalKey,
        renderAgentExecutionPackage(input.graph, input.graphHash, accepted),
      );
      continue;
    }
    if (template.logicalKey === "QUALITY_CHECKLIST.md") {
      byKey.set(template.logicalKey, renderQualityChecklist(accepted, unknownCount));
      continue;
    }
    byKey.set(template.logicalKey, renderBoundArtifact(template, input.fields, accepted));
  }

  return BLUEPRINT_ARTIFACTS.map((logicalKey) => {
    const content = byKey.get(logicalKey);
    if (!content) throw new Error(`Draft template missing renderer for ${logicalKey}.`);
    return { logicalKey, content, templateVersion: TEMPLATE_SET_VERSION };
  });
}

export function buildExportMarkdown(
  artifacts: CompositionPreview["artifactPreviews"],
): string {
  return artifacts
    .map((artifact) => artifact.content.trimEnd())
    .join("\n\n---\n\n");
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
