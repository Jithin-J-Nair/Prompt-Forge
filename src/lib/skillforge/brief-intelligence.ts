import type { ProjectCategoryKey } from "./categories.ts";

export type FactStatus = "explicit" | "inferred";

function isImmersiveCategory(categoryKey: ProjectCategoryKey): boolean {
  return categoryKey === "awwwards-website" || categoryKey === "threejs-experience";
}

export type BriefFact = {
  text: string;
  status: FactStatus;
  confidence: number;
};

export type CategoryMode =
  | "immersive"
  | "saas"
  | "brand"
  | "ecommerce"
  | "enterprise"
  | "ai"
  | "general";

/**
 * Brief intelligence beyond keyword bag-of-words.
 * Explicit facts stay labeled; inferences are hypotheses — never invented requirements.
 */
export type BriefIntelligence = {
  what: BriefFact;
  why: BriefFact;
  userProblem: BriefFact;
  audience: BriefFact;
  behavior: BriefFact;
  emotion: BriefFact;
  brand: BriefFact;
  business: BriefFact;
  contentHierarchy: BriefFact;
  complexity: BriefFact;
  constraints: BriefFact[];
  techSignals: BriefFact[];
  differentiation: BriefFact;
  /** Things the package must not ask agents to build. */
  doNotBuild: string[];
  categoryMode: CategoryMode;
  clarificationNeeded: string[];
  summaryLine: string;
};

function explicit(text: string, confidence = 0.92): BriefFact {
  return { text, status: "explicit", confidence };
}

function inferred(text: string, confidence: number): BriefFact {
  return { text, status: "inferred", confidence };
}

function clip(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= max ? t : `${t.slice(0, max).trimEnd()}…`;
}

function matchFirst(brief: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const hit = brief.match(pattern);
    if (hit?.[1]) return hit[1].trim();
  }
  return null;
}

export function detectCategoryMode(
  categoryKey: ProjectCategoryKey,
  brief: string,
): CategoryMode {
  const lower = brief.toLowerCase();
  if (
    isImmersiveCategory(categoryKey) ||
    /\b(webgl|three\.?js|r3f|shader|immersive|awwwards|active\s*theory|scroll\s*theater)\b/i.test(
      lower,
    )
  ) {
    return "immersive";
  }
  if (
    categoryKey === "saas" ||
    categoryKey === "startup-mvp" ||
    categoryKey === "web-application" ||
    categoryKey === "internal-tool" ||
    /\b(saas|dashboard|b2b|workspace|ops|crm|admin)\b/i.test(lower)
  ) {
    return "saas";
  }
  if (
    categoryKey === "e-commerce" ||
    /\b(shop|store|checkout|cart|e-?comm)\b/i.test(lower)
  ) {
    return "ecommerce";
  }
  if (
    categoryKey === "enterprise-platform" ||
    /\b(enterprise|compliance|sso|tenant)\b/i.test(lower)
  ) {
    return "enterprise";
  }
  if (
    categoryKey.startsWith("ai") ||
    categoryKey === "rag-platform" ||
    /\b(ai|llm|agent|rag)\b/i.test(lower)
  ) {
    return "ai";
  }
  if (
    /\b(brand|campaign|consumer|lifestyle|perfume|fashion|atelier|studio portfolio)\b/i.test(
      lower,
    )
  ) {
    return "brand";
  }
  return "general";
}

