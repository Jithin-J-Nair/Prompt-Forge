import { createHash } from "node:crypto";
import {
  analyzeBrief,
  type CategoryMode,
} from "./brief-intelligence.ts";
import type { ProjectCategoryKey } from "./categories.ts";
import { isImmersiveCategory } from "./blueprints-content.ts";

export type ConceptScorecard = {
  relevance: number;
  originality: number;
  memorability: number;
  clarity: number;
  brandFit: number;
  feasibility: number;
  performance: number;
  a11y: number;
  coherence: number;
};

export type ConceptCandidate = {
  id: string;
  label: string;
  artDirection: string;
  spaceMetaphor: string;
  narrative: string;
  typeStance: string;
  materialStance: string;
  colorStance: string;
  interactionStance: string;
  infoStance: string;
  motionStance: string;
  techStance: string;
  scores: ConceptScorecard;
  total: number;
};

export type ConceptSelection = {
  selected: ConceptCandidate;
  why: string;
  explored: ConceptCandidate[];
  rejectedOneLiners: string[];
};

export type ConceptSynth = {
  fingerprint: string;
  worldNoun: string;
  audience: string;
  invite: string;
  referenceLabel: string | null;
  motifs: string[];
  verbs: string[];
  northStar: string;
  pillars: [string, string, string, string];
  emotionalArc: { arrival: string; deepen: string; proof: string; invite: string };
  sensory: { sight: string; motion: string; sound: string; touch: string };
  artTokens: {
    displayFace: string;
    uiFace: string;
    base: string;
    surface: string;
    ink: string;
    accent: string;
    accentSoft: string;
    fog: string;
    glowNote: string;
    materials: string[];
    lighting: string;
    imageryPlates: string[];
  };
  chapters: {
    id: string;
    job: string;
    proof: string;
    cta: string;
    camera: string;
    heroAsset: string;
    shaderAccent: string;
    dispose: string;
  }[];
  beatGrid: {
    id: string;
    owner: "GSAP" | "R3F" | "shader" | "DOM";
    durationMs: string;
    easing: string;
    scrub: string;
    reducedMotion: string;
  }[];
  shaderBudget: { effect: string; tier: "low" | "medium" | "high"; dropOrder: number }[];
  assetSpecs: {
    name: string;
    kind: string;
    budget: string;
    format: string;
    notes: string;
  }[];
  motionScorecard: string[];
  antiPatterns: string[];
  referencePrinciples: string[];
  /** Selected concept direction + short why (not a brainstorm dump). */
  selection: ConceptSelection;
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "with",
  "like",
  "from",
  "into",
  "that",
  "this",
  "site",
  "website",
  "web",
  "build",
  "make",
  "create",
  "awwwards",
  "inspired",
  "using",
  "about",
  "your",
  "our",
  "next",
  "js",
  "three",
  "threejs",
  "r3f",
  "gsap",
  "webgl",
  "webgpu",
  "shader",
  "shaders",
  "immersive",
  "visually",
  "distinctive",
  "consumer",
  "digital",
  "experience",
  "experiences",
  "brand",
  "without",
  "through",
  "their",
  "into",
  "over",
  "under",
  "between",
  "should",
  "would",
  "could",
  "activetheory",
  "active",
  "theory",
  "scroll",
  "theater",
  "long",
  "form",
  "chapters",
  "chapter",
  "typographic",
  "storytelling",
  "story",
  "longform",
]);

const VERB_HINTS = [
  "explore",
  "discover",
  "immerse",
  "scroll",
  "dive",
  "reveal",
  "navigate",
  "invite",
  "transform",
  "sense",
  "measure",
  "craft",
  "stage",
  "orbit",
  "dissolve",
];

function hashFingerprint(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function clip(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= max ? t : `${t.slice(0, max).trimEnd()}…`;
}

function extractReference(brief: string): string | null {
  return (
    brief.match(/\blike\s+([a-z0-9][a-z0-9.-]{2,60})/i)?.[1] ??
    brief.match(/\binspired by\s+([^.!?]{3,60})/i)?.[1]?.trim() ??
    null
  );
}

function extractAudience(brief: string): string {
  const forMatch = brief.match(/\bfor\s+(?:a|an|the)?\s*([a-z0-9][\w\s-]{2,48}?)(?:\s*[—–-]|\s*,|\s*\.|$)/i);
  if (forMatch?.[1] && !/living|scroll|webgl|site|awwwards/i.test(forMatch[1])) {
    return forMatch[1].trim();
  }
  if (/\bscientists?\b/i.test(brief)) return "scientists and research visitors";
  if (/\bdesigners?\b/i.test(brief)) return "designers and craft-curious visitors";
  if (/\bstudio\b/i.test(brief)) return "studio clients and peer creatives";
  if (/\brecruit|hiring\b/i.test(brief)) return "recruiters, hiring managers, candidates";
  if (/\benterprise\b/i.test(brief)) return "enterprise buyers and operators";
  return "primary visitors encountering the brand world";
}

function extractInvite(brief: string): string {
  if (/\bcontact\b/i.test(brief)) return "Contact / start a conversation";
  if (/\bapply|join\b/i.test(brief)) return "Apply / join";
  if (/\bbook|demo\b/i.test(brief)) return "Book a demo";
  if (/\bscientists?\b/i.test(brief)) return "Invite scientists into the lab";
  if (/\bportfolio|work\b/i.test(brief)) return "Explore work / inquire";
  return "Primary invite CTA";
}

function tokenizeMotifs(brief: string): string[] {
  const cleaned = brief
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ");
  const raw = cleaned.split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w));
  const uniq: string[] = [];
  for (const w of raw) {
    if (!uniq.includes(w)) uniq.push(w);
    if (uniq.length >= 8) break;
  }
  if (uniq.length === 0) uniq.push("presence", "craft", "atmosphere");
  return uniq;
}

function extractVerbs(brief: string, motifs: string[]): string[] {
  const lower = brief.toLowerCase();
  const hits = VERB_HINTS.filter((v) => lower.includes(v));
  if (hits.length >= 2) return hits.slice(0, 4);
  if (motifs.includes("ocean") || motifs.includes("data")) return ["dive", "reveal", "measure", "invite"];
  if (motifs.includes("portfolio") || motifs.includes("studio")) return ["arrive", "orbit", "prove", "invite"];
  return ["arrive", "deepen", "prove", "invite"];
}

