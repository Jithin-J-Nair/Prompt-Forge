"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight, Flame, Hammer, PackageCheck, ScanText, ArrowRight, Clock3,
} from "lucide-react";
import { Marquee, Eyebrow } from "@/components/chrome";
import { Reveal, TypeCycle, GlowCard, CountUp } from "@/components/motion";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";

const MARQUEE_ITEMS = [
  "Skill Graph", "Project DNA", "Master Blueprint", "Review Council",
  "Agent Handoff", "RAG Architecture", "Security Gates", "Performance Budgets",
  "Design Systems", "SaaS Strategy", "Prompt Injection Defense", "Export Pack",
];

const STEPS = [
  {
    icon: ScanText,
    no: "01",
    title: "State the intent",
    body: "One line is enough — “enterprise AI recruiting platform”, “RAG knowledge desk”, “Three.js portfolio”. Category + brief is the whole intake.",
    meta: "3–400 characters",
  },
  {
    icon: Hammer,
    no: "02",
    title: "Compose the experts",
    body: "SkillForge selects specialist skills, resolves conflicts, builds Project DNA, and drafts eleven blueprints — then the Review Council gates the package.",
    meta: "50 curated skills · 15 categories",
  },
  {
    icon: PackageCheck,
    no: "03",
    title: "Hand off to agents",
    body: "Export an instructional agent pack for Cursor, Claude, Codex, or a human team. Execution stays unauthorized until you say otherwise.",
    meta: "executionAuthorized: false",
  },
];

const ANATOMY = [
  { no: "01", title: "Mission Brief", line: "Objective, brand codename, north star." },
  { no: "02", title: "Brand Identity", line: "Name, slogan, tone, 5-token palette, type pairing, logo direction." },
  { no: "03", title: "Design System", line: "Spacing scale, radius tokens, elevation, grid, breakpoints." },
  { no: "04", title: "Layout Law", line: "Nav behavior, hero math, section rhythm, z-index scale." },
  { no: "05", title: "Page Blueprints", line: "Every route with purpose + ordered section stack." },
  { no: "06", title: "Component Contracts", line: "Named units with states, sizes and timing values." },
  { no: "07", title: "Copy Strategy", line: "Voice dial, headline options, CTA labels, microcopy bank." },
  { no: "08", title: "Motion Score", line: "Durations, easings, staggers, reduced-motion law." },
  { no: "09", title: "Technical Stack", line: "Framework, styling, data, deploy — with reasons." },
  { no: "10", title: "SEO & Access", line: "Meta, OG art direction, JSON-LD, WCAG 2.2 checklist." },
  { no: "11", title: "Backend & Data", line: "Auth plan, Drizzle tables, typed API endpoints." },
  { no: "12", title: "Definition of Done", line: "Acceptance criteria that make builders finish." },
];

