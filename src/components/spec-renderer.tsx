"use client";

import { useState } from "react";
import {
  Check, Copy, Download, Terminal, Sparkles, Palette, Type, Grid3X3,
  LayoutGrid, Layers, PenLine, MousePointerClick, Cpu, Search, Database, Trophy,
} from "lucide-react";
import type { EnhancedSpec } from "@/lib/engine/enhancer";
import { Eyebrow } from "@/components/chrome";

/* ----------------------------- utilities ----------------------------- */

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        }
      }}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-line bg-carbon px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-ivory uppercase transition-all duration-200 hover:border-ember hover:text-ember"
      }
      aria-label={label}
    >
      {done ? <Check className="size-3.5 text-ember" /> : <Copy className="size-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}

function downloadMd(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ----------------------------- section shell ----------------------------- */

const SECTION_ICONS = {
  brand: Sparkles, system: Grid3X3, layout: LayoutGrid, pages: Layers,
  components: Layers, copy: PenLine, motion: MousePointerClick, tech: Cpu,
  seo: Search, backend: Database, mega: Terminal, palette: Palette, type: Type, done: Trophy,
};

function Section({
  index, title, icon, children, note,
}: {
  index: string; title: string; icon: keyof typeof SECTION_ICONS; children: React.ReactNode; note?: string;
}) {
  const Icon = SECTION_ICONS[icon];
  return (
    <section className="relative border-t border-line py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-14">
        <div className="flex flex-row items-start gap-4 md:flex-col md:gap-6">
          <span className="font-mono text-[11px] tracking-[0.2em] text-smoke uppercase">{index}</span>
          <div>
            <span className="mb-3 grid size-9 place-items-center rounded-md border border-line bg-carbon text-ember">
              <Icon className="size-4" strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight uppercase">{title}</h3>
            {note && <p className="mt-1 font-mono text-[11px] leading-relaxed text-smoke">{note}</p>}
          </div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/* ----------------------------- sub-blocks ----------------------------- */

function SwatchRow({ role, hex, note }: { role: string; hex: string; note: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        if (await copyText(hex)) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }
      }}
      className="group flex w-full items-center gap-4 border-b border-line py-3 text-left transition-colors last:border-none hover:bg-steel/40"
      title={`Copy ${hex}`}
    >
      <span
        className="size-10 shrink-0 rounded-md border border-line-bright transition-transform duration-200 group-hover:scale-105"
        style={{ background: hex }}
        aria-hidden
      />
      <span className="flex-1">
        <span className="block font-display text-sm font-bold tracking-wide uppercase">{role}</span>
        <span className="block text-xs text-fog">{note}</span>
      </span>
      <span className="font-mono text-xs text-fog transition-colors group-hover:text-ember">
        {copied ? "copied" : hex}
      </span>
    </button>
  );
}

function Chip({ children, ember = false }: { children: React.ReactNode; ember?: boolean }) {
  return (
    <span
      className={
        ember
          ? "inline-flex items-center rounded-full border border-ember/50 bg-ember/10 px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-ember uppercase"
          : "inline-flex items-center rounded-full border border-line bg-carbon px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-fog uppercase"
      }
    >
      {children}
    </span>
  );
}

function MonoRow({ text }: { text: string }) {
  return (
    <div className="border-b border-line py-2 font-mono text-[12.5px] leading-relaxed text-fog last:border-none">
      {text}
    </div>
  );
}

/* ----------------------------- main renderer ----------------------------- */

export function SpecRenderer({ spec, createdAt }: { spec: EnhancedSpec; createdAt?: string | Date }) {
  const forgedMeta = createdAt
    ? new Date(createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : null;

  return (
    <div className="relative">
      {/* ---------- header ---------- */}
      <header className="border-t border-line pt-14 pb-10 md:pt-20">
        <Eyebrow>Forged spec · confidence {(spec.confidence * 100).toFixed(0)}%</Eyebrow>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl leading-[1.02] font-bold tracking-tight uppercase md:text-6xl">
              {spec.brand.name}
              <span className="text-ember">.</span>
            </h2>
            <p className="font-serif-d mt-4 text-xl text-fog italic md:text-2xl">
              “{spec.brand.slogan}”
            </p>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-fog">
              <span className="text-smoke">Raw brief logged:</span> “{spec.rawPrompt}”
              {forgedMeta && <span className="text-smoke"> · {forgedMeta}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip ember>{spec.industry}</Chip>
            <Chip>{spec.stats.pages} pages</Chip>
            <Chip>{spec.stats.components} components</Chip>
            <Chip>{spec.stats.words.toLocaleString()} words</Chip>
          </div>
        </div>
      </header>

      {/* ---------- 01 brand ---------- */}
      <Section index="01" title="Brand Identity" icon="brand" note={`${spec.brand.paletteName} palette`}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Tone of voice</p>
              <div className="flex flex-wrap gap-2">
                {spec.brand.tone.map((t) => <Chip key={t} ember>{t}</Chip>)}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Mission</p>
              <p className="text-[15px] leading-relaxed text-ivory/90">{spec.brand.mission}</p>
            </div>
            <div className="rounded-lg border border-line bg-carbon p-4">
              <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-ember uppercase">Logo direction</p>
              <p className="text-[13.5px] leading-relaxed text-fog">{spec.brand.logo}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-line bg-carbon px-4 py-2">
              <p className="border-b border-line py-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">
                Palette — {spec.brand.paletteName} <span className="text-smoke">(tap swatch to copy)</span>
              </p>
              {spec.brand.palette.map((c) => (
                <SwatchRow key={c.role} role={c.role} hex={c.hex} note={c.note} />
              ))}
            </div>
            <div className="rounded-lg border border-line bg-carbon p-5">
              <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Typography</p>
              <p className="font-display text-4xl font-bold tracking-tight">
                Aa <span className="text-ember">Gg</span> <span className="text-fog">0123</span>
              </p>
              <p className="mt-1 text-sm text-fog italic">{spec.brand.typography.display} — display</p>
              <p className="mt-4 text-[15px] leading-relaxed text-fog">
                {spec.brand.typography.body} sets the reading voice at 16–18px with a 68ch measure.
              </p>
              <p className="mt-4 font-mono text-xs text-ember">
                {spec.brand.typography.mono} · mono for labels, numbers, prices
              </p>
              <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-smoke">{spec.brand.typography.note}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- 02 design system ---------- */}
      <Section index="02" title="Design System" icon="system" note="tokens are law">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-carbon p-5">
            <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Spacing scale (px)</p>
            <div className="flex flex-wrap items-end gap-3">
              {spec.designSystem.spacingScale.map((sp) => {
                const n = Number(sp);
                return (
                  <span key={sp} className="flex flex-col items-center gap-1.5">
                    <span
                      className="w-3 rounded-sm bg-ember/80"
                      style={{ height: Math.max(4, n * 0.8) }}
                      aria-hidden
                    />
                    <span className="font-mono text-[10px] text-fog">{sp}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-carbon p-5">
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Radius tokens</p>
            {spec.designSystem.radius.map((r) => (
              <MonoRow key={r.token} text={`${r.token} → ${r.value}`} />
            ))}
          </div>
          <div className="rounded-lg border border-line bg-carbon p-5">
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Elevation</p>
            {spec.designSystem.shadows.map((sh, i) => (
              <MonoRow key={i} text={sh} />
            ))}
          </div>
          <div className="rounded-lg border border-line bg-carbon p-5">
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Grid & containers</p>
            <MonoRow text={spec.designSystem.grid} />
            <MonoRow text={`Breakpoints — ${spec.designSystem.breakpoints.join(" · ")}`} />
            <MonoRow text={spec.designSystem.containers} />
          </div>
        </div>
      </Section>

      {/* ---------- 03 layout ---------- */}
      <Section index="03" title="Layout Law" icon="layout" note="ux architecture">
        <ol className="space-y-4">
          {spec.layoutSpec.map((l, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-mono text-xs text-ember">{String(i + 1).padStart(2, "0")}</span>
              <p className="flex-1 text-[14.5px] leading-relaxed text-ivory/90">{l}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------- 04 pages ---------- */}
      <Section index="04" title="Page Blueprints" icon="pages" note={`${spec.pages.length} routes`}>
        <div className="grid gap-4 md:grid-cols-2">
          {spec.pages.map((p, i) => (
            <article key={p.path} className="group rounded-lg border border-line bg-carbon p-5 transition-colors duration-300 hover:border-ember/50">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-smoke">{String(i + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10.5px] text-ember">{p.path}</span>
              </div>
              <h4 className="mt-3 font-display text-xl font-bold tracking-tight uppercase transition-colors group-hover:text-ember">
                {p.name}
              </h4>
              <p className="mt-1 text-[13px] text-fog italic">{p.purpose}</p>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {p.sections.map((sec, j) => (
                  <li key={j} className="flex gap-2.5 text-[12.5px] leading-relaxed text-fog">
                    <span className="text-smoke">{j + 1})</span>
                    {sec}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------- 05 components ---------- */}
      <Section index="05" title="Component Contracts" icon="components" note={`${spec.components.length} units`}>
        <div className="divide-y divide-line rounded-lg border border-line bg-carbon">
          {spec.components.map((c) => (
            <div key={c.name} className="grid gap-1 px-5 py-4 md:grid-cols-[200px_1fr] md:gap-6">
              <p className="font-mono text-[12.5px] font-medium text-ember">{c.name}</p>
              <p className="text-[13.5px] leading-relaxed text-fog">{c.spec}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- 06 copy ---------- */}
      <Section index="06" title="Copy Strategy" icon="copy" note="voice is a filter">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Voice dial</p>
              <div className="flex flex-wrap gap-2">
                {spec.copy.voice.map((v) => <Chip key={v} ember>{v}</Chip>)}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Headline options</p>
              <ul className="space-y-3">
                {spec.copy.headlines.map((h, i) => (
                  <li key={i} className="border-l-2 border-ember/60 pl-4 font-serif-d text-[17px] text-ivory/90 italic">
                    “{h}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">CTA labels</p>
              <div className="flex flex-wrap gap-2">
                {spec.copy.ctas.map((c) => (
                  <span key={c} className="inline-flex items-center rounded-full bg-ivory px-4 py-1.5 font-mono text-[11px] font-medium text-ink">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Microcopy bank</p>
              {spec.copy.microcopy.map((m, i) => (
                <MonoRow key={i} text={`“${m}”`} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- 07 motion ---------- */}
      <Section index="07" title="Motion Score" icon="motion" note="choreographed, not decorated">
        <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
          {spec.interactions.map((m, i) => (
            <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-fog">
              <span className="mt-2 inline-block size-1.5 shrink-0 bg-ember" aria-hidden />
              {m}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- 08 stack ---------- */}
      <Section index="08" title="Technical Stack" icon="tech" note="non-negotiable">
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line bg-carbon">
                {["Layer", "Choice", "Why"].map((h) => (
                  <th key={h} className="px-5 py-3 font-mono text-[11px] font-medium tracking-[0.18em] text-smoke uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-coal">
              {spec.techStack.map((t) => (
                <tr key={t.layer} className="transition-colors hover:bg-steel/40">
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ember">{t.layer}</td>
                  <td className="px-5 py-3.5 text-[13.5px] text-ivory/90">{t.choice}</td>
                  <td className="px-5 py-3.5 text-[13px] text-fog">{t.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------- 09 seo ---------- */}
      <Section index="09" title="SEO & Access" icon="seo" note="discoverable by humans & machines">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            {/* SERP preview */}
            <div className="rounded-lg border border-line bg-carbon p-5">
              <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">SERP preview</p>
              <div className="rounded-md bg-[#1f1f24] p-4">
                <p className="font-mono text-[11px] text-fog">promptforge.app › spec</p>
                <p className="mt-1 text-[17px] leading-snug text-[#8ab4f8]">{spec.seo.metaTitle}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-fog">{spec.seo.metaDescription}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {spec.seo.keywords.map((k) => <Chip key={k}>{k}</Chip>)}
              </div>
            </div>
            <div className="space-y-2">
              <MonoRow text={`OG — ${spec.seo.og}`} />
              <MonoRow text={`JSON-LD — ${spec.seo.jsonLd}`} />
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Accessibility — WCAG 2.2 AA</p>
            <ul className="space-y-2.5">
              {spec.seo.a11y.map((a, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-line bg-carbon px-4 py-3 text-[13px] leading-relaxed text-fog">
                  <Check className="mt-0.5 size-4 shrink-0 text-ember" strokeWidth={2.4} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- 10 backend ---------- */}
      <Section index="10" title="Backend & Data" icon="backend" note="postgres · drizzle · route handlers">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-carbon p-5 lg:col-span-3">
            <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Auth plan</p>
            <p className="text-[14px] leading-relaxed text-ivory/90">{spec.backend.auth}</p>
          </div>
          <div className="rounded-lg border border-line bg-carbon p-5">
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Tables ({spec.backend.tables.length})</p>
            {spec.backend.tables.map((t, i) => <MonoRow key={i} text={t} />)}
          </div>
          <div className="rounded-lg border border-line bg-carbon p-5 lg:col-span-2">
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">Endpoints ({spec.backend.endpoints.length})</p>
            {spec.backend.endpoints.map((e, i) => <MonoRow key={i} text={e} />)}
          </div>
        </div>
      </Section>

      {/* ---------- 11 mega prompt ---------- */}
      <Section index="11" title="Mega Prompt" icon="mega" note="hand this to any AI builder">
        <div className="overflow-hidden rounded-xl border border-line-bright bg-[#0a0a0d]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-carbon px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden>
                <i className="size-2.5 rounded-full bg-blood/70 not-italic" />
                <i className="size-2.5 rounded-full bg-flare/70 not-italic" />
                <i className="size-2.5 rounded-full bg-ember/70 not-italic" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-fog uppercase">
                {spec.brand.name.toLowerCase().replace(/\s+/g, "-")}.mega.md
              </span>
            </div>
            <div className="flex gap-2">
              <CopyButton text={spec.megaPrompt} label="Copy mega prompt" className="inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase transition-all duration-200 hover:bg-flare" />
              <button
                onClick={() => downloadMd(`${spec.brand.name.toLowerCase().replace(/\s+/g, "-")}.mega.md`, spec.megaPrompt)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-carbon px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-ivory uppercase transition-all duration-200 hover:border-ember hover:text-ember"
                aria-label="Download markdown"
              >
                <Download className="size-3.5" />
                .md
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line px-5 py-2.5 font-mono text-[10.5px] tracking-[0.14em] text-smoke uppercase">
            <span>{spec.stats.words.toLocaleString()} words</span>
            <span>{spec.stats.chars.toLocaleString()} chars</span>
            <span>12 sections</span>
            <span>ready for v0 · bolt · cursor · lovable · humans</span>
          </div>
          <pre className="spec-markdown mask-fade-y max-h-[560px] overflow-y-auto px-5 py-5 text-ivory/80">
            {spec.megaPrompt}
          </pre>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CopyButton text={spec.megaPrompt} label="Copy the whole thing" />
          <p className="font-mono text-[11px] tracking-[0.12em] text-smoke uppercase">
            Definition of done included — no builder left guessing.
          </p>
        </div>
      </Section>
    </div>
  );
}
