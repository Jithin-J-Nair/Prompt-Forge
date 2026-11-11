"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { springs } from "@/lib/motion/tokens";

const LABS = [
  { href: "/motion-lab", label: "Motion Lab" },
  { href: "/math-lab", label: "Math Lab" },
];

export function LabSwitch() {
  const pathname = usePathname();
  return (
    <div className="glass inline-flex w-fit rounded-full p-1" role="tablist" aria-label="Labs">
      {LABS.map((l) => {
        const active = pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} role="tab" aria-selected={active}
            className={clsx("press relative rounded-full px-5 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors",
              active ? "text-ivory" : "text-fog hover:text-ivory")}>
            {active && (
              <motion.span layoutId="pf-lab-pill" transition={springs.snappy} aria-hidden
                className="absolute inset-0 rounded-full border border-ember/40 bg-ember/15" />
            )}
            <span className="relative">{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
