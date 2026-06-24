# PRD: Portfolio Showroom (master product spec)

Status: DEFINED -> largely SHIPPED. Phase 1a is live; most of 1b shipped; auth/admin was dropped. This PRD is kept honest against the live product, not rewritten to look perfect: see §11 for what changed since it was written. Companions in this repo: `CLAUDE.md` (stack + decisions + build order), `docs/build-plan.md` (progress log), `design-reference/` (visual source of truth). Per-feature PRDs, if needed, go in `docs/prd/`.

## 1. Purpose
A developer "showroom" that proves two things at once: a polished, working full-stack product, and a credible, repeatable way of building software with agents. Most portfolios show only the product. This one also shows the build: the PRD that started each exhibit, the commit/PR/deploy timeline, the metrics, and the agent-driven workflow behind it. It leads with backend depth and developer-tooling / agentic workflow. The portfolio is itself the first exhibit, built with the same loop it documents.

## 2. Audience
Technical recruiters, founders, and engineering leads who open a link and skim in about 2 minutes. It must land with no prior context. Visual impact and instant credibility are the priority. English-default UI (the downloadable CV is also available in Spanish).

## 3. Honesty principle (load-bearing)
Every claim must be real and verifiable, not asserted.
- The agentic build process must actually be used (the kit at `~/projects/agentic-dev-kit` is dogfooded to build this app), so "how I built it" is true.
- Proof is pulled from live data where possible (GitHub activity), not faked.
- Only honest metrics ship, each tagged `real | target | placeholder`. Live today: **GitHub contributions + heatmap** (nightly job, ~1,863 last 12 months), **Lighthouse 96-100** (measured on the live site), and per-exhibit **recent-commit feeds** (GitHub API). `ship-time` (<24h) and `ai-cost` (<$15) are real; `cadence` (~7/wk) stays a target until there is a track record. **No star counts** (the repos are new, they would read as zeros).

## 4. Scope
- **Phase 1a (shareable) - SHIPPED:** landing, projects list, project detail, methodology, contact (working form), seeded with the 3 launch exhibits + a live activity snapshot, OG/SEO assets, custom domain (`javierramos.dev`).
- **Phase 1b (harden) - SHIPPED, minus auth:** design-system showcase page, CI + live badge, automated nightly GitHub-stats job, live per-exhibit commit feeds, real Lighthouse, downloadable CV (EN + ES). **Auth + admin CRUD was dropped** (see §11): a portfolio is meant to be open, and agent-driven seeding makes a hand-built CRUD redundant.
- **Phase 2 (grow):** more exhibits built from PRD via the kit; a small "dev-stats dashboard" that also feeds the activity section.
- **Out of scope (phase 1):** in-product AI features, public/multi-user CRUD, admin CRUD, full i18n, a CMS, blog/comments, runtime media upload, a stars/all-repo-language section.

## 5. Launch exhibits (seed data)
1. **portfolio** (`WEB_APP`, public): this showroom. Built with Claude Code, MCP, the PRD loop. Stack: Next.js, NestJS, Postgres, Prisma.
2. **agentic-dev-kit** (`TOOLING`, public): open-source Claude Code skills + an MCP server + PRD templates. Stack: TypeScript, Node, MCP.
3. **territory-developer** (`CASE_STUDY`, private code): a 2D isometric city-builder built with a custom agentic pipeline. Public writeup now; the live game page is pending (pre-release site in progress); code stays private.

## 6. Features + acceptance
**Landing** (`/`)
- Given a first-time visitor, When the page loads, Then they see the one-line differentiator, a "proof by numbers" KPI strip (real data, no stars), featured exhibit cards (with Built-with + visibility badges), a GitHub activity block (contribution heatmap + language breakdown), and clear CTAs (View work, GitHub, Contact, CV).
- Hero uses **Direction B** (terminal / build-log). No A/B toggle in production.

**Projects list** (`/projects`)
- Given the visitor opens the list, Then exhibits render server-side in a columned, sortable, filterable table (name, kind, stack, status, shipped date, live link, repo link).

