"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Flame, Heart, Layers, Plus, Zap } from "lucide-react";
import clsx from "clsx";
import { ARTIFACTS, LEXICON, type Artifact } from "@/lib/lexicon";
import { getModule } from "@/lib/studio";
import { defaultParams } from "@/lib/studio/params";
import { artifactPrimaryModule, artifactStack } from "@/lib/lexicon/compile";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { Ticker, Magnetic, CharReveal, Tilt } from "@/components/motion";
import { NebulaField } from "@/components/nebula";
import { SiteMock } from "@/components/site-mock";
import { Eyebrow } from "@/components/chrome";
import { useStack } from "@/components/lexicon/stack";
import { useReducedMotion } from "@/components/labs/lab-shell";
import { motionTokens, springs } from "@/lib/motion/tokens";

/* ------------------------------------------------------------------ */
/*  Homepage v4 — gallery-first, in the grammar of the sites that win   */
/*  the awards: named whole-site artifacts, live preview per card,      */
/*  Featured/Popular/Recent tabs, industry filters — and every card     */
/*  decomposes into lexicon chips you pull straight into your Stack.    */
/* ------------------------------------------------------------------ */

type Tab = "featured" | "popular" | "recent";

const TABS: { id: Tab; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "popular", label: "Popular" },
  { id: "recent", label: "Recent" },
];

const INDUSTRIES = ["All", ...new Set(ARTIFACTS.map((a) => a.industry))];

