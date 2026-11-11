# Accessibility & Inclusion Quality Bar

## Product-level stance

PromptForge's studio doesn't just document accessibility — it **sells it to the prompts**. The
knowledge base contains a dedicated Engineering & Quality category (13 modules), and several
modules elsewhere carry `a11y:` fields that compile into the prompt. The site itself follows the
same bar the compiler preaches.

## prefers-reduced-motion

- **Every lab demo** freezes to a representative frame or renders its static variant — the shared
  `useCanvas` shell cancels the rAF loop after ~1.6s under reduced motion; DOM demos (scramble,
  char stagger) print instantly.
- Motion KB modules bake reduced-motion handling *into the technique description* (e.g.
  `motion/marquee` compiles "static (non-moving) under prefers-reduced-motion", and its DOM
  template pauses).
- Compiled prompts include the adaptive criterion: *"prefers-reduced-motion collapses every
  animated behavior to its documented static variant, with content loss = zero."*

## Keyboard & focus

- Studio composer: every control is a real button/input/select — add/remove/reorder/params/
  conflicts/tabs/export are keyboard-operable with visible focus through the app's global focus
  ring (`:focus-visible`).
- Conflict banners name the offending pair and offer explicit resolution buttons (never a mute).
- Menu overlay demo uses a real `<button>` with `aria-expanded`; tiles' scroll demos use real
  scroll regions, not pointer traps.
- Saved compositions list items announce count/date/store in machine-readable text.

## Screen readers

- Canvas demos are `aria-hidden="true"` (they are decorative renderings of techniques whose
  *parameters* are exposed as real labeled sliders); every demo tile caption names the technique.
- Param sliders are native `<input type="range">` with `aria-label`; boolean params are
  `role="switch"` with `aria-checked`; selects are native.
- Main landmarks and heading ladders preserved across all six pages (verified in build output).
- Where content is updated live (scramble output), `aria-live="polite"` is used deliberately.

## Contrast & legibility

- Palette: ink #070708 background with ivory #f2ede6 copy (≈ 16:1), ember #ff5c1c used for
  action and accent at sizes compliant with 3:1 large-text UI guidance; smoke #615c6b is
  restricted to decorative metadata text ≥ 10px on near-black (borderline — intended as
  *decorative*; substantive copy uses fog #9b96a3, ≥ 7:1).
- No color-only meaning: perf classes (`light/medium/heavy`) pair a hue with the literal word;
  conflict states use both color and code-formatted names with text reasons.

## Hit targets & input

- Studio action buttons ≥ 36px tall; sliders have 28px thumb tracks in practice (native range);
  preset pills ≥ 30px; module-card buttons ≥ 30px. `touch-targets` module codifies 44px for
  *generated* sites; the studio itself approaches that bar, with dense list rows as the known
  exception (documented: they're single-purpose icon buttons with adjacent text rows as the large
  equivalent target).
