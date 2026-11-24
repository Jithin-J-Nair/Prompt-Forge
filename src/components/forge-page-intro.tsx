"use client";

import { SectionLabel } from "@/components/chrome";
import { useLocale } from "@/lib/i18n";

export function ForgePageIntro() {
  const { t } = useLocale();
  return (
    <header className="mb-10 md:mb-14">
      <SectionLabel>{t("forge.label")}</SectionLabel>
      <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.025em] md:text-6xl">
        {t("forge.title")}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70">
        {t("forge.body")}
      </p>
    </header>
  );
}
