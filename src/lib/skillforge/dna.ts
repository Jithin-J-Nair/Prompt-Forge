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

function isImmersive(category: ProjectCategoryKey, lower: string): boolean {
  return (
    category === "awwwards-website" ||
    category === "threejs-experience" ||
    /\b(webgl|three\.?js|r3f|shader|immersive|scroll\s*theater|awwwards|active\s*theory)\b/i.test(
      lower,
    )
  );
}

export function buildProjectDna(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
  revisionRound?: number;
}): DnaFieldRecord[] {
  const brief = input.brief;
  const lower = brief.toLowerCase();
  const round = input.revisionRound ?? 0;
  const immersive = isImmersive(input.categoryKey, lower);

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
            : getUserFallback(input.categoryKey, immersive));

  const problem =
    match(brief, [
      /\b(?:to|that)\s+(reduce|automate|improve|streamline|replace)\s+([^.!?]{3,100})/i,
    ])?.replace(/^(reduce|automate|improve|streamline|replace)\s+/i, (verb) => `${verb} `) ??
    (immersive
      ? "Brand and product stories fail to feel distinctive, immersive, or craft-led on the web"
      : /\brecruit/i.test(brief)
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
        : immersive
          ? "Brand / studio / experience marketing audiences"
          : `${getMarketFallback(input.categoryKey)}`;

  const businessModel = immersive
    ? /\bstudio|agency|portfolio\b/i.test(brief)
      ? "Studio reputation → inbound leads / project pipeline (hypothesis)"
      : "Brand experience supporting conversion or inbound inquiry (hypothesis)"
    : /\bmarketplace\b/i.test(brief)
      ? "Marketplace take-rate or listing fees (hypothesis)"
      : /\bsaas|subscription\b/i.test(brief)
        ? "Subscription SaaS (hypothesis)"
        : /\be-?commerce|store\b/i.test(brief)
          ? "Product sales / checkout conversion (hypothesis)"
          : market.startsWith("B2B")
            ? "B2B subscription or seat-based licensing (hypothesis)"
            : "Monetization model not confirmed";

  const features = buildFeatureList(lower, input.categoryKey, immersive, round);
  const stack = buildStack(lower, input.categoryKey, immersive);
  const architecture = buildArchitecture(input.categoryKey, stack, immersive);
  const flows = buildFlows(input.categoryKey, user, immersive);
  const metrics = buildMetrics(input.categoryKey, lower, immersive);
  const risks = buildRisks(input.categoryKey, lower, immersive);
  const roadmap = immersive
    ? round >= 1
      ? "Creative lock → scene prototype at FPS budget → full chapter map → a11y/perf presets → agent handoff build"
      : "Creative north star → Review Council craft gates → accepted package → external agent implementation"
    : round >= 1
      ? "Discovery → validated DNA → accepted package → external-agent handoff"
      : "Pilot composition → Review Council → revise unknowns → export";

  const referenceHint = match(brief, [
    /\blike\s+([a-z0-9][a-z0-9.-]{2,60})/i,
    /\binspired by\s+([^.!?]{3,60})/i,
  ]);

  const differentiation = immersive
    ? [
        "Immersive scroll-theater craft with WebGL/motion authorship (hypothesis)",
        referenceHint ? `Reference-informed principles from “${referenceHint}” (hypothesis, not a clone)` : null,
        round >= 1 ? "Scene inventory + shader/motion budgets encoded in architecture" : null,
      ]
        .filter(Boolean)
        .join("; ")
    : round >= 1
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
    inferred("Problem", problem, immersive ? "immersive_category_policy" : "brief_heuristic", immersive ? 0.62 : 0.58),
    inferred("Market", market, "brief_heuristic", 0.55),
    inferred(
      "Differentiation",
      differentiation,
      immersive ? "immersive_craft_policy" : round >= 1 ? "revision_enrichment" : "category_fallback",
      immersive ? 0.64 : round >= 1 ? 0.6 : 0.52,
    ),
    inferred("Business Model", businessModel, "brief_heuristic", 0.5),
    inferred("Core Features", features, immersive ? "immersive_craft_policy" : "brief_heuristic", immersive ? 0.7 : 0.6),
    inferred("User Flows", flows, immersive ? "immersive_visitor_journey" : "category_policy", immersive ? 0.68 : 0.55),
    inferred("Technical Stack", stack, immersive ? "immersive_stack_policy" : "category_policy", immersive ? 0.7 : 0.57),
    inferred("Architecture", architecture, immersive ? "immersive_architecture_policy" : "category_policy", immersive ? 0.68 : 0.56),
    inferred("Success Metrics", metrics, immersive ? "immersive_metrics_policy" : "category_policy", immersive ? 0.6 : 0.54),
    inferred("Risk Analysis", risks, immersive ? "immersive_risk_policy" : "category_policy", immersive ? 0.62 : 0.54),
    inferred("Roadmap", roadmap, "composition_policy", 0.55),
  ];

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

