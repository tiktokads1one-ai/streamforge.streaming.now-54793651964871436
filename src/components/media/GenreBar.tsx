import { Link } from 'react-router-dom';
import { EDITOR_GENRES } from '@/services/search';

export function GenreBar() {
  return (
    <section className="mb-8 px-4 sm:px-6 lg:px-8">
      <p className="section-label mb-3">Editor&apos;s choices</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {EDITOR_GENRES.map((genre) => (
          <Link
            key={genre}
            to={`/search?genre=${encodeURIComponent(genre)}`}
            className="chip whitespace-nowrap hover:border-accent/40 hover:bg-accent-muted hover:text-accent-bright"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