function pickPalette(motifs: string[], immersive: boolean): ConceptSynth["artTokens"] {
  const joined = motifs.join(" ");
  if (/ocean|climate|water|wave|marine|lab|data/i.test(joined)) {
    return {
      displayFace: "Fraunces (optical size) or similar soft-serif display",
      uiFace: "IBM Plex Sans or similar technical grotesque",
      base: "#06141F",
      surface: "#0B2433",
      ink: "#E8F4F8",
      accent: "#3DE0C4",
      accentSoft: "#1A6B7A",
      fog: "#7FA3B0",
      glowNote: "Bioluminescent teal accents only on focal data/particles — never purple neon soup",
      materials: ["deep water volume fog", "caustic light ribbons", "matte research-glass panels", "sparse particle plankton"],
      lighting: "Cool key from above-left; rim from cyan accent; avoid flat ambient fill",
      imageryPlates: [
        "Arrival: living data-ocean horizon (full-bleed)",
        "Proof: instrument / method close-up with readable captions",
        "Evidence: dataset constellation or map abstraction",
        "Invite: calm lab threshold with single CTA",
      ],
    };
  }
  if (/forest|nature|earth|botanic|garden/i.test(joined)) {
    return {
      displayFace: "Literata or soft editorial serif",
      uiFace: "Source Sans 3",
      base: "#0E1610",
      surface: "#162217",
      ink: "#F1F5EC",
      accent: "#A3D977",
      accentSoft: "#3F6B3A",
      fog: "#8FA38A",
      glowNote: "Moss-green accents; no tropical neon",
      materials: ["canopy depth fog", "bark micro-detail", "soft leaf translucency"],
      lighting: "Dappled key light; warm fill low",
      imageryPlates: ["Canopy arrival", "Path reveal", "Specimen proof", "Quiet invite"],
    };
  }
  if (/space|cosmos|orbit|astro|galaxy/i.test(joined)) {
    return {
      displayFace: "Space Grotesk or geometric display",
      uiFace: "Inter Tight only for UI chrome — never as brand display",
      base: "#05060A",
      surface: "#10131C",
      ink: "#EEF1F8",
      accent: "#7EB6FF",
      accentSoft: "#2A4A7A",
      fog: "#8A93A8",
      glowNote: "Starfield restraint — one accent constellation, not particle fireworks",
      materials: ["matte hull", "thin neon edge light", "volumetric dust"],
      lighting: "Hard key + long falloff; filmic contrast",
      imageryPlates: ["Void arrival", "Craft orbit", "Mission evidence", "Dock invite"],
    };
  }
  if (/music|sound|audio|festival/i.test(joined)) {
    return {
      displayFace: "Clash Display or condensed grotesque",
      uiFace: "Söhne / similar neo-grotesk",
      base: "#120A14",
      surface: "#1C101F",
      ink: "#F7EFF8",
      accent: "#FF5C8A",
      accentSoft: "#7A2E4A",
      fog: "#A892A8",
      glowNote: "Rhythm-synced accent pulses; never constant glow",
      materials: ["stage haze", "reflective floor", "waveform ribbons"],
      lighting: "Spot beams timed to beats; dark negative space sacred",
      imageryPlates: ["Stage arrival", "Performance proof", "Archive evidence", "Ticket invite"],
    };
  }
  if (immersive) {
    return {
      displayFace: "Syne or expressive geometric display",
      uiFace: "Geist Sans or similar modern grotesque",
      base: "#0A0B0D",
      surface: "#14161A",
      ink: "#F2F0EA",
      accent: "#FF6A3D",
      accentSoft: "#8A3A22",
      fog: "#8E8A84",
      glowNote: "One ember accent; reject purple-gradient defaults",
      materials: ["matte charcoal planes", "thin metallic edge", "soft grain atmosphere"],
      lighting: "Directional key; soft bounce; controlled bloom only on hero",
      imageryPlates: ["Brand world arrival", "Craft signature proof", "Work evidence", "Invite threshold"],
    };
  }
  return {
    displayFace: "Source Serif 4 for headlines",
    uiFace: "IBM Plex Sans",
    base: "#F7F5F1",
    surface: "#FFFFFF",
    ink: "#1A1A1A",
    accent: "#0B6E4F",
    accentSoft: "#A7D7C5",
    fog: "#6B6B6B",
    glowNote: "No neon; product clarity first",
    materials: ["paper surface", "quiet shadow"],
    lighting: "Neutral product lighting",
    imageryPlates: ["Task hero", "Workflow proof", "Trust evidence", "Primary CTA"],
  };
}

function chapterCast(
  motifs: string[],
  audience: string,
  invite: string,
  worldNoun: string,
): ConceptSynth["chapters"] {
  const world = worldNoun;
  const motifA = motifs[0] ?? "craft";
  const motifB = motifs[1] ?? motifs[0] ?? "proof";
  const motifC = motifs[2] ?? motifs[0] ?? "evidence";
  return [
    {
      id: "arrival",
      job: `Orient ${audience} inside the ${world}`,
      proof: `One full-bleed ${motifA} composition establishes brand in ≤3s`,
      cta: "Soft / delayed",
      camera: "Slow push-in or parallax drift (1.0–1.4s); no whip-pans",
      heroAsset: `${motifA}-hero plate / scene`,
      shaderAccent: "Atmosphere fog or subtle material shimmer (low tier)",
      dispose: "Keep arrival resident; dispose only transient loaders",
    },
    {
      id: "craft-proof",
      job: `Make ${audience} believe the craft through ${motifB}`,
      proof: `Signature interaction or scene tied to ${motifB}`,
      cta: "None or tertiary",
      camera: "Orbit / dolly tied to scroll progress; one owner",
      heroAsset: `${motifB} focal mesh or media`,
      shaderAccent: "Medium-tier accent only on focal object",
      dispose: "Unload offscreen high-cost textures when chapter exits",
    },
    {
      id: "evidence",
      job: "Build trust with concrete evidence",
      proof: `${motifC} case / dataset / work chapter with readable captions`,
      cta: "Optional deep link",
      camera: "Locked or gentle track; prioritize legibility",
      heroAsset: `${motifC} gallery / data plate`,
      shaderAccent: "Low tier; prefer DOM caption theater",
      dispose: "Aggressive dispose of case assets after exit",
    },
    {
      id: "invite",
      job: invite,
      proof: "Calm threshold; one primary CTA; keyboard reachable",
      cta: "Primary CTA",
      camera: "Settle / fade to rest pose",
      heroAsset: "Quiet threshold plate",
      shaderAccent: "None or residual atmosphere only",
      dispose: "Minimal resident set for CTA page",
    },
  ];
}

