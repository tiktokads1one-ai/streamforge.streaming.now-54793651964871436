import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/PageLoader';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { EpisodeSidebar } from '@/components/player/EpisodeSidebar';
import { AutoNextOverlay } from '@/components/player/AutoNextOverlay';
import { MediaRow } from '@/components/media/MediaRow';
import { CastCarousel } from '@/components/details/CastCarousel';
import {
  fetchMediaDetails,
  fetchRecommendations,
  fetchSimilar,
  fetchSameGenre,
} from '@/services/media';
import { hasTmdbKey, tmdbFetch } from '@/services/tmdb';
import type { MediaItem, MediaType } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';
import { formatRating, formatRuntime, formatYear } from '@/utils/format';

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as MediaType) || 'movie';
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [similar, setSimilar] = useState<MediaItem[]>([]);
  const [sameGenre, setSameGenre] = useState<MediaItem[]>([]);
  const [recommended, setRecommended] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [showAutoNext, setShowAutoNext] = useState(false);

  const continueWatching = useLibraryStore((s) => s.continueWatching);
  const progress = continueWatching.find((c) => c.media.id === id)?.progress;

  const isSeries = type === 'tv' || type === 'anime';

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
      const [sim, genre, rec] = await Promise.all([
        fetchSimilar(id, type),
        fetchSameGenre(id, type),
        fetchRecommendations(id, type),
      ]);
      if (!cancelled) {
        setSimilar(sim);
        setSameGenre(genre);
        setRecommended(rec);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  useEffect(() => {
    if (!id || !isSeries || !hasTmdbKey()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    tmdbFetch<{ episodes: { episode_number: number; runtime?: number }[] }>(
      `/tv/${id}/season/${season}`,
    ).then((data) => {
      if (cancelled) return;
      const eps = data.episodes ?? [];
      setEpisodeCount(eps.length);
      const current = eps.find((e) => e.episode_number === episode);
      const runtimeMin = current?.runtime ?? 24;
      const ms = Math.min(
        Math.max(runtimeMin * 60 * 1000, 120000),
        50 * 60 * 1000,
      );
      setShowAutoNext(false);
      timer = setTimeout(() => {
        if (episode < eps.length) setShowAutoNext(true);
      }, ms);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [id, season, episode, isSeries]);

  const playNextEpisode = useCallback(() => {
    if (episode < episodeCount) {
      setEpisode((e) => e + 1);
      setShowAutoNext(false);
    }
  }, [episode, episodeCount]);

  if (loading) return <PageLoader />;
  if (!media) {
    return (
      <p className="px-6 py-20 text-center text-white/60">Unable to load player.</p>
    );
  }

  const metaParts = [
    `★ ${formatRating(media.rating)}`,
    formatYear(media.releaseDate, media.year),
    media.genres[0],
    formatRuntime(media.runtime),
  ].filter((p) => p && p !== '—');

  const nextEpisode = episode + 1;
  const hasNext = isSeries && episode < episodeCount;

  return (
    <>
      <Seo
        title={`Watch ${media.title}`}
        description={`Streaming ${media.title}`}
      />

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={`/details/${media.id}?type=${media.mediaType}`}
          className="mb-4 inline-block text-sm text-purple-700 hover:underline"
        >
          ← Back to details
        </Link>

        <div
          className={`grid gap-8 ${isSeries ? 'lg:grid-cols-[1fr_280px]' : ''}`}
        >
          <div>
            <div className="relative">
              <VideoPlayer
                media={media}
                startAt={progress}
                season={season}
                episode={episode}
                onSeasonChange={(s) => {
                  setSeason(s);
                  setEpisode(1);
                  setShowAutoNext(false);
                }}
                onEpisodeChange={(ep) => {
                  setEpisode(ep);
                  setShowAutoNext(false);
                }}
                hideEpisodeSelector
              />
              {hasNext && (
                <AutoNextOverlay
                  show={showAutoNext}
                  nextEpisode={nextEpisode}
                  nextSeason={season}
                  mediaId={media.id}
                  mediaType={media.mediaType}
                  onPlayNext={playNextEpisode}
                  onCancel={() => setShowAutoNext(false)}
                />
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold sm:text-3xl text-gray-900">{media.title}</h1>
              {isSeries && (
                <p className="mt-1 text-sm text-purple-700">
                  Season {season} · Episode {episode}
                </p>
              )}
              <p className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                {metaParts.map((part, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300">·</span>}
                    <span
                      className={
                        part.startsWith('★') ? 'font-semibold text-purple-700' : ''
                      }
                    >
                      {part}
                    </span>
                  </span>
                ))}
              </p>
            </div>

            <section className="mt-8">
              <h2 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">Overview</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
                {media.overview || 'No overview available.'}
              </p>
            </section>

            {hasNext && !showAutoNext && (
              <button
                type="button"
                onClick={() => setShowAutoNext(true)}
                className="mt-6 rounded-full border border-purple-400 px-5 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
              >
                Next episode →
              </button>
            )}
          </div>

          {isSeries && id && (
            <EpisodeSidebar
              tmdbId={id}
              season={season}
              episode={episode}
              onSeasonChange={(s) => {
                setSeason(s);
                setEpisode(1);
                setShowAutoNext(false);
              }}
              onEpisodeSelect={(ep) => {
                setEpisode(ep);
                setShowAutoNext(false);
              }}
            />
          )}
        </div>
      </section>

      <CastCarousel cast={media.cast} />
      <MediaRow label="Similar" title="Similar Titles" items={similar} />
      <MediaRow label="Genre" title="Same Genre" items={sameGenre} />
      <MediaRow label="For you" title="You May Like" items={recommended} />
    </>
  );
}
