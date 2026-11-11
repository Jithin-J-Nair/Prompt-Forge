"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { clamp, numP, type PreviewProps } from "./runtime";

/* ------------------------------------------------------------------ */
/*  Real three.js previews — actual WebGL contexts, real materials,     */
/*  real vertex-displacement shaders. Dispose + DPR cap applied.        */
/* ------------------------------------------------------------------ */

interface ThreeCtx {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

function useThree(
  ref: React.RefObject<HTMLDivElement | null>,
  init: (ctx: ThreeCtx) => (t: number) => void,
  opts: { animate: boolean; still: boolean; deps?: unknown[] },
) {
  const initRef = useRef(init);
  useEffect(() => { initRef.current = init; });
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      host.innerHTML = `<div style="display:grid;place-items:center;height:100%;font:9px monospace;color:#ff2e4d;border:1px solid rgba(255,46,77,0.4);border-radius:6px;margin:6px">WebGL context unavailable</div>`;
      return;
    }
    const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0d);
    scene.fog = new THREE.Fog(0x0a0a0d, 6, 16);
    const ctx: ThreeCtx = { renderer, scene, camera: new THREE.PerspectiveCamera(50, 1, 0.1, 60) };
    const rect = () => {
      const r = host.getBoundingClientRect();
      renderer.setSize(Math.max(2, r.width), Math.max(2, r.height), false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      // keep the projection matrix honest with the host's aspect — without
      // this, detail-mode 3D views squash when the drawer resizes
      ctx.camera.aspect = Math.max(0.2, r.width / Math.max(1, r.height));
      ctx.camera.updateProjectionMatrix();
      return r;
    };
    rect();
    host.appendChild(renderer.domElement);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const frame = initRef.current(ctx);

    const ro = new ResizeObserver(rect);
    ro.observe(host);

    let raf = 0;
    const s0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      frame((now - s0) / 1000);
      renderer.render(scene, ctx.camera);
    };
    if (opts.still || !opts.animate) {
      frame(1.35);
      renderer.render(scene, ctx.camera);
      return () => {
        ro.disconnect();
        disposeCtx(ctx);
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      };
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposeCtx(ctx);
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.animate, opts.still, ref, ...(opts.deps ?? [])]);
}

function disposeCtx({ renderer, scene }: ThreeCtx) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const m of mats) (m as THREE.Material).dispose();
  });
  renderer.dispose();
}

function fillLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0xfff2e2, 0x12080c, 1.2));
  const key = new THREE.DirectionalLight(0xffd2a8, 3);
  key.position.set(3, 4, 2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff5c1c, 2.2);
  rim.position.set(-4, -1, -3);
  scene.add(rim);
}

