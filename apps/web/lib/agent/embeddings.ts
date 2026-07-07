/**
 * Query-side embedding for the Portfolio Agent (runtime).
 *
 * MUST match the ingest side (apps/api corpus embed): same model
 * `gemini-embedding-001`, same 768 dims. Only the taskType differs:
 * RETRIEVAL_QUERY here vs RETRIEVAL_DOCUMENT at ingest, so a short question
 * lands near the long passages that answer it.
 *
 * Reads GOOGLE_GENERATIVE_AI_API_KEY (runtime env, server-only).
 */

export const EMBED_MODEL = 'gemini-embedding-001';
export const EMBED_DIMS = 768;

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;

/** Embed a visitor's question to a 768-dim query vector. */
export async function embedQuery(text: string): Promise<number[]> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');

  const res = await fetch(`${ENDPOINT}?key=${key}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_QUERY',
      outputDimensionality: EMBED_DIMS,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini query embed failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { embedding?: { values?: number[] } };
  const values = json.embedding?.values;
  if (!Array.isArray(values) || values.length !== EMBED_DIMS) {
    throw new Error(
      `Gemini query embed returned ${values?.length ?? 'no'} dims, expected ${EMBED_DIMS}`,
    );
  }
  return values;
}

/** pgvector text literal for a vector. */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}
