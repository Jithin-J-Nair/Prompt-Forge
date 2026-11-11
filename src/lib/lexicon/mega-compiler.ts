import { compile, getModule, resolveParams, type CompileDepth, type ParamValues } from "@/lib/studio";
import { LEXICON_MAP, type Keyword } from "./index";
import type { ExportTarget } from "./compile";

export interface QuickPromptOptions {
  brief: string;
  audience?: string;
  projectName?: string;
}

export interface MegaPromptOptions extends QuickPromptOptions {
  keywordIds: string[];
  paramsByKeywordId?: Record<string, ParamValues>;
  stackNote?: string;
  target: ExportTarget;
  depth: CompileDepth;
}

export interface MegaPromptResult {
  prompt: string;
  selectedCount: number;
  invalidCount: number;
  moduleCount: number;
  microCount: number;
  wordCount: number;
  conflicts: number;
  warnings: string[];
}

const TARGET_GUIDANCE: Record<ExportTarget, string> = {
  raw: "Keep the specification framework-neutral. Inspect the existing project and adapt to its actual stack; if no project exists, recommend the smallest suitable stack and explain why.",
  v0: "Target v0: implement a complete, responsive Next.js App Router experience with React, TypeScript and Tailwind CSS. Keep the result editable and component-driven.",
  cursor: "Target Cursor: inspect the repository, its instructions and current implementation before editing. Make a scoped plan, preserve working behavior, implement in coherent slices and verify each slice.",
  claude: "Target Claude Code: act as the creative director and principal engineer. Research supplied references, inspect the repository, plan the experience, implement it and verify the rendered result before claiming completion.",
};

export function buildQuickPrompt(options: QuickPromptOptions): string {
  const brief = options.brief.trim();
  if (!brief) return "";
  const audience = options.audience?.trim();
  const projectName = options.projectName?.trim();
  return [
    "# Quick website prompt",
    "",
    projectName ? `Project: ${projectName}` : "",
    `Build a distinctive, production-ready website for: ${brief}`,
    audience ? `Audience: ${audience}` : "Audience: infer only what is reasonably supported by the brief; state assumptions instead of inventing facts.",
    "",
    "First inspect the existing project, identify its framework, design system, routes and working features. Preserve the current stack and do not replace working architecture unnecessarily.",
    "Develop one coherent creative direction rooted in the actual subject. Define the visual hierarchy, typography, palette, content structure and responsive behavior before implementation. Avoid generic AI-SaaS layouts and decorative effects without a clear purpose.",
    "Build complete, meaningful page content and working interactions. Use real supplied assets; identify missing assets instead of inventing testimonials, metrics, clients or product claims.",
    "Verify the rendered result at desktop and mobile sizes. Check keyboard access, contrast, reduced motion, loading/error/empty states, console errors and production build. Fix the largest visible and functional gaps before reporting completion.",
  ].filter(Boolean).join("\n");
}

function groupKeywords(keywords: Keyword[]): [string, Keyword[]][] {
  const groups = new Map<string, Keyword[]>();
  for (const keyword of keywords) {
    const group = groups.get(keyword.fam) ?? [];
    group.push(keyword);
    groups.set(keyword.fam, group);
  }
  return [...groups.entries()];
}

