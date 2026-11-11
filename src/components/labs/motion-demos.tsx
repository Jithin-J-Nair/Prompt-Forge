"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasDemo, DemoTile, LabSlider, clamp, fbm, makeNoise2D, mulberry32, useReducedMotion } from "./lab-shell";

const INK = "#070708";
const EMBER = "#ff5c1c";
const FLARE = "#ffb85c";
const IVORY = "#f2ede6";

/* ------------------------------ text demos (DOM) ------------------------------ */

export function ScrambleDemo() {
  const reduced = useReducedMotion();
  const [duration, setDuration] = useState(900);
  const [text, setText] = useState("PROMPTFORGE");
  const chars = "!<>-_\\/[]{}—=+*^?#";
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (reduced) return; // reduced motion prints instantly (rendered as `text` below)
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out += i < reveal ? text[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(p < 1 ? out : text);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
     
  }, [text, duration, reduced]);
  return (
    <DemoTile title="Decode / Scramble Text" moduleId="typography/word-scramble"
      note="Grapheme-safe scramble revealing left→right; click the word to re-run. Reduced motion prints instantly.">
      <button
        className="grid size-full cursor-pointer place-items-center bg-ink font-mono text-2xl tracking-[0.3em] text-ember md:text-3xl"
        onClick={() => setText(ROTA[Math.floor(Math.random() * ROTA.length)])}
        aria-label="Replay scramble with a new word"
      >
        <span aria-live="polite">{reduced ? text : display}</span>
      </button>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="duration" value={duration} min={300} max={2400} step={50} unit="ms" onChange={setDuration} />
      </div>
    </DemoTile>
  );
}
const ROTA = ["PROMPTFORGE", "CREATIVE TECH", "KINETIC TYPE", "SCROLL-DRIVEN", "COMPILER"];

