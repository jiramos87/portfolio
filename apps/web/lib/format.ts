/**
 * Format an ISO date string as e.g. "Jun 23, 2026".
 *
 * Rendered in UTC so a "YYYY-MM-DD" value (parsed as UTC midnight) shows as that
 * exact calendar date rather than shifting a day in negative-offset zones.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
