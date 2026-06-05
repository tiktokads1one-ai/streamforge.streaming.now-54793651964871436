import { useRef, useState, useEffect } from 'react';
import type { MediaItem } from '@/types/media';
import { MediaCard } from './MediaCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RowSkeleton } from '@/components/ui/Skeleton';

interface MediaRowProps {
  label?: string;
  title: string;
  items: MediaItem[];
  loading?: boolean;
  progressMap?: Record<string, number>;
  viewAllHref?: string;
}

export function MediaRow({
  label,
  title,
  items,
  loading,
  progressMap,
  viewAllHref,
}: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <section className="mb-14">
        <SectionHeader label={label} title={title} />
        <RowSkeleton />
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="mb-14 relative">
      <SectionHeader
        label={label}
        title={title}
        href={viewAllHref}
        linkLabel="View all"
      />
      
      {/* Left scroll button */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-24 w-14 bg-gradient-to-r from-gray-50 via-gray-50/85 to-transparent text-gray-900 text-3xl hover:from-gray-100 transition-all duration-200"
        >
          ‹
        </button>
      )}
      
      {/* Right scroll button */}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-24 w-14 bg-gradient-to-l from-gray-50 via-gray-50/85 to-transparent text-gray-900 text-3xl hover:from-gray-100 transition-all duration-200"
        >
          ›
        </button>
      )}
      
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 px-10 sm:px-14 scrollbar-hide"
      >
        {items.map((item) => (
          <MediaCard
            key={`${item.mediaType}-${item.id}`}
            item={item}
            showProgress={progressMap?.[item.id]}
          />
        ))}
      </div>
    </section>
  );
}
