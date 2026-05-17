import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Seo } from '@/components/ui/Seo';
import { MediaRow } from '@/components/media/MediaRow';
import { PageLoader } from '@/components/ui/PageLoader';
import { RatingBadge } from '@/components/ui/RatingBadge';
import {
  fetchMediaDetails,
  fetchRecommendations,
  fetchSimilar,
} from '@/services/media';
import type { MediaItem, MediaType } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';
import { backdropImage, posterImage } from '@/utils/images';
import { formatRuntime, formatYear } from '@/utils/format';

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as MediaType) || 'movie';
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [similar, setSimilar] = useState<MediaItem[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFavorite = useLibraryStore((s) => s.isFavorite);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const detail = await fetchMediaDetails(id, type);
      if (cancelled || !detail) {
        setLoading(false);
        return;
      }
      setMedia(detail);
      const [sim, rec] = await Promise.all([
        fetchSimilar(id, type),
        fetchRecommendations(id, type),
      ]);
      if (!cancelled) {
        setSimilar(sim);
        setRecommendations(rec);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  if (loading) return <PageLoader />;
  if (!media) {
    return (
      <p className="px-6 py-20 text-center text-white/60">Title not found.</p>
    );
  }

  const fav = isFavorite(media.id);
  const typeLabel =
    media.mediaType === 'tv'
      ? 'TV Series'
      : media.mediaType === 'anime'
        ? 'Anime'
        : 'Movie';

  return (
    <>
      <Seo
        title={media.title}
        description={media.overview}
        image={posterImage(media.posterPath)}
      />
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] overflow-hidden">
          <img
            src={backdropImage(media.backdropPath)}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        <motion.div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <img
              src={posterImage(media.posterPath)}
              alt={media.title}
              className="mx-auto w-44 shrink-0 rounded-2xl shadow-poster ring-1 ring-white/10 md:mx-0 md:w-52"
            />
            <div className="flex-1">
              <motion.div className="mb-3 flex flex-wrap items-center gap-3">
                <RatingBadge rating={media.rating} size="lg" />
                <span className="text-sm text-white/60">
                  {formatYear(media.releaseDate, media.year)}
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                  {typeLabel}
                </span>
                <span className="text-sm text-white/50">
                  {formatRuntime(media.runtime)}
                </span>
              </motion.div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {media.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {media.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/search?genre=${encodeURIComponent(g)}`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-accent/40 hover:text-accent-bright"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70">
                {media.overview}
              </p>

              {media.cast.length > 0 && (
                <p className="mt-6 text-sm text-white/50">
                  <span className="font-semibold text-white/70">Cast: </span>
                  {media.cast.map((c) => c.name).join(' · ')}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/watch/${media.id}?type=${media.mediaType}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-black shadow-glow transition hover:brightness-110"
                >
                  ▶ Watch Now
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite(media)}
                  className={`rounded-full border px-6 py-3.5 text-sm font-semibold transition ${
                    fav
                      ? 'border-accent/50 bg-accent-muted text-accent-bright'
                      : 'border-white/15 bg-white/5 text-white hover:border-accent/40'
                  }`}
                >
                  {fav ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <MediaRow label="Similar" title="More Like This" items={similar} />
      <MediaRow label="Picks" title="Recommended" items={recommendations} />
    </>
  );
}
