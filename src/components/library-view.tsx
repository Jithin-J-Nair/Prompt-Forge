"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Trash2, Flame } from "lucide-react";
import type { PromptSummary, PromptListResponse } from "@/lib/types";
import { Reveal } from "@/components/motion";
import { SectionLabel } from "@/components/chrome";
import { useLocale } from "@/lib/i18n";

export function LibraryView() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<PromptSummary[] | null>(null);
  const [error, setError] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);
  const dateLocale = useMemo(() => (locale === "ja" ? "ja-JP" : "en-US"), [locale]);

  useEffect(() => {
    fetch("/api/prompts?limit=48")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: PromptListResponse) => {
        setItems(d.prompts);
      })
      .catch(() => setError(true));
  }, []);

  const remove = async (id: number) => {
    const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev?.filter((p) => p.id !== id) ?? null);
    }
    setConfirming(null);
  };

  return (
    <div>
      <header className="mb-10 md:mb-14">
        <SectionLabel>{t("lib.label")}</SectionLabel>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] md:text-6xl">
          {t("lib.title")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70">
          {t("lib.body")}
        </p>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{t("lib.error")}</span>
        </div>
      )}

      {!error && items === null && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-52 rounded-box" />
          ))}
        </div>
      )}

      {!error && items !== null && items.length === 0 && (
        <div className="mx-auto max-w-lg rounded-box border border-dashed border-base-300 bg-base-100 px-8 py-20 text-center">
          <Flame className="mx-auto size-8 text-primary" strokeWidth={1.5} />
          <p className="mt-6 font-display text-2xl font-bold tracking-tight">
            {t("lib.emptyTitle")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-base-content/70">
            {t("lib.emptyBody")}
          </p>
          <Link href="/forge" className="btn btn-primary mt-8 gap-2">
            {t("lib.forgeFirst")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.05}>
              <article className="card card-border bg-base-100 h-full transition-colors hover:border-primary">
                <div className="card-body">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs opacity-55">
                      #{String(p.id).padStart(4, "0")}
                    </span>
                    <span className="badge badge-soft badge-primary">{p.industry}</span>
                  </div>
                  <Link href={`/spec/${p.id}`} className="mt-2 block">
                    <h3 className="card-title font-display text-xl hover:text-primary">
                      {p.brandName}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-base-content/65">
                      “{p.rawPrompt}”
                    </p>
                  </Link>
                  <div className="card-actions mt-4 items-center justify-between border-t border-base-300 pt-4">
                    <span className="flex items-center gap-1.5 font-mono text-xs opacity-55">
                      <Clock3 className="size-3" />
                      {new Date(p.createdAt).toLocaleDateString(dateLocale, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-mono text-xs opacity-55">
                      {t("lib.words", { n: p.wordCount.toLocaleString(dateLocale) })}
                    </span>
                    {confirming === p.id ? (
                      <button
                        type="button"
                        onClick={() => void remove(p.id)}
                        className="btn btn-error btn-ghost btn-xs"
                      >
                        {t("lib.sure")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(p.id)}
                        className="btn btn-ghost btn-square btn-xs"
                        aria-label={t("lib.deleteAria", { name: p.brandName })}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
