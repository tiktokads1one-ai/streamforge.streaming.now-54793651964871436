import { Link } from 'react-router-dom';
import { EDITOR_GENRES } from '@/services/search';

export function GenreBar() {
  return (
    <section className="mb-10 px-0 sm:px-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-gradient-to-b from-purple-800 to-purple-500 rounded-full" />
        <p className="text-sm font-semibold text-gray-600">Editor's Choices</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {EDITOR_GENRES.map((genre) => (
          <Link
            key={genre}
            to={`/search?genre=${encodeURIComponent(genre)}`}
            className="px-4 py-2 rounded-full bg-white text-gray-700 border border-gray-200 whitespace-nowrap transition-all duration-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 hover:scale-105"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
