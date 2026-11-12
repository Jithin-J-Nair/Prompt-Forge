"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Flame, Layers, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { ARTIFACTS, LEXICON, type Artifact } from "@/lib/lexicon";
import { getModule } from "@/lib/studio";
import { defaultParams } from "@/lib/studio/params";
import { artifactPrimaryModule, artifactStack } from "@/lib/lexicon/compile";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { Ticker, Magnetic, CharReveal, Tilt } from "@/components/motion";
import { useStack } from "@/components/lexicon/stack";
import { useReducedMotion } from "@/components/labs/lab-shell";
import { motionTokens, springs } from "@/lib/motion/tokens";

/* ------------------------------------------------------------------ */
/*  Homepage — discovery-led entry into a creative prompt workbench.    */
/*  Quick creation, curated builds and a persistent creative stack.     */
/* ------------------------------------------------------------------ */

type Tab = "featured" | "recent" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "recent", label: "Recent" },
  { id: "all", label: "All" },
];

const INDUSTRIES = ["All", ...new Set(ARTIFACTS.map((a) => a.industry))];

export function HomeView() {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<Tab>("featured");
  const [industry, setIndustry] = useState("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const sorted = [...ARTIFACTS].sort((a, b) =>
      tab === "recent" ? +new Date(b.added) - +new Date(a.added)
        : tab === "all" ? a.name.localeCompare(b.name)
          : ARTIFACTS.indexOf(a) - ARTIFACTS.indexOf(b),
    );
    const needle = query.trim().toLowerCase();
    return sorted.filter((artifact) =>
      (industry === "All" || artifact.industry === industry) &&
      (!needle || `${artifact.name} ${artifact.blurb} ${artifact.industry}`.toLowerCase().includes(needle)),
    );
  }, [tab, industry, query]);

  return (
    <>
      <HeroStrip reduced={reduced} />
      <Ticker
        items={[
          `${LEXICON.length} creative layers`, `${ARTIFACTS.length} curated builds`, "Quick prompts + mega specs",
          "Motion · math · typography · 3D", "v0 · Cursor · Claude Code export", "One coherent brief, not random effects",
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

        <div className="mb-5 flex justify-end">
          <label className="flex min-h-11 w-full max-w-md items-center gap-2 rounded-full border border-line bg-carbon px-4">
            <Search className="size-4 text-smoke" aria-hidden />
            <input
              type="search"
              name="buildSearch"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search curated builds…"
              aria-label="Search curated builds"
              className="min-w-0 min-h-11 flex-1 bg-transparent text-base text-ivory placeholder:text-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 md:text-sm"
            />
            {query ? <button type="button" onClick={() => setQuery("")} className="press min-h-11 px-2 text-xs text-fog hover:text-ivory">Clear</button> : null}
          </label>
        </div>

        {/* gallery grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.length ? shown.map((a, i) => (
            <ArtifactCard key={a.id} a={a} index={i} />
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-display text-xl font-semibold text-ivory">No builds found.</p>
              <p className="mt-2 text-sm text-fog">Try a different search or create a new prompt from your idea.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => { setQuery(""); setIndustry("All"); }} className="press min-h-11 rounded-full border border-line px-4 py-2 text-sm text-ivory hover:border-ember/50">Clear filters</button>
                <Link href="/forge" className="press min-h-11 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-ink">Create a prompt</Link>
              </div>
            </div>
          )}
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
      <div className="relative z-10 mx-auto grid max-w-[1440px] items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h1 className="text-balance font-display text-[11vw] font-black leading-[0.92] tracking-[-0.045em] text-ivory md:text-[6.4vw]">
            {reduced ? "One idea in." : <CharReveal text="One idea in." delay={0.2} />}
            <br />
            <span className="text-gradient-ember">{reduced ? "A build brief out." : <CharReveal text="A build brief out." delay={0.6} />}</span>
          </h1>
        </div>
        <div className="pb-2">
          <p className="max-w-sm text-[14.5px] leading-relaxed text-fog">
            Start with one sentence or assemble a stack of creative layers — motion, typography, layout, color, 3D and engineering. Forge a concise prompt or a structured implementation specification for your coding agent.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/forge" className="press glint inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-flare">
                Start with one sentence <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.22}>
              <Link href="/lexicon" className="press glass inline-flex items-center gap-2 rounded-md px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fog transition-colors hover:text-ivory">
                Explore creative layers <ArrowUpRight className="size-4" />
              </Link>
            </Magnetic>
          </div>
          <dl className="mt-10 flex max-w-md items-center gap-5 border-t border-line pt-5">
            {[
              [LEXICON.length, "creative layers"],
              [ARTIFACTS.length, "curated builds"],
              [4, "agent targets"],
              [2, "creation modes"],
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
      className="group relative h-full overflow-hidden rounded-xl border border-line bg-carbon/60 transition-[border-color,box-shadow] duration-300 hover:border-ember/40 hover:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.8)]"
    >
      {/* live preview window */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
        {moduleId && getModule(moduleId) ? (
          <PreviewFrame module={getModule(moduleId)!} params={defaultParams(getModule(moduleId)!)} mode="card" className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-[#151a12] p-5">
            <div className="absolute -right-10 -top-16 size-56 rounded-full border border-ember/15" />
            <div className="absolute -right-2 -top-8 size-40 rounded-full border border-ember/20" />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-ember/[0.08] to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
                <span>Prompt study / {String(index + 1).padStart(2, "0")}</span>
                <span className="text-ember/80">Direction</span>
              </div>
              <div className="max-w-[80%]">
                <p className="font-serif-d text-4xl italic leading-[0.95] text-ivory md:text-5xl">{a.name}</p>
                <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-fog">{a.blurb}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stack.slice(0, 3).map((id) => (
                  <span key={id} className="rounded-full border border-ember/20 bg-ink/40 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ember/80">
                    {id.split("/").pop()?.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mask-fade-y pointer-events-none absolute inset-x-0 bottom-0 h-16 from-transparent to-transparent" />
        <span className={clsx("absolute left-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur-md",
          a.tone === "Dark" ? "border-white/15 bg-black/40 text-ivory" : "border-black/15 bg-white/50 text-ink")}>
          {a.tone}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] text-ivory">Live preview</span>
      </div>

      {/* meta row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-ivory transition-colors group-hover:text-flare">
              {a.name}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              {a.industry} · {stack.length} creative layers
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
        Start with the vocabulary. Build something <span className="text-gradient-ember">distinctly yours</span>.
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
    { n: "01", title: "Start with a sentence", body: "Describe the website you need. Get a concise prompt you can paste straight into your coding agent.", href: "/forge", cta: "Create a quick prompt" },
    { n: "02", title: "Choose creative layers", body: "Pick individual ingredients or add a complete category: motion, typography, backgrounds, 3D and more.", href: "/lexicon", cta: "Explore the library" },
    { n: "03", title: "Forge the mega prompt", body: "Your brief and selected layers become one structured build specification with implementation contracts and quality gates.", href: "/forge", cta: "Open the prompt builder" },
  ];
  return (
    <section className="relative z-10 mx-auto max-w-[1440px] px-4 py-20 md:px-8" aria-label="How it works">
      <h2 className="mb-8 text-balance font-display text-3xl font-semibold tracking-tight text-ivory md:text-4xl">Three steps. One coherent build brief.</h2>
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {steps.map((s) => (
          <Link key={s.n} href={s.href} className="group bg-coal p-6 transition-colors duration-300 hover:bg-carbon">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ember">{s.n}</p>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ivory">{s.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-fog">{s.body}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke transition-colors group-hover:text-ember">
              {s.cta} →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
