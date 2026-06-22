# M4 — page build spec (from the standalone)

Captured from `design-reference/javier-ramos-portfolio.standalone.html` (the visual source of truth), rendered + read on 2026-06-22. Build all 6 pages to this. Use **only** the design tokens in `apps/web/app/globals.css` (no hardcoded colors). Cyan accent = `--primary` `#22d3ee`. The **one gradient** (`.cta-gradient` / `--gradient-primary`) is reserved for the primary CTA only. Fonts: Geist (sans) + Geist Mono (labels/code/eyebrows). Dark-first.

## Global

**Nav** (sticky top, blurred bg): `JR` mark (cyan rounded square) + "Javier Ramos" · links `Work`(/) `Projects`(/projects) `Methodology`(/methodology) `System`(/design-system) · right: theme toggle, GitHub icon (github.com/jiramos87), `Contact` button (→ /contact).

**Footer**: `JR` + "Javier Ramos" / "full-stack · agentic workflows" · center "© 2026 Javier Ramos — built with agentic workflows" · right: GitHub + LinkedIn icons.

**Eyebrow style**: mono, uppercase, letter-spaced, cyan, often with a leading `●` dot.

**Tag/badge chips**: small mono uppercase. Honesty tags: `REAL` (cyan), `NOW`, `TARGET`, `TECH`, `PLACEHOLDER`. Visibility: `🔓 Public repo`, `🔒 Private code`. Kind: `WEB_APP`, `TOOLING`, `CASE_STUDY`.

## 1. Landing (`/`, nav label "Work")

**Hero (Direction B — terminal / build-log):**
- Eyebrow: `PRD → IMPLEMENT → VERIFY → SHIP`
- H1 (display ~76): "The product **and** the build log. Shipped with agentic workflows." ("and" in cyan)
- Sub: "I'm Javier — a backend-leaning full-stack engineer. Each exhibit is real, deployed, and backed by GitHub activity, with the agent-driven process shown in full."
- CTAs: `View the work` (cyan gradient, → /projects) + `See the method` (outline, → /methodology)
- **Terminal panel** (right): titlebar dots + `agent — build-feature.sh`. Lines (mono, status glyph colored):
  - `$ agent run --prd portfolio.prd.md`
  - `✓ explore ` repo scanned · 142 files · context built
  - `✓ plan ` PRD → 9 tasks · acceptance set
  - `→ implement ` apps/web/landing.tsx · +312 −44
  - `◐ verify ` lighthouse 97 · a11y AA · CI green
  - `↻ iterate ` Claude Design → UI · diff applied
  - `✓ ship ` deployed · main@a1f9c2 (blinking cursor)

**KPI strip** — 4 cards, each: label (mono), tag chip, big number, sub, tiny sparkline.
- `Contributions · 12 mo` `REAL` → **1,863** · "verified on GitHub"
- `Launch exhibits` `NOW` → **3** · "product + build log"
- `Avg Lighthouse` `TARGET` → **95+** · "target across exhibits"
- `Core stack` `TECH` → **10** · "TS · Node · Nest · Next +6"

**Featured exhibits** — eyebrow `FEATURED EXHIBITS`, heading "The product and how it was built". 3 cards (data from API `/projects`). Each card: kind chip + visibility chip, name, description, `BUILT WITH` (toolsUsed + stack chips), footer links (live/repo/extra) + a metric badge.

**The method** — eyebrow `THE METHOD`, heading "A closed agentic loop, on every exhibit", sub "Each product is built with a repeatable, verifiable pipeline — driven by a PRD and Claude Code skills, closed by automated checks." Steps:
- `01 Explore` — "Scan the repo, read context, frame the problem with the agent."
- `02 PRD` — "Write a PRD: scope, tasks, and acceptance criteria."
- `03 Implement` — "The agent writes code and tests against the PRD."
- `04 Verify` — "Lint, typecheck, Lighthouse, CI — then loop back."
- `iterate` — "verify fails loop back to implement; Claude Design ⇄ UI runs on every visual change."

**Proof — GitHub activity** — eyebrow `PROOF — GITHUB ACTIVITY`, heading "Backed by real, continuous work", "1,863 contributions · last 12 months · verified". Three sub-blocks (data from `/activity`):
- **Contribution heatmap**: month labels Jul…Jun, Less→More legend. Calendar data is `isPlaceholder` (empty) → render the grid in an empty/muted state with a small "live calendar pending" note. Never fake cells.
- **Language & tech breakdown** ("across public + private repositories"): horizontal bars — TypeScript 56%, C# 16%, JavaScript 12%, CSS 9%, Other 7%. Tie to snapshot `isPlaceholder` → show a subtle "approximate · live pull pending" note.
- **Contributions over time** ("commit + PR activity, normalized"): line chart with `1D 7D 1M 1Y` toggles. Placeholder → muted/empty state.