export function MarqueeDemo() {
  const [dur, setDur] = useState(18);
  return (
    <DemoTile title="Infinite Marquee" moduleId="motion/marquee"
      note="Doubled strip translating −50% — the seam is invisible by construction. Hover pauses.">
      <div className="flex size-full flex-col justify-center gap-4 overflow-hidden bg-ink">
        {[0, 1].map((row) => (
          <div key={row} className="group relative overflow-hidden border-y border-line py-2">
            <div
              className="flex w-max whitespace-nowrap group-hover:[animation-play-state:paused]"
              style={{ animation: `marquee ${dur + row * 6}s linear infinite`, animationDirection: row ? "reverse" : "normal" }}
            >
              {[0, 1].map((dup) => (
                <span key={dup} aria-hidden={dup === 1} className="pr-8 font-display text-xl font-bold uppercase tracking-widest text-ivory/85">
                  AWARD-GRADE · TECHNICAL · EDITORIAL · KINETIC · GENERATIVE ·
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="loop" value={dur} min={6} max={60} unit="s" onChange={setDur} />
      </div>
    </DemoTile>
  );
}

export function CharStaggerDemo() {
  const reduced = useReducedMotion();
  const [stagger, setStagger] = useState(28);
  const [key, setKey] = useState(0);
  const word = "OVERSIZED";
  return (
    <DemoTile title="Character Stagger Reveal" moduleId="typography/character-animation"
      note="Each glyph rises from behind its line's overflow mask with a power-stagger — click to replay.">
      <button className="flex size-full cursor-pointer items-center justify-center bg-ink" onClick={() => setKey((k) => k + 1)} aria-label="Replay character stagger">
        <span className="sr-only" key="sr-label">{word}</span>
        <span aria-hidden="true" className="flex" key={`replay-${key}`}>
          {word.split("").map((c, i) => (
            <span key={`glyph-${i}`} className="inline-block overflow-hidden">
              <span
                className="inline-block font-display text-4xl font-black text-ivory md:text-5xl"
                style={{
                  transform: reduced ? "none" : undefined,
                  animation: reduced ? "none" : `charup 0.9s cubic-bezier(.2,.7,.2,1) both`,
                  animationDelay: `${i * stagger}ms`,
                }}
              >
                {c === " " ? " " : c}
              </span>
            </span>
          ))}
        </span>
      </button>
      <style>{`@keyframes charup { from { transform: translateY(115%) rotate(6deg); } to { transform: none; } }`}</style>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="stagger" value={stagger} min={0} max={90} unit="ms" onChange={setStagger} />
      </div>
    </DemoTile>
  );
}

export function GradientSweepDemo() {
  const [angle, setAngle] = useState(110);
  return (
    <DemoTile title="Animated Gradient Type" moduleId="typography/gradient-type"
      note="background-clip:text over a wide gradient; the sweep animates background-position — respects reduced motion.">
      <div className="grid size-full place-items-center bg-ink">
        <span
          className="bg-clip-text font-display text-5xl font-black tracking-tight text-transparent md:text-6xl"
          style={{
            backgroundImage: `linear-gradient(${angle}deg, #ff5c1c, #ffb85c 30%, #ff2e4d 50%, #ff5c1c 75%, #ffb85c)`,
            backgroundSize: "300% 100%",
            animation: "sweep 6s ease-in-out infinite",
          }}
        >
          SHOJI
        </span>
      </div>
      <style>{`@keyframes sweep { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="angle" value={angle} min={0} max={180} unit="°" onChange={setAngle} />
      </div>
    </DemoTile>
  );
}

export function PathTextDemo() {
  const [speed, setSpeed] = useState(1);
  return (
    <DemoTile title="Text on a Path" moduleId="motion/type-on-scroll-path"
      note="Type flows along a live SVG path whose curvature breathes — startOffset animates the journey.">
      <div className="grid size-full place-items-center bg-ink">
        <svg viewBox="0 0 320 160" className="h-full w-full">
          <defs>
            <path id="pf-path" d="M 20 120 C 80 20, 240 200, 300 60" fill="none" />
          </defs>
          <use href="#pf-path" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
          <text fontSize="13" fill={EMBER} fontFamily="JetBrains Mono Variable, monospace" letterSpacing="3">
            <textPath href="#pf-path" startOffset="0%">
              FLOW · ALONG · THE · CURVE ·
              <animate attributeName="startOffset" from="0%" to="45%" dur={`${6 / speed}s`} repeatCount="indefinite" />
            </textPath>
          </text>
          <text fontSize="13" fill="rgba(255,184,92,0.5)" fontFamily="JetBrains Mono Variable, monospace" letterSpacing="3">
            <textPath href="#pf-path" startOffset="-45%">
              FLOW · ALONG · THE · CURVE ·
              <animate attributeName="startOffset" from="-45%" to="0%" dur={`${6 / speed}s`} repeatCount="indefinite" />
            </textPath>
          </text>
        </svg>
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="speed" value={speed} min={0.2} max={3} step={0.1} unit="×" onChange={setSpeed} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ scroll demos (self-driven scrollport) -------------- */

function MiniScroll({ children, height = 220 }: { children: React.ReactNode; height?: number }) {
  return (
    <div
      className="h-full w-full overflow-y-auto rounded bg-ink"
      style={{ scrollbarWidth: "thin" }}
      aria-label="Demo scroll area"
    >
      <div style={{ minHeight: height * 2.2 }} className="px-4 py-6">{children}</div>
    </div>
  );
}

export function ScrollRevealDemo() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const items = host.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.setAttribute("data-in", "1")),
      { root: host.querySelector("[data-scrollport]"), threshold: 0.25 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  const blocks = ["FOUNDRY", "SIGNAL", "ORBIT", "LATTICE"];
  return (
    <DemoTile title="Scroll Reveal (IntersectionObserver)" moduleId="motion/scroll-reveal"
      note="Real IO-driven reveals inside the scrollport at left — scroll down to trigger; never re-hides.">
      <div ref={hostRef} className="relative h-full">
        <div data-scrollport className="h-full overflow-y-auto">
          <MiniScroll>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">↓ scroll the panel</p>
            {blocks.map((b, i) => (
              <div key={b} className="mb-8">
                <div
                  data-reveal
                  className="translate-y-6 opacity-0 transition-all duration-700 ease-out data-[in=1]:translate-y-0 data-[in=1]:opacity-100"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <h4 className="font-display text-3xl font-black text-ivory">{b}</h4>
                  <div className="mt-2 h-px w-2/3 bg-line" />
                  <p className="mt-2 max-w-[24ch] text-[12px] text-fog">Revealed exactly once, at 25% visibility.</p>
                </div>
              </div>
            ))}
          </MiniScroll>
        </div>
      </div>
    </DemoTile>
  );
}

export function ScrollScrubDemo() {
  const [p, setP] = useState(0);
  const portRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = portRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <DemoTile title="Scroll Scrub Binding" moduleId="motion/scroll-scrub"
      note="Progress 0→1 directly mapped from scrollTop — the bar, ring and index counter all scrub the same timeline.">
      <div className="flex h-full">
        <div className="flex w-1/2 flex-col items-center justify-center gap-4 border-r border-line">
          <div className="h-28 w-3 overflow-hidden rounded-full bg-steel">
            <div className="w-full bg-ember" style={{ height: `${p * 100}%` }} />
          </div>
          <svg viewBox="0 0 60 60" className="size-16 -rotate-90">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#26262c" strokeWidth="4" />
            <circle cx="30" cy="30" r="26" fill="none" stroke={FLARE} strokeWidth="4"
              strokeDasharray={`${p * 163.4} 163.4`} strokeLinecap="round" />
          </svg>
          <span className="font-mono text-lg text-ember">{String(Math.round(p * 9) + 1).padStart(2, "0")}/10</span>
        </div>
        <div ref={portRef} className="h-full w-1/2 overflow-y-auto">
          <MiniScroll>
            <p className="sticky top-2 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">scroll ↓</p>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-10 mt-6 rounded border border-line bg-carbon/60 p-3 text-[11px] text-fog">
                Beat {i + 1} — the ring and bar on the left are driven by your scroll position, not time.
              </div>
            ))}
          </MiniScroll>
        </div>
      </div>
    </DemoTile>
  );
}

export function ScrollPinDemo() {
  const portRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = portRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const stage = Math.min(2, Math.max(0, Math.floor(p * 3)));
  return (
    <DemoTile title="Pinned Stage Swap" moduleId="motion/sticky-pinning"
      note="The left stage stays pinned (sticky) while scrolling through steps — the stage content swaps per beat.">
      <div className="flex h-full">
        <div className="relative w-1/2 border-r border-line">
          <div className="sticky top-0 flex h-40 flex-col items-center justify-center bg-carbon/50">
            {["DISCOVER", "SHAPE", "SHIP"].map((s, i) => (
              <h4 key={s} className={`absolute font-display text-2xl font-black transition-all duration-500 ${stage === i ? "scale-100 text-ember opacity-100" : "scale-90 opacity-0"}`}>{s}</h4>
            ))}
          </div>
        </div>
        <div ref={portRef} className="h-full w-1/2 overflow-y-auto">
          <MiniScroll>
            {["Raw intent", "System design", "Production craft"].map((t, i) => (
              <div key={t} className="mb-12 mt-8 text-[11px] text-fog">
                <span className="font-mono text-ember">0{i + 1}</span> — {t}. Keep scrolling; the stage re-reads each beat.
                <div className="mt-3 h-20 rounded border border-line bg-carbon/40" />
              </div>
            ))}
          </MiniScroll>
        </div>
      </div>
    </DemoTile>
  );
}

export function ParallaxDemo() {
  const portRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = portRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <DemoTile title="Multi-Layer Parallax" moduleId="motion/multi-layer-parallax"
      note="Three depth layers translate at 0.3 / 0.6 / 1.0 factors — pure transform, compositor-only.">
      <div ref={portRef} className="relative h-full overflow-y-auto">
        <div className="relative h-[220%]">
          <div className="sticky top-0 h-40 overflow-hidden">
            {[
              { f: 0.28, items: ["◐", "◑", "◒"], size: 90, light: 0.12 },
              { f: 0.55, items: ["▲", "■", "●"], size: 56, light: 0.3 },
              { f: 1.0, items: ["01", "02", "03"], size: 30, light: 0.9 },
            ].map((layer, li) => (
              <div key={li} className="absolute inset-0" style={{ transform: `translateY(${-p * 260 * layer.f}px)` }}>
                {layer.items.map((g, i) => (
                  <span key={i} className="absolute font-display font-black"
                    style={{
                      left: `${12 + i * 32}%`, top: `${42 - li * 6}px`, fontSize: layer.size,
                      color: `rgba(255,${92 + li * 40},${28 + li * 30},${layer.light + 0.25})`,
                    }}>
                    {g}
                  </span>
                ))}
              </div>
            ))}
            <span className="absolute bottom-2 left-3 font-mono text-[10px] text-smoke">scroll the scene ↓</span>
          </div>
        </div>
      </div>
    </DemoTile>
  );
}

export function MaskRevealDemo() {
  const [key, setKey] = useState(0);
  return (
    <DemoTile title="Clip Path Mask Reveal" moduleId="motion/text-mask-reveal"
      note="inset(0 100% 0 0) → inset(0) with a bezier that starts hard and lands soft. Click to replay.">
      <button className="relative grid size-full cursor-pointer place-items-center overflow-hidden bg-ink" onClick={() => setKey((k) => k + 1)} aria-label="Replay mask reveal">
        <div key={key} className="h-28 w-3/4" style={{ animation: "maskIn 1s cubic-bezier(.7,0,.2,1) both", background: `repeating-linear-gradient(45deg, ${EMBER}, ${EMBER} 8px, ${FLARE} 8px, ${FLARE} 16px)` }} />
      </button>
      <style>{`@keyframes maskIn { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }`}</style>
    </DemoTile>
  );
}

/* ------------------------------ cursor / physics demos ------------------------------ */

export function CursorDemo() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let raf = 0;
    const pos = { x: 80, y: 60 };
    const ring = { x: 80, y: 60 };
    const target = { x: 80, y: 60 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    };
    host.addEventListener("pointermove", onMove);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      pos.x += (target.x - pos.x) * (reduced ? 1 : 0.55);
      pos.y += (target.y - pos.y) * (reduced ? 1 : 0.55);
      ring.x += (target.x - ring.x) * (reduced ? 1 : 0.14);
      ring.y += (target.y - ring.y) * (reduced ? 1 : 0.14);
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%)`;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); host.removeEventListener("pointermove", onMove); };
  }, [reduced]);
  return (
    <DemoTile title="Dual-Layer Custom Cursor" moduleId="motion/custom-cursor"
      note="Instant dot + lerped trailing ring (two different follow constants) composited inside the panel.">
      <div ref={hostRef} className="relative size-full cursor-none overflow-hidden bg-ink">
        <div ref={dotRef} className="pointer-events-none absolute size-1.5 rounded-full bg-ember" />
        <div ref={ringRef} className="pointer-events-none absolute size-8 rounded-full border border-ember/70" />
        <p className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[11px] text-smoke">move your pointer here</p>
      </div>
    </DemoTile>
  );
}

export function MagneticDemo() {
  const [strength, setStrength] = useState(0.45);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const host = hostRef.current, btn = btnRef.current;
    if (!host || !btn) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const pull = d < 160 ? (1 - d / 160) * strength * 60 : 0;
      tgt.x = (dx / (d || 1)) * pull;
      tgt.y = (dy / (d || 1)) * pull;
    };
    const onLeave = () => { tgt.x = 0; tgt.y = 0; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cur.x += (tgt.x - cur.x) * 0.16;
      cur.y += (tgt.y - cur.y) * 0.16;
      btn.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [strength]);
  return (
    <DemoTile title="Magnetic Element" moduleId="motion/magnetic-elements"
      note="Radial falloff pull strength toward the pointer with eased spring-back on leave.">
      <div ref={hostRef} className="grid size-full place-items-center bg-ink">
        <button ref={btnRef} className="rounded-full bg-ember px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.15em] text-ink">
          Pull me
        </button>
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="strength" value={strength} min={0.1} max={1} step={0.05} unit="×" onChange={setStrength} />
      </div>
    </DemoTile>
  );
}

export function SpotlightDemo() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <DemoTile title="Cursor Spotlight Card" moduleId="motion/cursor-spotlight"
      note="Radial gradient edge-light follows the pointer via CSS variables — the grid pattern emerges from darkness.">
      <div
        ref={hostRef}
        className="relative size-full overflow-hidden bg-ink"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(180px circle at ${pos.x}% ${pos.y}%, rgba(255,92,28,0.22), rgba(255,184,92,0.06) 45%, transparent 70%)`,
          }}
        />
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-fog">Spotlight follows pointer</div>
      </div>
    </DemoTile>
  );
}

export function CursorPreviewDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  return (
    <DemoTile title="Cursor-Chasing Preview" moduleId="motion/cursor-media-trail"
      note="A floating preview lerps to the pointer while hovering list items — the Awwwards index pattern.">
      <div
        className="relative flex size-full flex-col justify-center gap-1 bg-ink px-5"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => setPos(null)}
      >
        {["Monolith", "Halcyon", "Dust & Signal"].map((t, i) => (
          <div key={t} className="group flex items-center justify-between border-b border-line py-3">
            <span className="font-display text-xl font-bold text-ivory/80 transition-colors group-hover:text-ember">{t}</span>
            <span className="font-mono text-[10px] text-smoke">0{i + 1} —</span>
          </div>
        ))}
        <div
          className={`pointer-events-none absolute grid size-24 place-items-center rounded border border-ember/40 bg-carbon font-mono text-[10px] text-ember transition-opacity duration-200 ${pos ? "opacity-100" : "opacity-0"}`}
          style={pos ? { transform: `translate(${pos.x + 16}px, ${pos.y - 48}px)` } : undefined}
        >
          PREVIEW
        </div>
      </div>
    </DemoTile>
  );
}

export function TiltDemo() {
  const [max, setMax] = useState(14);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <DemoTile title="3D Tilt Card" moduleId="motion/3d-tilt"
      note="Perspective transform rotateX/Y derived from pointer position, glare hotspot tracks the same vector.">
      <div
        className="grid size-full place-items-center bg-ink"
        style={{ perspective: "700px" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          setT({ rx: -ny * max, ry: nx * max });
        }}
        onPointerLeave={() => setT({ rx: 0, ry: 0 })}
      >
        <div
          className="relative grid h-36 w-56 place-items-center rounded-lg border border-line bg-gradient-to-br from-carbon to-ink transition-transform duration-150"
          style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transformStyle: "preserve-3d" }}
        >
          <span className="font-display text-lg font-bold text-ivory" style={{ transform: "translateZ(30px)" }}>TILT</span>
          <div className="pointer-events-none absolute inset-0 rounded-lg"
            style={{ background: `radial-gradient(120px circle at ${50 + t.ry * 3}% ${50 - t.rx * 3}%, rgba(255,255,255,0.14), transparent 60%)` }} />
        </div>
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="max tilt" value={max} min={4} max={30} unit="°" onChange={setMax} />
      </div>
    </DemoTile>
  );
}

export function SpringDemo() {
  const [stiff, setStiff] = useState(120);
  const [damp, setDamp] = useState(14);
  return (
    <DemoTile title="Spring Follow" moduleId="motion/spring-physics"
      note="Real spring integration (k, c) toward the pointer, semi-implicit Euler at 60Hz — adjustable stiffness/damping.">
      <CanvasDemo deps={[stiff, damp]} draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type S = { x: number; y: number; vx: number; vy: number };
        const bag = ctx as unknown as { __spring?: S };
        const s = bag.__spring ?? (bag.__spring = { x: w / 2, y: h / 2, vx: 0, vy: 0 });
        const tx = pointer.inside ? pointer.x : w / 2 + Math.sin(dc.t) * w * 0.3;
        const ty = pointer.inside ? pointer.y : h / 2;
        s.vx += (tx - s.x) * stiff * 0.016 - s.vx * damp * 0.016;
        s.vy += (ty - s.y) * stiff * 0.016 - s.vy * damp * 0.016;
        s.x += s.vx; s.y += s.vy;
        ctx.strokeStyle = "rgba(255,92,28,0.35)";
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 3, s.y - s.vy * 3); ctx.lineTo(s.x, s.y); ctx.stroke();
        ctx.fillStyle = FLARE;
        ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(242,237,230,0.2)";
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="stiffness" value={stiff} min={20} max={400} onChange={setStiff} />
        <LabSlider label="damping" value={damp} min={4} max={30} onChange={setDamp} />
      </div>
    </DemoTile>
  );
}

export function DragInertiaDemo() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = hostRef.current, card = cardRef.current;
    if (!host || !card) return;
    let raf = 0;
    const s = { x: 40, y: 40, vx: 0, vy: 0, dragging: false, ox: 0, oy: 0, lx: 0, ly: 0 };
    const onDown = (e: PointerEvent) => {
      s.dragging = true; s.ox = e.clientX - s.x; s.oy = e.clientY - s.y;
      s.lx = e.clientX; s.ly = e.clientY; s.vx = 0; s.vy = 0;
      card.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.x = e.clientX - s.ox; s.y = e.clientY - s.oy;
      s.vx = (e.clientX - s.lx) * 0.9; s.vy = (e.clientY - s.ly) * 0.9;
      s.lx = e.clientX; s.ly = e.clientY;
    };
    const onUp = () => { s.dragging = false; };
    card.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.dragging) {
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.95; s.vy *= 0.95;
        const hw = host.clientWidth, hh = host.clientHeight;
        const cw = card.clientWidth, ch = card.clientHeight;
        if (s.x < 0) { s.x = 0; s.vx *= -0.6; }
        if (s.y < 0) { s.y = 0; s.vy *= -0.6; }
        if (s.x > hw - cw) { s.x = hw - cw; s.vx *= -0.6; }
        if (s.y > hh - ch) { s.y = hh - ch; s.vy *= -0.6; }
      }
      card.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${clamp(s.vx * 2, -8, 8)}deg)`;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); card.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);
  return (
    <DemoTile title="Drag, Throw & Bounce" moduleId="interaction/drag-physics"
      note="Grab and fling the card — release velocity persists with friction, walls bounce with restitution 0.6.">
      <div ref={hostRef} className="relative size-full touch-none overflow-hidden bg-ink">
        <div ref={cardRef} className="absolute grid h-20 w-32 cursor-grab select-none place-items-center rounded-lg border border-ember/50 bg-carbon font-mono text-[10px] uppercase tracking-wider text-ember active:cursor-grabbing">
          throw me
        </div>
      </div>
    </DemoTile>
  );
}

