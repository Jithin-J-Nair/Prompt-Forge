"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";

/** Sample COOK.md stream — real product subject, not decor. */
const COOK_STREAM = [
  { kind: "meta" as const, text: "skillforge compose · northline recruiting" },
  { kind: "out" as const, text: "# SKILLFORGE COOK.md — BRAIN" },
  { kind: "blank" as const, text: "" },
  { kind: "out" as const, text: "## Mission" },
  {
    kind: "out" as const,
    text: "- North star: council-gated AI recruiting that reads like a senior desk",
  },
  { kind: "out" as const, text: "- Category mode: **ai-product**" },
  { kind: "out" as const, text: "- Audience: talent ops leads at mid-market SaaS" },
  { kind: "blank" as const, text: "" },
  { kind: "out" as const, text: "## Selected concept + why" },
  {
    kind: "out" as const,
    text: "- **Council Desk** (score 4.6/5) — review gates before every shortlist",
  },
  {
    kind: "out" as const,
    text: "- Evidence: brief names “enterprise” + “council”; avoids generic ATS chrome",
  },
  { kind: "blank" as const, text: "" },
  { kind: "out" as const, text: "## Project DNA" },
  { kind: "out" as const, text: "- **Brand name** (confirmed): Northline" },
  {
    kind: "out" as const,
    text: "- **Palette** (inferred): blueprint blue · ember primary · accent cyan",
  },
  { kind: "out" as const, text: "- **Type** (confirmed): Bricolage + Instrument Sans" },
  { kind: "blank" as const, text: "" },
  { kind: "out" as const, text: "## Expertise graph (focused roster)" },
  { kind: "out" as const, text: "- Roster size: 11 specialists (no skill dump)" },
  { kind: "hit" as const, text: "01  craft-direction · motion language · gates" },
  { kind: "hit" as const, text: "02  layout-law · hero math · section rhythm" },
  { kind: "hit" as const, text: "03  copy-strategy · CTA bank · voice dial" },
  { kind: "blank" as const, text: "" },
  { kind: "out" as const, text: "## Acceptance" },
  {
    kind: "ok" as const,
    text: "Package status: ACCEPTED for export · executionAuthorized: false",
  },
  {
    kind: "meta" as const,
    text: "attach COOK.md + PromptForge body → agent handoff ready",
  },
];

type Line = (typeof COOK_STREAM)[number];

function prefixFor(line: Line): string {
  if (line.kind === "meta") return "›";
  if (line.kind === "hit") return "·";
  if (line.kind === "ok") return "✓";
  if (line.kind === "blank") return " ";
  return " ";
}

function lineClass(line: Line): string {
  if (line.kind === "meta") return "text-accent";
  if (line.kind === "hit") return "text-primary";
  if (line.kind === "ok") return "text-success";
  if (line.kind === "blank") return "opacity-0";
  return "text-base-content/85";
}

/**
 * Live-feeling COOK.md stream for the landing hero.
 * Loops forever; reduced-motion shows the finished buffer.
 */
export function CookTerminal({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reduce ? COOK_STREAM.length : 0);
  const [cursorOn, setCursorOn] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const full = useMemo(() => COOK_STREAM, []);

  useEffect(() => {
    if (reduce) {
      setVisible(full.length);
      return;
    }
    setVisible(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i > full.length + 6) {
        i = 0;
        setVisible(0);
        return;
      }
      setVisible(Math.min(i, full.length));
    }, 420);
    return () => window.clearInterval(id);
  }, [reduce, full.length]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setCursorOn((v) => !v), 530);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visible]);

  const lines = full.slice(0, visible);

  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-box border border-white/15 bg-base-100/80 text-base-content shadow-2xl shadow-black/35 backdrop-blur-sm",
        className,
      )}
      aria-label="COOK.md composing live"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-error/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-warning/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-success/80" aria-hidden />
        <span className="ml-3 font-mono text-[11px] tracking-wide text-base-content/55">
          COOK.md · SkillForge brain
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-primary">
          <span
            className={clsx(
              "inline-block size-1.5 rounded-full bg-primary",
              !reduce && "animate-pulse",
            )}
            aria-hidden
          />
          streaming
        </span>
      </div>

      <div
        ref={scroller}
        className="mockup-code max-h-[min(42vh,360px)] overflow-y-auto rounded-none border-0 bg-transparent text-left shadow-none before:hidden"
      >
        {lines.map((line, idx) => (
          <pre
            key={`${idx}-${line.text.slice(0, 24)}`}
            data-prefix={prefixFor(line)}
            className={clsx(
              "px-0 text-[12px] leading-[1.65] md:text-[12.5px]",
              lineClass(line),
            )}
          >
            <code>{line.text || " "}</code>
          </pre>
        ))}
        {!reduce && visible < full.length ? (
          <pre data-prefix=" " className="px-0 text-[12px] text-primary" aria-hidden>
            <code>{cursorOn ? "█" : " "}</code>
          </pre>
        ) : null}
      </div>
    </div>
  );
}
