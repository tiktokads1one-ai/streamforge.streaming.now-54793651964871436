export function HeroCarouselSkeleton() {
  return (
    <section className="relative mb-10 h-[80vh] min-h-[550px] w-full overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-surface-card animate-shimmer" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0F0F17] via-[#0F0F17]/60 to-transparent" aria-hidden />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0F0F17]/90 via-[#0F0F17]/30 to-transparent" aria-hidden />
      
      {/* Navigation buttons skeleton */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-white/10 animate-shimmer" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full bg-white/10 animate-shimmer" />
      
      {/* Content skeleton */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-16 pb-20">
        <div className="max-w-3xl space-y-4">
          <div className="h-8 w-32 bg-white/20 rounded-full animate-shimmer" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-white/20 rounded-full animate-shimmer" />
            <div className="h-8 w-24 bg-white/20 rounded-full animate-shimmer" />
          </div>
          <div className="h-16 w-3/4 bg-white/20 rounded-lg animate-shimmer" />
          <div className="h-4 w-1/2 bg-white/20 rounded animate-shimmer" />
          <div className="h-20 w-full bg-white/20 rounded-lg animate-shimmer" />
          <div className="flex gap-4 mt-10">
            <div className="h-14 w-40 bg-white/20 rounded-full animate-shimmer" />
            <div className="h-14 w-40 bg-white/20 rounded-full animate-shimmer" />
          </div>
        </div>
        
        {/* Pagination dots skeleton */}
        <div className="mt-14 flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-2 rounded-full animate-shimmer ${i === 1 ? 'w-20' : 'w-8'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
