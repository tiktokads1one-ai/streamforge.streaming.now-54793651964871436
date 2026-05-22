import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatRating, formatYear, truncate } from '@/utils/format';
import { useLibraryStore } from '@/store/useLibraryStore';

interface MediaCardProps {
  item: MediaItem;
  showProgress?: number;
  variant?: 'row' | 'grid';
}

function typeLabel(type: MediaItem['mediaType']): string {
  if (type === 'tv') return 'TV';
  if (type === 'anime') return 'Anime';
  return 'Movie';
}

export function MediaCard({
  item,
  showProgress,
  variant = 'row',
}: MediaCardProps) {
  const width =
    variant === 'grid' ? 'w-full' : 'w-[130px] shrink-0 sm:w-[150px]';
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFavorite = useLibraryStore((s) => s.isFavorite)(item.id);
  const detailsUrl = `/details/${item.id}?type=${item.mediaType}`;
  const watchUrl = `/watch/${item.id}?type=${item.mediaType}`;

  return (
    <article
      className={`group relative ${width} transition-transform duration-300 ease-out hover:z-20 hover:scale-[1.06]`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-raised shadow-poster ring-1 ring-white/[0.05]">
        <Link to={detailsUrl} className="block h-full">
          <img
            src={posterImage(item.posterPath)}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="pointer-events-none absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-amber-300 backdrop-blur-sm">
          ★ {formatRating(item.rating)}
        </span>

        <div className="absolute inset-0 z-10 flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-1 items-center justify-center px-3 pt-10">
            <Link
              to={watchUrl}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
            >
              ▶ Watch
            </Link>
          </div>

          <div className="pointer-events-auto shrink-0 space-y-1 bg-gradient-to-t from-black via-black/90 to-transparent p-3 pt-8">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
              {item.title}
            </p>
            <p className="text-[11px] text-white/55">
              {formatYear(item.releaseDate, item.year)}
              <span className="meta-dot" />
              {typeLabel(item.mediaType)}
            </p>
            {item.overview && (
              <p className="line-clamp-2 text-[10px] leading-snug text-white/45">
                {truncate(item.overview, 64)}
              </p>
            )}
            <Link
              to={detailsUrl}
              onClick={(e) => e.stopPropagation()}
              className="inline-block pt-1 text-[11px] font-medium text-violet-300 hover:text-violet-200"
            >
              More details →
            </Link>
          </div>
        </div>

        {showProgress != null && showProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
            <div
              className="h-full bg-violet-500"
              style={{ width: `${Math.min(showProgress, 100)}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={isFavorite ? 'Remove from saved' : 'Save'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(item);
        }}
        className={`absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition ${
          isFavorite
            ? 'bg-violet-500/40 text-lg'
            : 'bg-black/60 text-base text-white/90 hover:bg-black/80'
        }`}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="mt-2.5 line-clamp-2 px-0.5 text-sm font-semibold text-white/90 group-hover:invisible">
        {item.title}
      </h3>
    </article>
  );
}
