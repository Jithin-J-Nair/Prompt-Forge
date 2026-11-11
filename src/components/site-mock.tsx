"use client";

/* ------------------------------------------------------------------ */
/*  SiteMock — deterministic "real output" thumbnail: a miniature       */
/*  rendered website frame (browser chrome + one of four layout         */
/*  archetypes) seeded per-artifact, in the artifact's tone, with the   */
/*  artifact's accent. This is what your compiled prompt LOOKS like.    */
/* ------------------------------------------------------------------ */

import { type ReactNode } from "react";
import clsx from "clsx";

type Layout = "center" | "split" | "side" | "magazine";

const LAYOUTS: Layout[] = ["center", "split", "side", "magazine"];

function hash(s: string): number {
  let h = 9;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 387420489);
  return (h >>> 0);
}

function Bar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={clsx("rounded-[2px]", className)} style={style} />;
}

export function SiteMock({
  seed,
  tone = "Dark",
  accent = "#8b7cf6",
  className,
  children,
}: {
  seed: string;
  tone?: "Dark" | "Light";
  accent?: string;
  className?: string;
  children?: ReactNode; // live preview inset into the mock's hero
}) {
  const h = hash(seed);
  const layout = LAYOUTS[h % LAYOUTS.length];
  const dark = tone === "Dark";
  const bg = dark ? "#0b0b10" : "#f3f1ec";
  const ink = dark ? "rgba(242,237,230,0.85)" : "rgba(10,10,14,0.85)";
  const soft = dark ? "rgba(242,237,230,0.28)" : "rgba(10,10,14,0.22)";
  const hair = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const panel = dark ? "#12121a" : "#ffffff";

  return (
    <div className={clsx("overflow-hidden rounded-[10px] border", className)}
      style={{ background: panel, borderColor: hair }}>
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 border-b px-2.5 py-1.5" style={{ borderColor: hair, background: dark ? "#16161e" : "#ebe8e1" }}>
        <span className="size-[5px] rounded-full" style={{ background: "#fb7185" }} />
        <span className="size-[5px] rounded-full" style={{ background: "#fbbf24" }} />
        <span className="size-[5px] rounded-full" style={{ background: "#34d399" }} />
        <div className="mx-2 flex h-3.5 flex-1 items-center gap-1 rounded-full px-2" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}>
          <div className="h-[3px] w-14 rounded-full" style={{ background: soft }} />
        </div>
      </div>

      {/* the mini site */}
      <div className="relative" style={{ background: bg, aspectRatio: "16/10" }}>
        {/* nav row */}
        <div className="flex items-center justify-between px-3 pt-2">
          <div className="flex items-center gap-1">
            <div className="size-[7px] rounded-full" style={{ background: accent }} />
            <Bar className="h-1.5 w-7" style={{ background: ink }} />
          </div>
          <div className="flex items-center gap-1.5">
            <Bar className="h-1 w-4" style={{ background: soft }} />
            <Bar className="h-1 w-4" style={{ background: soft }} />
            <Bar className="h-2.5 w-7 rounded-full" style={{ background: accent }} />
          </div>
        </div>

        {layout === "center" && (
          <div className="flex flex-col items-center px-6 pt-4 text-center">
            <div className="relative mb-2 h-10 w-4/5 overflow-hidden rounded-md" style={{ background: `linear-gradient(120deg, ${accent}33, transparent 70%)` }}>
              {children}
            </div>
            <Bar className="h-2.5 w-3/5" style={{ background: ink }} />
            <Bar className="mt-1 h-2.5 w-2/5" style={{ background: ink }} />
            <Bar className="mt-1.5 h-1 w-1/2" style={{ background: soft }} />
            <Bar className="mt-2 h-3 w-12 rounded-full" style={{ background: accent }} />
          </div>
        )}

        {layout === "split" && (
          <div className="grid grid-cols-2 gap-2 px-3 pt-3">
            <div className="flex flex-col justify-center">
              <Bar className="h-2.5 w-4/5" style={{ background: ink }} />
              <Bar className="mt-1 h-2.5 w-3/5" style={{ background: ink }} />
              <Bar className="mt-1.5 h-1 w-full" style={{ background: soft }} />
              <Bar className="mt-1 h-1 w-5/6" style={{ background: soft }} />
              <div className="mt-2 flex gap-1">
                <Bar className="h-3 w-8 rounded-full" style={{ background: accent }} />
                <Bar className="h-3 w-8 rounded-full border" style={{ borderColor: hair }} />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-md" style={{ background: `linear-gradient(160deg, ${accent}3d, transparent 65%)`, minHeight: 52 }}>
              {children}
            </div>
          </div>
        )}

        {layout === "side" && (
          <div className="flex gap-2 px-3 pt-3">
            <div className="flex w-[18%] flex-col gap-1 border-r pr-2" style={{ borderColor: hair }}>
              <Bar className="h-1 w-full" style={{ background: soft }} />
              <Bar className="h-1 w-4/5" style={{ background: soft }} />
              <Bar className="h-1 w-3/5" style={{ background: accent }} />
            </div>
            <div className="flex-1">
              <div className="relative h-8 overflow-hidden rounded-md" style={{ background: `linear-gradient(100deg, ${accent}2e, transparent 70%)` }}>
                {children}
              </div>
              <Bar className="mt-1.5 h-2 w-1/2" style={{ background: ink }} />
              <Bar className="mt-1 h-1 w-full" style={{ background: soft }} />
              <Bar className="mt-1 h-1 w-4/6" style={{ background: soft }} />
            </div>
          </div>
        )}

        {layout === "magazine" && (
          <div className="grid grid-cols-[1.4fr_1fr] gap-2 px-3 pt-3">
            <div className="relative overflow-hidden rounded-md" style={{ background: `linear-gradient(140deg, ${accent}38, transparent 70%)`, minHeight: 58 }}>
              {children}
              <Bar className="absolute bottom-1.5 left-1.5 h-2 w-3/5" style={{ background: ink }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Bar className="h-2 w-full" style={{ background: ink }} />
              <Bar className="h-1 w-4/5" style={{ background: soft }} />
              <Bar className="h-1 w-full" style={{ background: soft }} />
              <Bar className="mt-auto h-2.5 w-2/3 rounded-full" style={{ background: accent }} />
            </div>
          </div>
        )}

        {/* card row */}
        <div className="flex gap-1.5 px-3 pb-2.5 pt-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-sm border p-1.5" style={{ borderColor: hair, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
              <div className="mb-1 h-3.5 rounded-[2px]" style={{ background: i === (h % 3) ? `${accent}40` : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)") }} />
              <Bar className="h-1 w-4/5" style={{ background: soft }} />
              <Bar className="mt-0.5 h-1 w-3/5" style={{ background: soft }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
