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

## Portfolio Agent — prod deploy runbook (B11, LIVE 2026-07-07)

The agent is a Next route in `apps/web` (Vercel) that talks to Railway Postgres
(pgvector) directly for retrieval and to OpenRouter / Groq / Langfuse / Upstash
for generation, tracing, and limits. Everything below is the real launch
sequence; repeat the content steps whenever the seed or corpus changes.

### 1. Vercel runtime envs (production + preview)
Ten vars beyond the base `INTERNAL_API_URL` + `SITE_URL`. Set via the REST flow
(`POST /v10/projects/{projectId}/env?upsert=true&teamId=...`, `type:"encrypted"`,
`target:["production","preview"]`); a short-lived gitignored root `VERCEL_TOKEN`
authorizes it. Project `prj_VHk8KQIZFMhZzEnoHqE84WP61Ie8`, team
`team_J4GPo6SG9tvBJGiDk8Qa0H57`.

| Var | Value source |
|-----|--------------|
| `OPENROUTER_API_KEY` | OpenRouter, the $5-capped key (primary generation) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI Studio (query embeddings at retrieval time) |
| `GROQ_API_KEY` | Groq free tier (fallback generation + the eval judge) |
| `AGENT_DATABASE_URL` | `agent_reader` over the Railway public proxy (see below) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Upstash (rate limits + kill-switch) |
| `LANGFUSE_PUBLIC_KEY` / `_SECRET_KEY` / `_BASE_URL` | Langfuse Cloud (US) tracing |
| `GITHUB_TOKEN` | classic `read:user` (the `github_activity` tool) |

`AGENT_DATABASE_URL` = `postgresql://agent_reader:<pw>@<RAILWAY_TCP_PROXY_DOMAIN>:<RAILWAY_TCP_PROXY_PORT>/railway?sslmode=no-verify`.
Vercel is outside Railway's private network, so it connects over the Postgres
service's **public TCP proxy** (Postgres service → Variables → `RAILWAY_TCP_PROXY_DOMAIN` + `_PORT`);
`sslmode=no-verify` because the proxy presents a self-signed cert. The password is
the one generated when `agent_reader` was created (kept out of the repo).

### 2. Railway one-time DB setup
Run once against prod (via `railway connect Postgres`, piping the SQL in
`## Portfolio Agent — read-only DB role` above). `agent_reader` can `SELECT`
`CorpusChunk` ONLY (verified: `SELECT` on `Project` is denied). Re-run the
`GRANT SELECT ON "CorpusChunk"` after any migration that recreates the table.

### 3. Prod content (run after each deploy that changes seed or corpus)
The API Dockerfile now ships `README.md` + `docs/` into the image, so the
in-container corpus ingest reads the same sources as local (without them the
curated fact sheet and PRDs silently drop and the corpus is gutted). Sequence:
1. Push to `main` → Railway rebuilds; pre-deploy runs the single `prisma migrate deploy`.
2. `railway ssh -s portfolio "cd /app/apps/api && pnpm db:seed"` (adds/updates `portfolio-agent`).
3. `railway ssh -s portfolio "cd /app/apps/api && GOOGLE_GENERATIVE_AI_API_KEY=<key> pnpm ingest:corpus"` (embeds ~121 chunks; the key is curation-only, pass it inline or set it as a Railway var).
4. `railway ssh -s portfolio "cd /app/apps/api && pnpm activity:refresh"` — REQUIRED after a seed, because `db:seed` writes a placeholder activity snapshot; this restores the real one.

### 4. Redeploy web to bake envs
Vercel env changes only take effect on a fresh deploy: `POST /v13/deployments`
with `gitSource {type:github, ref:main, repoId:1277204237}`, then poll
`GET /v13/deployments/{id}` for `readyState:"READY"`.

### 5. Monthly OpenRouter ritual (the $5 cap)
The cap is the **key credit limit**, not a monthly reset. At
`openrouter.ai/settings/credits`: keep **auto top-up OFF**, check usage, and
manually top up ~$5 when the balance runs low. With auto-top-up off, spend can
never exceed the standing balance, so a hot day degrades to the Groq free tier
(HTTP 402 → `capped` metadata) instead of overspending.
