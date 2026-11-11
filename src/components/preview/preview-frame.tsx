"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Maximize2, Pause, Play } from "lucide-react";
import type { ParamValues, PreviewDefinition, PromptModule } from "@/lib/studio";
import { resolvePreview } from "@/lib/studio";
import { PREVIEW_COMPONENTS } from "./preview-registry";
import { useReducedMotion } from "@/components/labs/lab-shell";

/* ------------------------------------------------------------------ */
/*  PreviewFrame — shared mounting surface for EVERY module preview.    */
/*  - lazy mount (IntersectionObserver, 200px rootMargin)               */
/*  - animated:true runs continuously; false → hover/click to run       */
/*  - prefers-reduced-motion renders one still pass                     */
/*  - approximationNotes are surfaced honestly                          */
/* ------------------------------------------------------------------ */

export function PreviewFrame({
  module,
  params,
  mode = "card",
  onExpand,
  className,
}: {
  module: PromptModule;
  /** resolved params — the SAME object the compiler consumes */
  params: ParamValues;
  /** card = small tile, hover-activates heavy renderers; detail = large, always live */
  mode?: "card" | "detail";
  onExpand?: () => void;
  className?: string;
}) {
  const def: PreviewDefinition | null = resolvePreview(module);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(mode === "detail");
  const [hover, setHover] = useState(false);
  const [forced, setForced] = useState<boolean | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (mode === "detail") return;
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && setNear(true),
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const explicit = forced !== null ? forced : true;
  const animateNow = mode === "detail"
    ? explicit
    : near && explicit && (module.perf === "light" || hover);

  return (
    <div
      ref={hostRef}
      className={clsx("group/pv relative overflow-hidden bg-ink", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {def && near ? (
        <PreviewByKey
          def={def}
          params={params}
          animate={animateNow && !false}
          still={reduced}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-smoke/60">
            {mode === "detail" ? "no preview" : "…"}
          </span>
        </div>
      )}

      {/* hover affordances */}
      <div className="pointer-events-none absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity duration-200 group-hover/pv:opacity-100">
        {onExpand && (
          <button
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            className="pointer-events-auto grid size-6 place-items-center rounded border border-line bg-ink/80 text-fog hover:border-ember hover:text-ember"
            aria-label={`Expand ${module.name} preview`}
          >
            <Maximize2 className="size-3" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setForced(animateNow ? false : true); }}
          className="pointer-events-auto grid size-6 place-items-center rounded border border-line bg-ink/80 text-fog hover:border-ember hover:text-ember"
          aria-label={animateNow ? `Pause ${module.name} preview` : `Play ${module.name} preview`}
          aria-pressed={!animateNow}
        >
          {animateNow ? <Pause className="size-3" /> : <Play className="size-3" />}
        </button>
      </div>

      {def?.approximationNote && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[8.5px] text-flare/80">
          approx.
        </span>
      )}
      {reduced && (
        <span className="absolute bottom-1.5 right-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[8.5px] text-smoke">
          still
        </span>
      )}
    </div>
  );
}

function PreviewByKey({
  def, params, animate, still,
}: {
  def: PreviewDefinition;
  params: ParamValues;
  animate: boolean;
  still: boolean;
}) {
  const entry = PREVIEW_COMPONENTS[def.componentKey];
  if (!entry) {
    return (
      <div className="absolute inset-0 grid place-items-center font-mono text-[9px] text-blood">
        unregistered: {def.componentKey}
      </div>
    );
  }
  const Cmp = entry;
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Cmp params={params} animate={animate} still={still} />
    </div>
  );
}

export function previewKindLabel(def: PreviewDefinition | null): string {
  if (!def) return "—";
  return { dom: "DOM", svg: "SVG", canvas2d: "Canvas", webgl: "WebGL", three: "3D" }[def.kind];
}