function getUserFallback(category: ProjectCategoryKey, immersive: boolean): string {
  if (immersive) {
    return category === "threejs-experience"
      ? "Visitors experiencing an interactive WebGL world; stakeholders evaluating craft"
      : "Site visitors encountering a brand/experience story; stakeholders evaluating distinctive craft";
  }
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

function buildFeatureList(
  lower: string,
  category: ProjectCategoryKey,
  immersive: boolean,
  round: number,
): string {
  const features = new Set<string>();
  if (immersive) {
    features.add("scroll-driven narrative chapters");
    features.add("full-bleed immersive visual plane / WebGL scenes");
    features.add("authored motion language with reduced-motion fallbacks");
    if (category === "threejs-experience" || /webgl|three|shader|r3f/.test(lower)) {
      features.add("Three.js/R3F scene system with asset pipeline");
      features.add("shader/post accents under frame budgets");
    } else {
      features.add("GSAP/timeline orchestration across chapters");
      features.add("optional WebGL accents where craft requires");
    }
    features.add("invite/contact landing CTA");
    if (round >= 1) features.add("quality presets (high/medium/low) for device classes");
    return [...features].join("; ");
  }
  if (lower.includes("recruit")) features.add("candidate sourcing/screening");
  if (lower.includes("rag") || category === "rag-platform") features.add("retrieval-augmented answers");
  if (lower.includes("agent") || category === "ai-agent") features.add("tool-using agent workflows");
  if (lower.includes("dashboard") || category === "analytics-platform") features.add("analytics dashboards");
  if (category === "e-commerce") features.add("catalog, cart, checkout");
  if (category === "marketplace") features.add("multi-sided listings and matching");
  if (category === "automation-system") features.add("workflow automation and triggers");
  if (features.size === 0) {
    features.add("core workflow for the stated intent");
    features.add("admin/configuration surface");
    features.add("quality and review gates");
  }
  return [...features].join("; ");
}

function buildStack(lower: string, category: ProjectCategoryKey, immersive: boolean): string {
  if (immersive) {
    const parts = [
      "TypeScript application shell (e.g. Next.js) for DOM chrome and routing",
      "Three.js / React Three Fiber experience canvas",
      "GSAP (or equivalent) scroll/timeline orchestration",
      "Shader/material library with uniform contracts",
      "Asset pipeline (compressed GLTF/textures) with disposal rules",
    ];
    if (/cms|auth|login|account|dashboard/.test(lower)) {
      parts.push("Optional headless CMS + PostgreSQL only if editorial/auth confirmed");
    } else {
      parts.push("No default transactional database unless CMS/auth is confirmed");
    }
    return parts.join("; ");
  }
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

function buildArchitecture(
  category: ProjectCategoryKey,
  stack: string,
  immersive: boolean,
): string {
  if (immersive) {
    return `Experience-host architecture for ${category.replace(/-/g, " ")}: single WebGL canvas + DOM shell, chapter/scene modules, scroll-progress bus, asset load/dispose lifecycle; stack: ${stack}`;
  }
  return `Modular monolith with clear domain boundaries for ${category.replace(/-/g, " ")}; stack assumptions: ${stack}`;
}

function buildFlows(
  category: ProjectCategoryKey,
  user: string | null,
  immersive: boolean,
): string {
  const actor = user ?? "primary user";
  if (immersive) {
    return `1) ${actor} lands in arrival world 2) scrolls narrative chapters / scenes 3) optionally interacts with focal scene 4) reaches invite/contact CTA 5) can skip via keyboard to content/CTA`;
  }
  return `1) ${actor} completes the core job for ${category.replace(/-/g, " ")} 2) system responds with clear states 3) errors offer recovery 4) success reaches the defined outcome`;
}

function buildMetrics(category: ProjectCategoryKey, lower: string, immersive: boolean): string {
  if (immersive) {
    return "First-viewport comprehension; scroll-chapter completion rate; CTA conversion; FPS budget adherence (desktop 60 / mobile ≥30); LCP/INP for shell";
  }
  if (lower.includes("recruit")) return "Time-to-qualified-candidate; reviewer acceptance rate (targets unknown)";
  if (category === "rag-platform") return "Answer groundedness; retrieval precision@k (targets unknown)";
  if (category === "saas") return "Activation, retention, expansion (baselines unknown)";
  if (category === "e-commerce" || category === "marketplace") {
    return "Conversion rate; successful fulfilled transactions (baselines unknown)";
  }
  return "Task success rate; package acceptance rate; revision count";
}

function buildRisks(category: ProjectCategoryKey, lower: string, immersive: boolean): string {
  const risks = [
    "Unresolved DNA assumptions treated as facts",
    "Unsafe agent execution permissions",
  ];
  if (immersive) {
    risks.push("GPU/frame budget overruns on mid-tier mobile");
    risks.push("Fake WebGL or template layouts failing craft gates");
    risks.push("Accessibility / reduced-motion gaps in theater-heavy UX");
  }
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
