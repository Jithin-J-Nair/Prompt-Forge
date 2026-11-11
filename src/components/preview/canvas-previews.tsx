"use client";

import { useRef } from "react";
import {
  clamp, fbm, makeNoise2D, mulberry32, numP, strP, usePreviewCanvas, type PreviewProps,
} from "./runtime";

const INK = "#070708";
const EMBER = "#ff5c1c";
const FLARE = "#ffb85c";
const IVORY = "#f2ede6";

function Cv({
  draw, props, deps = [],
}: {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  props: PreviewProps;
  deps?: unknown[];
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { params } = props;
  // redraw when params change: params identity changes per edit in studio
  usePreviewCanvas(ref, draw, { animate: props.animate, still: props.still, deps: [...deps, params] });
  return <canvas ref={ref} className="block size-full" />;
}

/* ============================ ambient/particles ============================ */

export function CvParticles(p: PreviewProps) {
  const count = clamp(numP(p.params, "count", numP(p.params, "ceiling", numP(p.params, "density", 120)) || 120), 12, 360);
  return <Cv props={p} deps={[count]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(count * 7);
    for (let i = 0; i < count; i++) {
      const bx = rnd() * w, by = rnd() * h, ph = rnd() * 7, sp = 0.3 + rnd();
      const x = (bx + Math.sin(t * sp + ph) * 14 + t * 6 * sp) % w;
      const y = (by + Math.cos(t * sp * 0.8 + ph) * 10) % h;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 2 + ph));
      ctx.fillStyle = i % 4 ? `rgba(255,150,80,${tw})` : `rgba(242,237,230,${tw * 0.9})`;
      ctx.beginPath(); ctx.arc((x + w) % w, (y + h) % h, 1.2 + (i % 3) * 0.5, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvParticleNetwork(p: PreviewProps) {
  const count = clamp(numP(p.params, "count", 60), 12, 160);
  const radius = clamp(numP(p.params, "radius", numP(p.params, "linkDistance", 70)), 30, 140);
  return <Cv props={p} deps={[count, radius]} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const st = stateOf(ctx, `pn${count}`, () => {
      const rnd = mulberry32(count);
      return Array.from({ length: count }, () => ({ x: rnd() * w, y: rnd() * h, vx: (rnd() - 0.5) * 0.8, vy: (rnd() - 0.5) * 0.8 }));
    }) as { x: number; y: number; vx: number; vy: number }[];
    for (const b of st) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < 0 || b.x > w) b.vx *= -1;
      if (b.y < 0 || b.y > h) b.vy *= -1;
    }
    for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
      const dx = st[i].x - st[j].x, dy = st[i].y - st[j].y, d2 = dx * dx + dy * dy;
      if (d2 < radius * radius) {
        ctx.strokeStyle = `rgba(255,92,28,${(1 - Math.sqrt(d2) / radius) * 0.5})`;
        ctx.beginPath(); ctx.moveTo(st[i].x, st[i].y); ctx.lineTo(st[j].x, st[j].y); ctx.stroke();
      }
    }
    ctx.fillStyle = IVORY;
    for (const b of st) { ctx.beginPath(); ctx.arc(b.x, b.y, 1.3, 0, 7); ctx.fill(); }
  }} />;
}

