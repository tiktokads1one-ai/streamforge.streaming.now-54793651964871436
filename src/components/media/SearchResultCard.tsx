import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatYear, truncate } from '@/utils/format';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface SearchResultCardProps {
  item: MediaItem;
}

export function SearchResultCard({ item }: SearchResultCardProps) {
  const type =
    item.mediaType === 'tv'
      ? 'TV'
      : item.mediaType === 'anime'
        ? 'Anime'
        : 'Movie';

  return (
    <article className="group relative flex w-full gap-4 rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-purple-300 hover:bg-purple-50 sm:gap-5 sm:p-4 shadow-sm">
      <Link
        to={`/details/${item.id}?type=${item.mediaType}`}
        className="relative h-[120px] w-20 shrink-0 overflow-hidden rounded-lg sm:h-[140px] sm:w-[95px]"
      >
        <img
          src={posterImage(item.posterPath)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <RatingBadge rating={item.rating} size="sm" />
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
            {type}
          </span>
        </div>
        <Link
          to={`/details/${item.id}?type=${item.mediaType}`}
          className="text-base font-bold text-gray-900 hover:text-purple-700 sm:text-lg"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {formatYear(item.releaseDate, item.year)}
          {item.genres[0] && (
            <>
              <span className="mx-1 text-gray-300">·</span>
              {item.genres[0]}
            </>
          )}
        </p>
        {item.overview && (
          <p className="mt-2 hidden line-clamp-2 text-sm text-gray-500 sm:block">
            {truncate(item.overview, 140)}
          </p>
        )}
      </div>

      <div className="hidden shrink-0 flex-col justify-center gap-2 sm:flex">
        <Link
          to={`/details/${item.id}?type=${item.mediaType}`}
          className="rounded-full border border-gray-200 px-4 py-2 text-center text-xs font-medium text-gray-700 transition hover:border-purple-400 hover:text-purple-700"
        >
          Info
        </Link>
        <Link
          to={`/watch/${item.id}?type=${item.mediaType}`}
          className="rounded-full bg-gradient-to-r from-purple-800 to-purple-500 px-4 py-2 text-center text-xs font-bold text-white shadow-glow-sm transition hover:brightness-110"
        >
          Watch
        </Link>
      </div>
    </article>
  );
}
