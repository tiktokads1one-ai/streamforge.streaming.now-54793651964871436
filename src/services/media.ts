import type { CastMember, MediaItem, MediaType } from '@/types/media';
import { hasTmdbKey, tmdbFetch } from './tmdb';
import { cinemetaCatalog, cinemetaMeta, type CinemetaMeta } from './cinemeta';

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

interface TmdbListResponse {
  results: TmdbResult[];
  page: number;
  total_pages: number;
}

interface TmdbDetail extends TmdbResult {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  imdb_id?: string;
}

interface TmdbGenre {
  id: number;
  name: string;
}

const GENRE_CACHE: Partial<Record<MediaType, Map<number, string>>> = {};

function mapTmdbType(type: MediaType): 'movie' | 'tv' {
  return type === 'tv' || type === 'anime' ? 'tv' : 'movie';
}

function inferMediaType(item: TmdbResult, fallback: MediaType): MediaType {
  if (item.media_type === 'tv') return 'tv';
  if (fallback === 'anime') return 'anime';
  return fallback;
}

function mapTmdbItem(item: TmdbResult, type: MediaType, genres: string[] = []): MediaItem {
  const mediaType = inferMediaType(item, type);
  return {
    id: String(item.id),
    tmdbId: item.id,
    title: item.title ?? item.name ?? 'Untitled',
    overview: item.overview ?? '',
    posterPath: item.poster_path ?? '',
    backdropPath: item.backdrop_path ?? '',
    mediaType,
    genres,
    cast: [],
    runtime: item.media_type === 'tv' ? undefined : undefined,
    rating: item.vote_average ?? 0,
    voteCount: item.vote_count,
    releaseDate: item.release_date ?? item.first_air_date,
    year: Number((item.release_date ?? item.first_air_date ?? '').slice(0, 4)) || undefined,
  };
}

function mapCinemetaItem(meta: CinemetaMeta, type: MediaType): MediaItem {
  const runtimeMatch = meta.runtime?.match(/(\d+)/);
  return {
    id: meta.id.replace('tt', '') === meta.id ? meta.id : meta.id,
    imdbId: meta.id.startsWith('tt') ? meta.id : undefined,
    title: meta.name,
    overview: meta.description ?? '',
    posterPath: meta.poster ?? '',
    backdropPath: meta.background ?? meta.poster ?? '',
    mediaType: type === 'anime' ? 'anime' : meta.type === 'series' ? 'tv' : 'movie',
    genres: meta.genre ?? [],
    cast: (meta.cast ?? []).slice(0, 8).map((name, i) => ({
      id: `cast-${i}`,
      name,
    })),
    runtime: runtimeMatch ? Number(runtimeMatch[1]) : undefined,
    rating: Number(meta.imdbRating) || 0,
    releaseDate: meta.releaseInfo,
    year: Number(meta.releaseInfo?.slice(0, 4)) || undefined,
  };
}

async function loadGenres(type: MediaType): Promise<Map<number, string>> {
  if (GENRE_CACHE[type]) return GENRE_CACHE[type]!;
  if (!hasTmdbKey()) return new Map();
  const endpoint = type === 'movie' ? '/genre/movie/list' : '/genre/tv/list';
  const data = await tmdbFetch<{ genres: TmdbGenre[] }>(endpoint);
  const map = new Map(data.genres.map((g) => [g.id, g.name]));
  GENRE_CACHE[type] = map;
  return map;
}

async function enrichWithGenres(items: TmdbResult[], type: MediaType): Promise<MediaItem[]> {
  const genreMap = await loadGenres(type);
  return items.map((item) => {
    const genres = (item.genre_ids ?? [])
      .map((id) => genreMap.get(id))
      .filter(Boolean) as string[];
    return mapTmdbItem(item, type, genres);
  });
}

export async function fetchTrending(type: MediaType = 'movie', page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const tmdbType = mapTmdbType(type);
    const data = await tmdbFetch<TmdbListResponse>(`/trending/${tmdbType}/week`, {
      page: String(page),
    });
    return enrichWithGenres(data.results, type);
  }
  const catalog = await cinemetaCatalog(
    type === 'movie' ? 'movie' : 'series',
    'top',
  );
  return catalog.slice((page - 1) * 20, page * 20).map((m) =>
    mapCinemetaItem(m, type),
  );
}

