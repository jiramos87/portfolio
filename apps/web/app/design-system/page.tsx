import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagChip } from "@/components/site/tag-chip";
import { MetricChip } from "@/components/site/metric-chip";
import { Timeline } from "@/components/projects/timeline";
import { LanguageBar } from "@/components/landing/language-bar";
import type { LanguageSlice, Stack } from "@/lib/honesty";

export const metadata: Metadata = {
  title: "Design system | Javier Ramos",
  description: "Tokens, type & components: a dark-first shadcn/ui system with a cyan accent.",
};

const COLOR_TOKENS = [
  { name: "--background", value: "#0a0e13", className: "bg-background" },
  { name: "--card", value: "#11161d", className: "bg-card" },
  { name: "--muted", value: "#1a222c", className: "bg-muted" },
  { name: "--primary", value: "#22d3ee", className: "bg-primary" },
  { name: "--accent", value: "#22d3ee", className: "bg-accent" },
  { name: "--foreground", value: "#e7edf3", className: "bg-foreground" },
  { name: "--success", value: "#34d399", className: "bg-success" },
  { name: "--warning", value: "#fbbf24", className: "bg-warning" },
  { name: "--destructive", value: "#f87171", className: "bg-destructive" },
  { name: "--chart-3", value: "#60a5fa", className: "bg-chart-3" },
  { name: "--chart-4", value: "#a78bfa", className: "bg-chart-4" },
  { name: "--border", value: "rgba .09", className: "bg-border" },
] as const;

const SPACING = [4, 8, 12, 16, 24, 32];
const RADII = [
  { label: "sm · 6", className: "rounded-sm" },
  { label: "md · 12", className: "rounded-lg" },
  { label: "lg · 16", className: "rounded-xl" },
];
const MOTION = [
  { label: "fast", value: "120ms" },
  { label: "base", value: "200ms" },
  { label: "slow", value: "320ms" },
  { label: "ease", value: "(.2,.7,.2,1)" },
];

const DEMO_LANGS: LanguageSlice[] = [
  { name: "TypeScript", pct: 56 },
  { name: "C#", pct: 16 },
  { name: "JavaScript", pct: 12 },
  { name: "CSS", pct: 9 },
  { name: "Other", pct: 7 },
];

const DEMO_STACKS: Stack[] = [
  { name: "TypeScript" },
  { name: "JavaScript" },
  { name: "C#" },
  { name: "Python" },
  { name: "SQL" },
];

const DEMO_TIMELINE = [
  { date: "2026-06-22", type: "deploy", label: "Deployed to production · vercel · main" },
  { date: "2026-06-22", type: "pr", label: "Merged PR #42: landing hero · jiramos87/portfolio" },
  { date: "2026-06-22", type: "commit", label: "feat: terminal panel · 8 files · +312 −44" },
];

const DONUT_COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--muted-foreground)"];

function Donut({ slices }: { slices: LanguageSlice[] }) {
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg viewBox="0 0 80 80" className="size-28" role="img" aria-label="Language mix donut">
      <g transform="rotate(-90 40 40)">
        {slices.map((slice, i) => {
          const len = (slice.pct / 100) * circ;
          const seg = (
            <circle
              key={slice.name}
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth="14"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return seg;
        })}
      </g>
    </svg>
  );
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{num}</span> · {title}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>DESIGN SYSTEM</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Tokens, type &amp; components
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A dark-first system on the shadcn/ui CSS-variable contract, with a cyan accent
        and one gradient moment reserved for the primary CTA. Built for Next.js +
        Tailwind + shadcn/ui.
      </p>

      <Section num="01" title="COLOR TOKENS">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="rounded-xl border border-border bg-card p-3">
              <div className={`h-12 w-full rounded-lg border border-border ${token.className}`} />
              <p className="mt-2 font-mono text-xs text-foreground">{token.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{token.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section num="02" title="TYPOGRAPHY · Geist / Geist Mono">
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Display · 76
            </span>
            <p className="text-5xl font-semibold tracking-tight md:text-6xl">Build in public</p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Heading · 32
            </span>
            <p className="text-3xl font-semibold tracking-tight">
              The product and the build log
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Body · 16
            </span>
            <p className="text-base text-muted-foreground">
              Each exhibit is real, deployed, and backed by GitHub activity, with the
              agent-driven process shown in full.
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Mono · 13
            </span>
            <p className="font-mono text-[13px] text-foreground">
              TECH-358 · +312 −44 · main@a1f9c2
            </p>
          </div>
        </div>
      </Section>

      <Section num="03" title="SPACING · RADIUS · ELEVATION · MOTION">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Spacing
            </p>
            <div className="mt-4 flex items-end gap-3">
              {SPACING.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div className="bg-primary/70" style={{ width: s, height: s }} />
                  <span className="font-mono text-[10px] text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Radius
            </p>
            <div className="mt-4 flex gap-4">
              {RADII.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-1">
                  <div className={`size-12 border border-border bg-muted ${r.className}`} />
                  <span className="font-mono text-[10px] text-muted-foreground">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Elevation
            </p>
            <div className="mt-4 flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="size-16 rounded-lg border border-border bg-card" />
                <span className="font-mono text-[10px] text-muted-foreground">flat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="size-16 rounded-lg bg-card ring-1 ring-foreground/10 shadow-lg" />
                <span className="font-mono text-[10px] text-muted-foreground">elevated</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Motion
            </p>
            <ul className="mt-4 space-y-1.5">
              {MOTION.map((m) => (
                <li key={m.label} className="flex justify-between font-mono text-xs">
                  <span className="text-foreground">{m.label}</span>
                  <span className="text-muted-foreground">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section num="04" title="COMPONENT GALLERY">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Buttons
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="cta-gradient">Primary CTA</Button>
              <Button variant="outline">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Badges &amp; tags
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <TagChip tag="REAL" />
              <TagChip tag="NOW" />
              <TagChip tag="TARGET" />
              <TagChip tag="TECH" />
              <TagChip tag="PLACEHOLDER" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              KPI stat
            </p>
            <MetricChip metric={{ key: "lh", label: "Lighthouse", value: "95+", kind: "target" }} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Tabs
            </p>
            <Tabs defaultValue="product">
              <TabsList>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="build">How I built it</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              <TabsContent value="product" className="pt-3 text-sm text-muted-foreground">
                The shipped product, the problem, the stack.
              </TabsContent>
              <TabsContent value="build" className="pt-3 text-sm text-muted-foreground">
                The PRD and the build timeline.
              </TabsContent>
              <TabsContent value="metrics" className="pt-3 text-sm text-muted-foreground">
                Honest, tagged metrics.
              </TabsContent>
            </Tabs>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Timeline
            </p>
            <Timeline entries={DEMO_TIMELINE} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Code block
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed">
              <code>
                <span className="text-primary">→</span> implement landing.tsx · +312 −44
              </code>
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Donut · language mix
            </p>
            <div className="flex items-center gap-6">
              <Donut slices={DEMO_LANGS} />
              <ul className="space-y-1 font-mono text-xs">
                {DEMO_LANGS.map((l, i) => (
                  <li key={l.name} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-[2px]"
                      style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      aria-hidden
                    />
                    <span className="text-foreground">{l.name}</span>
                    <span className="text-muted-foreground">{l.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <LanguageBar stacks={DEMO_STACKS} />
          </div>
        </div>
      </Section>
    </main>
  );
}
