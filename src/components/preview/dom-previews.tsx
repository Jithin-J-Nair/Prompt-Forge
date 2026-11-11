"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { clamp, numP, strP, type PreviewProps } from "./runtime";

export const EASE_QUAD_BEZIER = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* helper: when !animate, start hidden/reset; CSS transitions carry state */
const T = "transition-all duration-[600ms]";

/* ============================ type tiles ============================ */

export function DmTypeOversized(p: PreviewProps) {
  const scaleTo = clamp(numP(p.params, "scaleTo", numP(p.params, "scale", 14)), 8, 30);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink px-2">
      <span
        className={clsx(T, "font-display font-black leading-none text-ivory whitespace-nowrap")}
        style={{ fontSize: `${clamp(scaleTo * 0.34, 3.2, 11)}vw` }}
      >
        FORGE<span className="text-ember">®</span>
      </span>
    </div>
  );
}

export function DmTypeCondensed(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-display text-3xl font-black uppercase tracking-tighter text-ivory" style={{ transform: "scaleX(0.72)" }}>
        CONDENSED
      </span>
    </div>
  );
}
export function DmTypeMono(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-ink font-mono text-[11px] text-fog">
      <span className="text-ember">$ const craft = true;</span>
      <span>{"// precision type"}</span>
      <span className="text-signal">01. rendered live</span>
    </div>
  );
}
export function DmTypeSerif(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink px-4">
      <p className="text-center font-serif text-xl italic leading-snug text-ivory">
        Quiet <em className="text-ember not-italic">precision</em>,<br />editorial rhythm
      </p>
    </div>
  );
}
export function DmTypeGeometric(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-display text-2xl font-bold uppercase tracking-[0.28em] text-ivory">
        GEO·METRIC
      </span>
    </div>
  );
}
export function DmTypeBrutalist(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ivory p-3">
      <div className="w-full">
        <div className="mb-1.5 h-2 w-2/3 bg-[#171717]" />
        <div className="font-mono text-xl font-black uppercase leading-none tracking-tight text-[#171717]">
          BRUTE<br />FORCE <span className="text-ember">→</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <span className="h-px w-1/2 bg-[#171717]" />
          <span className="font-mono text-[8px] text-[#171717]/60">spec.1962</span>
        </div>
      </div>
    </div>
  );
}
export function DmTypeOutline(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-display text-3xl font-black uppercase leading-none" style={{ WebkitTextStroke: "1.5px #f2ede6", color: "transparent" }}>
        HOLLOW
      </span>
    </div>
  );
}
export function DmTypeStacked(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink font-display font-black uppercase leading-[0.9]">
      <span className="text-2xl text-ivory">STACK</span>
      <span className="text-2xl" style={{ WebkitTextStroke: "1px #ffb85c", color: "transparent" }}>STACK</span>
      <span className="text-2xl text-ember">STACK</span>
    </div>
  );
}
export function DmTypeVertical(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-ink">
      <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-ivory" style={{ writingMode: "vertical-rl" }}>VÉRTICAL</span>
      <span className="h-16 w-px bg-ember" />
      <span className="font-serif text-base italic text-fog" style={{ writingMode: "vertical-rl" }}>reading down</span>
    </div>
  );
}
export function DmTypeMask(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-display text-3xl font-black uppercase" style={{
        backgroundImage: "linear-gradient(110deg,#ff5c1c 20%,#ffb85c 45%,#ff5c1c 75%)",
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
      }}>MASKED</span>
    </div>
  );
}
export function DmTypeGradient(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className={clsx(T, "font-display text-3xl font-black uppercase")}
        style={{
          backgroundImage: "linear-gradient(120deg,#ff5c1c,#ff2e4d 60%,#ffb85c)",
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
        SHEEN
      </span>
    </div>
  );
}

/* ============================ motion-dom set ============================ */

export function DmCharStagger(p: PreviewProps) {
  const word = "FORGE";
  const stagger = clamp(numP(p.params, "stagger", 0.06), 0.01, 0.3) * 1000;
  const [key, setKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setKey((k) => k + 1), 2600);
    return () => { clearInterval(id); };
  }, [p.animate]);
  void key;
  return (
    <div key={key} className="absolute inset-0 flex items-center justify-center gap-[0.5ch] bg-ink overflow-hidden">
      {word.split("").map((c, i) => (
        <span key={`${i}`}
          className="font-display text-[22px] font-black text-ivory"
          style={{
            animation: `pf-char-in 0.55s cubic-bezier(0.22,1,0.36,1) both`,
            animationDelay: `${i * stagger}ms`,
          }}>
          {c}
        </span>
      ))}
      <style>{`@keyframes pf-char-in{from{opacity:0;transform:translateY(16px) rotate(6deg)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

export function DmScramble(p: PreviewProps) {
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#□";
  const [txt, setTxt] = useState("FORGE");
  useEffect(() => {
    const target = "FORGE";
    if (!p.animate || p.still) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setTxt(target.split("").map((c, i) =>
        frame > i * 4 + 8 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""));
    }, 60);
    const restart = setInterval(() => { frame = 0; }, 3200);
    return () => { clearInterval(id); clearInterval(restart); };
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink font-mono text-2xl font-bold tracking-wider text-ember" suppressHydrationWarning>
      {txt}
    </div>
  );
}

export function DmTypeMorph(p: PreviewProps) {
  const words = ["RENDER", "COMPOSE", "DESIGN"];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <MaskCycle words={words} animate={p.animate} className="font-display text-2xl font-black uppercase text-ivory" interval={1000} />
    </div>
  );
}

function MaskCycle({ words, animate, className, interval }: { words: string[]; animate: boolean; className: string; interval: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [animate, interval, words.length]);
  return (
    <span key={i} className={className} style={{ animation: `pf-char-in 0.45s cubic-bezier(0.22,1,0.36,1) both` }}>
      {words[i]}
    </span>
  );
}

export function DmTypeWave(p: PreviewProps) {
  const amp = clamp(numP(p.params, "amplitude", 1), 0.2, 2);
  const freq = clamp(numP(p.params, "frequency", 0.5), 0.1, 2);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - start) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const word = "wavetable";
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <div className="font-display text-xl font-bold text-ivory">
        {word.split("").map((c, i) => (
          <span key={i} className="inline-block" style={{
            transform: `translateY(${Math.sin(i * 0.8 * freq * 4 + t * 4) * 5 * amp}px)`,
            color: `hsl(${18 + Math.sin(i * 0.6 + t) * 10} 92% ${58 + Math.sin(i + t * 2) * 14}%)`,
          }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

export function DmVariable(p: PreviewProps) {
  const wMin = clamp(numP(p.params, "minWeight", 300), 100, 500);
  const wMax = clamp(numP(p.params, "maxWeight", 700), 500, 900);
  const [w, setW] = useState(wMin);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - start) / 1000;
      setW(wMin + ((Math.sin(t * 2) + 1) / 2) * (wMax - wMin));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still, wMin, wMax]);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink">
      <span className="font-display text-3xl uppercase text-ivory" style={{ fontVariationSettings: `'wght' ${Math.round(w)}` }}>
        Weight
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] text-smoke">{Math.round(w)}</span>
    </div>
  );
}

/* ============================ pointer-motion dom set ============================ */

export function DmCursor(p: PreviewProps) {
  const size = clamp(numP(p.params, "size", 36), 8, 96);
  // simulate the cursor orbiting; the REAL module is pointer-bound
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute inset-x-4 top-3 h-10 rounded-md border border-line" />
      <SimOrbiter>
        {({ x, y }) => (
          <div className="pointer-events-none absolute" style={{ left: 0, top: 0, transform: `translate(${x - size / 2}px, ${y - size / 2}px)` }}>
            <div style={{ width: size, height: size }} className="rounded-full border border-ember/70 bg-ember/15" />
          </div>
        )}
      </SimOrbiter>
    </div>
  );
}

function SimOrbiter({ children }: { children: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [rc, setRc] = useState<{ x: number; y: number }>({ x: 40, y: 40 });
  useEffect(() => {
    let raf = 0;
    const el = document.querySelector("") as never;
    void el;
    const start = performance.now();
    const root = document.getElementById("pf-sim-root");
    void root;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - start) / 1000;
      setRc({ x: t, y: t });
    };
    // box driven from global time; scaled against the parent dimen's by CSS
    loop(performance.now());
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="absolute inset-0">
      {children({ x: 28 + (Math.sin(rc.x * 1.4) * 0.5 + 0.5) * 140, y: 16 + (Math.cos(rc.x * 1.9) * 0.5 + 0.5) * 60 })}
    </div>
  );
}

export function DmMagnetic(p: PreviewProps) {
  const strength = clamp(numP(p.params, "strength", 0.4), 0.1, 1);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - s0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const ox = Math.sin(t * 1.5) * 16 * strength;
  const oy = Math.cos(t * 1.8) * 10 * strength;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div
        className="grid size-14 place-items-center rounded-xl border border-ember bg-ember/15 font-mono text-[9px] uppercase text-flare"
        style={{ transform: `translate(${ox}px, ${oy}px)`, transition: "transform 120ms cubic-bezier(.2,.8,.2,1)" }}>
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-wall" />
          magnetic
        </div>
      </div>
      <div className="absolute size-2 rounded-full bg-ivory" style={{ left: `calc(50% + ${ox * 1.5 + 26}px)`, top: `calc(50% + ${oy * 1.5}px)` }} />
    </div>
  );
}

export function DmSpotlight(p: PreviewProps) {
  const radius = clamp(numP(p.params, "radius", numP(p.params, "size", 90)), 30, 200);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - s0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const x = 50 + Math.sin(t * 1.2) * 32, y = 50 + Math.cos(t * 1.6) * 26;
  return (
    <div className="absolute inset-0 bg-ink p-4">
      <div className="h-full rounded border border-line p-3" style={{
        background: `radial-gradient(${radius}px at ${x}% ${y}%, rgba(255,92,28,0.22), transparent 65%)`,
      }}>
        <div className="mb-2 h-2 w-24 rounded bg-wall" />
        <div className="h-2 w-40 rounded bg-wall" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => <div key={i} className="h-7 rounded bg-wall/70" />)}
        </div>
      </div>
    </div>
  );
}

export function DmTilt(p: PreviewProps) {
  const max = clamp(numP(p.params, "maxTilt", numP(p.params, "tilt", 10)), 3, 22);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - s0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const ry = Math.sin(t * 1.4) * max, rx = -Math.cos(t * 1.1) * max * 0.8;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink" style={{ perspective: 420 }}>
      <div className="absolute size-1.5 rounded-full bg-flare/80" style={{ left: `${50 + Math.sin(t * 1.4) * 20}%`, top: `${50 + Math.cos(t * 1.1) * 18}%` }} />
      <div
        className="relative h-16 w-24 rounded-lg border border-line bg-gradient-to-br from-panel to-wall"
        style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg)`, transition: "transform 90ms linear" }}
      >
        <div className="absolute inset-x-2 top-2 h-1.5 w-1/2 rounded bg-ember/60" />
        <div className="absolute inset-x-2 top-5 h-1 w-3/4 rounded bg-wall" />
      </div>
    </div>
  );
}

