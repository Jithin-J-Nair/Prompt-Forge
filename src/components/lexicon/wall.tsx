"use client";

/* ------------------------------------------------------------------ */
/*  Lexicon Wall — every prompt keyword, separately clickable.          */
/*  Facet rail (family · energy · search) + staggered chip grid that    */
/*  feeds the global Stack Tray.                                        */
/* ------------------------------------------------------------------ */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { FAMILIES, LEXICON, familyCount, searchLexicon, type Energy, type Keyword } from "@/lib/lexicon";
import { useStack } from "@/components/lexicon/stack";
import { Stagger, StaggerChild } from "@/components/motion";
import { motionTokens } from "@/lib/motion/tokens";

const ENERGIES: { id: Energy; label: string }[] = [
  { id: "calm", label: "Calm" },
  { id: "kinetic", label: "Kinetic" },
  { id: "extreme", label: "Extreme" },
];

const ENERGY_DOT: Record<Energy, string> = {
  calm: "bg-fog", kinetic: "bg-flare", extreme: "bg-blood",
};

function ChipCard({ k, index }: { k: Keyword; index: number }) {
  const { has, toggle } = useStack();
  const on = has(k.id);
  return (
    <StaggerChild className="h-full">
      <button
        onClick={() => toggle(k.id)}
        aria-pressed={on}
        className={clsx(
          "group flex h-full w-full flex-col rounded-lg border p-4 text-left transition-all duration-300",
          on
            ? "border-ember/60 bg-ember/10 shadow-[0_0_28px_-8px_rgba(255,92,28,0.35)]"
            : "border-line bg-carbon/60 hover:-translate-y-0.5 hover:border-line-bright",
        )}
      >
        <span className="flex items-start justify-between gap-2">
          <span className={clsx("font-display text-[14.5px] font-bold leading-snug transition-colors", on ? "text-ember" : "text-ivory")}>
            {k.name}
          </span>
          <span
            className={clsx(
              "press mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
              on ? "border-ember bg-ember text-ink" : "border-line text-smoke group-hover:border-line-bright group-hover:text-ivory",
            )}
            aria-hidden
          >
            {on ? <Check className="size-3" /> : <Plus className="size-3" />}
          </span>
        </span>
        <span className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
          <span className={clsx("size-1 rounded-full", ENERGY_DOT[k.energy])} aria-hidden />
          {k.fam} · {k.sub}
        </span>
        <span className="mt-2.5 line-clamp-2 text-[12px] leading-relaxed text-fog">{k.phrase}</span>
      </button>
    </StaggerChild>
  );
}

export function LexiconWall() {
  const [query, setQuery] = useState("");
  const [fam, setFam] = useState<string | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);

  const results = useMemo(() => searchLexicon(query, fam ?? undefined, energy ?? undefined), [query, fam, energy]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-44 pt-32 md:px-8">
      {/* header */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
          Prompt lexicon · <span className="tabular text-ember">{LEXICON.length} keywords</span>
        </p>
        <h1 className="font-display text-5xl font-black leading-[0.95] tracking-[-0.04em] text-ivory md:text-7xl">
          Every keyword.<br />
          <span className="text-gradient-ember">Individually clickable.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[14.5px] leading-relaxed text-fog">
          Click chips to stack them. The tray follows you everywhere; compile to
          v0, Cursor, Claude or a raw spec when the stack says everything you mean.
        </p>
      </div>

      {/* facet rail */}
      <div className="sticky top-20 z-30 mx-auto mt-12 max-w-5xl">
        <div className="glass flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-2.5">
            <Search className="size-4 shrink-0 text-smoke" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the lexicon — spring, voronoi, glass, scramble…"
              className="w-full bg-transparent font-mono text-[12px] text-ivory placeholder:text-smoke focus:outline-none"
              aria-label="Search keywords"
            />
          </label>
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setFam(null)}
              className={clsx("press shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                fam === null ? "bg-ember text-ink" : "text-fog hover:text-ivory")}
            >
              All
            </button>
            {FAMILIES.map((f) => (
              <button
                key={f}
                onClick={() => setFam(fam === f ? null : f)}
                className={clsx("press shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                  fam === f ? "bg-ember text-ink" : "text-fog hover:text-ivory")}
              >
                {f} <span className="tabular opacity-60">{familyCount(f)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1">
          {ENERGIES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEnergy(energy === e.id ? null : e.id)}
              className={clsx("press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] transition-colors",
                energy === e.id ? "border-ember/50 bg-ember/10 text-flare" : "border-line text-smoke hover:text-fog")}
            >
              <span className={clsx("size-1.5 rounded-full", ENERGY_DOT[e.id])} aria-hidden />
              {e.label}
            </button>
          ))}
          <span className="tabular ml-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-smoke">
            {results.length} shown
          </span>
        </div>
      </div>

      {/* the wall */}
      {results.length ? (
        <Stagger key={`${query}|${fam}|${energy}`} interval={motionTokens.stagger.tight}
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((k, i) => (
            <ChipCard key={k.id} k={k} index={i} />
          ))}
        </Stagger>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl font-bold text-fog">Nothing in the lexicon matches that.</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
            Loosen a filter — or that keyword is a good candidate to forge next
          </p>
        </div>
      )}
    </div>
  );
}
