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
      {/* Rising prompt-sparks */}
      <path
        fill="currentColor"
        d="M16 2.2 19.35 6.15 16 10.1 12.65 6.15 16 2.2Z"
      />
      <path
        fill="currentColor"
        opacity="0.68"
        d="M8.85 7.6 11.2 10.35 8.85 13.1 6.5 10.35 8.85 7.6Z"
      />
      <path
        fill="currentColor"
        opacity="0.68"
        d="M23.15 7.6 25.5 10.35 23.15 13.1 20.8 10.35 23.15 7.6Z"
      />
      {/* Prompt beam into the face */}
      <path
        fill="currentColor"
        d="M15.05 9.85h1.9v4.4h-1.9z"
        opacity="0.88"
      />
      {/* Anvil: horn → face → heel */}
      <path
        fill="currentColor"
        d="M4.75 14.7h5.55l1.85 2.45h7.7l1.85-2.45h5.55v2.85h-3.55L21.2 20.7H10.8L8.3 17.55H4.75V14.7Z"
      />
      {/* Anvil waist + foot */}
      <path
        fill="currentColor"
        d="M12.35 20.7h7.3v2.85H22.4V27.2H9.6v-3.65h2.75V20.7Z"
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
          "grid size-9 shrink-0 place-items-center bg-primary p-1 text-primary-content",
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
