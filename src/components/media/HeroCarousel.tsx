import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { backdropImage } from '@/utils/images';
import { formatYear, truncate } from '@/utils/format';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Skeleton } from '@/components/ui/Skeleton';

interface HeroCarouselProps {
  items: MediaItem[];
  loading?: boolean;
}

export function HeroCarousel({ items, loading }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(next, 8000);
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

  return (
    <section className="relative mb-10 h-[68vh] min-h-[420px] w-full overflow-hidden sm:rounded-b-3xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={current.id}
          src={backdropImage(current.backdropPath)}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <motion.div className="absolute inset-0 bg-hero-side" aria-hidden />
      <motion.div className="absolute inset-0 bg-hero-gradient" aria-hidden />

      <motion.div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-10">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <RatingBadge rating={current.rating} size="lg" />
            <span className="text-sm font-medium text-white/70">
              {formatYear(current.releaseDate, current.year)}
            </span>
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white/80">
              {typeLabel}
            </span>
          </div>

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
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-black shadow-glow transition hover:brightness-110"
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
      </motion.div>
    </section>
  );
}