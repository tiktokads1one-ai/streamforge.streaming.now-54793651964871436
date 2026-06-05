interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] ${className}`}
      aria-hidden
    />
  );
}

export function PosterSkeleton() {
  return <Skeleton className="aspect-[2/3] w-full" />;
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-6 sm:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-56 w-40 shrink-0 sm:h-64 sm:w-44" />
      ))}
    </div>
  );
}
