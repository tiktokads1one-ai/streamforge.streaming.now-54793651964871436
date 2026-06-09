import { motion } from 'framer-motion';

export function MediaCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative rounded-2xl overflow-hidden bg-surface-card"
    >
      {/* Poster skeleton */}
      <div className="aspect-[2/3] w-full bg-surface-hover animate-shimmer" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-4 w-3/4 bg-white/20 rounded animate-shimmer mb-2" />
          <div className="h-3 w-1/2 bg-white/20 rounded animate-shimmer" />
        </div>
      </div>
    </motion.div>
  );
}
