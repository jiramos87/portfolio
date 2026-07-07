# Deploy runbook — phase 1a

Architecture: **Vercel** hosts the web (Next.js); **Railway** hosts the API (NestJS) + Postgres. Web RSC fetch the API server-to-server (the API has a public URL but serves no CORS, so browsers can't call it cross-origin).

Everything below is ready in the repo — this is the one-time provision. Nothing here has been run yet (needs your accounts).

## 1. Railway — Postgres + API
1. New project → add **PostgreSQL**. Copy its connection string.
2. New service from this repo → **Dockerfile** at `apps/api/Dockerfile`, build context = repo root.
3. Service variables:
   - `DATABASE_URL` = the Railway Postgres URL
   - `PORT` = `3333` (or let Railway set it; the app reads `process.env.PORT`)
   - `GITHUB_TOKEN` = *(optional)* classic PAT `read:user` → live contribution count + heatmap
   - `GITHUB_REPO_TOKEN` = *(optional)* fine-grained PAT, Contents: read-only → repo stats
4. Release/one-off command after first deploy: `pnpm --filter api exec prisma migrate deploy` then `pnpm --filter api db:seed`.
5. Note the service's public URL (e.g. `https://portfolio-api.up.railway.app`).

## 2. Vercel — web
1. Import this repo. **Root Directory = `apps/web`** (Vercel detects Next + Turborepo; `vercel.json` pins the framework).
2. Environment variables:
   - `INTERNAL_API_URL` = the Railway API public URL (no trailing slash)
   - `SITE_URL` = `https://javierramos.dev` (your domain)
3. Deploy.

## 3. Domain + SEO (already wired in code)
- Point the domain (e.g. `javierramos.dev`) at Vercel.
- Favicon (`app/icon.svg`), OG image (`app/opengraph-image.tsx`), `sitemap.ts`, `robots.ts`, and full OG/Twitter metadata are in place and read `SITE_URL`.

## Local production check (no accounts needed)
```
docker build -f apps/api/Dockerfile -t portfolio-api .
docker run --rm -e DATABASE_URL=... -p 3333:3333 portfolio-api
pnpm --filter web build && pnpm --filter web start
```

## Portfolio Agent — read-only DB role (pgvector)

The Portfolio Agent's public chat route (`apps/web`) connects to Railway Postgres directly for
retrieval over `CorpusChunk`. It must use a role that can ONLY read that one table (least
privilege on a public endpoint), never the role the API uses for the rest of the schema. Run once
against the prod database (executed in B11, not at migration time):

```sql
CREATE ROLE agent_reader LOGIN PASSWORD '<generate a strong password>';
GRANT CONNECT ON DATABASE railway TO agent_reader; -- adjust db name if different
GRANT USAGE ON SCHEMA public TO agent_reader;
GRANT SELECT ON "CorpusChunk" TO agent_reader;
```

Build the `AGENT_DATABASE_URL` env var from the Railway public-proxy host/port with this role's
credentials (not the migration/seed role's `DATABASE_URL`). Re-run the `GRANT SELECT` after any
migration that recreates `CorpusChunk` (grants don't survive a `DROP TABLE`).

## Env reference
| Var | Where | Purpose |
|-----|-------|---------|
| `DATABASE_URL` | api | Postgres connection |
| `PORT` | api | listen port (default 3333) |
| `GITHUB_TOKEN` | api | optional — classic `read:user`, live count + heatmap |
| `GITHUB_REPO_TOKEN` | api | optional — fine-grained read-only, repo stats |
| `INTERNAL_API_URL` | web | base URL the RSC reads call |
| `SITE_URL` | web | canonical URL for metadata/sitemap/OG |