export function CvParticleRepel(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(9);
    for (let i = 0; i < 90; i++) {
      const bx = rnd() * w, by = rnd() * h;
      const a = Math.atan2(by - h / 2, bx - w / 2);
      const rr = Math.min(w, h) * 0.28 + Math.sin(t + i) * 12;
      const x = w / 2 + Math.cos(a + t * 0.2) * rr;
      const y = h / 2 + Math.sin(a + t * 0.2) * rr;
      ctx.fillStyle = `rgba(255,${92 + (i % 3) * 40},${28 + (i % 2) * 60},0.8)`;
      ctx.beginPath(); ctx.arc(x, y, 1.4, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvTrails(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = "rgba(7,7,8,0.14)"; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5; i++) {
      const a = t * (0.6 + i * 0.17) + i * 1.3;
      const x = w / 2 + Math.cos(a * 1.7) * w * 0.3;
      const y = h / 2 + Math.sin(a * 2.3) * h * 0.3;
      ctx.fillStyle = i % 2 ? EMBER : FLARE;
      ctx.beginPath(); ctx.arc(x, y, 2.5 - i * 0.3, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvParticleMorph(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const N = 220;
    const cyc = (Math.sin(t * 0.4) + 1) / 2; // circle ↔ grid morph phase
    for (let i = 0; i < N; i++) {
      const aA = (i / N) * Math.PI * 2;
      const ax = w / 2 + Math.cos(aA) * Math.min(w, h) * 0.34;
      const ay = h / 2 + Math.sin(aA) * Math.min(w, h) * 0.34;
      const gx = 8 + (i % 15) * ((w - 16) / 14);
      const gy = 8 + Math.floor(i / 15) * ((h - 16) / 14);
      const e = cyc * cyc * (3 - 2 * cyc);
      ctx.fillStyle = `rgba(255,${Math.round(92 + e * 100)},40,0.85)`;
      ctx.beginPath(); ctx.arc(ax + (gx - ax) * e, ay + (gy - ay) * e, 1.2, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvImageParticles(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const st = stateOf(ctx, "ip", () => {
      const off = document.createElement("canvas");
      off.width = 120; off.height = 40;
      const oc = off.getContext("2d")!;
      oc.fillStyle = "#fff"; oc.font = "900 34px 'Space Grotesk Variable',sans-serif";
      oc.textAlign = "center"; oc.textBaseline = "middle";
      oc.fillText("FORGE", 60, 22);
      const d = oc.getImageData(0, 0, 120, 40).data;
      const pts: { x: number; y: number; hx: number; hy: number }[] = [];
      for (let y = 0; y < 40; y += 3) for (let x = 0; x < 120; x += 3)
        if (d[(y * 120 + x) * 4 + 3] > 128) pts.push({ x: Math.random() * w, y: Math.random() * h, hx: (x / 120) * w * 0.86 + w * 0.07, hy: (y / 40) * h * 0.5 + h * 0.25 });
      return pts;
    });
    for (const pt of st) {
      pt.x += (pt.hx - pt.x) * 0.08;
      pt.y += (pt.hy - pt.y) * 0.08;
      ctx.fillStyle = EMBER; ctx.fillRect(pt.x, pt.y, 1.5, 1.5);
    }
  }} />;
}

export function CvExplosion(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cycle = t % 3;
    const rnd = mulberry32(3);
    for (let i = 0; i < 120; i++) {
      const a = rnd() * Math.PI * 2, v = 30 + rnd() * 120;
      const d = v * cycle * (2 - cycle * 0.6);
      const alpha = Math.max(0, 1 - cycle / 2.4);
      ctx.fillStyle = `rgba(255,${110 + Math.round(rnd() * 80)},40,${alpha})`;
      ctx.beginPath(); ctx.arc(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d + cycle * cycle * 18, 1.6, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvAudioBars(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const bars = 28, bw = w / bars;
    const noise = makeNoise2D(5);
    for (let i = 0; i < bars; i++) {
      // simulated spectrum: bass-heavy envelope × noise shimmer (no mic in preview)
      const env = Math.exp(-i / bars * 2.2);
      const v = Math.abs(noise(i * 0.35, t * 1.8)) * env * 1.4;
      const bh = 6 + v * (h - 14);
      ctx.fillStyle = `hsl(${20 - i * 0.4} 90% ${45 + v * 20}%)`;
      ctx.fillRect(i * bw + 1, h - bh - 4, bw - 2, bh);
    }
  }} />;
}

export function CvFlowField(p: PreviewProps) {
  const curl = clamp(numP(p.params, "curl", numP(p.params, "complexity", 2)), 1, 4);
  return <Cv props={p} deps={[curl]} draw={(ctx, w, h) => {
    ctx.fillStyle = "rgba(7,7,8,0.09)"; ctx.fillRect(0, 0, w, h);
    const st = stateOf(ctx, `ff${curl}`, () => {
      const rnd = mulberry32(6);
      return { t: 0, pts: Array.from({ length: 200 }, () => ({ x: rnd() * w, y: rnd() * h, life: 0 })) };
    });
    st.t += 0.004;
    const noise = makeNoise2D(9);
    ctx.strokeStyle = "rgba(255,110,40,0.45)"; ctx.lineWidth = 0.7;
    for (const pt of st.pts) {
      const a = noise(pt.x * 0.005, pt.y * 0.005 + st.t) * Math.PI * 2 * curl;
      ctx.beginPath(); ctx.moveTo(pt.x, pt.y);
      pt.x += Math.cos(a) * 1.4; pt.y += Math.sin(a) * 1.4;
      ctx.lineTo(pt.x, pt.y); ctx.stroke();
      if (++pt.life > 180 || pt.x < 0 || pt.y < 0 || pt.x > w || pt.y > h) { pt.x = Math.random() * w; pt.y = Math.random() * h; pt.life = 0; }
    }
  }} />;
}

/* ============================ physics ============================ */

interface SpringState { x: number; y: number; vx: number; vy: number }

export function CvSpring(p: PreviewProps) {
  const stiff = clamp(numP(p.params, "stiffness", 120), 20, 400);
  const damp = clamp(numP(p.params, "damping", 14), 4, 30);
  return <Cv props={p} deps={[stiff, damp]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const s = stateOf<SpringState>(ctx, "spring", () => ({ x: w / 2, y: h / 2, vx: 0, vy: 0 }));
    const tx = w / 2 + Math.sin(t * 1.1) * w * 0.3;
    const ty = h / 2 + Math.cos(t * 1.4) * h * 0.26;
    s.vx += (tx - s.x) * stiff * 0.016 - s.vx * damp * 0.016;
    s.vy += (ty - s.y) * stiff * 0.016 - s.vy * damp * 0.016;
    s.x += s.vx; s.y += s.vy;
    ctx.strokeStyle = "rgba(242,237,230,0.2)";
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
    ctx.fillStyle = FLARE; ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(255,184,92,0.35)";
    ctx.beginPath(); ctx.arc(tx, ty, 3, 0, 7); ctx.stroke();
  }} />;
}

export function CvRope(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    type V = { x: number; y: number; px: number; py: number };
    const N = 12;
    const rope = stateOf<V[]>(ctx, "rope", () => Array.from({ length: N }, (_, i) => ({ x: w / 2, y: 8 + i * (h - 20) / (N - 1), px: w / 2, py: 8 + i * (h - 20) / (N - 1) })));
    const seg = (h - 20) / (N - 1);
    for (let i = 1; i < N; i++) {
      const v = rope[i];
      const vx = (v.x - v.px) * 0.98, vy = (v.y - v.py) * 0.98;
      v.px = v.x; v.py = v.y;
      v.x += vx; v.y += vy + 0.5;
    }
    rope[0].x = w / 2 + Math.sin(t * 1.6) * w * 0.28;
    rope[0].y = 8;
    for (let k = 0; k < 3; k++) for (let i = 0; i < N - 1; i++) {
      const a = rope[i], b = rope[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const diff = (d - seg) / d * 0.5, ox = dx * diff, oy = dy * diff;
      if (i === 0) { b.x -= ox * 2; b.y -= oy * 2; } else { a.x += ox; a.y += oy; b.x -= ox; b.y -= oy; }
    }
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.3; ctx.beginPath();
    ctx.moveTo(rope[0].x, rope[0].y);
    for (const v of rope) ctx.lineTo(v.x, v.y);
    ctx.stroke();
    ctx.fillStyle = FLARE; ctx.beginPath(); ctx.arc(rope[N - 1].x, rope[N - 1].y, 3.5, 0, 7); ctx.fill();
  }} />;
}

export function CvFloat(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(41);
    for (let i = 0; i < 12; i++) {
      const px = rnd(), py = rnd(), ph = rnd() * 7, r = 2 + rnd() * 3;
      ctx.fillStyle = i % 3 ? "rgba(242,237,230,0.5)" : EMBER;
      ctx.beginPath();
      ctx.arc(px * w + Math.sin(t + ph) * 14, py * h + Math.cos(t * 0.8 + ph * 1.3) * 11, r, 0, 7);
      ctx.fill();
    }
  }} />;
}

export function CvBlob(p: PreviewProps) {
  const rough = clamp(numP(p.params, "roughness", 0.6), 0.1, 1.2);
  return <Cv props={p} deps={[rough]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const noise = makeNoise2D(4);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.26;
    const N = 10;
    const pts: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = R * (1 + noise(Math.cos(a) * 1.6 + 5, Math.sin(a) * 1.6 + t * 0.5) * rough);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
      if (i === 0) ctx.moveTo(p1[0], p1[1]);
      ctx.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, R * 1.4);
    g.addColorStop(0, "rgba(255,92,28,0.9)"); g.addColorStop(1, "rgba(255,46,77,0.45)");
    ctx.fillStyle = g; ctx.fill();
  }} />;
}

export function CvCollision(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    type B = { x: number; y: number; vx: number; vy: number; r: number };
    const balls = stateOf<B[]>(ctx, "col", () => {
      const rnd = mulberry32(12);
      return Array.from({ length: 6 }, (_, i) => ({ x: 20 + rnd() * (w - 40), y: 20 + rnd() * (h - 40), vx: (rnd() - 0.5) * 2.4, vy: (rnd() - 0.5) * 2.4, r: 7 + (i % 3) * 3 }));
    });
    for (const b of balls) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < b.r || b.x > w - b.r) b.vx *= -1;
      if (b.y < b.r || b.y > h - b.r) b.vy *= -1;
    }
    for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], b = balls[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      const min = a.r + b.r;
      if (d < min && d > 0) {
        const push = (min - d) / 2, ux = dx / d, uy = dy / d;
        a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push;
        const tv = a.vx * ux + a.vy * uy - (b.vx * ux + b.vy * uy);
        a.vx -= tv * ux; a.vy -= tv * uy; b.vx += tv * ux; b.vy += tv * uy;
      }
    }
    for (let i = 0; i < balls.length; i++) {
      ctx.fillStyle = i % 2 ? FLARE : EMBER;
      ctx.beginPath(); ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvMediaTrail(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    // cursor simulated on a Lissajous path; 8 ghost cards chase with progressive lag
    let tx = w / 2 + Math.sin(t * 1.3) * w * 0.34;
    let ty = h / 2 + Math.cos(t * 1.7) * h * 0.3;
    const trail = stateOf<{ x: number; y: number }[]>(ctx, "mt", () => Array.from({ length: 8 }, () => ({ x: w / 2, y: h / 2 })));
    for (let i = 0; i < trail.length; i++) {
      const c = trail[i];
      c.x += (tx - c.x) * 0.18; c.y += (ty - c.y) * 0.18;
      tx = c.x; ty = c.y; // chain follow
      const e = 1 - i / trail.length;
      ctx.fillStyle = `rgba(255,${92 + i * 14},28,${0.25 + e * 0.6})`;
      ctx.strokeStyle = "rgba(242,237,230,0.15)";
      const s = 12 + e * 20;
      ctx.fillRect(c.x - s / 2, c.y - s / 2, s, s * 0.66);
      ctx.strokeRect(c.x - s / 2, c.y - s / 2, s, s * 0.66);
    }
  }} />;
}

export function CvInertia(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const st = stateOf<{ x: number; v: number }>(ctx, "in", () => ({ x: 0, v: 0 }));
    // virtual scroll impulse
    const target = Math.sin(t * 0.9) * 60;
    st.v = st.v * 0.94 + (target - st.x) * 0.05;
    st.x += st.v;
    ctx.save();
    ctx.translate(0, -st.x * 0.6);
    for (let i = -2; i < 14; i++) {
      const y = (i * 46 + st.x) % (h + 92);
      ctx.fillStyle = i % 3 ? "rgba(242,237,230,0.12)" : "rgba(255,92,28,0.5)";
      ctx.fillRect(14, y + 40, w - 28 - (i % 4) * 30, 26);
    }
    ctx.restore();
    // velocity gauge
    ctx.fillStyle = FLARE;
    const velH = clamp(Math.abs(st.v) * 12, 1, h - 20);
    ctx.fillRect(w - 8, h / 2 - velH / 2, 3, velH);
  }} />;
}

export function CvDisplace2D(p: PreviewProps) {
  const amp = clamp(numP(p.params, "amplitude", numP(p.params, "strength", 8)), 0, 24);
  return <Cv props={p} deps={[amp]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const off = stateOf<HTMLCanvasElement>(ctx, "dp", () => {
      const c = document.createElement("canvas");
      c.width = 320; c.height = 200;
      const o = c.getContext("2d")!;
      o.fillStyle = "#0c0c0f"; o.fillRect(0, 0, 320, 200);
      o.fillStyle = IVORY; o.font = "900 42px 'Space Grotesk Variable',sans-serif"; o.textAlign = "center";
      o.fillText("DISPLACE", 160, 100);
      o.fillStyle = EMBER; o.fillText("FIELD", 160, 148);
      return c;
    });
    const noise = makeNoise2D(12);
    const slice = 2;
    for (let y = 0; y < h; y += slice) {
      const ox = noise(0.04 * y, t * 0.7) * amp;
      ctx.drawImage(off, 0, (y / h) * 200, 320, (slice / h) * 200, ox, y, w, slice + 1);
    }
  }} />;
}

/* ============================ math curves ============================ */

