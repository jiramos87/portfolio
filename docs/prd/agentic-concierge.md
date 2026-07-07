# PRD: Portfolio Agent (agentic concierge)

Status: DEFINED (grilled 2026-07-05, 8 polling rounds, all 12 draft decisions plus 7 discovered gaps resolved; amended 2026-07-07: OpenRouter paid primary, $5/month billing hard cap, visitor model picker). Owner: Javier. Origin: `~/job-hunt/agentic-skills-roadmap.md` section 4, Option D (lead public flagship). Ship target: Sunday 2026-07-12. Slug stays `agentic-concierge`; the public-facing name is **Portfolio Agent** ("agent/agente" reads instantly in EN and ES; "concierge" does not).

## Why

The portfolio shows the work and how it was built; nothing on it lets a visitor interrogate it. An embedded agent that answers questions about the showroom projects turns every visit into a conversation, and becomes the strongest exhibit: the only one a visitor can ask about itself.

Strategic driver (job hunt): the 2026 market screens CVs by agentic framework names (LangGraph, RAG, evals, observability). This artifact earns those lines honestly, on the home stack, where recruiters already look. Primary audience: hiring managers and tech leads (trace-forward, technical depth on display); recruiters still get value from the plain answers. Explicitly NOT a plain RAG chatbot: it is an agent with tools, published traces, and a published eval. That is the seniority signal.

## User experience (the loop)

1. A visitor lands anywhere on javierramos.dev. A floating launcher (lazy-loaded, zero CLS) is present on all pages; a dedicated page hosts the same chat full-size and is the URL the exhibit, CV, and LinkedIn deep-link to. On mobile the widget opens as a full-screen sheet.
2. Empty state shows a one-line intro and 4 curated suggestion chips, one of each type: a project question, a live-data question ("what has Javier committed lately?"), a meta question ("how do you work?"), and a hiring-fit question.
3. The visitor asks in English or Spanish. The reply streams in, in the visitor's language (EN/ES mirror; UI chrome stays EN, citations stay EN). A compact picker lets the visitor choose which model answers (server-enforced allowlist, price ceiling Gemini 2.5 Flash); a caption names the model that served each reply.
4. Every answer carries compact source chips (portfolio page / repo doc the answer is grounded in) and a "see how I answered" link that opens the public trace for that exact reply (retrieval, tool calls, timings).
5. Questions that need live data trigger tools (GitHub commits/stats, eval-results lookup) and the answer reflects real current data.
6. Off-topic or abusive prompts get one friendly sentence redirecting to the portfolio plus the suggestion chips, and nothing more.
7. The conversation continues multi-turn within the session up to the turn cap, then the agent suggests starting a new chat or emailing Javier.

## Inputs & outputs (the contract)

