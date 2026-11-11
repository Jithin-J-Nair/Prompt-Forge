"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  ArrowDown, ArrowUpRight, Check, ChevronRight, Copy, Download, Layers, Maximize2,
  Monitor, MousePointer2, Plus, SlidersHorizontal, Smartphone, Tablet, Zap,
} from "lucide-react";
import {
  PRESETS, compile, getModule, searchModules,
  type CompileOutput, type PromptModule,
} from "@/lib/studio";
import { REGISTRY_STATS } from "@/lib/studio/registry";
import { CharReveal, Magnetic } from "@/components/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { makeNoise2D, mulberry32, useReducedMotion } from "@/components/labs/lab-shell";

/* ------------------------------------------------------------------ */
/*  Homepage v2 — nine sections, each with its own visual rhythm.       */
/*  01 hero (live particle field)  02 scale  03 technique search        */
/*  04 live module previews        05 creative labs                     */
/*  06 composition canvas          07 compiler peek                     */
/*  08 curated presets             09 final conversion                  */
/* ------------------------------------------------------------------ */

export function HomeView() {
  return (
    <>
      <HeroSection />
      <ScaleSection />
      <SearchSection />
      <PreviewsSection />
      <LabsSection />
      <CompositionSection />
      <CompilerPeekSection />
      <PresetsSection />
      <FinalSection />
    </>
  );
}

/* ============================ 01 · HERO ============================ */

function HeroSection() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // scroll-linked parallax: type drifts up and fades as the field stays put
  const typeY = useTransform(scrollYProgress, [0, 0.22], [0, -90]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden" aria-label="Hero">
      <HeroField still={reduced} />
      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[42%] z-[5] size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(255,92,28,0.3), rgba(255,184,92,0.1) 45%, transparent 70%)", animation: "ember-bloom 1.8s cubic-bezier(0.22,1,0.36,1) 0.1s both" }} />
      )}
      {/* corner registration marks — instrument-frame detail */}
      <div aria-hidden className="pointer-events-none absolute inset-x-6 top-24 z-[6] hidden justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-smoke md:flex">
        <span>PF-INSTRUMENT / SPEC v1.0</span>
        <span className="flex items-center gap-2"><span className="size-1.5 animate-pulse-soft rounded-full bg-ember" /> Furnace online</span>
        <span>279 modules · 21 presets</span>
      </div>

      <motion.div style={reduced ? undefined : { y: typeY, opacity: typeOpacity }}
        className="pointer-events-none relative z-10 mx-auto grid w-full max-w-6xl flex-1 place-items-center px-4 text-center md:px-8">
        <div>
        <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fog backdrop-blur-sm">
          <Zap className="size-3 text-ember" aria-hidden="true" /> The website-spec forge
        </p>
        <h1 className="font-display text-[13vw] font-black leading-[0.92] tracking-[-0.045em] text-ivory sm:text-[10.5vw] lg:text-[8vw]">
          <CharReveal text="Type one lazy sentence." delay={0.25} />
          <br />
          <span className="bg-gradient-to-r from-ember via-flare to-blood bg-clip-text text-transparent">
            <CharReveal text="Forge a blueprint." delay={0.72} />
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-fog">
          PromptForge turns a half-formed idea into a production-grade visual spec — color, type,
          layout, motion, 3D and the quality contract — compiled from{" "}
          <span className="text-ivory">{REGISTRY_STATS.modules} precision modules</span> and{" "}
          <span className="text-ivory">{PRESETS.length} curated presets</span>.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <Link href="/studio"
              className="press glint group flex items-center gap-2 rounded-md bg-ember px-6 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-flare">
              Enter the Studio <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.22}>
            <Link href="/forge"
              className="press glass rounded-md px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.16em] text-fog transition-colors duration-300 hover:border-line-bright hover:text-ivory">
              Try the classic forge
            </Link>
          </Magnetic>
        </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none relative z-10 flex h-28 items-end justify-between px-6 pb-6 md:px-10">
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.42em] text-smoke md:block">Scroll — the forge floor below</span>
        <span aria-hidden className="mx-auto block h-10 w-px overflow-hidden bg-white/10 md:mx-0">
          <span className="block h-1/2 w-px bg-ember" style={{ animation: "pf-scroll-cue 1.8s cubic-bezier(0.76,0,0.24,1) infinite" }} />
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.42em] text-smoke md:block">01 / 09</span>
        <style>{`@keyframes pf-scroll-cue{0%{transform:translateY(-100%)}55%,100%{transform:translateY(200%)}}`}</style>
      </div>
    </section>
  );
}

