"use client";

import {
  BoidsDemo, ConstellationCursorDemo, FlowFieldDemo, ForceGraphDemo, FourierDemo,
  FractalTreeDemo, JuliaDemo, LissajousDemo, LorenzDemo, MetaballsDemo,
  NoiseFieldDemo, PhyllotaxisDemo, PlasmaDemo, PolarRoseDemo, ReactionDiffusionDemo,
  ShaderFieldDemo, SierpinskiDemo, StarfieldDemo, TerrainDemo, VoronoiDemo, WaveFieldDemo,
} from "./math-demos";

/* ------------------------------------------------------------------ */
/*  Math Lab — the real algorithms, grouped by family.                  */
/* ------------------------------------------------------------------ */

const GROUPS: { name: string; blurb: string; tiles: React.ReactNode[] }[] = [
  {
    name: "Parametric Curves",
    blurb: "Closed-form equations rendered as material — ratios and phases, not keyframes.",
    tiles: [<LissajousDemo key="li" />, <FourierDemo key="fo" />, <PolarRoseDemo key="pr" />],
  },
  {
    name: "Computational Geometry",
    blurb: "Spatial structure computed live, cell by cell.",
    tiles: [<VoronoiDemo key="vo" />, <MetaballsDemo key="mb" />],
  },
  {
    name: "Fractals",
    blurb: "Self-similarity through iteration — from chaos games to escape-time.",
    tiles: [<JuliaDemo key="ju" />, <SierpinskiDemo key="si" />, <FractalTreeDemo key="ft" />],
  },
  {
    name: "Dynamical Systems",
    blurb: "Integrators and emergent behavior, numerically correct.",
    tiles: [<LorenzDemo key="lo" />, <BoidsDemo key="bo" />, <ForceGraphDemo key="fg" />],
  },
  {
    name: "Procedural Fields",
    blurb: "Noise, octaves, warping — the vocabulary where visuals and engineering meet.",
    tiles: [
      <NoiseFieldDemo key="nf" mode="noise" />,
      <NoiseFieldDemo key="fb" mode="fbm" />,
      <NoiseFieldDemo key="dw" mode="warp" />,
      <TerrainDemo key="te" />,
      <ReactionDiffusionDemo key="rd" />,
      <FlowFieldDemo key="fl" />,
    ],
  },
  {
    name: "Distribution & Ambient Fields",
    blurb: "Golden angles, waves, plasma and constellations — living backdrops.",
    tiles: [
      <PhyllotaxisDemo key="ph" />,
      <WaveFieldDemo key="wf" />,
      <PlasmaDemo key="pl" />,
      <StarfieldDemo key="sf" />,
      <ConstellationCursorDemo key="cc" />,
      <ShaderFieldDemo key="sh" />,
    ],
  },
];

export function MathLab() {
  return (
    <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-28 md:px-10 md:pt-32">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ember">
          Math Lab
        </p>
        <h1 className="mt-4 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
          Real equations,{" "}
          <span className="font-serif italic text-flare">live</span> on canvas.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-fog">
          Every tile below runs the genuine algorithm — Runge–Kutta integrators, marching-squares
          isolines, fBM octave stacks, Gray–Scott feed/kill pairs — not a video stand-in. Sliders
          expose the same parameters the knowledge-base modules compile into your prompts.
          Ambient motion respects <code className="font-mono text-[12px] text-ivory/80">prefers-reduced-motion</code>.
        </p>
      </header>

      {GROUPS.map((g, i) => (
        <section key={g.name} className="mt-16">
          <div className="mb-6 flex items-baseline gap-4">
            <span className="font-mono text-[11px] text-ember">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">{g.name}</h2>
              <p className="mt-1 text-[12.5px] text-smoke">{g.blurb}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{g.tiles}</div>
        </section>
      ))}
    </div>
  );
}
