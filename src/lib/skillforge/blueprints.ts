import draftTemplateSet from "../../../templates/draft-set-1.0.0.json";
import { CATALOG_VERSION, getSkillBySlug } from "./catalog.ts";
import type { ProjectCategoryKey } from "./categories.ts";
import {
  PLACEHOLDER_BAN_PHRASE,
  renderArchitectureBody,
  renderDatabaseBody,
  renderDesignSystemBody,
  renderLaunchPlanBody,
  renderSkillCraftAppendix,
  renderUserFlowsBody,
} from "./blueprints-content.ts";
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
  if (body.includes(PLACEHOLDER_BAN_PHRASE)) {
    throw new Error("Blueprint renderer attempted to emit banned placeholder phrase.");
  }
  return [`## ${heading}`, "", body, ""];
}

function openDecisionsSection(fields: readonly DnaField[]): string[] {
  const unknowns = fields.filter((field) => field.status === "unknown").map((f) => f.name);
  return renderGuidanceSection(
    "Open decisions",
    unknowns.length
      ? `Still open: ${unknowns.join(", ")}.`
      : "No blocking DNA unknowns remain; continue monitoring review findings and craft-density gates.",
  );
}

function renderMasterSkillPackage(
  brief: string,
  graph: { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] },
  graphHash: string,
  accepted: boolean,
): string {
  const nodeLines = graph.nodes
    .map((node) => {
      const skill = getSkillBySlug(node.nodeKey);
      const principles = skill?.principles?.slice(0, 3).map((p) => `     - ${p}`).join("\n") ?? "";
      return (
        `${graph.nodes.indexOf(node) + 1}. **${node.name}** (\`${node.skillVersion}\`, ${node.priority})\n` +
        `   - Scope: ${node.assignedScope.join(", ")}\n` +
        `   - Rationale: ${node.rationale}\n` +
        (skill?.mission ? `   - Mission: ${skill.mission}\n` : "") +
        (principles ? `   - Key principles:\n${principles}` : "")
      );
    })
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

function renderCategoryArtifact(
  template: DraftTemplate,
  fields: readonly DnaField[],
  accepted: boolean,
  categoryKey: ProjectCategoryKey,
  brief: string,
): string {
  const lines = [...packageBanner(template.logicalKey, accepted)];
  let sectionBodies: Record<string, string> = {};

  if (template.logicalKey === "DESIGN_SYSTEM.md") {
    sectionBodies = renderDesignSystemBody(categoryKey, fields, brief);
  } else if (template.logicalKey === "ARCHITECTURE.md") {
    sectionBodies = renderArchitectureBody(categoryKey, fields);
  } else if (template.logicalKey === "USER_FLOWS.md") {
    sectionBodies = renderUserFlowsBody(categoryKey, fields);
  } else if (template.logicalKey === "DATABASE_DESIGN.md") {
    sectionBodies = renderDatabaseBody(categoryKey, fields);
  } else if (template.logicalKey === "LAUNCH_PLAN.md") {
    sectionBodies = renderLaunchPlanBody(categoryKey, fields);
  }

  for (const section of template.requiredSections) {
    const dnaField = template.dnaBindings?.[section];
    if (dnaField) {
      lines.push(...renderDnaSection(section, dnaField, fields));
      continue;
    }
    if (section === "Open decisions") {
      lines.push(...openDecisionsSection(fields));
      continue;
    }
    const body = sectionBodies[section];
    if (body) {
      lines.push(...renderGuidanceSection(section, body));
      continue;
    }
    // Extra immersive-only sections not in draft template still append when present.
  }

  // Append immersive-only sections for design/architecture when generated.
  if (template.logicalKey === "DESIGN_SYSTEM.md" && sectionBodies["Motion language"]) {
    if (!template.requiredSections.includes("Motion language")) {
      lines.push(...renderGuidanceSection("Motion language", sectionBodies["Motion language"]));
    }
  }
  if (template.logicalKey === "ARCHITECTURE.md") {
    for (const extra of ["Scene inventory", "Shader & render budget"] as const) {
      if (sectionBodies[extra] && !template.requiredSections.includes(extra)) {
        lines.push(...renderGuidanceSection(extra, sectionBodies[extra]));
      }
    }
  }

  return lines.join("\n");
}

function renderAiSystemDesign(
  fields: readonly DnaField[],
  accepted: boolean,
  categoryKey: ProjectCategoryKey,
): string {
  const stack = fieldValue(fields, "Technical Stack");
  const applicable =
    categoryKey.startsWith("ai") ||
    categoryKey === "rag-platform" ||
    (stack?.value ?? "").toLowerCase().includes("model") ||
    (stack?.value ?? "").toLowerCase().includes("retrieval") ||
    (stack?.value ?? "").toLowerCase().includes("eval");

  return [
    ...packageBanner("AI_SYSTEM_DESIGN.md", accepted),
    "## Applicability",
    "",
    applicable
      ? "AI capabilities are in scope for this category/brief."
      : categoryKey === "awwwards-website" || categoryKey === "threejs-experience"
        ? "AI is not required for this immersive experience package. Mark model use not_applicable unless the brief adds agents/CMS assistants."
        : "AI may be optional; state not_applicable only with rationale if no model use is required.",
    "",
    ...renderDnaSection("Models and context", "Technical Stack", fields),
    ...renderGuidanceSection(
      "Evaluation and safety",
      applicable
        ? fieldValue(fields, "Success Metrics")?.value
          ? `Tie evals to: ${fieldValue(fields, "Success Metrics")?.value}. Keep unsafe tool use blocked.`
          : "Define evals before trusting model output; keep unsafe tool use blocked."
        : "No model eval harness required unless AI features are added later.",
    ),
    ...renderGuidanceSection(
      "Open decisions",
      applicable
        ? "Provider choice, retention of prompts, and customer-managed credentials remain product decisions."
        : "Keep AI out of scope until a confirmed product job needs it.",
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
    renderSkillCraftAppendix(graph.nodes).trimEnd(),
    "",
    "## Prerequisites",
    "",
    accepted
      ? "- Package accepted for export by Review Council."
      : "- Accepted package after Review Council (not satisfied yet).",
    "- Critical DNA unknowns resolved or explicitly deferred.",
    "- Follow craft directives; do not substitute template SaaS layouts for immersive skills.",
    "",
    "## Stop conditions",
    "",
    "- Any mandatory artifact or reviewer gate fails.",
    "- Instructions would require secrets, production access, or unrestricted tools.",
    "- Immersive build would ship without performance or reduced-motion fallbacks.",
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
  categoryKey: ProjectCategoryKey,
): string {
  const immersive =
    categoryKey === "awwwards-website" || categoryKey === "threejs-experience";
  return [
    ...packageBanner("QUALITY_CHECKLIST.md", accepted),
    "## Package completeness",
    "",
    `- Present artifacts: ${BLUEPRINT_ARTIFACTS.length}/${BLUEPRINT_ARTIFACTS.length}`,
    "- Missing artifacts: none",
    `- Placeholder ban: content must not include \`${PLACEHOLDER_BAN_PHRASE.slice(0, 32)}...\``,
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
    "## Performance budgets",
    "",
    immersive
      ? [
          "- Shell: LCP < 2.5s; INP < 200ms (hypothesis targets).",
          "- Experience canvas: 60fps desktop; ≥30fps mobile.",
          "- Auto quality preset drop under 20fps sustained.",
        ].join("\n")
      : "- Define route-level LCP/INP budgets before launch claims.",
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
  categoryKey: ProjectCategoryKey;
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
      byKey.set(
        template.logicalKey,
        renderAiSystemDesign(input.fields, accepted, input.categoryKey),
      );
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
      byKey.set(
        template.logicalKey,
        renderQualityChecklist(accepted, unknownCount, input.categoryKey),
      );
      continue;
    }
    byKey.set(
      template.logicalKey,
      renderCategoryArtifact(
        template,
        input.fields,
        accepted,
        input.categoryKey,
        input.brief,
      ),
    );
  }

  return BLUEPRINT_ARTIFACTS.map((logicalKey) => {
    const content = byKey.get(logicalKey);
    if (!content) throw new Error(`Draft template missing renderer for ${logicalKey}.`);
    if (content.includes(PLACEHOLDER_BAN_PHRASE)) {
      throw new Error(`Banned placeholder phrase found in ${logicalKey}.`);
    }
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
