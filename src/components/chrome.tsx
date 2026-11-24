"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/logo";
import { useLocale, type Locale } from "@/lib/i18n";

const NAV_HREFS = [
  { href: "/skillforge", key: "nav.compose" as const },
  { href: "/promptforge", key: "nav.body" as const },
  { href: "/forge", key: "nav.legacyForge" as const },
  { href: "/library", key: "nav.library" as const },
];

function isActive(pathname: string, href: string) {
  if (href === "/skillforge") return pathname.startsWith("/skillforge");
  if (href === "/promptforge") return pathname.startsWith("/promptforge");
  if (href === "/forge") return pathname === "/forge";
  if (href === "/library") return pathname.startsWith("/library");
  return false;
}

function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  const option = (code: Locale, label: string) => (
    <button
      key={code}
      type="button"
      className={clsx(
        "btn btn-sm join-item min-w-10 px-2.5 font-display font-semibold",
        locale === code ? "btn-secondary" : "btn-ghost border border-base-300",
      )}
      aria-pressed={locale === code}
      onClick={() => setLocale(code)}
    >
      {label}
    </button>
  );

  return (
    <div className="join" role="group" aria-label={t("nav.language")}>
      {option("en", t("nav.langEn"))}
      {option("ja", t("nav.langJp"))}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-lg">
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/" aria-label={t("nav.homeAria")} className="rounded-field">
            <Logo />
          </Link>
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label={t("nav.primary")}
        >
          {NAV_HREFS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={clsx(
                "rounded-field px-3.5 py-2 font-display text-[0.95rem] font-medium transition-colors",
                isActive(pathname, link.href)
                  ? "text-base-content shadow-[inset_0_-2px_0_var(--color-primary)]"
                  : "text-base-content/65 hover:text-base-content",
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <Link href="/skillforge" className="btn btn-primary btn-sm">
            {t("nav.composePack")}
          </Link>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-base-300 bg-base-100 lg:hidden" aria-label={t("nav.mobile")}>
          <ul className="mx-auto grid max-w-[1200px] gap-1 p-4">
            {NAV_HREFS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block rounded-field px-3 py-3 font-display text-xl font-semibold",
                    isActive(pathname, link.href) ? "bg-base-200" : "hover:bg-base-200/60",
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#how"
                className="block rounded-field px-3 py-3 font-display text-xl font-semibold hover:bg-base-200/60"
              >
                {t("nav.howItWorks")}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

/** Kept for pages that still mount it; blueprint bands carry atmosphere. */
export function Atmosphere() {
  return null;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">{children}</p>;
}

/** @deprecated Use SectionLabel */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <SectionLabel>{children}</SectionLabel>;
}

export function Footer() {
  const { t } = useLocale();

  return (
    <footer
      data-theme="forge-night"
      className="blueprint relative z-10 border-t border-white/10 px-5 py-14 md:px-8"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo markClassName="text-base-content" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/70">
            {t("footer.blurb")}
          </p>
        </div>
        <nav aria-label={t("footer.surfaces")}>
          <h2 className="font-display text-sm font-semibold text-base-content">{t("footer.surfaces")}</h2>
          <ul className="mt-3 grid gap-2 text-sm text-base-content/70">
            <li>
              <Link href="/skillforge" className="link link-hover text-base-content/70">
                {t("footer.composeSkillforge")}
              </Link>
            </li>
            <li>
              <Link href="/promptforge" className="link link-hover text-base-content/70">
                {t("footer.bodyPromptforge")}
              </Link>
            </li>
            <li>
              <Link href="/forge" className="link link-hover text-base-content/70">
                {t("footer.legacyForge")}
              </Link>
            </li>
            <li>
              <Link href="/library" className="link link-hover text-base-content/70">
                {t("footer.library")}
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-sm font-semibold text-base-content">{t("footer.whatYouGet")}</h2>
          <ul className="mt-3 grid gap-2 text-sm text-base-content/70">
            <li>{t("footer.get1")}</li>
            <li>{t("footer.get2")}</li>
            <li>{t("footer.get3")}</li>
            <li>{t("footer.get4")}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
