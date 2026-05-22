import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/PageLoader';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResultCard } from '@/components/media/SearchResultCard';
import { MediaCard } from '@/components/media/MediaCard';
import { GenreBar } from '@/components/media/GenreBar';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  fetchSearchSuggestions,
  searchMediaPaginated,
  TRENDING_QUERIES,
} from '@/services/search';
import {
  fetchAnime,
  fetchPopularMovies,
  fetchPopularTv,
  fetchTopRated,
  fetchTrending,
} from '@/services/media';
import type { MediaItem, SearchFilters } from '@/types/media';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from '@/utils/searchHistory';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fetchMoviesByWatchProvider } from '@/services/watchProviders';

const TYPE_TABS: { id: SearchFilters['type']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
  { id: 'anime', label: 'Anime' },
];

const GENRE_FILTER_CHIPS = [
  'Action',
  'Comedy',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Thriller',
];

const YEAR_CHIPS = ['2025', '2024', '2023', '2022'];

const RATING_CHIPS = [
  { value: 0, label: 'Any' },
  { value: 8, label: '8+ HD' },
];

const TYPE_TITLES: Record<string, string> = {
  movie: 'Popular Movies',
  tv: 'Popular TV Shows',
  anime: 'Popular Anime',
  all: 'Popular right now',
};

function parseFilters(params: URLSearchParams): SearchFilters {
  return {
    type: (params.get('type') as SearchFilters['type']) || 'all',
    genre: params.get('genre') ?? '',
    year: params.get('year') ?? '',
    minRating: Number(params.get('rating') ?? 0),
  };
}

