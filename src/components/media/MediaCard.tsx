import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatRating, formatYear, truncate } from '@/utils/format';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useLazyLoad } from '@/hooks/useLazyLoad';

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
  const { elementRef, isVisible } = useLazyLoad();

  return (
    <motion.article
      ref={elementRef}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative ${width}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-purple-200/50 group-hover:ring-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
        <Link to={detailsUrl} className="block h-full">
          {isVisible ? (
            <motion.img
              src={posterImage(item.posterPath)}
              alt={item.title}
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 animate-pulse" />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-purple-700 border border-purple-300/50 shadow-lg"
        >
          ⭐ {formatRating(item.rating)}
        </motion.span>

        <div className="absolute inset-0 z-10 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <div className="flex flex-1 items-center justify-center px-3 pt-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Link
                to={watchUrl}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 bg-[length:200%_auto] px-6 py-3 text-sm font-black text-white shadow-xl shadow-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 animate-gradient"
              >
                <span className="text-base">▶</span>
                <span>Watch Now</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="pointer-events-auto shrink-0 space-y-2 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-4 pt-8"
          >
            <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
              {item.title}
            </p>
            <p className="text-[11px] text-white/90 font-medium">
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
              className="inline-block pt-1 text-[11px] font-bold text-purple-300 hover:text-purple-200 transition-colors"
            >
              View Details →
            </Link>
          </motion.div>
        </div>

        {showProgress != null && showProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-gray-800/50 backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(showProgress, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-700 to-violet-600"
            />
          </div>
        )}
      </div>

      <motion.button
        type="button"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(item);
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
          isFavorite
            ? 'bg-gradient-to-r from-purple-700 to-violet-600 border-2 border-purple-400 text-white'
            : 'bg-white/90 border-2 border-purple-200/50 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
        }`}
      >
        <motion.span
          animate={isFavorite ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </motion.span>
      </motion.button>

      <motion.h3
        className="mt-3 px-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300"
      >
        {item.title}
      </motion.h3>
    </motion.article>
  );
}
