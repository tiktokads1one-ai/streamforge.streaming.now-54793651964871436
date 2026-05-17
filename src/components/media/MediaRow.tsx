import { useRef } from 'react';
import { motion } from 'framer-motion';
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

  if (loading) {
    return (
      <section className="mb-12">
        <SectionHeader label={label} title={title} />
        <RowSkeleton />
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="mb-12">
      <SectionHeader
        label={label}
        title={title}
        href={viewAllHref}
        linkLabel="View all"
      />
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide sm:gap-4 sm:px-6 lg:px-8"
      >
        {items.map((item) => (
          <MediaCard
            key={`${item.mediaType}-${item.id}`}
            item={item}
            showProgress={progressMap?.[item.id]}
          />
        ))}
      </motion.div>
    </section>
  );
}
