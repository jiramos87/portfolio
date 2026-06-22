# Portfolio — build plan & log

Source of truth for **requirements** (what + why + acceptance): [`docs/PRD.md`](PRD.md).
Source of truth for **stack / decisions / build order**: [`CLAUDE.md`](../CLAUDE.md).
Source of truth for **design**: `design-reference/javier-ramos-portfolio.standalone.html` (visual) + `design-reference/globals.css` (tokens, locked).
This file tracks **progress, decisions, and findings** as the build proceeds. Per-feature PRDs live in `docs/prd/`.

## Milestones

- [x] **M0 — Monorepo scaffold.** create-turbo (pnpm + Turborepo), `apps/web` (Next.js) + `apps/api` (NestJS), base config packages. Kit skills copied to `.claude/commands/`.
- [ ] **M1 — Backend foundation.** Nest + Prisma + Postgres; `Project` / `ActivitySnapshot` / `Lead` models; migrate; seed the 3 exhibits + one activity snapshot. Register the kit MCP server once the schema exists.
- [ ] **M2 — Public API + RSC reads.** `GET /projects`, `/projects/:slug`, `GET /activity`, `POST /contact`, `/health`. RSC fetch the Nest API server-to-server.
- [ ] **M3 — Design system wiring.** Drop in `globals.css`; `npx shadcn@latest add ...`; Geist + Geist Mono via `next/font`; `next-themes` (dark default).
- [ ] **M4 — Build all 6 pages** from the standalone (hero = Direction B / terminal build-log; no A/B toggle).
- [ ] **M5 — Ship phase 1a.** Custom domain, OG/meta/sitemap/favicon.
- [ ] **M6–M8 (1b).** Auth + admin CRUD; design-system page; CI + tests + badges; nightly GitHub-stats job; Lighthouse ≥ 95.

## Decisions (M0)

- **Toolchain:** Node 22.18 (Volta); pnpm **11.8.0** installed via Volta and pinned in `packageManager`.
- **Versions (scaffold defaults, latest):** Next.js **16.2** + React 19, NestJS **11**, Turborepo 2.9.
- **Ports:** web `3000`, api `3001` (api moved off 3000 to avoid clash).
- **Tailwind:** **v4** path — `globals.css` `@theme inline` drives tokens; the v3 `tailwind.config.ts` in `design-reference/` is the fallback, not used.
- **Build-scripts allowlist:** `sharp`, `unrs-resolver` enabled in `pnpm-workspace.yaml` (pnpm 11 blocks postinstall scripts by default).
- **turbo `build.outputs`:** added `dist/**` so the Nest build is cached.
- **DB for dev:** **local Docker Postgres** now; wire Railway later (at deploy / M5). [chosen 2026-06-22]
- **Kit:** skills `prd` / `implement` / `verify` / `design-sync` copied to `.claude/commands/`; templates to `.claude/templates/`. MCP server registration deferred to M1 (needs the Prisma schema).

## Log

- **2026-06-22 — M0 done.** Monorepo scaffolded; `pnpm build` green (web prod build + `nest build`). Design handoff committed (`958fffb`). Kit skills wired.
