import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Lang, langHref } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

/**
 * EN/ES switch for /about and /cv. Pure links to the same path with a `?lang=`
 * query, so both languages are server-rendered and shareable. No client state.
 */
export function LangToggle({ pathname, active }: { pathname: string; active: Lang }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-lg border border-border bg-card p-0.5"
    >
      {LANGS.map((l) => {
        const isActive = l.code === active;
        return (
          <Link
            key={l.code}
            href={langHref(pathname, l.code)}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
