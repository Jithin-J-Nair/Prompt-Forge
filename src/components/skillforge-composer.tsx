"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Download,
  LoaderCircle,
  LockKeyhole,
  Network,
  Save,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { PROJECT_CATEGORIES } from "@/lib/skillforge/categories";
import type { CompositionPreview } from "@/lib/skillforge/types";

const STORAGE_KEY = "skillforge.saved-packages.v1";

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
    typeof value.categoryKey === "string" &&
    (value.previewStatus === "draft" || value.previewStatus === "accepted") &&
    typeof value.accepted === "boolean" &&
    value.executionReady === false &&
    typeof value.templateSetVersion === "string" &&
    typeof value.rubricVersion === "string" &&
    typeof value.exportMarkdown === "string" &&
    isRecord(value.graph) &&
    Array.isArray(value.graph.nodes) &&
    Array.isArray(value.artifactPreviews) &&
    isRecord(value.council) &&
    Array.isArray(value.council.assessments)
  );
}

type SavedPackage = {
  id: string;
  savedAt: string;
  title: string;
  categoryKey: string;
  accepted: boolean;
  preview: CompositionPreview;
};

const EMPTY_SAVED: SavedPackage[] = [];

function loadSaved(): SavedPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SAVED;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPackage[]) : EMPTY_SAVED;
  } catch {
    return EMPTY_SAVED;
  }
}

let savedCacheRaw: string | null | undefined;
let savedCache: SavedPackage[] = EMPTY_SAVED;

function readSavedSnapshot(): SavedPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === savedCacheRaw) return savedCache;
    savedCacheRaw = raw;
    savedCache = loadSaved();
    return savedCache;
  } catch {
    return EMPTY_SAVED;
  }
}

function subscribeSaved(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("skillforge-saved", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("skillforge-saved", onStoreChange);
  };
}

function writeSaved(next: SavedPackage[]) {
  const raw = JSON.stringify(next);
  localStorage.setItem(STORAGE_KEY, raw);
  savedCacheRaw = raw;
  savedCache = next;
  window.dispatchEvent(new Event("skillforge-saved"));
}