export function FloatDemo() {
  const [speed, setSpeed] = useState(1);
  return (
    <DemoTile title="Gravity Float Field" moduleId="motion/gravity-float"
      note="Chips drift on sine fields with individual phases, mild pointer repulsion — an ambient 'zero-g' layer.">
      <CanvasDemo deps={[speed]} draw={(dc) => {
        const { ctx, w, h, t, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const rnd = mulberry32(41);
        const items = Array.from({ length: 14 }, (_, i) => ({
          px: rnd(), py: rnd(), ph: rnd() * 7, r: 2 + rnd() * 3, id: i,
        }));
        for (const it of items) {
          let x = it.px * w + Math.sin(t * speed + it.ph) * 18;
          let y = it.py * h + Math.cos(t * speed * 0.8 + it.ph * 1.3) * 14;
          if (pointer.inside) {
            const dx = x - pointer.x, dy = y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < 8100 && d2 > 1) { const f = (1 - d2 / 8100) * 22; x += (dx / Math.sqrt(d2)) * f; y += (dy / Math.sqrt(d2)) * f; }
          }
          ctx.fillStyle = it.id % 3 ? "rgba(242,237,230,0.55)" : EMBER;
          ctx.beginPath(); ctx.arc(x, y, it.r, 0, 7); ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="speed" value={speed} min={0.2} max={3} step={0.1} unit="×" onChange={setSpeed} />
      </div>
    </DemoTile>
  );
}

export function RopeDemo() {
  return (
    <DemoTile title="Rope Simulation (Verlet)" moduleId="motion/rope-curve"
      note="12-segment verlet rope — drag the free end; constraint relaxation keeps segment length constant.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type V = { x: number; y: number; px: number; py: number };
        const bag = ctx as unknown as { __rope?: V[] };
        const N = 14;
        if (!bag.__rope) bag.__rope = Array.from({ length: N }, (_, i) => ({ x: 20, y: 20 + i * 12, px: 20, py: 20 + i * 12 }));
        const rope = bag.__rope;
        const seg = (h - 40) / (N - 1);
        // verlet integrate
        for (let i = 1; i < N; i++) {
          const v = rope[i];
          const vx = (v.x - v.px) * 0.98, vy = (v.y - v.py) * 0.98;
          v.px = v.x; v.py = v.y;
          v.x += vx; v.y += vy + 0.55; // gravity
        }
        rope[0].x = w * 0.5 + Math.sin(t * 1.4) * w * 0.3;
        rope[0].y = 20;
        if (pointer.inside) { rope[N - 1].x += (pointer.x - rope[N - 1].x) * 0.15; rope[N - 1].y += (pointer.y - rope[N - 1].y) * 0.15; }
        // constraints
        for (let k = 0; k < 3; k++) {
          for (let i = 0; i < N - 1; i++) {
            const a = rope[i], b = rope[i + 1];
            const dx = b.x - a.x, dy = b.y - a.y;
            const d = Math.hypot(dx, dy) || 1;
            const diff = ((d - seg) / d) * 0.5;
            const offx = dx * diff, offy = dy * diff;
            if (i === 0) { b.x -= offx * 2; b.y -= offy * 2; }
            else { a.x += offx; a.y += offy; b.x -= offx; b.y -= offy; }
          }
        }
        ctx.strokeStyle = EMBER;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(rope[0].x, rope[0].y);
        for (const v of rope) ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.fillStyle = FLARE;
        ctx.beginPath(); ctx.arc(rope[N - 1].x, rope[N - 1].y, 4, 0, 7); ctx.fill();
      }} />
    </DemoTile>
  );
}

/* ------------------------------ particles ------------------------------ */

export function ParticlesDemo() {
  const [count, setCount] = useState(120);
  return (
    <DemoTile title="Particle Field" moduleId="motion/particle-field"
      note="Independent particles with drift, respawn on exit, shimmer — the base ingredient for heavier systems.">
      <CanvasDemo deps={[count]} draw={(dc) => {
        const { ctx, w, h } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type P = { x: number; y: number; vx: number; vy: number; ph: number };
        const bag = ctx as unknown as { __pp?: P[] };
        if (!bag.__pp || bag.__pp.length !== count) {
          const rnd = mulberry32(count);
          bag.__pp = Array.from({ length: count }, () => ({
            x: rnd() * w, y: rnd() * h, vx: (rnd() - 0.5) * 0.5, vy: (rnd() - 0.5) * 0.5, ph: rnd() * 7,
          }));
        }
        for (const p of bag.__pp) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(dc.t * 2 + p.ph));
          ctx.fillStyle = `rgba(255,150,80,${tw})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="count" value={count} min={30} max={400} step={10} onChange={setCount} />
      </div>
    </DemoTile>
  );
}

export function ParticleNetworkDemo() {
  const [count, setCount] = useState(60);
  const [radius, setRadius] = useState(90);
  return (
    <DemoTile title="Particle Network" moduleId="motion/particle-network"
      note="O(n²) neighbor scan under 100 nodes; links fade with distance — the constellation canvas pattern.">
      <CanvasDemo deps={[count, radius]} draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type P = { x: number; y: number; vx: number; vy: number };
        const bag = ctx as unknown as { __pn?: P[] };
        if (!bag.__pn || bag.__pn.length !== count) {
          const rnd = mulberry32(count * 13);
          bag.__pn = Array.from({ length: count }, () => ({ x: rnd() * w, y: rnd() * h, vx: (rnd() - 0.5), vy: (rnd() - 0.5) }));
        }
        const ps = bag.__pn;
        for (const p of ps) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < radius * radius) {
              const a = 1 - Math.sqrt(d2) / radius;
              ctx.strokeStyle = `rgba(255,92,28,${a * 0.5})`;
              ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke();
            }
          }
        }
        if (pointer.inside) {
          for (const p of ps) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < 2600 && d2 > 1) { p.x += (dx / d2) * 12; p.y += (dy / d2) * 12; }
          }
        }
        ctx.fillStyle = IVORY;
        for (const p of ps) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill(); }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="count" value={count} min={20} max={120} step={5} onChange={setCount} />
        <LabSlider label="link px" value={radius} min={40} max={160} step={5} onChange={setRadius} />
      </div>
    </DemoTile>
  );
}

export function ImageParticlesDemo() {
  return (
    <DemoTile title="Image → Particle Sampling" moduleId="motion/image-particles"
      note="A word is rasterized offscreen, bright pixels sampled into particles held by springs; the pointer shatters them.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, pointer } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        type P = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };
        const bag = ctx as unknown as { __ip?: { ps: P[]; w: number; h: number } };
        if (!bag.__ip || bag.__ip.w !== Math.round(w)) {
          const off = document.createElement("canvas");
          off.width = 160; off.height = 60;
          const oc = off.getContext("2d")!;
          oc.fillStyle = "#fff";
          oc.font = "900 44px 'Space Grotesk Variable', sans-serif";
          oc.textAlign = "center"; oc.textBaseline = "middle";
          oc.fillText("PIXEL", 80, 32);
          const data = oc.getImageData(0, 0, 160, 60).data;
          const ps: P[] = [];
          for (let y = 0; y < 60; y += 3) {
            for (let x = 0; x < 160; x += 3) {
              if (data[(y * 160 + x) * 4 + 3] > 128) {
                ps.push({
                  x: Math.random() * w, y: Math.random() * h,
                  hx: (x / 160) * w * 0.9 + w * 0.05, hy: (y / 60) * h * 0.5 + h * 0.25,
                  vx: 0, vy: 0,
                });
              }
            }
          }
          bag.__ip = { ps, w: Math.round(w), h: Math.round(h) };
        }
        for (const p of bag.__ip.ps) {
          p.vx += (p.hx - p.x) * 0.02; p.vy += (p.hy - p.y) * 0.02;
          if (pointer.inside) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < 6400 && d2 > 1) { p.vx += (dx / d2) * 60; p.vy += (dy / d2) * 60; }
          }
          p.vx *= 0.86; p.vy *= 0.86;
          p.x += p.vx; p.y += p.vy;
          ctx.fillStyle = EMBER;
          ctx.fillRect(p.x, p.y, 1.6, 1.6);
        }
      }} />
    </DemoTile>
  );
}

/* ------------------------------ blobs & displacement ------------------------------ */

export function BlobDemo() {
  const [rough, setRough] = useState(0.5);
  return (
    <DemoTile title="Morphing Blob" moduleId="motion/liquid-transition"
      note="Closed Catmull-Rom spline through radius-modulated polar anchors — noise drives the radii.">
      <CanvasDemo deps={[rough]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const noise = makeNoise2D(4);
        const cx = w / 2, cy = h / 2;
        const R = Math.min(w, h) * 0.28;
        const N = 10;
        const pts: [number, number][] = [];
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2;
          const r = R * (1 + noise(Math.cos(a) * 1.6 + 5, Math.sin(a) * 1.6 + t * 0.5) * rough);
          pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
        }
        // Catmull-Rom → bezier
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
          if (i === 0) ctx.moveTo(p1[0], p1[1]);
          ctx.bezierCurveTo(
            p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
            p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
            p2[0], p2[1],
          );
        }
        ctx.closePath();
        const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, R * 1.4);
        g.addColorStop(0, "rgba(255,92,28,0.85)");
        g.addColorStop(1, "rgba(255,46,77,0.5)");
        ctx.fillStyle = g;
        ctx.fill();
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="roughness" value={rough} min={0.1} max={1.2} step={0.05} unit="×" onChange={setRough} />
      </div>
    </DemoTile>
  );
}

export function DisplacementDemo() {
  const [amp, setAmp] = useState(6);
  return (
    <DemoTile title="Scanline Displacement" moduleId="motion/image-displacement-transition" 
      note="A 2D-canvas approximation of shader displacement: horizontal slices offset by noise — labeled honestly as illustrative of the WebGL version.">
      <CanvasDemo deps={[amp]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        // draw the "image" (a typographic plate) to an offscreen canvas once
        type Bag = { off?: HTMLCanvasElement };
        const bag = ctx as unknown as Bag;
        if (!bag.off) {
          const off = document.createElement("canvas");
          bag.off = off;
        }
        const off = bag.off;
        if (off.width !== 320) {
          off.width = 320; off.height = 200;
          const oc = off.getContext("2d")!;
          oc.fillStyle = "#0c0c0f"; oc.fillRect(0, 0, 320, 200);
          oc.fillStyle = IVORY;
          oc.font = "900 44px 'Space Grotesk Variable', sans-serif";
          oc.textAlign = "center";
          oc.fillText("SIGNAL", 160, 96);
          oc.fillStyle = EMBER;
          oc.fillText("NOISE", 160, 148);
        }
        const noise = makeNoise2D(12);
        const slice = 2;
        for (let y = 0; y < h; y += slice) {
          const offX = noise(0.03 * y, t * 0.7) * amp;
          ctx.drawImage(off, 0, (y / h) * 200, 320, (slice / h) * 200, offX, y, w, slice + 1);
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="amplitude" value={amp} min={0} max={22} unit="px" onChange={setAmp} />
      </div>
    </DemoTile>
  );
}

/* ------------------------------ svg path draw + count-up + menu + micro ------------------------------ */

export function PathDrawDemo() {
  const [key, setKey] = useState(0);
  const [dur, setDur] = useState(1800);
  return (
    <DemoTile title="SVG Path Self-Draw" moduleId="motion/svg-path-draw"
      note="stroke-dasharray = pathLength, dashoffset animates to 0 — the monoline signature move. Click to replay.">
      <button className="grid size-full cursor-pointer place-items-center bg-ink" onClick={() => setKey((k) => k + 1)} aria-label="Replay path draw">
        <svg key={key} viewBox="0 0 300 140" className="h-4/5 w-4/5">
          <path
            d="M30 100 C60 20, 120 20, 130 70 C140 120, 190 120, 210 60 S280 40, 275 90"
            fill="none" stroke={EMBER} strokeWidth="3" strokeLinecap="round"
            pathLength={1} strokeDasharray="1" strokeDashoffset="1"
            style={{ animation: `drawpath ${dur}ms cubic-bezier(.6,0,.2,1) forwards` }}
          />
          <circle r="4" fill={FLARE}>
            <animateMotion dur={`${dur}ms`} fill="freeze" path="M30 100 C60 20, 120 20, 130 70 C140 120, 190 120, 210 60 S280 40, 275 90" />
          </circle>
        </svg>
      </button>
      <style>{`@keyframes drawpath { to { stroke-dashoffset: 0; } }`}</style>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="duration" value={dur} min={500} max={4000} step={100} unit="ms" onChange={setDur} />
      </div>
    </DemoTile>
  );
}

export function CountUpDemo() {
  const [target, setTarget] = useState(4200);
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <DemoTile title="Count-Up Stat" moduleId="motion/count-up"
      note="Ease-out-cubic tween with Intl.NumberFormat and tabular numerals — no width jitter while rolling.">
      <div className="grid size-full place-items-center bg-ink">
        <div className="text-center">
          <div className="font-mono text-5xl font-bold tabular-nums text-ember">
            {new Intl.NumberFormat("en-US").format(Math.round(val))}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">hours of craft</div>
        </div>
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="target" value={target} min={10} max={99999} step={10} onChange={setTarget} />
      </div>
    </DemoTile>
  );
}

export function MenuOverlayDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoTile title="Staggered Menu Overlay" moduleId="motion/menu-stagger"
      note="Curtain wipes open with clip-path; links stagger upward — everything keyboard operable.">
      <div className="relative size-full overflow-hidden bg-ink">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="absolute right-3 top-3 z-10 rounded border border-line bg-carbon px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ivory"
        >
          {open ? "close ×" : "menu ≡"}
        </button>
        <div
          className="absolute inset-0 flex flex-col justify-center gap-2 bg-carbon px-6 transition-[clip-path] duration-500"
          style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        >
          {["Index", "Studio", "Motion Lab", "Math Lab"].map((l, i) => (
            <span
              key={l}
              className="font-display text-2xl font-black text-ivory transition-all duration-500"
              style={{
                transform: open ? "none" : "translateY(24px)",
                opacity: open ? 1 : 0,
                transitionDelay: `${120 + i * 70}ms`,
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </DemoTile>
  );
}

export function MicroDemo() {
  const [liked, setLiked] = useState(false);
  return (
    <DemoTile title="Micro-Interaction Set" moduleId="motion/micro-interactions"
      note="Button press scale, icon success burst, understated status pulse — the tactile layer of every product UI.">
      <div className="grid size-full place-items-center bg-ink">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-pressed={liked}
            className={`relative grid size-12 place-items-center rounded-full border transition-all duration-200 active:scale-90 ${liked ? "border-ember bg-ember/15 text-ember" : "border-line text-fog"}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21c-4.5-3.5-9-6.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4.5 7.5-9 11z" />
            </svg>
            {liked && <span className="absolute inset-0 animate-ping rounded-full border border-ember/50" style={{ animationIterationCount: 1 }} />}
          </button>
          <div className="flex items-center gap-2 font-mono text-[10px] text-fog">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </div>
          <button className="rounded bg-ivory px-4 py-2 font-display text-[12px] font-bold uppercase tracking-wide text-ink transition-transform duration-150 hover:scale-[1.03] active:scale-95">
            Press
          </button>
        </div>
      </div>
    </DemoTile>
  );
}

/* ------------------------------ texture demos ------------------------------ */

export function MeshGradientDemo() {
  const [blobCount, setBlobCount] = useState(4);
  return (
    <DemoTile title="Mesh Gradient" moduleId="color/mesh-gradient"
      note="Layered radial gradients over a blurred base — position shifts are animated transforms, not repaints.">
      <CanvasDemo deps={[blobCount]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = "#0c0a12"; ctx.fillRect(0, 0, w, h);
        const colors = ["#ff5c1c", "#ff2e4d", "#7c3aed", "#0ea5e9", "#ffb85c", "#10b981"];
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < blobCount; i++) {
          const x = w / 2 + Math.sin(t * 0.4 + i * 2.4) * w * 0.36;
          const y = h / 2 + Math.cos(t * 0.55 + i * 1.9) * h * 0.34;
          const r = Math.min(w, h) * 0.42;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, colors[i % colors.length] + "88");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="blobs" value={blobCount} min={2} max={7} onChange={setBlobCount} />
      </div>
    </DemoTile>
  );
}

export function AuroraDemo() {
  const [count, setCount] = useState(3);
  return (
    <DemoTile title="Aurora Curtain" moduleId="color/aurora"
      note="Rotating conic-gradient curtains with heavy blur — layered at screen blend for the borealis sweep.">
      <div className="relative size-full overflow-hidden bg-ink">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute -inset-1/4"
            style={{
              background: `conic-gradient(from ${i * 137}deg at ${30 + i * 20}% 60%, transparent 0deg, hsl(${18 + i * 150} 90% 60% / 0.5) 60deg, transparent 140deg)`,
              filter: "blur(46px)",
              mixBlendMode: "screen",
              animation: `aurora ${9 + i * 4}s ease-in-out infinite alternate`,
            }}
          />
        ))}
        <style>{`@keyframes aurora { from { transform: rotate(-6deg) translateY(-4%); } to { transform: rotate(8deg) translateY(5%); } }`}</style>
      </div>
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="curtains" value={count} min={1} max={6} onChange={setCount} />
      </div>
    </DemoTile>
  );
}

