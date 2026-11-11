"use client";

/* ------------------------------------------------------------------ */
/*  Artifact detail — motionsites-style: full preview theatre on the    */
/*  left, prompt + actions on the right. Likes, chips, four export      */
/*  targets, one-click stack.                                           */
/* ------------------------------------------------------------------ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Heart, Layers, Plus } from "lucide-react";
import clsx from "clsx";
import { ARTIFACTS, LEXICON_MAP, type Artifact } from "@/lib/lexicon";
import { artifactPrimaryModule, artifactStack, compileStack, EXPORT_TARGETS, type ExportTarget } from "@/lib/lexicon/compile";
import { getModule } from "@/lib/studio";
import { defaultParams } from "@/lib/studio/params";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { useStack } from "@/components/lexicon/stack";
import { Tilt } from "@/components/motion";
import { motionTokens, springs } from "@/lib/motion/tokens";

export function ArtifactDetail({ artifact }: { artifact: Artifact }) {
  const { addAll, has, toggle, setOpen } = useStack();
  const [loved, setLoved] = useState(false);
  const [target, setTarget] = useState<ExportTarget>("raw");
  const [copied, setCopied] = useState(false);

  const stack = useMemo(() => artifactStack(artifact), [artifact]);
  const primaryId = artifactPrimaryModule(artifact);
  const mod = primaryId ? getModule(primaryId) : undefined;
  const output = compileStack(stack, target, artifact.name);
  const allIn = stack.length > 0 && stack.every((id) => has(id));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-40 pt-28 md:px-8">
      <Link href="/" className="press inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke transition-colors hover:text-ivory">
        <ArrowLeft className="size-3.5" /> All artifacts
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        {/* theatre */}
        <Tilt max={4}>
        <motion.div
          initial={{ opacity: 0, scale: motionTokens.scale.enter }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: motionTokens.duration.slow, ease: [...motionTokens.easing.outExpo] }}
          className="relative min-h-[46dvh] overflow-hidden rounded-xl border border-line bg-ink lg:min-h-[62dvh]"
        >
          {mod ? (
            <PreviewFrame module={mod} params={defaultParams(mod)} mode="detail" className="absolute inset-0" />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_120%_at_30%_20%,rgba(139,124,246,0.2),transparent_60%),radial-gradient(70%_100%_at_80%_90%,rgba(103,232,249,0.12),transparent_60%)]" />
          )}
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ivory backdrop-blur-md">
            Live preview
          </span>
        </motion.div>
        </Tilt>

        {/* control panel */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: motionTokens.duration.slow * 0.8, ease: [...motionTokens.easing.outExpo] }}
          className="flex flex-col"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
            {artifact.industry} · {artifact.tone} tone
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-none tracking-tight text-ivory">
            {artifact.name}
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-fog">{artifact.blurb}</p>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={() => setLoved((v) => !v)} aria-pressed={loved}
              className={clsx("press inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] transition-colors",
                loved ? "border-ember/60 bg-ember/15 text-ember" : "border-line text-fog hover:text-ivory")}>
              <Heart className={clsx("size-3.5", loved && "fill-current")} />
              <span className="tabular">{artifact.votes + (loved ? 1 : 0)}</span> likes
            </button>
            <span className="tabular font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              {stack.length} keywords
            </span>
          </div>

          {/* the decomposed chips */}
          <div className="mt-6">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">Decomposed stack</p>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((id) => {
                const k = LEXICON_MAP.get(id);
                if (!k) return null;
                const on = has(id);
                return (
                  <button key={id} onClick={() => toggle(id)} aria-pressed={on} title={k.phrase.slice(0, 120)}
                    className={clsx("press rounded-full border px-3 py-1.5 font-mono text-[10px] transition-colors",
                      on ? "border-ember/60 bg-ember/15 text-flare" : "border-line text-fog hover:border-line-bright hover:text-ivory")}>
                    {k.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => { addAll(stack); setOpen(true); }}
            className={clsx("press glint mt-6 flex items-center justify-center gap-2 rounded-md py-3.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.16em] transition-colors",
              allIn ? "border border-ember/50 bg-ember/10 text-flare" : "bg-ember text-ink hover:bg-flare")}
          >
            {allIn ? <><Check className="size-4" /> Fully stacked — open tray</> : <><Plus className="size-4" /> Stack this entire site</>}
          </button>

          {/* the prompt, four targets */}
          <div className="mt-8 min-h-0 flex-1">
            <div className="flex gap-1 border-b border-line pb-2">
              {EXPORT_TARGETS.map((t) => (
                <button key={t.id} onClick={() => setTarget(t.id)} title={t.hint}
                  className={clsx("press relative rounded-full px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors",
                    target === t.id ? "text-ivory" : "text-smoke hover:text-fog")}>
                  {target === t.id && (
                    <motion.span layoutId="pf-detail-target" transition={springs.snappy} aria-hidden
                      className="absolute inset-0 rounded-full border border-ember/40 bg-ember/15" />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <pre className="spec-markdown mt-3 max-h-72 overflow-y-auto rounded-lg border border-line bg-ink/70 p-4 text-fog">{output}</pre>
            <button
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
              className="press mt-3 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fog transition-colors hover:border-line-bright hover:text-ivory"
            >
              {copied ? <><Check className="size-3.5 text-ember" /> Copied to clipboard</> : <><Copy className="size-3.5" /> Copy {EXPORT_TARGETS.find((t) => t.id === target)?.label} prompt</>}
            </button>
          </div>
        </motion.aside>
      </div>

      {/* related builds — keep touring */}
      <section className="mt-20" aria-label="Related artifacts">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">More from the forge</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ARTIFACTS.filter((x) => x.id !== artifact.id)
            .sort((a, b) => (a.industry === artifact.industry ? -1 : 0) - (b.industry === artifact.industry ? -1 : 0) || b.votes - a.votes)
            .slice(0, 4)
            .map((x) => (
              <Link key={x.id} href={`/artifact/${x.id}`}
                className="press group rounded-lg border border-line bg-carbon/60 p-4 transition-colors hover:border-ember/40">
                <p className="font-display text-[15px] font-bold tracking-tight text-ivory transition-colors group-hover:text-flare">{x.name}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">{x.industry} · <span className="tabular">{x.votes}</span></p>
                <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-fog">{x.blurb}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
