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
      <p className="font-mono text-sm text-base-content/60">
        <span className="loading loading-dots loading-sm" /> Loading PromptForge…
      </p>
    );
  }

  if (!bridge) {
    return (
      <section className="rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        <span className="badge badge-soft badge-primary gap-2">
          <Flame className="size-3.5" aria-hidden /> PromptForge · body prompt
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
          Need a SkillForge COOK first.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/70">
          PromptForge builds the <strong className="font-semibold text-base-content">BODY</strong>{" "}
          prompt — the phased execution protocol with skill links. The{" "}
          <strong className="font-semibold text-base-content">BRAIN</strong> lives in SkillForge
          COOK.md. Compose a package, download the Cook pack, then hit Next.
        </p>
        <Link href="/skillforge" className="btn btn-primary mt-6 gap-2">
          <ArrowLeft className="size-4" aria-hidden /> Go to SkillForge
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-box border border-primary/30 bg-primary/5 p-6 md:p-8">
        <span className="badge badge-soft badge-primary gap-2">
          <Sparkles className="size-3.5" aria-hidden /> PromptForge · body ready
        </span>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
          Brain + body for {bridge.categoryLabel}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-base-content/70">
          Attach <code className="font-mono text-sm">{bridge.cookFilename}</code> (SkillForge brain)
          to your agent, then paste the PromptForge body below.
        </p>
        <p className="mt-3 text-sm">{bridge.brief}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-outline">
            {bridge.accepted ? "Accepted" : "Draft"} · {bridge.reviewStatus}
          </span>
          <span className="badge badge-outline">{bridge.skillSlugs.length} skills</span>
          <span className="badge badge-outline">{bridge.catalogVersion}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Brain className="size-5 text-primary" aria-hidden /> 1. Attach COOK (brain)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            Upload or paste <code className="font-mono">{bridge.cookFilename}</code> into the agent
            context first. Without it, the body prompt will self-block.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadText(bridge.cookFilename, bridge.cookPrompt)}
              className="btn btn-outline btn-sm gap-2"
            >
              <Download className="size-3.5" aria-hidden /> Re-download COOK
            </button>
            <button
              type="button"
              onClick={() => void copyText("cook", bridge.cookPrompt)}
              className="btn btn-outline btn-sm gap-2"
            >
              {copied === "cook" ? (
                <Check className="size-3.5 text-success" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              {copied === "cook" ? "Copied" : "Copy COOK"}
            </button>
          </div>
        </div>

        <div className="rounded-box border border-primary/40 bg-primary/10 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Flame className="size-5 text-primary" aria-hidden /> 2. Paste BODY prompt
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            This is the PromptForge execution protocol: phases, skill roster links into COOK, and
            done gates for category-best craft.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyText("body", bridge.orchestratorPrompt)}
              className="btn btn-primary btn-sm gap-2"
            >
              {copied === "body" ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
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
              className="btn btn-outline btn-sm gap-2"
            >
              <Download className="size-3.5" aria-hidden /> Download body
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-7">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Link2 className="size-5 text-primary" aria-hidden /> Skill links the agent must use
        </h2>
        <ol className="mt-5 grid gap-2 sm:grid-cols-2">
          {skillList.map((skill, index) => (
            <li
              key={skill.slug}
              className="rounded-field border border-base-300 bg-base-200/50 px-4 py-3 font-mono text-xs"
            >
              <span className="text-primary">{index + 1}.</span>{" "}
              <span className="text-base-content">{skill.name}</span>
              <span className="mt-1 block opacity-55">COOK → {skill.slug}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">Body prompt preview</h2>
          <Link href="/skillforge" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="size-3.5" aria-hidden /> Back to SkillForge
          </Link>
        </div>
        <pre className="max-h-[min(70vh,720px)] overflow-auto whitespace-pre-wrap rounded-field border border-base-300 bg-base-200/40 p-4 font-mono text-[11px] leading-5 text-base-content/75">
          {bridge.orchestratorPrompt}
        </pre>
      </section>
    </div>
  );
}
