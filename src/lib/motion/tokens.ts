/* ------------------------------------------------------------------ */
/*  Motion tokens — the single source of truth for every animated       */
/*  value in PromptForge. Derived from the ECC "motion-foundations"     */
/*  skill contract: no hardcoded durations/easings in components.       */
/*                                                                      */
/*  Rules encoded here:                                                 */
/*   1. Tokens only — components import, never invent.                  */
/*   2. Transform + opacity only — no layout-property animation.        */
/*   3. Reduced-motion overrides everything (consumers gate on it).     */
/*   4. Springs carry physics; linear heaviness is banned.              */
/* ------------------------------------------------------------------ */

import type { Transition } from "framer-motion";

/* ------------------------------- tokens ------------------------------ */

export const motionTokens = {
  duration: {
    /** tooltip show/hide, focus ring, badge swap */
    instant: 0.12,
    /** button feedback, icon swap, chip toggle */
    fast: 0.2,
    /** modal open, card expand, element enter */
    normal: 0.45,
    /** hero entrance, full-page moments */
    slow: 0.9,
    /** deliberate storytelling — sparingly */
    crawl: 1.6,
  },
  easing: {
    /** signature expo-out — fast attack, long settle (award-tier entrances) */
    outExpo: [0.22, 1, 0.36, 1] as const,
    /** elegant in-out for state swaps */
    inOutQuart: [0.76, 0, 0.24, 1] as const,
    /** exit curve — quicker and quieter than entrances */
    easeOut: [0.33, 1, 0.68, 1] as const,
    /** hover/interaction micro-moves */
    outQuart: [0.25, 1, 0.5, 1] as const,
  },
  distance: {
    /** small entrance travel */
    sm: 12,
    /** default entrance travel */
    md: 28,
    /** large staged travel (hero, section reveals) */
    lg: 56,
  },
  scale: {
    /** tactile press feedback */
    press: 0.96,
    /** hover grow ceiling — anything more reads cartoonish */
    hover: 1.03,
    /** entrance from */
    enter: 0.97,
  },
  /** stagger interval between siblings: 50–100ms, never outside */
  stagger: {
    tight: 0.05,
    normal: 0.07,
    loose: 0.1,
  },
} as const;

/* ------------------------------- springs ------------------------------ */

export const springs = {
  /** default UI — buttons, chips, nav items */
  snappy: { type: "spring", stiffness: 420, damping: 32 } satisfies Transition,
  /** cards, modals, panels landing softly */
  gentle: { type: "spring", stiffness: 180, damping: 26 } satisfies Transition,
  /** playful moments only */
  bouncy: { type: "spring", stiffness: 320, damping: 18 } satisfies Transition,
  /** tooltips, popovers, dropdowns */
  instant: { type: "spring", stiffness: 640, damping: 40 } satisfies Transition,
  /** drag release — natural physics */
  release: { type: "spring", stiffness: 260, damping: 24 } satisfies Transition,
} as const;

/* --------------------------- transition helpers --------------------------- */

export const enterTransition = (delay = 0): Transition => ({
  duration: motionTokens.duration.slow,
  delay,
  ease: [...motionTokens.easing.outExpo] as [number, number, number, number],
});

export const exitTransition: Transition = {
  duration: 0.15,
  ease: [...motionTokens.easing.easeOut] as [number, number, number, number],
};

/* ------------------------------ reduced-motion ---------------------------- */

/** SSR-safe lazy check — call inside effects/handlers, never module level. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The reduced-motion contract: transforms disabled, opacity-only fades
 * at or under 0.2s. Compose any variant through this to stay compliant.
 */
export function reduceVariants<T extends Record<string, unknown>>(variants: T): T {
  if (!prefersReducedMotion()) return variants;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(variants)) {
    if (v && typeof v === "object") {
      const { opacity } = v as Record<string, unknown>;
      out[k] = { opacity: opacity ?? 1, transition: { duration: 0.2 } };
    } else out[k] = v;
  }
  return out as T;
}