/* ============================ scroll/dom set ============================ */

function ScrollMeter({ animate, still, children }: PreviewProps["params"] extends never ? never : {
  animate: boolean; still: boolean;
  children: (p: number) => React.ReactNode;
}) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!animate || still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = ((now - s0) / 1000) % 4;
      setP(t < 2 ? t / 2 : (4 - t) / 2); // ping-pong
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animate, still]);
  return (
    <div className="absolute inset-0 bg-ink">
      {children(p)}
      <div className="absolute inset-y-3 right-1.5 w-1 rounded bg-wall">
        <div className="w-full rounded bg-ember" style={{ height: `${p * 100}%` }} />
      </div>
    </div>
  );
}

export function DmReveal(p: PreviewProps) {
  const ease = strP(p.params, "ease", "power2-out");
  void ease;
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="grid h-full grid-cols-2 content-center gap-2 px-4">
          {[0, 1, 2, 3].map(i => {
            const local = clamp(pr * 2.4 - i * 0.28, 0, 1);
            return (
              <div key={i} className="flex h-9 items-center rounded border border-line bg-panel px-2"
                style={{ opacity: local, transform: `translateY(${(1 - local) * 14}px)` }}>
                <div className="h-1.5 w-full rounded bg-wall" />
              </div>
            );
          })}
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmScrub(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="grid h-full place-items-center">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full border border-wall" />
            <div className="absolute inset-0 rounded-full border-2 border-ember" style={{
              clipPath: `polygon(50% 50%, 50% 0, ${50 + Math.sin(pr * Math.PI * 2) * 50}% ${50 - Math.cos(pr * Math.PI * 2) * 50}%, 50% 50%)`,
            }} />
            <span className="absolute inset-0 grid place-items-center font-mono text-[9px] text-fog">
              {(pr * 360).toFixed(0)}°
            </span>
          </div>
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmPin(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="flex h-full flex-col px-4 py-3">
          <div className="rounded border border-ember/50 bg-panel p-2" style={{ transform: `scale(${1 - pr * 0.12})` }}>
            <div className="h-1.5 w-16 rounded bg-ember/70" />
            <div className="mt-1.5 h-1 w-full rounded bg-wall" />
          </div>
          <div className="mt-2 space-y-1.5" style={{ opacity: clamp((pr - 0.4) * 3, 0, 1) }}>
            {[0, 1].map(i => <div key={i} className="h-1.5 rounded bg-wall" style={{ width: `${70 - i * 15}%` }} />)}
          </div>
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmParallax(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => {
        const layers = Math.round(clamp(numP(p.params, "layers", 3), 2, 6));
        return (
          <div className="h-full overflow-hidden">
            {Array.from({ length: layers }, (_, i) => (
              <div key={i} className="absolute rounded-full"
                style={{
                  left: `${12 + i * 26}%`,
                  top: `calc(${20 + i * 14}% + ${(pr - 0.5) * (20 + i * 26)}px)`,
                  width: 18 + i * 7, height: 18 + i * 7,
                  background: i % 2 ? "rgba(255,92,28,0.4)" : "rgba(242,237,230,0.14)",
                  filter: i === 0 ? "blur(1px)" : undefined,
                }} />
            ))}
          </div>
        );
      }}
    </ScrollMeter>
  );
}

export function DmHorizontal(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="flex h-full items-center">
          <div className="flex gap-3 pl-4" style={{ transform: `translateX(${-pr * 130}px)` }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-14 w-20 shrink-0 rounded-md border border-line bg-panel p-1.5">
                <div className="h-1.5 w-2/3 rounded bg-ember/50" />
                <div className="mt-1 h-1 w-full rounded bg-wall" />
              </div>
            ))}
          </div>
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmProgressive(p: PreviewProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLoaded(v => !v), 2400);
    return () => clearInterval(id);
  }, []);
  const on = p.animate ? loaded : true;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className={clsx(T, "relative h-16 w-24 overflow-hidden rounded-md")}
        style={{ filter: on ? "blur(0px)" : "blur(9px)", transform: `scale(${on ? 1 : 1.08})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-ember/70 via-signal/40 to-wall" />
        <span className="absolute inset-0 grid place-items-center font-mono text-[8px] text-ivory/80">
          {on ? "full quality" : "placeholder"}
        </span>
      </div>
    </div>
  );
}

export function DmMorphScene(p: PreviewProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    const id = setInterval(() => setI(v => (v + 1) % 3), 1400);
    return () => clearInterval(id);
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className={clsx("h-16 w-16 border border-ember", T)}
        style={{
          borderRadius: i === 0 ? 4 : i === 1 ? 10 : 32,
          transform: `rotate(${i * 30}deg) scale(${1 + i * 0.08})`,
          background: `rgba(255,92,28,${0.15 + i * 0.1})`,
        }} />
      <span className="absolute bottom-2 font-mono text-[8px] text-smoke">scene {i + 1}/3</span>
    </div>
  );
}

export function DmLineDraw(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="relative h-full px-4">
          <div className="absolute left-1/2 top-0 h-full w-px bg-wall" />
          <div className="absolute left-1/2 top-0 w-1 -translate-x-1/2 bg-ember" style={{ height: `${pr * 100}%` }} />
          {[0, 1, 2].map(i => (
            <div key={i} className="relative my-1.5" style={{ opacity: pr > i * 0.3 ? 1 : 0.15 }}>
              <div className="ml-[calc(50%+10px)] h-1.5 w-16 rounded bg-wall" />
            </div>
          ))}
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmMaskReveal(p: PreviewProps) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setGo(v => !v), 1800);
    return () => clearInterval(id);
  }, []);
  const on = p.animate ? go : true;
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-ink">
      <span className={clsx(T, "font-display text-2xl font-black text-ivory")}
        style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}>
        UNMASKED
      </span>
    </div>
  );
}

/* ============================ transitions/system ============================ */

export function DmWipe(p: PreviewProps) {
  const dir = strP(p.params, "direction", "left");
  const [a, setA] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    const id = setInterval(() => setA(v => 1 - v), 1500);
    return () => clearInterval(id);
  }, [p.animate, p.still]);
  const cover100 = dir === "left";
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute inset-0 grid place-items-center font-mono text-[10px] text-fog">view {a + 1}</div>
      <div className={clsx("absolute inset-0 bg-ember/90", T)}
        style={{ transform: cover100 ? `translateX(${a ? 0 : 101}%)` : `translateY(${a ? 0 : 101}%)` }} />
    </div>
  );
}

export function DmShared(p: PreviewProps) {
  const [grid, setGrid] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setGrid(v => !v), 1800);
    return () => clearInterval(id);
  }, []);
  const on = p.animate ? grid : true;
  return (
    <div className="absolute inset-0 bg-ink p-3">
      <div className={clsx("rounded-md border border-ember/60 bg-panel", T)}
        style={{
          width: on ? 44 : "100%", height: on ? 34 : 60,
          marginLeft: on ? "auto" : 0,
        }} />
      <div className={clsx("mt-2 h-1.5 rounded bg-wall", T)} style={{ width: on ? 60 : "70%" }} />
    </div>
  );
}

export function DmZoom(p: PreviewProps) {
  const [k, setK] = useState(0);
  useEffect(() => { const id = setInterval(() => setK(v => v + 1), 2200); return () => clearInterval(id); }, []);
  const on = p.animate;
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-ink">
      <div key={on ? k : 0} className="grid size-16 place-items-center rounded-full border border-ember/60"
        style={{ animation: on ? "pf-zoom 2.2s ease-in-out infinite" : undefined, transform: on ? undefined : "scale(1)" }}>
        <span className="text-flare">◉</span>
      </div>
      <style>{`@keyframes pf-zoom{from{transform:scale(0.3);opacity:0.4}to{transform:scale(1.7);opacity:1}}`}</style>
    </div>
  );
}

export function DmPreloader(p: PreviewProps) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    const id = setInterval(() => setN(v => (v >= 100 ? 0 : v + 3)), 90);
    return () => clearInterval(id);
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink font-display">
      <span className="text-3xl font-black text-ivory">{n}%</span>
      <div className="h-px w-24 bg-wall">
        <div className="h-px bg-ember transition-all" style={{ width: `${n}%` }} />
      </div>
    </div>
  );
}

export function DmMenu(p: PreviewProps) {
  const items = ["Work", "Studio", "Journal", "Contact"];
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOpen(v => !v), 2000);
    return () => clearInterval(id);
  }, []);
  const on = p.animate ? open : true;
  return (
    <div className="absolute inset-0 bg-ink">
      <div className="m-2 ml-auto w-fit rounded border border-line px-2 py-1 font-mono text-[9px] text-fog">≡ menu</div>
      {on && (
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-1.5 bg-ink/95 px-6">
          {items.map((it, i) => (
            <span key={it} className="font-display text-lg font-bold text-ivory"
              style={{ animation: "pf-char-in .45s both", animationDelay: `${i * 70}ms` }}>
              {it}
              <span className="ml-1 text-ember">↗</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function DmMicro(p: PreviewProps) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), 1600); return () => clearInterval(id); }, []);
  const v = p.animate ? on : true;
  return (
    <div className="absolute inset-0 grid place-items-center gap-1 bg-ink">
      <div className={clsx("flex h-6 w-11 cursor-pointer items-center rounded-full border border-line px-0.5", T, v && "border-ember bg-ember/25")}
        onClick={() => setOn(!on)} role="switch" aria-checked={v} tabIndex={0}>
        <div className={clsx("size-4.5 rounded-full bg-ivory", T)} style={{ transform: `translateX(${v ? 20 : 0}px)`, background: v ? "#ffb85c" : "#4b4b55" }} />
      </div>
      <span className="font-mono text-[8px] text-smoke">{v ? "engage" : "idle"}</span>
    </div>
  );
}

export function DmMarquee(p: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden bg-ink">
      <div className="flex shrink-0 gap-6 whitespace-nowrap font-display text-xl font-bold uppercase text-ivory/85"
        style={{ animation: p.animate && !p.still ? "pf-marq 6s linear infinite" : undefined }}>
        {Array.from({ length: 8 }, (_, i) => <span key={i}>craft in motion <span className="text-ember">✦</span></span>)}
      </div>
      <style>{`@keyframes pf-marq{to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

export function DmVelocity(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="grid h-full place-items-center">
          <Skewed pr={pr} />
        </div>
      )}
    </ScrollMeter>
  );
}

