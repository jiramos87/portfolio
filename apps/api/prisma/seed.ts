import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  ProjectKind,
  ProjectStatus,
} from '../src/generated/prisma/client';

/**
 * Seed the 3 launch exhibits + one activity snapshot. Content matches the
 * design (design-reference/ + docs/m4-design-spec.md).
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
    name: 'This Portfolio',
    tagline:
      'A full-stack showroom that presents the product and exactly how it was built with agents.',
    problem:
      'Most portfolios show only the finished product. This one shows the build too: the PRD, the commit/PR/deploy timeline, the metrics, and the agent-driven workflow behind each exhibit.',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma'],
    toolsUsed: ['Claude Code', 'MCP', 'PRD loop'],
    liveUrl: 'https://portfolio-nine-pearl-77.vercel.app',
    repoUrl: `${GH}/portfolio`,
    repoPublic: true,
    prdUrl: `${GH}/portfolio/blob/main/docs/PRD.md`,
    prd: null,
    buildStory:
      'Built in public by dogfooding the agentic-dev-kit: each milestone runs the PRD → implement → verify loop with Claude Code and a custom MCP server. This showroom is exhibit #1.',
    metrics: [
      {
        key: 'ship-time',
        label: 'Ship time',
        value: '<24h',
        kind: 'real',
      },
      {
        key: 'ai-cost',
        label: 'AI cost',
        value: '<$15',
        kind: 'real',
      },
      {
        key: 'cadence',
        label: 'Cadence',
        value: '~7/wk',
        kind: 'target',
      },
      {
        key: 'lighthouse',
        label: 'Lighthouse',
        value: '95+',
        kind: 'target',
      },
    ],
    timeline: [
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M3: design system wired (Tailwind v4 + tokens + shadcn)',
      },
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M2: public API + RSC reads',
      },
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M1: backend foundation (NestJS + Prisma + Postgres)',
      },
      {
        date: '2026-06-22',
        type: 'milestone',
        label: 'M0: monorepo scaffold (pnpm + Turborepo)',
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
    name: 'agentic-dev-kit',
    tagline:
      'Open-source Claude Code skills, an MCP server, and PRD templates for building TS / Nest / Next apps with agents.',
    problem:
      'Agentic coding is powerful but ad-hoc. This kit makes it repeatable: a PRD loop, a verify gate, design-sync, and project-introspection tools you can drop into any repo.',
    stack: ['TypeScript', 'Node.js', 'MCP'],
    toolsUsed: ['CC skills', 'MCP server', 'PRD templates'],
    liveUrl: null,
    repoUrl: `${GH}/agentic-dev-kit`,
    repoPublic: true,
    prdUrl: null,
    prd: null,
    buildStory:
      'A reusable toolkit extracted while building this portfolio: skills (prd / implement / verify / design-sync), an MCP server (schema introspection, exhibit scaffolding, deploy status), and PRD templates.',
    metrics: [{ key: 'ci', label: 'CI', value: 'green', kind: 'target' }],
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
    name: 'territory-developer',
    tagline:
      'A 2D isometric city-builder grounded in real simulation, built with a custom agentic pipeline. Public writeup, private code.',
    problem:
      'A case study in shipping a non-trivial game with an agent-driven workflow. The code stays private, but the process and the playable result are public.',
    stack: ['Unity', 'C#'],
    toolsUsed: ['Agentic pipeline', 'Claude Code', 'PRD loop'],
    liveUrl: null,
    repoUrl: null,
    repoPublic: false,
    prdUrl: null,
    prd: null,
    buildStory:
      'Case study: built with a custom agentic pipeline. Public writeup + a live game page; source remains private.',
    metrics: [],
    timeline: [],
    screenshots: [] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.CASE_STUDY,
    featured: false,
    shippedAt: null,
    sortOrder: 3,
  },
];

// Curated primary stacks ("what I build in"), not a byte breakdown. Matches
// CURATED_STACKS in src/github/github.ts; the live refresh overrides this anyway.
const languages = [
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'C#' },
  { name: 'Python' },
  { name: 'SQL' },
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
      languages, // design values; replaced by the nightly job once live
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
