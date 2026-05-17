interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${className}`}
      aria-hidden
    />
  );
}

export function PosterSkeleton() {
  return <Skeleton className="aspect-[2/3] w-full" />;
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden px-4 sm:px-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-44 w-28 shrink-0 sm:h-52 sm:w-36" />
      ))}
    </div>
  );
}
