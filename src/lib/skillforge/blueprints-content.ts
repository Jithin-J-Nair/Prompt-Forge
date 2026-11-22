import type { ProjectCategoryKey } from "./categories.ts";
import type { ProjectDnaField, SkillGraphNode } from "./types.ts";

type DnaField = {
  name: ProjectDnaField;
  status: string;
  value: string | null;
  source: string;
  confidence?: number;
};

export const PLACEHOLDER_BAN_PHRASE =
  "Structured placeholder derived from composition policy; refine with confirmed evidence before production claims.";

export function isImmersiveCategory(categoryKey: ProjectCategoryKey): boolean {
  return categoryKey === "awwwards-website" || categoryKey === "threejs-experience";
}

function fieldValue(fields: readonly DnaField[], name: ProjectDnaField): string | null {
  return fields.find((field) => field.name === name)?.value ?? null;
}

export function renderDesignSystemBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
  brief: string,
): Record<string, string> {
  if (isImmersiveCategory(categoryKey)) {
    const features = fieldValue(fields, "Core Features") ?? "scroll theater; WebGL scenes; motion language";
    const differentiation =
      fieldValue(fields, "Differentiation") ??
      "Immersive craft-led experience with authored motion and scene systems";
    return {
      "Visual principles": [
        `- Creative medium: immersive ${categoryKey === "threejs-experience" ? "WebGL-first" : "Awwwards-class"} experience.`,
        `- Features driving look: ${features}.`,
        `- Differentiation hypothesis: ${differentiation}.`,
        "- First viewport = one composition: brand mark, one headline, one supporting line, one CTA group, one dominant full-bleed visual plane.",
        "- No hero cards, floating promo chips, stat strips, or inset media tiles.",
        "- Type: purposeful display face for brand/hero + restrained UI face for chrome (do not default to Inter/Roboto/Arial).",
        "- Color: atmospheric base + one decisive accent; avoid purple-glow AI defaults and cream+terracotta clichés unless the brief confirms them.",
        "- Space: edge-to-edge experience canvas; UI chrome stays quiet.",
        `- Brief signal: ${brief.slice(0, 160)}`,
      ].join("\n"),
      "Interaction principles": [
        "- Scroll is a timeline: chapters advance narrative, not random section stacks.",
        "- Pointer/touch manipulate scene focal points without stealing scroll ownership unpredictably.",
        "- CTA appears at narrative landing; do not wallpaper CTAs on every chapter.",
        "- Keyboard: skip, pause, and reach primary CTA without requiring WebGL precision aiming.",
        "- Reduced motion: replace camera/shader theater with static chapter art + simple fades.",
      ].join("\n"),
      "Motion language": [
        "- Require 2–5 signature motion moments with duration/easing notes.",
        "- Owners: GSAP timelines for DOM/captions; R3F/camera for scene moves; shaders for material dissolves — one owner per property.",
        "- Example beat grid: Arrival dolly (1.0–1.4s) → chapter dissolve → work proof orbit → invite fade.",
        "- Ban constant scroll-triggered noise on every element.",
        "",
        "### Cinematic UI micro-interactions (mandatory for agent cook)",
        "- **Buttons / CTAs:** hover → scale 1.02–1.04 + accent underline or glow fade (120–180ms, ease-out); press → scale 0.98 (80ms); focus-visible ring required; never rely on color alone.",
        "- **Image / media placeholders:** shimmer or soft pulse while loading; on ready, clip-reveal or opacity+blur-out (400–700ms); reserve aspect-ratio boxes to prevent layout jump.",
        "- **Scroll theater:** chapter enter uses coordinated caption fade + optional parallax (DOM via GSAP ScrollTrigger) and/or camera ease (R3F); one progress signal shared across owners.",
        "- **Link/nav chrome:** quiet; motion only on intentional moments, not on every hover in the header.",
        "- **Reduced motion:** replace micro-springs with instant state or 150ms opacity fades; keep scroll chapters readable as static sequence.",
      ].join("\n"),
      "Accessibility constraints": [
        "- WCAG-oriented contrast for text/UI chrome over atmospheric visuals.",
        "- Focus order includes skip-to-content and primary CTA.",
        "- Provide captions/transcripts if audio is used.",
        "- honor prefers-reduced-motion with non-paralyzing fallbacks.",
      ].join("\n"),
      "Responsive constraints": [
        "- Desktop: full experience, target 60fps.",
        "- Tablet: simplified scenes, target ≥30fps.",
        "- Mobile: fewer particles/passes; optional static hero fallback if GPU budget fails.",
        "- Never assume desktop-only WebGL without a fallback path.",
      ].join("\n"),
    };
  }

  const features = fieldValue(fields, "Core Features") ?? "core workflow";
  const stack = fieldValue(fields, "Technical Stack") ?? "application stack from category policy";
  return {
    "Visual principles": [
      `- Visual system serves: ${features}.`,
      "- Establish hierarchy: primary task surface first; secondary chrome quieter.",
      "- Use a coherent token set (color, type, space) before inventing one-off styles.",
      "- Avoid decorative clutter that does not support the job-to-be-done.",
    ].join("\n"),
    "Interaction principles": [
      "- Optimize for the primary user tasks in USER_FLOWS.",
      "- Every interactive component needs default, hover/focus, loading, error, and empty states where applicable.",
      "- Prefer progressive disclosure over dumping all controls at once.",
      `- Stack context: ${stack}.`,
    ].join("\n"),
    "Accessibility constraints": [
      "- Meet applicable WCAG-oriented acceptance checks for the primary flows.",
      "- Keyboard and screen-reader paths are first-class.",
      "- Do not use color as the only status signal.",
      "- Label form errors with recovery guidance.",
    ].join("\n"),
    "Responsive constraints": [
      "- Define mobile/tablet/desktop layouts for primary tasks.",
      "- Touch targets and readable type sizes on small screens.",
      "- Degrade non-critical visuals before breaking task completion.",
    ].join("\n"),
  };
}

