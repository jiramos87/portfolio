/**
 * github_activity tool: Javier's most recent public GitHub commits across the
 * showroom repos. Live data the corpus can't hold (it changes daily).
 *
 * Run deterministically by the graph's agent node (not a model tool-loop): more
 * reliable across providers and far cheaper on free-tier quotas. On any failure
 * it returns a typed failure the answer voices honestly, never fabricated
 * freshness (honesty rail). Results cache for 5 minutes.
 */
const REST_BASE = 'https://api.github.com';
const OWNER = 'jiramos87';
const REPOS = ['portfolio', 'agentic-dev-kit'] as const;
const CACHE_TTL_MS = 5 * 60_000;
const PER_REPO = 5;

export interface Commit {
  repo: string;
  sha: string;
  message: string;
  date: string;
  url: string;
}

interface RestCommit {
  sha: string;
  html_url: string;
  commit: { message?: string; author?: { date?: string } };
}

export type GithubResult =
  | { ok: true; commits: Commit[] }
  | { ok: false; error: string };

let cache: { at: number; commits: Commit[] } | null = null;

/** Cheap keyword check: does this question want live GitHub activity? */
export function wantsGithubActivity(question: string): boolean {
  return /commit|recent|lately|latest|working on|building|activity|push|these days|últim|reciente|commite/i.test(
    question,
  );
}

async function fetchRepoCommits(token: string, repo: string): Promise<Commit[]> {
  const res = await fetch(
    `${REST_BASE}/repos/${OWNER}/${repo}/commits?per_page=${PER_REPO}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'portfolio-agent',
      },
    },
  );
  if (!res.ok) throw new Error(`GitHub ${repo}: ${res.status}`);
  const data = (await res.json()) as RestCommit[];
  return data.map((c) => ({
    repo,
    sha: c.sha.slice(0, 7),
    message: (c.commit.message ?? '').split('\n')[0]?.trim() ?? '',
    date: c.commit.author?.date ?? '',
    url: c.html_url,
  }));
}

export async function runGithubActivity(): Promise<GithubResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { ok: false, error: 'the live GitHub lookup failed (no access token configured)' };
  }
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return { ok: true, commits: cache.commits };
  }
  try {
    const perRepo = await Promise.all(
      REPOS.map((repo) => fetchRepoCommits(token, repo)),
    );
    const commits = perRepo
      .flat()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
    cache = { at: Date.now(), commits };
    return { ok: true, commits };
  } catch {
    return { ok: false, error: 'the live GitHub lookup failed' };
  }
}
