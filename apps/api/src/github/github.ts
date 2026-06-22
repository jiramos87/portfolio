/**
 * GitHub ingest — pure async functions using the global `fetch` (no deps).
 *
 * Two tokens, two APIs (see CLAUDE.md / .env, both git-ignored):
 *  - read:user (classic)        → contribution count + calendar via GraphQL
 *  - Contents:read (fine-grained) → language bytes + repo stats via REST
 *
 * Tokens are passed in by the caller (read from process.env). They are NEVER
 * logged here.
 */

const GRAPHQL_URL = 'https://api.github.com/graphql';
const REST_BASE = 'https://api.github.com';
const USER_AGENT = 'portfolio-activity-ingest';

// ---------------------------------------------------------------------------
// Curation config
// ---------------------------------------------------------------------------

/**
 * Excluded from the language breakdown so it honestly reflects professional
 * TS / full-stack work:
 *  - coursework/test repos (not representative)
 *  - auto-cities / TerritoryDeveloper: the Unity game already featured as the C#
 *    case study; its raw byte mass (≈90% C#, plus ShaderLab/HLSL) would drown
 *    the bar. The case-study exhibit represents C# on its own. (The repo ships
 *    as `auto-cities` on GitHub; `TerritoryDeveloper` is kept defensively.)
 */
export const LANGUAGE_EXCLUDE = [
  'diplomado-dcc-oop-taller-1',
  'diplomado-dcc-oop-taller-1-v2',
  'edugami-test',
  'auto-cities',
  'TerritoryDeveloper',
];

/** How many named language slices to show before bucketing into "Other". */
export const LANGUAGE_TOP_N = 6;

/**
 * Curated primary stacks — the languages/frameworks Javier builds in, ordered by
 * emphasis. Honest self-representation ("what I work in"), NOT a byte measurement:
 * raw GitHub bytes are dominated by generated/vendored/game files that hide the real TS.
 */
export const CURATED_STACKS = [
  'TypeScript',
  'JavaScript',
  'C#',
  'Python',
  'SQL',
];

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface CalendarDay {
  date: string;
  count: number;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: CalendarWeek[];
}

export interface LanguageSlice {
  name: string;
  pct: number;
}

export interface LanguageBytes {
  name: string;
  bytes: number;
}

export interface LanguageBreakdown {
  /** Curated top N + "Other", percentages rounded to sum ~100. */
  languages: LanguageSlice[];
  /** Raw summed bytes per language (curated repo set) — for debugging. */
  raw: LanguageBytes[];
}

export interface RepoStat {
  name: string;
  primaryLanguage: string | null;
  updatedAt: string;
  private: boolean;
}

export interface LanguageOptions {
  /** Repo names to exclude from the breakdown. Defaults to LANGUAGE_EXCLUDE. */
  exclude?: string[];
  topN?: number;
}

export interface RepoStatsOptions {
  /** Repo names to exclude. Defaults to LANGUAGE_EXCLUDE. */
  exclude?: string[];
}

// ---------------------------------------------------------------------------
// Small fetch helpers
// ---------------------------------------------------------------------------

async function githubGraphql<T>(token: string, query: string): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL request failed: ${res.status}`);
  }
  const body = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (body.errors?.length) {
    throw new Error(`GitHub GraphQL error: ${body.errors[0].message}`);
  }
  if (!body.data) {
    throw new Error('GitHub GraphQL returned no data');
  }
  return body.data;
}

async function githubRest<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${REST_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': USER_AGENT,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub REST request failed (${path}): ${res.status}`);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// 1. Contribution calendar (GraphQL, read:user)
// ---------------------------------------------------------------------------

interface ContributionCalendarResponse {
  viewer: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: { date: string; contributionCount: number }[];
        }[];
      };
    };
  };
}

/**
 * Total contributions + the day-by-day heatmap for the trailing year, from the
 * viewer's `contributionsCollection.contributionCalendar`.
 */
