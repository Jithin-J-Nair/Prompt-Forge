"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "/skillforge", label: "Compose" },
  { href: "/promptforge", label: "Body" },
  { href: "/forge", label: "Legacy forge" },
  { href: "/library", label: "Library" },
];

function isActive(pathname: string, href: string) {
  if (href === "/skillforge") return pathname.startsWith("/skillforge");
  if (href === "/promptforge") return pathname.startsWith("/promptforge");
  if (href === "/forge") return pathname === "/forge";
  if (href === "/library") return pathname.startsWith("/library");
  return false;
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-lg">
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/" aria-label="PromptForge home" className="rounded-field">
            <Logo />
          </Link>
        </div>

        {/* nav-centre deal */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
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
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/skillforge" className="btn btn-primary btn-sm">
          Compose package
        </Link>
      </div>

      {open ? (
        <nav className="border-t border-base-300 bg-base-100 lg:hidden" aria-label="Mobile">
          <ul className="mx-auto grid max-w-[1200px] gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block rounded-field px-3 py-3 font-display text-xl font-semibold",
                    isActive(pathname, link.href) ? "bg-base-200" : "hover:bg-base-200/60",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#how"
                className="block rounded-field px-3 py-3 font-display text-xl font-semibold hover:bg-base-200/60"
              >
                How it works
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
  return (
    <footer
      data-theme="forge-night"
      className="blueprint relative z-10 border-t border-white/10 px-5 py-14 md:px-8"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo markClassName="text-base-content" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/70">
            One project idea becomes a reviewed skill package your agents can build from.
          </p>
        </div>
        <nav aria-label="Surfaces">
          <h2 className="font-display text-sm font-semibold text-base-content">Surfaces</h2>
          <ul className="mt-3 grid gap-2 text-sm text-base-content/70">
            <li>
              <Link href="/skillforge" className="link link-hover text-base-content/70">
                Compose (SkillForge)
              </Link>
            </li>
            <li>
              <Link href="/promptforge" className="link link-hover text-base-content/70">
                Body (PromptForge)
              </Link>
            </li>
            <li>
              <Link href="/forge" className="link link-hover text-base-content/70">
                Legacy forge
              </Link>
            </li>
            <li>
              <Link href="/library" className="link link-hover text-base-content/70">
                Library
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-sm font-semibold text-base-content">What you get</h2>
          <ul className="mt-3 grid gap-2 text-sm text-base-content/70">
            <li>Skill graph and Project DNA</li>
            <li>COOK brain and body protocol</li>
            <li>Review Council gates</li>
            <li>Agent execution package</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