function Skewed({ pr }: { pr: number }) {
  const vel = clamp(Math.abs(Math.sin(pr * Math.PI)) * 26, 0, 26);
  return (
    <span className="font-display text-2xl font-black text-ivory" style={{ transform: `skewX(${vel - 1}deg)` }}>
      VELOCITY
    </span>
  );
}

export function DmCountUp(p: PreviewProps) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = ((now - s0) / 1000) % 3;
      setN(Math.round(12847 * Math.min(1, t / 2)));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink font-display text-3xl font-black text-ember">
      {n.toLocaleString()}
    </div>
  );
}

// alias used by motion/inertia-scroll? (retained for follow-ups)
export function DmStates(p: PreviewProps) {
  const [idle, setIdle] = useState(false);
  useEffect(() => { const id = setInterval(() => setIdle(v => !v), 1500); return () => clearInterval(id); }, []);
  const v = p.animate ? idle : true;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="flex gap-3">
        {["idle", "hover", "active"].map((s, i) => (
          <div key={s} className={clsx("grid size-12 place-items-center rounded-md border font-mono text-[8px]", T,
            i === (v ? 1 : 0) ? "border-ember bg-ember/15 text-flare" : "border-line text-smoke")}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ layout tiles ============================ */

const S = "absolute rounded-[3px] bg-wall/80";
const P1 = "bg-panel border border-line";
const H = "bg-ember/70";

export function DmLayout(p: PreviewProps, variant?: string) {
  const v = variant ?? "bento";
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink p-[6%]">
      {v === "bento" && (<>
        <div className={clsx(S, P1, H)} style={{ inset: "6% 54% 30% 6%" }} />
        <div className={clsx(S, P1)} style={{ inset: "6% 6% 60% 48%" }} />
        <div className={clsx(S, P1)} style={{ inset: "44% 6% 6% 48%" }} />
      </>)}
      {v === "asymmetric" && (<>
        <div className={clsx(S, P1, H)} style={{ inset: "8% 30% 14% 8%" }} />
        <div className={clsx(S, P1)} style={{ inset: "34% 8% 30% 74%" }} />
        <div className={clsx(S, P1)} style={{ inset: "66% 24% 8% 74%" }} />
        <div className={clsx(S, P1)} style={{ inset: "20% 6% 8% 42%", opacity: 0.5 }} />
      </>)}
      {v === "modular" && (<div className="grid h-full grid-cols-4 grid-rows-3 gap-1">
        {[...Array(12)].map((_, i) => <div key={i} className={clsx(P1, "rounded-[3px]", i === 5 && H)} />)}
      </div>)}
      {v === "masonry" && (<div className="grid h-full grid-cols-3 gap-1.5">
        {[42, 60, 34, 52, 40, 66].map((hp, i) => (
          <div key={i} className={clsx(P1, "rounded-[3px]")} style={{ height: `${hp}%` }} />
        ))}
      </div>)}
      {v === "swiss" && (<div className="relative h-full">
        <div className={clsx(S, P1)} style={{ inset: "8% 42% 52% 8%", background: "#f2ede6" }} />
        <div className={clsx(S, H)} style={{ inset: "54% 58% 8% 8%" }} />
        <div className={clsx(S, P1)} style={{ inset: "48% 8% 24% 44%" }} />
      </div>)}
      {v === "broken" && (<>
        <div className={clsx(S, P1)} style={{ inset: "12% 30% 44% 14%", transform: "rotate(-4deg)" }} />
        <div className={clsx(S, P1, H)} style={{ inset: "38% 18% 22% 52%", transform: "rotate(3deg)" }} />
        <div className={clsx(S, P1)} style={{ inset: "64% 50% 10% 20%" }} />
      </>)}
      {v === "fullbleed" && (<>
        <div className="absolute inset-0 bg-gradient-to-br from-ember/50 to-signal/40" />
        <div className="absolute inset-x-0 bottom-3 text-center font-display text-lg font-black text-ivory">FULL BLEED</div>
      </>)}
      {v === "split" && (<>
        <div className={clsx(S, P1, H)} style={{ inset: "0 50% 0 0" }} />
        <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-center font-display text-sm font-black text-ivory">SPLIT</div>
      </>)}
      {v === "overlap" && (<>
        <div className={clsx(S, P1)} style={{ inset: "14% 34% 40% 10%" }} />
        <div className={clsx(S, P1, H)} style={{ inset: "34% 18% 26% 40%" }} />
        <div className={clsx(S, P1)} style={{ inset: "56% 40% 10% 24%", opacity: 0.9 }} />
      </>)}
      {v === "floating" && (<>
        <div className={clsx(S, P1)} style={{ inset: "16% 44% 42% 12%", boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }} />
        <div className={clsx(S, P1)} style={{ inset: "30% 12% 34% 60%", boxShadow: "0 14px 30px rgba(0,0,0,0.55)" }} />
        <div className={clsx(S, P1, H)} style={{ inset: "58% 50% 14% 22%", boxShadow: "0 18px 36px rgba(0,0,0,0.6)" }} />
      </>)}
      {v === "layers" && (<>
        <div className={clsx(S, P1)} style={{ inset: "10% 20%" }} />
        <div className={clsx(S, P1)} style={{ inset: "22% 32% 22% 12%", transform: "translateY(6px)" }} />
        <div className={clsx(S, P1, H)} style={{ inset: "38% 14% 14% 34%", transform: "translateY(12px)" }} />
      </>)}
      {v === "horizontal" && (<div className="flex h-full items-center gap-2 overflow-hidden">
        {[0, 1, 2].map(i => <div key={i} className={clsx(P1, "h-3/4 w-2/3 shrink-0 rounded-md", i === 1 && H)} />)}
      </div>)}
      {v === "canvas" && (<>
        <div className={clsx("absolute left-8 top-6 size-10 rounded-full border border-dashed border-flare/50")} />
        <div className={clsx(S, P1, H)} style={{ left: "52%", top: "34%", width: "26%", height: "20%", transform: "rotate(8deg)" }} />
        <div className={clsx("absolute bottom-6 left-[18%] font-mono text-[8px] text-smoke")}>∞ canvas</div>
      </>)}
      {v === "hero" && (<>
        <div className="absolute inset-x-4 top-5 h-2 w-1/2 rounded bg-wall" />
        <div className="absolute inset-x-4 top-9 h-1.5 w-2/3 rounded bg-wall/60" />
        <div className={clsx(S, H)} style={{ inset: "auto 36% 18% auto", height: 16, width: 40 }} />
      </>)}
      {v === "asymhero" && (<>
        <div className={clsx(S, P1, H)} style={{ inset: "14% 30% 20% 10%" }} />
        <div className="absolute right-[8%] top-[14%] font-display text-lg font-black text-ivory">Aa</div>
        <div className="absolute bottom-[16%] right-[14%] h-1.5 w-16 rounded bg-wall" />
      </>)}
      {v === "diagonal" && (<>
        <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 78%)", background: "rgba(255,92,28,0.5)" }} />
        <div className="absolute bottom-2 right-3 font-display text-sm font-black text-ivory">↘</div>
      </>)}
      {v === "editorial" && (<div className="absolute inset-x-4 inset-y-3 columns-2 gap-2">
        <div className="mb-1 h-full w-full columns-2">
          <div className="h-1 w-3/4 rounded bg-wall" />
          <div className="mt-1 space-y-1">
            {[...Array(7)].map((_, i) => <div key={i} className="h-[3px] rounded bg-wall/70" style={{ width: `${100 - (i % 3) * 9}%` }} />)}
          </div>
          <div className="mt-2 break-inside-avoid rounded-sm border border-line bg-panel" style={{ height: 30 }} />
        </div>
      </div>)}
      {v === "vertical" && (<div className="absolute inset-x-4 inset-y-2 space-y-1.5">
        {[...Array(7)].map((_, i) => <div key={i} className="h-[5px] rounded bg-wall/80" style={{ width: `${80 - i * 6}%` }} />)}
      </div>)}
      {!["bento", "asymmetric", "modular", "masonry", "swiss", "broken", "fullbleed", "split", "overlap", "floating", "layers", "horizontal", "canvas", "hero", "asymhero", "diagonal", "editorial", "vertical"].includes(v) && (
        <div className="grid h-full grid-cols-3 gap-1">{[...Array(6)].map((_, i) => <div key={i} className={clsx(P1, "rounded-[3px]")} />)}</div>
      )}
    </div>
  );
}

/* ============================ color/material tiles ============================ */

export function DmRamp(p: PreviewProps) {
  const colors = numP(p.params, "colors", 7);
  return (
    <div className="absolute inset-0 flex bg-ink">
      {Array.from({ length: colors }, (_, i) => {
        const f = i / (colors - 1);
        return <div key={i} className="flex-1" style={{ background: `hsl(${18 + f * 8} ${30 + f * 60}% ${8 + f * 84}%)` }} />;
      })}
    </div>
  );
}
export function DmGradient(p: PreviewProps, variant?: string) {
  const colors = numP(p.params, "colors", 3);
  const stops = ["#ff5c1c", "#ff2e4d", "#ffb85c", "#7c3aed", "#0ea5e9"].slice(0, clamp(colors, 2, 5));
  return (
    <div className="absolute inset-0" style={{
      background: variant === "conic"
        ? `conic-gradient(from 180deg at 50% 50%, ${stops.join(",")}, ${stops[0]})`
        : `linear-gradient(115deg, ${stops.join(",")})`,
    }} />
  );
}
export function DmConic(p: PreviewProps) { return DmGradient(p, "conic"); }
export function DmDuotone(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="text-center" style={{ filter: "sepia(1) saturate(8) hue-rotate(-20deg) contrast(1.15) brightness(0.85)" }}>
        <div className="size-14 rounded-full bg-gradient-to-br from-ivory to-ash" />
      </div>
    </div>
  );
}
export function DmHolo(p: PreviewProps) {
  const [a, setA] = useState(200);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setA(140 + ((now - s0) / 8) % 200); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 bg-ink">
      <div className="absolute inset-[18%] rounded-xl"
        style={{
          background: `linear-gradient(${a}deg, rgba(255,92,28,.6), rgba(255,184,92,.5), rgba(124,58,237,.5), rgba(14,165,233,.5), rgba(255,92,28,.6))`,
          filter: "saturate(1.5)",
        }} />
      <span className="absolute bottom-1.5 left-2 font-mono text-[8px] text-smoke">∠{Math.round(a)}°</span>
    </div>
  );
}
export function DmChrome(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <span className="font-display text-2xl font-black uppercase" style={{
        backgroundImage: "linear-gradient(180deg,#fdfdfd 0%,#8a8a93 38%,#3a3a44 50%,#c8c8d2 62%,#7a7a86 78%,#e8e8f0 100%)",
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        transform: "skewX(0deg)",
      }}>CHROME</span>
    </div>
  );
}
export function DmGlass(p: PreviewProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute left-[12%] top-[18%] size-10 rounded-full bg-ember/80 blur-[2px]" />
      <div className="absolute bottom-[14%] right-[16%] size-8 rounded-full bg-signal/70 blur-[1px]" />
      <div className="absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/20"
        style={{ background: "rgba(242,237,230,0.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />
    </div>
  );
}
export function DmMetal(p: PreviewProps) {
  return (
    <div className="absolute inset-0"
      style={{
        background: INK_COLOR(p, "// brushed lines"),
      }} />
  );
}
function INK_COLOR(_p: PreviewProps, _c: string) {
  return "repeating-linear-gradient(0deg, rgba(180,180,190,0.16) 0 1px, transparent 1px 3px), linear-gradient(115deg, #1a1a20, #34343e 45%, #1a1a20)";
}
export function DmPaper(p: PreviewProps) {
  return (
    <div className="absolute inset-0 bg-[#efe7dc] p-2">
      <div className="h-1 w-1/2 rounded bg-[#3b3025]/70" />
      <div className="mt-1 space-y-0.5">
        {[...Array(4)].map((_, i) => <div key={i} className="h-[3px] rounded bg-[#3b3025]/40" style={{ width: `${90 - i * 12}%` }} />)}
      </div>
      <span className="absolute right-1.5 top-1.5 font-serif text-[9px] italic text-[#3b3025]/60">№7</span>
    </div>
  );
}
export function DmConcrete(p: PreviewProps) {
  return (
    <div className="absolute inset-0 bg-[#6b6a68] p-2" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.14) 12%, transparent 13%)", backgroundSize: "9px 9px" }}>
      <div className="h-[3px] w-2/3 rounded bg-[#2c2b29]/70" />
      <div className="mt-1 h-[3px] w-1/2 rounded bg-[#2c2b29]/45" />
    </div>
  );
}

