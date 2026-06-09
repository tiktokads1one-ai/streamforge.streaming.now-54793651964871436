import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/PageLoader';
import { MediaCard } from '@/components/media/MediaCard';
import { useState, useEffect } from 'react';
import type { MediaItem } from '@/types/media';

const GENRE_COLORS: Record<string, string> = {
  'Action': 'from-red-500 to-orange-500',
  'Comedy': 'from-yellow-400 to-amber-500',
  'Horror': 'from-gray-700 to-gray-900',
  'Sci-Fi': 'from-blue-500 to-cyan-500',
  'Romance': 'from-pink-500 to-rose-500',
  'Thriller': 'from-purple-500 to-violet-500',
  'Drama': 'from-indigo-500 to-blue-600',
  'Animation': 'from-green-400 to-emerald-500',
  'Adventure': 'from-orange-500 to-red-500',
  'Fantasy': 'from-purple-600 to-pink-500',
};

export function GenrePage() {
  const { genre } = useParams<{ genre: string }>();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for genre page
    const mockItems: MediaItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: `${genre}-${i}`,
      mediaType: 'movie',
      title: `${genre} Movie ${i + 1}`,
      posterPath: '',
      backdropPath: '',
      overview: '',
      rating: 7 + Math.random() * 2,
      releaseDate: '2024',
      year: 2024,
      genres: [genre || 'Action'],
      runtime: 120,
      cast: [],
    }));
    setItems(mockItems);
    setLoading(false);
  }, [genre]);

  if (loading) {
    return <PageLoader />;
  }

  const genreColor = GENRE_COLORS[genre || ''] || 'from-purple-500 to-violet-500';

  return (
    <>
      <Seo title={`${genre} - Browse by Genre`} description={`Browse ${genre} movies and TV shows.`} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">{genre}</h1>
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${genreColor} text-white font-semibold`}>
            Browse {genre}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {items.map((item) => (
            <MediaCard key={item.id} item={item} variant="grid" />
          ))}
        </motion.div>
      </div>
    </>
  );
}
