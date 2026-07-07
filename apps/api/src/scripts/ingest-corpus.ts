import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { chunkDoc, type Chunk } from './corpus/chunker';
import {
  EMBED_MIN_INTERVAL_MS,
  embedDocument,
  requireApiKey,
  sleep,
  toVectorLiteral,
} from './corpus/embed';
import { gatherSources } from './corpus/sources';

/**
 * Build-time corpus ingest for the Portfolio Agent.
 *
 * Gather public sources -> chunk by heading -> embed (Gemini, 768-dim) -> upsert
 * into CorpusChunk by deterministic id, then delete stale rows per re-ingested
 * source. Idempotent: run it twice, the corpus is identical.
 *
 * Run: `pnpm --filter api ingest:corpus`
 * Needs GOOGLE_GENERATIVE_AI_API_KEY (curation-only, apps/api/.env) and a reachable
 * Postgres with pgvector (local: docker compose, port 5433).
 */

/** Embedded text prepends the section heading so the vector carries that context. */
function embedText(chunk: Chunk): string {
  return `${chunk.title} — ${chunk.section}\n\n${chunk.content}`;
}

async function upsertChunk(
  prisma: PrismaClient,
  chunk: Chunk,
  embedding: number[],
): Promise<void> {
  await prisma.$executeRawUnsafe(
    `INSERT INTO "CorpusChunk" (id, source, title, url, section, content, tokens, embedding, "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector, NOW())
     ON CONFLICT (id) DO UPDATE SET
       source = EXCLUDED.source,
       title = EXCLUDED.title,
       url = EXCLUDED.url,
       section = EXCLUDED.section,
       content = EXCLUDED.content,
       tokens = EXCLUDED.tokens,
       embedding = EXCLUDED.embedding,
       "updatedAt" = NOW()`,
    chunk.id,
    chunk.source,
    chunk.title,
    chunk.url,
    chunk.section,
    chunk.content,
    chunk.tokens,
    toVectorLiteral(embedding),
  );
}

/** Remove rows for a re-ingested source whose ids are no longer produced. */
async function pruneSource(
  prisma: PrismaClient,
  source: string,
  keepIds: string[],
): Promise<number> {
  return prisma.$executeRawUnsafe(
    `DELETE FROM "CorpusChunk" WHERE source = $1 AND id <> ALL($2::text[])`,
    source,
    keepIds,
  );
}

async function main() {
  requireApiKey(); // fail fast before doing any work if the key is missing

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const docs = await gatherSources(prisma);
    const chunks = docs.flatMap((d) => chunkDoc(d));
    console.log(
      `Gathered ${docs.length} sources -> ${chunks.length} chunks. Embedding...`,
    );

    let embedded = 0;
    for (const chunk of chunks) {
      if (embedded > 0) await sleep(EMBED_MIN_INTERVAL_MS); // pace under 100 req/min
      const embedding = await embedDocument(embedText(chunk));
      await upsertChunk(prisma, chunk, embedding);
      embedded += 1;
      if (embedded % 10 === 0)
        console.log(`  embedded ${embedded}/${chunks.length}`);
    }

    // Prune stale rows per source (only sources we actually re-ingested).
    const idsBySource = new Map<string, string[]>();
    for (const c of chunks) {
      const list = idsBySource.get(c.source) ?? [];
      list.push(c.id);
      idsBySource.set(c.source, list);
    }
    let pruned = 0;
    for (const [source, keepIds] of idsBySource) {
      pruned += await pruneSource(prisma, source, keepIds);
    }

    const total = await prisma.corpusChunk.count();
    console.log(
      `Ingest complete: ${embedded} chunks embedded, ${pruned} stale rows pruned, ${total} rows total.`,
    );
    if (total < 40) {
      console.warn(
        `Warning: ${total} chunks is below the 40-chunk corpus floor (B02 acceptance).`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