/* ============================ structure / site tiles ============================ */

export function DmSite(p: PreviewProps) {
  const tone = strP(p.params, "tone", "") || "default";
  void tone;
  return (
    <div className="absolute inset-0 bg-ink p-[5%]">
      <div className="mb-[4%] flex items-center justify-between">
        <div className="h-[5px] w-[14%] rounded-full bg-ember/80" />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => <div key={i} className="h-[3px] w-[7%] min-w-3 rounded bg-wall" />)}
        </div>
      </div>
      <div className="mb-[5%]">
        <div className="h-[9px] w-[52%] rounded bg-ivory/90" />
        <div className="mt-[3%] h-[4px] w-[38%] rounded bg-wall" />
      </div>
      <div className="grid grid-cols-3 gap-[3%]">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-[3px] border border-line bg-panel p-[6%]">
            <div className="mb-[10%] h-[3px] w-2/3 rounded bg-flare/50" />
            <div className="h-[2px] w-full rounded bg-wall" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DmDirection(p: PreviewProps) {
  // swatch-led identity tiles: name mocked by hash of params (deterministic look per module)
  const seed = strP(p.params, "__seed", "") || JSON.stringify(p.params);
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  return (
    <div className="absolute inset-0 bg-ink p-[6%]">
      <div className="flex h-[58%] gap-[3%]">
        <div className="flex-1 rounded-[3px]" style={{ background: `hsl(${hue} 60% 52%)` }} />
        <div className="flex w-[30%] flex-col gap-[6%]">
          <div className="h-4 rounded-sm" style={{ background: `hsl(${(hue + 160) % 360} 55% 60%)` }} />
          <div className="flex-1 rounded-[3px] border border-line bg-panel" />
        </div>
      </div>
      <div className="mt-[8%] font-display text-[15px] font-black uppercase tracking-wide text-ivory">
        Direction
        <span className="ml-2 font-mono text-[8px] font-normal text-smoke">study №{Math.abs(hash) % 97}</span>
      </div>
    </div>
  );
}

