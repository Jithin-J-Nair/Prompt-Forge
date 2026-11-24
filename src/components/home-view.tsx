"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  FileText,
  PackageCheck,
  ScanText,
} from "lucide-react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { CookTerminal } from "@/components/cook-terminal";
import { INDUSTRIES } from "@/lib/engine/industries";
import { HERO_ROTATIONS } from "@/lib/templates";
import type { PromptSummary, PromptListResponse } from "@/lib/types";
import { useLocale, type MessageKey } from "@/lib/i18n";

type StepFrame = "brief" | "cook" | "body";

type StepDef = {
  icon: typeof ScanText;
  no: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  detailKey: MessageKey;
  metaKey: MessageKey;
  frame: StepFrame;
};

const STEP_DEFS: StepDef[] = [
  {
    icon: ScanText,
    no: "01",
    titleKey: "home.step1Title",
    bodyKey: "home.step1Body",
    detailKey: "home.step1Detail",
    metaKey: "home.step1Meta",
    frame: "brief",
  },
  {
    icon: Brain,
    no: "02",
    titleKey: "home.step2Title",
    bodyKey: "home.step2Body",
    detailKey: "home.step2Detail",
    metaKey: "home.step2Meta",
    frame: "cook",
  },
  {
    icon: FileText,
    no: "03",
    titleKey: "home.step3Title",
    bodyKey: "home.step3Body",
    detailKey: "home.step3Detail",
    metaKey: "home.step3Meta",
    frame: "body",
  },
];

const ANATOMY_KEYS: { titleKey: MessageKey; lineKey: MessageKey }[] = [
  { titleKey: "layer.missionBrief", lineKey: "layer.missionBriefLine" },
  { titleKey: "layer.brandIdentity", lineKey: "layer.brandIdentityLine" },
  { titleKey: "layer.designSystem", lineKey: "layer.designSystemLine" },
  { titleKey: "layer.layoutLaw", lineKey: "layer.layoutLawLine" },
  { titleKey: "layer.pageBlueprints", lineKey: "layer.pageBlueprintsLine" },
  { titleKey: "layer.componentContracts", lineKey: "layer.componentContractsLine" },
  { titleKey: "layer.copyStrategy", lineKey: "layer.copyStrategyLine" },
  { titleKey: "layer.motionScore", lineKey: "layer.motionScoreLine" },
  { titleKey: "layer.technicalStack", lineKey: "layer.technicalStackLine" },
  { titleKey: "layer.seoAccess", lineKey: "layer.seoAccessLine" },
  { titleKey: "layer.backendData", lineKey: "layer.backendDataLine" },
  { titleKey: "layer.definitionOfDone", lineKey: "layer.definitionOfDoneLine" },
];

const SAMPLE_PACK_KEYS = [
  {
    industryKey: "sample.saasIndustry" as const,
    brandName: "Northline",
    promptKey: "sample.saasPrompt" as const,
    wordCount: 2140,
  },
  {
    industryKey: "sample.agencyIndustry" as const,
    brandName: "Kiln Studio",
    promptKey: "sample.agencyPrompt" as const,
    wordCount: 1988,
  },
  {
    industryKey: "sample.aiIndustry" as const,
    brandName: "Forge Desk",
    promptKey: "sample.aiPrompt" as const,
    wordCount: 1764,
  },
];

const h2 =
  "font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] text-balance md:text-5xl lg:text-[3.25rem]";

function HowFrame({ frame }: { frame: StepFrame }) {
  const { t } = useLocale();

  if (frame === "brief") {
    return (
      <div className="flex h-full flex-col justify-between gap-4 p-5 md:p-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.12em] text-primary uppercase">
            {t("home.frameIntake")}
          </p>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
            {t("home.frameBriefTitle")}
          </p>
        </div>
        <div className="rounded-field border border-white/15 bg-white/5 p-4 font-mono text-xs leading-relaxed whitespace-pre-line text-base-content/70">
          {t("home.frameBriefMeta")}
        </div>
      </div>
    );
  }
  if (frame === "cook") {
    return (
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-4 font-mono text-[11px] leading-relaxed md:p-5">
        <p className="text-accent"># COOK.md — BRAIN</p>
        <p className="text-base-content/80">{t("home.frameCookMission")}</p>
        <p className="text-base-content/65">{t("home.frameCookMissionLine")}</p>
        <p className="text-base-content/80">{t("home.frameCookGraph")}</p>
        <p className="text-primary">01 craft-direction</p>
        <p className="text-primary">02 layout-law</p>
        <p className="text-primary">03 copy-strategy</p>
        <p className="mt-auto text-success">{t("home.frameCookAccepted")}</p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-5 md:p-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.12em] text-accent uppercase">
          {t("home.frameBodyLabel")}
        </p>
        <p className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
          {t("home.frameBodyTitle")}
        </p>
      </div>
      <ol className="space-y-2 font-mono text-xs text-base-content/70">
        <li>{t("home.frameBody1")}</li>
        <li>{t("home.frameBody2")}</li>
        <li>{t("home.frameBody3")}</li>
      </ol>
    </div>
  );
}

