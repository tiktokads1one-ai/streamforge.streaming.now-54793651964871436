const PREFIX = 'streamforge:';

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // quota exceeded — silently fail
  }
}

export const STORAGE_KEYS = {
  favorites: 'favorites',
  history: 'history',
  continueWatching: 'continue-watching',
  playback: 'playback-settings',
  provider: 'preferred-provider',
} as const;
