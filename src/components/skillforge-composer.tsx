"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CloudUpload,
  Download,
  LockKeyhole,
  Network,
  Package,
  Save,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  isPromptForgeBridgePayload,
  PROMPTFORGE_BRIDGE_STORAGE_KEY,
  type PromptForgeBridgePayload,
} from "@/lib/promptforge/orchestrator-prompt";
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

type ServerPackageSummary = {
  id: number;
  title: string;
  brief: string;
  categoryKey: string;
  categoryLabel: string;
  accepted: boolean;
  previewStatus: string;
  createdAt: string;
};

export function SkillForgeComposer() {
  const router = useRouter();
  const params = useSearchParams();
  const initialBrief = params.get("q")?.trim() || "Build an enterprise AI recruiting platform";
  const initialCategory = params.get("category")?.trim() || "ai-product";
  const [brief, setBrief] = useState(initialBrief);
  const [categoryKey, setCategoryKey] = useState<string>(
    PROJECT_CATEGORIES.some((c) => c.key === initialCategory) ? initialCategory : "ai-product",
  );
  const [preview, setPreview] = useState<CompositionPreview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [serverPackages, setServerPackages] = useState<ServerPackageSummary[]>([]);
  const [savingServer, setSavingServer] = useState(false);
  const [bridge, setBridge] = useState<PromptForgeBridgePayload | null>(null);
  const [handoffBusy, setHandoffBusy] = useState(false);
  const resultsRef = useRef<HTMLElement | null>(null);
  const autoRan = useRef(false);
  const saved = useSyncExternalStore(subscribeSaved, readSavedSnapshot, () => EMPTY_SAVED);

  async function refreshServerPackages() {
    try {
      const response = await fetch("/api/skillforge/packages?limit=12");
      if (!response.ok) return;
      const data: unknown = await response.json();
      if (isRecord(data) && Array.isArray(data.packages)) {
        setServerPackages(data.packages as ServerPackageSummary[]);
      }
    } catch {
      /* persistence optional */
    }
  }

  useEffect(() => {
    void refreshServerPackages();
  }, []);

  useEffect(() => {
    const q = params.get("q")?.trim();
    if (!q || q.length < 3 || autoRan.current) return;
    autoRan.current = true;
    setBrief(q);
    void compose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot from ?q=
  }, [params]);

  async function compose(overrideBrief?: string) {
    if (busy) return;
    const source = overrideBrief ?? brief;
    const trimmed = source.trim();
    if (trimmed.length < 3 || source.length > 400) {
      setError("Project intent must be 3–400 characters.");
      return;
    }

    setError("");
    setNotice("");
    setBridge(null);
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

  function downloadBlob(filename: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadExport() {
    if (!preview) return;
    downloadBlob(
      `skillforge-${preview.categoryKey}-${preview.accepted ? "accepted" : "draft"}.md`,
      preview.exportMarkdown,
      "text/markdown;charset=utf-8",
    );
    setNotice("Exported Markdown package downloaded.");
  }

  async function requestHandoffPack(options?: {
    downloadFiles?: boolean;
  }): Promise<PromptForgeBridgePayload | null> {
    if (!preview) return null;
    const downloadFiles = options?.downloadFiles ?? true;
    setHandoffBusy(true);
    setError("");
    try {
      const response = await fetch("/api/skillforge/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !isRecord(data) || typeof data.markdown !== "string") {
        setError(getErrorMessage(data) ?? "Could not build agent handoff.");
        return null;
      }

      const nextBridge = isPromptForgeBridgePayload(data.bridge) ? data.bridge : null;
      if (nextBridge) {
        setBridge(nextBridge);
        sessionStorage.setItem(PROMPTFORGE_BRIDGE_STORAGE_KEY, JSON.stringify(nextBridge));
      }

      if (downloadFiles) {
        downloadBlob(
          `skillforge-handoff-${preview.categoryKey}.md`,
          data.markdown,
          "text/markdown;charset=utf-8",
        );
        if (typeof data.cookPrompt === "string" && data.cookPrompt.length > 0) {
          downloadBlob(
            `skillforge-COOK-${preview.categoryKey}.md`,
            data.cookPrompt,
            "text/markdown;charset=utf-8",
          );
        }
        if (isRecord(data.manifest)) {
          downloadBlob(
            `skillforge-handoff-${preview.categoryKey}.json`,
            JSON.stringify(data.manifest, null, 2),
            "application/json",
          );
        }
        setNotice(
          "COOK.md brain downloaded. Next → PromptForge for the BODY prompt (phases + skill links).",
        );
      }

      return nextBridge;
    } catch {
      setError("Could not build agent handoff.");
      return null;
    } finally {
      setHandoffBusy(false);
    }
  }

  async function downloadHandoff() {
    await requestHandoffPack({ downloadFiles: true });
  }

  async function goToPromptForge() {
    const ready = bridge ?? (await requestHandoffPack({ downloadFiles: !bridge }));
    if (!ready) return;
    sessionStorage.setItem(PROMPTFORGE_BRIDGE_STORAGE_KEY, JSON.stringify(ready));
    router.push("/promptforge");
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

  async function saveToServer() {
    if (!preview || savingServer) return;
    setSavingServer(true);
    setError("");
    try {
      const response = await fetch("/api/skillforge/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data) ?? "Server save failed. Browser save still works.");
        return;
      }
      setNotice(
        isRecord(data) && typeof data.id === "number"
          ? `Saved to server as package #${data.id}.`
          : "Saved to server.",
      );
      void refreshServerPackages();
    } catch {
      setError("Server save unavailable. Use browser save or export.");
    } finally {
      setSavingServer(false);
    }
  }

  async function loadServerPackage(id: number) {
    setError("");
    try {
      const response = await fetch(`/api/skillforge/packages/${id}`);
      const data: unknown = await response.json();
      if (!response.ok || !isRecord(data) || !isCompositionPreview(data.preview)) {
        setError(getErrorMessage(data) ?? "Could not load package.");
        return;
      }
      setPreview(data.preview);
      setBrief(data.preview.brief);
      setCategoryKey(data.preview.categoryKey);
      setNotice(`Loaded server package #${id}.`);
      queueMicrotask(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("Could not load package.");
    }
  }

  const canCompose = !busy && brief.trim().length >= 3 && brief.length <= 400;

  return (
    <div>
      <span className="badge badge-soft badge-primary mb-4">SkillForge · compose</span>
      <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
        Compose expertise packages.
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-base-content/70">
        Pick a category, describe the intent, and SkillForge builds a skill graph, Project DNA,
        blueprints, and a Review Council gate. Download COOK.md, then continue to PromptForge for
        the body prompt.
      </p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void compose();
        }}
        className="relative z-20 mt-8 rounded-box border border-base-300 bg-base-100 p-5 md:p-6"
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Project category</legend>
          <select
            id="skillforge-category"
            value={categoryKey}
            onChange={(event) => setCategoryKey(event.target.value)}
            className="select w-full"
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset mt-2">
          <legend className="fieldset-legend">Project intent</legend>
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
            className="textarea w-full"
          />
          <p className="label justify-between">
            <span>3–400 characters · Ctrl+Enter to compose</span>
            <span>{brief.length}/400</span>
          </p>
        </fieldset>

        <div className="mt-4 flex flex-col gap-3 border-t border-base-300 pt-4">
          <p className="inline-flex items-center gap-2 text-sm text-base-content/70">
            <LockKeyhole className="size-3.5 text-primary" aria-hidden />
            Deterministic compose · no external model call
          </p>
          <button
            type="submit"
            data-testid="skillforge-compose"
            aria-busy={busy}
            disabled={!canCompose}
            className="btn btn-primary btn-block"
          >
            {busy ? (
              <>
                Composing <span className="loading loading-spinner loading-sm" />
              </>
            ) : (
              <>
                Compose package <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div role="alert" className="alert alert-error mt-5">
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div role="status" className="alert alert-success alert-soft mt-5">
          <span>{notice}</span>
        </div>
      )}

      {preview && (
        <section ref={resultsRef} aria-live="polite" className="mt-10 space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-box border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs text-primary">
                {preview.accepted ? "Accepted for export" : "Draft · council blocked"} ·{" "}
                {preview.categoryLabel}
              </p>
              <p className="mt-2 text-sm text-base-content/75">
                {preview.graph.nodes.length} skills · {preview.artifactPreviews.length} artifacts ·
                council {preview.reviewStatus} (mean {preview.council.overallMean}/100) · revision{" "}
                {preview.council.revisionRound}/{preview.council.maxRevisionRounds}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={saveLocally} className="btn btn-outline btn-sm gap-2">
                <Save className="size-3.5" aria-hidden /> Browser
              </button>
              <button
                type="button"
                disabled={savingServer}
                onClick={() => void saveToServer()}
                className="btn btn-outline btn-sm gap-2"
              >
                <CloudUpload className="size-3.5" aria-hidden />{" "}
                {savingServer ? "Saving…" : "Server"}
              </button>
              <button type="button" onClick={downloadExport} className="btn btn-outline btn-sm gap-2">
                <Download className="size-3.5" aria-hidden /> Export MD
              </button>
              <button
                type="button"
                disabled={handoffBusy}
                onClick={() => void downloadHandoff()}
                className="btn btn-primary btn-sm gap-2"
              >
                <Package className="size-3.5" aria-hidden />{" "}
                {handoffBusy ? "Building…" : "Download COOK"}
              </button>
              <button
                type="button"
                disabled={handoffBusy}
                data-testid="skillforge-next-promptforge"
                onClick={() => void goToPromptForge()}
                className="btn btn-secondary btn-sm gap-2"
              >
                Next: PromptForge <ArrowRight className="size-3.5" aria-hidden />
              </button>
            </div>
          </div>

          {bridge && (
            <div className="alert alert-info">
              <div>
                <p className="font-semibold">COOK brain ready ({bridge.cookFilename})</p>
                <p className="text-sm">
                  Continue to PromptForge to copy the body prompt — attach COOK as the brain and
                  paste the body as the build protocol.
                </p>
                <button
                  type="button"
                  onClick={() => void goToPromptForge()}
                  className="btn btn-primary btn-sm mt-3"
                >
                  Next → PromptForge body
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-7">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                <Network className="size-5 text-primary" aria-hidden />
                Skill graph
              </h2>
              <ul className="list mt-5">
                {preview.graph.nodes.map((node) => (
                  <li key={node.nodeKey} className="list-row items-start border-t border-base-300 py-4">
                    <div className="list-col-grow">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-semibold">{node.name}</h3>
                        <span className="badge badge-ghost badge-sm">
                          {node.priority} · Tier {node.tier}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-base-content/70">
                        {node.rationale}
                      </p>
                      <p className="mt-2 font-mono text-[10px] opacity-55">
                        Scope: {node.assignedScope.join(" · ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-7">
              <h2 className="font-display text-2xl font-bold">Project DNA</h2>
              <ul className="mt-5 space-y-2">
                {preview.projectDna.fields.map((field) => (
                  <li key={field.name} className="rounded-field border border-base-300 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{field.name}</span>
                      <span
                        className={
                          field.status === "confirmed"
                            ? "badge badge-success badge-sm"
                            : field.status === "inferred"
                              ? "badge badge-warning badge-sm"
                              : "badge badge-ghost badge-sm"
                        }
                      >
                        {field.status}
                      </span>
                    </div>
                    {field.value && (
                      <p className="mt-1 text-xs leading-5 text-base-content/65">{field.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div
            className={`rounded-box border p-5 md:p-7 ${
              preview.accepted
                ? "border-success/40 bg-success/5"
                : "border-warning/40 bg-warning/5"
            }`}
          >
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              {preview.accepted ? (
                <ShieldCheck className="size-5 text-success" aria-hidden />
              ) : (
                <ShieldAlert className="size-5 text-warning" aria-hidden />
              )}
              Review Council · {preview.reviewStatus}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              {preview.council.gateReason}
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {preview.council.assessments.map((assessment) => (
                <li
                  key={assessment.reviewer}
                  className="rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm"
                >
                  <span className="font-semibold">{assessment.reviewer}</span>
                  <span className="float-right font-mono text-primary">{assessment.score}/100</span>
                </li>
              ))}
            </ul>
            {preview.council.unresolvedFindings.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-base-content/70">
                {preview.council.unresolvedFindings.slice(0, 6).map((finding) => (
                  <li key={`${finding.severity}-${finding.summary}`}>
                    <span className="badge badge-warning badge-sm mr-2">{finding.severity}</span>
                    {finding.summary}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-5 space-y-1 text-sm text-base-content/70">
              {preview.council.nextActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold">Package artifacts</h2>
            {preview.artifactPreviews.map((artifact) => (
              <div key={artifact.logicalKey} className="collapse collapse-arrow border border-base-300 bg-base-100">
                <input type="checkbox" />
                <div className="collapse-title font-mono text-sm font-medium">
                  {artifact.logicalKey}
                </div>
                <div className="collapse-content">
                  <pre className="overflow-x-auto font-mono text-xs leading-5 whitespace-pre-wrap text-base-content/70">
                    {artifact.content}
                  </pre>
                </div>
              </div>
            ))}
          </section>
        </section>
      )}

      {serverPackages.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">Saved on server</h2>
          <ul className="mt-4 space-y-2">
            {serverPackages.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="btn btn-ghost h-auto w-full justify-start rounded-box border border-base-300 px-4 py-3 text-left"
                  onClick={() => void loadServerPackage(item.id)}
                >
                  <span className="block w-full">
                    <span className="font-mono text-[10px] text-primary">
                      #{item.id} · {item.categoryKey} · {item.accepted ? "accepted" : "draft"}
                    </span>
                    <span className="mt-1 block text-sm">{item.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {saved.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">Saved in this browser</h2>
          <ul className="mt-4 space-y-2">
            {saved.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="btn btn-ghost h-auto w-full justify-start rounded-box border border-base-300 px-4 py-3 text-left"
                  onClick={() => setPreview(item.preview)}
                >
                  <span className="block w-full">
                    <span className="font-mono text-[10px] text-primary">
                      {item.categoryKey} · {item.accepted ? "accepted" : "draft"}
                    </span>
                    <span className="mt-1 block text-sm">{item.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
