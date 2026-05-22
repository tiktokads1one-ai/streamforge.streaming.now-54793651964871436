import type { MediaItem, MediaType, SearchFilters } from '@/types/media';
import { hasTmdbKey, tmdbFetch } from './tmdb';
import { cinemetaSearch } from './cinemeta';

export interface SearchPageResult {
  results: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

interface TmdbSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

interface TmdbSearchResponse {
  results: TmdbSearchResult[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Science Fiction': 878,
  'Sci-Fi': 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const EDITOR_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

export const GENRE_OPTIONS = Object.keys(GENRE_MAP).filter(
  (g) => g !== 'Sci-Fi',
);

export const TRENDING_QUERIES = [
  'Squid Game',
  'Superman',
  'Wednesday',
  'Spider-Man',
  'Interstellar',
  'Breaking Bad',
  'Naruto',
  'Dune',
];

function mapResult(item: TmdbSearchResult, forcedType?: MediaType): MediaItem {
  const isTv =
    forcedType === 'tv' ||
    forcedType === 'anime' ||
    item.media_type === 'tv' ||
    Boolean(item.name && !item.title);
  const mediaType: MediaType =
    forcedType ?? (isTv ? 'tv' : 'movie');
  return {
    id: String(item.id),
    tmdbId: item.id,
    title: item.title ?? item.name ?? 'Untitled',
    overview: item.overview ?? '',
    posterPath: item.poster_path ?? '',
    backdropPath: item.backdrop_path ?? '',
    mediaType,
    genres: [],
    cast: [],
    rating: item.vote_average ?? 0,
    releaseDate: item.release_date ?? item.first_air_date,
    year:
      Number((item.release_date ?? item.first_air_date ?? '').slice(0, 4)) ||
      undefined,
  };
}

function mapCinemeta(
  meta: Awaited<ReturnType<typeof cinemetaSearch>>[0],
): MediaItem {
  return {
    id: meta.id,
    imdbId: meta.id.startsWith('tt') ? meta.id : undefined,
    title: meta.name,
    overview: meta.description ?? '',
    posterPath: meta.poster ?? '',
    backdropPath: meta.background ?? '',
    mediaType: meta.type === 'series' ? 'tv' : 'movie',
    genres: meta.genre ?? [],
    cast: [],
    rating: Number(meta.imdbRating) || 0,
    year: Number(meta.releaseInfo?.slice(0, 4)) || undefined,
  };
}

function applyClientFilters(
  items: MediaItem[],
  filters: SearchFilters,
): MediaItem[] {
  return items.filter((item) => {
    if (filters.type === 'movie' && item.mediaType !== 'movie') return false;
    if (
      filters.type === 'tv' &&
      item.mediaType !== 'tv' &&
      item.mediaType !== 'anime'
    )
      return false;
    if (filters.type === 'anime' && item.mediaType !== 'anime') return false;
    if (
      filters.genre &&
      item.genres.length > 0 &&
      !item.genres.some(
        (g) => g.toLowerCase() === filters.genre.toLowerCase(),
      )
    )
      return false;
    if (filters.year && String(item.year) !== filters.year) return false;
    if (filters.minRating > 0 && item.rating < filters.minRating) return false;
    return true;
  });
}

async function tmdbDiscover(
  mediaType: 'movie' | 'tv',
  filters: SearchFilters,
  page: number,
): Promise<SearchPageResult> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: 'popularity.desc',
    'vote_average.gte': String(Math.max(filters.minRating, 0) || 0),
  };

  const genreId = GENRE_MAP[filters.genre] ?? GENRE_MAP[filters.genre.replace('Sci-Fi', 'Science Fiction')];
  if (filters.type === 'anime') {
    params.with_genres = '16';
    params.with_original_language = 'ja';
  } else if (genreId) {
    params.with_genres = String(genreId);
  }
  if (filters.year) {
    if (mediaType === 'movie') {
      params.primary_release_year = filters.year;
    } else {
      params.first_air_date_year = filters.year;
    }
  }

  const data = await tmdbFetch<TmdbSearchResponse>(`/discover/${mediaType}`, params);
  const forced: MediaType | undefined =
    filters.type === 'anime' ? 'anime' : mediaType === 'tv' ? 'tv' : 'movie';

  return {
    results: data.results.map((r) => mapResult({ ...r, media_type: mediaType }, forced)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function searchMediaPaginated(
  query: string,
  filters: SearchFilters,
  page = 1,
): Promise<SearchPageResult> {
  const q = query.trim();

  if (
    !q &&
    (filters.genre || filters.year || filters.minRating > 0) &&
    hasTmdbKey()
  ) {
    const mediaType =
      filters.type === 'tv' || filters.type === 'anime' ? 'tv' : 'movie';
    return tmdbDiscover(mediaType, filters, page);
  }

  if (!q) {
    return { results: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  if (hasTmdbKey()) {
    const endpoint =
      filters.type === 'movie'
        ? '/search/movie'
        : filters.type === 'tv' || filters.type === 'anime'
          ? '/search/tv'
          : '/search/multi';

    const data = await tmdbFetch<TmdbSearchResponse>(endpoint, {
      query: q,
      page: String(page),
      include_adult: 'false',
    });

    let results = data.results.map((r) =>
      mapResult(
        r,
        filters.type === 'anime'
          ? 'anime'
          : filters.type === 'tv'
            ? 'tv'
            : filters.type === 'movie'
              ? 'movie'
              : undefined,
      ),
    );

    if (endpoint === '/search/multi') {
      results = results.filter(
        (r) => r.mediaType === 'movie' || r.mediaType === 'tv',
      );
    }

    results = applyClientFilters(results, filters);

    return {
      results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  const [movies, series] = await Promise.all([
    cinemetaSearch(q, 'movie'),
    cinemetaSearch(q, 'series'),
  ]);
  const all = applyClientFilters(
    [...movies, ...series].map(mapCinemeta),
    filters,
  );
  const perPage = 20;
  const start = (page - 1) * perPage;

  return {
    results: all.slice(start, start + perPage),
    page,
    totalPages: Math.ceil(all.length / perPage) || 1,
    totalResults: all.length,
  };
}

export async function searchMedia(
  query: string,
  filters: SearchFilters,
): Promise<MediaItem[]> {
  const data = await searchMediaPaginated(query, filters, 1);
  return data.results;
}

export async function fetchSearchSuggestions(
  query: string,
): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  const data = await searchMediaPaginated(query, {
    type: 'all',
    genre: '',
    year: '',
    minRating: 0,
  });
  return data.results.slice(0, 8);
}
