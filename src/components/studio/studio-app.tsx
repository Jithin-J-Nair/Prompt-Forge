"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import clsx from "clsx";
import {
  ArrowDown, ArrowUp, Check, ChevronRight, Copy, Download, Layers,
  Loader2, Plus, RotateCcw, Save, Search, Sparkles, Trash2, X,
} from "lucide-react";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { resolveParams } from "@/lib/studio/params";
import {
  CATEGORIES, MODULE_MAP, MODULES, compile, searchModules, getModule,
  PRESETS,
  type CategoryId, type CompileOutput, type ParamDef, type ParamValues, type PromptModule,
  type SelectionInput,
} from "@/lib/studio";

/* ------------------------------------------------------------------ */
/*  Visual Prompt Engineering Studio — three-panel workspace.           */
/* ------------------------------------------------------------------ */

interface ComposerSel {
  moduleId: string;
  params: ParamValues;
}

type Action =
  | { kind: "add"; moduleId: string }
  | { kind: "remove"; moduleId: string }
  | { kind: "move"; moduleId: string; dir: -1 | 1 }
  | { kind: "setParam"; moduleId: string; key: string; value: string | number | boolean }
  | { kind: "load"; selections: ComposerSel[] }
  | { kind: "clear" };

function reducer(state: ComposerSel[], action: Action): ComposerSel[] {
  switch (action.kind) {
    case "add": {
      if (state.some((s) => s.moduleId === action.moduleId)) return state;
      const m = getModule(action.moduleId);
      if (!m) return state;
      const params: ParamValues = {};
      for (const p of m.params) params[p.key] = p.default;
      return [...state, { moduleId: action.moduleId, params }];
    }
    case "remove":
      return state.filter((s) => s.moduleId !== action.moduleId);
    case "move": {
      const i = state.findIndex((s) => s.moduleId === action.moduleId);
      const j = i + action.dir;
      if (i < 0 || j < 0 || j >= state.length) return state;
      const copy = [...state];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    }
    case "setParam":
      return state.map((s) =>
        s.moduleId === action.moduleId
          ? { ...s, params: { ...s.params, [action.key]: action.value } }
          : s,
      );
    case "load":
      return action.selections;
    case "clear":
      return [];
  }
}

const PERF_TINT: Record<string, string> = {
  light: "text-emerald-300/80",
  medium: "text-flare/90",
  heavy: "text-blood/90",
};

