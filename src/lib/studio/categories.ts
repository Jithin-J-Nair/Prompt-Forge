import type { CategoryDef } from "./schema";

/* ------------------------------------------------------------------ */
/*  PromptForge Studio — top-level taxonomy.                            */
/*  11 categories, each feeding a dedicated compiled section.           */
/* ------------------------------------------------------------------ */

export const CATEGORIES: CategoryDef[] = [
  {
    id: "websites",
    number: "01",
    name: "Website Types",
    tagline: "What kind of experience are we building?",
    role: "objective",
    subcategories: [
      { id: "portfolio", name: "Portfolios", blurb: "Personal, creative, developer, designer, photography, architecture." },
      { id: "product", name: "Product & SaaS", blurb: "Digital products, SaaS, dashboards, showcases, landing pages." },
      { id: "brand", name: "Brand & Commerce", blurb: "Agency, luxury, ecommerce, fashion, automotive, corporate, startup." },
      { id: "content", name: "Editorial & Content", blurb: "Magazines, editorial, data storytelling, education." },
      { id: "immersive", name: "Immersive & Experiential", blurb: "Scrollytelling, experimental experiences, travel, hospitality." },
    ],
  },
  {
    id: "direction",
    number: "02",
    name: "Art Direction",
    tagline: "The design language everything else obeys.",
    role: "direction",
    subcategories: [
      { id: "restraint", name: "Restraint & Order", blurb: "Minimalism, Swiss, International Style, luxury minimalism." },
      { id: "expressive", name: "Expressive & Loud", blurb: "Brutalism, maximalism, Memphis, collage, cyberpunk." },
      { id: "temporal", name: "Era & Fiction", blurb: "Futurism, retrofuturism, Y2K, vaporwave, sci-fi industrial." },
      { id: "fine-art", name: "Fine Art & Editorial", blurb: "Editorial, avant-garde, surrealism, cinematic, organic, Bauhaus." },
      { id: "technical", name: "Technical & Generative", blurb: "Blueprint, generative, monochromatic, high-contrast systems." },
    ],
  },
  {
    id: "layout",
    number: "03",
    name: "Layout & Composition",
    tagline: "How space is divided, layered and broken.",
    role: "layout",
    subcategories: [
      { id: "grids", name: "Grid Systems", blurb: "Bento, Swiss, modular, masonry, broken and asymmetric grids." },
      { id: "heroes", name: "Hero Composition", blurb: "Full-screen, asymmetric, centered and diagonal heroes." },
      { id: "flow", name: "Scroll Architecture", blurb: "Vertical, horizontal, pinned storytelling, infinite canvas." },
      { id: "space", name: "Spatial Composition", blurb: "Overlapping, floating panels, layered and split-screen space." },
    ],
  },
  {
    id: "typography",
    number: "04",
    name: "Typography",
    tagline: "Type as interface, image and instrument.",
    role: "typography",
    subcategories: [
      { id: "scale", name: "Scale & Voice", blurb: "Oversized, condensed, monospaced, serif and sans systems." },
      { id: "treatment", name: "Treatments", blurb: "Outline, stacked, vertical, rotated, masked, gradient type." },
      { id: "kinetic", name: "Kinetic Type", blurb: "Scramble, morph, wave, character animation, 3D type." },
    ],
  },
  {
    id: "color",
    number: "05",
    name: "Color, Materials & Texture",
    tagline: "Palettes, surfaces and the physics of light.",
    role: "color",
    subcategories: [
      { id: "palettes", name: "Palette Systems", blurb: "Monochrome, duotone, high-contrast schemes." },
      { id: "gradients", name: "Gradients", blurb: "Mesh, aurora, conic, radial and holographic fields." },
      { id: "materials", name: "Materials", blurb: "Glass, chrome, liquid metal, marble, paper, concrete." },
      { id: "texture", name: "Texture & Grain", blurb: "Film grain, noise, halftone, dithering, scanlines." },
      { id: "light", name: "Optical Effects", blurb: "Bloom, refraction, iridescence, chromatic aberration, caustics." },
    ],
  },
  {
    id: "motion",
    number: "06",
    name: "Motion",
    tagline: "The animation score — timing, easing, physics.",
    role: "motion",
    subcategories: [
      { id: "scroll", name: "Scroll-Based", blurb: "Reveals, scrubs, parallax, pinning, scroll-driven scenes." },
      { id: "type-motion", name: "Typography Motion", blurb: "Char staggers, scrambles, morphs, mask reveals." },
      { id: "cursor", name: "Cursor & Pointer", blurb: "Custom cursors, magnetic elements, spotlight and distortion." },
      { id: "physics", name: "Physics", blurb: "Springs, inertia, overshoot, soft-body and gravity motion." },
      { id: "particles", name: "Particle Systems", blurb: "Fields, trails, networks, attraction and morphing." },
      { id: "threed", name: "3D Motion", blurb: "Camera moves, object morphing, scene transitions." },
      { id: "transitions", name: "Cinematic Transitions", blurb: "Wipes, masks, morphs, shared-element continuity." },
      { id: "system", name: "System Motion", blurb: "Loaders, menus, micro-interactions, marquees, timelines." },
      { id: "svg", name: "SVG & Vector", blurb: "Path drawing, shape morphs, path-following motion." },
    ],
  },
  {
    id: "math",
    number: "07",
    name: "Mathematical Graphics",
    tagline: "Generative systems driven by real mathematics.",
    role: "math",
    subcategories: [
      { id: "parametric", name: "Parametric Geometry", blurb: "Lissajous, Bézier, splines, spirals, Fourier series." },
      { id: "computational", name: "Computational Geometry", blurb: "Voronoi, Delaunay, tessellation, subdivision." },
      { id: "fractals", name: "Fractals", blurb: "Mandelbrot, Julia, L-systems, recursive trees, IFS." },
      { id: "dynamical", name: "Dynamical Systems", blurb: "Attractors, pendulums, n-body, boids, automata." },
      { id: "procedural", name: "Procedural Noise & Fields", blurb: "Perlin, simplex, fBM, curl noise, flow fields." },
      { id: "rendering", name: "Mathematical Rendering", blurb: "SDFs, ray marching, metaballs, marching cubes." },
      { id: "dataviz", name: "Data & Networks", blurb: "Force-directed graphs, vector fields, heatmaps." },
    ],
  },
  {
    id: "webgl",
    number: "08",
    name: "3D, WebGL & Shaders",
    tagline: "GPU-rendered scenes, materials and post-processing.",
    role: "webgl",
    subcategories: [
      { id: "scenes", name: "Scene Architecture", blurb: "Three.js / R3F scene composition, cameras, controls." },
      { id: "shaders", name: "Shader Programs", blurb: "Vertex displacement, fragment fields, distortion." },
      { id: "materials", name: "GPU Materials", blurb: "PBR, environment maps, refraction, fresnel." },
      { id: "postfx", name: "Post-Processing", blurb: "Bloom, depth of field, color grading, chromatic aberration." },
      { id: "gpu-particles", name: "GPU Particles", blurb: "Point clouds, instancing, GPGPU simulation." },
    ],
  },
  {
    id: "backgrounds",
    number: "09",
    name: "Backgrounds & Atmosphere",
    tagline: "Living backdrops that set the tone.",
    role: "backgrounds",
    subcategories: [
      { id: "gradient-bg", name: "Living Gradients", blurb: "Mesh, aurora and animated gradient backdrops." },
      { id: "field-bg", name: "Fields & Skies", blurb: "Star fields, wave fields, plasma and light rays." },
      { id: "simulation-bg", name: "Simulations", blurb: "Fluid, fog, liquid and cellular background systems." },
      { id: "reactive-bg", name: "Reactive Backdrops", blurb: "Cursor-, scroll- and audio-reactive backgrounds." },
    ],
  },
  {
    id: "interaction",
    number: "10",
    name: "Interaction Design",
    tagline: "How the interface answers intent.",
    role: "interaction",
    subcategories: [
      { id: "pointer", name: "Pointer & Hover", blurb: "Magnetic UI, hover previews, tilt cards, trailing media." },
      { id: "gesture", name: "Gesture & Drag", blurb: "Drag physics, swipeable rails, infinite canvas pan." },
      { id: "navigation-ix", name: "Navigation Patterns", blurb: "Fullscreen menus, radial menus, scroll-linked nav." },
      { id: "disclosure", name: "Disclosure & Config", blurb: "Expandable content, configurators, interactive diagrams." },
    ],
  },
  {
    id: "engineering",
    number: "11",
    name: "Engineering & Quality",
    tagline: "Accessibility, performance and resilience contracts.",
    role: "engineering",
    subcategories: [
      { id: "access", name: "Accessibility", blurb: "Reduced motion, keyboard, screen-reader, contrast." },
      { id: "perf", name: "Performance Budgets", blurb: "GPU budgets, lazy loading, adaptive fidelity." },
      { id: "resilience", name: "Fallbacks & Resilience", blurb: "WebGL/WebGPU fallbacks, low-power modes, offline." },
      { id: "media-opt", name: "Media Optimization", blurb: "Image, video and font loading strategies." },
    ],
  },
];

export const CATEGORY_MAP: ReadonlyMap<string, CategoryDef> = new Map(
  CATEGORIES.map((c) => [c.id, c]),
);
