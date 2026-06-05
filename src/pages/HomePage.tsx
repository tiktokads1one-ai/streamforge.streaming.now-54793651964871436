import { useEffect, useState, useMemo } from 'react';
import { Seo } from '@/components/ui/Seo';
import { HeroCarousel } from '@/components/media/HeroCarousel';
import { MediaRow } from '@/components/media/MediaRow';
import { Top10Row } from '@/components/media/Top10Row';
import { GenreBar } from '@/components/media/GenreBar';
import { WatchProvidersRow } from '@/components/media/WatchProvidersRow';
import { HOME_CONTENT_ROWS } from '@/config/homeRows';
import {
  fetchAnime,
  fetchAwardWinners,
  fetchDiscoverByGenre,
  fetchHeroItems,
  fetchNewReleases,
  fetchRecommendations,
  fetchTrendingAllWeek,
  fetchTrendingToday,
  fetchZombiePicks,
} from '@/services/media';
import type { MediaItem } from '@/types/media';
import { useLibraryStore } from '@/store/useLibraryStore';

async function loadHomeRow(
  row: (typeof HOME_CONTENT_ROWS)[number],
): Promise<MediaItem[]> {
  if (row.title === 'Award Winners') return fetchAwardWinners();
  if (row.title === 'Zombie') return fetchZombiePicks();
  if (row.title === 'Anime') return fetchAnime();
  return fetchDiscoverByGenre(row.genre, row.mediaType ?? 'movie');
}

export function HomePage() {
  const continueWatching = useLibraryStore((s) => s.continueWatching);
  const [hero, setHero] = useState<MediaItem[]>([]);
  const [trendingToday, setTrendingToday] = useState<MediaItem[]>([]);
  const [topWeek, setTopWeek] = useState<MediaItem[]>([]);
  const [genreRows, setGenreRows] = useState<Record<string, MediaItem[]>>({});
  const [newReleases, setNewReleases] = useState<MediaItem[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [heroItems, today, week, releases] = await Promise.all([
          fetchHeroItems(),
          fetchTrendingToday(),
          fetchTrendingAllWeek(),
          fetchNewReleases(),
        ]);
        if (cancelled) return;
        setHero(heroItems);
        setTrendingToday(today);
        setTopWeek(week);
        setNewReleases(releases);

        const rowResults = await Promise.all(
          HOME_CONTENT_ROWS.map(async (row) => ({
            key: row.title,
            items: await loadHomeRow(row),
          })),
        );
        if (!cancelled) {
          setGenreRows(
            Object.fromEntries(rowResults.map((r) => [r.key, r.items])),
          );
        }

        const recSource = heroItems[0] ?? today[0];
        if (recSource && !cancelled) {
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

  const progressMap = useMemo(
    () =>
      Object.fromEntries(
        continueWatching.map((c) => [
          c.media.id,
          (c.progress / Math.max(c.duration, 1)) * 100,
        ]),
      ),
    [continueWatching]
  );

  return (
    <>
      <Seo />
      <HeroCarousel items={hero} loading={loading} />
      <GenreBar />
      <WatchProvidersRow />

      <div className="max-w-[1280px] mx-auto">
        {continueWatching.length > 0 && (
          <MediaRow
            label="Your queue"
            title="Continue Watching"
            items={continueWatching.map((c) => c.media)}
            progressMap={progressMap}
          />
        )}

        <MediaRow
          label="🔥 Trending"
          title="Trending Today"
          items={trendingToday}
          loading={loading}
          viewAllHref="/search?q=trending"
        />

        <Top10Row items={topWeek} loading={loading} />

        {HOME_CONTENT_ROWS.map((row) => (
          <MediaRow
            key={row.title}
            label={row.emoji}
            title={row.title}
            items={genreRows[row.title] ?? []}
            loading={loading}
            viewAllHref={`/search?genre=${encodeURIComponent(row.genre || row.title)}`}
          />
        ))}

        <MediaRow
          label="New"
          title="Latest Releases"
          items={newReleases}
          loading={loading}
          viewAllHref="/search?type=movie"
        />

        <MediaRow
          label="For you"
          title="You May Like"
          items={recommendations}
          loading={loading}
        />
      </div>
    </>
  );
}
