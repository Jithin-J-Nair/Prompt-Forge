import { createHash } from "node:crypto";
import {
  buildExportMarkdown,
  renderDraftBlueprints,
  TEMPLATE_SET_VERSION,
} from "./blueprints.ts";
import {
  getCategoryLabel,
  isProjectCategoryKey,
  type ProjectCategoryKey,
} from "./categories.ts";
import { CATALOG_VERSION, getSkillBySlug, STARTER_SKILLS } from "./catalog.ts";
import { runReviewCouncil, RUBRIC_VERSION } from "./council.ts";
import { buildProjectDna } from "./dna.ts";
import {
  CATEGORY_SKILL_POLICY,
  PRIORITY_BY_SKILL,
  PRIORITY_RATIONALE,
} from "./policy.ts";
import type {
  CompositionPreview,
  SkillGraphEdge,
  SkillGraphNode,
  SkillPackage,
} from "./types.ts";

const PRIORITY_ORDER: Record<SkillGraphNode["priority"], number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

const MAX_REVISIONS = 3;

function compareKeys(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function getPriority(skillSlug: string): SkillGraphNode["priority"] {
  return PRIORITY_BY_SKILL[skillSlug] ?? "P2";
}

function getPriorityRationale(skillSlug: string): string {
  return (
    PRIORITY_RATIONALE[skillSlug] ??
    "Selected by category composition policy for coverage."
  );
}

export class CompositionInputError extends Error {
  readonly statusCode: 400 | 422;
  readonly code: "invalid_brief" | "unsupported_category";

  constructor(
    message: string,
    statusCode: 400 | 422,
    code: "invalid_brief" | "unsupported_category",
  ) {
    super(message);
    this.name = "CompositionInputError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function compareSkills(left: SkillPackage, right: SkillPackage): number {
  const priorityDifference =
    PRIORITY_ORDER[getPriority(left.identity.slug)] -
    PRIORITY_ORDER[getPriority(right.identity.slug)];
  return priorityDifference || compareKeys(left.identity.slug, right.identity.slug);
}

export function deduplicateSkillScopes(
  skillScopes: readonly { nodeKey: string; capabilities: readonly string[] }[],
): Map<string, string[]> {
  const claimed = new Set<string>();
  const assignments = new Map<string, string[]>();

  for (const skill of skillScopes) {
    assignments.set(
      skill.nodeKey,
      skill.capabilities.filter((capability) => {
        if (claimed.has(capability)) return false;
        claimed.add(capability);
        return true;
      }),
    );
  }

  return assignments;
}

function orderByDependencies(skills: readonly SkillPackage[]): SkillPackage[] {
  const selected = new Map(skills.map((skill) => [skill.identity.slug, skill]));
  const emitted = new Set<string>();
  const ordered: SkillPackage[] = [];

  while (ordered.length < selected.size) {
    const next = [...selected.values()]
      .filter(
        (skill) =>
          !emitted.has(skill.identity.slug) &&
          (skill.dependencies ?? []).every((dependency) => {
            if (!selected.has(dependency)) return true;
            return emitted.has(dependency);
          }),
      )
      .sort(compareSkills)[0];

    if (!next) {
      throw new Error("The selected skill set contains a dependency cycle.");
    }

    emitted.add(next.identity.slug);
    ordered.push(next);
  }

  return ordered;
}

function selectSkills(categoryKey: ProjectCategoryKey): SkillPackage[] {
  const policy = CATEGORY_SKILL_POLICY[categoryKey];
  const selected: SkillPackage[] = [];
  for (const slug of policy) {
    const skill = getSkillBySlug(slug);
    if (!skill) throw new Error(`Catalog missing skill ${slug} for ${categoryKey}.`);
    selected.push(skill);
  }
  return selected;
}

function buildGraph(
  skills: readonly SkillPackage[],
): { nodes: SkillGraphNode[]; edges: SkillGraphEdge[] } {
  const orderedSkills = orderByDependencies(skills);
  const scopes = deduplicateSkillScopes(
    orderedSkills.map((skill) => ({
      nodeKey: skill.identity.slug,
      capabilities: skill.identity.capabilities,
    })),
  );
  const nodes: SkillGraphNode[] = [];

  for (const skill of orderedSkills) {
    const assignedScope = scopes.get(skill.identity.slug);
    if (!assignedScope || assignedScope.length === 0) continue;
    nodes.push({
      nodeKey: skill.identity.slug,
      skillVersion: `${skill.identity.slug}@${skill.identity.version}`,
      name: skill.identity.name,
      role: skill.identity.role,
      tier: skill.identity.tier,
      priority: getPriority(skill.identity.slug),
      assignedScope,
      rationale: getPriorityRationale(skill.identity.slug),
    });
  }

  const nodeKeys = new Set(nodes.map((node) => node.nodeKey));
  const edges = orderedSkills
    .flatMap((skill) =>
      (skill.dependencies ?? [])
        .filter((dependency) => nodeKeys.has(skill.identity.slug) && nodeKeys.has(dependency))
        .map((dependency) => ({
          from: dependency,
          to: skill.identity.slug,
          type: "depends_on" as const,
        })),
    )
    .sort((left, right) => compareKeys(left.from, right.from) || compareKeys(left.to, right.to));

  return { nodes, edges };
}

function composeOnce(input: {
  categoryKey: ProjectCategoryKey;
  brief: string;
  revisionRound: number;
  acceptPackage: boolean;
}): {
  previewBase: Omit<CompositionPreview, "council" | "reviewStatus" | "limitations" | "exportMarkdown" | "accepted" | "previewStatus" | "rubricVersion"> & {
    fields: CompositionPreview["projectDna"]["fields"];
  };
  artifactPreviews: CompositionPreview["artifactPreviews"];
  graph: CompositionPreview["graph"];
  graphHash: string;
  fields: CompositionPreview["projectDna"]["fields"];
} {
  const skills = selectSkills(input.categoryKey);
  const graph = buildGraph(skills);
  const fields = buildProjectDna({
    brief: input.brief,
    categoryKey: input.categoryKey,
    revisionRound: input.revisionRound,
  });
  const graphHash = createHash("sha256")
    .update(
      JSON.stringify({
        catalogVersion: CATALOG_VERSION,
        categoryKey: input.categoryKey,
        brief: input.brief,
        nodes: graph.nodes,
        edges: graph.edges,
      }),
    )
    .digest("hex");

  const artifactPreviews = renderDraftBlueprints({
    brief: input.brief,
    graphHash,
    graph,
    fields,
    accepted: input.acceptPackage,
  });

  return {
    previewBase: {
      categoryKey: input.categoryKey,
      categoryLabel: getCategoryLabel(input.categoryKey),
      brief: input.brief,
      persistence: "persistable",
      executionReady: false,
      graphHash,
      templateSetVersion: TEMPLATE_SET_VERSION,
      catalogVersion: CATALOG_VERSION,
      graph,
      projectDna: { fields },
      artifactPreviews,
      missingArtifacts: [],
      requiredReviewers: [],
      fields,
    },
    artifactPreviews,
    graph,
    graphHash,
    fields,
  };
}

export function composeProjectPreview(input: {
  categoryKey: string;
  brief: string;
}): CompositionPreview {
  const trimmedBrief = input.brief.trim();
  if (trimmedBrief.length < 3 || trimmedBrief.length > 400) {
    throw new CompositionInputError(
      "The brief must contain between 3 and 400 characters.",
      400,
      "invalid_brief",
    );
  }
  const brief = trimmedBrief.replace(/\s+/g, " ");
  if (!isProjectCategoryKey(input.categoryKey)) {
    throw new CompositionInputError(
      "Unsupported project category.",
      422,
      "unsupported_category",
    );
  }

  let revisionRound = 0;
  let latestArtifacts = composeOnce({
    categoryKey: input.categoryKey,
    brief,
    revisionRound,
    acceptPackage: false,
  });
  let latestCouncil = runReviewCouncil({
    artifacts: latestArtifacts.artifactPreviews,
    fields: latestArtifacts.fields,
    missingArtifacts: [],
    revisionRound,
  });

  while (!latestCouncil.gate.passed && revisionRound < MAX_REVISIONS) {
    revisionRound += 1;
    latestArtifacts = composeOnce({
      categoryKey: input.categoryKey,
      brief,
      revisionRound,
      acceptPackage: false,
    });
    latestCouncil = runReviewCouncil({
      artifacts: latestArtifacts.artifactPreviews,
      fields: latestArtifacts.fields,
      missingArtifacts: [],
      revisionRound,
    });
  }

  const accepted = latestCouncil.gate.passed;
  if (accepted) {
    latestArtifacts = composeOnce({
      categoryKey: input.categoryKey,
      brief,
      revisionRound,
      acceptPackage: true,
    });
    latestCouncil = runReviewCouncil({
      artifacts: latestArtifacts.artifactPreviews,
      fields: latestArtifacts.fields,
      missingArtifacts: [],
      revisionRound,
    });
  }

  const exportMarkdown = buildExportMarkdown(latestArtifacts.artifactPreviews);

  return {
    categoryKey: input.categoryKey,
    categoryLabel: getCategoryLabel(input.categoryKey),
    brief,
    previewStatus: accepted ? "accepted" : "draft",
    persistence: "persistable",
    accepted,
    executionReady: false,
    graphHash: latestArtifacts.graphHash,
    templateSetVersion: TEMPLATE_SET_VERSION,
    rubricVersion: RUBRIC_VERSION,
    catalogVersion: CATALOG_VERSION,
    graph: latestArtifacts.graph,
    projectDna: { fields: latestArtifacts.fields },
    artifactPreviews: latestArtifacts.artifactPreviews,
    missingArtifacts: [],
    reviewStatus: latestCouncil.reviewStatus,
    requiredReviewers: latestCouncil.requiredReviewers,
    council: {
      overallMean: latestCouncil.overallMean,
      gatePassed: latestCouncil.gate.passed,
      gateReason: latestCouncil.gate.reason,
      assessments: latestCouncil.assessments,
      unresolvedFindings: latestCouncil.unresolvedFindings,
      revisionRound,
      maxRevisionRounds: MAX_REVISIONS,
      nextActions: latestCouncil.revisionPlan.nextActions,
    },
    limitations: [
      `Catalog ${CATALOG_VERSION} covers all 15 categories with curated skill policies.`,
      "Export is instructional only; executionAuthorized is always false.",
      accepted
        ? "Review Council passed export acceptance; runtime agent execution is still out of scope."
        : "Review Council did not pass; package remains draft after revision budget.",
      "Identity/tenant isolation and production retention policies are not fully productized yet.",
    ],
    exportMarkdown,
  };
}

export { STARTER_SKILLS };