export async function fetchContributionCalendar(
  token: string,
): Promise<ContributionCalendar> {
  const query = `query {
    viewer {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }`;

  const data = await githubGraphql<ContributionCalendarResponse>(token, query);
  const cal = data.viewer.contributionsCollection.contributionCalendar;

  return {
    totalContributions: cal.totalContributions,
    weeks: cal.weeks.map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
      })),
    })),
  };
}

// ---------------------------------------------------------------------------
// 2. Language breakdown (REST, Contents:read)
// ---------------------------------------------------------------------------

interface RestRepo {
  name: string;
  private: boolean;
  language: string | null;
  updated_at: string;
  languages_url: string;
}

/** List owner repos (paginated, up to a few pages). */
async function listOwnerRepos(token: string): Promise<RestRepo[]> {
  const repos: RestRepo[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await githubRest<RestRepo[]>(
      token,
      `/user/repos?per_page=100&affiliation=owner&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

/**
 * Curated language breakdown: sum real language bytes across owner repos
 * (excluding `opts.exclude`), then return the top N + "Other" as rounded
 * percentages summing to ~100. Also returns the raw byte totals for debugging.
 */
export async function fetchLanguages(
  token: string,
  opts: LanguageOptions = {},
): Promise<LanguageBreakdown> {
  const exclude = new Set(opts.exclude ?? LANGUAGE_EXCLUDE);
  const topN = opts.topN ?? LANGUAGE_TOP_N;

  const repos = (await listOwnerRepos(token)).filter(
    (r) => !exclude.has(r.name),
  );

  const totals = new Map<string, number>();
  for (const repo of repos) {
    const path = repo.languages_url.replace(REST_BASE, '');
    const langs = await githubRest<Record<string, number>>(token, path);
    for (const [name, bytes] of Object.entries(langs)) {
      totals.set(name, (totals.get(name) ?? 0) + bytes);
    }
  }

  const raw: LanguageBytes[] = [...totals.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);

  const grandTotal = raw.reduce((sum, l) => sum + l.bytes, 0);
  const languages: LanguageSlice[] =
    grandTotal === 0 ? [] : toPercentSlices(raw, grandTotal, topN);

  return { languages, raw };
}

/** Top N languages + "Other"; percentages rounded so the visible set sums ~100. */
function toPercentSlices(
  raw: LanguageBytes[],
  grandTotal: number,
  topN: number,
): LanguageSlice[] {
  const top = raw.slice(0, topN);
  const otherBytes = raw.slice(topN).reduce((sum, l) => sum + l.bytes, 0);

  const slices: LanguageBytes[] = [...top];
  if (otherBytes > 0) slices.push({ name: 'Other', bytes: otherBytes });

  // Round each, then nudge the largest slice so the total lands on 100.
  const pcts = slices.map((l) => ({
    name: l.name,
    pct: Math.round((l.bytes / grandTotal) * 100),
  }));
  const drift = 100 - pcts.reduce((sum, p) => sum + p.pct, 0);
  if (drift !== 0 && pcts.length > 0) {
    let maxIdx = 0;
    for (let i = 1; i < pcts.length; i++) {
      if (pcts[i].pct > pcts[maxIdx].pct) maxIdx = i;
    }
    pcts[maxIdx].pct += drift;
  }

  return pcts.filter((p) => p.pct > 0);
}

// ---------------------------------------------------------------------------
// 3. Repo stats (REST, Contents:read) — no star counts (brand omits stars)
// ---------------------------------------------------------------------------

/**
 * Light per-repo info for the curated owner set: name, primary language,
 * last-updated, and visibility. Deliberately omits star counts.
 */
export async function fetchRepoStats(
  token: string,
  opts: RepoStatsOptions = {},
): Promise<RepoStat[]> {
  const exclude = new Set(opts.exclude ?? LANGUAGE_EXCLUDE);

  const repos = (await listOwnerRepos(token)).filter(
    (r) => !exclude.has(r.name),
  );

  return repos
    .map((r) => ({
      name: r.name,
      primaryLanguage: r.language,
      updatedAt: r.updated_at,
      private: r.private,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
