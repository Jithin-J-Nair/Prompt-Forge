import { createHash } from "node:crypto";
import { renderDraftBlueprints, TEMPLATE_SET_VERSION } from "./blueprints.ts";
import { CATALOG_VERSION, STARTER_SKILLS } from "./catalog.ts";
import { runReviewCouncil, RUBRIC_VERSION } from "./council.ts";
import {
  type CompositionPreview,
  type ProjectDnaField,
  type SkillGraphEdge,
  type SkillGraphNode,
} from "./types.ts";

const PROJECT_DNA_FIELDS: ProjectDnaField[] = [
  "Vision",
  "User",
  "Problem",
  "Market",
  "Differentiation",
  "Business Model",
  "Core Features",
  "User Flows",
  "Technical Stack",
  "Architecture",
  "Success Metrics",
  "Risk Analysis",
  "Roadmap",
];

const PRIORITY_BY_SKILL: Record<string, SkillGraphNode["priority"]> = {
  "product-strategist": "P0",
  "business-analyst": "P1",
  "systems-thinker": "P0",
  "ux-architect": "P1",
};

const PRIORITY_ORDER: Record<SkillGraphNode["priority"], number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

const PRIORITY_RATIONALE: Record<string, string> = {
  "product-strategist": "Frames the user problem before downstream decisions.",
  "business-analyst": "Makes business assumptions and success measures explicit.",
  "systems-thinker": "Surfaces boundaries and risks before solution design.",
  "ux-architect": "Frames user goals and interaction questions before interface work.",
};

function compareKeys(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function getPriority(skillSlug: string): SkillGraphNode["priority"] {
  const priority = PRIORITY_BY_SKILL[skillSlug];
  if (!priority) throw new Error(`No priority is configured for skill ${skillSlug}.`);
  return priority;
}

function getPriorityRationale(skillSlug: string): string {
  const rationale = PRIORITY_RATIONALE[skillSlug];
  if (!rationale) throw new Error(`No priority rationale is configured for skill ${skillSlug}.`);
  return rationale;
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

function compareSkills(
  left: (typeof STARTER_SKILLS)[number],
  right: (typeof STARTER_SKILLS)[number],
): number {
  const priorityDifference = PRIORITY_ORDER[getPriority(left.identity.slug)] -
    PRIORITY_ORDER[getPriority(right.identity.slug)];
  return priorityDifference || compareKeys(left.identity.slug, right.identity.slug);
}

function orderByDependencies(
  skills: readonly (typeof STARTER_SKILLS)[number][],
): (typeof STARTER_SKILLS)[number][] {
  const selected = new Map(skills.map((skill) => [skill.identity.slug, skill]));
  const emitted = new Set<string>();
  const ordered: (typeof STARTER_SKILLS)[number][] = [];

  while (ordered.length < selected.size) {
    const next = [...selected.values()]
      .filter(
        (skill) =>
          !emitted.has(skill.identity.slug) &&
          (skill.dependencies ?? []).every((dependency) => {
            if (!selected.has(dependency)) {
              throw new Error(
                `Skill ${skill.identity.slug} depends on missing skill ${dependency}.`,
              );
            }
            return emitted.has(dependency);
          }),
      )
      .sort(compareSkills)[0];

    if (!next) {
      throw new Error("The starter skill catalog contains a dependency cycle.");
    }

    emitted.add(next.identity.slug);
    ordered.push(next);
  }

  return ordered;
}

function buildGraph(
  skills: readonly (typeof STARTER_SKILLS)[number][],
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
    if (!assignedScope) {
      throw new Error(`No assigned scope was produced for ${skill.identity.slug}.`);
    }

    if (assignedScope.length === 0) continue;

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
  if (input.categoryKey !== "ai-product") {
    throw new CompositionInputError(
      "This preview currently supports the AI Product category only.",
      422,
      "unsupported_category",
    );
  }

  const skills = STARTER_SKILLS.filter((skill) =>
    skill.identity.categoryKeys?.some((key) => key === input.categoryKey),
  );
  if (skills.length === 0) {
    throw new Error(`The starter catalog has no skills for category ${input.categoryKey}.`);
  }
  const graph = buildGraph(skills);
  const graphHash = createHash("sha256")
    .update(
      JSON.stringify({
        catalogVersion: CATALOG_VERSION,
        categoryKey: input.categoryKey,
        brief,
        nodes: graph.nodes,
        edges: graph.edges,
      }),
    )
    .digest("hex");
  const fields: CompositionPreview["projectDna"]["fields"] = PROJECT_DNA_FIELDS.map(
    (name) =>
      name === "Vision"
        ? { name, status: "confirmed", value: brief, source: "user_brief" }
        : { name, status: "unknown", value: null, source: "unresolved" },
  );
  const artifactPreviews = renderDraftBlueprints({
    brief,
    graphHash,
    graph,
    fields,
  });
  const missingArtifacts: CompositionPreview["missingArtifacts"] = [];
  const council = runReviewCouncil({
    artifacts: artifactPreviews,
    fields,
    missingArtifacts,
  });

  return {
    categoryKey: "ai-product",
    categoryLabel: "AI Product",
    brief,
    previewStatus: "draft",
    persistence: "not_persisted",
    accepted: false,
    executionReady: false,
    graphHash,
    templateSetVersion: TEMPLATE_SET_VERSION,
    rubricVersion: RUBRIC_VERSION,
    graph,
    projectDna: { fields },
    artifactPreviews,
    missingArtifacts,
    reviewStatus: council.reviewStatus === "blocked" ? "blocked" : "failed",
    requiredReviewers: council.requiredReviewers,
    council: {
      overallMean: council.overallMean,
      gatePassed: false,
      gateReason: council.gate.reason,
      assessments: council.assessments,
      unresolvedFindings: council.unresolvedFindings,
      revisionRound: council.revisionRound,
      maxRevisionRounds: council.revisionPlan.maxRevisionRounds,
      nextActions: council.revisionPlan.nextActions,
    },
    limitations: [
      "Only Tier 1 Core Thinking skills are included in this pilot catalog.",
      "All eleven canonical artifacts are draft shells; unknown Project DNA fields stay unknown.",
      "Review Council ran deterministically and blocked acceptance; revision regeneration is not automated yet.",
      "The preview is not persisted and is not an agent execution handoff.",
    ],
  };
}
