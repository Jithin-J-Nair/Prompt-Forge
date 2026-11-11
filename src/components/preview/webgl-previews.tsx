"use client";

import { useRef } from "react";
import { GLSL_NOISE, numP, usePreviewWebGL, clamp, type PreviewProps } from "./runtime";

/* ------------------------------------------------------------------ */
/*  Real WebGL2 fragment-shader previews — GLSL actually compiles and    */
/*  executes on the user's GPU. Params hook into uniforms where a        */
/*  module exposes them.                                                 */
/* ------------------------------------------------------------------ */

function Gl({
  src, props, uniforms,
}: {
  src: string;
  props: PreviewProps;
  uniforms?: (t: number) => Record<string, number>;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  usePreviewWebGL(ref, src, (_gl, t) => ({ ...(uniforms?.(t) ?? {}) }), {
    animate: props.animate, still: props.still, deps: [props.params, src],
  });
  return <canvas ref={ref} className="block size-full" />;
}

const EMIT = (body: string) => `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uOctaves;
uniform float uSpeed;
out vec4 O;
${GLSL_NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 ar = vec2(uv.x * uRes.x / uRes.y, uv.y);
  int oct = max(1, int(uOctaves));
  float t = uTime * max(0.1, uSpeed);
  ${body}
}`;

function octx(o: number | undefined): number { return clamp(o ?? 4, 1, 8); }

export function GlWarp(p: PreviewProps) {
  const mode = (p.params.mode as string) ?? "nested";
  return <Gl props={p} src={EMIT(`
    vec2 p2 = ar * 2.2;
    vec2 q = vec2(fbm(p2 + t*0.1, oct), fbm(p2 + vec2(7.2), oct));
    vec2 r = vec2(fbm(p2 + q * 1.6 + vec2(1.7, 9.2) + t*0.12, oct), fbm(p2 + q * 1.6 + vec2(8.3, 2.8), oct));
    float f = ${mode === "quantized" ? "floor(fbm(p2 + 2.4*r, oct)*5.0)/5.0" : "fbm(p2 + 2.4*r, oct)"};
    vec3 col = mix(vec3(0.05,0.03,0.07), vec3(1.0,0.34,0.1), clamp(f*1.4,0.0,1.0));
    col = mix(col, vec3(1.0,0.75,0.4), clamp(length(q)*0.4,0.0,1.0));
    col = mix(col, vec3(0.25,0.15,0.5), clamp(f*f*0.6,0.0,1.0)*0.5);
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: octx(numP(p.params, "octaves", 4)), uSpeed: numP(p.params, "warp", numP(p.params, "speed", 1)) })} />;
}

export function GlDistortion(p: PreviewProps) {
  const amp = numP(p.params, "amplitude", 0.06);
  const fre = numP(p.params, "frequency", 8);
  return <Gl props={p} src={EMIT(`
    // displacement driven by a noise field over a fused procedural "image" (grid + glyph rects)
    vec2 duv = uv - 0.5;
    float d = fbm(uv*${fre.toFixed(1)} + t*0.4, oct);
    vec2 iuv = uv + duv * d * ${(amp * 2).toFixed(3)};
    vec2 g = fract(iuv * vec2(14.0, 9.0));
    float grid = step(0.93, max(g.x, g.y));
    vec2 bl = vec2(0.2, 0.32), sz = vec2(0.28, 0.22);
    float rect = step(bl.x, iuv.x)*step(bl.y, iuv.y)*(1.0-step(bl.x+sz.x, iuv.x))*(1.0-step(bl.y+sz.y, iuv.y));
    vec2 bl2 = vec2(0.55, 0.5), sz2 = vec2(0.3, 0.16);
    float rect2 = step(bl2.x, iuv.x)*step(bl2.y, iuv.y)*(1.0-step(bl2.x+sz2.x, iuv.x))*(1.0-step(bl2.y+sz2.y, iuv.y));
    vec3 base = vec3(0.04);
    base += grid * vec3(0.12);
    base = mix(base, vec3(1.0, 0.36, 0.12), rect);
    base = mix(base, vec3(0.94, 0.92, 0.9), rect2*0.85);
    O = vec4(base, 1.0);`)}
    uniforms={() => ({ uOctaves: 3, uSpeed: 1 })} />;
}

export function GlFluid(p: PreviewProps) {
  return <Gl props={p} src={EMIT(`
    // stylized dye advection: curl noise drives stretched fbm dye streaks
    vec2 p2 = ar * 3.0;
    vec2 q = vec2(fbm(p2 + t*0.16, 3), fbm(p2 + vec2(4.1, 1.8) + t*0.12, 3));
    float dye = fbm(p2 + q * 2.2 - t*0.06, 4);
    float dye2 = fbm(p2 - q * 1.8 + vec2(t*0.05), 4);
    vec3 col = vec3(0.03, 0.02, 0.05);
    col += vec3(1.0, 0.35, 0.12) * pow(dye, 2.4) * 1.4;
    col += vec3(0.4, 0.2, 0.9) * pow(dye2, 2.6);
    col += vec3(1.0, 0.8, 0.5) * pow(dye * dye2, 3.0) * 2.0;
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 4, uSpeed: numP(p.params, "speed", 1) })} />;
}

