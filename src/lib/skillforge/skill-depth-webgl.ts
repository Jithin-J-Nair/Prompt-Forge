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
 * WebGL / motion depth distilled from studying top GitHub skill packs
 * (CloudAI-X/threejs-skills, greensock/gsap-skills, related motion packs).
 * Content is original SkillForge contract text — not copied SKILL.md bodies.
 */
export const WEBGL_DISTILLED_DEPTH: Record<string, DepthPatch> = {
  "threejs-architect": {
    mission:
      "Own WebGL experience architecture agents can ship: one renderer host, chaptered scenes, current-API timing loops, compressed assets, disposal discipline, and a non-WebGL fallback.",
    principles: [
      "One experience host (canvas) with quiet DOM chrome — never many canvases per section.",
      "Scene inventory before geometry toys; each chapter lists camera, assets, dispose rules.",
      "Budgets before beauty: FPS targets, draw calls, texture memory, quality presets.",
      "Use current three.js loop/timing habits (renderer animation loop + delta timer) — avoid deprecated clock/manual-loop patterns.",
      "Compress and stream assets (glTF + Draco/meshopt/KTX2-class pipeline); dispose geometry, materials, and textures on chapter exit.",
      "Always define a static/filmstrip fallback and reduced-motion path.",
    ],
    mentalModels: [
      "Scene → object → material → pass",
      "Frame budget envelope (desktop 60 / mobile ≥30)",
      "Load → warm → interact → dispose",
      "Renderer ownership vs DOM UI ownership",
      "Quality preset ladder (high → medium → low)",
    ],
    decisionFrameworks: [
      framework(
        "Experience architecture",
        "threejs-experience or immersive awwwards briefs.",
        [
          "List scenes/chapters and a single shared renderer.",
          "Define camera model and scroll coupling to one shared progress signal.",
          "Set FPS targets and max triangles/textures per scene class; name quality presets.",
          "Specify asset formats, compression class, loader progress UI, and disposal on chapter exit.",
          "Define non-WebGL fallback and reduced-motion path.",
        ],
        ["ARCHITECTURE.md WebGL section agents can implement."],
      ),
      framework(
        "Runtime hygiene checklist",
        "Before accepting an immersive package for export.",
        [
          "Confirm resize updates camera aspect + projection + renderer size.",
          "Confirm animation-loop ownership and tab-hidden delta behavior.",
          "Confirm materials/textures dispose when meshes leave.",
          "Confirm mid-tier mobile path (fewer passes / lower DPR).",
        ],
        ["Runtime hygiene notes agents must not skip."],
      ),
    ],
    bestPractices: [
      "Prefer one renderer and staged scene swapping over many canvases.",
      "Keep captions/UI in DOM; use WebGL for the experience canvas only.",
      "Cap pixel ratio on high-DPI; drop quality when FPS dips sustained.",
      "Profile on mid-tier mobile early; do not trust desktop-only demos.",
      "Call out agent pitfalls: missing dispose, skybox mapping mistakes, wrong color-space habits.",
    ],
    antiPatterns: [
      "Shipping unoptimized GLTF giants without compression.",
      "Per-section full page reloads of WebGL context.",
      "Manual requestAnimationFrame loops without renderer loop ownership.",
      "No fallback for low-power devices or missing WebGL.",
      "Treating WebGPU/TSL as mandatory when solid WebGL meets the brief.",
    ],
    reviewCriteria: [
      criterion(
        "Scene inventory, frame budget, asset pipeline, and fallback are documented.",
        "ARCHITECTURE.md immersive sections.",
        "critical",
      ),
      criterion(
        "Disposal and quality-preset rules are explicit.",
        "ARCHITECTURE.md / QUALITY_CHECKLIST.md",
        "high",
      ),
    ],
    qualityMetrics: [
      {
        name: "Budget explicitness",
        measurement: "FPS + asset/disposal + fallback rules present",
        target: "All present",
      },
    ],
    acceptanceCriteria: [
      "Scene graph/inventory documented.",
      "Performance budget, asset compression class, and fallback documented.",
      "Runtime hygiene (loop, resize, dispose) called out for agents.",
    ],
    examples: [
      {
        title: "Multi-chapter WebGL site",
        input: "Scroll-driven studio site",
        expectedOutput:
          "Single WebGL canvas; 4 scenes; shared scroll progress; renderer animation loop + delta timer; 60fps desktop / 30fps low-power; Draco/meshopt GLTF; dispose on leave; CSS fallback filmstrip.",
      },
    ],
    failureStates: [
      {
        condition: "Architecture describes only Next.js+Postgres with no scene system.",
        impact: "Agents cannot build the immersive product.",
        recovery: "Replace with WebGL experience architecture.",
        blocking: true,
      },
      {
        condition: "Assets unbounded and no dispose rules.",
        impact: "Memory leaks and jank on chapter changes.",
        recovery: "Add asset pipeline + dispose contract.",
        blocking: true,
      },
    ],
  },
  "r3f-architect": {
    mission:
      "Structure React Three Fiber composition so scenes are declarative chapter modules, bridged to DOM UI through one progress/store contract, with suspend/lazy loading for heavy chapters.",
    principles: [
      "Canvas is a host boundary — not the whole website.",
      "Declarative chapter components with clear props contracts.",
      "Keep imperative three.js escapes isolated and rare.",
      "One source of truth for scroll/UI → scene uniforms.",
      "Suspend/lazy heavy scenes; do not mount every chapter at once.",
    ],
    mentalModels: [
      "Canvas boundary",
      "Scene route/chapter components",
      "UI↔R3F store",
      "drei helpers as verified toolkit — not a junk drawer",
    ],
    decisionFrameworks: [
      framework(
        "R3F composition",
        "React-based WebGL experiences.",
        [
          "Define ExperienceCanvas host and chapter components.",
          "Specify shared lights, environment, and post stack ownership.",
          "Define how scroll progress enters the scene (single store).",
          "List which drei helpers are allowed vs forbidden for this brief.",
        ],
        ["R3F module map in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: [
      "Suspend/lazy heavy scenes.",
      "Avoid re-creating controls every render.",
      "Prefer declarative lights/environment over ad-hoc imperative setup in useFrame.",
      "Clean up subscriptions and controls on chapter unmount.",
    ],
    antiPatterns: [
      "Giant god-component Canvas files.",
      "Duplicating state in DOM and R3F ad hoc.",
      "Mounting all GLTF chapters eagerly on first paint.",
      "Using unverified helper soup without a budget.",
    ],
    reviewCriteria: [
      criterion("R3F module/chapter map is present when R3F is in stack.", "ARCHITECTURE.md"),
      criterion("Scroll/UI bridge is a single store or signal.", "ARCHITECTURE.md / USER_FLOWS.md"),
    ],
    qualityMetrics: [
      { name: "Module clarity", measurement: "Chapter components named", target: "≥1 per scene" },
    ],
    acceptanceCriteria: [
      "Canvas/chapter composition documented.",
      "Lazy/suspend strategy documented for heavy chapters.",
    ],
    examples: [
      {
        title: "Chaptered R3F app",
        input: "Next.js + R3F portfolio",
        expectedOutput:
          "ExperienceCanvas host; SceneArrival; SceneWork; SceneContact; scroll store feeds uProgress; heavy scenes suspended until chapter enter.",
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
  "gsap-architect": {
    mission:
      "Coordinate timeline-driven motion (including scroll) with clear ownership versus camera/shader motion—using correct GSAP patterns agents can trust: timelines, ScrollTrigger hygiene, framework cleanup.",
    principles: [
      "One orchestrator owns conflicting timelines; publish one shared progress signal when WebGL must sync.",
      "Prefer timelines over chained delay stacks for sequencing.",
      "Animate transforms and autoAlpha — not layout thrash properties — unless layout is the point.",
      "Register plugins once; scope selectors; clean up with context/revert or useGSAP on unmount.",
      "After DOM/layout changes, refresh ScrollTrigger; kill timelines on route/chapter exit.",
      "Honor prefers-reduced-motion with instant or short opacity fallbacks.",
    ],
    mentalModels: [
      "Master timeline",
      "Scroll chapter triggers (start/end/scrub)",
      "Motion ownership matrix (GSAP vs R3F vs CSS)",
      "Context/scope cleanup",
    ],
    decisionFrameworks: [
      framework(
        "Timeline ownership",
        "Sites with coordinated scroll/UI/WebGL motion.",
        [
          "List animations and owners (GSAP, R3F frame, CSS).",
          "Define ScrollTrigger start/end/scrub per chapter.",
          "Specify cleanup on chapter exit and ScrollTrigger.refresh after layout.",
          "Define reduced-motion fallbacks per signature beat.",
        ],
        ["Motion orchestration map."],
      ),
      framework(
        "Signature beat grid",
        "Immersive or brand-led sites needing authored motion.",
        [
          "Pick 2–5 signature moments (arrival, chapter enter, CTA).",
          "Assign duration/easing notes and owners.",
          "Ban constant scroll noise on every element.",
        ],
        ["Beat grid agents can implement without inventing motion soup."],
      ),
    ],
    bestPractices: [
      "Use a shared progress signal when WebGL and DOM must sync.",
      "Prefer gsap.timeline defaults for consistent easing/duration.",
      "In React, use scoped GSAP patterns (useGSAP/context) — never global selectors without scope.",
      "Batch reads/writes; prefer transforms for performance.",
    ],
    antiPatterns: [
      "Multiple libraries fighting the same property.",
      "No cleanup → memory leaks and ghost ScrollTriggers.",
      "Animating top/left/width when x/y/scale would do.",
      "Chained delays instead of a readable timeline.",
    ],
    reviewCriteria: [
      criterion(
        "Timeline ownership matrix exists for immersive packages.",
        "DESIGN_SYSTEM.md / ARCHITECTURE.md",
      ),
      criterion(
        "Cleanup and reduced-motion paths are stated.",
        "DESIGN_SYSTEM.md motion language",
        "high",
      ),
    ],
    qualityMetrics: [
      {
        name: "Ownership clarity",
        measurement: "Conflicting motions have a single owner",
        target: "100%",
      },
    ],
    acceptanceCriteria: [
      "Orchestration map present when GSAP is selected.",
      "Signature beat grid with durations/owners exists for immersive work.",
    ],
    examples: [
      {
        title: "Synced scroll",
        input: "DOM captions + WebGL camera",
        expectedOutput:
          "GSAP ScrollTrigger publishes progress; R3F reads progress; captions tween on same progress; ctx.revert on leave; reduced-motion uses fades.",
      },
    ],
    failureStates: [
      {
        condition: "GSAP selected but no orchestration notes.",
        impact: "Janky desynced motion.",
        recovery: "Add ownership matrix.",
        blocking: false,
      },
      {
        condition: "ScrollTriggers never cleaned up across routes.",
        impact: "Ghost animations and leaks.",
        recovery: "Require cleanup contract.",
        blocking: true,
      },
    ],
  },
  "shader-engineer": {
    mission:
      "Specify GPU shading and effects with visual intent and cost tiers—usable recipes with uniforms agents can tune, plus low-power cull rules.",
    principles: [
      "Every shader has a visual job and a cost class (low/medium/high).",
      "Prefer a small library of proven effects over novel noise soup.",
      "Expose uniforms agents can tune (progress, intensity, palette).",
      "Degrade gracefully on low-GPU devices — drop or simplify high-cost effects.",
      "Keep WebGL ShaderMaterial recipes and optional modern node/TSL paths clearly labeled — do not mix casually.",
    ],
    mentalModels: ["Effect cost tiers", "Uniform contracts", "Pass ordering", "Mobile cull list"],
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
    bestPractices: [
      "Reuse noise textures.",
      "Avoid overdraw-heavy fullscreen stacks without need.",
      "Document which effects are chapter-local vs global.",
    ],
    antiPatterns: [
      "Unbudgeted stacked post-processing.",
      "One-off unreusable mega-shaders.",
      "Requiring high-cost effects with no mobile drop path.",
    ],
    reviewCriteria: [
      criterion("Shader/effect list includes cost tiers and uniforms.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      {
        name: "Effect specificity",
        measurement: "Named effects with cost tiers",
        target: "All listed effects tiered",
      },
    ],
    acceptanceCriteria: ["Shader budget sheet present when shaders are in scope."],
    examples: [
      {
        title: "Chapter dissolve",
        input: "Scene transition between works",
        expectedOutput:
          "Noise dissolve; uProgress 0–1; cost medium; disable on low-power for crossfade.",
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
  "post-processing-engineer": {
    mission:
      "Design post-process stacks with ordered passes, cost awareness, and a clear low-power drop order—never an unbounded effect pile.",
    principles: [
      "Pass order is a contract; document it.",
      "Every pass has a job and a cost tier.",
      "Low-power presets drop expensive passes first.",
      "Do not stack bloom+DOF+SSR+film-grain by default.",
    ],
    mentalModels: ["Pass graph", "Drop order ladder", "Shared render targets budget"],
    decisionFrameworks: [
      framework(
        "Post stack design",
        "Immersive packages using screen effects.",
        [
          "List passes in order with purpose.",
          "Assign cost tiers and mobile drop order.",
          "Cap simultaneous expensive passes.",
        ],
        ["Post stack section in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: [
      "Prefer fewer high-impact passes over many weak ones.",
      "Measure fill-rate cost on mid-tier mobile.",
    ],
    antiPatterns: [
      "Defaulting every scene to a heavy cinematic stack.",
      "No drop order for low-power devices.",
    ],
    reviewCriteria: [
      criterion("Post stack ordered with cost tiers and drop order.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      {
        name: "Drop-order completeness",
        measurement: "Low-power preset removes named expensive passes",
        target: "Documented",
      },
    ],
    acceptanceCriteria: ["Ordered post stack with mobile drop path when post is in scope."],
    examples: [
      {
        title: "Selective bloom",
        input: "Hero metal highlight",
        expectedOutput: "Bloom only; cost medium; drop on low-power; no DOF/SSR.",
      },
    ],
    failureStates: [
      {
        condition: "Post effects listed without order or budget.",
        impact: "Unshippable GPU cost.",
        recovery: "Add ordered stack + drop ladder.",
        blocking: true,
      },
    ],
  },
  "rendering-engineer": {
    mission:
      "Define rendering pipeline fidelity vs performance: clear pass list, DPR caps, and device quality presets agents can implement.",
    principles: [
      "Name the pass list before adding effects.",
      "Device presets are first-class (high/medium/low).",
      "Measure, then cut — do not guess forever.",
    ],
    mentalModels: ["Pass list", "Device presets", "Fill-rate vs CPU budget"],
    decisionFrameworks: [
      framework(
        "Quality presets",
        "Immersive or WebGL-heavy packages.",
        [
          "Define high/medium/low presets (DPR, shadows, passes).",
          "Define auto-drop trigger (e.g. sustained <20fps).",
        ],
        ["Rendering section in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: ["Cap DPR; prefer instancing/merging for static content."],
    antiPatterns: ["One ultra preset for all devices."],
    reviewCriteria: [
      criterion("Pass list and device quality presets exist.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      {
        name: "Preset coverage",
        measurement: "High/medium/low documented",
        target: "3 presets",
      },
    ],
    acceptanceCriteria: ["Quality presets documented when WebGL is in scope."],
    examples: [
      {
        title: "Auto quality drop",
        input: "Mobile FPS dips",
        expectedOutput: "After 20fps sustained, drop to medium: DPR 1, shadows off, bloom off.",
      },
    ],
    failureStates: [
      {
        condition: "No presets on immersive package.",
        impact: "Broken mobile experience.",
        recovery: "Add preset ladder.",
        blocking: true,
      },
    ],
  },
  "technical-artist": {
    mission:
      "Bridge art direction and realtime constraints: material recipes, asset budgets, and LODs that keep the look without melting the GPU.",
    principles: [
      "Art intent must survive the budget — negotiate LODs early.",
      "Material recipes are reusable, not one-off miracles.",
      "Authoring → compress → runtime load → dispose is a pipeline.",
    ],
    mentalModels: ["Look vs cost tradeoff", "LOD ladder", "Material recipe cards"],
    decisionFrameworks: [
      framework(
        "Asset budget negotiation",
        "Immersive scenes with custom art.",
        [
          "List hero assets and secondary assets.",
          "Assign triangle/texture budgets per class.",
          "Define LOD and compression expectations.",
        ],
        ["Asset budgets in ARCHITECTURE.md."],
      ),
    ],
    bestPractices: ["Keep a small material library; reuse before inventing."],
    antiPatterns: ["Unlimited hero meshes with 8k textures everywhere."],
    reviewCriteria: [
      criterion("Asset budgets and material recipes exist for hero scenes.", "ARCHITECTURE.md"),
    ],
    qualityMetrics: [
      {
        name: "Budget coverage",
        measurement: "Hero assets have triangle/texture caps",
        target: "100% of hero assets",
      },
    ],
    acceptanceCriteria: ["Hero asset budgets documented when technical art is in scope."],
    examples: [
      {
        title: "Hero sculpture",
        input: "Arrival world centerpiece",
        expectedOutput: "LOD0 ≤80k tris; KTX2 textures; material recipe shared; dispose on leave.",
      },
    ],
    failureStates: [
      {
        condition: "Art direction demands fidelity with no budgets.",
        impact: "Unshippable assets.",
        recovery: "Negotiate LOD/budget sheet.",
        blocking: true,
      },
    ],
  },
  "motion-director": {
    mission:
      "Define authored motion language — signature beats, easing, ownership — so agents implement cinematic UI/scroll without random motion noise.",
    principles: [
      "2–5 signature moments beat constant scroll noise.",
      "Every beat has an owner (GSAP / R3F / CSS).",
      "Buttons, image reveals, and scroll theater are first-class craft — not polish leftovers.",
      "Reduced motion is mandatory.",
    ],
    mentalModels: ["Beat grid", "Ownership matrix", "Silence between beats"],
    decisionFrameworks: [
      framework(
        "Motion language lock",
        "Immersive or brand-led briefs.",
        [
          "List signature beats with duration/easing.",
          "Assign owners and reduced-motion fallbacks.",
          "Specify button/image/scroll micro-interaction rules.",
        ],
        ["Motion language in DESIGN_SYSTEM.md."],
      ),
    ],
    bestPractices: [
      "Document hover/press/focus for CTAs.",
      "Reserve aspect ratios for media reveals.",
      "Share one progress signal across DOM and WebGL when synced.",
    ],
    antiPatterns: [
      "Animating everything on scroll.",
      "Motion without reduced-motion path.",
      "No ownership → fighting libraries.",
    ],
    reviewCriteria: [
      criterion("DESIGN_SYSTEM.md or USER_FLOWS.md includes motion language.", "DESIGN_SYSTEM.md"),
    ],
    qualityMetrics: [
      {
        name: "Signature beat count",
        measurement: "Documented authored moments",
        target: "2–5",
      },
    ],
    acceptanceCriteria: [
      "Motion language with beats, owners, and reduced-motion path present.",
    ],
    examples: [
      {
        title: "Arrival + CTA",
        input: "Awwwards brand site",
        expectedOutput:
          "Arrival dolly 1.2s; chapter dissolve; CTA hover scale 1.03/180ms; reduced-motion fades only.",
      },
    ],
    failureStates: [
      {
        condition: "Immersive package has no motion language.",
        impact: "Agents invent random motion.",
        recovery: "Add beat grid + ownership.",
        blocking: true,
      },
    ],
  },
};
