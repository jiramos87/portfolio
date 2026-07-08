import type { Metadata } from "next";
import { ExternalLink, FileText, Mail, MapPin } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { LangToggle } from "@/components/site/lang-toggle";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveLang } from "@/lib/i18n";
import { CV_DATA, CV_PROFILE } from "@/lib/cv";
import { CV_EN_PATH, CV_ES_PATH, CV_PATH } from "@/lib/site";

type SearchParams = Promise<{ lang?: string }>;

const META = {
  en: {
    title: `CV | ${CV_PROFILE.name}`,
    description:
      "Resume of Javier Ramos Humeres: full-stack software engineer building with AI agents and MCP. Experience, skills, education, and a downloadable PDF.",
  },
  es: {
    title: `CV | ${CV_PROFILE.name}`,
    description:
      "CV de Javier Ramos Humeres: ingeniero de software full-stack que construye con agentes de IA y MCP. Experiencia, habilidades, educación y PDF descargable.",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const lang = resolveLang(await searchParams);
  return META[lang];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
      {children}
    </h2>
  );
}

export default async function CvPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const lang = resolveLang(await searchParams);
  const cv = CV_DATA[lang];
  const pdfPath = lang === "es" ? CV_ES_PATH : CV_EN_PATH;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow>CV</Eyebrow>
        <div className="flex items-center gap-2">
          <LangToggle pathname={CV_PATH} active={lang} />
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <FileText className="size-4" aria-hidden />
            {cv.labels.downloadPdf}
          </a>
        </div>
      </div>

      <header className="mt-6 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold tracking-tight">{CV_PROFILE.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{cv.title}</p>
        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" aria-hidden />
            {CV_PROFILE.location}
          </li>
          <li>
            <a
              href={`mailto:${CV_PROFILE.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="size-3.5 text-primary" aria-hidden />
              {CV_PROFILE.email}
            </a>
          </li>
          <li>
            <a
              href={CV_PROFILE.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="size-3.5 text-primary" aria-hidden />
              {CV_PROFILE.linkedin.label}
            </a>
          </li>
          <li>
            <a
              href={CV_PROFILE.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-3.5 text-primary" aria-hidden />
              {CV_PROFILE.github.label}
            </a>
          </li>
        </ul>
      </header>

      <section className="mt-8">
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          {cv.summary}
        </p>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.experience}</SectionHeading>
        <div className="mt-4 space-y-7">
          {cv.experience.map((job) => (
            <article key={`${job.org}-${job.period}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-semibold">
                  {job.role}
                  <span className="font-normal text-muted-foreground"> · {job.org}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {job.period}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {job.location}
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.projects}</SectionHeading>
        <div className="mt-4 space-y-5">
          {cv.projects.map((p) => (
            <article key={p.name}>
              <h3 className="text-base font-semibold">
                {p.name}
                <span className="font-normal text-muted-foreground"> · {p.context}</span>
              </h3>
              <p className="mt-2 max-w-prose text-sm text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.education}</SectionHeading>
        <ul className="mt-4 space-y-4">
          {cv.education.map((e) => (
            <li
              key={e.title}
              className="flex flex-wrap items-baseline justify-between gap-x-3"
            >
              <div>
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {e.org} · {e.location}
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.publications}</SectionHeading>
        <div className="mt-4 space-y-5">
          {cv.publications.map((p) => (
            <article key={p.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="max-w-prose text-sm font-semibold">{p.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{p.venue}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
              {p.officialUrl || p.pdfUrl ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  {p.officialUrl ? (
                    <a
                      href={p.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
                    >
                      <ExternalLink className="size-3" aria-hidden />
                      MIT Press
                    </a>
                  ) : null}
                  {p.pdfUrl ? (
                    <a
                      href={p.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      <FileText className="size-3" aria-hidden />
                      PDF
                    </a>
                  ) : null}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.skills}</SectionHeading>
        <dl className="mt-4 space-y-3">
          {cv.skills.map((s) => (
            <div key={s.group} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <dt className="font-mono text-xs uppercase tracking-wide text-foreground sm:w-40 sm:shrink-0">
                {s.group}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {it}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10">
        <SectionHeading>{cv.labels.languages}</SectionHeading>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {cv.languages.map((l) => (
            <li key={l.name} className="text-sm">
              <span className="font-semibold">{l.name}</span>
              <span className="text-muted-foreground"> · {l.level}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
