# PRD: Portfolio Showroom (master product spec)

Status: DEFINED. This is the product "what + why + acceptance". Companions in this repo: `CLAUDE.md` (stack + decisions + build order), `docs/build-plan.md` (progress log), `design-reference/` (visual source of truth). Per-feature PRDs, if needed, go in `docs/prd/`.

## 1. Purpose
A developer "showroom" that proves two things at once: a polished, working full-stack product, and a credible, repeatable way of building software with agents. Most portfolios show only the product. This one also shows the build: the PRD that started each exhibit, the commit/PR/deploy timeline, the metrics, and the agent-driven workflow behind it. It leads with backend depth and developer-tooling / agentic workflow. The portfolio is itself the first exhibit, built with the same loop it documents.

## 2. Audience
Technical recruiters, founders, and engineering leads who open a link and skim in about 2 minutes. It must land with no prior context. Visual impact and instant credibility are the priority. English only.

## 3. Honesty principle (load-bearing)
Every claim must be real and verifiable, not asserted.
- The agentic build process must actually be used (the kit at `~/projects/agentic-dev-kit` is dogfooded to build this app), so "how I built it" is true.
- Proof is pulled from live data where possible (GitHub activity), not faked.
- Only honest metrics ship. The one real number today is **1,863 GitHub contributions (last 12 months)**. Commits, apps-shipped, and Lighthouse are clearly tagged placeholders/targets until live. **No star counts at launch** (the repos are new, they would read as zeros).

## 4. Scope
- **Phase 1a (shareable):** landing, projects list, project detail, methodology, contact (working form), seeded with the 3 launch exhibits + an initial activity snapshot, OG/SEO assets, custom domain.
- **Phase 1b (harden):** auth + admin CRUD, design-system showcase page, CI + tests + badges, automated nightly GitHub-stats job, meet the quality bars.
- **Phase 2 (grow):** more exhibits built from PRD via the kit; first is a small "dev-stats dashboard" that also feeds the activity section.
- **Out of scope (phase 1):** in-product AI features, public/multi-user CRUD, i18n, a CMS, blog/comments, runtime media upload, a stars/all-repo-language section.

## 5. Launch exhibits (seed data)
1. **portfolio** (`WEB_APP`, public): this showroom. Built with Claude Code, MCP, the PRD loop. Stack: Next.js, NestJS, Postgres, Prisma.
2. **agentic-dev-kit** (`TOOLING`, public): open-source Claude Code skills + an MCP server + PRD templates. Stack: TypeScript, Node, MCP.
3. **territory-developer** (`CASE_STUDY`, private code): a 2D isometric city-builder built with a custom agentic pipeline. Public writeup + live game page; code stays private.

## 6. Features + acceptance
**Landing** (`/`)
- Given a first-time visitor, When the page loads, Then they see the one-line differentiator, a "proof by numbers" KPI strip (real data, no stars), featured exhibit cards (with Built-with + visibility badges), a GitHub activity block (contribution heatmap + language breakdown), and clear CTAs (View work, GitHub, Contact, CV).
- Hero uses **Direction B** (terminal / build-log). No A/B toggle in production.

**Projects list** (`/projects`)
- Given the visitor opens the list, Then exhibits render server-side in a columned, sortable, filterable table (name, kind, stack, status, shipped date, live link, repo link).

**Project detail** (`/projects/[slug]`)
- Given an exhibit, Then the top half shows the product (screenshots, live link, problem, stack, visibility + achievement badges) and the bottom half shows "How I built this": the rendered PRD with an "Open the PRD" button, the commit/PR/deploy timeline, and a metrics row.

**Methodology** (`/methodology`)
- Given the visitor, Then the page leads with the agentic-loop diagram, has a slot for a 60 to 90s demo, and short sections (the kit, the PRD loop, Claude Design to UI, MCP + skills, closed-loop verify).

**Design system** (`/design-system`, 1b)
- Renders the live tokens, type scale, color palette, and a component gallery (proves the system).

**Contact** (`/contact`)
- Given a visitor submits name/email/message, When valid, Then it POSTs to the Nest API and stores a `Lead` (honeypot + rate limit), and a success state shows. Email + LinkedIn are also visible.

**Admin** (1b)
- Single-admin login (JWT in an httpOnly cookie via a Next BFF). Authenticated create/edit/delete of exhibits. Low-polish, functional.

## 7. Data & architecture requirements
- Reads via React Server Components fetching the Nest API server-to-server (API stays private, no CORS). Admin writes via a Next BFF holding the JWT.
- Models: `Project`, `ActivitySnapshot` (nightly GitHub snapshot), `Lead`. (Field detail in `CLAUDE.md`.)
- Media: screenshots committed to `apps/web/public` and referenced by path (no runtime upload).
- A nightly Nest job snapshots GitHub stats into Postgres; the site reads from the DB.

## 8. Quality bars
- Lighthouse performance / accessibility / SEO >= 95 (by 1b). WCAG AA contrast in both themes. LCP < 2.5s.
- Open Graph image + meta + sitemap + favicon present at 1a (clean link previews).
- Real PR-per-milestone flow so the per-exhibit timeline is genuine, sourced from the GitHub API.

## 9. Success criteria
In about 2 minutes from the link, a hirer sees a polished working full-stack app AND checkable evidence it was built with agents (real PRDs, real timelines, live GitHub activity, the public kit). Phase 1a live on a custom domain, repos public, OG previews clean, the activity heatmap visible.

## 10. Build sequence
See `CLAUDE.md` (M0–M8) and `docs/build-plan.md` (progress). This PRD is the WHAT; those are the HOW and the WHERE-we-are.