**Contact** — eyebrow `CONTACT`, heading "Let's build something — and show how.", sub "Open to remote full-stack roles and agentic-tooling work. Send a note and I'll reply with relevant exhibits." Links: `hello@javierramos.dev`, `linkedin.com/in/javier-ramos-humeres`, `github.com/jiramos87`. Form: Name, Email, Message, `Send message` (gradient). Posts via a Next server action → `submitContact()` in `lib/api.ts`.

## 2. Projects list (`/projects`)
Server-rendered, columned, sortable, filterable **table** of exhibits (data from `/projects`): columns name, kind, stack, status, shipped date, live link, repo link. Row → /projects/[slug]. (Design-system shows the pattern: "Data table · sortable + paginated · click a header to sort".)

## 3. Project detail (`/projects/[slug]`)
Top half = **the product**: name, kind + visibility chips, tagline/problem, live link, stack, screenshots (none yet → omit gracefully). Bottom half = **"How I built this"** via **Tabs: `Product` / `How I built it` / `Metrics`**.
- Product tab: "The shipped product: live link, the problem it solves, and the stack it runs on."
- How I built it: rendered PRD (markdown from `prd`/`prdUrl`, "Open the PRD" button) + **Timeline** (commit / PR / deploy / prd entries — date, label, repo/url). Entry types seen: deploy ("Deployed to production · vercel · main · 2m ago"), pr ("Merged PR #42 — … · jiramos87/portfolio · 1h ago"), commit ("feat: … · 8 files · +312 −44 · 3h ago"), prd ("PRD approved — … · docs/…prd.md · 5h ago").
- Metrics: the project's `metrics` row (each tagged real/placeholder/target).

## 4. Methodology (`/methodology`)
Leads with the agentic-loop diagram (the 01–04 + iterate loop above), a slot for a 60–90s demo video (placeholder), and short sections: the kit, the PRD loop, Claude Design → UI, MCP + skills, closed-loop verify.

## 5. Design system (`/design-system`, nav "System")
Heading "Tokens, type & components". Intro: "A dark-first system on the shadcn/ui CSS-variable contract, with a cyan accent and one gradient moment reserved for the primary CTA. Built for Next.js + Tailwind + shadcn/ui." Sections:
- `01 — COLOR TOKENS`: swatch grid — `--background #0a0e13`, `--card #11161d`, `--muted #1a222c`, `--primary #22d3ee`, `--accent #22d3ee`, `--foreground #e7edf3`, `--success #34d399`, `--warning #fbbf24`, `--destructive #f87171`, `--chart-3 #60a5fa`, `--chart-4 #a78bfa`, `--border rgba .09`. Read live from CSS vars where possible.
- `02 — TYPOGRAPHY · Geist / Geist Mono`: Display·76 "Build in public", Heading·32 "The product and the build log", Body·16 (sample), Mono·13 "TECH-358 · +312 −44 · main@a1f9c2".
- `03 — SPACING · RADIUS · ELEVATION · MOTION`: spacing 4/8/12/16/24/32; radius sm6/md12/lg16; elevation flat·elevated; motion fast120/base200/slow320/ease(.2,.7,.2,1).
- `04 — COMPONENT GALLERY`: Buttons (Primary CTA / Secondary / Ghost / Destructive), Badges, KPI stat w/ trend delta, Tabs (Product/How I built it/Metrics), Timeline, Code block, Donut (language mix), Data table, Prose/PRD block.

## Seed reconciliation (apply to `apps/api/prisma/seed.ts`)
- **portfolio** → name "This Portfolio"; stack `[Next.js, NestJS, PostgreSQL, Prisma]`; toolsUsed `[Claude Code, MCP, PRD loop]`; metric `Lighthouse 95+` (target); liveUrl null until deployed; repo public.
- **agentic-dev-kit** → stack `[TypeScript, Node.js, MCP]`; toolsUsed `[CC skills, MCP server, PRD templates]`; metric `CI green` (target).
- **territory-developer** → stack `[Unity, C#]` (NOT TypeScript); toolsUsed `[Agentic pipeline, Claude Code, PRD loop]`; private code; liveUrl null (game URL TBD).
- **activity snapshot** → languages `[TypeScript 56, C# 16, JavaScript 12, CSS 9, Other 7]`; calendar empty; `isPlaceholder: true`; totalContribs 1863.

## Honesty rules (PRD §3) — enforce in UI
- Tags drive treatment: `real` = solid/confident; `placeholder`/`target` = muted + labeled. Never present placeholder as verified.
- Activity heatmap + time chart render an explicit "live pull pending" empty state (no fabricated cells).
- No star counts anywhere.
