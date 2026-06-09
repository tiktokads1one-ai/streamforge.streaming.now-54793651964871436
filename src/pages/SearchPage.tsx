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
  { name: 'Action', color: 'from-red-500 to-orange-500' },
  { name: 'Comedy', color: 'from-yellow-400 to-amber-500' },
  { name: 'Horror', color: 'from-gray-700 to-gray-900' },
  { name: 'Sci-Fi', color: 'from-blue-500 to-cyan-500' },
  { name: 'Romance', color: 'from-pink-500 to-rose-500' },
  { name: 'Thriller', color: 'from-purple-500 to-violet-500' },
];

const YEAR_CHIPS = ['2025', '2024', '2023', '2022'];

const RATING_CHIPS = [
  { value: 0, label: 'Any' },
  { value: 8, label: '8+ HD' },
];

const LANGUAGE_CHIPS = [
  { value: '', label: 'All' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Watched' },
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'A-Z' },
  { value: 'rating', label: 'Top Rated' },
];

const TRENDING_SEARCHES = [
  'Dune: Part Two',
  'Oppenheimer',
  'Stranger Things',
  'Attack on Titan',
  'The Bear',
  'Jujutsu Kaisen',
  'Barbie',
  'House of the Dragon',
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
    language: params.get('language') ?? '',
    sortBy: params.get('sort') ?? 'popularity',
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

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8 isolate">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {filters.type === 'all' ? 'Search' : TYPE_TITLES[filters.type] || 'Browse'}
        </h1>
        
        {filters.type === 'all' && (
          <>
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

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {GENRE_FILTER_CHIPS.map((genre) => (
                <button
                  key={genre.name}
                  type="button"
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      genre: f.genre === genre.name ? '' : genre.name,
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filters.genre === genre.name
                      ? `bg-gradient-to-r ${genre.color} text-white`
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, type: tab.id }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filters.type === tab.id
                  ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filters.type === 'all' && (
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
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filters.year === year
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
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
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filters.minRating === chip.value
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {chip.label}
              </button>
            ))}
            {LANGUAGE_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() =>
                  setFilters((f) => ({ ...f, language: chip.value }))
                }
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filters.language === chip.value
                    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {chip.label}
              </button>
            ))}
            <div className="ml-2 flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-purple-300 transition-all"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {(filters.genre || filters.year || filters.minRating > 0 || filters.language) && (
              <button
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    genre: '',
                    year: '',
                    minRating: 0,
                    language: '',
                    sortBy: 'popularity',
                  }))
                }
                className="text-xs text-purple-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* No filter active — discovery UI */}
        {!isFiltered && (
          <>
            {recent.length > 0 && (
              <section className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-600">Recent searches</h2>
                  <button
                    type="button"
                    onClick={() => { clearRecentSearches(); setRecent([]); }}
                    className="text-xs text-gray-400 hover:text-purple-600"
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
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Trending searches</h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            <GenreBar />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular right now</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {TYPE_TITLES[filters.type] ?? 'Browse'}
            </h2>
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
              <p className="mb-1 text-sm text-gray-500">{resultTitle}</p>
            )}
            {loading ? (
              <PageLoader />
            ) : results.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl py-16 text-center shadow-sm">
                <p className="text-lg font-semibold text-gray-900">No results found</p>
                <p className="mt-2 text-sm text-gray-500">
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
              <p className="py-6 text-center text-sm text-gray-400">Loading more…</p>
            )}
            <div ref={sentinelRef} className="h-10 shrink-0" />
          </section>
        )}
      </main>
    </>
  );
}