import { useEffect, useState } from 'react';

interface Episode {
  episode_number: number;
  name: string;
  still_path?: string;
  vote_average?: number;
  overview?: string;
}

interface Season {
  season_number: number;
  name: string;
}

interface Props {
  tmdbId: string;
  currentSeason: number;
  currentEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeSelect: (episode: number) => void;
}

export function EpisodeSelector({
  tmdbId,
  currentSeason,
  currentEpisode,
  onSeasonChange,
  onEpisodeSelect,
}: Props) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  const apiKey =
    import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    async function loadShow() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}`
        );

        const data = await res.json();

        setSeasons(
          data.seasons?.filter(
            (s: Season) =>
              s.season_number > 0
          ) ?? []
        );
      } catch (e) {
        console.error(e);
      }
    }

    loadShow();
  }, [tmdbId]);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tmdbId}/season/${currentSeason}?api_key=${apiKey}`
        );

        const data =
          await res.json();

        setEpisodes(
          data.episodes ?? []
        );

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadEpisodes();

  }, [
    tmdbId,
    currentSeason
  ]);

  return (
    <div className="mt-8">

      <div
        className="
        flex
        gap-3
        overflow-x-auto
        pb-6
      "
      >

        {seasons.map((s) => (

          <button
            key={s.season_number}
            onClick={() => {
              onSeasonChange(
                s.season_number
              );
            }}
            className={`

            whitespace-nowrap
            rounded-full
            px-5
            py-2
            transition

            ${
              currentSeason ===
              s.season_number

              ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white'

              : 'bg-white/5 hover:bg-white/10 text-white'
            }

            `}
          >

            {s.name}

          </button>

        ))}

      </div>

      {loading ? (

        <div className="text-purple-300">
          Loading episodes...
        </div>

      ) : (

      <div className="space-y-4">

      {episodes.map((ep) => {

      const image =
      ep.still_path
      ? `https://image.tmdb.org/t/p/w780${ep.still_path}`
      : '';

      return (

      <button
      key={ep.episode_number}

      onClick={() => {
        onEpisodeSelect(
          ep.episode_number
        );
      }}

      className={`

      w-full
      overflow-hidden
      rounded-2xl
      border
      transition

      ${
      currentEpisode===ep.episode_number

      ?

      'border-purple-400 bg-purple-400/10'

      :

      'border-white/10 hover:border-purple-400'
      }

      `}
      >

      <div
      className="
      flex
      gap-4
      "
      >

      <div
      className="
      w-56
      shrink-0
      aspect-video
      bg-black
      "
      >

      {image && (

      <img
      src={image}
      alt={ep.name}
      className="
      h-full
      w-full
      object-cover
      "
      />

      )}

      </div>

      <div
      className="
      flex-1
      p-4
      text-left
      "
      >

      <div
      className="
      flex
      gap-4
      text-sm
      "
      >

      <div className="text-white">
      Episode {ep.episode_number}
      </div>

      <div className="text-purple-300">
      ⭐ {ep.vote_average?.toFixed(1) ?? 'N/A'}
      </div>

      </div>

      <div
      className="
      mt-2
      text-lg
      font-bold
      text-white
      "
      >
      {ep.name}
      </div>

      <div
      className="
      mt-2
      line-clamp-3
      text-sm
      text-white/60
      "
      >
      {ep.overview || 'No description'}
      </div>

      </div>

      </div>

      </button>

      );

      })}

      </div>

      )}

    </div>
  );
}
