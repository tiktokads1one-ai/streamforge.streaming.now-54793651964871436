import { useEffect, useState } from 'react';
import { hasTmdbKey, tmdbFetch } from '@/services/tmdb';

interface Episode {
  episode_number: number;
  name: string;
  runtime?: number;
}

interface Season {
  season_number: number;
  name: string;
}

interface EpisodeSidebarProps {
  tmdbId: string;
  season: number;
  episode: number;
  onSeasonChange: (s: number) => void;
  onEpisodeSelect: (ep: number) => void;
}

export function EpisodeSidebar({
  tmdbId,
  season,
  episode,
  onSeasonChange,
  onEpisodeSelect,
}: EpisodeSidebarProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (!hasTmdbKey()) return;
    tmdbFetch<{ seasons: Season[] }>(`/tv/${tmdbId}`).then((data) => {
      setSeasons(
        (data.seasons ?? []).filter((s) => s.season_number > 0),
      );
    });
  }, [tmdbId]);

  useEffect(() => {
    if (!hasTmdbKey()) return;
    tmdbFetch<{ episodes: Episode[] }>(`/tv/${tmdbId}/season/${season}`).then(
      (data) => setEpisodes(data.episodes ?? []),
    );
  }, [tmdbId, season]);

  return (
    <aside className="bg-white border border-gray-200 rounded-2xl flex max-h-[min(70vh,640px)] flex-col overflow-hidden lg:sticky lg:top-24 shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900">Episodes</h3>
        <select
          value={season}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-400"
        >
          {seasons.map((s) => (
            <option key={s.season_number} value={s.season_number}>
              {s.name || `Season ${s.season_number}`}
            </option>
          ))}
          {!seasons.length && (
            <option value={season}>Season {season}</option>
          )}
        </select>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {episodes.map((ep) => {
          const active = ep.episode_number === episode;
          return (
            <li key={ep.episode_number}>
              <button
                type="button"
                onClick={() => onEpisodeSelect(ep.episode_number)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? 'bg-purple-100 text-purple-900 ring-1 ring-purple-300'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    active ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ep.episode_number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {ep.name || `Episode ${ep.episode_number}`}
                  </span>
                  {ep.runtime != null && ep.runtime > 0 && (
                    <span className="text-[10px] text-gray-500">
                      {ep.runtime}m
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
        {!episodes.length && (
          <li className="px-3 py-6 text-center text-xs text-gray-500">
            Loading episodes…
          </li>
        )}
      </ul>
    </aside>
  );
}