export function analyzeBrief(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
}): BriefIntelligence {
  const brief = input.brief.trim().replace(/\s+/g, " ");
  const lower = brief.toLowerCase();
  const mode = detectCategoryMode(input.categoryKey, brief);

  const audienceHit = matchFirst(brief, [
    /\bfor\s+(?:a|an|the)?\s*([a-z0-9][\w\s-]{2,48}?)(?:\s*[—–-]|\s*,|\s*\.|$)/i,
    /\baimed at\s+([^.!?]{3,60})/i,
    /\bserving\s+([^.!?]{3,60})/i,
  ]);
  const audience: BriefFact = audienceHit
    ? explicit(audienceHit)
    : /\bscientists?\b/i.test(brief)
      ? explicit("scientists and research visitors", 0.88)
      : /\brecruit|hiring\b/i.test(brief)
        ? inferred("recruiters, hiring managers, and candidates", 0.72)
        : /\benterprise\b/i.test(brief)
          ? inferred("enterprise buyers and operators", 0.7)
          : mode === "saas"
            ? inferred("operators and decision-makers inside the product", 0.62)
            : mode === "brand" || mode === "immersive"
              ? inferred("brand-curious visitors and prospective clients", 0.6)
              : inferred("primary users implied by the category", 0.55);

  // Group 1 must be the full purpose clause (verb + object). A nested verb-only
  // capture made matchFirst return just "reduce" / "launch" instead of the why.
  const whyHit = matchFirst(brief, [
    /\b(?:to|that)\s+((?:reduce|automate|improve|streamline|replace|showcase|launch|sell)\s+[^.!?]{3,100})/i,
    /\bin order to\s+([^.!?]{3,100})/i,
    /\bso (?:that|we can)\s+([^.!?]{3,100})/i,
  ]);
  const why: BriefFact = whyHit
    ? explicit(whyHit)
    : mode === "immersive"
      ? inferred(
          "Make the brand/product memorable through craft-led web presence instead of template marketing",
          0.64,
        )
      : mode === "saas"
        ? inferred("Help users complete a recurring operational job with less friction", 0.62)
        : inferred("Deliver the stated outcome for the audience with distinctive craft", 0.55);

  const problem: BriefFact =
    mode === "immersive"
      ? inferred(
          "Generic web templates fail to convey distinctive world, craft, or invitation",
          0.66,
        )
      : mode === "saas"
        ? inferred(
            "Users lack a clear, trustworthy path to complete the core job end-to-end",
            0.64,
          )
        : mode === "ecommerce"
          ? inferred("Shoppers cannot discover, trust, and purchase with confidence", 0.64)
          : inferred(`Current experience under-delivers for: ${clip(brief, 80)}`, 0.55);

  const emotion: BriefFact =
    mode === "immersive"
      ? inferred("Awe → curiosity → craft confidence → calm invite", 0.68)
      : mode === "saas"
        ? inferred("Clarity → competence → trust → momentum", 0.66)
        : mode === "brand"
          ? inferred("Desire → recognition → belonging → action", 0.66)
          : inferred("Orientation → progress → confidence", 0.58);

  const behavior: BriefFact =
    mode === "immersive"
      ? inferred(
          "Arrive, scroll/explore chapters, optionally interact with focal craft, reach invite CTA",
          0.7,
        )
      : mode === "saas"
        ? inferred(
            "Land on job, configure inputs, complete primary task, recover from errors, return",
            0.72,
          )
        : mode === "ecommerce"
          ? inferred("Browse → evaluate → add → checkout → confirm", 0.72)
          : inferred("Orient → act → confirm", 0.58);

  const brandHit = matchFirst(brief, [
    /\b(?:brand|called|named)\s+([A-Z][\w-]{1,40})/,
    /\blike\s+([a-z0-9][a-z0-9.-]{2,40})/i,
  ]);
  const brand: BriefFact = brandHit
    ? explicit(`Brand/reference signal: ${brandHit}`, 0.8)
    : inferred("Brand identity not named — invent from brief motifs without trendy defaults", 0.5);

  const business: BriefFact =
    mode === "saas" || mode === "enterprise"
      ? inferred("Subscription / seat-based value (hypothesis)", 0.55)
      : mode === "ecommerce"
        ? inferred("Product sales / conversion (hypothesis)", 0.58)
        : mode === "immersive" || mode === "brand"
          ? inferred("Brand reputation → inbound inquiry or campaign conversion (hypothesis)", 0.55)
          : inferred("Monetization not confirmed", 0.4);

  const contentHierarchy: BriefFact =
    mode === "immersive" || mode === "brand"
      ? inferred(
          "Brand → one promise → one support line → craft proof chapters → single invite",
          0.72,
        )
      : mode === "saas"
        ? inferred(
            "Outcome headline → primary task → supporting evidence → secondary settings",
            0.7,
          )
        : inferred("Primary job first; secondary content never outranks it", 0.6);

  const complexity: BriefFact =
    mode === "immersive"
      ? inferred("High craft complexity; medium product feature surface", 0.7)
      : mode === "saas" || mode === "enterprise" || mode === "ai"
        ? inferred("High functional complexity; restrained visual spectacle", 0.72)
        : inferred("Moderate complexity — prefer coherence over feature count", 0.6);

  const constraints: BriefFact[] = [
    inferred("Do not invent confirmed requirements beyond the brief", 0.9),
    inferred("Label inferred DNA honestly", 0.9),
  ];
  if (/\ba11y|accessib/i.test(lower)) {
    constraints.push(explicit("Accessibility is a stated constraint", 0.95));
  }
  if (/\bperf|60\s*fps|performance\b/i.test(lower)) {
    constraints.push(explicit("Performance budgets are a stated concern", 0.9));
  }
  if (mode === "immersive") {
    constraints.push(
      inferred("Reduced-motion and WebGL fallbacks required for immersive claims", 0.78),
    );
  }
  if (mode === "saas") {
    constraints.push(
      inferred("Usability and state completeness outrank decorative motion", 0.8),
    );
  }

  const techSignals: BriefFact[] = [];
  if (/\bthree\.?js|r3f|webgl|webgpu|shader\b/i.test(lower)) {
    techSignals.push(explicit("Realtime 3D / shader stack signaled in brief", 0.95));
  }
  if (/\bgsap|scroll\b/i.test(lower)) {
    techSignals.push(explicit("Authored motion / scroll theater signaled", 0.9));
  }
  if (/\bnext\.?js|react|typescript\b/i.test(lower)) {
    techSignals.push(explicit("Named web stack in brief", 0.92));
  }
  if (techSignals.length === 0) {
    techSignals.push(
      inferred(
        mode === "immersive"
          ? "Likely DOM + motion + optional WebGL/R3F where scenes earn cost"
          : mode === "saas"
            ? "Likely TypeScript web app with design system; no WebGL by default"
            : "Tech should follow experience needs, not status",
        0.62,
      ),
    );
  }

  const differentiation: BriefFact =
    mode === "immersive"
      ? inferred(
          "Singular world + authored motion instead of card-grid marketing chrome",
          0.68,
        )
      : mode === "saas"
        ? inferred(
            "Job clarity, coherent system, and trustworthy states — not spectacle cosplay",
            0.68,
          )
        : mode === "brand"
          ? inferred(
              "Distinctive brand materials/type/space that would fail a brand-swap test",
              0.66,
            )
          : inferred("Category-best craft without generic AI aesthetics", 0.55);

  const doNotBuild = buildDoNotList(mode, lower);
  const clarificationNeeded: string[] = [];
  // Only ask when assumptions are unreasonable — short briefs with clear category are OK.
  if (brief.length < 20 && mode === "general") {
    clarificationNeeded.push(
      "Brief is extremely thin with no category signal — confirm audience and primary job.",
    );
  }
  if (/\btbd\b|\bTODO\b|\?\?\?/i.test(brief)) {
    clarificationNeeded.push("Brief contains unresolved markers (TBD/TODO/???).");
  }

  const what: BriefFact = explicit(clip(brief, 180), 0.95);

  return {
    what,
    why,
    userProblem: problem,
    audience,
    behavior,
    emotion,
    brand,
    business,
    contentHierarchy,
    complexity,
    constraints,
    techSignals,
    differentiation,
    doNotBuild,
    categoryMode: mode,
    clarificationNeeded,
    summaryLine: `${mode} · for ${audience.text} · ${clip(why.text, 90)}`,
  };
}

