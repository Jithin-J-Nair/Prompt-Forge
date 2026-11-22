import { createHash } from "node:crypto";
import type { ProjectCategoryKey } from "./categories.ts";
import { isImmersiveCategory } from "./blueprints-content.ts";

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

/**
 * Deterministic brief → concept synthesizer.
 * Two different briefs must not collapse into the same creative bible.
 */
export function synthesizeConcept(input: {
  brief: string;
  categoryKey: ProjectCategoryKey;
}): ConceptSynth {
  const brief = input.brief.trim();
  const immersive = isImmersiveCategory(input.categoryKey);
  const motifs = tokenizeMotifs(brief);
  const verbs = extractVerbs(brief, motifs);
  const audience = extractAudience(brief);
  const invite = extractInvite(brief);
  const referenceLabel = extractReference(brief);
  const worldNoun = motifs[0] ? `${motifs[0]} world` : immersive ? "immersive brand world" : "product surface";
  const artTokens = pickPalette(motifs, immersive);
  const chapters = chapterCast(motifs, audience, invite, worldNoun);
  const northStar = immersive
    ? `${clip(brief, 100)} — experienced as a singular ${worldNoun} where ${audience} ${verbs[0] ?? "arrive"}, ${verbs[1] ?? "deepen"}, then ${verbs[3] ?? "act"} — never as a SaaS marketing template.`
    : `Deliver the job in “${clip(brief, 90)}” with distinctive craft cues for ${audience}, without generic AI boilerplate.`;

  const pillars: ConceptSynth["pillars"] = immersive
    ? [
        `Presence — ${worldNoun} owns the first viewport as one composition`,
        `Motif lock — ${motifs.slice(0, 3).join(" / ")} recur in type, material, and motion`,
        `Authored motion — beat grid owners (GSAP/R3F/shader) never fight`,
        `Honest invite — ${invite} lands after craft proof, not wallpaper CTAs`,
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
    northStar,
    pillars.join("|"),
    artTokens.accent,
    chapters.map((c) => c.proof).join("|"),
  ]);

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
      arrival: `Awe inside ${worldNoun}; brand readable in ~3s`,
      deepen: `Curiosity via ${motifs[1] ?? motifs[0]} chapter craft`,
      proof: `Confidence from ${motifs[2] ?? "evidence"} the visitor can feel`,
      invite: `Calm resolve — ${invite}`,
    },
    sensory: {
      sight: `${artTokens.base} atmosphere + ${artTokens.accent} accent; ${artTokens.materials[0]}`,
      motion: "2–5 signature beats from beat grid; silence between them",
      sound: "Optional; never required; captions if used",
      touch: "Pointer/focus only on CTAs and focal hotspots",
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
      "Eager-loading all GLTFs on first paint",
      "Fighting timelines (multiple owners on one transform)",
      "Constant scroll-triggered noise on every element",
      "Claiming awards or cloning studio signatures",
      "SaaS dashboard chrome posing as an immersive brand world",
    ],
    referencePrinciples: referencePrinciples(referenceLabel),
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
