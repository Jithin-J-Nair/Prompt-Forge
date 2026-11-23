import type { BriefIntelligence, CategoryMode } from "./brief-intelligence.ts";

/**
 * Technical creative direction — implementable tech from experience needs.
 * Tech enables vision; never recommend advanced stacks for status.
 */
export type TechDirection = {
  mode: CategoryMode;
  primaryMedium: string;
  stack: string[];
  interactionArch: string;
  animation: string;
  assets: string;
  state: string;
  loading: string;
  perfBudgets: string[];
  responsive: string;
  fallbacks: string[];
  a11y: string[];
  reducedMotion: string;
  componentBoundaries: string[];
  risks: string[];
  doNotRecommend: string[];
};

export function buildTechDirection(input: {
  intel: BriefIntelligence;
  motifs: readonly string[];
  wantsRealtime3d?: boolean;
}): TechDirection {
  const mode = input.intel.categoryMode;
  const wants3d =
    input.wantsRealtime3d ??
    (input.intel.techSignals.some((t) => /3d|webgl|r3f|shader|three/i.test(t.text)) ||
      mode === "immersive");

  if (mode === "immersive" || wants3d) {
    return {
      mode,
      primaryMedium: "DOM shell + optional WebGL/R3F canvas (experience host)",
      stack: [
        "TypeScript + React/Next (or equivalent) for shell",
        "R3F / Three.js for scene chapters that earn cost",
        "GSAP + ScrollTrigger for DOM caption/progress ownership",
        "Custom shaders only for focal accents in shader budget",
      ],
      interactionArch:
        "Single scroll/progress publisher; scene modules subscribe; CTA stays DOM-reachable",
      animation:
        "Beat grid owners (GSAP / R3F / shader / DOM) — one owner per property; 2–5 signature beats",
      assets:
        "GLB+KTX2/Draco with chapter lazy-load; HDRI shared; dispose on chapter exit",
      state: "Chapter id + progress 0–1 + quality preset + reduced-motion flag",
      loading: "Branded warm loader; never blank WebGL; reserve aspect ratios for media",
      perfBudgets: [
        "Desktop 60fps target (fail if sustained <45 on mid laptop)",
        "Mobile ≥30fps or static filmstrip",
        "Defer heavy GLTF until chapter enter",
      ],
      responsive: "Desktop full experience; tablet simplified scenes; mobile quality drop + DOM fallback",
      fallbacks: [
        "WebGL unavailable → static filmstrip + DOM captions",
        "Low FPS → auto drop high-tier shaders",
      ],
      a11y: [
        "Skip-to-content and primary CTA without WebGL aiming",
        "Contrast for chrome over atmosphere",
        "Captions if audio used",
      ],
      reducedMotion: "Static chapter plates + ≤150ms opacity; keep story readable",
      componentBoundaries: [
        "ExperienceCanvas (single renderer preferred)",
        "ChapterScene modules",
        "MotionOrchestrator (DOM progress)",
        "ShellNav / InviteCTA (DOM only)",
      ],
      risks: [
        "Eager asset loading kills LCP",
        "Fighting GSAP+R3F timelines",
        "Over-shadered demos without narrative",
      ],
      doNotRecommend: [
        "WebGPU-only without fallback when brief does not require it",
        "Postgres/auth modular monolith by default for a brand experience",
        "Multiple competing canvas instances",
      ],
    };
  }

  if (mode === "saas" || mode === "enterprise" || mode === "ai") {
    return {
      mode,
      primaryMedium: "DOM/CSS application UI — design system first",
      stack: [
        "TypeScript + React/Next (or category stack from DNA)",
        "Design tokens + component library boundary",
        "Server APIs / auth as category requires",
        "Observability hooks for primary routes",
      ],
      interactionArch:
        "Route → task surface → forms/tables → explicit empty/loading/error/success states",
      animation: "State-change motion only (150–250ms); no scroll theater by default",
      assets: "SVG/icons + optimized raster; no WebGL unless brief demands a data viz canvas",
      state: "URL + server state + optimistic UI where safe; label optimistic vs confirmed",
      loading: "Skeleton/reserved layout for primary panels; never layout jump",
      perfBudgets: ["LCP on primary route within product budget", "INP for critical actions"],
      responsive: "Mobile/tablet/desktop for primary tasks; degrade chrome before breaking jobs",
      fallbacks: ["Offline/error banners with recovery", "Feature flags for partial outages"],
      a11y: [
        "Keyboard paths for critical jobs",
        "Named controls; no color-only status",
        "Focus management on route/dialog changes",
      ],
      reducedMotion: "Disable non-essential transitions; keep state clarity",
      componentBoundaries: [
        "AppShell",
        "Task views / domain modules",
        "Design-system primitives",
        "Data access layer (server)",
      ],
      risks: [
        "Spectacle cosplay delaying usability",
        "Unlabeled invented requirements",
        "Secret leakage into client prompts/logs",
      ],
      doNotRecommend: [
        "Three.js/R3F for status on a SaaS admin",
        "Shader playgrounds without a product job",
        "Card-grid marketing heroes inside app chrome",
      ],
    };
  }

  if (mode === "brand" || mode === "ecommerce") {
    return {
      mode,
      primaryMedium: wants3d
        ? "Editorial DOM + selective canvas accents"
        : "Editorial DOM/CSS/SVG — material and type led",
      stack: [
        "TypeScript web stack",
        "Strong typography + token sheet",
        wants3d ? "Optional R3F only for one signature moment" : "CSS/SVG motion preferred",
        mode === "ecommerce" ? "Checkout/payments boundary server-side" : "CMS only if editorial confirmed",
      ],
      interactionArch:
        mode === "ecommerce"
          ? "Browse → PDP → cart → checkout with trust cues"
          : "Brand arrival → proof chapters → invite",
      animation: "Authored but restrained; motif-locked micro-interactions",
      assets: "Photography/material plates with reserved ratios; AVIF/WebP",
      state: "Nav + content + CTA; cart state if commerce",
      loading: "Media placeholders with reveal; never CLS spikes",
      perfBudgets: ["Hero LCP prioritized", "Defer below-fold media"],
      responsive: "Full-bleed hero that still works on mobile (crop with intent)",
      fallbacks: ["Static hero if motion fails", "Checkout unavailable messaging if commerce"],
      a11y: ["Contrast on overlays", "Keyboard CTA", "Alt text for brand plates"],
      reducedMotion: "Still compositions; opacity fades only",
      componentBoundaries: [
        "HeroComposition",
        "ProofSections",
        "InviteCTA",
        mode === "ecommerce" ? "CartCheckout (server-backed)" : "Content blocks",
      ],
      risks: ["Template section kits", "Weak brand test", "Promo clutter in first viewport"],
      doNotRecommend: [
        "Arbitrary 3D without brand job",
        "Glassmorphism-by-default kits",
        "Fake social proof",
      ],
    };
  }

  return {
    mode,
    primaryMedium: "DOM/CSS appropriate to category",
    stack: ["TypeScript web stack from DNA", "Design tokens", "Category integrations only when implied"],
    interactionArch: "Primary job path with recovery",
    animation: "Clarify state; avoid decoration",
    assets: "Optimized media; no speculative 3D",
    state: "Explicit app/url state",
    loading: "Reserved layouts",
    perfBudgets: ["Route-level LCP/INP budgets"],
    responsive: "Primary tasks on small screens",
    fallbacks: ["Graceful degradation of non-critical visuals"],
    a11y: ["Keyboard + named controls"],
    reducedMotion: "Honor prefers-reduced-motion",
    componentBoundaries: ["Shell", "Primary task modules", "Shared primitives"],
    risks: ["Generic AI UI", "Scope sprawl"],
    doNotRecommend: ["Advanced GPU stacks without experience need"],
  };
}

export function formatTechDirection(tech: TechDirection): string {
  return [
    `- Primary medium: ${tech.primaryMedium}`,
    `- Stack: ${tech.stack.join("; ")}`,
    `- Interaction architecture: ${tech.interactionArch}`,
    `- Animation: ${tech.animation}`,
    `- Assets: ${tech.assets}`,
    `- State: ${tech.state}`,
    `- Loading: ${tech.loading}`,
    `- Responsive: ${tech.responsive}`,
    `- Reduced motion: ${tech.reducedMotion}`,
    "",
    "### Performance budgets",
    ...tech.perfBudgets.map((p) => `- ${p}`),
    "",
    "### Fallbacks",
    ...tech.fallbacks.map((f) => `- ${f}`),
    "",
    "### Accessibility",
    ...tech.a11y.map((a) => `- ${a}`),
    "",
    "### Component boundaries",
    ...tech.componentBoundaries.map((c) => `- ${c}`),
    "",
    "### Risks",
    ...tech.risks.map((r) => `- ${r}`),
    "",
    "### Do not recommend",
    ...tech.doNotRecommend.map((d) => `- ${d}`),
  ].join("\n");
}
