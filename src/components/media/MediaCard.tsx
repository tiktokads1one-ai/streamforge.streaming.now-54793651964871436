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
    variant === 'grid' ? 'w-full' : 'w-[155px] shrink-0 sm:w-[175px]';
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFavorite = useLibraryStore((s) => s.isFavorite)(item.id);
  const detailsUrl = `/details/${item.id}?type=${item.mediaType}`;
  const watchUrl = `/watch/${item.id}?type=${item.mediaType}`;

  return (
    <article
      className={`group relative ${width} transition-all duration-300 ease-out hover:z-20`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100 ring-1 ring-purple-200 group-hover:ring-purple-400 group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300">
        <Link to={detailsUrl} className="block h-full">
          <img
            src={posterImage(item.posterPath)}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[11px] font-bold text-purple-700 border border-purple-300 shadow-md">
          ⭐ {formatRating(item.rating)}
        </span>

        <div className="absolute inset-0 z-10 flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-1 items-center justify-center px-3 pt-12">
            <Link
              to={watchUrl}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto rounded-full bg-gradient-to-r from-purple-800 to-purple-500 px-7 py-3 text-sm font-black text-white shadow-xl shadow-purple-500/30 transition-all duration-200 hover:shadow-glow hover:scale-110"
            >
              ▶ Watch Now
            </Link>
          </div>

          <div className="pointer-events-auto shrink-0 space-y-2 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-4 pt-8">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
              {item.title}
            </p>
            <p className="text-[11px] text-white/80">
              {formatYear(item.releaseDate, item.year)} • {typeLabel(item.mediaType)}
            </p>
            {item.overview && (
              <p className="line-clamp-2 text-[10px] leading-snug text-white/70">
                {truncate(item.overview, 70)}
              </p>
            )}
            <Link
              to={detailsUrl}
              onClick={(e) => e.stopPropagation()}
              className="inline-block pt-1 text-[11px] font-semibold text-purple-200 hover:text-purple-100"
            >
              View Details →
            </Link>
          </div>
        </div>

        {showProgress != null && showProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-purple-800 to-purple-500"
              style={{ width: `${Math.min(showProgress, 100)}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(item);
        }}
        className={`absolute right-2.5 top-2.5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all duration-200 border border-purple-200 shadow-md ${
          isFavorite
            ? 'bg-gradient-to-r from-purple-800 to-purple-500 border-purple-400 text-white scale-110'
            : 'text-gray-700 hover:border-purple-400 hover:bg-purple-50 hover:scale-110'
        }`}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="mt-3 px-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-purple-700 group-hover:scale-[1.02] transition-all duration-200">
        {item.title}
      </h3>
    </article>
  );
}
