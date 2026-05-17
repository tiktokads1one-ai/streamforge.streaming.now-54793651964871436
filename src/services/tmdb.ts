const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE = 'https://api.themoviedb.org/3';

export function hasTmdbKey(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_tmdb_api_key_here');
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!hasTmdbKey()) {
    throw new Error('TMDB API key not configured');
  }
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', API_KEY!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json() as Promise<T>;
}

export { tmdbFetch, API_KEY };
