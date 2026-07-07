/**
 * Pure, deterministic markdown chunker for the Portfolio Agent corpus.
 *
 * Splits a source document at markdown headings, then packs each section's body
 * into chunks bounded by CHUNK_MAX_TOKENS. No I/O, no network: unit-testable on
 * its own so the ingest pipeline's idempotency rests on a proven core.
 *
 * Ids are deterministic (`{source}#{section-slug}`, with `-{n}` on duplicate
 * headings and `--p{i}` on a section that splits into multiple chunks) so a
 * re-ingest upserts the same rows instead of appending duplicates.
 */

export interface SourceDoc {
  /** Stable key used in chunk ids, e.g. `db:project/portfolio` or `docs/PRD.md`. */
  source: string;
  title: string;
  url?: string | null;
  markdown: string;
}

export interface Chunk {
  id: string;
  source: string;
  title: string;
  url: string | null;
  section: string;
  content: string;
  tokens: number;
}

/** Upper bound per chunk. ~500 tokens keeps a match precise but meaningful. */
export const CHUNK_MAX_TOKENS = 500;

/** Rough token estimate (no tokenizer dep): ~4 chars per token. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.trim().length / 4);
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

interface Section {
  heading: string;
  body: string;
}

/** Split markdown into sections at ATX headings. Preamble becomes an `intro` section. */
function splitSections(doc: SourceDoc): Section[] {
  const lines = doc.markdown.split('\n');
  const sections: Section[] = [];
  let heading = 'intro';
  let body: string[] = [];

  const flush = () => {
    const text = body.join('\n').trim();
    if (text.length > 0) sections.push({ heading, body: text });
    body = [];
  };

  for (const line of lines) {
    const m = /^#{1,6}\s+(.*)$/.exec(line);
    if (m) {
      flush();
      heading = m[1].trim() || 'section';
    } else {
      body.push(line);
    }
  }
  flush();
  return sections;
}

/** Greedily pack blank-line-separated blocks into <= max-token pieces. */
function packBody(body: string, maxTokens: number): string[] {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const pieces: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length > 0) pieces.push(current.join('\n\n'));
    current = [];
  };

  for (const block of blocks) {
    // A single oversize block: split by sentence, then hard-split as a last resort.
    if (estimateTokens(block) > maxTokens) {
      flush();
      for (const piece of splitOversize(block, maxTokens)) pieces.push(piece);
      continue;
    }
    const candidate = [...current, block].join('\n\n');
    if (estimateTokens(candidate) > maxTokens && current.length > 0) {
      flush();
      current = [block];
    } else {
      current.push(block);
    }
  }
  flush();
  return pieces;
}

function splitOversize(block: string, maxTokens: number): string[] {
  const maxChars = maxTokens * 4;
  const sentences = block.match(/[^.!?]+[.!?]+|\s*\S+\s*$/g) ?? [block];
  const pieces: string[] = [];
  let current = '';
  for (const s of sentences) {
    if (estimateTokens(current + s) > maxTokens && current.length > 0) {
      pieces.push(current.trim());
      current = '';
    }
    if (estimateTokens(s) > maxTokens) {
      // A single sentence longer than the bound: hard window on characters.
      for (let i = 0; i < s.length; i += maxChars) {
        pieces.push(s.slice(i, i + maxChars).trim());
      }
      current = '';
    } else {
      current += s;
    }
  }
  if (current.trim().length > 0) pieces.push(current.trim());
  return pieces.filter((p) => p.length > 0);
}

/** Chunk one document into deterministic, bounded pieces. */
export function chunkDoc(
  doc: SourceDoc,
  maxTokens = CHUNK_MAX_TOKENS,
): Chunk[] {
  const sections = splitSections(doc);
  const slugCounts = new Map<string, number>();
  const chunks: Chunk[] = [];

  for (const section of sections) {
    const slug = slugify(section.heading);
    const dup = slugCounts.get(slug) ?? 0;
    slugCounts.set(slug, dup + 1);
    const baseSlug = dup === 0 ? slug : `${slug}-${dup}`;

    const pieces = packBody(section.body, maxTokens);
    pieces.forEach((content, i) => {
      const id =
        pieces.length === 1
          ? `${doc.source}#${baseSlug}`
          : `${doc.source}#${baseSlug}--p${i}`;
      chunks.push({
        id,
        source: doc.source,
        title: doc.title,
        url: doc.url ?? null,
        section: section.heading,
        content,
        tokens: estimateTokens(content),
      });
    });
  }

  return chunks;
}

/** Chunk many documents. */
export function chunkDocs(
  docs: SourceDoc[],
  maxTokens = CHUNK_MAX_TOKENS,
): Chunk[] {
  return docs.flatMap((d) => chunkDoc(d, maxTokens));
}
