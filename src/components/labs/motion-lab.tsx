"use client";

import {
  AuroraDemo, BlobDemo, CharStaggerDemo, CountUpDemo, CursorDemo, CursorPreviewDemo,
  DisplacementDemo, DitherDemo, DragInertiaDemo, FloatDemo, GradientSweepDemo, GrainDemo,
  HalftoneDemo, ImageParticlesDemo, MagneticDemo, MarbleDemo, MarqueeDemo, MaskRevealDemo,
  MenuOverlayDemo, MeshGradientDemo, MicroDemo, ParallaxDemo, ParticleNetworkDemo,
  ParticlesDemo, PathDrawDemo, PathTextDemo, RopeDemo, ScrambleDemo, ScrollPinDemo,
  ScrollRevealDemo, ScrollScrubDemo, ScrollSpyDemo, SpotlightDemo, SpringDemo, TiltDemo,
} from "./motion-demos";

/* ------------------------------------------------------------------ */
/*  Motion Lab — every tile is a working mechanism, grouped by role.    */
/* ------------------------------------------------------------------ */

const GROUPS: { name: string; blurb: string; tiles: React.ReactNode[] }[] = [
  {
    name: "Typography in Motion",
    blurb: "Words as choreography — scrambles, staggers, sweeps and path journeys.",
    tiles: [
      <ScrambleDemo key="sc" />, <CharStaggerDemo key="cs" />, <GradientSweepDemo key="gs" />,
      <PathTextDemo key="pt" />, <MarqueeDemo key="mq" />,
    ],
  },
  {
    name: "Scroll Choreography",
    blurb: "Scroll is a timeline — reveals, scrubs and pinned stages, all IO-driven.",
    tiles: [
      <ScrollRevealDemo key="sr" />, <ScrollScrubDemo key="ss" />, <ScrollPinDemo key="sp" />,
      <ParallaxDemo key="px" />, <ScrollSpyDemo key="sy" />,
    ],
  },
  {
    name: "Cursor & Physics",
    blurb: "The pointer as physics input — springs, magnetism, verlet rope, throw mechanics.",
    tiles: [
      <CursorDemo key="cu" />, <MagneticDemo key="mg" />, <SpotlightDemo key="sl" />,
      <CursorPreviewDemo key="cp" />, <TiltDemo key="ti" />, <SpringDemo key="sp2" />,
      <DragInertiaDemo key="di" />, <FloatDemo key="fl" />, <RopeDemo key="ro" />,
    ],
  },
  {
    name: "Particles",
    blurb: "Systems with budgets — fields, networks, and image-sampled swarms.",
    tiles: [
      <ParticlesDemo key="pa" />, <ParticleNetworkDemo key="pn" />, <ImageParticlesDemo key="ip" />,
    ],
  },
  {
    name: "Masks, Transitions & Texture",
    blurb: "Reveal grammar — clip masks, path draws, displacement, and procedural texture.",
    tiles: [
      <MaskRevealDemo key="mr" />, <PathDrawDemo key="pd" />, <BlobDemo key="bl" />,
      <DisplacementDemo key="dp" />, <MeshGradientDemo key="mg2" />, <AuroraDemo key="au" />,
      <GrainDemo key="gr" />, <HalftoneDemo key="ht" />, <DitherDemo key="dt" />, <MarbleDemo key="ma" />,
      <CountUpDemo key="cu2" />, <MenuOverlayDemo key="mo" />, <MicroDemo key="mi" />,
    ],
  },
];

export function MotionLab() {
  return (
    <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-28 md:px-10 md:pt-32">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ember">
          Motion Lab
        </p>
        <h1 className="mt-4 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
          Every mechanism,{" "}
          <span className="font-serif italic text-flare">actually running</span>.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-fog">
          No screenshots, no Lottie props — each tile is the live technique: IO-driven reveals,
          spring integration, verlet rope, dither matrices. The scroll demos carry their own
          mini scrollports inside the tile. Sliders mirror the module parameters the compiler embeds.
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
