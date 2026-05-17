import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  enabled?: boolean;
  rootMargin?: string;
  onLoadMore: () => void;
}

export function useInfiniteScroll({
  enabled = true,
  rootMargin = '200px',
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const stableLoadMore = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    onLoadMore();
    requestAnimationFrame(() => {
      loadingRef.current = false;
    });
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stableLoadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin, stableLoadMore]);

  return sentinelRef;
}