export function GrainDemo() {
  const [opacity, setOpacity] = useState(7);
  return (
    <DemoTile title="Procedural Film Grain" moduleId="color/film-grain"
      note="Grain tiles regenerated at 12fps into a pattern fill — real synthesized noise, no image asset.">
      <CanvasDemo deps={[opacity]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = "#141119"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = IVORY;
        ctx.font = "900 54px 'Space Grotesk Variable', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GRAIN", w / 2, h / 2 + 18);
        // regenerate grain each ~80ms
        const frame = Math.floor(t * 12);
        const rnd = mulberry32(frame);
        const g = ctx.createImageData(96, 96);
        for (let i = 0; i < g.data.length; i += 4) {
          const v = Math.floor(rnd() * 255);
          g.data[i] = v; g.data[i + 1] = v; g.data[i + 2] = v; g.data[i + 3] = 255;
        }
        const off = document.createElement("canvas");
        off.width = 96; off.height = 96;
        off.getContext("2d")!.putImageData(g, 0, 0);
        const pat = ctx.createPattern(off, "repeat");
        if (pat) {
          ctx.save();
          ctx.globalAlpha = opacity / 100;
          ctx.globalCompositeOperation = "overlay";
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="opacity" value={opacity} min={1} max={25} unit="%" onChange={setOpacity} />
      </div>
    </DemoTile>
  );
}

export function HalftoneDemo() {
  const [cell, setCell] = useState(9);
  return (
    <DemoTile title="Halftone Field" moduleId="color/halftone"
      note="Dot radius = sampled luminance of a plasma source field — the print pattern generated live.">
      <CanvasDemo deps={[cell]} draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = IVORY; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#171017";
        for (let y = cell / 2; y < h; y += cell) {
          for (let x = cell / 2; x < w; x += cell) {
            const src = (Math.sin(x * 0.02 + t) + Math.sin(y * 0.03 - t * 0.8) + 2) / 4;
            const r = (1 - src) * cell * 0.55;
            if (r > 0.4) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
          }
        }
      }} />
      <div className="space-y-2 border-t border-line px-4 py-3">
        <LabSlider label="cell" value={cell} min={5} max={20} unit="px" onChange={setCell} />
      </div>
    </DemoTile>
  );
}