function buildBeatGrid(motifs: string[]): ConceptSynth["beatGrid"] {
  const m0 = motifs[0] ?? "world";
  return [
    {
      id: `arrival-${m0}`,
      owner: "R3F",
      durationMs: "1000–1400",
      easing: "power2.out",
      scrub: "false (play once on load)",
      reducedMotion: "Static hero plate + 150ms opacity",
    },
    {
      id: "caption-sync",
      owner: "GSAP",
      durationMs: "400–600",
      easing: "power1.out",
      scrub: "ScrollTrigger linked to chapter progress",
      reducedMotion: "Instant caption swap",
    },
    {
      id: "chapter-dissolve",
      owner: "shader",
      durationMs: "600–900",
      easing: "custom smoothstep",
      scrub: "true (0–1 chapter bound)",
      reducedMotion: "Hard cut or crossfade DOM only",
    },
    {
      id: "cta-micro",
      owner: "DOM",
      durationMs: "120–180 hover / 80 press",
      easing: "ease-out",
      scrub: "n/a",
      reducedMotion: "Color/underline only; no scale",
    },
    {
      id: "invite-settle",
      owner: "GSAP",
      durationMs: "500–700",
      easing: "power2.inOut",
      scrub: "false",
      reducedMotion: "Opacity fade 150ms",
    },
  ];
}

function shaderBudgetFor(motifs: string[]): ConceptSynth["shaderBudget"] {
  const ocean = /ocean|water|wave|climate|data/i.test(motifs.join(" "));
  return [
    { effect: ocean ? "Volume fog / depth haze" : "Atmospheric grain fog", tier: "low", dropOrder: 3 },
    { effect: ocean ? "Caustic / data-ribbon accent" : "Material dissolve wipe", tier: "medium", dropOrder: 2 },
    { effect: "Selective bloom on hero only", tier: "high", dropOrder: 1 },
    { effect: "Post color grade (LUT-lite)", tier: "low", dropOrder: 4 },
  ];
}

function assetSpecsFor(motifs: string[]): ConceptSynth["assetSpecs"] {
  const m0 = motifs[0] ?? "hero";
  return [
    {
      name: `${m0}-hero`,
      kind: "GLTF or media plate",
      budget: "≤80k tris · ≤2×2K maps · Draco/KTX2",
      format: "GLB + KTX2 / AVIF fallback",
      notes: "LOD1 for mobile; never eager-load all chapters",
    },
    {
      name: "env-lighting",
      kind: "HDRI / probe",
      budget: "≤1MB compressed probe",
      format: "HDR → RGBE or PMREM",
      notes: "Shared across chapters; dispose only on full teardown",
    },
    {
      name: "chapter-case-pack",
      kind: "textures / stills",
      budget: "≤6MB total per chapter",
      format: "AVIF/WebP + KTX2 where 3D",
      notes: "Lazy load on chapter enter; dispose on exit",
    },
  ];
}

function referencePrinciples(ref: string | null): string[] {
  const base = [
    "Reference = posture (energy, pacing, craft bar), never a clone of layout/signature.",
    "Scroll is a timeline with owned properties — one owner per transform/material channel.",
    "First viewport must pass the brand test with nav removed.",
    "Silence between signature beats is intentional craft.",
    "WebGL fails soft: static filmstrip + DOM captions still deliver the story.",
  ];
  if (!ref) return base;
  const lower = ref.toLowerCase();
  if (/activetheory|active\s*theory/i.test(lower) || lower.includes("activetheory")) {
    return [
      ...base,
      "Active Theory posture: immersive world as the product; chrome stays almost invisible.",
      "Technical spectacle must serve narrative clarity — not demo-reel noise.",
      "Chapter pacing feels scored; interaction teaches the world rules.",
    ];
  }
  return [...base, `Reference posture drawn from “${ref}”: extract pacing/energy only.`];
}


function scoreTotal(scores: ConceptScorecard): number {
  const values = Object.values(scores);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

function clamp01to5(n: number): number {
  return Math.max(1, Math.min(5, Math.round(n * 10) / 10));
}

/** Direction family used for scoring — never a preset winner. */
type DirectionFamily =
  | "world-immersion"
  | "editorial-scroll"
  | "sensory-brand"
  | "spectacle-demo"
  | "job-workbench"
  | "guided-workflow"
  | "marketing-cosplay"
  | "cinematic-saas"
  | "brand-composition"
  | "template-consumer"
  | "overbuilt-campaign";

type ConceptContext = {
  brief: string;
  lower: string;
  mode: CategoryMode;
  motifs: string[];
  m0: string;
  m1: string;
  m2: string;
  motifPhrase: string;
  audience: string;
  invite: string;
  why: string;
  emotion: string;
  materials: string[];
  techHeavy: boolean;
  scrollTheater: boolean;
  editorialBias: boolean;
  sensoryBias: boolean;
  opsBias: boolean;
  guidedBias: boolean;
  eventBias: boolean;
  a11yStated: boolean;
  perfStated: boolean;
  motifSpecificity: number;
  reference: string | null;
};

/** True when the brief asks for realtime 3D — not when it says "without WebGL". */
function hasPositiveTechSignal(lower: string): boolean {
  if (
    /\bwithout\s+(?:any\s+)?(?:webgl|three\.?js|r3f|shaders?|webgpu)\b/i.test(lower) ||
    /\bno\s+(?:webgl|three\.?js|r3f|shaders?|webgpu)\b/i.test(lower)
  ) {
    return false;
  }
  return /\b(webgl|three\.?js|r3f|shader|webgpu|activetheory|active\s*theory)\b/i.test(lower);
}

function detectMaterials(brief: string): string[] {
  const hits: string[] = [];
  const pairs: [RegExp, string][] = [
    [/glass|crystal|perfume|scent/i, "glass / translucency"],
    [/ocean|water|wave|caustic|marine/i, "water volume / caustics"],
    [/haze|stage|fog|smoke/i, "stage haze / fog"],
    [/paper|ink|editorial|magazine/i, "paper / ink plates"],
    [/metal|hull|chrome|steel/i, "matte metal / edge light"],
    [/wood|bark|forest|moss/i, "organic / bark micro-detail"],
    [/neon|festival|beam/i, "spot beams / reflective floor"],
    [/data|particle|constellation/i, "data particles / constellation"],
  ];
  for (const [re, label] of pairs) {
    if (re.test(brief) && !hits.includes(label)) hits.push(label);
  }
  return hits;
}

function motifSpecificityScore(motifs: string[]): number {
  const GENERIC = new Set([
    "site",
    "website",
    "product",
    "brand",
    "digital",
    "online",
    "modern",
    "beautiful",
    "experience",
    "platform",
    "company",
    "business",
    "page",
    "pages",
    "design",
    "creative",
    "saas",
    "teams",
    "users",
  ]);
  const specific = motifs.filter((m) => !GENERIC.has(m));
  // Keep headroom so family/fit adjustments can still move originality.
  return clamp01to5(2.0 + specific.length * 0.28);
}

function buildConceptContext(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
  mode?: CategoryMode;
}): ConceptContext {
  const brief = input.brief.trim();
  const lower = brief.toLowerCase();
  const intel = analyzeBrief({ brief, categoryKey: input.categoryKey });
  const mode = input.mode ?? intel.categoryMode;
  const motifs = tokenizeMotifs(brief);
  const m0 = motifs[0] ?? "craft";
  const m1 = motifs[1] ?? motifs[0] ?? "presence";
  const m2 = motifs[2] ?? motifs[1] ?? motifs[0] ?? "proof";
  return {
    brief,
    lower,
    mode,
    motifs,
    m0,
    m1,
    m2,
    motifPhrase: motifs.slice(0, 3).join(" / ") || "craft",
    audience: intel.audience.text,
    invite: extractInvite(brief),
    why: intel.why.text,
    emotion: intel.emotion.text,
    materials: detectMaterials(brief),
    techHeavy: hasPositiveTechSignal(lower),
    scrollTheater: /\b(scroll\s*theater|scroll.?driven|chapter|chapters)\b/i.test(lower),
    editorialBias:
      /\b(editorial|typograph|magazine|publisher|essay|long.?form)\b/i.test(lower) &&
      !hasPositiveTechSignal(lower),
    sensoryBias:
      /\b(perfume|scent|atelier|fashion|glass|intimate|lifestyle|sensory)\b/i.test(lower) ||
      /\bglass materials?\b/i.test(lower),
    opsBias:
      /\b(ops|incident|triage|audit|dashboard|workspace|assign|operator|enterprise|crm)\b/i.test(
        lower,
      ),
    guidedBias:
      /\b(onboard|checklist|wizard|guided|step.?by.?step|hr|employee|training|tutor)\b/i.test(
        lower,
      ),
    eventBias: /\b(festival|concert|tour|stage haze|ticket invite|music festival)\b/i.test(lower),
    a11yStated: /\ba11y|accessib/i.test(lower),
    perfStated: /\bperf|60\s*fps|performance\b/i.test(lower),
    motifSpecificity: motifSpecificityScore(motifs),
    reference: extractReference(brief),
  };
}

