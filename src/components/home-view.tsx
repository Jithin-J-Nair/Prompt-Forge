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
  Clock3,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useInView, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/chrome";
import { Reveal } from "@/components/motion";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";

const STEPS = [
  {
    icon: ScanText,
    no: "01",
    title: "State the intent",
    body: "One plain sentence is enough — category plus a short brief is the whole intake. No forms, no questionnaires.",
    meta: "3–400 characters · SkillForge intake",
    detail:
      "Examples: “Awwwards site like Active Theory”, “enterprise AI recruiting”, “Three.js portfolio for a motion designer”.",
  },
  {
    icon: Brain,
    no: "02",
    title: "Compose the COOK brain",
    body: "SkillForge selects specialist skills, builds Project DNA and craft artifacts, then downloads COOK.md — the full expertise brain for your agent.",
    meta: "COOK.md · skill graph · Review Council",
    detail:
      "The brain carries direction, motion language, and acceptance gates so coding agents cook against real expertise — not vibes.",
  },
  {
    icon: FileText,
    no: "03",
    title: "Attach the body package",
    body: "PromptForge writes the phased body prompt with skill links into COOK and review gates. Paste brain + body into any agentic AI.",
    meta: "Body protocol · phases · handoff pack",
    detail:
      "Brain + body = category-best craft packs agents can execute. Same product, two surfaces.",
  },
];

const ANATOMY = [
  {
    title: "Mission Brief",
    line: "Objective, brand codename, and the north star the build must protect.",
  },
  {
    title: "Brand Identity",
    line: "Name, tone, five-token palette, type pairing, and logo direction.",
  },
  {
    title: "Design System",
    line: "Spacing scale, radius tokens, elevation, grid, and breakpoints.",
  },
  {
    title: "Layout Law",
    line: "Nav behavior, hero math, section rhythm, and z-index scale.",
  },
  {
    title: "Page Blueprints",
    line: "Every route with purpose and an ordered section stack.",
  },
  {
    title: "Component Contracts",
    line: "Named units with states, sizes, and timing values.",
  },
  {
    title: "Copy Strategy",
    line: "Voice dial, headline options, CTA labels, and microcopy bank.",
  },
  {
    title: "Motion Score",
    line: "Durations, easings, staggers, and reduced-motion law.",
  },
  {
    title: "Technical Stack",
    line: "Framework, styling, data, and deploy — each with a reason.",
  },
  {
    title: "SEO & Access",
    line: "Meta, OG art direction, JSON-LD, and WCAG checklist.",
  },
  {
    title: "Backend & Data",
    line: "Auth plan, table schemas, and typed API endpoints.",
  },
  {
    title: "Definition of Done",
    line: "Acceptance criteria that make builders finish cleanly.",
  },
];

const SAMPLE_PACKS = [
  {
    industry: "SaaS & Software",
    brandName: "Northline",
    rawPrompt: "Enterprise AI recruiting platform with council review gates",
    wordCount: 2140,
    surface: "COOK + body",
  },
  {
    industry: "Agency & Creative Studio",
    brandName: "Kiln Studio",
    rawPrompt: "Awwwards-grade motion studio site with scroll chapters",
    wordCount: 1988,
    surface: "Skill graph",
  },
  {
    industry: "AI Product",
    brandName: "Forge Desk",
    rawPrompt: "Expertise OS landing with brain/body handoff story",
    wordCount: 1764,
    surface: "Project DNA",
  },
];

function HowItWorksFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setActive(STEPS.length);
      return;
    }
    setActive(1);
    let n = 1;
    const id = window.setInterval(() => {
      n += 1;
      setActive(n);
      if (n >= STEPS.length) window.clearInterval(id);
    }, 780);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="mt-14 space-y-12">
      <ul
        className="steps steps-vertical w-full lg:steps-horizontal"
        aria-label="How PromptForge works"
      >
        {STEPS.map((step, i) => (
          <li
            key={step.no}
            data-content={step.no}
            className={clsx(
              "step min-h-16 lg:min-h-0",
              i < active ? "step-primary" : "text-base-content/40",
            )}
          >
            <div
              className={clsx(
                "mt-2 max-w-xs text-left transition-opacity duration-500 lg:mx-auto lg:text-center",
                i < active ? "opacity-100" : "opacity-45",
              )}
            >
              <p className="font-display text-base font-bold md:text-lg">{step.title}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => {
          const lit = i < active;
          return (
            <article
              key={step.no}
              className={clsx(
                "card card-border h-full bg-base-100 transition-[opacity,border-color,transform,box-shadow] duration-500",
                lit
                  ? "border-primary/45 opacity-100 shadow-sm"
                  : "opacity-50",
              )}
            >
              <div className="card-body gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={clsx(
                      "grid size-10 place-items-center rounded-field border transition-colors duration-500",
                      lit
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-300 bg-base-200 text-base-content/45",
                    )}
                  >
                    <step.icon className="size-4.5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-primary tabular-nums">
                    {step.no}
                  </span>
                </div>
                <h3 className="card-title font-display text-xl md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-base-content/75">
                  {step.body}
                </p>
                <p className="border-t border-base-300 pt-3 text-sm leading-relaxed text-base-content/60">
                  {step.detail}
                </p>
                <p className="font-mono text-[10px] tracking-wide text-base-content/45 uppercase">
                  {step.meta}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-box border border-base-300 bg-base-200/70 px-5 py-4">
        <PackageCheck className="size-5 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <p className="text-sm leading-relaxed text-base-content/75 md:text-[15px]">
          Result: a reviewed expertise pack —{" "}
          <span className="font-medium text-base-content">COOK brain</span> plus{" "}
          <span className="font-medium text-base-content">body protocol</span> — ready
          for agents and human teams.
        </p>
      </div>
    </div>
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
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % HERO_ROTATIONS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quick.trim();
    router.push(q ? `/skillforge?q=${encodeURIComponent(q)}` : "/skillforge");
  };

  return (
    <>
      <section className="hero relative min-h-[100svh] px-4 pt-8 pb-16 md:px-8">
        <div className="hero-content w-full max-w-[1120px] flex-col items-start gap-10 py-16 lg:py-24">
          <div className="animate-bench-in w-full max-w-3xl">
            <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              PromptForge
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-base-content/75 md:text-xl">
              Compose expertise packs agents can execute — brain in COOK.md, body
              as the build protocol.
            </p>
            <p
              className="mt-4 min-h-6 font-mono text-sm text-accent"
              aria-live="polite"
            >
              {HERO_ROTATIONS[phraseIndex]}
            </p>

            <form onSubmit={submit} className="join mt-8 w-full max-w-xl" role="search">
              <label htmlFor="quick-brief" className="sr-only">
                Your project idea
              </label>
              <input
                id="quick-brief"
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                placeholder="Enterprise AI recruiting platform…"
                maxLength={200}
                className="input join-item input-bordered w-full"
              />
              <button type="submit" className="btn btn-primary join-item">
                Compose
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="how" className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>How it works</SectionLabel>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-7xl">
                Intent in.
                <br />
                Expertise out.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-base-content/70 md:text-[17px]">
                Three beats: state the idea, compose the COOK brain, attach the body
                protocol. Same product — SkillForge and PromptForge as two surfaces.
              </p>
            </div>
          </Reveal>

          <HowItWorksFlow />
        </div>
      </section>

      <section id="anatomy" className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>What ships in a pack</SectionLabel>
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
              Twelve layers inside a finished package.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70 md:text-[17px]">
              Not a chatbot reply — a filed expertise artifact agents can cook against,
              section by section.
            </p>
          </Reveal>

          <ul className="list mt-12 rounded-box border border-base-300 bg-base-100">
            {ANATOMY.map((item, i) => (
              <li
                key={item.title}
                className="list-row items-start gap-4 py-5 transition-colors hover:bg-base-200/50"
              >
                <span className="font-mono text-xs text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="list-col-grow">
                  <p className="font-display text-lg font-semibold md:text-xl">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-base-content/65">
                    {item.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>Coverage</SectionLabel>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl lg:text-6xl">
                Eighteen industries. Matched in milliseconds.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-base-content/70 md:text-[15px]">
                Each vertical ships its own brand banks, palettes, routes, components,
                table schemas, and endpoint patterns — locked to your brief without
                babysitting.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind.id}
                className="badge badge-outline badge-lg h-auto min-h-8 px-4 py-2.5 font-mono text-[11px] tracking-wide"
              >
                {ind.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>
                  Library{total > 0 ? ` · ${total} forged` : ""}
                </SectionLabel>
                <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
                  Fresh from the forge.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-base-content/70">
                  Filed specs keep brand, industry verdict, and word count — ready to
                  reopen or hand to an agent.
                </p>
              </div>
              <Link href="/library" className="btn btn-ghost gap-2">
                Open library
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!libraryLoaded &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-52 rounded-box" />
              ))}

            {libraryLoaded &&
              recent.length === 0 &&
              SAMPLE_PACKS.map((sample) => (
                <div
                  key={sample.brandName}
                  className="card card-border bg-base-100 shadow-none"
                >
                  <div className="card-body gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-soft badge-primary">
                        {sample.industry}
                      </span>
                      <span className="badge badge-ghost gap-1 font-mono text-[10px]">
                        <Sparkles className="size-3" aria-hidden />
                        Example
                      </span>
                    </div>
                    <h3 className="card-title font-display text-2xl">
                      {sample.brandName}
                    </h3>
                    <p className="line-clamp-2 text-[15px] leading-relaxed text-base-content/65">
                      “{sample.rawPrompt}”
                    </p>
                    <p className="mt-1 font-mono text-xs text-base-content/50">
                      {sample.wordCount.toLocaleString()} words · {sample.surface}
                    </p>
                    <div className="card-actions mt-2">
                      <Link href="/skillforge" className="btn btn-sm btn-soft">
                        Compose one like this
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            {recent.map((p) => (
              <Link
                key={p.id}
                href={`/spec/${p.id}`}
                className="card card-border bg-base-100 transition-[border-color,transform] hover:border-primary"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-soft badge-primary">{p.industry}</span>
                    <span className="flex items-center gap-1 font-mono text-xs opacity-60">
                      <Clock3 className="size-3" />
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="card-title font-display text-2xl">{p.brandName}</h3>
                  <p className="line-clamp-2 text-[15px] leading-relaxed text-base-content/65">
                    “{p.rawPrompt}”
                  </p>
                  <p className="mt-2 font-mono text-xs opacity-55">
                    {p.wordCount.toLocaleString()} words · 12 sections
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-28 text-center md:px-8 md:py-36">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-5xl leading-[1.02] font-bold tracking-tight md:text-7xl">
            Start with one sentence.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-base-content/70">
            Free compose · no account · packs stay in your library.
          </p>
          <Link href="/skillforge" className="btn btn-primary btn-lg mt-10">
            Compose a package
          </Link>
        </Reveal>
      </section>
    </>
  );
}
