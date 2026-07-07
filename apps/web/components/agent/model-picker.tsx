"use client";

import { ChevronDown } from "lucide-react";
import {
  ALLOWED_MODELS,
  type AllowedModel,
} from "@/lib/agent/model-catalog";
import { cn } from "@/lib/utils";

const PRICE_META: Record<
  AllowedModel["priceClass"],
  { word: string; dot: string }
> = {
  ceiling: { word: "price ceiling", dot: "bg-primary" },
  low: { word: "lower cost", dot: "bg-success" },
  lowest: { word: "cheapest", dot: "bg-muted-foreground" },
};

/**
 * Compact answer-model picker for the panel header. Native select (portal-free,
 * screen-reader friendly, safe inside the modal sheet); the selected model's
 * blurb and relative price tier show beneath it. Driven entirely by B05A's
 * ALLOWED_MODELS, so editing that array updates the picker.
 */
export function ModelPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const selected = ALLOWED_MODELS.find((m) => m.id === value) ?? ALLOWED_MODELS[0];
  if (!selected) return null; // ALLOWED_MODELS is never empty; satisfies noUncheckedIndexedAccess
  const price = PRICE_META[selected.priceClass];

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <label htmlFor="agent-model" className="shrink-0 text-xs text-muted-foreground">
          Model
        </label>
        <div className="relative min-w-0 flex-1">
          <select
            id="agent-model"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-7 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent pr-7 pl-2.5 text-xs font-medium text-foreground outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30",
            )}
          >
            {ALLOWED_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          <span aria-hidden className={cn("size-1.5 rounded-full", price.dot)} />
          {price.word}
        </span>
      </div>
      <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{selected.blurb}</p>
    </div>
  );
}
