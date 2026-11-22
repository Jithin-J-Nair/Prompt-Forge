"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  Check,
  Copy,
  Download,
  Flame,
  Link2,
  Sparkles,
} from "lucide-react";
import {
  isPromptForgeBridgePayload,
  PROMPTFORGE_BRIDGE_STORAGE_KEY,
  type PromptForgeBridgePayload,
} from "@/lib/promptforge/orchestrator-prompt";

function loadBridge(): PromptForgeBridgePayload | null {
  try {
    const raw = sessionStorage.getItem(PROMPTFORGE_BRIDGE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPromptForgeBridgePayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function PromptForgeConsole() {
  const [bridge, setBridge] = useState<PromptForgeBridgePayload | null>(null);
  const [copied, setCopied] = useState<"body" | "cook" | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBridge(loadBridge());
    setHydrated(true);
  }, []);

  const skillList = useMemo(() => {
    if (!bridge) return [];
    return bridge.skillNames.map((name, index) => ({
      name,
      slug: bridge.skillSlugs[index] ?? `skill-${index}`,
    }));
  }, [bridge]);

  async function copyText(kind: "body" | "cook", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  function downloadText(filename: string, contents: string) {
    const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!hydrated) {
    return (
      <p className="font-mono text-sm tracking-[0.14em] text-fog uppercase">Loading PromptForge…</p>
    );
  }

  if (!bridge) {
    return (
      <section className="rounded-2xl border border-line bg-carbon/70 p-6 md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-flare uppercase">
          <Flame className="size-3.5" aria-hidden /> PromptForge · body prompt
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[0.98] font-bold tracking-tight text-ivory md:text-5xl">
          Need a SkillForge <span className="text-gradient-ember">COOK</span> first.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-fog md:text-base">
          PromptForge builds the <strong className="font-medium text-ivory">BODY</strong> prompt — the
          phased execution protocol with skill links. The{" "}
          <strong className="font-medium text-ivory">BRAIN</strong> lives in SkillForge COOK.md. Compose
          a package, download the Cook pack, then hit <span className="text-ivory">Next</span>.
        </p>
        <Link
          href="/skillforge"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-3 font-mono text-xs font-semibold tracking-[0.12em] text-ink uppercase"
        >
          <ArrowLeft className="size-4" aria-hidden /> Go to SkillForge
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-flare/30 bg-flare/5 p-6 md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-flare uppercase">
          <Sparkles className="size-3.5" aria-hidden /> PromptForge · body ready
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[0.98] font-bold tracking-tight text-ivory md:text-5xl">
          Brain + body for <span className="text-gradient-ember">{bridge.categoryLabel}</span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-fog md:text-base">
          Attach <code className="text-ivory">{bridge.cookFilename}</code> (SkillForge brain) to your
          agent, then paste the PromptForge body below. The body tells the agent how to walk skills,
          phases, and review gates without inventing a generic site.
        </p>
        <p className="mt-3 text-sm text-ivory">{bridge.brief}</p>
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.12em] text-smoke uppercase">
          <span className="rounded-full border border-line px-3 py-1">
            {bridge.accepted ? "Accepted" : "Draft"} · {bridge.reviewStatus}
          </span>
          <span className="rounded-full border border-line px-3 py-1">
            {bridge.skillSlugs.length} skills
          </span>
          <span className="rounded-full border border-line px-3 py-1">{bridge.catalogVersion}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-carbon/70 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ivory">
            <Brain className="size-5 text-ember" aria-hidden /> 1. Attach COOK (brain)
          </h2>
          <p className="mt-2 text-sm leading-6 text-fog">
            Upload or paste <code className="text-ivory">{bridge.cookFilename}</code> into the agent
            context first. Without it, the body prompt will self-block.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadText(bridge.cookFilename, bridge.cookPrompt)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ivory uppercase"
            >
              <Download className="size-3.5" aria-hidden /> Re-download COOK
            </button>
            <button
              type="button"
              onClick={() => void copyText("cook", bridge.cookPrompt)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ivory uppercase"
            >
              {copied === "cook" ? <Check className="size-3.5 text-flare" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied === "cook" ? "Copied" : "Copy COOK"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-ember/40 bg-ember/10 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ivory">
            <Flame className="size-5 text-ember" aria-hidden /> 2. Paste BODY prompt
          </h2>
          <p className="mt-2 text-sm leading-6 text-fog">
            This is the PromptForge execution protocol: phases, skill roster links into COOK, and done
            gates for category-best / Awwwards-class craft.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText("body", bridge.orchestratorPrompt)}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ink uppercase"
            >
              {copied === "body" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied === "body" ? "Copied body" : "Copy body prompt"}
            </button>
            <button
              type="button"
              onClick={() =>
                downloadText(
                  `promptforge-BODY-${bridge.categoryKey}.md`,
                  bridge.orchestratorPrompt,
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ivory uppercase"
            >
              <Download className="size-3.5" aria-hidden /> Download body
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-carbon/70 p-5 md:p-7">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ivory">
          <Link2 className="size-5 text-ember" aria-hidden /> Skill links the agent must use
        </h2>
        <ol className="mt-5 grid gap-2 sm:grid-cols-2">
          {skillList.map((skill, index) => (
            <li
              key={skill.slug}
              className="rounded-lg border border-line bg-ink/70 px-4 py-3 font-mono text-[11px] text-fog"
            >
              <span className="text-flare">{index + 1}.</span>{" "}
              <span className="text-ivory">{skill.name}</span>
              <span className="mt-1 block text-smoke">COOK → {skill.slug}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-line bg-ink/80 p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-ivory">Body prompt preview</h2>
          <Link
            href="/skillforge"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-fog uppercase hover:text-ivory"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Back to SkillForge
          </Link>
        </div>
        <pre className="max-h-[min(70vh,720px)] overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-carbon/80 p-4 font-mono text-[11px] leading-5 text-fog">
          {bridge.orchestratorPrompt}
        </pre>
      </section>
    </div>
  );
}
