import clsx from "clsx";

type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * PromptForge brand mark — anvil + rising prompt-sparks.
 * Uses currentColor so it inherits chrome (e.g. primary-content on primary tile).
 */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("size-full", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* Central prompt spark */}
      <path
        d="M16 2.75 L19.1 6.5 L16 10.25 L12.9 6.5 Z"
        fill="currentColor"
      />
      {/* Side sparks */}
      <path
        d="M9.4 8 L11.55 10.55 L9.4 13.1 L7.25 10.55 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M22.6 8 L24.75 10.55 L22.6 13.1 L20.45 10.55 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Beam into the anvil face */}
      <rect x="15.15" y="10" width="1.7" height="4.75" fill="currentColor" opacity="0.9" />
      {/* Anvil: horn, face, waist, foot */}
      <path
        d="M5.5 15 H11 L12.75 17.35 H19.25 L21 15 H26.5 V17.65 H22.85 L21 20.35 H11 L9.15 17.65 H5.5 V15 Z"
        fill="currentColor"
      />
      <path
        d="M12.75 20.35 H19.25 V23.35 H22 V27 H10 V23.35 H12.75 V20.35 Z"
        fill="currentColor"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  /** When false, renders mark only (e.g. dense chrome). */
  showWordmark?: boolean;
};

/** Shared brand lockup used in nav + footer. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <span
        className={clsx(
          "grid size-9 shrink-0 place-items-center bg-primary p-1.5 text-primary-content",
          markClassName,
        )}
      >
        <LogoMark />
      </span>
      {showWordmark ? (
        <span
          className={clsx(
            "font-display text-lg font-bold tracking-tight",
            wordmarkClassName,
          )}
        >
          PromptForge
        </span>
      ) : null}
    </span>
  );
}
