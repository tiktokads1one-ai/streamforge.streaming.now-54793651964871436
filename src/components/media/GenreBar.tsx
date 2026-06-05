import { Link } from 'react-router-dom';
import { EDITOR_GENRES } from '@/services/search';

export function GenreBar() {
  return (
    <section className="mb-10 px-6 sm:px-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-gradient-to-b from-purple-deep to-purple rounded-full" />
        <p className="section-label">Editor's Choices</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {EDITOR_GENRES.map((genre) => (
          <Link
            key={genre}
            to={`/search?genre=${encodeURIComponent(genre)}`}
            className="chip whitespace-nowrap transition-all duration-300 hover:border-purple-400 hover:bg-purple-400/20 hover:text-purple-300 hover:scale-105"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
