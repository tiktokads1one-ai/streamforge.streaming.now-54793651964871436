import { create } from 'zustand';
import type {
  ContinueWatchingItem,
  MediaItem,
  PlaybackSettings,
  WatchHistoryEntry,
} from '@/types/media';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/utils/storage';

const ASIAN_COUNTRIES = ['Japan', 'South Korea', 'China', 'Taiwan', 'Hong Kong', 'Thailand', 'Philippines', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore'];
const ASIAN_LANGUAGES = ['ja', 'ko', 'zh', 'th', 'vi', 'id', 'ms', 'tl'];
const ASIAN_GENRES = ['Asian Drama', 'K-Drama', 'J-Drama', 'C-Drama', 'Thai Drama'];

function shouldFilterAsianContent(item: MediaItem): boolean {
  // Filter by country
  if (item.country && ASIAN_COUNTRIES.includes(item.country)) {
    return true;
  }

  // Filter by language
  if (item.language && ASIAN_LANGUAGES.includes(item.language)) {
    return true;
  }

  // Filter by genre
  if (item.genres && item.genres.some(genre => ASIAN_GENRES.includes(genre))) {
    return true;
  }

  return false;
}

interface LibraryState {
  favorites: MediaItem[];
  history: WatchHistoryEntry[];
  continueWatching: ContinueWatchingItem[];
  playback: PlaybackSettings;
  toggleFavorite: (item: MediaItem) => void;
  isFavorite: (id: string) => boolean;
  addHistory: (item: MediaItem, progress?: number) => void;
  updateContinueWatching: (
    item: MediaItem,
    progress: number,
    duration: number,
  ) => void;
  removeContinueWatching: (id: string) => void;
  setPlaybackSettings: (settings: Partial<PlaybackSettings>) => void;
  clearHistory: () => void;
}

const defaultPlayback: PlaybackSettings = {
  preferredProviderId: 'primary',
  volume: 1,
  autoplay: true,
  subtitles: 'en',
};

function persist<K extends keyof typeof STORAGE_KEYS>(
  key: K,
  value: unknown,
): void {
  writeStorage(STORAGE_KEYS[key], value);
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  favorites: readStorage<MediaItem[]>(STORAGE_KEYS.favorites, []),
  history: readStorage<WatchHistoryEntry[]>(STORAGE_KEYS.history, []),
  continueWatching: readStorage<ContinueWatchingItem[]>(
    STORAGE_KEYS.continueWatching,
    [],
  ),
  playback: readStorage<PlaybackSettings>(STORAGE_KEYS.playback, defaultPlayback),

  toggleFavorite: (item) => {
    // Filter out Asian content
    if (shouldFilterAsianContent(item)) {
      return;
    }
    set((state) => {
      const exists = state.favorites.some((f) => f.id === item.id);
      const favorites = exists
        ? state.favorites.filter((f) => f.id !== item.id)
        : [...state.favorites, item];
      persist('favorites', favorites);
      return { favorites };
    });
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),

  addHistory: (item, progress = 0) => {
    // Filter out Asian content
    if (shouldFilterAsianContent(item)) {
      return;
    }
    set((state) => {
      const entry: WatchHistoryEntry = {
        media: item,
        watchedAt: Date.now(),
        progress,
      };
      const history = [
        entry,
        ...state.history.filter((h) => h.media.id !== item.id),
      ].slice(0, 50);
      persist('history', history);
      return { history };
    });
  },

  updateContinueWatching: (item, progress, duration) => {
    // Filter out Asian content
    if (shouldFilterAsianContent(item)) {
      return;
    }
    set((state) => {
      const entry: ContinueWatchingItem = {
        media: item,
        progress,
        duration,
        updatedAt: Date.now(),
      };
      const continueWatching = [
        entry,
        ...state.continueWatching.filter((c) => c.media.id !== item.id),
      ].slice(0, 12);
      persist('continueWatching', continueWatching);
      return { continueWatching };
    });
  },

  removeContinueWatching: (id) => {
    set((state) => {
      const continueWatching = state.continueWatching.filter(
        (c) => c.media.id !== id,
      );
      persist('continueWatching', continueWatching);
      return { continueWatching };
    });
  },

  setPlaybackSettings: (settings) => {
    set((state) => {
      const playback = { ...state.playback, ...settings };
      persist('playback', playback);
      return { playback };
    });
  },

  clearHistory: () => {
    persist('history', []);
    set({ history: [] });
  },
}));
