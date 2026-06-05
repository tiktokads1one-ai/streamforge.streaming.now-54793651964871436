import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { MediaRow } from '@/components/media/MediaRow';
import { PageLoader } from '@/components/ui/PageLoader';
import { DetailsHero } from '@/components/details/DetailsHero';
import { CastCarousel } from '@/components/details/CastCarousel';
import {
  fetchMediaDetails,
  fetchRecommendations,
  fetchSimilar,
} from '@/services/media';
import type { MediaItem, MediaType } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';
import { posterImage } from '@/utils/images';

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

  return (
    <>
      <Seo
        title={media.title}
        description={media.overview}
        image={posterImage(media.posterPath)}
      />

      <DetailsHero
        media={media}
        isFavorite={fav}
        onToggleFavorite={() => toggleFavorite(media)}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Overview</h2>
          <p className="max-w-4xl text-base leading-relaxed text-gray-700 sm:text-lg">
            {media.overview || 'No overview available.'}
          </p>
        </section>
      </div>

      <CastCarousel cast={media.cast} />

      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
      </div>
      <MediaRow label="Similar" title="Similar" items={similar} />
      <MediaRow label="Recommended" title="Recommended" items={recommendations} />
    </>
  );
}