export function CvLissajous(p: PreviewProps) {
  const a = clamp(numP(p.params, "freqX", numP(p.params, "a", 3)), 1, 9);
  const b = clamp(numP(p.params, "freqY", numP(p.params, "b", 4)), 1, 9);
  return <Cv props={p} deps={[a, b]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.2; ctx.beginPath();
    const ph = t * 0.5;
    for (let i = 0; i <= 500; i++) {
      const tt = (i / 500) * Math.PI * 2;
      const x = w / 2 + Math.sin(a * tt + ph) * (w / 2 - 10);
      const y = h / 2 + Math.sin(b * tt) * (h / 2 - 10);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.stroke();
    const pen = (t * 2) % (Math.PI * 2);
    ctx.fillStyle = FLARE;
    ctx.beginPath(); ctx.arc(w / 2 + Math.sin(a * pen + ph) * (w / 2 - 10), h / 2 + Math.sin(b * pen) * (h / 2 - 10), 3, 0, 7); ctx.fill();
  }} />;
}

export function CvFourier(p: PreviewProps) {
  const terms = clamp(numP(p.params, "terms", 5), 1, 14);
  return <Cv props={p} deps={[terms]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    let x = w * 0.26, y = h / 2;
    const theta = t * 1.3;
    for (let k = 0; k < terms; k++) {
      const n = 2 * k + 1;
      const r = (h * 0.32 * 4) / (Math.PI * n);
      const nx = x + r * Math.cos(n * theta), ny = y + r * Math.sin(n * theta);
      ctx.strokeStyle = "rgba(242,237,230,0.18)";
      ctx.beginPath(); ctx.arc(x, y, Math.abs(r), 0, 7); ctx.stroke();
      ctx.strokeStyle = "rgba(255,184,92,0.7)";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
      x = nx; y = ny;
    }
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(x, y);
    const sx = w * 0.26 + 70;
    for (let i = 0; i < w - sx - 6; i += 2) {
      const th = t * 1.3 - i / 55;
      let sy = 0;
      for (let k = 0; k < terms; k++) { const n = 2 * k + 1; sy += ((h * 0.32 * 4) / (Math.PI * n)) * Math.sin(n * th); }
      ctx.lineTo(sx + i, h / 2 + sy);
    }
    ctx.stroke();
  }} />;
}

export function CvBezier(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const p0 = [14, h - 18], p3 = [w - 14, h - 18];
    const p1 = [w * 0.3, h - 18 - (Math.sin(t * 0.9) * 0.5 + 0.5) * (h - 30)];
    const p2 = [w * 0.7, h - 18 - (Math.cos(t * 0.7) * 0.5 + 0.5) * (h - 30)];
    ctx.strokeStyle = "rgba(242,237,230,0.15)";
    for (const [a, b] of [[p0, p1], [p2, p3]] as const) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.6; ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    ctx.stroke();
    for (const pt of [p1, p2]) { ctx.fillStyle = FLARE; ctx.beginPath(); ctx.arc(pt[0], pt[1], 3, 0, 7); ctx.fill(); }
  }} />;
}

export function CvSpline(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(2);
    const pts: [number, number][] = Array.from({ length: 7 }, (_, i) => [
      16 + (i / 6) * (w - 32),
      h / 2 + Math.sin(t * 0.8 + i * 1.1) * (h / 2 - 16) * (0.4 + rnd() * 0.6),
    ]);
    // Catmull-Rom
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      if (i === 0) ctx.moveTo(p1[0], p1[1]);
      ctx.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    ctx.stroke();
    ctx.fillStyle = IVORY;
    for (const pt of pts) { ctx.beginPath(); ctx.arc(pt[0], pt[1], 2, 0, 7); ctx.fill(); }
  }} />;
}

export function CvPolarRose(p: PreviewProps) {
  const n = clamp(numP(p.params, "n", numP(p.params, "petals", 5)), 1, 9);
  const d = clamp(numP(p.params, "d", 3), 1, 9);
  return <Cv props={p} deps={[n, d]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10;
    const k = n / d, N = 300 * d;
    ctx.strokeStyle = "rgba(255,92,28,0.75)"; ctx.lineWidth = 1.1; ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2 * d;
      const r = Math.cos(k * th + t * 0.2) * R;
      const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }} />;
}

export function CvSpirals(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = "rgba(255,184,92,0.8)"; ctx.lineWidth = 1; ctx.beginPath();
    const b = 0.30635; // golden-spiral constant r = a·e^(bθ)
    for (let i = 0; i < 620; i++) {
      const th = i * 0.02 + t * 0.15;
      const r = Math.min(w, h) * 0.005 * Math.exp(b * th);
      if (r > Math.min(w, h) / 2 - 6) break;
      const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }} />;
}

export function CvTorusKnot2D(p: PreviewProps) {
  const pp = clamp(numP(p.params, "p", 2), 2, 5);
  const q = clamp(numP(p.params, "q", 3), 2, 7);
  return <Cv props={p} deps={[pp, q]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const rot = t * 0.4;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    const N = 700;
    for (let i = 0; i <= N; i++) {
      const u = (i / N) * Math.PI * 2;
      // torus knot parametric, orthographic w/ x/z rot
      const r = 2 + Math.cos(q * u);
      let x = r * Math.cos(pp * u), y = r * Math.sin(pp * u), z = Math.sin(q * u);
      const xr = x * Math.cos(rot) - z * Math.sin(rot);
      const zr = x * Math.sin(rot) + z * Math.cos(rot);
      const s = Math.min(w, h) / 9;
      const px = cx + xr * s, py = cy + y * s * 0.72 + zr * 2;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      ctx.strokeStyle = `hsl(${18 + zr * 14} 88% ${48 + zr * 10}%)`;
      if (i % 90 === 0 && i > 0) { ctx.stroke(); ctx.beginPath(); ctx.moveTo(px, py); }
    }
    ctx.stroke();
  }} />;
}

export function CvMobius2D(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rot = t * 0.3;
    for (let s = 0; s < 24; s++) {
      const v = (s / 23 - 0.5) * 1.4;
      ctx.strokeStyle = `rgba(255,${92 + s * 3},28,0.55)`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const u = (i / 160) * Math.PI * 2;
        // Möbius band parametric
        let x = (1.6 + v / 2 * Math.cos(u / 2)) * Math.cos(u);
        let y = (1.6 + v / 2 * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        const xr = x * Math.cos(rot) - z * Math.sin(rot);
        const sc = Math.min(w, h) / 4.4;
        const px = w / 2 + xr * sc, py = h / 2 + y * sc * 0.7 + z * 14;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }} />;
}

/* ============================ computational geometry ============================ */

export function CvVoronoi(p: PreviewProps) {
  const count = clamp(numP(p.params, "count", numP(p.params, "seeds", 30)), 6, 80);
  return <Cv props={p} deps={[count]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const gw = 60, gh = 38;
    const rnd = mulberry32(count * 7919);
    const seeds: number[] = [];
    for (let i = 0; i < count; i++) {
      seeds.push(rnd() * gw + Math.sin(t * 0.8 + i) * 1.4);
      seeds.push(rnd() * gh + Math.cos(t * 0.9 + i * 1.7) * 1.4);
    }
    const cw = w / gw, ch = h / gh;
    const owner = new Int16Array(gw * gh);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      let best = 0, bd = Infinity;
      for (let i = 0; i < count; i++) {
        const dx = x - seeds[i * 2], dy = y - seeds[i * 2 + 1], d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      owner[y * gw + x] = best;
    }
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      if ((x + 1 < gw && owner[y * gw + x + 1] !== owner[y * gw + x]) || (y + 1 < gh && owner[(y + 1) * gw + x] !== owner[y * gw + x])) {
        ctx.fillStyle = "rgba(255,92,28,0.8)";
        ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
      }
    }
  }} />;
}

export function CvDelaunay(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(21);
    const N = 16;
    const pts: [number, number][] = Array.from({ length: N }, (_, i) => [
      14 + ((rnd() + 0.08) * (w - 28)) + Math.sin(t * 0.6 + i) * 5,
      14 + ((rnd() + 0.08) * (h - 28)) + Math.cos(t * 0.7 + i * 2) * 5,
    ]);
    // heuristic triangle soup: connect triples with empty smallest circumcircle test
    ctx.strokeStyle = "rgba(255,150,80,0.5)"; ctx.lineWidth = 0.7;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const [ax, ay] = pts[i]; const [bx, by] = pts[j];
      const d = Math.hypot(ax - bx, ay - by);
      const thresh = Math.min(w, h) * 0.5;
      if (d < thresh) {
        ctx.strokeStyle = `rgba(255,140,70,${0.6 - d / thresh * 0.5})`;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      }
    }
    ctx.fillStyle = IVORY;
    for (const [x, y] of pts) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill(); }
  }} />;
}

