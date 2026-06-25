import type { Metadata } from "next";
import Link from "next/link";
import { Mail, FileText } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { buttonVariants } from "@/components/ui/button";
import { CONTACT_EMAIL, CV_EN_PATH, CV_ES_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Javier Ramos",
  description: "Open to remote full-stack roles and freelance work.",
};

const SOCIAL_LINKS = [
  {
    icon: LinkedinIcon,
    label: "linkedin.com/in/javier-ramos-humeres",
    href: "https://linkedin.com/in/javier-ramos-humeres",
  },
  { icon: GithubIcon, label: "github.com/jiramos87", href: "https://github.com/jiramos87" },
] as const;

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Eyebrow>CONTACT</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Let&apos;s build something
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Open to remote full-stack roles and freelance work. Send a note and
        I&apos;ll reply as soon as possible.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <Link
            href={`mailto:${CONTACT_EMAIL}`}
            className={buttonVariants({ size: "lg", className: "cta-gradient w-fit" })}
          >
            <Mail className="size-4" aria-hidden />
            {CONTACT_EMAIL}
          </Link>

          <div className="space-y-1.5">
            <a
              href={CV_EN_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", className: "w-fit" })}
            >
              <FileText className="size-4" aria-hidden />
              Download CV (PDF)
            </a>
            <p className="font-mono text-xs text-muted-foreground">
              Also in{" "}
              <a
                href={CV_ES_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                Spanish
              </a>
              .
            </p>
          </div>

          <ul className="space-y-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <link.icon className="size-4 text-primary" aria-hidden />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
