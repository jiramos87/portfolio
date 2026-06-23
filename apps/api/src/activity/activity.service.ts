import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import {
  fetchContributionCalendar,
  fetchRepoStats,
  fetchRecentCommits,
  parseGitHubRepo,
  CURATED_STACKS,
  type CalendarWeek,
} from '../github/github';

/** A single point of the normalized contributions time series. */
interface SeriesPoint {
  date: string;
  count: number;
}

/** Normalized series the contributions chart can render per range. */
interface ContributionsSeries {
  /** Last day, by day. */
  ['1D']: SeriesPoint[];
  /** Last 7 days, by day. */
  ['7D']: SeriesPoint[];
  /** Last 30 days, by day. */
  ['1M']: SeriesPoint[];
  /** Trailing year, aggregated by ISO week (week-ending date). */
  ['1Y']: SeriesPoint[];
}

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  // Explicit @Inject so DI resolves even when the script runs under tsx/esbuild,
  // which does not emit the decorator metadata Nest would otherwise reflect on.
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Latest GitHub activity snapshot, or null if none has been captured yet. */
  getLatest() {
    return this.prisma.activitySnapshot.findFirst({
      orderBy: { capturedAt: 'desc' },
    });
  }

  /**
   * Pull live GitHub data and write a NEW, real snapshot (isPlaceholder=false).
   * Tokens are read from the environment and never logged.
   */
  async refresh() {
    const contribToken = process.env.GITHUB_TOKEN;
    const repoToken = process.env.GITHUB_REPO_TOKEN;
    if (!contribToken) throw new Error('GITHUB_TOKEN is not set');
    if (!repoToken) throw new Error('GITHUB_REPO_TOKEN is not set');

    this.logger.log('Fetching GitHub contribution calendar…');
    const calendar = await fetchContributionCalendar(contribToken);

    this.logger.log('Fetching repo stats…');
    const repoStats = await fetchRepoStats(repoToken);

    // Curated primary stacks: honest "what I build in", not a byte breakdown.
    const languages = CURATED_STACKS.map((name) => ({ name }));

    const series = buildSeries(calendar.weeks);

    // The github helper types are precise structs; Prisma's Json input wants an
    // index-signature shape, so cast through `unknown` at the persistence edge.
    const snapshot = await this.prisma.activitySnapshot.create({
      data: {
        totalContribs: calendar.totalContributions,
        calendar: {
          weeks: calendar.weeks,
          series,
        } as unknown as Prisma.InputJsonValue,
        languages: languages,
        repoStats: repoStats as unknown as Prisma.InputJsonValue,
        source: 'github',
        isPlaceholder: false,
      },
    });

    this.logger.log(
      `Snapshot written: totalContribs=${calendar.totalContributions}, ` +
        `languages=${languages.length}, repos=${repoStats.length}`,
    );

    // Per-exhibit live commit feed. Non-fatal: a commit-fetch failure must not
    // discard the snapshot we just wrote.
    let repoCommitFeeds = 0;
    try {
      const feeds = await this.refreshRepoCommits(repoToken);
      repoCommitFeeds = feeds.length;
    } catch (err) {
      this.logger.error(
        `Repo commit refresh skipped: ${(err as Error).message}`,
      );
    }

    return {
      id: snapshot.id,
      totalContributions: calendar.totalContributions,
      languages,
      repoStats: repoStats,
      repoCommitFeeds,
    };
  }

  /**
   * Refresh the recent-commits feed for every public-repo exhibit and store it
   * on the Project row (read by the "How I built it" tab). Per-repo failures are
   * logged and skipped so one bad repo never blocks the others.
   *
   * @param repoToken fine-grained token with Contents:read (defaults to env).
   * @returns one entry per repo that was successfully refreshed.
   */
  async refreshRepoCommits(
    repoToken = process.env.GITHUB_REPO_TOKEN,
  ): Promise<{ slug: string; repo: string; count: number }[]> {
    if (!repoToken) throw new Error('GITHUB_REPO_TOKEN is not set');

    const projects = await this.prisma.project.findMany({
      where: { repoPublic: true, repoUrl: { not: null } },
      select: { id: true, slug: true, repoUrl: true },
    });

    const results: { slug: string; repo: string; count: number }[] = [];
    for (const project of projects) {
      const parsed = parseGitHubRepo(project.repoUrl as string);
      if (!parsed) {
        this.logger.warn(
          `Skipping ${project.slug}: cannot parse repoUrl as a GitHub repo`,
        );
        continue;
      }
      try {
        const commits = await fetchRecentCommits(
          repoToken,
          parsed.owner,
          parsed.repo,
        );
        await this.prisma.project.update({
          where: { id: project.id },
          data: {
            repoCommits: commits as unknown as Prisma.InputJsonValue,
            repoCommitsAt: new Date(),
          },
        });
        const repo = `${parsed.owner}/${parsed.repo}`;
        results.push({ slug: project.slug, repo, count: commits.length });
        this.logger.log(`Repo commits: ${repo} -> ${commits.length}`);
      } catch (err) {
        this.logger.error(
          `Repo commits failed for ${project.slug}: ${(err as Error).message}`,
        );
      }
    }

    return results;
  }
}

/** Flatten calendar weeks into a single chronological list of days. */
function flattenDays(weeks: CalendarWeek[]): SeriesPoint[] {
  return weeks
    .flatMap((w) => w.days.map((d) => ({ date: d.date, count: d.count })))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Build the normalized 1D / 7D / 1M / 1Y series from calendar weeks. */
function buildSeries(weeks: CalendarWeek[]): ContributionsSeries {
  const days = flattenDays(weeks);

  const lastN = (n: number) => days.slice(Math.max(0, days.length - n));

  // 1Y: one point per week (week-ending date = last day of each week bucket).
  const weekly: SeriesPoint[] = weeks
    .map((w) => {
      const count = w.days.reduce((sum, d) => sum + d.count, 0);
      const date = w.days.length ? w.days[w.days.length - 1].date : '';
      return { date, count };
    })
    .filter((p) => p.date !== '');

  return {
    '1D': lastN(1),
    '7D': lastN(7),
    '1M': lastN(30),
    '1Y': weekly,
  };
}