export function HomeView() {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<Tab>("featured");
  const [industry, setIndustry] = useState("All");

  const shown = useMemo(() => {
    const sorted = [...ARTIFACTS].sort((a, b) =>
      tab === "popular" ? b.votes - a.votes : tab === "recent" ? +new Date(b.added) - +new Date(a.added) : b.votes - a.votes,
    );
    return industry === "All" ? sorted : sorted.filter((a) => a.industry === industry);
  }, [tab, industry]);

  return (
    <>
      <HeroStrip reduced={reduced} />
      <Ticker
        items={[
          `${LEXICON.length} clickable keywords`, "12 flagship artifacts", "Motion grammar",
          "Mathematical graphics", "v0 · Cursor · Claude export", "Deterministic — zero API keys",
        ]}
      />
      <HowItWorks />
      <section id="gallery" className="relative z-10 mx-auto max-w-[1440px] px-4 pb-40 md:px-8" aria-label="Artifact gallery">
        {/* tab + industry rail — the motionsites grammar */}
        <div className="sticky top-[76px] z-30 flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="glass inline-flex w-fit rounded-full p-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={clsx("press relative rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  tab === t.id ? "text-ivory" : "text-fog hover:text-ivory")}>
                {tab === t.id && (
                  <motion.span layoutId="pf-home-tab" transition={springs.snappy} aria-hidden
                    className="absolute inset-0 rounded-full border border-ember/40 bg-ember/15" />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {INDUSTRIES.map((i) => (
              <button key={i} onClick={() => setIndustry(i)}
                className={clsx("press shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                  industry === i ? "border-ember/60 bg-ember/15 text-flare" : "border-line text-smoke hover:text-fog")}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* gallery grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((a, i) => (
            <ArtifactCard key={a.id} a={a} index={i} />
          ))}
        </div>

        <Outro />
      </section>
    </>
  );
}

/* --------------------------- hero strip --------------------------- */

function HeroStrip({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className="relative z-10 mx-auto overflow-hidden px-4 pb-14 pt-36 md:px-8 md:pt-44" aria-label="Intro">
      <NebulaField className="absolute inset-0 -z-0 size-full opacity-80 [mask-image:radial-gradient(90%_80%_at_50%_20%,black_30%,transparent_100%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1440px] items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
            <Zap className="size-3 text-ember" aria-hidden /> The prompt lexicon, weaponized
          </p>
          <h1 className="font-display text-[11vw] font-black leading-[0.92] tracking-[-0.045em] text-ivory md:text-[6.4vw]">
            {reduced ? "One stack in." : <CharReveal text="One stack in." delay={0.2} />}
            <br />
            <span className="text-gradient-ember">
              {reduced ? "An award-tier " : <CharReveal text="An award-tier " delay={0.6} />}
              <span className="font-serif-d italic tracking-normal">
                {reduced ? "brief out." : <CharReveal text="brief out." delay={1.15} />}
              </span>
            </span>
          </h1>
        </div>
        <div className="pb-2">
          <p className="max-w-sm text-[14.5px] leading-relaxed text-fog">
            Every prompt keyword for world-class websites exists here as its own
            clickable chip — motion, math, type, color, 3D. Pull chips from any
            artifact, or browse the full lexicon, and compile for the tool you ship with.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/lexicon" className="press glint inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-flare">
                Open the lexicon <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.22}>
              <Link href="/studio" className="press glass inline-flex items-center gap-2 rounded-md px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fog transition-colors hover:text-ivory">
                Deep studio <ArrowUpRight className="size-4" />
              </Link>
            </Magnetic>
          </div>
          <dl className="mt-10 flex max-w-md items-center gap-5 border-t border-line pt-5">
            {[
              [LEXICON.length, "keywords"],
              [ARTIFACTS.length, "artifacts"],
              [4, "export targets"],
              [0, "api keys"],
            ].map(([n, label]) => (
              <div key={label as string}>
                <dt className="sr-only">{label}</dt>
                <dd className="tabular font-display text-2xl font-black text-ivory">{n}</dd>
                <dd className="font-mono text-[9px] uppercase tracking-[0.24em] text-smoke">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- artifact card --------------------------- */

function ArtifactCard({ a, index }: { a: Artifact; index: number }) {
  const { addAll, has, setOpen } = useStack();
  const stack = artifactStack(a);
  const moduleId = artifactPrimaryModule(a);
  const allIn = stack.length > 0 && stack.every((id) => has(id));
  const [loved, setLoved] = useState(false);

  return (
    <Tilt className="h-full">
    <motion.article
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      initial={{ opacity: 0, y: motionTokens.distance.lg }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: motionTokens.duration.slow * 0.8, delay: (index % 3) * motionTokens.stagger.normal, ease: [...motionTokens.easing.outExpo] }}
      className="card-sheen group relative h-full overflow-hidden rounded-xl border border-line bg-carbon/60 transition-all duration-300 hover:border-ember/40 hover:shadow-[0_32px_90px_-28px_rgba(139,124,246,0.45)]"
    >
      {/* live preview window */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
        {moduleId && getModule(moduleId) ? (
          <PreviewFrame module={getModule(moduleId)!} params={defaultParams(getModule(moduleId)!)} mode="card" className="absolute inset-0" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_120%_at_30%_20%,rgba(139,124,246,0.16),transparent_60%),radial-gradient(70%_100%_at_80%_90%,rgba(251,113,133,0.1),transparent_60%)]" />
        )}
        <div className="mask-fade-y pointer-events-none absolute inset-x-0 bottom-0 h-16 from-transparent to-transparent" />
        <span className={clsx("absolute left-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur-md",
          a.tone === "Dark" ? "border-white/15 bg-black/40 text-ivory" : "border-black/15 bg-white/50 text-ink")}>
          {a.tone}
        </span>
        <button onClick={() => setLoved((v) => !v)} aria-pressed={loved} aria-label={loved ? "Remove from favourites" : "Save to favourites"}
          className={clsx("press absolute right-3 top-3 grid size-8 place-items-center rounded-full border backdrop-blur-md transition-colors",
            loved ? "border-ember/60 bg-ember/20 text-ember" : "border-white/15 bg-black/40 text-fog hover:text-ivory")}>
          <Heart className={clsx("size-3.5", loved && "fill-current")} />
        </button>
      </div>

      {/* meta row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-ivory transition-colors group-hover:text-flare">
              {a.name}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              {a.industry} · <span className="tabular">{a.votes + (loved ? 1 : 0)}</span> votes · {stack.length} chips
            </p>
          </div>
          <Link href={`/artifact/${a.id}`} aria-label={`Open ${a.name}`}
            className="press mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-smoke transition-colors hover:border-ember/50 hover:text-ember">
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-fog">{a.blurb}</p>

        {/* chip preview — the site decomposed */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stack.slice(0, 4).map((id) => {
            const name = id.split("/").pop()?.replace(/-/g, " ") ?? id;
            return (
              <span key={id} className={clsx("rounded-full border px-2.5 py-1 font-mono text-[9px] capitalize tracking-[0.08em]",
                has(id) ? "border-ember/50 bg-ember/10 text-flare" : "border-line text-smoke")}>
                {name}
              </span>
            );
          })}
          {stack.length > 4 && <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9px] text-smoke">+{stack.length - 4}</span>}
        </div>

        <button
          onClick={() => { addAll(stack); setOpen(true); }}
          className={clsx("press mt-5 flex w-full items-center justify-center gap-2 rounded-md py-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors",
            allIn ? "border border-ember/40 bg-ember/10 text-flare" : "bg-ember text-ink hover:bg-flare")}
        >
          {allIn
            ? <><Check className="size-4" /> All chips in your stack — open tray</>
            : <><Plus className="size-4" /> Stack all {stack.length} chips</>}
        </button>
      </div>
    </motion.article>
    </Tilt>
  );
}

/* ------------------------------ outro ------------------------------ */

function Outro() {
  return (
    <div className="mt-24 rounded-2xl border border-line bg-carbon/40 p-8 text-center md:p-14">
      <Flame className="mx-auto size-8 text-ember" aria-hidden />
      <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-black leading-tight tracking-tight text-ivory md:text-5xl">
        Don&apos;t start from an artifact. Start from <span className="text-gradient-ember">the vocabulary</span>.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-fog">
        {LEXICON.length} keywords across {11} families — browse the wall, stack what speaks,
        compile to your builder of choice.
      </p>
      <Magnetic className="mt-8">
        <Link href="/lexicon" className="press glint inline-flex items-center gap-2 rounded-md bg-ember px-6 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-flare">
          Browse all {LEXICON.length} keywords <Layers className="size-4" />
        </Link>
      </Magnetic>
    </div>
  );
}

/* -------------------------- how it works -------------------------- */

function HowItWorks() {
  const steps = [
    { n: "01", title: "Pick keywords", body: "Every award-tier technique exists here as its own chip — motion, math, type, colour, 3D. Click to stack.", href: "/lexicon", cta: "Open the lexicon" },
    { n: "02", title: "Or steal a whole site", body: "Each artifact below is a finished, named build. Open it, watch it live, take its entire stack.", href: "#gallery", cta: "Browse artifacts" },
    { n: "03", title: "Export for your builder", body: "One click compiles your stack for v0, Cursor, Claude or a raw spec. Paste it where you build.", href: "/studio", cta: "Deep studio" },
  ];
  return (
    <section className="relative z-10 mx-auto max-w-[1440px] px-4 py-20 md:px-8" aria-label="How it works">
      <Eyebrow>How PromptForge works</Eyebrow>
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {steps.map((s) => (
          <a key={s.n} href={s.href} className="group bg-coal p-6 transition-colors duration-300 hover:bg-carbon">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ember">{s.n}</p>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ivory">{s.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-fog">{s.body}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke transition-colors group-hover:text-ember">
              {s.cta} →
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
