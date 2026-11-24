import clsx from "clsx";

type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * PromptForge mark: a "P" cut from a single stem, with an ember struck below the bowl.
 * The P follows currentColor; the ember is always the brand orange.
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
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 5h8a7.5 7.5 0 0 1 0 15h-2.5v7H8V5ZM13.5 10v5h2.5a2.5 2.5 0 0 0 0-5h-2.5Z"
      />
      <path fill="#ff6a2b" d="m24 21.5 2.6 3.2-2.6 3.2-2.6-3.2 2.6-3.2Z" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  /** When false, renders the mark only. */
  showWordmark?: boolean;
};

/** Brand lockup used in the nav and footer. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <span className={clsx("block size-8 shrink-0 text-base-content", markClassName)}>
        <LogoMark />
      </span>
      {showWordmark ? (
        <span
          className={clsx(
            "font-display text-[1.15rem] font-bold tracking-[-0.02em]",
            wordmarkClassName,
          )}
        >
          PromptForge
        </span>
      ) : null}
    </span>
  );
}
