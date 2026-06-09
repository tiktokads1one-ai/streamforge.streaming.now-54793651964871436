export type MediaType = 'movie' | 'tv' | 'anime';

export interface CastMember {
  id: string;
  name: string;
  character?: string;
  profilePath?: string;
}

export interface MediaItem {
  id: string;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  mediaType: MediaType;
  genres: string[];
  cast: CastMember[];
  runtime?: number;
  rating: number;
  voteCount?: number;
  releaseDate?: string;
  year?: number;
  language?: string;
  country?: string;
}

export interface ContinueWatchingItem {
  media: MediaItem;
  progress: number;
  duration: number;
  updatedAt: number;
}

export interface WatchHistoryEntry {
  media: MediaItem;
  watchedAt: number;
  progress: number;
}

export interface PlaybackSettings {
  preferredProviderId: string;
  volume: number;
  autoplay: boolean;
  subtitles: string;
}

export type SearchFilterType = 'all' | 'movie' | 'tv' | 'anime';

export interface SearchFilters {
  type: SearchFilterType;
  genre: string;
  year: string;
  minRating: number;
  language: string;
  sortBy: string;
}
