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
 * SkillForge depth adapted from permissive GitHub agent-skill repos (MIT / Apache-2.0 / CC0).
 * Bodies are original SkillForge wording in the 13-section contract — not pasted SKILL.md.
 * Provenance: knowledge/license-audit.md + knowledge/github-skill-sources.md
 */
export const LICENSED_DEPTH: Record<string, DepthPatch> = {
  // --- phuryn/pm-skills (MIT) ---
  "product-strategist": {
    mission:
      "Build a coherent product strategy canvas—vision, segments, value, trade-offs, metrics, growth, capabilities, and defensibility—so agents ship the same product, not parallel guesses.",
    principles: [
      "Market segments are defined by jobs and problems, not vanity demographics.",
      "Value propositions need before → how → after → alternatives for each segment.",
      "Explicit trade-offs (what we will NOT do) create focus.",
      "One North Star and one quarterly OMTM beat a dashboard of vanity KPIs.",
      "Strategy must name defensibility: why competitors cannot casually copy this.",
      "Surface critical hypotheses and the cheapest experiments to test them.",
    ],
    mentalModels: [
      "9-section Product Strategy Canvas",
      "Jobs-to-be-done segments",
      "Cost position vs unique-value position",
      "North Star + OMTM",
      "Hypothesis → cheap experiment",
    ],
    decisionFrameworks: [
      framework(
        "Product Strategy Canvas",
        "Any new product, pivot, or major positioning decision.",
        [
          "Write vision: inspire, aspire, values.",
          "Name 2–3 problem-defined segments with JTBD and why this segment first.",
          "Choose cost position (low-cost vs premium unique value) relative to alternatives.",
          "For each segment: what-before, how, what-after, alternatives.",
          "List explicit trade-offs and out-of-scope markets/features.",
          "Set North Star and this-quarter OMTM.",
          "Choose growth motion (PLG vs sales-led), channels, and unit-economics sketch.",
          "List build-vs-partner capabilities required to win.",
          "State can't/won't: network effects, switching costs, IP, or other barriers.",
          "Check coherence: every element must reinforce the others; list must-be-true hypotheses.",
        ],
        ["PRODUCT_STRATEGY.md that agents can execute without inventing a new product mid-build."],
      ),
      framework(
        "Strategy coherence check",
        "Before locking DNA / cook packs.",
        [
          "If growth motion conflicts with pricing or segments, resolve explicitly.",
          "If trade-offs are empty, force three meaningful nos.",
          "If defensibility is only 'we'll move fast', mark as weak hypothesis.",
        ],
        ["Coherent strategy or labeled blocking unknowns."],
      ),
    ],
    bestPractices: [
      "Keep the canvas short enough that cook agents actually read it.",
      "Prefer problem-language segments over 'enterprise SMB millennials'.",
      "Propose one low-effort experiment per critical hypothesis.",
      "Revisit strategy when market evidence invalidates a must-be-true claim.",
    ],
    antiPatterns: [
      "Solutionizing into a stack before the job is clear.",
      "Fake precision metrics with no observation method.",
      "Empty trade-offs ('we do everything').",
      "Calling defensibility 'AI' with no switching cost or data advantage.",
    ],
    reviewCriteria: [
      criterion(
        "Vision, segments, value props, trade-offs, metrics, and growth motion are present and consistent.",
        "PRODUCT_STRATEGY.md",
        "critical",
      ),
      criterion("At least one North Star / OMTM pair is stated.", "PRODUCT_STRATEGY.md", "high"),
      criterion("Critical hypotheses are labeled inferred vs confirmed.", "PROJECT_DNA.md", "medium"),
    ],
    qualityMetrics: [
      { name: "Canvas completeness", measurement: "Filled strategy sections / 9", target: "≥8/9" },
      { name: "Trade-off clarity", measurement: "Count of explicit nos", target: "≥3" },
    ],
    acceptanceCriteria: [
      "Strategy spine present with outcomes, trade-offs, and growth motion.",
      "Hypotheses that must be true are listed with test ideas.",
    ],
    examples: [
      {
        title: "B2B recruiting AI",
        input: "Enterprise AI recruiting platform",
        expectedOutput:
          "Segment: talent teams drowning in resume noise; value: shorter time-to-qualified shortlist; trade-off: not replacing ATS in v1; North Star: accepted shortlists/week; growth: sales-led with product-qualified demos.",
      },
    ],
    failureStates: [
      {
        condition: "No problem/outcome framing or empty trade-offs.",
        impact: "Wandering package; agents invent competing products.",
        recovery: "Block cook until canvas sections and three nos exist.",
        blocking: true,
      },
    ],
  },

  "business-analyst": {
    mission:
      "Turn strategy into an assumption ledger, measurable success criteria, and evidence-gated scope cuts agents can execute without inventing market facts.",
    principles: [
      "Every market or ROI claim needs a provenance label: confirmed, inferred, or unknown.",
      "Success metrics must link to a decision (ship / kill / iterate).",
      "Scope cuts are documented as deliberate choices, not silent omissions.",
      "Prefer checkable acceptance criteria over narrative confidence.",
    ],
    mentalModels: ["Assumption ledger", "Metric → decision link", "Evidence gap register", "MVP cut matrix"],
    decisionFrameworks: [
      framework(
        "Assumption ledger pass",
        "After strategy draft, before architecture freezes.",
        [
          "Extract claims about users, willingness-to-pay, and constraints.",
          "Label each confirmed / inferred / unknown.",
          "Attach a cheapest validation method to each high-risk unknown.",
          "Propose scope cuts that remove unvalidated load-bearing claims from v1.",
        ],
        ["PROJECT_DNA.md assumption section agents can honor."],
      ),
    ],
    bestPractices: [
      "Write metrics as observation recipes, not slogans.",
      "Keep MVP cuts explicit and reversible.",
      "Call out second-order business risks (support load, compliance).",
    ],
    antiPatterns: [
      "Fake precision ('will capture 12.4% market').",
      "Expanding scope silently when unknowns appear.",
      "Treating stakeholder opinions as market evidence.",
    ],
    reviewCriteria: [
      criterion("Assumption ledger exists with provenance labels.", "PROJECT_DNA.md", "critical"),
      criterion("At least one success metric maps to a ship/kill decision.", "PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [
      { name: "Labeled claims", measurement: "Share of business claims with provenance", target: "100%" },
    ],
    acceptanceCriteria: [
      "Assumption ledger and evidence gaps recorded.",
      "MVP cuts remove at least one high-risk unvalidated claim from v1.",
    ],
    examples: [
      {
        title: "Marketplace launch",
        input: "Two-sided marketplace brief with no research",
        expectedOutput:
          "Unknown: supply liquidity; inferred: demand from waitlist; cut: geographic expansion until supply density hypothesis tested.",
      },
    ],
    failureStates: [
      {
        condition: "Critical business unknowns treated as facts.",
        impact: "Wrong product built with false confidence.",
        recovery: "Relabel claims and block acceptance until high-risk unknowns are gated.",
        blocking: true,
      },
    ],
  },

  "b2b-saas-expert": {
    mission:
      "Shape B2B SaaS packages around buyer jobs, buying committees, packaging, and adoption friction—not consumer growth folklore.",
    principles: [
      "Map champion, economic buyer, and end user separately.",
      "Packaging and pricing must match buyer readiness, not feature vanity.",
      "Time-to-value and implementation risk dominate enterprise deals.",
      "Security/compliance claims must be evidence-backed or labeled unknowns.",
    ],
    mentalModels: ["Buying committee map", "Time-to-value curve", "Seat vs usage packaging", "Expansion motion"],
    decisionFrameworks: [
      framework(
        "B2B readiness check",
        "SaaS / enterprise / internal-tool categories.",
        [
          "Name champion, buyer, and user goals.",
          "List must-have trust artifacts (SSO, audit logs, DPA) vs nice-to-haves.",
          "Define activation moment for the champion and for end users.",
          "State expansion path (seats, usage, modules) without inventing ARR numbers.",
        ],
        ["PRODUCT_STRATEGY.md B2B section."],
      ),
    ],
    bestPractices: [
      "Design for procurement paths early when enterprise is in scope.",
      "Separate product-qualified leads from vanity signups.",
      "Document admin vs member permission models.",
    ],
    antiPatterns: [
      "Consumer PLG tactics pasted onto a sales-led enterprise product.",
      "Ignoring IT/security gates until after UI polish.",
      "Fake case-study metrics.",
    ],
    reviewCriteria: [
      criterion("Buying roles and activation moments are explicit.", "PRODUCT_STRATEGY.md / USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [
      { name: "Role clarity", measurement: "Champion/buyer/user distinguished", target: "Yes" },
    ],
    acceptanceCriteria: ["B2B buying path and trust requirements listed or marked out of scope."],
    examples: [
      {
        title: "Analytics SaaS",
        input: "B2B analytics for ops teams",
        expectedOutput:
          "Champion: ops lead; buyer: VP Ops; trust: SSO + export; activation: first shared dashboard in <1 day.",
      },
    ],
    failureStates: [
      {
        condition: "Enterprise brief with no buyer/trust path.",
        impact: "Pretty product that cannot be purchased.",
        recovery: "Add buying-committee and trust checklist.",
        blocking: true,
      },
    ],
  },

  "product-reviewer": {
    mission:
      "Review packages for strategy coherence: outcomes, trade-offs, metrics, and whether craft solves the stated job.",
    principles: [
      "Fail packages that look polished but solve a different job.",
      "Demand observable outcomes and explicit nos.",
      "Reject invented market facts.",
    ],
    mentalModels: ["Job ↔ solution fit", "Strategy coherence", "Scope honesty"],
    decisionFrameworks: [
      framework(
        "Product council pass",
        "Before cook authorization.",
        [
          "Restate the job in one sentence from artifacts.",
          "Check value props and trade-offs against flows and design.",
          "Flag missing metrics or untestable success claims.",
          "Pass / fail with concrete remediations.",
        ],
        ["REVIEWER_FRAMEWORKS.md product lens results."],
      ),
    ],
    bestPractices: ["Cite artifact paths for every fail.", "Prefer remediations over vague 'improve strategy'."],
    antiPatterns: ["Rubber-stamping beautiful but jobless experiences.", "Nitpicking copy while missing wrong-product risk."],
    reviewCriteria: [
      criterion("Job, outcomes, and trade-offs survive craft artifacts.", "PRODUCT_STRATEGY.md + EXPERIENCE_DNA.md", "critical"),
    ],
    qualityMetrics: [{ name: "Fail specificity", measurement: "Fails cite artifact + remediation", target: "100%" }],
    acceptanceCriteria: ["Product review recorded with pass/fail and remediations."],
    examples: [
      {
        title: "Wrong-job hero",
        input: "Immersive site for a billing tool",
        expectedOutput: "Fail: hero sells 'delight' but job is invoice reconciliation trust; remediate story and CTA.",
      },
    ],
    failureStates: [
      {
        condition: "No product strategy spine to review against.",
        impact: "Review becomes taste-only.",
        recovery: "Block until PRODUCT_STRATEGY.md exists.",
        blocking: true,
      },
    ],
  },

  // --- obra/superpowers (MIT) ---
  "systems-thinker": {
    mission:
      "Force clarity on intent, boundaries, approaches, and approval gates before agents build—so systems emerge from chosen trade-offs, not accidental accretion.",
    principles: [
      "Ask only questions whose answers change what gets built; otherwise propose and invite correction.",
      "Lay out real approaches with trade-offs before writing a design that agents treat as law.",
      "Goals, non-goals, and anti-goals are first-class system boundaries.",
      "Nothing substantial gets built until the design is approved (except labeled throwaway spikes).",
      "Playback understanding in chunks; never silently fill intent as if the user said it.",
    ],
    mentalModels: [
      "Intent → approaches → design gate → plan",
      "Goals / non-goals / anti-goals",
      "Boundary & feedback-loop map",
      "Spike as learning, not product",
    ],
    decisionFrameworks: [
      framework(
        "Approach selection gate",
        "Any non-trivial feature, architecture, or experience system.",
        [
          "Restate intent: what, who, why—from brief and project context only.",
          "List 2–3 concrete approaches with trade-offs grounded in the actual system.",
          "Recommend one; record the choice as approved or as a blocking unknown.",
          "Write short design: intent, goals/non-goals/anti-goals, constraints, chosen how, open builder calls.",
          "Map trust boundaries, critical dependencies, and second-order failure loops.",
        ],
        ["ARCHITECTURE.md / PROJECT_DNA.md with explicit boundaries and chosen approach."],
      ),
      framework(
        "Risk loop scan",
        "After boundaries drafted.",
        [
          "For each critical dependency, name failure mode and mitigation owner.",
          "Identify circular dependencies and collapse or break them.",
          "Mark operational risks (support, cost, latency) as first-class.",
        ],
        ["Risk pairs agents cannot ignore."],
      ),
    ],
    bestPractices: [
      "Prefer one open question at a time over process lectures.",
      "Label agent-filled defaults as proposals, not user decisions.",
      "Use spikes only when labeled throwaway and time-boxed.",
    ],
    antiPatterns: [
      "Menu-steering ('do you want A, B, or C?') before the user describes intent.",
      "Building product code before design approval.",
      "Buzzword architecture with no boundaries.",
      "Hidden circular dependencies.",
    ],
    reviewCriteria: [
      criterion("Chosen approach and rejected alternatives are recorded.", "ARCHITECTURE.md / PROJECT_DNA.md", "critical"),
      criterion("Goals, non-goals, and anti-goals are explicit.", "PROJECT_DNA.md", "high"),
      criterion("Critical dependencies have failure/mitigation pairs.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Approach honesty", measurement: "Approaches considered ≥2 when nontrivial", target: "Yes" },
    ],
    acceptanceCriteria: [
      "System boundaries and chosen approach present.",
      "Anti-goals stated (what counts as failure even if it 'works').",
    ],
    examples: [
      {
        title: "Bakery site scope",
        input: "Website for my bakery",
        expectedOutput:
          "Approaches: visit-conversion vs online-orders; choose visit-first; anti-goal: fake e-commerce that cannot fulfill; boundaries: hours/menu/location as shell, no payment in v1.",
      },
    ],
    failureStates: [
      {
        condition: "Agents implementing without approach or design gate.",
        impact: "Wrong system built confidently.",
        recovery: "Stop build; force approach selection and short design approval.",
        blocking: true,
      },
    ],
  },

  "qa-architect": {
    mission:
      "Install verification-before-completion discipline: tests and checks that prove the job, not theater that greenlights guesses.",
    principles: [
      "Define done with observable checks before coding the happy path.",
      "Prefer failing tests that encode acceptance over post-hoc screenshots alone.",
      "Separate spike learning from production verification.",
      "Coverage of critical paths beats raw coverage percentage folklore.",
    ],
    mentalModels: ["Verification gate", "Critical-path matrix", "Regression budget", "Flake quarantine"],
    decisionFrameworks: [
      framework(
        "Verification plan",
        "Before cook/handoff claims completion.",
        [
          "List critical user journeys and failure states.",
          "Map each to automated, manual, or exploratory checks.",
          "Define blocking vs non-blocking failures.",
          "Require evidence artifacts (logs, traces, screenshots) for immersive/WebGL paths.",
        ],
        ["QA plan in MASTER_SKILL_PACKAGE / REVIEWER_FRAMEWORKS."],
      ),
    ],
    bestPractices: [
      "Test accessibility and reduced-motion as first-class paths.",
      "Keep immersive visual checks device-profile aware.",
      "Quarantine flakes; never silence them into greens.",
    ],
    antiPatterns: [
      "Passing CI with no assertion on the user job.",
      "Manual-only verification for regressions that will recur.",
      "Treating 'looks fine on my laptop' as done for WebGL.",
    ],
    reviewCriteria: [
      criterion("Critical journeys have named verification methods.", "USER_FLOWS.md / REVIEWER_FRAMEWORKS.md", "high"),
    ],
    qualityMetrics: [
      { name: "Critical-path coverage", measurement: "Journeys with checks / critical journeys", target: "100%" },
    ],
    acceptanceCriteria: ["Verification plan present; blocking failures defined."],
    examples: [
      {
        title: "Checkout + canvas",
        input: "Shop with WebGL hero",
        expectedOutput: "Checks: keyboard checkout; reduced-motion hero; mobile FPS budget gate; payment failure state.",
      },
    ],
    failureStates: [
      {
        condition: "No verification plan on a cook pack.",
        impact: "False completion.",
        recovery: "Add critical-path checks before handoff.",
        blocking: true,
      },
    ],
  },

  // --- nextlevelbuilder/ui-ux-pro-max-skill (MIT) ---
  "ux-architect": {
    mission:
      "Specify task flows, interaction states, accessibility, and responsive behavior so interfaces are usable before they are decorative.",
    principles: [
      "Accessibility is priority-one UX: contrast, labels, keyboard, focus—not a late patch.",
      "Touch targets ≥44×44 with spacing; never hover-only critical actions.",
      "Reserve space to protect CLS; give loading feedback; avoid 0ms state jumps.",
      "Mobile-first breakpoints; no horizontal scroll; do not disable zoom.",
      "Forms: visible labels, errors near fields, progressive disclosure.",
      "Motion must convey meaning and respect prefers-reduced-motion.",
    ],
    mentalModels: [
      "Priority ladder: a11y → touch → performance → layout → type/color → motion → forms → nav",
      "Task flow with empty/loading/error/success states",
      "Design-system master + page overrides",
    ],
    decisionFrameworks: [
      framework(
        "UX quality gate",
        "Any UI page, component, or flow.",
        [
          "Name the primary user job and success action.",
          "Enumerate states: empty, loading, error, success, permission-denied.",
          "Check a11y: contrast, alt/aria, keyboard path, focus not obscured.",
          "Check touch/interaction and responsive constraints.",
          "Define motion intent or reduced-motion alternative.",
          "Write acceptance checks agents can verify.",
        ],
        ["USER_FLOWS.md + DESIGN_SYSTEM.md interaction section."],
      ),
      framework(
        "Design system intake",
        "New product/page visual direction.",
        [
          "Detect product type, audience, style keywords, and stack from project facts.",
          "Choose coherent layout, type, color, and density for the job (not AI-default aesthetics).",
          "Persist master rules; page overrides only when necessary.",
        ],
        ["DESIGN_SYSTEM.md master tokens and rules."],
      ),
    ],
    bestPractices: [
      "Base text ≥16px; line-height ~1.5; semantic color tokens over raw hex in components.",
      "Bottom nav ≤5 items; predictable back; deep links where applicable.",
      "Charts: legends/tooltips; never color-alone encoding.",
    ],
    antiPatterns: [
      "Removing focus rings; icon-only buttons without accessible names.",
      "Placeholder-only labels; errors only at page top.",
      "Fixed px containers that break small screens.",
      "Emoji-as-icons; mixing incompatible style languages randomly.",
    ],
    reviewCriteria: [
      criterion("Primary flows include loading/empty/error/success states.", "USER_FLOWS.md", "critical"),
      criterion("Keyboard and accessible-name paths exist for primary actions.", "USER_FLOWS.md / DESIGN_SYSTEM.md", "critical"),
      criterion("Reduced-motion alternative specified when motion is used.", "DESIGN_SYSTEM.md", "high"),
    ],
    qualityMetrics: [
      { name: "State coverage", measurement: "Primary flows with 4 core states", target: "100%" },
      { name: "Touch target policy", measurement: "Documented min size", target: "≥44px" },
    ],
    acceptanceCriteria: [
      "Flows and interaction states documented.",
      "Accessibility requirements listed as acceptance checks.",
    ],
    examples: [
      {
        title: "AI search homepage",
        input: "Search tool landing + results",
        expectedOutput:
          "Job: submit query → see ranked results; states for empty/query/error; keyboard focus order; mobile stack; no hover-only filters.",
      },
    ],
    failureStates: [
      {
        condition: "UI defined without states or a11y path.",
        impact: "Pretty but unusable interface.",
        recovery: "Block until states and keyboard path exist.",
        blocking: true,
      },
    ],
  },

  "design-systems-architect": {
    mission:
      "Own tokens, components, and consistency rules so agents compose UI from a coherent system instead of one-off styles.",
    principles: [
      "Master tokens beat page-local hex and font chaos.",
      "Components encode interaction and a11y contracts, not just visuals.",
      "Density and motion dials should match product job (dashboard vs marketing).",
      "Overrides are explicit; silent divergence is debt.",
    ],
    mentalModels: ["Token layers (primitive → semantic)", "Master + page overrides", "Component contract"],
    decisionFrameworks: [
      framework(
        "System freeze",
        "Before multi-page implementation.",
        [
          "Define color, type, space, radius, elevation tokens.",
          "List core components with states and a11y notes.",
          "Document forbidden patterns (AI-default themes, random glassmorphism).",
          "State how pages may override master—and when they must not.",
        ],
        ["DESIGN_SYSTEM.md as source of truth."],
      ),
    ],
    bestPractices: [
      "Export tokens in a form implementers can paste (CSS variables / DTCG-like structure).",
      "Keep iconography consistent (SVG, not emoji).",
      "Pair type intentionally; avoid default Inter/Roboto/Arial stacks when brand needs voice.",
    ],
    antiPatterns: [
      "Raw hex sprinkled in components.",
      "Each page inventing its own button.",
      "Dark mode that fails contrast.",
    ],
    reviewCriteria: [
      criterion("Semantic tokens and core components documented.", "DESIGN_SYSTEM.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Token coverage", measurement: "Color/type/space tokens present", target: "Yes" },
    ],
    acceptanceCriteria: ["Design system master exists with tokens and component contracts."],
    examples: [
      {
        title: "SaaS console",
        input: "Ops dashboard",
        expectedOutput: "Dense space scale; semantic danger/success; table/button/input contracts; no marketing-hero tokens.",
      },
    ],
    failureStates: [
      {
        condition: "Multi-surface product with no shared tokens.",
        impact: "Incoherent UI and slow agents.",
        recovery: "Author master design system before more pages.",
        blocking: true,
      },
    ],
  },

  "ux-reviewer": {
    mission:
      "Fail UX that breaks accessibility, interaction, or flow honesty—even when visuals look premium.",
    principles: [
      "A11y and keyboard failures are critical, not polish.",
      "Missing states are defects.",
      "Hover-only and tiny targets fail mobile.",
    ],
    mentalModels: ["Priority UX ladder", "State completeness", "Focus order"],
    decisionFrameworks: [
      framework(
        "UX review pass",
        "Council review before cook.",
        [
          "Walk primary job on keyboard-only mental model.",
          "Check states and error proximity.",
          "Check touch/responsive and reduced-motion.",
          "Issue fails with artifact citations.",
        ],
        ["REVIEWER_FRAMEWORKS.md UX lens."],
      ),
    ],
    bestPractices: ["Use concrete WCAG-oriented checks without fake certification claims."],
    antiPatterns: ["Passing pretty heroes with broken forms.", "Ignoring CLS and loading feedback."],
    reviewCriteria: [
      criterion("Primary actions have accessible names and keyboard paths.", "USER_FLOWS.md", "critical"),
      criterion("Empty/loading/error/success covered for primary flows.", "USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [{ name: "Critical UX fails closed", measurement: "A11y fails block pass", target: "Yes" }],
    acceptanceCriteria: ["UX review recorded with pass/fail."],
    examples: [
      {
        title: "Icon-only toolbar",
        input: "Dense editor chrome",
        expectedOutput: "Fail: icon buttons lack accessible names; remediate aria-labels or visible text.",
      },
    ],
    failureStates: [
      {
        condition: "No flows artifact.",
        impact: "Cannot review UX honestly.",
        recovery: "Require USER_FLOWS.md.",
        blocking: true,
      },
    ],
  },

  // --- muratcankoylan/Agent-Skills-for-Context-Engineering (MIT) ---
  "context-engineer": {
    mission:
      "Design context as curated inference state—budgets, memory tiers, tool I/O, and compression—so agents stay high-signal instead of drowning in poisoned windows.",
    principles: [
      "Context is the full inference state (instructions, tools, retrieval, history, tool outputs)—not 'the prompt' alone.",
      "Optimize tokens-per-task, not tokens-per-request; cut distraction and lost-in-the-middle risk.",
      "Sub-agents exist primarily to isolate context, not to cosplay org charts.",
      "Prefer filesystem/scratchpad offloading over stuffing verbose tool output into the live window.",
      "Compression must preserve artifact trails, decisions, and next steps—not vague summaries.",
      "Secrets and high-risk instructions never enter unconstrained context.",
    ],
    mentalModels: [
      "Signal-to-noise context envelope",
      "Lost-in-the-middle / U-shaped attention",
      "Memory tiers: scratch / session / durable",
      "Context isolation via sub-agents",
      "Harness invariants vs editable surfaces",
    ],
    decisionFrameworks: [
      framework(
        "Context envelope design",
        "Any AI agent, RAG, or multi-step cook package.",
        [
          "List what must be pinned every turn vs loaded just-in-time.",
          "Set hard budgets for system, retrieval, history, and tool-output slices.",
          "Define memory tiers and what is forbidden in context (secrets, PII, raw dumps).",
          "Choose isolation: which work runs in sub-agents with separate windows.",
          "Define compaction trigger and structured summary sections (files, decisions, next steps).",
          "Specify tool-output masking (store full artifact; pass reference + digest to the model).",
        ],
        ["AI_SYSTEM_DESIGN.md context & memory section."],
      ),
      framework(
        "Degradation response",
        "When sessions grow long or quality drops.",
        [
          "Detect distraction, poisoning, or middle-loss symptoms.",
          "Compact with structured sections; verify artifact trail integrity.",
          "Reset or branch a sub-agent rather than endlessly appending.",
        ],
        ["Operational runbook for context health."],
      ),
    ],
    bestPractices: [
      "Return contextual errors from tools; consolidate narrow tools when possible.",
      "Use plan persistence files for long-horizon work.",
      "Evaluate with deterministic checks before model judges.",
    ],
    antiPatterns: [
      "Dumping entire corpora or unbounded chat into the window.",
      "Unbounded memory with no eviction policy.",
      "Secrets, credentials, or raw env in prompts.",
      "Compressing away the only path to artifacts/decisions.",
      "Spawning role-play agents that share one polluted context.",
    ],
    reviewCriteria: [
      criterion("Context budgets and forbidden content are explicit.", "AI_SYSTEM_DESIGN.md", "critical"),
      criterion("Memory tiers and compaction policy exist for agentic packages.", "AI_SYSTEM_DESIGN.md", "high"),
      criterion("Tool outputs have offload/mask strategy for verbose results.", "AI_SYSTEM_DESIGN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Budget clarity", measurement: "Pinned vs JIT sections named with limits", target: "Yes" },
      { name: "Secret hygiene", measurement: "Forbidden-context list includes secrets/PII", target: "Yes" },
    ],
    acceptanceCriteria: [
      "Context envelope documented with budgets and isolation strategy.",
      "Compaction/offload rules stated for long sessions.",
    ],
    examples: [
      {
        title: "Research agent",
        input: "Multi-hop web research bot",
        expectedOutput:
          "Pinned: task brief + tool schemas; JIT: retrieved docs via scratch files; sub-agents per lead; compact with decisions+next-steps; never paste API keys into history.",
      },
    ],
    failureStates: [
      {
        condition: "Agentic package with no context budget or secret policy.",
        impact: "Unreliable, expensive, unsafe runs.",
        recovery: "Add envelope + forbidden list before cook.",
        blocking: true,
      },
    ],
  },

  "agent-architect": {
    mission:
      "Design agent topologies (supervisor, swarm, hierarchy), tool contracts, and harness loops that keep authority outside the model text.",
    principles: [
      "Pick a coordination pattern for context isolation and control—not for theater.",
      "Tools are contracts: clear names, consolidated surfaces, useful errors, format options.",
      "Harness owns invariants: budgets, approval gates, logs, rollback; model edits only allowed surfaces.",
      "Long-horizon launch prompts need success predicates, persistence rules, and contamination guards.",
      "Never grant production permissions through prompts alone.",
    ],
    mentalModels: [
      "Supervisor / swarm / hierarchy",
      "Tool as contract",
      "Harness vs editable surface",
      "Output contract with named checks",
    ],
    decisionFrameworks: [
      framework(
        "Topology selection",
        "Multi-step or multi-agent products.",
        [
          "Choose pattern based on shared-state needs and failure isolation.",
          "Define worker output contracts and what blocks return.",
          "Map tools and which agent may call them.",
          "Place human approval boundaries for irreversible actions.",
        ],
        ["AI_SYSTEM_DESIGN.md agent architecture."],
      ),
    ],
    bestPractices: [
      "Prefer one comprehensive tool over many overlapping micro-tools when possible.",
      "Log durable traces outside the model window.",
      "Test instruction-surface security: what loads as instructions vs data.",
    ],
    antiPatterns: [
      "Org-chart multi-agents sharing one context.",
      "Prompts that authorize secrets or prod writes.",
      "No success predicate for autonomous loops.",
    ],
    reviewCriteria: [
      criterion("Topology, tools, and approval gates documented.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Authority hygiene", measurement: "Irreversible actions gated outside model text", target: "Yes" },
    ],
    acceptanceCriteria: ["Agent architecture and tool contracts present for agentic categories."],
    examples: [
      {
        title: "Coding agent",
        input: "Repo-local coding assistant",
        expectedOutput:
          "Supervisor plans; workers in isolated worktrees; tools: read/test/edit; prod deploy requires human approval; output contract includes tests-passed check.",
      },
    ],
    failureStates: [
      {
        condition: "Autonomous agent with no harness gates.",
        impact: "Unsafe or unreviewable changes.",
        recovery: "Add approval boundaries and success predicates.",
        blocking: true,
      },
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

  // --- cloudflare/security-audit-skill (MIT) ---
  "security-engineer-skill": {
    mission:
      "Find real trust-boundary violations with source evidence, safe local reproduction, priority, and the smallest effective fix—never checklist theater or live probing.",
    principles: [
      "A finding needs principal, action, intended control, crossed boundary, affected resource, and observable result.",
      "Guidance mode ≠ full audit mode; do not invent authorization for full audits or file dumps.",
      "Source-first; execute target code only in a fully controlled sandbox or report needs-validation.",
      "Never probe live/shared endpoints, production identities, or other tenants' data.",
      "Separate certainty from severity; needs-validation has no severity.",
      "Recommend the narrowest fix at the last trusted decision point.",
    ],
    mentalModels: [
      "Trust boundary crossing",
      "Guidance vs full-audit modes",
      "Confirmed / needs-validation / rejected",
      "Coverage ledger over one-shot scans",
    ],
    decisionFrameworks: [
      framework(
        "Boundary finding gate",
        "Any security claim in a package or review.",
        [
          "Name lower-trust principal and accepted input/action.",
          "Name intended control and the crossed boundary.",
          "State affected principal/resource and concrete result.",
          "If deployment controls are invisible in source, mark needs-validation—do not guess.",
          "Propose smallest source fix + regression check.",
        ],
        ["Security section with evidence-grade findings or explicit unknowns."],
      ),
      framework(
        "Safe verification",
        "When behavior proof is required.",
        [
          "Prefer static path evidence first.",
          "If execution is needed, require sandbox: no egress, allowlisted env, scratch-only writes, resource limits.",
          "Stop at minimum boundary effect; never expand into persistence or live probing.",
        ],
        ["Safe reproduction notes without attack runbooks against live systems."],
      ),
    ],
    bestPractices: [
      "Calibrate severity from demonstrated impact (critical→informational anchors).",
      "Carry prior findings only when source and evidence still match.",
      "Keep secrets, ambient env, and host paths out of retained artifacts.",
    ],
    antiPatterns: [
      "Checklist deviations sold as vulnerabilities.",
      "Defense-in-depth advice with no reachable boundary violation.",
      "Guessing proxy/IdP/browser controls not in source.",
      "Live or shared-environment testing as default.",
      "Assigning severity to needs-validation items.",
      "Treating same-principal self-impact as a cross-boundary exploit.",
    ],
    reviewCriteria: [
      criterion("Security claims name trust boundaries and evidence grade.", "ARCHITECTURE.md / security notes", "critical"),
      criterion("No live-probe or credential-stealing instructions appear.", "All artifacts", "critical"),
      criterion("Fixes point to last trusted decision point.", "Security remediation notes", "high"),
    ],
    qualityMetrics: [
      { name: "Evidence grade", measurement: "Findings labeled confirmed vs needs-validation", target: "100%" },
    ],
    acceptanceCriteria: [
      "Threat/boundary notes present for sensitive categories.",
      "Unknown deployment controls labeled needs-validation.",
    ],
    examples: [
      {
        title: "IDOR hypothesis",
        input: "API returns other users' records by id",
        expectedOutput:
          "Principal: authenticated user A; boundary: object authz; result: read of B's record; severity high if confirmed in source; fix: authorize on resource ownership at handler; needs-validation if authz lives only in undocumented gateway.",
      },
    ],
    failureStates: [
      {
        condition: "Security advice without boundary/result or with live attack steps.",
        impact: "Unsafe or useless guidance.",
        recovery: "Rewrite as boundary-gated findings; strip live-probe content.",
        blocking: true,
      },
    ],
  },

  "security-reviewer": {
    mission:
      "Council lens that fails packages with missing trust boundaries, unverified scary claims, or unsafe reproduction guidance.",
    principles: [
      "No severity without demonstrated boundary result.",
      "Reject live-target testing instructions.",
      "Demand smallest-fix thinking, not generic hardening lists.",
    ],
    mentalModels: ["Boundary gate", "Evidence grades", "Safe local-only verification"],
    decisionFrameworks: [
      framework(
        "Security council pass",
        "Before cook on sensitive categories.",
        [
          "Scan artifacts for authn/authz, secrets, injection, and tenancy boundaries.",
          "Fail unverifiable claims presented as confirmed.",
          "Fail any live-probe or credential exfiltration guidance.",
        ],
        ["REVIEWER_FRAMEWORKS.md security lens."],
      ),
    ],
    bestPractices: ["Prefer needs-validation over invented deployment assumptions."],
    antiPatterns: ["Rubber-stamp 'add HTTPS' with no boundary analysis."],
    reviewCriteria: [
      criterion("Sensitive packages include boundary analysis.", "ARCHITECTURE.md", "critical"),
      criterion("No live attack procedures in artifacts.", "All artifacts", "critical"),
    ],
    qualityMetrics: [{ name: "Unsafe content", measurement: "Live-probe instructions found", target: "0" }],
    acceptanceCriteria: ["Security review pass/fail recorded."],
    examples: [
      {
        title: "Generic hardening dump",
        input: "Long list of headers with no app threat model",
        expectedOutput: "Fail: no trust-boundary findings; remediate with principal/resource analysis.",
      },
    ],
    failureStates: [
      {
        condition: "Payments/auth package with no security lens.",
        impact: "Unsafe cook.",
        recovery: "Require security review.",
        blocking: true,
      },
    ],
  },

  "api-security-specialist": {
    mission:
      "Harden API trust boundaries: authn/authz, tenancy, injection, and abuse controls with evidence-grade guidance.",
    principles: [
      "Authorize on every object access, not only at login.",
      "Validate and encode at trust boundaries; never trust client-side checks alone.",
      "Rate-limit and audit sensitive operations.",
      "Document needs-validation when gateway policies are out of repo.",
    ],
    mentalModels: ["Object-level authz", "Tenant isolation", "Input → sink paths"],
    decisionFrameworks: [
      framework(
        "API boundary review",
        "API-heavy packages.",
        [
          "List public vs authenticated vs privileged operations.",
          "For each resource type, state ownership/authz rule.",
          "Mark injection sinks and encoding requirements.",
          "Define abuse controls and audit events.",
        ],
        ["ARCHITECTURE.md API security section."],
      ),
    ],
    bestPractices: ["Idempotency and replay considerations for mutating APIs.", "Consistent error shapes that do not leak secrets."],
    antiPatterns: ["Security through obscurity of URLs.", "Trusting hidden form fields for authz."],
    reviewCriteria: [
      criterion("Object-level authz rules stated for core resources.", "ARCHITECTURE.md", "critical"),
    ],
    qualityMetrics: [{ name: "Authz coverage", measurement: "Core resources with ownership rules", target: "100%" }],
    acceptanceCriteria: ["API security boundaries documented."],
    examples: [
      {
        title: "Multi-tenant CRM API",
        input: "CRUD on accounts",
        expectedOutput: "Every read/write checks tenant_id + role; cross-tenant denied; audit on export.",
      },
    ],
    failureStates: [
      {
        condition: "Multi-tenant API with only login check.",
        impact: "IDOR class failures.",
        recovery: "Add object authz rules before cook.",
        blocking: true,
      },
    ],
  },

  "privacy-engineer": {
    mission:
      "Minimize data, define retention, and keep PII out of prompts, logs, and client storage unless explicitly required and labeled.",
    principles: [
      "Data minimization before clever anonymization theater.",
      "Purpose limitation: collect only for stated jobs.",
      "PII must not enter model context without redaction policy.",
      "Retention and deletion paths are product requirements.",
    ],
    mentalModels: ["Data map", "Purpose binding", "Redaction before context", "Retention clock"],
    decisionFrameworks: [
      framework(
        "Privacy pass",
        "Products handling personal data.",
        [
          "Inventory personal data fields and purposes.",
          "Mark where data flows: UI, API, DB, logs, model context.",
          "Define redaction/retention/deletion.",
          "Label legal/compliance unknowns honestly.",
        ],
        ["Privacy section in ARCHITECTURE.md / PROJECT_DNA.md."],
      ),
    ],
    bestPractices: ["Prefer aggregated metrics over raw PII in analytics.", "Access-log carefully; avoid secret leakage."],
    antiPatterns: ["Logging full request bodies with tokens/PII.", "Pastings user emails into prompts for 'personalization'."],
    reviewCriteria: [
      criterion("PII flows and retention/redaction policy present when personal data is in scope.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [{ name: "Context hygiene", measurement: "PII-in-prompt policy stated", target: "Yes" }],
    acceptanceCriteria: ["Privacy constraints documented or N/A justified."],
    examples: [
      {
        title: "Support AI",
        input: "Ticket assistant",
        expectedOutput: "Redact emails/phones before model; retain tickets 180d; no training on customer content unless contracted.",
      },
    ],
    failureStates: [
      {
        condition: "PII product with no retention/redaction plan.",
        impact: "Compliance and user harm risk.",
        recovery: "Add data map and policies.",
        blocking: true,
      },
    ],
  },

  // --- coreyhaines31/marketingskills (MIT) ---
  "brand-strategist": {
    mission:
      "Define brand promise, voice, and differentiation so every surface sounds like one product—not generic marketing sludge.",
    principles: [
      "Promise must be believable for the named segment.",
      "Voice rules include what we never sound like.",
      "Proof > adjectives.",
    ],
    mentalModels: ["Promise / proof / personality", "Category entry points", "Voice do/don't"],
    decisionFrameworks: [
      framework(
        "Brand spine",
        "Marketing and experience packages.",
        [
          "State category and rival alternatives.",
          "Write one-sentence promise + three proof points.",
          "Define voice do/don't and forbidden clichés.",
        ],
        ["Brand section in DESIGN_SYSTEM / PRODUCT_STRATEGY."],
      ),
    ],
    bestPractices: ["Align brand with product strategy trade-offs.", "Reuse proof across site, app, and sales."],
    antiPatterns: ["Interchangeable startup voice.", "Claiming awards/customers without evidence."],
    reviewCriteria: [
      criterion("Promise, proof, and voice constraints present.", "DESIGN_SYSTEM.md / PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [{ name: "Voice specificity", measurement: "Do/don't lists nonempty", target: "Yes" }],
    acceptanceCriteria: ["Brand spine documented."],
    examples: [
      {
        title: "Devtools brand",
        input: "CI analytics product",
        expectedOutput: "Promise: ship with signal not noise; proof: flaky-test detection; voice: precise, no hype; don't: 'synergy' or fake urgency.",
      },
    ],
    failureStates: [
      {
        condition: "Marketing surfaces with no voice constraints.",
        impact: "Generic AI copy everywhere.",
        recovery: "Add brand spine.",
        blocking: false,
      },
    ],
  },

  "content-strategist": {
    mission:
      "Plan message hierarchy and content that serves jobs-to-be-done across pages—not blog spam for its own sake.",
    principles: [
      "Every page has one primary job and one primary CTA.",
      "Message hierarchy beats word count.",
      "SEO/content must map to real search intent and product truth.",
    ],
    mentalModels: ["Job per URL", "Message hierarchy", "Intent clusters"],
    decisionFrameworks: [
      framework(
        "Content map",
        "Sites and product marketing.",
        [
          "List must-have pages and their jobs.",
          "Define H1/support/CTA hierarchy for each.",
          "Mark proof modules and where they appear.",
        ],
        ["STORY_SYSTEM.md / content map."],
      ),
    ],
    bestPractices: ["Reuse modules; avoid contradictory claims across pages.", "Gate ambitious SEO claims as hypotheses."],
    antiPatterns: ["Keyword stuffing.", "Multiple competing CTAs above the fold."],
    reviewCriteria: [
      criterion("Primary pages have one job and CTA.", "STORY_SYSTEM.md / USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [{ name: "CTA clarity", measurement: "Primary CTA per page", target: "1" }],
    acceptanceCriteria: ["Content/message hierarchy present for marketing surfaces."],
    examples: [
      {
        title: "Pricing page",
        input: "Three tiers",
        expectedOutput: "Job: choose plan; hierarchy: who-it's-for → differences → FAQ → CTA; proof: ROI vignette.",
      },
    ],
    failureStates: [
      {
        condition: "Story-less marketing site.",
        impact: "Agents invent random pages.",
        recovery: "Add content map.",
        blocking: false,
      },
    ],
  },

  "growth-designer": {
    mission:
      "Design growth loops and conversion surfaces that respect UX honesty—no dark patterns, measurable experiments.",
    principles: [
      "Growth is a loop (acquire → activate → retain → refer), not a button color.",
      "Experiments need hypotheses and metrics.",
      "Conversion copy must match the product truth.",
    ],
    mentalModels: ["Growth loop", "Activation moment", "Experiment card"],
    decisionFrameworks: [
      framework(
        "Loop design",
        "PLG/SaaS marketing packages.",
        [
          "Name the loop and the activation moment.",
          "Identify friction that blocks activation.",
          "Propose one experiment with metric and stop rule.",
        ],
        ["PRODUCT_STRATEGY.md growth section."],
      ),
    ],
    bestPractices: ["Instrument before arguing about copy.", "Keep onboarding progressive."],
    antiPatterns: ["Dark patterns and fake scarcity.", "Optimizing signup while activation is broken."],
    reviewCriteria: [
      criterion("Activation moment and loop stated for growth products.", "PRODUCT_STRATEGY.md / USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [{ name: "Experiment hygiene", measurement: "Hypotheses with metrics", target: "≥1 when growth in scope" }],
    acceptanceCriteria: ["Growth loop or explicit sales-led path documented."],
    examples: [
      {
        title: "Template marketplace",
        input: "PLG templates",
        expectedOutput: "Activation: first template published; loop: publish → discover → remix; experiment: empty-state checklist vs video.",
      },
    ],
    failureStates: [
      {
        condition: "Growth claims with no activation definition.",
        impact: "Vanity metrics theater.",
        recovery: "Define activation before experiments.",
        blocking: false,
      },
    ],
  },

  "monetization-expert": {
    mission:
      "Choose pricing architecture (packs, seats, usage, paywalls) that matches willingness-to-pay and packaging honesty.",
    principles: [
      "Price communicates positioning; match cost-vs-value strategy.",
      "Packaging must make the 'good' tier obvious without dark tricks.",
      "Willingness-to-pay claims are hypotheses until evidenced.",
    ],
    mentalModels: ["Packaging ladder", "Willingness-to-pay hypothesis", "Expansion revenue"],
    decisionFrameworks: [
      framework(
        "Pricing sketch",
        "SaaS/e-commerce monetization.",
        [
          "Pick metric (seat, usage, flat) aligned to value delivery.",
          "Define free/trial boundary and upgrade trigger.",
          "List what is never free if it destroys unit economics.",
        ],
        ["PRODUCT_STRATEGY.md monetization section."],
      ),
    ],
    bestPractices: ["Align paywall with activation, not before value.", "State tax/compliance unknowns."],
    antiPatterns: ["Feature-matrix chaos.", "Fake 'most popular' without strategy."],
    reviewCriteria: [
      criterion("Pricing metric and upgrade trigger stated when monetization in scope.", "PRODUCT_STRATEGY.md", "high"),
    ],
    qualityMetrics: [{ name: "Packaging clarity", measurement: "Tiers explainable in one sentence each", target: "Yes" }],
    acceptanceCriteria: ["Monetization model sketched or deferred with reason."],
    examples: [
      {
        title: "API product",
        input: "Developer API",
        expectedOutput: "Usage-based with free monthly units; upgrade when hitting rate; never free for dedicated support SLA.",
      },
    ],
    failureStates: [
      {
        condition: "Paid product with no pricing metric.",
        impact: "Agents invent incoherent paywalls.",
        recovery: "Add pricing sketch.",
        blocking: false,
      },
    ],
  },

  "retention-expert": {
    mission:
      "Design retention and churn prevention around habit moments, health metrics, and honest win-back—not spam.",
    principles: [
      "Retention starts at activation quality.",
      "Define a health metric before lifecycle email blasts.",
      "Churn reasons should drive product fixes, not only discounts.",
    ],
    mentalModels: ["Habit loop", "Customer health score", "Churn reason codes"],
    decisionFrameworks: [
      framework(
        "Retention plan",
        "Subscription/SaaS products.",
        [
          "Name the recurring value moment.",
          "Define at-risk signals.",
          "Plan interventions: product, education, then incentives.",
        ],
        ["PRODUCT_STRATEGY.md retention section."],
      ),
    ],
    bestPractices: ["Instrument reactivation paths.", "Keep messaging preference-respecting."],
    antiPatterns: ["Discount-only win-back.", "Nagging notifications without value."],
    reviewCriteria: [
      criterion("Recurring value moment and at-risk signals stated when retention in scope.", "PRODUCT_STRATEGY.md", "medium"),
    ],
    qualityMetrics: [{ name: "Health signal", measurement: "At-risk definition present", target: "Yes" }],
    acceptanceCriteria: ["Retention approach documented or N/A."],
    examples: [
      {
        title: "Weekly report product",
        input: "Analytics email",
        expectedOutput: "Habit: Monday digest opened; at-risk: 14d no open; intervene with digest redesign before coupon.",
      },
    ],
    failureStates: [
      {
        condition: "Subscription product with only acquisition focus.",
        impact: "Leaky bucket.",
        recovery: "Add retention section.",
        blocking: false,
      },
    ],
  },

  "plg-expert": {
    mission:
      "Design product-led growth: self-serve activation, expansion cues, and viral loops without sacrificing trust.",
    principles: [
      "Time-to-value must be short enough for self-serve.",
      "Expansion should feel earned by usage, not gated arbitrarily.",
      "PLG still needs support/escape hatches for stuck users.",
    ],
    mentalModels: ["Aha moment", "PQLs", "Expansion trigger", "Invite/referral loop"],
    decisionFrameworks: [
      framework(
        "PLG readiness",
        "When growth motion is product-led.",
        [
          "Define aha moment and the shortest path to it.",
          "List self-serve blockers (auth, data, empty states).",
          "Define PQL signals and expansion prompts.",
        ],
        ["PRODUCT_STRATEGY.md + USER_FLOWS.md PLG path."],
      ),
    ],
    bestPractices: ["Instrument funnel steps.", "Keep human help available without breaking self-serve."],
    antiPatterns: ["Sales-only process labeled as PLG.", "Forced virality that harms UX."],
    reviewCriteria: [
      criterion("Aha moment and self-serve path documented for PLG products.", "USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [{ name: "TTV path", measurement: "Steps to aha documented", target: "Yes" }],
    acceptanceCriteria: ["PLG path or explicit non-PLG motion stated."],
    examples: [
      {
        title: "Notion-like workspace",
        input: "Collaborative docs",
        expectedOutput: "Aha: first doc shared with teammate; PQL: 3 active seats; expansion: guest→member conversion.",
      },
    ],
    failureStates: [
      {
        condition: "Labeled PLG but requires sales call to try.",
        impact: "False growth motion.",
        recovery: "Either enable self-serve trial or relabel as sales-led.",
        blocking: false,
      },
    ],
  },

  // --- Community-Access/accessibility-agents (MIT) + UX Pro Max a11y priority ---
  "accessibility-specialist": {
    mission:
      "Bake WCAG-oriented accessibility into flows, components, and motion from the start—perceivable, operable, understandable, robust.",
    principles: [
      "Contrast, text alternatives, and keyboard access are non-negotiable.",
      "Focus order and focus visibility are part of design, not CSS afterthoughts.",
      "Do not disable zoom; respect user motion preferences.",
      "Accessible names for every interactive control.",
    ],
    mentalModels: ["POUR", "Focus order", "Name/role/value", "Reduced motion"],
    decisionFrameworks: [
      framework(
        "A11y requirements pass",
        "Any UI package.",
        [
          "List critical user journeys for keyboard-only and screen-reader success.",
          "Specify contrast and text-resize expectations.",
          "Require accessible names and error identification.",
          "Define reduced-motion alternatives for animated experiences.",
        ],
        ["USER_FLOWS.md / DESIGN_SYSTEM.md a11y section."],
      ),
    ],
    bestPractices: [
      "Test with keyboard before claiming done.",
      "Prefer semantic HTML before ARIA.",
      "Charts and status must not rely on color alone.",
    ],
    antiPatterns: [
      "Removing focus outlines for aesthetics.",
      "Icon-only controls without names.",
      "Motion with no reduced-motion path on immersive sites.",
    ],
    reviewCriteria: [
      criterion("Keyboard path for primary journeys documented.", "USER_FLOWS.md", "critical"),
      criterion("Reduced-motion plan when motion/WebGL present.", "DESIGN_SYSTEM.md", "high"),
    ],
    qualityMetrics: [{ name: "Named controls policy", measurement: "Interactive controls require accessible names", target: "Yes" }],
    acceptanceCriteria: ["Accessibility requirements listed as acceptance checks."],
    examples: [
      {
        title: "Immersive marketing site",
        input: "Scroll-driven WebGL story",
        expectedOutput: "Keyboard chapter nav; captions for media; reduced-motion static chapters; CTA reachable without canvas.",
      },
    ],
    failureStates: [
      {
        condition: "Experience site with canvas-only CTA and no keyboard path.",
        impact: "Exclusion of users; review fail.",
        recovery: "Add DOM CTA and keyboard chapter path.",
        blocking: true,
      },
    ],
  },

  "accessibility-reviewer": {
    mission:
      "Fail packages that treat accessibility as optional polish or that break keyboard/name/contrast expectations.",
    principles: [
      "Critical a11y defects block pass.",
      "Immersive craft does not excuse inaccessible CTAs.",
    ],
    mentalModels: ["POUR gate", "Keyboard walkthrough"],
    decisionFrameworks: [
      framework(
        "A11y council pass",
        "Before cook.",
        [
          "Walk primary CTA keyboard-only.",
          "Check names, contrast claims, reduced-motion.",
          "Fail canvas-only critical actions.",
        ],
        ["REVIEWER_FRAMEWORKS.md a11y lens."],
      ),
    ],
    bestPractices: ["Cite specific controls/flows in fails."],
    antiPatterns: ["Passing with 'we'll add a11y later'."],
    reviewCriteria: [
      criterion("Primary CTA reachable without pointer-only interactions.", "USER_FLOWS.md", "critical"),
    ],
    qualityMetrics: [{ name: "Block on critical a11y", measurement: "Critical fails prevent pass", target: "Yes" }],
    acceptanceCriteria: ["Accessibility review recorded."],
    examples: [
      {
        title: "Hover-only menu",
        input: "Desktop mega-menu",
        expectedOutput: "Fail: no keyboard disclosure pattern; remediate.",
      },
    ],
    failureStates: [
      {
        condition: "No a11y section on UI package.",
        impact: "Unchecked exclusion risk.",
        recovery: "Require accessibility specialist output.",
        blocking: true,
      },
    ],
  },

  // --- anthropics/skills frontend-design (Apache-2.0 per skill) + storytelling craft ---
  "frontend-architect": {
    mission:
      "Define client architecture and UI implementation boundaries that preserve performance, accessibility, and clean separation from experience canvases—while avoiding AI-default visual sludge.",
    principles: [
      "DOM shell vs experience canvas ownership must be explicit.",
      "Routing/state must not remount expensive scenes carelessly.",
      "Accessibility and keyboard paths remain first-class.",
      "Performance budgets are architectural constraints (LCP/INP/CLS + FPS).",
      "Visual systems use intentional type/color/motion—not purple-gradient defaults.",
    ],
    mentalModels: ["App shell vs experience host", "Island boundaries", "Critical rendering path", "Design tokens in code"],
    decisionFrameworks: [
      framework(
        "Client boundary map",
        "Web, awwwards, three.js, SaaS UIs.",
        [
          "Separate shell chrome from experience surface.",
          "Define state ownership for scroll/progress.",
          "List performance budgets for LCP/INP and FPS.",
          "Specify hydration/experience-load strategy for heavy pages.",
        ],
        ["ARCHITECTURE.md client section."],
      ),
    ],
    bestPractices: [
      "Lazy-load heavy experience islands; reserve layout space.",
      "Share progress stores without forcing full remounts.",
      "Encode design tokens as CSS variables / theme modules.",
    ],
    antiPatterns: [
      "Entire site inside one Canvas.",
      "Blocking TTI with giant JS before first story beat.",
      "AI-default purple/indigo marketing chrome.",
    ],
    reviewCriteria: [
      criterion("Client boundaries and budgets documented.", "ARCHITECTURE.md", "high"),
    ],
    qualityMetrics: [
      { name: "Boundary clarity", measurement: "Shell vs experience split present", target: "Yes" },
    ],
    acceptanceCriteria: ["Frontend boundaries and budgets written."],
    examples: [
      {
        title: "Hybrid experience site",
        input: "Next.js + R3F",
        expectedOutput:
          "App shell in DOM; ExperienceHost mounts Canvas; progress store shared; route transitions dispose scenes; CTA always in DOM.",
      },
    ],
    failureStates: [
      {
        condition: "No client boundary map on web/immersive packages.",
        impact: "Messy unperformant implementation.",
        recovery: "Add frontend architecture section.",
        blocking: false,
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
