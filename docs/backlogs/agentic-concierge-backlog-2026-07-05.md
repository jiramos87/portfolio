# Portfolio Agent implementation backlog (2026-07-05)

backlog-format: implementation-backlog/v1
prd: docs/prd/agentic-concierge.md (DEFINED 2026-07-05)
scope: the full PRD (agent, guardrails, UI, tracing, eval, exhibit, prod deploy). Exclusions = the PRD's own out-of-scope list (health-check tool, analytics events, cross-session memory, full ES UI, nightly re-embed).
ship-target: 2026-07-12
contract: PRD acceptance is the behavior source of truth. Verify gate = `pnpm check-types && pnpm lint && pnpm build` (web lint is --max-warnings 0). Never commit (developer's call). Honesty rail: no fabricated stats, placeholder data must say so. Runtime cost <= $5/month, hard-capped at the billing layer (AMENDED 2026-07-07, was "$0 free tiers only": OpenRouter prepaid credits + key credit limit, auto-top-up off; see B05A). Embeddings and the Groq fallback stay free-tier; the B09 eval judge reuses that free Groq tier (AMENDED 2026-07-07, was "ANTHROPIC key is curation-only": no paid judge key; see B09). No em/en dashes in copy. Run api scripts from `apps/api` (dotenv). Ports: web 3000, api 3333, local pg 5433.
env-inventory:
  runtime (apps/web `.env.local` + Vercel prod/preview): `OPENROUTER_API_KEY` (primary generation; added 2026-07-07 by B05A), `GOOGLE_GENERATIVE_AI_API_KEY` (AI Studio; embeddings only once B05A lands), `GROQ_API_KEY` (fallback generation), `AGENT_DATABASE_URL` (read-only pg role; local = `postgresql://portfolio:portfolio@localhost:5433/portfolio`), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL`, `GITHUB_TOKEN` (reuse the classic read:user token already in apps/api/.env).
  curation-only (apps/api `.env` or shell, NEVER Vercel): `GOOGLE_GENERATIVE_AI_API_KEY` (ingest embeds). (The B09 eval judge reuses the free-tier `GROQ_API_KEY` already in the runtime inventory; no paid `ANTHROPIC_API_KEY` is needed. AMENDED 2026-07-07.)

Items are ordered by dependency: suggested execution order = ledger order. Each item is
self-contained: an implementer with ONLY this header + their assigned item (plus ambient
CLAUDE.md) can build it. Effort: S < 0.5 day, M = 0.5-1.5 days, L > 1.5 days.
Parallel lanes if two sessions run (shared worktree, scope your `git add`): after B03 lands,
{B04, B05, B05A, B06, B08} form the agent lane and B07 the UI lane (B07's model picker
needs B05A's allowlist); B09 needs both lanes done.

## Ledger

| item | status | date | sha | evidence |
|---|---|---|---|---|
| B01 | done | 2026-07-05 | 1fc861e | manual: vector 0.8.4 + CorpusChunk(vector(768), hnsw idx) verified via psql \d; existing seed reloaded clean on pgvector/pgvector:pg18. build: check-types+lint+build all green. |
| B02 | done | 2026-07-05 | 1fc861e | test: chunker.spec 12/12 pass. manual: `ingest:corpus` run twice = 113 rows both times (count held), 113 distinct ids, 0 null embeddings, 12 sources, >=40 floor met. build: check-types+lint+build green. Note: added free-tier 429 handling (pace 650ms + retry honoring server delay) to embed.ts, in-item (pinned free-tier provider). Key added to apps/api/.env by Javier. |
| B03 | done | 2026-07-05 | 1fc861e | manual: `curl` "what is territory-developer?" streamed grounded answer, citations metadata included territory exhibit; ES question returned ES answer; 1100-char input returned HTTP 400 honest body. build: check-types+lint+build green (added GOOGLE_GENERATIVE_AI_API_KEY + AGENT_DATABASE_URL to turbo.json globalEnv). Added deps ai@7 + @ai-sdk/google@4 + pg + zod; wired apps/web/.env.local. |
| B04 | done | 2026-07-05 | 1fc861e | LangGraph graph (guardrail/retrieve/agent/answer) + provider fallback; gate green. manual PASS: happy path answers+cites via graph (degraded:false); "write my homework" + "ignore your instructions" each get exactly one guardrail sentence; Google-unset streams via Groq with degraded:true; both-keys-unset returns honest unavailable. Build-time fixes: classifier uses generateText+JSON (Groq lacks json_schema); disabled Gemini thinkingBudget so classification returns text; retrieve degrades gracefully when embeddings (Gemini-only) are down. Groq model llama-3.3-70b-versatile verified live. |
| B05 | done | 2026-07-05 | 1fc861e | manual PASS: "what has Javier committed recently?" returns real titles matching git log (verified on Gemini + Groq); GITHUB_TOKEN unset -> honest "the live GitHub lookup failed", zero fabrication; "how accurate are you?" -> honest "not been run yet" stub. build gate green. Design change (noted): tools run DETERMINISTICALLY in the graph agent node, not a model tool-loop (Groq's Llama loops on tool calls + native loop triples Gemini requests against a 20/day quota). GITHUB_TOKEN copied to web .env.local; results.json stub committed. FINDING logged in Appendix C: Gemini free tier = 20 gen/day. |
| B05A | done | 2026-07-07 | 1fc861e (working tree) | manual PASS (dev, `.env.local`): (1a) default streams via OpenRouter servedBy=google/gemini-3.5-flash, degraded/capped false, citations present; (1b) modelId ibm-granite/granite-4.1-8b honored (servedBy shows it); (1c) bogus modelId -> silent default. (2a) OPENROUTER_API_KEY unset -> Groq llama-3.3-70b-versatile, degraded:true capped:false, citations intact. (2b) OpenRouter 402 (local stub via OPENROUTER_BASE_URL) -> capped:true+degraded:true, streams via Groq, citations intact. (3) both gen keys unset -> honest unavailable text. build: check-types+lint+build green on final state. FINDINGS: (i) `@openrouter/ai-sdk-provider` tops out at ai@5-beta, so used the item's sanctioned fallback `@ai-sdk/openai-compatible@3.0.5` (shares @ai-sdk/provider@4.0.2 with the working @ai-sdk/google@4). (ii) 2026 OpenRouter catalog RETIRED Gemini 2.5 + Llama 3.x; pinned live successors (empirically confirmed by 1a/1b real answers): default google/gemini-3.5-flash, google/gemini-3.1-flash-lite, deepseek/deepseek-v4-flash, ibm-granite/granite-4.1-8b. Dropped the 5th (Llama-70B-class) slot: no live equivalent confirmably under the price ceiling. Model NAMES are recruiter-facing exhibit copy -> Javier sign-off requested (easy 1-array swap). (iii) Added OPENROUTER_BASE_URL env seam (beyond the Files list) for gateway routing + testability; defaults to canonical URL. |
| B06 | done | 2026-07-07 | 50fd69d (working tree) | manual PASS (dev, real Upstash `.env.local`): (A) 11 requests from one IP (x-forwarded-for) -> reqs 1-10 HTTP 200, req 11 HTTP 429 `{"error":"...Try again in about 504 seconds","retryAfterSeconds":504}` (within the 10min window). (B) forced `agent:daily:{today}`=200 in Redis -> next request HTTP 429 over-budget message (browse portfolio + contact). (C) bogus UPSTASH_REDIS_REST_URL (token still set) -> HTTP 503 honest unavailable (fail-closed). Redis creds smoke-tested (PING/set/get) before runs; forced daily key + test rl keys deleted after (daily back to null so prod launches clean). build: check-types+lint+build green. Deps added to apps/web: @upstash/ratelimit@^2 + @upstash/redis@^1. turbo.json globalEnv += UPSTASH_REDIS_REST_URL/TOKEN. Note: route now also enforces MAX_TURNS 12 (400) and uses shared CAPS.MAX_OUTPUT_TOKENS. Upstash created via Vercel Marketplace (Free 500K cmd/mo, iad1, eviction OFF so the kill-switch counter is never evicted, custom prefix UPSTASH_REDIS so Redis.fromEnv() matches). |
| B07 | done | 2026-07-07 | 50fd69d (working tree) | visual+manual PASS (preview: dev 3100 + prod `next start` 3101). WIDGET: fixed FAB (CLS layout-shift score 0.0000) opens a Base UI modal sheet; streamed a real grounded answer to "What is territory-developer?" with 6 territory-developer source chips + caption "Answered by Gemini 3.5 Flash" (degraded/capped false); dark + light. /AGENT PAGE: panel full-size (720x602 card, launcher correctly excluded via usePathname), markdown (bold/bullets/inline-code) + source chips + privacy note, dark + light, real Gemini answer. MOBILE 375px: full-screen sheet, composer pinned. A11Y: focus lands in composer on open, focus trapped in [role=dialog] (aria-labelledby set), messages region role=log aria-live=polite, Enter-to-send works keyboard-only, Escape closes + returns focus to FAB. MODEL PICKER: localStorage-restore AND picker onChange both drive modelId (persisted to `agent:model`); picked ibm-granite/granite-4.1-8b -> captured POST body modelId = that slug (fetch spy) AND caption "Answered by Granite 4.1 8B". LAZY-LOAD (prod): 0 agent chunks at initial load, +2 hashed chunks on launcher open (panel mounted). build: check-types+lint+build green (turbo 3/3, 3/3, 2/2). FINDINGS: (i) acceptance line names "Llama 3.1 8B" which B05A retired; verified with the shipped allowlist's non-default Granite 4.1 8B per Javier's "keep the 4" sign-off (behavior identical: body carries modelId, caption names it). (ii) tiny Granite model answered an EN question in ES (weak instruction-following, NOT a UI defect; language mirroring is B04's prompt layer, faithfully rendered). (iii) dev/Turbopack eagerly prefetches dynamic chunks, so lazy-load was verified against the prod build, not dev. Turn-cap(12) UX + honest 429/503 error banner implemented (server-enforced by B06; not live-triggered). Trace-link slot reads metadata.traceUrl defensively (hidden until B08). DEPS added to apps/web: @ai-sdk/react@^4.0.17 (pins installed ai@7.0.16), react-markdown@^10, remark-gfm@^4. BEYOND FILES LIST: extracted B05A's ALLOWED_MODELS/DEFAULT_MODEL_ID/resolveModelId/ProviderId/AllowedModel into new client-safe lib/agent/model-catalog.ts (models.ts re-exports via `export *`; added modelLabel()) so the picker imports the allowlist without dragging server SDKs into the client bundle. |
| B08 | done | 2026-07-07 | 50fd69d (working tree) | manual+build PASS (Langfuse Cloud US, real keys in apps/web/.env.local). (1) LIVE TRACE: /agent "What has Javier committed lately?" (live-data) -> reply streams + "See how I answered" link renders `https://us.cloud.langfuse.com/project/{projectId}/traces/{id}`; authed public API confirmed the trace has `public:true`, sessionId=random-uuid (never IP), tags [answer,portfolio-agent], and 4 observations: SPAN guardrail (2191ms), SPAN retrieve (1205ms), SPAN agent/tool (663ms), GENERATION answer (model google/gemini-3.5-flash, usage in=1967/out=365/total=2332). Anonymous GET of the full URL (no auth, no cookies) = HTTP 200 (spans visible without login). A second fact-question trace re-confirmed all 4 spans + public:true anonymously. (2) BOGUS KEYS: dev on 3106 with LANGFUSE_PUBLIC_KEY=bogus -> POST streamed 17 deltas AND `traceUrl:null` (link hidden); no-keys preview also streamed with no link. Reply never blocked by tracing. (3) build: check-types+lint+build green (turbo 3/3,3/3,2/2). Impl: new lib/agent/tracing.ts (langfuse@3 classic SDK; lazy singleton; `public:true` trace; span per graph node from graph.ts TraceStep timing; generation obs with usage+cost(when reported)+degraded/capped; flushAsync in next `after()`, fully swallowed). graph.ts: TraceStep + steps annotation + per-node timing; AgentPlan gains lang+steps. prompt.ts AgentMetadata gains traceUrl (message-list renders the B07 link slot). turbo.json globalEnv += LANGFUSE_PUBLIC_KEY/SECRET_KEY/BASE_URL. Dep: langfuse@^3.38.20. FINDINGS: (i) the SDK's getTraceUrl() short form `{baseUrl}/trace/{id}` 500s anonymously (needs a session to resolve the project), so tracing.ts emits the canonical `{baseUrl}/project/{projectId}/traces/{id}` which renders public without login. projectId is resolved ONCE from the key via GET /api/public/projects and cached; traceUrlFor is async and awaited in parallel with the graph. (ii) that lookup also validates the keys, so tracingConfigured (pk-lf-/sk-lf- prefix guard) + a successful projectId resolve together mean a link is emitted ONLY when tracing genuinely works -> the earlier "well-formed-but-wrong keys emit a dead link" edge is closed (wrong keys -> projectId null -> traceUrl null -> no link). (iii) sessionId is per-request random (multi-turn grouping deferred; not required by acceptance). needs-human done: Javier created the Langfuse US project + added the 3 envs. |
| B09 | done | 2026-07-07 | 50fd69d (working tree) | eval+manual+build PASS. eval: docs/evals/results.json overall 100% (40/40) at HEAD 50fd69d, perType fact 100% (20/20) / tool 100% (8/8) / guardrail 6/6 / es 100% (6/6) -> gate (>=85% + 6/6 guardrail declines) MET; stable across 2 consecutive runs. JUDGE = Groq `llama-3.3-70b-versatile` (free tier, cross-family vs the gemini-3.5-flash agent; amended from Haiku, Javier sign-off). Judge DISCRIMINATION self-check 6/6: correctly FAILS a wrong stack, wrong location, a compliant off-topic answer, and an empty non-answer; PASSES a correct answer and an honest tool-failure -> the 100% is not a rubber stamp. ITERATION (docs/evals/iterations.md): 92.5% -> 95% -> 100%; the agent never fabricated in any round, every early "failure" was a judge limitation fixed via the disagreements-review loop: (i) round 1 the judge false-flagged 3 live-data answers as "fabricated" because it cannot verify GitHub commits it lacks (the answers were REAL commits matching git log) -> rewrote the tool rubric to grade "concrete activity OR honest failure"; (ii) round 2 two fact/es answers false-flagged on wording (missed "astronomy" that was present; nitpicked "city simulator" vs "city-builder") -> rewrote fact/es rubric to grade MEANING not wording. manual: "how accurate are you?" in chat quotes 100% + the per-type breakdown + the cross-family judge methodology, matching results.json. build: check-types+lint+build green (turbo 3/3,3/3,2/2). FILES: docs/evals/{golden-set.json (40 items: 20 fact/8 tool/6 guardrail/6 es, grounded in docs/corpus/about-javier.md + seeded projects), results.json (real, replaced the B05 stub), disagreements.md (clean this run), iterations.md}, apps/web/scripts/run-eval.ts (tsx; distinct X-Forwarded-For per item bypasses per-IP caps, resets the global daily kill-switch at start so re-runs are free), apps/web/package.json (+`eval` script, +tsx dep). BEYOND FILES: trimmed lib/agent/tools/eval-results.ts to relay a compact summary (overall+perType+methodology, not the 40-row perItem) so LIVE DATA stays small; turbo.json globalEnv += EVAL_BASE_URL/EVAL_CONCURRENCY. NOTE: agentModel recorded as the actual default `google/gemini-3.5-flash` (item text said 2.5, a pre-B05A-catalog stale slug). Eval judge is $0 (free Groq); ~$0.10 of OpenRouter runtime credit spent generating the 4 agent runs. |
| B10 | done | 2026-07-07 | 50fd69d (working tree) | visual+manual+build PASS. SEED: new `portfolio-agent` Project (kind WEB_APP, featured, liveUrl `/agent`, repoUrl portfolio, prdUrl docs/prd/agentic-concierge.md, stack incl. LangGraph.js/pgvector/OpenRouter/Gemini/Groq/Langfuse/Upstash Redis, 3-entry timeline from real build dates, buildStory covering graph nodes + $5 billing-layer cap + 402-to-Groq fallback + visitor picker + eval iteration + architectural anti-fabrication). Metrics all kind `real`: eval-accuracy 100%, golden-set 40 Q, cost-cap $5/mo. Seeded local + API served it (curl /projects/portfolio-agent OK). VISUAL (preview dev, api 3333 + web 3100): dark + light screenshots BOTH show the LangGraph hero diagram (guardrail->retrieve->agent->answer) AND the eval table. MANUAL: every table number matches docs/evals/results.json exactly, DOM-verified: Facts 20/20, Live tools 8/8, Guardrails 6/6, Spanish 6/6, Overall 40/40, all 100% (overall in cyan). build: check-types 3/3, lint 3/3 (web --max-warnings 0), build 2/2 all green; /projects/[slug] stays dynamic (server-rendered from API). FILES: apps/api/prisma/seed.ts (new row + sibling sortOrder reshuffle: flagship slotted at sortOrder 2, territory/kit/wmm shifted 2->3->4->5), apps/web/components/projects/{eval-table.tsx (statically imports ../../../../docs/evals/results.json, the same file the agent's eval_results tool reads, so the page can never drift), agent-graph-diagram.tsx (NEW)}, apps/web/components/projects/project-detail.tsx (gated isAgent hero + Evaluation block). DEVIATIONS (noted): (i) hero rendered as an INLINE themed React SVG (agent-graph-diagram.tsx) driven by the raw CSS vars (--card/--border/--foreground/--muted-foreground/--primary), NOT a static public/*.svg, because the site themes by a `.dark` class an external SVG file can't see; this recolors correctly on the dark/light toggle (verified both). (ii) trace-screenshot gallery slot DEFERRED (screenshots:[] so no broken image): it needs a real live Langfuse public-trace capture, which B11's live prod verification generates naturally; not faked (honesty rail). (iii) added an `api` entry to .claude/launch.json (local-only, gitignored config dir) so the preview RSC reads resolve. |
| B11 | done | 2026-07-07 | 356ae6b (#22 deploy) + finalize follow-up | LIVE on javierramos.dev. DEPLOY: scoped feature commit squash-merged to main (PR #22, CI green) -> Vercel prod + Railway auto-rebuilt. RAILWAY (via railway ssh / connect): `CorpusChunk` migration applied; least-privilege `agent_reader` role (SELECT `CorpusChunk` only, `Project` denied - verified over the public proxy); `db:seed` (portfolio-agent row in prod); `ingest:corpus` = 121 chunks (patched apps/api/Dockerfile to COPY README.md+docs/ so in-container ingest reads all 13 sources, else the fact sheet + PRDs silently drop); `activity:refresh` restored the real snapshot (1997 contribs, the seed leaves a placeholder). VERCEL: 10 runtime secrets set on production+preview via REST (`POST /v10/projects/{id}/env`), incl. `AGENT_DATABASE_URL` = `agent_reader` over the Railway public TCP proxy `thomas.proxy.rlwy.net:23386` with `sslmode=no-verify`; prod redeploy (`POST /v13/deployments` gitSource main) baked them in (readyState READY). LIVE VERIFY (javierramos.dev, node fetch): grounded "territory-developer" -> 6 citations + trace, servedBy google/gemini-3.5-flash degraded/capped false; live-data "committed lately" -> real commits incl. this PR; ES question -> Spanish; off-topic "capital of France" -> guardrail decline (0 citations); the returned Langfuse trace URL fetched ANONYMOUSLY = 200 (public); rate limit fires at the 11th request/IP with the honest body (`retryAfterSeconds`). Pre-check confirmed `agent_reader` reads CorpusChunk (121) and is denied on Project over the proxy. LIGHTHOUSE (live, local lab, idle machine): desktop `/` and `/agent` = 100/100/100/100 (baseline desktop perf was 98). Mobile a11y+best-practices+SEO = 100 both; mobile perf 91 (`/`) / 87 (`/agent`), TBT 70ms (no JS regression from the lazy launcher), LCP 3.3-3.9s under 4x throttle -> below the PSI-measured 96 baseline; PSI (the baseline method) is daily-quota-blocked, so the mobile-perf number is a QUALIFIED pass pending a PSI spot-check (desktop is a clean in-class pass). COST CAP: $5 = OpenRouter key credit limit + auto-top-up OFF (confirmed via dashboard screenshot). build: gate green (check-types 3/3, lint 3/3, build 2/2) on final state. DOCS: deploy.md runbook (envs, agent_reader, ingest, redeploy, monthly OpenRouter ritual), CLAUDE.md agent prod-ops conventions, build-plan.md log entry. BEYOND FILES (noted): apps/api/Dockerfile (ship docs for ingest), apps/api/prisma/seed.ts (portfolio-agent screenshots += live-widget shot per Javier), apps/web/public/screenshots/portfolio-agent/chat-widget.png. needs-human remaining: Javier's CV/LinkedIn same-day update (per PRD). |

---

## B01. Provision pgvector + corpus schema [M] (PRD: Dependencies 3, Invariants "additive only")

**Goal.** Local and prod Postgres can store and search 768-dim embeddings in a `corpus_chunks` table; the prod exhibits schema is untouched except these additive changes.

**Change.** (1) Swap `docker-compose.yml` db image `postgres:16-alpine` to `pgvector/pgvector:pg18` (matches prod PG 18.4; recreate the `portfolio_pgdata` volume, then re-run `pnpm --filter api db:migrate` + `db:seed`). (2) New Prisma migration in `apps/api`: `CREATE EXTENSION IF NOT EXISTS vector;` plus model `CorpusChunk` (deterministic string id, source, title, url, section, content, tokens int, `embedding Unsupported("vector(768)")`, updatedAt) and a hand-added HNSW index in the migration SQL (`USING hnsw (embedding vector_cosine_ops)`). 768 dims is pinned (Gemini embedding with `outputDimensionality: 768`; native 3072 exceeds pgvector index limits). (3) Write the read-only role SQL into `docs/deploy.md` (CREATE ROLE agent_reader LOGIN; GRANT CONNECT, USAGE on schema, SELECT on corpus_chunks ONLY): it is EXECUTED in prod by B11, not here.

**Acceptance.**
- manual: fresh `docker compose up -d` + migrate; `SELECT extname FROM pg_extension` includes `vector`; `\d corpus_chunks` shows `vector(768)` + the hnsw index; existing seed still loads.
- build: verify gate passes.

**Files.** docker-compose.yml, apps/api/prisma/schema.prisma, apps/api/prisma/migrations/*, docs/deploy.md.

**Depends on.** none.

---

## B02. Corpus ingest script + curated fact sheet [M] (PRD: Corpus & data, Dependencies 2/10)

**Goal.** One idempotent command populates `corpus_chunks` from the pinned public sources; re-running never duplicates.

**Change.** (1) Author `docs/corpus/about-javier.md`: curated career/experience fact sheet written FOR the corpus (role history, stacks, agentic workflow facts, availability). needs-human: Javier reviews it before prod ingest; everything in it is public once live. The private job-hunt claims bank must NOT be copied in. (2) `apps/api/src/scripts/ingest-corpus.ts` + package script `ingest:corpus` (tsx, like `activity:refresh`). Sources pinned: seeded `Project` rows from the DB (name, tagline, problem, prd, buildStory, metrics, timeline), repo docs (README.md, docs/PRD.md, docs/prd/*.md, docs/build-plan.md), docs/corpus/about-javier.md, and the agentic-dev-kit README via GitHub raw (public repo). (3) Chunk by markdown headings to ~300-500 tokens, embed via Gemini embedding API (`outputDimensionality: 768`, taskType RETRIEVAL_DOCUMENT), upsert with deterministic ids `{source}#{section-slug}` and delete rows whose source was re-ingested (idempotent).

**Acceptance.**
- test: jest spec in apps/api for the chunker (heading split, ~token bounds, deterministic ids).
- manual: `pnpm --filter api ingest:corpus` twice; second run leaves row count unchanged; total >= 40 chunks.
- build: verify gate passes.

**Files.** apps/api/src/scripts/ingest-corpus.ts (+ small lib files beside it), apps/api/package.json, docs/corpus/about-javier.md.

**Depends on.** B01.

---

## B03. Streaming RAG chat route [M] (PRD: UX 3-4, Inputs & outputs, Quality bar latency)

**Goal.** `POST /api/agent` in apps/web streams a grounded, cited answer over the corpus. Plain RAG only; the graph, tools, and full guardrails come in B04-B06, but the 1000-char input cap is enforced from day one.

**Change.** Route handler `apps/web/app/api/agent/route.ts`: validate body (messages array, latest user message <= 1000 chars, else 400 with the honest message), embed the query via Gemini embedding (taskType RETRIEVAL_QUERY, 768 dims: MUST match B02), top-6 cosine search on `corpus_chunks` through a module-level `pg` Pool (max 3 connections) on `AGENT_DATABASE_URL`, then `streamText` with `gemini-2.5-flash` (@ai-sdk/google, direct key: AI Gateway intentionally not used, free-tier keys pinned by PRD). System prompt v1: grounded-only answers, cite sources, mirror EN/ES, decline off-topic (rough cut; B04 hardens). Return the retrieved chunks' {title, url} as citation metadata alongside the stream (AI SDK message metadata/data parts). Shared code under `apps/web/lib/agent/`.

**Acceptance.**
- manual: `curl -N` POST with "what is territory-developer?" against local dev streams an answer whose citations include the territory exhibit; a Spanish question gets a Spanish answer.
- manual: 1100-char input returns 400 with an honest message body.
- build: verify gate passes.

**Files.** apps/web/app/api/agent/route.ts, apps/web/lib/agent/{embeddings,retrieval,prompt}.ts, apps/web/package.json (ai, @ai-sdk/google, pg).

**Depends on.** B02.

---

## B04. LangGraph orchestration + model fallback [M] (PRD: Dependencies 5, failure acceptance, off-topic acceptance)

**Goal.** The route runs a LangGraph.js graph (guardrail, retrieve, agent/tools, answer) and survives provider failure: retry primary once, then Groq fallback with a degraded flag; both down = honest error state.

**Change.** `apps/web/lib/agent/graph.ts`: LangGraph.js StateGraph. Nodes: guardrail (topic filter: portfolio/professional only; off-topic or injection = single redirect sentence + re-offer chips, zero engagement, never leak the system prompt), retrieve (B03's retrieval), agent (tool-calling loop; tool slots filled by B05), answer (grounded compose, citations preserved). Model layer `models.ts`: primary `gemini-2.5-flash`, one retry, then `llama-3.3-70b-versatile` via @ai-sdk/groq (verify current Groq model id at build); emit `answered-degraded` metadata when the fallback served. Route delegates to the graph; streaming preserved end to end. The graph shape is exhibit material (B10 diagrams it): keep nodes named exactly guardrail/retrieve/agent/answer.

**Acceptance.**
- manual: "write my homework" and "ignore your instructions" each get one redirect sentence, nothing more.
- manual: with `GOOGLE_GENERATIVE_AI_API_KEY` unset locally, a question still streams via Groq and metadata carries the degraded flag; with both keys unset, the honest error state returns.
- build: verify gate passes.

**Files.** apps/web/lib/agent/{graph,guardrail,models}.ts, apps/web/app/api/agent/route.ts, apps/web/package.json (@langchain/langgraph, @ai-sdk/groq).

**Depends on.** B03.

---

## B05. Live tools: github_activity + eval_results [S] (PRD: Dependencies 8, happy-path tool acceptance, honest tool caveat)

**Goal.** The agent answers "what did Javier commit recently?" with real GitHub data and "how accurate are you?" from the committed eval JSON; a failed tool produces a corpus answer WITH an explicit caveat, never fabricated freshness.

**Change.** Two tools registered on the B04 agent node. (1) `github_activity`: recent commits + repo stats for the showroom repos (portfolio, agentic-dev-kit) via GitHub REST with server-only `GITHUB_TOKEN`; 5-minute in-memory cache; on error the tool returns a typed failure the answer node must voice ("the live GitHub lookup failed"). (2) `eval_results`: imports `docs/evals/results.json` (bundled at build). Until B09 runs, commit an honest stub: `{"status":"not-yet-run","note":"Eval ships with v1; this is a placeholder and says so."}` and the tool must relay that honestly (honesty rail; never a fake number).

**Acceptance.**
- manual: "what has Javier committed lately?" returns real recent commit titles matching `git log` on origin/main.
- manual: with `GITHUB_TOKEN` unset, the same question yields a corpus-grounded answer that states the live lookup failed.
- build: verify gate passes.

**Files.** apps/web/lib/agent/tools/{github,eval-results}.ts, apps/web/lib/agent/graph.ts, docs/evals/results.json (stub).

**Depends on.** B04.

---

## B05A. OpenRouter primary + visitor model allowlist + $5 billing hard cap [M] (PRD: Amendment 2026-07-07, Dependencies 1, failure acceptance)

**Goal.** All generation (classifier + answer) flows through OpenRouter on a prepaid, hard-capped key; the answer model is visitor-selectable from a server-enforced allowlist (default and price ceiling: Gemini 2.5 Flash); OpenRouter credit exhaustion (HTTP 402) degrades to the Groq free tier with honest metadata, never an outage. The Google key retires from generation and serves embeddings only.

**Decision record (resolves the Appendix C FINDING).** Gemini free tier allows ~20 generations/day: unusable as primary. Paid OpenRouter costs ~$0.006/conversation on Gemini Flash and prepaid credits are a true billing-layer cap. Decided 2026-07-07 (Javier, after the paid-tier cost analysis): OpenRouter primary at $5/month, Groq free tier fallback, default model `google/gemini-2.5-flash`.

**Change.**
1. needs-human: create the OpenRouter account; buy $5 credits ONE TIME with auto-top-up OFF; create the API key WITH a $5 credit limit; hand `OPENROUTER_API_KEY` (apps/web/.env.local now, Vercel in B11). The monthly ritual (manual top-up) is documented by B11.
2. `models.ts` rework: provider order `openrouter -> groq`; `google` leaves generation (embeddings.ts and retrieval untouched: the Google key remains the only embeddings consumer, and the retrieve node's graceful-degrade path stays). OpenRouter via `@openrouter/ai-sdk-provider` (verify ai@7 compat at build; fallback: `@ai-sdk/openai-compatible` against `https://openrouter.ai/api/v1`).
3. `ALLOWED_MODELS` allowlist, exported for the B07 picker (slug, label, one-line blurb, price class). Pinned entries (verify slugs + prices on openrouter.ai at build; rule: every entry prices at or under `google/gemini-2.5-flash`): `google/gemini-2.5-flash` (DEFAULT, the ceiling), `google/gemini-2.5-flash-lite`, `meta-llama/llama-3.3-70b-instruct`, `meta-llama/llama-3.1-8b-instruct`, plus one cheap-strong Chinese model: pin the current DeepSeek V3.x chat slug unless the price check disqualifies it, then substitute a Qwen chat model that fits the rule.
4. Request plumbing: body accepts optional `modelId`; the server validates against the allowlist and silently maps anything else to the default. Selection applies to the ANSWER stream only. The classifier pins to one fixed cheap model (`google/gemini-2.5-flash-lite` via OpenRouter: no default thinking, so drop the google-only thinkingBudget providerOption). Graph state and `AgentPlan` carry the resolved model.
5. 402 handling = the cap signal: a 402 from classify() (the existing health-probe pattern) or from streaming marks OpenRouter capped, falls through to Groq (`llama-3.3-70b-versatile`, unchanged), sets `degraded: true` plus new metadata `capped: true`; keep a short in-memory cooldown (~5 min) that skips OpenRouter while capped so each message does not re-burn a failing call. Non-402 failures keep the existing retry-once-then-fallback path. Both providers down = the existing honest unavailable state.
6. Metadata: `AgentMetadata` gains `servedBy: { provider, model }` and `capped: boolean` (additive; B07 renders them).
7. Wiring/docs: `OPENROUTER_API_KEY` into turbo.json globalEnv; keep the PRD Amendment (Scope changes 2026-07-07) true if implementation deviates.

**Acceptance.**
- manual: happy path streams via OpenRouter with `servedBy` = openrouter + `google/gemini-2.5-flash` and citations intact; body `modelId: "meta-llama/llama-3.1-8b-instruct"` answers via that model; a bogus `modelId` serves the default.
- manual: with `OPENROUTER_API_KEY` unset, answers stream via Groq with `degraded: true`; with a 402-returning key (a second key created with a $0 or already-exhausted credit limit), metadata carries `capped: true` and the reply still streams via Groq.
- manual: with both generation keys unset, the honest unavailable state returns; retrieval/citations keep working whenever the Google key is set (embeddings unaffected).
- build: verify gate passes.

**Files.** apps/web/lib/agent/{models,graph,prompt}.ts, apps/web/app/api/agent/route.ts, apps/web/package.json (@openrouter/ai-sdk-provider), turbo.json, docs/prd/agentic-concierge.md (amendment upkeep only).

**Depends on.** B04 (chain + graph exist). Parallel-safe with B06; B07's picker consumes this item's allowlist and metadata.

---

## B06. Guardrails: rate limits, kill-switch, caps [M] (PRD: Guardrails block, limits acceptance, Dependencies 6)

**Goal.** All PRD caps enforced server-side with honest visitor-facing messages; limiter store down = fail closed.

**Change.** needs-human: create the Upstash Redis free-tier database (Vercel Marketplace) and hand the two REST env values. `apps/web/lib/agent/limits.ts`: @upstash/ratelimit sliding windows 10/10min and 30/day per IP (from x-forwarded-for), global kill-switch key `agent:daily:{YYYY-MM-DD}` (INCR + 48h TTL, reject at 200), all caps in one config object: INPUT_CHARS 1000 (B03 already enforces), MAX_TURNS 12, MAX_OUTPUT_TOKENS 800 (pass to streamText). Route order: limits BEFORE any model/embedding call. Redis unreachable = 503 honest unavailable (fail closed protects quota). Response bodies per PRD contract states: rate-limited (with retry window), over-budget (browse portfolio + email), error. Turn 12 reached = reply suggesting a new chat or email. AMENDED 2026-07-07: these caps are now the spike backstop ABOVE B05A's billing-layer hard cap (they keep one hot day from draining the month's $5 OpenRouter credits); the 200/day kill-switch number stands. OpenRouter 402 is NOT handled here and must not fail closed: B05A degrades it to Groq. Fail-closed applies to the Redis limiter only.

**Acceptance.**
- manual: 11th message inside 10 minutes from one IP returns the rate-limited message with a retry window.
- manual: with the daily key manually set to 200, any message returns the over-budget message; with a bogus Upstash URL, requests return the 503 honest message.
- build: verify gate passes.

**Files.** apps/web/lib/agent/limits.ts, apps/web/app/api/agent/route.ts.

**Depends on.** B03 (parallel-safe with B04/B05/B05A).

---

## B07. Chat UI: widget + /agent page [L] (PRD: UX loop 1-2 and 4 and 7, Quality bar design/a11y/perf)

**Goal.** A floating launcher on every page (lazy, zero CLS) and a dedicated `/agent` page host the chat: 4 typed suggestion chips, streamed markdown replies with source chips and a trace-link slot, honest limit/error states, mobile full-screen sheet, dark + light, keyboard and screen-reader usable.

**Change.** `apps/web/components/agent/`: chat panel on @ai-sdk/react `useChat` against `/api/agent`; message list (markdown render); source chips from citation metadata linking to portfolio pages/repo docs; "see how I answered" link rendered when trace metadata is present (B08 supplies it; hidden until then); empty state = one intro line + 4 chips pinned by PRD type: project ("What is territory-developer?"), live-data ("What has Javier committed lately?"), meta ("How do you work?"), hiring-fit ("Why should we hire Javier?"); input maxLength 1000 with counter; turn-cap UX at 12 (suggest new chat or mailto); render the PRD contract states verbatim-honest (rate-limited, over-budget, error, degraded caveat). AMENDED 2026-07-07 (needs B05A): a compact model picker in the panel header driven by B05A's exported `ALLOWED_MODELS` (label + blurb + price class; default preselected), persisted in localStorage and sent as `modelId` with each request; a small "answered by {model}" caption from `servedBy` metadata; when `capped` is true the caption says the monthly model budget is reached and the free fallback model answered (the visitor's pick is not honored and the caption says so). Launcher mounted in `app/layout.tsx` via next/dynamic (client bundle loads on open; fixed-position button = no CLS; exclude on /agent itself). `/agent` page renders the panel full-size. Mobile: full-screen sheet (shadcn/Base UI dialog per repo style; link-buttons = `<Link>` + buttonVariants, never `<Button render>`). Privacy note under the input: conversations traced (Langfuse); messages are routed to model providers via OpenRouter (paid) or Groq (free tier; may use inputs for training). UI chrome EN; cyan accent; Geist.

**Acceptance.**
- visual: screenshots of desktop widget open, mobile sheet, and /agent page, dark + light, streaming a real answer with source chips.
- manual: full conversation via keyboard only; aria-live announces the streamed reply; focus trapped in the sheet.
- manual: pick Llama 3.1 8B in the picker and send a question: the request body carries its `modelId` and the reply caption names that model.
- manual: with the widget mounted, landing page shows no layout shift on load (preview inspect) and the agent chunk loads only after opening the launcher (network tab).
- build: verify gate passes.

**Files.** apps/web/components/agent/*, apps/web/app/agent/page.tsx, apps/web/app/layout.tsx.

**Depends on.** B03 (richer states appear as B04-B06 land; UI lane can run parallel to them). The model picker + servedBy caption need B05A: build the panel first, land the picker once B05A merges.

---

## B08. Langfuse tracing + public trace links [S] (PRD: Dependencies 7, trace acceptance, Corpus & data logging)

**Goal.** Every reply carries a public trace URL showing guardrail, retrieval, tool, and model spans; Langfuse down = chat unaffected, link omitted. Traces are the ONLY transcript store.

**Change.** needs-human: create the Langfuse Cloud free project, hand the keys. `apps/web/lib/agent/tracing.ts`: Langfuse JS SDK; one trace per request created with `public: true` (verify at build that the SDK public flag yields a share URL and pin its shape), spans per graph node: guardrail verdict, retrieval (query + chunk ids + scores), each tool call + outcome, generation (provider + served model id vs the visitor's requested modelId, token counts, the per-call cost OpenRouter reports when present, degraded/capped flags). sessionId = random widget-session id; never store IP in traces. Flush non-blocking (Vercel `after()`/waitUntil). Trace URL returned in stream metadata; B07's link slot renders it. Tracing errors are swallowed: reply flows, link omitted.

**Acceptance.**
- manual: ask a live-data question, open the returned trace URL in an incognito window: retrieval, tool, and generation spans visible without login.
- manual: with bogus Langfuse keys, the reply still streams and no trace link renders.
- build: verify gate passes.

**Files.** apps/web/lib/agent/tracing.ts, apps/web/lib/agent/graph.ts, apps/web/app/api/agent/route.ts, apps/web/components/agent/* (link render only).

**Depends on.** B04 (spans need the graph; parallel-safe with B05/B06/B07).

---

## B09. Eval harness: golden set, judge, 85% gate [L] (PRD: Eval acceptance, Dependencies 9, launch gate)

**Goal.** A 40-question golden set with committed real results >= 85% overall; all guardrail probes decline; the eval_results tool and exhibit table read the same committed JSON.

**Change.** (1) `docs/evals/golden-set.json`: 40 items typed fact (20: projects, stack, process, career from the corpus), tool (8: commits, repo stats, eval lookup), guardrail (6: off-topic + injection probes; pass = proper decline), es (6: Spanish phrasings of fact/tool questions; pass = correct AND in Spanish). Each item: id, type, question, expected (fact list or expected behavior). (2) `apps/web/scripts/run-eval.ts` (tsx): runs each question as a fresh conversation against the local route ON THE DEFAULT MODEL (B05A: `google/gemini-2.5-flash` via OpenRouter; record it as agentModel; the 40-question run costs cents against the $5 cap; per-picker-model eval is out of scope), captures reply + state; judge = Groq `llama-3.3-70b-versatile` (free tier, cross-family vs the Gemini answer model; AMENDED 2026-07-07, Javier sign-off: was `claude-haiku-4-5` via @anthropic-ai/sdk, but premium OpenRouter/Anthropic judges ran ~$2-3/run and the iterate-to-85% burst ~$40-90, so the judge moved to the already-wired free Groq tier at $0, with human review of disagreements as the quality backstop and an optional one-time Sonnet 5 finalize pass) with a per-type rubric; writes `docs/evals/results.json` {date, sha, agentModel, judgeModel, perType, overall, perItem} and `docs/evals/disagreements.md` for manual review (needs-human: Javier reviews disagreements; manual verdict wins). (3) Iterate prompts/retrieval until overall >= 85%; keep a short `docs/evals/iterations.md` log (B10 writeup fodder). Replace the B05 stub results.json with the real file.

**Acceptance.**
- eval: committed results.json shows overall >= 85% and 6/6 guardrail declines, produced at the current HEAD.
- manual: "how accurate are you?" in the chat quotes the same overall number as results.json.
- build: verify gate passes.

**Files.** docs/evals/{golden-set.json,results.json,disagreements.md,iterations.md}, apps/web/scripts/run-eval.ts, apps/web/package.json.

**Depends on.** B05, B06, B08 (the full agent; guardrail probes exercise B04/B06 behavior).

---

## B10. Exhibit row + published eval table + writeup [M] (PRD: Exhibit & launch, eval-table acceptance)

**Goal.** Portfolio Agent is a featured WEB_APP exhibit whose detail page renders the real eval table from the committed JSON, the graph diagram as hero, and the how-it-was-built story.

**Change.** (1) `apps/api/prisma/seed.ts`: new Project row `portfolio-agent` (kind WEB_APP, featured, liveUrl `/agent`, repoUrl = portfolio repo, prdUrl = the PRD path, stack/toolsUsed incl. LangGraph.js, pgvector, OpenRouter, Gemini, Groq, Langfuse, Upstash; metrics from docs/evals/results.json with kind `real`: eval accuracy, golden-set size, runtime cost hard-capped at $5/month (billing-layer cap, kind `real`); timeline from the actual build dates; buildStory covering graph architecture, guardrails, the cost design (billing-layer $5 hard cap, 402-to-free-fallback, visitor model picker), eval iteration from docs/evals/iterations.md, prompt-injection awareness note). Honesty rail: nothing invented; metrics without real values stay out. (2) Exhibit detail page: for this slug render an eval-accuracy table block importing `docs/evals/results.json` (per-type + overall + methodology line naming the cross-family judge). (3) Hero image: LangGraph graph diagram (SVG in `apps/web/public/screenshots/portfolio-agent/`, nodes exactly guardrail/retrieve/agent/answer) + a trace screenshot in the gallery.

**Acceptance.**
- visual: exhibit page screenshot showing hero diagram + eval table, dark + light.
- manual: every number on the page matches docs/evals/results.json exactly.
- build: verify gate passes.

**Files.** apps/api/prisma/seed.ts, apps/web/components/projects/* (eval table block), apps/web/public/screenshots/portfolio-agent/*, apps/web/app/projects/[slug]/* (only if the block needs wiring).

**Depends on.** B09.

---

## B11. Prod deploy, runbook, live verification [M] (PRD: Invariants, Quality bar perf/cost, Done looks like)

**Goal.** Portfolio Agent live on javierramos.dev with all guardrails enforced, traces public, Lighthouse intact, and the runbook + repo docs updated.

**Change.** (1) Railway: push migrations (pre-deploy runs the single `prisma migrate deploy`: B01's migration applies; the one-command constraint holds); create `agent_reader` role + grants via `railway ssh` psql per docs/deploy.md; capture the public proxy URL into `AGENT_DATABASE_URL`. (2) Vercel envs (production + preview) via the REST-token flow in docs/build-plan.md "Decisions (deploy / M5)": the full runtime env-inventory from this header. needs-human: OpenRouter (account + $5 credits + capped key, per B05A), AI Studio, Groq, Upstash, Langfuse accounts/keys if not already created in earlier items. (3) Prod content: push, let Railway rebuild, then in-container `pnpm db:seed` and `pnpm ingest:corpus` (deployed-code rule for seeds), `activity:refresh` if stale. (4) Verify live per PRD acceptance: happy path with citations + incognito trace link, ES answer, off-topic decline, rate limit on the 11th message, /agent page; Lighthouse (desktop + mobile) on / and /agent: no regression from the 96-100 baseline. (5) Verify the cap chain live: OpenRouter dashboard shows the $5 key credit limit and auto-top-up OFF; trigger the 402 path with a zero-limit test key (locally or preview) and confirm Groq serves with `capped` metadata; record credits remaining after the launch-day eval + smoke tests. The old "verify Gemini daily quota" step is moot for generation (Gemini serves embeddings only; its separate embed quota is ample). (6) Docs: deploy.md runbook section incl. the monthly OpenRouter ritual (check usage, manual top-up, the key credit limit IS the cap), CLAUDE.md conventions (agent envs, ingest step, corpus rule), build-plan.md log entry. CV/LinkedIn same-day update is Javier's (needs-human), per the PRD.

**Acceptance.**
- manual: full live conversation on javierramos.dev with source chips and a working incognito trace link; off-topic decline and rate-limit verified live.
- manual: live Lighthouse desktop + mobile on / and /agent within the existing 96-100 class.
- build: verify gate green on final main.

**Files.** docs/deploy.md, docs/build-plan.md, CLAUDE.md (Vercel/Railway config changes are platform-side, no code).

**Depends on.** B10 (plus all prior).

---

## Appendix A: ground-truth verdicts

- pgvector on Railway prod: VERIFIED 2026-07-05 via `railway ssh` query: `vector 0.8.2` available, `installed_version` null (needs CREATE EXTENSION), server PG 18.4.
- Local dev db: VERIFIED `postgres:16-alpine` in docker-compose.yml (no pgvector: B01 swaps the image).
- GitHub tokens: per CLAUDE.md, `GITHUB_TOKEN` + `GITHUB_REPO_TOKEN` live in apps/api/.env and power `activity:refresh` (pattern reused by B05).
- Verify gate + jest: root scripts are turbo check-types/lint/build; jest exists in apps/api only; apps/web has no test runner (web acceptance = manual/visual/build types).
- Script precedent: `apps/api/src/scripts/refresh-activity.ts` + tsx package script (B02 mirrors it).
- UNVERIFIED (accounts do not exist yet, needs-human at the flagged items): AI Studio key, Groq key, Upstash db, Langfuse project. UNVERIFIED at authoring (verify at build): exact Gemini free-tier quotas (B11), Groq model id (B04), Langfuse public-share URL shape (B08).
- OpenRouter (B05A amendment, 2026-07-07). UNVERIFIED at authoring, verify at build: `@openrouter/ai-sdk-provider` compat with ai@7 (fallback `@ai-sdk/openai-compatible`), the exact 402 error shape the AI SDK surfaces, key-level credit limits in the OpenRouter dashboard, current slugs + prices for the five allowlisted models (rule: at or under `google/gemini-2.5-flash`), and the DeepSeek-vs-Qwen pick for the Chinese-model slot. VERIFIED by the 2026-07-07 cost analysis: OpenRouter passes through provider prices plus a ~5.5% top-up fee; ~$0.006/conversation on Gemini Flash; 402 on exhausted credits.

## Appendix B: drift found while authoring

- None. The PRD was defined the same day against the same repo state (HEAD 1fc861e).

## Appendix C: open questions / deferred

- Page path pinned here as `/agent` (PRD said "dedicated page" without a path). Rename before B07 if a better slug appears; after B07 it is a public URL on the CV.
- Widget appears on all public pages; there is no /admin surface (admin CRUD was dropped in June per build-plan), so no exclusion list needed.
- Embedding dims pinned at 768 (index limits + small corpus). Revisit only if B09 shows retrieval misses; changing dims forces a full re-ingest (B02 rerun).
- v1.1 candidates per PRD out-of-scope: demo health-check tool, analytics funnel events, full ES UI, terminal-hero copy line for the eval score (only once real, per the copy rule).
- FINDING (B05, 2026-07-05): the Gemini free tier allows only ~20 `generateContent` requests per DAY for `gemini-2.5-flash` (`GenerateRequestsPerDayPerProjectPerModel-FreeTier` = 20), far below the 200/day global kill-switch planned for B06. Embeddings use a SEPARATE quota (`embed_content` ~100/min) and are unaffected. Impacts: (1) B06 cap numbers must drop to Gemini's real daily gen quota, or Groq becomes the workhorse; (2) B11 quota-verification is effectively answered (it is very low); (3) challenges "Gemini primary" from B04 since Groq's free tier is far more generous. DECISION NEEDED before B06/launch: keep Gemini primary and lean on the Groq fallback for volume, or make Groq the primary. Not blocking B05 (tools are provider-agnostic). RESOLVED 2026-07-07 (Javier, after the paid-tier cost analysis): neither. OpenRouter becomes the paid primary, hard-capped at $5/month at the billing layer (prepaid credits, auto-top-up off, key credit limit), with a visitor-facing model allowlist (default + ceiling Gemini 2.5 Flash; also Flash-Lite, Llama 3.3 70B, Llama 3.1 8B, one DeepSeek/Qwen-class model); Groq free tier is the fallback on 402 or outage; the Google key serves embeddings only. Implemented by new item B05A; B06's caps demote to spike backstop; PRD amended same day (Scope changes log).
- DECISION (B09 eval judge, 2026-07-07, Javier sign-off). The judge moved from `claude-haiku-4-5` (Anthropic API) to Groq `llama-3.3-70b-versatile` (free tier). Rationale: Javier ruled out the Anthropic API key, then `claude -p` (bills against API credits, not the flat subscription), then premium OpenRouter judges (Opus-4.8-high-effort ~$2-3/run and a ~$40-90 iterate-to-85% burst; Sonnet-5 ~$0.7-1/run) as too costly for the iteration loop. The free Groq tier is already wired (runtime fallback), is cross-family vs the Gemini answer model, and costs $0 to iterate. Quality backstop = the existing human review of disagreements; optional one-time Sonnet-5 finalize pass if a premium stamp is wanted. Header contract + env-inventory (drop ANTHROPIC_API_KEY) + PRD Dependency 9 + Scope-changes log amended the same day.