/* helper injected into DmDirection: params carry module seed via callers below */
export function DmDirectionSeeded(p: PreviewProps & { seedLabel?: string }) {
  return DmDirection({ ...p, params: { ...p.params, __seed: p.seedLabel ?? JSON.stringify(p.params) } });
}

/* ============================ interaction tiles ============================ */

export function DmCards(p: PreviewProps) {
  const [sel, setSel] = useState(-1);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % 3; setSel(i); }, 1100);
    return () => clearInterval(id);
  }, [p.animate, p.still]);
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="flex gap-2.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={clsx("h-14 w-11 rounded-md border border-line bg-panel", T)}
            style={{
              transform: sel === i ? "translateY(-6px) scale(1.06)" : "none",
              borderColor: sel === i ? "#ff5c1c" : undefined,
            }}>
            <div className="m-1.5 h-1.5 w-2/3 rounded bg-wall" />
            <div className="m-1.5 h-1 w-1/2 rounded" style={{ background: sel === i ? "#ffb85c" : "#2b2b31" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DmDrag(p: PreviewProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - s0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const x = Math.sin(t * 1.3) * 34;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="relative h-14 w-40 rounded-md border border-dashed border-wall/60">
        <div className="absolute inset-y-1 w-8 rounded-md bg-ember"
          style={{ left: `calc(50% - 16px + ${x}px)`, transition: "left 100ms linear" }} />
        <span className="absolute -bottom-5 w-full text-center font-mono text-[8px] text-smoke">drag ↔</span>
      </div>
    </div>
  );
}

export function DmHoverPrev(p: PreviewProps) {
  const [hov, setHov] = useState(-1);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let i = -1;
    const id = setInterval(() => { i = i === 2 ? 0 : i + 1; setHov(i); }, 1300);
    return () => clearInterval(id);
  }, [p.animate, p.still]);
  const names = ["home", "work", "journal"];
  return (
    <div className="absolute inset-0 flex bg-ink p-2">
      <div className="w-14 space-y-1.5">
        {names.map((n, i) => (
          <div key={n} className={clsx("font-mono text-[9px]", T, hov === i ? "text-flare" : "text-smoke")}>{n}</div>
        ))}
      </div>
      <div className={clsx("flex-1 rounded-md border border-line bg-panel", T)}
        style={{ opacity: hov >= 0 ? 1 : 0.3 }}>
        <div className="m-2 h-[3px] w-1/2 rounded bg-ember/60" />
        <div className="mx-2 mt-1 h-[2px] w-2/3 rounded bg-wall" />
      </div>
    </div>
  );
}

