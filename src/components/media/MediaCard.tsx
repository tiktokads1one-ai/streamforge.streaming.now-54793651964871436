import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatRating, formatYear } from '@/utils/format';
import { RatingBadge } from '@/components/ui/RatingBadge';

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

  return (
    <Link
      to={`/details/${item.id}?type=${item.mediaType}`}
      className={`group block ${width}`}
    >
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative"
      >
        <motion.div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-card shadow-poster ring-1 ring-white/5 transition duration-300 group-hover:ring-accent/40 group-hover:shadow-glow-sm">
          <img
            src={posterImage(item.posterPath)}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg text-black shadow-glow">
              ▶
            </span>
          </motion.div>
          <motion.div className="absolute left-2 top-2">
            <RatingBadge rating={item.rating} size="sm" />
          </motion.div>
          {showProgress != null && showProgress > 0 && (
            <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                className="h-full bg-accent shadow-glow-sm"
                style={{ width: `${Math.min(showProgress, 100)}%` }}
              />
            </motion.div>
          )}
        </motion.div>
        <motion.div className="mt-2.5 px-0.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-accent-bright">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-white/45">
            <span className="text-white/70">{formatRating(item.rating)}</span>
            <span className="meta-dot" />
            {formatYear(item.releaseDate, item.year)}
            <span className="meta-dot" />
            {typeLabel(item.mediaType)}
          </p>
        </motion.div>
      </motion.article>
    </Link>
  );
}
