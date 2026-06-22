# Portfolio — build plan & log

Source of truth for **requirements** (what + why + acceptance): [`docs/PRD.md`](PRD.md).
Source of truth for **stack / decisions / build order**: [`CLAUDE.md`](../CLAUDE.md).
Source of truth for **design**: `design-reference/javier-ramos-portfolio.standalone.html` (visual) + `design-reference/globals.css` (tokens, locked).
This file tracks **progress, decisions, and findings** as the build proceeds. Per-feature PRDs live in `docs/prd/`.

## Milestones

- [x] **M0 — Monorepo scaffold.** create-turbo (pnpm + Turborepo), `apps/web` (Next.js) + `apps/api` (NestJS), base config packages. Kit skills copied to `.claude/commands/`.
- [x] **M1 — Backend foundation.** Nest + Prisma + Postgres; `Project` / `ActivitySnapshot` / `Lead` models; migrate; seed the 3 exhibits + one activity snapshot. Kit MCP server registered (`.mcp.json`).
- [x] **M2 — Public API + RSC reads.** `GET /projects`, `/projects/:slug`, `GET /activity`, `POST /contact`, `/health`. RSC fetch the Nest API server-to-server.
- [x] **M3 — Design system wiring.** Tailwind v4 + `design-reference/globals.css` (tokens); shadcn initialized; Geist via `next/font/local`; `next-themes` (dark default). Verified visually (dark `#0a0e13` + cyan `#22d3ee`).
- [x] **M4 — Build all 6 pages** from the standalone (hero = Direction B / terminal build-log; no A/B toggle). Landing = proof-by-numbers + activity heatmap; detail = tabs + Open-the-PRD + timeline + metrics. Verified visually + working contact form (lead persisted).
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

## Decisions (M2)

- **Endpoints (Nest):** `GET /health` (pings DB), `GET /projects` (ordered featured→sortOrder), `GET /projects/:slug` (404 if missing), `GET /activity` (latest snapshot or null), `POST /contact`.
- **Validation:** global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted` + `transform`). Contact DTO via class-validator.
- **Abuse controls:** `@nestjs/throttler` global 60/min/IP; `POST /contact` tightened to 5/min. Honeypot field `company` (filled ⇒ 200 success but dropped). Client IP stored as a salted-free sha256 prefix (`ipHash`, 16 chars) — not PII.
- **Web reads:** `apps/web/lib/api.ts` — typed server-side client (`getProjects`/`getProject`/`getActivity`/`submitContact`) reading `INTERNAL_API_URL` (default `http://localhost:3333`), `revalidate: 60`. Reads are RSC server-to-server; the contact write will run through a Next server action (BFF) at M4.
- **Proof page:** `apps/web/app/page.tsx` replaced with a temporary `force-dynamic` RSC that lists exhibits + the 1,863 number — verified end-to-end (DB→API→HTML). Replaced by the designed landing at M4.
- **turbo `globalEnv`:** declared `INTERNAL_API_URL`, `DATABASE_URL`, `PORT`, `GITHUB_TOKEN` (satisfies `turbo/no-undeclared-env-vars` + cache correctness).
- **Run note:** start the API with cwd = `apps/api` (so `dotenv` finds `.env`) — `pnpm --filter api dev|start` / `turbo` do this; `node dist/main.js` from the repo root does NOT (DATABASE_URL goes undefined → SASL error).
- **Local port conflicts:** another local service holds 3000/3001 on this machine; web keeps the standard 3000 default (conflict is transient), API is on 3333.

## Decisions (M3)

- **Tailwind v4:** `@tailwindcss/postcss` + `postcss.config.mjs`; `app/globals.css` is the design token sheet copied **as-is** from `design-reference/` (the locked `@theme inline` + `:root`/`.dark` contract).
- **shadcn/ui:** `init -d` (style `base-nova`, base color neutral, `cssVariables`, RSC, `@/` alias). It rewrote `globals.css` and injected a Google-Geist font → both reverted (design tokens restored, single local-Geist setup kept). `lib/utils.ts` (`cn`) + `components/ui/button.tsx` added; more components added per page at M4.
- **Path alias:** `@/*` → `./*` in `apps/web/tsconfig.json` (shadcn + cleaner imports).
- **Fonts:** Geist + Geist Mono via `next/font/local` (the `*.woff` files the scaffold bundled), exposed as `--font-geist-sans` / `--font-geist-mono` (what the token sheet expects).
- **Theme:** `next-themes` `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}` (dark-first + manual toggle per PRD); `<html suppressHydrationWarning>`. `ThemeToggle` component proves it.
- **Preview tooling:** `.claude/launch.json` (web dev on 3100, gitignored — 3000 is occupied locally).