export function DmDisclosure(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const id = setInterval(() => setOpen(v => !v), 1600); return () => clearInterval(id); }, []);
  const v = p.animate ? open : true;
  return (
    <div className="absolute inset-0 bg-ink p-3">
      <div className="rounded border border-line bg-panel p-2 font-mono text-[9px] text-fog">
        <span className="mr-1.5 inline-block text-ember" style={{ transform: `rotate(${v ? 90 : 0}deg)`, transition: "transform .4s" }}>▸</span>
        Details
      </div>
      <div className="grid transition-all duration-500" style={{ gridTemplateRows: v ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="ml-2 mt-1.5 space-y-1 border-l border-line pl-2">
            {[80, 64, 52].map(wp => <div key={wp} className="h-1 rounded bg-wall" style={{ width: `${wp}%` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DmRadial(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const id = setInterval(() => setOpen(v => !v), 1800); return () => clearInterval(id); }, []);
  const v = p.animate ? open : true;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="relative">
        <div className="grid size-8 place-items-center rounded-full bg-ember font-mono text-ivory">+</div>
        {[0, 1, 2, 3].map(i => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
          const r = v ? 26 : 0;
          return (
            <div key={i} className="absolute left-1/2 top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-panel"
              style={{ transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px))`, transition: `transform 400ms cubic-bezier(.2,1.4,.3,1) ${i * 50}ms` }}>
              <span className="size-1 rounded-full bg-flare" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DmSpy(p: PreviewProps) {
  return (
    <ScrollMeter animate={p.animate} still={p.still}>
      {(pr) => (
        <div className="flex h-full gap-2 p-2.5">
          <div className="w-11 space-y-1.5 pt-1">
            {["one", "two", "three"].map((s, i) => (
              <div key={s} className={clsx("border-l-2 pl-1.5 font-mono text-[8px]", T,
                Math.floor(pr * 3) === i ? "border-ember text-flare" : "border-line text-smoke")}>{s}</div>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-6 rounded border border-line bg-panel" style={{
                opacity: 0.3 + clamp(1 - Math.abs(pr * 2 - i), 0, 1) * 0.7,
              }} />
            ))}
          </div>
        </div>
      )}
    </ScrollMeter>
  );
}

export function DmPalette(p: PreviewProps) {
  const staticOff = p.animate && !p.still;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink/90">
      <div className="w-4/5 rounded-lg border border-line bg-panel p-1.5 shadow-2xl">
        <div className="flex items-center gap-1 rounded bg-wall px-1.5 py-0.5 font-mono text-[8px] text-smoke">
          <span className="text-ember">⌘</span>{staticOff ? "sett…" : "⌘K command…"}
        </div>
        <div className="mt-1 space-y-0.5">
          {["Open module", "Compile prompt", "Export JSON"].map((it, i) => (
            <div key={it} className={clsx("rounded px-1.5 py-0.5 font-mono text-[8px]", i === 0 ? "bg-ember/20 text-flare" : "text-smoke")}>{it}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DmSwipe(p: PreviewProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!p.animate || p.still) return;
    let raf = 0; const s0 = performance.now();
    const loop = (now: number) => { raf = requestAnimationFrame(loop); setT((now - s0) / 1000); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.animate, p.still]);
  const ph = t % 2;
  const cu = ph < 1 ? ph : 2 - ph;
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-ink">
      <div className="relative h-16 w-24 overflow-hidden rounded-md border border-line">
        <div className={clsx("absolute inset-0 grid place-items-center bg-panel font-mono text-[9px] text-fog")}
          style={{ transform: `translateX(${(cu - 0.5) * 40}%)` }}>slide A</div>
        <div className={clsx("absolute inset-0 grid place-items-center bg-ember/20 font-mono text-[9px] text-flare")}
          style={{ transform: `translateX(${100 + (cu - 0.5) * 40}%)` }}>slide B</div>
      </div>
    </div>
  );
}

export function DmForms(p: PreviewProps) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), 1500); return () => clearInterval(id); }, []);
  const v = p.animate ? on : true;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink px-4">
      <div className="w-full space-y-1.5">
        <div className={clsx("rounded border bg-panel px-2 py-1.5 font-mono text-[8px]", T, v ? "border-signal/60" : "border-blood/60")}>
          <span className={v ? "text-fog" : "text-blood"}>{v ? "forge@arena.dev ✓" : "forge@arena…"}</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[7.5px]" style={{ color: v ? "#34d399" : "#ff2e4d" }}>
          {v ? "✓ valid — saved" : "✗ complete the input"}
        </div>
      </div>
    </div>
  );
}

export function DmDiagram(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="relative">
        <div className="grid size-8 place-items-center rounded border border-ember bg-panel font-mono text-[8px] text-flare">core</div>
        {[0, 1, 2].map(i => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(calc(-50% + ${Math.cos(a) * 34}px), calc(-50% + ${Math.sin(a) * 22}px))` }}>
              <div className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[7px] text-fog hover:border-ember">n{i}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DmSpatial(p: PreviewProps) {
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 };
    const onKey = (e: KeyboardEvent) => { if (map[e.key]) setSel(v => clamp(v + (map[e.key] ?? 0), 0, 5)); };
    window.addEventListener("keydown", onKey);
    const id = setInterval(() => setSel(v => (v + 1) % 6), 1200);
    return () => { window.removeEventListener("keydown", onKey); clearInterval(id); };
  }, []);
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="grid grid-cols-3 gap-1.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={clsx("grid size-6 place-items-center rounded-sm font-mono text-[8px]", T,
            sel === i ? "bg-ember/25 text-flare ring-1 ring-ember" : "bg-panel text-smoke")}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
}

/* ============================ engineering tiles ============================ */

export function DmAccess(p: PreviewProps, variant?: string) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1400);
    return () => clearInterval(id);
  }, []);
  const v = p.animate ? pulse : true;
  if (variant === "motion") return (
    <div className="absolute inset-0 grid place-items-center gap-2 bg-ink">
      <div className={clsx("size-8 rounded-full bg-ember", T)} style={{ transform: v && !p.still ? "translateY(-8px)" : "none" }} />
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[8px] text-smoke">motion</span>
        <div className="relative h-2.5 w-5 rounded-full bg-wall"><div className={clsx("absolute top-0.5 size-1.5 rounded-full bg-signal", T)} style={{ left: v ? 2 : 12 - 6 + 2 }} /></div>
        <span className="font-mono text-[8px] text-signal/80">reduced</span>
      </div>
    </div>
  );
  if (variant === "focus") return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className={clsx("rounded px-3 py-1.5 font-mono text-[9px]", T,
        v ? "ring-2 ring-ember text-ivory bg-panel" : "text-smoke bg-panel")}>
        focus-visible {v && "●"}
      </div>
    </div>
  );
  if (variant === "sr") return (
    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink">
      {[12, 20, 10, 16].map((h, i) => (
        <span key={i} className={clsx("w-1 rounded bg-ember", T)}
          style={{ height: v && p.animate ? h + ((i * 7) % 9) : h }} />
      ))}
      <span className="sr-only">aria-live narration status</span>
    </div>
  );
  return (
    <div className="absolute inset-0 grid place-items-center gap-1 bg-ink">
      <div className="grid size-6 place-items-center rounded border border-signal/50 font-mono text-[10px] text-signal">44</div>
      <span className="font-mono text-[8px] text-smoke">min target px</span>
    </div>
  );
}

