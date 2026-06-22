# Handoff: Javier Ramos Portfolio (developer "showroom")

## Overview
A personal developer portfolio for **Javier Ramos** — a full-stack engineer (Node/NestJS + React/Next.js, backend-leaning) focused on developer tooling and agentic workflows. The differentiator: every exhibit shows **both the shipped product AND how it was built** (PRD → implement → verify → ship, agent-driven, backed by real GitHub activity).

Audience: technical recruiters, founders, and engineering leads who skim in ~2 minutes. Priority is visual impact + instant credibility.

This handoff covers the **first build slice**: the **Landing page** (with two explorable hero directions, A/B) and the **Design System page**. The remaining pages from the brief (Projects list, Project detail, Methodology, Contact page) are NOT yet designed — see "Out of scope / next".

## About the design files
The files in this bundle are **design references created in HTML** — a self-rendering prototype showing the intended look and behavior. They are **not production code to copy directly**.

`Javier Ramos Portfolio.dc.html` is authored in a proprietary streaming component format and needs its `support.js` runtime to render; treat it as a **visual + behavioral spec**, not as React source. `dist/javier-ramos-portfolio.html` is a self-contained offline build of the same thing — open it in any browser to click through every state.

**Your task:** recreate these designs in the target stack — **Next.js (App Router) + Tailwind CSS + shadcn/ui** — using its established patterns and component primitives. The provided `globals.css` and `tailwind.config.ts` are production-ready; the rest you build with shadcn components styled to match this spec.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interactions are all specified below with exact values. Recreate pixel-faithfully using shadcn/ui primitives. Where the mock uses a tinted fill, it is `color-mix(in srgb, var(--primary) 12%, transparent)` — port directly.

---

