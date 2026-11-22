import type { ProjectCategoryKey } from "./categories.ts";
import type { ProjectDnaField } from "./types.ts";

export type DnaFieldStatus = "confirmed" | "inferred" | "unknown" | "not_applicable";

export interface DnaFieldRecord {
  name: ProjectDnaField;
  status: DnaFieldStatus;
  value: string | null;
  source: string;
  confidence?: number;
}

const FIELD_ORDER: ProjectDnaField[] = [
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

function inferred(
  name: ProjectDnaField,
  value: string,
  source: string,
  confidence: number,
): DnaFieldRecord {
  return { name, status: "inferred", value, source, confidence };
}

function unknown(name: ProjectDnaField): DnaFieldRecord {
  return { name, status: "unknown", value: null, source: "unresolved" };
}

function match(brief: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const hit = brief.match(pattern);
    if (hit?.[1]) return hit[1].trim();
  }
  return null;
}

export function buildProjectDna(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
  revisionRound?: number;
}): DnaFieldRecord[] {
  const brief = input.brief;
  const lower = brief.toLowerCase();
  const round = input.revisionRound ?? 0;

  const user =
    match(brief, [
      /\bfor\s+([^.!?]{3,80})/i,
      /\bserving\s+([^.!?]{3,80})/i,
      /\baimed at\s+([^.!?]{3,80})/i,
      /\bhelping\s+([^.!?]{3,80})/i,
    ]) ??
    (/\benterprise\b/i.test(brief)
      ? "Enterprise buyers and operators"
      : /\bconsumer|shoppers|customers\b/i.test(brief)
        ? "End customers"
        : /\bteams|internal\b/i.test(brief)
          ? "Internal teams"
          : /\brecruit|hiring|talent\b/i.test(brief)
            ? "Recruiters, hiring managers, and candidates"
            : getUserFallback(input.categoryKey));

  const problem =
    match(brief, [
      /\b(?:to|that)\s+(reduce|automate|improve|streamline|replace)\s+([^.!?]{3,100})/i,
    ])?.replace(/^(reduce|automate|improve|streamline|replace)\s+/i, (verb) => `${verb} `) ??
    (/\brecruit/i.test(brief)
      ? "Recruiting workflows are slow, manual, or inconsistent"
      : /\banalytics|insight/i.test(brief)
        ? "Decision-makers lack timely, trustworthy insights"
        : /\bmarketplace\b/i.test(brief)
          ? "Supply and demand sides need a trusted matching system"
          : `Deliver a ${input.categoryKey.replace(/-/g, " ")} outcome from the stated intent`);

  const market = /\benterprise|b2b\b/i.test(brief)
    ? "B2B / enterprise"
    : /\bconsumer|b2c|shoppers\b/i.test(brief)
      ? "B2C / consumer"
      : /\binternal\b/i.test(brief)
        ? "Internal / operational"
        : `${getMarketFallback(input.categoryKey)}`;

  const businessModel = /\bmarketplace\b/i.test(brief)
    ? "Marketplace take-rate or listing fees (hypothesis)"
    : /\bsaas|subscription\b/i.test(brief)
      ? "Subscription SaaS (hypothesis)"
      : /\be-?commerce|store\b/i.test(brief)
        ? "Product sales / checkout conversion (hypothesis)"
        : market.startsWith("B2B")
          ? "B2B subscription or seat-based licensing (hypothesis)"
          : "Monetization model not confirmed";

  const features = buildFeatureList(lower, input.categoryKey);
  const stack = buildStack(lower, input.categoryKey);
  const architecture = buildArchitecture(input.categoryKey, stack);
  const flows = buildFlows(input.categoryKey, user);
  const metrics = buildMetrics(input.categoryKey, lower);
  const risks = buildRisks(input.categoryKey, lower);
  const roadmap =
    round >= 1
      ? "Discovery → validated DNA → accepted package → external-agent handoff"
      : "Pilot composition → Review Council → revise unknowns → export";

  const differentiation =
    round >= 1
      ? `Category-specialized expertise graph for ${input.categoryKey} with evidence-backed review gates`
      : `Specialized ${input.categoryKey.replace(/-/g, " ")} package with Review Council acceptance gates (hypothesis)`;

  const fields: DnaFieldRecord[] = [
    {
      name: "Vision",
      status: "confirmed",
      value: brief,
      source: "user_brief",
    },
    inferred(
      "User",
      user,
      /\bfor\s+|\bserving\s+|\baimed at\s+|\bhelping\s+/i.test(brief)
        ? "brief_heuristic"
        : "category_fallback",
      /\bfor\s+|\bserving\s+|\baimed at\s+|\bhelping\s+/i.test(brief) ? 0.72 : 0.55,
    ),
    inferred("Problem", problem, "brief_heuristic", 0.58),
    inferred("Market", market, "brief_heuristic", 0.55),
    inferred(
      "Differentiation",
      differentiation,
      round >= 1 ? "revision_enrichment" : "category_fallback",
      round >= 1 ? 0.6 : 0.52,
    ),
    inferred("Business Model", businessModel, "brief_heuristic", 0.5),
    inferred("Core Features", features, "brief_heuristic", 0.6),
    inferred("User Flows", flows, "category_policy", 0.55),
    inferred("Technical Stack", stack, "category_policy", 0.57),
    inferred("Architecture", architecture, "category_policy", 0.56),
    inferred("Success Metrics", metrics, "category_policy", 0.54),
    inferred("Risk Analysis", risks, "category_policy", 0.54),
    inferred("Roadmap", roadmap, "composition_policy", 0.52),
  ];

  // Ensure stable field order and completeness.
  return FIELD_ORDER.map((name) => {
    const found = fields.find((field) => field.name === name);
    return found ?? unknown(name);
  });
}

