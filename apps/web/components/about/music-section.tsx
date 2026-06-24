/* eslint-disable @next/next/no-img-element -- static, pre-optimized webp art; next/image is unnecessary for these small below-the-fold assets */
import type { ComponentType, SVGProps } from "react";
import {
  SpotifyIcon,
  AppleMusicIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
  BandcampIcon,
} from "@/components/site/brand-icons";
import { cn } from "@/lib/utils";
import { JAVI_INSTAGRAM, type MusicPlatform, type MusicProject } from "@/lib/about";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const PLATFORM_META: Record<MusicPlatform, { label: string; Icon: IconType }> = {
  spotify: { label: "Spotify", Icon: SpotifyIcon },
  appleMusic: { label: "Apple Music", Icon: AppleMusicIcon },
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  bandcamp: { label: "Bandcamp", Icon: BandcampIcon },
};

const ACCENT: Record<
  MusicProject["accent"],
  { box: string; bar: string; name: string; icon: string; tint: string }
> = {
  magenta: {
    box: "border-fuchsia-500/25 hover:border-fuchsia-500/50",
    bar: "bg-fuchsia-500",
    name: "text-fuchsia-300",
    icon: "hover:border-fuchsia-500/40 hover:bg-fuchsia-500/15 hover:text-fuchsia-200",
    tint: "bg-fuchsia-500/5",
  },
  amber: {
    box: "border-amber-500/25 hover:border-amber-500/50",
    bar: "bg-amber-500",
    name: "text-amber-300",
    icon: "hover:border-amber-500/40 hover:bg-amber-500/15 hover:text-amber-200",
    tint: "bg-amber-500/5",
  },
};

export function MusicSection({
  heading,
  blurb,
  personalLabel,
  projects,
}: {
  heading: string;
  blurb: string;
  personalLabel: string;
  projects: MusicProject[];
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">{blurb}</p>

      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {personalLabel}
        <a
          href={JAVI_INSTAGRAM.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:border-fuchsia-500/40 hover:text-fuchsia-200"
        >
          <InstagramIcon className="size-3.5" />
          {JAVI_INSTAGRAM.handle}
        </a>
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {projects.map((p) => {
          const a = ACCENT[p.accent];
          const contain = p.imageFit === "contain";
          return (
            <article
              key={p.name}
              className={cn(
                "overflow-hidden rounded-2xl border bg-card transition-colors",
                a.box,
              )}
            >
              <div className={cn("h-1 w-full", a.bar)} />
              <div
                className={cn(
                  "relative aspect-video w-full overflow-hidden",
                  contain ? a.tint : "bg-muted",
                )}
              >
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  loading="lazy"
                  className={cn(
                    "size-full",
                    contain ? "object-contain p-3" : "object-cover",
                  )}
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2.5">
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt=""
                      className="size-8 shrink-0 rounded-md object-contain"
                    />
                  ) : null}
                  <div>
                    <h3 className={cn("text-lg font-semibold leading-tight", a.name)}>
                      {p.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {p.tagline}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>

                {p.gallery?.length ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {p.gallery.map((g) => (
                      <img
                        key={g.src}
                        src={g.src}
                        alt={g.alt}
                        loading="lazy"
                        className="aspect-video w-full rounded-md object-cover"
                      />
                    ))}
                  </div>
                ) : null}

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.links.map((l) => {
                    const meta = PLATFORM_META[l.platform];
                    const Icon = meta.Icon;
                    return (
                      <li key={l.platform}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.name} on ${meta.label}`}
                          title={meta.label}
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors",
                            a.icon,
                          )}
                        >
                          <Icon className="size-4" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