export function CvTessellation(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const s = 22, r = s / 2;
    const rot = (Math.sin(t * 0.5) + 1) / 2 * Math.PI / 6;
    for (let row = -1; row * s * 0.866 < h + s; row++) {
      for (let col = -1; col * s * 1.5 < w + s; col++) {
        const cx = col * s * 1.5, cy = row * s * 0.866 + (col % 2 ? s * 0.433 : 0);
        ctx.strokeStyle = `rgba(255,92,28,${0.14 + ((row + col) % 3) * 0.12})`;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = rot + (k / 6) * Math.PI * 2;
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  }} />;
}

export function CvSubdivision(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const maxD = 4;
    const j = () => (Math.random() - 0.5) * 3;
    const drawTri = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, d: number) => {
      if (d === 0 || Math.hypot(bx - ax, by - ay) < 14) {
        ctx.strokeStyle = "rgba(255,140,70,0.55)";
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.closePath(); ctx.stroke();
        return;
      }
      const mx1 = (ax + bx) / 2 + j(), my1 = (ay + by) / 2 + j();
      const mx2 = (bx + cx) / 2 + j(), my2 = (by + cy) / 2 + j();
      const mx3 = (cx + ax) / 2 + j(), my3 = (cy + ay) / 2 + j();
      drawTri(ax, ay, mx1, my1, mx3, my3, d - 1);
      drawTri(mx1, my1, bx, by, mx2, my2, d - 1);
      drawTri(mx3, my3, mx2, my2, cx, cy, d - 1);
      drawTri(mx1, my1, mx2, my2, mx3, my3, d - 1);
    };
    const ph = t * 0.4;
    drawTri(w * 0.5, 10 + Math.sin(ph) * 2, w - 12, h - 10, 12, h - 14, maxD);
  }} />;
}

export function CvHull(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(15);
    const pts: [number, number][] = Array.from({ length: 18 }, (_, i) => [
      16 + rnd() * (w - 32) + Math.sin(t * 0.5 + i) * 6,
      16 + rnd() * (h - 32) + Math.cos(t * 0.6 + i * 2) * 6,
    ]);
    // Andrew monotone chain
    const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower: number[][] = [];
    for (const pt of sorted) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop(); lower.push(pt); }
    const upper: number[][] = [];
    for (const pt of [...sorted].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop(); upper.push(pt); }
    const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.4; ctx.beginPath();
    hull.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = "rgba(255,92,28,0.06)"; ctx.fill();
    ctx.fillStyle = IVORY;
    for (const [x, y] of pts) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill(); }
  }} />;
}

/* ============================ fractals ============================ */

function escapeTime(zr: number, zi: number, cr: number, ci: number, iters: number): number {
  let x = zr, y = zi;
  for (let i = 0; i < iters; i++) {
    const xs = x * x - y * y;
    y = 2 * x * y + ci;
    x = xs + cr;
    if (x * x + y * y > 4) return i + 1 - Math.log2(Math.log2(x * x + y * y) / 2 + 1e-9);
  }
  return iters;
}

export function CvJulia(p: PreviewProps) {
  const iters = clamp(numP(p.params, "iterations", 70), 24, 180);
  const cre = numP(p.params, "cre", -0.7);
  const cim = numP(p.params, "cim", 0.27);
  return <Cv props={p} deps={[iters, cre, cim]} draw={(ctx, w, h, t) => {
    const img = ctx.createImageData(160, 100);
    const cx = (cre as number) + Math.sin(t * 0.3) * 0.03;
    const cy = (cim as number) + Math.cos(t * 0.24) * 0.03;
    for (let y = 0; y < 100; y++) for (let x = 0; x < 160; x++) {
      const zx = (x / 160 - 0.5) * 2.6, zy = (y / 100 - 0.5) * 1.6;
      const n = escapeTime(zx, zy, cx, cy, iters);
      const i = (y * 160 + x) * 4;
      if (n >= iters) { img.data[i + 3] = 255; continue; }
      const v = Math.sqrt(Math.max(0, n / (iters / 3)));
      img.data[i] = 255 * v; img.data[i + 1] = 92 * v + 40; img.data[i + 2] = 28 * v + 30 * (1 - v); img.data[i + 3] = 255;
    }
    const off = document.createElement("canvas");
    off.width = 160; off.height = 100;
    off.getContext("2d")!.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, w, h);
  }} />;
}

export function CvMandelbrot(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    const img = ctx.createImageData(160, 100);
    for (let y = 0; y < 100; y++) for (let x = 0; x < 160; x++) {
      const cr = (x / 160) * 3.2 - 2.4, ci = (y / 100) * 2 - 1;
      const n = escapeTime(0, 0, cr, ci, 60);
      const i = (y * 160 + x) * 4;
      if (n >= 60) { img.data[i + 3] = 255; continue; }
      const v = Math.sqrt(n / 40);
      img.data[i] = 255 * v; img.data[i + 1] = 120 * v; img.data[i + 2] = 60 + 60 * (1 - v); img.data[i + 3] = 255;
    }
    const off = document.createElement("canvas");
    off.width = 160; off.height = 100;
    off.getContext("2d")!.putImageData(img, 0, 0);
    ctx.drawImage(off, 0, 0, w, h);
  }} />;
}

export function CvSierpinski(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 8;
    const verts: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
      verts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    const rnd = mulberry32(1234);
    let px = cx, py = cy;
    ctx.fillStyle = "rgba(255,92,28,0.7)";
    const spin = t * 0.1, cos = Math.cos(spin), sin = Math.sin(spin);
    for (let i = 0; i < 9000; i++) {
      const v = verts[Math.floor(rnd() * 3)];
      px += (v[0] - px) * 0.5; py += (v[1] - py) * 0.5;
      const dx = px - cx, dy = py - cy;
      ctx.fillRect(cx + dx * cos - dy * sin, cy + dx * sin + dy * cos, 1, 1);
    }
  }} />;
}

export function CvKoch(p: PreviewProps) {
  const depth = clamp(numP(p.params, "iterations", 4), 1, 5);
  return <Cv props={p} deps={[depth]} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = FLARE; ctx.lineWidth = 1;
    ctx.beginPath();
    const seg = (a: [number, number], b: [number, number], d: number) => {
      if (d === 0) { ctx.lineTo(b[0], b[1]); return; }
      const dx = (b[0] - a[0]) / 3, dy = (b[1] - a[1]) / 3;
      const p1: [number, number] = [a[0] + dx, a[1] + dy];
      const p3: [number, number] = [a[0] + 2 * dx, a[1] + 2 * dy];
      const ang = Math.PI / 3;
      const p2: [number, number] = [
        p1[0] + Math.cos(ang) * dx - Math.sin(ang) * dy,
        p1[1] + Math.sin(ang) * dx + Math.cos(ang) * dy,
      ];
      seg(a, p1, d - 1); seg(p1, p2, d - 1); seg(p2, p3, d - 1); seg(p3, b, d - 1);
    };
    const cx = w / 2, cy = h / 2 + h * 0.16, r = Math.min(w, h) * 0.36;
    const A: [number, number] = [cx - r, cy], B: [number, number] = [cx + r, cy], C: [number, number] = [cx, cy - r * Math.sqrt(3)];
    ctx.moveTo(A[0], A[1]);
    seg(A, B, depth); seg(B, C, depth); seg(C, A, depth);
    ctx.stroke();
  }} />;
}

export function CvLSystem(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    // X → F+[[X]-X]-F[-FX]+X, F → FF  (classic)
    let axiom = "X";
    const gens = clamp(numP(p.params, "iterations", 4), 2, 5);
    for (let g = 0; g < gens; g++) {
      axiom = axiom.replace(/X/g, "F+[[X]-X]-F[-FX]+X").replace(/F/g, "FF");
    }
    const angle = ((20 + Math.sin(t * 0.4) * 4) * Math.PI) / 180;
    let x = w / 2, y = h - 6, dir = -Math.PI / 2;
    const stack: [number, number, number][] = [];
    ctx.strokeStyle = "rgba(255,140,70,0.7)"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x, y);
    const step = h / (Math.pow(2, gens) * 1.1);
    for (const c of axiom) {
      if (c === "F") { x += Math.cos(dir) * step; y += Math.sin(dir) * step; ctx.lineTo(x, y); }
      else if (c === "+") dir += angle;
      else if (c === "-") dir -= angle;
      else if (c === "[") stack.push([x, y, dir]);
      else if (c === "]") { const s = stack.pop()!; x = s[0]; y = s[1]; dir = s[2]; ctx.moveTo(x, y); }
    }
    ctx.stroke();
  }} />;
}