function deduped(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<SearchFilters>(() =>
    parseFilters(searchParams),
  );
  const [results, setResults] = useState<MediaItem[]>([]);
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [browse, setBrowse] = useState<MediaItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [recent, setRecent] = useState(getRecentSearches);
  const [focused, setFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 350);
  const hasQuery = debouncedQuery.trim().length > 0;
  const hasDiscoverFilters =
    !hasQuery &&
    (Boolean(filters.genre) ||
      Boolean(filters.year) ||
      filters.minRating > 0);
  const hasGenreBrowse = hasDiscoverFilters;
  const hasTypeBrowse =
    !hasQuery && !hasDiscoverFilters && filters.type !== 'all';
  const watchProviderId = searchParams.get('watch');
  const watchProviderName = searchParams.get('providerName') ?? 'Provider';
  const hasWatchBrowse = !hasQuery && Boolean(watchProviderId);
  const isFiltered =
    hasQuery || hasGenreBrowse || hasTypeBrowse || hasWatchBrowse;

  const syncUrl = useCallback(
    (q: string, f: SearchFilters) => {
      const next = new URLSearchParams();
      if (q.trim()) next.set('q', q.trim());
      else {
        const watch = searchParams.get('watch');
        const providerName = searchParams.get('providerName');
        if (watch) {
          next.set('watch', watch);
          if (providerName) next.set('providerName', providerName);
        }
      }
      if (f.type !== 'all') next.set('type', f.type);
      if (f.genre) next.set('genre', f.genre);
      if (f.year) next.set('year', f.year);
      if (f.minRating > 0) next.set('rating', String(f.minRating));
      setSearchParams(next, { replace: true });
    },
    [setSearchParams, searchParams],
  );

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
    setFilters(parseFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }
    fetchSearchSuggestions(debouncedQuery).then(setSuggestions);
  }, [debouncedQuery]);

  // Search / paginated results
  useEffect(() => {
    let cancelled = false;

    async function load(pageNum: number, append: boolean) {
      if (!hasQuery && !hasGenreBrowse && !hasTypeBrowse && !hasWatchBrowse) {
        setResults([]);
        setTotalPages(0);
        setTotalResults(0);
        return;
      }

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        if (hasWatchBrowse && watchProviderId) {
          const items = await fetchMoviesByWatchProvider(
            Number(watchProviderId),
            pageNum,
          );
          if (cancelled) return;
          setResults((prev) => (append ? [...prev, ...items] : items));
          setPage(pageNum);
          setTotalPages(pageNum < 5 ? pageNum + 1 : pageNum);
          setTotalResults((prev) =>
            append ? prev + items.length : items.length,
          );
          return;
        }

        const data = await searchMediaPaginated(
          debouncedQuery,
          filters,
          pageNum,
        );
        if (cancelled) return;
        setResults((prev) =>
          append ? [...prev, ...data.results] : data.results,
        );
        setPage(data.page);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
        if (debouncedQuery.trim() && pageNum === 1) {
          addRecentSearch(debouncedQuery);
          setRecent(getRecentSearches());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    syncUrl(debouncedQuery, filters);
    load(1, false);

    return () => {
      cancelled = true;
    };
  }, [
    debouncedQuery,
    filters,
    hasQuery,
    hasGenreBrowse,
    hasTypeBrowse,
    hasWatchBrowse,
    watchProviderId,
    syncUrl,
  ]);

  // Browse content — loads multiple pages for a full grid
  useEffect(() => {
    if (hasQuery || hasGenreBrowse || hasWatchBrowse) return;

    setBrowseLoading(true);

    async function loadBrowse() {
      try {
        if (filters.type === 'movie') {
          const [p1, p2, p3, rated] = await Promise.all([
            fetchPopularMovies(1),
            fetchPopularMovies(2),
            fetchPopularMovies(3),
            fetchTopRated('movie', 1),
          ]);
          setBrowse(deduped([...p1, ...p2, ...p3, ...rated]));
        } else if (filters.type === 'tv') {
          const [p1, p2, p3, rated] = await Promise.all([
            fetchPopularTv(1),
            fetchPopularTv(2),
            fetchPopularTv(3),
            fetchTopRated('tv', 1),
          ]);
          setBrowse(deduped([...p1, ...p2, ...p3, ...rated]));
        } else if (filters.type === 'anime') {
          const [p1, p2, p3] = await Promise.all([
            fetchAnime(1),
            fetchAnime(2),
            fetchAnime(3),
          ]);
          setBrowse(deduped([...p1, ...p2, ...p3]));
        } else {
          const [t1, t2, m1, m2, tv1, tv2] = await Promise.all([
            fetchTrending('movie', 1),
            fetchTrending('movie', 2),
            fetchPopularMovies(1),
            fetchPopularMovies(2),
            fetchPopularTv(1),
            fetchPopularTv(2),
          ]);
          setBrowse(deduped([...t1, ...t2, ...m1, ...m2, ...tv1, ...tv2]));
        }
      } finally {
        setBrowseLoading(false);
      }
    }

    loadBrowse();
  }, [hasQuery, hasGenreBrowse, hasWatchBrowse, filters.type]);

  const loadMore = useCallback(() => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    if (hasWatchBrowse && watchProviderId) {
      fetchMoviesByWatchProvider(Number(watchProviderId), nextPage).then(
        (items) => {
          setResults((prev) => [...prev, ...items]);
          setPage(nextPage);
          setLoadingMore(false);
        },
      );
      return;
    }

    searchMediaPaginated(debouncedQuery, filters, nextPage).then((data) => {
      setResults((prev) => [...prev, ...data.results]);
      setPage(data.page);
      setLoadingMore(false);
    });
  }, [
    loadingMore,
    page,
    totalPages,
    debouncedQuery,
    filters,
    hasWatchBrowse,
    watchProviderId,
  ]);

  const showSuggestions = focused && hasQuery && suggestions.length > 0;
  /** Avoid results rendering under the open suggestions dropdown */
  const showResultList = isFiltered && !showSuggestions;

  const sentinelRef = useInfiniteScroll({
    enabled: showResultList && page < totalPages,
    onLoadMore: loadMore,
  });

  const resultTitle = useMemo(() => {
    if (hasQuery) return `${totalResults} results for "${debouncedQuery}"`;
    if (hasGenreBrowse) return `Top ${filters.genre} titles`;
    if (hasTypeBrowse) return TYPE_TITLES[filters.type] ?? 'Browse';
    if (hasWatchBrowse) return `Movies on ${watchProviderName}`;
    return '';
  }, [
    hasQuery,
    hasGenreBrowse,
    hasTypeBrowse,
    hasWatchBrowse,
    watchProviderName,
    totalResults,
    debouncedQuery,
    filters.genre,
    filters.type,
  ]);

  const commitSearch = () => {
    setFocused(false);
    syncUrl(query, filters);
  };

  return (
    <>
      <Seo title="Search" description="Find movies, TV shows and anime on StreamForge." />

      <header className="sticky top-[57px] z-40 border-b border-white/[0.06] bg-surface-base/95 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8 isolate">
        <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Search
        </h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={commitSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onFocusChange={setFocused}
          onSelectSuggestion={(item) => {
            addRecentSearch(item.title);
            setRecent(getRecentSearches());
            setFocused(false);
            navigate(`/details/${item.id}?type=${item.mediaType}`);
          }}
          autoFocus
          size="lg"
        />

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, type: tab.id }))}
              className={`chip ${filters.type === tab.id ? 'chip-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {GENRE_FILTER_CHIPS.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  genre: f.genre === genre ? '' : genre,
                }))
              }
              className={`chip text-xs ${filters.genre === genre ? 'chip-active' : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {YEAR_CHIPS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  year: f.year === year ? '' : year,
                }))
              }
              className={`chip text-xs ${filters.year === year ? 'chip-active' : ''}`}
            >
              {year}
            </button>
          ))}
          {RATING_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() =>
                setFilters((f) => ({ ...f, minRating: chip.value }))
              }
              className={`chip text-xs ${filters.minRating === chip.value ? 'chip-active' : ''}`}
            >
              {chip.label}
            </button>
          ))}
          {(filters.genre || filters.year || filters.minRating > 0) && (
            <button
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  genre: '',
                  year: '',
                  minRating: 0,
                }))
              }
              className="text-xs text-accent-bright hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* No filter active — discovery UI */}
        {!isFiltered && (
          <>
            {recent.length > 0 && (
              <section className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white/70">Recent searches</h2>
                  <button
                    type="button"
                    onClick={() => { clearRecentSearches(); setRecent([]); }}
                    className="text-xs text-white/40 hover:text-accent-bright"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="chip text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="section-label mb-3">Trending searches</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_QUERIES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="chip hover:border-accent/40 hover:text-accent-bright"
                  >
                    🔥 {term}
                  </button>
                ))}
              </div>
            </section>

            <GenreBar />

            <section>
              <SectionHeader label="Discover" title="Popular right now" />
              {browseLoading ? (
                <PageLoader />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                >
                  {browse.map((item) => (
                    <MediaCard
                      key={`${item.mediaType}-${item.id}`}
                      item={item}
                      variant="grid"
                    />
                  ))}
                </motion.div>
              )}
            </section>
          </>
        )}

        {/* Type browse — Movies / TV / Anime tab, no query */}
        {hasTypeBrowse && (
          <section>
            <SectionHeader
              label="Browse"
              title={TYPE_TITLES[filters.type] ?? 'Browse'}
            />
            {browseLoading ? (
              <PageLoader />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                {browse.map((item) => (
                  <MediaCard
                    key={`${item.mediaType}-${item.id}`}
                    item={item}
                    variant="grid"
                  />
                ))}
              </motion.div>
            )}
          </section>
        )}

        {/* Search results or genre browse — hidden while suggestion dropdown is open */}
        {showResultList && (
          <section className="relative z-0 flex flex-col gap-3">
            {resultTitle && (
              <p className="mb-1 text-sm text-white/50">{resultTitle}</p>
            )}
            {loading ? (
              <PageLoader />
            ) : results.length === 0 ? (
              <div className="glass-panel py-16 text-center">
                <p className="text-lg font-semibold text-white">No results found</p>
                <p className="mt-2 text-sm text-white/50">
                  Try a different title, loosen filters, or browse genres below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((item) => (
                  <SearchResultCard
                    key={`${item.mediaType}-${item.id}`}
                    item={item}
                  />
                ))}
              </div>
            )}
            {loadingMore && (
              <p className="py-6 text-center text-sm text-white/40">Loading more…</p>
            )}
            <div ref={sentinelRef} className="h-10 shrink-0" />
          </section>
        )}
      </main>
    </>
  );
}