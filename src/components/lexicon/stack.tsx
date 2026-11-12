"use client";

/* ------------------------------------------------------------------ */
/*  The Stack Tray — the product. A persistent, cross-page tray of      */
/*  selected keyword chips with compile + export + share.               */
/*  Persistence: localStorage (survives refresh). Sharing: versioned stable-ID URL.  */
/* ------------------------------------------------------------------ */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Copy, Layers, Check, Trash2, X } from "lucide-react";
import { LEXICON_MAP } from "@/lib/lexicon";
import type { ParamValues } from "@/lib/studio";
import { decodeStack, encodeStack, EXPORT_TARGETS, type ExportTarget } from "@/lib/lexicon/compile";
import { buildMegaPrompt } from "@/lib/lexicon/mega-compiler";
import { springs, motionTokens } from "@/lib/motion/tokens";
import clsx from "clsx";

const LS_KEY = "pf-stack-v1";
const PARAMS_KEY = "pf-stack-params-v1";

interface StackCtx {
  ids: string[];
  paramsById: Record<string, ParamValues>;
  setParams: (id: string, params: ParamValues) => void;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  addAll: (ids: string[]) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<StackCtx | null>(null);

export function useStack(): StackCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStack outside provider");
  return c;
}

export function StackProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [paramsById, setParamsById] = useState<Record<string, ParamValues>>({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // hydrate once from localStorage + incoming share link (?stack=…) — event-sourced, no sync setState
  useEffect(() => {
    let next: string[] = [];
    let nextParams: Record<string, ParamValues> = {};
    try {
      const query = new URLSearchParams(window.location.search);
      const sharedStack = query.get("stack");
      if (sharedStack) {
        next = decodeStack(sharedStack);
        const sharedParams = query.get("stackParams");
        if (sharedParams) {
          const parsed = JSON.parse(sharedParams) as Record<string, unknown>;
          nextParams = Object.fromEntries(
            Object.entries(parsed).filter(([id, value]) =>
              LEXICON_MAP.has(id) && value !== null && typeof value === "object" && !Array.isArray(value),
            ),
          ) as Record<string, ParamValues>;
        }
      } else {
        const raw = window.localStorage.getItem(LS_KEY);
        if (raw) next = JSON.parse(raw) as string[];
        const rawParams = window.localStorage.getItem(PARAMS_KEY);
        if (rawParams) {
          const parsed = JSON.parse(rawParams) as Record<string, unknown>;
          nextParams = Object.fromEntries(
            Object.entries(parsed).filter(([id, value]) =>
              LEXICON_MAP.has(id) && value !== null && typeof value === "object" && !Array.isArray(value),
            ),
          ) as Record<string, ParamValues>;
        }
      }
    } catch { /* corrupted storage: start empty */ }
    const t = setTimeout(() => {
      setIds(next.filter((id) => LEXICON_MAP.has(id)));
      setParamsById(nextParams);
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // persist on change (post-hydration only)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(ids));
    } catch { /* private mode */ }
  }, [ids, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(PARAMS_KEY, JSON.stringify(paramsById));
    } catch { /* private mode */ }
  }, [paramsById, hydrated]);

  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  const addAll = useCallback(
    (add: string[]) => setIds((prev) => [...prev, ...add.filter((id) => !prev.includes(id))]),
    [],
  );
  const clear = useCallback(() => {
    setIds([]);
    setParamsById({});
  }, []);
  const setParams = useCallback((id: string, params: ParamValues) => {
    setParamsById((prev) => {
      const next = { ...params };
      if (!Object.keys(next).length) {
        if (!prev[id]) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      if (JSON.stringify(prev[id] ?? {}) === JSON.stringify(next)) return prev;
      return { ...prev, [id]: next };
    });
  }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, paramsById, setParams, has, toggle, addAll, clear, open, setOpen }),
    [ids, paramsById, setParams, has, toggle, addAll, clear, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ------------------------------ the tray ------------------------------ */

export function StackTray() {
  const { ids, paramsById, clear, toggle, open, setOpen } = useStack();
  const [copied, setCopied] = useState<"none" | "prompt" | "link">("none");
  const [target, setTarget] = useState<ExportTarget>("raw");
  const chips = ids.map((id) => LEXICON_MAP.get(id)).filter((k): k is NonNullable<typeof k> => !!k);
  const output = useMemo(() => open ? buildMegaPrompt({
    brief: "Create a website experience guided by the selected creative layers.",
    keywordIds: ids,
    paramsByKeywordId: paramsById,
    target,
    depth: "extreme",
  }).prompt : "", [open, ids, paramsById, target]);

  useEffect(() => {
    if (copied === "none") return;
    const t = setTimeout(() => setCopied("none"), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  if (!chips.length) return null;

  const shareUrl = () => {
    const u = new URL(window.location.origin + "/lexicon");
    u.searchParams.set("stack", encodeStack(ids));
    const activeParams = Object.fromEntries(ids.filter((id) => paramsById[id]).map((id) => [id, paramsById[id]]));
    u.searchParams.set("stackParams", JSON.stringify(activeParams));
    return u.toString();
  };

  return (
    <>
      {/* collapsed tray bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        <motion.div
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springs.gentle}
          className="glass pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-full py-2 pl-5 pr-2 shadow-2xl shadow-black/60"
        >
          <Layers className="size-4 shrink-0 text-ember" aria-hidden />
          <span className="tabular truncate font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
            {chips.length} chip{chips.length === 1 ? "" : "s"} stacked
          </span>
          <div className="hidden min-w-0 flex-1 items-center gap-0 overflow-hidden md:flex">
            {chips.slice(0, 4).map((k) => (
              <span key={k.id} className="mr-1.5 shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[9px] text-smoke">
                {k.name}
              </span>
            ))}
            {chips.length > 4 && <span className="font-mono text-[9px] text-smoke">+{chips.length - 4}</span>}
          </div>
          <button onClick={clear} aria-label="Clear stack"
            className="press grid size-8 shrink-0 place-items-center rounded-full text-smoke transition-colors hover:text-blood">
            <Trash2 className="size-3.5" />
          </button>
          <button onClick={() => setOpen(true)}
            className="press glint shrink-0 rounded-full bg-ember px-4 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-flare">
            Compile
          </button>
        </motion.div>
      </div>

      {/* compile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div key="pf-stack-drawer" className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: motionTokens.duration.fast } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            role="dialog" aria-modal="true" aria-label="Compile stack">
            <button aria-label="Close" className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: springs.gentle }}
              exit={{ y: 60, opacity: 0, transition: { duration: 0.15 } }}
              className="relative flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-line bg-coal sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">Compile</p>
                  <p className="tabular mt-1 text-sm text-fog">{chips.length} keywords → one prompt</p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close compiler"
                  className="press grid size-9 place-items-center rounded-full border border-line text-fog hover:text-ivory">
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 border-b border-line px-5 py-3">
                {chips.map((k) => (
                  <button key={k.id} onClick={() => toggle(k.id)} title="Remove chip"
                    className="press group rounded-full border border-ember/30 bg-ember/10 px-3 py-1 font-mono text-[10px] text-flare transition-colors hover:border-blood/50 hover:bg-blood/10 hover:text-blood">
                    {k.name} <span className="opacity-50 group-hover:opacity-100">×</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-1 border-b border-line px-5 py-2">
                {EXPORT_TARGETS.map((t) => (
                  <button key={t.id} onClick={() => setTarget(t.id)} title={t.hint}
                    className={clsx("press relative rounded-full px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors",
                      target === t.id ? "text-ivory" : "text-smoke hover:text-fog")}>
                    {target === t.id && (
                      <motion.span layoutId="pf-target-pill" transition={springs.snappy} aria-hidden
                        className="absolute inset-0 rounded-full border border-ember/40 bg-ember/15" />
                    )}
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </div>

              <pre className="spec-markdown min-h-0 flex-1 overflow-y-auto px-5 py-4 text-fog">{output}</pre>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                <Link href="/studio" className="press inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-smoke hover:text-ivory"
                  onClick={() => setOpen(false)}>
                  Continue in Studio <ArrowUpRight className="size-3" />
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(shareUrl()); setCopied("link"); }}
                    className="press rounded-md border border-line px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fog transition-colors hover:border-line-bright hover:text-ivory">
                    {copied === "link" ? <span className="inline-flex items-center gap-1.5 text-ember"><Check className="size-3.5" /> Link copied</span> : "Copy share link"}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(output); setCopied("prompt"); }}
                    className="press glint rounded-md bg-ember px-4 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-flare">
                    {copied === "prompt" ? <span className="inline-flex items-center gap-1.5"><Check className="size-3.5" /> Copied</span> : <span className="inline-flex items-center gap-1.5"><Copy className="size-3.5" /> Copy prompt</span>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
