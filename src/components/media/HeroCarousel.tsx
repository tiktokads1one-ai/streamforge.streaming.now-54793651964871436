import { useCallback, useEffect, useState } from 'react';
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

const ROTATE_MS = 9000;

export function HeroCarousel({ items, loading }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(next, ROTATE_MS);
    return () => clearInterval(timer);
  }, [items.length, next]);

  if (loading) {
    return <Skeleton className="h-[68vh] w-full rounded-none sm:rounded-b-3xl" />;
  }

  const current = items[index];
  if (!current) return null;

  const typeLabel =
    current.mediaType === 'tv'
      ? 'TV'
      : current.mediaType === 'anime'
        ? 'Anime'
        : 'Movie';

  const metaLine = [
    `★ ${formatRating(current.rating)}`,
    formatYear(current.releaseDate, current.year),
    current.genres[0],
    formatRuntime(current.runtime),
  ]
    .filter((p) => p && p !== '—')
    .join(' · ');

  return (
    <section className="relative mb-10 h-[68vh] min-h-[420px] w-full overflow-hidden sm:rounded-b-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={backdropImage(current.backdropPath)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] bg-hero-side" aria-hidden />
      <div className="absolute inset-0 z-[2] bg-hero-gradient" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="mb-3 text-sm font-medium text-white/75">{metaLine}</p>

            <span className="mb-3 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white/80">
              {typeLabel}
            </span>

            {current.genres.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {current.genres.slice(0, 4).map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {current.title}
            </h1>
            <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              {truncate(current.overview, 220)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/watch/${current.id}?type=${current.mediaType}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
              >
                ▶ Watch Now
              </Link>
              <Link
                to={`/details/${current.id}?type=${current.mediaType}`}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-accent/40 hover:bg-accent-muted"
              >
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-10 bg-accent shadow-glow-sm'
                  : 'w-4 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
