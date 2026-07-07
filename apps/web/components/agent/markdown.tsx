"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Minimal markdown renderer for streamed agent replies. react-markdown escapes
 * raw HTML by default (no rehype-raw), so untrusted model output cannot inject
 * markup. Styling is inline per element (the repo has no typography plugin);
 * links open safely in a new tab.
 */
const COMPONENTS: Components = {
  p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h3 className="mt-3 mb-1 text-base font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-3 mb-1 text-base font-semibold first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-3 mb-1 text-sm font-semibold first:mt-0">{children}</h4>,
  code: ({ children, className }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-md border border-border bg-muted/60 p-3 font-mono text-xs first:mt-0 last:mb-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-sm text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
