"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  FileText,
  PackageCheck,
  ScanText,
} from "lucide-react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { CookTerminal } from "@/components/cook-terminal";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";

const STEPS = [
  {
    icon: ScanText,
    no: "01",
    title: "State the intent",
    body: "One plain sentence is the whole intake. No forms, no questionnaires.",
    detail:
      "Examples: Awwwards site like Active Theory, enterprise AI recruiting, Three.js portfolio for a motion designer.",
    meta: "3–400 characters · SkillForge intake",
    frame: "brief" as const,
  },
  {
    icon: Brain,
    no: "02",
    title: "Compose the COOK brain",
    body: "SkillForge selects specialist skills, builds Project DNA and craft artifacts, and writes COOK.md.",
    detail:
      "The brain carries direction, motion language and acceptance gates, so agents build against real expertise.",
    meta: "COOK.md · skill graph · Review Council",
    frame: "cook" as const,
  },
  {
    icon: FileText,
    no: "03",
    title: "Attach the body package",
    body: "PromptForge writes the phased body prompt, linked to COOK and the review gates.",
    detail: "Paste brain and body into any agentic AI, or hand them to your team.",
    meta: "Body protocol · phases · handoff pack",
    frame: "body" as const,
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
  {
    industry: "SaaS & Software",
    brandName: "Northline",
    rawPrompt: "Enterprise AI recruiting platform with council review gates",
    wordCount: 2140,
  },
  {
    industry: "Agency & Creative Studio",
    brandName: "Kiln Studio",
    rawPrompt: "Awwwards-grade motion studio site with scroll chapters",
    wordCount: 1988,
  },
  {
    industry: "AI Product",
    brandName: "Forge Desk",
    rawPrompt: "Expertise OS landing with brain/body handoff story",
    wordCount: 1764,
  },
];

const h2 =
  "font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] text-balance md:text-5xl lg:text-[3.25rem]";

function HowFrame({ step }: { step: (typeof STEPS)[number] }) {
  if (step.frame === "brief") {
    return (
      <div className="flex h-full flex-col justify-between gap-4 p-5 md:p-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.12em] text-primary uppercase">
            Intake
          </p>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
            Enterprise AI recruiting with council gates
          </p>
        </div>
        <div className="rounded-field border border-white/15 bg-white/5 p-4 font-mono text-xs leading-relaxed text-base-content/70">
          category · ai-product
          <br />
          length · 58 chars
          <br />
          status · ready to compose
        </div>
      </div>
    );
  }
  if (step.frame === "cook") {
    return (
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-4 font-mono text-[11px] leading-relaxed md:p-5">
        <p className="text-accent"># COOK.md — BRAIN</p>
        <p className="text-base-content/80">## Mission</p>
        <p className="text-base-content/65">- North star: council-gated shortlists</p>
        <p className="text-base-content/80">## Expertise graph</p>
        <p className="text-primary">01 craft-direction</p>
        <p className="text-primary">02 layout-law</p>
        <p className="text-primary">03 copy-strategy</p>
        <p className="mt-auto text-success">ACCEPTED for export</p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-5 md:p-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.12em] text-accent uppercase">
          Body protocol
        </p>
        <p className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
          Phased execution for the agent
        </p>
      </div>
      <ol className="space-y-2 font-mono text-xs text-base-content/70">
        <li>01 · Attach COOK.md as source of truth</li>
        <li>02 · Run phases with skill links</li>
        <li>03 · Pass review gates before claim-done</li>
      </ol>
    </div>
  );
}

/** Dealt moment: pinned-chapters — steps open while the frame crossfades. */
function HowItWorksPinned() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [pinnedProgress, setPinnedProgress] = useState(0);

  useEffect(() => {
    if (reduce) {
      setActive(STEPS.length - 1);
      return;
    }

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setPinnedProgress(1);
        return;
      }
      const raw = Math.min(1, Math.max(0, -rect.top / total));
      setPinnedProgress(raw);
      const idx = Math.min(STEPS.length - 1, Math.floor(raw * STEPS.length));
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    if (pinnedProgress > 0.02) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce, pinnedProgress]);

  return (
    <>
    <div
      ref={sectionRef}
      className="relative mt-14"
      style={{ minHeight: reduce ? undefined : "210vh" }}
    >
      <div
        className={clsx(
          "grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12",
          !reduce && "lg:sticky lg:top-24 lg:min-h-[calc(100vh-8rem)]",
        )}
      >
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const lit = i === active;
            return (
              <button
                key={step.no}
                type="button"
                onClick={() => setActive(i)}
                className={clsx(
                  "w-full border-t-2 px-1 py-5 text-left transition-[opacity,border-color,color] duration-300",
                  lit
                    ? "border-primary opacity-100"
                    : "border-base-300 opacity-50 hover:opacity-80",
                )}
                aria-current={lit ? "step" : undefined}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={clsx(
                      "mt-0.5 grid size-9 shrink-0 place-items-center rounded-field border",
                      lit
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-300 bg-base-200 text-base-content/45",
                    )}
                  >
                    <step.icon className="size-4" strokeWidth={1.8} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                        {step.title}
                      </h3>
                      <span className="font-mono text-[10px] text-primary tabular-nums">
                        {step.no}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-base-content/75">
                      {step.body}
                    </p>
                    {lit ? (
                      <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                        {step.detail}
                      </p>
                    ) : null}
                    <p className="mt-2 font-mono text-[10px] tracking-wide text-base-content/45 uppercase">
                      {step.meta}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          data-theme="forge-night"
          className="relative min-h-[280px] overflow-hidden rounded-box border border-white/15 bg-base-100 md:min-h-[340px]"
        >
          <div key={STEPS[active].no} className="absolute inset-0 bg-base-100">
            <HowFrame step={STEPS[active]} />
          </div>
        </div>
      </div>
    </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border border-base-300 bg-base-200/70 px-5 py-4">
        <PackageCheck className="size-5 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <p className="text-sm leading-relaxed text-base-content/75 md:text-[15px]">
          Result: a reviewed expertise pack —{" "}
          <span className="font-medium text-base-content">COOK brain</span> plus{" "}
          <span className="font-medium text-base-content">body protocol</span> — ready for
          agents and human teams.
        </p>
      </div>
    </>
  );
}

