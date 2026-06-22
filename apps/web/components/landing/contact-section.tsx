import { Mail } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";

const LINKS = [
  { icon: Mail, label: "hello@javierramos.dev", href: "mailto:hello@javierramos.dev" },
  {
    icon: LinkedinIcon,
    label: "linkedin.com/in/javier-ramos-humeres",
    href: "https://linkedin.com/in/javier-ramos-humeres",
  },
  { icon: GithubIcon, label: "github.com/jiramos87", href: "https://github.com/jiramos87" },
] as const;

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>CONTACT</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Let&apos;s build something — and show how.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Open to remote full-stack roles and agentic-tooling work. Send a note and
            I&apos;ll reply with relevant exhibits.
          </p>

          <ul className="mt-8 space-y-3">
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
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
