import Image from "next/image";

/** Renders a project's screenshots as a responsive grid (paths under /public). */
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
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Image
            src={src}
            alt={`${name} screenshot ${i + 1}`}
            width={1280}
            height={800}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-auto w-full"
          />
        </figure>
      ))}
    </div>
  );
}
