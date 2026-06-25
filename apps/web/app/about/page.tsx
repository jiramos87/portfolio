import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { LangToggle } from "@/components/site/lang-toggle";
import { MusicSection } from "@/components/about/music-section";
import { PublicationBox } from "@/components/about/publication-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveLang } from "@/lib/i18n";
import { ABOUT_DATA } from "@/lib/about";
import { ABOUT_PATH, CV_PATH, HEADSHOT_SRC } from "@/lib/site";

type SearchParams = Promise<{ lang?: string }>;

const META = {
  en: {
    title: "About | Javier Ramos",
    description:
      "Javier Ramos Humeres: physics graduate turned full-stack software engineer, building production systems with agentic dev tooling.",
  },
  es: {
    title: "Sobre mí | Javier Ramos",
    description:
      "Javier Ramos Humeres: licenciado en física convertido en ingeniero de software full-stack, que construye sistemas en producción con herramientas de desarrollo agéntico.",
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

export default async function AboutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const lang = resolveLang(await searchParams);
  const about = ABOUT_DATA[lang];

  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <LangToggle pathname={ABOUT_PATH} active={lang} />
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
              {about.heroHeadline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {about.heroBlurb}
            </p>
          </div>
          <div className="order-first md:order-last">
            <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-2xl border border-border bg-card sm:w-52 md:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element -- single static headshot; swap via HEADSHOT_SRC */}
              <img
                src={HEADSHOT_SRC}
                alt={about.headshotAlt}
                width={400}
                height={400}
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-6 py-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{about.careerHeading}</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {about.careerParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {about.howIWork.heading}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {about.howIWork.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            href="/methodology"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {about.methodologyCta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {about.beyondWork.heading}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {about.beyondWork.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <MusicSection
          heading={about.musicHeading}
          blurb={about.musicBlurb}
          personalLabel={about.musicPersonalLabel}
          projects={about.music}
        />
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-6 pb-16">
        <PublicationBox
          heading={about.publicationHeading}
          publication={about.publication}
          officialLabel={lang === "es" ? "Ver en MIT Press" : "View at MIT Press"}
          pdfLabel={lang === "es" ? "Leer el PDF" : "Read the PDF"}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-base text-foreground">{about.closing.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={CV_PATH} className={cn(buttonVariants())}>
              {about.closing.cvCta}
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {about.closing.contactCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
