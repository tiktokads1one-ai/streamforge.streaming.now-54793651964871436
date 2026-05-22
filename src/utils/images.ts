const TMDB_BASE = 'https://image.tmdb.org/t/p';

export function tmdbImage(
  path: string | null | undefined,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string {
  if (!path) return '/placeholder-poster.svg';
  if (path.startsWith('http')) return path;
  return `${TMDB_BASE}/${size}${path}`;
}

export function backdropImage(path?: string): string {
  return tmdbImage(path, 'w780');
}

export function posterImage(
  path?: string,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string {
  return tmdbImage(path, size);
}

export function profileImage(path?: string | null): string {
  if (!path) return '/placeholder-poster.svg';
  return tmdbImage(path, 'w342');
}