## Decisions (M4)

- **Source of truth:** rendered the standalone (it's a self-unpacking bundle — must run it, can't read source) and captured every page into `docs/m4-design-spec.md`. Built all 6 pages to it.
- **Design from the standalone resolved earlier gaps:** contact = `hello@javierramos.dev` + `linkedin.com/in/javier-ramos-humeres` + `github.com/jiramos87`; `territory-developer` is **Unity / C#**; refined exhibit copy/stacks. Seed reconciled to match (`apps/api/prisma/seed.ts`) + re-seeded.
- **Routes:** `/` (Work/landing), `/projects` (sortable table), `/projects/[slug]` (tabs: Product / How I built it / Metrics + timeline + Open-the-PRD), `/methodology`, `/design-system` (nav "System"), `/contact`. Shared `SiteNav` + `SiteFooter` in the root layout.
- **shadcn added:** card, badge, tabs, input, textarea, label, separator, table. Built on the "base-nova" (Base UI) style.
- **Button-as-link a11y:** Base UI's `Button` warns when rendered as a non-`<button>`. Navigational CTAs use `<Link>`/`<a>` + `buttonVariants({...})` className instead of `<Button render={<Link/>}>` — zero `nativeButton` warnings, identical visuals.
- **Contact write path:** browser → Next server action (`app/actions.ts`, the BFF) → `submitContact()` → Nest `POST /contact`. Verified end-to-end (lead persisted with hashed IP). Honeypot + success/error states.
- **Honesty in UI:** metric chips REAL/NOW (solid) vs TARGET/PLACEHOLDER (muted); activity heatmap + time chart render an explicit "live pull pending" empty state (no fabricated cells); language bars marked "approximate". No star counts.
- **Build resilience:** landing/projects wrap fetches in try/catch → honest defaults so prerender works without a live API. Home is dynamic; the rest static.
- **Known dev noise (not a defect):** Next 16 + React 19 dev logs "Encountered a script tag…" from RSC streaming — not from our code (grep-clean), absent in production builds.

## Open items (carried)

- **GitHub PAT** → unlock the real activity calendar + languages + per-exhibit timelines (replaces the "live pull pending" states). Drop as `GITHUB_TOKEN` in `apps/api/.env`.
- **Content gaps:** CV file; `territory-developer` live game URL; real screenshots per exhibit; the 60–90s methodology demo video.
- **Push policy:** committing locally per milestone; not pushing to `origin` until confirmed.

## Log

- **2026-06-22 — M0 done.** Monorepo scaffolded; `pnpm build` green (web prod build + `nest build`). Design handoff committed (`958fffb`). Kit skills wired.
- **2026-06-22 — M1 done.** Prisma schema + migration `init`; PrismaModule/Service on the pg adapter (boots + connects); seeded 3 exhibits + 1 activity snapshot (verified in Postgres); MCP server registered + smoke-tested. Full gate green (check-types / lint / build, web + api).
- **2026-06-22 — M2 done.** Nest endpoints (projects / activity / contact / health) with validation, throttle (5/min contact), honeypot — all verified live via curl (incl. 404, 400, 429). Web typed API client + temporary `force-dynamic` RSC home; verified end-to-end (exhibits + 1,863 rendered server-side). Gate green incl. api unit test.
- **2026-06-22 — M3 done.** Tailwind v4 + locked design tokens; shadcn initialized (button + cn); `next-themes` dark default + toggle; Geist via next/font. Gate green; screenshot confirms dark `#0a0e13` / cyan `#22d3ee` brand rendering with live data.
- **2026-06-22 — M4 done.** All 6 pages built from the standalone (hero Direction B 2-col, KPI strip, featured exhibits, method loop, activity proof, projects table, detail tabs + timeline, methodology, design-system, contact). Seed reconciled to the design. Verified each page via live preview screenshots; contact form persists a lead end-to-end. Full gate green (api + web).
