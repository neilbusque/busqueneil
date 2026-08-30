export const NOW_FRESH_DAYS = 75;

export function isNowFresh(publishedAt: string | null | undefined, now = Date.now()): boolean {
  if (!publishedAt) return false;
  const published = new Date(publishedAt).getTime();
  if (!Number.isFinite(published)) return false;
  const age = now - published;
  return age >= 0 && age < NOW_FRESH_DAYS * 24 * 60 * 60 * 1000;
}
