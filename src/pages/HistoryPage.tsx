import { Link } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/Button';
import { useLibraryStore } from '@/store/useLibraryStore';
import { posterImage } from '@/utils/images';

export function HistoryPage() {
  const history = useLibraryStore((s) => s.history);
  const clearHistory = useLibraryStore((s) => s.clearHistory);

  return (
    <>
      <Seo title="Watch History" description="Recently watched on StreamForge." />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Watch History</h1>
          {history.length > 0 && (
            <Button variant="ghost" onClick={clearHistory}>
              Clear
            </Button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-white/50">Nothing watched yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li key={`${entry.media.id}-${entry.watchedAt}`}>
                <Link
                  to={`/details/${entry.media.id}?type=${entry.media.mediaType}`}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-accent/40"
                >
                  <img
                    src={posterImage(entry.media.posterPath)}
                    alt=""
                    className="h-16 w-11 rounded object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <p className="font-medium">{entry.media.title}</p>
                    <p className="text-xs text-white/50">
                      {new Date(entry.watchedAt).toLocaleString()}
                    </p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
