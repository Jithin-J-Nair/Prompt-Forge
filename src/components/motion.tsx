"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";

/* ------------------------------ REVEAL ------------------------------ */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------- TYPE CYCLE --------------------------- */

export function TypeCycle({
  phrases,
  className,
  prefix = "“",
  suffix = "”",
}: {
  phrases: string[];
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const idx = useRef(0);

  useEffect(() => {
    const current = phrases[idx.current % phrases.length];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), 34 + Math.random() * 40);
      } else {
        t = setTimeout(() => setPhase("holding"), 1400);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), 900);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), 14);
      } else {
        idx.current += 1;
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, phrases]);

  return (
    <span className={className} aria-label={phrases[0]}>
      <span className="text-smoke">{prefix}</span>
      <span className="text-flare">{text}</span>
      <span className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-ember" aria-hidden />
      <span className="text-smoke">{suffix}</span>
    </span>
  );
}

/* --------------------------- GLOW CARD --------------------------- */

export function GlowCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ref.current?.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current?.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`card-sheen ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* --------------------------- COUNT UP --------------------------- */

export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}
