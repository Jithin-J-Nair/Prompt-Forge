"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  FileText,
  ScanText,
  Clock3,
} from "lucide-react";
import { SectionLabel } from "@/components/chrome";
import { Reveal } from "@/components/motion";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";

const STEPS = [
  {
    icon: ScanText,
    title: "State the intent",
    body: "One line is enough — category plus a short brief is the whole intake.",
  },
  {
    icon: Brain,
    title: "Compose the brain",
    body: "SkillForge selects skills, builds Project DNA, and downloads COOK.md for your agent.",
  },
  {
    icon: FileText,
    title: "Attach the body",
    body: "PromptForge writes the phased body prompt with skill links and review gates.",
  },
];

const ANATOMY = [
  { title: "Mission Brief", line: "Objective, brand codename, north star." },
  { title: "Brand Identity", line: "Name, tone, palette, type, logo direction." },
  { title: "Design System", line: "Spacing, radius, elevation, grid, breakpoints." },
  { title: "Layout Law", line: "Nav, hero math, section rhythm, z-index." },
  { title: "Page Blueprints", line: "Every route with purpose and section stack." },
  { title: "Component Contracts", line: "Named units with states and timing." },
  { title: "Copy Strategy", line: "Voice, headlines, CTAs, microcopy bank." },
  { title: "Motion Score", line: "Durations, easings, reduced-motion law." },
  { title: "Technical Stack", line: "Framework, styling, data, deploy — with reasons." },
  { title: "SEO & Access", line: "Meta, OG, JSON-LD, WCAG checklist." },
  { title: "Backend & Data", line: "Auth, tables, typed API endpoints." },
  { title: "Definition of Done", line: "Acceptance criteria builders finish against." },
];

export function HomeView() {
  const router = useRouter();
  const [quick, setQuick] = useState("");
  const [recent, setRecent] = useState<PromptSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    fetch("/api/prompts?limit=6")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: PromptListResponse | null) => {
        if (d) {
          setRecent(d.prompts);
          setTotal(d.total);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % HERO_ROTATIONS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

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
            <p className="mt-4 min-h-6 font-mono text-sm text-accent" aria-live="polite">
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

      <section id="how" className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>How it works</SectionLabel>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight md:text-5xl">
                Intent in, expertise out.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-base-content/70">
                SkillForge builds the COOK brain. PromptForge writes the body.
                Same product, two surfaces.
              </p>
            </div>
          </Reveal>

          <ul className="steps steps-vertical mt-12 w-full lg:steps-horizontal">
            {STEPS.map((step) => (
              <li key={step.title} className="step step-primary">
                <div className="mt-3 max-w-xs text-left lg:mx-auto lg:text-center">
                  <step.icon className="mb-2 size-5 text-primary lg:mx-auto" strokeWidth={1.7} />
                  <p className="font-display text-lg font-bold">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-base-content/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="anatomy" className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>What ships in a pack</SectionLabel>
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight md:text-5xl">
              The layers inside a finished package.
            </h2>
          </Reveal>

          <ul className="list mt-10 rounded-box border border-base-300 bg-base-100">
            {ANATOMY.map((item) => (
              <li key={item.title} className="list-row items-start py-4">
                <div className="list-col-grow">
                  <p className="font-display text-base font-semibold">{item.title}</p>
                  <p className="text-sm text-base-content/65">{item.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionLabel>Coverage</SectionLabel>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
              Eighteen industries, matched in milliseconds.
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <span key={ind.id} className="badge badge-outline badge-lg">
                {ind.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>
                  Library{total > 0 ? ` · ${total} forged` : ""}
                </SectionLabel>
                <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                  Fresh from the forge.
                </h2>
              </div>
              <Link href="/library" className="btn btn-ghost gap-2">
                Open library
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-44 rounded-box" />
              ))}
            {recent.map((p) => (
              <Link key={p.id} href={`/spec/${p.id}`} className="card card-border bg-base-100 transition-colors hover:border-primary">
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
                  <h3 className="card-title font-display text-xl">{p.brandName}</h3>
                  <p className="line-clamp-2 text-sm text-base-content/65">“{p.rawPrompt}”</p>
                  <p className="mt-2 font-mono text-xs opacity-55">
                    {p.wordCount.toLocaleString()} words
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-base-300 px-4 py-24 text-center md:px-8 md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            Start with one sentence.
          </h2>
          <Link href="/skillforge" className="btn btn-primary btn-lg mt-10">
            Compose a package
          </Link>
          <p className="mt-4 font-mono text-xs opacity-55">
            Free · No account · Specs stay in your library
          </p>
        </Reveal>
      </section>
    </>
  );
}
