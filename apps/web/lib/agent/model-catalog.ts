/**
 * Client-safe catalog of visitor-selectable models (the B05A allowlist data,
 * extracted here in B07). This module is PURE: no `ai`/provider imports, so the
 * chat UI's model picker can import the allowlist without dragging the server
 * SDKs (`@ai-sdk/openai-compatible`, `@ai-sdk/groq`) into the client bundle.
 * `models.ts` re-exports everything here, so the server pipeline keeps one
 * source of truth. Edit ALLOWED_MODELS to change the picker; the pipeline is
 * slug-agnostic.
 *
 * Slugs verified live on openrouter.ai (B05A, 2026-07-07): the 2026 catalog
 * retired Gemini 2.5 and Llama 3.x, so the picks map to their live successors.
 * Rule: every entry prices at or under the default (`google/gemini-3.5-flash`).
 */

export type ProviderId = 'openrouter' | 'groq';

/** A model the visitor may pick. All priced at or under the default (the ceiling). */
export interface AllowedModel {
  /** OpenRouter slug passed to the provider. */
  id: string;
  /** Short UI label. */
  label: string;
  /** One-line description for the picker. */
  blurb: string;
  /** Relative price tier for UI treatment (no hardcoded $ figures: they drift). */
  priceClass: 'ceiling' | 'low' | 'lowest';
}

/** The default and price ceiling: what a visitor gets before touching the picker. */
export const DEFAULT_MODEL_ID = 'google/gemini-3.5-flash';

export const ALLOWED_MODELS: AllowedModel[] = [
  {
    id: DEFAULT_MODEL_ID,
    label: 'Gemini 3.5 Flash',
    blurb: "Google's Flash workhorse. The default, and the price ceiling.",
    priceClass: 'ceiling',
  },
  {
    id: 'google/gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash-Lite',
    blurb: 'Lighter and faster Gemini Flash, for a fraction of the cost.',
    priceClass: 'low',
  },
  {
    id: 'deepseek/deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    blurb: 'A strong open model from China at rock-bottom pricing.',
    priceClass: 'lowest',
  },
  {
    id: 'ibm-granite/granite-4.1-8b',
    label: 'Granite 4.1 8B',
    blurb: 'A tiny open model, for contrast on the very same question.',
    priceClass: 'lowest',
  },
];

/** Validate a requested model against the allowlist; unknown/absent -> the default. */
export function resolveModelId(requested?: string | null): string {
  return requested && ALLOWED_MODELS.some((m) => m.id === requested)
    ? requested
    : DEFAULT_MODEL_ID;
}

/** Human label for a served model id: the picker label if known, else the raw slug. */
export function modelLabel(id: string): string {
  return ALLOWED_MODELS.find((m) => m.id === id)?.label ?? id;
}
