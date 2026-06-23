# portfolio — build context

Javier Ramos's developer "showroom": each exhibit shows both the shipped product AND how it was built with agentic workflows (PRD to implement to verify to deploy), backed by real GitHub activity. The portfolio is itself exhibit #1. Built in public, dogfooding the agentic-dev-kit.

Repo: https://github.com/jiramos87/portfolio (public). Kit: https://github.com/jiramos87/agentic-dev-kit (`~/projects/agentic-dev-kit`).

Companion docs: `docs/PRD.md` (requirements — what/why/acceptance), `docs/build-plan.md` (progress log). Per-feature PRDs go in `docs/prd/`.

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
Honesty (load-bearing — never fabricate a stat): GitHub contribution count + heatmap are now LIVE (`pnpm --filter api activity:refresh`, ~1.8k contribs). The language block is curated "primary stacks" chips, NOT raw bytes (generated `dist/`, the vendored `design-reference/` bundle, and a Unity game skew GitHub byte counts away from the real TypeScript). Metric `kind` (real|placeholder|target) drives UI treatment; commits/Lighthouse stay target/placeholder until real; no star counts.

## The kit (dogfood it)
`~/projects/agentic-dev-kit`: skills (`prd`/`implement`/`verify`/`design-sync`) + an MCP server (`schema_introspect`, `scaffold_exhibit`, `deploy_status`). Copy the skills into `.claude/commands/` and register the MCP server when the Prisma schema exists.

## Conventions & gotchas (learned in the build — don't re-derive)
- **Run the API from `apps/api`** so `dotenv` finds `.env`: `pnpm --filter api dev|start` / turbo. `node apps/api/dist/main.js` from the repo root → `DATABASE_URL` undefined → SASL error.
- **Ports:** web `3000`, API `3333` (3000/3001 are held by other local services on this machine); Postgres via `docker compose` on host `5433`.
- **Prisma 7:** datasource URL is in `prisma.config.ts` (NOT the schema); the runtime client needs a driver adapter (`@prisma/adapter-pg`). Generator `prisma-client`, `moduleFormat="cjs"`, output `src/generated/prisma` (gitignored; `postinstall` regenerates). API `tsconfig`: `incremental:false` + build `rootDir:"./src"` (else `deleteOutDir` + a stale `.tsbuildinfo` re-emit only the changed file).
- **pnpm 11 blocks postinstall scripts** — allowlist them in `pnpm-workspace.yaml` under `allowBuilds:` (sharp, unrs-resolver, @prisma/*, esbuild).
- **Verify gate:** `pnpm check-types && pnpm lint && pnpm build` (turbo). Web lint is `--max-warnings 0`. shadcn = the "base-nova" (Base UI) style — render link-buttons as `<Link>/<a>` + `buttonVariants(...)`, never `<Button render={<Link/>}>` (Base UI `nativeButton` console error).
- **Live activity:** `pnpm --filter api activity:refresh` writes a real `ActivitySnapshot`. Needs `GITHUB_TOKEN` (classic `read:user`) + `GITHUB_REPO_TOKEN` (fine-grained, Contents:read) in `apps/api/.env` (gitignored, server-only — never client/`NEXT_PUBLIC`).
- **Deploy (1a is LIVE):** web → Vercel `https://portfolio-nine-pearl-77.vercel.app` (project `portfolio`, team `jiramos87s-projects`, root dir `apps/web`, Git-connected → auto-deploys on push to `main`); API+Postgres → Railway `https://portfolio-production-ed5b.up.railway.app`. **Railway:** set `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, `DATABASE_URL=${{Postgres.DATABASE_URL}}`, healthcheck `/health`, no `PORT` (injected). Its **Pre-Deploy field ignores shell `&&`** — keep it to one `prisma migrate deploy`; run `db:seed`+`activity:refresh` via the Console tab/cron. **Vercel:** the MCP `deploy_to_vercel` is advisory-only + the CLI re-auths every sandboxed-shell call → drive via REST API with a short-lived gitignored `VERCEL_TOKEN` (`POST /v13/deployments` gitSource `{type:github,ref:main,repoId}`; env via `POST /v10/projects/{id}/env`). Full runbook + gotchas: `docs/build-plan.md` → "Decisions (deploy / M5)".
- **Docs map:** PRD `docs/PRD.md` · progress+decisions `docs/build-plan.md` · design spec `docs/m4-design-spec.md` · deploy `docs/deploy.md`. Per-feature PRDs → `docs/prd/`.
- **Commits:** clean, per-milestone (build-in-public timeline); push to origin only when explicitly asked.
- **Copy:** no em-dash (U+2014) in user-facing text or code comments; use commas, periods, or hyphens instead. Terminal hero log omits the verify (Lighthouse/CI) line until M6–M8 when real scores exist.

## Build order
Lives in `docs/build-plan.md` (milestones M0–M8 + progress). Not duplicated here — it's transient and goes stale.
