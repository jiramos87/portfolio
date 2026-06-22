# Portfolio — build plan & log

Source of truth for **requirements** (what + why + acceptance): [`docs/PRD.md`](PRD.md).
Source of truth for **stack / decisions / build order**: [`CLAUDE.md`](../CLAUDE.md).
Source of truth for **design**: `design-reference/javier-ramos-portfolio.standalone.html` (visual) + `design-reference/globals.css` (tokens, locked).
This file tracks **progress, decisions, and findings** as the build proceeds. Per-feature PRDs live in `docs/prd/`.

## Milestones

- [x] **M0 — Monorepo scaffold.** create-turbo (pnpm + Turborepo), `apps/web` (Next.js) + `apps/api` (NestJS), base config packages. Kit skills copied to `.claude/commands/`.
- [x] **M1 — Backend foundation.** Nest + Prisma + Postgres; `Project` / `ActivitySnapshot` / `Lead` models; migrate; seed the 3 exhibits + one activity snapshot. Kit MCP server registered (`.mcp.json`).
- [ ] **M2 — Public API + RSC reads.** `GET /projects`, `/projects/:slug`, `GET /activity`, `POST /contact`, `/health`. RSC fetch the Nest API server-to-server.
- [ ] **M3 — Design system wiring.** Drop in `globals.css`; `npx shadcn@latest add ...`; Geist + Geist Mono via `next/font`; `next-themes` (dark default).
- [ ] **M4 — Build all 6 pages** from the standalone (hero = Direction B / terminal build-log; no A/B toggle). Landing = proof-by-numbers + activity heatmap; detail = tabs + Open-the-PRD + timeline + metrics.
- [ ] **M5 — Ship phase 1a.** Custom domain (personal-name, e.g. javierramos.dev), OG/meta/sitemap/favicon.
- [ ] **M6–M8 (1b).** Auth + admin CRUD; design-system page; CI + tests + badges; nightly GitHub-stats job; Lighthouse ≥ 95.

## Decisions (M0)

- **Toolchain:** Node 22.18 (Volta); pnpm **11.8.0** installed via Volta and pinned in `packageManager`.
- **Versions (scaffold defaults, latest):** Next.js **16.2** + React 19, NestJS **11**, Turborepo 2.9.
- **Ports:** web `3000`, api `3333` (api started at 3001 but 3001 is held by another local service — a `bun` server; moved to 3333 in M1).
- **Tailwind:** **v4** path — `globals.css` `@theme inline` drives tokens; the v3 `tailwind.config.ts` in `design-reference/` is the fallback, not used.
- **Build-scripts allowlist:** `sharp`, `unrs-resolver` enabled in `pnpm-workspace.yaml` (pnpm 11 blocks postinstall scripts by default).
- **turbo `build.outputs`:** added `dist/**` so the Nest build is cached.
- **DB for dev:** **local Docker Postgres** now; wire Railway later (at deploy / M5). [chosen 2026-06-22]
- **Kit:** skills `prd` / `implement` / `verify` / `design-sync` copied to `.claude/commands/`; templates to `.claude/templates/`. MCP server registration deferred to M1 (needs the Prisma schema).

## Decisions (M1)

- **Postgres (dev):** `docker-compose.yml` → `postgres:16-alpine`, host port **5433** (avoids any local 5432), db/user/pass `portfolio`.
- **Prisma 7 + driver adapter:** Prisma 7 dropped `url` from the schema datasource → URL lives in `prisma.config.ts` (CLI) and the runtime client uses a **driver adapter** (`@prisma/adapter-pg` + `pg`). `PrismaService` constructs `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
- **Generator:** new `prisma-client` generator (v7 default) with `moduleFormat = "cjs"` (default ESM output breaks NestJS CJS), `output = "../src/generated/prisma"` (inside `src/` so `nest build` rootDir stays clean). Generated client is gitignored; `postinstall: prisma generate` regenerates it.
- **API tsconfig:** `incremental: false` (the stale `.tsbuildinfo` + `deleteOutDir` desync emitted only changed files); `tsconfig.build.json` pins `rootDir: ./src` + `include: ["src/**/*"]` so `dist/main.js` lands at the dist root.
- **Env loading:** `import 'dotenv/config'` at the top of `main.ts` (+ `dotenv` as a runtime dep); prod hosts inject env directly.
- **Seed honesty:** metrics carry `kind: real|placeholder|target`; the activity snapshot is `isPlaceholder: true` (real `totalContribs = 1863`, calendar/languages empty until the live GitHub pull). Idempotent (upsert by slug; placeholder snapshot replaced).
- **Build-scripts allowlist** (pnpm 11): `sharp`, `unrs-resolver`, `@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`.
- **MCP server:** registered project-scoped in `.mcp.json` (`node ${HOME}/projects/agentic-dev-kit/mcp-server/dist/index.js`); smoke-tested — advertises `schema_introspect`, `scaffold_exhibit`, `deploy_status`.

## Open items (carried)

- **GitHub PAT** → unlock real activity calendar + languages + per-exhibit timelines (replaces placeholders). Drop as `GITHUB_TOKEN` in `apps/api/.env`.
- **Content gaps:** contact email, LinkedIn URL, CV; `territory-developer` live game URL + real stack; real screenshots per exhibit.
- **Push policy:** committing locally per milestone; not pushing to `origin` until confirmed.

## Log

- **2026-06-22 — M0 done.** Monorepo scaffolded; `pnpm build` green (web prod build + `nest build`). Design handoff committed (`958fffb`). Kit skills wired.
- **2026-06-22 — M1 done.** Prisma schema + migration `init`; PrismaModule/Service on the pg adapter (boots + connects); seeded 3 exhibits + 1 activity snapshot (verified in Postgres); MCP server registered + smoke-tested. Full gate green (check-types / lint / build, web + api).
