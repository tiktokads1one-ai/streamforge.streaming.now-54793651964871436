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
    <aside className="glass-panel flex max-h-[min(70vh,640px)] flex-col overflow-hidden lg:sticky lg:top-24">
      <div className="border-b border-white/[0.06] p-4">
        <h3 className="text-sm font-bold text-white">Episodes</h3>
        <select
          value={season}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50"
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
                    ? 'bg-yellow-500/20 text-yellow-100 ring-1 ring-yellow-500/40'
                    : 'text-white/75 hover:bg-white/5'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    active ? 'bg-yellow-600 text-white' : 'bg-white/10'
                  }`}
                >
                  {ep.episode_number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {ep.name || `Episode ${ep.episode_number}`}
                  </span>
                  {ep.runtime != null && ep.runtime > 0 && (
                    <span className="text-[10px] text-white/40">
                      {ep.runtime}m
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
        {!episodes.length && (
          <li className="px-3 py-6 text-center text-xs text-white/40">
            Loading episodes…
          </li>
        )}
      </ul>
    </aside>
  );
}