export function renderArchitectureBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
): Record<string, string> {
  const architecture = fieldValue(fields, "Architecture");
  const stack = fieldValue(fields, "Technical Stack");

  if (isImmersiveCategory(categoryKey)) {
    return {
      "System boundaries": [
        "- Experience host (WebGL/R3F canvas) vs app shell (DOM navigation, CTA, a11y).",
        "- Scroll/progress store as the shared timeline signal.",
        "- Asset pipeline boundary: authoring → compress → runtime load → dispose.",
        architecture ? `- DNA architecture note: ${architecture}` : "- Architecture inferred from immersive category policy.",
      ].join("\n"),
      Components: [
        "- ExperienceCanvas (single renderer preferred).",
        "- Scene/chapter modules mapped to narrative acts.",
        "- Shader/material library with uniform contracts.",
        "- Motion orchestrator (GSAP) for DOM + progress publishing.",
        "- Optional CMS/content adapter only if brief requires editable case studies.",
        stack ? `- Stack assumptions: ${stack}` : "- Stack: TypeScript client + Three/R3F + motion; no default Postgres unless CMS/auth needed.",
      ].join("\n"),
      Integrations: [
        "- Analytics (privacy-minimized) after consent if required.",
        "- CMS/headless content only when editorial workflow is confirmed.",
        "- Font/asset CDN with caching and integrity strategy.",
        "- No secret-bearing integrations inside client experience code.",
      ].join("\n"),
      "Quality attributes": [
        "- Frame budget: 60fps desktop / ≥30fps mobile experience path.",
        "- Load budget: defer heavy GLTF until chapter need; show intentional loader.",
        "- Resilience: WebGL fail → static/filmstrip fallback.",
        "- Maintainability: chapter modules + shared lighting/env.",
      ].join("\n"),
      "Scene inventory": [
        "- Arrival / brand world",
        "- Craft or capability proof scene",
        "- Selected work / case chapter(s)",
        "- Invite / contact landing",
        "- Each scene lists: camera behavior, hero assets, shader accents, dispose rules.",
      ].join("\n"),
      "Shader & render budget": [
        "- List effects with cost tiers (low/medium/high).",
        "- Post stack ordered with low-power drop order.",
        "- Quality presets: high / medium / low (DPR + passes).",
      ].join("\n"),
    };
  }

  return {
    "System boundaries": [
      architecture
        ? `- ${architecture}`
        : `- Modular boundaries for ${categoryKey.replace(/-/g, " ")}.`,
      "- Separate read/write paths for sensitive data when applicable.",
      "- Keep agent/tool authority outside untrusted model text for AI categories.",
    ].join("\n"),
    Components: [
      stack ? `- Stack: ${stack}` : "- Stack from category policy.",
      "- Domain modules with explicit interfaces.",
      "- UI application layer with design-system consumption.",
      "- Observability and auth boundaries as required by category.",
    ].join("\n"),
    Integrations: [
      "- External systems listed only when brief/category implies them.",
      "- Credential handling stays server-side; never in prompts or logs.",
      "- Define failure modes for each integration.",
    ].join("\n"),
    "Quality attributes": [
      "- Reliability: explicit error states and retries where safe.",
      "- Performance: route-level budgets for LCP/INP.",
      "- Security: least privilege and safe handoff.",
      "- Accessibility: primary flows keyboard operable.",
    ].join("\n"),
  };
}