function HeroField({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
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

    const N = 260;
    const rnd = mulberry32(7);
    const pts = Array.from({ length: N }, () => ({ x: rnd(), y: rnd(), ph: rnd() * 7 }));
    const noise = makeNoise2D(3);
    let mx = 0.5, my = 0.5;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove);

    const draw = (t: number) => {
      const w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.fillStyle = "#070708";
      ctx.fillRect(0, 0, w, h);
      const wob = t * 0.12;
      for (const p of pts) {
        const px = (p.x + Math.sin(t * 0.04 + p.ph) * 0.02) * w;
        const py = (p.y + Math.cos(t * 0.03 + p.ph * 1.3) * 0.02) * h;
        // domain-warped drift: push particles along curl-ish vector around the cursor
        const dxm = px - mx * w, dym = py - my * h;
        const dm = Math.max(24, Math.hypot(dxm, dym));
        const lift = Math.pow(140 / dm, 2) * 12;
        const wave = Math.max(0, noise(px * 0.002 + wob, py * 0.002)) * 14;
        const rad = 0.8 + wave * 0.22;
        const a = Math.min(0.85, 0.18 + wave * 0.05 + lift * 0.02);
        const hue = 14 + wave * 4;
        ctx.fillStyle = `hsla(${hue}, 92%, ${52 + lift * 2}%, ${a})`;
        ctx.beginPath();
        ctx.arc(px + (dxm / dm) * lift * 3, py + (dym / dm) * lift * 3, rad, 0, 7);
        ctx.fill();
      }
    };

    if (still || matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(1.35); }
    else {
      let raf = 0;
      const loop = (now: number) => { raf = requestAnimationFrame(loop); draw(now / 1000); };
      raf = requestAnimationFrame(loop);
      return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
    }
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [still]);
  return (
    <>
      <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink" />
    </>
  );
}

/* ============================ 02 · SCALE ============================ */

