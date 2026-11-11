"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine, ArrowUpRight, Check, Copy, Layers3, Search, Sparkles, WandSparkles,
} from "lucide-react";
import clsx from "clsx";
import { FAMILIES, LEXICON } from "@/lib/lexicon";
import { buildMegaPrompt, buildQuickPrompt } from "@/lib/lexicon/mega-compiler";
import { useStack } from "@/components/lexicon/stack";
import type { ExportTarget } from "@/lib/lexicon/compile";
import type { CompileDepth } from "@/lib/studio";

type Mode = "quick" | "mega";

const TARGETS: { id: ExportTarget; label: string }[] = [
  { id: "raw", label: "Any coding agent" },
  { id: "v0", label: "v0" },
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude Code" },
];

export function ForgeWorkspace() {
  const { ids, paramsById, has, toggle, addAll, clear, setOpen } = useStack();
  const [mode, setMode] = useState<Mode>("quick");
  const [projectName, setProjectName] = useState("");
  const [brief, setBrief] = useState("");
  const [audience, setAudience] = useState("");
  const [stackNote, setStackNote] = useState("");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string>(FAMILIES[0] ?? "Objective");
  const [target, setTarget] = useState<ExportTarget>("raw");
  const [depth, setDepth] = useState<CompileDepth>("extreme");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [briefError, setBriefError] = useState("");
  const [report, setReport] = useState<{ words: number; modules: number; micro: number; invalid: number; conflicts: number; warnings: string[] } | null>(null);

  const quickPrompt = useMemo(
    () => buildQuickPrompt({ brief, audience, projectName }),
    [brief, audience, projectName],
  );
  const familyKeywords = useMemo(
    () => LEXICON.filter((keyword) => keyword.fam === family),
    [family],
  );
  const visibleKeywords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return familyKeywords.filter((keyword) =>
      !needle || keyword.name.toLowerCase().includes(needle) ||
      keyword.tags.some((tag) => tag.includes(needle)) ||
      keyword.phrase.toLowerCase().includes(needle),
    );
  }, [familyKeywords, query]);

  const familySelected = familyKeywords.filter((keyword) => has(keyword.id)).length;
  const allSelected = ids.length > 0 && LEXICON.every((keyword) => has(keyword.id));
  const currentOutput = mode === "quick" ? quickPrompt : output;
  const previousInputs = useRef({ brief, projectName, audience, stackNote, ids, paramsById, target, depth });

  useEffect(() => {
    const previous = previousInputs.current;
    const changed =
      previous.brief !== brief ||
      previous.projectName !== projectName ||
      previous.audience !== audience ||
      previous.stackNote !== stackNote ||
      previous.ids !== ids ||
      previous.paramsById !== paramsById ||
      previous.target !== target ||
      previous.depth !== depth;
    previousInputs.current = { brief, projectName, audience, stackNote, ids, paramsById, target, depth };
    if (!changed) return;
    setOutput("");
    setReport(null);
    setStatus("Your inputs changed. Forge the updated specification again.");
  }, [brief, projectName, audience, stackNote, ids, paramsById, target, depth]);

  function clearStack() {
    if (!ids.length) return;
    if (window.confirm("Clear every selected creative layer from your stack?")) {
      clear();
      setStatus("Your creative stack is clear.");
    }
  }

  function forgeMegaPrompt() {
    if (!brief.trim()) {
      setBriefError("Add a short description of the website you want to build.");
      setStatus("Add a project brief before forging the mega prompt.");
      return;
    }
    setBriefError("");
    const result = buildMegaPrompt({
      brief,
      projectName,
      audience,
      stackNote,
      keywordIds: ids,
      paramsByKeywordId: paramsById,
      target,
      depth,
    });
    setOutput(result.prompt);
    setReport({
      words: result.wordCount,
      modules: result.moduleCount,
      micro: result.microCount,
      invalid: result.invalidCount,
      conflicts: result.conflicts,
      warnings: result.warnings,
    });
    setStatus(`Forged ${result.wordCount.toLocaleString()} words from ${result.selectedCount} selected layers.`);
  }

  async function copyPrompt(value: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Prompt copied to clipboard.");
    } catch {
      setStatus("Clipboard access was blocked by this browser. Select the prompt text and copy it manually.");
    }
  }

  function downloadPrompt(value: string) {
    if (!value) return;
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode === "quick" ? "promptforge-quick-prompt.md" : "promptforge-mega-prompt.md";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Markdown prompt downloaded.");
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-ivory md:text-7xl">
            Turn one idea into a
            <span className="mt-2 block">buildable brief.</span>
          </h1>
        </div>
        <div className="max-w-md">
          <p className="text-[15px] leading-relaxed text-fog">
            Write one sentence for a concise prompt, or assemble a precise stack of creative techniques and forge them into one deeply structured build specification.
          </p>
          <Link href="/enhance" className="press mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ember hover:text-flare">
            Need a full 12-section site blueprint? Open Deep Spec <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-line bg-carbon p-1" role="tablist" aria-label="Prompt creation mode">
          <button type="button" role="tab" aria-selected={mode === "quick"} onClick={() => { setMode("quick"); setStatus(""); }}
            className={clsx("press min-h-11 rounded-full px-5 py-2.5 text-sm transition-colors", mode === "quick" ? "bg-ember font-semibold text-ink" : "text-fog hover:text-ivory")}>
            Quick prompt
          </button>
          <button type="button" role="tab" aria-selected={mode === "mega"} onClick={() => { setMode("mega"); setStatus(""); }}
            className={clsx("press rounded-full px-5 py-2.5 text-sm transition-colors", mode === "mega" ? "bg-ember font-semibold text-ink" : "text-fog hover:text-ivory")}>
            Mega prompt builder
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-fog">
          <span className="tabular">{ids.length} layers selected</span>
          <button type="button" onClick={() => setOpen(true)} className="press min-h-11 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-ivory hover:border-ember/50">
            <Layers3 className="size-3.5" aria-hidden /> Review stack
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="min-w-0 rounded-2xl border border-line bg-carbon/70 p-5 md:p-7" aria-label="Prompt inputs">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ivory">Your project</h2>
              <p className="mt-1 text-sm text-fog">Give the forge enough context to make useful decisions.</p>
            </div>
            <span className="rounded-full border border-line px-3 py-1 text-xs text-smoke">{mode === "quick" ? "Fast path" : "Full control"}</span>
          </div>

          <label className="mb-2 block text-sm font-medium text-ivory" htmlFor="pf-project-name">Project name <span className="font-normal text-smoke">· optional</span></label>
          <input id="pf-project-name" name="projectName" autoComplete="off" value={projectName} onChange={(event) => setProjectName(event.target.value)}
            placeholder="e.g. Atelier North…" maxLength={100}
            className="mb-5 min-h-11 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-smoke focus-visible:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-sm" />

          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="pf-brief" className="text-sm font-medium text-ivory">What are you building?</label>
            <span className="tabular text-xs text-smoke">{brief.length}/800</span>
          </div>
          <textarea id="pf-brief" name="projectBrief" autoComplete="off" value={brief} onChange={(event) => { setBrief(event.target.value.slice(0, 800)); setStatus(""); setBriefError(""); }}
            placeholder="A cinematic portfolio for an independent 3D artist, with a tactile project archive and a quiet, immersive navigation system…"
            rows={5} maxLength={800} aria-invalid={Boolean(briefError)} aria-describedby="pf-brief-help"
            onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); if (mode === "mega") forgeMegaPrompt(); else void copyPrompt(quickPrompt); } }}
            className="w-full resize-y rounded-xl border border-line bg-ink px-4 py-3 text-base leading-relaxed text-ivory placeholder:text-smoke focus-visible:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-sm" />

          <p id="pf-brief-help" className="mt-2 text-xs text-smoke">Press ⌘/Ctrl + Enter to copy the quick prompt or forge the full specification.</p>
          {briefError ? <p className="mt-2 text-sm text-blood" role="alert">{briefError}</p> : null}

          <label className="mb-2 mt-5 block text-sm font-medium text-ivory" htmlFor="pf-audience">Who is it for? <span className="font-normal text-smoke">· optional</span></label>
          <input id="pf-audience" name="audience" autoComplete="off" value={audience} onChange={(event) => setAudience(event.target.value)}
            placeholder="e.g. art directors, founders, potential clients…" maxLength={240}
            className="min-h-11 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-smoke focus-visible:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-sm" />

          {mode === "mega" && (
            <>
              <label className="mb-2 mt-5 block text-sm font-medium text-ivory" htmlFor="pf-stack-note">Preferred tech stack <span className="font-normal text-smoke">· optional</span></label>
              <input id="pf-stack-note" name="preferredStack" autoComplete="off" value={stackNote} onChange={(event) => setStackNote(event.target.value)}
                placeholder="Preserve the existing project stack…" maxLength={500}
                className="min-h-11 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-smoke focus-visible:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-sm" />
            </>
          )}

          {mode === "mega" && (
            <div className="mt-7 border-t border-line pt-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ivory">Creative ingredients</h3>
                  <p className="mt-1 text-sm text-fog">Choose individual layers or whole categories. Parameter values tuned in Studio stay attached to their layers.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addAll(LEXICON.map((keyword) => keyword.id))} disabled={allSelected}
                    className="press min-h-11 rounded-full border border-line px-3 py-2 text-xs text-fog hover:border-ember/50 hover:text-ivory disabled:opacity-40">
                    Select all {LEXICON.length}
                  </button>
                  <button type="button" onClick={clearStack} disabled={!ids.length}
                    className="press min-h-11 rounded-full border border-line px-3 py-2 text-xs text-fog hover:text-ivory disabled:opacity-40">
                    Clear
                  </button>
                </div>
              </div>

              <label className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-ink px-3 py-2.5">
                <Search className="size-4 text-smoke" aria-hidden />
                <input value={query} name="layerSearch" autoComplete="off" onChange={(event) => setQuery(event.target.value)} placeholder="Search motion, shader, layout, typography…" type="search"
                  className="min-w-0 min-h-11 flex-1 bg-transparent text-base text-ivory placeholder:text-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 md:text-sm" aria-label="Search creative ingredients" />
                <span className="tabular text-xs text-smoke">{visibleKeywords.length}</span>
              </label>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Creative ingredient categories">
                {FAMILIES.map((item) => (
                  <button type="button" key={item} onClick={() => setFamily(item)} aria-pressed={family === item}
                    className={clsx("press min-h-11 shrink-0 rounded-full border px-3 py-2 text-xs transition-colors",
                      family === item ? "border-ember/60 bg-ember/10 text-ember" : "border-line text-fog hover:text-ivory")}>
                    {item} <span className="ml-1 tabular opacity-60">{LEXICON.filter((keyword) => keyword.fam === item).length}</span>
                  </button>
                ))}
              </div>

              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ivory">{family} <span className="text-smoke">· {familySelected}/{familyKeywords.length} selected</span></p>
                <button type="button" onClick={() => familySelected === familyKeywords.length
                  ? familyKeywords.forEach((keyword) => { if (has(keyword.id)) toggle(keyword.id); })
                  : addAll(familyKeywords.map((keyword) => keyword.id))}
                  className="press min-h-11 text-xs text-ember hover:text-flare">
                  {familySelected === familyKeywords.length ? "Remove category" : `Add all ${familyKeywords.length} in category`}
                </button>
              </div>

              <div className="grid max-h-[430px] grid-cols-1 gap-2 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
                {visibleKeywords.length === 0 ? (
                  <p className="col-span-full rounded-xl border border-dashed border-line p-6 text-center text-sm text-fog">
                    No creative layers match this search. Try another term or category.
                  </p>
                ) : null}
                {visibleKeywords.map((keyword) => {
                  const selected = has(keyword.id);
                  return (
                    <button type="button" key={keyword.id} onClick={() => toggle(keyword.id)} aria-pressed={selected}
                      className={clsx("press flex min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition-colors [content-visibility:auto] [contain-intrinsic-size:88px]",
                        selected ? "border-ember/60 bg-ember/10" : "border-line bg-ink/60 hover:border-line-bright")}>
                      <span className={clsx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border",
                        selected ? "border-ember bg-ember text-ink" : "border-line text-smoke")}>
                        {selected ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ivory">{keyword.name}</span>
                        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-fog">{keyword.phrase}</span>
                        <span className="mt-1 block text-[10px] text-smoke">{keyword.sub} · {keyword.energy}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-line bg-ink/80 p-5 md:p-7" aria-label="Generated prompt preview">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
            <div>
              <p className="text-sm text-fog">{mode === "quick" ? "Concise output" : "Compiled specification"}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ivory">{mode === "quick" ? "Quick prompt" : "Mega prompt"}</h2>
              <p className="mt-1 text-xs text-smoke">{mode === "quick" ? "A compact direction to paste into your coding agent." : "A layered, implementation-aware brief built from your selected ingredients."}</p>
            </div>
            {mode === "mega" && (
              <label className="flex items-center gap-2 text-xs text-fog">
                Depth
                <select value={depth} onChange={(event) => setDepth(event.target.value as CompileDepth)}
                  className="min-h-11 rounded-lg border border-line bg-carbon px-2.5 py-2 text-base text-ivory md:text-sm">
                  <option value="detailed">Detailed</option>
                  <option value="extreme">Extreme</option>
                </select>
              </label>
            )}
          </div>

          {mode === "mega" && (
            <div className="border-b border-line py-4">
              <p className="mb-2 text-xs text-fog">Target coding environment</p>
              <div className="flex flex-wrap gap-2">
                {TARGETS.map((item) => (
                  <button type="button" key={item.id} onClick={() => setTarget(item.id)} aria-pressed={target === item.id}
                    className={clsx("press rounded-full border px-3 py-2 text-xs transition-colors",
                      target === item.id ? "border-ember/60 bg-ember/10 text-ember" : "border-line text-fog hover:text-ivory")}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "mega" && report && (
            <div className="grid grid-cols-2 gap-3 border-b border-line py-4 sm:grid-cols-5">
              {[
                [report.words.toLocaleString(), "words"],
                [report.modules.toString(), "typed modules"],
                [report.micro.toString(), "micro-directives"],
                [report.invalid.toString(), "unknown IDs"],
                [report.conflicts.toString(), "conflicts"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="tabular font-display text-xl font-semibold text-ivory">{value}</p>
                  <p className="text-xs text-smoke">{label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 min-h-[390px] overflow-hidden rounded-xl border border-line bg-carbon/50">
            {currentOutput ? (
              <pre className="spec-markdown max-h-[620px] min-h-[390px] overflow-auto overscroll-contain break-words p-4 text-fog md:p-5">{currentOutput}</pre>
            ) : (
              <div className="flex min-h-[390px] flex-col items-center justify-center px-8 text-center">
                <div className="mb-4 grid size-12 place-items-center rounded-full border border-line bg-carbon text-ember">
                  {mode === "quick" ? <Sparkles className="size-5" aria-hidden /> : <WandSparkles className="size-5" aria-hidden />}
                </div>
                <p className="font-display text-xl font-medium text-ivory">Your prompt appears here.</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-fog">
                  {mode === "quick" ? "Write a sentence about your website to create a concise, copy-ready prompt." : "Describe the project, select the creative layers you want, then forge the complete specification."}
                </p>
              </div>
            )}
          </div>

          {mode === "mega" && report?.warnings.length ? (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-300/5 p-4">
              <p className="text-sm font-medium text-amber-200">Compiler notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-fog">
                {report.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {mode === "quick" ? (
              <p className="text-xs text-smoke">The quick path stays concise. No category selection required.</p>
            ) : (
              <button type="button" onClick={forgeMegaPrompt}
                className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-flare">
                <WandSparkles className="size-4" aria-hidden /> Forge mega prompt
              </button>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void copyPrompt(currentOutput)} disabled={!currentOutput}
                className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ivory hover:border-ember/50 disabled:opacity-40">
                <Copy className="size-4" aria-hidden /> Copy prompt
              </button>
              <button type="button" onClick={() => downloadPrompt(currentOutput)} disabled={!currentOutput}
                className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ivory hover:border-ember/50 disabled:opacity-40">
                <ArrowDownToLine className="size-4" aria-hidden /> Download
              </button>
            </div>
          </div>
          <p className="mt-3 min-h-5 text-xs text-fog" role="status" aria-live="polite">{status}</p>
        </section>
      </div>
    </div>
  );
}