function Panel({ children: _c, p, init, deps = [] }: { children?: never; p: PreviewProps; init: (ctx: ThreeCtx) => (t: number) => void; deps?: unknown[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useThree(ref, init, { animate: p.animate, still: p.still, deps: [...deps, p.params] });
  return <div ref={ref} className="absolute inset-0" />;
}

const EMBER_C = 0xff5c1c;
const IVORY_C = 0xf2ede6;

export function ThTorusPBR(p: PreviewProps) {
  const metal = clamp(numP(p.params, "metalness", 0.85), 0, 1);
  const rough = clamp(numP(p.params, "roughness", 0.3), 0, 1);
  const shape = (p.params.shape as string) ?? "torus";
  void shape;
  return <Panel p={p} deps={[metal, rough]} init={({ scene, camera }) => {
    fillLights(scene);
    const geo = new THREE.TorusGeometry(0.92, 0.42, 48, 96);
    const mat = new THREE.MeshPhysicalMaterial({ metalness: metal, roughness: rough, color: new THREE.Color(0x1f1f24), clearcoat: 0.6, clearcoatRoughness: 0.3 });
    const env = new THREE.Mesh(geo, mat);
    scene.add(env);
    camera.position.set(0, 0.6, 3.4);
    camera.lookAt(0, 0, 0);
    return (t) => {
      env.rotation.x = t * 0.5;
      env.rotation.y = t * 0.72;
    };
  }} />;
}

export function ThOrbit(p: PreviewProps) {
  const speed = clamp(numP(p.params, "speed", 0.5), 0.1, 2);
  return <Panel p={p} deps={[speed]} init={({ scene, camera }) => {
    const geo = new THREE.TorusKnotGeometry(0.62, 0.2, 84, 24, 2, 3);
    const mat = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return (t) => {
      const a = t * (speed as number);
      camera.position.set(Math.sin(a) * 2.4, Math.sin(t * 0.3) * 0.5, Math.cos(a) * 2.4);
      camera.lookAt(0, 0, 0);
      mesh.rotation.z = t * 0.1;
    };
  }} />;
}

export function ThDisplace(p: PreviewProps) {
  const amp = clamp(numP(p.params, "amplitude", 0.2), 0, 0.8);
  const wire = p.params.wireframe === true || (p.params.wireframe as string) === "on";
  return <Panel p={p} deps={[amp, wire]} init={({ scene, camera }) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAmp: { value: amp } },
      wireframe: Boolean(wire),
      vertexShader: `
        uniform float uTime;
        uniform float uAmp;
        varying float vN;
        float n(vec3 p){
          return sin(p.x*2.5 + uTime)*sin(p.y*3.2 + uTime*0.7)*sin(p.z*2.0 + uTime*0.5);
        }
        void main(){
          vec3 pos = position + normal * n(position) * uAmp;
          vN = n(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragmentShader: `
        varying float vN;
        void main(){
          vec3 a = vec3(1.0, 0.36, 0.1);
          vec3 b = vec3(0.2, 0.24, 0.6);
          gl_FragColor = vec4(mix(b, a, smoothstep(-1.0, 1.0, vN)), 1.0);
        }`,
    });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 24), mat);
    scene.add(mesh);
    camera.position.set(0, 0, 2.6);
    return (t) => {
      mat.uniforms.uTime.value = t;
      mesh.rotation.y = t * 0.3;
    };
  }} />;
}

export function ThFresnel(p: PreviewProps) {
  const power = clamp(numP(p.params, "power", 2.4), 0.5, 6);
  return <Panel p={p} deps={[power]} init={({ scene, camera }) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPower: { value: power } },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 wp = modelViewMatrix * vec4(position, 1.0);
          vV = -wp.xyz;
          gl_Position = projectionMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uPower;
        varying vec3 vN;
        varying vec3 vV;
        void main(){
          float f = pow(1.0 - max(0.0, dot(normalize(vN), normalize(vV))), uPower);
          vec3 base = vec3(0.05, 0.05, 0.08);
          vec3 rim = vec3(1.0, 0.42, 0.16);
          vec3 col = base + rim * f + vec3(1.0, 0.78, 0.5) * pow(f, 3.0) * 0.8;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.85, 64, 64), mat));
    camera.position.set(0, 0, 2.4);
    return (t) => { (mat.uniforms.uTime as { value: number }).value = t; };
  }} />;
}

export function ThTransmission(p: PreviewProps) {
  const trans = clamp(numP(p.params, "transmission", 0.9), 0, 1);
  const thickness = clamp(numP(p.params, "thickness", 0.9), 0, 2);
  const ior = clamp(numP(p.params, "ior", 1.35), 1, 2);
  return <Panel p={p} deps={[trans, thickness, ior]} init={({ scene, camera }) => {
    fillLights(scene);
    // lit room: gradient background slab + emissive ring behind the gem
    const backMat = new THREE.MeshBasicMaterial({ color: 0x181018 });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), backMat);
    slab.position.set(0, 0, -2.5);
    scene.add(slab);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.09, 16, 100), new THREE.MeshBasicMaterial({ color: EMBER_C }));
    ring.position.set(0, 0, -2.0);
    scene.add(ring);
    const gem = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 64, 64),
      new THREE.MeshPhysicalMaterial({
        transmission: trans, thickness: thickness, ior: ior,
        roughness: 0.06, metalness: 0, color: 0xffffff,
        clearcoat: 0.5, clearcoatRoughness: 0.1,
        iridescence: 0.5, iridescenceIOR: 1.5,
      }),
    );
    scene.add(gem);
    camera.position.set(0, 0, 2.6);
    return (t) => {
      gem.rotation.y = t * 0.4;
      gem.position.y = Math.sin(t * 0.9) * 0.08;
      ring.rotation.x = t * 0.2;
    };
  }} />;
}

export function ThScene(p: PreviewProps) {
  return <Panel p={p} init={({ scene, camera }) => {
    strokeLightsSetup(scene);
    return (t) => {
      camera.position.set(Math.sin(t * 0.24) * 2.6, 0.7, Math.cos(t * 0.24) * 2.6);
      camera.lookAt(0, -0.1, 0);
    };
  }} />;
}
function strokeLightsSetup(scene: THREE.Scene) {
  fillLights(scene);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.68, 6),
    new THREE.MeshStandardMaterial({ color: IVORY_C, metalness: 0.9, roughness: 0.25, flatShading: true }),
  );
  core.position.set(0, 0.15, 0);
  scene.add(core);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshStandardMaterial({ color: 0x0e0d12, metalness: 0.3, roughness: 0.9 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);
}

export function ThParticles3D(p: PreviewProps) {
  return <Panel p={p} init={({ scene, camera }) => {
    const N = 3000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const rnd = () => Math.random() * 2 - 1;
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rnd() * 2;
      pos[i * 3 + 1] = rnd() * 1.4;
      pos[i * 3 + 2] = rnd() * 2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: EMBER_C, size: 0.011, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    camera.position.set(0, 0.6, 2.8);
    return (t) => {
      pts.rotation.y = t * 0.18;
      pts.rotation.x = Math.sin(t * 0.3) * 0.14;
    };
  }} />;
}

export function ThInstancing(p: PreviewProps) {
  return <Panel p={p} init={({ scene, camera }) => {
    const N = 520;
    const geo = new THREE.BoxGeometry(0.09, 0.09, 0.09);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff8c50, metalness: 0.6, roughness: 0.35 });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    fillLights(scene);
    scene.add(mesh);
    camera.position.set(0, 1.1, 3.0);
    camera.lookAt(0, 0, 0);
    const dummy = new THREE.Object3D();
    return (t) => {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 * 8;
        const r = 0.28 + (i / N) * 1.4;
        dummy.position.set(Math.cos(a + t * 0.6) * r, Math.sin(t * 1.2 + i * 0.14) * 0.5, Math.sin(a + t * 0.6) * r);
        dummy.rotation.set(t * 0.5 + i, t * 0.3 + i * 0.1, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.rotation.y = t * 0.12;
    };
  }} />;
}

export function ThDof(p: PreviewProps) {
  return <Panel p={p} init={({ scene, camera }) => {
    fillLights(scene);
    const rndPts: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 32, 32),
        new THREE.MeshStandardMaterial({ color: i === 3 ? EMBER_C : IVORY_C, metalness: 0.4, roughness: 0.3 }),
      );
      m.position.set(Math.sin(i * 1.9) * 0.9, Math.cos(i * 1.3) * 0.5, -2.2 + i * 0.7);
      scene.add(m);
      rndPts.push(m);
    }
    camera.position.set(0, 0.3, 2.6);
    return (t) => {
      // depth cue: fog clones mimic focal plane; center sphere stays sharp-bright
      camera.position.x = Math.sin(t * 0.4) * 0.3;
      camera.lookAt(0, 0, -0.4);
      rndPts.forEach((m, i) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        const focusDist = Math.abs(m.position.z - (-0.4 - Math.sin(t * 0.6) * 1.4));
        const blur = Math.min(0.55, focusDist * 0.3);
        mat.emissiveIntensity = 0;
        mat.color.set(i === 3 ? EMBER_C : IVORY_C).lerp(new THREE.Color(0x20202a), blur);
        mat.roughness = 0.3 + blur * 0.6;
      });
    };
  }} />;
}
