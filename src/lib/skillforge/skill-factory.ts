import type { SkillPackage } from "./types.ts";

export function buildSkill(input: {
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
}): SkillPackage {
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
    principles: [
      "Separate confirmed facts from inferences.",
      "Prefer bounded, testable outputs over vague advice.",
      "Never grant tool permissions through skill text.",
    ],
    mentalModels: [`${input.role} decision framing`, "Assumption mapping", "Evidence before scale"],
    decisionFrameworks: [
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
    bestPractices: [
      "Cite the brief or mark claims as inferred.",
      "Keep outputs composable with adjacent skills.",
    ],
    antiPatterns: [
      "Inventing market, user, or technical facts.",
      "Expanding scope without ownership clarity.",
    ],
    reviewCriteria: [
      {
        criterion: `${input.role} outputs stay within declared capabilities.`,
        evidence: "Assigned scope and artifacts cite capability tags.",
        severityIfMissed: "high",
      },
    ],
    qualityMetrics: [
      {
        name: "Traceable claims",
        measurement: "Share of material claims with source or inference label.",
        target: "100%",
      },
    ],
    acceptanceCriteria: [
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
    },
    examples: [
      {
        title: `${input.name} contribution`,
        input: "Compose expertise for a product brief.",
        expectedOutput: `${input.name} produces scoped guidance with unknowns labeled.`,
      },
    ],
    failureStates: [
      {
        condition: "Required inputs are missing or contradictory.",
        impact: "Role contribution cannot be safely completed.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
    dependencies,
    conflicts: [],
    provenance: { source: "SkillForge published catalog v1.1.0" },
  };
}