export function CvFractalTree(p: PreviewProps) {
  const depth = clamp(numP(p.params, "depth", 9), 4, 11);
  const angle = clamp(numP(p.params, "angle", 24), 8, 48);
  return <Cv props={p} deps={[depth, angle]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const noise = makeNoise2D(7);
    const wind = noise(t * 0.4, 0) * 0.3;
    const spread = (angle * Math.PI) / 180;
    const draw = (x: number, y: number, th: number, len: number, d: number) => {
      if (d <= 0 || len < 2) return;
      const nx = x + Math.cos(th) * len, ny = y + Math.sin(th) * len;
      ctx.strokeStyle = `hsl(${20 + d * 3} 85% ${Math.min(70, 42 + d * 4)}%)`;
      ctx.lineWidth = Math.max(0.5, d * 0.5);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
      const sway = wind * (1 + (depth - d) * 0.22);
      draw(nx, ny, th - spread + sway, len * 0.72, d - 1);
      draw(nx, ny, th + spread + sway, len * 0.72, d - 1);
    };
    draw(w / 2, h - 6, -Math.PI / 2, h * 0.24, depth);
  }} />;
}

export function CvIFS(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    // Barnsley fern affine maps
    const maps: [number, number, number, number, number, number, number][] = [
      [0, 0, 0, 0.16, 0, 0, 0.01],
      [0.85, 0.04, -0.04, 0.85, 0, 1.6, 0.85],
      [0.2, -0.26, 0.23, 0.22, 0, 1.6, 0.07],
      [-0.15, 0.28, 0.26, 0.24, 0, 0.44, 0.07],
    ];
    const rnd = mulberry32(8);
    let x = 0, y = 0;
    ctx.fillStyle = "rgba(120,220,140,0.6)";
    for (let i = 0; i < 9000; i++) {
      const r = rnd();
      let acc = 0, m = maps[0];
      for (const mm of maps) { acc += mm[6]; if (r <= acc) { m = mm; break; } }
      const nx = m[0] * x + m[1] * y + m[4];
      const ny = m[2] * x + m[3] * y + m[5];
      x = nx; y = ny;
      const px = w / 2 + x * (w / 6), py = h - 4 - y * (h / 11);
      ctx.fillRect(px, py, 1, 1);
    }
  }} />;
}

/* ============================ dynamical ============================ */

export function CvLorenz(p: PreviewProps) {
  const rho = clamp(numP(p.params, "rho", 28), 10, 50);
  return <Cv props={p} deps={[rho]} draw={(ctx, w, h) => {
    ctx.fillStyle = "rgba(7,7,8,0.18)"; ctx.fillRect(0, 0, w, h);
    const s = stateOf<{ x: number; y: number; z: number }>(ctx, `lz`, () => ({ x: 0.4, y: 0.3, z: 26 }));
    const sigma = 10, beta = 8 / 3, hs = 0.01;
    const f = (x: number, y: number, z: number): [number, number, number] => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
    for (let k = 0; k < 5; k++) {
      const [k1x, k1y, k1z] = f(s.x, s.y, s.z);
      const [k2x, k2y, k2z] = f(s.x + k1x * hs / 2, s.y + k1y * hs / 2, s.z + k1z * hs / 2);
      const [k3x, k3y, k3z] = f(s.x + k2x * hs / 2, s.y + k2y * hs / 2, s.z + k2z * hs / 2);
      const [k4x, k4y, k4z] = f(s.x + k3x * hs, s.y + k3y * hs, s.z + k3z * hs);
      s.x += (hs / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      s.y += (hs / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
      s.z += (hs / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);
      ctx.fillStyle = `hsl(${18 + s.z} 90% 60%)`;
      ctx.fillRect(w / 2 + s.x * (w / 52), h - 8 - s.z * (h / 55), 1.5, 1.5);
    }
  }} />;
}

export function CvRossler(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = "rgba(7,7,8,0.16)"; ctx.fillRect(0, 0, w, h);
    const s = stateOf(ctx, "rs", () => ({ x: 0.1, y: 0, z: 0 }));
    const a = 0.2, b = 0.2, c = 5.7, dt = 0.02;
    for (let k = 0; k < 6; k++) {
      const dx = -s.y - s.z, dy = s.x + a * s.y, dz = b + s.z * (s.x - c);
      s.x += dx * dt; s.y += dy * dt; s.z += dz * dt;
      ctx.fillStyle = "rgba(255,140,80,0.8)";
      ctx.fillRect(w / 2 + s.x * (w / 22), h / 2 + s.y * (h / 22), 1.4, 1.4);
    }
  }} />;
}

export function CvPendulum(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = "rgba(7,7,8,0.1)"; ctx.fillRect(0, 0, w, h);
    const s = stateOf(ctx, "pend", () => ({ a1: Math.PI * 0.9, a2: Math.PI * 0.8, v1: 0, v2: 0 }));
    const g = 9.8, l1 = Math.min(w, h) * 0.22, l2 = Math.min(w, h) * 0.2, m1 = 1, m2 = 1;
    const { a1, a2, v1, v2 } = s;
    const num1 = -g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(a1 - a2) * m2 * (v2 * v2 * l2 + v1 * v1 * l1 * Math.cos(a1 - a2));
    const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const num2 = 2 * Math.sin(a1 - a2) * (v1 * v1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + v2 * v2 * l2 * m2 * Math.cos(a1 - a2));
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    s.v1 += (num1 / den1) * 0.16; s.v2 += (num2 / den2) * 0.16;
    s.a1 += s.v1 * 0.16; s.a2 += s.v2 * 0.16;
    const x1 = w / 2 + l1 * Math.sin(s.a1), y1 = 8 + l1 * Math.cos(s.a1);
    const x2 = x1 + l2 * Math.sin(s.a2), y2 = y1 + l2 * Math.cos(s.a2);
    ctx.strokeStyle = "rgba(242,237,230,0.4)";
    ctx.beginPath(); ctx.moveTo(w / 2, 8); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.fillStyle = FLARE; ctx.beginPath(); ctx.arc(x1, y1, 3.4, 0, 7); ctx.fill();
    ctx.fillStyle = EMBER; ctx.beginPath(); ctx.arc(x2, y2, 4, 0, 7); ctx.fill();
  }} />;
}

export function CvNBody(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = "rgba(7,7,8,0.22)"; ctx.fillRect(0, 0, w, h);
    type B = { x: number; y: number; vx: number; vy: number };
    const bodies = stateOf<B[]>(ctx, "nb", () => {
      const rnd = mulberry32(19);
      return Array.from({ length: 5 }, () => {
        const a = rnd() * Math.PI * 2, r = Math.min(w, h) * (0.16 + rnd() * 0.18);
        const v = Math.sqrt(900 / r) * 0.16;
        return { x: w / 2 + r * Math.cos(a), y: h / 2 + r * Math.sin(a), vx: -Math.sin(a) * v, vy: Math.cos(a) * v };
      });
    });
    for (const b of bodies) {
      for (const o of bodies) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy + 40;
        b.vx += (dx / Math.pow(d2, 1.5)) * 260 * 0.016;
        b.vy += (dy / Math.pow(d2, 1.5)) * 260 * 0.016;
      }
    }
    for (const b of bodies) {
      b.x += b.vx; b.y += b.vy;
      ctx.fillStyle = FLARE;
      ctx.beginPath(); ctx.arc(b.x, b.y, 2.4, 0, 7); ctx.fill();
    }
    ctx.fillStyle = EMBER;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 4, 0, 7); ctx.fill();
  }} />;
}

export function CvBoids(p: PreviewProps) {
  const count = clamp(numP(p.params, "count", 60), 16, 140);
  return <Cv props={p} deps={[count]} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    type B = { x: number; y: number; vx: number; vy: number };
    const boids = stateOf<B[]>(ctx, `bd${count}`, () => {
      const rnd = mulberry32(count);
      return Array.from({ length: count }, () => ({ x: rnd() * w, y: rnd() * h, vx: rnd() * 2 - 1, vy: rnd() * 2 - 1 }));
    });
    for (const b of boids) {
      let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0;
      for (const o of boids) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 2400 && d2 > 0.01) {
          n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y;
          if (d2 < 320) { sx -= dx / d2; sy -= dy / d2; }
        }
      }
      if (n) {
        b.vx += (ax / n - b.vx) * 0.04 + (cx / n - b.x) * 0.002 + sx * 6;
        b.vy += (ay / n - b.vy) * 0.04 + (cy / n - b.y) * 0.002 + sy * 6;
      }
      const sp = Math.hypot(b.vx, b.vy) || 1;
      if (sp > 2) { b.vx = b.vx / sp * 2; b.vy = b.vy / sp * 2; }
      if (sp < 0.9) { b.vx = b.vx / sp * 0.9; b.vy = b.vy / sp * 0.9; }
      b.x += b.vx; b.y += b.vy;
      if (b.x < -6) b.x = w + 6; if (b.x > w + 6) b.x = -6;
      if (b.y < -6) b.y = h + 6; if (b.y > h + 6) b.y = -6;
      const ang = Math.atan2(b.vy, b.vx);
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(ang);
      ctx.fillStyle = EMBER;
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-3.4, 2.6); ctx.lineTo(-1.6, 0); ctx.lineTo(-3.4, -2.6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }} />;
}

