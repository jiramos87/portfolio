import { cn } from "@/lib/utils";

/** Mono, uppercase, letter-spaced cyan eyebrow with an optional leading dot. */
export function Eyebrow({
  children,
  dot = true,
  className,
}: {
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary",
        className,
      )}
    >
      {dot ? <span aria-hidden className="text-primary">&#9679;</span> : null}
      {children}
    </p>
  );
}
