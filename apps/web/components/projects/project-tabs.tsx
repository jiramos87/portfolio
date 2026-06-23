"use client";

import { ExternalLink, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { MetricChip } from "@/components/site/metric-chip";
import { Timeline } from "@/components/projects/timeline";
import { ScreenshotGallery } from "@/components/projects/screenshot-gallery";
import type { Project } from "@/lib/api";

export function ProjectTabs({ project }: { project: Project }) {
  const metrics = project.metrics ?? [];
  const timeline = project.timeline ?? [];

  return (
    <Tabs defaultValue="product" className="gap-6">
      <TabsList className="w-fit">
        <TabsTrigger value="product" className="flex-none px-3">
          Product
        </TabsTrigger>
        <TabsTrigger value="build" className="flex-none px-3">
          How I built it
        </TabsTrigger>
        <TabsTrigger value="metrics" className="flex-none px-3">
          Metrics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="product" className="space-y-6">
        <p className="text-muted-foreground">
          The shipped product: live link, the problem it solves, and the stack it runs
          on.
        </p>

        <div>
          <h3 className="text-sm font-medium">The problem</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.problem}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Stack</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {project.screenshots.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium">Screenshots</h3>
            <div className="mt-2">
              <ScreenshotGallery
                screenshots={project.screenshots}
                name={project.name}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Screenshots coming soon.</p>
        )}
      </TabsContent>

      <TabsContent value="build" className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Product requirements</h3>
            {project.prdUrl ? (
              <a
                href={project.prdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <FileText className="size-3.5" aria-hidden />
                Open the PRD
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>

          {project.prd ? (
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <pre className="font-sans text-sm whitespace-pre-wrap text-muted-foreground">
                {project.prd}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {project.prdUrl
                ? "The full PRD lives in the repo. Open it above."
                : "PRD not published for this exhibit yet."}
            </p>
          )}

          {project.buildStory ? (
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              {project.buildStory}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className="text-base font-semibold">Timeline</h3>
          <div className="mt-4">
            <Timeline entries={timeline} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="metrics" className="space-y-4">
        {metrics.some((m) => m.key === "ship-time") ? (
          <p className="max-w-2xl text-foreground">
            Designed, built, and shipped in under 24 hours for under $15 of agent
            time, about 15% of a weekly Claude Code plan. That is roughly 7 projects
            of capacity in a five-day work week.
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          Each metric carries an honesty tag. Verified numbers read solid; targets and
          placeholders read muted.
        </p>
        {metrics.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <MetricChip key={metric.key} metric={metric} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            No metrics published for this exhibit yet.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
