/**
 * Guardrail copy for the Portfolio Agent (B04).
 *
 * The topic classification lives in models.ts (classify). This module holds the
 * deterministic decline text: one redirect sentence that re-offers the
 * suggested questions and engages the off-topic request zero further. Fixed
 * strings, not a model call, so a decline is always exactly one sentence.
 */

export function declineText(lang: 'en' | 'es'): string {
  return lang === 'es'
    ? 'Solo respondo preguntas sobre Javier Ramos y su trabajo. Prueba una de las preguntas sugeridas o pregúntame por sus proyectos, su stack o cómo trabaja.'
    : 'I only answer questions about Javier Ramos and his work. Try one of the suggested questions, or ask me about his projects, his stack, or how he builds.';
}

export function unavailableText(): string {
  return 'The agent is temporarily unavailable. Please browse the portfolio or reach Javier through the contact page.';
}