function materialLine(ctx: ConceptContext, fallback: string): string {
  return ctx.materials.length ? ctx.materials.slice(0, 3).join("; ") : fallback;
}

type DraftCandidate = Omit<ConceptCandidate, "scores" | "total"> & {
  family: DirectionFamily;
};

function draftCandidates(ctx: ConceptContext): DraftCandidate[] {
  const mat = materialLine(ctx, `${ctx.m0} atmosphere`);
  const drafts: DraftCandidate[] = [];

  if (ctx.mode === "immersive" || ctx.mode === "brand") {
    drafts.push(
      {
        family: "world-immersion",
        id: `world-${ctx.m0}`,
        label: `${titleCase(ctx.m0)} world-as-product`,
        artDirection: `Singular ${ctx.motifPhrase} world owns the viewport; chrome nearly invisible`,
        spaceMetaphor: `${ctx.m0} environment as the product — ${mat}`,
        narrative: `Arrive in ${ctx.m0} → deepen via ${ctx.m1} → prove ${ctx.m2} → ${ctx.invite}`,
        typeStance: "Expressive display + quiet technical UI face",
        materialStance: mat,
        colorStance: `Palette locked to ${ctx.motifPhrase}; one accent; reject AI-default clusters`,
        interactionStance: "Scroll timeline + optional focal hotspot tied to the world",
        infoStance: `Captions for ${ctx.audience}; no brochure walls`,
        motionStance: "2–5 owned signature beats; silence between",
        techStance: ctx.techHeavy
          ? "DOM shell + R3F/Three chapters; GSAP captions; quality presets"
          : "DOM shell + selective WebGL only where the world earns cost",
      },
      {
        family: "editorial-scroll",
        id: `editorial-${ctx.m1}`,
        label: `Editorial ${ctx.m1} scroll theater`,
        artDirection: `Typographic ${ctx.m1} chapters with selective ${ctx.m0} media — less GPU spectacle`,
        spaceMetaphor: `Magazine-of-${ctx.m0} pacing`,
        narrative: `Read/scroll ${ctx.m1} proof for ${ctx.audience}; CTA as narrative landing`,
        typeStance: "Strong editorial hierarchy; display for chapter titles only",
        materialStance: materialLine(ctx, "Paper/plate imagery; light canvas accents"),
        colorStance: "Ink-forward; accent sparingly on focal proof",
        interactionStance: "Scroll-led; minimal pointer theater",
        infoStance: "Message hierarchy L1–L4 enforced",
        motionStance: "GSAP caption theater; optional mild parallax",
        techStance: "DOM/CSS/GSAP first; WebGL optional single moment",
      },
      {
        family: "sensory-brand",
        id: `sensory-${ctx.m0}`,
        label: `Sensory ${ctx.m0} brand threshold`,
        artDirection: `Intimate brand-first composition; ${mat} as the hero signal`,
        spaceMetaphor: `${ctx.m0} threshold — desire before chrome`,
        narrative: `Desire (${ctx.m0}) → recognition → ${ctx.m2} proof → ${ctx.invite}`,
        typeStance: "Expressive brand display; quiet UI on the invite",
        materialStance: mat,
        colorStance: `Distinctive ${ctx.motifPhrase} palette; never stock blues/purples`,
        interactionStance: "Restrained micro-interactions; CTA as narrative landing",
        infoStance: "Brand → promise → proof → invite",
        motionStance: "Motif-locked accents only; no constant noise",
        techStance: "Editorial DOM; selective motion; 3D only if it serves the material thesis",
      },
      {
        family: "spectacle-demo",
        id: "spectacle-demo",
        label: "Instrument / demo-reel spectacle",
        artDirection: "Technical showcase of shaders and camera tricks",
        spaceMetaphor: "Demo booth — effects outrank brand promise",
        narrative: "Feature tour of effects",
        typeStance: "UI chrome competes with effects",
        materialStance: "Max particle/bloom density",
        colorStance: "Neon-heavy risk",
        interactionStance: "Pointer playground",
        infoStance: `Weak promise for ${ctx.audience}; strong tech flex`,
        motionStance: "Constant motion noise",
        techStance: "WebGL-max; DOM secondary",
      },
    );
  }

  if (ctx.mode === "saas" || ctx.mode === "enterprise" || ctx.mode === "ai") {
    const jobNoun = ctx.opsBias
      ? ctx.m0.includes("incident") || /incident|triage|ops/.test(ctx.lower)
        ? "incident triage"
        : `${ctx.m0} operations`
      : ctx.guidedBias
        ? `${ctx.m0} guided path`
        : `${ctx.m0} job`;
    drafts.push(
      {
        family: "job-workbench",
        id: `workbench-${ctx.m0}`,
        label: `Job-first ${jobNoun} workbench`,
        artDirection: `Clear ${jobNoun} surface; quiet chrome; distinctive but restrained tokens`,
        spaceMetaphor: `Workbench for ${ctx.audience} — tools within reach, no spectacle stage`,
        narrative: "Orient → configure → act → confirm → recover",
        typeStance: "Readable UI grotesque; sparse display only for empty/marketing edges",
        materialStance: "Flat system surfaces; purposeful elevation",
        colorStance: "Neutral base + one decisive accent for primary actions",
        interactionStance: "Forms/tables/flows with full empty/loading/error/success states",
        infoStance: `Outcome-first copy for “${clip(ctx.why, 60)}”`,
        motionStance: "State-change only",
        techStance: "DOM/CSS design system; no WebGL by default",
      },
      {
        family: "guided-workflow",
        id: `guided-${ctx.m1}`,
        label: `Guided ${ctx.m1} workflow`,
        artDirection: `Stepwise ${ctx.m1} path with progressive disclosure; calm focus panels`,
        spaceMetaphor: `Checklist corridor for ${ctx.audience}`,
        narrative: "Start → next best step → confirm → return",
        typeStance: "Quiet UI; clear step labels; no hype headlines",
        materialStance: "Soft panels; one elevated focus card at a time",
        colorStance: "Neutral + success/warn/error semantic accents",
        interactionStance: "Wizard/checklist with resume and recovery",
        infoStance: "One decision per step; evidence nearby",
        motionStance: "Step transitions only (150–250ms)",
        techStance: "DOM flows + design system; no scroll theater",
      },
      {
        family: "marketing-cosplay",
        id: "marketing-cosplay",
        label: "Marketing-site cosplay inside the app",
        artDirection: "Landing-page section stacks on every route",
        spaceMetaphor: "Brochure pasted on product",
        narrative: "Feature menus without a first job",
        typeStance: "Hype headlines",
        materialStance: "Card spam + gradients",
        colorStance: "AI-default purple risk",
        interactionStance: "CTA wallpaper",
        infoStance: "Features outrank outcomes",
        motionStance: "Decorative scroll",
        techStance: "Heavy client theater",
      },
      {
        family: "cinematic-saas",
        id: "cinematic-saas",
        label: "Cinematic SaaS spectacle",
        artDirection: "Shaders and scroll theater over workflows",
        spaceMetaphor: "Demo reel as dashboard",
        narrative: "Awe first, job later",
        typeStance: "Display type fighting dense data",
        materialStance: "Glass + glow",
        colorStance: "Neon accents",
        interactionStance: "Pretty but slow paths",
        infoStance: "Weak empty/error states",
        motionStance: "Purposeless motion",
        techStance: "Unneeded WebGL",
      },
    );
  }

  if (
    ctx.mode === "ecommerce" ||
    ctx.mode === "general" ||
    (ctx.mode !== "immersive" &&
      ctx.mode !== "brand" &&
      ctx.mode !== "saas" &&
      ctx.mode !== "enterprise" &&
      ctx.mode !== "ai")
  ) {
    drafts.push(
      {
        family: "brand-composition",
        id: `brand-${ctx.m0}`,
        label: `Brand-first ${ctx.m0} composition`,
        artDirection: `Hero-level brand signal; materials/type locked to ${ctx.motifPhrase}`,
        spaceMetaphor: `${ctx.m0} brand world threshold`,
        narrative: "Desire → recognition → proof → invite",
        typeStance: "Expressive brand display; quiet UI",
        materialStance: materialLine(ctx, "Project-specific materials (not stock kit)"),
        colorStance: `Distinctive palette from ${ctx.motifPhrase}`,
        interactionStance: "Restrained micro-interactions; CTA as narrative landing",
        infoStance: "Brand → promise → proof → invite",
        motionStance: "Motif-locked accents only",
        techStance: "Editorial DOM; selective motion; 3D only if it serves brand",
      },
      {
        family: "template-consumer",
        id: "template-consumer",
        label: "Interchangeable template consumer site",
        artDirection: "Section kit: hero card, logos, stats, testimonials grid",
        spaceMetaphor: "Any brand could wear it",
        narrative: "Generic conversion funnel",
        typeStance: "Default stacks",
        materialStance: "Stock imagery",
        colorStance: "Safe blues/purples",
        interactionStance: "Standard hover only",
        infoStance: "Promo clutter in first viewport",
        motionStance: "Pill clusters / float badges",
        techStance: "Theme pack",
      },
      {
        family: "overbuilt-campaign",
        id: "overbuilt-campaign",
        label: "Overbuilt campaign microsite",
        artDirection: "Every section fights for spectacle",
        spaceMetaphor: "Theme-park overload",
        narrative: "No single thesis",
        typeStance: "Mixed voices",
        materialStance: "Random gradients + 3D trinkets",
        colorStance: "Unrelated accents",
        interactionStance: "Show-off without invite clarity",
        infoStance: "Hierarchy collapse",
        motionStance: "Constant noise",
        techStance: "Heavy assets",
      },
    );
  }

  // Brand mode already covered in immersive|brand block; ensure ecommerce gets sensory option when relevant
  if (ctx.mode === "ecommerce" && ctx.sensoryBias) {
    drafts.unshift({
      family: "sensory-brand",
      id: `sensory-${ctx.m0}`,
      label: `Sensory ${ctx.m0} shop composition`,
      artDirection: `Brand-first commerce; ${mat} ahead of catalog chrome`,
      spaceMetaphor: `${ctx.m0} atelier → product proof → purchase invite`,
      narrative: "Desire → evaluate → trust → purchase",
      typeStance: "Brand display on hero; quiet product UI",
      materialStance: mat,
      colorStance: `Palette from ${ctx.motifPhrase}`,
      interactionStance: "Product evaluate states; clear add/checkout",
      infoStance: "Brand → product proof → price honesty → CTA",
      motionStance: "Motif accents; never bury checkout",
      techStance: "Editorial DOM + product system; no spectacle over cart",
    });
  }

  return drafts;
}

