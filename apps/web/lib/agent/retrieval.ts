/**
 * Vector retrieval over the corpus (runtime, read-only).
 *
 * A module-level pg Pool (max 3) on AGENT_DATABASE_URL, reused across warm
 * serverless invocations (Fluid Compute) and HMR reloads via a global cache.
 * Cosine top-K against the HNSW-indexed CorpusChunk table.
 */
import { Pool } from 'pg';
import { embedQuery, toVectorLiteral } from './embeddings';

export interface RetrievedChunk {
  id: string;
  title: string;
  url: string | null;
  section: string | null;
  content: string;
  score: number;
}

const globalForPool = globalThis as unknown as { __agentPool?: Pool };

function getPool(): Pool {
  if (!globalForPool.__agentPool) {
    const connectionString = process.env.AGENT_DATABASE_URL;
    if (!connectionString) throw new Error('AGENT_DATABASE_URL is not set');
    globalForPool.__agentPool = new Pool({ connectionString, max: 3 });
  }
  return globalForPool.__agentPool;
}

/** Embed the question and return the top-K nearest corpus chunks by cosine similarity. */
export async function retrieve(question: string, k = 6): Promise<RetrievedChunk[]> {
  const vector = toVectorLiteral(await embedQuery(question));
  const { rows } = await getPool().query<RetrievedChunk>(
    `SELECT id, title, url, section, content,
            1 - (embedding <=> $1::vector) AS score
     FROM "CorpusChunk"
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [vector, k],
  );
  return rows;
}
