"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";

const STEPS = [
  {
    title: "State the intent",
    body: "One plain sentence is the whole intake. No forms, no questionnaires.",
    detail: "“Awwwards site like Active Theory”, “enterprise AI recruiting”, “Three.js portfolio for a motion designer”.",
  },
  {
    title: "Compose the COOK brain",
    body: "SkillForge selects specialist skills, builds Project DNA and craft artifacts, and writes COOK.md.",
    detail: "The brain carries direction, motion language and acceptance gates, so agents build against real expertise.",
  },
  {
    title: "Attach the body package",
    body: "PromptForge writes the phased body prompt, linked to COOK and the review gates.",
    detail: "Paste brain and body into any agentic AI, or hand them to your team.",
  },
];

const ANATOMY = [
  { title: "Mission Brief", line: "Objective, brand codename, and the north star the build must protect." },
  { title: "Brand Identity", line: "Name, tone, five-token palette, type pairing, and logo direction." },
  { title: "Design System", line: "Spacing scale, radius tokens, elevation, grid, and breakpoints." },
  { title: "Layout Law", line: "Nav behavior, hero math, section rhythm, and z-index scale." },
  { title: "Page Blueprints", line: "Every route with its purpose and an ordered section stack." },
  { title: "Component Contracts", line: "Named units with states, sizes, and timing values." },
  { title: "Copy Strategy", line: "Voice dial, headline options, CTA labels, and microcopy bank." },
  { title: "Motion Score", line: "Durations, easings, staggers, and reduced-motion law." },
  { title: "Technical Stack", line: "Framework, styling, data, and deploy, each with a reason." },
  { title: "SEO & Access", line: "Meta, OG art direction, JSON-LD, and a WCAG checklist." },
  { title: "Backend & Data", line: "Auth plan, table schemas, and typed API endpoints." },
  { title: "Definition of Done", line: "Acceptance criteria that let builders finish cleanly." },
];

const SAMPLE_PACKS = [
  { industry: "SaaS & Software", brandName: "Northline", rawPrompt: "Enterprise AI recruiting platform with council review gates", wordCount: 2140 },
  { industry: "Agency & Creative Studio", brandName: "Kiln Studio", rawPrompt: "Awwwards-grade motion studio site with scroll chapters", wordCount: 1988 },
  { industry: "AI Product", brandName: "Forge Desk", rawPrompt: "Expertise OS landing with brain/body handoff story", wordCount: 1764 },
];

const h2 = "font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] text-balance md:text-5xl";

function PackRow({ href, industry, brand, prompt, meta }: { href: string; industry: string; brand: string; prompt: string; meta: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group grid gap-1 py-6 transition-colors hover:bg-base-200/60 md:grid-cols-[13rem_1fr_auto] md:items-baseline md:gap-8 md:px-3"
      >
        <span className="text-sm font-medium text-accent">{industry}</span>
        <span>
          <span className="block font-display text-2xl font-semibold tracking-tight group-hover:text-primary">{brand}</span>
          <span className="mt-1 line-clamp-2 block max-w-xl text-[15px] leading-relaxed text-base-content/65">“{prompt}”</span>
        </span>
        <span className="text-sm text-base-content/55 tabular-nums">{meta}</span>
      </Link>
    </li>
  );
}

