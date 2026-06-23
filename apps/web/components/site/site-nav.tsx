"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "@/components/site/brand-icons";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/methodology", label: "Methodology" },
  { href: "/design-system", label: "System" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Javier Ramos, home">
          <span
            aria-hidden
            className="cta-gradient flex size-7 items-center justify-center rounded-md font-mono text-xs font-bold"
          >
            JR
          </span>
          <span className="text-sm font-semibold tracking-tight">Javier Ramos</span>
        </Link>

        <ul className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/jiramos87"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <GithubIcon className="size-4" />
          </a>
          <Link href="/contact" className={buttonVariants()}>
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
