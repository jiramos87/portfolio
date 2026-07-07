import {
  chunkDoc,
  estimateTokens,
  slugify,
  CHUNK_MAX_TOKENS,
  type SourceDoc,
} from './chunker';

describe('corpus chunker', () => {
  describe('slugify', () => {
    it('lowercases and hyphenates', () => {
      expect(slugify('How I Built This')).toBe('how-i-built-this');
    });
    it('collapses punctuation and trims', () => {
      expect(slugify('  Guardrails (non-negotiable!) ')).toBe(
        'guardrails-non-negotiable',
      );
    });
    it('falls back to "section" for empty input', () => {
      expect(slugify('###')).toBe('section');
    });
  });

  describe('heading split', () => {
    const doc: SourceDoc = {
      source: 'docs/example.md',
      title: 'Example',
      url: 'https://example.com',
      markdown: [
        'Intro paragraph before any heading.',
        '',
        '# First',
        'First body.',
        '',
        '## Second',
        'Second body.',
      ].join('\n'),
    };

    it('emits one chunk per heading plus the preamble', () => {
      const chunks = chunkDoc(doc);
      expect(chunks.map((c) => c.section)).toEqual([
        'intro',
        'First',
        'Second',
      ]);
    });

    it('carries source/title/url onto every chunk', () => {
      for (const c of chunkDoc(doc)) {
        expect(c.source).toBe('docs/example.md');
        expect(c.title).toBe('Example');
        expect(c.url).toBe('https://example.com');
      }
    });

    it('drops empty sections', () => {
      const empty: SourceDoc = {
        source: 's',
        title: 't',
        markdown: '# A\n\n# B\nreal content',
      };
      const chunks = chunkDoc(empty);
      expect(chunks.map((c) => c.section)).toEqual(['B']);
    });
  });

  describe('deterministic ids', () => {
    const doc: SourceDoc = {
      source: 'db:project/portfolio',
      title: 'Portfolio',
      markdown: '# Overview\nbody\n\n# Overview\nsecond same-named heading',
    };

    it('formats ids as {source}#{section-slug}', () => {
      const [first] = chunkDoc(doc);
      expect(first.id).toBe('db:project/portfolio#overview');
    });

    it('disambiguates duplicate headings deterministically', () => {
      const ids = chunkDoc(doc).map((c) => c.id);
      expect(ids).toEqual([
        'db:project/portfolio#overview',
        'db:project/portfolio#overview-1',
      ]);
    });

    it('is stable across runs on identical input', () => {
      expect(chunkDoc(doc).map((c) => c.id)).toEqual(
        chunkDoc(doc).map((c) => c.id),
      );
    });
  });

  describe('token bounds', () => {
    it('keeps every chunk within the max bound', () => {
      const para = 'word '.repeat(60).trim(); // ~75 tokens per paragraph
      const body = Array.from({ length: 20 }, () => para).join('\n\n');
      const doc: SourceDoc = {
        source: 'big.md',
        title: 'Big',
        markdown: `# Big Section\n${body}`,
      };
      const chunks = chunkDoc(doc);
      expect(chunks.length).toBeGreaterThan(1);
      for (const c of chunks) {
        expect(c.tokens).toBeLessThanOrEqual(CHUNK_MAX_TOKENS);
        expect(c.tokens).toBe(estimateTokens(c.content));
      }
    });

    it('splits an oversize section into multiple parts with --p{i} ids', () => {
      const para = 'word '.repeat(60).trim();
      const body = Array.from({ length: 20 }, () => para).join('\n\n');
      const doc: SourceDoc = {
        source: 'big.md',
        title: 'Big',
        markdown: `# Big Section\n${body}`,
      };
      const ids = chunkDoc(doc).map((c) => c.id);
      expect(ids[0]).toBe('big.md#big-section--p0');
      expect(new Set(ids).size).toBe(ids.length); // all unique
    });

    it('keeps a small section as a single chunk (no part suffix)', () => {
      const doc: SourceDoc = {
        source: 's.md',
        title: 'S',
        markdown: '# Tiny\njust a little text here',
      };
      const chunks = chunkDoc(doc);
      expect(chunks).toHaveLength(1);
      expect(chunks[0].id).toBe('s.md#tiny');
    });
  });
});
