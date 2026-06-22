/**
 * Server-side client for the Nest API.
 *
 * Reads run from React Server Components, server-to-server (the API stays
 * private — no browser calls, no CORS). The contact write is invoked from a
 * server action / route handler (the Next BFF), never from the browser.
 *
 * Base URL comes from INTERNAL_API_URL (see .env.example); defaults to local.
 */

const API_BASE = process.env.INTERNAL_API_URL ?? 'http://localhost:3333';
const REVALIDATE_SECONDS = 60;

export type ProjectKind = 'WEB_APP' | 'TOOLING' | 'CASE_STUDY';
export type ProjectStatus = 'LIVE' | 'IN_PROGRESS' | 'ARCHIVED';
export type MetricKind = 'real' | 'placeholder' | 'target';

export interface Metric {
  key: string;
  label: string;
  value: number | string | null;
  unit?: string;
  kind: MetricKind;
}

export interface TimelineEntry {
  date: string;
  type: string;
  label: string;
  url?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  stack: string[];
  toolsUsed: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  repoPublic: boolean;
  prdUrl: string | null;
  prd: string | null;
  buildStory: string | null;
  metrics: Metric[] | null;
  timeline: TimelineEntry[] | null;
  screenshots: string[];
  status: ProjectStatus;
  kind: ProjectKind;
  featured: boolean;
  shippedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitySnapshot {
  id: string;
  capturedAt: string;
  totalContribs: number;
  calendar: unknown;
  languages: unknown;
  repoStats: unknown;
  source: string;
  isPlaceholder: boolean;
  createdAt: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  /** Honeypot — leave empty. */
  company?: string;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getProjects(): Promise<Project[]> {
  return apiGet<Project[]>('/projects');
}

export async function getProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API GET /projects/${slug} failed: ${res.status}`);
  }
  return res.json() as Promise<Project>;
}

export function getActivity(): Promise<ActivitySnapshot | null> {
  return apiGet<ActivitySnapshot | null>('/activity');
}

/** POST a contact submission. Call from a server action / route handler only. */
export async function submitContact(
  input: ContactInput,
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API POST /contact failed: ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean }>;
}