export async function fetchPopularMovies(page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const data = await tmdbFetch<TmdbListResponse>('/movie/popular', {
      page: String(page),
    });
    return enrichWithGenres(data.results, 'movie');
  }
  return cinemetaCatalog('movie', 'top').then((items) =>
    items.slice((page - 1) * 20, page * 20).map((m) => mapCinemetaItem(m, 'movie')),
  );
}

export async function fetchPopularTv(page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const data = await tmdbFetch<TmdbListResponse>('/tv/popular', { page: String(page) });
    return enrichWithGenres(data.results, 'tv');
  }
  return cinemetaCatalog('series', 'top').then((items) =>
    items.slice((page - 1) * 20, page * 20).map((m) => mapCinemetaItem(m, 'tv')),
  );
}

export async function fetchTopRated(type: MediaType, page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const endpoint = type === 'movie' ? '/movie/top_rated' : '/tv/top_rated';
    const data = await tmdbFetch<TmdbListResponse>(endpoint, { page: String(page) });
    return enrichWithGenres(data.results, type);
  }
  return fetchTrending(type, page);
}

export async function fetchAnime(page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const data = await tmdbFetch<TmdbListResponse>('/discover/tv', {
      page: String(page),
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
    });
    return enrichWithGenres(data.results, 'anime');
  }
  const tv = await fetchPopularTv(page);
  return tv.map((item) => ({ ...item, mediaType: 'anime' as const }));
}

export async function fetchNewReleases(page = 1): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const data = await tmdbFetch<TmdbListResponse>('/movie/now_playing', {
      page: String(page),
    });
    return enrichWithGenres(data.results, 'movie');
  }
  return fetchPopularMovies(page);
}

export async function fetchMediaDetails(
  id: string,
  type: MediaType,
): Promise<MediaItem | null> {
  if (hasTmdbKey()) {
    const tmdbType = mapTmdbType(type);
    const detail = await tmdbFetch<TmdbDetail>(`/${tmdbType}/${id}`, {
      append_to_response: 'credits',
    });
    const genres = detail.genres?.map((g) => g.name) ?? [];
    const cast: CastMember[] =
      detail.credits?.cast.slice(0, 12).map((c) => ({
        id: String(c.id),
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ?? undefined,
      })) ?? [];
    const item = mapTmdbItem(detail, type, genres);
    item.cast = cast;
    item.runtime =
      detail.runtime ??
      detail.episode_run_time?.[0] ??
      undefined;
    if (detail.imdb_id) {
      item.imdbId = detail.imdb_id;
    } else if (hasTmdbKey()) {
      try {
        const ext = await tmdbFetch<{ imdb_id?: string }>(
          `/${tmdbType}/${id}/external_ids`,
        );
        item.imdbId = ext.imdb_id;
      } catch {
        /* optional */
      }
    }
    return item;
  }

  const cinemetaType = type === 'movie' ? 'movie' : 'series';
  const imdbId = id.startsWith('tt') ? id : `tt${id}`;
  const meta = await cinemetaMeta(cinemetaType, imdbId);
  if (!meta) {
    const alt = await cinemetaMeta(cinemetaType, id);
    return alt ? mapCinemetaItem(alt, type) : null;
  }
  return mapCinemetaItem(meta, type);
}

export async function fetchSimilar(
  id: string,
  type: MediaType,
): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const tmdbType = mapTmdbType(type);
    const data = await tmdbFetch<TmdbListResponse>(`/${tmdbType}/${id}/similar`);
    return enrichWithGenres(data.results.slice(0, 12), type);
  }
  const detail = await fetchMediaDetails(id, type);
  if (!detail?.genres[0]) return fetchTrending(type);
  return fetchTrending(type).then((items) =>
    items.filter((i) => i.genres.includes(detail.genres[0])).slice(0, 12),
  );
}

export async function fetchRecommendations(
  id: string,
  type: MediaType,
): Promise<MediaItem[]> {
  if (hasTmdbKey()) {
    const tmdbType = mapTmdbType(type);
    const data = await tmdbFetch<TmdbListResponse>(
      `/${tmdbType}/${id}/recommendations`,
    );
    return enrichWithGenres(data.results.slice(0, 12), type);
  }
  return fetchSimilar(id, type);
}

export async function fetchHeroItems(): Promise<MediaItem[]> {
  const trending = await fetchTrending('movie', 1);
  return trending.slice(0, 5);
}
