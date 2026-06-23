# PRD — Live per-exhibit GitHub timelines

Status: implemented + verified locally (1b). Owner: Javier. Dogfood: implement skill.

## Verified locally (2026-06-23)
- Gate green: `pnpm check-types && pnpm lint && pnpm build`.
- `pnpm --filter api activity:refresh` -> portfolio 8 commits, agentic-dev-kit 1, territory-developer skipped (no repoUrl). `repoCommitFeeds=2`.
- Rendered (DOM-verified): portfolio shows curated Timeline + Recent commits (as-of label + All-commits link); agentic-dev-kit shows Recent commits only (empty curated Timeline hidden, no placeholder); territory-developer shows the curated placeholder only.

## Deploy sequence (pending)
1. Commit + push. Railway rebuilds the API; `prisma migrate deploy` (railway.json pre-deploy) applies `project_repo_commits`.
2. After the API is live, run `pnpm activity:refresh:prod` to populate `repoCommits` in prod. The nightly cron keeps it fresh thereafter.
3. Web (Vercel) auto-deploys on push; ISR (60s) picks up the new fields. No Vercel env change needed.

## Why
Each exhibit already tells the build story with a hand-authored timeline. The brand promise is "backed by real GitHub activity", so each public-repo exhibit should also show its real recent commits, pulled live (cached nightly), not just curated milestones.

## Decisions (locked via poll)
- **Presentation:** keep the curated `timeline` (milestones) and ADD a separate "Recent commits" section below it. agentic-dev-kit (empty curated timeline) shows only the live feed.
- **Freshness:** nightly snapshot in DB. Extend the existing `activity:refresh` + cron to also fetch each public repo's commits and store them on the Project row. Web reads the DB as today (no per-request GitHub calls).
- **Scope:** public repos, commits only. portfolio + agentic-dev-kit get a live feed; territory-developer (`repoUrl: null`, private) stays curated. Honesty: show an "as of <date>" label so the cached-nightly nature is explicit. No fabrication.

## Data model
Add to `Project`:
- `repoCommits Json?` — `[{ sha, message, date, url }]`, most recent 8, refreshed nightly.
- `repoCommitsAt DateTime?` — last fetch time (drives the "as of" label).

Migration: `project_repo_commits`.

## Backend
- `github.ts`: `parseGitHubRepo(url) -> {owner, repo} | null`, `CommitEntry`, `fetchRecentCommits(token, owner, repo, perPage=8)` (REST `/repos/{owner}/{repo}/commits`, uses `GITHUB_REPO_TOKEN`, first line of message, short sha, `html_url`).
- `activity.service.ts`: `refreshRepoCommits()` queries `repoPublic && repoUrl != null`, fetches per repo, updates each Project (per-repo errors swallowed). Called from `refresh()` (non-fatal) so both the manual script and the nightly cron pick it up.
- `activity.cron.ts`: log the repo-commit count alongside totalContribs.

## Frontend
- `lib/api.ts`: `CommitEntry` type + `repoCommits`/`repoCommitsAt` on `Project`.
- `lib/format.ts`: shared `formatDate` (UTC), reused by timeline + recent-commits.
- `components/projects/recent-commits.tsx`: commit list (GitCommit icon, short sha + date link, message link).
- `project-tabs.tsx` build tab: render curated Timeline only if non-empty; render "Recent commits" (+ repo "All commits" link + "Live from GitHub, as of <date>") only if commits exist; show the empty placeholder only when both are empty.

## Verify
`pnpm check-types && pnpm lint && pnpm build`, then `pnpm --filter api activity:refresh` locally and confirm the feed renders on /projects/portfolio and /projects/agentic-dev-kit. Deploy: migration runs via Railway pre-deploy; run `pnpm activity:refresh:prod` after the API redeploys.