export function DitherDemo() {
  const src = useMemo(() => null, []);
  void src;
  return (
    <DemoTile title="Bayer 4×4 Ordered Dithering" moduleId="color/dither"
      note="Threshold matrix dithering of a live gradient field — the authentic Bayer 4×4 kernel.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h, t } = dc;
        ctx.fillStyle = INK; ctx.fillRect(0, 0, w, h);
        const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
        const px = 4;
        for (let y = 0; y < h; y += px) {
          for (let x = 0; x < w; x += px) {
            const v = (Math.sin(x * 0.015 + t * 0.8) + Math.sin((x + y) * 0.02 - t * 0.5) + 2) / 4;
            const th = B[((Math.round(y / px) % 4) * 4 + (Math.round(x / px) % 4))] / 16;
            if (v > th) {
              ctx.fillStyle = EMBER;
              ctx.fillRect(x, y, px - 0.5, px - 0.5);
            }
          }
        }
      }} />
    </DemoTile>
  );
}

export function MarbleDemo() {
  return (
    <DemoTile title="Marble Veneer" moduleId="color/marble"
      note="sin(π(x + fbm·turbulence)) veins over ivory — classic Perlin marble shader, computed per tile sample.">
      <CanvasDemo draw={(dc) => {
        const { ctx, w, h } = dc;
        const noise = makeNoise2D(77);
        const gw = 110, gh = 70;
        const cw = w / gw, ch = h / gh;
        for (let y = 0; y < gh; y++) {
          for (let x = 0; x < gw; x++) {
            const px = x * 0.05, py = y * 0.05;
            const turb = Math.abs(fbm(noise, px, py, 4));
            const v = Math.sin(Math.PI * (px * 2.2 + turb * 5));
            const vv = v * 0.5 + 0.5;
            ctx.fillStyle = `hsl(${24 - vv * 10} ${12 + vv * 10}% ${84 - vv * 52}%)`;
            ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
          }
        }
      }} />
    </DemoTile>
  );
}