export function CvCells(p: PreviewProps) {
  const tick = clamp(numP(p.params, "tick", 320), 60, 900);
  void tick;
  return <Cv props={p} draw={(ctx, w, h) => {
    const gw = 44, gh = 28;
    const st = stateOf<{ g: Uint8Array; n: number }>(ctx, "ca", () => {
      const rnd = mulberry32(17);
      const g = new Uint8Array(gw * gh);
      for (let i = 0; i < g.length; i++) g[i] = rnd() > 0.72 ? 1 : 0;
      return { g, n: 0 };
    });
    st.n++;
    if (st.n % 14 === 0) { // ~287ms per gen at 50fps — close to a 320ms tick
      const next = new Uint8Array(st.g.length);
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          c += st.g[((y + dy + gh) % gh) * gw + ((x + dx + gw) % gw)];
        }
        const alive = st.g[y * gw + x];
        next[y * gw + x] = alive ? (c === 2 || c === 3 ? 1 : 0) : (c === 3 ? 1 : 0);
      }
      st.g = next;
    }
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cw = w / gw, ch = h / gh;
    ctx.fillStyle = "rgba(255,92,28,0.75)";
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      if (st.g[y * gw + x]) ctx.fillRect(x * cw + 0.5, y * ch + 0.5, cw - 1, ch - 1);
    }
  }} />;
}

export function CvLogistic(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,140,70,0.8)";
    const sweep = 2.9 + ((t * 0.07) % 1.1);
    for (let px = 0; px < w; px += 2) {
      const r = 2.8 + (px / w) * 1.2;
      let x = 0.5;
      for (let i = 0; i < 90; i++) x = r * x * (1 - x);
      ctx.beginPath();
      for (let i = 0; i < 50; i++) {
        x = r * x * (1 - x);
        ctx.rect(px, h - x * h - 0, 1, 1);
      }
      ctx.fill();
    }
    // moving r cursor
    const cxs = ((sweep - 2.8) / 1.2) * w;
    ctx.strokeStyle = FLARE; ctx.beginPath(); ctx.moveTo(cxs, 0); ctx.lineTo(cxs, h); ctx.stroke();
  }} />;
}

/* ============================ procedural fields ============================ */

function fieldFill(kind: "noise" | "fbm" | "warp", p: PreviewProps, oct = 4) {
  const octaves = clamp(numP(p.params, "octaves", oct), 1, 7);
  return <Cv props={p} deps={[octaves, kind]} draw={(ctx, w, h, t) => {
    const noise = makeNoise2D(31);
    const gw = 74, gh = 46, cw = w / gw, ch = h / gh;
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const px = x * 0.07 + t * 0.05, py = y * 0.07;
      let v: number;
      if (kind === "noise") v = noise(px, py);
      else if (kind === "fbm") v = fbm(noise, px, py, octaves);
      else v = fbm(noise, px + fbm(noise, px + fbm(noise, px, py, octaves) * 1.5, py, octaves) * 1.5, py, octaves);
      const vv = clamp(v * 0.5 + 0.5, 0, 1);
      ctx.fillStyle = `hsl(${16 + vv * 12} 88% ${8 + vv * 50}%)`;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }} />;
}

export function CvNoise(p: PreviewProps) { return fieldFill("noise", p, 1); }
export function CvFBM(p: PreviewProps) { return fieldFill("fbm", p); }
export function CvWarp(p: PreviewProps) { return fieldFill("warp", p); }

export function CvCurl(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = "rgba(7,7,8,0.1)"; ctx.fillRect(0, 0, w, h);
    const st = stateOf<{ x: number; y: number; life: number }[]>(ctx, "cn", () => {
      const rnd = mulberry32(23);
      return Array.from({ length: 160 }, () => ({ x: rnd() * w, y: rnd() * h, life: 0 }));
    });
    const noise = makeNoise2D(27);
    // divergence-free velocity from noise gradient rotation
    ctx.strokeStyle = "rgba(255,120,50,0.4)"; ctx.lineWidth = 0.7;
    const e = 0.35;
    for (const pt of st) {
      const xw = pt.x * 0.006, yw = pt.y * 0.006 + t * 0.12;
      const dvdy = noise(xw, yw + e) - noise(xw, yw - e);
      const dvdx = noise(xw + e, yw) - noise(xw - e, yw);
      ctx.beginPath(); ctx.moveTo(pt.x, pt.y);
      pt.x += dvdy * 6; pt.y += -dvdx * 6;
      ctx.lineTo(pt.x, pt.y); ctx.stroke();
      if (++pt.life > 220 || pt.x < 0 || pt.y < 0 || pt.x > w || pt.y > h) { pt.x = Math.random() * w; pt.y = Math.random() * h; pt.life = 0; }
    }
  }} />;
}

export function CvTerrain(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const noise = makeNoise2D(11);
    const rows = 18, cols = 26;
    const horizon = h * 0.32;
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, "#0b0b10"); g.addColorStop(1, "#171017");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, horizon);
    for (let r = 0; r < rows; r++) {
      const zt = (r + ((t * 2.4) % 1)) / rows;
      const y = horizon + (h - horizon) * Math.pow(zt, 1.6);
      const depth = (r + ((t * 2.4) % 1)) * 1.4;
      ctx.strokeStyle = "rgba(255,92,28,0.75)";
      ctx.lineWidth = 0.5 + zt;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * w;
        const elev = fbm(noise, c * 0.4, depth * 0.4, 4);
        const amp = 34 * Math.pow(zt, 1.2) + 3;
        const yy = y - elev * amp;
        c === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }} />;
}

export function CvReactionDiffusion(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    type RD = { u: Float32Array; v: Float32Array };
    const gw = 72, gh = 45;
    const st = stateOf<RD>(ctx, "rd", () => {
      const u = new Float32Array(gw * gh).fill(1);
      const v = new Float32Array(gw * gh);
      const rnd = mulberry32(3);
      for (let s = 0; s < 4; s++) {
        const cx = 8 + Math.floor(rnd() * (gw - 16)), cy = 6 + Math.floor(rnd() * (gh - 12));
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++)
          if (x * x + y * y < 9) v[(cy + y) * gw + cx + x] = 1;
      }
      return { u, v };
    });
    const { u, v } = st;
    const u2 = new Float32Array(u.length), v2 = new Float32Array(v.length);
    const feed = 0.055, kill = 0.062;
    for (let step = 0; step < 4; step++) {
      for (let y = 1; y < gh - 1; y++) for (let x = 1; x < gw - 1; x++) {
        const i = y * gw + x;
        const lapU = u[i - 1] + u[i + 1] + u[i - gw] + u[i + gw] - 4 * u[i];
        const lapV = v[i - 1] + v[i + 1] + v[i - gw] + v[i + gw] - 4 * v[i];
        const reac = u[i] * v[i] * v[i];
        u2[i] = u[i] + (lapU - reac + feed * (1 - u[i]));
        v2[i] = v[i] + (0.5 * lapV + reac - (feed + kill) * v[i]);
      }
      u.set(u2); v.set(v2);
    }
    const cw = w / gw, ch = h / gh;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const vv = v[y * gw + x];
      if (vv > 0.18) {
        ctx.fillStyle = `hsl(${20 - vv * 10} 90% ${30 + vv * 110}%)`;
        ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
      }
    }
  }} />;
}

export function CvSDF(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    // SDF field: circle + rounded box, marching-squares isolines at iso 0
    const gw = 66, gh = 42;
    const cw = w / gw, ch = h / gh;
    const field = new Float32Array((gw + 1) * (gh + 1));
    const bx = w * 0.68 + Math.sin(t * 0.7) * w * 0.12, by = h * 0.5;
    const cx = w * 0.32 + Math.cos(t * 0.5) * w * 0.1, cy = h * 0.5;
    for (let y = 0; y <= gh; y++) for (let x = 0; x <= gw; x++) {
      const px = x * cw, py = y * ch;
      const dCircle = Math.hypot(px - cx, py - cy) - Math.min(w, h) * 0.2;
      const qx = Math.abs(px - bx) - w * 0.12, qy = Math.abs(py - by) - h * 0.12;
      const dBox = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
      field[y * (gw + 1) + x] = Math.min(dCircle, dBox);
    }
    ctx.strokeStyle = EMBER; ctx.lineWidth = 1.1;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const a = field[y * (gw + 1) + x], b = field[y * (gw + 1) + x + 1];
      const c = field[(y + 1) * (gw + 1) + x + 1], d = field[(y + 1) * (gw + 1) + x];
      let idx = 0;
      if (a > 0) idx |= 8; if (b > 0) idx |= 4; if (c > 0) idx |= 2; if (d > 0) idx |= 1;
      if (idx === 0 || idx === 15) continue;
      const ix = (p1: number, p2: number) => -p1 / (p2 - p1);
      const top: [number, number] = [(x + ix(a, b)) * cw, y * ch];
      const right: [number, number] = [(x + 1) * cw, (y + ix(b, c)) * ch];
      const bottom: [number, number] = [(x + ix(d, c)) * cw, (y + 1) * ch];
      const left: [number, number] = [x * cw, (y + ix(a, d)) * ch];
      const seg = (p1: [number, number], p2: [number, number]) => { ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); };
      if (idx === 1 || idx === 14) seg(left, bottom);
      else if (idx === 2 || idx === 13) seg(bottom, right);
      else if (idx === 3 || idx === 12) seg(left, right);
      else if (idx === 4 || idx === 11) seg(top, right);
      else if (idx === 5) { seg(left, top); seg(bottom, right); }
      else if (idx === 6 || idx === 9) seg(top, bottom);
      else if (idx === 7 || idx === 8) seg(left, top);
      else if (idx === 10) { seg(left, bottom); seg(top, right); }
    }
  }} />;
}