export function HomeView() {
  const router = useRouter();
  const [quick, setQuick] = useState("");
  const [recent, setRecent] = useState<PromptSummary[]>([]);
  const [total, setTotal] = useState(0);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quick.trim();
    router.push(q ? `/skillforge?q=${encodeURIComponent(q)}` : "/skillforge");
  };

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16 md:px-10">
        <div className="mx-auto w-full max-w-[1280px]">
          <Reveal>
            <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-carbon/70 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-fog uppercase backdrop-blur">
              <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-ember" aria-hidden />
              PromptForge · SkillForge expertise OS · catalog v1.3
            </p>
          </Reveal>

          <h1 className="font-display text-[12vw] leading-[0.94] font-bold tracking-[-0.03em] uppercase select-none sm:text-[10vw] lg:text-[6.8rem]">
            <Reveal delay={0.05}>
              <span className="block">
                Prompt<span className="text-ember">Forge</span>
              </span>
            </Reveal>
            <Reveal delay={0.12}>
              <span className="block text-stroke">One idea in.</span>
            </Reveal>
            <Reveal delay={0.19}>
              <span className="text-gradient-ember block">Expert pack out.</span>
            </Reveal>
          </h1>

          <Reveal delay={0.34}>
            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="h-7 font-mono text-[13px] md:text-sm">
                  <TypeCycle phrases={HERO_ROTATIONS} />
                </p>
                <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-fog">
                  Compose a reviewed skill graph, Project DNA, and agent handoff
                  pack — elite specialist thinking embedded for AI agents and
                  human teams. Not a chatbot. An expertise operating system.
                </p>

                <form onSubmit={submit} className="mt-7 flex max-w-lg items-center gap-2" role="search">
                  <label htmlFor="quick-brief" className="sr-only">Your project idea</label>
                  <input
                    id="quick-brief"
                    value={quick}
                    onChange={(e) => setQuick(e.target.value)}
                    placeholder="build an enterprise AI recruiting platform..."
                    maxLength={200}
                    className="h-13 flex-1 rounded-lg border border-line bg-carbon/80 px-4 font-mono text-[13.5px] text-ivory placeholder:text-smoke focus:border-ember focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="group inline-flex h-13 shrink-0 items-center gap-2 rounded-lg bg-ember px-5 font-mono text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors duration-200 hover:bg-flare"
                  >
                    <Flame className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                    Compose
                  </button>
                </form>
              </div>

              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line lg:w-[420px]">
                {[
                  { k: "skills", v: 50, suffix: "" },
                  { k: "artifacts", v: 11, suffix: "" },
                  { k: "categories", v: 15, suffix: "" },
                ].map((s) => (
                  <div key={s.k} className="bg-carbon/80 px-5 py-4 backdrop-blur">
                    <dd className="font-display text-2xl font-bold text-ember md:text-3xl">
                      <CountUp to={s.v} suffix={s.suffix} />
                    </dd>
                    <dt className="mt-1 font-mono text-[10px] tracking-[0.16em] text-smoke uppercase">{s.k}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <div aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="block h-10 w-px animate-pulse-soft bg-gradient-to-b from-transparent via-ember to-transparent" />
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      {/* ============================ PROTOCOL ============================ */}
      <section id="how" className="relative px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <Eyebrow>The protocol</Eyebrow>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl font-display text-4xl leading-[1.02] font-bold tracking-tight uppercase md:text-6xl">
                Intent in,
                <br />
                <span className="text-gradient-ember">expertise out.</span>
              </h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-fog">
                Three stages, one forge. SkillForge composes specialists,
                gates quality through the Review Council, and exports an
                agent-ready instructional pack.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.1}>
                <GlowCard className="group h-full rounded-xl border border-line bg-carbon/60 p-7 backdrop-blur transition-colors duration-300 hover:border-ember/50">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-lg border border-line bg-coal text-ember transition-colors duration-300 group-hover:border-ember/60">
                      <s.icon className="size-5" strokeWidth={1.7} />
                    </span>
                    <span className="font-display text-5xl font-bold text-stroke-ember">{s.no}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight uppercase">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-fog">{s.body}</p>
                  <p className="mt-6 border-t border-line pt-4 font-mono text-[10.5px] tracking-[0.16em] text-smoke uppercase">
                    {s.meta}
                  </p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ANATOMY ============================ */}
      <section id="anatomy" className="relative border-t border-line px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <Eyebrow>Anatomy of the artifact</Eyebrow>
            <h2 className="max-w-3xl font-display text-4xl leading-[1.02] font-bold tracking-tight uppercase md:text-6xl">
              What a <span className="font-serif-d text-ember normal-case italic">mega prompt</span> is made of.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ANATOMY.map((a, i) => (
              <Reveal key={a.no} delay={(i % 3) * 0.06}>
                <GlowCard className="group flex h-full min-h-[168px] flex-col justify-between bg-coal p-6 transition-colors duration-300 hover:bg-carbon">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] text-ember">{a.no}</span>
                    <ArrowUpRight className="size-4 text-smoke opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ember group-hover:opacity-100" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight uppercase">{a.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-fog">{a.line}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ INDUSTRY COVERAGE ============================ */}
      <section className="relative border-t border-line px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Detection matrix</Eyebrow>
                <h2 className="font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
                  18 industries. <span className="text-stroke">Zero babysitting.</span>
                </h2>
              </div>
              <p className="max-w-sm text-[14.5px] leading-relaxed text-fog">
                Each vertical ships its own brand banks, palettes, routes,
                components, table schemas and endpoint patterns — matched to
                your brief in milliseconds.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <span
                  key={ind.id}
                  className="rounded-full border border-line bg-carbon/60 px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-fog uppercase transition-colors duration-200 hover:border-ember/60 hover:text-ember"
                >
                  {ind.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FRESH FROM THE FORGE ============================ */}
      <section className="relative border-t border-line px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Live ledger{total > 0 ? ` · ${total} forged` : ""}</Eyebrow>
                <h2 className="font-display text-4xl font-bold tracking-tight uppercase md:text-6xl">
                  Fresh from <span className="text-gradient-ember">the forge.</span>
                </h2>
              </div>
              <Link
                href="/library"
                className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-fog uppercase transition-colors hover:text-ember"
              >
                Open the full library
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[188px] animate-pulse rounded-xl border border-line bg-carbon/40" />
              ))}
            {recent.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link href={`/spec/${p.id}`} className="group block h-full">
                  <GlowCard className="flex h-full flex-col justify-between rounded-xl border border-line bg-carbon/60 p-6 transition-colors duration-300 group-hover:border-ember/50">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-ember uppercase">
                          {p.industry}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-smoke">
                          <Clock3 className="size-3" />
                          {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight uppercase transition-colors group-hover:text-ember">
                        {p.brandName}
                      </h3>
                      <p className="mt-2 line-clamp-2 font-mono text-[12px] leading-relaxed text-fog">
                        “{p.rawPrompt}”
                      </p>
                    </div>
                    <p className="mt-6 border-t border-line pt-4 font-mono text-[10.5px] tracking-[0.14em] text-smoke uppercase">
                      {p.wordCount.toLocaleString()} words · 12 sections · view spec
                    </p>
                  </GlowCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA BAND ============================ */}
      <section className="relative overflow-hidden border-t border-line px-6 py-28 text-center md:px-10 md:py-40">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,92,28,0.1),transparent_70%)]" />
        <Reveal>
          <Eyebrow>
            <span className="mx-auto">Ignition</span>
          </Eyebrow>
          <h2 className="mx-auto max-w-4xl font-display text-5xl leading-[0.98] font-bold tracking-tight uppercase md:text-8xl">
            Your next site starts as <span className="text-gradient-ember">one dumb sentence.</span>
          </h2>
          <Link
            href="/forge"
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-ember px-9 py-4.5 font-mono text-[13px] font-medium tracking-[0.16em] text-ink uppercase transition-all duration-300 hover:bg-flare hover:shadow-[0_0_60px_rgba(255,92,28,0.45)]"
          >
            <Flame className="size-4.5 transition-transform duration-300 group-hover:rotate-12" />
            Open the forge
            <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-smoke uppercase">
            Free · No account · Specs stay in your library
          </p>
        </Reveal>
      </section>
    </>
  );
}
