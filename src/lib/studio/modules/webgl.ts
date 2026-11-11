import { M, num, range, select } from "../schema";

/* ------------------------------------------------------------------ */
/*  Category 08 — 3D, WebGL & Shaders.                                  */
/*  Every module specifies WHAT renders and HOW — no buzzword WebGL.    */
/* ------------------------------------------------------------------ */

export const WEBGL_MODULES = [
  M({
    id: "webgl/three-scene",
    category: "webgl", subcategory: "scenes",
    name: "Three.js / R3F Scene",
    tagline: "A real scene graph: lights, camera, disposal.",
    description:
      "A properly-engineered Three.js scene: renderer config (tone mapping, DPR caps), lights, camera rig, resize handling and — critically — resource disposal.",
    prompt:
      "Build the 3D scene correctly: WebGLRenderer with antialias, ACESFilmicToneMapping, outputColorSpace sRGB, devicePixelRatio capped at {dpr}; physically-correct lights (key {keyI}, rim {rimI}, ambient floor); camera fov {fov} composed in a 3/4 hero pose; resize observer; and full disposal (geometry/material/texture dispose + renderer.dispose) on unmount. R3F preferred in React; the Canvas is client-only with a poster fallback.",
    implementation: "React Three Fiber Canvas with frameloop='demand' for static scenes (invalidate on change) — massive battery/thermal win; Suspense fallback = poster image.",
    stack: ["React Three Fiber", "Three.js"],
    params: [
      range("dpr", "Max DPR", 1.75, 1, 2.5, 0.25, ""),
      num("keyI", "Key light intensity", 2.2, 0.5, 6, 0.1),
      num("rimI", "Rim intensity", 1.1, 0, 4, 0.1),
      num("fov", "Camera FOV", 38, 20, 60, 1, "°"),
    ],
    tags: ["three", "r3f", "scene", "renderer"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated", "pointer"],
    fallback: "Static poster (rendered still) + reduced-motion freeze; WebGL-gated with a DOM-only fallback layout.",
    suggests: ["engineering/webgl-fallback", "engineering/gpu-budget"],
    extreme: {
      visual: "One hero object on a stage: floating icosahedron or torus-knot with a studio 2-light rig (warm key {keyI} from top-right, ember rim {rimI} from back-left), floor shadow contact, ACES tonemapping, sRGB output, scene fog from z≈6..16 against ground #0a0a0d.",
      motion: "Object idles on slow orbit (0.2 rad/s); camera rig lerps between hero and detail compositions on scroll progress (spring-smoothed, stiffness ≈ 40, damping ≈ 14). Reduced-motion parks the object and freezes the camera — a composed still, no loop.",
      graphics: "WebGL2 via three.js: MeshStandardMaterial/Physical with metalness/roughness honestly mapped to the material family; renderer devicePixelRatio cap {dpr}, antialias on, fog on; geometries compiled during idle (gl.compile) so the first frame isn't a jank frame.",
      architecture: "HeroScene component owns renderer + rAF loop, mounted only while in view; Suspense boundary isolates asset loading; R3F declarative content under <Canvas> when applicable. One zustand store feeds transient params to uniforms (no setState in the frame loop).",
      quality: "Budget: 60 fps desktop dGPU, ≥ 45 fps integrated GPU at 0.75 pixelRatio; dispose geometry/material/renderer on unmount; device-context-loss recovery re-creates the renderer once, then parks to DOM fallback on second loss.",
    },
  }),
  M({
    id: "webgl/r3f",
    category: "webgl", subcategory: "scenes",
    name: "React Three Fiber Discipline",
    tagline: "Declarative 3D that unmounts cleanly.",
    description:
      "R3F component architecture: drei helpers, useFrame discipline, suspense assets, and the demand frameloop for app embedded scenes.",
    prompt:
      "Structure the 3D layer with R3F discipline: declarative meshes/materials, drei loaders under <Suspense> with a branded fallback, useFrame only for per-frame state (never setState inside), refs for object mutation, frameloop='demand' with invalidate() on interaction for non-continuous scenes, and levan-free production builds (no debug panels shipped).",
    implementation: "@react-three/fiber + @react-three/drei; asset preload via useGLTF.preload; all textures/geometry disposed via R3F auto-dispose (verify custom shaders).",
    stack: ["React Three Fiber", "drei"],
    tags: ["r3f", "react", "declarative", "drei"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated"],
    suggests: ["webgl/three-scene"],
  }),
  M({
    id: "webgl/fragment-shader-art",
    category: "webgl", subcategory: "shaders",
    name: "Full-Screen Fragment Shader",
    tagline: "One pass, every pixel, pure procedure.",
    description:
      "A single full-screen fragment shader as the hero backdrop: uniforms (time, resolution, pointer) drive a procedural field.",
    prompt:
      "Render the hero via a full-screen fragment shader: uniforms u_time, u_res, u_pointer, u_scroll; the field computed per-pixel (fBm / warps / SDF cost distance) through the brand ramp; precision highp; all loops bounded by constants; DPR-scaled render target with dynamic resolution halving past 16ms frame budget. Reduced-motion freezes u_time; document every uniform.",
    implementation: "Raw WebGL2 or Three ShaderMaterial on a triangle (fullscreenTriangle trick); adaptive-quality governor swapping to a static frame of the same shader (render once).",
    stack: ["GLSL", "WebGL2"],
    params: [
      select("field", "Field type", "domain-warped fBM", ["domain-warped fBM", "voronoi cells", "plasma sines", "sdf contours", "caustic interference"]),
      range("speed", "Evolution", 0.06, 0, 0.5, 0.01, "/s"),
    ],
    tags: ["fragment", "shader", "fullscreen", "procedural"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["animated", "pointer"],
    fallback: "One rendered frame as static PNG/poster + CSS gradient approximation.",
    demo: "shader-field",
    suggests: ["math/domain-warping"],
  }),
  M({
    id: "webgl/vertex-displacement",
    category: "webgl", subcategory: "shaders",
    name: "Vertex Displacement",
    tagline: "Geometry kneaded in the vertex stage.",
    description:
      "Displacement in the vertex shader: image or plane geometry warps by noise/texture — flags, curtains, liquid photos, cloth.",
    prompt:
      "Displace geometry in the vertex shader: plane subdivided {segs}×{segs} sampling a displacement source (noise field evolving at {speed}, or a texture map) with amplitude {amp}; normals recomputed analytically or via neighbor sampling so lighting stays truthful; cloth/flag variants pin an edge (displacement × smoothstep(x) mask).",
    implementation: "ShaderMaterial with vertex displacement + normal estimation; ShadowMaterial variant when the displaced mesh must receive shadows.",
    stack: ["GLSL", "Three.js"],
    params: [
      num("segs", "Mesh segments", 128, 16, 512, 16),
      range("amp", "Amplitude", 0.24, 0.02, 1, 0.01, ""),
      range("speed", "Evolution", 0.4, 0, 2, 0.05, ""),
    ],
    tags: ["vertex", "displacement", "cloth", "flag"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated"],
  }),
  M({
    id: "webgl/distortion-shader",
    category: "webgl", subcategory: "shaders",
    name: "Image Distortion Shader",
    tagline: "Hover = UV earthquake, tastefully capped.",
    description:
      "Hover distortion: UV offsets driven by a noise/flow map scale with pointer energy — images wobble, then settle.",
    prompt:
      "Add hover distortion to key images: UV sampled through a flow/noise map scaled by u_hover (0→1 on enter/leave over {ramp}ms); offset amplitude {amp} (≤ 3% of UV); RGB shift variant adds slight channel split during the wobble; settle must return to identity (no permanent warp).",
    implementation: "Plane + ShaderMaterial per image (RL: batch shared program); hover state uniform tweened; fallback: CSS filter saturate/scale hover.",
    stack: ["GLSL", "Three.js"],
    params: [
      range("amp", "Warp amplitude", 0.02, 0.004, 0.06, 0.002, "uv"),
      num("ramp", "Ramp time", 450, 100, 1200, 50, "ms"),
    ],
    tags: ["distortion", "hover", "uv", "image"],
    difficulty: "advanced", perf: "medium", dimension: "2d", interactivity: ["hover"],
    demo: "displacement",
  }),
  M({
    id: "webgl/fluid-shader",
    category: "webgl", subcategory: "shaders",
    name: "Interactive Fluid (GPU)",
    tagline: "Navier-Stokes, simplified for joy.",
    description:
      "GPU fluid simulation: pointer injects dye into a velocity field, semi-Lagrangian advection carries it — the signature touchable backdrop.",
    prompt:
      "Simulate GPU fluid: ping-pong FBOs for velocity and dye; each frame: splat pointer impulses (radius {splat}px, force {force}), advect (semi-Lagrangian), diffuse {dissipation}, (optional pressure projection {iters} iterations for incompressibility); color display via dye field through the brand ramp; sim res {sim} (display upsampled).",
    implementation: "WebGL2 float textures; classic Pavel/Stable-fluids pipeline; sim 128–256²; display 512–1024²; tab-hidden pause; touch = splat on drag.",
    stack: ["WebGL2", "GLSL"],
    params: [
      num("splat", "Splat radius", 80, 20, 240, 10, "px"),
      num("force", "Impulse force", 6000, 1000, 14000, 500),
      range("dissipation", "Dye dissipation", 0.985, 0.9, 0.999, 0.001, "/frame"),
      num("iters", "Pressure iterations", 20, 0, 50, 2),
      num("sim", "Sim resolution", 192, 96, 384, 32),
    ],
    tags: ["fluid", "navier-stokes", "gpu", "interactive"],
    difficulty: "advanced", perf: "heavy", dimension: "2d", interactivity: ["pointer"],
    responsive: "Sim resolution halves on mobile; effect falls back to a looping pre-rendered dye video on very weak GPUs.",
  }),
  M({
    id: "webgl/fresnel",
    category: "webgl", subcategory: "materials",
    name: "Fresnel Rim Material",
    tagline: "Edges glow where geometry turns away.",
    description:
      "Fresnel materials brighten at grazing angles (pow(1−N·V, k)) — the rim-light soul of glass, holograms and force fields.",
    prompt:
      "Apply a fresnel rim material: intensity = pow(1 − dot(N, V), {power}) tinted {color}, composited additive over the base material (or standalone for ghost/wire looks); key for glass-blob heroes and holographic emblems; power 2–5 reads glass, >6 reads thin-film ghost.",
    implementation: "ShaderMaterial onBeforeCompile injection or custom; combine with base PBR when physicality matters (MeshPhysicalMaterial + rim pass).",
    stack: ["GLSL", "Three.js"],
    params: [
      range("power", "Fresnel power", 3.2, 1, 8, 0.1, ""),
      range("power2", "Intensity", 1.4, 0.2, 4, 0.1, "×"),
      select("color", "Rim tint", "ice #BFEFFF", ["ice #BFEFFF", "ember #FF8A5C", "violet #B9A7FF", "mint #7CF5D3"]),
    ],
    tags: ["fresnel", "rim", "glass", "hologram"],
    difficulty: "intermediate", perf: "light", dimension: "3d", interactivity: ["animated"],
  }),
  M({
    id: "webgl/pbr-materials",
    category: "webgl", subcategory: "materials",
    name: "PBR Material System",
    tagline: "Roughness, metalness, normal maps — authored truthfully.",
    description:
      "Physically-based materials with honest parameter ranges: metals are metal (1.0), dielectrics never, and environment maps do the lighting heavy lifting.",
    prompt:
      "Author PBR materials truthfully: MeshStandard/PhysicalMaterial with roughness {rough} and metalness {metal} in physically-plausible bands (metals = 1.0 metalness, dielectrics 0, plastic ~0.5 rough); environment lighting from an HDR (equirect, PMREM) carrying reflections; clearcoat {coat} for lacquer/automotive states; normal maps only where geometry actually varies.",
    implementation: "MeshPhysicalMaterial + RGBELoader→PMREM environment; tone mapping ACES; roughness/metalness maps when authored, plain channels otherwise.",
    stack: ["Three.js", "HDR env"],
    params: [
      range("rough", "Roughness", 0.32, 0, 1, 0.02, ""),
      range("metal", "Metalness", 0.8, 0, 1, 0.05, ""),
      range("coat", "Clearcoat", 0.4, 0, 1, 0.05, ""),
    ],
    tags: ["pbr", "material", "metalness", "env-map"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["static", "pointer"],
  }),
  M({
    id: "webgl/refraction-shader",
    category: "webgl", subcategory: "materials",
    name: "Refraction / Transmission",
    tagline: "The scene bends through the object.",
    description:
      "Real transmission: MeshPhysicalMaterial transmission renders the scene behind glass objects — with optional thickness and chromatic dispersion.",
    prompt:
      "Render glass with true transmission: transmission={trans}, thickness={thickness}, ior {ior}, roughness {rough} for frost, dispersion {disp} (Three r160+) for prismatic split; transmission needs the transmission buffer pass (renders scene behind) — budget accordingly and prefer one transmissive hero object over many.",
    implementation: "MeshPhysicalMaterial transmission; HDR env essential for believable spec; dispersion available in newer three; fallback: opacity-based frosted look.",
    stack: ["Three.js"],
    params: [
      range("trans", "Transmission", 1, 0, 1, 0.05, ""),
      range("thickness", "Thickness", 0.6, 0, 3, 0.1, ""),
      range("ior", "IOR", 1.5, 1, 2.4, 0.05, ""),
      range("rough", "Micro frost", 0.08, 0, 0.6, 0.02, ""),
      range("disp", "Dispersion", 0.4, 0, 1, 0.05, ""),
    ],
    tags: ["refraction", "transmission", "glass", "dispersion"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated", "pointer"],
    fallback: "Semi-transparent MeshPhysicalMaterial without the transmission pass.",
  }),
  M({
    id: "webgl/post-processing",
    category: "webgl", subcategory: "postfx",
    name: "Post-Processing Chain",
    tagline: "Bloom → grade → vignette → grain, in that order.",
    description:
      "A disciplined post chain: threshold bloom for emissives, subtle color grade, vignette, and grain — composited in linear space.",
    prompt:
      "Compose the post-processing chain: bloom (threshold {bloomT}, intensity {bloomI}) → color grade (lift/gamma/gain or LUT) → vignette ({vig}) → film grain ({grain}%); all passes in linear space with final tone-map; grain static under reduced-motion; every pass must justify itself — disable and A/B each one during QA.",
    implementation: "Three EffectComposer or postprocessing lib (half-res bloom via mip chain); LUT as 3D texture; vignette+grain fused in final pass.",
    stack: ["postprocessing", "GLSL"],
    params: [
      range("bloomT", "Bloom threshold", 0.75, 0.3, 1, 0.01, ""),
      range("bloomI", "Bloom intensity", 0.7, 0, 2, 0.05, ""),
      range("vig", "Vignette", 0.24, 0, 0.6, 0.02, ""),
      num("grain", "Grain", 4, 0, 14, 1, "%"),
    ],
    tags: ["post", "bloom", "grade", "vignette"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    suggests: ["color/bloom"],
  }),
  M({
    id: "webgl/dof",
    category: "webgl", subcategory: "postfx",
    name: "Depth of Field",
    tagline: "Focus pulls attention like a lens does.",
    description:
      "Depth of field blurs by depth distance from the focal plane — bokeh discs on strong highlights, focus pulls between subjects.",
    prompt:
      "Apply depth of field: focal distance {focus}m, aperture f/{aperture} (bokeh size derived), focus range ±{range}m; highlights bloom into bokeh discs (circular kernel); focus pulls animated over {pull}s when the narrative changes subject; never DOF over readable UI text.",
    implementation: "postprocessing DepthOfField (CoC from depth) or bokeh pass; focal point can track pointer-smoothed or scene anchor.",
    stack: ["postprocessing", "Three.js"],
    params: [
      range("focus", "Focus distance", 2.4, 0.5, 10, 0.1, "m"),
      range("aperture", "Aperture", 2.8, 1.2, 11, 0.2, "f"),
      range("range", "In-focus range", 1.2, 0.2, 5, 0.1, "m"),
      range("pull", "Focus pull", 0.9, 0.3, 3, 0.1, "s"),
    ],
    tags: ["dof", "bokeh", "focus", "lens"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
  }),
  M({
    id: "webgl/point-cloud",
    category: "webgl", subcategory: "gpu-particles",
    name: "Point Cloud Sculptures",
    tagline: "Hundreds of thousands of GPU-resident points.",
    description:
      "GPU point clouds: 100k+ particles positioned by textures/vertex shaders — sculpture-grade fields without CPU cost.",
    prompt:
      "Render a point cloud sculpture: {count} GL_POINTS positioned on the GPU (vertex-shader sampling of a position texture or parametric formula), circular soft sprites (discarded outside r=0.5 for roundness), size attenuated by distance, color ramp by height/velocity; evolve positions in-shader by time uniform — CPU only provides uniforms.",
    implementation: "BufferGeometry with only indices; vertex computes position; gl_PointSize = size·(300/dist); additive blending, depthWrite off; adaptive count tiers.",
    stack: ["GLSL", "Three.js"],
    params: [
      num("count", "Points (k)", 120, 10, 1000, 10, "k"),
      range("evolve", "Evolution speed", 0.2, 0, 1.5, 0.05, ""),
    ],
    tags: ["point-cloud", "gpu", "particles", "sculpture"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated"],
    responsive: "Count tiers: 30k mobile / 120k desktop default; query by devicePixelRatio+gpu tier heuristic.",
  }),
  M({
    id: "webgl/instanced-geometry",
    category: "webgl", subcategory: "gpu-particles",
    name: "Instanced Fields",
    tagline: "10k objects, one draw call.",
    description:
      "InstancedMesh renders thousands of primitives (crystals, cubes, shards) in a single draw call with per-instance transforms.",
    prompt:
      "Use instancing for repeated fields: InstancedMesh with {count} instances of the base geometry, per-instance matrix composed from seeded position/rotation/scale, optional instanceColor; animate by updating matrices in blocks or in-shader via instanced attribute time offset; one draw call total. Hover picking via raycast → instanceId.",
    implementation: "THREE.InstancedMesh; per-instance attributes for phase; object culling per instance optional (frustum culling whole field).",
    stack: ["Three.js"],
    params: [
      num("count", "Instances", 4000, 500, 30000, 500),
      select("motion", "Instance motion", "breathing scale", ["breathing scale", "orbital drift", "wave ripple", "static"]),
    ],
    tags: ["instancing", "field", "crystals", "performance"],
    difficulty: "intermediate", perf: "medium", dimension: "3d", interactivity: ["animated", "pointer"],
  }),
  M({
    id: "webgl/gpgpu",
    category: "webgl", subcategory: "gpu-particles",
    name: "GPGPU Particle Simulation",
    tagline: "Physics in textures: 300k particles, zero CPU.",
    description:
      "GPGPU particles: positions/velocities live in float textures updated by shaders — curl-noise swarms and massive flocks at 60fps.",
    prompt:
      "Simulate particles on the GPU: position+velocity float textures updated by a compute-style fragment pass (force field: {field}); display pass renders points reading the textures; count {count}k; FBO ping-pong with float render targets (WebGL2 preferred); mouse as attractor uniform optional.",
    implementation: "three GPUComputationRenderer or hand-rolled ping-pong FBOs; RG32F textures; seeded initial states.",
    stack: ["WebGL2", "GLSL"],
    params: [
      num("count", "Particles (k)", 260, 32, 1024, 4, "k"),
      select("field", "Force field", "curl noise", ["curl noise", "attractor orbit", "radial pulse", "lorenz field"]),
    ],
    tags: ["gpgpu", "fbo", "simulation", "curl"],
    difficulty: "advanced", perf: "heavy", dimension: "3d", interactivity: ["animated", "pointer"],
    fallback: "CPU particle field at 3k points when float textures unsupported.",
    suggests: ["engineering/webgl-fallback"],
  }),
  M({
    id: "webgl/webgpu-ready",
    category: "webgl", subcategory: "scenes",
    name: "WebGPU-Ready Architecture",
    tagline: "Tomorrow's pipeline, today's safety net.",
    description:
      "Structure rendering so WebGPU (Three r171+ WebGPURenderer/TSL) can power the scene with automatic WebGL fallback.",
    prompt:
      "Make the 3D layer WebGPU-ready: prefer Three.js r171+ WebGPURenderer with TSL node materials where available, automatic WebGL2 fallback otherwise; feature-detect navigator.gpu before committing; both paths share scene content (only renderer/material dialect differs); document which effects degrade (compute → FBO) on the fallback tier.",
    implementation: "three/webgpu import guarded by feature-detect; TSL↔GLSL parity kept minimal (use library nodes); test both paths in CI screenshots.",
    stack: ["WebGPU", "Three.js r171+"],
    tags: ["webgpu", "future", "tsl", "fallback"],
    difficulty: "advanced", perf: "medium", dimension: "3d", interactivity: ["animated"],
    fallback: "WebGL2 path is the baseline — WebGPU is progressive enhancement, never a requirement.",
  }),
  M({
    id: "webgl/camera-rig",
    category: "webgl", subcategory: "scenes",
    name: "Camera Rig & Composition",
    tagline: "Focal lengths chosen like a director.",
    description:
      "Camera craft: focal-length intent (35mm intimacy vs 60mm product distance), rule-of-thirds anchors, and damped moves.",
    prompt:
      "Direct the camera deliberately: default fov {fov} (~{mm}mm equivalent feel), the hero object placed on a thirds line with lead room in the direction of motion; moves are damped (lerp {damp}) with explicit rest compositions per scroll state; roll stays 0 unless the brand demands sway ≤ {roll}°.",
    implementation: "PerspectiveCamera fov tuned; lookAt targets as scene anchors; manual damped lerps beat OrbitControls for authored narrative.",
    stack: ["Three.js"],
    params: [
      num("fov", "FOV", 38, 20, 70, 1, "°"),
      num("mm", "Lens equivalent", 45, 24, 85, 1, "mm"),
      range("damp", "Move damping", 0.07, 0.02, 0.3, 0.01, ""),
      range("roll", "Max roll", 2, 0, 10, 0.5, "°"),
    ],
    tags: ["camera", "composition", "directing", "fov"],
    difficulty: "intermediate", perf: "light", dimension: "3d", interactivity: ["animated", "scroll"],
  }),
];