function ScaleSection() {
  const rows = [
    ["279", "typed modules", "every one renders live"],
    ["11", "categories", "objective → engineering contract"],
    ["84", "lab demos", "working references, not mockups"],
    ["195", "param-driven", "every dial lands in the spec"],
  ] as const;
  return (
    <section aria-label="Scale" className="relative border-t border-line bg-carbon/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-line md:grid-cols-4 md:divide-x md:divide-y-0 divide-y [&>div:first-child]:border-t-0">
        {rows.map(([n, label, sub]) => (
          <div key={label} className="group px-8 py-12 transition-colors hover:bg-wall/20">
            <CountUp staticValue={n} />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">{label}</p>
            <p className="mt-2 text-[12px] text-smoke">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ staticValue }: { staticValue: string; target?: number }) {
  return (
    <p className="font-display text-5xl font-black tracking-tight text-ivory md:text-6xl">
      <span className="text-ember">{staticValue}</span>
    </p>
  );
}

/* ============================ 03 · SEARCH ============================ */

function SearchSection() {
  const [q, setQ] = useState("liquid metallic object");
  const results = useMemo(() => searchModules(q, {}).slice(0, 5), [q]);
  const aliases = [
    ["liquid metallic object", "→ chrome · iridescence · liquid-metal-bg"],
    ["buttery modal entrance", "→ spring-physics · ui-state-transitions"],
    ["warm filmic grade", "→ film-grain · cinematic · duotone"],
  ];
  return (
    <section aria-label="Technique discovery" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">02 / discovery</p>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
            Speak plainly.<br />
            <span className="font-serif italic text-flare">We return the jargon.</span>
          </h2>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-fog">
            The search index carries aliases tuned for how designers actually talk about craft —
            not how the API surfaces are named. “Liquid metallic object” finds chrome and
            iridescence without you memorising parameter names.
          </p>
          <ul className="mt-8 space-y-3 font-mono text-[11px] text-smoke">
            {aliases.map(([a, b]) => (
              <li key={a} className="flex items-baseline gap-3">
                <span className="text-fog">“{a}”</span>
                <span className="text-ember/80">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-panel/60 p-4 backdrop-blur-sm md:p-6">
          <div className="relative">
            <MousePointer2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-smoke" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="describe the feeling you're after…"
              aria-label="Search technique universe"
              className="w-full rounded-md border border-line bg-ink py-3.5 pl-11 pr-4 text-[15px] text-ivory placeholder:text-smoke/70 focus:border-ember/60 focus:outline-none"
            />
          </div>
          <div className="mt-4 space-y-1" role="listbox" aria-label="Search results preview">
            {results.map((r) => (
              <div key={r.module.id} role="option" aria-selected="false"
                className="flex items-center justify-between gap-4 rounded-md px-3 py-2.5 transition-colors hover:bg-wall/30">
                <div>
                  <p className="font-display text-[13.5px] font-bold text-ivory">{r.module.name}</p>
                  <p className="text-[11px] text-smoke">{r.module.tagline}</p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-smoke/80 shrink-0">{r.module.category}</span>
              </div>
            ))}
            {results.length === 0 && (
              <p className="px-3 py-6 font-mono text-[11px] text-smoke">Nothing yet — reset with “liquid”.</p>
            )}
          </div>
          <p className="mt-4 border-t border-line pt-3 font-mono text-[10px] text-smoke">
            {results.length} live matches · full index in <Link href="/studio" className="text-ember hover:underline">the Studio</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================ 04 · LIVE PREVIEWS ============================ */

function PreviewsSection() {
  const ids = ["backgrounds/liquid-metal-bg", "math/voronoi", "typography/oversized", "webgl/three-scene", "color/duotone", "typography/character-animation"]
    .filter((id) => getModule(id));
  const [picking, setPicking] = useState(ids[0]);
  const active = getModule(picking) ?? null;
  const [paramsByModule, setParamsByModule] = useState<Record<string, Record<string, string | number | boolean>>>({});
  const params = paramsByModule[picking] ?? {};
  const setParams = (fnOr: (p: Record<string, string|number|boolean>) => Record<string, string|number|boolean>) => {
    setParamsByModule((all) => ({ ...all, [picking]: fnOr(all[picking] ?? {}) }));
  };
  return (
    <section aria-label="Live module previews" className="relative border-t border-line bg-carbon/30">
      <div className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">03 / living previews</p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
              Every module {` `}
              <span className="font-serif italic text-flare">renders itself.</span>
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-relaxed text-fog">
            No screenshots, no static gradients masquerading as demos: these are the actual
            renderers the Studio uses — and their params feed both what you see and what the
            compiler writes.
          </p>
        </div>

        {/* asymmetric feature pair */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-line bg-ink">
            {active && (
              <PreviewFrame module={active} params={params} mode="detail" className="aspect-[16/9]" />
            )}
            {active && active.params.length > 0 && (
              <div className="relative border-t border-line bg-panel/70">
                <span className="absolute right-4 top-4 flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-smoke">
                  <SlidersHorizontal className="size-3" /> live params — same object the compiler reads
                </span>
              </div>
            )}
            {active && active.params.length > 0 && (
              <div className="grid gap-3 border-t border-line bg-panel/70 p-4 pt-7 sm:grid-cols-3">
                {active.params.slice(0, 3).map((d) => (
                  <label key={d.key} className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-smoke">{d.label}</span>
                    {d.type === "select" ? (
                      <select
                        value={(params[d.key] as string) ?? d.default as string}
                        onChange={(e) => setParams((p2) => ({ ...p2, [d.key]: e.target.value }))}
                        className="rounded border border-line bg-ink px-2 py-1.5 font-mono text-[11px] text-ivory focus:border-ember/60 focus:outline-none"
                      >
                        {d.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type="range"
                        min={d.min ?? 0} max={d.max ?? 100} step={d.step ?? 1}
                        value={(params[d.key] as number) ?? d.default as number}
                        onChange={(e) => setParams((p2) => ({ ...p2, [d.key]: Number(e.target.value) }))}
                        aria-label={d.label}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded bg-wall accent-ember"
                      />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ids.map((id) => {
              const m = getModule(id)!;
              return (
                <div
                  key={id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={picking === id}
                  onClick={(e) => {
                    // ignore clicks that originated on PreviewFrame's own controls (pause/expand)
                    if ((e.target as HTMLElement).closest("button")) return;
                    setPicking(id);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicking(id); } }}
                  className={clsx(
                    "group cursor-pointer overflow-hidden rounded-xl border bg-ink transition-colors",
                    picking === id ? "border-ember" : "border-line hover:border-line-bright",
                  )}
                >
                  <PreviewFrame module={m} params={{}} mode="card" className="aspect-[16/10]" />
                  <span className={clsx(
                    "block truncate px-2.5 py-1.5 text-left font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors",
                    picking === id ? "text-flare" : "text-fog group-hover:text-ivory",
                  )}>
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ 05 · LABS ============================ */

function LabsSection() {
  const cards = [
    {
      href: "/motion-lab",
      name: "Motion Lab",
      k: "A",
      desc: "35 physics-accurate interaction stanzas — springs, cursor systems, scroll choreography — runnable before you commit to a param.",
      count: "35 live demos",
    },
    {
      href: "/math-lab",
      name: "Math Lab",
      k: "B",
      desc: "The procedural engine-room: fBm, attractors, SDFs, reaction-diffusion and friends — the same engines the spec generator cites.",
      count: "23 live demos",
    },
  ];
  return (
    <section aria-label="Creative labs" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">04 / creative labs</p>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
            Play before you <span className="font-serif italic text-flare">commit a param.</span>
          </h2>
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <Link key={c.href} href={c.href}
            className={clsx(
              "group flex flex-col overflow-hidden rounded-xl border border-line bg-ink transition-all duration-300 hover:border-ember/50",
              i === 1 && "md:mt-16",
            )}>
            <div className="relative aspect-[16/8] overflow-hidden">
              <LabTilePreview kind={c.href} />
              <span className="absolute left-3 top-3 rounded border border-line bg-ink/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-flare backdrop-blur-sm">
                LAB {c.k} — LIVE
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-black text-ivory">{c.name}</h3>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-smoke">{c.count}</span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-fog">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
                Enter <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LabTilePreview({ kind }: { kind: string }) {
  const id = kind === "/motion-lab" ? "typography/character-animation" : "math/voronoi";
  const m = getModule(id);
  if (!m) return <div className="grid size-full place-items-center font-mono text-[9px] text-smoke">module offline</div>;
  return <PreviewFrame module={m} params={{}} mode="detail" className="size-full" />;
}

/* ============================ 06 · COMPOSITION CANVAS ============================ */

function CompositionSection() {
  const defaults = ["websites/creative-portfolio", "direction/neo-brutalism", "layout/bento-grid", "typography/oversized"];
  const [selected, setSelected] = useState<string[]>(defaults.slice(0, 2));
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [expanded, setExpanded] = useState(false);
  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s));
  };
  const resolved = selected.map((id) => getModule(id)).filter((m): m is PromptModule => Boolean(m));
  return (
    <section aria-label="Composition canvas" className="relative border-t border-line bg-carbon/40">
      <div className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">05 / composition canvas</p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
              Selections become a <span className="font-serif italic text-flare">living page.</span>
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-relaxed text-fog">
            Pull modules into the tray and the mock page reassembles in real time — representative,
            honestly labeled, and driven by the same params the compiler exports.
          </p>
        </div>

        <div className={clsx("mt-12 grid gap-6", expanded ? "lg:grid-cols-[1fr]" : "lg:grid-cols-[13rem_1fr]")}>
          {/* tray */}
          <div className={clsx("space-y-2 self-start lg:sticky lg:top-24", expanded && "hidden")}>
            {defaults.map((id) => {
              const m = getModule(id)!;
              const on = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  className={clsx(
                    "flex w-full items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                    on ? "border-ember bg-ember/5" : "border-line bg-panel/60 hover:border-line-bright",
                  )}
                >
                  <span className={clsx("mt-px grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors",
                    on ? "border-ember bg-ember text-ink" : "border-line text-smoke")}>
                    {on ? <Plus className="size-3 rotate-45" /> : <Plus className="size-3" />}
                  </span>
                  <span>
                    <span className="block font-display text-[12.5px] font-bold leading-tight text-ivory">{m.name}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-smoke">{m.category}</span>
                  </span>
                </button>
              );
            })}
            <p className="px-0.5 pt-2 font-mono text-[9px] leading-relaxed text-smoke/80">
              Representative mockup — the <Link href="/studio" className="text-ember/90 hover:underline">Studio</Link> holds the real composition canvas with viewports, fullscreen and prompt sync.
            </p>
          </div>

          {/* stage */}
          <div>
            <div className="flex items-center justify-between rounded-t-lg border border-line bg-panel px-3.5 py-2.5" role="toolbar" aria-label="Viewport size">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">
                <span className="size-2 rounded-full bg-blood/70" />
                <span className="size-2 rounded-full bg-flare/70" />
                <span className="size-2 rounded-full bg-signal/70" />
                <span className="ml-2 truncate">composition.canvas</span>
              </div>
              <div className="flex gap-1">
                {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([v, Icon]) => (
                  <button key={v} onClick={() => setViewport(v)} aria-pressed={viewport === v} aria-label={`Viewport ${v}`}
                    className={clsx("rounded-md p-1.5 transition-colors", viewport === v ? "bg-ember/15 text-ember" : "text-smoke hover:text-fog")}>
                    <Icon className="size-3.5" />
                  </button>
                ))}
                <button
                  onClick={() => setExpanded((e) => !e)}
                  aria-pressed={expanded}
                  aria-label={expanded ? "Restore tray" : "Expand stage"}
                  className={clsx("rounded-md p-1.5 transition-colors", expanded ? "bg-ember/15 text-ember" : "text-smoke hover:text-fog")}
                >
                  <Maximize2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-b-lg border-x border-b border-line bg-ink">
              <div
                className="mx-auto transition-[width] duration-500 ease-out"
                style={{ width: viewport === "desktop" ? "100%" : viewport === "tablet" ? "74%" : "44%" }}
              >
                <div className="min-h-[26rem]">
                  {resolved.length === 0 ? (
                    <p className="grid h-full min-h-[26rem] place-items-center font-mono text-[11px] text-smoke">
                      Nothing selected — the canvas awaits modules.
                    </p>
                  ) : (
                    resolved.map((m, i) => (
                      <div key={m.id} className={clsx(i > 0 && "border-t border-dashed border-line")}>
                        <p className="px-[6%] pt-5 font-mono text-[8.5px] uppercase tracking-[0.24em] text-smoke/80">
                          0{i + 1} · {m.name} · <span className="text-ember/70">{m.category}</span>
                        </p>
                        <PreviewFrame module={m} params={{}} mode="detail" className="aspect-[16/9]" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ 07 · COMPILER PEEK ============================ */

function CompilerPeekSection() {
  const [presetId, setPresetId] = useState(PRESETS[0]?.id ?? "");
  const [depth, setDepth] = useState<"standard" | "detailed" | "extreme">("detailed");
  const [copied, setCopied] = useState(false);
  const output: CompileOutput = useMemo(() => {
    const p = PRESETS.find((x) => x.id === presetId);
    if (!p) return null as unknown as CompileOutput;
    return compile({ projectName: p.name, brief: p.brief, selections: p.selections, depth });
  }, [presetId, depth]);
  const lines = useMemo(() => (output?.markdown ?? "").split("\n"), [output]);
  const words = output?.stats.words ?? 0;
  const downloadSpec = () => {
    const blob = new Blob([output?.markdown ?? ""], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "promptforge-spec.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copySpec = async () => {
    try {
      await navigator.clipboard.writeText(output?.markdown ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked by permissions policy — the text stays selectable in the pane */
    }
  };
  return (
    <section aria-label="Live compiler" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.35fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember">06 / compiler peek</p>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
            Watch the spec <span className="font-serif italic text-flare">compile itself.</span>
          </h2>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-fog">
            The same pure engine that powers the Studio, running on every route with zero side
            effects. Swap presets or change the depth dial and the text re-derives instantly —
            conflicts, acceptance and all.
          </p>
          <div className="mt-8">
            <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-smoke">Preset</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  aria-pressed={presetId === p.id}
                  className={clsx("flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] transition-colors",
                    presetId === p.id ? "border-ember bg-ember/10 text-ivory" : "border-line text-fog hover:border-line-bright")}
                >
                  <span className="size-2 rounded-full" style={{ background: `hsl(${p.hue} 90% 58%)` }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-smoke">Output depth</p>
            <div className="inline-flex rounded-md border border-line bg-panel p-1" role="radiogroup" aria-label="Depth">
              {(["standard", "detailed", "extreme"] as const).map((d) => (
                <button key={d} role="radio" aria-checked={depth === d} onClick={() => setDepth(d)}
                  className={clsx("rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                    depth === d ? "bg-ember/15 text-ember" : "text-smoke hover:text-fog")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-line bg-ink shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-blood/70" />
            <span className="size-2.5 rounded-full bg-flare/70" />
            <span className="size-2.5 rounded-full bg-signal/70" />
            <span className="ml-2 font-mono text-[10px] text-smoke">compiled.spec — live</span>
            <span className="ml-auto font-mono text-[10px] text-flare">{words.toLocaleString()} words</span>
            <button
              onClick={copySpec}
              aria-label={copied ? "Compiled spec copied" : "Copy compiled spec"}
              className={clsx(
                "flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                copied ? "border-signal/60 text-signal" : "border-line text-fog hover:border-ember/60 hover:text-ember",
              )}
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "copied" : "copy"}
            </button>
            <button
              onClick={downloadSpec}
              aria-label="Download compiled spec as markdown file"
              className="flex items-center gap-1.5 rounded border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-fog transition-colors hover:border-ember/60 hover:text-ember"
            >
              <Download className="size-3" />
              .md
            </button>
          </div>
          <div className="max-h-[30rem] overflow-y-auto p-6 font-mono text-[11px] leading-[1.85] [scrollbar-width:thin]" aria-live="polite">
            {lines.slice(0, 160).map((l, i) => (
              <p key={i} className={clsx(
                "whitespace-pre-wrap",
                l.startsWith("# ") && "text-flare font-bold",
                l.startsWith("## ") && "mt-3 text-ember",
                l.startsWith("### ") && "mt-2 text-flare/90",
                l.startsWith("- ⚠") && "text-blood",
                l.startsWith("|") && "text-smoke/70",
                l.startsWith(">") && "font-serif italic text-fog",
              )}>
                {l || "\u00A0"}
              </p>
            ))}
            {lines.length > 160 && (
              <p className="mt-4 border-t border-dashed border-line pt-3 text-smoke">… {lines.length - 160} more lines compiled</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ 08 · PRESETS ============================ */

function PresetsSection() {
  const shown = PRESETS.slice(0, 5);
  return (
    <section aria-label="Curated presets" className="border-t border-line bg-carbon/50">
      <div className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-36">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ember">
              <Layers className="size-3" aria-hidden="true" /> 07 / curated presets
            </p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-5xl">
              Start from a <span className="font-serif italic text-flare">judge-grade baseline.</span>
            </h2>
          </div>
          <Link href="/studio" className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
            all {PRESETS.length} presets <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {shown.map((p, i) => (
            <Link key={p.id} href={`/studio?preset=${p.id}`}
              className={clsx(
                "group flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-ink p-5 min-h-[11rem] transition-all duration-300 hover:border-ember/60 hover:-translate-y-1",
                i === 2 && "md:col-span-1 lg:translate-y-10",
              )}>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-smoke" style={{ color: `hsl(${p.hue} 90% 62%)` }}>
                №{String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-[15px] font-black leading-tight text-ivory">{p.name}</p>
                <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-smoke">
                  ×{p.selections.length} modules
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 09 · CONVERSION ============================ */

function FinalSection() {
  return (
    <section aria-label="Final call" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-ember/10 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,92,28,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,92,28,0.05) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse at 50% 80%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 80%, black, transparent 70%)",
        }} />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center md:px-8 md:py-40">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">08 / step into the studio</p>
        <h2 className="mt-6 font-display text-4xl font-black tracking-tight md:text-6xl">
          Your next project spec is{" "}
          <span className="font-serif italic font-normal text-flare">three selections away.</span>
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/studio"
            className="group flex items-center gap-2 rounded-md bg-ember px-8 py-4 font-mono text-[12.5px] font-bold uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:scale-[1.02] hover:bg-flare">
            Open the Studio <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a href="/library"
            className="rounded-md border border-line px-8 py-4 font-mono text-[12.5px] uppercase tracking-[0.16em] text-fog transition-colors hover:border-line-bright hover:text-ivory">
            Browse the library
          </a>
        </div>
      </div>
    </section>
  );
}

