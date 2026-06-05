import { useCallback, useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { backdropImage } from '@/utils/images';
import { formatRating, formatRuntime, formatYear, truncate } from '@/utils/format';
import { Skeleton } from '@/components/ui/Skeleton';

interface HeroCarouselProps {
  items: MediaItem[];
  loading?: boolean;
}

const ROTATE_MS = 10000;

export function HeroCarousel({ items, loading }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  }, [items.length]);
  
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(next, ROTATE_MS);
    return () => clearInterval(timer);
  }, [items.length, next]);

  const current = useMemo(() => items[index], [items, index]);

  if (loading) {
    return <Skeleton className="h-[80vh] w-full rounded-none sm:rounded-b-3xl" />;
  }

  if (!current) return null;

  const typeLabel =
    current.mediaType === 'tv'
      ? 'TV SHOW'
      : current.mediaType === 'anime'
        ? 'ANIME'
        : 'MOVIE';

  const metaLine = [
    `⭐ ${formatRating(current.rating)}`,
    formatYear(current.releaseDate, current.year),
    current.genres[0],
    formatRuntime(current.runtime),
  ]
    .filter((p) => p && p !== '—')
    .join(' • ');

  return (
    <section className="relative mb-10 h-[75vh] min-h-[550px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={backdropImage(current.backdropPath)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0F0F17] via-[#0F0F17]/70 to-transparent" aria-hidden />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0F0F17]/95 via-[#0F0F17]/35 to-transparent" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-mesh opacity-60" aria-hidden />

      {items.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-surface-card/60 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center text-3xl text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110"
        >
          ‹
        </button>
      )}
      
      {items.length > 1 && (
        <button
          onClick={next}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-surface-card/60 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center text-3xl text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110"
        >
          ›
        </button>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-16 pb-16 pt-24 sm:px-20 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-card/80 backdrop-blur-sm px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-purple-300 border border-purple-400/30 shadow-lg">
              {typeLabel}
            </span>

            {current.genres.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {current.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-surface-card/80 backdrop-blur-sm px-4 py-1.5 text-[12px] font-medium text-white border border-purple-500/20"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-balance text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl">
              {current.title}
            </h1>
            
            <p className="text-sm sm:text-lg font-semibold text-purple-200 mb-4">
              {metaLine}
            </p>
            
            <p className="mt-2 line-clamp-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-white/85">
              {truncate(current.overview, 280)}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={`/watch/${current.id}?type=${current.mediaType}`}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-deep to-purple px-9 py-4 text-base font-black text-white shadow-xl shadow-purple-500/40 transition-all duration-300 hover:shadow-glow hover:scale-105"
              >
                ▶ Watch Now
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center gap-3 rounded-full bg-surface-card/85 backdrop-blur-sm border border-purple-500/20 px-9 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-purple-400 hover:bg-surface-hover"
              >
                📚 Browse Library
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex gap-3">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-400 cursor-pointer ${
                i === index
                  ? 'w-16 bg-gradient-to-r from-purple-deep to-purple shadow-lg shadow-purple-500/40'
                  : 'w-8 bg-surface-hover hover:bg-surface-card'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
