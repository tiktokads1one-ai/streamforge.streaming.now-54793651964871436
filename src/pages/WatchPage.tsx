import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/PageLoader';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { fetchMediaDetails } from '@/services/media';
import type { MediaItem, MediaType } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as MediaType) || 'movie';
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const continueWatching = useLibraryStore((s) => s.continueWatching);

  const progress = continueWatching.find((c) => c.media.id === id)?.progress;

  useEffect(() => {
    if (!id) return;
    fetchMediaDetails(id, type).then((item) => {
      setMedia(item);
      setLoading(false);
    });
  }, [id, type]);

  if (loading) return <PageLoader />;
  if (!media) {
    return (
      <p className="px-6 py-20 text-center text-white/60">Unable to load player.</p>
    );
  }

  return (
    <>
      <Seo title={`Watch ${media.title}`} description={`Streaming ${media.title}`} />
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <Link
          to={`/details/${media.id}?type=${media.mediaType}`}
          className="mb-4 inline-block text-sm text-forge-glow hover:underline"
        >
          ← Back to details
        </Link>
        <h1 className="mb-4 text-xl font-semibold sm:text-2xl">{media.title}</h1>
        <VideoPlayer media={media} startAt={progress} />
      </section>
    </>
  );
}
