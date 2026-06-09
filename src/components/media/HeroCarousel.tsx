import { useCallback, useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
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

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -10000) {
      next();
    } else if (swipe > 10000) {
      prev();
    }
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="relative mb-10 h-[80vh] min-h-[550px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img
            src={backdropImage(current.backdropPath)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0F0F17] via-[#0F0F17]/60 to-transparent" aria-hidden />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0F0F17]/90 via-[#0F0F17]/30 to-transparent" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-mesh opacity-50" aria-hidden />

      {items.length > 1 && (
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-3xl text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl"
        >
          ‹
        </motion.button>
      )}
      
      {items.length > 1 && (
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-3xl text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl"
        >
          ›
        </motion.button>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-8 pb-16 pt-24 sm:px-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-white border border-white/20 shadow-2xl"
            >
              {typeLabel}
            </motion.span>

            {current.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-5 flex flex-wrap gap-2"
              >
                {current.genres.slice(0, 3).map((g, i) => (
                  <motion.span
                    key={g}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className="rounded-full bg-white/10 backdrop-blur-xl px-5 py-2 text-[12px] font-semibold text-white border border-white/20"
                  >
                    {g}
                  </motion.span>
                ))}
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-balance text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-5 drop-shadow-2xl"
            >
              {current.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm sm:text-lg font-bold text-purple-200 mb-5 flex items-center gap-2"
            >
              {metaLine}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-2 line-clamp-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-white/90"
            >
              {truncate(current.overview, 280)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/watch/${current.id}?type=${current.mediaType}`}
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-[length:200%_auto] px-10 py-4 text-base font-black text-white shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 animate-gradient"
                >
                  <span className="text-xl">▶</span>
                  <span>Watch Now</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40"
                >
                  <span>📚 Browse Library</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-14 flex gap-3"
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                i === index
                  ? 'w-20 bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg shadow-purple-500/50'
                  : 'w-8 bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
