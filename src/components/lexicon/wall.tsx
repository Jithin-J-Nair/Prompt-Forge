"use client";

/* ------------------------------------------------------------------ */
/*  Lexicon Wall — every prompt keyword, separately clickable.          */
/*  Facet rail (family · energy · search) + staggered chip grid that    */
/*  feeds the global Stack Tray.                                        */
/* ------------------------------------------------------------------ */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Plus, Search } from "lucide-react";
import clsx from "clsx";
import { FAMILIES, LEXICON, familyCount, searchLexicon, type Energy, type Keyword } from "@/lib/lexicon";
import { compile, getModule } from "@/lib/studio";
import { defaultParams } from "@/lib/studio/params";
import { PreviewFrame } from "@/components/preview/preview-frame";
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

function ChipCard({ k, live }: { k: Keyword; live: boolean }) {
  const { has, toggle } = useStack();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const on = has(k.id);
  const module = k.module ? getModule(k.module) : undefined;
  const mod = live ? module : undefined;

  async function copyDirective() {
    const text = module
      ? compile({
          projectName: `${module.name} creative layer`,
          brief: `Implement ${module.name} as a reusable, accessible technique within the existing website. Preserve the current architecture and design system.`,
          depth: "extreme",
          selections: [{ id: module.id, params: defaultParams(module) }],
        }).markdown
      : `# ${k.name}\n\n${k.phrase}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <StaggerChild className="h-full">
      <div
        className={clsx(
          "group flex h-full flex-col overflow-hidden rounded-lg border transition-[border-color,background-color,transform] duration-300 [content-visibility:auto] [contain-intrinsic-size:190px]",
          on
            ? "border-ember/60 bg-ember/10 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.8)]"
            : "border-line bg-carbon/60 hover:border-line-bright",
        )}
      >
        <button
          type="button"
          onClick={() => toggle(k.id)}
          aria-pressed={on}
          className="flex w-full flex-1 flex-col p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember/70"
        >
          {mod && (
            <span className="mb-3 block h-20 w-full overflow-hidden rounded-md border border-line bg-ink">
              <PreviewFrame module={mod} params={defaultParams(mod)} mode="card" className="size-full" />
            </span>
          )}
          <span className="flex items-start justify-between gap-2">
            <span className={clsx("font-display text-[14.5px] font-bold leading-snug transition-colors", on ? "text-ember" : "text-ivory")}>
              {k.name}
            </span>
            <span
              className={clsx(
                "grid size-6 shrink-0 place-items-center rounded-full border",
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
          <span className="mt-3 text-[11px] font-medium text-ember">{on ? "Added to your stack" : "Add this layer"}</span>
        </button>
        <div className="flex items-center justify-between border-t border-line px-3 py-2">
          <span className="text-[10px] text-smoke">{module ? "Full module prompt" : "Creative directive"}</span>
          <button
            type="button"
            onClick={() => void copyDirective()}
            aria-label={copyState === "copied" ? `Copied ${k.name} prompt` : `Copy ${k.name} prompt`}
            title={copyState === "error" ? "Clipboard access failed" : `Copy ${k.name} prompt`}
            className="press inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs text-fog hover:bg-ivory/5 hover:text-ivory"
          >
            {copyState === "copied" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copyState === "copied" ? "Copied" : copyState === "error" ? "Retry" : "Copy prompt"}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copyState === "copied" ? `${k.name} prompt copied.` : copyState === "error" ? "Clipboard access failed. Try selecting the prompt in the preview." : ""}
          </span>
        </div>
      </div>
    </StaggerChild>
  );
}

export function LexiconWall() {
  const [query, setQuery] = useState("");
  const [fam, setFam] = useState<string | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [live, setLive] = useState(false);
  const { ids, addAll, has, setOpen } = useStack();

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
          <span className="font-serif-d font-normal italic tracking-normal text-gradient-ember">individually clickable.</span>
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
              type="search"
              name="lexiconSearch"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the lexicon — spring, voronoi, glass, scramble…"
              className="min-h-11 w-full bg-transparent text-base text-ivory placeholder:text-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 md:text-sm"
              aria-label="Search keywords"
            />
          </label>
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setFam(null)}
              className={clsx("press min-h-11 shrink-0 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
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
              className={clsx("press min-h-11 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] transition-colors",
                energy === e.id ? "border-ember/50 bg-ember/10 text-flare" : "border-line text-smoke hover:text-fog")}
            >
              <span className={clsx("size-1.5 rounded-full", ENERGY_DOT[e.id])} aria-hidden />
              {e.label}
            </button>
          ))}
          <button
            onClick={() => setLive((v) => !v)}
            aria-pressed={live}
            className={clsx("press min-h-11 ml-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] transition-colors",
              live ? "border-flare/50 bg-flare/10 text-flare" : "border-line text-smoke hover:text-fog")}
          >
            <span className={clsx("size-1.5 rounded-full", live ? "bg-flare animate-pulse-soft" : "bg-smoke")} aria-hidden />
            {live ? "Live previews on" : "Live previews"}
          </button>
          <span className="tabular font-mono text-[9.5px] uppercase tracking-[0.2em] text-smoke">
            {results.length} shown
          </span>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-fog">{results.length} visible · {results.filter((keyword) => has(keyword.id)).length} already in your stack · {ids.length} total selected</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => addAll(results.map((keyword) => keyword.id))} disabled={!results.length}
            className="press min-h-11 rounded-full border border-ember/40 bg-ember/10 px-3.5 py-2 text-xs font-medium text-ember hover:bg-ember/15 disabled:opacity-40">
            Add all {results.length} visible
          </button>
          <button type="button" onClick={() => setOpen(true)} disabled={!ids.length}
            className="press min-h-11 rounded-full border border-line px-3.5 py-2 text-xs text-fog hover:border-line-bright hover:text-ivory disabled:opacity-40">
            Review stack
          </button>
        </div>
      </div>

      {/* the wall */}
      {results.length ? (
        <Stagger key={`${query}|${fam}|${energy}`} interval={motionTokens.stagger.tight}
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((k) => (
            <ChipCard key={k.id} k={k} live={live} />
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