export function CvMetaballs(p: PreviewProps) {
  const balls = clamp(numP(p.params, "count", numP(p.params, "balls", 6)), 3, 12);
  return <Cv props={p} deps={[balls]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const gw = 56, gh = 36;
    const bx: number[] = [], by: number[] = [];
    for (let i = 0; i < balls; i++) {
      bx.push(w / 2 + Math.sin(t * 0.8 + i * 2.1) * w * 0.3);
      by.push(h / 2 + Math.cos(t * 0.95 + i * 1.4) * h * 0.3);
    }
    const cw = w / gw, ch = h / gh;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      let s = 0;
      for (let i = 0; i < balls; i++) {
        const dx = bx[i] - x * cw, dy = by[i] - y * ch;
        s += 1600 / (dx * dx + dy * dy + 1);
      }
      if (s > 1) {
        const alpha = clamp((s - 1) * 0.9 + 0.3, 0, 1);
        ctx.fillStyle = `rgba(255,110,40,${alpha})`;
        ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
      }
    }
  }} />;
}

export function CvVectorField(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const noise = makeNoise2D(9);
    const cols = 14, rows = 9;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * (w / cols), y = (r + 0.5) * (h / rows);
      const a = noise(c * 0.3, r * 0.3 + t * 0.15) * Math.PI * 2;
      const len = 7 + Math.abs(noise(c, r)) * 5;
      ctx.strokeStyle = `rgba(255,${110 + Math.round(Math.abs(noise(c * 0.5, r)) * 60)},40,0.8)`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
      ctx.fillStyle = IVORY;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * len, y + Math.sin(a) * len, 1.3, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvHeatmap(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cols = 24, rows = 14;
    const noise = makeNoise2D(33);
    const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = clamp(fbm(noise, c * 0.5, r * 0.5 + t * 0.07, 3) * 0.5 + 0.5, 0, 1);
      ctx.fillStyle = `hsl(${26 - v * 14} ${60 + v * 35}% ${8 + v * 52}%)`;
      ctx.fillRect(c * cw + 1, r * ch + 1, cw - 2, ch - 2);
    }
  }} />;
}

export function CvPhyllotaxis(p: PreviewProps) {
  const n = clamp(numP(p.params, "points", numP(p.params, "n", 300)), 60, 600);
  const angle = numP(p.params, "angle", 137.508) || 137.508;
  return <Cv props={p} deps={[n, angle]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const c = Math.min(w, h) / (Math.sqrt(n) * 2.3);
    const wob = t * 0.15;
    for (let i = 0; i < n; i++) {
      const th = (i * (angle as number) * Math.PI) / 180 + wob;
      const r = c * Math.sqrt(i);
      const hue = 16 + (i / n) * 40;
      ctx.fillStyle = `hsl(${hue} 85% ${45 + (i / n) * 20}%)`;
      ctx.beginPath(); ctx.arc(cx + r * Math.cos(th), cy + r * Math.sin(th), 1 + 2 * Math.sqrt(i / n), 0, 7); ctx.fill();
    }
  }} />;
}

export function CvForceGraph(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    type N = { x: number; y: number; vx: number; vy: number };
    const data = stateOf<{ ns: N[]; es: [number, number][] }>(ctx, "fg", () => {
      const rnd = mulberry32(25);
      const ns: N[] = Array.from({ length: 16 }, () => ({ x: w / 2 + (rnd() - 0.5) * w * 0.6, y: h / 2 + (rnd() - 0.5) * h * 0.6, vx: 0, vy: 0 }));
      const es: [number, number][] = [];
      for (let i = 0; i < ns.length; i++) { es.push([i, (i + 1) % ns.length]); if (rnd() > 0.5) es.push([i, Math.floor(rnd() * ns.length)]); }
      return { ns, es };
    });
    const { ns, es } = data;
    for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) {
      const a = ns[i], b = ns[j];
      const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 0.01;
      const f = 900 / d2, inv = 1 / Math.sqrt(d2);
      a.vx += dx * inv * f * 0.02; a.vy += dy * inv * f * 0.02;
      b.vx -= dx * inv * f * 0.02; b.vy -= dy * inv * f * 0.02;
    }
    for (const [i, j] of es) {
      const a = ns[i], b = ns[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const f = (d - 30) * 0.012;
      a.vx += dx / d * f; a.vy += dy / d * f;
      b.vx -= dx / d * f; b.vy -= dy / d * f;
    }
    ctx.fillStyle = "rgba(7,7,8,0.35)"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(242,237,230,0.16)";
    for (const [i, j] of es) { ctx.beginPath(); ctx.moveTo(ns[i].x, ns[i].y); ctx.lineTo(ns[j].x, ns[j].y); ctx.stroke(); }
    for (const n of ns) {
      n.vx += (w / 2 - n.x) * 0.0018; n.vy += (h / 2 - n.y) * 0.0018;
      n.vx *= 0.85; n.vy *= 0.85;
      n.x += n.vx; n.y += n.vy;
      ctx.fillStyle = EMBER; ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, 7); ctx.fill();
    }
  }} />;
}

/* ============================ backgrounds ============================ */

export function CvMesh(p: PreviewProps) {
  const count = clamp(numP(p.params, "blobs", numP(p.params, "colors", 4)), 2, 7);
  return <Cv props={p} deps={[count]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = "#0c0a12"; ctx.fillRect(0, 0, w, h);
    const cols = ["#ff5c1c", "#ff2e4d", "#7c3aed", "#0ea5e9", "#ffb85c", "#10b981", "#f472b6"];
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < count; i++) {
      const x = w / 2 + Math.sin(t * 0.4 + i * 2.4) * w * 0.34;
      const y = h / 2 + Math.cos(t * 0.55 + i * 1.9) * h * 0.32;
      const r = Math.min(w, h) * 0.42;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, cols[i % cols.length] + "77"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }} />;
}

export function CvAurora(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (let band = 0; band < 3; band++) {
      ctx.beginPath();
      const yoff = h * (0.2 + band * 0.22);
      for (let x = 0; x <= w; x += 6) {
        const y = yoff + Math.sin(x * 0.02 + t * (0.6 + band * 0.25)) * (12 + band * 8) + Math.sin(x * 0.05 - t * 0.4) * 7;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${130 + band * 40}, 80%, 60%, 0.5)`;
      ctx.lineWidth = 12 - band * 3;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";
    }
    ctx.globalCompositeOperation = "source-over";
  }} />;
}

export function CvStarfield(p: PreviewProps) {
  const stars = clamp(numP(p.params, "stars", numP(p.params, "count", 240)), 60, 600);
  return <Cv props={p} deps={[stars]} draw={(ctx, w, h) => {
    ctx.fillStyle = "#050507"; ctx.fillRect(0, 0, w, h);
    const field = stateOf<{ x: number; y: number; z: number }[]>(ctx, `sf${stars}`, () => {
      const rnd = mulberry32(stars);
      return Array.from({ length: stars }, () => ({ x: rnd() * 2 - 1, y: rnd() * 2 - 1, z: rnd() }));
    });
    for (const s of field) {
      s.z -= 0.005;
      if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; }
      const sx = w / 2 + (s.x / s.z) * w * 0.5, sy = h / 2 + (s.y / s.z) * h * 0.5;
      if (sx < 0 || sy < 0 || sx > w || sy > h) continue;
      ctx.fillStyle = `rgba(242,${232 - s.z * 50},${225 - s.z * 90},${1.05 - s.z})`;
      ctx.beginPath(); ctx.arc(sx, sy, (1.1 - s.z) * 2, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvWave(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const cols = 30, rows = 16;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * w, yb = (r / (rows - 1)) * h;
      const e = Math.sin(x * 0.03 + t * 1.7) + Math.sin(yb * 0.04 - t * 1.2) + Math.sin(Math.hypot(x - w / 2, yb - h / 2) * 0.025 - t * 1.5);
      const lum = (e + 3) / 6;
      ctx.fillStyle = `hsl(${18 + lum * 10} 88% ${28 + lum * 36}%)`;
      ctx.beginPath(); ctx.arc(x, yb + e * 3, 0.9 + lum * 1.3, 0, 7); ctx.fill();
    }
  }} />;
}

export function CvPlasma(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    const gw = 62, gh = 40, cw = w / gw, ch = h / gh;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const v = Math.sin(x * 0.22 + t) + Math.sin(y * 0.18 + t * 1.3) + Math.sin(Math.hypot(x - gw / 2, y - gh / 2) * 0.24 - t * 0.8) + Math.sin((x * 0.07 + y * 0.05) * Math.cos(t * 0.3));
      const vv = (v + 4) / 8;
      ctx.fillStyle = `hsl(${(vv * 60 + 350) % 360} 85% ${16 + vv * 42}%)`;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }} />;
}

export function CvGridFloor(p: PreviewProps) {
  const speed = clamp(numP(p.params, "speed", 60), 0, 240);
  const tilt = clamp(numP(p.params, "tilt", 62), 40, 78);
  return <Cv props={p} deps={[speed, tilt]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const horizon = h * (1 - tilt / 100);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#12060b"); g.addColorStop(0.5, "#1a0712"); g.addColorStop(1, INK);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // sun
    const sg = ctx.createRadialGradient(w / 2, horizon, 2, w / 2, horizon, h * 0.3);
    sg.addColorStop(0, "rgba(255,110,40,0.8)"); sg.addColorStop(1, "transparent");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(w / 2, horizon, h * 0.3, 0, 7); ctx.fill();
    // perspective lines
    ctx.strokeStyle = "rgba(255,60,140,0.5)";
    const n = 12;
    for (let i = -n; i <= n; i++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 + i * 8, horizon);
      ctx.lineTo(w / 2 + i * (w / 8), h);
      ctx.stroke();
    }
    const off = (t * speed * 0.06) % 1;
    for (let r = 0; r < 10; r++) {
      const zv = ((r + off) / 10);
      const y = horizon + (h - horizon) * Math.pow(zv, 2.2);
      ctx.strokeStyle = `rgba(255,60,140,${0.15 + zv * 0.4})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }} />;
}

