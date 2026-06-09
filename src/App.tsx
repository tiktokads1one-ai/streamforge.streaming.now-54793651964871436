import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageLoader } from '@/components/ui/PageLoader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { switchProvider } from '@/providers/providerManager';
import { useLibraryStore } from '@/store/useLibraryStore';
import { AnimatePresence, motion } from 'framer-motion';

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
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const GenrePage = lazy(() =>
  import('@/pages/GenrePage').then((m) => ({ default: m.GenrePage })),
);
const ProviderPage = lazy(() =>
  import('@/pages/ProviderPage').then((m) => ({ default: m.ProviderPage })),
);

function ProviderBootstrap() {
  const preferred = useLibraryStore((s) => s.playback.preferredProviderId);
  useEffect(() => {
    switchProvider(preferred);
  }, [preferred]);
  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProgressBar />
        <ProviderBootstrap />
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="search"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <SearchPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="provider/:slug"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <ProviderPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="details/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <DetailsPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="watch/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <WatchPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="favorites"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <FavoritesPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="history"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <HistoryPage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="genre/:genre"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <GenrePage />
                  </PageTransition>
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
