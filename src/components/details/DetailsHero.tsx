import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { backdropImage, posterImage } from '@/utils/images';
import { formatRating, formatRuntime, formatYear } from '@/utils/format';
interface DetailsHeroProps {
  media: MediaItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DetailsHero({
  media,
  isFavorite,
  onToggleFavorite,
}: DetailsHeroProps) {
  const typeLabel =
    media.mediaType === 'tv'
      ? 'TV'
      : media.mediaType === 'anime'
        ? 'Anime'
        : 'Movie';

  const metaParts = [
    `★ ${formatRating(media.rating)}`,
    formatYear(media.releaseDate, media.year),
    media.genres[0],
    formatRuntime(media.runtime),
  ].filter(Boolean);

  return (
    <section className="relative min-h-[72vh] w-full overflow-hidden">
      <img
        src={backdropImage(media.backdropPath)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />

      <div className="absolute inset-0 z-[2] bg-hero-gradient" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-surface-base via-black/30 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
          <div className="flex-1">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {media.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75 sm:text-base">
              {metaParts.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-white/30">·</span>}
                  <span
                    className={
                      part.startsWith('★')
                        ? 'font-semibold text-yellow-300'
                        : ''
                    }
                  >
                    {part}
                  </span>
                </span>
              ))}
              <span className="text-white/30">·</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-bold uppercase">
                {typeLabel}
              </span>
            </p>

            {media.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {media.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/search?genre=${encodeURIComponent(g)}`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:border-yellow-400/40 hover:text-yellow-200"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/watch/${media.id}?type=${media.mediaType}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-3.5 text-sm font-bold text-black shadow-glow transition hover:brightness-110"
              >
                ▶ Watch Now
              </Link>
              <button
                type="button"
                onClick={onToggleFavorite}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold backdrop-blur-sm transition ${
                  isFavorite
                    ? 'border-yellow-400/50 bg-yellow-500/20 text-yellow-200'
                    : 'border-white/20 bg-black/30 text-white hover:border-yellow-400/40'
                }`}
              >
                {isFavorite ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>

          <img
            src={posterImage(media.posterPath)}
            alt={media.title}
            className="mx-auto hidden w-44 shrink-0 rounded-2xl shadow-poster ring-1 ring-white/10 lg:block lg:w-52"
          />
        </div>
      </div>
    </section>
  );
}