function titleCase(word: string): string {
  if (!word) return "Craft";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Compute scores from brief context — never preset constants per family.
 */
function scoreDraft(draft: DraftCandidate, ctx: ConceptContext): ConceptScorecard {
  const family = draft.family;
  const motifHit = ctx.motifs.some(
    (m) =>
      draft.artDirection.toLowerCase().includes(m) ||
      draft.spaceMetaphor.toLowerCase().includes(m) ||
      draft.label.toLowerCase().includes(m),
  );
  const materialHit = ctx.materials.some((m) =>
    draft.materialStance.toLowerCase().includes(m.split(" / ")[0]!.split(" ")[0]!),
  );

  // Originality starts from brief motif specificity, then family fit adjusts —
  // never a fixed per-archetype constant.
  let relevance = 2.4;
  let originality = ctx.motifSpecificity;
  let memorability = 2.6;
  let clarity = 3.0;
  let brandFit = 2.5;
  let feasibility = 3.5;
  let performance = 3.5;
  let a11y = 3.4;
  let coherence = 3.0;

  switch (family) {
    case "world-immersion": {
      const inWorldMode = ctx.mode === "immersive" || ctx.mode === "brand";
      relevance = inWorldMode ? 3.8 : 2.0;
      memorability = 4.3;
      clarity = 3.7;
      brandFit = 3.9;
      feasibility = ctx.techHeavy ? 4.0 : 3.3;
      performance = ctx.techHeavy ? 3.3 : 3.7;
      a11y = 3.3;
      coherence = 4.1;
      if (ctx.techHeavy) {
        relevance += 1.0;
        originality += 0.55;
        coherence += 0.2;
      } else if (ctx.eventBias) {
        relevance += 0.9;
        memorability += 0.35;
        originality += 0.4;
        brandFit += 0.2;
      } else {
        relevance -= 0.25;
        originality -= 0.15;
      }
      if (ctx.reference) brandFit += 0.25;
      if (ctx.editorialBias) relevance -= 0.9;
      if (ctx.sensoryBias && !ctx.techHeavy) relevance -= 0.8;
      if (motifHit) originality += 0.35;
      break;
    }
    case "editorial-scroll": {
      relevance =
        ctx.editorialBias ? 4.5 : ctx.mode === "immersive" || ctx.mode === "brand" ? 3.3 : 2.2;
      memorability = 3.5;
      clarity = 4.5;
      brandFit = 3.6;
      feasibility = 4.5;
      performance = 4.4;
      a11y = 4.3;
      coherence = 4.1;
      if (ctx.techHeavy) {
        relevance -= 1.1;
        originality -= 0.3;
      }
      if (ctx.editorialBias) {
        relevance += 0.4;
        originality += 0.55;
        brandFit += 0.3;
      } else if (ctx.eventBias) {
        relevance -= 0.7;
        memorability -= 0.2;
      }
      if (ctx.scrollTheater && !ctx.techHeavy && !ctx.eventBias) relevance += 0.35;
      if (ctx.sensoryBias && !ctx.editorialBias) relevance -= 0.45;
      break;
    }
    case "sensory-brand": {
      // Only a contender when the brief asks for sensory/material brand craft.
      relevance = ctx.sensoryBias
        ? 4.6
        : ctx.mode === "brand"
          ? 3.2
          : ctx.mode === "immersive"
            ? 2.6
            : 2.2;
      memorability = ctx.sensoryBias ? 4.4 : 3.4;
      clarity = 4.0;
      brandFit = ctx.sensoryBias ? 4.6 : 3.3;
      feasibility = 4.2;
      performance = 4.0;
      a11y = 4.0;
      coherence = ctx.sensoryBias ? 4.4 : 3.5;
      originality += ctx.sensoryBias ? 0.5 : -0.6;
      if (ctx.techHeavy) relevance -= 0.7;
      if (ctx.sensoryBias && materialHit) {
        brandFit += 0.25;
        originality += 0.35;
      }
      if (ctx.opsBias) relevance -= 1.2;
      if (ctx.editorialBias && !ctx.sensoryBias) relevance -= 0.5;
      break;
    }
    case "spectacle-demo":
      relevance = ctx.techHeavy && /demo|reel|shader playground/i.test(ctx.lower) ? 3.2 : 1.9;
      originality = Math.min(2.6, originality - 0.8);
      memorability = 3.3;
      clarity = 2.1;
      brandFit = 1.7;
      feasibility = 2.7;
      performance = 1.9;
      a11y = 1.7;
      coherence = 1.8;
      break;
    case "job-workbench":
      relevance = ctx.opsBias || ctx.mode === "saas" || ctx.mode === "enterprise" ? 4.4 : 3.0;
      originality = Math.min(3.9, ctx.motifSpecificity + (motifHit ? 0.35 : 0) + (ctx.opsBias ? 0.25 : 0));
      memorability = 3.3;
      clarity = 4.7;
      brandFit = 3.8;
      feasibility = 4.7;
      performance = 4.6;
      a11y = 4.5;
      coherence = 4.6;
      if (ctx.guidedBias && !ctx.opsBias) relevance -= 0.65;
      if (ctx.opsBias) relevance += 0.45;
      break;
    case "guided-workflow":
      relevance = ctx.guidedBias ? 4.8 : ctx.mode === "saas" ? 3.5 : 2.5;
      originality = Math.min(
        3.9,
        ctx.motifSpecificity + (ctx.guidedBias ? 0.55 : 0) + (motifHit ? 0.2 : 0),
      );
      memorability = 3.2;
      clarity = 4.6;
      brandFit = 3.6;
      feasibility = 4.6;
      performance = 4.5;
      a11y = 4.6;
      coherence = 4.4;
      if (ctx.opsBias && !ctx.guidedBias) relevance -= 0.55;
      if (ctx.guidedBias) relevance += 0.2;
      break;
    case "marketing-cosplay":
      relevance = 1.8;
      originality = 1.4;
      memorability = 2.1;
      clarity = 1.9;
      brandFit = 1.6;
      feasibility = 3.4;
      performance = 2.7;
      a11y = 2.4;
      coherence = 1.5;
      break;
    case "cinematic-saas":
      relevance = 1.6;
      originality = 2.4;
      memorability = 3.0;
      clarity = 1.6;
      brandFit = 1.7;
      feasibility = 2.4;
      performance = 1.8;
      a11y = 1.9;
      coherence = 1.4;
      break;
    case "brand-composition":
      relevance =
        ctx.mode === "brand" || ctx.mode === "ecommerce" || ctx.mode === "general" ? 4.3 : 2.9;
      originality = ctx.motifSpecificity + (motifHit ? 0.45 : -0.2);
      memorability = 4.1;
      clarity = 4.0;
      brandFit = 4.5;
      feasibility = 4.2;
      performance = 4.0;
      a11y = 3.9;
      coherence = 4.3;
      break;
    case "template-consumer":
      relevance = 1.9;
      originality = 1.2;
      memorability = 1.5;
      clarity = 2.9;
      brandFit = 1.3;
      feasibility = 4.7;
      performance = 4.2;
      a11y = 3.4;
      coherence = 1.7;
      break;
    case "overbuilt-campaign":
      relevance = 2.1;
      originality = 2.3;
      memorability = 2.8;
      clarity = 1.7;
      brandFit = 1.9;
      feasibility = 2.8;
      performance = 2.2;
      a11y = 2.0;
      coherence = 1.6;
      break;
  }

  if (motifHit) {
    relevance += 0.2;
    brandFit += 0.15;
  }
  if (
    ctx.a11yStated &&
    (family === "spectacle-demo" || family === "cinematic-saas" || family === "overbuilt-campaign")
  ) {
    a11y -= 0.6;
    relevance -= 0.3;
  }
  if (
    ctx.perfStated &&
    (family === "spectacle-demo" || family === "cinematic-saas" || family === "world-immersion")
  ) {
    performance -= family === "world-immersion" ? 0.2 : 0.5;
  }
  const inviteHint = ctx.invite.split(" / ")[0]!.toLowerCase().slice(0, 12);
  if (inviteHint.length > 3 && draft.narrative.toLowerCase().includes(inviteHint)) {
    clarity += 0.1;
  }

  return {
    relevance: clamp01to5(relevance),
    originality: clamp01to5(originality),
    memorability: clamp01to5(memorability),
    clarity: clamp01to5(clarity),
    brandFit: clamp01to5(brandFit),
    feasibility: clamp01to5(feasibility),
    performance: clamp01to5(performance),
    a11y: clamp01to5(a11y),
    coherence: clamp01to5(coherence),
  };
}

/**
 * Explore genuinely different creative directions, score from brief context, select strongest.
 * Present selected + short why — not a brainstorm dump. No preset winners or fixed originality.
 */
export function exploreAndSelectConcept(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
  mode?: CategoryMode;
}): ConceptSelection {
  const ctx = buildConceptContext(input);
  const drafts = draftCandidates(ctx);
  const candidates: ConceptCandidate[] = drafts.map((draft) => {
    const scores = scoreDraft(draft, ctx);
    return {
      id: draft.id,
      label: draft.label,
      artDirection: draft.artDirection,
      spaceMetaphor: draft.spaceMetaphor,
      narrative: draft.narrative,
      typeStance: draft.typeStance,
      materialStance: draft.materialStance,
      colorStance: draft.colorStance,
      interactionStance: draft.interactionStance,
      infoStance: draft.infoStance,
      motionStance: draft.motionStance,
      techStance: draft.techStance,
      scores,
      total: scoreTotal(scores),
    };
  });

  candidates.sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));
  const selected = candidates[0]!;
  const rejected = candidates.slice(1);
  const why = [
    `Selected “${selected.label}” (score ${selected.total}/5) for ${ctx.audience}.`,
    `Strongest on ${topScoreDims(selected.scores).join(", ")}.`,
    `Direction: ${selected.artDirection}`,
    `Scored from brief signals (motifs: ${ctx.motifPhrase}; mode: ${ctx.mode}) — not preset ranks.`,
    rejected.length
      ? `Rejected weaker alternatives: ${rejected.map((r) => `${r.label} (${r.total})`).join("; ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    selected,
    why,
    explored: candidates,
    rejectedOneLiners: rejected.map(
      (r) => `${r.label}: lost on ${weakScoreDims(r.scores).join("/")} (${r.total}/5)`,
    ),
  };
}

function topScoreDims(scores: ConceptScorecard): string[] {
  return (Object.entries(scores) as [keyof ConceptScorecard, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
}

function weakScoreDims(scores: ConceptScorecard): string[] {
  return (Object.entries(scores) as [keyof ConceptScorecard, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([k]) => k);
}


/**
 * Deterministic brief → concept synthesizer.
 * Two different briefs must not collapse into the same creative bible.
 */
export function synthesizeConcept(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
}): ConceptSynth {
  const brief = input.brief.trim();
  const intel = analyzeBrief({ brief, categoryKey: input.categoryKey });
  const immersive = isImmersiveCategory(input.categoryKey) || intel.categoryMode === "immersive";
  const selection = exploreAndSelectConcept({
    brief,
    categoryKey: input.categoryKey,
    mode: intel.categoryMode,
  });
  const selected = selection.selected;
  const motifs = tokenizeMotifs(brief);
  const verbs = extractVerbs(brief, motifs);
  const audience = intel.audience.text;
  const invite = extractInvite(brief);
  const referenceLabel = extractReference(brief);
  const worldNoun =
    immersive || intel.categoryMode === "brand"
      ? motifs[0]
        ? `${motifs[0]} world`
        : immersive
          ? "immersive brand world"
          : "brand world"
      : intel.categoryMode === "saas"
        ? "product workbench"
        : motifs[0]
          ? `${motifs[0]} surface`
          : "product surface";
  const artTokens = pickPalette(motifs, immersive || intel.categoryMode === "brand");
  const chapters = chapterCast(motifs, audience, invite, worldNoun);
  const northStar = immersive
    ? `${clip(brief, 100)} — ${selected.label}: singular ${worldNoun} where ${audience} ${verbs[0] ?? "arrive"}, ${verbs[1] ?? "deepen"}, then ${verbs[3] ?? "act"} — never as a SaaS marketing template.`
    : intel.categoryMode === "saas"
      ? `${selected.label}: deliver “${clip(brief, 80)}” as a job-first system for ${audience} — clarity and states over spectacle.`
      : intel.categoryMode === "brand"
        ? `${selected.label}: “${clip(brief, 80)}” as a brand-first composition for ${audience} — pass the brand-swap test.`
        : `Deliver the job in “${clip(brief, 90)}” with distinctive craft cues for ${audience}, without generic AI boilerplate.`;

  const pillars: ConceptSynth["pillars"] = immersive
    ? [
        `Presence — ${worldNoun} owns the first viewport as one composition`,
        `Motif lock — ${motifs.slice(0, 3).join(" / ")} recur in type, material, and motion`,
        `Authored motion — beat grid owners (GSAP/R3F/shader) never fight`,
        `Honest invite — ${invite} lands after craft proof, not wallpaper CTAs`,
      ]
    : intel.categoryMode === "saas"
      ? [
          `Job clarity — ${audience} sees the outcome immediately`,
          `System coherence — ${selected.colorStance}`,
          `State honesty — empty/loading/error/success feel deliberate`,
          `No spectacle cosplay — ${selected.techStance}`,
        ]
      : intel.categoryMode === "brand"
        ? [
            `Brand presence — hero-level identity in the first viewport`,
            `Material thesis — ${selected.materialStance}`,
            `Type lock — ${selected.typeStance}`,
            `Invite clarity — ${invite} after proof, not promo clutter`,
          ]
        : [
            `Job clarity — ${audience} sees the outcome immediately`,
            `Coherence — tokens, voice, and flows agree`,
            `Trust — empty/loading/error states feel deliberate`,
            `Honesty — inferred DNA stays labeled`,
          ];

  const fingerprint = hashFingerprint([
    input.categoryKey,
    brief.toLowerCase(),
    motifs.join(","),
    selected.id,
    northStar,
    pillars.join("|"),
    artTokens.accent,
    chapters.map((c) => c.proof).join("|"),
  ]);

  const modeAnti =
    intel.categoryMode === "saas"
      ? [
          "Cinematic shaders ahead of task states",
          "Marketing section stacks inside app routes",
          "Decorative scroll theater without a product job",
        ]
      : intel.categoryMode === "brand"
        ? [
            "First viewport that fails the brand-swap test",
            "Interchangeable template section kits",
            "Stats strips and promo clusters competing with brand",
          ]
        : [
            "Eager-loading all GLTFs on first paint",
            "Fighting timelines (multiple owners on one transform)",
            "Constant scroll-triggered noise on every element",
            "SaaS dashboard chrome posing as an immersive brand world",
          ];

  return {
    fingerprint,
    worldNoun,
    audience,
    invite,
    referenceLabel,
    motifs,
    verbs,
    northStar,
    pillars,
    emotionalArc: {
      arrival:
        intel.categoryMode === "saas"
          ? `Orient ${audience} on the job in ~3s`
          : `Awe inside ${worldNoun}; brand readable in ~3s`,
      deepen:
        intel.categoryMode === "saas"
          ? "Progress through configure/act with diminishing uncertainty"
          : `Curiosity via ${motifs[1] ?? motifs[0]} chapter craft`,
      proof:
        intel.categoryMode === "saas"
          ? "Confidence from complete states and trustworthy feedback"
          : `Confidence from ${motifs[2] ?? "evidence"} the visitor can feel`,
      invite: `Calm resolve — ${invite}`,
    },
    sensory: {
      sight: `${artTokens.base} atmosphere + ${artTokens.accent} accent; ${artTokens.materials[0]}`,
      motion: selected.motionStance,
      sound: "Optional; never required; captions if used",
      touch:
        intel.categoryMode === "saas"
          ? "Pointer/keyboard on primary controls; no precision-aim gimmicks"
          : "Pointer/focus only on CTAs and focal hotspots",
    },
    artTokens,
    chapters,
    beatGrid: buildBeatGrid(motifs),
    shaderBudget: shaderBudgetFor(motifs),
    assetSpecs: assetSpecsFor(motifs),
    motionScorecard: [
      "Signature beat count: 2–5 (fail if 0 or >8 noisy tweens)",
      "Ownership conflicts: 0 (fail if GSAP and R3F both drive same property)",
      "Desktop FPS target: 60 (fail if sustained <45 on mid laptop)",
      "Mobile path: ≥30fps or static filmstrip fallback",
      "Reduced-motion: every beat has non-paralytic fallback",
      "First viewport: brand test passes with nav removed",
      `Motif recurrence: ${motifs.slice(0, 3).join(", ")} visible in art + motion`,
    ],
    antiPatterns: [
      "Card-grid heroes, floating promo chips, stat strips in first viewport",
      "Purple-glow / cream+terracotta AI-default aesthetics",
      "Claiming awards or cloning studio signatures",
      ...modeAnti,
    ],
    referencePrinciples: [
      ...referencePrinciples(referenceLabel),
      `Selected concept: ${selected.label} — ${selection.why}`,
    ],
    selection,
  };
}

export function formatTokenSheet(tokens: ConceptSynth["artTokens"]): string {
  return [
    `- Display face: ${tokens.displayFace}`,
    `- UI face: ${tokens.uiFace}`,
    `- Base: \`${tokens.base}\` · Surface: \`${tokens.surface}\` · Ink: \`${tokens.ink}\``,
    `- Accent: \`${tokens.accent}\` · Accent soft: \`${tokens.accentSoft}\` · Fog: \`${tokens.fog}\``,
    `- Glow law: ${tokens.glowNote}`,
    `- Materials: ${tokens.materials.join("; ")}`,
    `- Lighting: ${tokens.lighting}`,
    "- Imagery plates:",
    ...tokens.imageryPlates.map((p) => `  - ${p}`),
  ].join("\n");
}

