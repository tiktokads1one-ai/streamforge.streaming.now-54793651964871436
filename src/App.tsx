import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageLoader } from '@/components/ui/PageLoader';
import { switchProvider } from '@/providers/providerManager';
import { useLibraryStore } from '@/store/useLibraryStore';

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const DetailsPage = lazy(() =>
  import('@/pages/DetailsPage').then((m) => ({ default: m.DetailsPage })),
);
const WatchPage = lazy(() =>
  import('@/pages/WatchPage').then((m) => ({ default: m.WatchPage })),
);
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
);
const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage })),
);

function ProviderBootstrap() {
  const preferred = useLibraryStore((s) => s.playback.preferredProviderId);
  useEffect(() => {
    switchProvider(preferred);
  }, [preferred]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProviderBootstrap />
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="search"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SearchPage />
                </Suspense>
              }
            />
            <Route
              path="details/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DetailsPage />
                </Suspense>
              }
            />
            <Route
              path="watch/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <WatchPage />
                </Suspense>
              }
            />
            <Route
              path="favorites"
              element={
                <Suspense fallback={<PageLoader />}>
                  <FavoritesPage />
                </Suspense>
              }
            />
            <Route
              path="history"
              element={
                <Suspense fallback={<PageLoader />}>
                  <HistoryPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
