const BASE = 'https://v3-cinemeta.strem.io';

interface CinemetaMeta {
  id: string;
  type: string;
  name: string;
  poster?: string;
  background?: string;
  description?: string;
  genre?: string[];
  imdbRating?: string;
  runtime?: string;
  releaseInfo?: string;
  cast?: string[];
  director?: string[];
}

interface CinemetaCatalog {
  metas: CinemetaMeta[];
}

export async function cinemetaCatalog(
  type: 'movie' | 'series',
  catalog: string,
): Promise<CinemetaMeta[]> {
  const res = await fetch(`${BASE}/catalog/${type}/${catalog}/json`);
  if (!res.ok) return [];
  const data = (await res.json()) as CinemetaCatalog;
  return data.metas ?? [];
}

export async function cinemetaMeta(
  type: 'movie' | 'series',
  id: string,
): Promise<CinemetaMeta | null> {
  const res = await fetch(`${BASE}/meta/${type}/${id}.json`);
  if (!res.ok) return null;
  const data = (await res.json()) as { meta: CinemetaMeta };
  return data.meta ?? null;
}

export async function cinemetaSearch(
  query: string,
  type: 'movie' | 'series' = 'movie',
): Promise<CinemetaMeta[]> {
  const encoded = encodeURIComponent(query);
  const res = await fetch(
    `${BASE}/catalog/${type}/top/search=${encoded}.json`,
  );
  if (!res.ok) return [];
  const data = (await res.json()) as CinemetaCatalog;
  return data.metas ?? [];
}

export type { CinemetaMeta };
