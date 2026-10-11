/* ------------------------------------------------------------------ */
/*  PromptForge enhancement engine.                                    */
/*  Deterministic, seeded by the raw prompt — same input, same spec.   */
/* ------------------------------------------------------------------ */

import { INDUSTRIES, ALIASES, type Industry, type FontOption } from "./industries";

export type SpecSection =
  | "title" | "brand" | "designSystem" | "layout" | "pages"
  | "components" | "copy" | "interactions" | "tech" | "seo" | "backend" | "mega";

export interface EnhancedSpec {
  rawPrompt: string;
  title: string;
  industry: string;
  industryId: string;
  confidence: number;
  subject: string;
  brand: {
    name: string;
    slogan: string;
    tone: string[];
    mission: string;
    paletteName: string;
    palette: { role: string; hex: string; note: string }[];
    typography: { display: string; body: string; mono: string; note: string };
    logo: string;
  };
  designSystem: {
    spacingScale: string[];
    radius: { token: string; value: string }[];
    shadows: string[];
    grid: string;
    breakpoints: string[];
    containers: string;
  };
  layoutSpec: string[];
  pages: { name: string; path: string; purpose: string; sections: string[] }[];
  components: { name: string; spec: string }[];
  copy: {
    voice: string[];
    headlines: string[];
    ctas: string[];
    microcopy: string[];
  };
  interactions: string[];
  techStack: { layer: string; choice: string; why: string }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    og: string;
    jsonLd: string;
    a11y: string[];
  };
  backend: { auth: string; tables: string[]; endpoints: string[] };
  megaPrompt: string;
  stats: { words: number; chars: number; sections: number; pages: number; components: number };
}

/* ---------------- seeded helpers ---------------- */

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

/* ---------------- industry detection ---------------- */

export function detectIndustry(raw: string): {
  industry: Industry;
  matched: string[];
  confidence: number;
} {
  const text = ` ${raw.toLowerCase().replace(/[^a-z0-9\s&'-]/g, " ")} `;
  const scores = new Map<string, { score: number; hits: string[] }>();
  const bump = (id: string, kw: string, w: number) => {
    const e = scores.get(id) ?? { score: 0, hits: [] };
    e.score += w;
    e.hits.push(kw);
    scores.set(id, e);
  };
  for (const ind of INDUSTRIES) {
    for (const kw of ind.keywords) {
      if (text.includes(` ${kw}`) || text.includes(kw)) {
        bump(ind.id, kw, kw.length + (kw.includes(" ") ? 8 : 2));
      }
    }
  }
  for (const [alias, id] of Object.entries(ALIASES)) {
    if (text.includes(` ${alias} `) || text.includes(` ${alias}`)) bump(id, alias, 10);
  }
  let best: Industry | null = null;
  let bestScore = 0;
  let hits: string[] = [];
  for (const ind of INDUSTRIES) {
    const s = scores.get(ind.id);
    if (s && s.score > bestScore) {
      best = ind;
      bestScore = s.score;
      hits = s.hits;
    }
  }
  if (!best) {
    best = INDUSTRIES.find((i) => i.id === "generic")!;
  }
  const confidence = Math.min(
    0.99,
    best.id === "generic" ? 0.42 : 0.66 + Math.min(bestScore, 40) / 120,
  );
  return { industry: best, matched: [...new Set(hits)].slice(0, 5), confidence };
}

/* ---------------- subject + name extraction ---------------- */

