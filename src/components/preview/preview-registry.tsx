"use client";

import { lazy, type ComponentType } from "react";
import type { PreviewProps } from "./runtime";
import {
  CvAudioBars, CvAurora, CvBezier, CvBlob, CvBloom, CvBoids, CvCells, CvCollision, CvConstellation,
  CvCurl, CvDelaunay, CvDither, CvExplosion, CvFBM, CvFloat, CvFlowField, CvFogLayer, CvForceGraph,
  CvFourier, CvFractalTree, CvGrain, CvGridFloor, CvHalftone, CvHeatmap, CvHull, CvIFS, CvImageParticles,
  CvInertia, CvJulia, CvKoch, CvLissajous, CvLiquid, CvLogistic, CvLorenz, CvLSystem, CvMandelbrot, CvMarble,
  CvMediaTrail, CvMesh, CvMetaballs, CvMobius2D, CvNBody, CvNoise, CvParticleMorph, CvParticleNetwork,
  CvParticleRepel, CvParticles, CvPendulum, CvPhyllotaxis, CvPlasma, CvPolarRose, CvRays,
  CvReactionDiffusion, CvRope, CvRossler, CvSDF, CvSierpinski, CvSpirals, CvSpline, CvSpring,
  CvStarfield, CvSubdivision, CvTerrain, CvTessellation, CvTorusKnot2D, CvTrails, CvVectorField,
  CvVoronoi, CvWarp, CvWave, CvDisplace2D,
} from "./canvas-previews";
import {
  DmCards, DmCharStagger, DmCountUp, DmDirection, DmDisclosure, DmDrag, DmForms, DmHoverPrev,
  DmLineDraw, DmMagnetic, DmMarquee, DmMaskReveal, DmMenu, DmMicro, DmMorphScene, DmPalette,
  DmParallax, DmPreloader, DmProgressive, DmRadial, DmResponsive, DmReveal, DmScramble, DmScrub,
  DmShared, DmSite, DmSpatial, DmSpotlight, DmSpy, DmStates, DmSwipe, DmTilt, DmTypeBrutalist,
  DmTypeCondensed, DmTypeGeometric, DmTypeGradient, DmTypeMask, DmTypeMono, DmTypeMorph,
  DmTypeOutline, DmTypeOversized, DmTypeSerif, DmTypeStacked, DmTypeVertical, DmTypeWave,
  DmVariable, DmVelocity, DmWipe, DmZoom, DmPin, DmHorizontal, DmDuotone, DmRamp, DmGlass,
  DmHolo, DmChrome, DmMetal, DmPaper, DmConcrete, DmFallback, DmDiagram, DmVitals, DmMedia,
  DmCursor, DmGradient, makeAccessPreview, makeLayoutPreview, makePerfPreview,
} from "./dom-previews";
import { SVG_SET } from "./svg-previews";
import {
  GlAberration, GlCaustics, GlDistortion, GlFluid, GlFog, GlPostfx, GlRaymarch, GlWarp,
} from "./webgl-previews";
// three.js (~1MB uncompressed) must NOT ship in the eager page chunk —
// lazy-load every three preview behind Suspense (fallback shimmer in PreviewByKey)
const ThScene = lazy(() => import("./three-previews").then((m) => ({ default: m.ThScene })));
const ThOrbit = lazy(() => import("./three-previews").then((m) => ({ default: m.ThOrbit })));
const ThDisplace = lazy(() => import("./three-previews").then((m) => ({ default: m.ThDisplace })));
const ThFresnel = lazy(() => import("./three-previews").then((m) => ({ default: m.ThFresnel })));
const ThTorusPBR = lazy(() => import("./three-previews").then((m) => ({ default: m.ThTorusPBR })));
const ThTransmission = lazy(() => import("./three-previews").then((m) => ({ default: m.ThTransmission })));
const ThParticles3D = lazy(() => import("./three-previews").then((m) => ({ default: m.ThParticles3D })));
const ThInstancing = lazy(() => import("./three-previews").then((m) => ({ default: m.ThInstancing })));
const ThDof = lazy(() => import("./three-previews").then((m) => ({ default: m.ThDof })));

type C = ComponentType<PreviewProps>;

