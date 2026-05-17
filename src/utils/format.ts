export function formatRuntime(minutes?: number): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatRating(rating: number): string {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
}

export function formatYear(date?: string, year?: number): string {
  if (year) return String(year);
  if (!date) return '—';
  return date.slice(0, 4);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function slugMediaId(id: string): string {
  return id.replace(/^tt/, '');
}
