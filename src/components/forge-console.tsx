"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame, Check, Loader2, ArrowUpRight, AlertTriangle, RotateCcw, Sparkles,
} from "lucide-react";
import clsx from "clsx";
import type { EnhancedSpec } from "@/lib/engine/enhancer";
import { EXAMPLE_PROMPTS } from "@/lib/templates";
import { SpecRenderer } from "@/components/spec-renderer";
import { Eyebrow } from "@/components/chrome";

type Phase = "idle" | "forging" | "done" | "error";

interface ForgeResult {
  id: number;
  createdAt: string;
  spec: EnhancedSpec;
}

function stageLabels(spec: EnhancedSpec | null): string[] {
  return [
    "Parsing raw intent",
    spec ? `Locking industry — ${spec.industry}` : "Locking industry",
    spec ? `Minting brand — ${spec.brand.name}` : "Minting brand identity",
    "Drafting design tokens",
    spec ? `Mapping ${spec.stats.pages} routes` : "Mapping routes",
    spec ? `Spec'ing ${spec.stats.components} components` : "Spec'ing components",
    "Writing copy strategy",
    "Scoring motion",
    "Sealing SEO + accessibility",
    "Compiling mega prompt",
  ];
}

export function ForgeConsole() {
  const router = useRouter();
  const params = useSearchParams();
  const [brief, setBrief] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ForgeResult | null>(null);
  const autoRan = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const forge = useCallback(async (raw?: string) => {
    const prompt = (raw ?? brief).trim();
    if (prompt.length < 3 || phase === "forging") {
      if (prompt.length < 3) setError("Give the forge at least 3 characters.");
      return;
    }
    clearTimers();
    setPhase("forging");
    setError(null);
    setResult(null);
    setStage(0);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The forge cracked. Try again.");
        setPhase("error");
        return;
      }
      const r = data as ForgeResult;
      const total = 10;
      for (let i = 0; i < total; i++) {
        timers.current.push(setTimeout(() => setStage(i + 1), 190 * (i + 1)));
      }
      timers.current.push(
        setTimeout(() => {
          setResult(r);
          setPhase("done");
        }, 190 * total + 320),
      );
    } catch {
      setError("Network hiccup — the furnace went cold. Try again.");
      setPhase("error");
    }
  }, [brief, phase]);

  /* pre-fill + auto-forge from ?q= */
  useEffect(() => {
    const q = params.get("q");
    if (q && !autoRan.current) {
      autoRan.current = true;
      const v = q.slice(0, 400);
      setBrief(v);
      void forge(v);
      router.replace("/forge", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const labels = stageLabels(result?.spec ?? null);

  return (
    <div>
      {/* ------------------------------ console ------------------------------ */}
      <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
        {/* input panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-line bg-carbon/70 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <label htmlFor="brief" className="font-mono text-[11px] tracking-[0.2em] text-ember uppercase">
                Your lazy brief
              </label>
              <span className={clsx("font-mono text-[10.5px]", brief.length > 380 ? "text-blood" : "text-smoke")}>
                {brief.length}/400
              </span>
            </div>
            <textarea
              id="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value.slice(0, 400))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void forge();
              }}
              placeholder="make a website for a gym"
              rows={4}
              autoFocus
              className="mt-3 w-full resize-none rounded-lg border border-line bg-coal px-4 py-3 font-mono text-[14px] leading-relaxed text-ivory placeholder:text-smoke focus:border-ember focus:outline-none"
              aria-describedby="brief-hint"
            />
            <p id="brief-hint" className="mt-2 font-mono text-[10.5px] text-smoke">
              Vague is welcome. Cmd/Ctrl + Enter to forge.
            </p>

            <button
              onClick={() => void forge()}
              disabled={phase === "forging"}
              className={clsx(
                "group mt-5 flex h-13 w-full items-center justify-center gap-2.5 rounded-lg font-mono text-[12.5px] font-medium tracking-[0.16em] uppercase transition-all duration-200",
                phase === "forging"
                  ? "cursor-wait bg-steel text-fog"
                  : "bg-ember text-ink hover:bg-flare hover:shadow-[0_0_40px_rgba(255,92,28,0.35)]",
              )}
            >
              {phase === "forging" ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  Forging…
                </>
              ) : (
                <>
                  <Flame className="size-4.5 transition-transform duration-300 group-hover:rotate-12" />
                  Forge the mega prompt
                </>
              )}
            </button>

            {phase === "done" && (
              <button
                onClick={() => {
                  clearTimers();
                  setPhase("idle");
                  setResult(null);
                  setStage(0);
                }}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line font-mono text-[11px] tracking-[0.16em] text-fog uppercase transition-colors hover:border-ember hover:text-ember"
              >
                <RotateCcw className="size-3.5" />
                Quench & start over
              </button>
            )}

            {/* examples */}
            <div className="mt-6 border-t border-line pt-5">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.18em] text-smoke uppercase">
                <Sparkles className="size-3.5 text-ember" />
                Or strike a ready spark
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setBrief(t.prompt);
                      void forge(t.prompt);
                    }}
                    disabled={phase === "forging"}
                    className="rounded-full border border-line bg-coal px-3 py-1.5 font-mono text-[10.5px] text-fog transition-colors duration-150 hover:border-ember/60 hover:text-ember disabled:opacity-40"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* output panel */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-full min-h-[420px] flex-col justify-between rounded-xl border border-dashed border-line-bright bg-carbon/30 p-7"
              >
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-smoke uppercase">
                    Furnace idle — awaiting raw material
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      "01 · Mission Brief", "02 · Brand Identity", "03 · Design System",
                      "04 · Layout Law", "05 · Page Blueprints", "06 · Component Contracts",
                      "07 · Copy Strategy", "08 · Motion Score", "09 · Technical Stack",
                      "10 · SEO & Access", "11 · Backend & Data", "12 · Definition of Done",
                    ].map((s) => (
                      <p key={s} className="font-mono text-[12px] text-smoke/70">{s}</p>
                    ))}
                  </div>
                </div>
                <p className="mt-8 font-serif-d text-2xl text-fog italic md:text-3xl">
                  “Twelve sections are about to exist because of one sentence.”
                </p>
              </motion.div>
            )}

            {(phase === "forging" || phase === "error") && (
              <motion.div
                key="forging"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-line bg-carbon/70 p-7 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-ember uppercase">
                    {phase === "error" ? "Forge halted" : "The forge is hot"}
                  </p>
                  {phase === "forging" && (
                    <span className="font-mono text-[11px] text-fog">{Math.min(stage, 10)}/10</span>
                  )}
                </div>
                <p className="mt-3 line-clamp-1 font-mono text-[12.5px] text-fog">“{brief}”</p>

                {phase === "error" ? (
                  <div className="mt-6 flex items-start gap-3 rounded-lg border border-blood/40 bg-blood/10 p-4">
                    <AlertTriangle className="mt-0.5 size-4.5 shrink-0 text-blood" />
                    <div>
                      <p className="text-sm text-ivory">{error}</p>
                      <button
                        onClick={() => setPhase("idle")}
                        className="mt-2 font-mono text-[11px] tracking-[0.14em] text-ember uppercase underline underline-offset-4"
                      >
                        Back to the anvil
                      </button>
                    </div>
                  </div>
                ) : (
                  <ol className="mt-6 space-y-2.5" aria-live="polite">
                    {labels.map((l, i) => {
                      const doneStep = i < stage;
                      const active = i === stage;
                      return (
                        <motion.li
                          key={l}
                          initial={{ opacity: 0.25 }}
                          animate={{ opacity: doneStep || active ? 1 : 0.25 }}
                          className="flex items-center gap-3 font-mono text-[12.5px]"
                        >
                          <span className="grid size-5 shrink-0 place-items-center">
                            {doneStep ? (
                              <Check className="size-4 text-ember" strokeWidth={2.5} />
                            ) : active ? (
                              <Loader2 className="size-4 animate-spin text-flare" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-steel" />
                            )}
                          </span>
                          <span className={doneStep ? "text-ivory" : active ? "text-flare" : "text-smoke"}>
                            {l}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ol>
                )}

                {phase === "forging" && (
                  <div className="mt-6 h-1 overflow-hidden rounded-full bg-steel">
                    <motion.div
                      className="h-full bg-gradient-to-r from-ember to-flare"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(stage / 10) * 100}%` }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {phase === "done" && result && (
              <motion.div
                key="done-meta"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-ember/40 bg-gradient-to-br from-ember/[0.09] to-carbon p-7"
              >
                <Eyebrow>Forged & filed to your library</Eyebrow>
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
                      {result.spec.brand.name}
                      <span className="text-ember">.</span>
                    </p>
                    <p className="mt-2 font-mono text-[12px] text-fog">
                      {result.spec.industry} · {result.spec.stats.words.toLocaleString()} words ·{" "}
                      {result.spec.stats.pages} routes · {result.spec.stats.components} components ·{" "}
                      confidence {(result.spec.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Link
                    href={`/spec/${result.id}`}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-coal px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-ivory uppercase transition-colors hover:border-ember hover:text-ember"
                  >
                    Permanent link
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <p className="mt-5 border-t border-line pt-4 font-mono text-[10.5px] tracking-[0.14em] text-smoke uppercase">
                  Spec #{String(result.id).padStart(4, "0")} — scroll for the full blueprint
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------ full spec ------------------------------ */}
      {phase === "done" && result && (
        <motion.div
          key="spec"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <SpecRenderer spec={result.spec} createdAt={result.createdAt} />
        </motion.div>
      )}
    </div>
  );
}
