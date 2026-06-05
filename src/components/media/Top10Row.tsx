import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RowSkeleton } from '@/components/ui/Skeleton';

interface Top10RowProps {
  items: MediaItem[];
  loading?: boolean;
}

export function Top10Row({ items, loading }: Top10RowProps) {
  const top10 = items.slice(0, 10);

  if (loading) {
    return (
      <section className="mb-12">
        <SectionHeader label="Charts" title="Top 10 This Week" />
        <RowSkeleton />
      </section>
    );
  }

  if (!top10.length) return null;

  return (
    <section className="mb-14">
      <SectionHeader
        label="Charts"
        title="Top 10 This Week"
        href="/search?q=trending"
        linkLabel="View all"
      />
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide sm:gap-3 sm:px-6 lg:px-8">
        {top10.map((item, index) => {
          const rank = index + 1;
          const href = `/details/${item.id}?type=${item.mediaType}`;
          return (
            <Link
              key={`${item.mediaType}-${item.id}`}
              to={href}
              className="group relative flex w-[128px] shrink-0 items-end sm:w-[148px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <span
                className="pointer-events-none absolute -left-1 bottom-6 z-0 select-none font-black leading-none tracking-tighter text-purple-400/20 transition group-hover:text-purple-300/25"
                style={{ fontSize: 'clamp(5rem, 12vw, 7.5rem)' }}
                aria-hidden
              >
                {rank}
              </span>
              <div className="relative z-10 ml-8 w-full transition duration-300 group-hover:scale-[1.04]">
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-poster ring-1 ring-purple-500/10">
                  <img
                    src={posterImage(item.posterPath)}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-white/85">
                  {item.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