export function DmPerf(p: PreviewProps, variant?: string) {
  const v = variant ?? "budget";
  const labels: Record<string, string> = {
    budget: "GPU ≤ 60fps", lazy: "idle → mount on view", power: "adaptive quality", bundle: "≤ 350KB",
  };
  return (
    <div className="absolute inset-0 bg-ink p-2.5">
      <div className="flex items-center gap-1 font-mono text-[8px] text-smoke">
        <span className="size-1.5 rounded-full bg-signal" /> {v} budget on
      </div>
      <div className="mt-2 space-y-1">
        {[["ms", 68], ["kb", 42], ["fps", 92]].map(([label, pct]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-5 font-mono text-[7px] text-smoke">{label}</span>
            <div className="h-1 flex-1 rounded bg-wall">
              <div className={clsx("h-1 rounded bg-signal/80", T)} style={{ width: `${p.animate ? pct : 40}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DmVitals(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-3 place-items-center gap-1 bg-ink px-2">
      {[["LCP", "1.8"], ["INP", "ms"], ["CLS", "0.02"]].map(([k, val]) => (
        <div key={k} className="text-center">
          <div className="relative mx-auto grid size-9 place-items-center rounded-full border-2 border-signal/80 font-mono text-[8px] text-ivory">
            {val}
          </div>
          <span className="font-mono text-[7px] text-smoke">{k}</span>
        </div>
      ))}
    </div>
  );
}

export function DmMedia(p: PreviewProps) {
  const [q, setQ] = useState(0);
  useEffect(() => { const id = setInterval(() => setQ(v => (v + 1) % 3), 1300); return () => clearInterval(id); }, []);
  const v = p.animate ? q : 2;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className={clsx("grid size-14 place-items-center rounded-md border border-line", T)}
        style={{ background: `rgba(255,92,28,${0.1 + v * 0.12})`, filter: v === 0 ? "blur(2px)" : v === 1 ? "blur(0.5px)" : "none" }}>
        <span className="font-mono text-[8px] text-fog">{["lqip", "webp", "avif"][v]}</span>
      </div>
    </div>
  );
}

export function DmFallback(p: PreviewProps) {
  const [gl, setGlOk] = useState(true);
  useEffect(() => { const id = setInterval(() => setGlOk(v => !v), 1700); return () => clearInterval(id); }, []);
  const v = p.animate ? gl : true;
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      {v ? (
        <span className="font-mono text-[9px] text-signal">◉ WebGL ✓</span>
      ) : (
        <span className="font-mono text-[9px] text-flare">◌ 2D gradient fallback</span>
      )}
    </div>
  );
}

export function DmResponsive(p: PreviewProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink">
      <div className="text-center">
        <span className="font-display font-black text-ivory" style={{ fontSize: "clamp(12px, 14cqw, 26px)", containerType: "inline-size" } as object}>
          fluid(aa)
        </span>
        <div className="mt-1 h-px bg-gradient-to-r from-ember to-transparent" />
        <span className="font-mono text-[7.5px] text-smoke">clamp(min, fluid, max)</span>
      </div>
    </div>
  );
}

/* container for Layout variant factory */
export function makeLayoutPreview(variant: string) {
  return function LayoutVariant(p: PreviewProps) {
    return DmLayout(p, variant);
  };
}

export function makeAccessPreview(variant: string) {
  return function AccessVariant(p: PreviewProps) {
    return DmAccess(p, variant);
  };
}

export function makePerfPreview(variant: string) {
  return function PerfVariant(p: PreviewProps) {
    return DmPerf(p, variant);
  };
}