export function renderUserFlowsBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
): Record<string, string> {
  const user = fieldValue(fields, "User") ?? "primary user";
  const flows = fieldValue(fields, "User Flows");

  if (isImmersiveCategory(categoryKey)) {
    return {
      "Primary tasks": [
        `1) ${user} lands in the arrival world and understands the brand promise within seconds.`,
        "2) Scrolls chapters to experience craft proof (scenes/work).",
        "3) Optionally interacts with a focal scene element.",
        "4) Reaches invite/contact CTA with clear next step.",
        "5) Can skip to content/CTA via keyboard without completing the full theater.",
        flows ? `- DNA flow note: ${flows}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      States: [
        "- Loading / warming assets (branded, intentional).",
        "- Playing (scroll theater active).",
        "- Reduced-motion static chapters.",
        "- WebGL unavailable fallback.",
        "- CTA success/error for contact forms if present.",
      ].join("\n"),
      "Errors and recovery": [
        "- Asset load failure → retry + static fallback art.",
        "- Low FPS → auto quality preset drop.",
        "- Form errors → inline recovery copy.",
        "- Never dead-end the user in a broken canvas without DOM escape.",
      ].join("\n"),
    };
  }

  return {
    "Primary tasks": [
      flows
        ? `- ${flows}`
        : `- ${user} completes the core job defined in the brief.`,
      "- Secondary: configure/admin tasks if category requires operators.",
      "- Recovery: return to a safe state after errors.",
    ].join("\n"),
    States: [
      "- Empty, loading, populated, error, forbidden/unauthorized as applicable.",
      "- Partial success states for multi-step jobs.",
    ].join("\n"),
    "Errors and recovery": [
      "- User-visible errors with next actions.",
      "- Idempotent retries for safe operations.",
      "- Escalation path for blocking failures.",
    ].join("\n"),
  };
}

export function renderDatabaseBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
): Record<string, string> {
  if (isImmersiveCategory(categoryKey)) {
    const needsData =
      /cms|auth|login|account|dashboard|admin/i.test(fieldValue(fields, "Vision") ?? "") ||
      /cms|auth|postgres|database/i.test(fieldValue(fields, "Technical Stack") ?? "");
    if (!needsData) {
      return {
        "Data entities":
          "- No transactional datastore required for a static/immersive marketing experience unless CMS/auth is confirmed.\n- Content entities (if any): CaseStudy, SceneCopy, AssetRef — can live as versioned files or headless CMS.",
        Relationships:
          "- CaseStudy 1—* AssetRef; SceneCopy references chapter ids from the narrative map.",
        Constraints:
          "- Do not invent a Postgres schema for pure experience sites.\n- If CMS added later, keep secrets server-side.",
      };
    }
  }

  return {
    "Data entities": [
      "- Derive entities from core features and architecture DNA.",
      fieldValue(fields, "Core Features")
        ? `- Feature-driven candidates: ${fieldValue(fields, "Core Features")}`
        : "- Entity list remains hypothesis until features confirmed.",
      "- Include identity/tenant keys for multi-user systems.",
    ].join("\n"),
    Relationships: [
      "- Prefer explicit foreign keys / ownership edges over implicit joins in docs.",
      "- Document cardinality for primary workflows.",
    ].join("\n"),
    Constraints: [
      "- Retention and deletion paths for personal data when applicable.",
      "- Unique constraints for idempotency keys on payments/events.",
      "- No secrets in plaintext columns.",
    ].join("\n"),
  };
}

export function renderLaunchPlanBody(
  categoryKey: ProjectCategoryKey,
  fields: readonly DnaField[],
): Record<string, string> {
  const roadmap = fieldValue(fields, "Roadmap") ?? "Pilot → validate → export → external build";
  if (isImmersiveCategory(categoryKey)) {
    return {
      Phases: [
        "1) Creative lock (concept, art, motion language).",
        "2) Scene prototype (one chapter at target FPS).",
        "3) Full chapter map + asset pipeline.",
        "4) A11y/reduced-motion + performance presets.",
        "5) Content freeze + launch QA on mid-tier mobile.",
        `- DNA roadmap: ${roadmap}`,
      ].join("\n"),
      Milestones: [
        "- Creative north star approved.",
        "- Arrival scene demo accepted at budget.",
        "- Council-accepted SkillForge package exported for agent build.",
        "- Soft launch with analytics (privacy-minimized).",
      ].join("\n"),
      Risks: [
        fieldValue(fields, "Risk Analysis") ?? "GPU budget overruns; asset weight; accessibility gaps.",
        "- Scope creep into fake 3D without budgets.",
      ].join("\n"),
    };
  }

  return {
    Phases: [
      `- ${roadmap}`,
      "- Validate DNA assumptions with evidence.",
      "- Implement behind quality gates.",
      "- Launch with monitoring and rollback.",
    ].join("\n"),
    Milestones: [
      "- Accepted SkillForge package exported.",
      "- Critical user journey usable end-to-end.",
      "- Review gates green (quality, security, a11y as applicable).",
    ].join("\n"),
    Risks: [
      fieldValue(fields, "Risk Analysis") ?? "Unresolved assumptions treated as facts.",
      "- Operational readiness gaps before launch.",
    ].join("\n"),
  };
}

export function renderSkillCraftAppendix(nodes: readonly SkillGraphNode[]): string {
  const creative = nodes.filter((node) =>
    [
      "creative-director",
      "art-director",
      "motion-director",
      "threejs-architect",
      "shader-engineer",
      "gsap-architect",
      "r3f-architect",
      "performance-engineer",
    ].includes(node.nodeKey),
  );
  const immersive = creative.some((node) =>
    ["threejs-architect", "r3f-architect", "gsap-architect", "motion-director"].includes(
      node.nodeKey,
    ),
  );
  if (creative.length === 0) {
    return [
      "## Craft directives from selected skills",
      "",
      "- Follow each selected skill’s acceptance criteria in the catalog.",
      "- Prefer concrete budgets, interfaces, and stop conditions over adjectives.",
      "",
    ].join("\n");
  }
  const lines = creative.map(
    (node) =>
      `- **${node.name}** (${node.priority}): ${node.rationale} Scope: ${node.assignedScope.join(", ")}.`,
  );
  const cookSteps = immersive
    ? [
        "## How an external agent should cook this package",
        "",
        "1. Read MASTER_SKILL_PACKAGE + DESIGN_SYSTEM motion language before writing UI.",
        "2. Scaffold DOM app shell + ExperienceHost canvas boundary (do not put the whole site inside one Canvas).",
        "3. Implement **button/CTA micro-interactions** (hover/press/focus) per Motion language.",
        "4. Implement **image/placeholder load + reveal** motion with reserved aspect ratios.",
        "5. Wire **GSAP ScrollTrigger** (or equivalent) for chapter captions/progress; publish one shared progress signal.",
        "6. Build **R3F/Three** chapter scenes only where the scene inventory requires; dispose on chapter exit.",
        "7. Add reduced-motion + low-FPS quality presets before claiming done.",
        "8. Do not invent a SaaS dashboard layout when immersive skills are present.",
        "",
      ]
    : [
        "## How an external agent should cook this package",
        "",
        "1. Read MASTER_SKILL_PACKAGE, PRODUCT_STRATEGY, and ARCHITECTURE before coding.",
        "2. Implement primary user flows with explicit empty/loading/error states.",
        "3. Follow design tokens and accessibility constraints in DESIGN_SYSTEM.",
        "4. Keep secrets and production access out of scope; executionAuthorized is false.",
        "",
      ];
  return [
    "## Craft directives from selected skills",
    "",
    "Agents MUST satisfy these roles’ acceptance criteria while building:",
    "",
    ...lines,
    "",
    "- Reject template SaaS layouts when immersive skills are present.",
    "- Keep executionAuthorized false; this appendix is instructional.",
    "",
    ...cookSteps,
  ].join("\n");
}
