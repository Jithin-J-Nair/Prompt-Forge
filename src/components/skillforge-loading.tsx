"use client";

import { useLocale } from "@/lib/i18n";

export function SkillForgeLoading() {
  const { t } = useLocale();
  return (
    <p className="font-mono text-sm text-base-content/60">
      <span className="loading loading-dots loading-sm" /> {t("sf.loading")}
    </p>
  );
}
