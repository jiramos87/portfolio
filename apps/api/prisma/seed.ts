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
      'The showroom itself: a full-stack Next.js + NestJS app taken from spec to production in under 24 hours of agent-driven work.',
    problem:
      'Most portfolios show only the finished product. This one shows the build too: the PRD, the commit/PR/deploy timeline, the metrics, and the agent-driven workflow behind each exhibit.',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma'],
    toolsUsed: ['Claude Code', 'MCP', 'PRD loop'],
    liveUrl: 'https://javierramos.dev',
    repoUrl: `${GH}/portfolio`,
    repoPublic: true,
    prdUrl: `${GH}/portfolio/blob/main/docs/PRD.md`,
    ciUrl: `${GH}/portfolio/actions/workflows/ci.yml`,
    prd: null,
    buildStory:
      'Built in public by dogfooding the agentic-dev-kit: every milestone ran the PRD → implement → verify → reconcile loop with Claude Code and a custom MCP server. The PRD is public and kept honest against what actually shipped, scope changes logged, not hidden. This showroom is exhibit #1.',
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
        // Real Lighthouse on the live landing page (lighthouse 12.8.2):
        // desktop perf 98, mobile perf 96; Accessibility/Best Practices/SEO 100
        // on both. Range 96-100 covers every category on both form factors.
        key: 'lighthouse',
        label: 'Lighthouse',
        value: '96-100',
        kind: 'real',
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
    screenshots: [
      '/screenshots/landing.png',
      '/screenshots/methodology.png',
      '/screenshots/projects.png',
    ] as string[],
    status: ProjectStatus.IN_PROGRESS,
    kind: ProjectKind.WEB_APP,
    featured: true,
    shippedAt: null,
    sortOrder: 1,
  },
  {
    slug: 'portfolio-agent',
    name: 'Portfolio Agent',
    tagline:
      "This site's own concierge: a retrieval-augmented agent that answers questions about Javier, grounded in a curated corpus and live GitHub activity, with a published eval to back it.",
    problem:
      'A portfolio can claim seniority; it is harder to prove it. The Portfolio Agent turns the claim into a working system: a grounded, cited chat that only answers from a real corpus, refuses everything off topic, pulls live commit data, traces every reply in public, and publishes its own accuracy score so nothing has to be taken on faith.',
    stack: [
      'Next.js',
      'LangGraph.js',
      'pgvector',
      'OpenRouter',
      'Gemini',
      'Groq',
      'Langfuse',
      'Upstash Redis',
    ],
    toolsUsed: ['Claude Code', 'MCP', 'PRD loop'],
    liveUrl: '/agent',
    repoUrl: `${GH}/portfolio`,
    repoPublic: true,
    prdUrl: `${GH}/portfolio/blob/main/docs/prd/agentic-concierge.md`,
    ciUrl: null,
    prd: null,
    buildStory:
      "The Portfolio Agent runs as a LangGraph.js graph with four named nodes. The guardrail declines anything off topic or any prompt-injection attempt in a single redirect sentence, retrieve does a top-6 pgvector cosine search over the embedded corpus, the agent node runs deterministic tools (real GitHub commits, the published eval score), and answer composes a grounded, cited reply. Cost is engineered, not hoped for: all generation flows through OpenRouter on a prepaid key hard-capped at $5 a month at the billing layer, the visitor picks the answer model from a server-enforced allowlist, and if the credit is ever exhausted (an HTTP 402) the graph degrades to the Groq free tier with an honest caption instead of an outage. Every reply carries a public Langfuse trace with one span per node. The accuracy is measured, not asserted: a 40-question golden set (facts, live tools, guardrail probes, and Spanish) is graded by a free cross-family judge and published as a real table. The honest part is the iteration. The score moved from 92.5% to 100%, and every early miss was a judge limitation caught and fixed through a human review of disagreements, never a fabrication by the agent, whose anti-fabrication behavior is architectural: it answers from real tool output or says the lookup failed. Built in public with the agentic-dev-kit, one backlog item at a time, spec first.",
    metrics: [
      {
        // Real, from docs/evals/results.json (overall.pct at HEAD 50fd69d): the
        // published eval table on the detail page reads that same file, so this
        // headline number cannot drift from it. See docs/evals/iterations.md.
        key: 'eval-accuracy',
        label: 'Eval accuracy',
        value: '100%',
        kind: 'real',
      },
      {
        // Real: docs/evals/golden-set.json has 40 typed items (20 fact, 8 tool,
        // 6 guardrail, 6 es), all graded in results.json.
        key: 'golden-set',
        label: 'Golden set',
        value: '40 Q',
        kind: 'real',
      },
      {
        // Real billing-layer cap: OpenRouter prepaid key with a $5 credit limit
        // and auto-top-up off. Actual spend runs in cents; $5 is the hard ceiling.
        key: 'cost-cap',
        label: 'Cost cap',
        value: '$5/mo',
        kind: 'real',
      },
    ],
    timeline: [
      {
        date: '2026-07-07',
        type: 'milestone',
        label:
          'Chat UI, public Langfuse traces, and a published 100% eval (40-question golden set, cross-family judge)',
      },
      {
        date: '2026-07-07',
        type: 'milestone',
        label:
          'Cost + guardrails: OpenRouter primary hard-capped at $5/mo, Groq free fallback on 402, Upstash rate limits and kill-switch',
      },
      {
        date: '2026-07-05',
        type: 'milestone',
        label:
          'LangGraph graph (guardrail, retrieve, agent, answer) over a pgvector RAG corpus, streaming grounded cited answers',
      },
    ],
    screenshots: ['/screenshots/portfolio-agent/chat-widget.png'] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.WEB_APP,
    featured: true,
    shippedAt: null,
    sortOrder: 2,
  },
  {
    slug: 'world-music-map',
    name: 'World Music Map',
    tagline:
      'Explore the planet by sound: an interactive map where each curated place opens region-defining music, with full attribution built in.',
    problem:
      'Music discovery is usually by algorithm or genre, rarely by place. World Music Map flips it: an interactive map where each curated locale opens a drawer of region-defining music with genre and era context and always-visible attribution, so you can explore the planet by sound. It is honest about what it is: curated YouTube embeds, not a licensed catalog.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'MapLibre GL'],
    toolsUsed: ['Claude Code', 'MCP', 'prd-grill-me', 'PRD loop'],
    liveUrl: 'https://world-music-map.javierramos.dev',
    repoUrl: `${GH}/world-music-map`,
    repoPublic: true,
    prdUrl: `${GH}/world-music-map/blob/main/docs/prd/world-music-map.md`,
    prd: null,
    buildStory:
      'World Music Map started as a draft PRD grilled to DEFINED with /prd-grill-me, locking a discovery-first v1: media-per-locale at the center, influence-flow links deferred to v2. It ships as a single Next.js (App Router) + Prisma app, with no separate API since curation is agent-driven rather than user-written. A MapLibre GL map renders curated locales; clicking one opens a mobile-first drawer with a blurb, genre and era chips, and an official-channel YouTube embed with always-visible attribution. It runs its own world_music_map database on the same Postgres server as this portfolio, isolating its data while sharing infrastructure. S0 (skeleton) and S1 (deploy) are live with three marquee locales; the remaining slices (MapTiler basemap, genre/era filters, dead-embed fallback, archive.org enrichment, broader coverage, and polish) are mapped out in the build plan.',
    metrics: [
      { key: 'stage', label: 'Stage', value: 'S1 deployed', kind: 'real' },
      { key: 'locales', label: 'Locales live', value: '3', kind: 'real' },
      { key: 'coverage', label: 'v1 target', value: '~20 locales', kind: 'target' },
    ],
    timeline: [
      {
        date: '2026-06-24',
        type: 'milestone',
        label: 'S1: deployed live on Vercel (MapLibre GL, 3 marquee locales)',
      },
      {
        date: '2026-06-24',
        type: 'milestone',
        label: 'S0: skeleton (Next 16 App Router + Prisma 7 + own world_music_map DB)',
      },
      {
        date: '2026-06-24',
        type: 'milestone',
        label: 'v1 PRD grilled from draft to DEFINED (/prd-grill-me)',
      },
    ],
    screenshots: [
      '/screenshots/world-music-map/ss-1.webp',
      '/screenshots/world-music-map/ss-2.webp',
    ] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.WEB_APP,
    featured: true,
    shippedAt: null,
    sortOrder: 5,
  },
  {
    slug: 'agentic-dev-kit',
    name: 'agentic-dev-kit',
    tagline:
      'The open-source toolkit behind every exhibit: Claude Code skills, an MCP server, and PRD templates that make agentic building repeatable.',
    problem:
      'Agentic coding is powerful but ad-hoc. This kit makes it repeatable: a PRD loop, a verify gate, design-sync, spec reconciliation, and project-introspection tools you can drop into any repo.',
    stack: ['TypeScript', 'Node.js', 'MCP'],
    toolsUsed: ['CC skills', 'MCP server', 'PRD templates'],
    liveUrl: null,
    repoUrl: `${GH}/agentic-dev-kit`,
    repoPublic: true,
    prdUrl: null,
    prd: null,
    buildStory:
      'A reusable toolkit extracted while building this portfolio: skills (prd / prd-grill-me / implement / verify / design-sync / reconcile), an MCP server (schema introspection, exhibit scaffolding, deploy status), and PRD templates.',
    metrics: [{ key: 'ci', label: 'CI', value: 'green', kind: 'target' }],
    timeline: [],
    screenshots: [] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.TOOLING,
    featured: true,
    shippedAt: null,
    sortOrder: 4,
  },
  {
    slug: 'territory-developer',
    name: 'territory-developer',
    tagline:
      'A geography-first isometric city-builder, a year in the making, driven by a custom Unity-to-agent bridge. Public writeup, private code.',
    problem:
      'Most city builders place props; Territory grows cities from a real simulation constrained by geography (terrain, water, slopes), across both a city and a region scale. Building something this deep solo, at pace, meant the tooling had to be as serious as the game, so the project doubles as a working example of agent-native game development.',
    stack: ['Unity 2022', 'C#', 'Next.js', 'PostgreSQL', 'MCP'],
    toolsUsed: [
      'Claude Code (CLI + desktop)',
      'Cursor',
      'Custom unity-bridge MCP',
      'PRD / implement / verify skills',
    ],
    liveUrl: null,
    repoUrl: null,
    repoPublic: false,
    prdUrl: null,
    prd: null,
    buildStory:
      'Territory is a region-simulating, geography-first 2D isometric city builder (Unity 2022, C#) by Bacayo Studio. It is built with a custom agent-native pipeline: a dual MCP server pairs an information-architecture side (specs, rules, glossary, and backlog, all Postgres-backed) with a unity-bridge that lets Claude Code (CLI and desktop) and Cursor drive the Unity editor directly, entering Play Mode, running live tests, reading console and compile status, and capturing screenshots. Every feature runs the same PRD to implement to verify loop through custom skills (/prd, /implement, /verify, /commit), with markdown specs and a glossary as the single source of truth. Over 100 custom tools back the workflow.',
    metrics: [
      { key: 'stage', label: 'Stage', value: 'Beta MVP', kind: 'real' },
      { key: 'in-dev', label: 'In development', value: '~1 yr', kind: 'real' },
    ],
    timeline: [],
    screenshots: [
      '/screenshots/territory/residential.png',
      '/screenshots/territory/main-menu.png',
      '/screenshots/territory/region-map.png',
      '/screenshots/territory/found-city.png',
      '/screenshots/territory/city.png',
      '/screenshots/territory/city-budget.png',
    ] as string[],
    status: ProjectStatus.LIVE,
    kind: ProjectKind.CASE_STUDY,
    featured: true,
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
