"use client";

import { useEffect, useRef } from "react";
import { fbm as fbmShared, makeNoise2D, mulberry32 } from "@/components/labs/lab-shell";

export { fbmShared as fbm, makeNoise2D, mulberry32 };
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export interface PreviewProps {
  params: Record<string, string | number | boolean>;
  animate: boolean;
  /** reduced-motion: render a representative still */
  still: boolean;
}

/** read a numeric module param with fallback */
export function numP(params: PreviewProps["params"], key: string, fallback: number): number {
  const v = params[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
export function strP(params: PreviewProps["params"], key: string, fallback: string): string {
  const v = params[key];
  return typeof v === "string" && v ? v : fallback;
}

/* ---------------- canvas2d runtime ---------------- */

export function usePreviewCanvas(
  ref: React.RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
  opts: { animate: boolean; still: boolean; deps?: unknown[] },
) {
  const drawRef = useRef(draw);
  // sync handler-safe (no render-phase ref writes)
  useEffect(() => {
    drawRef.current = draw;
  });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const r = canvas.getBoundingClientRect();
      drawRef.current(ctx, r.width, r.height, (now - start) / 1000);
    };
    if (opts.still || !opts.animate) {
      resize();
      const r = canvas.getBoundingClientRect();
      drawRef.current(ctx, r.width, r.height, 1.4); // deterministic still
      return () => ro.disconnect();
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.animate, opts.still, ref, ...(opts.deps ?? [])]);
}

/* ---------------- WebGL2 runtime (real compiled GLSL) ---------------- */

const QUAD_VERT = `#version 300 es
precision highp float;
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export function usePreviewWebGL(
  ref: React.RefObject<HTMLCanvasElement | null>,
  fragmentSrc: string,
  getUniforms: (gl: WebGL2RenderingContext, t: number) => Record<string, number>,
  opts: { animate: boolean; still: boolean; deps?: unknown[] },
) {
  const getRef = useRef(getUniforms);
  useEffect(() => {
    getRef.current = getUniforms;
  });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) {
      // honest fallback: solid panel with clear grid — GL unsupported in this context
      const c2 = canvas.getContext("2d");
      if (c2) {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(2, r.width); canvas.height = Math.max(2, r.height);
        c2.fillStyle = "#0c0c0f"; c2.fillRect(0, 0, canvas.width, canvas.height);
        c2.strokeStyle = "rgba(139,124,246,0.4)"; c2.strokeRect(6.5, 6.5, canvas.width - 13, canvas.height - 13);
        c2.fillStyle = "rgba(242,237,230,0.6)"; c2.font = "9px monospace"; c2.textAlign = "center";
        c2.fillText("WebGL2 unavailable — static fallback", canvas.width / 2, canvas.height / 2);
      }
      return;
    }
    let raf = 0;
    let lost = false;
    const onLost = (e: Event) => { e.preventDefault(); lost = true; };
    canvas.addEventListener("webglcontextlost", onLost);

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("shader compile error:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, QUAD_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("shader link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uniformLocs = new Map<string, WebGLUniformLocation | null>();

    const renderFrame = (t: number) => {
      if (lost) return;
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t);
      const uniforms = getRef.current(gl, t);
      for (const [k, v] of Object.entries(uniforms)) {
        if (!uniformLocs.has(k)) uniformLocs.set(k, gl.getUniformLocation(prog, k));
        const l = uniformLocs.get(k);
        if (l) gl.uniform1f(l, v);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      renderFrame((now - start) / 1000);
    };
    if (opts.still || !opts.animate) {
      renderFrame(1.4);
      return () => { canvas.removeEventListener("webglcontextlost", onLost); ro.disconnect(); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); };
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.animate, opts.still, ref, fragmentSrc, ...(opts.deps ?? [])]);
}

/** shared GLSL noise/fbm utilities injected into fragment sources */
export const GLSL_NOISE = `
float hash21(vec2 p){ p = fract(p*vec2(233.34, 851.74)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash21(i), b = hash21(i+vec2(1,0)), c = hash21(i+vec2(0,1)), d = hash21(i+vec2(1,1));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p, int oct){
  float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
  for(int i=0;i<8;i++){ if(i>=oct) break; v += a*vnoise(p); p = p*2.0 + shift; a *= 0.5; }
  return v;
}
`;
