import type { CategoryMode } from "./brief-intelligence.ts";

/**
 * Creative coherence law — prevent generic AI aesthetics and purposeless craft.
 * Not categorical bans: justify by direction; coherence > feature count.
 */
export type CoherenceRule = {
  id: string;
  severity: "critical" | "high" | "medium";
  pattern: string;
  why: string;
  /** When this rule softens (direction may justify the pattern). */
  allowWhen?: string;
};

export type CoherencePack = {
  mode: CategoryMode;
  thesis: string;
  rules: CoherenceRule[];
  checklist: string[];
  failMarkers: string[];
};

export function buildCoherencePack(input: {
  mode: CategoryMode;
  northStar: string;
  motifs: readonly string[];
}): CoherencePack {
  const motifNote = input.motifs.slice(0, 3).join(", ") || "brief motifs";
  const shared: CoherenceRule[] = [
    {
      id: "ai-default-looks",
      severity: "critical",
      pattern: "Purple-on-white / purple-indigo glow, cream+#F4F1EA serif+terracotta, or glassmorphism-by-default",
      why: "These are AI aesthetic clusters; they erase brand.",
      allowWhen: "Only if the brief explicitly demands that palette — still avoid glow soup.",
    },
    {
      id: "card-spam",
      severity: "high",
      pattern: "Card grids, floating badges, promo chips, or stat strips as the hero idea",
      why: "First viewport must be one composition, not a dashboard of cards.",
      allowWhen: "Cards only as containers for real user interaction (forms, editors).",
    },
    {
      id: "purposeless-motion",
      severity: "high",
      pattern: "Motion that does not clarify state, narrative, or brand motif",
      why: "Motion without job creates noise and burns performance.",
      allowWhen: "Signature beats owned in the beat grid / motion language.",
    },
    {
      id: "inconsistent-type-space",
      severity: "high",
      pattern: "Arbitrary type scales, random gradients, inconsistent spacing rhythm",
      why: "Breaks Experience DNA and looks template-generated.",
    },
    {
      id: "placeholder-content",
      severity: "critical",
      pattern: "Lorem, fake awards, unlabeled invented requirements",
      why: "Agents and reviewers treat mush as authority.",
    },
  ];

  const modeRules: CoherenceRule[] =
    input.mode === "immersive"
      ? [
          {
            id: "saas-chrome-as-world",
            severity: "critical",
            pattern: "SaaS dashboard chrome posing as an immersive brand world",
            why: "Wrong medium for immersive briefs.",
          },
          {
            id: "arbitrary-3d",
            severity: "high",
            pattern: "3D scenes with no narrative/job ownership",
            why: "WebGL must earn its cost via Experience DNA.",
            allowWhen: "Scene inventory rows with camera, hero asset, shader accent, dispose.",
          },
          {
            id: "clone-studio",
            severity: "critical",
            pattern: "Cloning Lusion / Active Theory signature layouts",
            why: "Reference = posture only; never reproduce signature composition.",
          },
        ]
      : input.mode === "saas"
        ? [
            {
              id: "spectacle-over-usability",
              severity: "critical",
              pattern: "Cinematic shaders / scroll theater ahead of empty/loading/error/recovery states",
              why: "SaaS coherence = job completion first.",
            },
            {
              id: "marketing-template-app",
              severity: "high",
              pattern: "Every route looks like a landing page section stack",
              why: "Product surfaces need task hierarchy, not brochure sections.",
            },
            {
              id: "excess-rounding-noise",
              severity: "medium",
              pattern: "Excess rounding, multi-layer shadows, pill clusters without system",
              why: "Reads as generic AI UI kit.",
            },
          ]
        : input.mode === "brand"
          ? [
              {
                id: "brand-weak-hero",
                severity: "critical",
                pattern: "First viewport that could belong to another brand after removing nav",
                why: "Brand test failure.",
              },
              {
                id: "template-sections",
                severity: "high",
                pattern: "Interchangeable template sections with no material/type thesis",
                why: "Consumer/brand work needs distinctive DNA, not section kits.",
              },
            ]
          : [
              {
                id: "feature-count-over-coherence",
                severity: "high",
                pattern: "Feature sprawl without a single experience thesis",
                why: "Coherence beats feature count.",
              },
            ];

  const checklist =
    input.mode === "immersive"
      ? [
          `Motifs (${motifNote}) recur in type, material, and motion`,
          "First viewport passes brand/composition test with nav removed",
          "Every motion beat has an owner; no fighting timelines",
          "Reduced-motion path still tells the story",
          "No AI-default palette relapse",
        ]
      : input.mode === "saas"
        ? [
            "Primary job readable in ≤5 seconds",
            "Empty/loading/error/success states designed",
            "Tokens/type/space consistent across primary routes",
            "Motion only clarifies state change",
            "No decorative 3D unless brief demands it",
          ]
        : [
            "Experience thesis still holds after scrolling one screen",
            "Type/color/material choices feel project-specific",
            "No card-spam or AI-default looks",
            "Content hierarchy matches Brief Intelligence",
          ];

  return {
    mode: input.mode,
    thesis: `Coherence lock for “${input.northStar.slice(0, 120)}” — prefer fewer, truer moves over feature theater.`,
    rules: [...shared, ...modeRules],
    checklist,
    failMarkers: [
      "purple gradient",
      "glassmorphism-by-default",
      "card-grid hero",
      "Structured placeholder",
      "expressive interactive experience",
      "lorem ipsum",
    ],
  };
}

export function formatCoherencePack(pack: CoherencePack): string {
  return [
    `- Thesis: ${pack.thesis}`,
    `- Mode: ${pack.mode}`,
    "",
    "### Coherence rules",
    ...pack.rules.map(
      (r) =>
        `- **${r.id}** (${r.severity}): avoid “${r.pattern}” — ${r.why}${
          r.allowWhen ? ` Allow when: ${r.allowWhen}` : ""
        }`,
    ),
    "",
    "### Coherence checklist",
    ...pack.checklist.map((c) => `- [ ] ${c}`),
  ].join("\n");
}