export function SkillForgeComposer() {
  const [brief, setBrief] = useState("Build an enterprise AI recruiting platform");
  const [categoryKey, setCategoryKey] = useState<string>("ai-product");
  const [preview, setPreview] = useState<CompositionPreview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const resultsRef = useRef<HTMLElement | null>(null);
  const saved = useSyncExternalStore(subscribeSaved, readSavedSnapshot, () => EMPTY_SAVED);

  async function compose() {
    if (busy) return;
    const trimmed = brief.trim();
    if (trimmed.length < 3 || brief.length > 400) {
      setError("Project intent must be 3–400 characters.");
      return;
    }

    setError("");
    setNotice("");
    setBusy(true);

    try {
      const response = await fetch("/api/skillforge/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryKey, brief: trimmed }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(result) ?? "Composition failed.");
        return;
      }
      if (!isCompositionPreview(result)) {
        setError("Unexpected composition response.");
        return;
      }
      setPreview(result);
      setNotice(
        result.accepted
          ? "Package accepted — review the skill graph, DNA, and artifacts below."
          : "Draft composed — council blocked export until findings are resolved.",
      );
      queueMicrotask(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("Could not reach SkillForge. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function downloadExport() {
    if (!preview) return;
    const blob = new Blob([preview.exportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `skillforge-${preview.categoryKey}-${preview.accepted ? "accepted" : "draft"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Exported Markdown package downloaded.");
  }

  function saveLocally() {
    if (!preview) return;
    const entry: SavedPackage = {
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
      title: preview.brief.slice(0, 80),
      categoryKey: preview.categoryKey,
      accepted: preview.accepted,
      preview,
    };
    const next = [entry, ...loadSaved()].slice(0, 20);
    writeSaved(next);
    setNotice("Saved in this browser.");
  }

  const canCompose = !busy && brief.trim().length >= 3 && brief.length <= 400;

  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-flare uppercase">
        <span className="size-1.5 rounded-full bg-ember" aria-hidden />
        SkillForge · ready compose
      </p>
      <h1 className="max-w-4xl font-display text-4xl leading-[0.98] font-bold tracking-tight text-ivory md:text-5xl">
        Compose <span className="text-gradient-ember">expertise</span> packages.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-fog md:text-base">
        Pick a category, describe the intent, and SkillForge builds a skill graph, Project DNA,
        eleven blueprints, and a Review Council gate. Accepted packages are exportable instructions —
        never executable permissions.
      </p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void compose();
        }}
        className="relative z-20 mt-6 rounded-2xl border border-line bg-carbon/75 p-5 backdrop-blur md:p-6"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="skillforge-category"
              className="mb-2 block font-mono text-xs tracking-[0.14em] text-fog uppercase"
            >
              Project category
            </label>
            <select
              id="skillforge-category"
              value={categoryKey}
              onChange={(event) => setCategoryKey(event.target.value)}
              className="w-full rounded-lg border border-line bg-ink px-4 py-3 text-ivory"
            >
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
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
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  void compose();
                }
              }}
              minLength={3}
              maxLength={400}
              required
              rows={3}
              placeholder="Build an enterprise AI recruiting platform..."
              className="w-full resize-y rounded-lg border border-line bg-ink px-4 py-3 leading-6 text-ivory outline-none transition-colors placeholder:text-smoke focus:border-ember"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-smoke">
              <span>3–400 characters · Ctrl+Enter to compose</span>
              <span>{brief.length}/400</span>
            </div>
          </div>
          <div className="relative z-20 space-y-3 border-t border-line pt-4">
            <p className="inline-flex items-center gap-2 text-xs text-fog">
              <LockKeyhole className="pointer-events-none size-3.5 text-flare" aria-hidden />
              Deterministic compose · no external model call
            </p>
            <button
              type="submit"
              data-testid="skillforge-compose"
              aria-busy={busy}
              disabled={!canCompose}
              className="relative z-20 flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-6 py-4 font-mono text-xs font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-flare disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  Composing{" "}
                  <LoaderCircle className="pointer-events-none size-4 animate-spin" aria-hidden />
                </>
              ) : (
                <>
                  Compose package{" "}
                  <ArrowRight className="pointer-events-none size-4" aria-hidden />
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
      {notice && (
        <p className="mt-5 rounded-lg border border-flare/30 bg-flare/10 p-4 text-sm text-ivory">{notice}</p>
      )}

      {preview && (
        <section ref={resultsRef} aria-live="polite" className="mt-10 space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-flare/30 bg-flare/5 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.14em] text-flare uppercase">
                {preview.accepted ? "Accepted for export" : "Draft · council blocked"} ·{" "}
                {preview.categoryLabel}
              </p>
              <p className="mt-2 text-sm text-ivory">
                {preview.graph.nodes.length} skills · {preview.artifactPreviews.length} artifacts ·
                council {preview.reviewStatus} (mean {preview.council.overallMean}/100) · revision{" "}
                {preview.council.revisionRound}/{preview.council.maxRevisionRounds}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveLocally}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ivory uppercase"
              >
                <Save className="size-3.5" aria-hidden /> Save
              </button>
              <button
                type="button"
                onClick={downloadExport}
                className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-ink uppercase"
              >
                <Download className="size-3.5" aria-hidden /> Export MD
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-xl border border-line bg-carbon/70 p-5 md:p-7">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ivory">
                <Network className="size-5 text-ember" aria-hidden />
                Skill graph
              </h2>
              <ol className="mt-5 space-y-3">
                {preview.graph.nodes.map((node) => (
                  <li key={node.nodeKey} className="rounded-lg border border-line bg-ink/70 p-4">
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
            </section>

            <section className="rounded-xl border border-line bg-carbon/70 p-5 md:p-7">
              <h2 className="font-display text-2xl font-bold text-ivory">Project DNA</h2>
              <ul className="mt-5 grid grid-cols-1 gap-2">
                {preview.projectDna.fields.map((field) => (
                  <li
                    key={field.name}
                    className="rounded-md border border-line px-3 py-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-ivory">{field.name}</span>
                      <span
                        className={
                          field.status === "confirmed"
                            ? "text-flare"
                            : field.status === "inferred"
                              ? "text-ember"
                              : "text-smoke"
                        }
                      >
                        {field.status}
                      </span>
                    </div>
                    {field.value && (
                      <p className="mt-1 text-[11px] leading-5 text-fog">{field.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div
            className={`rounded-xl border p-5 md:p-7 ${
              preview.accepted
                ? "border-flare/30 bg-flare/[0.06]"
                : "border-blood/25 bg-blood/[0.04]"
            }`}
          >
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ivory">
              {preview.accepted ? (
                <ShieldCheck className="size-5 text-flare" aria-hidden />
              ) : (
                <ShieldAlert className="size-5 text-flare" aria-hidden />
              )}
              Review Council · {preview.reviewStatus}
            </h2>
            <p className="mt-2 text-sm leading-6 text-fog">{preview.council.gateReason}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {preview.council.assessments.map((assessment) => (
                <li
                  key={assessment.reviewer}
                  className="rounded-md border border-line bg-ink/50 px-3 py-2 text-xs text-ivory"
                >
                  <span className="font-semibold">{assessment.reviewer}</span>
                  <span className="float-right font-mono text-flare">{assessment.score}/100</span>
                </li>
              ))}
            </ul>
            {preview.council.unresolvedFindings.length > 0 && (
              <ul className="mt-5 space-y-2 text-xs leading-5 text-fog">
                {preview.council.unresolvedFindings.slice(0, 6).map((finding) => (
                  <li key={`${finding.severity}-${finding.summary}`}>
                    <span className="font-mono text-flare uppercase">{finding.severity}</span>{" "}
                    {finding.summary}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-5 space-y-1 text-xs text-fog">
              {preview.council.nextActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-ivory">Package artifacts</h2>
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

      {saved.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-ivory">Saved in this browser</h2>
          <ul className="mt-4 space-y-2">
            {saved.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full rounded-lg border border-line bg-carbon/60 px-4 py-3 text-left text-sm text-ivory"
                  onClick={() => setPreview(item.preview)}
                >
                  <span className="font-mono text-[10px] text-flare uppercase">
                    {item.categoryKey} · {item.accepted ? "accepted" : "draft"}
                  </span>
                  <span className="mt-1 block">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
