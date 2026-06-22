import { cn } from "@/lib/utils";
import { tagStyle, type HonestyTag } from "@/lib/honesty";

/** Small mono uppercase honesty chip: REAL / NOW / TARGET / TECH / PLACEHOLDER. */
export function TagChip({
  tag,
  className,
}: {
  tag: HonestyTag;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide",
        tagStyle(tag).className,
        className,
      )}
    >
      {tag}
    </span>
  );
}
