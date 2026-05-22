import type { WatchProvider } from '@/types/watchProvider';

export interface FeaturedProvider extends WatchProvider {
  slug: string;
  tagline: string;
}

export const FEATURED_PROVIDERS: FeaturedProvider[] = [
  {
    id: 8,
    slug: 'netflix',
    name: 'Netflix',
    logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
    brandColor: '#E50914',
    tagline: 'Netflix Originals & trending',
  },
  {
    id: 337,
    slug: 'disney-plus',
    name: 'Disney+',
    logoPath: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
    brandColor: '#1a1f7a',
    tagline: 'Disney, Marvel, Star Wars & more',
  },
  {
    id: 9,
    slug: 'prime',
    name: 'Prime Video',
    logoPath: '/pvske1MyAoymrs5bguRfVqYiM9a.jpg',
    brandColor: '#00A8E1',
    tagline: 'Movies & series on Prime',
  },
  {
    id: 15,
    slug: 'hulu',
    name: 'Hulu',
    logoPath: '/pqAZLzJlSCrBic8aR8j1lQBGqPu.png',
    brandColor: '#0f9d0f',
    tagline: 'TV hits & Hulu originals',
  },
  {
    id: 350,
    slug: 'apple-tv',
    name: 'Apple TV+',
    logoPath: '/4KAanCnnkWsXLno3sFw6wGz7UIK.png',
    brandColor: '#1c1c1e',
    tagline: 'Apple TV+ exclusives',
  },
  {
    id: 1899,
    slug: 'max',
    name: 'Max',
    logoPath: '/aS2zvJWm9Zgp4GSM9oMK7q8D3jJ.png',
    brandColor: '#03045e',
    tagline: 'HBO & Warner titles',
  },
  {
    id: 531,
    slug: 'paramount',
    name: 'Paramount+',
    logoPath: '/8V1yN1dLCrFSkL8qGahc6X2TlSH.png',
    brandColor: '#0064ff',
    tagline: 'Paramount movies & TV',
  },
  {
    id: 386,
    slug: 'peacock',
    name: 'Peacock',
    logoPath: '/zZjzEq0gNyO7Ng2SqpU8qQf0q77.png',
    brandColor: '#111',
    tagline: 'NBCUniversal streaming',
  },
];

export function getFeaturedProvider(slug: string): FeaturedProvider | undefined {
  return FEATURED_PROVIDERS.find(
    (p) => p.slug === slug || String(p.id) === slug,
  );
}

export function providerPagePath(slugOrId: string | number): string {
  const p = FEATURED_PROVIDERS.find(
    (x) => x.slug === slugOrId || x.id === Number(slugOrId),
  );
  return `/provider/${p?.slug ?? slugOrId}`;
}
