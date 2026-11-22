import type { SkillPackage } from "./types.ts";

export type DepthPatch = Partial<
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

/** Domain-distilled depth for catalog skills without elite SKILL_DEPTH bodies. */
export const DISTILLED_DEPTH: Record<string, DepthPatch> = {
  "business-analyst": {
    mission: "Translate stakeholder intent into bounded requirements, measurable outcomes, and explicit assumptions agents can implement without inventing business logic.",
    principles: [
      "Requirements trace to a stakeholder goal or metric, not a feature wish list.",
      "Separate confirmed facts from inferred business rules; label both.",
      "Every requirement has acceptance signals an agent can verify in artifacts.",
      "Scope cuts are decisions with rationale, not silent omissions.",
      "Non-functional needs (compliance, SLA) are first-class requirements.",
    ],
    mentalModels: [
      "Capability map",
      "Assumption ledger",
      "Requirement triage (must/should/cut)",
      "Outcome traceability",
    ],
    decisionFrameworks: [
      framework("Requirement spine", "Greenfield or ambiguous product briefs.", [
        "Restate the business goal in measurable outcome language.",
        "Inventory actors, systems touchpoints, and policy constraints.",
        "Write functional requirements with verifiable acceptance signals.",
        "List assumptions, open questions, and deferred scope with owners.",
      ], [
        "PRODUCT_STRATEGY.md and PROJECT_DNA.md with traceable requirements.",
      ]),
      framework("Impact sizing", "Competing asks exceed delivery capacity.", [
        "Score each requirement by user/business impact and delivery risk.",
        "Propose v1 cuts with explicit tradeoff narrative.",
        "Record what was cut and what metric regresses if wrong.",
      ], [
        "Prioritized backlog hypothesis agents honor in architecture and UX.",
      ]),
    ],
    bestPractices: [
      "Use given/when/then or equivalent for behavioral requirements.",
      "Cross-check requirements against success metrics in PROJECT_DNA.md.",
      "Flag regulatory or contractual constraints before technical design.",
      "Keep requirement IDs stable for review council traceability.",
    ],
    antiPatterns: [
      "Solution-shaped requirements before the job is clear.",
      "Vanity metrics with no measurement method.",
      "Hiding ambiguity behind confident prose.",
      "Mixing marketing copy into binding requirements.",
    ],
    reviewCriteria: [
      criterion("Business requirements trace to outcomes with acceptance signals.", "PRODUCT_STRATEGY.md requirement section.", "critical"),
      criterion("Assumptions and scope cuts are explicit.", "PROJECT_DNA.md assumption inventory.", "high"),
    ],
    qualityMetrics: [
      { name: "Traceability density", measurement: "Requirements with linked outcome or metric", target: "\u226590% of must-haves" },
      { name: "Assumption exposure", measurement: "Labeled assumptions count", target: "\u22653 or explicit none" },
    ],
    acceptanceCriteria: [
      "Outcome-linked requirements and assumption ledger present.",
      "Scope cuts documented when brief exceeds reasonable v1.",
      "No unlabeled business facts presented as confirmed.",
    ],
    examples: [
      { title: "Workflow automation", input: "Reduce invoice processing time for finance ops", expectedOutput: "Goal: cut median cycle time 40%; actors: AP clerk, approver; must: audit trail; cut: ERP migration." },
    ],
    failureStates: [
      { condition: "Package lacks measurable outcomes or verifiable requirements.", impact: "Agents build wrong product.", recovery: "Block acceptance until requirement spine exists.", blocking: true },
      { condition: "Assumptions buried in architecture only.", impact: "Silent scope drift.", recovery: "Hoist assumptions to DNA.", blocking: false },
    ],
  },
  "systems-thinker": {
    mission: "Model feedback loops, boundaries, and failure propagation so architectures stay coherent under load, change, and partial outages.",
    principles: [
      "Draw the system boundary before optimizing a component.",
      "Every integration is a contract with failure modes.",
      "Prefer explicit backpressure and capacity limits over hope.",
      "Local optima that harm global outcomes get rejected.",
      "Document second-order effects of scaling and org change.",
    ],
    mentalModels: [
      "Stocks and flows",
      "Causal loop sketch",
      "Failure domain isolation",
      "Coupling budget",
    ],
    decisionFrameworks: [
      framework("System loop map", "Multi-service or agentic workflows.", [
        "Identify actors, stores, and message paths.",
        "Mark synchronous vs async edges and ownership.",
        "List top failure modes per edge with blast radius.",
        "Define containment (circuit breakers, queues, idempotency).",
      ], [
        "ARCHITECTURE.md diagrams with failure notes.",
      ]),
    ],
    bestPractices: [
      "Name single writers for each source of truth.",
      "Specify timeout, retry, and idempotency defaults on integrations.",
      "Relate operational metrics to user-visible symptoms.",
      "Revisit boundaries when new skills add cross-cutting concerns.",
    ],
    antiPatterns: [
      "Distributed monolith disguised as microservices.",
      "Infinite retry without dead-letter discipline.",
      "Shared mutable state across autonomous agents.",
      "Architecture diagrams with no failure arrows.",
    ],
    reviewCriteria: [
      criterion("System boundaries and integration failure modes documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Failure mode coverage", measurement: "Critical integrations with timeout/retry/idempotency", target: "100% of P0 paths" },
    ],
    acceptanceCriteria: [
      "Boundary map includes ownership and async/sync classification.",
      "At least three named failure modes with containment.",
    ],
    examples: [
      { title: "Order fulfillment", input: "E-commerce with inventory, payments, shipping", expectedOutput: "Inventory owns stock; payment webhook idempotent; ship queue with DLQ; checkout degrades to async confirm." },
    ],
    failureStates: [
      { condition: "No integration failure treatment on multi-service package.", impact: "Cascading outages in implementation.", recovery: "Add loop map before build.", blocking: true },
    ],
  },
  "ai-product-manager": {
    mission: "Shape AI product bets\u2014user value, model boundaries, evaluation, and rollout\u2014so capabilities ship with measurable trust and stop conditions.",
    principles: [
      "Model capability is a product surface, not a hidden implementation detail.",
      "Evaluation criteria precede launch narratives.",
      "Human oversight tiers match harm and reversibility.",
      "Latency, cost, and quality tradeoffs are explicit product choices.",
      "Untrusted prompts and documents never become policy.",
    ],
    mentalModels: [
      "Capability envelope",
      "Human-in-the-loop ladder",
      "Eval flywheel",
      "Model drift as product risk",
    ],
    decisionFrameworks: [
      framework("AI feature charter", "Any LLM, agent, or retrieval feature in v1.", [
        "State user job and non-goals in one paragraph.",
        "Define input/output contract and forbidden outputs.",
        "Pick eval signals (accuracy, safety, latency) with thresholds.",
        "Define rollout guardrails and kill switches.",
      ], [
        "AI_SYSTEM_DESIGN.md charter section.",
      ]),
      framework("Trust tiering", "Features touching PII, money, or irreversible actions.", [
        "Classify action reversibility and blast radius.",
        "Assign autonomy level and required confirmations.",
        "Map escalation paths when confidence is low.",
      ], [
        "Stop conditions aligned with agent-architect patterns.",
      ]),
    ],
    bestPractices: [
      "Ship with offline eval fixtures before online optimism.",
      "Expose confidence and sourcing to users when answers affect decisions.",
      "Budget token and infra cost per active user hypothesis.",
      "Pair launch metrics with harm monitoring hypotheses.",
    ],
    antiPatterns: [
      "Demo-quality prompts masquerading as production spec.",
      "Skipping eval on 'small' AI features.",
      "Autonomy without kill switch.",
      "Treating RAG as magic without corpus governance.",
    ],
    reviewCriteria: [
      criterion("AI feature charter includes eval thresholds and stop conditions.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Eval definition", measurement: "Named eval signals with thresholds", target: "\u22652 signals" },
    ],
    acceptanceCriteria: [
      "Charter with eval thresholds and kill switches.",
      "Harm and oversight tiers documented for sensitive flows.",
    ],
    examples: [
      { title: "Support copilot", input: "B2B SaaS ticket summarization", expectedOutput: "Job: shorten handle time; forbid: billing changes; eval: citation accuracy \u226595%; kill: safety filter trip rate spike." },
    ],
    failureStates: [
      { condition: "AI feature spec without eval or stops.", impact: "Unsafe or untrustworthy ship.", recovery: "Block until charter complete.", blocking: true },
    ],
  },
  "context-engineer": {
    mission: "Design what the model sees\u2014window budget, structure, and freshness\u2014so agents reason on the right evidence without context rot.",
    principles: [
      "Context is a curated evidence packet, not a transcript dump.",
      "Structure beats length: headings, slots, and provenance labels.",
      "Recency and authority beat mere keyword overlap.",
      "Separate instructions, tools, memory, and retrieved facts.",
      "Measure context cost in tokens and attention, not vibes.",
    ],
    mentalModels: [
      "Context layers (system/developer/user/tool)",
      "Slot filling",
      "Evidence packet",
      "Attention dilution",
    ],
    decisionFrameworks: [
      framework("Context budget map", "Multi-tool agents or large blueprints.", [
        "List mandatory slots (goal, constraints, artifacts, stops).",
        "Assign token budgets per layer with overflow strategy.",
        "Define summarization triggers and lossy vs lossless compression.",
        "Specify what must never be truncated (safety, permissions).",
      ], [
        "AGENT_EXECUTION_PACKAGE.md context layout.",
      ]),
    ],
    bestPractices: [
      "Pin stable identifiers (requirement IDs, file paths) over prose paraphrase.",
      "Use structured blocks for tool results and citations.",
      "Refresh stale context when user intent shifts mid-session.",
      "Document what was omitted when summarizing.",
    ],
    antiPatterns: [
      "Dumping entire repositories into one prompt.",
      "Unlabeled inferred content beside confirmed facts.",
      "Repeating the same policy in five places.",
      "Ignoring tool-output serialization limits.",
    ],
    reviewCriteria: [
      criterion("Context layout defines budgets and mandatory slots.", "AGENT_EXECUTION_PACKAGE.md or AI_SYSTEM_DESIGN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Slot coverage", measurement: "Mandatory context slots documented", target: "100% of P0 slots" },
    ],
    acceptanceCriteria: [
      "Context budget map with overflow rules.",
      "Provenance rules for retrieved vs authored text.",
    ],
    examples: [
      { title: "Blueprint agent", input: "Compose MASTER_SKILL_PACKAGE from catalog", expectedOutput: "Slots: DNA summary, active skills, artifact checklist; budget: 8k tokens; overflow: compress DNA keep metrics." },
    ],
    failureStates: [
      { condition: "No context budget on large agent package.", impact: "Hallucinated planning and missed constraints.", recovery: "Add budget map.", blocking: true },
    ],
  },
  "knowledge-graph-architect": {
    mission: "Model entities, relationships, and provenance so knowledge stays queryable, governable, and safe for agents and analytics.",
    principles: [
      "Schema serves questions the product actually asks.",
      "Every edge carries cardinality, direction, and source provenance.",
      "Identifiers are stable across ingest and UI.",
      "Graph extensions require migration and backfill plans.",
      "Sensitivity labels flow with nodes and edges.",
    ],
    mentalModels: [
      "Entity\u2013relationship\u2013event",
      "Ontology tiers (core vs extension)",
      "Provenance chain",
      "Traversal budget",
    ],
    decisionFrameworks: [
      framework("Graph spine design", "Domains with rich relationships (orgs, products, policies).", [
        "List top user questions and required traversals.",
        "Define core entity types and canonical IDs.",
        "Specify relationship types with constraints and indexes.",
        "Plan ingest, dedup, and tombstone semantics.",
      ], [
        "DATABASE_DESIGN.md graph section or companion doc.",
      ]),
    ],
    bestPractices: [
      "Prefer explicit relationship types over overloaded generic links.",
      "Version ontology changes with deprecation windows.",
      "Expose graph queries behind capacity limits.",
      "Align graph privacy with row-level security patterns.",
    ],
    antiPatterns: [
      "Everything-is-a-tag soup graph.",
      "Cycles without traversal guards.",
      "Missing provenance on automated ingest.",
      "Graph as dumping ground for unstructured blobs.",
    ],
    reviewCriteria: [
      criterion("Core entities, relationships, and ID strategy documented.", "DATABASE_DESIGN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Question coverage", measurement: "Top product questions mappable to traversals", target: "\u22655 mapped" },
    ],
    acceptanceCriteria: [
      "Core schema with IDs and provenance rules.",
      "Ingest/dedup strategy stated.",
    ],
    examples: [
      { title: "Vendor risk", input: "Enterprise vendor onboarding", expectedOutput: "Entities: Vendor, Assessment, Control; edges: VENDOR_HAS_ASSESSMENT; IDs: ULID; provenance: ingest source + timestamp." },
    ],
    failureStates: [
      { condition: "Graph schema without ID or provenance strategy.", impact: "Brittle joins and trust failures.", recovery: "Add spine design.", blocking: true },
    ],
  },
  "model-selection-expert": {
    mission: "Pick model classes, routing, and fallbacks matched to latency, cost, quality, and safety constraints\u2014not headline benchmarks.",
    principles: [
      "Task taxonomy drives routing, not vendor loyalty.",
      "Fallback paths are part of the architecture.",
      "Cost per successful outcome beats cost per token alone.",
      "Safety and capability envelopes differ by route.",
      "Document when smaller models are sufficient.",
    ],
    mentalModels: [
      "Router tiers",
      "Capability matrix",
      "SLO envelope",
      "Fallback ladder",
    ],
    decisionFrameworks: [
      framework("Model routing matrix", "Products with multiple AI surfaces.", [
        "Classify tasks (extract, reason, generate, code, vision).",
        "Attach latency, quality, and safety SLOs per class.",
        "Assign primary and fallback models with triggers.",
        "Estimate cost envelopes at expected volume.",
      ], [
        "AI_SYSTEM_DESIGN.md routing table.",
      ]),
    ],
    bestPractices: [
      "Run side-by-side eval on representative fixtures before routing lock.",
      "Isolate high-risk tasks to gated model routes.",
      "Monitor drift with periodic re-eval samples.",
      "Keep human-review path when router confidence is low.",
    ],
    antiPatterns: [
      "One model for every task regardless of SLO.",
      "Routing without measured fallback behavior.",
      "Ignoring regional residency requirements.",
      "Chasing leaderboard scores unrelated to user jobs.",
    ],
    reviewCriteria: [
      criterion("Routing matrix links tasks to models and fallbacks.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Fallback coverage", measurement: "P0 task classes with fallback", target: "100%" },
    ],
    acceptanceCriteria: [
      "Routing matrix with SLOs and fallbacks.",
      "Cost envelope hypothesis documented.",
    ],
    examples: [
      { title: "Hybrid assistant", input: "Customer support + code tools", expectedOutput: "Extract: small fast model; reason: large; fallback: escalate human on low confidence; cost cap per session." },
    ],
    failureStates: [
      { condition: "No fallback on production AI path.", impact: "Outages become total feature loss.", recovery: "Add fallback ladder.", blocking: true },
    ],
  },
  "backend-architect": {
    mission: "Define service boundaries, domain ownership, and runtime contracts so server logic stays testable, observable, and safe to evolve.",
    principles: [
      "Domain modules own their invariants; adapters stay thin.",
      "Idempotency and concurrency are designed, not patched later.",
      "Configuration and secrets never live in code paths agents copy.",
      "APIs expose intent, not internal persistence shape.",
      "Backpressure and queueing are first-class design inputs.",
    ],
    mentalModels: [
      "Hexagonal ports",
      "Write path vs read path",
      "Transactional boundary",
      "Outbox pattern",
    ],
    decisionFrameworks: [
      framework("Service boundary map", "New backend or service split.", [
        "Name aggregates and their consistency boundaries.",
        "Assign sync command paths vs async event paths.",
        "Define public commands/queries and internal modules.",
        "List cross-cutting concerns (auth, audit, metrics).",
      ], [
        "ARCHITECTURE.md backend section.",
      ]),
      framework("Consistency chooser", "Conflicts between immediate UX and durable writes.", [
        "Classify operation as command, query, or event.",
        "Pick strong vs eventual consistency with user-visible behavior.",
        "Document compensation or reconciliation when eventual.",
      ], [
        "No silent dual-writes without reconciliation plan.",
      ]),
    ],
    bestPractices: [
      "Standardize error taxonomy for clients and agents.",
      "Version public APIs and events with deprecation policy.",
      "Instrument golden paths before feature breadth.",
      "Keep handlers small; push policy to domain layer.",
    ],
    antiPatterns: [
      "God service owning unrelated domains.",
      "Leaking ORM models as public API DTOs.",
      "Synchronous chains deeper than two hops without cause.",
      "Background jobs without idempotency keys.",
    ],
    reviewCriteria: [
      criterion("Service boundaries and consistency choices documented.", "ARCHITECTURE.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Boundary clarity", measurement: "Named domains with owners", target: "All P0 domains covered" },
    ],
    acceptanceCriteria: [
      "Boundary map with consistency notes.",
      "Public API/event contracts sketched.",
    ],
    examples: [
      { title: "Billing service", input: "Subscription lifecycle", expectedOutput: "Domain: Subscription aggregate; commands: create/cancel; events: subscription.changed; outbox to analytics." },
    ],
    failureStates: [
      { condition: "No domain boundaries on multi-entity backend.", impact: "Spaghetti coupling.", recovery: "Add boundary map.", blocking: true },
    ],
  },
  "api-architect": {
    mission: "Design outward-facing APIs that express product intent with stable contracts, evolution rules, and client-friendly error stories.",
    principles: [
      "Resources and operations reflect user mental models.",
      "Versioning and deprecation are part of day-one design.",
      "Pagination, filtering, and limits are mandatory for lists.",
      "Errors are actionable, not opaque codes alone.",
      "Auth scopes align to least privilege per client type.",
    ],
    mentalModels: [
      "Resource lifecycle",
      "Contract-first evolution",
      "Error as UX",
      "Rate-limit tiers",
    ],
    decisionFrameworks: [
      framework("API contract sheet", "Public or partner-facing HTTP/GraphQL APIs.", [
        "List resources, verbs, and idempotency rules.",
        "Define auth, scopes, and rate limits per route class.",
        "Specify pagination, sorting, and field selection.",
        "Document breaking vs additive change policy.",
      ], [
        "ARCHITECTURE.md API appendix.",
      ]),
    ],
    bestPractices: [
      "Use consistent naming and status code semantics.",
      "Publish example requests/responses for critical flows.",
      "Correlate request IDs across logs and traces.",
      "Design webhooks with retry and signature verification.",
    ],
    antiPatterns: [
      "Chatty APIs requiring N+1 client calls.",
      "Undocumented implicit enums.",
      "Breaking changes without version bump.",
      "Giant payloads without compression or fields filter.",
    ],
    reviewCriteria: [
      criterion("API contract includes auth, limits, and evolution policy.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Critical route coverage", measurement: "Documented idempotent writes", target: "100% of money/PII routes" },
    ],
    acceptanceCriteria: [
      "Contract sheet for P0 routes.",
      "Error shape and rate limits defined.",
    ],
    examples: [
      { title: "Partner API", input: "Read-only analytics export", expectedOutput: "GET /v1/reports; cursor pagination; 429 with Retry-After; scope: reports:read." },
    ],
    failureStates: [
      { condition: "No versioning policy on public API.", impact: "Client breakage.", recovery: "Add evolution policy.", blocking: true },
    ],
  },
  "database-architect": {
    mission: "Choose storage patterns, schema, and migration strategy so data stays correct, queryable, and recoverable at expected scale.",
    principles: [
      "Schema expresses domain invariants, not every report wish.",
      "Migrations are reversible or compensatable when possible.",
      "Indexes follow measured access paths, not folklore.",
      "Backups and restore RPO/RTO are explicit requirements.",
      "PII and retention belong in the data model conversation.",
    ],
    mentalModels: [
      "Aggregate persistence",
      "Read model vs write model",
      "Migration blast radius",
      "Hot partition risk",
    ],
    decisionFrameworks: [
      framework("Data model lock", "New transactional domain or major schema change.", [
        "Map aggregates to tables/collections with keys.",
        "Define constraints, indexes, and uniqueness rules.",
        "Plan migration steps with backfill and validation.",
        "Document backup, retention, and encryption.",
      ], [
        "DATABASE_DESIGN.md",
      ]),
    ],
    bestPractices: [
      "Use explicit migrations with review checkpoints.",
      "Load-test representative queries before lock.",
      "Separate OLTP from heavy analytics where needed.",
      "Document soft-delete and tombstone semantics.",
    ],
    antiPatterns: [
      "JSON blob replacing relational integrity without cause.",
      "Missing foreign keys on critical relationships.",
      "Manual prod DDL outside migration pipeline.",
      "Unbounded growth tables without archival plan.",
    ],
    reviewCriteria: [
      criterion("Schema, migrations, and retention documented.", "DATABASE_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Migration plan", measurement: "Steps with rollback/backfill", target: "Present for schema changes" },
    ],
    acceptanceCriteria: [
      "DATABASE_DESIGN.md with constraints and indexes.",
      "Backup/RPO hypothesis stated.",
    ],
    examples: [
      { title: "Multi-tenant SaaS", input: "Org-scoped projects", expectedOutput: "Tables: org, project, member; RLS by org_id; migrations v001\u2013v00n; nightly backup RPO 1h." },
    ],
    failureStates: [
      { condition: "No migration plan on schema change.", impact: "Risky deploys.", recovery: "Block until migration narrative exists.", blocking: true },
    ],
  },
  "cloud-architect": {
    mission: "Align compute, network, identity, and data planes with reliability targets, cost guardrails, and compliant residency.",
    principles: [
      "Account and network isolation match blast radius.",
      "Identity is the perimeter; keys rotate and least privilege.",
      "Infrastructure is code-reviewed like application code.",
      "Multi-AZ is default for stateful tiers that matter.",
      "Cost and carbon are architectural inputs, not finance-only.",
    ],
    mentalModels: [
      "Landing zone",
      "Blast radius cell",
      "Control vs data plane",
      "Capacity headroom",
    ],
    decisionFrameworks: [
      framework("Cloud topology", "Greenfield deploy or major platform change.", [
        "Pick regions and residency constraints.",
        "Sketch VPC/VNet, egress, and private endpoints.",
        "Map workloads to runtime (K8s, serverless, VM).",
        "Define SRE SLOs and DR strategy.",
      ], [
        "ARCHITECTURE.md cloud section.",
      ]),
    ],
    bestPractices: [
      "Tag resources for cost and ownership.",
      "Automate drift detection on IaC.",
      "Use managed services when ops burden exceeds team size.",
      "Document break-glass access with audit.",
    ],
    antiPatterns: [
      "Public databases for convenience.",
      "Shared root credentials across envs.",
      "Single-AZ stateful production.",
      "Ungoverned serverless sprawl.",
    ],
    reviewCriteria: [
      criterion("Topology, identity, and DR documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Residency compliance", measurement: "Stated region constraints", target: "100% when regulated" },
    ],
    acceptanceCriteria: [
      "Cloud topology with identity model.",
      "DR/RTO hypothesis for P0 paths.",
    ],
    examples: [
      { title: "EU SaaS", input: "GDPR workloads", expectedOutput: "EU region only; private DB; WAF; IRSA-style workload identity; DR warm standby." },
    ],
    failureStates: [
      { condition: "No DR story on revenue-critical path.", impact: "Extended outage.", recovery: "Add DR section.", blocking: true },
    ],
  },
  "plg-expert": {
    mission: "Design product-led growth loops\u2014activation, sharing, and expansion\u2014grounded in measurable funnel truth, not vanity signups.",
    principles: [
      "Time-to-value is the primary onboarding metric.",
      "Loops must be ethical and consent-aware.",
      "Virality requires a why-share moment tied to user success.",
      "Free tier economics are modeled, not hoped.",
      "Instrumentation precedes growth experiments.",
    ],
    mentalModels: [
      "Aha moment",
      "Activation funnel",
      "Viral coefficient",
      "PQL hypothesis",
    ],
    decisionFrameworks: [
      framework("PLG loop design", "Self-serve B2B or prosumer products.", [
        "Define aha moment and activation checklist.",
        "Map invite/share surfaces with user benefit.",
        "Set guardrails for spam and dark patterns.",
        "Attach metrics and experiment backlog.",
      ], [
        "PRODUCT_STRATEGY.md growth section.",
      ]),
    ],
    bestPractices: [
      "Instrument cohort retention from day one.",
      "Align sales-assist triggers with product signals.",
      "Test onboarding with real first-time users.",
      "Keep upgrade prompts contextual, not modal noise.",
    ],
    antiPatterns: [
      "Referral spam without value.",
      "Gating core value behind excessive signup friction.",
      "PLG without sales-assist path for enterprise.",
      "Growth hacks that erode trust.",
    ],
    reviewCriteria: [
      criterion("Activation metric and loop documented.", "PRODUCT_STRATEGY.md / LAUNCH_PLAN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Activation definition", measurement: "Named aha event", target: "Single clear event" },
    ],
    acceptanceCriteria: [
      "Aha moment and activation checklist.",
      "Loop metrics named.",
    ],
    examples: [
      { title: "Collaborative doc tool", input: "Team invites", expectedOutput: "Aha: first shared edit; loop: invite teammate; metric: D7 retained teams; no address book scraping." },
    ],
    failureStates: [
      { condition: "No activation definition.", impact: "Unmeasurable onboarding.", recovery: "Define aha moment.", blocking: false },
    ],
  },
  "retention-expert": {
    mission: "Turn retention into designed habit loops, lifecycle messaging, and product fixes backed by cohort evidence.",
    principles: [
      "Retention is behavior change, not email volume.",
      "Segment by job and lifecycle stage, not demographics alone.",
      "Churn signals get product responses, not only campaigns.",
      "Respect notification fatigue and consent.",
      "Separate leading indicators from lagging revenue.",
    ],
    mentalModels: [
      "Cohort curve",
      "Habit loop",
      "Resurrection window",
      "PMF signal",
    ],
    decisionFrameworks: [
      framework("Retention diagnostic", "Flat or declining engagement.", [
        "Plot cohort retention by key activation paths.",
        "Identify drop steps in core loop.",
        "Prioritize product vs lifecycle interventions.",
        "Define experiments with success thresholds.",
      ], [
        "PRODUCT_STRATEGY.md metrics + experiment backlog.",
      ]),
    ],
    bestPractices: [
      "Pair qualitative exit interviews with funnel data.",
      "Win-back only when value prop fixed.",
      "Coordinate in-product and email journeys.",
      "Track resurrection separately from new user retention.",
    ],
    antiPatterns: [
      "Discounting as default churn response.",
      "Notification blasts without segmentation.",
      "Optimizing vanity DAU over core job completion.",
      "Ignoring power-user regression.",
    ],
    reviewCriteria: [
      criterion("Cohort metrics and intervention hypotheses listed.", "PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [
      { name: "Cohort definition", measurement: "Weekly or monthly cohort tracked", target: "Defined" },
    ],
    acceptanceCriteria: [
      "Retention metrics with cohort definition.",
      "At least one intervention hypothesis.",
    ],
    examples: [
      { title: "B2B analytics", input: "Weekly active teams", expectedOutput: "Metric: W4 team retention; drop: empty dashboard; fix: guided report template + weekly digest opt-in." },
    ],
    failureStates: [
      { condition: "No cohort metric on subscription product.", impact: "Flying blind post-launch.", recovery: "Add cohort definition.", blocking: true },
    ],
  },
  "monetization-expert": {
    mission: "Align pricing, packaging, and paywalls to delivered value with clear upgrade paths and billing integrity.",
    principles: [
      "Price metric ties to customer value memory.",
      "Packaging maps to jobs, not internal cost centers.",
      "Upgrade friction is intentional but honest.",
      "Billing edge cases are product requirements.",
      "Grandfathering and migration rules are explicit.",
    ],
    mentalModels: [
      "Willingness-to-pay ladder",
      "Good-better-best",
      "Expansion revenue",
      "Usage meter",
    ],
    decisionFrameworks: [
      framework("Monetization map", "New SKU or pricing change.", [
        "Define value metric and tiers with limits.",
        "Map features to tiers with upgrade triggers.",
        "Document billing flows and proration rules.",
        "List compliance and tax touchpoints.",
      ], [
        "PRODUCT_STRATEGY.md business model + payments notes.",
      ]),
    ],
    bestPractices: [
      "Prototype paywall copy with real user scenarios.",
      "Instrument upgrade funnel events.",
      "Plan entitlements in architecture early.",
      "Test downgrade and cancellation flows.",
    ],
    antiPatterns: [
      "Feature gating that blocks core job completion.",
      "Opaque overage charges.",
      "Pricing page disconnected from in-product limits.",
      "Changing price without communication plan.",
    ],
    reviewCriteria: [
      criterion("Tiers, limits, and upgrade paths documented.", "PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [
      { name: "Entitlement clarity", measurement: "Tier limits enumerated", target: "All P0 limits listed" },
    ],
    acceptanceCriteria: [
      "Tier map with limits and upgrade triggers.",
      "Billing edge cases listed.",
    ],
    examples: [
      { title: "API platform", input: "Usage-based tier", expectedOutput: "Free: 1k calls/mo; Pro: 50k; meter: API calls; upgrade: soft cap warning at 80%." },
    ],
    failureStates: [
      { condition: "No entitlement model in architecture.", impact: "Revenue leaks and support load.", recovery: "Add entitlements to ARCHITECTURE.md.", blocking: true },
    ],
  },
  "growth-designer": {
    mission: "Embed growth mechanics into UX with craft integrity\u2014onboarding, invites, and upgrades that feel native to the product story.",
    principles: [
      "Growth UI inherits brand and accessibility standards.",
      "Every growth surface has a measurable hypothesis.",
      "Friction is designed, not accidental.",
      "Social proof must be truthful and permissioned.",
      "Degrade gracefully when growth SDKs fail.",
    ],
    mentalModels: [
      "Growth surface map",
      "Progressive disclosure",
      "Trust gradient",
      "Experiment slot",
    ],
    decisionFrameworks: [
      framework("Growth UX pass", "Onboarding or referral redesign.", [
        "Annotate flows with metric hooks per step.",
        "Check accessibility and reduced-motion for growth modals.",
        "Align visuals with DESIGN_SYSTEM tokens.",
        "Define control and variant at story level.",
      ], [
        "USER_FLOWS.md growth annotations.",
      ]),
    ],
    bestPractices: [
      "Place invites after success moments.",
      "Use skeleton states during async growth calls.",
      "Coordinate with content strategist on voice.",
      "Keep upgrade CTAs in predictable locations.",
    ],
    antiPatterns: [
      "Full-screen interstitials blocking task completion.",
      "Fake countdown timers.",
      "Growth widgets breaking layout on mobile.",
      "Untested color contrast on promo banners.",
    ],
    reviewCriteria: [
      criterion("Growth flows annotated with metrics and a11y notes.", "USER_FLOWS.md / DESIGN_SYSTEM.md", "high"),
    ],
    qualityMetrics: [
      { name: "Instrumented steps", measurement: "Funnel steps with event names", target: "\u226580% of growth path" },
    ],
    acceptanceCriteria: [
      "Growth surfaces mapped in user flows.",
      "Hypothesis per major surface.",
    ],
    examples: [
      { title: "Invite flow", input: "Post-save share", expectedOutput: "After save success: inline invite card; event: invite_shown; a11y: focus trap only on optional modal." },
    ],
    failureStates: [
      { condition: "Growth modals without a11y review.", impact: "Excludes users and risks compliance.", recovery: "Add a11y pass.", blocking: false },
    ],
  },
  "security-engineer-skill": {
    mission: "Embed threat-aware design, least privilege, and safe agent handoffs so implementations resist realistic abuse without granting unsafe autonomy.",
    principles: [
      "Threat model before hardening checklist theater.",
      "Secrets and credentials are never execution artifacts.",
      "Agents get capabilities, not ambient admin.",
      "Defense in depth with measurable control coverage.",
      "Security findings block ship when severity is critical.",
    ],
    mentalModels: [
      "STRIDE-lite",
      "Trust boundaries",
      "Blast radius",
      "Secure defaults",
    ],
    decisionFrameworks: [
      framework("Threat sketch", "Any internet-facing or agentic system.", [
        "List assets, actors, and entry points.",
        "Brainstorm top abuse scenarios (authz, injection, exfil).",
        "Map mitigations to layers with owners.",
        "Define verification steps in QUALITY_CHECKLIST.md.",
      ], [
        "ARCHITECTURE.md security subsection.",
      ]),
      framework("Agent handoff gate", "Packages authorizing execution.", [
        "Enumerate permitted actions vs documentation-only.",
        "Require human approval for credential or prod changes.",
        "State forbidden operations explicitly.",
      ], [
        "AGENT_EXECUTION_PACKAGE.md stays executionAuthorized-safe.",
      ]),
    ],
    bestPractices: [
      "Use standard auth patterns (OIDC, scoped tokens).",
      "Validate and encode all external input at boundaries.",
      "Centralize audit logs for sensitive actions.",
      "Run dependency and secret scanning in CI narrative.",
    ],
    antiPatterns: [
      "Security through obscurity as sole control.",
      "Embedding live secrets in blueprints.",
      "Wildcard CORS on authenticated routes.",
      "Ignoring supply-chain update policy.",
    ],
    reviewCriteria: [
      criterion("Threat sketch and mitigations present.", "ARCHITECTURE.md + QUALITY_CHECKLIST.md", "critical"),
      criterion("No secrets or live credentials in artifacts.", "All blueprint files.", "critical"),
    ],
    qualityMetrics: [
      { name: "Control coverage", measurement: "Top threats with mitigations", target: "\u22655 mapped" },
    ],
    acceptanceCriteria: [
      "Threat sketch with mitigations.",
      "Explicit forbidden operations for agents.",
    ],
    examples: [
      { title: "Admin API", input: "Role-based dashboard", expectedOutput: "Threat: IDOR; mitigation: row-level authz; test: deny cross-tenant IDs; agents forbid prod DB creds." },
    ],
    failureStates: [
      { condition: "Internet-facing package without threat sketch.", impact: "Preventable incidents.", recovery: "Block until threat sketch exists.", blocking: true },
    ],
  },
  "accessibility-specialist": {
    mission: "Make interaction, content, and motion inclusive by default\u2014keyboard, screen reader, contrast, and cognitive load treated as ship criteria.",
    principles: [
      "If it is not keyboard reachable, it is not done.",
      "Semantics and labels beat aria hacks.",
      "Motion honors prefers-reduced-motion.",
      "Color never carries meaning alone.",
      "Live regions and focus management are specified.",
    ],
    mentalModels: [
      "Perceivable\u2013operable\u2013understandable\u2013robust",
      "Focus order graph",
      "Accessible name computation",
      "Motion equivalence",
    ],
    decisionFrameworks: [
      framework("A11y conformance pass", "Any user-facing UI or immersive hybrid.", [
        "Audit critical paths for keyboard and focus.",
        "Check contrast for text and controls.",
        "Define alt, captions, and heading hierarchy.",
        "Document reduced-motion alternatives.",
      ], [
        "DESIGN_SYSTEM.md a11y section + QUALITY_CHECKLIST.md",
      ]),
    ],
    bestPractices: [
      "Test with screen reader on one critical flow.",
      "Specify skip links and landmarks on marketing sites.",
      "Trap focus only in true modals with escape.",
      "Pair WebGL experiences with textual equivalents.",
    ],
    antiPatterns: [
      "div-onClick without keyboard support.",
      "Auto-playing media without controls.",
      "Custom widgets without roles/states.",
      "Low contrast gray-on-gray UI chrome.",
    ],
    reviewCriteria: [
      criterion("A11y criteria on critical paths documented.", "DESIGN_SYSTEM.md / QUALITY_CHECKLIST.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Critical path coverage", measurement: "Keyboard + contrast checked", target: "100% P0 flows" },
    ],
    acceptanceCriteria: [
      "A11y section with contrast and motion rules.",
      "Critical path checklist present.",
    ],
    examples: [
      { title: "Marketing site", input: "Immersive scroll + nav", expectedOutput: "Skip link; focus visible; reduced motion: static scenes; video: captions; contrast AA on UI chrome." },
    ],
    failureStates: [
      { condition: "No reduced-motion story on motion-heavy site.", impact: "Vestibular harm risk.", recovery: "Add motion fallbacks.", blocking: true },
    ],
  },
  "design-systems-architect": {
    mission: "Build scalable token, component, and documentation systems so agents ship consistent UI without one-off styling drift.",
    principles: [
      "Tokens precede components; components precede pages.",
      "Variants are finite and named, not infinite CSS.",
      "Documentation shows do/don't, not only API tables.",
      "Composition patterns are part of the system.",
      "Accessibility baked into component defaults.",
    ],
    mentalModels: [
      "Token ladder",
      "Component API surface",
      "Pattern vs primitive",
      "Versioned migration",
    ],
    decisionFrameworks: [
      framework("Design system charter", "Multi-surface product or design-heavy build.", [
        "Define token tiers (color, type, space, motion).",
        "List core components and forbidden one-offs.",
        "Specify theming and density modes.",
        "Plan adoption and deprecation for legacy UI.",
      ], [
        "DESIGN_SYSTEM.md as source of truth.",
      ]),
    ],
    bestPractices: [
      "Align Figma/code naming when design files exist.",
      "Ship Storybook or equivalent usage examples in prose.",
      "Document focus and aria for interactive components.",
      "Keep motion tokens aligned with motion-director when immersive.",
    ],
    antiPatterns: [
      "One-off hex values scattered in feature CSS.",
      "Duplicate components differing only slightly.",
      "Undocumented breaking token changes.",
      "System so large no agent can navigate it.",
    ],
    reviewCriteria: [
      criterion("Tokens and core components documented.", "DESIGN_SYSTEM.md", "high"),
    ],
    qualityMetrics: [
      { name: "Token completeness", measurement: "Color, type, space, motion present", target: "All four" },
    ],
    acceptanceCriteria: [
      "Token ladder and component list.",
      "Do/don't examples for hero patterns.",
    ],
    examples: [
      { title: "SaaS dashboard", input: "Component library", expectedOutput: "Tokens: semantic colors; components: Button, Input, Dialog; forbid raw Tailwind arbitrary values on chrome." },
    ],
    failureStates: [
      { condition: "No DESIGN_SYSTEM.md on design-led brief.", impact: "Inconsistent UI.", recovery: "Create charter first.", blocking: true },
    ],
  },
  "privacy-engineer": {
    mission: "Engineer data minimization, consent, and rights fulfillment so products respect regulatory and user trust obligations by design.",
    principles: [
      "Collect the minimum needed for the stated job.",
      "Purpose limitation is documented per data class.",
      "Consent and preferences are enforceable in code paths.",
      "Deletion and export are workflows, not tickets.",
      "Cross-border transfer rules are architecture inputs.",
    ],
    mentalModels: [
      "Data inventory",
      "Purpose binding",
      "Retention clock",
      "DPIA trigger",
    ],
    decisionFrameworks: [
      framework("Privacy architecture pass", "Features touching PII or sensitive behavior.", [
        "Inventory data classes and legal bases (labeled hypothesis).",
        "Map flows: collect, store, process, share, delete.",
        "Define retention and anonymization jobs.",
        "Specify user rights endpoints and SLAs.",
      ], [
        "ARCHITECTURE.md privacy + DATABASE_DESIGN.md retention.",
      ]),
    ],
    bestPractices: [
      "Pseudonymize analytics where possible.",
      "Separate marketing identifiers from auth identifiers.",
      "Log access to sensitive tables.",
      "Default opt-in only where law and ethics require it.",
    ],
    antiPatterns: [
      "Logging full payloads with PII for debug.",
      "Indefinite retention without business case.",
      "Third-party SDKs without data mapping.",
      "Privacy policy promises code does not keep.",
    ],
    reviewCriteria: [
      criterion("Data inventory and retention documented.", "ARCHITECTURE.md / DATABASE_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Retention rules", measurement: "Per-class retention stated", target: "100% PII classes" },
    ],
    acceptanceCriteria: [
      "Data inventory with purposes.",
      "Deletion/export narrative present.",
    ],
    examples: [
      { title: "Analytics product", input: "EU users", expectedOutput: "Classes: email, usage events; retention: 24mo; export API; delete cascades with 30d backup lag documented." },
    ],
    failureStates: [
      { condition: "PII feature without retention rules.", impact: "Compliance and trust risk.", recovery: "Add inventory and retention.", blocking: true },
    ],
  },
  "observability-engineer": {
    mission: "Make systems legible with logs, metrics, traces, and SLOs so agents and humans debug production behavior from artifacts, not guesswork.",
    principles: [
      "Golden signals for every user-critical path.",
      "Structured logs with correlation IDs.",
      "SLOs tie to user pain, not only infra graphs.",
      "Dashboards answer questions, not decorate walls.",
      "Alerts are actionable with runbook links.",
    ],
    mentalModels: [
      "RED/USE methods",
      "SLO error budget",
      "Trace exemplar",
      "Cardinality budget",
    ],
    decisionFrameworks: [
      framework("Observability pack", "New service or major feature.", [
        "Define SLIs for latency, errors, saturation.",
        "Set SLO targets and error budget policy.",
        "List required log fields and trace propagation.",
        "Name on-call runbooks for top alerts.",
      ], [
        "ARCHITECTURE.md observability + QUALITY_CHECKLIST.md",
      ]),
    ],
    bestPractices: [
      "Propagate trace context across async boundaries.",
      "Avoid high-cardinality metric labels.",
      "Test alert routing in staging narrative.",
      "Correlate business events with technical metrics sparingly.",
    ],
    antiPatterns: [
      "printf debugging only in production.",
      "Alert storms without ownership.",
      "Metrics without SLO consumers.",
      "Logging secrets or raw tokens.",
    ],
    reviewCriteria: [
      criterion("SLOs and instrumentation plan documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Golden path SLI", measurement: "P0 routes with SLI", target: "100%" },
    ],
    acceptanceCriteria: [
      "SLO table for P0 paths.",
      "Correlation ID strategy stated.",
    ],
    examples: [
      { title: "API gateway", input: "Checkout", expectedOutput: "SLI: success rate + p95 latency; SLO 99.5%; traces across payment webhook; alert links to runbook." },
    ],
    failureStates: [
      { condition: "Revenue path without SLO.", impact: "Blind outages.", recovery: "Add SLO pack.", blocking: true },
    ],
  },
  "platform-sre": {
    mission: "Operate platforms with reliability engineering discipline\u2014capacity, releases, incidents, and toil reduction\u2014aligned to product SLOs.",
    principles: [
      "Toil is measured and budgeted down.",
      "Releases are reversible by default.",
      "Incidents teach system changes, not blame.",
      "Capacity plans include growth and failure drills.",
      "Platform abstractions hide sharp edges safely.",
    ],
    mentalModels: [
      "Error budget policy",
      "Blast radius of deploy",
      "Runbook as code",
      "Toil taxonomy",
    ],
    decisionFrameworks: [
      framework("Reliability program", "Production platform ownership.", [
        "Adopt SLOs agreed with product.",
        "Define release channels and rollback criteria.",
        "Schedule game days for top failure scenarios.",
        "Track toil and automation backlog.",
      ], [
        "LAUNCH_PLAN.md + QUALITY_CHECKLIST.md ops sections.",
      ]),
    ],
    bestPractices: [
      "Canary or progressive delivery on risky changes.",
      "Immutable artifacts promoted across envs.",
      "Document on-call expectations and escalation.",
      "Automate backups restores tests quarterly.",
    ],
    antiPatterns: [
      "Manual prod changes without record.",
      "Hero culture replacing automation.",
      "Shared kubectl admin for everyone.",
      "Ignoring capacity until outage.",
    ],
    reviewCriteria: [
      criterion("Release and rollback strategy documented.", "LAUNCH_PLAN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Rollback readiness", measurement: "Documented rollback for deploy", target: "Required for P0" },
    ],
    acceptanceCriteria: [
      "Release strategy with rollback.",
      "Game day or drill hypothesis.",
    ],
    examples: [
      { title: "K8s SaaS", input: "Weekly releases", expectedOutput: "Blue/green deploy; automatic rollback on SLO burn; monthly restore drill." },
    ],
    failureStates: [
      { condition: "No rollback story on stateful deploy.", impact: "Long incidents.", recovery: "Add release framework.", blocking: true },
    ],
  },
  "mobile-architect": {
    mission: "Define mobile client architecture\u2014navigation, offline, sync, and platform conventions\u2014so native-quality UX meets backend contracts.",
    principles: [
      "Platform HIG/Material patterns are defaults unless brief forbids.",
      "Offline and sync semantics are explicit.",
      "Battery and network respect are architectural.",
      "Deep links and app state restoration are designed.",
      "Mobile security uses OS keystores, not custom crypto folklore.",
    ],
    mentalModels: [
      "Navigation graph",
      "Sync tombstone",
      "App lifecycle",
      "Push notification contract",
    ],
    decisionFrameworks: [
      framework("Mobile architecture brief", "iOS/Android or cross-platform app.", [
        "Choose stack with rationale (native, RN, Flutter).",
        "Map screens, navigation, and state ownership.",
        "Define offline cache and conflict resolution.",
        "List platform capabilities (push, biometrics, background).",
      ], [
        "ARCHITECTURE.md mobile section.",
      ]),
    ],
    bestPractices: [
      "Instrument crash-free sessions and cold start.",
      "Handle token refresh and session expiry gracefully.",
      "Test on mid-tier devices, not flagship only.",
      "Align API pagination with mobile list UX.",
    ],
    antiPatterns: [
      "Webview for core flows without need.",
      "Unbounded image caches.",
      "Blocking main thread on network.",
      "Ignoring platform permission patterns.",
    ],
    reviewCriteria: [
      criterion("Navigation, offline, and sync documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Offline story", measurement: "Conflict rules stated", target: "Present when offline required" },
    ],
    acceptanceCriteria: [
      "Mobile stack choice with rationale.",
      "Sync/offline rules when applicable.",
    ],
    examples: [
      { title: "Field service app", input: "Offline work orders", expectedOutput: "Local SQLite cache; sync on reconnect; conflicts: server wins on status; push for assignment." },
    ],
    failureStates: [
      { condition: "Offline-required brief without sync design.", impact: "Data loss in field.", recovery: "Add sync rules.", blocking: true },
    ],
  },
  "payments-architect": {
    mission: "Design payment flows\u2014authorization, capture, reconciliation, and disputes\u2014with idempotency and compliance as non-negotiable architecture.",
    principles: [
      "Money movement is idempotent end-to-end.",
      "PCI scope minimization via tokenization.",
      "Ledger thinking: nothing lost, nothing duplicated.",
      "Webhooks are untrusted until verified.",
      "Reconciliation is a scheduled product feature.",
    ],
    mentalModels: [
      "Payment state machine",
      "Idempotency key",
      "Ledger double-entry",
      "Chargeback lifecycle",
    ],
    decisionFrameworks: [
      framework("Payments flow map", "Checkout, billing, or marketplace payouts.", [
        "Draw states for pay, fail, retry, refund, dispute.",
        "Assign idempotency keys per client action.",
        "Define webhook verification and replay handling.",
        "Plan reconciliation and reporting jobs.",
      ], [
        "ARCHITECTURE.md payments + DATABASE_DESIGN.md ledger.",
      ]),
    ],
    bestPractices: [
      "Never store raw card data in application DB.",
      "Use provider test fixtures in QUALITY_CHECKLIST.",
      "Expose customer-visible payment status clearly.",
      "Audit admin payment actions.",
    ],
    antiPatterns: [
      "Double charge on retry without idempotency.",
      "Trusting client-side amount.",
      "Missing refund partial state handling.",
      "Silent webhook drop without DLQ.",
    ],
    reviewCriteria: [
      criterion("Payment state machine and idempotency documented.", "ARCHITECTURE.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Idempotent routes", measurement: "Money routes with keys", target: "100%" },
    ],
    acceptanceCriteria: [
      "State machine diagram narrative.",
      "Webhook verification described.",
    ],
    examples: [
      { title: "Subscription checkout", input: "Stripe integration", expectedOutput: "States: requires_payment, active, past_due; idempotency on POST /subscribe; signed webhooks; nightly reconciliation report." },
    ],
    failureStates: [
      { condition: "Payments without idempotency story.", impact: "Double charges.", recovery: "Block until flow map exists.", blocking: true },
    ],
  },
  "data-engineer": {
    mission: "Build reliable data pipelines\u2014ingest, transform, quality, and serve\u2014so analytics and ML consume trustworthy datasets.",
    principles: [
      "Contracts upstream; quality checks in the pipe.",
      "Lineage and ownership are documented.",
      "Batch and stream paths have SLAs.",
      "PII handling mirrors OLTP privacy rules.",
      "Schemas version with backward compatibility.",
    ],
    mentalModels: [
      "Medallion layers",
      "Data contract",
      "Slowly changing dimension",
      "Freshness SLA",
    ],
    decisionFrameworks: [
      framework("Pipeline blueprint", "New analytics domain or warehouse feed.", [
        "Source systems and cadence.",
        "Transform stages with tests and quarantine.",
        "Serving layer (warehouse, metrics, features).",
        "Ownership and on-call for pipeline breaks.",
      ], [
        "ARCHITECTURE.md data platform section.",
      ]),
    ],
    bestPractices: [
      "Idempotent loads with watermarking.",
      "Document null and late-arriving data rules.",
      "Monitor row counts and schema drift.",
      "Separate dev/prod data with access controls.",
    ],
    antiPatterns: [
      "Mystery cron jobs without owners.",
      "Transform logic only in BI tools.",
      "Full-table scrapes on huge sources.",
      "Ignoring data quality failures.",
    ],
    reviewCriteria: [
      criterion("Pipeline stages and quality checks documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Freshness SLA", measurement: "Stated for P0 datasets", target: "Documented" },
    ],
    acceptanceCriteria: [
      "Pipeline blueprint with ownership.",
      "Quality checks named.",
    ],
    examples: [
      { title: "Product analytics", input: "Event stream to warehouse", expectedOutput: "Bronze raw events; silver deduped sessions; gold daily activation; SLA 4h; PII hashed at bronze." },
    ],
    failureStates: [
      { condition: "Analytics without freshness SLA.", impact: "Stale decisions.", recovery: "Add SLA.", blocking: false },
    ],
  },
  "ml-engineer": {
    mission: "Productionize ML\u2014training, serving, monitoring, and rollback\u2014so models improve outcomes without silent drift or ops mystery.",
    principles: [
      "Training and serving environments are reproducible.",
      "Feature pipelines match training and inference.",
      "Monitoring covers data, model, and business KPIs.",
      "Human review for high-impact predictions when needed.",
      "Rollback to last good model is rehearsed.",
    ],
    mentalModels: [
      "Train-serve skew",
      "Feature store",
      "Model card",
      "Drift detector",
    ],
    decisionFrameworks: [
      framework("ML platform slice", "Scoring or ranking in production.", [
        "Define problem, label, and metric.",
        "Sketch offline/online eval separation.",
        "Plan serving latency and scaling.",
        "List monitors and retrain triggers.",
      ], [
        "AI_SYSTEM_DESIGN.md ML section.",
      ]),
    ],
    bestPractices: [
      "Version datasets and models together.",
      "Shadow deploy risky model upgrades.",
      "Document bias and limitation hypotheses.",
      "Keep batch and realtime feature paths aligned.",
    ],
    antiPatterns: [
      "Notebook-only training path.",
      "No baseline model comparison.",
      "Unmonitored feature null spikes.",
      "Serving without timeout and fallback.",
    ],
    reviewCriteria: [
      criterion("Train/serve path and monitoring documented.", "AI_SYSTEM_DESIGN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Eval baseline", measurement: "Named offline metric + threshold", target: "Present" },
    ],
    acceptanceCriteria: [
      "Model card style summary.",
      "Monitoring and rollback triggers.",
    ],
    examples: [
      { title: "Churn model", input: "Batch scores nightly", expectedOutput: "Metric: AUROC; monitor: score distribution drift; rollback if precision drops 10% WoW." },
    ],
    failureStates: [
      { condition: "Production ML without monitoring.", impact: "Silent degradation.", recovery: "Add monitor plan.", blocking: true },
    ],
  },
  "trust-safety": {
    mission: "Design abuse resistance, moderation workflows, and safety policies so communities and AI surfaces resist harm at scale.",
    principles: [
      "Abuse scenarios are assumed, not edge cases.",
      "Report-to-action workflows are specified.",
      "Automation assists humans; high harm escalates.",
      "Transparency balances user safety and privacy.",
      "Rate limits and friction match abuse economics.",
    ],
    mentalModels: [
      "Abuse funnel",
      "Severity ladder",
      "Appeal loop",
      "Safety KPI",
    ],
    decisionFrameworks: [
      framework("Trust & safety charter", "UGC, messaging, or generative products.", [
        "List prohibited content/behavior classes.",
        "Define detection signals (rules, ML, reports).",
        "Map enforcement actions and appeals.",
        "Set metrics: prevalence, response time, false positives.",
      ], [
        "PRODUCT_STRATEGY.md policy + ARCHITECTURE.md enforcement.",
      ]),
    ],
    bestPractices: [
      "Design slow paths for ambiguous cases.",
      "Log enforcement decisions for audit.",
      "Coordinate with legal/privacy on retention.",
      "Test adversarial prompts for AI surfaces.",
    ],
    antiPatterns: [
      "Reactive-only moderation after PR crisis.",
      "Permanent bans without appeal path.",
      "Publishing private report details.",
      "Ignoring coordinated inauthentic behavior.",
    ],
    reviewCriteria: [
      criterion("Policy classes and enforcement paths documented.", "PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [
      { name: "Severity coverage", measurement: "Harm classes with actions", target: "\u22655 classes" },
    ],
    acceptanceCriteria: [
      "Charter with enforcement ladder.",
      "Metrics for response and prevalence.",
    ],
    examples: [
      { title: "Creator platform", input: "Comment moderation", expectedOutput: "Classes: spam, hate, harassment; auto-hide spam; human queue for hate; appeal within 7d." },
    ],
    failureStates: [
      { condition: "UGC product without enforcement map.", impact: "Harm amplification.", recovery: "Add charter.", blocking: true },
    ],
  },
  "qa-architect": {
    mission: "Design quality strategy\u2014test layers, environments, and gates\u2014so agents know what proof is required before ship.",
    principles: [
      "Risk-based testing, not checkbox coverage theater.",
      "Automate golden paths; explore edges deliberately.",
      "Test data and environments are first-class design.",
      "Quality gates map to user-critical flows.",
      "Flaky tests are defects, not noise.",
    ],
    mentalModels: [
      "Test pyramid",
      "Risk heat map",
      "Shift-left gates",
      "Fixture contract",
    ],
    decisionFrameworks: [
      framework("Quality strategy", "Any shippable product package.", [
        "Identify P0 user journeys.",
        "Assign unit/integration/e2e ownership per journey.",
        "Define env matrix and test data rules.",
        "List release gates in QUALITY_CHECKLIST.md.",
      ], [
        "QUALITY_CHECKLIST.md as enforceable gate list.",
      ]),
    ],
    bestPractices: [
      "Seed reproducible fixtures for agents.",
      "Include negative and permission tests on auth paths.",
      "Performance smoke on critical APIs.",
      "Document manual exploratory charters when needed.",
    ],
    antiPatterns: [
      "100% line coverage goal without risk focus.",
      "E2E-only strategy slowing everyone.",
      "Shared mutable test data chaos.",
      "Skipping accessibility in test plan.",
    ],
    reviewCriteria: [
      criterion("P0 journeys have test layers assigned.", "QUALITY_CHECKLIST.md", "critical"),
    ],
    qualityMetrics: [
      { name: "P0 journey coverage", measurement: "Journeys with automated checks", target: "100% P0" },
    ],
    acceptanceCriteria: [
      "Quality strategy with P0 journeys.",
      "Release gates enumerated.",
    ],
    examples: [
      { title: "Auth product", input: "Login and reset", expectedOutput: "Unit: password policy; integration: token refresh; e2e: reset email flow; gate: all P0 green." },
    ],
    failureStates: [
      { condition: "No QUALITY_CHECKLIST on shippable brief.", impact: "Unverifiable ship.", recovery: "Add strategy.", blocking: true },
    ],
  },
  "content-strategist": {
    mission: "Shape voice, information architecture, and copy systems so content supports the user job and brand without bloating the experience.",
    principles: [
      "Content serves the job; cut what does not.",
      "Voice rules are actionable for UI and marketing.",
      "SEO serves humans first when in scope.",
      "Localization readiness is designed early.",
      "Legal and claims are labeled, not blurred.",
    ],
    mentalModels: [
      "Content hierarchy",
      "Voice spectrum",
      "Message map",
      "Progressive disclosure of copy",
    ],
    decisionFrameworks: [
      framework("Content architecture", "Marketing site, app, or docs-heavy product.", [
        "Define audiences and primary messages per surface.",
        "Build page/screen content map with priorities.",
        "Write voice do/don't with examples.",
        "Plan governance for updates and claims.",
      ], [
        "PRODUCT_STRATEGY.md + USER_FLOWS.md content notes.",
      ]),
    ],
    bestPractices: [
      "Pair headlines with proof nearby.",
      "Use plain language for errors and empty states.",
      "Coordinate with accessibility on heading order.",
      "Keep immersive sites terse under dominant media.",
    ],
    antiPatterns: [
      "Lorem ipsum in acceptance artifacts.",
      "Jargon-heavy empty states.",
      "Duplicate messaging across every section.",
      "Unsubstantiated superlatives.",
    ],
    reviewCriteria: [
      criterion("Voice rules and content map present.", "PRODUCT_STRATEGY.md / USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [
      { name: "Voice clarity", measurement: "Do/don't examples count", target: "\u22653 pairs" },
    ],
    acceptanceCriteria: [
      "Content map for primary surfaces.",
      "Voice do/don't documented.",
    ],
    examples: [
      { title: "B2B landing", input: "Dev tool", expectedOutput: "Voice: direct, technical, no hype; hero: outcome + proof link; cut: feature laundry list above fold." },
    ],
    failureStates: [
      { condition: "Brand-led site without voice rules.", impact: "Inconsistent tone.", recovery: "Add voice guide.", blocking: false },
    ],
  },
  "api-security-specialist": {
    mission: "Harden APIs against authz flaws, injection, and abuse with concrete controls verified in architecture and checklists.",
    principles: [
      "Default deny on authorization.",
      "Input validation at the outermost boundary.",
      "Rate limits and bot defenses on auth and expensive routes.",
      "OAuth scopes are minimal and auditable.",
      "Security tests ride on P0 API fixtures.",
    ],
    mentalModels: [
      "BOLA/IDOR",
      "Token binding",
      "Abuse economics",
      "Schema validation",
    ],
    decisionFrameworks: [
      framework("API security review", "External or partner APIs.", [
        "Threat walk on authn/authz per route class.",
        "Validate schemas and reject unknown fields.",
        "Apply rate limits and anomaly signals.",
        "Verify TLS, mTLS, or signing requirements.",
      ], [
        "ARCHITECTURE.md API security + QUALITY_CHECKLIST.md",
      ]),
    ],
    bestPractices: [
      "Use standard libraries for JWT/OAuth validation.",
      "Test horizontal privilege escalation cases.",
      "Return generic errors on auth failures.",
      "Rotate keys with documented procedure.",
    ],
    antiPatterns: [
      "Security by long UUID only.",
      "GraphQL introspection open in prod without cause.",
      "Verbose stack traces to clients.",
      "Shared API keys across customers.",
    ],
    reviewCriteria: [
      criterion("Authz matrix and rate limits on P0 routes.", "ARCHITECTURE.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Authz tests", measurement: "Negative authz cases listed", target: "\u22655 for P0" },
    ],
    acceptanceCriteria: [
      "Authz matrix for resources.",
      "Rate limit policy stated.",
    ],
    examples: [
      { title: "Multi-tenant API", input: "Project CRUD", expectedOutput: "Matrix: user role \u00d7 project actions; tests: cross-tenant 403; rate limit 100 rpm per key." },
    ],
    failureStates: [
      { condition: "Multi-tenant API without authz matrix.", impact: "IDOR incidents.", recovery: "Block until matrix exists.", blocking: true },
    ],
  },
  "prompt-injection-defender": {
    mission: "Contain untrusted text and tool output so agents and LLM features cannot be hijacked into policy violations or unsafe actions.",
    principles: [
      "Untrusted content never becomes system policy.",
      "Tool results are data, not instructions.",
      "Defense in depth: input, prompt, output, and action gates.",
      "High-risk actions require confidence and confirmation.",
      "Red-team fixtures belong in quality plans.",
    ],
    mentalModels: [
      "Instruction/data boundary",
      "Tool sandbox",
      "Output policy filter",
      "Canary prompt",
    ],
    decisionFrameworks: [
      framework("Injection defense stack", "Agentic or RAG features ingesting user/docs/web.", [
        "Classify inputs by trust tier.",
        "Wrap untrusted content in labeled blocks.",
        "Apply output policies before tools execute.",
        "Define block/escalate on policy trip.",
      ], [
        "AI_SYSTEM_DESIGN.md safety section.",
      ]),
    ],
    bestPractices: [
      "Separate system instructions from retrieved blobs.",
      "Allowlist tools per agent role.",
      "Log policy trips without leaking user content.",
      "Maintain attack fixture set for regressions.",
    ],
    antiPatterns: [
      "Executing shell from model text.",
      "Passing raw email HTML into system prompt.",
      "No output filter on customer-facing agents.",
      "Trusting 'ignore previous instructions' tests only once.",
    ],
    reviewCriteria: [
      criterion("Trust tiers and action gates documented.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Attack fixtures", measurement: "Named injection scenarios in QA", target: "\u22655" },
    ],
    acceptanceCriteria: [
      "Trust tier model.",
      "Tool allowlist per agent.",
    ],
    examples: [
      { title: "Support agent", input: "Ticket + KB RAG", expectedOutput: "Ticket body untrusted; tools: read ticket, draft reply; forbid: refunds; escalate on payment keywords." },
    ],
    failureStates: [
      { condition: "Tool-using agent without allowlist.", impact: "Remote code or data exfil risk.", recovery: "Add defense stack.", blocking: true },
    ],
  },
  "product-reviewer": {
    mission: "Review packages for problem clarity, outcome alignment, scope honesty, and metric traceability before council sign-off.",
    principles: [
      "Challenge solution drift against stated user job.",
      "Require explicit assumptions and scope cuts.",
      "Metrics must be measurable, not aspirational fluff.",
      "Conflicts between artifacts get surfaced, not smoothed.",
      "Reviewer notes cite evidence locations.",
    ],
    mentalModels: [
      "Outcome lens",
      "Scope ledger",
      "Artifact crosswalk",
      "Assumption stress test",
    ],
    decisionFrameworks: [
      framework("Product review pass", "Council review of composed blueprint.", [
        "Read PROJECT_DNA and PRODUCT_STRATEGY first.",
        "Cross-check features vs outcomes and metrics.",
        "Flag orphan requirements without owner artifact.",
        "Record severities with required fixes.",
      ], [
        "Review comments mapped to QUALITY_CHECKLIST.md",
      ]),
    ],
    bestPractices: [
      "Ask what user job fails if we ship as-is.",
      "Verify success metrics appear in launch plan.",
      "Confirm out-of-scope is visible to agents.",
    ],
    antiPatterns: [
      "Rubber-stamping without reading DNA.",
      "Style-only feedback on P0 gaps.",
      "Approving conflicting success metrics.",
    ],
    reviewCriteria: [
      criterion("Product reviewer sign-off criteria met.", "Review council record", "critical"),
    ],
    qualityMetrics: [
      { name: "Issue closure", measurement: "Critical product findings resolved", target: "100% before ship" },
    ],
    acceptanceCriteria: [
      "Documented review with cited artifacts.",
      "Critical findings tracked to resolution.",
    ],
    examples: [
      { title: "Review", input: "Recruiting AI package", expectedOutput: "Finding: missing reviewer outcome metric; fix: add shortlist acceptance rate to DNA; severity: high." },
    ],
    failureStates: [
      { condition: "Conflicting DNA and strategy unaddressed.", impact: "Wrong product built.", recovery: "Request revision.", blocking: true },
    ],
  },
  "architecture-reviewer": {
    mission: "Validate structural integrity\u2014boundaries, contracts, failure modes, and evolution\u2014across ARCHITECTURE and related artifacts.",
    principles: [
      "Diagrams must explain failure, not only boxes.",
      "Consistency choices are explicit and justified.",
      "Cross-cutting concerns have owners.",
      "Scale assumptions are stated hypotheses.",
      "Security and observability are architectural, not add-ons.",
    ],
    mentalModels: [
      "Dependency graph",
      "Single writer rule",
      "Failure blast radius",
      "Evolution seam",
    ],
    decisionFrameworks: [
      framework("Architecture review pass", "Systems exceeding single-service complexity.", [
        "Trace P0 journeys through components.",
        "Verify integration contracts and timeouts.",
        "Check data ownership and migration paths.",
        "Record architectural risks with mitigations.",
      ], [
        "ARCHITECTURE.md annotated review.",
      ]),
    ],
    bestPractices: [
      "Prefer simplest topology that meets SLOs.",
      "Call out intentional tech debt.",
      "Align with systems-thinker failure maps.",
    ],
    antiPatterns: [
      "Approving diagrams without data flows.",
      "Missing authz on internal service calls.",
      "No rollback for schema + code coupling.",
    ],
    reviewCriteria: [
      criterion("P0 journeys traced with failure notes.", "ARCHITECTURE.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Risk register", measurement: "Arch risks with owners", target: "\u22653 or explicit none" },
    ],
    acceptanceCriteria: [
      "Review notes on boundaries and contracts.",
      "Risks with mitigations or accepts.",
    ],
    examples: [
      { title: "Review", input: "Event-driven billing", expectedOutput: "Risk: duplicate events; mitigation: idempotent consumers; accept: none." },
    ],
    failureStates: [
      { condition: "Untraced payment path.", impact: "Revenue loss risk.", recovery: "Block ship.", blocking: true },
    ],
  },
  "ux-reviewer": {
    mission: "Evaluate flows, hierarchy, and interaction integrity so the experience matches the user job and design system promises.",
    principles: [
      "Primary user path must be obvious in artifacts.",
      "Errors and empty states are part of UX quality.",
      "Motion serves comprehension unless brief is immersive craft.",
      "Forms minimize cognitive load and respect validation UX.",
      "Mobile and keyboard paths are review defaults.",
    ],
    mentalModels: [
      "Critical path spotlight",
      "Information scent",
      "Error budget for UX friction",
      "Progressive disclosure",
    ],
    decisionFrameworks: [
      framework("UX review pass", "USER_FLOWS and DESIGN_SYSTEM present.", [
        "Walk primary persona through P0 journey.",
        "Check hierarchy, labeling, and feedback timing.",
        "Verify alignment with design tokens and patterns.",
        "File severity-ranked UX defects.",
      ], [
        "USER_FLOWS.md review annotations.",
      ]),
    ],
    bestPractices: [
      "Compare flows to stated success metrics.",
      "Flag hidden dependencies between steps.",
      "Note accessibility gaps for specialist follow-up.",
    ],
    antiPatterns: [
      "Approving flows with dead-end errors.",
      "Ignoring loading and skeleton states.",
      "Hero cluttered against design system rules.",
    ],
    reviewCriteria: [
      criterion("P0 journey walkable from artifacts.", "USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [
      { name: "P0 friction points", measurement: "Documented fixes", target: "All critical resolved" },
    ],
    acceptanceCriteria: [
      "UX review record with journey cite.",
      "Critical friction addressed or accepted.",
    ],
    examples: [
      { title: "Review", input: "Onboarding funnel", expectedOutput: "Issue: missing error on invalid email; fix: inline validation copy per voice guide." },
    ],
    failureStates: [
      { condition: "No USER_FLOWS for multi-step product.", impact: "Implementation guesswork.", recovery: "Require flows.", blocking: true },
    ],
  },
  "performance-reviewer": {
    mission: "Verify performance budgets and degradation plans are present, credible, and tied to user-visible routes and canvas work.",
    principles: [
      "Budgets must name routes or scenes.",
      "Mobile and desktop both get targets when public.",
      "Degradation is designed, not post-hoc FPS panic.",
      "Perf findings reference measurement method.",
      "Immersive packages need dual Web Vitals + FPS.",
    ],
    mentalModels: [
      "Budget envelope",
      "Critical path",
      "Degrade ladder",
      "Device class",
    ],
    decisionFrameworks: [
      framework("Performance review pass", "Web, mobile, or WebGL packages.", [
        "Locate budgets in QUALITY_CHECKLIST/ARCHITECTURE.",
        "Check P0 paths have LCP/INP or FPS targets.",
        "Verify low-power degrade triggers exist.",
        "Flag missing measurement on media-heavy areas.",
      ], [
        "Perf review linked to QUALITY_CHECKLIST.md.",
      ]),
    ],
    bestPractices: [
      "Cross-check with performance-engineer skill depth when present.",
      "Require explicit asset weight limits for heroes.",
      "Note third-party script risk.",
    ],
    antiPatterns: [
      "Approving 'fast enough' without numbers.",
      "Desktop-only budgets on marketing sites.",
      "WebGL package with no FPS mention.",
    ],
    reviewCriteria: [
      criterion("Documented budgets on P0 surfaces.", "QUALITY_CHECKLIST.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Budget completeness", measurement: "Vitals + FPS when immersive", target: "Complete" },
    ],
    acceptanceCriteria: [
      "Review cites budget locations.",
      "Gaps have owners or block ship.",
    ],
    examples: [
      { title: "Review", input: "Marketing + R3F", expectedOutput: "Finding: no mobile FPS target; fix: 30fps min, degrade particles under 20fps." },
    ],
    failureStates: [
      { condition: "Immersive package without FPS budget.", impact: "Jank ship.", recovery: "Block.", blocking: true },
    ],
  },
  "security-reviewer": {
    mission: "Independently verify threat coverage, authz, secret hygiene, and agent safety gates before high-risk release.",
    principles: [
      "Findings reference CWE-class issues or concrete abuse.",
      "Secret leakage in artifacts is automatic critical.",
      "Agent execution bounds are audited.",
      "Third-party data flows need mapping.",
      "Fix or accept with explicit risk owner.",
    ],
    mentalModels: [
      "Attack surface map",
      "Control effectiveness",
      "Residual risk",
      "Ship gate",
    ],
    decisionFrameworks: [
      framework("Security review pass", "Internet-facing, payments, PII, or agentic systems.", [
        "Validate threat sketch vs implementation claims.",
        "Spot-check authz on multi-tenant paths.",
        "Scan artifacts for credential patterns.",
        "Confirm QUALITY_CHECKLIST security gates.",
      ], [
        "Security council sign-off record.",
      ]),
    ],
    bestPractices: [
      "Coordinate with api-security and prompt-injection skills.",
      "Require negative tests on auth paths.",
      "Re-review on material architecture change.",
    ],
    antiPatterns: [
      "Checkbox PCI without flow review.",
      "Approving with open criticals.",
      "Ignoring agent tool allowlists.",
    ],
    reviewCriteria: [
      criterion("No critical security findings open.", "Review council record", "critical"),
    ],
    qualityMetrics: [
      { name: "Critical closure", measurement: "Open critical count", target: "0 at ship" },
    ],
    acceptanceCriteria: [
      "Security review logged with severities.",
      "Criticals resolved or ship blocked.",
    ],
    examples: [
      { title: "Review", input: "Public API", expectedOutput: "Critical: missing tenant check on GET /projects; fix before ship." },
    ],
    failureStates: [
      { condition: "Critical authz flaw open.", impact: "Data breach risk.", recovery: "Block release.", blocking: true },
    ],
  },
  "accessibility-reviewer": {
    mission: "Independently verify inclusive design requirements on critical paths before release, citing WCAG-oriented evidence.",
    principles: [
      "Keyboard and screen reader paths are non-negotiable on P0.",
      "Contrast and motion requirements reference tokens.",
      "Immersive work needs textual equivalents.",
      "Findings include remediation location.",
      "Accessibility debt must be explicit if deferred.",
    ],
    mentalModels: [
      "P0 path audit",
      "WCAG conformance target",
      "Assistive tech path",
      "Motion equivalence",
    ],
    decisionFrameworks: [
      framework("A11y review pass", "Pre-release council on user-facing packages.", [
        "Select P0 flows from USER_FLOWS.",
        "Verify checklist items in QUALITY_CHECKLIST.",
        "Test keyboard order and focus visibility.",
        "Document media alternatives and contrast.",
      ], [
        "Accessibility reviewer sign-off.",
      ]),
    ],
    bestPractices: [
      "Pair with accessibility-specialist criteria.",
      "Note platform-specific a11y for mobile.",
      "Track regressions on design system components.",
    ],
    antiPatterns: [
      "Deferring all a11y to post-launch without register.",
      "Approving decorative-only alts on informative images.",
      "Ignoring form error association.",
    ],
    reviewCriteria: [
      criterion("P0 flows pass documented a11y checklist.", "QUALITY_CHECKLIST.md", "critical"),
    ],
    qualityMetrics: [
      { name: "P0 checklist", measurement: "Items verified", target: "100% P0" },
    ],
    acceptanceCriteria: [
      "A11y review notes with checklist cite.",
      "Critical barriers resolved or blocked.",
    ],
    examples: [
      { title: "Review", input: "Checkout", expectedOutput: "Finding: focus lost on payment iframe; fix: documented focus return handler." },
    ],
    failureStates: [
      { condition: "Keyboard trap on checkout.", impact: "Legal and usability block.", recovery: "Block ship.", blocking: true },
    ],
  },
  "awwwards-reviewer": {
    mission: "Judge immersive and portfolio-class packages against craft, narrative, performance, and distinctiveness\u2014not generic SaaS templates.",
    principles: [
      "First viewport must express concept without card-grid clich\u00e9s.",
      "Motion and WebGL serve story when category is immersive.",
      "Craft claims require concrete constraints in artifacts.",
      "Performance and accessibility are part of award-grade craft.",
      "Reject purple-gradient AI-default aesthetics unless brief demands.",
    ],
    mentalModels: [
      "First viewport test",
      "Craft constraint density",
      "Scroll chapter integrity",
      "Distinctiveness without cloning",
    ],
    decisionFrameworks: [
      framework("Awwwards craft review", "awwwards, threejs, or high-craft marketing categories.", [
        "Score concept clarity and forbidden-pattern compliance.",
        "Check DESIGN_SYSTEM for type, motion, WebGL budgets.",
        "Verify narrative chapter map when long-scroll.",
        "Balance ambition with perf/a11y stop conditions.",
      ], [
        "Council craft verdict with cited artifacts.",
      ]),
    ],
    bestPractices: [
      "Cross-read creative-director and motion-director depth when merged.",
      "Demand shader/scene ownership on WebGL briefs.",
      "Celebrate specificity over adjectives.",
    ],
    antiPatterns: [
      "Approving dashboard hero on experience brief.",
      "Craft adjectives without implementation rules.",
      "Ignoring reduced-motion on scroll theater.",
    ],
    reviewCriteria: [
      criterion("Creative concept and craft constraints present.", "DESIGN_SYSTEM.md + MASTER_SKILL_PACKAGE.md", "critical"),
      criterion("Immersive categories include FPS/motion budgets.", "QUALITY_CHECKLIST.md", "high"),
    ],
    qualityMetrics: [
      { name: "Craft constraint count", measurement: "Concrete rules in design artifact", target: "\u22658 on awwwards tier" },
    ],
    acceptanceCriteria: [
      "Craft review verdict with constraints cited.",
      "Forbidden patterns checked.",
    ],
    examples: [
      { title: "Review", input: "WebGL studio site", expectedOutput: "Pass contingent: add scroll chapter map; fail if card hero remains." },
    ],
    failureStates: [
      { condition: "Immersive brief with generic SaaS layout.", impact: "Mediocre ship.", recovery: "Send back to creative stack.", blocking: true },
    ],
  },
};
