"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, ArrowUpRight, Menu, X } from "lucide-react";
import clsx from "clsx";
import { Magnetic, ScrollProgress } from "@/components/motion";
import { motionTokens, springs } from "@/lib/motion/tokens";

/* ------------------------------------------------------------------ */
/*  Chrome v3 — floating command-bar nav, cinematic atmosphere,        */
/*  editorial footer. Rebuilt from scratch per ECC motion contracts:   */
/*  layoutId pill, AnimatePresence mobile menu (enter+exit both        */
/*  defined), stagger 50–100ms, transform+opacity only.                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "/", label: "Gallery" },
  { href: "/lexicon", label: "Lexicon" },
  { href: "/studio", label: "Studio" },
  { href: "/motion-lab", label: "Labs" },
  { href: "/library", label: "Library" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/artifact");
  if (href === "/library") return pathname.startsWith("/library") || pathname.startsWith("/spec");
  if (href === "/motion-lab") return pathname.includes("-lab");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ------------------------------ NAV ------------------------------ */

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

  // Escape closes the mobile menu; scroll is locked while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          className={clsx(
            "mx-auto flex items-center justify-between px-4 transition-all md:px-6",
            scrolled ? "max-w-[960px] py-3" : "max-w-[1280px] py-5",
          )}
          style={{
            transitionDuration: `${motionTokens.duration.normal * 1000}ms`,
            transitionTimingFunction: `cubic-bezier(${motionTokens.easing.outExpo.join(",")})`,
          }}
        >
          {/* brand chip */}
          <Magnetic strength={0.18}>
            <Link
              href="/"
              className="glass group flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4"
              aria-label="PromptForge home"
            >
              <span className="grid size-7 place-items-center rounded-full bg-ember text-ink transition-transform duration-300 group-hover:rotate-12">
                <Flame className="size-4" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[13px] font-bold uppercase tracking-[0.18em]">
                Prompt<span className="text-ember">Forge</span>
              </span>
            </Link>
          </Magnetic>

          {/* desktop command bar */}
          <nav
            aria-label="Primary"
            className="glass hidden items-center gap-0.5 rounded-full p-1.5 md:flex"
          >
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "relative rounded-full px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors duration-200",
                    active ? "text-ivory" : "text-fog hover:text-ivory",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="pf-nav-pill"
                      className="absolute inset-0 rounded-full border border-ember/40 bg-ember/15"
                      transition={springs.snappy}
                      aria-hidden
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
            <Link
              href="/lexicon"
              className="press glint ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-ivory px-4 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-ember"
            >
              Start stacking
              <ArrowUpRight className="size-3" />
            </Link>
          </nav>

          {/* mobile toggle */}
          <button
            className="glass press grid size-10 place-items-center rounded-full text-ivory md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* full-screen mobile menu — AnimatePresence keeps exit animation alive */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="pf-mobile-menu"
            className="fixed inset-0 z-30 flex flex-col justify-end bg-ink/90 pb-10 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: motionTokens.duration.fast } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            role="dialog"
            aria-modal="true"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { ...springs.gentle, delay: 0.08 + i * motionTokens.stagger.tight },
                  }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.12 } }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    className={clsx(
                      "group flex items-baseline justify-between border-b border-line py-4",
                      isActive(pathname, l.href) ? "text-ember" : "text-ivory",
                    )}
                  >
                    <span className="font-display text-4xl font-bold tracking-tight">{l.label}</span>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-smoke">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
    <div className={clsx("mask-fade-x relative overflow-hidden border-y border-line py-4", className)}>
      <div
        className={clsx(
          "flex w-max items-center gap-8 whitespace-nowrap",
          slow ? "animate-marquee-slow" : "animate-marquee",
        )}
      >
        {row.map((it, i) => (
          <span key={`mq-${i}`} className="flex items-center gap-8">
            <span className="font-display text-sm font-bold uppercase tracking-[0.22em] text-fog">
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
    <p className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
      <span className="inline-block size-1.5 bg-ember" aria-hidden />
      {children}
    </p>
  );
}

/* ------------------------------ FOOTER ------------------------------ */

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-coal">
      <div className="mx-auto max-w-[1280px] px-6 pb-10 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-ember text-ink">
                <Flame className="size-5" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[15px] font-bold uppercase tracking-[0.18em]">
                Prompt<span className="text-ember">Forge</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fog">
              The website prompt enhancement engine. One lazy sentence in — a
              2,000-word, production-grade build spec out.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-smoke">
              Forged locally · No dark patterns · Zero emojis
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">Engine</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link className="text-fog transition-colors hover:text-ember" href="/forge">The Forge</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/library">Library</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/studio">Studio</Link></li>
              <li><Link className="text-fog transition-colors hover:text-ember" href="/motion-lab">Motion Lab</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">Output</p>
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
          className="text-stroke mt-16 select-none whitespace-nowrap font-display text-[13.5vw] font-bold uppercase leading-none tracking-tight md:text-[10.5vw]"
        >
          PromptForge
        </p>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-smoke md:flex-row md:items-center">
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
