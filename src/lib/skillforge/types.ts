export interface SkillPackage {
  schemaVersion: "1.0.0";
  identity: {
    slug: string;
    name: string;
    tier: number;
    role: string;
    version: string;
    summary: string;
    capabilities: string[];
    appliesWhen: string[];
    avoidWhen: string[];
    categoryKeys?: string[];
    owner?: string;
  };
  mission: string;
  principles: string[];
  mentalModels: string[];
  decisionFrameworks: {
    name: string;
    whenToUse: string;
    steps: string[];
    outcomes: string[];
  }[];
  bestPractices: string[];
  antiPatterns: string[];
  reviewCriteria: {
    criterion: string;
    evidence: string;
    severityIfMissed?: "critical" | "high" | "medium" | "low";
  }[];
  qualityMetrics: {
    name: string;
    measurement: string;
    target: string;
  }[];
  acceptanceCriteria: string[];
  outputContract: {
    requiredInputs: string[];
    outputs: string[];
    format: string;
    constraints: string[];
    stopConditions?: string[];
    dependencies?: string[];
    permissions?: string[];
  };
  examples: {
    title: string;
    input: string;
    expectedOutput: string;
    notes?: string;
  }[];
  failureStates: {
    condition: string;
    impact: string;
    recovery: string;
    blocking?: boolean;
  }[];
  dependencies?: string[];
  conflicts?: string[];
  provenance?: {
    source?: string;
    licenseOrUsageRights?: string;
    reviewedBy?: string[];
    reviewedAt?: string;
    contentHash?: string;
  };
}

export const BLUEPRINT_ARTIFACTS = [
  "MASTER_SKILL_PACKAGE.md",
  "PROJECT_DNA.md",
  "PRODUCT_STRATEGY.md",
  "DESIGN_SYSTEM.md",
  "ARCHITECTURE.md",
  "USER_FLOWS.md",
  "DATABASE_DESIGN.md",
  "AI_SYSTEM_DESIGN.md",
  "AGENT_EXECUTION_PACKAGE.md",
  "QUALITY_CHECKLIST.md",
  "LAUNCH_PLAN.md",
] as const;

export const REVIEW_COUNCIL_ROLES = [
  "Creative Director",
  "Product Strategist",
  "Systems Architect",
  "Performance Engineer",
  "Security Engineer",
  "UX Architect",
  "Accessibility Reviewer",
  "Awwwards Reviewer",
] as const;

export type ProjectDnaField =
  | "Vision"
  | "User"
  | "Problem"
  | "Market"
  | "Differentiation"
  | "Business Model"
  | "Core Features"
  | "User Flows"
  | "Technical Stack"
  | "Architecture"
  | "Success Metrics"
  | "Risk Analysis"
  | "Roadmap";

export interface SkillGraphNode {
  nodeKey: string;
  skillVersion: string;
  name: string;
  role: string;
  tier: number;
  priority: "P0" | "P1" | "P2" | "P3";
  assignedScope: string[];
  rationale: string;
}

export interface SkillGraphEdge {
  from: string;
  to: string;
  type: "depends_on";
}

export interface CompositionPreview {
  categoryKey: "ai-product";
  categoryLabel: "AI Product";
  brief: string;
  previewStatus: "draft";
  persistence: "not_persisted";
  accepted: false;
  executionReady: false;
  graphHash: string;
  graph: {
    nodes: SkillGraphNode[];
    edges: SkillGraphEdge[];
  };
  projectDna: {
    fields: {
      name: ProjectDnaField;
      status: "confirmed" | "unknown";
      value: string | null;
      source: "user_brief" | "unresolved";
    }[];
  };
  artifactPreviews: {
    logicalKey: "MASTER_SKILL_PACKAGE.md" | "PROJECT_DNA.md";
    content: string;
  }[];
  missingArtifacts: Exclude<
    (typeof BLUEPRINT_ARTIFACTS)[number],
    "MASTER_SKILL_PACKAGE.md" | "PROJECT_DNA.md"
  >[];
  reviewStatus: "not_started";
  requiredReviewers: (typeof REVIEW_COUNCIL_ROLES)[number][];
  limitations: string[];
}
