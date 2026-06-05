import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Seo } from '@/components/ui/Seo';
import { MediaCard } from '@/components/media/MediaCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useLibraryStore } from '@/store/useLibraryStore';

export function FavoritesPage() {
  const favorites = useLibraryStore((s) => s.favorites);

  return (
    <>
      <Seo title="Saved" description="Your saved titles on StreamForge." />
      <motion.div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader label="Library" title="Saved titles" />
        {favorites.length === 0 ? (
          <motion.div className="bg-white border border-gray-200 rounded-2xl py-16 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900">No saved titles yet</p>
            <p className="mt-2 text-sm text-gray-600">
              Tap Save on any details page to build your list.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-purple-800 to-purple-600 px-6 py-2.5 text-sm font-bold text-white"
            >
              Browse catalog
            </Link>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {favorites.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                variant="grid"
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
