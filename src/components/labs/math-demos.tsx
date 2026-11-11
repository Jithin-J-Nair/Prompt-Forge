"use client";

import { useMemo, useRef, useState } from "react";
import { CanvasDemo, DemoTile, LabSlider, fbm, lerp, makeNoise2D, mulberry32 } from "./lab-shell";

/* ------------------------------------------------------------------ */
/*  Math Lab — every tile renders the real algorithm.                   */
/* ------------------------------------------------------------------ */

const INK = "#070708";
const EMBER = "#ff5c1c";
const FLARE = "#ffb85c";
const IVORY = "#f2ede6";

/* ------------------------------ lissajous ------------------------------ */

export function LissajousDemo() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [speed, setSpeed] = useState(0.5);
  return (
    <DemoTile title="Lissajous Curves" moduleId="math/lissajous"
      note="x = sin(a·t + δ), y = sin(b·t). Rational a/b closes the curve; the trail shows the pen.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const N = 720, margin = 18 - -2;
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke();
        const phase = t * speed;
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let i = 0; i <= N; i++) {
            const tt = (i / N) * Math.PI * 2;
            const x = w / 2 + Math.sin(a * tt + phase) * (w / 2 - margin);
            const y = h / 2 + Math.sin(b * tt) * (h / 2 - margin);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = pass === 0 ? "rgba(255,92,28,0.25)" : EMBER;
          ctx.lineWidth = pass === 0 ? 5 : 1.4;
          ctx.stroke();
        }
        // pen + epicycle guides
        const tt = (t * speed * 2) % (Math.PI * 2);
        const px = w / 2 + Math.sin(a * tt + phase) * (w / 2 - margin);
        const py = h / 2 + Math.sin(b * tt) * (h / 2 - margin);
        ctx.fillStyle = FLARE;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, 7); ctx.fill();
      }}>
      </CanvasDemo>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="freq a" value={a} min={1} max={9} onChange={setA} />
        <LabSlider label="freq b" value={b} min={1} max={9} onChange={setB} />
        <LabSlider label="speed" value={speed} min={0} max={2} step={0.1} unit="×" onChange={setSpeed} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ fourier ------------------------------ */

export function FourierDemo() {
  const [terms, setTerms] = useState(6);
  const [shape, setShape] = useState<"square" | "saw">("square");
  return (
    <DemoTile title="Fourier Epicycles" moduleId="math/fourier-epicycles"
      note="Rotating circles whose tips trace a square/sawtooth wave — coefficients 1/n·sin((2k+1)θ) for square; alternating 1/n for saw.">
      <CanvasDemo deps={[terms, shape]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const cx = w * 0.3, cy = h * 0.52;
        let x = cx, y = cy;
        const theta = t * 1.2;
        for (let k = 0; k < terms; k++) {
          let n: number, radius: number;
          if (shape === "square") { n = 2 * k + 1; radius = (54 * 4) / (Math.PI * n); }
          else { n = k + 1; radius = (54 * 2) / (Math.PI * n); }
          const angle = n * theta + (shape === "saw" && n % 2 === 0 ? Math.PI : 0);
          const nx = x + radius * Math.cos(angle);
          const ny = y + radius * Math.sin(angle);
          ctx.strokeStyle = "rgba(242,237,230,0.22)";
          ctx.beginPath(); ctx.arc(x, y, radius, 0, 7); ctx.stroke();
          ctx.strokeStyle = "rgba(255,184,92,0.7)";
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
          x = nx; y = ny;
        }
        // trace history stored in a ring buffer on ctx canvas via dataURL is heavy; use static history from formula
        ctx.strokeStyle = EMBER; ctx.lineWidth = 1.6; ctx.beginPath();
        const startX = cx + 80;
        ctx.moveTo(x, y);
        for (let i = 0; i < w - startX - 10; i += 2) {
          const th = t * 1.2 - i / 60;
          let sy = 0;
          for (let k = 0; k < terms; k++) {
            let n: number, radius: number;
            if (shape === "square") { n = 2 * k + 1; radius = (54 * 4) / (Math.PI * n); }
            else { n = k + 1; radius = (54 * 2) / (Math.PI * n); }
            const angle = n * th + (shape === "saw" && n % 2 === 0 ? Math.PI : 0);
            sy += radius * Math.sin(angle);
          }
          ctx.lineTo(startX + i, cy + sy);
        }
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,92,28,0.25)";
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(startX > x ? x + 40 : x, y); ctx.stroke();
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="terms" value={terms} min={1} max={16} onChange={setTerms} />
        <div className="flex gap-2 pt-1">
          {(["square", "saw"] as const).map((s) => (
            <button key={s} onClick={() => setShape(s)}
              className={`rounded px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider border ${shape === s ? "border-ember text-ember" : "border-line text-smoke"}`}>
              {s} wave
            </button>
          ))}
        </div>
      </div>
    </DemoTile>
  );
}

