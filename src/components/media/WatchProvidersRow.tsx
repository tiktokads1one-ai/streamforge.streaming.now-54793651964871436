import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FEATURED_PROVIDERS,
  providerPagePath,
} from '@/config/providers';
import {
  fetchWatchProvidersList,
  watchProviderLogo,
} from '@/services/watchProviders';
import type { WatchProvider } from '@/types/watchProvider';
import { Skeleton } from '@/components/ui/Skeleton';

const LOGO_SIZES = ['w500', 'w154', 'original'] as const;

function providerHref(provider: WatchProvider): string {
  const featured = FEATURED_PROVIDERS.find((p) => p.id === provider.id);
  if (featured) return providerPagePath(featured.slug);
  return `/search?watch=${provider.id}&providerName=${encodeURIComponent(provider.name)}`;
}

function ProviderTile({ provider }: { provider: WatchProvider }) {
  const bg = provider.brandColor ?? '#1a1a2e';
  const [sizeIndex, setSizeIndex] = useState(0);
  const [failed, setFailed] = useState(!provider.logoPath);

  if (!provider.logoPath || failed) {
    return (
      <Link
        to={providerHref(provider)}
        className="group flex w-[96px] shrink-0 flex-col items-center gap-2 sm:w-[100px]"
      >
        <span
          className="relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-2xl text-lg font-bold text-white/90 shadow-lg"
          style={{ backgroundColor: bg }}
        >
          {provider.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="line-clamp-2 max-w-[100px] text-center text-[10px] font-medium leading-tight text-white/50">
          {provider.name}
        </span>
      </Link>
    );
  }

  const logoSrc = watchProviderLogo(
    provider.logoPath,
    LOGO_SIZES[sizeIndex],
  );

  return (
    <Link
      to={providerHref(provider)}
      className="group flex w-[96px] shrink-0 flex-col items-center gap-2 sm:w-[100px]"
    >
      <span
        className="relative block h-[96px] w-[96px] overflow-hidden rounded-2xl shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-glow-sm"
        style={{
          backgroundColor: bg,
          boxShadow: `0 6px 20px ${bg}66`,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => {
            if (sizeIndex < LOGO_SIZES.length - 1) {
              setSizeIndex((i) => i + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      </span>
      <span className="line-clamp-2 max-w-[100px] text-center text-[10px] font-medium leading-tight text-white/50 transition group-hover:text-violet-200">
        {provider.name}
      </span>
    </Link>
  );
}

export function WatchProvidersRow() {
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchProvidersList().then((list) => {
      setProviders(list);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="mb-12 overflow-hidden px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-bold text-white">Providers</h2>
        <div className="flex gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-24 shrink-0 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!providers.length) return null;

  const loop = [...providers, ...providers];

  return (
    <section className="providers-marquee-section mb-12">
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Providers
          </h2>
          <Link
            to="/search"
            className="mt-1 inline-block text-sm font-semibold uppercase tracking-wide text-accent-bright hover:underline"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="providers-marquee group relative overflow-hidden py-1">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-surface-base to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-surface-base to-transparent" />

        <div className="providers-track flex w-max items-center gap-5 px-4 sm:gap-6 sm:px-6 lg:px-8">
          {loop.map((p, i) => (
            <ProviderTile key={`${p.id}-${i}`} provider={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
