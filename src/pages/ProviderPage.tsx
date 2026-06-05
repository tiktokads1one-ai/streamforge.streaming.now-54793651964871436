import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/PageLoader';
import { MediaRow } from '@/components/media/MediaRow';
import { getFeaturedProvider } from '@/config/providers';
import {
  fetchMoviesByWatchProvider,
  watchProviderLogo,
} from '@/services/watchProviders';
import { fetchPopularTv, fetchTrending } from '@/services/media';
import type { MediaItem } from '@/types/media';

export function ProviderPage() {
  const { slug } = useParams<{ slug: string }>();
  const provider = slug ? getFeaturedProvider(slug) : undefined;
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tv, setTv] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [onProvider, popularTv, trend] = await Promise.all([
        fetchMoviesByWatchProvider(provider.id, 1),
        fetchPopularTv(1),
        fetchTrending('movie', 1),
      ]);
      if (!cancelled) {
        setMovies(onProvider);
        setTv(popularTv);
        setTrending(trend);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provider]);

  if (!provider) {
    return (
      <p className="px-6 py-20 text-center text-gray-500">Provider not found.</p>
    );
  }

  const bg = provider.brandColor ?? '#8B5CF6';

  return (
    <>
      <Seo
        title={`${provider.name} on StreamForge`}
        description={provider.tagline}
      />

      <header
        className="relative overflow-hidden border-b border-gray-200 px-4 py-14 sm:px-8"
        style={{
          background: `linear-gradient(135deg, ${bg}11 0%, transparent 55%)`,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6">
          <img
            src={watchProviderLogo(provider.logoPath, 'w500')}
            alt={provider.name}
            className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-1 ring-gray-200 sm:h-28 sm:w-28"
          />
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-gray-900">{provider.name}</h1>
            <p className="mt-2 text-gray-600">{provider.tagline}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm text-purple-700 hover:underline"
            >
              ← Back home
            </Link>
          </div>
        </div>
      </header>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="pb-16">
          <MediaRow
            label="Trending"
            title={`Trending on ${provider.name}`}
            items={trending}
            viewAllHref={`/search?watch=${provider.id}&providerName=${encodeURIComponent(provider.name)}`}
          />
          <MediaRow
            label="Movies"
            title={`${provider.name} Movies`}
            items={movies}
            viewAllHref={`/search?watch=${provider.id}&providerName=${encodeURIComponent(provider.name)}`}
          />
          <MediaRow
            label="TV"
            title={`${provider.name} TV`}
            items={tv}
            viewAllHref="/search?type=tv"
          />
          <MediaRow
            label="Originals"
            title={`${provider.name} Originals`}
            items={movies.slice(0, 12)}
          />
        </div>
      )}
    </>
  );
}
