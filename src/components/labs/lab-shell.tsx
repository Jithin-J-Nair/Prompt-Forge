"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/*  Lab shell — shared infrastructure for ALL real demos.               */
/*  Canvas handling: DPR cap, resize, reduced-motion, visibility pause. */
/* ------------------------------------------------------------------ */

export interface DemoContext {
  ctx: CanvasRenderingContext2D;
  w: number; // css px
  h: number;
  t: number; // seconds running
  dpr: number;
  pointer: { x: number; y: number; inside: boolean; vx: number; vy: number };
  reduced: boolean;
}

export type DemoDraw = (dc: DemoContext) => void;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * Hosts a real rAF-driven canvas demo.
 * - pauses when offscreen (IntersectionObserver)
 * - freezes on a representative frame under prefers-reduced-motion
 * - caps DPR at 2, resizes with the host
 */
export function CanvasDemo({
  draw,
  className,
  deps = [],
  staticFrame = 1.6,
}: {
  draw: DemoDraw;
  className?: string;
  deps?: unknown[];
  staticFrame?: number;
}) {
  const hostRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  useCanvas(hostRef, draw, { paused: reduced, staticFrame }, deps);
  return (
    <div className={className}>
      <canvas ref={hostRef} className="block size-full" aria-hidden="true" />
    </div>
  );
}

export function useCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: DemoDraw,
  opts: { paused?: boolean; staticFrame?: number } = {},
  deps: unknown[] = [],
) {
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();
    let last: DemoContext | null = null;
    const pointer = { x: -9999, y: -9999, inside: false, vx: 0, vy: 0 };

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(rect.width * dpr));
      canvas.height = Math.max(2, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver((e) => {
      visible = e[0]?.isIntersecting ?? true;
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      pointer.vx = nx - pointer.x;
      pointer.vy = ny - pointer.y;
      pointer.x = nx;
      pointer.y = ny;
      pointer.inside = nx >= 0 && ny >= 0 && nx <= rect.width && ny <= rect.height;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      const t = (now - start) / 1000;
      last = {
        ctx,
        w: rect.width,
        h: rect.height,
        t,
        dpr,
        pointer,
        reduced: opts.paused ?? false,
      };
      ctx.clearRect(0, 0, rect.width, rect.height);
      drawRef.current(last);
      if (opts.paused && t > (opts.staticFrame ?? 1.6)) {
        // freeze: draw one more second then stop until deps/paused change
        cancelAnimationFrame(raf);
        running = false;
      }
    };
    running = true;
    raf = requestAnimationFrame(frame);

    return () => {
      if (running) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      void last;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.paused, ref, ...deps]);
}

/* -------------------------- shared math -------------------------- */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 2D value-noise with smooth interpolation (deterministic). */
export function makeNoise2D(seed = 1) {
  const rnd = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number, x: number, y: number) => {
    switch (h & 7) {
      case 0: return x + y; case 1: return x - y; case 2: return -x + y; case 3: return -x - y;
      case 4: return x; case 5: return -x; case 6: return y; default: return -y;
    }
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x: number, y: number): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    return (
      lerp(
        lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
        lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
        v,
      ) * 0.7071
    );
  };
}

export function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves: number, gain = 0.5, lacunarity = 2): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ----------------------------- tiles ------------------------------ */

export function DemoTile({
  title,
  moduleId,
  children,
  note,
}: {
  title: string;
  moduleId: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-carbon/60">
      <div className="relative aspect-[16/10] bg-ink">{children}</div>
      <figcaption className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-2.5">
        <span className="font-display text-[12.5px] font-semibold tracking-wide">{title}</span>
        <code className="font-mono text-[10px] text-smoke">{moduleId}</code>
      </figcaption>
      {note ? (
        <p className="border-t border-line px-4 py-2 font-mono text-[10.5px] leading-relaxed text-fog/80">{note}</p>
      ) : null}
    </figure>
  );
}

export function LabSlider({
  label, value, min, max, step = 1, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-[11px] text-fog">
      <span className="w-28 shrink-0 font-mono uppercase tracking-[0.08em]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-steel accent-ember"
      />
      <span className="w-14 text-right font-mono text-ivory/80">
        {value}
        {unit ?? ""}
      </span>
    </label>
  );
}