export const PREVIEW_COMPONENTS: Record<string, C> = {
  /* canvas2d */
  "canvas/particles": CvParticles, "canvas/particle-network": CvParticleNetwork,
  "canvas/particle-repel": CvParticleRepel, "canvas/trails": CvTrails,
  "canvas/particle-morph": CvParticleMorph, "canvas/image-particles": CvImageParticles,
  "canvas/explosion": CvExplosion, "canvas/audio-bars": CvAudioBars,
  "canvas/flow-field": CvFlowField, "canvas/spring": CvSpring, "canvas/rope": CvRope,
  "canvas/float": CvFloat, "canvas/blob": CvBlob, "canvas/collision": CvCollision,
  "canvas/media-trail": CvMediaTrail, "canvas/inertia": CvInertia, "canvas/displace-2d": CvDisplace2D,
  "canvas/lissajous": CvLissajous, "canvas/fourier": CvFourier, "canvas/bezier": CvBezier,
  "canvas/spline": CvSpline, "canvas/polar-rose": CvPolarRose, "canvas/spirals": CvSpirals,
  "canvas/torus-knot-2d": CvTorusKnot2D, "canvas/mobius-2d": CvMobius2D,
  "canvas/voronoi": CvVoronoi, "canvas/delaunay": CvDelaunay, "canvas/tessellation": CvTessellation,
  "canvas/subdivision": CvSubdivision, "canvas/hull": CvHull, "canvas/julia": CvJulia,
  "canvas/mandelbrot": CvMandelbrot, "canvas/sierpinski": CvSierpinski, "canvas/koch": CvKoch,
  "canvas/l-system": CvLSystem, "canvas/fractal-tree": CvFractalTree, "canvas/ifs": CvIFS,
  "canvas/lorenz": CvLorenz, "canvas/rossler": CvRossler, "canvas/pendulum": CvPendulum,
  "canvas/nbody": CvNBody, "canvas/boids": CvBoids, "canvas/cells": CvCells,
  "canvas/logistic": CvLogistic, "canvas/noise": CvNoise, "canvas/fbm": CvFBM, "canvas/warp": CvWarp,
  "canvas/curl": CvCurl, "canvas/terrain": CvTerrain, "canvas/reaction-diffusion": CvReactionDiffusion,
  "canvas/sdf": CvSDF, "canvas/metaballs": CvMetaballs, "canvas/vector-field": CvVectorField,
  "canvas/heatmap": CvHeatmap, "canvas/phyllotaxis": CvPhyllotaxis, "canvas/force-graph": CvForceGraph,
  "canvas/mesh": CvMesh, "canvas/aurora": CvAurora, "canvas/starfield": CvStarfield,
  "canvas/wave": CvWave, "canvas/plasma": CvPlasma, "canvas/grid-floor": CvGridFloor,
  "canvas/rays": CvRays, "canvas/fog-layer": CvFogLayer, "canvas/liquid": CvLiquid,
  "canvas/constellation": CvConstellation, "canvas/grain": CvGrain, "canvas/halftone": CvHalftone,
  "canvas/dither": CvDither, "canvas/marble": CvMarble, "canvas/bloom": CvBloom,

  /* dom */
  "dom/type-oversized": DmTypeOversized, "dom/type-condensed": DmTypeCondensed,
  "dom/type-mono": DmTypeMono, "dom/type-serif": DmTypeSerif, "dom/type-geometric": DmTypeGeometric,
  "dom/type-brutalist": DmTypeBrutalist, "dom/type-outline": DmTypeOutline,
  "dom/type-stacked": DmTypeStacked, "dom/type-vertical": DmTypeVertical, "dom/type-mask": DmTypeMask,
  "dom/type-gradient": DmTypeGradient, "dom/charstagger": DmCharStagger, "dom/scramble": DmScramble,
  "dom/type-morph": DmTypeMorph, "dom/type-wave": DmTypeWave, "dom/variable": DmVariable,
  "dom/cursor": DmCursor, "dom/magnetic": DmMagnetic, "dom/spotlight": DmSpotlight,
  "dom/tilt": DmTilt, "dom/reveal": DmReveal, "dom/scrub": DmScrub, "dom/pin": DmPin,
  "dom/parallax": DmParallax, "dom/parallax:pointer": DmParallax, "dom/horizontal": DmHorizontal,
  "dom/progressive": DmProgressive, "dom/morph-scene": DmMorphScene, "dom/linedraw": DmLineDraw,
  "dom/mask-reveal": DmMaskReveal, "dom/wipe": DmWipe, "dom/shared": DmShared, "dom/zoom": DmZoom,
  "dom/preloader": DmPreloader, "dom/menu": DmMenu, "dom/micro": DmMicro, "dom/marquee": DmMarquee,
  "dom/velocity": DmVelocity, "dom/count-up": DmCountUp, "dom/states": DmStates,
  "dom/elastic": DmCharStagger,
  "dom/cards": DmCards, "dom/drag": DmDrag, "dom/hover-prev": DmHoverPrev,
  "dom/disclosure": DmDisclosure, "dom/radial": DmRadial, "dom/spy": DmSpy, "dom/palette": DmPalette,
  "dom/swipe": DmSwipe, "dom/forms": DmForms, "dom/diagram": DmDiagram, "dom/spatial": DmSpatial,
  "dom/site": DmSite, "dom/direction": DmDirection,
  "dom/ramp": DmRamp, "dom/gradient": DmGradient, "dom/gradient:conic": DmGradient,
  "dom/duotone": DmDuotone, "dom/holo": DmHolo, "dom/chrome": DmChrome, "dom/glass": DmGlass,
  "dom/metal": DmMetal, "dom/paper": DmPaper, "dom/concrete": DmConcrete,
  "dom/responsive": DmResponsive, "dom/fallback": DmFallback, "dom/vitals": DmVitals, "dom/media": DmMedia,
  "dom/layout": makeLayoutPreview("bento"), "dom/layout:bento": makeLayoutPreview("bento"),
  "dom/layout:asymmetric": makeLayoutPreview("asymmetric"), "dom/layout:modular": makeLayoutPreview("modular"),
  "dom/layout:masonry": makeLayoutPreview("masonry"), "dom/layout:swiss": makeLayoutPreview("swiss"),
  "dom/layout:broken": makeLayoutPreview("broken"), "dom/layout:fullbleed": makeLayoutPreview("fullbleed"),
  "dom/layout:split": makeLayoutPreview("split"), "dom/layout:overlap": makeLayoutPreview("overlap"),
  "dom/layout:floating": makeLayoutPreview("floating"), "dom/layout:layers": makeLayoutPreview("layers"),
  "dom/layout:horizontal": makeLayoutPreview("horizontal"), "dom/layout:canvas": makeLayoutPreview("canvas"),
  "dom/layout:hero": makeLayoutPreview("hero"), "dom/layout:asymhero": makeLayoutPreview("asymhero"),
  "dom/layout:diagonal": makeLayoutPreview("diagonal"), "dom/layout:editorial": makeLayoutPreview("editorial"),
  "dom/layout:vertical": makeLayoutPreview("vertical"),
  "dom/access:motion": makeAccessPreview("motion"), "dom/access:focus": makeAccessPreview("focus"),
  "dom/access:sr": makeAccessPreview("sr"), "dom/access:targets": makeAccessPreview("targets"),
  "dom/access": makeAccessPreview("motion"),
  "dom/perf:budget": makePerfPreview("budget"), "dom/perf:lazy": makePerfPreview("lazy"),
  "dom/perf:power": makePerfPreview("power"), "dom/perf:bundle": makePerfPreview("bundle"),

  /* svg */
  "svg/path-draw": SVG_SET["path-draw"], "svg/morph": SVG_SET["morph"],
  "svg/on-path": SVG_SET["on-path"], "svg/follow": SVG_SET["follow"],

  /* webgl */
  "gl/warp": GlWarp, "gl/distortion": GlDistortion, "gl/fluid": GlFluid,
  "gl/aberration": GlAberration, "gl/caustics": GlCaustics, "gl/raymarch": GlRaymarch,
  "gl/postfx": GlPostfx, "gl/fog": GlFog,

  /* three (real 3D) */
  "three/scene": ThScene, "three/orbit": ThOrbit, "three/displace": ThDisplace,
  "three/fresnel": ThFresnel, "three/torus-pbr": ThTorusPBR, "three/transmission": ThTransmission,
  "three/particles3d": ThParticles3D, "three/instancing": ThInstancing, "three/dof": ThDof,
};

type KindKey = string;

export function previewComponentFor(key: KindKey): C | null {
  return PREVIEW_COMPONENTS[key] ?? null;
}

/** keys used by the module map that have no registered renderer */
import { MODULES } from "@/lib/studio";
import { resolvePreview } from "@/lib/studio";
export function unregisteredPreviewKeys(): string[] {
  const missing: string[] = [];
  for (const m of MODULES) {
    const pv = resolvePreview(m);
    if (!pv) continue;
    if (!PREVIEW_COMPONENTS[pv.componentKey]) missing.push(`${m.id} → ${pv.componentKey}`);
  }
  return missing;
}