## Tech & setup
- **Framework:** Next.js (App Router), TypeScript strict.
- **Styling:** Tailwind. `globals.css` is written for **Tailwind v4 + shadcn** (`@theme inline`). If you're on **v3**, use the included `tailwind.config.ts` plus the `:root`/`.dark` blocks from `globals.css`.
- **Components:** shadcn/ui. Tokens already match the shadcn variable contract, so `npx shadcn@latest add button card table tabs badge input textarea` drops in with the brand applied — no renaming.
- **Theme:** dark-first. Add `class="dark"` to `<html>` by default; the in-nav toggle flips the `.dark` class (use `next-themes`, `defaultTheme="dark"`).
- **Icons:** [Lucide](https://lucide.dev) (`lucide-react`). Icons used: `Search`, `FileText`, `Code`, `CircleCheck` / `Check`, `Github`, `Linkedin`, `Mail`, `ArrowUpRight`, `ArrowRight`, `ChevronLeft`, `ChevronRight`, `Send`, `Sun`, `RefreshCw`. Stroke width 2, color `currentColor`.
- **Charts:** sparklines / area / donut are small inline SVGs in the mock. Rebuild with `recharts` (shadcn chart wrapper) or keep as lightweight SVG. The contribution heatmap is a CSS grid of cells — no chart lib needed.

## Typography
Pairing: **Geist** (sans, UI + prose) + **Geist Mono** (numbers, IDs, labels, code). Load via `next/font`:

```ts
import { Geist, Geist_Mono } from "next/font/google";
const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
// add `${sans.variable} ${mono.variable}` to <html> className
```

Type scale (exact values from the mock):

| Role | Size | Weight | Letter-spacing | Line-height | Notes |
|---|---|---|---|---|---|
| Hero display (A) | `clamp(42px, 6.4vw, 78px)` | 600 | -2.6px | 1.0 | `text-wrap: balance` |
| Hero display (B) | `clamp(38px, 4.6vw, 62px)` | 600 | -2px | 1.02 | |
| Page H1 (System) | 44px | 600 | -1.8px | 1.05 | |
| Section H2 | 30px | 600 | -0.8px | 1.1 | |
| Card H3 | 19px | 600 | -0.4px | 1.2 | |
| Body large | 19px | 400 | — | 1.6 | hero sub, `--muted-foreground` |
| Body | 16px | 400 | — | 1.6 | |
| Body small | 13.5–14.5px | 400 | — | 1.55 | |
| KPI value | 34px | 600 | -1.2px | 1 | |
| Stat (heatmap) | 24px | 600 | -0.8px | 1 | |
| Eyebrow / section label | 12px | 500 | 1.4–1.5px | — | MONO, UPPERCASE, `--primary` |
| Chip / tag | 11–11.5px | 400/500 | — | — | MONO, `--muted-foreground` |
| Mono inline (IDs, code) | 11–13px | 400/500 | — | 1.85 (code) | MONO |

## Design tokens
All tokens are in `globals.css` (dark + light, shadcn contract + extras). Summary of the **dark (default)** palette:

**Core:** `--background #0a0e13` · `--foreground #e7edf3` · `--card #11161d` · `--surface #151c25` · `--muted #1a222c` · `--muted-foreground #8a96a3` · `--border` (mock: `rgba(255,255,255,.09)`, solid `#222a33`) · `--input rgba(255,255,255,.13)`.
**Accent:** `--primary #22d3ee` (cyan) · `--primary-foreground #04141a` · `--ring #22d3ee`.
**Status / semantic:** `--success #34d399` · `--warning #fbbf24` · `--destructive #f87171`.
**Charts:** `--chart-1 #22d3ee` · `--chart-2 #2dd4bf` · `--chart-3 #60a5fa` · `--chart-4 #a78bfa` · `--chart-5 #fbbf24`.
**Gradient (PRIMARY CTA ONLY):** `linear-gradient(100deg, #22d3ee, #2dd4bf)`.

Light theme mirrors these; cyan darkens to `#0e9cba` for AA contrast on light surfaces (see `globals.css`).

**Spacing:** 4px base. Section padding: `40px` horizontal; vertical `56–104px` (hero top `104px`). Card/panel padding `20–24px`. Grid gaps `14–18px`. Chip-row gaps `6–9px`.

**Radii:** chips/swatches `6px` · buttons/inputs `9–11px` · panels `12–14px` · content cards `16px` · feature panels `20px`. (This brand intentionally exceeds shadcn's default radius.)

**Borders:** 1px hairlines only. Subtle `--border`; a fainter `--border-2` (`rgba(255,255,255,.055)` dark / `rgba(12,20,28,.08)` light) for inner dividers/section rules.

**Shadows:** minimal. Cards are flat at rest. Elevated panels use `0 18px 40px -20px rgba(0,0,0,.7)` (terminal/feature panels) and the primary CTA uses a colored glow `0 8px 30px -10px var(--primary)`.

**Motion:** ease `cubic-bezier(.2,.7,.2,1)`; durations fast `120ms` / base `200ms` / slow `320ms`. Hover transitions are color/border only — no scale/bounce. Respect `prefers-reduced-motion`.

---

## Screens / views

### Global — Top nav (sticky)
- **Layout:** sticky, `z` above content, `padding: 15px 40px`, `space-between`. Background `color-mix(in srgb, var(--background) 80%, transparent)` + `backdrop-filter: blur(14px)`, bottom 1px `--border-2`.
- **Left:** monogram (34px square, 1px `--primary` border, radius 9px, mono "JR", `--primary`) + wordmark "Javier Ramos" (16px/600). Clicking returns to landing/top.
- **Center:** text links `Work` · `Methodology` · `System` (14px). Active link = `--foreground`; inactive = `--muted-foreground`; hover → `--foreground`. `System` active = `--primary`.
- **Right (in order):**
  - **A/B direction toggle** (landing only): pill with mono "DIR" label + two 5×11px segments `A` / `B`. Active segment = `--primary` bg, `--primary-foreground` text. (This is a *design exploration control* — see "A/B hero".)
  - **Theme toggle:** 34px icon button (Sun/Moon), flips `.dark`.
  - **GitHub** icon button → `https://github.com/jiramos87`.
  - **Contact** button: 34px-tall, 1px `--border`, `--card` bg; hover border → `--primary`. Anchors to `#contact`.

### Global — Footer
Top 1px `--border-2`. Left: monogram + "Javier Ramos" + mono sub "full-stack · agentic workflows". Center: "© 2026 Javier Ramos — built with agentic workflows". Right: GitHub + LinkedIn icon buttons.

---

### Screen 1 — Landing
Sticky nav + the sections below + footer. Two hero directions are explorable via the nav A/B toggle; **everything below the hero is shared.**

#### 1a. Hero — Direction A ("Editorial")
- Single left-aligned column, `max-width: 880px`, padding `104px 40px 56px`.
- **Eyebrow:** 7px cyan dot (glow `0 0 12px var(--primary)`) + mono label "FULL-STACK ENGINEER · AGENTIC WORKFLOWS".
- **Headline (display A):** "I build real products with agentic workflows — and **show exactly how.**" — last clause in `--primary`.
- **Sub (body large):** "Backend-leaning full-stack engineer (Node · NestJS · React · Next.js), focused on developer tooling. Every exhibit ships a product **and** the build log behind it — PRD to deploy." ("and" in `--foreground`, rest `--muted-foreground`.)
- **CTAs:** `[View the work]` primary **gradient** (radius 11px, glow, ArrowUpRight icon) → `#work`; `[Start a conversation]` secondary (1px border, `--card`) → `#contact`; `github` ghost link with icon.
- **Stack row:** mono "STACK" + chips: TypeScript, Node.js, NestJS, React, Next.js, PostgreSQL, Prisma, AWS, GCP, Tailwind.

#### 1b. Hero — Direction B ("Terminal / build-log")
- Two-column grid `1.05fr 0.95fr`, gap 56px, padding `88px 40px 48px`.
- **Left:** same eyebrow pattern (label "PRD → IMPLEMENT → VERIFY → SHIP"), headline (display B) "The product **and** the build log. Shipped with agentic workflows." ("and" in `--primary`), sub, CTAs `[View the work]` (gradient) + `[See the method]`.
- **Right — terminal panel:** radius 14px, `linear-gradient(180deg, var(--surface), var(--card))`, 1px border, elevated shadow. Title bar: 3 traffic-light dots (#ff5f57 / #febc2e / #28c840) + mono "agent — build-feature.sh". Body (mono 13px, line-height 1.95) shows a build log with colored status lines (✓ green, → cyan, ◐ amber, ↻ purple) and a **blinking cyan caret** (8×15px, `blink 1.1s steps(1) infinite`) on the last line.

#### 1c. KPI strip (shared)
4-column grid, gap 16px. Each card: 1px border, `--card`, radius 14px, padding `20px`. Top row: label (12.5px `--muted-foreground`) + mono uppercase tag chip colored per kind. Bottom: KPI value (34px) + sub (12.5px muted) on the left, **sparkline** (cyan polyline, ~100×30) on the right.
- "Contributions · 12 mo" — **1,863** — "verified on GitHub" — tag `real` (`--success`). *(Real number.)*
- "Launch exhibits" — **3** — "product + build log" — tag `now` (`--primary`).
- "Avg Lighthouse" — **95+** — "target across exhibits" — tag `target` (`--warning`). *(Placeholder/target.)*
- "Core stack" — **10** — "TS · Node · Nest · Next +6" — tag `tech` (`--muted-foreground`).

> Content honesty: **1,863** is the only real metric. Commits/apps/Lighthouse are clearly-tagged placeholders/targets to be swapped with live data.

#### 1d. Featured exhibits (shared) — `#work`
Header: mono eyebrow "FEATURED EXHIBITS" + H2 "The product and how it was built" + "Design system →" link (switches to System page). Below: 3-column grid, gap 18px. Each **exhibit card** (1px border, `--card`, radius 16px, padding 22px; hover: border → `--primary`, `translateY(-3px)`):
- Top row: mono **kind** chip (`WEB_APP` / `TOOLING` / `CASE_STUDY`) + **visibility badge** ("🔓 Public repo" in `--success` outline, or "🔒 Private code" muted). *(Replace emoji locks with Lucide `Unlock`/`Lock` 12px in the build.)*
- H3 title, then description (13.5px muted).
- **"BUILT WITH"** mono label + chips with a leading cyan dot, tinted `color-mix(in srgb, var(--primary) 12%, transparent)`, border `…32%…`, text `--primary`.
- **Stack** chips (mono, `--muted`, muted text).
- Footer (top 1px `--border-2`): live link (ArrowUpRight) + repo link (GitHub icon), and a right-aligned achievement badge (Check icon, `--success`).

Exhibit data:
1. **This Portfolio** — `WEB_APP`, Public repo. "A full-stack showroom that presents the product and exactly how it was built with agents." Built with: Claude Code, MCP, PRD loop. Stack: Next.js, NestJS, PostgreSQL, Prisma. Live: javierramos.dev · Repo: jiramos87/portfolio · Achievement: Lighthouse 95+.
2. **agentic-dev-kit** — `TOOLING`, Public repo. "Open-source Claude Code skills, an MCP server, and PRD templates for building TS / Nest / Next apps with agents." Built with: CC skills, MCP server, PRD templates. Stack: TypeScript, Node.js, MCP. Live: npm · Repo: jiramos87/agentic-dev-kit · Achievement: CI green.
3. **territory-developer** — `CASE_STUDY`, Private code. "A 2D isometric city-builder grounded in real simulation, built with a custom agentic pipeline. Public writeup, private code." Built with: Agentic pipeline, Claude Code, PRD loop. Stack: Unity, C#, MCP. Live: Game page · Repo: Private · Achievement: Writeup.

#### 1e. Methodology loop (shared) — `#methodology`
Feature panel: 1px border, radius 20px, `linear-gradient(180deg, var(--surface), var(--card))`, padding `40px 40px 48px`. Centered eyebrow "THE METHOD" + H2 "A closed agentic loop, on every exhibit" + sub. Then a 4-column grid of step cards: **01 Explore / 02 PRD / 03 Implement / 04 Verify**, each with a 40px tinted-cyan icon tile (Lucide), mono step number, title (16px/600), one-line desc. Below: a dashed cyan "iterate" callout (RefreshCw icon) — "verify fails loop back to implement; Claude Design ⇄ UI runs on every visual change." This is the **key custom visual** — treat as a hero element.

#### 1f. GitHub activity (shared, dashboard-grade) — `#activity`
Eyebrow "PROOF — GITHUB ACTIVITY" + H2 "Backed by real, continuous work". Then:
- **Row (1.6fr / 1fr):**
  - **Contribution heatmap card:** header "**1,863** contributions · last 12 months" + "verified" dot. Grid of 53 week-columns × 7 day-cells (11px cells, 2.5px radius, 3px gaps). 5-bucket cyan intensity ramp: `rgba(255,255,255,.045)` → `rgba(34,211,238,.20)` → `.40` → `.64` → `#22d3ee`. Month labels above; "Less ▢▢▢▢▢ More" legend below. Horizontally scrollable on narrow widths.
  - **Language & tech breakdown card:** a 12px stacked bar (rounded) + legend rows. TypeScript 56% (`chart-1`), C# 16% (`chart-4`), JavaScript 12% (`chart-3`), CSS 9% (`chart-2`), Other 7% (`chart-5`).
- **Area chart card (full width):** title "Contributions over time" + sub, and a **time-range toggle** segmented control `1D / 7D / 1M / 1Y` (mono; active = `--card` bg + `--primary` text). Cyan area chart with gradient fill (`--primary` 0.28 → 0) and an end-point dot. Switching range re-renders the series.

#### 1g. Contact (shared) — `#contact`
Feature panel (radius 20px, surface→card gradient), 2-column grid gap 48px.
- **Left:** eyebrow "CONTACT" + H2 "Let's build something — and show how." + sub. Links: `hello@javierramos.dev` *(PLACEHOLDER email — swap)*, `linkedin.com/in/javier-ramos-humeres`, `github.com/jiramos87`, each with a `--primary` Lucide icon.
- **Right — form (primary CTA of the site):** Name + Email (2-col), Message textarea, all with `--input` border, `--background` fill, focus → `--ring`. Submit button = primary **gradient**, "Send message" + Send icon. On submit → success panel (success-tinted, Check icon, "Message sent / Thanks — I'll get back to you shortly.").

---

### Screen 2 — Design System page
Reached via nav "System". `max-width: 1180px`, padding `64px 40px`. Sections, each with a mono numbered rule header:
- **01 Color tokens** — 6-col swatch grid (64px swatch, radius 11px, 1px border) with token name + hex (mono).
- **02 Typography** — Geist / Geist Mono samples at Display / Heading / Body / Mono sizes.
- **03 Spacing · Radius · Elevation · Motion** — 4 cards: spacing bars (4/8/12/16/24/32), radius boxes (sm/md/lg), elevation (flat vs elevated), motion stops.
- **04 Component gallery** (2-col grid): Buttons (primary gradient / secondary / ghost / destructive); Badges (tech tag, "Built with", Public/Private visibility, achievement); KPI stat + sparkline + trend delta; Tabs; Timeline (commit/PR/deploy, colored dots + connector line); Code block (mono, line numbers, syntax-tinted); Donut (language mix); **Data table** (sortable headers with ↑/↓/↕, status dot, stack chips, repo link, pagination prev/next); Prose / PRD block (h3, p, ul, blockquote with `--primary` left rule, inline `code`).

---

## Interactions & behavior
- **Nav page switch:** `Work`/`System` swap the rendered page (client state). `Methodology`/`Contact` are in-page anchors (`#methodology`, `#contact`) on the landing.
- **A/B hero toggle:** switches hero direction only; rest of landing unchanged. *This is a design-exploration control — Javier should pick A or B for production and you can drop the toggle, OR keep it if he wants both.* Default shown: A.
- **Theme toggle:** flips `.dark` on `<html>`. Use `next-themes`, `defaultTheme="dark"`. (In the mock, tokens live on `html` (dark) with `[data-th="light"]` overrides; in your build use the standard shadcn `:root` light / `.dark` dark from `globals.css`.)
- **Area chart range toggle:** `1D/7D/1M/1Y` re-renders the series (different point counts/trend). Active range highlighted.
- **Data table sort:** clicking a header (Exhibit/Kind/Status/Shipped) toggles asc/desc on that column, resets to page 1. Sort glyphs ↑/↓ active, ↕ idle.
- **Table pagination:** 5 rows/page, prev/next buttons, "page N / M" label.
- **Tabs:** Product / How I built it / Metrics — switch body text; active tab has 2px `--primary` underline.
- **Contact form:** required fields; on submit, prevent default and show success panel (wire to a real endpoint/Server Action in production).
- **Hover:** links/chips muted→foreground; cards border→`--primary` (+ slight lift on exhibits); rows tinted `--muted`. No scale/bounce.
- **Reduced motion:** zero the entrance/transition durations.

## State management
Landing + System are client-rendered with simple UI state (the mock holds it in one component):
- `page`: `'home' | 'system'`
- `dir`: `'A' | 'B'` (hero direction; production may hardcode)
- `theme`: `'dark' | 'light'` (delegate to `next-themes`)
- `range`: `'1D' | '7D' | '1M' | '1Y'` (area chart)
- `sortKey` / `sortDir` / `tablePage` (data table)
- `tab` (tabs demo)
- `sent` (contact form success)

Data fetching for production: GitHub contributions/heatmap + language breakdown (GitHub GraphQL API), exhibit metadata (CMS/MDX or static), Lighthouse/commit counts (CI artifacts). In the mock these are static.

## Assets
- **No raster images / photography** (by design — flat, token-driven).
- **Icons:** Lucide (`lucide-react`), listed under "Tech & setup". Replace the two emoji lock glyphs (🔓/🔒) in the visibility badges with Lucide `Unlock`/`Lock`.
- **Brand wordmark:** text "Javier Ramos" + a "JR" monogram (mono, 1px `--primary` square, radius 9px). No logo file needed.
- **Fonts:** Geist + Geist Mono via `next/font/google`.

## Files in this bundle
- `globals.css` — production token sheet (shadcn contract + extras, dark + light). **Use as-is.**
- `tailwind.config.ts` — Tailwind v3 theme extension (skip if on v4).
- `Javier Ramos Portfolio.dc.html` — the design source (needs `support.js` to render; reference only).
- `support.js` — runtime for the `.dc.html` (reference only).
- `javier-ramos-portfolio.standalone.html` — self-contained offline build; open in a browser to inspect every state/interaction.

## Out of scope / next
Not yet designed (from the original brief, deferred): **Projects list** page, **Project detail** page (product gallery + "How I built this" PRD/timeline/metrics), full **Methodology** page (with demo video slot), and a standalone **Contact** page. The landing's methodology loop, exhibit cards, and activity block establish the patterns to extend. Light theme is wired and functional but was a secondary pass — verify AA in context before shipping light as default.
