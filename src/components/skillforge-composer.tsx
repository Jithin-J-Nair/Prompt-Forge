"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Network, ShieldAlert } from "lucide-react";
import type { CompositionPreview } from "@/lib/skillforge/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(value: unknown): string | undefined {
  if (!isRecord(value) || !isRecord(value.error)) return undefined;
  return typeof value.error.message === "string" ? value.error.message : undefined;
}

function isCompositionPreview(value: unknown): value is CompositionPreview {
  return (
    isRecord(value) &&
    value.categoryKey === "ai-product" &&
    value.previewStatus === "draft" &&
    value.accepted === false &&
    value.executionReady === false &&
    typeof value.templateSetVersion === "string" &&
    isRecord(value.graph) &&
    Array.isArray(value.graph.nodes) &&
    Array.isArray(value.artifactPreviews) &&
    Array.isArray(value.missingArtifacts)
  );
}

export function SkillForgeComposer() {
  const [brief, setBrief] = useState("");
  const [preview, setPreview] = useState<CompositionPreview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPreview(null);
    setBusy(true);

    try {
      const response = await fetch("/api/skillforge/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryKey: "ai-product", brief }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(result) ?? "The composition preview could not be created.");
        return;
      }
      if (!isCompositionPreview(result)) {
        setError("The preview service returned an unexpected response.");
        return;
      }
      setPreview(result);
    } catch {
      setError("The preview service could not be reached. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-flare uppercase">
        <span className="size-1.5 rounded-full bg-ember" aria-hidden />
        First vertical slice · AI Product
      </p>
      <h1 className="max-w-4xl font-display text-5xl leading-[0.98] font-bold tracking-tight text-ivory md:text-7xl">
        Compose the <span className="text-gradient-ember">expertise</span> first.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-fog md:text-lg">
        Turn an AI Product brief into a deterministic Tier 1 skill graph and a full draft
        blueprint package. This slice deliberately stops before review, persistence, or agent
        execution.
      </p>

      <form
        onSubmit={submit}
        className="mt-10 rounded-2xl border border-line bg-carbon/75 p-5 backdrop-blur md:p-8"
      >
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="skillforge-category"
              className="mb-2 block font-mono text-xs tracking-[0.14em] text-fog uppercase"
            >
              Project category
            </label>
            <select
              id="skillforge-category"
              value="ai-product"
              disabled
              className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-ivory opacity-80"
            >
              <option value="ai-product">AI Product — pilot catalog</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="skillforge-brief"
              className="mb-2 block font-mono text-xs tracking-[0.14em] text-fog uppercase"
            >
              Project intent
            </label>
            <textarea
              id="skillforge-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              minLength={3}
              maxLength={400}
              required
              rows={4}
              placeholder="Build an enterprise AI recruiting platform..."
              className="w-full resize-y rounded-lg border border-line bg-ink px-4 py-3 leading-6 text-ivory outline-none transition-colors placeholder:text-smoke focus:border-ember"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-smoke">
              <span>3–400 characters</span>
              <span>{brief.length}/400</span>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
            <p className="inline-flex items-center gap-2 text-xs text-fog">
              <LockKeyhole className="size-3.5 text-flare" aria-hidden />
              Not saved or sent to an external model.
            </p>
            <button
              type="submit"
              disabled={busy || brief.trim().length < 3 || brief.length > 400}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 font-mono text-xs font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-flare disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  Composing <LoaderCircle className="size-4 animate-spin" aria-hidden />
                </>
              ) : (
                <>
                  Compose preview <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-5 rounded-lg border border-blood/30 bg-blood/10 p-4 text-sm text-ivory">
          {error}
        </p>
      )}

      {preview && (
        <section aria-live="polite" className="mt-10 space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-flare/30 bg-flare/5 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.14em] text-flare uppercase">
                Draft preview · not accepted
              </p>
              <p className="mt-2 text-sm text-ivory">
                {preview.graph.nodes.length} core skills selected ·{" "}
                {preview.artifactPreviews.length} draft artifacts · review not started
              </p>
            </div>
            <p className="break-all font-mono text-[10px] text-fog">
              Graph SHA-256: {preview.graphHash}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-xl border border-line bg-carbon/70 p-5 md:p-7">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ivory">
                <Network className="size-5 text-ember" aria-hidden />
                Skill graph
              </h2>
              <ol className="mt-5 space-y-3">
                {preview.graph.nodes.map((node) => (
                  <li
                    key={node.nodeKey}
                    className="rounded-lg border border-line bg-ink/70 p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-ivory">{node.name}</h3>
                      <span className="font-mono text-[10px] text-flare">
                        {node.priority} · Tier {node.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-fog">{node.rationale}</p>
                    <p className="mt-2 font-mono text-[10px] text-smoke">
                      Scope: {node.assignedScope.join(" · ")}
                    </p>
                  </li>
                ))}
              </ol>
              <h3 className="mt-6 font-mono text-[11px] tracking-[0.12em] text-fog uppercase">
                Dependencies
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-fog">
                {preview.graph.edges.map((edge) => (
                  <li key={`${edge.from}-${edge.to}`}>
                    {edge.from} → {edge.to}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-line bg-carbon/70 p-5 md:p-7">
              <h2 className="font-display text-2xl font-bold text-ivory">Project DNA status</h2>
              <p className="mt-2 text-sm leading-6 text-fog">
                Only Vision is sourced from your brief. The remaining fields stay unknown rather
                than being guessed.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {preview.projectDna.fields.map((field) => (
                  <li
                    key={field.name}
                    className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2 text-xs"
                  >
                    <span className="text-ivory">{field.name}</span>
                    <span className={field.status === "confirmed" ? "text-flare" : "text-smoke"}>
                      {field.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="rounded-xl border border-blood/25 bg-blood/[0.04] p-5 md:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ivory">
              <ShieldAlert className="size-5 text-flare" aria-hidden />
              Stage gate: not ready for execution
            </h2>
            <p className="mt-2 text-sm leading-6 text-fog">
              All eleven canonical artifacts are drafted from versioned templates, but unknown
              Project DNA fields stay unknown. The Review Council has not run, so the package
              remains unaccepted and non-executable.
            </p>
            <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-fog uppercase">
              Template set: {preview.templateSetVersion}
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-smoke uppercase">
              Required reviewers: {preview.requiredReviewers.join(" · ")}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-ivory">Draft artifacts</h2>
            {preview.artifactPreviews.map((artifact) => (
              <details key={artifact.logicalKey} className="group rounded-xl border border-line bg-carbon/70">
                <summary className="cursor-pointer list-none p-4 font-mono text-xs text-ivory marker:hidden">
                  {artifact.logicalKey}
                  <span className="float-right text-flare group-open:rotate-90">›</span>
                </summary>
                <pre className="overflow-x-auto border-t border-line p-4 font-mono text-xs leading-5 whitespace-pre-wrap text-fog">
                  {artifact.content}
                </pre>
              </details>
            ))}
          </section>
        </section>
      )}
    </div>
  );
}
