import { readStorage, writeStorage } from './storage';

const KEY = 'recent-searches';
const MAX = 10;

export function getRecentSearches(): string[] {
  return readStorage<string[]>(KEY, []);
}

export function addRecentSearch(query: string): void {
  const q = query.trim();
  if (!q || q.length < 2) return;
  const list = getRecentSearches().filter(
    (s) => s.toLowerCase() !== q.toLowerCase(),
  );
  writeStorage(KEY, [q, ...list].slice(0, MAX));
}

export function clearRecentSearches(): void {
  writeStorage(KEY, []);
}
