import { cn } from "@/lib/utils";

/**
 * The four starter prompts, one per PRD intent type (project, live-data, meta,
 * hiring-fit). Pinned copy: they double as the empty-state and as the eval
 * golden-set's fact/tool anchors.
 */
export const SUGGESTIONS = [
  { type: "project", text: "What is territory-developer?" },
  { type: "live-data", text: "What has Javier committed lately?" },
  { type: "meta", text: "How do you work?" },
  { type: "hiring-fit", text: "Why should we hire Javier?" },
] as const;

export function SuggestionChips({
  onPick,
  disabled,
}: {
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.type}
          type="button"
          onClick={() => onPick(s.text)}
          disabled={disabled}
          className={cn(
            "rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors",
            "hover:border-primary/50 hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {s.text}
        </button>
      ))}
    </div>
  );
}