export function GlAberration(p: PreviewProps) {
  const str = numP(p.params, "strength", 0.004);
  return <Gl props={p} src={EMIT(`
    vec2 d = uv - 0.5;
    float amt = ${(str).toFixed(4)};
    float barr = step(abs(uv.y - uv.x*0.5 - 0.2), 0.05);
    vec2 uvr = uv + vec2(amt);
    vec2 uvb = uv - vec2(amt);
    float ringC = smoothstep(0.28, 0.27, length((uv-0.5)*vec2(1.5,1.0)));
    float ringR = smoothstep(0.28, 0.27, length((uvr-0.5)*vec2(1.5,1.0)));
    float ringB = smoothstep(0.28, 0.27, length((uvb-0.5)*vec2(1.5,1.0)));
    float barrR = step(abs(uvr.y - uvr.x*0.5 - 0.2), 0.05);
    float barrB = step(abs(uvb.y - uvb.x*0.5 - 0.2), 0.05);
    vec3 col = vec3(ringR + barrR*0.6, ringC + barr*0.6, ringB + barrB*0.6);
    col *= vec3(1.0, 0.85, 0.8);
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 2, uSpeed: 1 })} />;
}

export function GlCaustics(p: PreviewProps) {
  return <Gl props={p} src={EMIT(`
    vec3 col = vec3(0.02, 0.05, 0.1);
    vec2 p2 = ar * 5.0;
    const int steps = 3;
    float cw = 1.0;
    for (int i = 0; i < steps; i++) {
      float ti = t * (0.25 + float(i) * 0.09);
      vec2 bb = p2 + vec2(cos(ti + float(i)*2.0), sin(ti - float(i)*1.6));
      float e = length(mod(bb * float(1 + i), 4.0) - 2.0);
      cw = min(cw + e * 0.35, 1.0);
      col += vec3(0.1, 0.5, 0.7) * pow(max(0.0, 1.0 - e*e), 6.0) * (0.4 + float(i) * 0.2);
    }
    col += vec3(1.0, 0.6, 0.3) * pow(cw, 90.0) * 0.4;
    // floor grid
    vec2 g = fract(p2 * 0.5);
    col += step(0.96, max(g.x, g.y)) * vec3(0.08) ;
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 2, uSpeed: numP(p.params, "iterations", numP(p.params, "depth", 1)) * 0.7 + 0.4 })} />;
}