/** Dealt moment: pinned-chapters — steps open while the frame crossfades. */
function HowItWorksPinned() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [pinnedProgress, setPinnedProgress] = useState(0);

  useEffect(() => {
    if (reduce) {
      setActive(STEP_DEFS.length - 1);
      return;
    }

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setPinnedProgress(1);
        return;
      }
      const raw = Math.min(1, Math.max(0, -rect.top / total));
      setPinnedProgress(raw);
      const idx = Math.min(STEP_DEFS.length - 1, Math.floor(raw * STEP_DEFS.length));
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    if (pinnedProgress > 0.02) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % STEP_DEFS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce, pinnedProgress]);

  return (
    <>
      <div
        ref={sectionRef}
        className="relative mt-14"
        style={{ minHeight: reduce ? undefined : "210vh" }}
      >
        <div
          className={clsx(
            "grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12",
            !reduce && "lg:sticky lg:top-24 lg:min-h-[calc(100vh-8rem)]",
          )}
        >
          <div className="space-y-3">
            {STEP_DEFS.map((step, i) => {
              const lit = i === active;
              return (
                <button
                  key={step.no}
                  type="button"
                  onClick={() => setActive(i)}
                  className={clsx(
                    "w-full border-t-2 px-1 py-5 text-left transition-[opacity,border-color,color] duration-300",
                    lit
                      ? "border-primary opacity-100"
                      : "border-base-300 opacity-50 hover:opacity-80",
                  )}
                  aria-current={lit ? "step" : undefined}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 grid size-9 shrink-0 place-items-center rounded-field border",
                        lit
                          ? "border-primary bg-primary text-primary-content"
                          : "border-base-300 bg-base-200 text-base-content/45",
                      )}
                    >
                      <step.icon className="size-4" strokeWidth={1.8} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                          {t(step.titleKey)}
                        </h3>
                        <span className="font-mono text-[10px] text-primary tabular-nums">
                          {step.no}
                        </span>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-base-content/75">
                        {t(step.bodyKey)}
                      </p>
                      {lit ? (
                        <p className="mt-2 text-sm leading-relaxed text-base-content/55">
                          {t(step.detailKey)}
                        </p>
                      ) : null}
                      <p className="mt-2 font-mono text-[10px] tracking-wide text-base-content/45 uppercase">
                        {t(step.metaKey)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            data-theme="forge-night"
            className="relative min-h-[280px] overflow-hidden rounded-box border border-white/15 bg-base-100 md:min-h-[340px]"
          >
            <div key={STEP_DEFS[active].no} className="absolute inset-0 bg-base-100">
              <HowFrame frame={STEP_DEFS[active].frame} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border border-base-300 bg-base-200/70 px-5 py-4">
        <PackageCheck className="size-5 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <p className="text-sm leading-relaxed text-base-content/75 md:text-[15px]">
          {t("home.resultBefore")}
          <span className="font-medium text-base-content">{t("home.resultCook")}</span>
          {t("home.resultPlus")}
          <span className="font-medium text-base-content">{t("home.resultBody")}</span>
          {t("home.resultAfter")}
        </p>
      </div>
    </>
  );
}

function PackRow({
  href,
  industry,
  brand,
  prompt,
  meta,
}: {
  href: string;
  industry: string;
  brand: string;
  prompt: string;
  meta: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group grid gap-1 py-6 transition-colors hover:bg-base-200/60 md:grid-cols-[13rem_1fr_auto] md:items-baseline md:gap-8 md:px-3"
      >
        <span className="text-sm font-medium text-accent">{industry}</span>
        <span>
          <span className="block font-display text-2xl font-semibold tracking-tight group-hover:text-primary">
            {brand}
          </span>
          <span className="mt-1 line-clamp-2 block max-w-xl text-[15px] leading-relaxed text-base-content/65">
            “{prompt}”
          </span>
        </span>
        <span className="text-sm text-base-content/55 tabular-nums">{meta}</span>
      </Link>
    </li>
  );
}

export function HomeView() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [quick, setQuick] = useState("");
  const [recent, setRecent] = useState<PromptSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const reduce = useReducedMotion();

  const dateLocale = useMemo(() => (locale === "ja" ? "ja-JP" : "en-US"), [locale]);

  useEffect(() => {
    fetch("/api/prompts?limit=6")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: PromptListResponse | null) => {
        if (d) {
          setRecent(d.prompts);
          setTotal(d.total);
        }
      })
      .catch(() => undefined)
      .finally(() => setLibraryLoaded(true));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setPhraseIndex((i) => (i + 1) % HERO_ROTATIONS.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quick.trim();
    router.push(q ? `/skillforge?q=${encodeURIComponent(q)}` : "/skillforge");
  };

  return (
    <>
      {/* deal: hero centred · forge blueprint · nav-centre · footer-dark · close-word · pinned-chapters */}
      <section
        data-theme="forge-night"
        data-enter
        className="blueprint relative -mt-16 min-h-[100dvh] pt-16"
        aria-labelledby="hero-h"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pt-14 pb-10 text-center md:px-8 md:pt-20 md:pb-14">
          <div className={clsx("w-full max-w-3xl", !reduce && "hero-enter-copy")}>
            <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
              {t("home.eyebrow")}
            </p>
            <h1
              id="hero-h"
              className="mt-4 font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4.25rem]"
            >
              PromptForge
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-lg leading-relaxed text-base-content/80">
              {t("home.heroBody")}
            </p>

            <form
              onSubmit={submit}
              className="mx-auto mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
              role="search"
            >
              <label htmlFor="quick-brief" className="sr-only">
                {t("home.quickLabel")}
              </label>
              <input
                id="quick-brief"
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                placeholder={t("home.quickPlaceholder")}
                maxLength={200}
                className="input input-lg w-full flex-1 border-white/25 bg-white/10 font-body text-base placeholder:text-base-content/50"
              />
              <button type="submit" className="btn btn-primary btn-lg shrink-0">
                {t("home.composePack")}
              </button>
            </form>

            <p className="mt-4 text-sm text-base-content/65">
              {t("home.try")}{" "}
              <button
                type="button"
                onClick={() => setQuick(HERO_ROTATIONS[phraseIndex])}
                className="rounded-field text-left font-medium text-base-content underline decoration-primary decoration-2 underline-offset-4"
              >
                {HERO_ROTATIONS[phraseIndex]}
              </button>
            </p>
            <p className="mt-2 font-mono text-xs text-base-content/55">
              {t("home.freeNote")}
            </p>
          </div>

          <div
            className={clsx(
              "hero-terminal-mask mt-10 w-full max-w-3xl",
              !reduce && "hero-enter-media",
            )}
          >
            <CookTerminal />
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <h2 className={`${h2} max-w-2xl`}>{t("home.howTitle")}</h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
            {t("home.howBody")}
          </p>
          <HowItWorksPinned />
        </div>
      </section>

      <section
        id="anatomy"
        className="border-t border-base-300 bg-base-200/60 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={h2}>{t("home.anatomyTitle")}</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-base-content/70">
              {t("home.anatomyBody")}
            </p>
          </div>
          <dl className="divide-y divide-base-300 border-y border-base-300">
            {ANATOMY_KEYS.map((item) => (
              <div
                key={item.titleKey}
                className="grid gap-1 py-5 md:grid-cols-[13rem_1fr] md:gap-8"
              >
                <dt className="font-display text-lg font-semibold">{t(item.titleKey)}</dt>
                <dd className="text-[15px] leading-relaxed text-base-content/70">
                  {t(item.lineKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        data-theme="forge-night"
        className="blueprint border-t border-white/10 px-5 py-20 md:px-8 md:py-28"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className={`${h2} max-w-3xl`}>{t("home.industriesTitle")}</h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-base-content/70">
            {t("home.industriesBody")}
          </p>
          <ul className="mt-10 columns-2 gap-8 font-display text-lg font-medium md:columns-3 lg:columns-4">
            {INDUSTRIES.map((ind) => (
              <li key={ind.id} className="break-inside-avoid border-b border-white/15 py-2.5">
                {ind.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-base-300 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={h2}>{t("home.freshTitle")}</h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-base-content/70">
                {total > 0 ? t("home.freshBodyCount", { n: total }) : ""}
                {t("home.freshBody")}
              </p>
            </div>
            <Link href="/library" className="btn btn-outline gap-2">
              {t("home.openLibrary")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-10 divide-y divide-base-300 border-y border-base-300">
            {!libraryLoaded &&
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="py-6">
                  <div className="skeleton h-16 w-full" />
                </li>
              ))}
            {libraryLoaded &&
              recent.length === 0 &&
              SAMPLE_PACK_KEYS.map((s) => (
                <PackRow
                  key={s.brandName}
                  href="/skillforge"
                  industry={t(s.industryKey)}
                  brand={s.brandName}
                  prompt={t(s.promptKey)}
                  meta={t("home.exampleMeta", {
                    n: s.wordCount.toLocaleString(dateLocale),
                  })}
                />
              ))}
            {recent.map((p) => (
              <PackRow
                key={p.id}
                href={`/spec/${p.id}`}
                industry={p.industry}
                brand={p.brandName}
                prompt={p.rawPrompt}
                meta={t("home.wordsMeta", {
                  date: new Date(p.createdAt).toLocaleDateString(dateLocale, {
                    month: "short",
                    day: "numeric",
                  }),
                  n: p.wordCount.toLocaleString(dateLocale),
                })}
              />
            ))}
          </ul>
        </div>
      </section>

      <section
        data-theme="forge-night"
        className="blueprint -mb-px px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl font-display text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance md:text-7xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mt-5 max-w-md text-lg text-base-content/75">
              {t("home.ctaBody")}
            </p>
          </div>
          <Link href="/skillforge" className="btn btn-primary btn-lg">
            {t("home.ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