**Project detail** (`/projects/[slug]`)
- Given an exhibit, Then three tabs render: **Product** (problem, stack, screenshots, live link, visibility + achievement badges), **How I built it**, and **Metrics**.
- "How I built it" shows: an **Open the PRD** button (links to the PRD in the repo, not inlined), the build story, a live **CI badge** (GitHub Actions), the curated milestone **timeline**, and a live **Recent commits** feed from the GitHub API.

**Methodology** (`/methodology`)
- Given the visitor, Then the page leads with the agentic-loop diagram, has a slot for a 60 to 90s demo, and short sections (the kit, the PRD loop, Claude Design to UI, MCP + skills, closed-loop verify).

**Design system** (`/design-system`, 1b)
- Renders the live tokens, type scale, color palette, and a component gallery (proves the system).

**Contact** (`/contact`)
- Given a visitor submits name/email/message, When valid, Then it POSTs to the Nest API and stores a `Lead` (honeypot + rate limit), and a success state shows. Email + LinkedIn are also visible.

**Admin** - DROPPED (see §11)
- Originally planned as a single-admin JWT CRUD for editing exhibits. Cut: the portfolio is intentionally open, and exhibits are seeded/updated through the agentic loop, so a hand-built CRUD adds maintenance without value.

## 7. Data & architecture requirements
- Reads via React Server Components fetching the Nest API server-to-server (API stays private, no CORS).
- The only public write path is the contact form (POST to the Nest API, stored as a `Lead`); exhibit content is seeded through the agentic loop, not a UI.
- Models: `Project` (also carries `repoCommits` + `ciUrl` for the live feed and badge), `ActivitySnapshot` (nightly GitHub snapshot), `Lead`. (Field detail in `CLAUDE.md`.)
- Media: screenshots committed to `apps/web/public` and referenced by path (no runtime upload).
- A nightly Nest job snapshots GitHub stats (contributions + heatmap) and per-repo recent commits into Postgres; the site reads from the DB.

## 8. Quality bars
- Lighthouse (measured on the live site, lighthouse 12.8.2): performance **98 desktop / 96 mobile**, Accessibility + Best Practices + SEO **100** on both. WCAG AA contrast in both themes. LCP < 2.5s. **Met.**
- Open Graph image + meta + sitemap + favicon present at 1a (clean link previews).
- Real PR-per-milestone flow plus a live commit feed, so the per-exhibit timeline is genuine and sourced from the GitHub API.

## 9. Success criteria
In about 2 minutes from the link, a hirer sees a polished working full-stack app AND checkable evidence it was built with agents (real PRDs, real timelines, live GitHub activity, the public kit). Phase 1a live on a custom domain, repos public, OG previews clean, the activity heatmap visible.

## 10. Build sequence
See `CLAUDE.md` (M0–M8) and `docs/build-plan.md` (progress). This PRD is the WHAT; those are the HOW and the WHERE-we-are.

## 11. What changed since this spec (build-in-public)
This PRD was written before the build. It is kept honest by recording where the shipped product diverged, not by pretending it always matched. Each delta came out of the agentic loop:
- **Auth + admin CRUD: dropped.** A portfolio is meant to be open, and exhibits are seeded/updated through the agentic loop, so a JWT-protected CRUD added maintenance with no payoff. Removed from scope (§4), §6, and the write path (§7).
- **Lighthouse: promoted target -> real.** Measured on the live site (desktop 98 / mobile 96 / A11y+BP+SEO 100), so the metric flipped from a target to a verified number.
- **GitHub activity: promoted placeholder -> live.** A nightly job now writes the real contribution count + heatmap to Postgres; the site reads from the DB.
- **Live recent-commit feeds + CI badge: added (not in the original spec).** Each public exhibit shows its real recent commits from the GitHub API, and the build tab shows a live GitHub Actions status badge. Both deepen the "show the build" thesis, so they were pulled forward.
- **Downloadable CV (EN + ES): added.** A CTA on the contact page and in the top nav.
- **territory live game page: still pending.** The case study ships as a writeup; the playable/pre-release page is not live yet.

The lesson fed back into the kit (`agentic-dev-kit`): a PRD is a living doc. The kit now carries a `Status` lifecycle + a `Scope changes` log in its template and a `reconcile` step that diffs spec against shipped reality.
