# portfolio — build context

Javier Ramos's developer "showroom": each exhibit shows both the shipped product AND how it was built with agentic workflows (PRD to implement to verify to deploy), backed by real GitHub activity. The portfolio is itself exhibit #1. Built in public, dogfooding the agentic-dev-kit.

Repo: https://github.com/jiramos87/portfolio (public). Kit: https://github.com/jiramos87/agentic-dev-kit (`~/projects/agentic-dev-kit`).

## Stack (locked)
- Monorepo: pnpm + Turborepo. `apps/web` (Next.js App Router) + `apps/api` (NestJS REST). `packages/*` shared.
- Postgres + Prisma. Hosting: Vercel (web) + Railway (api + db + a nightly GitHub-stats job).
- Reads: React Server Components fetch the Nest API server-to-server (API stays private, no CORS).
- Writes: public read, admin-only write. Admin writes go through a Next BFF (route handlers / server actions) holding a JWT; token in an httpOnly cookie. Single-admin JWT in Nest.
- Styling: Tailwind v4 + shadcn/ui in `apps/web`. Accent cyan `#22d3ee`. Dark-first + light toggle.

## Pages (all designed)
landing, `projects` (list), `projects/[slug]` (detail: product + "How I built this" = PRD + timeline + metrics), methodology (loop diagram + demo-video slot), design-system, contact (working form). Admin: low-polish CRUD.

## Data model (Prisma)
`Project` (slug, name, tagline, problem, stack[], toolsUsed[], liveUrl, repoUrl, repoPublic, prdUrl, prd, buildStory, metrics Json, timeline Json, screenshots[], status, kind WEB_APP|TOOLING|CASE_STUDY, featured, ...), `ActivitySnapshot` (nightly GitHub: totalContribs, calendar, languages, repoStats), `Lead` (contact form).

## Design handoff
`design-reference/` (in this repo, copied from the Claude Design bundle)
- `design-reference/globals.css` -> `apps/web/app/globals.css` (use as-is; Tailwind v4 `@theme inline`, shadcn token contract + extras).
- `javier-ramos-portfolio.standalone.html` = the visual source of truth (open it; click through all 6 pages via the nav).
- WARNING: the bundle's `README.md` is STALE (it predates round 2 and wrongly says 4 pages are "not designed"). Ignore its "Out of scope" section. All 6 pages ARE designed.
- Hero = Direction B (terminal / build-log). Drop the A/B toggle in the build.
- Keep `.dc.html` / `support.js` / standalone / `image-slot.js` in `design-reference/` (never shipped).
- Type: Geist + Geist Mono via `next/font`. Theme: `next-themes`, `defaultTheme="dark"`.

## Exhibits at launch (seed these)
1. portfolio (WEB_APP, public). 2. agentic-dev-kit (TOOLING, public). 3. territory-developer (CASE_STUDY, private code, public writeup + live game page).
Honesty: 1,863 GitHub contributions (last 12 mo) is the only real metric so far; commits/apps/Lighthouse are tagged placeholders/targets until live. No stars (repos new).

## The kit (dogfood it)
`~/projects/agentic-dev-kit`: skills (`prd`/`implement`/`verify`/`design-sync`) + an MCP server (`schema_introspect`, `scaffold_exhibit`, `deploy_status`). Copy the skills into `.claude/commands/` and register the MCP server when the Prisma schema exists.

## Build order (walk-list)
- M0: `create-turbo` monorepo (pnpm), base config packages.
- M1: `apps/api` Nest + Prisma + Postgres (Railway); Project + ActivitySnapshot + Lead models; migrate; seed the 3 exhibits + one activity snapshot.
- M2: public endpoints (`GET /projects`, `/:slug`, `GET /activity`, `POST /contact`, `/health`); RSC reads.
- M3: drop in `globals.css`; `npx shadcn@latest add ...`; wire Geist + next-themes (dark default).
- M4: build all 6 pages from the standalone (hero B; proof-by-numbers + activity heatmap; detail = tabs + Open-the-PRD + timeline + metrics).
- M5: custom domain (personal-name, e.g. javierramos.dev), OG/meta/sitemap/favicon. Ship phase 1a.
- M6-M8 (1b): auth + admin CRUD; design-system page; CI + tests + badges; automate the nightly GitHub job; meet Lighthouse >= 95.

## Next
Start M0.
