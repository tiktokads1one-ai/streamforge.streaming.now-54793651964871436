import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatYear, truncate } from '@/utils/format';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface SearchResultCardProps {
  item: MediaItem;
  index?: number;
}

export function SearchResultCard({ item, index = 0 }: SearchResultCardProps) {
  const type =
    item.mediaType === 'tv'
      ? 'TV'
      : item.mediaType === 'anime'
        ? 'Anime'
        : 'Movie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-surface-card/60 p-3 transition hover:border-accent/30 hover:bg-surface-hover sm:gap-5 sm:p-4"
    >
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
      <motion.div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <RatingBadge rating={item.rating} size="sm" />
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
            {type}
          </span>
        </div>
        <Link
          to={`/details/${item.id}?type=${item.mediaType}`}
          className="text-base font-bold text-white hover:text-accent-bright sm:text-lg"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-white/45 sm:text-sm">
          {formatYear(item.releaseDate, item.year)}
          {item.genres[0] && (
            <>
              <span className="meta-dot" />
              {item.genres[0]}
            </>
          )}
        </p>
        {item.overview && (
          <p className="mt-2 hidden line-clamp-2 text-sm text-white/55 sm:block">
            {truncate(item.overview, 140)}
          </p>
        )}
      </motion.div>
      <motion.div className="hidden shrink-0 flex-col justify-center gap-2 sm:flex">
        <Link
          to={`/details/${item.id}?type=${item.mediaType}`}
          className="rounded-full border border-white/10 px-4 py-2 text-center text-xs font-medium text-white/70 transition hover:border-accent/50 hover:text-accent-bright"
        >
          Info
        </Link>
        <Link
          to={`/watch/${item.id}?type=${item.mediaType}`}
          className="rounded-full bg-accent px-4 py-2 text-center text-xs font-bold text-black shadow-glow-sm transition hover:brightness-110"
        >
          Watch
        </Link>
      </motion.div>
    </motion.div>
  );
}
