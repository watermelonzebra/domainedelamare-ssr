/**
 * src/utils/format.ts
 * Shared formatting helpers.
 */

/**
 * Format an ISO date string to a human-readable string.
 * Uses `Intl.DateTimeFormat` — no external dependencies.
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Return an ISO 8601 string for use in <time datetime="...">
 */
export function isoDate(dateString: string): string {
  return new Date(dateString).toISOString();
}
