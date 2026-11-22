import { getSkillBySlug } from "../skillforge/catalog.ts";
import type { CompositionPreview } from "../skillforge/types.ts";

export const PROMPTFORGE_BRIDGE_STORAGE_KEY = "promptforge.skillforge-bridge.v1";

export type PromptForgeBridgePayload = {
  version: 1;
  createdAt: string;
  cookFilename: string;
  categoryKey: string;
  categoryLabel: string;
  brief: string;
  catalogVersion: string;
  graphHash: string;
  accepted: boolean;
  reviewStatus: string;
  skillSlugs: string[];
  skillNames: string[];
  artifactKeys: string[];
  orchestratorPrompt: string;
  cookPrompt: string;
};

/**
 * PromptForge BODY prompt: how an agentic AI must execute once COOK.md (SkillForge BRAIN) is attached.
 * This is not a second copy of the skills — it is the operating protocol that points into COOK.md.
 */
export function buildOrchestratorPrompt(preview: CompositionPreview): string {
  const immersive =
    preview.categoryKey === "awwwards-website" ||
    preview.categoryKey === "threejs-experience" ||
    preview.graph.nodes.some((node) =>
      ["threejs-architect", "r3f-architect", "gsap-architect", "shader-engineer", "motion-director"].includes(
        node.nodeKey,
      ),
    );

  const cookFilename = `skillforge-COOK-${preview.categoryKey}.md`;

  const skillRoster = preview.graph.nodes
    .map((node, index) => {
      const skill = getSkillBySlug(node.nodeKey);
      const caps = (skill?.identity.capabilities ?? []).slice(0, 4).join(", ");
      return [
        `${index + 1}. **${node.name}** (\`${node.nodeKey}\`) — priority ${node.priority}`,
        `   - Scope in COOK: ${node.assignedScope.join(", ") || "package-wide"}`,
        caps ? `   - Capabilities: ${caps}` : null,
        `   - Open COOK.md → Expertise graph → ${node.name} and obey its mission, principles, acceptance criteria.`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const artifactIndex = preview.artifactPreviews
    .map((item) => `- \`${item.logicalKey}\` — locate this section inside COOK.md / the export pack and treat it as source of truth`)
    .join("\n");

  const excellenceBar = immersive
    ? [
        "Target bar: **Awwwards Site of the Year / Active Theory–class immersive craft** — not a SaaS marketing template.",
        "First viewport must read as one composition (brand + one headline + one support line + one CTA group + one dominant visual plane).",
        "Motion is authored (buttons, media reveals, scroll theater). WebGL/R3F only where COOK scene inventory requires it.",
        "Reject AI-default looks: purple gradients, cream-serif terracotta, card-grid heroes, emoji clusters, glow soup.",
      ].join("\n")
    : [
        `Target bar: **category-best ${preview.categoryLabel}** — distinctive, complete, and review-gated — not generic AI boilerplate.`,
        "Primary jobs and flows must work with empty/loading/error/success states.",
        "Honor COOK design/system and architecture boundaries; do not invent parallel products.",
      ].join("\n");

  const phases = immersive
    ? [
        "### Phase 0 — Internalize the brain (read-only) · HARD GATE",
        "1. Confirm COOK.md is attached. If missing, reply `BLOCKED: COOK.md not attached` and stop.",
        "2. Read in order: EXPERIENCE_DNA → CREATIVE_DIRECTION → ART_DIRECTION → STORY_SYSTEM → DESIGN_SYSTEM (Motion scorecard/Beat grid) → ARCHITECTURE (Scene inventory/ASSET_SPEC) → REVIEWER_FRAMEWORKS.",
        "3. Emit a Phase-0 artifact (≤12 lines) before any code:",
        "   - Concept fingerprint (copy from COOK)",
        "   - North star (1 line)",
        "   - Motifs (3)",
        "   - Token sheet accents (hex + display face)",
        "   - Chapter ids from STORY_SYSTEM",
        "   - First-viewport composition law",
        "4. **Fail closed:** if COOK lacks Concept fingerprint, Token sheet hex, Beat grid, or Scene inventory camera rows → reply `BLOCKED: COOK craft incomplete` and stop. Do not invent a generic Awwwards template.",
        "",
        "### Phase 1 — Scaffold",
        "1. Create/align the app scaffold to Technical Stack DNA in COOK.",
        "2. Establish routes/chapters from STORY_SYSTEM + USER_FLOWS (use COOK chapter ids, not invent new acts).",
        "3. Wire ART_DIRECTION token sheet (named faces + hex) into CSS variables before decorative UI.",
        "",
        "### Phase 2 — Story architecture",
        "1. Implement chapter map with one job per chapter from COOK.",
        "2. Protect message hierarchy in the first viewport.",
        "3. Place primary CTA as narrative landing (DOM-reachable, keyboardable).",
        "",
        "### Phase 3 — Art + motion craft · HARD GATE",
        "1. Full-bleed / one-composition hero per ART_DIRECTION.",
        "2. Button/CTA micro-interactions; image/media placeholder + reveal; scroll theater.",
        "3. Implement COOK Beat grid + Ownership matrix exactly (GSAP/R3F/shader owners).",
        "4. Build Scene inventory rows (camera, hero asset, shader accent, dispose).",
        "5. Honor ASSET_SPEC budgets; never eager-load all GLTFs.",
        "6. Reduced-motion fallbacks + performance quality presets.",
        "7. **Fail closed:** if you cannot point to a filled ownership matrix + ≥2 signature beats, do not claim Phase 3 done.",
        "",
        "### Phase 4 — Systems + states",
        "1. Complete primary flows with all interaction states.",
        "2. Accessibility: focus, names, contrast, keyboard chapter path.",
        "3. Keep ARCHITECTURE as boundaries only — no architecture theater.",
        "",
        "### Phase 5 — Review council simulation · HARD GATE",
        "1. Fill COOK Motion scorecard as a checklist with pass/fail.",
        "2. Run REVIEWER_FRAMEWORKS + QUALITY_CHECKLIST against the build.",
        "3. Fail yourself on card-grid heroes, missing motif recurrence, AI-default purple/cream, ownership conflicts, or broken a11y.",
        "4. Fix critical fails before claiming done. If scorecard has any critical fail → not done.",
      ].join("\n")
    : [
        "### Phase 0 — Internalize the brain (read-only)",
        "1. Confirm COOK.md is attached. If missing, stop and request it.",
        "2. Read EXPERIENCE_DNA / PRODUCT_STRATEGY / USER_FLOWS / DESIGN_SYSTEM / REVIEWER_FRAMEWORKS (as present).",
        "3. Restate the user job, outcomes, and non-goals in ≤8 lines before coding.",
        "",
        "### Phase 1 — Scaffold + boundaries",
        "1. Align stack to COOK Technical Stack DNA.",
        "2. Honor ARCHITECTURE boundaries; do not invent extra subsystems.",
        "",
        "### Phase 2 — Core journeys",
        "1. Implement primary flows from USER_FLOWS with full states.",
        "2. Apply design tokens and interaction rules from DESIGN_SYSTEM.",
        "",
        "### Phase 3 — Category excellence",
        "1. Apply every skill in the COOK expertise graph in priority order.",
        "2. Satisfy each skill’s acceptance criteria before moving on.",
        "",
        "### Phase 4 — Review gates",
        "1. Simulate REVIEWER_FRAMEWORKS / QUALITY_CHECKLIST.",
        "2. Fix critical/high fails; label unknowns honestly.",
      ].join("\n");

  const lines = [
    "# PROMPTFORGE BODY PROMPT — paste into an agentic AI with COOK.md attached",
    "",
    "> **Brain + body protocol**",
    `> - **BRAIN** = SkillForge \`${cookFilename}\` (skills, DNA, craft artifacts, acceptance criteria)`,
    "> - **BODY** = this PromptForge prompt (execution structure, phases, skill links, review gates)",
    "> - Do not build from vibes. Do not rebuild a generic template and sprinkle COOK adjectives on top.",
    "",
    "## Mission",
    `Build a **${preview.categoryLabel}** experience for:`,
    "",
    `> ${preview.brief}`,
    "",
    excellenceBar,
    "",
    "## Hard laws",
    "- COOK.md is the source of truth for craft, skills, and constraints.",
    "- This PromptForge body tells you *how* to operate on COOK — it does not replace COOK.",
    "- `executionAuthorized` remains **false** for production deploys/secrets; stub those and label them.",
    `- Package gate: **${preview.accepted ? "ACCEPTED" : "DRAFT — treat as guidance; still aim for excellence"}** (council: ${preview.reviewStatus}).`,
    "- Never invent confirmed facts; respect inferred/unknown DNA labels in COOK.",
    "",
    "## Attachment check (do this first)",
    `1. Verify \`${cookFilename}\` (or the SkillForge COOK export) is in your working context.`,
    "2. If COOK is missing: reply with exactly `BLOCKED: COOK.md not attached` and stop.",
    "3. If COOK is present: begin Phase 0.",
    "",
    "## Project coordinates",
    `- Category: **${preview.categoryLabel}** (\`${preview.categoryKey}\`)`,
    `- Catalog: \`${preview.catalogVersion}\``,
    `- Graph: \`${preview.graphHash}\``,
    "",
    "## Skill roster (follow COOK order — these are your specialist brains)",
    "For each skill below: open the matching section in COOK.md, absorb mission/principles/acceptance, then apply it in the phase where it belongs.",
    "",
    skillRoster,
    "",
    "## Artifact map (all live inside COOK / export pack)",
    artifactIndex,
    "",
    "## Execution structure",
    phases,
    "",
    "## Between-phase checklist (mandatory)",
    "- [ ] Still aligned to COOK north star / job statement?",
    "- [ ] Any new claim labeled confirmed vs inferred vs unknown?",
    "- [ ] Accessibility path intact for primary CTA?",
    immersive
      ? [
          "- [ ] First viewport still one composition (no card-grid relapse)?",
          "- [ ] Concept fingerprint / motifs still visible in art + motion?",
          "- [ ] Token sheet hex faces still in CSS (no purple-gradient relapse)?",
          "- [ ] Ownership matrix intact (no fighting timelines)?",
        ].join("\n")
      : "- [ ] Primary flow states still complete?",
    "- [ ] No secrets/production actions performed?",
    "",
    "## Done means",
    immersive
      ? [
          "- A stranger would feel a distinctive branded experience in the first 5 seconds.",
          "- Story chapters land; art direction holds under scroll; motion feels authored.",
          "- Motion scorecard critical gates pass; ASSET_SPEC budgets honored.",
          "- Every COOK skill’s acceptance criteria for this package is met or explicitly deferred with reason.",
          "- Reviewer frameworks would pass critical gates.",
        ].join("\n")
      : [
          "- The stated user job is solvable end-to-end with honest states.",
          "- COOK skill acceptance criteria are met or explicitly deferred with reason.",
          "- Reviewer frameworks would pass critical gates.",
        ].join("\n"),
    "",
    "## Start now",
    "1. Confirm COOK attachment.",
    immersive
      ? "2. Emit Phase 0 hard-gate artifact (fingerprint, tokens, chapters) — fail closed if COOK craft incomplete."
      : "2. Complete Phase 0 restatement (≤8 lines).",
    "3. Proceed Phase 1 without waiting for permission unless truly blocked.",
    "",
  ];

  return lines.join("\n");
}

export function buildPromptForgeBridgePayload(
  preview: CompositionPreview,
  cookPrompt: string,
): PromptForgeBridgePayload {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    cookFilename: `skillforge-COOK-${preview.categoryKey}.md`,
    categoryKey: preview.categoryKey,
    categoryLabel: preview.categoryLabel,
    brief: preview.brief,
    catalogVersion: preview.catalogVersion,
    graphHash: preview.graphHash,
    accepted: preview.accepted,
    reviewStatus: preview.reviewStatus,
    skillSlugs: preview.graph.nodes.map((node) => node.nodeKey),
    skillNames: preview.graph.nodes.map((node) => node.name),
    artifactKeys: preview.artifactPreviews.map((item) => item.logicalKey),
    orchestratorPrompt: buildOrchestratorPrompt(preview),
    cookPrompt,
  };
}

export function isPromptForgeBridgePayload(value: unknown): value is PromptForgeBridgePayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === 1 &&
    typeof record.orchestratorPrompt === "string" &&
    record.orchestratorPrompt.length > 200 &&
    typeof record.cookPrompt === "string" &&
    typeof record.cookFilename === "string" &&
    typeof record.categoryKey === "string" &&
    typeof record.brief === "string" &&
    Array.isArray(record.skillSlugs)
  );
}
