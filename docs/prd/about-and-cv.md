# PRD — About page + HTML CV

Status: SHIPPED. (Reconciled 2026-06-24: live on javierramos.dev via PR #11; body matches the shipped pages.) Owner: Javier. Dogfood: prd -> implement -> verify -> reconcile.

## Why
The portfolio shows the work and how it was built, but there is no page that says who Javier is, and the only CV is a binary PDF download (not browsable, not linkable to a section, invisible to search). An About page and a web-native CV close both gaps: a human story for recruiters who want context, and a fast, shareable, indexable resume that the PDF can no longer be the only form of.

## Decisions (locked via poll, 2026-06-24)
- **Two pages:** `/about` (narrative + personality) and `/cv` (structured HTML resume). Cross-linked, each independently shareable.
- **Source of truth:** a static typed data file in `apps/web` (no DB, no API). CV content is derived from the current EN + ES PDFs; About copy is authored fresh. PDFs stay in sync manually.
- **Bilingual:** EN + ES toggle, scoped to just these two pages (the rest of the site stays EN-only). EN is the default. The toggle is a pair of links driven by a `?lang=` query param (server-rendered both ways: shareable + indexable, near-zero client JS).
- **Headshot:** real professional photo on `/about` (square, served from `/about/headshot.jpg`). Shipped behind an SVG placeholder + a one-line `HEADSHOT_SRC` constant, then flipped to the real photo before launch.
- **CV vs PDF:** the HTML `/cv` is canonical and browsable; a "Download PDF" button (EN/ES) sits on it. The existing PDFs stay as-is for ATS / offline.
- **Nav:** add an "About" link; repoint the existing CV button from the PDF to `/cv` (which itself offers the PDFs).
- **Voice:** professional but personal, first person.
- **About covers:** career story/path, how I work (agentic dev), beyond work. (No "what I'm looking for" hiring section in v1.)

## User experience (the loop)
- A visitor clicks **About** in the nav. They see a short hero (name, role, headshot), a first-person career story (physics -> full-stack -> building in public with AI agents), a "How I work" section that names the PRD -> implement -> verify -> reconcile loop and links to Methodology, and a short "Beyond work" note. A closing line links to Contact and to the CV.
- A visitor clicks **CV** (nav button) or the link from About. They land on `/cv`: a clean, structured resume (summary, experience, projects, education, publications, skills, languages) rendered as real HTML. A header row offers an **EN / ES** toggle and a **Download PDF** button matching the current language.
- Switching language re-renders the page in the other language and updates the URL (`/cv?lang=es`), so the link can be shared in either language.

## Acceptance (Given / When / Then)
- Given I am on any page, When I look at the nav, Then I see an "About" link and a "CV" control, and the CV control opens `/cv` (the HTML page), not the PDF.
- Given I open `/about`, When the page loads, Then I see a headshot, a first-person career story, a "How I work" section linking to `/methodology`, and a "Beyond work" note, with a link to `/cv` and to `/contact`.
- Given I open `/cv`, When the page loads, Then I see the full resume content from the data file (summary, experience with dates, projects, education, publications, skills, languages) and a "Download PDF" button.
- Given I am on `/cv` or `/about` in English, When I click **ES**, Then the page content renders in Spanish and the URL gains `?lang=es`; clicking **EN** returns to English.
- Given I am on `/cv?lang=es`, When I click "Download PDF", Then the Spanish PDF downloads; in EN it is the English PDF.
- Given Javier has not yet added a real photo, When `/about` renders, Then a styled placeholder shows in the headshot frame (never a broken image).

## Quality bar
- Both languages server-rendered (RSC); no layout shift on language switch.
- Headshot has explicit dimensions (no CLS) and meaningful `alt`; the language toggle marks the active language with `aria-current`.
- Responsive (mobile -> desktop) and correct in dark + light, matching the existing design tokens (`globals.css`, shadcn base-nova, cyan accent).
- Semantic structure: one `h1` per page, section headings, real lists for experience/skills. Lighthouse in line with the rest of the site (A11y / Best Practices / SEO 100, perf 95+).
- Honesty: CV mirrors the published PDFs; About is true. No fabricated metrics, titles, or dates.

## Out of scope
- Site-wide i18n (the toggle is page-local; nav/other pages stay EN-only).
- A "what I'm looking for" / hiring-CTA section (deferred to a later pass).
- Admin/CRUD editing of CV or About content (it is static, edited in-repo).
- Print-optimized CSS for `/cv` (the PDF download covers print/ATS; the HTML is for browsing).
- Auto-generating the PDF from the HTML, or parsing the PDF at build time.
- A mobile nav menu. About/CV stay desktop-only in the header (the nav hides links below `md`, matching every other nav item); no hamburger menu added.

## Done looks like
`/about` and `/cv` are live on `javierramos.dev`, reachable from the nav, bilingual via an EN/ES toggle, with a real headshot on About and a Download-PDF button on CV, all content honest and matching the PDFs.

## Build plan (mechanical)
**Shared**
- `apps/web/lib/i18n.ts` (new): `type Lang = "en" | "es"`; `resolveLang(searchParams)` -> `"en" | "es"` (default `"en"`); small helper to build a `?lang=` href.
- `apps/web/lib/site.ts`: add `ABOUT_PATH = "/about"`, `CV_PATH = "/cv"` (keep `CV_EN_PATH` / `CV_ES_PATH` for the download buttons).

**Data**
- `apps/web/lib/cv.ts` (new): typed `CvContent` (header{name,title,location,email,linkedin,github}, summary, experience[]{role,org,period,location,bullets[]}, projects[]{name,context,body}, education[]{title,org,period,location}, publications[]{title,venue,year,note}, skills{group->items[]}, languages[]{name,level}) and `CV_DATA: Record<Lang, CvContent>` populated from the EN + ES PDFs.
- `apps/web/lib/about.ts` (new): typed `AboutContent` (hero{name,role,blurb}, careerStory paragraphs, howIWork{heading,body,methodologyHref}, beyondWork{heading,body}, closing{text,cvHref,contactHref}) and `ABOUT_DATA: Record<Lang, AboutContent>`.

**Pages**
- `apps/web/app/cv/page.tsx` (new, server component): read `searchParams.lang`, render `CV_DATA[lang]`. Header action row = `LangToggle` + Download-PDF link (EN/ES path by lang). `generateMetadata` per lang.
- `apps/web/app/about/page.tsx` (new, server component): read `searchParams.lang`, render `ABOUT_DATA[lang]` + headshot + `LangToggle`. `generateMetadata`.
- `apps/web/components/site/lang-toggle.tsx` (new): two links (EN/ES) preserving the current path, active one `aria-current`. Pure links, no client state.

**Assets**
- `apps/web/public/about/headshot.jpg`: the real photo (400x400 square), rendered in an `aspect-square` frame with `object-cover`. Shipped first as an SVG placeholder pointed at by `HEADSHOT_SRC` (`apps/web/lib/site.ts`), then flipped to the JPG and the placeholder removed.

**Nav + SEO**
- `apps/web/components/site/site-nav.tsx`: add `{ href: "/about", label: "About" }` to `LINKS`; change the CV button from `<a href={CV_EN_PATH} target="_blank">` to `<Link href={CV_PATH}>` (keep the FileText icon + "CV" label).
- `apps/web/app/sitemap.ts`: add `/about` and `/cv` to the static routes.

## Verify
- Gate: `pnpm check-types && pnpm lint && pnpm build` (turbo; web lint `--max-warnings 0`).
- Preview: `/about` and `/cv` render in EN; `?lang=es` switches both; Download-PDF links resolve to the right PDF; nav "About" + "CV" work; dark + light + mobile look right; headshot frame shows the placeholder.
- Deploy: web is static (Vercel auto-deploys on push to `main`); no API/DB/Vercel-env change needed.

## Scope changes (living log)
- 2026-06-24: PRD created; acceptance locked via two-batch poll (architecture, source, i18n, photo, content, nav, CV/PDF, voice). - added - net-new feature.
- 2026-06-24: Headshot frame shipped as `aspect-square`, not the planned 4:5. - changed - the provided photo is 400x400 square; square fits it with no face-crop.
- 2026-06-24: Placeholder shipped as an SVG behind a `HEADSHOT_SRC` constant (not a same-filename JPG), then flipped to the real photo and the SVG removed at launch. - changed - a one-line constant swap is cleaner and never shows a broken image.
- 2026-06-24: EN/ES kept faithful to each PDF (ES Pinflag keeps Getnet and a Hybrid tag, EN omits both) rather than aligned. - decided - honesty to the published downloads beats a tidy match.
- 2026-06-24: Added `/about` + `/cv` to `sitemap.ts`. - shipped-beyond-spec - implied by the indexability quality bar but not in the original build plan.
- 2026-06-24: "What I'm looking for" hiring section stays deferred; a mobile nav menu noted out of scope (About/CV are desktop-only in the header, matching the existing nav). - deferred - smaller launch surface.
