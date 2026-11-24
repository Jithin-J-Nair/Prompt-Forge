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
import { useLocale } from "@/lib/i18n";

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
  const { t } = useLocale();
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
        <span className="loading loading-dots loading-sm" /> {t("pf.loading")}
      </p>
    );
  }

  if (!bridge) {
    return (
      <section className="rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        <span className="badge badge-soft badge-primary gap-2">
          <Flame className="size-3.5" aria-hidden /> {t("pf.emptyBadge")}
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
          {t("pf.emptyTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/70">
          {t("pf.emptyBodyBefore")}
          <strong className="font-semibold text-base-content">{t("pf.bodyWord")}</strong>
          {t("pf.emptyBody")}
          <strong className="font-semibold text-base-content">{t("pf.brainWord")}</strong>
          {t("pf.emptyBodyAfter")}
        </p>
        <Link href="/skillforge" className="btn btn-primary mt-6 gap-2">
          <ArrowLeft className="size-4" aria-hidden /> {t("pf.goSkillforge")}
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-box border border-primary/30 bg-primary/5 p-6 md:p-8">
        <span className="badge badge-soft badge-primary gap-2">
          <Sparkles className="size-3.5" aria-hidden /> {t("pf.readyBadge")}
        </span>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
          {t("pf.readyTitle", { category: bridge.categoryLabel })}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-base-content/70">
          {t("pf.readyBody", { file: bridge.cookFilename })}
        </p>
        <p className="mt-3 text-sm">{bridge.brief}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-outline">
            {bridge.accepted ? t("pf.accepted") : t("pf.draft")} · {bridge.reviewStatus}
          </span>
          <span className="badge badge-outline">
            {t("pf.skillsCount", { n: bridge.skillSlugs.length })}
          </span>
          <span className="badge badge-outline">{bridge.catalogVersion}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Brain className="size-5 text-primary" aria-hidden /> {t("pf.attachCook")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            {t("pf.attachBody", { file: bridge.cookFilename })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadText(bridge.cookFilename, bridge.cookPrompt)}
              className="btn btn-outline btn-sm gap-2"
            >
              <Download className="size-3.5" aria-hidden /> {t("pf.redownloadCook")}
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
              {copied === "cook" ? t("pf.copied") : t("pf.copyCook")}
            </button>
          </div>
        </div>

        <div className="rounded-box border border-primary/40 bg-primary/10 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Flame className="size-5 text-primary" aria-hidden /> {t("pf.pasteBody")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            {t("pf.pasteBodyHelp")}
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
              {copied === "body" ? t("pf.copiedBody") : t("pf.copyBody")}
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
              <Download className="size-3.5" aria-hidden /> {t("pf.downloadBody")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-7">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Link2 className="size-5 text-primary" aria-hidden /> {t("pf.skillLinks")}
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
          <h2 className="font-display text-2xl font-bold">{t("pf.bodyPreview")}</h2>
          <Link href="/skillforge" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="size-3.5" aria-hidden /> {t("pf.backSkillforge")}
          </Link>
        </div>
        <pre className="max-h-[min(70vh,720px)] overflow-auto whitespace-pre-wrap rounded-field border border-base-300 bg-base-200/40 p-4 font-mono text-[11px] leading-5 text-base-content/75">
          {bridge.orchestratorPrompt}
        </pre>
      </section>
    </div>
  );
}
