"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  { href: "/", label: "Discover" },
  { href: "/lexicon", label: "Layers" },
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
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock scroll, move focus into the dialog, trap Tab and restore focus on close.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-40">
        <Link href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ember focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink">Skip to content</Link>
        <div
          className={clsx(
            "mx-auto flex items-center justify-between px-4 transition-[padding] md:px-6",
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
                <Flame className="size-4" strokeWidth={2.2} aria-hidden />
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
                      transition={reduceMotion ? { duration: 0 } : springs.snappy}
                      aria-hidden
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
            <Link
              href="/forge"
              className="press glint ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-ivory px-4 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-ember"
            >
              Forge a prompt
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          </nav>

          {/* mobile toggle */}
          <button
            ref={toggleRef}
            className="glass press grid size-10 place-items-center rounded-full text-ivory md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="pf-mobile-menu"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </header>

      {/* full-screen mobile menu — AnimatePresence keeps exit animation alive */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="pf-mobile-menu"
            id="pf-mobile-menu"
            ref={menuRef}
            className="fixed inset-0 z-30 flex flex-col justify-end bg-ink pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : motionTokens.duration.fast } }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
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
            <Link href="/forge" onClick={() => setOpen(false)}
              className="press mx-6 mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-5 py-4 text-sm font-semibold text-ink">
              Create a prompt <ArrowUpRight className="size-4" aria-hidden />
            </Link>
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
      <div className="absolute inset-0 bg-blueprint mask-fade-y opacity-35" />
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
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
    <div className={clsx("group mask-fade-x relative overflow-hidden border-y border-line py-4", className)}>
      <div
        className={clsx(
          "flex w-max items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]",
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
              One sentence or a stack of creative layers in — a clear, implementation-aware prompt out.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-smoke">
              Deterministic core · No model API required
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
              <li>Creative direction systems</li>
              <li>Layout, type & color layers</li>
              <li>Motion, 3D & interaction specs</li>
              <li>Build sequence & quality gates</li>
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
          <span>© 2026 PromptForge</span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-ember" aria-hidden />
            Quick prompts · Creative mega specs
          </span>
          <span>Set in Space Grotesk & JetBrains Mono</span>
        </div>
      </div>
    </footer>
  );
}
