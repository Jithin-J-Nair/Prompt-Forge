"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, ArrowUpRight, Menu, X } from "lucide-react";
import clsx from "clsx";

/* ------------------------------ NAV ------------------------------ */

const NAV_LINKS = [
  { href: "/forge", label: "The Forge" },
  { href: "/library", label: "Library" },
  { href: "/#anatomy", label: "Anatomy" },
  { href: "/#how", label: "Protocol" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-ink/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:h-[72px] md:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="PromptForge home">
          <span className="grid size-9 place-items-center rounded-md bg-ember text-ink transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Flame className="size-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-[15px] font-bold tracking-[0.18em] uppercase">
            Prompt<span className="text-ember">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => {
            const active =
              (l.href === "/forge" && pathname === "/forge") ||
              (l.href === "/library" && pathname.startsWith("/library"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-200",
                  active ? "bg-steel text-ivory" : "text-fog hover:text-ivory",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/forge"
            className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-ivory px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase transition-all duration-200 hover:bg-ember hover:text-ink"
          >
            Forge a prompt
            <ArrowUpRight className="size-3.5" />
          </Link>
        </nav>

        <button
          className="grid size-10 place-items-center text-ivory md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-ink/95 backdrop-blur-md md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-line py-4 font-display text-2xl font-bold tracking-tight text-ivory last:border-none"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/* --------------------------- BACKGROUND --------------------------- */

export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      {/* ember orbs */}
      <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-ember/[0.07] blur-[120px]" />
      <div className="absolute top-[60%] -left-40 h-[480px] w-[480px] rounded-full bg-blood/[0.05] blur-[110px]" />
      <div className="absolute top-[30%] -right-40 h-[420px] w-[420px] rounded-full bg-flare/[0.05] blur-[110px]" />
      {/* blueprint grid */}
      <div className="absolute inset-0 bg-blueprint mask-fade-y opacity-70" />
      {/* film grain */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}

/* --------------------------- MARQUEE --------------------------- */

export function Marquee({
  items,
  className,
  slow = false,
}: {
  items: string[];
  className?: string;
  slow?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className={clsx("relative overflow-hidden border-y border-line py-4", className)}>
      <div
        className={clsx(
          "flex w-max items-center gap-8 whitespace-nowrap",
          slow ? "animate-marquee-slow" : "animate-marquee",
        )}
      >
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-sm font-bold tracking-[0.22em] text-fog uppercase">
              {it}
            </span>
            <span className="text-ember" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- SECTION HEAD --------------------------- */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-ember uppercase">
      <span className="inline-block size-1.5 bg-ember" aria-hidden />
      {children}
    </p>
  );
}

/* ------------------------------ FOOTER ------------------------------ */

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-coal">
      <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-10 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-ember text-ink">
                <Flame className="size-5" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[15px] font-bold tracking-[0.18em] uppercase">
                Prompt<span className="text-ember">Forge</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fog">
              The website prompt enhancement engine. One lazy sentence in — a
              2,000-word, production-grade build spec out.
            </p>
            <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-smoke uppercase">
              Forged locally · No dark patterns · Zero emojis
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-smoke uppercase">Engine</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link className="text-fog transition-colors hover:text-ember" href="/forge">The Forge</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/library">Library</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/#anatomy">Anatomy of a mega prompt</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/#how">The protocol</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-smoke uppercase">Output</p>
            <ul className="mt-4 space-y-3 text-[15px] text-fog">
              <li>Brand identity systems</li>
              <li>Design tokens & grids</li>
              <li>Page-by-page UX blueprints</li>
              <li>Backend schemas & endpoints</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="text-stroke mt-16 font-display text-[13.5vw] leading-none font-bold tracking-tight whitespace-nowrap uppercase select-none md:text-[10.5vw]"
        >
          PromptForge
        </p>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] tracking-[0.14em] text-smoke uppercase md:flex-row md:items-center">
          <span>© 2026 PromptForge Industries</span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-ember" aria-hidden />
            Furnace nominal · Engine v1.0
          </span>
          <span>Set in Space Grotesk & JetBrains Mono</span>
        </div>
      </div>
    </footer>
  );
}