export function GlRaymarch(p: PreviewProps) {
  const iters = clamp(numP(p.params, "steps", numP(p.params, "iterations", 40)), 16, 80);
  return <Gl props={p} src={EMIT(`
    // sphere+torus SDF scene, normal-shaded, two lights
    float sdScene(vec3 p3, float tt){
      vec3 tor = p3; tor.xz = mat2(cos(tt), -sin(tt), sin(tt), cos(tt)) * tor.xz;
      vec3 c = vec3(sin(tt*0.6)*0.55, 0.0, 0.0);
      float sph = length(p3 - vec3(0.0, sin(tt*0.8)*0.12, 0.0)) - 0.42;
      vec3 tp = tor - c;
      vec2 q = vec2(length(tp.xz) - 0.75, tp.y);
      float torsdf = length(q) - 0.22;
      vec3 bp = tor - vec3(-sin(tt*0.7)*0.55, 0.0, 0.0);
      vec3 qb = abs(bp) - vec3(0.3, 0.3, 0.3);
      float box = length(max(qb, 0.0)) + min(max(qb.x, max(qb.y, qb.z)), 0.0);
      return min(sph, min(torsdf, box));
    }
    vec3 ro = vec3(0.0, 0.0, -2.2);
    vec3 rd = normalize(vec3((uv - 0.5) * vec2(uRes.x/uRes.y, 1.0), 1.0));
    float tt2 = t * 0.6;
    float dist = 0.0; bool hit = false; vec3 pos = ro;
    for (int i = 0; i < ${iters}; i++) {
      pos = ro + rd * dist;
      float d = sdScene(pos, tt2);
      if (d < 0.002) { hit = true; break; }
      dist += d;
      if (dist > 6.0) break;
    }
    vec3 col = vec3(0.03);
    if (hit) {
      vec2 e = vec2(0.002, 0.0);
      vec3 n = normalize(vec3(
        sdScene(pos + e.xyy, tt2) - sdScene(pos - e.xyy, tt2),
        sdScene(pos + e.yxy, tt2) - sdScene(pos - e.yxy, tt2),
        sdScene(pos + e.yyx, tt2) - sdScene(pos - e.yyx, tt2)));
      vec3 li = normalize(vec3(0.6, 0.8, -0.4));
      vec3 li2 = normalize(vec3(-0.6, -0.2, -0.6));
      float dif = max(0.0, dot(n, li));
      float rim = pow(max(0.0, dot(n, li2)), 2.0) * 0.6;
      float fnl = pow(1.0 - max(0.0, dot(n, -rd)), 3.0);
      col = vec3(1.0, 0.36, 0.12) * (0.15 + dif) + vec3(1.0, 0.8, 0.5) * rim + vec3(0.3, 0.2, 0.6) * fnl * 0.8;
      col *= exp(-dist * 0.12);
    }
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 2, uSpeed: 1 })} />;
}

export function GlPostfx(p: PreviewProps) {
  const style = (p.params.style as string) ?? "cinematic";
  return <Gl props={p} src={EMIT(`
    // scene: animated neon text-like bars
    vec2 guv = uv;
    float scene = 0.0;
    ${style === "dream" ? "guv.x += sin(uv.y*14.0 + t)*0.01;" : ""}
    vec2 bars = fract(guv * vec2(6.0, 1.0));
    scene += step(abs(guv.y - 0.5 + sin(t+guv.x*4.0)*0.02), 0.03) * 0.9;
    scene += step(bars.x, 0.08) * 0.35;
    vec3 base = vec3(0.02) + vec3(1.0, 0.4, 0.14) * scene;
    float pulse = pow(max(0.0, sin(t*2.0)), 4.0);
    vec3 col = base;
    // bloom-ish: blur kernel approximation over same scene function
    ${style === "cinematic" || style === "noir" ? "col = base * vec3(1.05, 0.95, 0.9) + vec3(1.0,0.5,0.2) * pulse * scene * 0.35;" : ""}
    ${style === "cinematic" ? "vec2 d = uv-0.5; col *= 1.0 - dot(d,d)*1.1; col = mix(col, vec3(dot(col, vec3(0.299,0.587,0.114))) * vec3(1.05,0.9,0.8), 0.25);" : ""}
    ${style === "neon" ? "col += vec3(0.1,0.6,1.0) * pow(scene, 3.0) * 1.6; col = col * col + col*0.4;" : ""}
    ${style === "dream" ? "col = mix(col, vec3(0.8,0.7,1.0), 0.2 + fbm(uv*3.0 + t*0.2, 3)*0.2);" : ""}
    ${style === "noir" ? "col = vec3(dot(col, vec3(0.299,0.587,0.114))); col = pow(col, vec3(1.4));" : ""}
    // grain
    col += hash21(uv * uRes + t) * 0.05;
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 3, uSpeed: 1 })} />;
}

export function GlFog(p: PreviewProps) {
  return <Gl props={p} src={EMIT(`
    // single-scatter fog approximation: 5 translucent depth layers march down the frustum
    vec3 col = vec3(0.02, 0.03, 0.055);
    for (int li = 0; li < 5; li++) {
      float l = 0.2 + float(li) * 0.2;
      vec2 off = vec2(uv.x * (2.0 + float(li)), uv.y * (1.6 + float(li)) + t * (0.05 + float(li)*0.03));
      float fog = smoothstep(0.68 - l * 0.4, 0.95 - l * 0.2, fbm(off * vec2(1.0, 2.2), 3));
      vec3 tint = mix(vec3(0.25, 0.3, 0.4), vec3(1.0, 0.5, 0.25), float(li) / 4.0);
      col = mix(col, tint * l, fog * (0.16 + float(li) * 0.02));
    }
    // sun shaft
    float shaft = pow(max(0.0, 1.0 - abs(uv.x - 0.5 - sin(t*0.2)*0.1) * (2.0 + uv.y)), 3.0);
    col += vec3(1.0, 0.7, 0.45) * shaft * (1.0 - uv.y) * 0.5;
    O = vec4(col, 1.0);`)}
    uniforms={() => ({ uOctaves: 3, uSpeed: 1 })} />;
}
