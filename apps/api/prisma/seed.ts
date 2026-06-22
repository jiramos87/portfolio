import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  ProjectKind,
  ProjectStatus,
} from '../src/generated/prisma/client';

/**
 * Seed the 3 launch exhibits + one activity snapshot.
 *
 * Honesty principle (docs/PRD.md §3): only real numbers ship. Metrics carry a
 * `kind` of "real" | "placeholder" | "target"; the activity snapshot is flagged
 * `isPlaceholder` until the nightly GitHub job (M6–M8) writes live data.
 */

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const GH = 'https://github.com/jiramos87';

const projects = [
  {
    slug: 'portfolio',
    name: 'Portfolio Showroom',
    tagline:
      'A developer showroom that proves the product and the way it was built.',
    problem:
      'Most portfolios show only the finished product. This one shows the build too — the PRD, the commit/PR/deploy timeline, the metrics, and the agentic workflow behind each exhibit.',
    stack: [
      'Next.js',
      'NestJS',
      'Postgres',
      'Prisma',
      'TypeScript',
      'Tailwind CSS',
      'Turborepo',
    ],
    toolsUsed: ['Claude Code', 'MCP', 'PRD loop', 'Claude Design'],
    liveUrl: null,
    repoUrl: `${GH}/portfolio`,
    repoPublic: true,
    prdUrl: `${GH}/portfolio/blob/main/docs/PRD.md`,
    prd: null,
    buildStory:
      'Built in public by dogfooding the agentic-dev-kit: each milestone runs the PRD → implement → verify loop with Claude Code and a custom MCP server. This showroom is exhibit #1.',
    metrics: [
      {
        key: 'contributions',
        label: 'GitHub contributions (12 mo)',
        value: 1863,
        kind: 'real',
      },
      { key: 'commits', label: 'Commits', value: null, kind: 'placeholder' },
      {
        key: 'lighthouse',
        label: 'Lighthouse',
        value: 95,
        unit: '+',
        kind: 'target',
      },
    ],
    timeline: [
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M0 — monorepo scaffold (pnpm + Turborepo)',
      },
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M1 — backend foundation (NestJS + Prisma + Postgres)',
      },
    ],
    screenshots: [] as string[],
    status: ProjectStatus.IN_PROGRESS,
    kind: ProjectKind.WEB_APP,
    featured: true,
    shippedAt: null,
    sortOrder: 1,
  },
  {
    slug: 'agentic-dev-kit',
    name: 'Agentic Dev Kit',
    tagline:
      'Open-source Claude Code skills + an MCP server + PRD templates for agent-driven development.',
    problem:
      'Agentic coding is powerful but ad-hoc. This kit makes it repeatable: a PRD loop, a verify gate, design-sync, and project-introspection tools you can drop into any repo.',
    stack: ['TypeScript', 'Node.js', 'MCP'],
    toolsUsed: ['Claude Code', 'MCP'],
    liveUrl: null,
    repoUrl: `${GH}/agentic-dev-kit`,
    repoPublic: true,
    prdUrl: null,
    prd: null,
    buildStory:
      'A reusable toolkit extracted while building this portfolio: skills (prd / implement / verify / design-sync), an MCP server (schema introspection, exhibit scaffolding, deploy status), and PRD templates.',
    metrics: [
      { key: 'skills', label: 'Skills', value: 4, kind: 'real' },
      { key: 'mcpTools', label: 'MCP tools', value: 3, kind: 'real' },
      { key: 'stars', label: 'GitHub stars', value: null, kind: 'placeholder' },
    ],
    timeline: [],
    screenshots: [] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.TOOLING,
    featured: true,
    shippedAt: null,
    sortOrder: 2,
  },
  {
    slug: 'territory-developer',
    name: 'Territory Developer',
    tagline: 'A 2D isometric city-builder built with a custom agentic pipeline.',
    problem:
      'A case study in shipping a non-trivial game with an agent-driven workflow — the code stays private, but the process and the playable result are public.',
    stack: ['TypeScript'],
    toolsUsed: ['Claude Code', 'Custom agentic pipeline'],
    liveUrl: null,
    repoUrl: null,
    repoPublic: false,
    prdUrl: null,
    prd: null,
    buildStory:
      'Case study: built with a custom agentic pipeline. Public writeup + a live game page; source remains private.',
    metrics: [{ key: 'code', label: 'Code', value: 'Private', kind: 'real' }],
    timeline: [],
    screenshots: [] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.CASE_STUDY,
    featured: false,
    shippedAt: null,
    sortOrder: 3,
  },
];

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`  ✓ project: ${p.slug}`);
  }

  // Replace any prior placeholder snapshot so re-seeding stays idempotent.
  await prisma.activitySnapshot.deleteMany({ where: { isPlaceholder: true } });
  await prisma.activitySnapshot.create({
    data: {
      totalContribs: 1863, // real: last 12 months
      calendar: { note: 'pending live GitHub pull', weeks: [] },
      languages: [],
      repoStats: [],
      source: 'github',
      isPlaceholder: true,
    },
  });
  console.log('  ✓ activity snapshot (placeholder, totalContribs=1863)');
}

main()
  .then(async () => {
    console.log('Seed complete.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
