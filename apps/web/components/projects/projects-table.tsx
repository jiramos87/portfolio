"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown, ExternalLink, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/site/brand-icons";
import type { Project } from "@/lib/api";

const KIND_LABEL: Record<Project["kind"], string> = {
  WEB_APP: "WEB_APP",
  TOOLING: "TOOLING",
  CASE_STUDY: "CASE_STUDY",
};
const STATUS_LABEL: Record<Project["status"], string> = {
  LIVE: "Live",
  IN_PROGRESS: "In progress",
  ARCHIVED: "Archived",
};

type SortKey = "name" | "kind" | "status";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "kind", label: "Kind" },
  { key: "status", label: "Status" },
];

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const copy = [...projects];
    copy.sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [projects, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMNS.map((col) => (
              <TableHead key={col.key} className="px-4">
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  {col.label}
                  {sortKey === col.key ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3" aria-hidden />
                    ) : (
                      <ArrowDown className="size-3" aria-hidden />
                    )
                  ) : (
                    <ChevronsUpDown className="size-3 opacity-50" aria-hidden />
                  )}
                </button>
              </TableHead>
            ))}
            <TableHead className="px-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Stack
            </TableHead>
            <TableHead className="px-4 text-right font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Links
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((project) => (
            <TableRow
              key={project.id}
              onClick={() => router.push(`/projects/${project.slug}`)}
              className="cursor-pointer"
            >
              <TableCell className="px-4 py-3">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium hover:text-primary"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="px-4 py-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {KIND_LABEL[project.kind]}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs",
                    project.status === "LIVE" ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      project.status === "LIVE" ? "bg-success" : "bg-muted-foreground",
                    )}
                    aria-hidden
                  />
                  {STATUS_LABEL[project.status]}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${project.name} live site`}
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${project.name} repository`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <GithubIcon className="size-4" />
                    </a>
                  ) : (
                    <span
                      aria-label="Private code"
                      title="Private code"
                      className="text-muted-foreground"
                    >
                      <Lock className="size-4" aria-hidden />
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
