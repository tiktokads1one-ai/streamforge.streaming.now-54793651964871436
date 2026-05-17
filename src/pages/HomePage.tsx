import { useEffect, useState } from 'react';
import { Seo } from '@/components/ui/Seo';
import { HeroCarousel } from '@/components/media/HeroCarousel';
import { MediaRow } from '@/components/media/MediaRow';
import { GenreBar } from '@/components/media/GenreBar';
import {
  fetchAnime,
  fetchHeroItems,
  fetchNewReleases,
  fetchPopularMovies,
  fetchPopularTv,
  fetchRecommendations,
  fetchTopRated,
  fetchTrending,
} from '@/services/media';
import type { MediaItem } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';

export function HomePage() {
  const continueWatching = useLibraryStore((s) => s.continueWatching);
  const [hero, setHero] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topWeek, setTopWeek] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tv, setTv] = useState<MediaItem[]>([]);
  const [anime, setAnime] = useState<MediaItem[]>([]);
  const [newReleases, setNewReleases] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [heroItems, trend, popMovies, popTv, animeList, releases, rated] =
          await Promise.all([
            fetchHeroItems(),
            fetchTrending('movie'),
            fetchPopularMovies(),
            fetchPopularTv(),
            fetchAnime(),
            fetchNewReleases(),
            fetchTopRated('movie'),
          ]);
        if (cancelled) return;
        setHero(heroItems);
        setTrending(trend);
        setTopWeek(trend.slice(0, 12));
        setMovies(popMovies);
        setTv(popTv);
        setAnime(animeList);
        setNewReleases(releases);
        setTopRated(rated);
        const recSource = heroItems[0] ?? trend[0];
        if (recSource) {
          const recs = await fetchRecommendations(
            recSource.id,
            recSource.mediaType,
          );
          if (!cancelled) setRecommendations(recs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const progressMap = Object.fromEntries(
    continueWatching.map((c) => [
      c.media.id,
      (c.progress / Math.max(c.duration, 1)) * 100,
    ]),
  );

  return (
    <>
      <Seo />
      <HeroCarousel items={hero} loading={loading} />
      <GenreBar />

      {continueWatching.length > 0 && (
        <MediaRow
          label="Your queue"
          title="Continue Watching"
          items={continueWatching.map((c) => c.media)}
          progressMap={progressMap}
        />
      )}

      <MediaRow
        label="Trending"
        title="Popular This Week"
        items={topWeek}
        loading={loading}
        viewAllHref="/search?q=trending"
      />
      <MediaRow
        label="Movies"
        title="Trending Movies"
        items={trending}
        loading={loading}
        viewAllHref="/search?type=movie"
      />
      <MediaRow
        label="Editor's picks"
        title="Popular Movies"
        items={movies}
        loading={loading}
        viewAllHref="/search?type=movie"
      />
      <MediaRow
        label="Series"
        title="TV Shows"
        items={tv}
        loading={loading}
        viewAllHref="/search?type=tv"
      />
      <MediaRow
        label="Anime"
        title="Anime & Animation"
        items={anime}
        loading={loading}
        viewAllHref="/search?type=anime"
      />
      <MediaRow
        label="New"
        title="Latest Releases"
        items={newReleases}
        loading={loading}
        viewAllHref="/search?type=movie"
      />
      <MediaRow
        label="Top rated"
        title="Highest Rated"
        items={topRated}
        loading={loading}
      />
      <MediaRow
        label="For you"
        title="Recommended"
        items={recommendations}
        loading={loading}
      />
    </>
  );
}