/* ------------------------------ voronoi ------------------------------ */

export function VoronoiDemo() {
  const [count, setCount] = useState(36);
  const [mode, setMode] = useState<"cells" | "edges">("cells");
  // Brute-force Voronoi on a coarse pixel grid — half-plane algorithm per cell center assignment.
  return (
    <DemoTile title="Voronoi Diagram" moduleId="math/voronoi"
      note="Each pixel assigned to its nearest seed with a full scan; seeds jitter over time. Region bound ~70×45 samples upscaled.">
      <CanvasDemo deps={[count, mode]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const gw = 72, gh = 46;
        const seeds = new Float32Array(count * 2);
        const rnd = mulberry32(count * 7919);
        for (let i = 0; i < count; i++) {
          const bx = rnd() * gw, by = rnd() * gh;
          seeds[i * 2] = bx + Math.sin(t * 0.7 + i) * 1.2;
          seeds[i * 2 + 1] = by + Math.cos(t * 0.9 + i * 1.7) * 1.2;
        }
        // nearest seed per grid cell
        const owner = new Int16Array(gw * gh);
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            let best = 0, bd = Infinity;
            for (let i = 0; i < count; i++) {
              const dx = x - seeds[i * 2], dy = y - seeds[i * 2 + 1];
              const d = dx * dx + dy * dy;
              if (d < bd) { bd = d; best = i; }
            }
            owner[y * gw + x] = best;
          }
        }
        const cw = w / gw, ch = h / gh;
        if (mode === "cells") {
          for (let y = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++) {
              const o = owner[y * gw + x];
              const hue = (o * 47) % 360;
              ctx.fillStyle = `hsl(${hue} 70% 55% / 0.85)`;
              ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
            }
          }
        }
        // edges: neighbor comparison
        ctx.fillStyle = IVORY;
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const o = owner[y * gw + x];
            if ((x + 1 < gw && owner[y * gw + x + 1] !== o) || (y + 1 < gh && owner[y * gw + gw + x] !== o)) {
              ctx.fillStyle = mode === "edges" ? EMBER : "rgba(7,7,8,0.9)";
              ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
            }
          }
        }
        ctx.fillStyle = FLARE;
        for (let i = 0; i < count; i++) {
          ctx.beginPath();
          ctx.arc(seeds[i * 2] * cw, seeds[i * 2 + 1] * ch, 2, 0, 7);
          ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="seeds" value={count} min={8} max={90} onChange={setCount} />
        <div className="flex gap-2 pt-1">
          {(["cells", "edges"] as const).map((s) => (
            <button key={s} onClick={() => setMode(s)}
              className={`rounded px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider border ${mode === s ? "border-ember text-ember" : "border-line text-smoke"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </DemoTile>
  );
}

/* ------------------------------ polar rose ------------------------------ */

export function PolarRoseDemo() {
  const [n, setN] = useState(5);
  const [d, setD] = useState(3);
  return (
    <DemoTile title="Polar Rose — r = cos(kθ)" moduleId="math/polar-rose"
      note="The Maurer rose connects curve points k steps apart with straight chords — caustic envelopes emerge from there.">
      <CanvasDemo deps={[n, d]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 16;
        const k = n / d;
        const N = 361 * d;
        const pts: [number, number][] = [];
        for (let i = 0; i <= N; i++) {
          const th = (i / N) * Math.PI * 2 * d;
          const r = Math.cos(k * th + t * 0.2) * R;
          pts.push([cx + r * Math.cos(th), cy + r * Math.sin(th)]);
        }
        ctx.strokeStyle = "rgba(255,92,28,0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
        // Maurer chords
        ctx.strokeStyle = "rgba(255,184,92,0.5)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        const step = Math.max(2, Math.floor(N / 120));
        for (let i = 0; i < N; i += step) {
          const a = pts[i % N];
          const b2 = pts[(i + 71) % N];
          ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]);
        }
        ctx.stroke();
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="n" value={n} min={1} max={9} onChange={setN} />
        <LabSlider label="d" value={d} min={1} max={9} onChange={setD} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ julia set ------------------------------ */

function drawJulia(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, iters: number) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const scale = Math.min(w, h) / 3.1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let zx = (x - w / 2) / scale;
      let zy = (y - h / 2) / scale;
      let i = 0;
      while (i < iters && zx * zx + zy * zy < 4) {
        const xt = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xt;
        i++;
      }
      const idx = (y * w + x) * 4;
      if (i === iters) { d[idx + 3] = 255; continue; }
      // smooth coloring: ν = i + 1 − log2(log2|z|)
      const nu = i + 1 - Math.log2(Math.log2(zx * zx + zy * zy) / 2 + 1e-9);
      const v = Math.sqrt(Math.max(0, nu / (iters / 4)));
      d[idx] = 255 * v;             // ember-ish ramp
      d[idx + 1] = 92 * v + 163 * (1 - v) * 0.25;
      d[idx + 2] = 28 * v + 60 * (1 - v) * 0.5;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function JuliaDemo() {
  const [iters, setIters] = useState(80);
  const [seed, setSeed] = useState<Point>({ x: -0.7269, y: 0.1889 });
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [tParam, setTParam] = useState(0.5);
  const computed = useMemo(() => ({ ...seed }), [seed]);
  void computed;
  return (
    <DemoTile title="Julia Set — z² + c" moduleId="math/julia"
      note="Smooth coloring ν = i + 1 − log₂(log₂|z|); c is pointer-tunable — move across the canvas to morph the set.">
      <canvas
        ref={(el) => {
          if (!el) return;
          ref.current = el;
          const ctx = el.getContext("2d");
          if (!ctx) return;
          const W = 360, H = 225;
          el.width = W; el.height = H;
          const cx = lerp(-0.8, 0.3, tParam) + seed.x * 0.0;
          const cy = seed.y;
          drawJulia(ctx, W, H, cx, cy, iters);
        }}
        className="block size-full cursor-crosshair"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTParam((e.clientX - r.left) / r.width);
        }}
        aria-label="Julia set renderer — move pointer horizontally to morph c"
      />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="iterations" value={iters} min={24} max={200} onChange={setIters} />
        <LabSlider label="c imag" value={Math.round(seed.y * 1000) / 1000} min={0} max={0.5} step={0.005} onChange={(v) => setSeed((s) => ({ ...s, y: v }))} />
      </div>
    </DemoTile>
  );
}
type Point = { x: number; y: number };

/* ------------------------------ sierpinski ------------------------------ */

export function SierpinskiDemo() {
  const [depth, setDepth] = useState(6);
  return (
    <DemoTile title="Sierpinski Chaos Game" moduleId="math/sierpinski"
      note="A point jumps halfway toward a random vertex each iteration — 20k jumps per frame at the chosen recursion depth.">
      <CanvasDemo deps={[depth]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 14;
        const verts: [number, number][] = [];
        const V = 3 + (depth % 3); // triangle → square → pentagon
        for (let i = 0; i < V; i++) {
          const a = -Math.PI / 2 + (i / V) * Math.PI * 2;
          verts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
        }
        const ratio = V === 3 ? 0.5 : 1 - 1 / V; // chaos game ratio generalization
        let px = cx, py = cy;
        const rnd = mulberry32(1234);
        const jumps = 20000;
        ctx.fillStyle = "rgba(255,92,28,0.75)";
        const spin = t * 0.1;
        const cos = Math.cos(spin), sin = Math.sin(spin);
        for (let i = 0; i < jumps; i++) {
          const v = verts[Math.floor(rnd() * V)];
          px = px + (v[0] - px) * ratio;
          py = py + (v[1] - py) * ratio;
          // rotate around center
          const dx = px - cx, dy = py - cy;
          const rx = cx + dx * cos - dy * sin;
          const ry = cy + dx * sin + dy * cos;
          ctx.fillRect(rx, ry, 1, 1);
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="polygon" value={depth} min={6} max={8} onChange={setDepth} unit="" />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ fractal tree ------------------------------ */

export function FractalTreeDemo() {
  const [depth, setDepth] = useState(10);
  const [angle, setAngle] = useState(24);
  return (
    <DemoTile title="Recursive Fractal Tree" moduleId="math/fractal-tree"
      note="Each branch splits at ±angle with 0.72 length decay; wind is a Perlin gust sampled per branch tip.">
      <CanvasDemo deps={[depth, angle]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const noise = makeNoise2D(7);
        const wind = noise(t * 0.4, 0) * 0.35;
        const draw = (x: number, y: number, theta: number, len: number, d: number) => {
          if (d <= 0 || len < 2) return;
          const nx = x + Math.cos(theta) * len;
          const ny = y + Math.sin(theta) * len;
          const lum = 55 + d * 5;
          ctx.strokeStyle = `hsl(${20 + d * 3} 85% ${Math.min(70, lum)}%)`;
          ctx.lineWidth = Math.max(0.5, d * 0.55);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
          const spread = (angle * Math.PI) / 180;
          const sway = wind * (1 + (depth - d) * 0.25);
          draw(nx, ny, theta - spread + sway, len * 0.72, d - 1);
          draw(nx, ny, theta + spread + sway, len * 0.72, d - 1);
        };
        draw(w / 2, h - 8, -Math.PI / 2, h * 0.26, depth);
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="depth" value={depth} min={4} max={12} onChange={setDepth} />
        <LabSlider label="angle" value={angle} min={8} max={48} unit="°" onChange={setAngle} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ lorenz ------------------------------ */

export function LorenzDemo() {
  const [rho, setRho] = useState(28);
  return (
    <DemoTile title="Lorenz Attractor (RK4)" moduleId="math/lorenz"
      note="σ=10, β=8/3, ρ variable — RK4 integration with h=0.01, five substeps per frame; projecting (x,z) with a trace trail.">
      <CanvasDemo deps={[rho]} draw={(dc) => {
        const { ctx, w, h } = dc;
        ctx.fillStyle = "rgba(7,7,8,0.16)";
        ctx.fillRect(0, 0, w, h);
        // persistent state stashed on the canvas context
        const st = (ctx as unknown as { __lorenz?: { x: number; y: number; z: number } });
        const stt = st.__lorenz ?? (st.__lorenz = { x: 0.4, y: 0.3, z: 26 });
        const sigma = 10, beta = 8 / 3, hStep = 0.01;
        const f = (x: number, y: number, z: number): [number, number, number] => [
          sigma * (y - x), x * (rho - z) - y, x * y - beta * z,
        ];
        for (let s = 0; s < 5; s++) {
          const { x, y, z } = stt;
          const [k1x, k1y, k1z] = f(x, y, z);
          const [k2x, k2y, k2z] = f(x + k1x * hStep / 2, y + k1y * hStep / 2, z + k1z * hStep / 2);
          const [k3x, k3y, k3z] = f(x + k2x * hStep / 2, y + k2y * hStep / 2, z + k2z * hStep / 2);
          const [k4x, k4y, k4z] = f(x + k3x * hStep, y + k3y * hStep, z + k3z * hStep);
          stt.x += (hStep / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
          stt.y += (hStep / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
          stt.z += (hStep / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);
          const px = w / 2 + stt.x * (w / 52);
          const py = h - 14 - stt.z * (h / 56);
          ctx.fillStyle = `hsl(${18 + stt.z} 90% 60%)`;
          ctx.fillRect(px, py, 1.6, 1.6);
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="ρ rho" value={rho} min={10} max={50} step={0.5} onChange={setRho} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ boids ------------------------------ */

export function BoidsDemo() {
  const [count, setCount] = useState(90);
  return (
    <DemoTile title="Boids Flocking" moduleId="math/boids"
      note="Reynolds rules — separation, alignment, cohesion — over a spatial hash; mouse acts as a predator.">
      <CanvasDemo deps={[count]} draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const bag = (ctx as unknown as { __boids?: { x: number; y: number; vx: number; vy: number }[] });
        if (!bag.__boids || bag.__boids.length !== count) {
          const rnd = mulberry32(count);
          bag.__boids = Array.from({ length: count }, () => ({
            x: rnd() * w, y: rnd() * h, vx: rnd() * 2 - 1, vy: rnd() * 2 - 1,
          }));
        }
        const boids = bag.__boids;
        for (const b of boids) {
          let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0;
          for (const o of boids) {
            if (o === b) continue;
            const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 < 3600 && d2 > 0.01) {
              n++;
              ax += o.vx; ay += o.vy;
              cx += o.x; cy += o.y;
              if (d2 < 480) { sx -= dx / d2; sy -= dy / d2; }
            }
          }
          if (n > 0) {
            ax = ax / n - b.vx; ay = ay / n - b.vy;
            cx = cx / n - b.x; cy = cy / n - b.y;
            b.vx += ax * 0.03 + cx * 0.002 + sx * 8;
            b.vy += ay * 0.03 + cy * 0.002 + sy * 8;
          }
          if (pointer.inside) {
            const dx = b.x - pointer.x, dy = b.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < 9000 && d2 > 1) { b.vx += (dx / d2) * 120; b.vy += (dy / d2) * 120; }
          }
          const sp = Math.hypot(b.vx, b.vy) || 1;
          const max = 2.4, min = 1.1;
          if (sp > max) { b.vx = (b.vx / sp) * max; b.vy = (b.vy / sp) * max; }
          if (sp < min) { b.vx = (b.vx / sp) * min; b.vy = (b.vy / sp) * min; }
          b.x += b.vx; b.y += b.vy;
          if (b.x < -8) b.x = w + 8; if (b.x > w + 8) b.x = -8;
          if (b.y < -8) b.y = h + 8; if (b.y > h + 8) b.y = -8;
          const ang = Math.atan2(b.vy, b.vx);
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(ang);
          ctx.fillStyle = EMBER;
          ctx.beginPath();
          ctx.moveTo(6, 0); ctx.lineTo(-4, 3.2); ctx.lineTo(-2, 0); ctx.lineTo(-4, -3.2);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="boids" value={count} min={20} max={220} step={5} onChange={setCount} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ noise & fbm fields ------------------------------ */

export function NoiseFieldDemo({ mode }: { mode: "noise" | "fbm" | "warp" }) {
  const [oct, setOct] = useState(4);
  const titles = {
    noise: ["Value Noise Field", "math/perlin-noise", "Single-octave gradient value noise, bilinear-smoothed; brightness = field value."],
    fbm: ["Fractional Brownian Motion", "math/fbm", "Octave stacking with lacunarity×2, gain×0.5 — the canonical fBM. Octave slider exposes each layer."],
    warp: ["IQ Domain Warping", "math/domain-warping", "f(p) = fbm(p + fbm(p + fbm(p))) — double-warped value noise, IQ's classic construction."],
  } as const;
  const [title, id, note] = titles[mode];
  return (
    <DemoTile title={title} moduleId={id} note={note}>
      <CanvasDemo deps={[oct, mode]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        const noise = makeNoise2D(31);
        const gw = 96, gh = 60;
        const cw = w / gw, ch = h / gh;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const px = x * 0.06 + t * 0.05, py = y * 0.06;
            let v: number;
            if (mode === "noise") v = noise(px, py);
            else if (mode === "fbm") v = fbm(noise, px, py, oct);
            else v = fbm(noise, px + fbm(noise, px + fbm(noise, px, py, oct) * 1.6, py, oct) * 1.6, py, oct);
            const vv = Math.min(1, Math.max(0, v * 0.5 + 0.5));
            ctx.fillStyle = `hsl(${16 + vv * 12} 88% ${8 + vv * 52}%)`;
            ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
          }
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="octaves" value={oct} min={1} max={8} onChange={setOct} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ terrain ------------------------------ */

export function TerrainDemo() {
  return (
    <DemoTile title="Procedural Terrain Flyover" moduleId="math/procedural-landscape"
      note="Heightfield from low-octave fBM, perspectively projected wireframe flying forward; rows near the horizon flatten.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const noise = makeNoise2D(11);
        const rows = 26, cols = 30;
        const horizon = h * 0.32;
        ctx.strokeStyle = "rgba(255,92,28,0.85)";
        for (let r = 0; r < rows; r++) {
          const rz = rows - r; // far→near
          const zt = (r + ((t * 3) % 1)) / rows;
          const y = horizon + (h - horizon) * Math.pow(zt, 1.6);
          const depth = (r + ((t * 3) % 1)) * 1.4;
          ctx.beginPath();
          for (let c = 0; c <= cols; c++) {
            const x = (c / cols) * w;
            const elev = fbm(noise, c * 0.35, depth * 0.35 + rz, 4);
            const amp = 46 * Math.pow(zt, 1.2) + 4;
            const yy = y - elev * amp;
            c === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
          }
          ctx.lineWidth = 0.6 + zt * 1.2;
          ctx.stroke();
        }
        // sky band
        const g = ctx.createLinearGradient(0, 0, 0, horizon);
        g.addColorStop(0, "#0b0b10");
        g.addColorStop(1, "#171017");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, horizon);
      }} />
    </DemoTile>
  );
}

/* ------------------------------ reaction-diffusion ------------------------------ */

export function ReactionDiffusionDemo() {
  return (
    <DemoTile title="Gray–Scott Reaction-Diffusion" moduleId="math/reaction-diffusion"
      note="U/V chemical fields on 96×60 grid, 6 sim substeps per frame; feed 0.055 / kill 0.062 — coral morphology.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type RD = { u: Float32Array; v: Float32Array; gw: number; gh: number; seed: boolean };
        const bag = ctx as unknown as { __rd?: RD };
        const gw = 96, gh = 60;
        if (!bag.__rd) {
          const u = new Float32Array(gw * gh).fill(1);
          const v = new Float32Array(gw * gh);
          const rnd = mulberry32(3);
          for (let s = 0; s < 5; s++) {
            const cx = 10 + Math.floor(rnd() * (gw - 20));
            const cy = 8 + Math.floor(rnd() * (gh - 16));
            for (let y = -3; y <= 3; y++)
              for (let x = -3; x <= 3; x++)
                if (x * x + y * y < 9) v[(cy + y) * gw + cx + x] = 1;
          }
          bag.__rd = { u, v, gw, gh, seed: true };
        }
        const { u, v } = bag.__rd;
        const dU = 1.0, dV = 0.5, feed = 0.055, kill = 0.062, dt = 1.0;
        const u2 = new Float32Array(u.length);
        const v2 = new Float32Array(v.length);
        for (let step = 0; step < 6; step++) {
          for (let y = 1; y < gh - 1; y++) {
            for (let x = 1; x < gw - 1; x++) {
              const i = y * gw + x;
              const lapU = u[i - 1] + u[i + 1] + u[i - gw] + u[i + gw] - 4 * u[i];
              const lapV = v[i - 1] + v[i + 1] + v[i - gw] + v[i + gw] - 4 * v[i];
              const reac = u[i] * v[i] * v[i];
              u2[i] = u[i] + (dU * lapU - reac + feed * (1 - u[i])) * dt;
              v2[i] = v[i] + (dV * lapV + reac - (feed + kill) * v[i]) * dt;
            }
          }
          u.set(u2); v.set(v2);
        }
        const cw = w / gw, ch = h / gh;
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const vv = v[y * gw + x];
            if (vv > 0.18) {
              ctx.fillStyle = `hsl(${20 - vv * 10} 90% ${30 + vv * 120}%)`;
              ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
            }
          }
        }
      }} />
    </DemoTile>
  );
}

/* ------------------------------ metaballs ------------------------------ */

export function MetaballsDemo() {
  const [balls, setBalls] = useState(6);
  return (
    <DemoTile title="Metaballs (Marching Squares)" moduleId="math/metaballs"
      note="Field = Σ r²/d² per sample, marching-squares isolines at threshold 1 with linear interpolation.">
      <CanvasDemo deps={[balls]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const gw = 84, gh = 52;
        const bx: number[] = [], by: number[] = [], br: number[] = [];
        for (let i = 0; i < balls; i++) {
          bx.push(w / 2 + Math.sin(t * 0.7 + i * 2.1) * (w * 0.32));
          by.push(h / 2 + Math.cos(t * 0.9 + i * 1.4) * (h * 0.3));
          br.push(0.7 + 0.5 * Math.sin(i * 1.7));
        }
        const cw = w / gw, ch = h / gh;
        const field = new Float32Array((gw + 1) * (gh + 1));
        for (let y = 0; y <= gh; y++) {
          for (let x = 0; x <= gw; x++) {
            let s = 0;
            for (let i = 0; i < balls; i++) {
              const dx = bx[i] - x * cw, dy = by[i] - y * ch;
              const d2 = dx * dx + dy * dy + 1;
              s += (br[i] * br[i] * 2600) / d2;
            }
            field[y * (gw + 1) + x] = s;
          }
        }
        // marching squares
        ctx.strokeStyle = FLARE;
        ctx.lineWidth = 1.1;
        const iso = 1;
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const a = field[y * (gw + 1) + x];
            const b = field[y * (gw + 1) + x + 1];
            const c = field[(y + 1) * (gw + 1) + x + 1];
            const d = field[(y + 1) * (gw + 1) + x];
            let idx = 0;
            if (a > iso) idx |= 8;
            if (b > iso) idx |= 4;
            if (c > iso) idx |= 2;
            if (d > iso) idx |= 1;
            if (idx === 0 || idx === 15) continue;
            const ix = (p: number, q: number) => (iso - p) / (q - p);
            const top: [number, number] = [(x + ix(a, b)) * cw, y * ch];
            const right: [number, number] = [(x + 1) * cw, (y + ix(b, c)) * ch];
            const bottom: [number, number] = [(x + ix(d, c)) * cw, (y + 1) * ch];
            const left: [number, number] = [x * cw, (y + ix(a, d)) * ch];
            const seg = (p: [number, number], q: [number, number]) => {
              ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
            };
            if (idx === 1 || idx === 14) seg(left, bottom);
            else if (idx === 2 || idx === 13) seg(bottom, right);
            else if (idx === 3 || idx === 12) seg(left, right);
            else if (idx === 4 || idx === 11) seg(top, right);
            else if (idx === 5) { seg(left, top); seg(bottom, right); }
            else if (idx === 6 || idx === 9) seg(top, bottom);
            else if (idx === 7 || idx === 8) seg(left, top);
            else if (idx === 10) { seg(left, bottom); seg(top, right); }
          }
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="balls" value={balls} min={3} max={14} onChange={setBalls} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ phyllotaxis ------------------------------ */

export function PhyllotaxisDemo() {
  const [n, setN] = useState(400);
  const [angle, setAngle] = useState(137.5077);
  return (
    <DemoTile title="Phyllotaxis — Golden Angle Spiral" moduleId="math/phyllotaxis"
      note="θ = n·137.5077°, r = c·√n. The golden angle produces parastichy spirals; nudge the slider to watch them reorganize.">
      <CanvasDemo deps={[n, angle]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2;
        const c = Math.min(w, h) / (Math.sqrt(n) * 2.15);
        const wobble = t * 0.15;
        for (let i = 0; i < n; i++) {
          const th = (i * angle * Math.PI) / 180 + wobble;
          const r = c * Math.sqrt(i);
          const x = cx + r * Math.cos(th);
          const y = cy + r * Math.sin(th);
          const s = 1 + 2.6 * Math.sqrt(i / n);
          const hue = 16 + (i / n) * 40;
          ctx.fillStyle = `hsl(${hue} 85% ${45 + (i / n) * 20}%)`;
          ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="points" value={n} min={80} max={800} step={10} onChange={setN} />
        <LabSlider label="angle°" value={Math.round(angle * 1000) / 1000} min={134} max={141} step={0.01} onChange={setAngle} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ force graph ------------------------------ */

export function ForceGraphDemo() {
  const [nodes, setNodes] = useState(24);
  return (
    <DemoTile title="Force-Directed Graph" moduleId="math/force-graph"
      note="Coulomb-style repulsion + spring attraction on edges + mild centering; ticked per frame with velocity damping.">
      <CanvasDemo deps={[nodes]} draw={(dc) => {
        const { ctx, w, h } = dc;
        type N = { x: number; y: number; vx: number; vy: number };
        const bag = ctx as unknown as { __fg?: { nodes: N[]; edges: [number, number][] } };
        if (!bag.__fg || bag.__fg.nodes.length !== nodes) {
          const rnd = mulberry32(nodes * 31);
          const ns: N[] = Array.from({ length: nodes }, () => ({
            x: w / 2 + (rnd() - 0.5) * w * 0.7,
            y: h / 2 + (rnd() - 0.5) * h * 0.7,
            vx: 0, vy: 0,
          }));
          const es: [number, number][] = [];
          for (let i = 0; i < nodes; i++) {
            es.push([i, (i + 1) % nodes]);
            if (rnd() > 0.45) es.push([i, Math.floor(rnd() * nodes)]);
          }
          bag.__fg = { nodes: ns, edges: es };
        }
        const { nodes: ns, edges } = bag.__fg;
        const k = 40, rep = 2600;
        for (let i = 0; i < ns.length; i++) {
          for (let j = i + 1; j < ns.length; j++) {
            const a = ns[i], b = ns[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy + 0.01;
            const f = rep / d2;
            a.vx += (dx / Math.sqrt(d2)) * f * 0.02;
            a.vy += (dy / Math.sqrt(d2)) * f * 0.02;
            b.vx -= (dx / Math.sqrt(d2)) * f * 0.02;
            b.vy -= (dy / Math.sqrt(d2)) * f * 0.02;
          }
        }
        for (const [i, j] of edges) {
          const a = ns[i], b = ns[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = (d - k) * 0.01;
          a.vx += (dx / d) * f; a.vy += (dy / d) * f;
          b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
        }
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(242,237,230,0.18)";
        for (const [i, j] of edges) {
          ctx.beginPath(); ctx.moveTo(ns[i].x, ns[i].y); ctx.lineTo(ns[j].x, ns[j].y); ctx.stroke();
        }
        for (const n of ns) {
          n.vx += (w / 2 - n.x) * 0.0015;
          n.vy += (h / 2 - n.y) * 0.0015;
          n.vx *= 0.86; n.vy *= 0.86;
          n.x += n.vx; n.y += n.vy;
          ctx.fillStyle = EMBER;
          ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, 7); ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="nodes" value={nodes} min={8} max={60} onChange={setNodes} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ plasma / starfield / wave-field / constellation ------------------------------ */

export function PlasmaDemo() {
  return (
    <DemoTile title="Interference Plasma" moduleId="backgrounds/plasma"
      note="Three sinusoid interference planes summed — the old demo-scene plasma, distance field + rotating angle field.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t } = dc;
        const gw = 80, gh = 50;
        const cw = w / gw, ch = h / gh;
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const v =
              Math.sin(x * 0.19 + t) +
              Math.sin(y * 0.16 + t * 1.3) +
              Math.sin(Math.hypot(x - gw / 2, y - gh / 2) * 0.21 - t * 0.8) +
              Math.sin((x * 0.06 + y * 0.04) * Math.cos(t * 0.3));
            const vv = (v + 4) / 8;
            ctx.fillStyle = `hsl(${vv * 60 + 350 % 360} 85% ${18 + vv * 44}%)`;
            ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
          }
        }
      }} />
    </DemoTile>
  );
}

export function StarfieldDemo() {
  const [stars, setStars] = useState(320);
  const bagRef = useRef<{ x: number; y: number; z: number }[] | null>(null);
  return (
    <DemoTile title="Parallax Starfield" moduleId="backgrounds/starfield"
      note="3D star projection — stars stream toward the camera with 1/z scaling; pointer drifts the vantage point.">
      <CanvasDemo deps={[stars]} draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = "#050507"; ctx.fillRect(0, 0, w, h);
        if (!bagRef.current || bagRef.current.length !== stars) {
          const rnd = mulberry32(stars);
          bagRef.current = Array.from({ length: stars }, () => ({
            x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd(),
          }));
        }
        for (const s of bagRef.current!) {
          s.z -= 0.006;
          if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; }
          const offx = pointer.inside ? (pointer.x - w / 2) / w * -0.24 : 0;
          const offy = pointer.inside ? (pointer.y - h / 2) / h * -0.24 : 0;
          const sx = w / 2 + ((s.x + offx) / s.z) * w * 0.5;
          const sy = h / 2 + ((s.y + offy) / s.z) * h * 0.5;
          if (sx < 0 || sy < 0 || sx > w || sy > h) continue;
          const size = (1.15 - s.z) * 2.6;
          const lum = (1.1 - s.z);
          ctx.fillStyle = `rgba(${242}, ${237 - s.z * 60}, ${230 - s.z * 100}, ${lum})`;
          ctx.beginPath(); ctx.arc(sx, sy, size, 0, 7); ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="stars" value={stars} min={80} max={900} step={20} onChange={setStars} />
      </div>
    </DemoTile>
  );
}

export function WaveFieldDemo() {
  return (
    <DemoTile title="Interference Wave Field" moduleId="backgrounds/wave-field"
      note="A grid of dots elevated by y = Σ sin(kx − ωt) waves — interference patterns emerge from two wave sources.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const cols = 42, rows = 24;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = (c / (cols - 1)) * w;
            const yb = (r / (rows - 1)) * h;
            const e =
              Math.sin(x * 0.024 + t * 1.7) +
              Math.sin(yb * 0.031 - t * 1.2) +
              Math.sin(Math.hypot(x - w / 2, yb - h / 2) * 0.02 - t * 1.6);
            const y = yb + e * 4.2;
            const lum = (e + 3) / 6;
            ctx.fillStyle = `hsl(${18 + lum * 10} 88% ${30 + lum * 38}%)`;
            ctx.beginPath(); ctx.arc(x, y, 1.1 + lum * 1.6, 0, 7); ctx.fill();
          }
        }
      }} />
    </DemoTile>
  );
}

export function ConstellationCursorDemo() {
  return (
    <DemoTile title="Constellation Cursor" moduleId="backgrounds/cursor-reactive-bg"
      note="Fixed stars connect to each other and to the moving pointer within a radius — a cursor-modulated network.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, pointer, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const rnd = mulberry32(99);
        const pts: [number, number][] = Array.from({ length: 46 }, () => [rnd(), rnd()]);
        const nodes = pts.map(([fx, fy], i) => ({
          x: fx * w + Math.sin(t * 0.4 + i) * 10,
          y: fy * h + Math.cos(t * 0.5 + i * 2) * 10,
        }));
        const all = pointer.inside ? [...nodes, { x: pointer.x, y: pointer.y }] : nodes;
        ctx.strokeStyle = "rgba(242,237,230,0.16)";
        ctx.lineWidth = 1;
        for (let i = 0; i < all.length; i++) {
          for (let j = i + 1; j < all.length; j++) {
            const dx = all[i].x - all[j].x, dy = all[i].y - all[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 120 * 120) {
              const a = 1 - Math.sqrt(d2) / 120;
              ctx.strokeStyle = `rgba(255,140,80,${a * 0.5})`;
              ctx.beginPath(); ctx.moveTo(all[i].x, all[i].y); ctx.lineTo(all[j].x, all[j].y); ctx.stroke();
            }
          }
        }
        ctx.fillStyle = IVORY;
        for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, 7); ctx.fill(); }
      }} />
    </DemoTile>
  );
}

/* ------------------------------ flow field ------------------------------ */

export function FlowFieldDemo() {
  const [curl, setCurl] = useState(1);
  return (
    <DemoTile title="Perlin Flow Field" moduleId="math/flow-field"
      note="Particle advection along angle = noise(x,y)·τ — vector field visualized through streak lines with fading trails.">
      <CanvasDemo deps={[curl]} draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = "rgba(7,7,8,0.075)";
        ctx.fillRect(0, 0, w, h);
        type P = { x: number; y: number; life: number };
        const bag = ctx as unknown as { __ff?: P[]; __t?: number };
        bag.__t = (bag.__t ?? 0) + 0.004;
        if (!bag.__ff) {
          const rnd = mulberry32(5);
          bag.__ff = Array.from({ length: 340 }, () => ({ x: rnd() * w, y: rnd() * h, life: rnd() * 200 }));
        }
        const noise = makeNoise2D(9);
        for (const p of bag.__ff) {
          const a = noise(p.x * 0.004, p.y * 0.004 + bag.__t) * Math.PI * 2 * curl;
          let vx = Math.cos(a) * 1.5, vy = Math.sin(a) * 1.5;
          if (pointer.inside) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy + 40;
            vx += (dx / d2) * 90; vy += (dy / d2) * 90;
          }
          ctx.strokeStyle = "rgba(255,110,40,0.5)";
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y);
          p.x += vx; p.y += vy; p.life++;
          ctx.lineTo(p.x, p.y); ctx.stroke();
          if (p.x < 0 || p.y < 0 || p.x > w || p.y > h || p.life > 260) {
            p.x = Math.random() * w; p.y = Math.random() * h; p.life = 0;
          }
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="curl" value={curl} min={1} max={4} onChange={setCurl} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ noise-field (shader field alias) -------------------- */

export function ShaderFieldDemo() {
  return <NoiseFieldDemo mode="warp" />;
}
