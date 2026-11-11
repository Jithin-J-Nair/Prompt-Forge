# PromptForge — Agent Instructions

## Product intent

PromptForge is a creative prompt workbench, not a generic AI landing-page generator.

- **Quick Prompt:** one sentence becomes a concise, copy-ready instruction.
- **Mega Prompt Builder:** a user brief plus selected creative ingredients becomes one coherent, implementation-aware specification.
- **Creative Layers:** users can search, copy individual directives, select individual layers, entire categories or the full library.
- **Studio:** typed modules expose parameters; parameter overrides must travel with the selected layer through the shared stack, compilation, persistence and share links.
- **Discovery:** curated builds are examples, not fake social proof or promises of guaranteed awards.

## Non-negotiable engineering rules

1. Inspect the current repository, route graph, design tokens, dependencies, data contracts and tests before editing.
2. Preserve working architecture. Make scoped changes; do not replace entire pages or subsystems to fix isolated defects.
3. Do not invent assets, user facts, popularity, votes, awards, metrics, customers, external APIs or completed test results.
4. Keep the compiler deterministic unless a real model integration is explicitly designed and configured. Never imply an LLM is being called when it is not.
5. Every selected directive must be compiled, or surfaced as incompatible/redundant/deferred with a reason. Never silently drop user selections.
6. Preserve typed module IDs, validated parameter overrides, compiler warnings and conflict information.
7. Use stable keyword IDs in share links. Never encode selections as mutable registry array positions.
8. Do not add dependencies for effects that can be implemented with the existing stack.

## Visual direction

- Use the established ink/charcoal surfaces with a restrained chartreuse accent and warm neutral text.
- Prioritize hierarchy, rhythm, typography, useful density and crisp borders.
- Avoid generic purple/cyan AI gradients, gradient text, blurred orbs, decorative glass blur, colored glow halos, gratuitous particles, excessive pill cards and motion without purpose.
- Do not imitate MotionSites or GetLayers page-for-page. Borrow useful discovery and copy workflows; keep PromptForge's own identity.
- Design empty, loading, error, selected, disabled and success states—not just the default screenshot.
- Use responsive layouts; test at 1440px desktop and 390px mobile, then tablet and ultra-wide.

## Interaction and accessibility

- Every visible control must do what its label promises.
- Use semantic links for navigation and buttons for actions.
- Give every input a visible label, meaningful `name`, appropriate `autoComplete`, example placeholder ending in an ellipsis, and inline error state.
- Provide visible `:focus-visible` styling, keyboard operation, at least 44px mobile hit targets, reduced-motion behavior and polite status announcements.
- Hide decorative icons from assistive technology; label icon-only controls.
- Do not use `transition: all` or persistent `will-change`. Animate only intentional, compositor-friendly properties.
- Keep long lists responsive; use `content-visibility: auto` or virtualization when appropriate.

## Prompt quality contract

A high-quality mega prompt must contain:
- project objective, audience and constraints;
- one coherent art direction, not a collage of references;
- page/section architecture and content hierarchy;
- responsive behavior and interaction states;
- selected motion, typography, layout, color, 3D and shader directives;
- explicit technical implementation guidance;
- tuned module parameter values and compiler conflict/warning notes;
- asset requirements and fallbacks;
- accessibility, performance and reduced-motion requirements;
- execution sequence and measurable acceptance criteria.

Do not promise an Awwwards award. Translate the quality aspiration into observable implementation and verification requirements.

## Required verification

Before claiming a change is complete, run what is available and report exact results:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Then use a real browser to verify the rendered desktop and mobile experience, important interactions, keyboard/focus behavior, reduced motion, console errors and visual regressions. Screenshots and browser evidence are required for visual-completion claims.

## Skill guidance

Apply the relevant instructions from the user's checked-in skill library:
- `design-taste-frontend`, `frontend-design`, `impeccable`, `hallmark`;
- `ui-ux-pro-max`, `web-design-guidelines`;
- `fixing-motion-performance`, and the GSAP-specific skills only when a GSAP implementation is actually used.

`improve-ui` is an audit-only/read-only skill: use it to report findings and a plan, not to edit product source. Do not load unrelated skills merely to increase the count; select skills that materially apply to the current task.
