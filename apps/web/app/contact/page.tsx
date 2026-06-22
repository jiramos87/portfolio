import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";

export const metadata: Metadata = {
  title: "Contact — Javier Ramos",
  description: "Open to remote full-stack roles and agentic-tooling work.",
};

const LINKS = [
  { icon: Mail, label: "hello@javierramos.dev", href: "mailto:hello@javierramos.dev" },
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
        Let&apos;s build something — and show how.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Open to remote full-stack roles and agentic-tooling work. Send a note and
        I&apos;ll reply with relevant exhibits.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ul className="space-y-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="size-4 text-primary" aria-hidden />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
