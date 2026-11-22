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

/**
 * Licensed-source SkillForge depth: original instructional text distilled from
 * studying MIT (and Apache 2.0 per-skill) public skill repos. Not copied SKILL.md.
 */
export const LICENSED_DEPTH: Record<string, DepthPatch> = {
  "product-strategist": {
    mission: "Own the coherent product strategy agents execute: vision, segment JTBD, value prop, explicit trade-offs, north-star metrics, growth motion, capabilities, and defensibility—not a feature wishlist.",
    principles: [
      "Define markets by problems and jobs-to-be-done, not demographics alone.",
      "Every strategy names what we will NOT do; trade-offs create focus.",
      "Value props use Who → Why → What-before → How → What-after → Alternatives.",
      "North Star and quarterly One Metric That Matters must be decision-linked.",
      "Surface critical hypotheses and the cheapest experiments that falsify them.",
      "Strategy elements must reinforce each other—spot incoherent cost/value/growth mixes."
    ],
    mentalModels: [
      "Product Strategy Canvas (vision → defensibility)",
      "JTBD segment before persona theater",
      "Trade-off ledger (explicit nos)",
      "Hypothesis → cheap experiment ladder",
      "Defensibility as integrated whole, not a single moat slogan"
    ],
    decisionFrameworks: [
      framework(
        "Strategy canvas fill",
        "New product, repositioning, or composition needing PRODUCT_STRATEGY.md.",
        [
                "Write vision in aspirational but falsifiable language.",
                "Pick 1–2 first segments with JTBD, outcomes, and constraints.",
                "State cost position (low-cost vs unique-value) relative to alternatives.",
                "Draft segment value props with alternatives named.",
                "List trade-offs, North Star + OMTM, growth motion, required capabilities, and can't/won't copy barriers.",
                "List top hypotheses and validation experiments.",
        ],
        [
                "Coherent PRODUCT_STRATEGY.md spine agents can execute.",
        ],
      ),
      framework(
        "Strategy coherence check",
        "Before accepting strategy for downstream build.",
        [
                "Check growth motion matches packaging and sales motion.",
                "Check capabilities match claimed defensibility.",
                "Flag metrics that cannot be observed in v1.",
                "Cut features that violate trade-offs.",
        ],
        [
                "Strategy without silent contradictions.",
        ],
      )
    ],
    bestPractices: [
      "Keep strategy short enough agents read it end-to-end.",
      "Prefer problem-defined segments over vague ICP adjectives.",
      "Tie every roadmap item to a strategy trade-off or metric.",
      "Revisit strategy when market or cost assumptions break."
    ],
    antiPatterns: [
      "Solutionizing into a tech stack before the job is clear.",
      "Strategy that says yes to every segment and channel.",
      "North Star metrics that do not change decisions.",
      "Defensibility claims with no switching-cost or network evidence."
    ],
    reviewCriteria: [
      criterion(
        "User, problem, outcomes, and scope cuts are present and consistent.",
        "PRODUCT_STRATEGY.md / PROJECT_DNA.md",
        "critical",
      ),
      criterion(
        "Explicit trade-offs and alternatives are named.",
        "PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion(
        "Critical hypotheses have validation experiments.",
        "PRODUCT_STRATEGY.md / LAUNCH_PLAN.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Outcome clarity",
        measurement: "Observable success metrics tied to decisions",
        target: "≥1 North Star + 1 OMTM",
      },
      {
        name: "Trade-off explicitness",
        measurement: "Named out-of-scope markets/features",
        target: "≥3",
      }
    ],
    acceptanceCriteria: [
      "Strategy spine present with JTBD segments, value props, trade-offs, metrics, and hypotheses.",
      "No unsupported market-size facts without source or inferred label.",
      "Downstream skills inherit the same job statement."
    ],
    examples: [
      {
        title: "Recruiting AI strategy",
        input: "Enterprise AI recruiting platform",
        expectedOutput: "Vision: shorten time-to-qualified shortlist. Segment: TA ops at mid-market SaaS. Value after: reviewers spend hours not days. Trade-off: not replacing ATS in v1. North Star: accepted shortlists/week. Hypotheses: willingness to pay for accuracy vs speed.",
      }
    ],
    failureStates: [
      {
        condition: "No problem/outcome framing or trade-offs.",
        impact: "Wandering package and conflicting builds.",
        recovery: "Block acceptance until strategy spine is revised.",
        blocking: true,
      },
      {
        condition: "Metrics cannot be measured with planned instrumentation.",
        impact: "Fake progress theater.",
        recovery: "Rewrite metrics or add measurement plan.",
        blocking: true,
      }
    ],
  },
  "business-analyst": {
    mission: "Translate strategy into assumption ledgers, measurable success criteria, and scope cuts so agents know what must be true—and what to cut—before building.",
    principles: [
      "Inventory assumptions across value, usability, viability, feasibility, GTM, ethics, strategy, and team risks for new products.",
      "Rate confidence and name the cheapest test for each high-risk assumption.",
      "Success metrics must drive a decision; vanity metrics are labeled as such.",
      "MVP scope cuts are explicit ownership decisions, not silent omissions.",
      "Separate confirmed brief facts from inferred market claims."
    ],
    mentalModels: [
      "Eight-risk assumption map",
      "Confidence × impact prioritization",
      "Metric → decision link",
      "Scope cut matrix (must / should / cut)"
    ],
    decisionFrameworks: [
      framework(
        "Assumption intake",
        "New venture, feature bet, or thin brief needing analysis.",
        [
                "Restate problem and proposed solution as testable claims.",
                "List assumptions by risk category (value, usability, viability, feasibility, ethics, GTM, strategy, team).",
                "Score confidence and blast radius; prioritize top risks.",
                "Attach a validation method (interview, landing test, concierge, spike) to each top risk.",
                "Propose scope cuts that shrink risk without killing learning.",
        ],
        [
                "Assumption ledger with tests in PRODUCT_STRATEGY.md / PROJECT_DNA.md.",
        ],
      ),
      framework(
        "Success measure design",
        "When packaging needs measurable outcomes.",
        [
                "Map business outcome → product outcome → leading indicators.",
                "Define instrumentation needed in v1.",
                "State stop conditions if evidence is missing.",
        ],
        [
                "Decision-linked metrics agents can implement.",
        ],
      )
    ],
    bestPractices: [
      "Write measurable success metrics with owners and time windows.",
      "Label every market claim confirmed vs inferred.",
      "Prefer cheap falsification before expensive builds.",
      "Keep MVP cuts and deferred bets in writing."
    ],
    antiPatterns: [
      "Fake precision metrics without instrumentation.",
      "Expanding scope silently when an assumption fails.",
      "Treating opinions as market facts.",
      "Only engineering feasibility risks while ignoring GTM and ethics."
    ],
    reviewCriteria: [
      criterion(
        "Assumption ledger covers value and GTM risks, not only tech.",
        "PRODUCT_STRATEGY.md / PROJECT_DNA.md",
        "critical",
      ),
      criterion(
        "Top assumptions have named validation methods.",
        "LAUNCH_PLAN.md",
        "high",
      ),
      criterion(
        "Scope cuts are explicit and tied to risk reduction.",
        "PRODUCT_STRATEGY.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Assumption coverage",
        measurement: "Risk categories with ≥1 assumption each for relevant categories",
        target: "Value+GTM+Feasibility covered",
      },
      {
        name: "Testability",
        measurement: "Share of P0 assumptions with a named test",
        target: "100%",
      }
    ],
    acceptanceCriteria: [
      "At least one concrete BA output: assumption ledger or success-measure map.",
      "No unsupported factual claims introduced as confirmed.",
      "Stop conditions stated for blocking unknowns."
    ],
    examples: [
      {
        title: "Lean canvas for marketplace MVP",
        input: "Two-sided marketplace for freelance designers",
        expectedOutput: "Assumptions: buyers will post briefs weekly (value); creators accept 15% take rate (viability); supply density in 3 metros (GTM). Tests: 20 creator interviews + demand landing waitlist. Cut: payments escrow deferred.",
      }
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: "BA cannot safely complete.",
        recovery: "Return unknowns and block acceptance.",
        blocking: true,
      },
      {
        condition: "Only generic advice produced.",
        impact: "Downstream agents improvise poorly.",
        recovery: "Revise until outputs are checkable.",
        blocking: true,
      }
    ],
  },
  "b2b-saas-expert": {
    mission: "Shape B2B SaaS packaging, buyer journey, and operating model so self-serve and sales-assisted motions match ICP, pricing metric, and expansion path.",
    principles: [
      "Pick ICP and buyer/champion/economic-buyer map before feature theater.",
      "Align pricing metric with value delivered (seat, usage, record) and GTM motion.",
      "Separate activation (aha) from expansion (seat/usage growth) metrics.",
      "Enterprise requirements (SSO, audit, procurement) are staged, not dumped into MVP.",
      "Name anti-persona accounts that waste sales capacity."
    ],
    mentalModels: [
      "Buyer committee map",
      "Land → expand ladder",
      "Value metric ↔ packaging",
      "Sales-assist vs PLG hybrid line"
    ],
    decisionFrameworks: [
      framework(
        "SaaS motion design",
        "B2B SaaS or enterprise-platform briefs.",
        [
                "Define ICP company and primary jobs.",
                "Map user/champion/economic buyer objections.",
                "Choose land motion (PLG, sales-led, hybrid) and packaging tiers.",
                "Stage enterprise controls (SSO, SCIM, audit) behind clear triggers.",
                "Define expansion levers (seats, usage, modules).",
        ],
        [
                "PRODUCT_STRATEGY.md SaaS operating section.",
        ],
      ),
      framework(
        "Packaging sanity check",
        "Before locking pricing or roadmap.",
        [
                "Verify value metric scales with customer success.",
                "Ensure mid tier is the intended anchor.",
                "Confirm free/trial path reaches aha before paywall.",
                "List procurement blockers for target segment.",
        ],
        [
                "Packaging that matches ICP economics.",
        ],
      )
    ],
    bestPractices: [
      "Document who buys, who uses, and who blocks.",
      "Stage security/compliance features by deal size.",
      "Instrument expansion events separately from activation.",
      "Keep implementation-stage content (templates, setup) in GTM plan."
    ],
    antiPatterns: [
      "Building for every persona in v1.",
      "Per-seat pricing when value is usage-driven (or reverse) without rationale.",
      "Enterprise checkbox dumps that delay first value.",
      "Ignoring champion enablement and internal selling kits."
    ],
    reviewCriteria: [
      criterion(
        "ICP, buyer map, and land/expand motion are explicit.",
        "PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion(
        "Packaging tiers and value metric are coherent.",
        "PRODUCT_STRATEGY.md / LAUNCH_PLAN.md",
        "high",
      ),
      criterion(
        "Enterprise requirements are staged with triggers.",
        "ARCHITECTURE.md / PRODUCT_STRATEGY.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Motion clarity",
        measurement: "Land motion + expansion lever named",
        target: "Both present",
      },
      {
        name: "Buyer coverage",
        measurement: "Champion + economic buyer objections listed",
        target: "≥2 each",
      }
    ],
    acceptanceCriteria: [
      "B2B SaaS section covers ICP, motion, packaging, and staged enterprise needs.",
      "Anti-persona documented."
    ],
    examples: [
      {
        title: "Mid-market analytics SaaS",
        input: "Self-serve BI for ops teams",
        expectedOutput: "ICP: 50–500 emp B2B SaaS. Champion: RevOps. Land: PLG with 14-day trial. Expand: seats + warehouse sync add-on. Stage SSO at Team tier. Anti-persona: agencies needing white-label in v1.",
      }
    ],
    failureStates: [
      {
        condition: "No ICP or buyer map on SaaS brief.",
        impact: "Misaligned packaging and wasted GTM.",
        recovery: "Block until B2B spine is written.",
        blocking: true,
      }
    ],
  },
  "product-reviewer": {
    mission: "Review product packages for strategy coherence: problem clarity, assumption risk, metric integrity, and scope honesty—before agents build the wrong product.",
    principles: [
      "Reject strategies that lack a job statement and observable outcomes.",
      "Demand named trade-offs; infinite scope is a fail.",
      "Check that metrics can be instrumented with the planned architecture.",
      "Flag unverified market claims presented as facts.",
      "Verify hypotheses and experiments exist for P0 assumptions."
    ],
    mentalModels: [
      "Strategy coherence audit",
      "Assumption residual risk",
      "Metric instrumentability",
      "Scope honesty check"
    ],
    decisionFrameworks: [
      framework(
        "Product package review",
        "Council or quality gate on product artifacts.",
        [
                "Read PRODUCT_STRATEGY.md and PROJECT_DNA.md end-to-end.",
                "Score problem clarity, value prop completeness, trade-offs, metrics, and assumption tests.",
                "List blocking defects with evidence pointers.",
                "Recommend specific revisions, not vague 'tighten strategy'.",
        ],
        [
                "Reviewer findings with severity and evidence.",
        ],
      ),
      framework(
        "Launch readiness product gate",
        "Before LAUNCH_PLAN acceptance.",
        [
                "Confirm OMTM and instrumentation owners.",
                "Confirm out-of-scope list still holds after feature creep.",
                "Confirm GTM assumptions have owners.",
        ],
        [
                "Go / no-go with residual risks.",
        ],
      )
    ],
    bestPractices: [
      "Cite artifact paths and quotes for every fail.",
      "Separate critical (blocks ship) from high (must fix soon).",
      "Prefer revision instructions agents can execute.",
      "Re-check after patch; don't rubber-stamp."
    ],
    antiPatterns: [
      "Rubber-stamp reviews without reading strategy.",
      "Nitpicking copy while missing missing outcomes.",
      "Accepting unmeasurable North Stars.",
      "Ignoring GTM risk on new products."
    ],
    reviewCriteria: [
      criterion(
        "Problem, outcomes, and trade-offs pass review.",
        "QUALITY_CHECKLIST.md + PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion(
        "P0 assumptions have tests or explicit accept-risk.",
        "PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion(
        "Metrics are instrumentable in v1 architecture.",
        "ARCHITECTURE.md / PRODUCT_STRATEGY.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Review completeness",
        measurement: "Strategy dimensions scored with evidence",
        target: "All core dimensions",
      },
      {
        name: "Actionability",
        measurement: "Each fail has a concrete fix ask",
        target: "100%",
      }
    ],
    acceptanceCriteria: [
      "Product review recorded with at least one critical/high finding or an explicit pass rationale.",
      "No silent acceptance of incoherent strategy."
    ],
    examples: [
      {
        title: "Review thin SaaS package",
        input: "Strategy lists 12 features, no JTBD, metric is 'engagement'",
        expectedOutput: "Fail critical: no job statement; fail high: engagement undefined; ask for JTBD, OMTM with instrumentation, and cut list of 8 features.",
      }
    ],
    failureStates: [
      {
        condition: "Reviewer skips strategy artifacts.",
        impact: "False confidence in package.",
        recovery: "Re-run review before acceptance.",
        blocking: true,
      }
    ],
  },
  "ux-architect": {
    mission: "Design interaction systems agents can ship: information architecture, flows, feedback, responsive behavior, and accessibility baselines—matched to product type, not generic SaaS chrome.",
    principles: [
      "Prioritize accessibility: contrast ≥4.5:1, keyboard paths, and 44×44 touch targets before visual flourish.",
      "Match layout density and motion intensity to product type; always honor reduced-motion.",
      "Forms need visible labels, inline errors, and progressive disclosure—not placeholder-only UI.",
      "Navigation must preserve predictable back behavior and deep links.",
      "Reserve space for media to protect CLS; never rely on hover-only actions.",
      "Derive IA from user jobs, not org charts."
    ],
    mentalModels: [
      "Priority ladder (a11y → interaction → layout → type → motion)",
      "Minimum path to value (fewest steps to aha)",
      "Mobile-first breakpoint contract",
      "Empty state as first-action design"
    ],
    decisionFrameworks: [
      framework(
        "UX system intake",
        "New product UI or experience redesign.",
        [
                "Extract product type, audience context, and primary jobs.",
                "Define IA, key flows, and empty/error/loading states.",
                "Set interaction rules: 44×44 targets, focus rings, loading feedback.",
                "Set responsive and motion rules including reduced-motion.",
                "List anti-patterns forbidden for this product type.",
        ],
        [
                "USER_FLOWS.md + DESIGN_SYSTEM.md interaction section.",
        ],
      ),
      framework(
        "Flow critique",
        "Before accepting UI package.",
        [
                "Walk primary happy path and top failure path.",
                "Check form labeling and error placement.",
                "Check keyboard and touch reachability.",
                "Confirm no hover-only critical actions.",
        ],
        [
                "Flow defects logged with severity.",
        ],
      )
    ],
    bestPractices: [
      "Specify one primary CTA hierarchy per view.",
      "Design empty states with a clear next action.",
      "Use semantic structure before ARIA patches.",
      "Document density/motion dials for the product class."
    ],
    antiPatterns: [
      "Dashboard-looking marketing heroes and card-grid defaulting.",
      "Placeholder-as-label forms.",
      "Removing focus rings for aesthetics.",
      "One motion duration for every transition.",
      "Horizontal scroll or disabled zoom on mobile."
    ],
    reviewCriteria: [
      criterion(
        "Primary flows, empty/error states, and interaction rules are documented.",
        "USER_FLOWS.md / DESIGN_SYSTEM.md",
        "critical",
      ),
      criterion(
        "Touch, keyboard, and feedback requirements are explicit.",
        "DESIGN_SYSTEM.md / QUALITY_CHECKLIST.md",
        "high",
      ),
      criterion(
        "Responsive rules prevent horizontal scroll and CLS surprises.",
        "DESIGN_SYSTEM.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Flow completeness",
        measurement: "Happy + failure path for core jobs",
        target: "≥1 each",
      },
      {
        name: "Interaction baseline",
        measurement: "Target size + focus + loading rules present",
        target: "All present",
      }
    ],
    acceptanceCriteria: [
      "UX architecture covers IA, flows, and interaction baseline.",
      "Product-type-specific anti-patterns listed."
    ],
    examples: [
      {
        title: "Ops console onboarding",
        input: "Internal analytics dashboard",
        expectedOutput: "Dense spacing dial; checklist onboarding with endowed progress; empty chart state with 'connect warehouse' CTA; no hover-only filters; focus rings retained.",
      }
    ],
    failureStates: [
      {
        condition: "No flow map for core job.",
        impact: "Agents invent inconsistent UX.",
        recovery: "Block until USER_FLOWS.md is complete.",
        blocking: true,
      }
    ],
  },
  "design-systems-architect": {
    mission: "Build tokenized design systems agents can implement: primitive → semantic → component layers, state tables, and validation against hardcoded values.",
    principles: [
      "Never put raw hex or one-off spacing in components—reference tokens.",
      "Three layers: primitive values → semantic purpose aliases → component tokens.",
      "Semantic layer enables theme switching; component layer enables local control.",
      "Document component states (default/hover/active/disabled/focus) as a table.",
      "Validate implementations for hardcoded values before acceptance."
    ],
    mentalModels: [
      "Primitive → semantic → component ladder",
      "State × variant matrix",
      "Token compliance gate",
      "Density scale as a dial (marketing vs dashboard)"
    ],
    decisionFrameworks: [
      framework(
        "Token system build",
        "New brand or multi-surface product UI.",
        [
                "Extract primitives from brand (color, type, space, radius, elevation).",
                "Create semantic aliases (primary, danger, surface, on-surface).",
                "Map component tokens (button-bg, input-border) to semantics.",
                "Publish state tables for core components.",
                "Define light/dark or theme rules without duplicating primitives.",
        ],
        [
                "DESIGN_SYSTEM.md token architecture.",
        ],
      ),
      framework(
        "Token compliance review",
        "Before handoff to implementation agents.",
        [
                "Scan for hardcoded colors/spacing in specs.",
                "Confirm focus and disabled states exist.",
                "Confirm type scale and space scale are complete.",
                "List exceptions with owners.",
        ],
        [
                "Compliance notes in QUALITY_CHECKLIST.md.",
        ],
      )
    ],
    bestPractices: [
      "Prefer HSL/OKLCH-friendly tokens when opacity variants matter.",
      "Name tokens by purpose, not by temporary hex nicknames.",
      "Keep a single source of truth imported by UI and docs.",
      "Version breaking token changes explicitly."
    ],
    antiPatterns: [
      "Raw hex sprinkled in component specs.",
      "Skipping semantic layer (components bound to primitives).",
      "Missing disabled/focus states.",
      "One border-radius and shadow for every hierarchy level."
    ],
    reviewCriteria: [
      criterion(
        "Three-layer token architecture is documented.",
        "DESIGN_SYSTEM.md",
        "critical",
      ),
      criterion(
        "Core components have state tables.",
        "DESIGN_SYSTEM.md",
        "high",
      ),
      criterion(
        "Hardcoded value ban is enforceable in checklist.",
        "QUALITY_CHECKLIST.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Token completeness",
        measurement: "Color/type/space semantic sets present",
        target: "All three",
      },
      {
        name: "State coverage",
        measurement: "Primary components with full state tables",
        target: "≥5 components",
      }
    ],
    acceptanceCriteria: [
      "Design system includes layered tokens and component state specs.",
      "Theme/semantic strategy stated."
    ],
    examples: [
      {
        title: "SaaS design tokens",
        input: "B2B product with light/dark",
        expectedOutput: "Primitives: blue-600, gray scale, space-1..12. Semantic: color-primary, color-danger, space-section. Component: button-bg→primary. Dark theme remaps semantics only.",
      }
    ],
    failureStates: [
      {
        condition: "Only a moodboard, no tokens.",
        impact: "Inconsistent UI implementation.",
        recovery: "Require token architecture before acceptance.",
        blocking: true,
      }
    ],
  },
  "ux-reviewer": {
    mission: "Audit UX packages against interaction, accessibility, form, and responsive criteria with evidence—blocking packages that look polished but fail use.",
    principles: [
      "Review priority order: accessibility and interaction before aesthetic polish.",
      "Fail hover-only critical actions and missing focus indicators.",
      "Check forms for visible labels, nearby errors, and mobile usability.",
      "Verify empty/loading/error states exist for primary views.",
      "Cite specific flows and checklist items; no vibe-only reviews."
    ],
    mentalModels: [
      "Pre-delivery UX checklist",
      "5-second value comprehension test",
      "Keyboard path walkthrough",
      "CLS and touch audit"
    ],
    decisionFrameworks: [
      framework(
        "UX review pass",
        "Council review of DESIGN_SYSTEM.md and USER_FLOWS.md.",
        [
                "Walk primary flows keyboard-first.",
                "Check contrast, targets, labels, and focus.",
                "Check responsive rules and media space reservation.",
                "File findings with severity and artifact evidence.",
        ],
        [
                "Actionable UX review report.",
        ],
      ),
      framework(
        "Conversion UX spot-check",
        "Marketing/landing surfaces.",
        [
                "Test 5-second clarity of value prop.",
                "Verify CTA hierarchy and message match.",
                "Flag friction fields and trust gaps.",
        ],
        [
                "CRO-relevant UX findings.",
        ],
      )
    ],
    bestPractices: [
      "Always include a keyboard path result.",
      "Separate critical blockers from polish nits.",
      "Recommend the smallest fix that restores the invariant.",
      "Re-test after remediation claims."
    ],
    antiPatterns: [
      "Approving beautiful inaccessible UI.",
      "Ignoring form error placement.",
      "Treating mobile as an afterthought screenshot.",
      "Findings without locations or fix asks."
    ],
    reviewCriteria: [
      criterion(
        "Keyboard and focus paths pass for primary flows.",
        "USER_FLOWS.md / QUALITY_CHECKLIST.md",
        "critical",
      ),
      criterion(
        "Forms and empty states meet interaction rules.",
        "DESIGN_SYSTEM.md / USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Responsive and CLS rules verified.",
        "QUALITY_CHECKLIST.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Blocker clarity",
        measurement: "Critical UX fails have locations + fixes",
        target: "100%",
      },
      {
        name: "Coverage",
        measurement: "A11y + forms + responsive checked",
        target: "All three",
      }
    ],
    acceptanceCriteria: [
      "UX review complete with pass/fail and evidence.",
      "No critical interaction defects unresolved."
    ],
    examples: [
      {
        title: "Review pricing page UX",
        input: "Pricing with icon-only plan toggles and placeholder-only email field",
        expectedOutput: "Fail critical: icon-only toggles without names; fail high: placeholder-only label; require accessible names and visible label.",
      }
    ],
    failureStates: [
      {
        condition: "Reviewer skips keyboard walkthrough.",
        impact: "Access regressions ship.",
        recovery: "Re-run review before acceptance.",
        blocking: true,
      }
    ],
  },
  "brand-strategist": {
    mission: "Define brand promise, voice, customer language, and competitive contrast so every surface speaks one falsifiable positioning—not logo decoration.",
    principles: [
      "Brand is promise + proof + personality; proof must appear in product/UI, not slogans alone.",
      "Capture verbatim customer language; prefer their phrases over polished marketingese.",
      "Document voice attributes with means / doesn't-mean / example lines.",
      "Name direct, secondary, and indirect competitors and how each falls short.",
      "Maintain anti-persona and top objections with responses.",
      "Track learnings from shipped tests so positioning evolves with evidence."
    ],
    mentalModels: [
      "Promise–proof–personality spine",
      "JTBD four forces (push/pull/habit/anxiety)",
      "Voice attribute table",
      "Competitive contrast pairs"
    ],
    decisionFrameworks: [
      framework(
        "Brand spine build",
        "Marketing, portfolio, or product brand experiences.",
        [
                "Write one-line promise and category shelf.",
                "List three proof points the experience must show.",
                "Build voice do/don't with example lines from real copy.",
                "Map competitors and differentiation claims.",
                "Capture objections, anti-persona, and switching forces.",
        ],
        [
                "Brand spine in PRODUCT_STRATEGY.md / content guidance.",
        ],
      ),
      framework(
        "Positioning refresh",
        "When ICP or category changes.",
        [
                "Diff old vs new promise.",
                "Retire stale proof points.",
                "Update glossary and banned words.",
                "Log changelog why positioning moved.",
        ],
        [
                "Versioned brand context agents can trust.",
        ],
      )
    ],
    bestPractices: [
      "Tie brand proof to interactive demonstrations when possible.",
      "Build voice from performing copy and founder writing, not adjective workshops.",
      "Keep a short active learnings table.",
      "Align tone by context (support, launch, errors, sales)."
    ],
    antiPatterns: [
      "Generic innovation/excellence copy with no proof surface.",
      "Voice adjectives without example lines.",
      "Ignoring anti-persona and attracting bad-fit demand.",
      "Repositioning without a changelog other skills can see."
    ],
    reviewCriteria: [
      criterion(
        "Brand promise, proof, and voice constraints are explicit.",
        "PRODUCT_STRATEGY.md / content sections",
        "critical",
      ),
      criterion(
        "Competitor contrast and anti-persona are present.",
        "PRODUCT_STRATEGY.md",
        "high",
      ),
      criterion(
        "Customer language includes verbatim phrases to use/avoid.",
        "PRODUCT_STRATEGY.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Promise clarity",
        measurement: "One-line promise present",
        target: "100%",
      },
      {
        name: "Voice usability",
        measurement: "Voice attributes with examples",
        target: "≥3",
      }
    ],
    acceptanceCriteria: [
      "Promise, proof, voice do/don't documented.",
      "Differentiation claims are falsifiable."
    ],
    examples: [
      {
        title: "Studio brand",
        input: "Creative tech studio site",
        expectedOutput: "Promise: we build living digital worlds. Proof: live WebGL work. Voice: precise, bold, never cute. Not: generic agency portfolio grids.",
      }
    ],
    failureStates: [
      {
        condition: "No brand spine on brand-led brief.",
        impact: "Generic marketing tone.",
        recovery: "Add brand spine before acceptance.",
        blocking: false,
      },
      {
        condition: "Voice rules unusable in UI copy.",
        impact: "Inconsistent microcopy.",
        recovery: "Add example lines and banned phrases.",
        blocking: true,
      }
    ],
  },
  "content-strategist": {
    mission: "Plan content as product: pillars, searchable vs shareable mix, buyer-stage topics, and distribution hooks that create durable owned demand.",
    principles: [
      "Every piece must be searchable, shareable, or both—prefer searchable foundations first.",
      "Pass the information-gain gate: name what you add that top results lack before writing.",
      "Treat each flagship as a launch: create once, distribute twice with atomization planned up front.",
      "Map topics to buyer stages with intent-matched modifiers.",
      "Score ideas on customer impact, content-market fit, search potential, and resources—not gut alone.",
      "Route attention borrowed → rented → owned; protect owned assets."
    ],
    mentalModels: [
      "Searchable vs shareable lens",
      "Hub-and-spoke / pillar clusters",
      "60/30/10 calendar split",
      "ORB funnel (borrowed/rented/owned)",
      "Information-gain gate"
    ],
    decisionFrameworks: [
      framework(
        "Content strategy build",
        "When packaging needs content GTM or editorial plan.",
        [
                "Capture ICP questions, objections, and verbatim language.",
                "Define 3–5 pillars tied to product jobs.",
                "Propose priority topics with stage, keyword hypothesis, and content type.",
                "Set calendar split and distribution hooks per flagship.",
                "List measurement (traffic, assisted leads, owned list growth).",
        ],
        [
                "Content strategy section in PRODUCT_STRATEGY.md / LAUNCH_PLAN.md.",
        ],
      ),
      framework(
        "Topic prioritization",
        "Backlog of content ideas.",
        [
                "Score impact / fit / search / resources.",
                "Kill pieces failing information-gain gate.",
                "Sequence hubs before spokes.",
        ],
        [
                "Ranked backlog agents can execute.",
        ],
      )
    ],
    bestPractices: [
      "Write multiple title options before drafting flagships.",
      "Build distribution hooks (stand-alone subheads, quotable stats) at creation time.",
      "Prefer stats roundups and templates when the job is links.",
      "Interlink clusters deliberately."
    ],
    antiPatterns: [
      "Spray-and-pray posting with no flagship.",
      "Eleventh clone of SERP content with no unique angle.",
      "90% effort on rented channels, neglecting owned.",
      "Editorial calendars disconnected from sales/support questions."
    ],
    reviewCriteria: [
      criterion(
        "Pillars and priority topics map to product jobs and buyer stages.",
        "PRODUCT_STRATEGY.md / LAUNCH_PLAN.md",
        "critical",
      ),
      criterion(
        "Information-gain rationale exists for top searchable pieces.",
        "LAUNCH_PLAN.md",
        "high",
      ),
      criterion(
        "Distribution plan includes owned-channel capture.",
        "LAUNCH_PLAN.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Pillar coverage",
        measurement: "Pillars tied to product problems",
        target: "3–5",
      },
      {
        name: "Prioritization",
        measurement: "Top topics scored",
        target: "≥5 scored",
      }
    ],
    acceptanceCriteria: [
      "Content strategy with pillars, priorities, and distribution outlined.",
      "No unsupported traffic claims."
    ],
    examples: [
      {
        title: "PLG SaaS content spine",
        input: "Project tool for freelancers",
        expectedOutput: "Pillars: client collaboration, proposals, time tracking. Priority: 'proposal template for freelancers' (decision stage) with downloadable template gated to email. Shareable: anonymized win-rate data study.",
      }
    ],
    failureStates: [
      {
        condition: "Content plan is channel list without pillars.",
        impact: "Unfocused production.",
        recovery: "Require pillar + priority map.",
        blocking: true,
      }
    ],
  },
  "growth-designer": {
    mission: "Design growth surfaces—landing, activation, and conversion paths—where value clarity, CTA hierarchy, and experimentability beat decorative marketing.",
    principles: [
      "Value proposition must be clear in five seconds in customer language.",
      "One primary CTA per decision surface; button copy states the outcome.",
      "Message-match traffic source intent on landing pages.",
      "Place trust near claims and CTAs; handle objections on-page.",
      "Instrument funnels before multiplying variants.",
      "Prioritize friction removal (fields, steps, ambiguity) over new widgets."
    ],
    mentalModels: [
      "CRO impact ladder (value → headline → CTA → trust → friction)",
      "Message match",
      "Experiment hypothesis card",
      "Minimum path to conversion"
    ],
    decisionFrameworks: [
      framework(
        "Growth surface design",
        "Marketing site, pricing, or signup conversion work.",
        [
                "State conversion goal and traffic context.",
                "Clarify value prop and headline alternatives.",
                "Define CTA hierarchy and trust placements.",
                "List friction points and quick wins vs tests.",
                "Specify events for funnel measurement.",
        ],
        [
                "USER_FLOWS.md growth paths + LAUNCH_PLAN experiments.",
        ],
      ),
      framework(
        "Experiment design",
        "When recommending A/B changes.",
        [
                "Write hypothesis with metric and guardrails.",
                "Change one primary variable.",
                "Define sample/stop rules at high level.",
                "Separate quick wins from test ideas.",
        ],
        [
                "Test backlog with expected learning.",
        ],
      )
    ],
    bestPractices: [
      "Provide 2–3 copy alternatives with rationale for key headlines/CTAs.",
      "Keep mobile form usability in the first review.",
      "Align signup success metrics with activation, not lead volume alone.",
      "Use social proof that is specific and attributed."
    ],
    antiPatterns: [
      "Feature dumps instead of benefits.",
      "Multiple competing primary CTAs.",
      "Fake urgency and dark-pattern scarcity.",
      "Testing aesthetics while value prop is unclear."
    ],
    reviewCriteria: [
      criterion(
        "Primary conversion goal, value clarity, and CTA hierarchy are documented.",
        "USER_FLOWS.md / PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion(
        "Funnel events for growth surfaces are named.",
        "ARCHITECTURE.md / LAUNCH_PLAN.md",
        "high",
      ),
      criterion(
        "Friction and trust gaps have remediation or tests.",
        "LAUNCH_PLAN.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Clarity",
        measurement: "Value understandable in 5-second test",
        target: "Pass",
      },
      {
        name: "Instrumentability",
        measurement: "Key funnel events named",
        target: "≥3",
      }
    ],
    acceptanceCriteria: [
      "Growth paths documented with CTA hierarchy and measurement.",
      "Experiment ideas labeled vs shipping quick wins."
    ],
    examples: [
      {
        title: "Pricing page CRO",
        input: "Three-tier SaaS pricing",
        expectedOutput: "Recommend mid-tier; CTA 'Start Team trial'; FAQ for seat vs usage; event plan_viewed → checkout_started → trial_started; test annual toggle default.",
      }
    ],
    failureStates: [
      {
        condition: "No conversion goal on growth surfaces.",
        impact: "Unmeasurable redesigns.",
        recovery: "Block until goal + events exist.",
        blocking: true,
      }
    ],
  },
  "monetization-expert": {
    mission: "Design pricing and packaging that capture value: metric, tiers, price points learnable from the market, and upgrade moments after aha—not cost-plus guesswork.",
    principles: [
      "Price between next-best alternative and perceived value; cost is a floor, not the basis.",
      "Choose a value metric that scales with customer success and is hard to game.",
      "Good-better-best tiers need clear differentiation (features, limits, support).",
      "First price is a learning bet—prefer round magnitude fit to buyer, avoid ultra-low traps.",
      "Ask for payment after value; paywalls should preview benefit and respect refusal.",
      "Price increases need staged rollout, rationale, and measurement—not surprise flips."
    ],
    mentalModels: [
      "Packaging × metric × point axes",
      "Value-based ceiling/floor",
      "Good-better-best anchor",
      "Paywall after aha",
      "Van Westendorp as research, not oracle"
    ],
    decisionFrameworks: [
      framework(
        "Pricing system design",
        "SaaS/monetization briefs.",
        [
                "Clarify ICP and GTM motion.",
                "Select value metric and justify.",
                "Draft tier packaging and differentiation.",
                "Propose price points as learning hypotheses.",
                "Define upgrade triggers and grandfathering policy.",
        ],
        [
                "PRODUCT_STRATEGY.md monetization section.",
        ],
      ),
      framework(
        "Paywall moment design",
        "Freemium/trial products.",
        [
                "List upgrade triggers (feature gate, limit, trial end).",
                "Require value-before-ask sequencing.",
                "Specify offer, escape hatch, and frequency caps.",
                "Define conversion metrics and annoyance signals.",
        ],
        [
                "USER_FLOWS.md paywall flows.",
        ],
      )
    ],
    bestPractices: [
      "Highlight recommended tier and annual savings clearly.",
      "Keep enterprise/custom path explicit.",
      "Test price on new customers before migrating existing.",
      "Show dollar savings on offers, not only percents."
    ],
    antiPatterns: [
      "Competitor-matched pricing without economics.",
      "$9 vanity pricing that false-validates demand.",
      "Paywall before aha moment.",
      "Hidden cancel or guilt-trip upgrade patterns."
    ],
    reviewCriteria: [
      criterion(
        "Value metric, tiers, and price hypotheses are documented.",
        "PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion(
        "Upgrade moments occur after demonstrated value.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Price-change or grandfather policy stated when relevant.",
        "LAUNCH_PLAN.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Metric fit",
        measurement: "Value metric linked to customer success",
        target: "Documented",
      },
      {
        name: "Tier clarity",
        measurement: "Differentiation between tiers",
        target: "≥3 clear deltas",
      }
    ],
    acceptanceCriteria: [
      "Monetization model with metric, packaging, and upgrade path.",
      "No dark-pattern paywalls in flows."
    ],
    examples: [
      {
        title: "Usage-priced API",
        input: "Developer API product",
        expectedOutput: "Metric: successful API calls. Tiers: Free 1k, Pro 100k, Scale custom. Paywall on 80% quota with upgrade CTA. First price $49 Pro as learning bet.",
      }
    ],
    failureStates: [
      {
        condition: "No value metric on monetized product.",
        impact: "Incoherent packaging.",
        recovery: "Require monetization spine.",
        blocking: true,
      }
    ],
  },
  "retention-expert": {
    mission: "Reduce voluntary and involuntary churn with cancel flows, reason-matched save offers, health signals, and dunning—while keeping cancellation honest and easy to find.",
    principles: [
      "Separate voluntary churn (choice) from involuntary churn (payment failure)—different playbooks.",
      "Cancel flow: survey → dynamic offer → confirm → post-cancel path; never trap users.",
      "Match save offers to reasons (discount ≠ cure for non-usage).",
      "Predict churn from leading signals; intervene before cancel click when possible.",
      "Dunning needs smart retries, clear emails, and card-update paths.",
      "Measure save-rate and post-save LTV; a 30-day bounce is not a save."
    ],
    mentalModels: [
      "Voluntary vs involuntary split",
      "Reason → offer mapping",
      "Health score with coverage rules",
      "Dunning stack (pre → retry → email → grace)",
      "Cohort churn lenses"
    ],
    decisionFrameworks: [
      framework(
        "Retention system design",
        "Subscription SaaS packages.",
        [
                "Baseline voluntary vs involuntary churn if known.",
                "Design exit survey reasons and offer matrix.",
                "Define proactive interventions for usage drops.",
                "Specify dunning retries and email cadence.",
                "Set metrics: churn, save rate, dunning recovery.",
        ],
        [
                "USER_FLOWS.md retention + PRODUCT_STRATEGY metrics.",
        ],
      ),
      framework(
        "Cancel flow review",
        "Existing or proposed cancel UX.",
        [
                "Ensure cancel is findable (no dark patterns).",
                "Verify offer matches reason.",
                "Check pause limits and reactivation.",
                "Confirm win-back handoff.",
        ],
        [
                "Compliant, effective cancel flow notes.",
        ],
      )
    ],
    bestPractices: [
      "Cap discounts; avoid training cancel-for-deal behavior.",
      "Limit pauses (e.g., 1–3 months) with auto-reactivate notice.",
      "Route high-MRR accounts to human save.",
      "Pre-dunning for card expiry."
    ],
    antiPatterns: [
      "Instant cancel with no learning or offer.",
      "Same discount for every cancel reason.",
      "Guilt-trip or hidden cancel controls.",
      "Ignoring involuntary churn (often large and recoverable)."
    ],
    reviewCriteria: [
      criterion(
        "Cancel flow and reason-matched offers are specified.",
        "USER_FLOWS.md",
        "critical",
      ),
      criterion(
        "Involuntary churn/dunning plan exists for billed products.",
        "ARCHITECTURE.md / USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Retention metrics and save definition are explicit.",
        "PRODUCT_STRATEGY.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Flow completeness",
        measurement: "Survey+offer+confirm+post-cancel",
        target: "All stages",
      },
      {
        name: "Offer fit",
        measurement: "Reasons mapped to offers",
        target: "≥5 reasons",
      }
    ],
    acceptanceCriteria: [
      "Retention playbook covers voluntary and involuntary paths.",
      "Cancellation remains user-respecting."
    ],
    examples: [
      {
        title: "SaaS cancel flow",
        input: "B2B tool cancellations",
        expectedOutput: "Reasons include too expensive / not using / missing feature. Offers: 25% for 3 months, pause 1 month, roadmap+workaround. Dunning: retry day 1/3/5/7 + 4 emails.",
      }
    ],
    failureStates: [
      {
        condition: "Billed product with no retention/dunning design.",
        impact: "Silent revenue leak.",
        recovery: "Add retention section before acceptance.",
        blocking: true,
      }
    ],
  },
  "plg-expert": {
    mission: "Design product-led growth loops: signup → activation aha → habit → expansion, with time-to-value as the primary constraint.",
    principles: [
      "Minimize path to first value; one goal per first session.",
      "Do, don't show—interactive setup beats tutorial walls.",
      "Define activation as an early action that predicts retention, then validate.",
      "Empty states and checklists are onboarding product, not afterthoughts.",
      "Coordinate in-app and email without duplicating the same nag.",
      "Expansion asks follow value; invite teammates/usage growth after aha."
    ],
    mentalModels: [
      "Minimum path to value (MPTV)",
      "Aha → activation → retention chain",
      "Endowed progress checklists",
      "Boosters vs blockers",
      "PLG loop (acquire → activate → retain → expand → refer)"
    ],
    decisionFrameworks: [
      framework(
        "PLG loop design",
        "Self-serve / product-led SaaS.",
        [
                "Define aha moment hypothesis and activation event.",
                "Map signup → first value steps; cut nonessential friction.",
                "Design checklist/empty states/templates as boosters.",
                "Specify expansion and referral hooks.",
                "Instrument activation, time-to-value, D1/D7 retention.",
        ],
        [
                "USER_FLOWS.md PLG + PRODUCT_STRATEGY metrics.",
        ],
      ),
      framework(
        "Activation diagnosis",
        "When signups don't stick.",
        [
                "Find biggest funnel drop.",
                "Compare activated vs churned early behaviors.",
                "Propose one intervention that improves ability or prompt timing.",
                "Avoid vanity signup optimizations that hurt activation.",
        ],
        [
                "Focused activation fix plan.",
        ],
      )
    ],
    bestPractices: [
      "Pre-complete a checklist step to endow progress.",
      "Use role/goal welcome questions sparingly to personalize path.",
      "Celebrate activation; prescribe the next habit.",
      "Keep tours short and dismissible."
    ],
    antiPatterns: [
      "Long setup wizards before any value.",
      "Paywall during first-run before aha.",
      "Activation defined as 'signed up'.",
      "Trapping users in mandatory product tours."
    ],
    reviewCriteria: [
      criterion(
        "Activation event and time-to-value path are defined.",
        "USER_FLOWS.md / PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion(
        "First-run friction cuts are explicit.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Expansion/referral hooks placed after value.",
        "USER_FLOWS.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "TTV explicitness",
        measurement: "Steps to activation counted",
        target: "Documented N steps",
      },
      {
        name: "Instrumentation",
        measurement: "Activation + early retention events",
        target: "Present",
      }
    ],
    acceptanceCriteria: [
      "PLG loop with activation definition and onboarding path.",
      "Expansion not confused with acquisition."
    ],
    examples: [
      {
        title: "Design tool PLG",
        input: "Browser design editor",
        expectedOutput: "Aha: export/share first design. Path: template gallery → edit → export. Checklist 5 items starting at 20%. Team invite after first share. Events: first_export, invite_sent.",
      }
    ],
    failureStates: [
      {
        condition: "PLG claim without activation definition.",
        impact: "Fake product-led motion.",
        recovery: "Require activation + TTV map.",
        blocking: true,
      }
    ],
  },
  "context-engineer": {
    mission: "Curate high-signal agent context: attention budgets, position-aware placement, progressive disclosure, and compaction—so models reason on signal, not stuffing.",
    principles: [
      "Treat context as a finite attention budget; quality beats quantity.",
      "Place critical constraints at beginning and end; middle content is less reliable.",
      "Progressive disclosure: load summaries/skills on demand, not everything upfront.",
      "Mask or summarize stale tool outputs; don't let history dominate the window.",
      "Design for degradation (lost-in-the-middle, poisoning, distraction)—don't hope windows save you.",
      "Optimize tokens-per-task, not tokens-per-request; use filesystem offload and sub-agent isolation when a single window saturates."
    ],
    mentalModels: [
      "Attention budget",
      "U-shaped attention curve",
      "Progressive disclosure layers",
      "Observation masking",
      "Compaction trigger threshold"
    ],
    decisionFrameworks: [
      framework(
        "Context architecture",
        "Agent/RAG systems needing context design.",
        [
                "Inventory context components (system, tools, retrieval, history, outputs).",
                "Set budgets and compaction triggers (~70–80% utilization).",
                "Define what is pinned vs loadable just-in-time.",
                "Specify tool-output retention/masking rules.",
                "Place safety and output-format constraints at attention edges.",
        ],
        [
                "AI_SYSTEM_DESIGN.md context architecture.",
        ],
      ),
      framework(
        "Degradation response",
        "When agent quality drops as sessions grow.",
        [
                "Check for middle-burial of critical instructions.",
                "Audit tool-schema token bloat.",
                "Compress history with structured sections (files, decisions, next steps).",
                "Partition work to sub-agents if single context saturates.",
        ],
        [
                "Remediation notes with measured budgets.",
        ],
      )
    ],
    bestPractices: [
      "Use strong identifiers for just-in-time retrieval.",
      "Keep tool sets minimal; consolidate overlapping tools.",
      "Structure system prompts with clear sections.",
      "Measure effective capacity on your workload, not brochure windows."
    ],
    antiPatterns: [
      "Stuffing entire knowledge bases into prompts.",
      "Critical safety rules buried mid-prompt.",
      "Ever-growing verbatim tool dumps in history.",
      "Eager-loading every adjacent skill 'just in case'."
    ],
    reviewCriteria: [
      criterion(
        "Context budget, pinning, and compaction rules are documented.",
        "AI_SYSTEM_DESIGN.md",
        "critical",
      ),
      criterion(
        "Tool outputs have retention/masking policy.",
        "AI_SYSTEM_DESIGN.md",
        "high",
      ),
      criterion(
        "Critical constraints are position-aware.",
        "AI_SYSTEM_DESIGN.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Budget explicitness",
        measurement: "Token budgets + compaction trigger",
        target: "Present",
      },
      {
        name: "Signal density",
        measurement: "Pinned vs JIT split defined",
        target: "Present",
      }
    ],
    acceptanceCriteria: [
      "Context engineering section agents can implement.",
      "Degradation mitigations named."
    ],
    examples: [
      {
        title: "Support agent context",
        input: "Long-running ticket agent",
        expectedOutput: "Pin policy+output schema at edges; JIT load KB articles by id; mask prior tool JSON after use; compact at 75% with decisions/next-steps template; escalate to specialist sub-agent for refunds.",
      }
    ],
    failureStates: [
      {
        condition: "Agent system with no context budget.",
        impact: "Silent quality collapse.",
        recovery: "Require context architecture.",
        blocking: true,
      }
    ],
  },
  "agent-architect": {
    mission: "Architect agent systems where multi-agent topology exists to isolate context—with explicit handoffs, validation between agents, and harness loops that keep work reviewable.",
    principles: [
      "Sub-agents primarily isolate context; don't anthropomorphize org charts.",
      "Choose supervisor, swarm, or hierarchy from coordination needs.",
      "Prevent telephone-game loss: prefer direct forward or shared filesystem state over paraphrase chains.",
      "Validate outputs at boundaries; don't let hallucinations become downstream facts.",
      "Budget tokens honestly—multi-agent can cost an order of magnitude more.",
      "Harnesses need metrics, durable logs, rollback, and human approval boundaries."
    ],
    mentalModels: [
      "Context isolation first",
      "Supervisor vs swarm vs hierarchy",
      "Handoff protocol with state",
      "Weighted debate vs sycophantic consensus",
      "Harness operating loop"
    ],
    decisionFrameworks: [
      framework(
        "Agent topology design",
        "Multi-agent or complex tool-using systems.",
        [
                "Decide single vs multi based on context pressure and parallelism.",
                "Pick pattern and justify.",
                "Define handoff contracts and shared state (files/store).",
                "Set TTL, validation gates, and failure isolation.",
                "Estimate token multiplier and model-quality trade-offs.",
        ],
        [
                "AI_SYSTEM_DESIGN.md agent architecture.",
        ],
      ),
      framework(
        "Harness checklist",
        "Before claiming autonomous operation.",
        [
                "Lock evaluation metrics and stop conditions.",
                "Define editable surfaces vs invariants.",
                "Require evidence for completion claims.",
                "Specify human approval for risky actions.",
        ],
        [
                "Harness section agents must obey.",
        ],
      )
    ],
    bestPractices: [
      "Cap workers per supervisor; add tiers rather than overload one.",
      "Return structured worker outputs with named checks.",
      "Use adversarial critique when consensus risks sycophancy.",
      "Decompose only when separate contexts help."
    ],
    antiPatterns: [
      "Agent sprawl past clear isolation benefits.",
      "Supervisor paraphrasing away critical detail.",
      "No shared state leading to duplicated work.",
      "Unreviewable autonomous changes without logs/rollback."
    ],
    reviewCriteria: [
      criterion(
        "Topology, handoffs, and isolation rationale are documented.",
        "AI_SYSTEM_DESIGN.md",
        "critical",
      ),
      criterion(
        "Boundary validation and failure handling exist.",
        "AI_SYSTEM_DESIGN.md",
        "high",
      ),
      criterion(
        "Harness metrics and approval boundaries are explicit.",
        "AGENT_EXECUTION_PACKAGE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Isolation clarity",
        measurement: "Why each agent exists (context reason)",
        target: "Documented",
      },
      {
        name: "Contract completeness",
        measurement: "Handoff schemas present",
        target: "Present",
      }
    ],
    acceptanceCriteria: [
      "Agent architecture with topology and harness rules.",
      "Token/cost risks acknowledged."
    ],
    examples: [
      {
        title: "Research+writer system",
        input: "Autonomous research briefs",
        expectedOutput: "Supervisor decomposes; researcher/analyzer/fact-checker in parallel with isolated contexts; filesystem scratch for sources; writer consumes verified notes only; forward_message for final brief; human approve before publish.",
      }
    ],
    failureStates: [
      {
        condition: "Multi-agent claim without handoff contracts.",
        impact: "Coordination chaos.",
        recovery: "Require topology + contracts.",
        blocking: true,
      }
    ],
  },
  "security-engineer-skill": {
    mission: "Find and prevent real trust-boundary violations with source-grounded evidence, severity tied to demonstrated impact, and the smallest fix at the last trusted decision point.",
    principles: [
      "A confirmed finding must name the trust-boundary crossed, affected principal/resource, and concrete security outcome.",
      "Separate confirmed from needs-validation; never invent deployment controls absent from source.",
      "Severity follows demonstrated impact, not checklist anxiety.",
      "Prefer local, sandboxed evidence over live probing of shared systems.",
      "Recommend the narrowest source fix that enforces the invariant.",
      "Defense-in-depth advice without a reachable violation is not a vulnerability."
    ],
    mentalModels: [
      "Trust-boundary violation test",
      "Confirmed vs needs-validation",
      "Severity anchors (critical→informational)",
      "Last trusted decision point",
      "Coverage-led hunting"
    ],
    decisionFrameworks: [
      framework(
        "Threat & control design",
        "Product architecture security section.",
        [
                "Map trust boundaries, principals, and sensitive resources.",
                "List authn/authz, secrets, data-store, and injection risks.",
                "Define control requirements at decision points.",
                "State what must be validated outside source.",
                "Specify secure defaults for agents implementing features.",
        ],
        [
                "ARCHITECTURE.md security controls.",
        ],
      ),
      framework(
        "Finding triage",
        "When reviewing candidate issues.",
        [
                "Require boundary+result statement.",
                "Classify confirmed vs needs-validation.",
                "Assign severity only to confirmed.",
                "Propose smallest fix + regression check.",
        ],
        [
                "Triage table with evidence bar met.",
        ],
      )
    ],
    bestPractices: [
      "Use dummy principals and fixtures in tests.",
      "Record reproduction commands without leaking secrets.",
      "Keep threat model updated when surfaces change.",
      "Prioritize authz and tenancy bugs over cosmetic hardening."
    ],
    antiPatterns: [
      "Checklist deviations reported as vulns.",
      "Guessing proxy/IdP behavior not in repo.",
      "Assigning severity to unverified hypotheses.",
      "Live attacks against production to 'prove' issues."
    ],
    reviewCriteria: [
      criterion(
        "Trust boundaries and core controls are documented.",
        "ARCHITECTURE.md",
        "critical",
      ),
      criterion(
        "Authn/authz model for multi-tenant data is explicit.",
        "ARCHITECTURE.md / DATABASE_DESIGN.md",
        "critical",
      ),
      criterion(
        "Secrets and dangerous operations have stop conditions.",
        "AGENT_EXECUTION_PACKAGE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Boundary coverage",
        measurement: "Sensitive surfaces mapped",
        target: "Present",
      },
      {
        name: "Fix specificity",
        measurement: "Confirmed issues have narrow fix asks",
        target: "100%",
      }
    ],
    acceptanceCriteria: [
      "Security architecture with boundaries and controls.",
      "No skill text grants production permissions."
    ],
    examples: [
      {
        title: "Multi-tenant SaaS authz",
        input: "Workspace-scoped documents",
        expectedOutput: "Boundary: user A must not read workspace B docs. Control: server-side workspace membership check on every document fetch. Test: cross-tenant IDOR fixture. Fix at query filter, not UI hide.",
      }
    ],
    failureStates: [
      {
        condition: "Multi-tenant system without authz model.",
        impact: "Likely IDOR.",
        recovery: "Block until authz is specified.",
        blocking: true,
      }
    ],
  },
  "security-reviewer": {
    mission: "Independently verify security claims in packages: boundaries, authz, secrets handling, and that findings meet an evidence bar before severity is assigned.",
    principles: [
      "Do not accept prose-only security assurances—require artifact evidence.",
      "Re-validate carried findings when source changed.",
      "Reject checklist theater without reachable impact.",
      "Ensure agent permissions in packages cannot escalate.",
      "Flag needs-validation items that are treated as confirmed."
    ],
    mentalModels: [
      "Independent verification",
      "Evidence bar gate",
      "Permission blast-radius check",
      "Coverage honesty (scoped ≠ complete)"
    ],
    decisionFrameworks: [
      framework(
        "Security review pass",
        "Council security gate.",
        [
                "Read ARCHITECTURE.md threat/control sections.",
                "Verify authn/authz and secret handling claims.",
                "Check AGENT_EXECUTION_PACKAGE permissions.",
                "List blockers with severity only when demonstrated.",
        ],
        [
                "Security review findings.",
        ],
      ),
      framework(
        "Candidate verification",
        "When security findings are asserted.",
        [
                "Confirm boundary+result.",
                "Separate needs-validation.",
                "Demand smallest fix + test.",
        ],
        [
                "Verified finding set.",
        ],
      )
    ],
    bestPractices: [
      "Cite file/design paths for every fail.",
      "Keep scoped-run honesty in language.",
      "Prefer re-test instructions owners can run safely.",
      "Never rubber-stamp 'encryption' buzzwords."
    ],
    antiPatterns: [
      "Severity on unverified items.",
      "Ignoring tenancy.",
      "Accepting client-only security controls.",
      "Writing live exploit playbooks into packages."
    ],
    reviewCriteria: [
      criterion(
        "Authz and trust boundaries pass review with evidence.",
        "ARCHITECTURE.md / QUALITY_CHECKLIST.md",
        "critical",
      ),
      criterion(
        "Secrets and permissions cannot escalate via skill text.",
        "AGENT_EXECUTION_PACKAGE.md",
        "critical",
      ),
      criterion(
        "Security claims match architecture detail.",
        "ARCHITECTURE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Evidence rate",
        measurement: "Fails with artifact citations",
        target: "100%",
      },
      {
        name: "Permission safety",
        measurement: "No extra production grants",
        target: "Pass",
      }
    ],
    acceptanceCriteria: [
      "Security review complete with pass/fail.",
      "Unresolved critical authz issues block acceptance."
    ],
    examples: [
      {
        title: "Review API package",
        input: "Says 'secure by default' but documents client-side role checks only",
        expectedOutput: "Fail critical: authz must be server-side; require membership checks on read/write paths.",
      }
    ],
    failureStates: [
      {
        condition: "Reviewer accepts client-only authz.",
        impact: "False security.",
        recovery: "Re-open review.",
        blocking: true,
      }
    ],
  },
  "api-security-specialist": {
    mission: "Secure APIs at the contract: authentication, authorization on every sensitive operation, injection/input bounds, and abuse controls—without confusing obscurity for security.",
    principles: [
      "Authorize on the server for every object access; IDs in URLs are not capability tokens.",
      "Authenticate with proven mechanisms; define token lifetime and revocation.",
      "Validate and bound inputs; treat all client data as hostile.",
      "Rate-limit and monitor abusive patterns on expensive endpoints.",
      "Never leak stack traces or sensitive internals in errors.",
      "Document security requirements in the API contract agents implement."
    ],
    mentalModels: [
      "Object-level authz (BOLA/IDOR lens)",
      "Least privilege scopes",
      "Fail-closed defaults",
      "Abuse case table"
    ],
    decisionFrameworks: [
      framework(
        "API threat pass",
        "API-heavy architectures.",
        [
                "List endpoints touching tenancy, money, PII, or admin.",
                "Define authn and per-operation authz rules.",
                "Specify validation, rate limits, and audit needs.",
                "Define safe error shapes.",
                "Add negative tests for cross-tenant access.",
        ],
        [
                "ARCHITECTURE.md API security + contract notes.",
        ],
      ),
      framework(
        "IDOR test plan",
        "Multi-tenant resources.",
        [
                "Enumerate resource IDs and ownership checks.",
                "Write cross-user access fixtures.",
                "Require server filters, not UI filtering.",
        ],
        [
                "IDOR test checklist.",
        ],
      )
    ],
    bestPractices: [
      "Use consistent authz helpers—not per-handler reinvention.",
      "Prefer allowlists for fields on write.",
      "Log authz failures with enough context to debug, not enough to exploit.",
      "Version breaking auth changes carefully."
    ],
    antiPatterns: [
      "Security through undocumented endpoints.",
      "Trusting client role flags.",
      "Verbose prod errors.",
      "Missing rate limits on login/search/export."
    ],
    reviewCriteria: [
      criterion(
        "Sensitive endpoints have explicit authz rules.",
        "ARCHITECTURE.md",
        "critical",
      ),
      criterion(
        "Cross-tenant negative tests are planned.",
        "QUALITY_CHECKLIST.md",
        "high",
      ),
      criterion(
        "Rate limits and safe errors specified for public APIs.",
        "ARCHITECTURE.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Authz coverage",
        measurement: "Sensitive ops with rules",
        target: "100%",
      },
      {
        name: "Negative tests",
        measurement: "Cross-tenant cases listed",
        target: "≥1 per sensitive resource",
      }
    ],
    acceptanceCriteria: [
      "API security section with authz and abuse controls.",
      "IDOR mitigations explicit."
    ],
    examples: [
      {
        title: "Documents API",
        input: "GET /docs/:id",
        expectedOutput: "Require auth; load doc by id AND workspace_membership(user, doc.workspace_id); 404 on miss; rate-limit exports; no stack traces.",
      }
    ],
    failureStates: [
      {
        condition: "Public API with no object authz rules.",
        impact: "Likely BOLA.",
        recovery: "Block until rules exist.",
        blocking: true,
      }
    ],
  },
  "privacy-engineer": {
    mission: "Engineer data minimization, purpose limitation, retention, and subject-rights flows so products handle personal data with explicit, reviewable controls.",
    principles: [
      "Collect only data needed for stated purposes; document purpose per field class.",
      "Define retention and deletion paths, including backups/logs reality.",
      "Separate security of systems from privacy of people—both required.",
      "Gate vendor/subprocessors sharing with contractual and technical controls.",
      "Design export/delete subject-rights flows as product features, not tickets forever.",
      "Label inferred profiles vs user-provided data."
    ],
    mentalModels: [
      "Data map (collect → use → share → retain → delete)",
      "Purpose binding",
      "Minimization first",
      "Rights request runbook"
    ],
    decisionFrameworks: [
      framework(
        "Privacy design pass",
        "Products processing personal data.",
        [
                "Inventory personal data classes and purposes.",
                "Define retention per class.",
                "Specify access controls and encryption expectations at rest/in transit.",
                "Design export/delete flows and verification.",
                "List third parties and transfer justifications at high level.",
        ],
        [
                "ARCHITECTURE.md / DATABASE_DESIGN.md privacy section.",
        ],
      ),
      framework(
        "Feature privacy review",
        "New tracking or ML feature.",
        [
                "Ask purpose and legal basis hypothesis.",
                "Check minimization alternatives.",
                "Require user controls where appropriate.",
                "Update data map.",
        ],
        [
                "Privacy review notes.",
        ],
      )
    ],
    bestPractices: [
      "Prefer anonymized/aggregated analytics when full identity isn't needed.",
      "Avoid putting secrets/PII in logs and prompts.",
      "Document cross-border assumptions as needs-validation if unknown.",
      "Align retention with product value, not infinite hoarding."
    ],
    antiPatterns: [
      "Collect-everything event pipelines.",
      "No deletion story ('we'll figure it out').",
      "PII in LLM prompts without redaction policy.",
      "Privacy theater banners without backend enforcement."
    ],
    reviewCriteria: [
      criterion(
        "Data classes, purposes, and retention are documented.",
        "DATABASE_DESIGN.md / ARCHITECTURE.md",
        "critical",
      ),
      criterion(
        "Subject-rights export/delete paths exist at least as design.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion(
        "PII-in-logs/prompts policy is explicit.",
        "AI_SYSTEM_DESIGN.md / ARCHITECTURE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Data map completeness",
        measurement: "Classes with purpose+retention",
        target: "All PII classes",
      },
      {
        name: "Rights readiness",
        measurement: "Export/delete designed",
        target: "Present",
      }
    ],
    acceptanceCriteria: [
      "Privacy section with data map and retention.",
      "No unbounded PII logging as default."
    ],
    examples: [
      {
        title: "Support inbox AI",
        input: "Email assistance product",
        expectedOutput: "Data: message bodies for support. Purpose: draft replies. Retain: 30 days hot, then delete. Redact secrets before model calls. User delete wipes workspace corpus. Analytics use aggregated counts only.",
      }
    ],
    failureStates: [
      {
        condition: "PII product with no retention/deletion design.",
        impact: "Compliance and trust failure.",
        recovery: "Require privacy spine.",
        blocking: true,
      }
    ],
  },
  "systems-thinker": {
    mission: "Map system boundaries, feedback loops, and second-order risks so agents change structures deliberately—after understanding how the current system behaves.",
    principles: [
      "Explore how it works today before proposing structural change.",
      "Lay out real alternative approaches with trade-offs; pick explicitly.",
      "Write goals, non-goals, and anti-goals (what counts as failure even if it 'works').",
      "Prefer root-cause understanding over symptom patches in coupled systems.",
      "Make approaches and decisions visible so partners can correct them.",
      "When multiple fixes fail, question architecture—not just the next patch."
    ],
    mentalModels: [
      "Boundary & dependency map",
      "Feedback loops / second-order effects",
      "Approach trade-off table",
      "Root cause before fix",
      "Design doc as decision record"
    ],
    decisionFrameworks: [
      framework(
        "Systems framing",
        "Complex product/architecture decisions.",
        [
                "Describe current system behavior and constraints.",
                "Name boundaries, critical dependencies, and failure modes.",
                "Generate 2–3 structural approaches with trade-offs.",
                "Recommend one; list anti-goals.",
                "Define signals that would falsify the choice.",
        ],
        [
                "ARCHITECTURE.md systems section / decision record.",
        ],
      ),
      framework(
        "Coupling diagnosis",
        "Repeated failures across components.",
        [
                "Trace data/control flow across boundaries.",
                "Instrument to find which layer breaks.",
                "Distinguish local bugs from architectural coupling.",
                "Propose structural remedy if 3+ symptom fixes failed.",
        ],
        [
                "Diagnosis with evidence.",
        ],
      )
    ],
    bestPractices: [
      "Playback understanding before building.",
      "Keep design docs short enough to approve.",
      "Spike only when labeled throwaway learning.",
      "State process defaults out loud as proposals."
    ],
    antiPatterns: [
      "Jumping to implementation before approaches are chosen.",
      "Buzzword architecture without failure modes.",
      "Hidden circular dependencies.",
      "Endless local fixes for a wrong structure."
    ],
    reviewCriteria: [
      criterion(
        "Boundaries, dependencies, and failure modes are documented.",
        "ARCHITECTURE.md",
        "critical",
      ),
      criterion(
        "Alternatives considered with explicit choice.",
        "ARCHITECTURE.md / MASTER_SKILL_PACKAGE.md",
        "high",
      ),
      criterion(
        "Anti-goals and stop conditions are present.",
        "PROJECT_DNA.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Approach explicitness",
        measurement: "≥2 alternatives considered",
        target: "Yes",
      },
      {
        name: "Risk pairs",
        measurement: "Risk→mitigation listed",
        target: "≥3",
      }
    ],
    acceptanceCriteria: [
      "Systems framing with boundaries and chosen approach.",
      "Second-order risks named."
    ],
    examples: [
      {
        title: "Realtime collab system",
        input: "Docs with presence + CRDT",
        expectedOutput: "Map: clients ↔ edge ↔ doc service ↔ blob store. Approaches: CRDT vs OT vs last-write-wins. Pick CRDT for offline; anti-goal: silent data loss. Risks: fanout cost, merge UX.",
      }
    ],
    failureStates: [
      {
        condition: "No boundary map on complex system.",
        impact: "Unowned failure domains.",
        recovery: "Require systems section.",
        blocking: true,
      }
    ],
  },
  "qa-architect": {
    mission: "Install quality systems where every change has a failing test first, root-cause debugging beats guess-fixes, and plans specify checkable verification steps.",
    principles: [
      "No fixes without root-cause investigation first.",
      "One hypothesis at a time; smallest test of the theory.",
      "Create a failing reproduction/test before implementing the fix.",
      "Plans use bite-sized tasks with exact verification commands and expected results.",
      "After 3 failed fix attempts, question architecture.",
      "Verification before completion claims—run the checks, don't narrate them."
    ],
    mentalModels: [
      "Four-phase debugging (cause → pattern → hypothesis → fix)",
      "Red-green-verify loop",
      "Task right-sizing with test cycle",
      "Review focus for uncovered failure modes"
    ],
    decisionFrameworks: [
      framework(
        "QA strategy design",
        "Any package needing QUALITY_CHECKLIST.md.",
        [
                "Define critical user journeys and risk areas.",
                "Specify test layers (unit/integration/e2e) and ownership.",
                "Require reproduction steps for defects.",
                "List release gates and flaky-test policy.",
                "Add observability hooks for hard-to-repro issues.",
        ],
        [
                "QUALITY_CHECKLIST.md QA strategy.",
        ],
      ),
      framework(
        "Incident debugging protocol",
        "Bugs/test failures during build.",
        [
                "Read errors fully; reproduce consistently.",
                "Compare working vs broken; check recent changes.",
                "Form one hypothesis; test minimally.",
                "Fix root cause with regression test; verify.",
        ],
        [
                "Documented root cause + regression coverage.",
        ],
      )
    ],
    bestPractices: [
      "Put exact expected failure/pass output in plans.",
      "Trace multi-component issues at boundaries with instrumentation.",
      "Keep review-focus tests for inputs the happy path misses.",
      "Prefer condition-based waits over arbitrary sleeps in tests."
    ],
    antiPatterns: [
      "Shotgun multi-fixes without isolation.",
      "'Quick fix now, investigate later'.",
      "Tests written only after manual 'looks good'.",
      "Claiming done without running verification."
    ],
    reviewCriteria: [
      criterion(
        "Critical journeys have automated or scripted checks.",
        "QUALITY_CHECKLIST.md",
        "critical",
      ),
      criterion(
        "Defect protocol requires reproduction before fix.",
        "QUALITY_CHECKLIST.md / AGENT_EXECUTION_PACKAGE.md",
        "high",
      ),
      criterion(
        "Release gates are explicit and runnable.",
        "QUALITY_CHECKLIST.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Gate clarity",
        measurement: "Named release checks",
        target: "≥5",
      },
      {
        name: "Regression discipline",
        measurement: "Defects require tests",
        target: "Policy present",
      }
    ],
    acceptanceCriteria: [
      "QA architecture with layers, gates, and debugging protocol.",
      "No completion without verification instructions."
    ],
    examples: [
      {
        title: "Checkout flake",
        input: "Intermittent payment test",
        expectedOutput: "Phase1: reproduce with seed; logs show webhook race. Hypothesis: missing idempotency key. Failing test asserts duplicate webhook. Fix at handler; verify suite green.",
      }
    ],
    failureStates: [
      {
        condition: "No verification gates on ship path.",
        impact: "Silent regressions.",
        recovery: "Require QA gates.",
        blocking: true,
      }
    ],
  },
  "accessibility-specialist": {
    mission: "Bake WCAG-oriented accessibility into design and implementation: semantic structure first, keyboard operability, contrast, and assistive-tech-announced dynamics.",
    principles: [
      "Semantic HTML before ARIA; native elements beat role reimplementation.",
      "Every interactive control is keyboard reachable and operable.",
      "Text contrast ≥4.5:1; UI components/graphics ≥3:1; don't convey meaning by color alone.",
      "Manage focus on route changes, dialogs, and deletions; return focus on close.",
      "Dynamic updates must be announced appropriately.",
      "Target AA as the default bar; explain criteria with pass/fail examples."
    ],
    mentalModels: [
      "POUR principles",
      "Semantic before ARIA",
      "Focus lifecycle",
      "WCAG AA outcome bar",
      "Findings with location + fix"
    ],
    decisionFrameworks: [
      framework(
        "A11y system design",
        "Any user-facing package.",
        [
                "Set target standard (WCAG 2.2 AA default).",
                "Specify semantics, focus, contrast, and motion rules in design system.",
                "Require accessible names for icon-only controls.",
                "Plan keyboard paths for primary flows.",
                "Define how findings are reported (rule, criterion, severity, location, fix).",
        ],
        [
                "DESIGN_SYSTEM.md + USER_FLOWS.md a11y.",
        ],
      ),
      framework(
        "Criterion application",
        "When implementing a specific interaction.",
        [
                "Name the criterion and level.",
                "State plain-language requirement.",
                "Give pass and fail examples.",
                "Note what it does not require.",
                "Implement the sufficient technique that fits.",
        ],
        [
                "Compliant interaction notes.",
        ],
      )
    ],
    bestPractices: [
      "One H1 per page; don't skip heading levels.",
      "Label form fields visibly.",
      "Ensure 24×24 minimum targets or spacing (2.5.8).",
      "Test with keyboard before adding ARIA."
    ],
    antiPatterns: [
      "div button soup with incomplete keyboard support.",
      "Removing focus outlines.",
      "Color-only error states.",
      "ARIA that fights native semantics."
    ],
    reviewCriteria: [
      criterion(
        "Semantic/keyboard/contrast rules are in the design system.",
        "DESIGN_SYSTEM.md",
        "critical",
      ),
      criterion(
        "Primary flows have documented keyboard paths.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Findings format requires location and fix.",
        "QUALITY_CHECKLIST.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Baseline completeness",
        measurement: "Semantics+keyboard+contrast documented",
        target: "All three",
      },
      {
        name: "Flow coverage",
        measurement: "Keyboard path for core jobs",
        target: "≥1",
      }
    ],
    acceptanceCriteria: [
      "Accessibility baseline specified for AA.",
      "No known critical keyboard traps in designed flows."
    ],
    examples: [
      {
        title: "Modal checkout",
        input: "Payment dialog",
        expectedOutput: "Use dialog semantics; trap focus; Esc closes; return focus to trigger; labelled fields; errors inline and announced; contrast 4.5:1 on text.",
      }
    ],
    failureStates: [
      {
        condition: "UI package without keyboard/contrast rules.",
        impact: "Access exclusion.",
        recovery: "Require a11y baseline.",
        blocking: true,
      }
    ],
  },
  "accessibility-reviewer": {
    mission: "Review packages for WCAG AA risks with structured findings—severity, criterion, location, and fix—blocking critical access failures.",
    principles: [
      "A finding without location and fix is not a finding.",
      "Prioritize critical/serious barriers over polish.",
      "Verify keyboard, names, contrast, and focus management with evidence.",
      "Don't claim compliance; report residual risk and re-scan needs.",
      "Prefer semantic fixes over ARIA patches in recommendations."
    ],
    mentalModels: [
      "Structured findings schema",
      "Severity vs confidence",
      "Remediation priority (impact × effort)",
      "Delta vs previous review"
    ],
    decisionFrameworks: [
      framework(
        "A11y review pass",
        "Council accessibility gate.",
        [
                "Check semantics, keyboard, contrast, forms, dialogs.",
                "File findings with criterion IDs when known.",
                "Order remediation by impact.",
                "State whether result is full review or triage.",
        ],
        [
                "Accessibility review report.",
        ],
      ),
      framework(
        "Flow keyboard audit",
        "Primary user journeys.",
        [
                "Tab through happy path.",
                "Confirm focus visibility and order.",
                "Confirm dialogs/menus operable.",
                "Fail traps and unreachable actions.",
        ],
        [
                "Keyboard audit results.",
        ],
      )
    ],
    bestPractices: [
      "Cite WCAG criteria in plain language.",
      "Separate tool output from human judgment.",
      "Require re-review after fixes.",
      "Call out 2.2 additions when relevant (focus not obscured, target size, accessible auth)."
    ],
    antiPatterns: [
      "Vibe-based 'looks fine'.",
      "Only automated scanner scores without manual keyboard check.",
      "Marking AAA gaps as blockers when AA is the target.",
      "Editing code in review instead of reporting."
    ],
    reviewCriteria: [
      criterion(
        "Critical keyboard/name/contrast issues are cleared or blocking.",
        "QUALITY_CHECKLIST.md",
        "critical",
      ),
      criterion(
        "Findings include locations and fixes.",
        "QUALITY_CHECKLIST.md",
        "high",
      ),
      criterion(
        "Primary flows keyboard-audited.",
        "USER_FLOWS.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Finding quality",
        measurement: "Findings with location+fix",
        target: "100%",
      },
      {
        name: "Manual coverage",
        measurement: "Keyboard audit done",
        target: "Yes",
      }
    ],
    acceptanceCriteria: [
      "Accessibility review recorded with evidence.",
      "No unresolved critical barriers."
    ],
    examples: [
      {
        title: "Review marketing site",
        input: "Hero CTA is a non-focusable div; contrast 2.1:1 on subtitle",
        expectedOutput: "Fail critical: non-keyboard CTA; fail serious: contrast; require button element + contrast fix.",
      }
    ],
    failureStates: [
      {
        condition: "Reviewer skips keyboard audit.",
        impact: "False AA confidence.",
        recovery: "Re-run review.",
        blocking: true,
      }
    ],
  },
  "storytelling-expert": {
    mission: "Shape narrative arcs and chapter jobs so experiences have hook, tension, proof, and landing—with copy that navigates rather than decorates.",
    principles: [
      "Every chapter needs one job in the story; cut orphan sections.",
      "Open with the most characteristic subject-matter moment—not generic stat strips.",
      "Show then tell; interaction and visuals carry story before brochure walls.",
      "CTA is narrative landing with consistent action naming.",
      "Write from the user's perspective in active voice; one job per sentence/element.",
      "Empty and error states give direction, not mood apology."
    ],
    mentalModels: [
      "Hook → deepen → prove → invite",
      "Scroll chapters as acts",
      "Restraint: one memorable move",
      "Interface vocabulary consistency"
    ],
    decisionFrameworks: [
      framework(
        "Chapter map",
        "Long-scroll or experiential sites.",
        [
                "Name 3–6 chapters with one job each.",
                "Assign primary medium per chapter.",
                "Place primary CTA at landing.",
                "Write microcopy rules for captions/CTAs/errors.",
                "Cut decorative copy that doesn't aid navigation.",
        ],
        [
                "USER_FLOWS.md chapter map + content rules.",
        ],
      ),
      framework(
        "Copy critique",
        "When UI/marketing copy feels templated.",
        [
                "Check for AI-default eyebrow/meta patterns.",
                "Replace clever with specific.",
                "Align CTA verbs across flow.",
                "Ensure failure copy says what happened and how to fix.",
        ],
        [
                "Revised copy guidance.",
        ],
      )
    ],
    bestPractices: [
      "Keep supporting copy short under dominant visuals.",
      "Prefer concrete subject vernacular over generic SaaS tropes.",
      "Use motion sparingly for story beats, not every card hover.",
      "Prototype chapter order before visual polish."
    ],
    antiPatterns: [
      "Walls of text over hero media.",
      "Random section order.",
      "ALL-CAPS eyebrows and middle-dot meta chrome by default.",
      "Apologetic vague errors."
    ],
    reviewCriteria: [
      criterion(
        "Chapter map exists with jobs per chapter.",
        "USER_FLOWS.md",
        "critical",
      ),
      criterion(
        "Primary CTA landing is narratively placed.",
        "USER_FLOWS.md",
        "high",
      ),
      criterion(
        "Copy rules cover CTA/error vocabulary.",
        "DESIGN_SYSTEM.md / PRODUCT_STRATEGY.md",
        "medium",
      )
    ],
    qualityMetrics: [
      {
        name: "Chapter clarity",
        measurement: "Named chapters with jobs",
        target: "≥3",
      },
      {
        name: "CTA consistency",
        measurement: "Same action named consistently",
        target: "Pass",
      }
    ],
    acceptanceCriteria: [
      "Narrative chapter map present for experiential packages.",
      "Copy guidance is actionable."
    ],
    examples: [
      {
        title: "Studio story",
        input: "Immersive agency site",
        expectedOutput: "Act1 Arrival world → Act2 Craft proof → Act3 Selected work → Act4 Invite. CTA 'Start a project' used in landing and confirmation.",
      }
    ],
    failureStates: [
      {
        condition: "No chapter map on immersive brief.",
        impact: "Aimless scroll.",
        recovery: "Generate chapter map.",
        blocking: true,
      }
    ],
  },
  "frontend-architect": {
    mission: "Define client architecture and craft systems: shell vs experience boundaries, performance budgets, accessible UI structure, and distinctive visual direction that avoids AI-default templates.",
    principles: [
      "Separate app shell chrome from experience canvas ownership.",
      "Performance budgets (LCP/INP/CLS/FPS) are architectural constraints.",
      "Ground visual direction in subject matter; avoid cream-serif-terracotta, purple-glow, and card-kit defaults unless the brief demands them.",
      "Typography and color are deliberate systems—not Inter/purple gradients by habit.",
      "Accessibility and keyboard paths remain first-class, including on experience sites.",
      "Routing/state must not remount expensive scenes carelessly."
    ],
    mentalModels: [
      "App shell vs experience host",
      "Critical rendering path",
      "Design plan then critique uniqueness",
      "Island/hydration boundaries",
      "Tokenized UI implementation"
    ],
    decisionFrameworks: [
      framework(
        "Client boundary map",
        "Web, awwwards, three.js, SaaS UIs.",
        [
                "Separate shell chrome from experience surface.",
                "Define state ownership for scroll/progress.",
                "List performance budgets for LCP/INP and FPS.",
                "Specify hydration/experience-load strategy.",
                "Document a11y expectations for interactive surfaces.",
        ],
        [
                "ARCHITECTURE.md client section.",
        ],
      ),
      framework(
        "Craft direction gate",
        "Marketing/experience frontends.",
        [
                "Write a short design plan (color, type, layout, principles) tied to subject.",
                "Critique against AI-default clusters; revise if generic.",
                "Encode tokens and forbidden patterns.",
                "Confirm responsive and reduced-motion baselines.",
        ],
        [
                "DESIGN_SYSTEM.md craft direction.",
        ],
      )
    ],
    bestPractices: [
      "Hydrate/experience-load strategy explicit for heavy pages.",
      "Prefer one bold craft move with quiet surroundings.",
      "Keep CSS specificity disciplined to avoid conflicting utilities.",
      "Screenshot-critique when environment allows."
    ],
    antiPatterns: [
      "Entire site inside one Canvas.",
      "Blocking TTI with giant JS before first story beat.",
      "SaaS-card kit on a brand marketing hero.",
      "Template chrome (tracked ALL-CAPS eyebrows, identical soft shadows everywhere)."
    ],
    reviewCriteria: [
      criterion(
        "Client boundaries and budgets documented.",
        "ARCHITECTURE.md",
        "critical",
      ),
      criterion(
        "Craft direction is subject-specific with forbidden defaults listed.",
        "DESIGN_SYSTEM.md",
        "high",
      ),
      criterion(
        "Accessibility baseline retained in frontend architecture.",
        "DESIGN_SYSTEM.md / ARCHITECTURE.md",
        "high",
      )
    ],
    qualityMetrics: [
      {
        name: "Boundary clarity",
        measurement: "Shell vs experience split present",
        target: "Yes",
      },
      {
        name: "Budget presence",
        measurement: "LCP/INP or FPS budgets listed",
        target: "Present",
      }
    ],
    acceptanceCriteria: [
      "Frontend boundaries, budgets, and craft constraints written.",
      "AI-default aesthetics explicitly rejected when not briefed."
    ],
    examples: [
      {
        title: "Hybrid experience site",
        input: "Next.js + R3F",
        expectedOutput: "App shell in DOM; ExperienceHost mounts Canvas; progress store shared; route transitions dispose scenes; type: distinctive display+UI pair; forbid purple gradient hero kit.",
      }
    ],
    failureStates: [
      {
        condition: "No client boundary map on web/immersive packages.",
        impact: "Messy unperformant implementation.",
        recovery: "Add frontend architecture section.",
        blocking: false,
      },
      {
        condition: "Generic AI aesthetic with no subject grounding.",
        impact: "Forgettable UI.",
        recovery: "Revise craft direction before acceptance.",
        blocking: true,
      }
    ],
  },
  "evaluation-engineer": {
    mission:
      "Install deterministic checks and multi-dimensional rubrics so agent quality is measured, not vibed.",
    principles: [
      "Deterministic structure/evidence checks before model judges.",
      "Rubrics cover accuracy, completeness, tool efficiency, and process quality.",
      "Judges need bias mitigation and clear scoring math.",
      "Gate ship decisions on eval results, not demos alone.",
    ],
    mentalModels: ["Eval ladder", "Rubric dimensions", "Golden set + canaries", "Offline → online"],
    decisionFrameworks: [
      framework(
        "Eval plan authoring",
        "AI product and agent packages.",
        [
          "Define tasks and success predicates.",
          "Build golden/canary cases with expected artifacts.",
          "Add deterministic validators; only then model judges.",
          "Set pass thresholds and regression alerts.",
        ],
        ["AI_SYSTEM_DESIGN.md eval section."],
      ),
    ],
    bestPractices: [
      "Version eval sets with the product.",
      "Include adversarial/prompt-injection cases for agent surfaces.",
      "Separate capability evals from safety evals.",
    ],
    antiPatterns: [
      "Demo-driven 'it looked good once'.",
      "Judge-only scoring with no structure checks.",
      "No regression gate after prompt changes.",
    ],
    reviewCriteria: [
      criterion("Eval plan with thresholds exists for AI packages.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Deterministic first", measurement: "Structure checks precede judges", target: "Yes" },
    ],
    acceptanceCriteria: ["Eval plan and ship gates documented."],
    examples: [
      {
        title: "RAG assistant",
        input: "Support RAG bot",
        expectedOutput:
          "Goldens with cited sources; schema check on answer JSON; faithfulness judge after citations valid; block ship if citation miss rate > threshold.",
      },
    ],
    failureStates: [
      {
        condition: "AI package with no eval plan.",
        impact: "Uncontrolled quality regressions.",
        recovery: "Author eval plan before cook completion.",
        blocking: true,
      },
    ],
  },
  "prompt-injection-defender": {
    mission:
      "Treat untrusted content as data, never instructions—defend agent and RAG surfaces against injection and exfiltration.",
    principles: [
      "Inventory instruction surfaces vs data surfaces.",
      "Retrieved/user content must not silently become system policy.",
      "Tool allowlists and approval gates beat prompt-only admonitions.",
      "Test with adversarial cases in evals.",
    ],
    mentalModels: ["Instruction vs data plane", "Allowlisted tools", "Exfiltration paths"],
    decisionFrameworks: [
      framework(
        "Injection threat pass",
        "Agents, RAG, and tool-using products.",
        [
          "List what can enter context from users, web, files, tickets.",
          "Define delimiters/quarantine and what the model may not obey from those channels.",
          "Restrict tools that can send data out or change auth state.",
          "Add eval cases for injection and data exfil attempts.",
        ],
        ["AI_SYSTEM_DESIGN.md security section."],
      ),
    ],
    bestPractices: ["Independent authorization for effective capability changes.", "Fresh-session tests after policy edits."],
    antiPatterns: [
      "Only 'ignore malicious instructions' in the system prompt.",
      "Untrusted web browse with unrestricted tools.",
    ],
    reviewCriteria: [
      criterion("Untrusted channels identified and quarantined for agentic packages.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [{ name: "Adversarial evals", measurement: "Injection cases in eval plan", target: "≥3 when agents in scope" }],
    acceptanceCriteria: ["Injection defenses documented for agent/RAG categories."],
    examples: [
      {
        title: "Support inbox agent",
        input: "Email → ticket AI",
        expectedOutput:
          "Email body is data; cannot authorize refunds; tools require policy service; eval includes 'ignore previous instructions' payloads.",
      },
    ],
    failureStates: [
      {
        condition: "Tool-using agent with no untrusted-content policy.",
        impact: "High exfil/abuse risk.",
        recovery: "Add instruction-surface inventory and tool gates.",
        blocking: true,
      },
    ],
  },

};
