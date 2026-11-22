import type { SkillPackage } from "./types.ts";
import { DISTILLED_DEPTH } from "./skill-depth-distilled.ts";
import { WEBGL_DISTILLED_DEPTH } from "./skill-depth-webgl.ts";

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

const GENERIC_PRINCIPLE = "Separate confirmed facts from inferences.";

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

/** Elite craft bodies for creative + WebGL skills (and a few core anchors). */
export const SKILL_DEPTH: Record<string, DepthPatch> = {
  "creative-director": {
    mission:
      "Set a distinctive creative north star—concept, craft bar, and rejection criteria—so agents build memorable experiences instead of template sites.",
    principles: [
      "One bold idea beats ten polite decorations.",
      "Brand and atmosphere must read in the first viewport without the nav.",
      "Motion and spatial craft are part of the product, not polish at the end.",
      "Reject AI-default aesthetics: purple gradients, cream-serif terracotta, generic card grids.",
      "Label taste hypotheses; never claim awards or references as facts without evidence.",
    ],
    mentalModels: [
      "Hero as one composition",
      "Craft budget (what must be extraordinary vs merely clean)",
      "Reference → principles → constraints (never clone)",
      "Distinctiveness test: would this still feel branded if the logo were removed?",
    ],
    decisionFrameworks: [
      framework(
        "Creative north star",
        "Any immersive, brand, or Awwwards-class brief.",
        [
          "Extract the emotional promise from the brief (awe, precision, play, menace, calm).",
          "Write one sentence creative concept and three non-negotiable craft rules.",
          "List forbidden patterns (cards-in-hero, stock layouts, fake 3D, emoji clusters).",
          "Define what 'done' looks like for first viewport, scroll chapters, and exit CTA.",
        ],
        ["A creative brief agents can execute without inventing a new concept mid-build."],
      ),
      framework(
        "Reference digestion",
        "Brief cites studios or sites (e.g. Active Theory).",
        [
          "Name the reference as a hypothesis, not a requirement to copy.",
          "Break it into transferable principles: scroll theater, shader accents, sound, pacing.",
          "Translate principles into measurable constraints (scene count, frame budget, type scale).",
        ],
        ["Reference-informed constraints with provenance labeled inferred."],
      ),
    ],
    bestPractices: [
      "Lead with atmosphere and a single dominant visual plane.",
      "Specify type families with purpose (display vs UI), not 'system font'.",
      "Require at least 2–3 intentional motion moments with timing language.",
      "Pair creative ambition with performance and accessibility stop conditions.",
    ],
    antiPatterns: [
      "Dashboard-looking first viewport on a marketing/experience site.",
      "Card grids, pill clusters, and stat strips as the hero.",
      "Calling something 'Awwwards-level' without craft constraints.",
      "Fake WebGL (CSS-only flair) when the brief demands immersive 3D.",
    ],
    reviewCriteria: [
      criterion(
        "Creative concept is stated in one clear sentence with craft non-negotiables.",
        "DESIGN_SYSTEM.md and MASTER_SKILL_PACKAGE.md cite concept + forbidden patterns.",
        "critical",
      ),
      criterion(
        "First-viewport composition rules are explicit (brand, headline, CTA, dominant visual).",
        "DESIGN_SYSTEM.md hero rules section is concrete.",
        "high",
      ),
    ],
    qualityMetrics: [
      {
        name: "Distinctiveness specificity",
        measurement: "Count of concrete craft constraints vs vague adjectives.",
        target: "≥8 concrete constraints in design/motion artifacts",
      },
    ],
    acceptanceCriteria: [
      "Creative concept, forbidden patterns, and first-viewport rules are written.",
      "Reference inspiration is labeled hypothesis when used.",
      "No claim of award status without evidence.",
    ],
    examples: [
      {
        title: "Active Theory–class brief",
        input: "Awwwards site like activetheory.net",
        expectedOutput:
          "Concept: immersive scroll theater with WebGL chapters. Rules: full-bleed scenes, shader accents, no card hero, 60fps budget, branded type. Forbidden: template SaaS layout.",
      },
    ],
    failureStates: [
      {
        condition: "Brief is immersive but package only contains generic SaaS design advice.",
        impact: "Agents produce mediocre marketing sites.",
        recovery: "Recompose with creative + WebGL skills and immersive blueprints.",
        blocking: true,
      },
    ],
  },
  "art-director": {
    mission:
      "Translate creative direction into a concrete visual system: type, color, space, composition, and material language agents can implement.",
    principles: [
      "Every visual decision needs a token or rule, not a vibe word alone.",
      "Composition hierarchy beats decoration.",
      "Materials and lighting language must match the medium (2D, WebGL, hybrid).",
      "Accessibility contrast is part of art direction, not a later patch.",
    ],
    mentalModels: [
      "Token → component → scene",
      "Focal point vs support plane",
      "Quiet UI chrome / loud experience canvas",
    ],
    decisionFrameworks: [
      framework(
        "Visual system lock",
        "Before implementation of an experience site.",
        [
          "Define display + UI type pairing and scale steps.",
          "Define color roles (atmosphere, action, signal) with contrast targets.",
          "Define spacing rhythm and edge-to-edge vs inset rules.",
          "Specify material/lighting notes for WebGL or motion surfaces.",
        ],
        ["Implementable DESIGN_SYSTEM.md visual section."],
      ),
    ],
    bestPractices: [
      "Name fonts and weights; avoid default Inter/Roboto/Arial stacks for branded heroes.",
      "Document dark/light atmospheric bases without defaulting to purple glow clichés.",
      "Provide do/don't composition sketches in words (full-bleed vs inset card).",
    ],
    antiPatterns: [
      "Purple-on-white AI-default theme.",
      "Warm cream + terracotta serif cliché as lazy 'premium'.",
      "Rounded card collage instead of one composition.",
    ],
    reviewCriteria: [
      criterion(
        "Type, color, space, and composition rules are concrete enough to implement.",
        "DESIGN_SYSTEM.md lists tokens/rules with values or clear ranges.",
      ),
    ],
    qualityMetrics: [
      {
        name: "Visual rule density",
        measurement: "Named tokens/rules in design artifact",
        target: "Type + color + space + composition all present",
      },
    ],
    acceptanceCriteria: [
      "Visual system covers type, color, space, composition.",
      "Forbidden visual clichés are listed.",
    ],
    examples: [
      {
        title: "Immersive portfolio art direction",
        input: "Dark atmospheric WebGL agency site",
        expectedOutput:
          "Display face for brand wordmark, tight UI sans for chrome, near-black atmosphere, single accent, full-bleed canvas, no floating cards in hero.",
      },
    ],
    failureStates: [
      {
        condition: "Only adjectives like 'bold' and 'modern' with no tokens.",
        impact: "Inconsistent or generic UI.",
        recovery: "Require tokenized visual system before acceptance.",
        blocking: true,
      },
    ],
  },
  "motion-director": {
    mission:
      "Define motion language, timing, and scroll theater so movement feels authored—not random easing on every element.",
    principles: [
      "Motion has a grammar: enter, sustain, transform, exit.",
      "Fewer stronger motions beat constant micro-animation noise.",
      "Scroll position is a timeline director for immersive sites.",
      "Respect reduced-motion and provide non-motion equivalents.",
    ],
    mentalModels: [
      "Scroll as timeline",
      "Easing as character",
      "Choreography budget (2–3 signature moments)",
    ],
    decisionFrameworks: [
      framework(
        "Motion language sheet",
        "Any Awwwards or Three.js experience.",
        [
          "Name 2–3 signature motion moments tied to narrative beats.",
          "Specify duration ranges, easing character, and what stays still.",
          "Map scroll chapters to motion ownership (GSAP vs camera vs shader).",
          "Define reduced-motion fallback for each signature moment.",
        ],
        ["Motion section agents can implement without inventing random animation."],
      ),
    ],
    bestPractices: [
      "Prefer timeline ownership over scattered CSS transitions.",
      "Sync camera, object, and UI motion to the same beat grid.",
      "Cap simultaneous animated properties under a performance budget.",
    ],
    antiPatterns: [
      "Animating everything that scrolls into view.",
      "Bounce/elastic gimmicks on serious brand work.",
      "Ignoring prefers-reduced-motion.",
    ],
    reviewCriteria: [
      criterion(
        "Signature motions and reduced-motion fallbacks are specified.",
        "DESIGN_SYSTEM.md or USER_FLOWS.md includes motion language.",
      ),
    ],
    qualityMetrics: [
      {
        name: "Signature motion count",
        measurement: "Documented authored motion moments",
        target: "2–5 with timing notes",
      },
    ],
    acceptanceCriteria: [
      "Motion language sheet exists with timing and fallbacks.",
      "Scroll theater chapters are named when immersive.",
    ],
    examples: [
      {
        title: "Scroll theater",
        input: "Multi-scene WebGL portfolio",
        expectedOutput:
          "Chapter 1: camera dolly 1.2s ease-in-out; Chapter 2: shader dissolve; Chapter 3: UI chrome fades in. Reduced motion: static chapter art + fade.",
      },
    ],
    failureStates: [
      {
        condition: "No motion language on an immersive category package.",
        impact: "Lifeless or chaotic motion implementation.",
        recovery: "Block acceptance until motion sheet exists.",
        blocking: true,
      },
    ],
  },
  "brand-strategist": {
    mission:
      "Align brand meaning, voice, and positioning so the experience says one clear thing.",
    principles: [
      "Brand is a promise + proof, not a logo dump.",
      "Voice rules must be usable in UI copy and motion captions.",
      "Differentiation must be falsifiable (what we are not).",
    ],
    mentalModels: ["Promise–proof–personality", "Competitive contrast pairs"],
    decisionFrameworks: [
      framework(
        "Brand spine",
        "Marketing, portfolio, or product brand experiences.",
        [
          "Write promise in one line.",
          "List three proof points the site must show, not tell.",
          "Define voice do/don't.",
          "State who we are not.",
        ],
        ["Brand spine embedded in strategy + content guidance."],
      ),
    ],
    bestPractices: ["Tie brand proof to interactive demonstrations when possible."],
    antiPatterns: ["Generic 'innovation/excellence' copy with no proof surface."],
    reviewCriteria: [
      criterion("Brand promise and voice constraints are explicit.", "PRODUCT_STRATEGY.md / content sections."),
    ],
    qualityMetrics: [
      { name: "Promise clarity", measurement: "One-line promise present", target: "100%" },
    ],
    acceptanceCriteria: ["Promise, proof, voice do/don't documented."],
    examples: [
      {
        title: "Studio brand",
        input: "Creative tech studio site",
        expectedOutput: "Promise: we build living digital worlds. Proof: live WebGL work. Voice: precise, bold, never cute.",
      },
    ],
    failureStates: [
      {
        condition: "No brand spine on awwwards/brand-led brief.",
        impact: "Generic marketing tone.",
        recovery: "Add brand spine before acceptance.",
        blocking: false,
      },
    ],
  },
  "storytelling-expert": {
    mission:
      "Shape narrative arcs and scroll chapters so the experience has a beginning, tension, and landing—not a pile of sections.",
    principles: [
      "Every chapter needs a job in the story.",
      "Show, then tell; interaction before brochure copy.",
      "CTA is a story landing, not a random button.",
    ],
    mentalModels: ["Scroll chapters as acts", "Hook → deepen → prove → invite"],
    decisionFrameworks: [
      framework(
        "Chapter map",
        "Long-scroll immersive sites.",
        [
          "Name 3–6 chapters with one job each.",
          "Assign primary medium per chapter (WebGL, film, UI, type).",
          "Place the primary CTA at the narrative landing.",
        ],
        ["USER_FLOWS.md chapter map."],
      ),
    ],
    bestPractices: ["Keep supporting copy short under dominant visuals."],
    antiPatterns: ["Walls of text over hero media.", "Random section order."],
    reviewCriteria: [
      criterion("Chapter map exists with jobs per chapter.", "USER_FLOWS.md"),
    ],
    qualityMetrics: [
      { name: "Chapter clarity", measurement: "Named chapters with jobs", target: "≥3" },
    ],
    acceptanceCriteria: ["Narrative chapter map present for immersive packages."],
    examples: [
      {
        title: "Studio story",
        input: "Immersive agency site",
        expectedOutput: "Act1 Arrival world → Act2 Craft proof scenes → Act3 Selected work → Act4 Invite/contact.",
      },
    ],
    failureStates: [
      {
        condition: "No chapter map on immersive brief.",
        impact: "Aimless scroll.",
        recovery: "Generate chapter map.",
        blocking: true,
      },
    ],
  },
  "threejs-architect": {
    mission:
      "Own WebGL experience architecture: scene graph, asset pipeline, memory, and frame budgets agents can follow.",
    principles: [
      "Scene graph clarity before shader fireworks.",
      "Budget frames and draw calls before adding passes.",
      "Assets are a pipeline with LODs and disposal rules.",
      "Fallback paths when WebGL is unavailable or reduced-motion is set.",
    ],
    mentalModels: [
      "Scene → object → material → pass",
      "Frame budget envelope",
      "Load → warm → interact → dispose",
    ],
    decisionFrameworks: [
      framework(
        "Experience architecture",
        "threejs-experience or immersive awwwards briefs.",
        [
          "List scenes/chapters and shared renderer.",
          "Define camera model (controlled vs free) and scroll coupling.",
          "Set target FPS and max triangles/textures per scene class.",
          "Specify asset formats, compression, and disposal on chapter exit.",
          "Define non-WebGL fallback experience.",
        ],
        ["ARCHITECTURE.md WebGL section agents can implement."],
      ),
    ],
    bestPractices: [
      "Prefer one renderer and staged scene swapping over many canvases.",
      "Keep UI in DOM when possible; use WebGL for the experience canvas.",
      "Profile on mid-tier mobile early.",
    ],
    antiPatterns: [
      "Shipping unoptimized GLTF giants.",
      "Per-section full page reloads of WebGL context.",
      "No fallback for low-power devices.",
    ],
    reviewCriteria: [
      criterion(
        "Scene inventory, frame budget, and fallback are documented.",
        "ARCHITECTURE.md immersive sections.",
        "critical",
      ),
    ],
    qualityMetrics: [
      {
        name: "Budget explicitness",
        measurement: "FPS + asset/disposal rules present",
        target: "All present",
      },
    ],
    acceptanceCriteria: [
      "Scene graph/inventory documented.",
      "Performance budget and fallback documented.",
    ],
    examples: [
      {
        title: "Multi-chapter WebGL site",
        input: "Scroll-driven studio site",
        expectedOutput:
          "Single WebGL canvas; 4 scenes; scroll drives camera; 60fps desktop / 30fps low-power; Draco GLTF; dispose on leave; CSS fallback filmstrip.",
      },
    ],
    failureStates: [
      {
        condition: "Architecture describes only Next.js+Postgres with no scene system.",
        impact: "Agents cannot build the immersive product.",
        recovery: "Replace with WebGL experience architecture.",
        blocking: true,
      },
    ],
  },
  "r3f-architect": {
    mission:
      "Structure React Three Fiber composition so scenes are declarative, reusable, and bridged cleanly to DOM UI.",
    principles: [
      "Declarative scene components with clear props contracts.",
      "Keep imperative three.js escapes isolated.",
      "Bridge scroll/UI state into R3F with a single source of truth.",
    ],
    mentalModels: ["Canvas boundary", "Scene route/chapter components", "UI↔R3F store"],
    decisionFrameworks: [
      framework(
        "R3F composition",
        "React-based WebGL experiences.",
        [
          "Define Canvas host and chapter components.",
          "Specify shared lights, environment, and post stack ownership.",
          "Define how scroll progress enters the scene.",
        ],
        ["R3F module map in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: ["Suspend/lazy heavy scenes.", "Avoid re-creating controls every render."],
    antiPatterns: ["Giant god-component Canvas files.", "Duplicating state in DOM and R3F ad hoc."],
    reviewCriteria: [
      criterion("R3F module/chapter map is present when R3F is in stack.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Module clarity", measurement: "Chapter components named", target: "≥1 per scene" },
    ],
    acceptanceCriteria: ["Canvas/chapter composition documented."],
    examples: [
      {
        title: "Chaptered R3F app",
        input: "Next.js + R3F portfolio",
        expectedOutput: "ExperienceCanvas host; SceneArrival; SceneWork; SceneContact; scroll store feeds uProgress.",
      },
    ],
    failureStates: [
      {
        condition: "Stack claims R3F but no composition map.",
        impact: "Unmaintainable scene code.",
        recovery: "Add R3F composition section.",
        blocking: true,
      },
    ],
  },
  "shader-engineer": {
    mission:
      "Specify GPU shading and effects with visual intent and performance budgets—usable recipes, not buzzwords.",
    principles: [
      "Every shader has a visual job and a cost class.",
      "Prefer a small library of proven effects over novel noise soup.",
      "Expose uniforms agents can tune (progress, intensity, palette).",
      "Degrade gracefully on low-GPU devices.",
    ],
    mentalModels: ["Effect cost tiers", "Uniform contracts", "Pass ordering"],
    decisionFrameworks: [
      framework(
        "Shader budget sheet",
        "Immersive visuals requiring custom materials or post effects.",
        [
          "List required effects (e.g. dissolve, fresnel rim, feedback trail).",
          "Assign cost tier and max instances on screen.",
          "Define uniform contract and authoring ranges.",
          "Specify mobile cull/simplify rules.",
        ],
        ["Shader budget in ARCHITECTURE.md / DESIGN_SYSTEM.md."],
      ),
    ],
    bestPractices: ["Reuse noise textures.", "Avoid overdraw-heavy fullscreen stacks without need."],
    antiPatterns: ["Unbudgeted stacked post-processing.", "One-off unreusable mega-shaders."],
    reviewCriteria: [
      criterion("Shader/effect list includes cost tiers and uniforms.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Effect specificity", measurement: "Named effects with cost tiers", target: "All listed effects tiered" },
    ],
    acceptanceCriteria: ["Shader budget sheet present when shaders are in scope."],
    examples: [
      {
        title: "Chapter dissolve",
        input: "Scene transition between works",
        expectedOutput: "Noise dissolve shader; uProgress 0–1; cost medium; disable on low-power for crossfade.",
      },
    ],
    failureStates: [
      {
        condition: "Brief needs shaders but package only says 'nice effects'.",
        impact: "Unimplementable or janky GPU work.",
        recovery: "Add shader budget sheet.",
        blocking: true,
      },
    ],
  },
  "gsap-architect": {
    mission:
      "Coordinate timeline-driven motion (including scroll) with clear ownership versus camera/shader motion.",
    principles: [
      "One orchestrator owns conflicting timelines.",
      "ScrollTrigger chapters map to narrative acts.",
      "Kill/dispose timelines on route changes.",
    ],
    mentalModels: ["Master timeline", "Scroll chapter triggers", "Motion ownership matrix"],
    decisionFrameworks: [
      framework(
        "Timeline ownership",
        "Sites with coordinated scroll/UI/WebGL motion.",
        [
          "List animations and owners (GSAP, R3F frame, CSS).",
          "Define ScrollTrigger start/end per chapter.",
          "Specify cleanup on chapter exit.",
        ],
        ["Motion orchestration map."],
      ),
    ],
    bestPractices: ["Use a shared progress signal when WebGL and DOM must sync."],
    antiPatterns: ["Multiple libraries fighting the same property.", "No cleanup → memory leaks."],
    reviewCriteria: [
      criterion("Timeline ownership matrix exists for immersive packages.", "DESIGN_SYSTEM.md / ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Ownership clarity", measurement: "Conflicting motions have a single owner", target: "100%" },
    ],
    acceptanceCriteria: ["Orchestration map present when GSAP is selected."],
    examples: [
      {
        title: "Synced scroll",
        input: "DOM captions + WebGL camera",
        expectedOutput: "GSAP ScrollTrigger publishes progress; R3F reads progress; captions tween on same progress.",
      },
    ],
    failureStates: [
      {
        condition: "GSAP selected but no orchestration notes.",
        impact: "Janky desynced motion.",
        recovery: "Add ownership matrix.",
        blocking: false,
      },
    ],
  },
  "technical-artist": {
    mission:
      "Bridge art direction and realtime constraints: lookdev targets that can actually run.",
    principles: [
      "Beauty with a budget.",
      "Author once, bake/optimize for runtime.",
      "Document material recipes artists and engineers share.",
    ],
    mentalModels: ["Lookdev vs runtime", "LOD ladder", "Material recipe cards"],
    decisionFrameworks: [
      framework(
        "Lookdev gate",
        "Before locking art for WebGL scenes.",
        [
          "Capture target stills/references as hypotheses.",
          "List materials and runtime approximations.",
          "Set poly/texture budgets per hero asset.",
        ],
        ["Art↔eng contract in package."],
      ),
    ],
    bestPractices: ["Prefer texture atlases and baked lighting where dynamic isn't needed."],
    antiPatterns: ["Offline-renderer looks promised on mobile GPUs."],
    reviewCriteria: [
      criterion("Asset budgets and material recipes exist for hero scenes.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Budgeted hero assets", measurement: "Hero assets with poly/tex limits", target: "All heroes" },
    ],
    acceptanceCriteria: ["Lookdev/runtime contract documented."],
    examples: [
      {
        title: "Hero sculpture",
        input: "Centerpiece object in arrival scene",
        expectedOutput: "≤80k tris mobile LOD; 2k textures; roughness/metal recipe; emissive accent only.",
      },
    ],
    failureStates: [
      {
        condition: "Art direction without runtime budgets.",
        impact: "Unshippable visuals.",
        recovery: "Add technical art budgets.",
        blocking: true,
      },
    ],
  },
  "rendering-engineer": {
    mission: "Own rendering pipeline fidelity vs performance tradeoffs for realtime web experiences.",
    principles: [
      "Measure GPU and CPU frame time separately.",
      "Post-process only what the creative concept needs.",
      "Resolution scaling is a feature, not a surprise.",
    ],
    mentalModels: ["Frame graph", "Cost of a pass", "Dynamic resolution"],
    decisionFrameworks: [
      framework(
        "Pipeline lock",
        "Multi-pass WebGL experiences.",
        [
          "List render passes in order.",
          "Assign ms budgets per pass class.",
          "Define DPR caps per device class.",
        ],
        ["Rendering section in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: ["Provide quality presets: high / medium / low."],
    antiPatterns: ["Unlimited DPR on mobile.", "Unaudited pass stacks."],
    reviewCriteria: [
      criterion("Pass list and device quality presets exist.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Preset coverage", measurement: "high/medium/low defined", target: "3 presets" },
    ],
    acceptanceCriteria: ["Pipeline and presets documented when rendering engineer is in graph."],
    examples: [
      {
        title: "Quality presets",
        input: "Heavy post stack",
        expectedOutput: "High: bloom+DOF; Medium: bloom only; Low: tonemap only; DPR 1.5/1.25/1.",
      },
    ],
    failureStates: [
      {
        condition: "No device presets on GPU-heavy package.",
        impact: "Thermal/jank failures.",
        recovery: "Add presets.",
        blocking: true,
      },
    ],
  },
  "post-processing-engineer": {
    mission: "Define post-process stacks that support the look without melting the frame budget.",
    principles: [
      "Each pass must earn its cost.",
      "Order matters; document it.",
      "Provide kill switches per effect.",
    ],
    mentalModels: ["Pass stack recipe", "Effect necessity test"],
    decisionFrameworks: [
      framework(
        "Post stack recipe",
        "When bloom/DOF/CA/etc. are part of the look.",
        [
          "List passes and intent.",
          "Order the stack.",
          "Mark which drop first on low-power.",
        ],
        ["Post stack section for agents."],
      ),
    ],
    bestPractices: ["Share depth/normal buffers carefully; watch bandwidth."],
    antiPatterns: ["Defaulting to every EffectComposer demo pass."],
    reviewCriteria: [
      criterion("Post stack ordered with low-power drops.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Pass intentionality", measurement: "Each pass has stated intent", target: "100%" },
    ],
    acceptanceCriteria: ["Ordered post stack with degradation path."],
    examples: [
      {
        title: "Cinematic stack",
        input: "Moody studio look",
        expectedOutput: "Render → bloom → mild CA → tonemap; drop CA then bloom on low.",
      },
    ],
    failureStates: [
      {
        condition: "Post effects mentioned with no stack recipe.",
        impact: "Uncontrolled GPU cost.",
        recovery: "Add recipe.",
        blocking: false,
      },
    ],
  },
  "product-strategist": {
    mission:
      "Frame user, problem, value, and outcomes so every downstream skill solves the same job—not a different product.",
    principles: [
      "Problem before solution aesthetics.",
      "Outcomes must be observable.",
      "Separate confirmed brief facts from inferred DNA.",
      "Scope cuts are a strategy tool.",
    ],
    mentalModels: ["Job-to-be-done", "Outcome ladder", "Assumption inventory"],
    decisionFrameworks: [
      framework(
        "Intent → DNA spine",
        "Every composition.",
        [
          "Restate vision in user-outcome language.",
          "List critical assumptions.",
          "Define success metrics hypotheses.",
          "Name what is out of scope for v1.",
        ],
        ["PROJECT_DNA.md + PRODUCT_STRATEGY.md spine."],
      ),
    ],
    bestPractices: ["Keep strategy short enough that agents actually read it."],
    antiPatterns: ["Solutionizing into a tech stack before the job is clear."],
    reviewCriteria: [
      criterion("User, problem, and outcomes are present and consistent.", "PRODUCT_STRATEGY.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Outcome clarity", measurement: "At least one observable success metric", target: "≥1" },
    ],
    acceptanceCriteria: ["Strategy spine present with outcomes and scope cuts."],
    examples: [
      {
        title: "Recruiting AI",
        input: "Enterprise AI recruiting platform",
        expectedOutput: "Job: shorten time-to-qualified shortlist; outcomes: reviewer acceptance rate; out of scope: replacing ATS wholesale in v1.",
      },
    ],
    failureStates: [
      {
        condition: "No problem/outcome framing.",
        impact: "Wandering package.",
        recovery: "Block or revise DNA.",
        blocking: true,
      },
    ],
  },
  "frontend-architect": {
    mission:
      "Define client architecture that preserves interaction integrity, performance, and clean boundaries with any WebGL canvas.",
    principles: [
      "DOM UI and experience canvas have clear ownership.",
      "Routing/state must not remount expensive scenes carelessly.",
      "Accessibility and keyboard paths remain first-class on experience sites.",
      "Performance budgets are architectural constraints.",
    ],
    mentalModels: ["App shell vs experience host", "Island boundaries", "Critical rendering path"],
    decisionFrameworks: [
      framework(
        "Client boundary map",
        "Web, awwwards, three.js, SaaS UIs.",
        [
          "Separate shell chrome from experience surface.",
          "Define state ownership for scroll/progress.",
          "List performance budgets for LCP/INP and FPS.",
        ],
        ["ARCHITECTURE.md client section."],
      ),
    ],
    bestPractices: ["Hydrate/experience-load strategy explicit for heavy pages."],
    antiPatterns: ["Putting the entire site inside one Canvas.", "Blocking TTI with giant JS before first story beat."],
    reviewCriteria: [
      criterion("Client boundaries and budgets documented.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      { name: "Boundary clarity", measurement: "Shell vs experience split present", target: "Yes" },
    ],
    acceptanceCriteria: ["Frontend boundaries and budgets written."],
    examples: [
      {
        title: "Hybrid experience site",
        input: "Next.js + R3F",
        expectedOutput: "App shell in DOM; ExperienceHost mounts Canvas; progress store shared; route transitions dispose scenes.",
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
  "performance-engineer": {
    mission:
      "Lock user-perceived performance and realtime frame budgets before craft greed destroys the experience.",
    principles: [
      "Budgets precede optimization folklore.",
      "Immersive sites need both Web Vitals and FPS budgets.",
      "Regression gates belong in the quality checklist.",
    ],
    mentalModels: ["Budget envelopes", "Critical path", "Device class targets"],
    decisionFrameworks: [
      framework(
        "Dual budget lock",
        "Any user-facing web or WebGL package.",
        [
          "Set LCP/INP/CLS targets for marketing/shell routes.",
          "Set FPS and frame-time targets for experience canvas.",
          "Define low-power degradation triggers.",
        ],
        ["Budgets in QUALITY_CHECKLIST.md and ARCHITECTURE.md."],
      ),
    ],
    bestPractices: ["Measure on real mid-tier mobile.", "Prefer eliminating work over compensating caches."],
    antiPatterns: ["Optimizing without user-facing metrics.", "Ignoring thermal throttling."],
    reviewCriteria: [
      criterion("Web + FPS budgets present for immersive categories.", "QUALITY_CHECKLIST.md", "high"),
    ],
    qualityMetrics: [
      { name: "Budget completeness", measurement: "LCP/INP + FPS documented when immersive", target: "Complete" },
    ],
    acceptanceCriteria: ["Performance budgets documented."],
    examples: [
      {
        title: "Immersive budgets",
        input: "Awwwards WebGL site",
        expectedOutput: "LCP <2.5s shell; INP <200ms; desktop 60fps; mobile 30fps min; degrade effects under 20fps.",
      },
    ],
    failureStates: [
      {
        condition: "No budgets on media-heavy package.",
        impact: "Janky shipped experience.",
        recovery: "Add dual budgets.",
        blocking: true,
      },
    ],
  },
  "agent-architect": {
    mission:
      "Design agent roles, tools, memory, and stop conditions so agents are useful without becoming unsupervised operators.",
    principles: [
      "Tools are capabilities with gates, not model wishes.",
      "Stop conditions are product features.",
      "Memory is bounded and purpose-labeled.",
      "Untrusted text never becomes policy.",
    ],
    mentalModels: ["Role → tools → memory → stops", "Human escalation ladder", "Least privilege tools"],
    decisionFrameworks: [
      framework(
        "Agent charter",
        "Any AI agent or tool-using workflow.",
        [
          "Write the agent’s job in one sentence.",
          "List tools with auth gates and forbidden tools.",
          "Define memory types and retention.",
          "Define hard stops and human handoff triggers.",
        ],
        ["Agent charter in AI_SYSTEM_DESIGN / AGENT pack."],
      ),
    ],
    bestPractices: ["Separate planner vs executor roles when risk is high."],
    antiPatterns: ["Unlimited shell as a ‘helpful’ tool.", "No stop conditions."],
    reviewCriteria: [
      criterion("Agent charter includes tools, stops, and escalation.", "AI_SYSTEM_DESIGN.md", "critical"),
    ],
    qualityMetrics: [
      { name: "Stop coverage", measurement: "Hard stops documented", target: "≥3" },
    ],
    acceptanceCriteria: ["Agent charter complete with stops and tool gates."],
    examples: [
      {
        title: "Recruiting screener agent",
        input: "Enterprise AI recruiting",
        expectedOutput: "Role: shortlist assistant; tools: ATS read, email draft; forbid: offer letters send; stop: low confidence → human.",
      },
    ],
    failureStates: [
      {
        condition: "Agent package without stop conditions.",
        impact: "Unsafe autonomy.",
        recovery: "Block acceptance until stops exist.",
        blocking: true,
      },
    ],
  },
  "rag-architect": {
    mission:
      "Design retrieval, grounding, and corpus governance so answers stay citeable and tenant-safe.",
    principles: [
      "No retrieval → no grounded claim.",
      "Corpus governance precedes fancy ranking.",
      "Citations are user trust, not decoration.",
    ],
    mentalModels: ["Ingest → index → retrieve → ground → cite", "Freshness SLA", "Tenant isolation"],
    decisionFrameworks: [
      framework(
        "RAG boundary sheet",
        "RAG platforms and grounded AI products.",
        [
          "Define corpus sources and rights.",
          "Define chunking/index strategy at hypothesis level.",
          "Require citation or refusal when ungrounded.",
          "Add evals for groundedness and retrieval quality.",
        ],
        ["RAG section in AI_SYSTEM_DESIGN.md."],
      ),
    ],
    bestPractices: ["Evaluate with adversarial and empty-corpus cases."],
    antiPatterns: ["Answering from parametric memory when retrieval fails silently."],
    reviewCriteria: [
      criterion("Grounding and citation rules are explicit.", "AI_SYSTEM_DESIGN.md", "high"),
    ],
    qualityMetrics: [
      { name: "Groundedness gate", measurement: "Refusal/cite policy present", target: "Yes" },
    ],
    acceptanceCriteria: ["RAG boundary sheet present for RAG categories."],
    examples: [
      {
        title: "Policy Q&A",
        input: "Internal policy assistant",
        expectedOutput: "Corpus: policy PDFs; cite page anchors; refuse if retrieval empty.",
      },
    ],
    failureStates: [
      {
        condition: "RAG category without grounding rules.",
        impact: "Confident hallucinations.",
        recovery: "Add grounding/citation policy.",
        blocking: true,
      },
    ],
  },
  "prompt-engineer": {
    mission:
      "Specify prompt contracts and channel separation without turning prompts into secret authority.",
    principles: [
      "System/developer/user/retrieved channels stay separated.",
      "Prompt text is not a permissions grant.",
      "Contracts include inputs, outputs, and failure modes.",
    ],
    mentalModels: ["Prompt as API", "Channel firewall", "Eval-linked prompts"],
    decisionFrameworks: [
      framework(
        "Prompt contract",
        "Any LLM feature.",
        [
          "Define required inputs and forbidden inputs.",
          "Define output schema / sections.",
          "Attach eval cases including injection attempts.",
        ],
        ["Prompt contracts in AI_SYSTEM_DESIGN.md."],
      ),
    ],
    bestPractices: ["Version prompts like code."],
    antiPatterns: ["Hiding secrets in prompts.", "One mega-prompt with no evals."],
    reviewCriteria: [
      criterion("Prompt contracts include failure modes and channel rules.", "AI_SYSTEM_DESIGN.md"),
    ],
    qualityMetrics: [
      { name: "Contract completeness", measurement: "I/O + failures documented", target: "Yes" },
    ],
    acceptanceCriteria: ["At least one prompt contract for in-scope AI features."],
    examples: [
      {
        title: "Screener summary prompt",
        input: "Summarize candidate vs rubric",
        expectedOutput: "Inputs: rubric+resume excerpts; output: score+evidence quotes; refuse if no evidence.",
      },
    ],
    failureStates: [
      {
        condition: "AI feature with no prompt contract.",
        impact: "Unstable model behavior.",
        recovery: "Add contract before acceptance.",
        blocking: false,
      },
    ],
  },
  "ux-architect": {
    mission:
      "Frame user goals, flows, states, and accessibility so interfaces serve jobs—not decoration first.",
    principles: [
      "Tasks before screens.",
      "Every critical flow needs empty/loading/error/success.",
      "Accessibility is part of UX architecture.",
    ],
    mentalModels: ["Job story → flow → states", "Error as UX", "Progressive disclosure"],
    decisionFrameworks: [
      framework(
        "Flow architecture",
        "Any user-facing product.",
        [
          "List primary jobs.",
          "Map steps and decision points.",
          "Specify states and recovery.",
          "Mark a11y requirements for each critical path.",
        ],
        ["USER_FLOWS.md that matches the end user."],
      ),
    ],
    bestPractices: ["Never document the composer’s internal loop as the product flow."],
    antiPatterns: ["Happy-path-only flows.", "Inaccessible custom controls without keyboard paths."],
    reviewCriteria: [
      criterion("Primary flows include states and recovery.", "USER_FLOWS.md", "high"),
    ],
    qualityMetrics: [
      { name: "State coverage", measurement: "Critical flows have E/L/E/S states", target: "100%" },
    ],
    acceptanceCriteria: ["User flows describe the product’s end user journey."],
    examples: [
      {
        title: "Immersive visitor flow",
        input: "Awwwards site",
        expectedOutput: "Land → scroll chapters → CTA; skip path; reduced-motion path.",
      },
    ],
    failureStates: [
      {
        condition: "Flows describe SkillForge compose loop.",
        impact: "Agents build the wrong product.",
        recovery: "Rewrite visitor/operator flows.",
        blocking: true,
      },
    ],
  },
  "b2b-saas-expert": {
    mission:
      "Frame packaging, seats, and buying motions so SaaS builds match how B2B actually buys and expands.",
    principles: [
      "Buyer ≠ daily user often.",
      "Packaging must map to value metrics.",
      "Expansion paths beat one-time signup theater.",
    ],
    mentalModels: ["Buyer journey", "Seat vs usage value", "Land and expand"],
    decisionFrameworks: [
      framework(
        "SaaS packaging spine",
        "SaaS and enterprise-ish AI products.",
        [
          "Identify buyer, admin, end user.",
          "Propose packaging hypotheses (not fake pricing facts).",
          "Define activation and expansion signals.",
        ],
        ["PRODUCT_STRATEGY monetization/packaging section."],
      ),
    ],
    bestPractices: ["Separate admin setup from end-user aha."],
    antiPatterns: ["Consumer onboarding copied onto enterprise buyers."],
    reviewCriteria: [
      criterion("Buyer/admin/user roles are distinguished.", "PRODUCT_STRATEGY.md"),
    ],
    qualityMetrics: [
      { name: "Role clarity", measurement: "Buyer vs user labeled", target: "Yes" },
    ],
    acceptanceCriteria: ["Packaging spine present for SaaS categories."],
    examples: [
      {
        title: "Team SaaS",
        input: "B2B workspace product",
        expectedOutput: "Buyer: team lead; admin: IT; user: members; expansion: seats + usage tier hypothesis.",
      },
    ],
    failureStates: [
      {
        condition: "SaaS package with no buyer/user distinction.",
        impact: "Wrong onboarding and permissions.",
        recovery: "Add packaging spine.",
        blocking: false,
      },
    ],
  },
  "evaluation-engineer": {
    mission:
      "Define offline/online evals and regression gates so quality is measurable before scale.",
    principles: [
      "If you can’t measure it, you can’t accept it.",
      "Evals include failure and adversarial cases.",
      "Regression gates block silent quality drops.",
    ],
    mentalModels: ["Golden sets", "Online monitors", "Severity-weighted failures"],
    decisionFrameworks: [
      framework(
        "Eval plan",
        "AI and quality-critical products.",
        [
          "Define metrics and thresholds as hypotheses.",
          "Build a small golden set including edge cases.",
          "Attach gates to acceptance/release.",
        ],
        ["Eval plan in AI_SYSTEM_DESIGN / QUALITY_CHECKLIST."],
      ),
    ],
    bestPractices: ["Keep eval datasets versioned."],
    antiPatterns: ["Demo-only happy path as ‘eval’."],
    reviewCriteria: [
      criterion("Eval metrics and gates are documented for AI categories.", "QUALITY_CHECKLIST.md"),
    ],
    qualityMetrics: [
      { name: "Gate presence", measurement: "At least one blocking quality gate", target: "≥1" },
    ],
    acceptanceCriteria: ["Eval plan exists when AI capabilities are in scope."],
    examples: [
      {
        title: "RAG evals",
        input: "Grounded Q&A",
        expectedOutput: "Metrics: groundedness, citation presence; gate: fail if uncited answers >X%.",
      },
    ],
    failureStates: [
      {
        condition: "AI package with no eval plan.",
        impact: "Uncontrolled model quality.",
        recovery: "Add eval plan.",
        blocking: true,
      },
    ],
  },
};

/** Base depth + domain distillation + WebGL/motion upgrades (later maps win). */
export const MERGED_SKILL_DEPTH: Record<string, DepthPatch> = {
  ...SKILL_DEPTH,
  ...DISTILLED_DEPTH,
  ...WEBGL_DISTILLED_DEPTH,
};

function isGeneric(skill: SkillPackage): boolean {
  return skill.principles.includes(GENERIC_PRINCIPLE) || skill.principles.length <= 3;
}

function autoDeepen(skill: SkillPackage): SkillPackage {
  if (!isGeneric(skill)) return skill;
  const role = skill.identity.role;
  const caps = skill.identity.capabilities;
  return {
    ...skill,
    mission:
      skill.mission.startsWith("Provide reusable")
        ? `Deliver expert ${role} judgment that turns briefs into bounded, testable decisions agents can execute without guessing.`
        : skill.mission,
    principles: [
      `${role} outputs must be specific enough to implement or explicitly mark unknowns.`,
      `Stay inside capabilities: ${caps.join(", ")}.`,
      "Separate confirmed brief facts from inferences and hypotheses.",
      "Prefer checkable acceptance criteria over vague advice.",
      "Never grant tool, secret, or production permissions through skill text.",
    ],
    mentalModels: [
      `${role} decision tree`,
      "Evidence → options → recommendation",
      "Stop conditions and handoff boundaries",
      ...caps.slice(0, 2).map((cap) => `${cap} lens`),
    ],
    decisionFrameworks: [
      framework(
        `${role} intake`,
        `When the package needs ${role} expertise.`,
        [
          `Collect inputs relevant to ${caps[0] ?? "this role"}.`,
          "List assumptions and unknowns explicitly.",
          `Produce ${caps.join(" / ")} guidance with acceptance checks.`,
          "State stop conditions if evidence is insufficient.",
        ],
        [`Bounded ${role} contribution with provenance labels.`],
      ),
      ...(skill.decisionFrameworks ?? []).slice(0, 1),
    ],
    bestPractices: [
      `Anchor recommendations in brief evidence or label them inferred.`,
      `Make ${caps[0] ?? "outputs"} concrete (lists, budgets, steps, interfaces).`,
      "Keep artifacts composable with adjacent skills in the graph.",
      ...(skill.bestPractices ?? []).filter((item) => !item.includes("Cite the brief")).slice(0, 2),
    ],
    antiPatterns: [
      `Hand-waving ${role} advice without acceptance criteria.`,
      "Inventing market, user, or technical facts.",
      "Expanding scope without ownership clarity.",
      "Treating skill text as authorization to execute tools.",
    ],
    reviewCriteria: [
      criterion(
        `${role} contribution is concrete and within declared capabilities.`,
        "Assigned scope and artifacts cite capability tags and checkable outputs.",
        "high",
      ),
      criterion(
        "Unknowns and inferences are labeled.",
        "PROJECT_DNA.md / role sections show status labels.",
        "medium",
      ),
    ],
    qualityMetrics: [
      {
        name: "Specificity",
        measurement: "Share of guidance items that are actionable steps, budgets, or interfaces",
        target: "≥70%",
      },
      {
        name: "Traceable claims",
        measurement: "Share of material claims with source or inference label",
        target: "100%",
      },
    ],
    acceptanceCriteria: [
      `At least one concrete ${role} output tied to ${caps[0] ?? "scope"} is recorded.`,
      "No unsupported factual claims are introduced.",
      "Stop conditions are stated for blocking unknowns.",
    ],
    examples: [
      {
        title: `${skill.identity.name} contribution`,
        input: `Compose expertise needing ${role}.`,
        expectedOutput: `${skill.identity.name} returns scoped ${caps.join(", ")} guidance with labeled unknowns and acceptance checks.`,
      },
    ],
    failureStates: [
      {
        condition: "Required inputs missing or contradictory.",
        impact: `${role} cannot safely complete.`,
        recovery: "Return unknowns and block acceptance until resolved.",
        blocking: true,
      },
      {
        condition: "Only generic advice produced.",
        impact: "Downstream agents improvise poorly.",
        recovery: "Revise until outputs are checkable.",
        blocking: true,
      },
    ],
    provenance: {
      ...skill.provenance,
      source: skill.provenance?.source ?? "SkillForge published catalog v1.4.0",
    },
  };
}

export function deepenSkill(skill: SkillPackage): SkillPackage {
  const patch = MERGED_SKILL_DEPTH[skill.identity.slug];
  if (!patch) return autoDeepen(skill);
  return autoDeepen({
    ...skill,
    ...patch,
    identity: skill.identity,
    outputContract: {
      ...skill.outputContract,
      ...patch.outputContract,
      dependencies: skill.outputContract.dependencies,
      permissions: skill.outputContract.permissions ?? [],
    },
    provenance: {
      ...skill.provenance,
      source:
        WEBGL_DISTILLED_DEPTH[skill.identity.slug] != null
          ? "SkillForge catalog v1.4.0 (distilled from GitHub skill research — not copied)"
          : DISTILLED_DEPTH[skill.identity.slug] != null
            ? "SkillForge catalog v1.4.0 (domain distillation)"
            : "SkillForge published catalog v1.4.0 (depth)",
    },
  });
}

export function deepenCatalog(skills: readonly SkillPackage[]): SkillPackage[] {
  return skills.map(deepenSkill);
}