function PackRow({
  href,
  industry,
  brand,
  prompt,
  meta,
}: {
  href: string;
  industry: string;
  brand: string;
  prompt: string;
  meta: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group grid gap-1 py-6 transition-colors hover:bg-base-200/60 md:grid-cols-[13rem_1fr_auto] md:items-baseline md:gap-8 md:px-3"
      >
        <span className="text-sm font-medium text-accent">{industry}</span>
        <span>
          <span className="block font-display text-2xl font-semibold tracking-tight group-hover:text-primary">
            {brand}
          </span>
          <span className="mt-1 line-clamp-2 block max-w-xl text-[15px] leading-relaxed text-base-content/65">
            “{prompt}”
          </span>
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
    const id = window.setInterval(
      () => setPhraseIndex((i) => (i + 1) % HERO_ROTATIONS.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quick.trim();
    router.push(q ? `/skillforge?q=${encodeURIComponent(q)}` : "/skillforge");
  };

  return (
    <>
      {/* deal: hero centred · forge blueprint · nav-centre · footer-dark · close-word · pinned-chapters */}
      <section
        data-theme="forge-night"
        data-enter
        className="blueprint relative -mt-16 min-h-[100dvh] pt-16"
        aria-labelledby="hero-h"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pt-14 pb-10 text-center md:px-8 md:pt-20 md:pb-14">
          <div className={clsx("w-full max-w-3xl", !reduce && "hero-enter-copy")}>
            <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
              Expertise OS · SkillForge + PromptForge
            </p>
            <h1
              id="hero-h"
              className="mt-4 font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.25rem]"
            >
              PromptForge
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-lg leading-relaxed text-base-content/80">
              Agent-cookable expertise packs — COOK.md brain plus body protocol from one
              sentence.
            </p>

            <form
              onSubmit={submit}
              className="mx-auto mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
              role="search"
            >
              <label htmlFor="quick-brief" className="sr-only">
                Your project idea
              </label>
              <input
                id="quick-brief"
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                placeholder="Enterprise AI recruiting platform"
                maxLength={200}
                className="input input-lg w-full flex-1 border-white/25 bg-white/10 font-body text-base placeholder:text-base-content/50"
              />
              <button type="submit" className="btn btn-primary btn-lg shrink-0">
                Compose package
              </button>
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
            <p className="mt-2 font-mono text-xs text-base-content/55">
              Free · no account · packs save to your library
            </p>
          </div>

          <div
            className={clsx(
              "hero-terminal-mask mt-10 w-full max-w-3xl",
              !reduce && "hero-enter-media",
            )}
          >
            <CookTerminal />
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <h2 className={`${h2} max-w-2xl`}>Intent in. Expertise out.</h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
            Three steps from an idea to a pack. SkillForge and PromptForge are two surfaces of
            one product.
          </p>
          <HowItWorksPinned />
        </div>
      </section>

      <section
        id="anatomy"
        className="border-t border-base-300 bg-base-200/60 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={h2}>Twelve layers inside a finished pack.</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-base-content/70">
              Not a chatbot reply. A filed expertise artifact your agent builds against,
              section by section.
            </p>
          </div>
          <dl className="divide-y divide-base-300 border-y border-base-300">
            {ANATOMY.map((item) => (
              <div
                key={item.title}
                className="grid gap-1 py-5 md:grid-cols-[13rem_1fr] md:gap-8"
              >
                <dt className="font-display text-lg font-semibold">{item.title}</dt>
                <dd className="text-[15px] leading-relaxed text-base-content/70">{item.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        data-theme="forge-night"
        className="blueprint border-t border-white/10 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className={`${h2} max-w-3xl`}>
            Eighteen industries, matched from your first sentence.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
            Each industry brings its own brand banks, palettes, routes, components, table
            schemas and endpoint patterns.
          </p>
          <ul className="mt-10 columns-2 gap-8 font-display text-lg font-medium md:columns-3 lg:columns-4">
            {INDUSTRIES.map((ind) => (
              <li key={ind.id} className="break-inside-avoid border-b border-white/15 py-2.5">
                {ind.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-base-300 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={h2}>Fresh from the forge.</h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-base-content/70">
                {total > 0 ? `${total} packs filed. ` : ""}
                Each keeps its brand, industry and word count, ready to reopen or hand to an
                agent.
              </p>
            </div>
            <Link href="/library" className="btn btn-outline gap-2">
              Open library
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-10 divide-y divide-base-300 border-y border-base-300">
            {!libraryLoaded &&
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-6">
                  <div className="skeleton h-16 w-full" />
                </li>
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
                meta={`${new Date(p.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} · ${p.wordCount.toLocaleString()} words`}
              />
            ))}
          </ul>
        </div>
      </section>

      <section
        data-theme="forge-night"
        className="blueprint -mb-px px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance md:text-7xl">
              Start with one sentence.
            </h2>
            <p className="mt-5 max-w-md text-lg text-base-content/75">
              Free to compose. No account. Packs stay in your library.
            </p>
          </div>
          <Link href="/skillforge" className="btn btn-primary btn-lg">
            Compose package
          </Link>
        </div>
      </section>
    </>
  );
}