export function HomeView() {
  const router = useRouter();
  const [quick, setQuick] = useState("");
  const [recent, setRecent] = useState<PromptSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    fetch("/api/prompts?limit=6")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: PromptListResponse | null) => {
        if (d) {
          setRecent(d.prompts);
          setTotal(d.total);
        }
      })
      .catch(() => undefined)
      .finally(() => setLibraryLoaded(true));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setPhraseIndex((i) => (i + 1) % HERO_ROTATIONS.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quick.trim();
    router.push(q ? `/skillforge?q=${encodeURIComponent(q)}` : "/skillforge");
  };

  return (
    <>
      <section data-theme="forge-night" className="blueprint -mt-16 pt-16">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div className="animate-bench-in">
            <h1 className="font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.25rem]">
              Turn one sentence into a pack your agent can build from.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-base-content/80">
              PromptForge composes a COOK brain and a phased body protocol, reviewed before it ships.
            </p>

            <form onSubmit={submit} className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row" role="search">
              <label htmlFor="quick-brief" className="sr-only">Your project idea</label>
              <input
                id="quick-brief"
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                placeholder="Enterprise AI recruiting platform"
                maxLength={200}
                className="input input-lg w-full flex-1 border-white/25 bg-white/10 font-body text-base placeholder:text-base-content/50"
              />
              <button type="submit" className="btn btn-primary btn-lg">Compose pack</button>
            </form>

            <p className="mt-4 text-sm text-base-content/65">
              Try{" "}
              <button
                type="button"
                onClick={() => setQuick(HERO_ROTATIONS[phraseIndex])}
                className="rounded-field text-left font-medium text-base-content underline decoration-primary decoration-2 underline-offset-4"
              >
                {HERO_ROTATIONS[phraseIndex]}
              </button>
            </p>
            <p className="mt-2 text-sm text-base-content/55">Free · no account · packs save to your library.</p>
          </div>

          <div className="animate-bench-in rounded-box border border-white/15 bg-base-100/70 shadow-2xl shadow-black/30 backdrop-blur-sm [animation-delay:150ms]">
            <div className="flex items-baseline justify-between border-b border-white/10 px-5 py-4">
              <p className="font-mono text-sm font-medium">COOK.md</p>
              <p className="text-sm text-base-content/65">12 layers in every pack</p>
            </div>
            <ol className="py-2" aria-label="Layers in a finished pack">
              {ANATOMY.map((item, i) => (
                <li key={item.title} className="layer flex items-center gap-3 px-5 py-2.5" style={{ "--i": i } as CSSProperties}>
                  <span className="layer-dot size-2 shrink-0 rotate-45 bg-primary" aria-hidden />
                  <span className="font-display text-[1.05rem] font-medium">{item.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className={`${h2} max-w-2xl`}>Intent in. Expertise out.</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
              Three steps from an idea to a pack. SkillForge and PromptForge are two surfaces of one product.
            </p>
          </Reveal>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t-2 border-base-content pt-5">
                <p className="font-display text-sm font-semibold text-primary tabular-nums">Step {i + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-base-content/75">{step.body}</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-base-content/55">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="anatomy" className="border-t border-base-300 bg-base-200/60 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={h2}>Twelve layers inside a finished pack.</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-base-content/70">
              Not a chatbot reply. A filed expertise artifact your agent builds against, section by section.
            </p>
          </Reveal>
          <dl className="divide-y divide-base-300 border-y border-base-300">
            {ANATOMY.map((item) => (
              <div key={item.title} className="grid gap-1 py-5 md:grid-cols-[13rem_1fr] md:gap-8">
                <dt className="font-display text-lg font-semibold">{item.title}</dt>
                <dd className="text-[15px] leading-relaxed text-base-content/70">{item.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className={`${h2} max-w-3xl`}>Eighteen industries, matched from your first sentence.</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
              Each industry brings its own brand banks, palettes, routes, components, table schemas and endpoint patterns.
            </p>
          </Reveal>
          <ul className="mt-10 columns-2 gap-8 font-display text-lg font-medium md:columns-3 lg:columns-4">
            {INDUSTRIES.map((ind) => (
              <li key={ind.id} className="break-inside-avoid border-b border-base-300 py-2.5">{ind.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-base-300 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={h2}>Fresh from the forge.</h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-base-content/70">
                {total > 0 ? `${total} packs filed. ` : ""}Each keeps its brand, industry and word count, ready to reopen or hand to an agent.
              </p>
            </div>
            <Link href="/library" className="btn btn-outline">Open library</Link>
          </Reveal>

          <ul className="mt-10 divide-y divide-base-300 border-y border-base-300">
            {!libraryLoaded &&
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-6"><div className="skeleton h-16 w-full" /></li>
              ))}
            {libraryLoaded &&
              recent.length === 0 &&
              SAMPLE_PACKS.map((s) => (
                <PackRow
                  key={s.brandName}
                  href="/skillforge"
                  industry={s.industry}
                  brand={s.brandName}
                  prompt={s.rawPrompt}
                  meta={`Example · ${s.wordCount.toLocaleString()} words`}
                />
              ))}
            {recent.map((p) => (
              <PackRow
                key={p.id}
                href={`/spec/${p.id}`}
                industry={p.industry}
                brand={p.brandName}
                prompt={p.rawPrompt}
                meta={`${new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${p.wordCount.toLocaleString()} words`}
              />
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="forge-night" className="blueprint -mb-px px-5 py-24 md:px-8 md:py-32">
        <Reveal className="mx-auto max-w-[1200px]">
          <h2 className="max-w-3xl font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance md:text-7xl">
            Start with one sentence.
          </h2>
          <p className="mt-5 max-w-md text-lg text-base-content/75">Free to compose. No account. Packs stay in your library.</p>
          <Link href="/skillforge" className="btn btn-primary btn-lg mt-9">Compose a pack</Link>
        </Reveal>
      </section>
    </>
  );
}