function buildDoNotList(mode: CategoryMode, lower: string): string[] {
  const shared = [
    "Do not invent confirmed product facts or fake awards",
    "Do not ship generic AI-default aesthetics (purple glow, cream+terracotta, glassmorphism-by-default)",
    "Do not dump unrelated skills or parallel architectures",
  ];
  if (mode === "immersive") {
    return [
      ...shared,
      "Do not build a SaaS dashboard chrome posing as an immersive brand world",
      "Do not eager-load all 3D assets on first paint",
      "Do not clone Lusion/Active Theory signature layouts",
      "Do not use card-grid heroes or floating promo chips in the first viewport",
    ];
  }
  if (mode === "saas") {
    return [
      ...shared,
      "Do not prioritize cinematic shaders over task completion",
      "Do not add purposeless scroll theater or 3D for status",
      "Do not hide empty/loading/error/recovery states",
      "Do not template every page as a marketing landing",
    ];
  }
  if (mode === "brand") {
    return [
      ...shared,
      "Do not let feature menus outrank brand composition",
      "Do not use interchangeable stock layout sections",
      "Do not overload the first viewport with stats strips and promo clusters",
    ];
  }
  if (mode === "ecommerce") {
    return [
      ...shared,
      "Do not bury add-to-cart / checkout behind spectacle",
      "Do not invent inventory or pricing as confirmed facts",
    ];
  }
  if (/\bportfolio\b/.test(lower)) {
    return [
      ...shared,
      "Do not turn a portfolio into a SaaS dashboard",
      "Do not use placeholder lorem as finished case content",
    ];
  }
  return shared;
}

export function formatBriefIntelligence(intel: BriefIntelligence): string {
  const fact = (label: string, f: BriefFact) =>
    `- **${label}** (${f.status}, conf ${f.confidence.toFixed(2)}): ${f.text}`;
  return [
    fact("What", intel.what),
    fact("Why", intel.why),
    fact("User problem", intel.userProblem),
    fact("Audience", intel.audience),
    fact("Behavior", intel.behavior),
    fact("Emotion", intel.emotion),
    fact("Brand", intel.brand),
    fact("Business", intel.business),
    fact("Content hierarchy", intel.contentHierarchy),
    fact("Complexity", intel.complexity),
    fact("Differentiation", intel.differentiation),
    `- **Category mode:** ${intel.categoryMode}`,
    "",
    "### Constraints",
    ...intel.constraints.map((c) => `- (${c.status}) ${c.text}`),
    "",
    "### Tech signals",
    ...intel.techSignals.map((t) => `- (${t.status}) ${t.text}`),
    "",
    "### What NOT to build",
    ...intel.doNotBuild.map((d) => `- ${d}`),
    intel.clarificationNeeded.length
      ? ["", "### Clarification needed", ...intel.clarificationNeeded.map((c) => `- ${c}`)].join(
          "\n",
        )
      : "- Clarification: none — reasonable assumptions labeled inferred.",
  ].join("\n");
}