function getMarketFallback(category: ProjectCategoryKey): string {
  if (category.includes("enterprise")) return "Enterprise / institutional";
  if (category.includes("saas") || category.includes("ai")) return "Product-led or sales-assisted B2B";
  if (category.includes("commerce") || category.includes("marketplace")) return "Transactional marketplace or retail";
  return "Category market segment not fully specified";
}

function getUserFallback(category: ProjectCategoryKey): string {
  switch (category) {
    case "ai-product":
    case "ai-agent":
    case "rag-platform":
      return "Operators and end users of the AI product";
    case "saas":
    case "startup-mvp":
      return "Paying teams, admins, and end users";
    case "enterprise-platform":
    case "internal-tool":
      return "Internal operators and business stakeholders";
    case "e-commerce":
      return "Shoppers and store operators";
    case "marketplace":
      return "Supply-side and demand-side participants";
    case "mobile-app":
      return "Mobile end users";
    case "awwwards-website":
    case "threejs-experience":
    case "web-application":
      return "Site visitors and content stakeholders";
    case "analytics-platform":
      return "Analysts and decision-makers";
    case "automation-system":
      return "Operators who configure and monitor automations";
    default:
      return "Primary users of the stated product intent";
  }
}

function buildFeatureList(lower: string, category: ProjectCategoryKey): string {
  const features = new Set<string>();
  if (lower.includes("recruit")) features.add("candidate sourcing/screening");
  if (lower.includes("rag") || category === "rag-platform") features.add("retrieval-augmented answers");
  if (lower.includes("agent") || category === "ai-agent") features.add("tool-using agent workflows");
  if (lower.includes("dashboard") || category === "analytics-platform") features.add("analytics dashboards");
  if (category === "e-commerce") features.add("catalog, cart, checkout");
  if (category === "marketplace") features.add("multi-sided listings and matching");
  if (category === "awwwards-website" || category === "threejs-experience") {
    features.add("expressive interactive experience");
  }
  if (category === "automation-system") features.add("workflow automation and triggers");
  if (features.size === 0) {
    features.add("core workflow for the stated intent");
    features.add("admin/configuration surface");
    features.add("quality and review gates");
  }
  return [...features].join("; ");
}

function buildStack(lower: string, category: ProjectCategoryKey): string {
  const parts = ["TypeScript/Next.js application layer"];
  if (
    category.startsWith("ai") ||
    category === "rag-platform" ||
    lower.includes("ai") ||
    lower.includes("llm")
  ) {
    parts.push("model/provider adapter boundary", "evaluation harness");
  }
  if (category === "rag-platform" || lower.includes("rag")) {
    parts.push("document ingestion + retrieval index");
  }
  if (category === "threejs-experience" || lower.includes("three")) {
    parts.push("Three.js / R3F rendering pipeline");
  }
  if (category === "mobile-app") parts.push("mobile client delivery channel");
  parts.push("PostgreSQL for transactional state");
  return parts.join("; ");
}

function buildArchitecture(category: ProjectCategoryKey, stack: string): string {
  return `Modular monolith with clear domain boundaries for ${category.replace(/-/g, " ")}; stack assumptions: ${stack}`;
}

function buildFlows(category: ProjectCategoryKey, user: string | null): string {
  const actor = user ?? "primary user";
  return `1) ${actor} states intent 2) system composes expertise package 3) Review Council gates acceptance 4) export/handoff for ${category.replace(/-/g, " ")}`;
}

function buildMetrics(category: ProjectCategoryKey, lower: string): string {
  if (lower.includes("recruit")) return "Time-to-qualified-candidate; reviewer acceptance rate (targets unknown)";
  if (category === "rag-platform") return "Answer groundedness; retrieval precision@k (targets unknown)";
  if (category === "saas") return "Activation, retention, expansion (baselines unknown)";
  if (category === "e-commerce" || category === "marketplace") {
    return "Conversion rate; successful fulfilled transactions (baselines unknown)";
  }
  return "Task success rate; package acceptance rate; revision count";
}

function buildRisks(category: ProjectCategoryKey, lower: string): string {
  const risks = [
    "Unresolved DNA assumptions treated as facts",
    "Unsafe agent execution permissions",
  ];
  if (category.startsWith("ai") || lower.includes("ai")) {
    risks.push("Hallucinated recommendations without evidence");
  }
  if (category === "marketplace" || category === "e-commerce") {
    risks.push("Trust/safety and payment edge cases");
  }
  return risks.join("; ");
}

export function unknownFieldCount(fields: readonly DnaFieldRecord[]): number {
  return fields.filter((field) => field.status === "unknown").length;
}
