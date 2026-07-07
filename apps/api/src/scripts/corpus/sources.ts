/**
 * Gather the Portfolio Agent's public corpus sources into SourceDocs.
 *
 * Pinned sources (PRD "Corpus & data", B02): seeded Project rows, in-repo public
 * docs, the curated about-Javier fact sheet, and the agentic-dev-kit README via
 * GitHub raw. Everything here is public: nothing private is ingested.
 */
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import type { SourceDoc } from './chunker';
import type { PrismaClient } from '../../generated/prisma/client';

const GH = 'https://github.com/jiramos87';
const RAW_KIT_README =
  'https://raw.githubusercontent.com/jiramos87/agentic-dev-kit/main/README.md';

/** Repo root, resolved from this file at apps/api/src/scripts/corpus. */
export const REPO_ROOT = path.resolve(__dirname, '../../../../..');

/** In-repo doc files to ingest, repo-relative. Glob for docs/prd is expanded below. */
const DOC_FILES = [
  'README.md',
  'docs/PRD.md',
  'docs/build-plan.md',
  'docs/corpus/about-javier.md',
];

function firstHeading(markdown: string, fallback: string): string {
  const m = /^#{1,6}\s+(.*)$/m.exec(markdown);
  return m ? m[1].trim() : fallback;
}

/** Serialize a seeded Project row into a markdown doc for the corpus. */
function projectToDoc(p: {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  stack: string[];
  toolsUsed: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  prd: string | null;
  buildStory: string | null;
  metrics: unknown;
  timeline: unknown;
}): SourceDoc {
  const lines: string[] = [`# ${p.name}`, '', `## Tagline`, p.tagline, ''];
  lines.push('## Problem', p.problem, '');
  if (p.stack.length) lines.push('## Stack', p.stack.join(', '), '');
  if (p.toolsUsed.length)
    lines.push('## Tools used', p.toolsUsed.join(', '), '');
  if (p.buildStory) lines.push('## How it was built', p.buildStory, '');
  if (Array.isArray(p.metrics) && p.metrics.length) {
    const rows = (
      p.metrics as { label?: string; value?: string; kind?: string }[]
    )
      .map((m) => `- ${m.label}: ${m.value} (${m.kind})`)
      .join('\n');
    lines.push('## Metrics', rows, '');
  }
  if (Array.isArray(p.timeline) && p.timeline.length) {
    const rows = (p.timeline as { date?: string; label?: string }[])
      .map((t) => `- ${t.date}: ${t.label}`)
      .join('\n');
    lines.push('## Timeline', rows, '');
  }
  if (p.prd) lines.push('## Spec', p.prd, '');

  return {
    source: `db:project/${p.slug}`,
    title: p.name,
    url: p.liveUrl ?? p.repoUrl ?? null,
    markdown: lines.join('\n'),
  };
}

async function readDocFile(relPath: string): Promise<SourceDoc | null> {
  try {
    const abs = path.join(REPO_ROOT, relPath);
    const markdown = await fs.readFile(abs, 'utf8');
    if (markdown.trim().length === 0) return null;
    return {
      source: relPath,
      title: firstHeading(markdown, path.basename(relPath)),
      url: `${GH}/portfolio/blob/main/${relPath}`,
      markdown,
    };
  } catch {
    return null; // missing file: skip, do not touch its rows
  }
}

async function expandPrdDir(): Promise<string[]> {
  try {
    const dir = path.join(REPO_ROOT, 'docs/prd');
    const entries = await fs.readdir(dir);
    return entries.filter((f) => f.endsWith('.md')).map((f) => `docs/prd/${f}`);
  } catch {
    return [];
  }
}

async function fetchKitReadme(): Promise<SourceDoc | null> {
  try {
    const res = await fetch(RAW_KIT_README);
    if (!res.ok) return null;
    const markdown = await res.text();
    if (markdown.trim().length === 0) return null;
    return {
      source: 'agentic-dev-kit:README.md',
      title: firstHeading(markdown, 'agentic-dev-kit'),
      url: `${GH}/agentic-dev-kit/blob/main/README.md`,
      markdown,
    };
  } catch {
    return null;
  }
}

/** Collect every corpus source. Missing/unreachable sources are skipped, not fatal. */
export async function gatherSources(
  prisma: PrismaClient,
): Promise<SourceDoc[]> {
  const docs: SourceDoc[] = [];

  const projects = await prisma.project.findMany();
  for (const p of projects) docs.push(projectToDoc(p));

  const docPaths = [...DOC_FILES, ...(await expandPrdDir())];
  for (const rel of docPaths) {
    const doc = await readDocFile(rel);
    if (doc) docs.push(doc);
  }

  const kit = await fetchKitReadme();
  if (kit) docs.push(kit);

  return docs;
}