export function buildMegaPrompt(options: MegaPromptOptions): MegaPromptResult {
  const requestedIds = [...new Set(options.keywordIds)];
  const invalidIds = requestedIds.filter((id) => !LEXICON_MAP.has(id));
  const selected = requestedIds
    .map((id) => LEXICON_MAP.get(id))
    .filter((keyword): keyword is Keyword => Boolean(keyword));

  const modules = selected.filter((keyword) => Boolean(keyword.module));
  const microKeywords = selected.filter((keyword) => !keyword.module);
  const projectName = options.projectName?.trim() || "Untitled website";
  const brief = options.brief.trim() || "Create a distinctive website experience. Ask for missing business facts rather than inventing them.";
  const stackNote = options.stackNote?.trim() || (
    options.target === "v0"
      ? "Next.js App Router + React + TypeScript + Tailwind CSS. Use the existing project conventions if a repository is supplied."
      : "Preserve the stack already present in the supplied repository. If starting from an empty project, recommend a minimal stack based on the requirements before installing dependencies."
  );

  const compiled = compile({
    projectName,
    brief,
    audience: options.audience?.trim() || undefined,
    stackNote,
    depth: options.depth,
    selections: modules.map((keyword) => ({ id: keyword.module!, params: options.paramsByKeywordId?.[keyword.id] ?? {} })),
  });

  const tunedParameterLines = modules.flatMap((keyword) => {
    const module = getModule(keyword.module!);
    if (!module) return [];
    const overrides = options.paramsByKeywordId?.[keyword.id] ?? {};
    const resolved = resolveParams(module, overrides);
    return module.params
      .filter((definition) =>
        Object.prototype.hasOwnProperty.call(overrides, definition.key) &&
        resolved[definition.key] !== definition.default,
      )
      .map((definition) => `- ${keyword.name} — ${definition.label}: ${String(resolved[definition.key])}`);
  });

  const microSections = groupKeywords(microKeywords).map(([family, keywords]) => [
    `## ${family} — curated creative directives`,
    ...keywords.map((keyword) => `### ${keyword.name}\n${keyword.phrase}`),
  ].join("\n\n"));

  const prompt = [
    "# PROMPTFORGE — MASTER WEBSITE BUILD SPECIFICATION",
    "",
    `Project: ${projectName}`,
    `Brief: ${brief}`,
    options.audience?.trim() ? `Audience: ${options.audience.trim()}` : "Audience: infer from the brief; mark uncertain assumptions.",
    "",
    "## Execution role",
    "You are the creative director, senior product designer and principal creative engineer for this project. The goal is a distinctive, coherent, production-quality digital experience—not a pile of effects and not a promise of an award.",
    "",
    "## Target environment",
    TARGET_GUIDANCE[options.target],
    `Requested technical depth: ${options.depth}.`,
    `Selected creative ingredients: ${selected.length} total (${modules.length} typed implementation modules and ${microKeywords.length} curated micro-directives).`,
    "",
    "## Creative and implementation contracts",
    "- Read the repository instructions and inspect the actual code before editing. Identify the source of truth for routes, tokens, components, assets and state.",
    "- Treat the brief as the product truth. Research supplied reference sites and record observable composition, interaction, motion and responsive behavior. Separate verified observations from assumptions.",
    "- Establish one original art direction. Use references as evidence and inspiration, not as a collage or a reason to copy another product's identity.",
    "- Build the static composition and content hierarchy first. Add motion only where it communicates state, continuity, hierarchy or a deliberate signature moment.",
    "- Preserve working behavior, existing routes, data contracts and dependencies unless a specific verified problem requires a change.",
    "- Do not invent facts, social proof, metrics, customers, awards, assets or implementation capabilities. Surface missing inputs clearly.",
    "",
    "## Tuned module parameters",
    tunedParameterLines.length ? tunedParameterLines.join("\n") : "No custom overrides supplied. Use each selected module's validated registry defaults.",
    "",
    "## Compiled typed modules",
    compiled.markdown,
    "",
    "## Unresolved selections",
    invalidIds.length ? invalidIds.map((id) => `- ${id}: unknown keyword ID; it was not compiled and requires correction.`).join("\n") : "None. Every requested keyword ID was recognized.",
    "",
    "## Additional curated directives",
    microSections.length ? microSections.join("\n\n") : "No additional micro-directives were selected.",
    "",
    "## Jury-style quality self-audit (not an award prediction)",
    "After implementation and browser verification, score each dimension from 0–10 and attach concrete screenshot, interaction or test evidence. If evidence is missing, mark the dimension unverified rather than inventing a score:",
    "- Design (40%): composition, typography, color, imagery, visual hierarchy and consistency across every page.",
    "- Usability (30%): navigation clarity, task completion, responsive behavior, accessibility, speed and interaction predictability.",
    "- Creativity (20%): originality of concept, signature moments and execution; avoid trend collage or decorative complexity without purpose.",
    "- Content (10%): real copy, relevant imagery, information hierarchy and completeness.",
    "Calculate a weighted self-review only after evidence exists. Use the lowest dimension to prioritize the next repair pass. Never claim an Awwwards award, nomination or guaranteed score.",
    "",
    "## Required execution sequence",
    "1. Inspect and map the repository, runtime, routes, dependencies, existing design system and test coverage.",
    "2. Write a concise evidence-based plan with file ownership, risks and acceptance criteria. Do not start with a broad destructive rewrite.",
    "3. Establish the creative concept, content hierarchy, design tokens, responsive rules and asset plan.",
    "4. Implement one coherent vertical slice at a time. Connect every visible control to real behavior.",
    "5. Render the actual site at matching desktop and mobile viewports. Compare against references and the approved design intent; fix geometry, typography, content, assets and motion in that order.",
    "6. Capture matching screenshots at 1440×900 desktop, 1024×768 tablet and 390×844 mobile. Compare composition, type scale, spacing, image crops and key states against the reference; use side-by-side or overlay comparison rather than relying on memory.",
    "7. Capture and inspect important motion/interaction states: initial load, mid-scroll, hover, focus, open/closed overlays, loading, empty, error and success. Verify keyboard and reduced-motion behavior.",
    "8. Run typecheck, lint, unit tests, production build and browser interaction checks. Target WCAG 2.2 AA and healthy Core Web Vitals; report measured results rather than assuming they pass.",
    "9. Report exactly what changed, which checks ran, what passed, what failed and what remains unverified. Never claim visual parity without screenshots and runtime evidence.",
    "",
    "## Definition of done",
    "- The output feels like one intentional product, not a collection of unrelated templates.",
    "- The complete page and all important states work at desktop, tablet and mobile sizes.",
    "- Every selected directive is either implemented or explicitly identified as incompatible, redundant or deferred with a reason. Never silently drop a selection.",
    "- Heavy effects have a performance budget, lazy-loading strategy and graceful fallback.",
    "- Accessibility, reduced motion, responsive behavior and error states are part of implementation—not afterthoughts.",
    "- No completion claim without rendered evidence and actual test results.",
  ].filter(Boolean).join("\n");

  return {
    prompt,
    selectedCount: selected.length,
    moduleCount: modules.length,
    microCount: microKeywords.length,
    wordCount: prompt.split(/\s+/).filter(Boolean).length,
    invalidCount: invalidIds.length,
    conflicts: compiled.conflicts.length,
    warnings: [
      ...compiled.warnings.map((warning) => warning.message),
      ...invalidIds.map((id) => `Unknown keyword ID "${id}" was not compiled.`),
    ],
  };
}
