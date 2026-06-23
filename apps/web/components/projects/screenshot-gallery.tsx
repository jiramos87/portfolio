import Image from "next/image";

/**
 * Renders a project's screenshots (paths under /public) as a responsive grid.
 * Uniform 16:10 cards with object-contain so mixed aspect ratios letterbox
 * cleanly instead of distorting; next/image keeps the heavy PNGs optimized.
 */
export function ScreenshotGallery({
  screenshots,
  name,
}: {
  screenshots: string[];
  name: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {screenshots.map((src, i) => (
        <figure
          key={src}
          className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-card"
        >
          <Image
            src={src}
            alt={`${name} screenshot ${i + 1}`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        </figure>
      ))}
    </div>
  );
}
