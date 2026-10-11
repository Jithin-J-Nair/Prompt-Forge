"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Trash2, Flame } from "lucide-react";
import type { PromptSummary, PromptListResponse } from "@/lib/types";
import { GlowCard, Reveal } from "@/components/motion";

export function LibraryView() {
  const [items, setItems] = useState<PromptSummary[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/prompts?limit=48")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: PromptListResponse) => {
        setItems(d.prompts);
        setTotal(d.total);
      })
      .catch(() => setError(true));
  }, []);

  const remove = async (id: number) => {
    const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev?.filter((p) => p.id !== id) ?? null);
      setTotal((t) => Math.max(0, t - 1));
    }
    setConfirming(null);
  };

  return (
    <div>
      {error && (
        <div className="rounded-xl border border-blood/40 bg-blood/10 p-6 font-mono text-[13px] text-ivory">
          The ledger could not be loaded. Check the furnace and refresh.
        </div>
      )}

      {!error && items === null && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[210px] animate-pulse rounded-xl border border-line bg-carbon/40" />
          ))}
        </div>
      )}

      {!error && items !== null && items.length === 0 && (
        <div className="mx-auto max-w-lg rounded-xl border border-dashed border-line-bright bg-carbon/30 px-8 py-20 text-center">
          <Flame className="mx-auto size-8 text-ember" strokeWidth={1.5} />
          <p className="mt-6 font-display text-2xl font-bold tracking-tight uppercase">
            The library is cold.
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-fog">
            Nothing forged yet. Feed the furnace one lazy sentence and the
            ledger starts here.
          </p>
          <Link
            href="/forge"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-mono text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-flare"
          >
            Forge the first spec
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.05}>
              <GlowCard className="group relative flex h-full flex-col justify-between rounded-xl border border-line bg-carbon/60 p-6 transition-colors duration-300 hover:border-ember/50">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10.5px] text-smoke">
                      #{String(p.id).padStart(4, "0")}
                    </span>
                    <span className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-ember uppercase">
                      {p.industry}
                    </span>
                  </div>
                  <Link href={`/spec/${p.id}`} className="mt-5 block">
                    <h3 className="font-display text-2xl font-bold tracking-tight uppercase transition-colors group-hover:text-ember">
                      {p.brandName}
                    </h3>
                    <p className="mt-2 line-clamp-2 font-mono text-[12px] leading-relaxed text-fog">
                      “{p.rawPrompt}”
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-smoke">
                    <Clock3 className="size-3" />
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="font-mono text-[10.5px] text-smoke">
                    {p.wordCount.toLocaleString()} words
                  </span>
                  {confirming === p.id ? (
                    <button
                      onClick={() => void remove(p.id)}
                      className="font-mono text-[10.5px] tracking-[0.1em] text-blood uppercase underline underline-offset-4"
                    >
                      Sure?
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirming(p.id)}
                      className="text-smoke transition-colors hover:text-blood"
                      aria-label={`Delete spec ${p.brandName}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
