import type { WatchProvider } from '@/types/watchProvider';
import { hasTmdbKey, tmdbFetch } from './tmdb';
import { fetchPopularMovies } from './media';
import type { MediaItem } from '@/types/media';

interface TmdbWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface TmdbWatchProvidersResponse {
  results: TmdbWatchProvider[];
}

/** Brand backdrops behind logos */
const BRAND_BY_ID: Record<number, string> = {
  8: '#E50914',
  9: '#00A8E1',
  337: '#1a1f7a',
  350: '#1c1c1e',
  2: '#3d3d3d',
  15: '#0f9d0f',
  1899: '#03045e',
  531: '#0064ff',
  386: '#111',
  283: '#f47521',
  43: '#000',
  3: '#ff9900',
  192: '#ff0000',
  384: '#111',
  387: '#000',
};

/** Preferred order for the home marquee */
const FEATURED_IDS = [8, 337, 9, 15, 350, 1899, 531, 386, 283, 384, 3, 192];

function shouldSkipProvider(name: string, id: number): boolean {
  if (/amazon channel|roku channel|apple tv channel/i.test(name)) return true;
  if (name === 'Amazon Video') return true;
  if (name === 'Apple TV') return true;
  if (/paramount plus (premium|essential)/i.test(name)) return true;
  return false;
}

function sortProvidersForRow(list: WatchProvider[]): WatchProvider[] {
  const byId = new Map(list.map((p) => [p.id, p]));
  const ordered: WatchProvider[] = [];

  for (const id of FEATURED_IDS) {
    const p = byId.get(id);
    if (p?.logoPath) {
      ordered.push(p);
      byId.delete(id);
    }
  }

  for (const p of list) {
    if (byId.has(p.id)) ordered.push(p);
  }

  return ordered.slice(0, 14);
}

const FALLBACK: WatchProvider[] = [
  { id: 8, name: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg', brandColor: '#E50914' },
  { id: 337, name: 'Disney+', logoPath: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg', brandColor: '#1a1f7a' },
  { id: 9, name: 'Prime Video', logoPath: '/pvske1MyAoymrs5bguRfVqYiM9a.jpg', brandColor: '#00A8E1' },
  { id: 15, name: 'Hulu', logoPath: '/pqAZLzJlSCrBic8aR8j1lQBGqPu.png', brandColor: '#0f9d0f' },
  { id: 350, name: 'Apple TV+', logoPath: '/4KAanCnnkWsXLno3sFw6wGz7UIK.png', brandColor: '#1c1c1e' },
  { id: 1899, name: 'Max', logoPath: '/aS2zvJWm9Zgp4GSM9oMK7q8D3jJ.png', brandColor: '#03045e' },
  { id: 531, name: 'Paramount+', logoPath: '/qiysVppzWYd6psBgTrS2dZfyn8.png', brandColor: '#0064ff' },
  { id: 386, name: 'Peacock', logoPath: '/zZjzEq0gNyO7Ng2SqpU8qQf0q77.png', brandColor: '#111' },
  { id: 283, name: 'Crunchyroll', logoPath: '/8n7KXCj3mVwK7l5zGAYpW7Raeke.png', brandColor: '#f47521' },
  { id: 3, name: 'Google Play', logoPath: '/tbEdFQDwx5LEVr8WpSeXQSIirVq.jpg', brandColor: '#ff9900' },
];

export async function fetchWatchProvidersList(): Promise<WatchProvider[]> {
  if (!hasTmdbKey()) return sortProvidersForRow(FALLBACK);

  try {
    const data = await tmdbFetch<TmdbWatchProvidersResponse>(
      '/watch/providers/movie',
      { watch_region: 'US' },
    );

    const seen = new Set<number>();
    const mapped: WatchProvider[] = [];

    for (const p of data.results) {
      if (!p.logo_path || shouldSkipProvider(p.provider_name, p.provider_id)) {
        continue;
      }
      if (seen.has(p.provider_id)) continue;
      seen.add(p.provider_id);
      mapped.push({
        id: p.provider_id,
        name: p.provider_name,
        logoPath: p.logo_path,
        brandColor: BRAND_BY_ID[p.provider_id] ?? '#1a1a2e',
      });
    }

    return sortProvidersForRow(mapped.length ? mapped : FALLBACK);
  } catch {
    return sortProvidersForRow(FALLBACK);
  }
}

export async function fetchMoviesByWatchProvider(
  providerId: number,
  page = 1,
): Promise<MediaItem[]> {
  if (!hasTmdbKey()) return fetchPopularMovies(page);

  const data = await tmdbFetch<{
    results: {
      id: number;
      title?: string;
      name?: string;
      overview: string;
      poster_path: string | null;
      backdrop_path: string | null;
      vote_average: number;
      release_date?: string;
      first_air_date?: string;
    }[];
  }>('/discover/movie', {
    page: String(page),
    with_watch_providers: String(providerId),
    watch_region: 'US',
    sort_by: 'popularity.desc',
  });

  return data.results.map((item) => ({
    id: String(item.id),
    tmdbId: item.id,
    title: item.title ?? item.name ?? 'Untitled',
    overview: item.overview ?? '',
    posterPath: item.poster_path ?? '',
    backdropPath: item.backdrop_path ?? '',
    mediaType: 'movie' as const,
    genres: [],
    cast: [],
    rating: item.vote_average ?? 0,
    releaseDate: item.release_date ?? item.first_air_date,
    year: Number((item.release_date ?? '').slice(0, 4)) || undefined,
  }));
}

export function watchProviderLogo(
  path: string,
  size: 'w92' | 'w154' | 'w500' | 'original' = 'w500',
): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base =
    size === 'original'
      ? 'https://image.tmdb.org/t/p/original'
      : `https://image.tmdb.org/t/p/${size}`;
  return `${base}${path}`;
}

export function watchProviderBrandColor(id: number, fallback?: string): string {
  return BRAND_BY_ID[id] ?? fallback ?? '#1a1a2e';
}
