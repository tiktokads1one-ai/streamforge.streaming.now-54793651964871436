import { useRef } from 'react';
import type { CastMember } from '@/types/media';
import { profileImage } from '@/utils/images';

interface CastCarouselProps {
  cast: CastMember[];
}

export function CastCarousel({ cast }: CastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!cast.length) return null;

  return (
    <section className="mb-12">
      <h2 className="section-label mb-4 px-4 sm:px-6 lg:px-8">Cast</h2>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:gap-5 sm:px-6 lg:px-8"
      >
        {cast.map((member) => (
          <figure
            key={member.id}
            className="w-[100px] shrink-0 sm:w-[110px]"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface-raised ring-1 ring-white/[0.06]">
              <img
                src={profileImage(member.profilePath)}
                alt={member.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {member.name}
              </p>
              {member.character && (
                <p className="line-clamp-1 text-xs text-white/45">
                  {member.character}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