export function formatChapterTable(chapters: ConceptSynth["chapters"]): string {
  return [
    "| Chapter | Job | Proof | CTA posture |",
    "|---|---|---|---|",
    ...chapters.map(
      (c) => `| ${c.id} | ${c.job} | ${c.proof} | ${c.cta} |`,
    ),
  ].join("\n");
}

export function formatSceneInventory(chapters: ConceptSynth["chapters"]): string {
  return chapters
    .map(
      (c) =>
        [
          `### ${c.id}`,
          `- Camera: ${c.camera}`,
          `- Hero asset: ${c.heroAsset}`,
          `- Shader accent: ${c.shaderAccent}`,
          `- Dispose: ${c.dispose}`,
          `- Job: ${c.job}`,
        ].join("\n"),
    )
    .join("\n\n");
}

export function formatBeatGrid(beats: ConceptSynth["beatGrid"]): string {
  return [
    "| Beat | Owner | Duration | Easing | Scrub | Reduced motion |",
    "|---|---|---|---|---|---|",
    ...beats.map(
      (b) =>
        `| ${b.id} | ${b.owner} | ${b.durationMs} | ${b.easing} | ${b.scrub} | ${b.reducedMotion} |`,
    ),
  ].join("\n");
}

export function formatShaderBudget(budget: ConceptSynth["shaderBudget"]): string {
  return [
    "| Effect | Tier | Drop order (1 = drop first on low power) |",
    "|---|---|---|",
    ...budget.map((b) => `| ${b.effect} | ${b.tier} | ${b.dropOrder} |`),
    "",
    "Quality presets: high (all) / medium (drop high tier) / low (low tier + DOM filmstrip).",
  ].join("\n");
}

export function formatAssetSpecs(specs: ConceptSynth["assetSpecs"]): string {
  return [
    "| Asset | Kind | Budget | Format | Notes |",
    "|---|---|---|---|---|",
    ...specs.map((s) => `| ${s.name} | ${s.kind} | ${s.budget} | ${s.format} | ${s.notes} |`),
  ].join("\n");
}
