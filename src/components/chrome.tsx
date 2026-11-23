"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Hammer, Menu, X } from "lucide-react";
import clsx from "clsx";

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
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="navbar mx-auto max-w-[1120px] px-4 md:px-8">
        <div className="navbar-start gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5" aria-label="PromptForge home">
            <span className="grid size-9 place-items-center bg-primary text-primary-content">
              <Hammer className="size-4.5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">PromptForge</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(isActive(pathname, link.href) && "menu-active")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end">
          <Link href="/skillforge" className="btn btn-primary btn-sm">
            Compose package
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-base-300 bg-base-100 lg:hidden" aria-label="Mobile">
          <ul className="menu w-full p-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "font-display text-xl font-semibold",
                    isActive(pathname, link.href) && "menu-active",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#how">How it works</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-workshop opacity-80" />
      <div className="absolute inset-0 bg-patina" />
      <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl animate-heat" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 font-mono text-xs tracking-wide text-primary">{children}</p>;
}

/** @deprecated Use SectionLabel — kept for pages still importing Eyebrow */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <SectionLabel>{children}</SectionLabel>;
}

export function Footer() {
  return (
    <footer className="footer relative z-10 border-t border-base-300 bg-base-200 p-10 text-base-content sm:footer-horizontal">
      <aside>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center bg-primary text-primary-content">
            <Hammer className="size-4.5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">PromptForge</span>
        </div>
        <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-80">
          Expertise operating system — one idea becomes a reviewed skill package agents can cook
          against.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Surfaces</h6>
        <Link href="/skillforge" className="link link-hover">
          Compose (SkillForge)
        </Link>
        <Link href="/promptforge" className="link link-hover">
          Body (PromptForge)
        </Link>
        <Link href="/forge" className="link link-hover">
          Legacy forge
        </Link>
        <Link href="/library" className="link link-hover">
          Library
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Output</h6>
        <span className="opacity-80">Skill graphs & Project DNA</span>
        <span className="opacity-80">COOK brain + body protocol</span>
        <span className="opacity-80">Review Council gates</span>
        <span className="opacity-80">Agent execution packages</span>
      </nav>
    </footer>
  );
}
