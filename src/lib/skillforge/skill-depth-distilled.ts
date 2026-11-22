import type { SkillPackage } from "./types.ts";

type DepthPatch = Partial<
  Pick<
    SkillPackage,
    | "mission"
    | "principles"
    | "mentalModels"
    | "decisionFrameworks"
    | "bestPractices"
    | "antiPatterns"
    | "reviewCriteria"
    | "qualityMetrics"
    | "acceptanceCriteria"
    | "examples"
    | "failureStates"
  >
> & {
  outputContract?: Partial<SkillPackage["outputContract"]>;
};

function framework(
  name: string,
  whenToUse: string,
  steps: string[],
  outcomes: string[],
): SkillPackage["decisionFrameworks"][number] {
  return { name, whenToUse, steps, outcomes };
}

function criterion(
  text: string,
  evidence: string,
  severityIfMissed: "critical" | "high" | "medium" | "low" = "high",
): SkillPackage["reviewCriteria"][number] {
  return { criterion: text, evidence, severityIfMissed };
}

/** Domain-distilled SkillForge depth for roles without exact high-star GitHub twins (and reviewers). */
export const DISTILLED_DEPTH: Record<string, DepthPatch> = {
  "business-analyst": {
    mission: "Deliver expert Business Analyst judgment focused on assumptions, success metrics, and scope cuts that agents can execute without guessing.",
    principles: [
      "Business Analyst outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: business-assumptions, success-measures, market-evidence.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Assumption ledger",
          "Metric → decision link",
          "Scope cut matrix"
    ],
    decisionFrameworks: [
      framework(
        "Business Analyst intake",
        "When the package needs Business Analyst expertise.",
        [
          "Collect inputs relevant to business-assumptions.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on assumptions, success metrics, and scope cuts with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Business Analyst contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Write measurable success metrics",
          "Label every market claim inferred vs confirmed",
          "Keep MVP cuts explicit"
    ],
    antiPatterns: [
          "Fake precision metrics",
          "Expanding scope silently",
          "Treating opinions as market facts"
    ],
    reviewCriteria: [
      criterion(
        "Business Analyst contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md / PROJECT_DNA.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Business Analyst output tied to business-assumptions is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Business Analyst contribution",
        input: "Compose expertise needing Business Analyst.",
        expectedOutput: "Business Analyst returns scoped business-assumptions, success-measures, market-evidence guidance with labeled unknowns and acceptance checks focused on assumptions, success metrics, and scope cuts.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Business Analyst cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "systems-thinker": {
    mission: "Deliver expert Systems Thinker judgment focused on boundaries, dependencies, and risk loops that agents can execute without guessing.",
    principles: [
      "Systems Thinker outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: system-boundaries, dependency-mapping, risk-framing.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "System boundary map",
          "Feedback loops",
          "Risk → mitigation pairs"
    ],
    decisionFrameworks: [
      framework(
        "Systems Thinker intake",
        "When the package needs Systems Thinker expertise.",
        [
          "Collect inputs relevant to system-boundaries.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on boundaries, dependencies, and risk loops with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Systems Thinker contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Draw trust boundaries early",
          "Name critical dependencies",
          "Call out second-order risks"
    ],
    antiPatterns: [
          "Buzzword architecture",
          "Ignoring operational failure modes",
          "Hidden circular dependencies"
    ],
    reviewCriteria: [
      criterion(
        "Systems Thinker contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Systems Thinker output tied to system-boundaries is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Systems Thinker contribution",
        input: "Compose expertise needing Systems Thinker.",
        expectedOutput: "Systems Thinker returns scoped system-boundaries, dependency-mapping, risk-framing guidance with labeled unknowns and acceptance checks focused on boundaries, dependencies, and risk loops.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Systems Thinker cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "ai-product-manager": {
    mission: "Deliver expert AI Product Manager judgment focused on AI product outcomes, eval gates, and model-use policy that agents can execute without guessing.",
    principles: [
      "AI Product Manager outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: ai-outcome-framing, model-use-policy, eval-gates.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Job-to-be-done for model help",
          "Eval gate ladder",
          "Human-in-the-loop points"
    ],
    decisionFrameworks: [
      framework(
        "AI Product Manager intake",
        "When the package needs AI Product Manager expertise.",
        [
          "Collect inputs relevant to ai-outcome-framing.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on AI product outcomes, eval gates, and model-use policy with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded AI Product Manager contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Define offline/online evals before features",
          "State when not to use a model",
          "Keep tool authority outside model text"
    ],
    antiPatterns: [
          "AI for its own sake",
          "No eval plan",
          "Letting prompts grant permissions"
    ],
    reviewCriteria: [
      criterion(
        "AI Product Manager contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md / PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete AI Product Manager output tied to ai-outcome-framing is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "AI Product Manager contribution",
        input: "Compose expertise needing AI Product Manager.",
        expectedOutput: "AI Product Manager returns scoped ai-outcome-framing, model-use-policy, eval-gates guidance with labeled unknowns and acceptance checks focused on AI product outcomes, eval gates, and model-use policy.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "AI Product Manager cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "context-engineer": {
    mission: "Deliver expert Context Engineer judgment focused on context budgets, memory, and retrieval boundaries that agents can execute without guessing.",
    principles: [
      "Context Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: context-budgets, memory-policy, prompt-assembly.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Context budget envelope",
          "Memory tiers",
          "What must never enter context"
    ],
    decisionFrameworks: [
      framework(
        "Context Engineer intake",
        "When the package needs Context Engineer expertise.",
        [
          "Collect inputs relevant to context-budgets.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on context budgets, memory, and retrieval boundaries with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Context Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Cap tokens with a purpose",
          "Separate durable memory from scratchpad",
          "Redact secrets from context"
    ],
    antiPatterns: [
          "Dumping entire corpora into prompts",
          "Unbounded chat memory",
          "Secrets in context windows"
    ],
    reviewCriteria: [
      criterion(
        "Context Engineer contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Context Engineer output tied to context-budgets is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Context Engineer contribution",
        input: "Compose expertise needing Context Engineer.",
        expectedOutput: "Context Engineer returns scoped context-budgets, memory-policy, prompt-assembly guidance with labeled unknowns and acceptance checks focused on context budgets, memory, and retrieval boundaries.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Context Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "knowledge-graph-architect": {
    mission: "Deliver expert Knowledge Graph Architect judgment focused on entities, relations, and grounded retrieval structure that agents can execute without guessing.",
    principles: [
      "Knowledge Graph Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: entity-modeling, relation-design, graph-provenance.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Entity-relation map",
          "Provenance edges",
          "Query patterns"
    ],
    decisionFrameworks: [
      framework(
        "Knowledge Graph Architect intake",
        "When the package needs Knowledge Graph Architect expertise.",
        [
          "Collect inputs relevant to entity-modeling.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on entities, relations, and grounded retrieval structure with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Knowledge Graph Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Name entity types and ownership",
          "Require provenance on edges",
          "Design for incremental updates"
    ],
    antiPatterns: [
          "Orphan nodes without meaning",
          "Unversioned graph mutations",
          "Graph as buzzword with no schema"
    ],
    reviewCriteria: [
      criterion(
        "Knowledge Graph Architect contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md / DATABASE_DESIGN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Knowledge Graph Architect output tied to entity-modeling is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Knowledge Graph Architect contribution",
        input: "Compose expertise needing Knowledge Graph Architect.",
        expectedOutput: "Knowledge Graph Architect returns scoped entity-modeling, relation-design, graph-provenance guidance with labeled unknowns and acceptance checks focused on entities, relations, and grounded retrieval structure.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Knowledge Graph Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "model-selection-expert": {
    mission: "Deliver expert Model Selection Expert judgment focused on model class choice vs task, cost, and risk that agents can execute without guessing.",
    principles: [
      "Model Selection Expert outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: model-fit, cost-risk-tradeoffs, provider-neutrality.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Task → model class matrix",
          "Cost/latency envelope",
          "Risk class gates"
    ],
    decisionFrameworks: [
      framework(
        "Model Selection Expert intake",
        "When the package needs Model Selection Expert expertise.",
        [
          "Collect inputs relevant to model-fit.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on model class choice vs task, cost, and risk with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Model Selection Expert contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Match model class to task difficulty",
          "Document fallback models",
          "Keep customer credentials out of prompts"
    ],
    antiPatterns: [
          "Always pick the largest model",
          "Ignoring latency budgets",
          "Vendor lock without exit plan"
    ],
    reviewCriteria: [
      criterion(
        "Model Selection Expert contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Model Selection Expert output tied to model-fit is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Model Selection Expert contribution",
        input: "Compose expertise needing Model Selection Expert.",
        expectedOutput: "Model Selection Expert returns scoped model-fit, cost-risk-tradeoffs, provider-neutrality guidance with labeled unknowns and acceptance checks focused on model class choice vs task, cost, and risk.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Model Selection Expert cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "backend-architect": {
    mission: "Deliver expert Backend Architect judgment focused on services, domain boundaries, and reliability that agents can execute without guessing.",
    principles: [
      "Backend Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: service-boundaries, reliability, domain-modeling.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Domain module map",
          "Sync vs async boundaries",
          "Failure/retry policy"
    ],
    decisionFrameworks: [
      framework(
        "Backend Architect intake",
        "When the package needs Backend Architect expertise.",
        [
          "Collect inputs relevant to service-boundaries.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on services, domain boundaries, and reliability with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Backend Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Keep write paths explicit",
          "Idempotency keys for critical writes",
          "Define SLOs for core flows"
    ],
    antiPatterns: [
          "God service",
          "Chatty unbounded fan-out",
          "Silent data corruption paths"
    ],
    reviewCriteria: [
      criterion(
        "Backend Architect contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Backend Architect output tied to service-boundaries is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Backend Architect contribution",
        input: "Compose expertise needing Backend Architect.",
        expectedOutput: "Backend Architect returns scoped service-boundaries, reliability, domain-modeling guidance with labeled unknowns and acceptance checks focused on services, domain boundaries, and reliability.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Backend Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "api-architect": {
    mission: "Deliver expert API Architect judgment focused on API contracts, compatibility, and error shapes that agents can execute without guessing.",
    principles: [
      "API Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: api-contracts, versioning, compatibility.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Resource model",
          "Versioning policy",
          "Error taxonomy"
    ],
    decisionFrameworks: [
      framework(
        "API Architect intake",
        "When the package needs API Architect expertise.",
        [
          "Collect inputs relevant to api-contracts.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on API contracts, compatibility, and error shapes with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded API Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Document breaking vs additive changes",
          "Consistent error envelopes",
          "Authz checks at the edge"
    ],
    antiPatterns: [
          "Ad-hoc endpoints without schema",
          "Leaking internals in errors",
          "Breaking clients silently"
    ],
    reviewCriteria: [
      criterion(
        "API Architect contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete API Architect output tied to api-contracts is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "API Architect contribution",
        input: "Compose expertise needing API Architect.",
        expectedOutput: "API Architect returns scoped api-contracts, versioning, compatibility guidance with labeled unknowns and acceptance checks focused on API contracts, compatibility, and error shapes.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "API Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "database-architect": {
    mission: "Deliver expert Database Architect judgment focused on data model, access paths, and retention that agents can execute without guessing.",
    principles: [
      "Database Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: data-modeling, access-paths, retention.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Entity ownership",
          "Access path map",
          "Retention/deletion"
    ],
    decisionFrameworks: [
      framework(
        "Database Architect intake",
        "When the package needs Database Architect expertise.",
        [
          "Collect inputs relevant to data-modeling.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on data model, access paths, and retention with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Database Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Index for primary queries",
          "Tenant keys everywhere multi-tenant",
          "No secrets in plaintext columns"
    ],
    antiPatterns: [
          "Schema by accident",
          "Unbounded JSON blobs as the model",
          "Forgotten deletion paths"
    ],
    reviewCriteria: [
      criterion(
        "Database Architect contribution is concrete and within declared capabilities.",
        "DATABASE_DESIGN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Database Architect output tied to data-modeling is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Database Architect contribution",
        input: "Compose expertise needing Database Architect.",
        expectedOutput: "Database Architect returns scoped data-modeling, access-paths, retention guidance with labeled unknowns and acceptance checks focused on data model, access paths, and retention.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Database Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "cloud-architect": {
    mission: "Deliver expert Cloud Architect judgment focused on deploy topology, regions, and operability that agents can execute without guessing.",
    principles: [
      "Cloud Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: deployment-topology, scaling, operability.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Topology sketch",
          "Blast radius",
          "Rollback plan"
    ],
    decisionFrameworks: [
      framework(
        "Cloud Architect intake",
        "When the package needs Cloud Architect expertise.",
        [
          "Collect inputs relevant to deployment-topology.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on deploy topology, regions, and operability with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Cloud Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Prefer boring proven topology first",
          "Document region/data residency assumptions",
          "Require rollback runbooks"
    ],
    antiPatterns: [
          "Premature multi-region",
          "Snowflake infra without ops ownership",
          "No rollback"
    ],
    reviewCriteria: [
      criterion(
        "Cloud Architect contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md / LAUNCH_PLAN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Cloud Architect output tied to deployment-topology is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Cloud Architect contribution",
        input: "Compose expertise needing Cloud Architect.",
        expectedOutput: "Cloud Architect returns scoped deployment-topology, scaling, operability guidance with labeled unknowns and acceptance checks focused on deploy topology, regions, and operability.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Cloud Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "plg-expert": {
    mission: "Deliver expert PLG Expert judgment focused on product-led activation and aha moments that agents can execute without guessing.",
    principles: [
      "PLG Expert outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: activation-loops, expansion, self-serve.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Activation funnel",
          "Time-to-value",
          "Self-serve vs sales-assist"
    ],
    decisionFrameworks: [
      framework(
        "PLG Expert intake",
        "When the package needs PLG Expert expertise.",
        [
          "Collect inputs relevant to activation-loops.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on product-led activation and aha moments with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded PLG Expert contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Define the aha event",
          "Remove setup friction before growth hacks",
          "Instrument activation clearly"
    ],
    antiPatterns: [
          "Paywall before value",
          "Dark patterns as growth",
          "Vanity signup metrics only"
    ],
    reviewCriteria: [
      criterion(
        "PLG Expert contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md / USER_FLOWS.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete PLG Expert output tied to activation-loops is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "PLG Expert contribution",
        input: "Compose expertise needing PLG Expert.",
        expectedOutput: "PLG Expert returns scoped activation-loops, expansion, self-serve guidance with labeled unknowns and acceptance checks focused on product-led activation and aha moments.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "PLG Expert cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "retention-expert": {
    mission: "Deliver expert Retention Expert judgment focused on habit loops and retention levers that agents can execute without guessing.",
    principles: [
      "Retention Expert outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: retention-levers, habit-loops, churn-signals.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Habit loop",
          "Churn reasons",
          "Re-activation path"
    ],
    decisionFrameworks: [
      framework(
        "Retention Expert intake",
        "When the package needs Retention Expert expertise.",
        [
          "Collect inputs relevant to retention-levers.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on habit loops and retention levers with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Retention Expert contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Tie retention to real job completion",
          "Design gentle reminders not spam",
          "Measure cohort retention"
    ],
    antiPatterns: [
          "Notification spam",
          "Retention theater without product value",
          "Ignoring churn root causes"
    ],
    reviewCriteria: [
      criterion(
        "Retention Expert contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Retention Expert output tied to retention-levers is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Retention Expert contribution",
        input: "Compose expertise needing Retention Expert.",
        expectedOutput: "Retention Expert returns scoped retention-levers, habit-loops, churn-signals guidance with labeled unknowns and acceptance checks focused on habit loops and retention levers.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Retention Expert cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "monetization-expert": {
    mission: "Deliver expert Monetization Expert judgment focused on pricing, packaging, and willingness-to-pay hypotheses that agents can execute without guessing.",
    principles: [
      "Monetization Expert outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: pricing-hypotheses, packaging-tests, revenue-metrics.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Packaging ladder",
          "Value metric",
          "Expansion path"
    ],
    decisionFrameworks: [
      framework(
        "Monetization Expert intake",
        "When the package needs Monetization Expert expertise.",
        [
          "Collect inputs relevant to pricing-hypotheses.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on pricing, packaging, and willingness-to-pay hypotheses with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Monetization Expert contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Price against outcomes not feature counts",
          "Label pricing as hypothesis until validated",
          "Keep billing honesty"
    ],
    antiPatterns: [
          "Feature checkbox pricing only",
          "Hidden fees",
          "Confirmed ARPU invented from thin air"
    ],
    reviewCriteria: [
      criterion(
        "Monetization Expert contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Monetization Expert output tied to pricing-hypotheses is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Monetization Expert contribution",
        input: "Compose expertise needing Monetization Expert.",
        expectedOutput: "Monetization Expert returns scoped pricing-hypotheses, packaging-tests, revenue-metrics guidance with labeled unknowns and acceptance checks focused on pricing, packaging, and willingness-to-pay hypotheses.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Monetization Expert cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "growth-designer": {
    mission: "Deliver expert Growth Designer judgment focused on growth surfaces without dark patterns that agents can execute without guessing.",
    principles: [
      "Growth Designer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: growth-surfaces, experiment-design, ethical-growth.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Growth loop",
          "Ethical persuasion",
          "Experiment backlog"
    ],
    decisionFrameworks: [
      framework(
        "Growth Designer intake",
        "When the package needs Growth Designer expertise.",
        [
          "Collect inputs relevant to growth-surfaces.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on growth surfaces without dark patterns with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Growth Designer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Design opt-in clarity",
          "Instrument experiments",
          "Protect trust over short spikes"
    ],
    antiPatterns: [
          "Dark patterns",
          "Fake scarcity",
          "Growth that breaks accessibility"
    ],
    reviewCriteria: [
      criterion(
        "Growth Designer contribution is concrete and within declared capabilities.",
        "USER_FLOWS.md / DESIGN_SYSTEM.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Growth Designer output tied to growth-surfaces is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Growth Designer contribution",
        input: "Compose expertise needing Growth Designer.",
        expectedOutput: "Growth Designer returns scoped growth-surfaces, experiment-design, ethical-growth guidance with labeled unknowns and acceptance checks focused on growth surfaces without dark patterns.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Growth Designer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "security-engineer-skill": {
    mission: "Deliver expert Security Engineer judgment focused on least privilege, threat coverage, and safe handoff that agents can execute without guessing.",
    principles: [
      "Security Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: threat-coverage, least-privilege, safe-handoff.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Threat → control map",
          "Privilege ladder",
          "Safe handoff boundary"
    ],
    decisionFrameworks: [
      framework(
        "Security Engineer intake",
        "When the package needs Security Engineer expertise.",
        [
          "Collect inputs relevant to threat-coverage.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on least privilege, threat coverage, and safe handoff with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Security Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Keep executionAuthorized false in packs",
          "Secrets never in prompts/logs",
          "Defense in depth for authz"
    ],
    antiPatterns: [
          "Security as checkbox adjectives",
          "Over-privileged agents",
          "Secrets in client bundles"
    ],
    reviewCriteria: [
      criterion(
        "Security Engineer contribution is concrete and within declared capabilities.",
        "AGENT_EXECUTION_PACKAGE.md / ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Security Engineer output tied to threat-coverage is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Security Engineer contribution",
        input: "Compose expertise needing Security Engineer.",
        expectedOutput: "Security Engineer returns scoped threat-coverage, least-privilege, safe-handoff guidance with labeled unknowns and acceptance checks focused on least privilege, threat coverage, and safe handoff.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Security Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "accessibility-specialist": {
    mission: "Deliver expert Accessibility Specialist judgment focused on inclusive interaction, semantics, and reduced motion that agents can execute without guessing.",
    principles: [
      "Accessibility Specialist outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: wcag-gates, semantic-structure, assistive-tech-paths.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Keyboard path",
          "Semantics tree",
          "Reduced-motion path"
    ],
    decisionFrameworks: [
      framework(
        "Accessibility Specialist intake",
        "When the package needs Accessibility Specialist expertise.",
        [
          "Collect inputs relevant to wcag-gates.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on inclusive interaction, semantics, and reduced motion with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Accessibility Specialist contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Focus order and skip links",
          "Do not use color alone",
          "Require reduced-motion fallbacks on motion-led sites"
    ],
    antiPatterns: [
          "A11y as afterthought",
          "Inaccessible canvas-only UX",
          "Missing labels/errors"
    ],
    reviewCriteria: [
      criterion(
        "Accessibility Specialist contribution is concrete and within declared capabilities.",
        "DESIGN_SYSTEM.md / USER_FLOWS.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Accessibility Specialist output tied to wcag-gates is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Accessibility Specialist contribution",
        input: "Compose expertise needing Accessibility Specialist.",
        expectedOutput: "Accessibility Specialist returns scoped wcag-gates, semantic-structure, assistive-tech-paths guidance with labeled unknowns and acceptance checks focused on inclusive interaction, semantics, and reduced motion.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Accessibility Specialist cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "design-systems-architect": {
    mission: "Deliver expert Design Systems Architect judgment focused on tokens, components, and consistent craft contracts that agents can execute without guessing.",
    principles: [
      "Design Systems Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: design-tokens, component-contracts, contribution-rules.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Token tiers",
          "Component states matrix",
          "Theme boundaries"
    ],
    decisionFrameworks: [
      framework(
        "Design Systems Architect intake",
        "When the package needs Design Systems Architect expertise.",
        [
          "Collect inputs relevant to design-tokens.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on tokens, components, and consistent craft contracts with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Design Systems Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Define color/type/space tokens first",
          "Document component states",
          "Keep immersive chrome quiet"
    ],
    antiPatterns: [
          "One-off styles everywhere",
          "Token soup without meaning",
          "Breaking brand for convenience"
    ],
    reviewCriteria: [
      criterion(
        "Design Systems Architect contribution is concrete and within declared capabilities.",
        "DESIGN_SYSTEM.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Design Systems Architect output tied to design-tokens is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Design Systems Architect contribution",
        input: "Compose expertise needing Design Systems Architect.",
        expectedOutput: "Design Systems Architect returns scoped design-tokens, component-contracts, contribution-rules guidance with labeled unknowns and acceptance checks focused on tokens, components, and consistent craft contracts.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Design Systems Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "privacy-engineer": {
    mission: "Deliver expert Privacy Engineer judgment focused on minimization, consent, and retention that agents can execute without guessing.",
    principles: [
      "Privacy Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: data-minimization, consent-retention, privacy-threat-model.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Data minimization",
          "Consent surfaces",
          "Retention clock"
    ],
    decisionFrameworks: [
      framework(
        "Privacy Engineer intake",
        "When the package needs Privacy Engineer expertise.",
        [
          "Collect inputs relevant to data-minimization.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on minimization, consent, and retention with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Privacy Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Collect only needed fields",
          "Document retention/deletion",
          "Separate analytics from secrets"
    ],
    antiPatterns: [
          "Collect everything just in case",
          "Opaque tracking",
          "No deletion path"
    ],
    reviewCriteria: [
      criterion(
        "Privacy Engineer contribution is concrete and within declared capabilities.",
        "DATABASE_DESIGN.md / LAUNCH_PLAN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Privacy Engineer output tied to data-minimization is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Privacy Engineer contribution",
        input: "Compose expertise needing Privacy Engineer.",
        expectedOutput: "Privacy Engineer returns scoped data-minimization, consent-retention, privacy-threat-model guidance with labeled unknowns and acceptance checks focused on minimization, consent, and retention.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Privacy Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "observability-engineer": {
    mission: "Deliver expert Observability Engineer judgment focused on SLOs, redacted telemetry, and actionable alerts that agents can execute without guessing.",
    principles: [
      "Observability Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: slo-design, telemetry-redaction, incident-signals.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "SLO → alert",
          "Redaction policy",
          "Trace of primary journeys"
    ],
    decisionFrameworks: [
      framework(
        "Observability Engineer intake",
        "When the package needs Observability Engineer expertise.",
        [
          "Collect inputs relevant to slo-design.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on SLOs, redacted telemetry, and actionable alerts with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Observability Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Instrument primary user journeys",
          "Redact PII by default",
          "Alert on user pain not vanity"
    ],
    antiPatterns: [
          "Log everything including secrets",
          "Noisy useless alerts",
          "Metrics without owners"
    ],
    reviewCriteria: [
      criterion(
        "Observability Engineer contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md / QUALITY_CHECKLIST.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Observability Engineer output tied to slo-design is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Observability Engineer contribution",
        input: "Compose expertise needing Observability Engineer.",
        expectedOutput: "Observability Engineer returns scoped slo-design, telemetry-redaction, incident-signals guidance with labeled unknowns and acceptance checks focused on SLOs, redacted telemetry, and actionable alerts.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Observability Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "platform-sre": {
    mission: "Deliver expert Platform SRE judgment focused on deploy safety, rollback, and runbooks that agents can execute without guessing.",
    principles: [
      "Platform SRE outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: deploy-safety, rollback, capacity-runbooks.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Deploy pipeline",
          "Rollback path",
          "Incident ladder"
    ],
    decisionFrameworks: [
      framework(
        "Platform SRE intake",
        "When the package needs Platform SRE expertise.",
        [
          "Collect inputs relevant to deploy-safety.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on deploy safety, rollback, and runbooks with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Platform SRE contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Require rollback for every release path",
          "Document runbooks for top failures",
          "Separate progressive delivery from big-bang"
    ],
    antiPatterns: [
          "No rollback",
          "Heroics instead of runbooks",
          "Unowned production"
    ],
    reviewCriteria: [
      criterion(
        "Platform SRE contribution is concrete and within declared capabilities.",
        "LAUNCH_PLAN.md / ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Platform SRE output tied to deploy-safety is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Platform SRE contribution",
        input: "Compose expertise needing Platform SRE.",
        expectedOutput: "Platform SRE returns scoped deploy-safety, rollback, capacity-runbooks guidance with labeled unknowns and acceptance checks focused on deploy safety, rollback, and runbooks.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Platform SRE cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "mobile-architect": {
    mission: "Deliver expert Mobile Architect judgment focused on mobile navigation, offline, and permissions that agents can execute without guessing.",
    principles: [
      "Mobile Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: mobile-navigation, offline-sync, permission-minimization.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Navigation map",
          "Offline modes",
          "Permission just-in-time"
    ],
    decisionFrameworks: [
      framework(
        "Mobile Architect intake",
        "When the package needs Mobile Architect expertise.",
        [
          "Collect inputs relevant to mobile-navigation.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on mobile navigation, offline, and permissions with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Mobile Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Design touch targets and safe areas",
          "Define offline/read-only modes",
          "Ask permissions with context"
    ],
    antiPatterns: [
          "Desktop layouts squeezed",
          "Permission spam on launch",
          "Ignoring offline"
    ],
    reviewCriteria: [
      criterion(
        "Mobile Architect contribution is concrete and within declared capabilities.",
        "USER_FLOWS.md / ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Mobile Architect output tied to mobile-navigation is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Mobile Architect contribution",
        input: "Compose expertise needing Mobile Architect.",
        expectedOutput: "Mobile Architect returns scoped mobile-navigation, offline-sync, permission-minimization guidance with labeled unknowns and acceptance checks focused on mobile navigation, offline, and permissions.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Mobile Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "payments-architect": {
    mission: "Deliver expert Payments Architect judgment focused on checkout, ledgers, and PCI-aware boundaries that agents can execute without guessing.",
    principles: [
      "Payments Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: checkout-flows, ledger-boundaries, fraud-signals.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Payment state machine",
          "Ledger entries",
          "PCI boundary"
    ],
    decisionFrameworks: [
      framework(
        "Payments Architect intake",
        "When the package needs Payments Architect expertise.",
        [
          "Collect inputs relevant to checkout-flows.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on checkout, ledgers, and PCI-aware boundaries with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Payments Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Never store raw PAN in app DB",
          "Idempotent charges",
          "Clear failure/retry UX"
    ],
    antiPatterns: [
          "Homegrown card storage",
          "Double-charge risk",
          "Opaque payment errors"
    ],
    reviewCriteria: [
      criterion(
        "Payments Architect contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md / USER_FLOWS.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Payments Architect output tied to checkout-flows is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Payments Architect contribution",
        input: "Compose expertise needing Payments Architect.",
        expectedOutput: "Payments Architect returns scoped checkout-flows, ledger-boundaries, fraud-signals guidance with labeled unknowns and acceptance checks focused on checkout, ledgers, and PCI-aware boundaries.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Payments Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "data-engineer": {
    mission: "Deliver expert Data Engineer judgment focused on pipelines, freshness, and lineage that agents can execute without guessing.",
    principles: [
      "Data Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: pipeline-design, freshness-slas, data-lineage.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Pipeline DAG",
          "Freshness SLO",
          "Lineage map"
    ],
    decisionFrameworks: [
      framework(
        "Data Engineer intake",
        "When the package needs Data Engineer expertise.",
        [
          "Collect inputs relevant to pipeline-design.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on pipelines, freshness, and lineage with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Data Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Define freshness SLAs",
          "Make lineage queryable",
          "Separate raw and curated zones"
    ],
    antiPatterns: [
          "Unowned brittle ETL",
          "No freshness checks",
          "Silent schema drift"
    ],
    reviewCriteria: [
      criterion(
        "Data Engineer contribution is concrete and within declared capabilities.",
        "DATABASE_DESIGN.md / ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Data Engineer output tied to pipeline-design is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Data Engineer contribution",
        input: "Compose expertise needing Data Engineer.",
        expectedOutput: "Data Engineer returns scoped pipeline-design, freshness-slas, data-lineage guidance with labeled unknowns and acceptance checks focused on pipelines, freshness, and lineage.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Data Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "ml-engineer": {
    mission: "Deliver expert ML Engineer judgment focused on model lifecycle, drift, and serving contracts that agents can execute without guessing.",
    principles: [
      "ML Engineer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: model-lifecycle, drift-monitoring, serving-contracts.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Train → eval → serve",
          "Drift signals",
          "Serving contract"
    ],
    decisionFrameworks: [
      framework(
        "ML Engineer intake",
        "When the package needs ML Engineer expertise.",
        [
          "Collect inputs relevant to model-lifecycle.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on model lifecycle, drift, and serving contracts with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded ML Engineer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Version datasets and models",
          "Monitor drift and quality",
          "Define rollback to previous model"
    ],
    antiPatterns: [
          "Unversioned models in prod",
          "No eval gates",
          "Training-serving skew ignored"
    ],
    reviewCriteria: [
      criterion(
        "ML Engineer contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete ML Engineer output tied to model-lifecycle is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "ML Engineer contribution",
        input: "Compose expertise needing ML Engineer.",
        expectedOutput: "ML Engineer returns scoped model-lifecycle, drift-monitoring, serving-contracts guidance with labeled unknowns and acceptance checks focused on model lifecycle, drift, and serving contracts.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "ML Engineer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "trust-safety": {
    mission: "Deliver expert Trust & Safety Specialist judgment focused on abuse controls and escalation paths that agents can execute without guessing.",
    principles: [
      "Trust & Safety Specialist outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: abuse-controls, content-policy, escalation-paths.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Abuse scenarios",
          "Detection → action",
          "Human escalation"
    ],
    decisionFrameworks: [
      framework(
        "Trust & Safety Specialist intake",
        "When the package needs Trust & Safety Specialist expertise.",
        [
          "Collect inputs relevant to abuse-controls.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on abuse controls and escalation paths with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Trust & Safety Specialist contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Enumerate top abuse cases",
          "Rate-limit sensitive actions",
          "Provide appeal/escalation path"
    ],
    antiPatterns: [
          "No abuse model",
          "Automated bans without review path",
          "Safety theater"
    ],
    reviewCriteria: [
      criterion(
        "Trust & Safety Specialist contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Trust & Safety Specialist output tied to abuse-controls is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Trust & Safety Specialist contribution",
        input: "Compose expertise needing Trust & Safety Specialist.",
        expectedOutput: "Trust & Safety Specialist returns scoped abuse-controls, content-policy, escalation-paths guidance with labeled unknowns and acceptance checks focused on abuse controls and escalation paths.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Trust & Safety Specialist cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "qa-architect": {
    mission: "Deliver expert QA Architect judgment focused on risk-based quality gates and release checks that agents can execute without guessing.",
    principles: [
      "QA Architect outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: test-strategy, risk-based-coverage, release-gates.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Risk → test map",
          "Release checklist",
          "Regression suite"
    ],
    decisionFrameworks: [
      framework(
        "QA Architect intake",
        "When the package needs QA Architect expertise.",
        [
          "Collect inputs relevant to test-strategy.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on risk-based quality gates and release checks with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded QA Architect contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Prioritize tests by user risk",
          "Include a11y/perf smoke for immersive",
          "Block on critical failures"
    ],
    antiPatterns: [
          "Only happy-path demos",
          "No regression net",
          "QA after ship only"
    ],
    reviewCriteria: [
      criterion(
        "QA Architect contribution is concrete and within declared capabilities.",
        "QUALITY_CHECKLIST.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete QA Architect output tied to test-strategy is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "QA Architect contribution",
        input: "Compose expertise needing QA Architect.",
        expectedOutput: "QA Architect returns scoped test-strategy, risk-based-coverage, release-gates guidance with labeled unknowns and acceptance checks focused on risk-based quality gates and release checks.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "QA Architect cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "content-strategist": {
    mission: "Deliver expert Content Strategist judgment focused on voice, hierarchy, and conversion-safe copy that agents can execute without guessing.",
    principles: [
      "Content Strategist outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: content-hierarchy, voice-tone, conversion-copy.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Message hierarchy",
          "Voice dial",
          "CTA ladder"
    ],
    decisionFrameworks: [
      framework(
        "Content Strategist intake",
        "When the package needs Content Strategist expertise.",
        [
          "Collect inputs relevant to content-hierarchy.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on voice, hierarchy, and conversion-safe copy with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Content Strategist contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Protect first-viewport hierarchy",
          "Write recovery-oriented errors",
          "Ban empty hype adjectives"
    ],
    antiPatterns: [
          "Feature dumps as headlines",
          "Inconsistent voice",
          "CTA wallpaper"
    ],
    reviewCriteria: [
      criterion(
        "Content Strategist contribution is concrete and within declared capabilities.",
        "STORY-adjacent sections / PRODUCT_STRATEGY.md / DESIGN_SYSTEM.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Content Strategist output tied to content-hierarchy is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Content Strategist contribution",
        input: "Compose expertise needing Content Strategist.",
        expectedOutput: "Content Strategist returns scoped content-hierarchy, voice-tone, conversion-copy guidance with labeled unknowns and acceptance checks focused on voice, hierarchy, and conversion-safe copy.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Content Strategist cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "api-security-specialist": {
    mission: "Deliver expert API Security Specialist judgment focused on API authz, rate limits, and injection defense that agents can execute without guessing.",
    principles: [
      "API Security Specialist outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: authz-checks, rate-limits, injection-defense.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Authz matrix",
          "Rate-limit classes",
          "Injection surfaces"
    ],
    decisionFrameworks: [
      framework(
        "API Security Specialist intake",
        "When the package needs API Security Specialist expertise.",
        [
          "Collect inputs relevant to authz-checks.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on API authz, rate limits, and injection defense with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded API Security Specialist contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Deny by default",
          "Rate-limit expensive endpoints",
          "Validate and encode untrusted input"
    ],
    antiPatterns: [
          "Authn without authz",
          "Unlimited expensive APIs",
          "Trusting client fields"
    ],
    reviewCriteria: [
      criterion(
        "API Security Specialist contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete API Security Specialist output tied to authz-checks is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "API Security Specialist contribution",
        input: "Compose expertise needing API Security Specialist.",
        expectedOutput: "API Security Specialist returns scoped authz-checks, rate-limits, injection-defense guidance with labeled unknowns and acceptance checks focused on API authz, rate limits, and injection defense.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "API Security Specialist cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "prompt-injection-defender": {
    mission: "Deliver expert Prompt Injection Defender judgment focused on keeping untrusted text from becoming policy or tool authority that agents can execute without guessing.",
    principles: [
      "Prompt Injection Defender outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: untrusted-content-isolation, tool-gating, injection-tests.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Trusted vs untrusted channels",
          "Tool-gating",
          "Output filtering"
    ],
    decisionFrameworks: [
      framework(
        "Prompt Injection Defender intake",
        "When the package needs Prompt Injection Defender expertise.",
        [
          "Collect inputs relevant to untrusted-content-isolation.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on keeping untrusted text from becoming policy or tool authority with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Prompt Injection Defender contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Never let retrieved text set system policy",
          "Gate tools independently of model text",
          "Treat user/content as hostile by default"
    ],
    antiPatterns: [
          "Concatenating untrusted text into system prompts",
          "Model-chosen unrestricted tools",
          "Ignoring indirect injection"
    ],
    reviewCriteria: [
      criterion(
        "Prompt Injection Defender contribution is concrete and within declared capabilities.",
        "AI_SYSTEM_DESIGN.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Prompt Injection Defender output tied to untrusted-content-isolation is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Prompt Injection Defender contribution",
        input: "Compose expertise needing Prompt Injection Defender.",
        expectedOutput: "Prompt Injection Defender returns scoped untrusted-content-isolation, tool-gating, injection-tests guidance with labeled unknowns and acceptance checks focused on keeping untrusted text from becoming policy or tool authority.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Prompt Injection Defender cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "product-reviewer": {
    mission: "Deliver expert Product Reviewer judgment focused on outcome clarity and strategy coherence before export that agents can execute without guessing.",
    principles: [
      "Product Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: outcome-review, scope-integrity, strategy-coherence.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Outcome test",
          "Scope integrity",
          "Assumption labels"
    ],
    decisionFrameworks: [
      framework(
        "Product Reviewer intake",
        "When the package needs Product Reviewer expertise.",
        [
          "Collect inputs relevant to outcome-review.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on outcome clarity and strategy coherence before export with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Product Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Fail packages without clear user outcomes",
          "Require labeled assumptions",
          "Check DNA vs strategy agreement"
    ],
    antiPatterns: [
          "Complete-looking empty strategy",
          "Feature lists posing as outcomes"
    ],
    reviewCriteria: [
      criterion(
        "Product Reviewer contribution is concrete and within declared capabilities.",
        "PRODUCT_STRATEGY.md / PROJECT_DNA.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Product Reviewer output tied to outcome-review is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Product Reviewer contribution",
        input: "Compose expertise needing Product Reviewer.",
        expectedOutput: "Product Reviewer returns scoped outcome-review, scope-integrity, strategy-coherence guidance with labeled unknowns and acceptance checks focused on outcome clarity and strategy coherence before export.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Product Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "architecture-reviewer": {
    mission: "Deliver expert Architecture Reviewer judgment focused on architecture fit to medium and budgets that agents can execute without guessing.",
    principles: [
      "Architecture Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: architecture-fit, boundary-review, budget-review.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Medium fit test",
          "Budget presence",
          "Boundary clarity"
    ],
    decisionFrameworks: [
      framework(
        "Architecture Reviewer intake",
        "When the package needs Architecture Reviewer expertise.",
        [
          "Collect inputs relevant to architecture-fit.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on architecture fit to medium and budgets with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Architecture Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Reject SaaS monolith docs for WebGL briefs",
          "Require budgets/fallbacks for immersive",
          "Check boundaries match the product"
    ],
    antiPatterns: [
          "Generic architecture essays",
          "Ignoring the real medium"
    ],
    reviewCriteria: [
      criterion(
        "Architecture Reviewer contribution is concrete and within declared capabilities.",
        "ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Architecture Reviewer output tied to architecture-fit is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Architecture Reviewer contribution",
        input: "Compose expertise needing Architecture Reviewer.",
        expectedOutput: "Architecture Reviewer returns scoped architecture-fit, boundary-review, budget-review guidance with labeled unknowns and acceptance checks focused on architecture fit to medium and budgets.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Architecture Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "ux-reviewer": {
    mission: "Deliver expert UX Reviewer judgment focused on visitor journeys, states, and recovery that agents can execute without guessing.",
    principles: [
      "UX Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: flow-review, state-coverage, recovery-paths.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Journey fidelity",
          "State coverage",
          "Recovery paths"
    ],
    decisionFrameworks: [
      framework(
        "UX Reviewer intake",
        "When the package needs UX Reviewer expertise.",
        [
          "Collect inputs relevant to flow-review.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on visitor journeys, states, and recovery with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded UX Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Fail compose-loop flows posing as product UX",
          "Require empty/loading/error states",
          "Check keyboard escape routes on immersive"
    ],
    antiPatterns: [
          "Documenting SkillForge internals as user flows"
    ],
    reviewCriteria: [
      criterion(
        "UX Reviewer contribution is concrete and within declared capabilities.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete UX Reviewer output tied to flow-review is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "UX Reviewer contribution",
        input: "Compose expertise needing UX Reviewer.",
        expectedOutput: "UX Reviewer returns scoped flow-review, state-coverage, recovery-paths guidance with labeled unknowns and acceptance checks focused on visitor journeys, states, and recovery.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "UX Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "performance-reviewer": {
    mission: "Deliver expert Performance Reviewer judgment focused on budgets and degradation paths that agents can execute without guessing.",
    principles: [
      "Performance Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: budget-audit, degradation-review, vitals-review.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Budget audit",
          "Degradation ladder",
          "Vitals targets"
    ],
    decisionFrameworks: [
      framework(
        "Performance Reviewer intake",
        "When the package needs Performance Reviewer expertise.",
        [
          "Collect inputs relevant to budget-audit.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on budgets and degradation paths with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Performance Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Require FPS/LCP-class budgets matching medium",
          "Require auto quality drop rules for WebGL",
          "Reject unbounded media"
    ],
    antiPatterns: [
          "Performance adjectives without numbers"
    ],
    reviewCriteria: [
      criterion(
        "Performance Reviewer contribution is concrete and within declared capabilities.",
        "QUALITY_CHECKLIST.md / ARCHITECTURE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Performance Reviewer output tied to budget-audit is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Performance Reviewer contribution",
        input: "Compose expertise needing Performance Reviewer.",
        expectedOutput: "Performance Reviewer returns scoped budget-audit, degradation-review, vitals-review guidance with labeled unknowns and acceptance checks focused on budgets and degradation paths.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Performance Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "security-reviewer": {
    mission: "Deliver expert Security Reviewer judgment focused on safe handoff and permission boundaries that agents can execute without guessing.",
    principles: [
      "Security Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: handoff-security, permission-boundary-review, threat-coverage-review.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Handoff safety",
          "Privilege review",
          "Secret leakage scan"
    ],
    decisionFrameworks: [
      framework(
        "Security Reviewer intake",
        "When the package needs Security Reviewer expertise.",
        [
          "Collect inputs relevant to handoff-security.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on safe handoff and permission boundaries with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Security Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "executionAuthorized must stay false",
          "Prohibited ops must be listed",
          "No secrets in artifacts"
    ],
    antiPatterns: [
          "Treating packs as execution grants"
    ],
    reviewCriteria: [
      criterion(
        "Security Reviewer contribution is concrete and within declared capabilities.",
        "AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Security Reviewer output tied to handoff-security is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Security Reviewer contribution",
        input: "Compose expertise needing Security Reviewer.",
        expectedOutput: "Security Reviewer returns scoped handoff-security, permission-boundary-review, threat-coverage-review guidance with labeled unknowns and acceptance checks focused on safe handoff and permission boundaries.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Security Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "accessibility-reviewer": {
    mission: "Deliver expert Accessibility Reviewer judgment focused on inclusive interaction and reduced-motion gates that agents can execute without guessing.",
    principles: [
      "Accessibility Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: a11y-gate-review, reduced-motion-review, semantics-review.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Keyboard path review",
          "Contrast/semantics",
          "Reduced-motion gate"
    ],
    decisionFrameworks: [
      framework(
        "Accessibility Reviewer intake",
        "When the package needs Accessibility Reviewer expertise.",
        [
          "Collect inputs relevant to a11y-gate-review.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on inclusive interaction and reduced-motion gates with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Accessibility Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Fail motion packs without reduced-motion",
          "Require focus-visible guidance",
          "Check SR/keyboard reach to CTA"
    ],
    antiPatterns: [
          "Canvas-only dead ends"
    ],
    reviewCriteria: [
      criterion(
        "Accessibility Reviewer contribution is concrete and within declared capabilities.",
        "DESIGN_SYSTEM.md / USER_FLOWS.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Accessibility Reviewer output tied to a11y-gate-review is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Accessibility Reviewer contribution",
        input: "Compose expertise needing Accessibility Reviewer.",
        expectedOutput: "Accessibility Reviewer returns scoped a11y-gate-review, reduced-motion-review, semantics-review guidance with labeled unknowns and acceptance checks focused on inclusive interaction and reduced-motion gates.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Accessibility Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "awwwards-reviewer": {
    mission: "Deliver expert Awwwards Reviewer judgment focused on craft density, distinctiveness, and experience integrity that agents can execute without guessing.",
    principles: [
      "Awwwards Reviewer outputs must be specific enough to implement or explicitly mark unknowns.",
      "Stay inside capabilities: craft-density-review, distinctiveness-review, experience-integrity.",
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
          "Craft density bar",
          "First viewport composition test",
          "Anti-template check"
    ],
    decisionFrameworks: [
      framework(
        "Awwwards Reviewer intake",
        "When the package needs Awwwards Reviewer expertise.",
        [
          "Collect inputs relevant to craft-density-review.",
          "List assumptions and unknowns explicitly.",
          "Produce guidance on craft density, distinctiveness, and experience integrity with acceptance checks.",
          "State stop conditions if evidence is insufficient.",
        ],
        ["Bounded Awwwards Reviewer contribution with provenance labels."],
      ),
    ],
    bestPractices: [
          "Fail empty design systems",
          "Reject card-grid heroes on immersive",
          "Require concrete motion + scene constraints"
    ],
    antiPatterns: [
          "Award adjectives without craft rules",
          "Template SaaS posing as award craft"
    ],
    reviewCriteria: [
      criterion(
        "Awwwards Reviewer contribution is concrete and within declared capabilities.",
        "DESIGN_SYSTEM.md",
        "high",
      ),
      criterion("Unknowns and inferences are labeled.", "PROJECT_DNA.md / role sections", "medium"),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
    ],
    acceptanceCriteria: [
      "At least one concrete Awwwards Reviewer output tied to craft-density-review is recorded.",
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: "Awwwards Reviewer contribution",
        input: "Compose expertise needing Awwwards Reviewer.",
        expectedOutput: "Awwwards Reviewer returns scoped craft-density-review, distinctiveness-review, experience-integrity guidance with labeled unknowns and acceptance checks focused on craft density, distinctiveness, and experience integrity.",
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "Awwwards Reviewer cannot safely complete.",
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
    ],
  },
  "creative-direction-reviewer": {
    mission:
      "Fail packages that list aesthetics without a single enforceable creative north star, pillars, and forbidden patterns.",
    principles: [
      "One north star beats moodboard sprawl.",
      "Forbidden patterns must be explicit and testable.",
      "References are posture, never clones.",
      "Creative law must be executable by cook agents.",
    ],
    mentalModels: ["North star", "Pillar coherence", "Forbidden-pattern gate"],
    decisionFrameworks: [
      framework(
        "Creative direction council pass",
        "Before cook on brand/experience packages.",
        [
          "Read CREATIVE_DIRECTION.md for north star and pillars.",
          "Verify forbidden patterns are concrete (not vibes).",
          "Fail if craft artifacts contradict the north star.",
        ],
        ["REVIEWER_FRAMEWORKS.md creative lens with pass/fail."],
      ),
    ],
    bestPractices: ["Cite CREATIVE_DIRECTION.md lines for every fail.", "Prefer remediations that restore one concept."],
    antiPatterns: ["Passing moodboards with no concept.", "Rubber-stamping AI-default aesthetics."],
    reviewCriteria: [
      criterion("North star, pillars, and forbidden patterns are concrete.", "CREATIVE_DIRECTION.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Concept clarity", measurement: "Single north star sentence present", target: "Yes" },
    ],
    acceptanceCriteria: ["Creative direction review recorded with pass/fail."],
    examples: [
      {
        title: "Moodboard without law",
        input: "References only, no forbidden patterns",
        expectedOutput: "Fail: no enforceable creative law; remediate CREATIVE_DIRECTION.md.",
      },
    ],
    failureStates: [
      {
        condition: "Missing CREATIVE_DIRECTION.md",
        impact: "Cannot review creative coherence.",
        recovery: "Require creative direction artifact.",
        blocking: true,
      },
    ],
  },
  "art-direction-reviewer": {
    mission:
      "Fail art direction that defaults to AI clichés, card-grid heroes, or non-executable composition law.",
    principles: [
      "Composition law must be agent-executable.",
      "Rejected looks are named, not vibes.",
      "Chrome stays quiet on experience surfaces.",
      "Materials and typography must serve the experience thesis.",
    ],
    mentalModels: ["Composition law", "Rejected looks ledger", "Material system"],
    decisionFrameworks: [
      framework(
        "Art direction council pass",
        "Before cook on visual packages.",
        [
          "Check ART_DIRECTION.md for composition law and art bible.",
          "Verify rejected looks include AI-default clusters when immersive.",
          "Fail card-grid / inset-hero first viewports on experience briefs.",
        ],
        ["REVIEWER_FRAMEWORKS.md art lens."],
      ),
    ],
    bestPractices: ["Cross-check DESIGN_SYSTEM tokens against art law.", "Require full-bleed hero rules when craft demands it."],
    antiPatterns: ["Purple-gradient defaults.", "Vague 'premium minimal' without constraints."],
    reviewCriteria: [
      criterion("Art bible and composition law are specific enough to implement.", "ART_DIRECTION.md", "high"),
    ],
    qualityMetrics: [
      { name: "Rejected looks", measurement: "Named rejected looks ≥3 when immersive", target: "Yes" },
    ],
    acceptanceCriteria: ["Art direction review recorded."],
    examples: [
      {
        title: "Card-grid hero",
        input: "Awwwards brief with SaaS card hero",
        expectedOutput: "Fail: composition law violated; remediate first viewport.",
      },
    ],
    failureStates: [
      {
        condition: "Missing ART_DIRECTION.md",
        impact: "No visual law to enforce.",
        recovery: "Require art direction artifact.",
        blocking: true,
      },
    ],
  },
  "story-systems-reviewer": {
    mission:
      "Reject story systems that are marketing section stacks instead of visitor beat sheets and chapter maps.",
    principles: [
      "Beats must map to visitor jobs.",
      "Message hierarchy protects the first viewport.",
      "Voice bans empty hype without evidence.",
      "Chapters need one job each.",
    ],
    mentalModels: ["Beat sheet", "Chapter map", "Message hierarchy"],
    decisionFrameworks: [
      framework(
        "Story systems council pass",
        "Before cook on experiential/marketing packages.",
        [
          "Read STORY_SYSTEM.md beat sheet and chapter map.",
          "Check first-viewport message hierarchy.",
          "Fail compose-loop docs posing as story.",
        ],
        ["REVIEWER_FRAMEWORKS.md story lens."],
      ),
    ],
    bestPractices: ["Align chapters with USER_FLOWS visitor jobs.", "Keep CTA as narrative landing."],
    antiPatterns: ["Section stacks with no beats.", "Multiple competing hero messages."],
    reviewCriteria: [
      criterion("Beat sheet and chapter map describe the visitor journey.", "STORY_SYSTEM.md", "high"),
    ],
    qualityMetrics: [
      { name: "Chapter jobs", measurement: "Chapters with one stated job", target: "100%" },
    ],
    acceptanceCriteria: ["Story systems review recorded."],
    examples: [
      {
        title: "Brochure stack",
        input: "Features/Benefits/About with no beats",
        expectedOutput: "Fail: no visitor beat sheet; remediate STORY_SYSTEM.md.",
      },
    ],
    failureStates: [
      {
        condition: "Missing STORY_SYSTEM.md",
        impact: "Cannot review narrative coherence.",
        recovery: "Require story system artifact.",
        blocking: true,
      },
    ],
  },
};