function extractSubject(raw: string, industryLabel: string): string {
  const m = raw.match(/(?:for|about|of)\s+(?:a|an|the|my)?\s*([a-z0-9][a-z0-9\s&'’-]{1,48}?)(?:[.,;!?]|$)/i);
  if (m && m[1]) return m[1].trim();
  return industryLabel.toLowerCase();
}

function extractBrandName(raw: string): string | null {
  const q = raw.match(/[“"']([A-Za-z0-9][A-Za-z0-9\s&'.-]{1,28}?)[”"']/);
  if (q) return q[1].toUpperCase();
  const called = raw.match(/(?:called|named)\s+([A-Za-z][A-Za-z0-9&'.-]{1,24})/i);
  if (called) return called[1].toUpperCase();
  return null;
}

const MOTIFS: Record<string, string> = {
  fitness: "kettlebell silhouette cut into a forward chevron",
  coffee: "coffee bean seam forming a rising steam line",
  restaurant: "monoline flame above a plate ring",
  saas: "three stacked layers sliding into place",
  ecommerce: "price-tag diamond sliced by a forward slash",
  agency: "asterisk starburst with one arm extended",
  portfolio: "single frame corner brackets around a dot",
  realestate: "keystone arch over a doorway negative space",
  health: "pulse line folding into a cross",
  education: "open book whose pages become an ascent arrow",
  fintech: "vault dial with one tick highlighted",
  travel: "compass needle pointing off-grid at 33°",
  beauty: "vanity arch mirror with a light-sweep diagonal",
  events: "spotlight cone hitting a single point",
  ai: "node spark — four points linked into a constellation",
  music: "three unequal waveform bars mid-hit",
  nonprofit: "two hands meeting inside a lantern shape",
  legal: "counterbalanced scale in two strokes",
  generic: "perfect geometric diamond with a single notch",
};

const AUTH_PLANS: Record<string, string> = {
  saas: "Email magic-link + Google OAuth (Auth.js v5). Roles: owner / admin / member. Workspace-scoped sessions, 30-day refresh.",
  fintech: "Auth.js with passkeys (WebAuthn) as primary, TOTP fallback. Step-up auth for money movement. Full audit log.",
  education: "Email magic-link + Google OAuth. Enrollment status gates the classroom; cohort role gates discussion spaces.",
  fitness: "Email magic-link. Members see dashboard + bookings; coaches get an admin role for class management.",
  health: "Email magic-link with short 15-min sessions for the portal; no third-party OAuth on health data. HIPAA-conscious session storage.",
  ecommerce: "Guest checkout always allowed; optional magic-link accounts for order history, wishlists and early access.",
  travel: "No accounts required to book; magic-link 'my trips' area via booking email match.",
  beauty: "Magic-link client accounts for rebooking and history; staff role for schedule management.",
  music: "No user accounts; the mailing list is the identity layer (double opt-in, one-click unsubscribe).",
  nonprofit: "No account needed to give; donor portal via magic link for receipts and recurring management.",
  legal: "Magic-link client portal; matters scoped per client. Attorney role with full audit trail.",
  events: "No accounts; orders keyed by email + order reference for self-serve transfers.",
  ai: "Email + Google/GitHub OAuth (Auth.js). API keys are hashed at rest, shown once, revocable.",
  generic: "Email magic-link only where accounts add value; otherwise keep it account-free.",
};

const SHADOWS_DARK = [
  "sm: 0 1px 2px rgba(0,0,0,.4)",
  "md: 0 4px 16px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)",
  "lg: 0 12px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)",
  "glow: 0 0 24px {PRIMARY at 35%}, 0 0 80px {PRIMARY at 12%} — for the single most important CTA per viewport",
];
const SHADOWS_LIGHT = [
  "sm: 0 1px 2px rgba(16,16,16,.06)",
  "md: 0 4px 16px rgba(16,16,16,.08)",
  "lg: 0 16px 48px rgba(16,16,16,.12)",
  "ring: 0 0 0 1px rgba(16,16,16,.06) — default card treatment; shadows earn their place",
];

/* ---------------- main generator ---------------- */

export function enhancePrompt(rawPrompt: string): EnhancedSpec {
  const raw = rawPrompt.trim();
  const { industry, confidence } = detectIndustry(raw);
  const seed = hashSeed(raw.toLowerCase());
  const subject = extractSubject(raw, industry.label);

  const brandName = extractBrandName(raw) ?? pick(industry.brands, seed);
  const slogan = pick(industry.slogans, seed, 1);
  const palette = pick(industry.palettes, seed, 2);
  const fonts: FontOption = pick(industry.fonts, seed, 3);
  const heroConcept = pick(industry.heroConcepts, seed, 4);
  const tone = industry.tones;
  const mission = industry.mission.replace("{NAME}", brandName);
  const isLight = palette.colors[0].note.includes("light");

  const logo = `Wordmark: "${brandName}" set in ${fonts.display.split(" ")[0]} uppercase, letter-spacing +0.08em. Glyph: a ${MOTIFS[industry.id]} — one shape, two colors max, legible from 16px favicon to 6m wall. Never place on busy photography without a scrim; clear space = x-height of the wordmark on all sides.`;

  const designSystem: EnhancedSpec["designSystem"] = {
    spacingScale: ["4", "8", "12", "16", "24", "32", "48", "64", "96", "128"],
    radius: [
      { token: "sm", value: "6px" },
      { token: "md", value: "12px — cards, inputs" },
      { token: "lg", value: "20px — modals, media" },
      { token: "xl", value: "28px — hero panels" },
      { token: "pill", value: "999px — buttons, chips" },
    ],
    shadows: isLight ? SHADOWS_LIGHT : SHADOWS_DARK,
    grid: "12-column, 24px gutters on desktop (≥1024px); 4-column, 16px gutters on mobile; content max-width 1200px centered with 24px safe padding",
    breakpoints: ["sm 640px", "md 768px", "lg 1024px", "xl 1280px", "2xl 1536px"],
    containers: "page shell px-6 md:px-10, max-w-[1200px] mx-auto; editorial longform max-w-[680px]; section vertical rhythm py-24 md:py-32",
  };

  const layoutSpec = [
    `Navbar: sticky top, ${isLight ? "bg/80 backdrop-blur" : "bg/70 backdrop-blur-md"}, 64–72px tall, 1px bottom border using the line color; collapses height to 56px after 80px scroll.`,
    `Hero: 92–100svh, single h1 at clamp(2.75rem, 7vw, 6rem), one support paragraph (max 64ch), CTA cluster with exactly one filled primary action. Concept: ${heroConcept}`,
    "Section rhythm: eyebrow (mono, 12px, tracking 0.14em, uppercase) → h2 display (clamp(2rem, 4.5vw, 3.5rem)) → 18px lead → content grid; alternating media/text every other section.",
    "Cards sit on a 4px baseline grid, consistent 1px borders, corner radius from the md token; nothing decorative floats unless it moves with intent.",
    "Footer: full-bleed contrast block — big sign-off line, sitemap columns, local time/status line, legal row; email capture when the industry profile uses one.",
    "Z-index scale: base 0, sticky 10, nav 40, overlay 50, modal 60, toast 70 — documented, never improvised.",
  ];

  const copy = {
    voice: tone.map((t) => `${t}`),
    headlines: industry.headlines,
    ctas: industry.ctas,
    microcopy: industry.microcopy,
  };

  const baseInteractions = [
    "All interactive elements: 200ms ease-out transitions; hover states must be visible within one frame of intent (no 500ms mysteries).",
    "Scroll reveals fire once, 24px rise + fade, 60ms stagger, when content is 20% in view.",
    "prefers-reduced-motion: instant content resolution, no parallax, no reveals, no autoplay.",
    "Focus-visible: 2px ring in the primary color with 2px offset on every actionable element.",
    "Touch: all targets ≥ 44×44px; hover-only affordances get tap equivalents.",
  ];
  const interactions = [...industry.motion, ...baseInteractions];

  const techStack: EnhancedSpec["techStack"] = [
    { layer: "Framework", choice: "Next.js 15+ (App Router, React Server Components)", why: "SSR/SSG per route for SEO-critical pages; streaming for data-heavy dashboards" },
    { layer: "Language", choice: "TypeScript (strict mode)", why: "Spec-grade contracts across UI, API and DB" },
    { layer: "Styling", choice: "Tailwind CSS v4 (CSS-first @theme tokens)", why: "Design tokens as code; the palette and spacing scale above map 1:1" },
    { layer: "Motion", choice: "Framer Motion + CSS keyframes", why: "Springs for physics-feel micro-interactions; CSS for loops and marquees" },
    { layer: "Icons", choice: "Lucide (stroke 1.5px)", why: "Consistent geometric iconography; zero emoji in UI" },
    { layer: "Type", choice: "next/font (self-hosted Google Fonts)", why: "No layout shift, no external font requests at runtime" },
    { layer: "Database", choice: "PostgreSQL + Drizzle ORM", why: "Typed schema mirroring the tables below; drizzle-kit push for iteration" },
    { layer: "Media", choice: "next/image + AVIF/WebP, video facades", why: "LCP under 2.5s is an acceptance criterion, not a wish" },
    { layer: "Deploy", choice: "Vercel (edge runtime for reads)", why: "Preview deployments per PR; analytics + speed insights" },
  ];

  const metaTitle = `${brandName} — ${slogan}`.slice(0, 62);
  const metaDescription = (mission.split(".")[0] + ".").slice(0, 155);
  const seo: EnhancedSpec["seo"] = {
    metaTitle,
    metaDescription,
    keywords: [subject, industry.label.toLowerCase(), brandName.toLowerCase(), `${subject} near me`, `best ${subject}`],
    og: "Dynamic /og route (next/og ImageResponse) rendering brand name + slogan on the palette background; 1200×630; per-page variants for detail routes.",
    jsonLd: `${industry.schema} with name, description, url, sameAs, and industry-relevant properties (offers/aggregateRating where truthful).`,
    a11y: [
      "WCAG 2.2 AA: every text/background pair ≥ 4.5:1 (verify the two accent-on-background pairs first)",
      "One h1 per page; logical h2→h3 ladder; landmarks: header/nav/main/footer on every route",
      "Full keyboard operation: nav menus, dialogs (focus-trapped), carousels, calendars, slot grids",
      "Form labels associated; errors announced via aria-live='polite'; no placeholder-as-label",
      "Skip-to-content link as the very first focusable element",
      "Meaningful alt text policy: descriptive for content imagery, empty alt only for pure decoration",
      "Motion: global prefers-reduced-motion media query collapse",
    ],
  };

  const backend: EnhancedSpec["backend"] = {
    auth: AUTH_PLANS[industry.id] ?? AUTH_PLANS.generic,
    tables: industry.tables,
    endpoints: industry.endpoints,
  };

  const spec: EnhancedSpec = {
    rawPrompt: raw,
    title: `${brandName} — ${industry.label} Build Spec`,
    industry: industry.label,
    industryId: industry.id,
    confidence: Math.round(confidence * 100) / 100,
    subject,
    brand: {
      name: brandName,
      slogan,
      tone,
      mission,
      paletteName: palette.name,
      palette: palette.colors,
      typography: { display: fonts.display, body: fonts.body, mono: fonts.mono, note: fonts.note },
      logo,
    },
    designSystem,
    layoutSpec,
    pages: industry.pages,
    components: industry.components,
    copy,
    interactions,
    techStack,
    seo,
    backend,
    megaPrompt: "",
    stats: { words: 0, chars: 0, sections: 12, pages: industry.pages.length, components: industry.components.length },
  };

  spec.megaPrompt = buildMegaPrompt(spec);
  spec.stats.words = spec.megaPrompt.split(/\s+/).filter(Boolean).length;
  spec.stats.chars = spec.megaPrompt.length;
  return spec;
}

/* ---------------- mega prompt compiler ---------------- */

function buildMegaPrompt(s: EnhancedSpec): string {
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines);
  const rule = () => L.push("─".repeat(64));

  push(
    "════════════════════════════════════════════════════════════════",
    `  MEGA PROMPT — ${s.brand.name}`,
    `  ${s.title}`,
    `  Forged by PromptForge from the brief: "${s.rawPrompt}"`,
    "════════════════════════════════════════════════════════════════",
    "",
    "## 0 · MISSION BRIEF",
    "",
    `Build a production-ready, award-caliber ${s.industry.toLowerCase()} web experience for "${s.subject}".`,
    `Working brand: ${s.brand.name}. North star: a site that could plausibly win an Awwwards Site of the Day while converting its primary action on the first viewport.`,
    `Mission: ${s.brand.mission}`,
    "",
  );
  rule();

  push("", "## 1 · BRAND IDENTITY", "");
  push(`- Name: ${s.brand.name}`);
  push(`- Slogan: "${s.brand.slogan}"`);
  push(`- Tone of voice: ${s.brand.tone.map((t) => t.toUpperCase()).join(" · ")} — every headline, error state and tooltip must pass through this filter.`);
  push(`- Logo direction: ${s.brand.logo}`);
  push("", `### Palette — "${s.brand.paletteName}" (apply as CSS custom properties, never hardcode)`, "");
  push("| Role | Hex | Usage note |", "| --- | --- | --- |");
  for (const c of s.brand.palette) push(`| ${c.role} | ${c.hex} | ${c.note} |`);
  push(
    "",
    "### Typography",
    `- Display: ${s.brand.typography.display} — headlines, hero, section titles (tight tracking -0.02em, line-height 1.02–1.08)`,
    `- Body: ${s.brand.typography.body} — UI copy at 16–18px, line-height 1.55, max 68ch measure`,
    `- Mono: ${s.brand.typography.mono} — labels, numbers, prices, spec captions (12–13px, uppercase tracking 0.08–0.14em)`,
    `- Pairing note: ${s.brand.typography.note}`,
    "",
  );
  rule();

  push("", "## 2 · DESIGN SYSTEM TOKENS", "");
  push(`- Spacing scale (px): ${s.designSystem.spacingScale.join(" / ")} — compose all padding, gaps and margins from this scale only.`);
  push("- Radius tokens:");
  for (const r of s.designSystem.radius) push(`  - ${r.token}: ${r.value}`);
  push("- Elevation:");
  for (const sh of s.designSystem.shadows) push(`  - ${sh}`);
  push(`- Grid: ${s.designSystem.grid}`);
  push(`- Breakpoints: ${s.designSystem.breakpoints.join(" · ")}`);
  push(`- Containers: ${s.designSystem.containers}`);
  push(
    "- States: default / hover (200ms ease-out) / active (scale .98) / focus-visible (2px ring) / disabled (40% opacity, no pointer events) — defined once, reused everywhere.",
    "",
  );
  rule();

  push("", "## 3 · UX ARCHITECTURE & LAYOUT LAW", "");
  for (const l of s.layoutSpec) push(`- ${l}`);
  push("");
  rule();

  push("", "## 4 · PAGE-BY-PAGE BUILD ORDER", "");
  s.pages.forEach((p, i) => {
    push(`### ${i + 1}. ${p.name}  \`${p.path}\``, `Purpose: ${p.purpose}`, "Sections (top → bottom):");
    p.sections.forEach((sec, j) => push(`   ${j + 1}) ${sec}`));
    push("");
  });
  rule();

  push("", "## 5 · COMPONENT SPECS", "", "Build these as composable, typed components. Specs are contracts — hit every state described.", "");
  for (const c of s.components) push(`- **${c.name}** — ${c.spec}`);
  push("");
  rule();

  push("", "## 6 · COPY & CONTENT STRATEGY", "");
  push(`Voice dial: ${s.copy.voice.join(" / ")}. Rules: verbs over adjectives; numbers over adverbs; no lorem ipsum anywhere — write real, production copy for this exact brand.`);
  push("", "Hero headline options (pick strongest, adapt, A/B):");
  for (const h of s.copy.headlines) push(`- "${h}"`);
  push("", "CTA labels:");
  for (const c of s.copy.ctas) push(`- [${c}]`);
  push("", "Microcopy bank (trust lines under CTAs, empty states, form helpers):");
  for (const m of s.copy.microcopy) push(`- ${m}`);
  push("");
  rule();

  push("", "## 7 · INTERACTION & MOTION SCORE", "");
  for (const it of s.interactions) push(`- ${it}`);
  push("");
  rule();

  push("", "## 8 · TECHNICAL STACK (non-negotiable)", "");
  push("| Layer | Choice | Why |", "| --- | --- | --- |");
  for (const t of s.techStack) push(`| ${t.layer} | ${t.choice} | ${t.why} |`);
  push("");
  rule();

  push("", "## 9 · SEO & ACCESSIBILITY REQUIREMENTS", "");
  push(`- Title: ${s.seo.metaTitle}`, `- Description: ${s.seo.metaDescription}`, `- Keywords: ${s.seo.keywords.join(", ")}`);
  push(`- Open Graph: ${s.seo.og}`);
  push(`- Structured data: JSON-LD ${s.seo.jsonLd}`);
  push("- Plus: semantic sitemap.xml, robots.txt, canonical URLs, human-readable slugs, per-route metadata via the App Router metadata API.");
  push("", "Accessibility checklist (all must pass):");
  for (const a of s.seo.a11y) push(`- ${a}`);
  push("");
  rule();

  push("", "## 10 · BACKEND & DATA", "");
  push(`Auth: ${s.backend.auth}`, "", "Database tables (Drizzle schema):");
  for (const t of s.backend.tables) push(`- ${t}`);
  push("", "API endpoints (route handlers, Zod-validated, typed responses):");
  for (const e of s.backend.endpoints) push(`- ${e}`);
  push("");
  rule();

  push(
    "",
    "## 11 · DEFINITION OF DONE",
    "",
    "1. All pages above render responsive (360px → 1920px) with zero horizontal overflow.",
    "2. Lighthouse: Performance ≥ 90, Accessibility = 100, SEO = 100 on mobile emulation.",
    "3. Every component in §5 exists with its specified states; zero placeholder copy; zero dead links.",
    "4. All API endpoints return typed, validated JSON; errors return consistent { error } shapes with correct status codes.",
    "5. Motion matches the §7 score exactly and collapses under prefers-reduced-motion.",
    "6. The palette, spacing and radius tokens from §2 are the only values in use.",
    "",
    "EXECUTE: Scaffold the stack in §8, implement the design system tokens first, then components §5, then pages §4 in order, wire §10 last. Treat every spec line as a contract. Begin now.",
  );

  return L.join("\n");
}
