"use client";

import { clamp, numP, type PreviewProps } from "./runtime";

export function SvgPathDraw(p: PreviewProps) {
  const stagger = clamp(numP(p.params, "stagger", 0.2), 0, 1);
  const dur = `${(1.6 + stagger * 0.8).toFixed(2)}s`;
  const paths: string[] = [
    "M20 72 L44 26 L68 72 M30 52 H58",
    "M78 28 V70 M78 44 H94",
    "M104 70 V28 H126 M104 49 H122",
    "M136 70 V28 H158",
  ];
  return (
    <svg viewBox="0 8 180 80" className="block size-full" role="img" aria-label="SVG path draw-on animation">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 2 ? "#67e8f9" : "#8b7cf6"} strokeWidth="3"
          strokeLinecap="round" style={{
            strokeDasharray: 200,
            strokeDashoffset: p.animate && !p.still ? undefined : 0,
            animation: p.animate && !p.still ? `pf-draw ${dur} ease-in-out ${i * (stagger + 0.2)}s infinite alternate` : "none",
          }} />
      ))}
      <style>{`@keyframes pf-draw{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}

export function SvgOnPath() {
  return (
    <svg viewBox="0 0 200 80" className="block size-full" role="img" aria-label="Text on SVG path">
      <defs>
        <path id="pv-arc" d="M14 66 Q100 4 186 66" fill="none" />
      </defs>
      <path d="M14 66 Q100 4 186 66" fill="none" stroke="#2b2b31" strokeDasharray="3 4" />
      <text fontSize="13" fill="#f2ede6" fontFamily="inherit" fontWeight="700">
        <textPath href="#pv-arc" startOffset="8%">craft · follows · the · curve</textPath>
      </text>
    </svg>
  );
}

const CIRCLE_D = "M50 20 a30 30 0 1 1 -0.01 0";
const SQUASH_D = "M16 50 q34 -36 68 0 q-34 20 -68 0";
export function SvgMorph(p: PreviewProps) {
  return (
    <svg viewBox="0 0 100 100" className="block size-full" role="img" aria-label="SVG shape morph">
      <path fill="none" stroke="#8b7cf6" strokeWidth="3" strokeLinecap="round" d={CIRCLE_D}>
        {p.animate && !p.still && (
          <animate attributeName="d" values={`${CIRCLE_D};${SQUASH_D};${CIRCLE_D}`} dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
        )}
      </path>
    </svg>
  );
}

export function SvgFollow(p: PreviewProps) {
  const stillPath = "M100 50 L100 50";
  return (
    <svg viewBox="0 0 200 100" className="block size-full" role="img" aria-label="Motion path follower">
      <path d="M20 72 C58 16 92 88 130 40 C150 16 172 30 186 24" fill="none" stroke="#2b2b31" strokeDasharray="4 4" />
      <path d="M20 72 C58 16 92 88 130 40 C150 16 172 30 186 24" fill="none" stroke="rgba(139,124,246,0.5)" strokeWidth="1" />
      <g>
        <circle r="8" fill="rgba(139,124,246,0.25)" />
        <circle r="4" fill="#67e8f9" />
        {p.animate && !p.still ? (
          <animateMotion dur="3.4s" repeatCount="indefinite" path="M20 72 C58 16 92 88 130 40 C150 16 172 30 186 24" rotate="auto" />
        ) : (
          <animateMotion dur="1ms" path={stillPath} rotate="auto" />
        )}
      </g>
    </svg>
  );
}

export const SVG_SET = {
  "path-draw": SvgPathDraw,
  "morph": SvgMorph,
  "on-path": SvgOnPath,
  "follow": SvgFollow,
} as const;