- Inputs: a visitor message (max 1000 characters, EN or ES), plus the in-session conversation history (client-held; no server session state). No auth, no PII requested.
- Outputs: a streamed markdown reply (max ~800 output tokens) in one of these states:
  - `answered`: grounded answer + 0..n source chips + trace link.
  - `answered-degraded`: same, but with an honest caveat that a live tool failed, or served by the fallback model (including the capped case: monthly model budget spent, the free fallback answers, and the visitor's model pick is not honored; the UI says so).
  - `declined`: one-line off-topic redirect + chips.
  - `rate-limited`: honest static message with the retry window.
  - `over-budget`: honest static message (daily/monthly cap reached) pointing to the static portfolio and Javier's email.
  - `error`: honest failure message after retry and fallback are both exhausted.

## Dependencies (each one: approach / fallback / cost & quota / runs when)

1. **LLM.** (AMENDED 2026-07-07) OpenRouter, prepaid, is the primary for ALL generation: the answer streams on a visitor-selectable model from a server-enforced allowlist (default and price ceiling: Gemini 2.5 Flash; also Flash-Lite, Llama 3.3 70B, Llama 3.1 8B, one DeepSeek/Qwen-class model), the classifier pins to one fixed cheap model. Hard cap: $5/month of prepaid credits with auto-top-up OFF plus a key credit limit; credit exhaustion returns HTTP 402 and the app degrades instead of dying. Fallback: Groq free tier (Llama 3.3 70B), entered after one retry of the primary or immediately on 402 (honest capped caveat). Supersedes the free-tier-primary plan: the Gemini free tier proved to allow only ~20 generations/day (B05 finding), and ~$0.006/conversation on Flash makes $5/month cover 700+ conversations. Runtime.
2. **Embeddings.** Gemini embedding API, free tier (the Google key's only runtime job after the 2026-07-07 amendment); the SAME model embeds at ingest and at query time. Fallback (documented, not built): transformers.js MiniLM, which requires re-embedding the corpus (different dimensions). Cost $0. Curation time (ingest) AND runtime (query embedding, one call per question).
3. **Vector store.** Railway Postgres + pgvector. VERIFIED 2026-07-05: extension `vector 0.8.2` available on the prod instance (PG 18.4), needs one `CREATE EXTENSION`. Additive table(s) only; a read-only DB role scoped to the vector tables is used by the web app. Fallback: Neon free tier. Cost: $0 marginal. Local dev: swap compose image `postgres:16-alpine` to a `pgvector/pgvector` image (dev DB is seedable; recreate the volume). Curation-time writes, runtime reads.
4. **DB path from Vercel.** Direct connection from the Next route handler using a Railway public-proxy URL env var holding the read-only role. Fallback: a retrieval endpoint on Nest (server-to-server) if the direct path misbehaves. Runtime.
5. **Orchestration.** LangGraph.js graph (guardrail, retrieve, tool, answer nodes) behind a Vercel AI SDK streaming route handler in `apps/web`. Both MIT/Apache licensed, $0. This is a documented exception to the RSC-to-Nest read convention (streaming public chat is a different animal from page data reads). Runtime.
6. **Rate limiting.** Upstash Redis free tier (Vercel Marketplace) with `@upstash/ratelimit`; also holds the global daily kill-switch counter. If the limiter store is unreachable, fail CLOSED with the honest unavailable message (protecting quota beats availability here). Cost $0 (free tier far exceeds this traffic). Runtime.
7. **Tracing.** Langfuse Cloud free tier, async and non-blocking. Per-reply public share link showing the full real trace. If Langfuse is down, chat still works and the trace link is omitted for that reply. Cost $0 at this volume. Runtime.
8. **GitHub tool.** Existing server-only token patterns (`GITHUB_TOKEN`, `GITHUB_REPO_TOKEN`); authenticated quota 5k req/hr, trivially sufficient. On failure: answer from corpus with the honest caveat. Runtime.
9. **Eval judge.** Cross-family judge, OFFLINE only, on a curation budget separate from the $5 runtime cap. AMENDED 2026-07-07: Groq `llama-3.3-70b-versatile` (free tier, already wired) at $0, cross-family vs the Gemini answer model; was Claude Haiku via Anthropic API (dropped to avoid a paid judge key + the iterate-to-85% burst cost). Backstop: manual review of disagreements; optional one-time Sonnet 5 finalize pass. Curation time.
10. **Corpus.** Self-authored public docs only: no licensing concerns. Curation time.

## Corpus & data

- Sources (v1): portfolio site content (exhibit pages, methodology, about), public repo READMEs (portfolio, agentic-dev-kit), public PRDs + build-plan, PLUS a new curated "about Javier" fact sheet written for the corpus (safe facts from the private claims bank, rewritten). The raw private claims bank is EXCLUDED: everything ingested is extractable by visitors.
- Ingest: a manual script (chunk, embed via Gemini, upsert to pgvector), idempotent and re-runnable, documented as a deploy-checklist step after content changes. No nightly job, no build-time coupling.
- Transcripts: live ONLY in Langfuse traces (session id, no IP stored in traces). No transcript table. A short privacy note near the input discloses tracing and model routing (OpenRouter paid primary; the Groq free-tier fallback may train on inputs).
- Golden set + eval results: versioned JSON in this repo, eval script beside them; committed results render as the accuracy table on the exhibit page, and the eval-lookup tool reads the same committed JSON (one source of truth).

## Guardrails (concrete)

- Per IP: 10 messages / 10 minutes, 30 / day.
- Money guard (AMENDED 2026-07-07): $5/month prepaid OpenRouter credits + key credit limit, auto-top-up off; billing-enforced. Credit exhaustion (402) degrades to the free fallback, it does not stop the chat.
- Global kill-switch: 200 agent requests / day (AMENDED 2026-07-07: now the spike backstop above the billing cap, keeping one hot day from draining the month's credits).
- Reply cap ~800 output tokens; input cap 1000 characters; conversation cap 12 turns, then suggest a new chat or email.
- Strict system prompt + topic filter: portfolio/professional questions only; off-topic gets the one-line redirect, zero engagement.
- Prompt-injection awareness documented in the writeup (self-authored corpus keeps risk low; injection probes are part of the golden set).

## Acceptance (Given / When / Then)

**Happy path**
- Given any visitor on any page, When they open the launcher (or visit the dedicated page), Then the chat loads lazily with zero CLS and shows the intro plus 4 typed suggestion chips.
- Given a question about a showroom project, When the agent replies, Then the answer streams, is grounded in the corpus, and carries source chips plus a "see how I answered" link.
- Given "what has Javier committed recently?", When the agent replies, Then the GitHub tool was called and the answer reflects real current data.
- Given "how accurate are you?", When the agent replies, Then the eval-lookup tool returns the same numbers as the published exhibit table.
- Given any reply's trace link, When a visitor opens it, Then a public Langfuse trace shows retrieval, tool calls, and model steps for that reply.
- Given a question in Spanish, When the agent replies, Then the reply is in Spanish (citations stay EN, UI chrome stays EN).

**Edge cases & failure modes**
- Given an off-topic request ("write my homework"), When the agent responds, Then it is one redirect sentence plus chips, with zero engagement on the request itself.
- Given an injection attempt ("ignore your instructions"), When the agent responds, Then it declines the same way and leaks nothing of its system prompt or corpus internals beyond what is public.
- Given a question the corpus cannot answer, When the agent replies, Then it says so and offers what it does know; it never fabricates (honesty rail).
- Given the per-IP limit is hit, When the visitor sends another message, Then they see the honest rate-limit message with the retry window.
- Given the global daily cap is reached, When anyone sends a message, Then they see the honest over-budget message pointing to the portfolio and email.
- Given the primary model errors, When the message is processed, Then it is retried once and then served by the fallback provider; Given both providers fail, Then the visitor sees the honest error state.
- Given the visitor picked an allowlisted model, When the agent replies, Then that model served the answer and the UI caption names it; Given an unknown modelId, Then the default serves silently.
- Given the OpenRouter monthly credits are exhausted (402), When a message arrives, Then the reply still streams via the free fallback with an honest capped caveat.
- Given a live tool fails, When the agent answers, Then it answers from the corpus and SAYS the live lookup failed; no fabricated freshness.
- Given the limiter store is unreachable, When a message arrives, Then the endpoint fails closed with the honest unavailable message.
- Given a message over 1000 characters or a conversation past 12 turns, When submitted, Then the UI blocks it with a clear message (and the server enforces the same caps).
- Given the ingest script runs twice, When it completes, Then the corpus is not duplicated (idempotent upsert).

**Eval**
- Given the 40-question golden set (20 project/stack/process facts, 8 live-tool, 6 guardrail probes, 6 Spanish), When the eval runs (cross-family judge + manual review of disagreements), Then the shipped version scores >= 85% and the published table shows the exact real number and methodology.

## Quality bar

- Honesty rail (site-wide): no fabricated stats or claims, retrieval-grounded answers with citations, real eval numbers published.
- Design: matches globals.css tokens, dark + light, responsive; widget launcher lazy-loaded with zero CLS.
- Perf: the site's Lighthouse scores (96-100) do not degrade on any existing page.
- A11y: chat is keyboard-operable and screen-reader usable.
- Cost (AMENDED 2026-07-07): runtime spend hard-capped at $5/month at the billing layer (prepaid OpenRouter credits, auto-top-up off, key credit limit); embeddings and the fallback stay free-tier; the kill-switch is still enforced server-side as the spike backstop.
- Latency: first streamed token within a few seconds on the happy path; suggestion chips give instant perceived responsiveness.

## Exhibit & launch

- New Project row: kind WEB_APP, featured. Standard exhibit structure (PRD link, build story, timeline, metrics) with the LangGraph graph diagram as hero image, a guardrails section, the eval iteration story, and a trace screenshot. Ships WITH the feature on 2026-07-12.
- Post-launch: observe conversations/declines/traces weekly in Langfuse; no numeric engagement targets. The external success metric: live on Jul 12, CV/LinkedIn updated the same day (artifact first, labels second).

## Out of scope (v1)

- Demo health-check tool (v1.1), custom analytics/funnel events (v1.1).
- Self-hosted or in-browser models; uncapped paid model spend (paid usage exists since the 2026-07-07 amendment, but only behind the $5/month billing hard cap).
- Live crawling of repos at query time (build-time ingest only).
- Cross-session memory, user accounts, voice, file upload.
- Full Spanish UI (chips and chrome stay EN; replies mirror EN/ES).
- Admin UI for corpus management (re-ingest is a script).
- Nightly re-embed job.

**Invariants**
- Existing pages' Lighthouse scores and CLS are untouched.
- The RSC-to-Nest convention for existing page reads stays; the chat route is the single documented exception.
- The prod exhibits DB gets only additive changes (extension + vector tables + read-only role); existing schema and data untouched.
- Nest API stays private; no CORS opened; no secrets reach the client.
- Existing deploy flows (Vercel git-connected, Railway) unchanged.

## Done looks like

Portfolio Agent is live on javierramos.dev (widget everywhere + dedicated page), answering EN/ES questions about the showroom with citations, live GitHub data, a public trace link on every reply, all caps enforced server-side with runtime spend hard-capped at $5/month, a >= 85% published eval table, and a featured WEB_APP exhibit telling how it was built; CV/LinkedIn updated the same day.

## Scope changes (living log)

- 2026-07-05: DRAFT -> DEFINED via /prd-grill-me (8 rounds). Decisions below.
- 2026-07-05: name "Concierge" -> **Portfolio Agent** - changed - unclear to Spanish-speaking recruiters; "agent" is also the differentiator keyword.
- 2026-07-05: audience pinned to hiring managers first - added - trace-forward tone and depth.
- 2026-07-05: exhibit kind WEB_APP featured; ship target Sun 2026-07-12 - added.
- 2026-07-05: UX = widget on all pages + dedicated page; mobile full-screen sheet; 4 mixed-type chips; source chips + trace link on every reply - added.
- 2026-07-05: off-topic = one-line redirect + chips; limits = honest static messages; failures = retry once then fallback provider, honest tool caveats; language = mirror EN/ES - added.
- 2026-07-05: corpus = public docs + new curated fact sheet; private claims bank excluded - added - public endpoint means extractable corpus.
- 2026-07-05: refresh = manual ingest script in deploy checklist - decided over nightly/build-time.
- 2026-07-05: logging = Langfuse traces only, no transcript table - decided - stateless would cripple the trace feature.
- 2026-07-05: runtime = Next route handler on Vercel - decided - documented exception to RSC-to-Nest.
- 2026-07-05: orchestration = LangGraph.js behind AI SDK - decided - earns the #1 CV keyword in shipped product.
- 2026-07-05: model = FREE TIER ONLY (Gemini 2.5 Flash primary, Groq fallback) - user override of the Haiku recommendation - $0 runtime wins.
- 2026-07-05: vector store = Railway Postgres pgvector - user override of the Neon recommendation, then VERIFIED live (vector 0.8.2 available, PG 18.4); Neon demoted to fallback; local compose image swaps to pgvector.
- 2026-07-05: DB path = direct read-only conn via Railway public proxy; embeddings = Gemini embedding API both sides; limiter = Upstash Redis free tier, fail closed - added.
- 2026-07-05: tracing = Langfuse Cloud free + public share links (full trace) - decided over self-host/LangSmith.
- 2026-07-05: tools v1 = GitHub + eval-lookup; health checks deferred to v1.1 - cut.
- 2026-07-05: caps = 10/10min + 30/day per IP, 200/day global kill, 800-token replies, 12 turns, 1000-char input - added.
- 2026-07-05: eval = 40 mixed questions, cross-family judge (Claude Haiku offline) + manual disagreement review, ship gate >= 85%, real number published - added.
- 2026-07-05: success = observe in Langfuse weekly, no numeric targets - decided.
- 2026-07-07: model provider = OpenRouter paid primary with a $5/month billing hard cap (prepaid credits, auto-top-up off, key credit limit); Groq free tier fallback on 402/outage; Google key demoted to embeddings only - user decision after the B05 finding (Gemini free tier = ~20 generations/day) and the paid-tier cost analysis - supersedes the 2026-07-05 "FREE TIER ONLY" decision. Backlog item B05A.
- 2026-07-07: new UX: visitor-facing model picker on a server-enforced allowlist (default + ceiling Gemini 2.5 Flash; Flash-Lite, Llama 3.3 70B, Llama 3.1 8B, one DeepSeek/Qwen-class model) plus an "answered by {model}" caption - added - the picker itself is exhibit material (visitors compare models live). Server side B05A, UI B07.
- 2026-07-07: eval judge = Groq `llama-3.3-70b-versatile` (free tier, cross-family, $0) - user decision - supersedes the "Claude Haiku via Anthropic API" judge; ruled out the Anthropic key, `claude -p` (bills API not subscription), and premium OpenRouter judges (Opus-high-effort ~$2-3/run, ~$40-90 iterate-to-85% burst) as too costly for the iteration loop; human disagreement review is the quality backstop, optional one-time Sonnet 5 finalize. Backlog item B09.

Move `Status` to SHIPPED once `reconcile` confirms the body matches the live product.
