"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame, Check, ArrowUpRight, AlertTriangle, RotateCcw, Sparkles,
} from "lucide-react";
import clsx from "clsx";
import type { EnhancedSpec } from "@/lib/engine/enhancer";
import { EXAMPLE_PROMPTS } from "@/lib/templates";
import { SpecRenderer } from "@/components/spec-renderer";
import { SectionLabel } from "@/components/chrome";
import { useLocale, type MessageKey } from "@/lib/i18n";

type Phase = "idle" | "forging" | "done" | "error";

interface ForgeResult {
  id: number | null;
  createdAt: string;
  ephemeral?: boolean;
  spec: EnhancedSpec;
}

const LAYER_KEYS: MessageKey[] = [
  "layer.missionBrief",
  "layer.brandIdentity",
  "layer.designSystem",
  "layer.layoutLaw",
  "layer.pageBlueprints",
  "layer.componentContracts",
  "layer.copyStrategy",
  "layer.motionScore",
  "layer.technicalStack",
  "layer.seoAccess",
  "layer.backendData",
  "layer.definitionOfDone",
];

export function ForgeConsole() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const [brief, setBrief] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ForgeResult | null>(null);
  const autoRan = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dateLocale = useMemo(() => (locale === "ja" ? "ja-JP" : "en-US"), [locale]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const stageLabels = useCallback(
    (spec: EnhancedSpec | null): string[] => [
      t("forge.stage.parse"),
      spec
        ? t("forge.stage.industryNamed", { name: spec.industry })
        : t("forge.stage.industry"),
      spec
        ? t("forge.stage.brandNamed", { name: spec.brand.name })
        : t("forge.stage.brand"),
      t("forge.stage.tokens"),
      spec
        ? t("forge.stage.routesNamed", { n: spec.stats.pages })
        : t("forge.stage.routes"),
      spec
        ? t("forge.stage.componentsNamed", { n: spec.stats.components })
        : t("forge.stage.components"),
      t("forge.stage.copy"),
      t("forge.stage.motion"),
      t("forge.stage.seo"),
      t("forge.stage.compile"),
    ],
    [t],
  );

  const forge = useCallback(
    async (raw?: string) => {
      const prompt = (raw ?? brief).trim();
      if (prompt.length < 3 || phase === "forging") {
        if (prompt.length < 3) setError(t("forge.errorShort"));
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
          setError(data.error ?? t("forge.errorCracked"));
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
        setError(t("forge.errorNetwork"));
        setPhase("error");
      }
    },
    [brief, phase, t],
  );

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
      <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-box border border-base-300 bg-base-100 p-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend flex w-full items-center justify-between">
                <span>{t("forge.brief")}</span>
                <span className={clsx("font-mono text-xs", brief.length > 380 ? "text-error" : "opacity-55")}>
                  {brief.length}/400
                </span>
              </legend>
              <textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value.slice(0, 400))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void forge();
                }}
                placeholder={t("forge.placeholder")}
                rows={4}
                autoFocus
                className="textarea w-full"
                aria-describedby="brief-hint"
              />
              <p id="brief-hint" className="label">
                {t("forge.hint")}
              </p>
            </fieldset>

            <button
              type="button"
              onClick={() => void forge()}
              disabled={phase === "forging"}
              className="btn btn-primary btn-block mt-4 gap-2"
            >
              {phase === "forging" ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {t("forge.forging")}
                </>
              ) : (
                <>
                  <Flame className="size-4" />
                  {t("forge.cta")}
                </>
              )}
            </button>

            {phase === "done" && (
              <button
                type="button"
                onClick={() => {
                  clearTimers();
                  setPhase("idle");
                  setResult(null);
                  setStage(0);
                }}
                className="btn btn-outline btn-block mt-3 gap-2"
              >
                <RotateCcw className="size-3.5" />
                {t("forge.startOver")}
              </button>
            )}

            <div className="mt-6 border-t border-base-300 pt-5">
              <p className="mb-3 flex items-center gap-2 font-mono text-xs opacity-60">
                <Sparkles className="size-3.5 text-primary" />
                {t("forge.spark")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => {
                      setBrief(example.prompt);
                      void forge(example.prompt);
                    }}
                    disabled={phase === "forging"}
                    className="btn btn-ghost btn-xs"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-full min-h-[420px] flex-col justify-between rounded-box border border-dashed border-base-300 bg-base-100/60 p-7"
              >
                <div>
                  <p className="font-mono text-xs opacity-55">{t("forge.idle")}</p>
                  <div className="mt-8 space-y-2">
                    {LAYER_KEYS.map((key) => (
                      <p key={key} className="font-mono text-xs opacity-45">
                        {t(key)}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="mt-8 text-2xl italic text-base-content/60 md:text-3xl">
                  {t("forge.idleQuote")}
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
                className="rounded-box border border-base-300 bg-base-100 p-7"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-primary">
                    {phase === "error" ? t("forge.halted") : t("forge.hot")}
                  </p>
                  {phase === "forging" && (
                    <span className="font-mono text-xs opacity-60">{Math.min(stage, 10)}/10</span>
                  )}
                </div>
                <p className="mt-3 line-clamp-1 font-mono text-sm text-base-content/70">“{brief}”</p>

                {phase === "error" ? (
                  <div role="alert" className="alert alert-error mt-6">
                    <AlertTriangle className="size-4.5 shrink-0" />
                    <div>
                      <p className="text-sm">{error}</p>
                      <button
                        type="button"
                        onClick={() => setPhase("idle")}
                        className="btn btn-ghost btn-xs mt-2"
                      >
                        {t("forge.backAnvil")}
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
                          key={`${i}-${l}`}
                          initial={{ opacity: 0.25 }}
                          animate={{ opacity: doneStep || active ? 1 : 0.25 }}
                          className="flex items-center gap-3 font-mono text-sm"
                        >
                          <span className="grid size-5 shrink-0 place-items-center">
                            {doneStep ? (
                              <Check className="size-4 text-success" strokeWidth={2.5} />
                            ) : active ? (
                              <span className="loading loading-spinner loading-xs text-primary" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-base-300" />
                            )}
                          </span>
                          <span className={doneStep ? "" : active ? "text-primary" : "opacity-45"}>
                            {l}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ol>
                )}

                {phase === "forging" && (
                  <progress
                    className="progress progress-primary mt-6 w-full"
                    value={stage}
                    max={10}
                  />
                )}
              </motion.div>
            )}

            {phase === "done" && result && (
              <motion.div
                key="done-meta"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-box border border-primary/40 bg-primary/5 p-7"
              >
                <SectionLabel>
                  {result.id == null ? t("forge.ephemeral") : t("forge.filed")}
                </SectionLabel>
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                      {result.spec.brand.name}
                    </p>
                    <p className="mt-2 font-mono text-xs text-base-content/65">
                      {result.spec.industry} · {result.spec.stats.words.toLocaleString(dateLocale)}{" "}
                      {locale === "ja" ? "語" : "words"} · {result.spec.stats.pages}{" "}
                      {locale === "ja" ? "ルート" : "routes"} · {result.spec.stats.components}{" "}
                      {locale === "ja" ? "コンポーネント" : "components"} ·{" "}
                      {locale === "ja" ? "信頼度" : "confidence"}{" "}
                      {(result.spec.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  {result.id != null && (
                    <Link href={`/spec/${result.id}`} className="btn btn-outline btn-sm gap-2">
                      {t("forge.permanent")}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  )}
                </div>
                <p className="mt-5 border-t border-base-300 pt-4 font-mono text-xs opacity-55">
                  {result.id == null
                    ? t("forge.notPersisted")
                    : t("forge.specScroll", {
                        id: String(result.id).padStart(4, "0"),
                      })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