export function StudioApp() {
  const [selections, dispatch] = useReducer(reducer, []);
  const [projectName, setProjectName] = useState("");
  const [brief, setBrief] = useState("");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [sub, setSub] = useState<string | "all">("all");
  const [tab, setTab] = useState<"explore" | "browse" | "compose">("browse");
  const [panelCat, setPanelCat] = useState<CategoryId | "all">("websites");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [inspecting, setInspecting] = useState<string | null>(null);
  const [depth, setDepth] = useState<"standard" | "detailed" | "extreme">("detailed");

  /* compile live — pure + fast at this size */
  const output: CompileOutput = useMemo(
    () =>
      compile({
        projectName,
        brief,
        selections: selections.map<SelectionInput>((s) => ({ id: s.moduleId, params: s.params })),
        depth,
      }),
    [selections, projectName, brief, depth],
  );

  const selectedIds = useMemo(() => new Set(selections.map((s) => s.moduleId)), [selections]);
  const selectionMap = useMemo(() => new Map(selections.map((s) => [s.moduleId, s] as const)), [selections]);

  const results = useMemo(() => {
    const list = searchModules(query, {
      category: cat,
      subcategory: sub,
    }).map((r) => r.module);
    return query.trim() ? list.slice(0, 60) : browseList(cat, sub);
  }, [query, cat, sub]);

  function browseList(c: CategoryId | "all", s: string | "all"): PromptModule[] {
    return MODULES.filter(
      (m) => (c === "all" || m.category === c) && (s === "all" || m.subcategory === s),
    );
  }

  /* ---- export helpers ---- */
  const effectiveText = edited ?? output.markdown;

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(effectiveText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — user can select the text manually */
    }
  }, [effectiveText]);

  const exportFile = useCallback(
    (kind: "md" | "json" | "txt") => {
      let content = effectiveText;
      let mime = "text/markdown";
      if (kind === "json") {
        content = JSON.stringify(output.json, null, 2);
        mime = "application/json";
      } else if (kind === "txt") {
        content = edited ?? output.text;
        mime = "text/plain";
      }
      const blob = new Blob([content], { type: mime });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${(projectName || "promptforge-composition").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.${kind === "md" ? "md" : kind === "json" ? "json" : "txt"}`;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    [edited, effectiveText, output, projectName],
  );

  const save = useCallback(async () => {
    if (!selections.length) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/compositions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName || "Untitled composition",
          brief,
          selections: selections.map((s) => ({ id: s.moduleId, params: s.params })),
          compiled: output.markdown,
        }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2400);
    } catch {
      setSaveState("error");
    }
  }, [selections, projectName, brief, output]);

  const applyPreset = useCallback(
    (id: string) => {
      const p = PRESETS.find((x) => x.id === id);
      if (!p) return;
      dispatch({
        kind: "load",
        selections: p.selections.map((s) => ({
          moduleId: String(s.id),
          params: { ...(s.params ?? {}) },
        })),
      });
      setBrief(p.brief);
      setEdited(null);
      setTab("compose");
    },
    [],
  );

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-24 md:px-8">
      {/* header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ember">
            Visual Prompt Engineering Studio
          </p>
          <h1 className="mt-3 font-display text-3xl font-black tracking-tight md:text-5xl">
            Compose the spec.{" "}
            <span className="font-serif font-normal italic text-flare">Module by module.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-fog">
            {MODULES.length} typed technique modules · {PRESETS.length} curated presets · a compiler
            that interpolates real parameters, detects conflicts and explains them. Everything you
            select is kept — never silently dropped.
          </p>
        </div>
        <div className="font-mono text-[11px] text-smoke">
          <span className="text-ember">{selections.length}</span> modules selected ·{" "}
          <span className="text-ember">{output.stats.words}</span> words compiled
        </div>
      </header>

      {/* presets strip */}
      <section aria-label="Curated presets" className="mt-8 border-y border-line py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          <span className="mr-1 flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
            <Sparkles className="size-3.5 text-ember" /> Presets
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              title={p.description}
              className="group shrink-0 rounded-full border border-line px-4 py-1.5 text-[12px] text-fog transition-colors hover:border-ember/60 hover:text-ivory"
            >
              <span
                className="mr-2 inline-block size-2 rounded-full align-middle"
                style={{ background: `hsl(${p.hue} 90% 58%)` }}
              />
              {p.name}
              <span className="ml-2 font-mono text-[9px] text-smoke group-hover:text-fog">
                ×{p.selections.length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* mobile tabs */}
      <div className="mt-6 flex gap-1 rounded-md border border-line bg-carbon/60 p-1 lg:hidden" role="tablist" aria-label="Workspace panels">
        {(["explore", "browse", "compose"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={clsx(
              "flex-1 rounded px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em]",
              tab === t ? "bg-ember text-ink" : "text-fog",
            )}
          >
            {t === "compose" ? `Compose (${selections.length})` : t}
          </button>
        ))}
      </div>

      {/* three-panel workspace */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_26rem]">
        {/* LEFT — category explorer */}
        <aside
          aria-label="Category explorer"
          className={clsx(tab !== "explore" && "max-lg:hidden", "h-fit lg:sticky lg:top-24")}
        >
          <Explorer
            cat={cat}
            sub={sub}
            panelCat={panelCat}
            onPick={(c, s) => {
              setCat(c);
              setSub(s);
              setQuery("");
              setTab("browse");
            }}
            onExpand={setPanelCat}
          />
        </aside>

        {/* MIDDLE — module browser */}
        <section
          aria-label="Module browser"
          className={clsx(tab !== "browse" && "max-lg:hidden", "min-w-0")}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-smoke" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCat("all"); setSub("all"); }}
                placeholder="Search names, aliases, tags, descriptions — try “voronoi”, “glow”, “brutalist”…"
                className="w-full rounded-md border border-line bg-carbon/70 py-2.5 pl-10 pr-4 text-[13px] text-ivory placeholder:text-smoke/70 focus:border-ember/60 focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ivory"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <button
              onClick={() => setShowSaved((s) => !s)}
              className="hidden shrink-0 items-center gap-2 rounded-md border border-line px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-fog hover:border-ember/50 hover:text-ivory sm:flex"
            >
              <Layers className="size-3.5" /> Saved
            </button>
          </div>

          {showSaved ? (
            <SavedCompositions
              onLoad={(sels, briefText, name) => {
                dispatch({ kind: "load", selections: sels });
                setBrief(briefText);
                setProjectName(name);
                setEdited(null);
                setShowSaved(false);
                setTab("compose");
              }}
            />
          ) : null}

          {/* conflict banner inside browser for context */}
          {output.conflicts.length > 0 && (
            <ConflictList output={output} dispatch={dispatch} compact />
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {results.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                selected={selectedIds.has(m.id)}
                conflicted={output.conflicts.some((c) => c.aId === m.id || c.bId === m.id)}
                onAdd={() => dispatch({ kind: "add", moduleId: m.id })}
                onRemove={() => dispatch({ kind: "remove", moduleId: m.id })}
                onExpand={() => setInspecting(m.id)}
                selParams={selectionMap.get(m.id)?.params}
              />
            ))}
          </div>
          {results.length === 0 && (
            <p className="mt-10 text-center font-mono text-[12px] text-smoke">
              No modules match — try a broader term or clear the filters.
            </p>
          )}
        </section>

        {inspecting && (
          <Inspector
            moduleId={inspecting}
            selected={selectedIds.has(inspecting)}
            onClose={() => setInspecting(null)}
            onAdd={() => dispatch({ kind: "add", moduleId: inspecting })}
            onRemove={() => dispatch({ kind: "remove", moduleId: inspecting })}
          />
        )}

        {/* RIGHT — composer */}
        <Composer
          tab={tab}
          selections={selections}
          output={output}
          projectName={projectName}
          brief={brief}
          edited={edited}
          saveState={saveState}
          copied={copied}
          onBrief={setBrief}
          onName={setProjectName}
          onEdited={setEdited}
          depth={depth}
          onDepth={setDepth}
          onCopy={copyPrompt}
          onExport={exportFile}
          onSave={save}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

/* ------------------------------ Explorer ------------------------------ */

function Explorer({
  cat, sub, panelCat, onPick, onExpand,
}: {
  cat: CategoryId | "all";
  sub: string | "all";
  panelCat: CategoryId | "all";
  onPick: (c: CategoryId | "all", s: string | "all") => void;
  onExpand: (c: CategoryId | "all") => void;
}) {
  return (
    <nav className="rounded-md border border-line bg-carbon/40 p-2" aria-label="Modules by category">
      <button
        onClick={() => onPick("all", "all")}
        className={clsx(
          "flex w-full items-center justify-between rounded px-3 py-2 text-left text-[12.5px]",
          cat === "all" ? "text-ember" : "text-fog hover:text-ivory",
        )}
      >
        Everything
        <span className="font-mono text-[10px] text-smoke">{MODULES.length}</span>
      </button>
      {CATEGORIES.map((c) => {
        const active = cat === c.id;
        const open = panelCat === c.id;
        const count = MODULES.filter((m) => m.category === c.id).length;
        return (
          <div key={c.id}>
            <div
              className={clsx(
                "group flex w-full items-center rounded px-1 py-1 text-left",
                active ? "text-ember" : "text-fog hover:text-ivory",
              )}
            >
              <button
                className="flex-1 px-2 py-1 text-left text-[12.5px]"
                onClick={() => onPick(c.id, "all")}
                aria-current={active ? "true" : undefined}
              >
                <span className="mr-2 font-mono text-[10px] text-smoke">{c.number}</span>
                {c.name}
                <span className="ml-2 font-mono text-[10px] text-smoke">{count}</span>
              </button>
              <button
                onClick={() => onExpand(open ? "all" : c.id)}
                aria-label={`${open ? "Collapse" : "Expand"} ${c.name}`}
                aria-expanded={open}
                className="rounded p-1.5 text-smoke hover:text-ivory"
              >
                <ChevronRight className={clsx("size-3.5 transition-transform", open && "rotate-90")} />
              </button>
            </div>
            {open && (
              <div className="mb-1 ml-8 border-l border-line pl-3">
                {c.subcategories.map((s) => {
                  const sCount = MODULES.filter((m) => m.category === c.id && m.subcategory === s.id).length;
                  const on = active && sub === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onPick(c.id, s.id)}
                      className={clsx(
                        "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[11.5px]",
                        on ? "text-ember" : "text-smoke hover:text-ivory",
                      )}
                    >
                      {s.name}
                      <span className="font-mono text-[9.5px] opacity-70">{sCount}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------ Module card ------------------------------ */

function ModuleCard({
  module: m, selected, conflicted, selParams, onAdd, onRemove, onExpand,
}: {
  module: PromptModule;
  selected: boolean;
  conflicted: boolean;
  /** overrides from the composer when selected — drives BOTH preview and compiler */
  selParams?: ParamValues;
  onAdd: () => void;
  onRemove: () => void;
  onExpand?: () => void;
}) {
  const effectiveParams = useMemo(() => resolveParams(m, selParams ?? {}), [m, selParams]);
  return (
    <article
      className={clsx(
        "group relative flex flex-col rounded-lg border bg-carbon/60 transition-colors overflow-hidden",
        selected ? "border-ember/60" : conflicted ? "border-blood/50" : "border-line hover:border-line-bright",
      )}
    >
      {/* live preview — real renderer, param-driven */}
      <PreviewFrame module={m} params={effectiveParams} mode="card" className="aspect-[16/10] border-b border-line" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[14px] font-bold leading-snug tracking-tight">{m.name}</h3>
        <span className={clsx("mt-0.5 shrink-0 font-mono text-[9px] uppercase tracking-wider", PERF_TINT[m.perf])}>
          {m.perf}
        </span>
      </div>
      <p className="mt-1 font-serif text-[13px] italic text-flare/80">{m.tagline}</p>
      <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-fog">{m.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.tags.slice(0, 4).map((t) => (
          <span key={t} className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-smoke">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <div className="flex items-center gap-2 font-mono text-[9.5px] text-smoke">
          {m.params.length > 0 && <span>{m.params.length} params</span>}
          <span className="uppercase">{m.dimension}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onExpand && (
            <button onClick={onExpand} aria-label={`Open ${m.name} detail`}
              className="rounded border border-line px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-smoke transition-colors hover:border-ember/60 hover:text-ember">
              view
            </button>
          )}
          <button
            onClick={selected ? onRemove : onAdd}
            aria-pressed={selected}
            className={clsx(
              "flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
              selected ? "bg-ember/15 text-ember hover:bg-blood/15 hover:text-blood" : "border border-line text-fog hover:border-ember/60 hover:text-ember",
            )}
          >
            {selected ? <><Check className="size-3" /> added</> : <><Plus className="size-3" /> add</>}
          </button>
        </div>
      </div>
      {conflicted && !selected && (
        <span className="absolute left-3 top-[calc(100%-2rem)] rounded-full bg-blood/20 px-2 py-0.5 font-mono text-[9px] text-blood">
          conflicts with selection
        </span>
      )}
      </div>
    </article>
  );
}

/* ------------------------------ Conflict list ------------------------------ */

function ConflictList({
  output, dispatch, compact,
}: {
  output: CompileOutput;
  dispatch: React.Dispatch<Action>;
  compact?: boolean;
}) {
  return (
    <div className={clsx("rounded-md border border-blood/40 bg-blood/10 p-4", compact ? "mt-4" : "")} role="alert">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-blood">
        {output.conflicts.length} tension{output.conflicts.length > 1 ? "s" : ""} detected — nothing was removed
      </p>
      <ul className="mt-3 space-y-3">
        {output.conflicts.map((c) => (
          <li key={`${c.aId}|${c.bId}`} className="text-[12px] leading-relaxed text-ivory/85">
            <span className="font-mono text-[11px] text-flare">{nameOf(c.aId)}</span>{" × "}
            <span className="font-mono text-[11px] text-flare">{nameOf(c.bId)}</span>
            <p className="mt-1 text-fog">{c.reason} Keep both (stage them in different sections) or drop one:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => dispatch({ kind: "remove", moduleId: c.aId })}
                className="rounded border border-blood/50 px-2 py-1 font-mono text-[10px] text-blood hover:bg-blood/10"
              >
                remove {shortName(c.aId)}
              </button>
              <button
                onClick={() => dispatch({ kind: "remove", moduleId: c.bId })}
                className="rounded border border-blood/50 px-2 py-1 font-mono text-[10px] text-blood hover:bg-blood/10"
              >
                remove {shortName(c.bId)}
              </button>
              <span className="px-1 py-1 font-mono text-[10px] text-smoke">…or keep both (included in export)</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
function nameOf(id: string) { return MODULE_MAP.get(id)?.name ?? id; }
function shortName(id: string) { const n = nameOf(id); return n.length > 18 ? n.slice(0, 17) + "…" : n; }

/* ------------------------------ Inspector (detail drawer) ------------------------------ */

function Inspector({
  moduleId, selected, onClose, onAdd, onRemove,
}: {
  moduleId: string;
  selected: boolean;
  onClose: () => void;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const mod = MODULE_MAP.get(moduleId);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!mod) return null;
  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby={`inspector-${mod.id}`}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-carbon [scrollbar-width:thin] sm:w-[32rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-carbon/95 p-5 backdrop-blur">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ember">{mod.category} / {mod.subcategory}</p>
            <h2 id={`inspector-${mod.id}`} className="mt-1 font-display text-xl font-black text-ivory">{mod.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close inspector"
            className="rounded border border-line p-1.5 text-fog hover:border-ember/60 hover:text-ember">
            <X className="size-4" />
          </button>
        </div>
        <PreviewFrame module={mod} params={resolveParams(mod, {})} mode="detail" className="aspect-[16/10] border-b border-line" />
        <div className="space-y-5 p-5 text-[13px] leading-relaxed text-fog">
          <p>{mod.description}</p>
          <div className="rounded border border-line bg-panel/60 p-3 font-mono text-[10.5px] leading-relaxed text-fog whitespace-pre-wrap">
            <span className="text-smoke">{"// prompt fragment"}</span>
            {"\n"}{mod.prompt}
          </div>
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">Implementation</p>
            <p>{mod.implementation}</p>
          </div>
          {mod.a11y && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-signal/90">Accessibility contract</p>
              <p>{mod.a11y}</p>
            </div>
          )}
          {mod.responsive && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">Responsive behaviour</p>
              <p>{mod.responsive}</p>
            </div>
          )}
          {mod.fallback && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">Graceful degradation</p>
              <p>{mod.fallback}</p>
            </div>
          )}
          {mod.extreme && (
            <div className="rounded border border-ember/30 bg-ember/5 p-3">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ember">Extreme detail sections</p>
              <ul className="list-disc space-y-1 pl-4 font-mono text-[10px] text-fog">
                {Object.entries(mod.extreme).map(([k, v]) => v ? <li key={k}><span className="text-flare">{k}</span> — {(v as string).slice(0, 90)}…</li> : null)}
              </ul>
            </div>
          )}
          {(mod.conflicts?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-blood">Conflicts</p>
              <ul className="list-disc space-y-1 pl-4">
                {mod.conflicts!.map((c) => (
                  <li key={c.id}><span className="text-blood">{MODULE_MAP.get(c.id)?.name ?? c.id}</span> — {c.reason}</li>
                ))}
              </ul>
            </div>
          )}
          {(mod.suggests?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">Pairs well with</p>
              <div className="flex flex-wrap gap-1.5">
                {mod.suggests!.map((sid) => (
                  <span key={sid} className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] text-fog">
                    {MODULE_MAP.get(sid)?.name ?? sid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex gap-2 border-t border-line bg-carbon/95 p-4 backdrop-blur">
          <button
            onClick={selected ? onRemove : onAdd}
            aria-pressed={selected}
            className={clsx("flex-1 rounded-md px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              selected ? "bg-blood/15 text-blood hover:bg-blood/25" : "bg-ember text-ink hover:bg-flare")}
          >
            {selected ? "Remove from composition" : "Add to composition"}
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ Composer ------------------------------ */

function Composer({
  tab, selections, output, projectName, brief, edited, saveState, copied,
  onName, onBrief, onEdited, onCopy, onExport, onSave, dispatch, depth, onDepth,
}: {
  tab: string;
  selections: ComposerSel[];
  output: CompileOutput;
  projectName: string;
  brief: string;
  edited: string | null;
  saveState: "idle" | "saving" | "saved" | "error";
  copied: boolean;
  onName: (v: string) => void;
  onBrief: (v: string) => void;
  onEdited: (v: string | null) => void;
  onCopy: () => void;
  onExport: (kind: "md" | "json" | "txt") => void;
  onSave: () => void;
  dispatch: React.Dispatch<Action>;
  depth: "standard" | "detailed" | "extreme";
  onDepth: (d: "standard" | "detailed" | "extreme") => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [previewTab, setPreviewTab] = useState<"render" | "edit">("render");

  return (
    <aside
      aria-label="Live prompt composer"
      className={clsx(tab !== "compose" && "max-lg:hidden", "min-w-0 xl:sticky xl:top-24 xl:h-fit xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:[scrollbar-width:thin]")}
    >
      <div className="rounded-lg border border-line bg-carbon/50">
        {/* identity */}
        <div className="space-y-3 border-b border-line p-4">
          <input
            value={projectName}
            onChange={(e) => onName(e.target.value)}
            placeholder="Project name…"
            aria-label="Project name"
            className="w-full bg-transparent font-display text-lg font-bold tracking-tight text-ivory placeholder:text-smoke/60 focus:outline-none"
          />
          <textarea
            value={brief}
            onChange={(e) => onBrief(e.target.value)}
            placeholder="One-line brief — the intent every module serves…"
            aria-label="Project brief"
            rows={2}
            className="w-full resize-none bg-transparent text-[12.5px] leading-relaxed text-fog placeholder:text-smoke/60 focus:outline-none"
          />
        </div>

        {/* depth selector */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5" role="radiogroup" aria-label="Compile depth">
          <div className="flex gap-1">
            {(["standard", "detailed", "extreme"] as const).map((d) => (
              <button
                key={d}
                role="radio"
                aria-checked={depth === d}
                onClick={() => onDepth(d)}
                className={clsx("rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                  depth === d ? "bg-ember/15 text-ember" : "text-smoke hover:text-fog")}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="font-mono text-[9px] text-smoke leading-relaxed text-right">
            {depth === "standard" && "lean fragments"}
            {depth === "detailed" && "+implementation a11y"}
            {depth === "extreme" && "+technical contracts"}
          </span>
        </div>

        {/* selections */}
        <div className="max-h-[42vh] overflow-y-auto p-2 [scrollbar-width:thin] xl:max-h-[34vh]">
          {selections.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12px] text-smoke">
              Nothing selected yet — add modules from the browser or apply a preset above.
            </p>
          ) : (
            <ul>
              {selections.map((sel, i) => {
                const m = MODULE_MAP.get(sel.moduleId);
                if (!m) return null;
                const open = expanded === sel.moduleId;
                return (
                  <li key={sel.moduleId} className="group mb-1 rounded border border-transparent hover:border-line hover:bg-ink/60">
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <span className="w-5 font-mono text-[9px] text-smoke">{String(i + 1).padStart(2, "0")}</span>
                      <button
                        className="min-w-0 flex-1 text-left"
                        onClick={() => setExpanded(open ? null : sel.moduleId)}
                        aria-expanded={open}
                      >
                        <span className="block truncate text-[12px] font-medium text-ivory/90">{m.name}</span>
                        <span className="block truncate font-mono text-[9px] text-smoke">{m.id}</span>
                      </button>
                      <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {m.params.length > 0 && (
                          <button onClick={() => setExpanded(open ? null : sel.moduleId)} aria-label={`Parameters for ${m.name}`} className="rounded p-1 text-smoke hover:text-ivory">
                            <ChevronRight className={clsx("size-3 transition-transform", open && "rotate-90")} />
                          </button>
                        )}
                        <button onClick={() => dispatch({ kind: "move", moduleId: sel.moduleId, dir: -1 })} aria-label="Move up" disabled={i === 0} className="rounded p-1 text-smoke hover:text-ivory disabled:opacity-30"><ArrowUp className="size-3" /></button>
                        <button onClick={() => dispatch({ kind: "move", moduleId: sel.moduleId, dir: 1 })} aria-label="Move down" disabled={i === selections.length - 1} className="rounded p-1 text-smoke hover:text-ivory disabled:opacity-30"><ArrowDown className="size-3" /></button>
                        <button onClick={() => dispatch({ kind: "remove", moduleId: sel.moduleId })} aria-label={`Remove ${m.name}`} className="rounded p-1 text-smoke hover:text-blood"><Trash2 className="size-3" /></button>
                      </div>
                    </div>
                    {open && m.params.length > 0 && (
                      <div className="space-y-2.5 border-t border-line px-3 py-3">
                        {m.params.map((p) => (
                          <ParamEditor
                            key={p.key}
                            def={p}
                            value={sel.params[p.key] ?? p.default}
                            onChange={(v) => dispatch({ kind: "setParam", moduleId: sel.moduleId, key: p.key, value: v })}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* conflicts in composer (always visible context) */}
        {output.conflicts.length > 0 && (
          <div className="px-3 pb-3">
            <ConflictList output={output} dispatch={dispatch} />
          </div>
        )}
        {output.warnings.map((w, i) => (
          <p key={i} className="mx-3 mb-2 rounded border border-flare/30 bg-flare/5 px-3 py-2 text-[11px] leading-relaxed text-flare/90">
            {w.message}
          </p>
        ))}
        {output.suggestions.length > 0 && selections.some((s) => output.suggestions.some((sg) => sg.when === s.moduleId)) && (
          <details className="mx-3 mb-2 rounded border border-line px-3 py-2">
            <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-smoke">
              {output.suggestions.reduce((n, s) => n + s.add.length, 0)} recommended additions
            </summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[...new Set(output.suggestions.flatMap((s) => s.add))].map((id) => (
                <button
                  key={id}
                  onClick={() => dispatch({ kind: "add", moduleId: id })}
                  disabled={selections.some((s) => s.moduleId === id)}
                  className="rounded-sm border border-ember/40 px-2 py-1 font-mono text-[10px] text-ember hover:bg-ember/10 disabled:opacity-30"
                >
                  + {shortName(id)}
                </button>
              ))}
            </div>
          </details>
        )}

        {/* output */}
        <div className="border-t border-line">
          <div className="flex items-center gap-1 px-3 pt-3">
            <button onClick={() => setPreviewTab("render")} className={clsx("rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider", previewTab === "render" ? "bg-steel text-ivory" : "text-smoke")}>Preview</button>
            <button onClick={() => setPreviewTab("edit")} className={clsx("rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider", previewTab === "edit" ? "bg-steel text-ivory" : "text-smoke")}>Edit text</button>
            {edited !== null && (
              <button
                onClick={() => onEdited(null)}
                className="ml-auto flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] text-flare hover:text-ivory"
                title="Discard your edits and show the freshly compiled output"
              >
                <RotateCcw className="size-3" /> regenerate
              </button>
            )}
          </div>
          {edited !== null && previewTab === "render" && (
            <p className="mx-3 mt-2 rounded bg-flare/10 px-3 py-1.5 font-mono text-[10px] text-flare">
              You have manual edits — the live compile is paused. Click “regenerate” to refresh.
            </p>
          )}
          <div ref={textRef} className="max-h-64 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
            {previewTab === "edit" ? (
              <textarea
                value={edited ?? output.markdown}
                onChange={(e) => onEdited(e.target.value)}
                aria-label="Edit compiled prompt"
                className="h-64 w-full resize-y bg-transparent font-mono text-[11px] leading-relaxed text-ivory/90 focus:outline-none"
              />
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-ivory/85">
                {edited ?? output.markdown}
              </pre>
            )}
          </div>
          {/* actions */}
          <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
            <button
              onClick={onCopy}
              disabled={!selections.length}
              className="flex items-center gap-1.5 rounded bg-ember px-3 py-2 font-mono text-[10.5px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-flare disabled:opacity-40"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "copied" : "copy"}
            </button>
            {(["md", "txt", "json"] as const).map((k) => (
              <button
                key={k}
                onClick={() => onExport(k)}
                disabled={!selections.length}
                className="flex items-center gap-1 rounded border border-line px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider text-fog hover:border-ember/50 hover:text-ivory disabled:opacity-40"
              >
                <Download className="size-3" /> {k}
              </button>
            ))}
            <button
              onClick={onSave}
              disabled={!selections.length || saveState === "saving"}
              className="ml-auto flex items-center gap-1.5 rounded border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fog hover:border-ember/50 hover:text-ivory disabled:opacity-40"
            >
              {saveState === "saving" ? <Loader2 className="size-3.5 animate-spin" /> : saveState === "saved" ? <Check className="size-3.5 text-emerald-400" /> : <Save className="size-3.5" />}
              {saveState === "saved" ? "saved" : saveState === "error" ? "retry" : "save"}
            </button>
            {saveState === "error" && (
              <span className="w-full font-mono text-[10px] text-blood">Save failed (server unavailable). Your work is still in this tab.</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Param editor ------------------------------ */

function ParamEditor({
  def, value, onChange,
}: {
  def: ParamDef;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  switch (def.type) {
    case "range":
    case "number": {
      const v = Number(value);
      return (
        <label className="block" title={def.help}>
          <span className="flex items-baseline justify-between font-mono text-[10px] text-smoke">
            <span className="uppercase tracking-wider">{def.label}</span>
            <span className="text-ivory/80">{v}{def.unit ?? ""}</span>
          </span>
          <input
            type="range"
            min={def.min ?? 0}
            max={def.max ?? 100}
            step={def.step ?? 1}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-full bg-steel accent-ember"
            aria-label={def.label}
          />
        </label>
      );
    }
    case "select":
      return (
        <label className="block" title={def.help}>
          <span className="font-mono text-[10px] uppercase tracking-wider text-smoke">{def.label}</span>
          <select
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-ink px-2 py-1.5 text-[12px] text-ivory focus:border-ember/60 focus:outline-none"
            aria-label={def.label}
          >
            {def.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      );
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center justify-between" title={def.help}>
          <span className="font-mono text-[10px] uppercase tracking-wider text-smoke">{def.label}</span>
          <button
            role="switch"
            aria-checked={Boolean(value)}
            onClick={() => onChange(!value)}
            className={clsx("relative h-5 w-9 rounded-full transition-colors", value ? "bg-ember" : "bg-steel")}
          >
            <span className={clsx("absolute top-0.5 size-4 rounded-full bg-ivory transition-all", value ? "left-[18px]" : "left-0.5")} />
          </button>
        </label>
      );
    case "text":
      return (
        <label className="block" title={def.help}>
          <span className="font-mono text-[10px] uppercase tracking-wider text-smoke">{def.label}</span>
          <input
            type="text"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-ink px-2 py-1.5 text-[12px] text-ivory focus:border-ember/60 focus:outline-none"
            aria-label={def.label}
          />
        </label>
      );
  }
}

/* ------------------------------ Saved compositions ------------------------------ */

interface SavedRow {
  id: string;
  name: string;
  brief: string;
  selections: SelectionInput[];
  moduleCount: number;
  createdAt: string;
  persisted: string;
}

function SavedCompositions({ onLoad }: { onLoad: (sels: ComposerSel[], brief: string, name: string) => void }) {
  const [rows, setRows] = useState<SavedRow[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/compositions")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setRows(d.compositions))
      .catch(() => alive && setError(true));
    return () => { alive = false; };
  }, []);

  const load = async (id: string) => {
    try {
      const r = await fetch(`/api/compositions/${id}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      const c = d.composition;
      onLoad(
        (c.selections as SelectionInput[]).map((s) => ({ moduleId: s.id, params: { ...(s.params ?? {}) } })),
        c.brief,
        c.name,
      );
    } catch {
      setError(true);
    }
  };

  return (
    <div className="mt-4 rounded-md border border-line bg-ink/60 p-3">
      {error && <p className="px-2 py-3 font-mono text-[11px] text-blood">Could not reach the compositions API.</p>}
      {!rows && !error && <p className="px-2 py-3 font-mono text-[11px] text-smoke">Loading…</p>}
      {rows && rows.length === 0 && (
        <p className="px-2 py-3 font-mono text-[11px] text-smoke">No saved compositions yet — compose and hit “save”.</p>
      )}
      <ul>
        {rows?.map((r) => (
          <li key={r.id} className="mb-1 flex items-center justify-between gap-3 rounded px-2 py-2 hover:bg-carbon/60">
            <div className="min-w-0">
              <p className="truncate text-[12.5px] text-ivory/90">{r.name}</p>
              <p className="font-mono text-[9.5px] text-smoke">
                {r.moduleCount} modules · {new Date(r.createdAt).toLocaleDateString()} · {r.persisted}
              </p>
            </div>
            <button
              onClick={() => load(r.id)}
              className="shrink-0 rounded border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-fog hover:border-ember/50 hover:text-ember"
            >
              restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