export function CvRays(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI + Math.sin(t * 0.3 + i) * 0.12;
      const g = ctx.createLinearGradient(w / 2, 0, w / 2 + Math.cos(a) * w, h);
      g.addColorStop(0, "rgba(255,184,92,0.35)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.save();
      ctx.translate(w / 2, 0); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, h); ctx.lineTo(14, h); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
  }} />;
}

export function CvFogLayer(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const noise = makeNoise2D(51);
    const gw = 50, gh = 30;
    for (let layer = 0; layer < 3; layer++) {
      const cw = w / gw, ch = h / gh;
      for (let y = 0; y < gh; y += 2) for (let x = 0; x < gw; x += 2) {
        const v = fbm(noise, (x + t * (3 + layer * 4)) * 0.06, y * 0.06 + layer * 20, 3);
        const a = clamp((v * 0.5 + 0.5) * (0.1 + layer * 0.06), 0, 0.3);
        ctx.fillStyle = `rgba(200,190,210,${a})`;
        ctx.fillRect(x * cw * 2, y * ch * 2, cw * 2 + 1, ch * 2 + 1);
      }
    }
    // silhouette ridge
    ctx.fillStyle = "#0a0a0d";
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 8) {
      const v = fbm(noise, x * 0.01, 90, 3);
      ctx.lineTo(x, h * 0.75 - v * h * 0.15);
    }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  }} />;
}

export function CvLiquid(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    const noise = makeNoise2D(61);
    const gw = 66, gh = 42, cw = w / gw, ch = h / gh;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const px = x * 0.09, py = y * 0.09;
      const w1 = fbm(noise, px + t * 0.04, py, 3);
      const v = Math.sin(Math.PI * (px * 2 + w1 * 4 + t * 0.3)) * 0.5 + 0.5;
      // liquid metal ramp
      ctx.fillStyle = `hsl(${215 + v * 30} ${8 + v * 16}% ${12 + v * 55}%)`;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }} />;
}

export function CvConstellation(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const rnd = mulberry32(99);
    const nodes: { x: number; y: number }[] = Array.from({ length: 34 }, (_, i) => ({
      x: rnd() * w + Math.sin(t * 0.4 + i) * 8,
      y: rnd() * h + Math.cos(t * 0.5 + i * 2) * 8,
    }));
    const cur = { x: w / 2 + Math.sin(t * 0.9) * w * 0.3, y: h / 2 + Math.cos(t * 1.1) * h * 0.3 };
    const all = [...nodes, cur];
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
      const dx = all[i].x - all[j].x, dy = all[i].y - all[j].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 95 * 95) {
        ctx.strokeStyle = `rgba(255,140,80,${(1 - Math.sqrt(d2) / 95) * 0.45})`;
        ctx.beginPath(); ctx.moveTo(all[i].x, all[i].y); ctx.lineTo(all[j].x, all[j].y); ctx.stroke();
      }
    }
    ctx.fillStyle = IVORY;
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 1.3, 0, 7); ctx.fill(); }
    ctx.fillStyle = EMBER; ctx.beginPath(); ctx.arc(cur.x, cur.y, 2.6, 0, 7); ctx.fill();
  }} />;
}

/* ============================ texture ============================ */

export function CvGrain(p: PreviewProps) {
  const opacity = clamp(numP(p.params, "opacity", 8), 1, 25);
  return <Cv props={p} deps={[opacity]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = "#141119"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = IVORY; ctx.font = `900 ${Math.min(40, w / 9)}px 'Space Grotesk Variable',sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("GRAIN", w / 2, h / 2);
    const frame = Math.floor(t * 12);
    const rnd = mulberry32(frame);
    const g = ctx.createImageData(72, 72);
    for (let i = 0; i < g.data.length; i += 4) {
      const v = Math.floor(rnd() * 255);
      g.data[i] = v; g.data[i + 1] = v; g.data[i + 2] = v; g.data[i + 3] = 255;
    }
    const off = document.createElement("canvas");
    off.width = 72; off.height = 72;
    off.getContext("2d")!.putImageData(g, 0, 0);
    const pat = ctx.createPattern(off, "repeat");
    if (pat) {
      ctx.save(); ctx.globalAlpha = opacity / 100; ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
  }} />;
}

export function CvHalftone(p: PreviewProps) {
  const cell = clamp(numP(p.params, "cell", numP(p.params, "size", 8)), 4, 18);
  return <Cv props={p} deps={[cell]} draw={(ctx, w, h, t) => {
    ctx.fillStyle = IVORY; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#171017";
    for (let y = cell / 2; y < h; y += cell) for (let x = cell / 2; x < w; x += cell) {
      const src = (Math.sin(x * 0.025 + t) + Math.sin(y * 0.035 - t * 0.8) + 2) / 4;
      const r = (1 - src) * cell * 0.5;
      if (r > 0.4) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    }
  }} />;
}

export function CvDither(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const px = 3;
    for (let y = 0; y < h; y += px) for (let x = 0; x < w; x += px) {
      const v = (Math.sin(x * 0.018 + t * 0.8) + Math.sin((x + y) * 0.022 - t * 0.5) + 2) / 4;
      const th = B[(Math.round(y / px) % 4) * 4 + (Math.round(x / px) % 4)] / 16;
      if (v > th) { ctx.fillStyle = EMBER; ctx.fillRect(x, y, px - 0.5, px - 0.5); }
    }
  }} />;
}

export function CvMarble(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h) => {
    const noise = makeNoise2D(77);
    const gw = 84, gh = 54, cw = w / gw, ch = h / gh;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const px = x * 0.06, py = y * 0.06;
      const turb = Math.abs(fbm(noise, px, py, 4));
      const v = Math.sin(Math.PI * (px * 2.4 + turb * 5)) * 0.5 + 0.5;
      ctx.fillStyle = `hsl(${24 - v * 10} ${12 + v * 10}% ${82 - v * 52}%)`;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }} />;
}

export function CvBloom(p: PreviewProps) {
  return <Cv props={p} draw={(ctx, w, h, t) => {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      const x = w * (0.15 + (i % 3) * 0.35), y = h * (0.3 + Math.floor(i / 3) * 0.4) + Math.sin(t + i) * 8;
      // tight + wide additive halos = bloom approximation
      for (const [r, a] of [[26, 0.12], [12, 0.25], [4, 0.9]] as const) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,184,92,${a})`); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    }
  }} />;
}

/* shared per-canvas state helper (survives between frames, reset on key change) */
function stateOf<T>(ctx: CanvasRenderingContext2D, key: string, init: () => T): T {
  const bag = ctx as unknown as { __pvs?: Record<string, T>; __pvKey?: string };
  if (!bag.__pvs) bag.__pvs = {};
  return (bag.__pvs[key] ??= init());
}
