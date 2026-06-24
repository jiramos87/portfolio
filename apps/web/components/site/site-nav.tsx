"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "@/components/site/brand-icons";
import { CV_PATH } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/methodology", label: "Methodology" },
  { href: "/design-system", label: "Design System" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <Link
            href={CV_PATH}
            aria-label="View CV"
            className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex")}
          >
            <FileText className="size-4" aria-hidden />
            CV
          </Link>
          <Link href="/contact" className={cn(buttonVariants(), "hidden md:inline-flex")}>
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-6 py-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(pathname, link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-2 pt-3">
              <Link
                href={CV_PATH}
                onClick={() => setOpen(false)}
                aria-label="View CV"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                <FileText className="size-4" aria-hidden />
                CV
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants(), "flex-1")}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
