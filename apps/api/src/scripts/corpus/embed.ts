/**
 * Gemini embedding call for corpus ingest (curation-time only).
 *
 * Pinned: model `gemini-embedding-001`, outputDimensionality 768 (pgvector HNSW
 * index limit), taskType RETRIEVAL_DOCUMENT. The query side (apps/web) MUST use
 * the same model + dims with taskType RETRIEVAL_QUERY, or cosine search is noise.
 *
 * Needs GOOGLE_GENERATIVE_AI_API_KEY (AI Studio) in apps/api/.env. Curation-only:
 * never ship this key to Vercel/client.
 */

export const EMBED_MODEL = 'gemini-embedding-001';
export const EMBED_DIMS = 768;

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;

/** Free-tier embeddings cap at 100 req/min; pace calls to stay just under. */
export const EMBED_MIN_INTERVAL_MS = 650;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Pull the server's suggested wait (ms) out of a 429 body, if present. */
function parseRetryDelayMs(body: string): number | null {
  const m =
    /retry in ([\d.]+)s/i.exec(body) ?? /"retryDelay":\s*"(\d+)s"/i.exec(body);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) : null;
}

export function requireApiKey(): string {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) {
    throw new Error(
      'GOOGLE_GENERATIVE_AI_API_KEY is not set. It is curation-only: add it to apps/api/.env (AI Studio key). See docs/backlogs/agentic-concierge-backlog-2026-07-05.md B02.',
    );
  }
  return key;
}

/**
 * Embed one document chunk to a 768-dim vector. Retries on 429 (free-tier rate
 * limit), honoring the server's suggested delay. Throws on any other failure.
 */
export async function embedDocument(
  text: string,
  maxAttempts = 5,
): Promise<number[]> {
  const key = requireApiKey();
  const body = JSON.stringify({
    model: `models/${EMBED_MODEL}`,
    content: { parts: [{ text }] },
    taskType: 'RETRIEVAL_DOCUMENT',
    outputDimensionality: EMBED_DIMS,
  });

  for (let attempt = 1; ; attempt += 1) {
    const res = await fetch(`${ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });

    if (res.status === 429 && attempt < maxAttempts) {
      const detail = await res.text();
      const wait = parseRetryDelayMs(detail) ?? attempt * 2000;
      await sleep(wait + 500); // small cushion over the server's hint
      continue;
    }

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Gemini embed failed (${res.status}): ${detail}`);
    }

    const json = (await res.json()) as { embedding?: { values?: number[] } };
    const values = json.embedding?.values;
    if (!Array.isArray(values) || values.length !== EMBED_DIMS) {
      throw new Error(
        `Gemini embed returned ${values?.length ?? 'no'} dims, expected ${EMBED_DIMS}`,
      );
    }
    return values;
  }
}

/** pgvector text literal for a vector, e.g. `[0.1,0.2,...]`. */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}
