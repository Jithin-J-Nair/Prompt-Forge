import type { SkillPackage } from "./types.ts";

export type SkillSeed = {
  slug: string;
  name: string;
  tier: number;
  role: string;
  summary: string;
  capabilities: string[];
  categoryKeys: string[];
  dependencies?: string[];
  mission?: string;
  appliesWhen?: string[];
  avoidWhen?: string[];
  principles?: string[];
  mentalModels?: string[];
  decisionFrameworks?: SkillPackage["decisionFrameworks"];
  bestPractices?: string[];
  antiPatterns?: string[];
  reviewCriteria?: SkillPackage["reviewCriteria"];
  qualityMetrics?: SkillPackage["qualityMetrics"];
  acceptanceCriteria?: string[];
  outputContract?: Partial<SkillPackage["outputContract"]>;
  examples?: SkillPackage["examples"];
  failureStates?: SkillPackage["failureStates"];
  conflicts?: string[];
  provenanceSource?: string;
};

export function buildSkill(input: SkillSeed): SkillPackage {
  const dependencies = input.dependencies ?? [];
  return {
    schemaVersion: "1.0.0",
    identity: {
      slug: input.slug,
      name: input.name,
      tier: input.tier,
      role: input.role,
      version: "1.0.0",
      summary: input.summary,
      capabilities: input.capabilities,
      appliesWhen: input.appliesWhen ?? [`Projects that need ${input.role} expertise.`],
      avoidWhen: input.avoidWhen ?? ["Tasks outside this role's declared scope."],
      categoryKeys: input.categoryKeys,
    },
    mission:
      input.mission ??
      `Provide reusable ${input.role} expertise that stays evidence-backed and agent-ready.`,
    principles: input.principles ?? [
      "Separate confirmed facts from inferences.",
      "Prefer bounded, testable outputs over vague advice.",
      "Never grant tool permissions through skill text.",
    ],
    mentalModels: input.mentalModels ?? [
      `${input.role} decision framing`,
      "Assumption mapping",
      "Evidence before scale",
    ],
    decisionFrameworks: input.decisionFrameworks ?? [
      {
        name: `${input.role} intake`,
        whenToUse: "A project brief needs structured expertise from this role.",
        steps: [
          "Capture stated intent and constraints.",
          "Label unknowns explicitly.",
          "Produce scoped outputs with stop conditions.",
        ],
        outcomes: ["A bounded role contribution with provenance."],
      },
    ],
    bestPractices: input.bestPractices ?? [
      "Cite the brief or mark claims as inferred.",
      "Keep outputs composable with adjacent skills.",
    ],
    antiPatterns: input.antiPatterns ?? [
      "Inventing market, user, or technical facts.",
      "Expanding scope without ownership clarity.",
    ],
    reviewCriteria: input.reviewCriteria ?? [
      {
        criterion: `${input.role} outputs stay within declared capabilities.`,
        evidence: "Assigned scope and artifacts cite capability tags.",
        severityIfMissed: "high",
      },
    ],
    qualityMetrics: input.qualityMetrics ?? [
      {
        name: "Traceable claims",
        measurement: "Share of material claims with source or inference label.",
        target: "100%",
      },
    ],
    acceptanceCriteria: input.acceptanceCriteria ?? [
      `At least one concrete ${input.role} output or explicit unknown is recorded.`,
      "No unsupported factual claims are introduced.",
    ],
    outputContract: {
      requiredInputs: ["Project brief", "Selected project category", "Project DNA snapshot"],
      outputs: [`${input.role} guidance`, "Open questions", "Acceptance checks"],
      format: "Structured Markdown sections",
      constraints: ["Do not fabricate evidence.", "Do not authorize execution."],
      stopConditions: ["A blocking unknown requires human decision."],
      dependencies,
      permissions: [],
      ...input.outputContract,
    },
    examples: input.examples ?? [
      {
        title: `${input.name} contribution`,
        input: "Compose expertise for a product brief.",
        expectedOutput: `${input.name} produces scoped guidance with unknowns labeled.`,
      },
    ],
    failureStates: input.failureStates ?? [
      {
        condition: "Required inputs are missing or contradictory.",
        impact: "Role contribution cannot be safely completed.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
    dependencies,
    conflicts: input.conflicts ?? [],
    provenance: {
      source: input.provenanceSource ?? "SkillForge published catalog v1.2.0",
    },
  };
}