export function ScrollSpyDemo() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const secs = [...host.querySelectorAll<HTMLElement>("[data-sec]")];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(Number((en.target as HTMLElement).dataset.sec))),
      { root: host.querySelector("[data-scrollport]"), threshold: 0.5 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <DemoTile title="Scroll-Spy Navigation" moduleId="interaction/scroll-spy-nav"
      note="The rail highlights whichever section owns ≥50% of the scrollport — IO, not scroll math.">
      <div ref={hostRef} className="flex h-full">
        <nav className="flex w-20 flex-col justify-center gap-2 border-r border-line px-3" aria-label="Sections">
          {["Studio", "Motion", "Math"].map((l, i) => (
            <span key={l} className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${active === i ? "text-ember" : "text-smoke"}`}>
              {active === i ? "●" : "○"} {l}
            </span>
          ))}
        </nav>
        <div data-scrollport className="h-full flex-1 overflow-y-auto px-4 py-6">
          <MiniScroll>
            <p className="mb-4 font-mono text-[10px] text-smoke">scroll ↓</p>
            {["Studio", "Motion", "Math"].map((l, i) => (
              <section key={l} data-sec={i} className="mb-6 rounded border border-line bg-carbon/50 p-4">
                <h4 className="font-display text-xl font-bold text-ivory">{l}</h4>
                <p className="mt-2 text-[11px] text-fog">Section {i + 1} content block.</p>
              </section>
            ))}
          </MiniScroll>
        </div>
      </div>
    </DemoTile>
  );
}
