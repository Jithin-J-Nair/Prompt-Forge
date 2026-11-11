"use client";

/* ------------------------------------------------------------------ */
/*  NebulaField — the hero's living backdrop. Aurora blobs + a drift    */
/*  of violet/cyan dust on a slow curl field; the pointer warps the     */
/*  field. Pauses off-tab, stills under reduced-motion, DPR-capped.     */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from "react";
import { makeNoise2D, mulberry32, useReducedMotion } from "@/components/labs/lab-shell";

interface Mote { x: number; y: number; s: number; hue: number; ph: number }

export function NebulaField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rnd = mulberry32(11);
    const motes: Mote[] = Array.from({ length: 210 }, () => ({
      x: rnd(), y: rnd(), s: 0.4 + rnd() * 1.6,
      hue: 248 + rnd() * 60,  // violet → cyan band
      ph: rnd() * Math.PI * 2,
    }));
    const blobs = Array.from({ length: 4 }, (_, i) => ({
      x: rnd(), y: rnd(), r: 0.28 + rnd() * 0.2, hue: i % 2 ? 258 : 190, ph: rnd() * 7,
    }));
    const noise = makeNoise2D(23);

    let mx = 0.5, my = 0.45, tx = 0.5, ty = 0.45;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = (e.clientX - r.left) / Math.max(1, r.width);
      ty = (e.clientY - r.top) / Math.max(1, r.height);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const draw = (ms: number) => {
      const t = ms / 1000;
      const w = canvas.width / dpr, h = canvas.height / dpr;
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;

      ctx.clearRect(0, 0, w, h);

      // aurora blobs — the one ambient light system
      for (const b of blobs) {
        const bx = (b.x + Math.sin(t * 0.05 + b.ph) * 0.14 + (mx - 0.5) * 0.1) * w;
        const by = (b.y + Math.cos(t * 0.04 + b.ph * 1.7) * 0.12 + (my - 0.5) * 0.1) * h;
        const br = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `hsla(${b.hue}, 85%, 66%, 0.13)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // mote drift on the curl field
      for (const m of motes) {
        const n = noise(m.x + t * 0.015, m.y - t * 0.01);
        const ang = n * Math.PI * 2;
        m.x += Math.cos(ang) * 0.00028 + (mx - 0.5) * 0.0004;
        m.y += Math.sin(ang) * 0.00028 + (my - 0.5) * 0.0004;
        if (m.x < -0.05) m.x += 1.1; if (m.x > 1.05) m.x -= 1.1;
        if (m.y < -0.05) m.y += 1.1; if (m.y > 1.05) m.y -= 1.1;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.8 + m.ph));
        ctx.fillStyle = `hsla(${m.hue}, 90%, 74%, ${0.5 * tw})`;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.s * tw, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // visibility-annealed loop
    const vis = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(loop);
      }
    };
    const loop = (ms: number) => {
      draw(ms);
      raf = requestAnimationFrame(loop);
    };
    if (reduced) {
      draw(0); // one static frame
    } else {
      raf = requestAnimationFrame(loop);
    }
    document.addEventListener("visibilitychange", vis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden className={className ?? "absolute inset-0 size-full"} />;
}
