import { ExternalLink, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Publication } from "@/lib/about";

export function PublicationBox({
  heading,
  publication,
  officialLabel,
  pdfLabel,
}: {
  heading: string;
  publication: Publication;
  officialLabel: string;
  pdfLabel: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          {publication.venue} · {publication.year}
        </p>
        <h3 className="mt-2 max-w-prose text-base font-semibold">
          {publication.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{publication.note}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={publication.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "cta-gradient")}
          >
            <ExternalLink className="size-4" aria-hidden />
            {officialLabel}
          </a>
          <a
            href={publication.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <FileText className="size-4" aria-hidden />
            {pdfLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
