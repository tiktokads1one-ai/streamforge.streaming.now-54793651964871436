import type {
  Provider,
  ProviderContext
} from './Provider';

export const videasyProvider: Provider = {
  id: 'videasy',

  name: 'Videasy',

  quality: '4K',

  description: 'Premium quality',

  getPlaybackSource: (
    ctx: ProviderContext
  ): string => {

    const isTv =
      ctx.mediaType === 'tv' ||
      ctx.mediaType === 'anime';

    if (isTv) {

      const season =
        ctx.season ?? 1;

      const episode =
        ctx.episode ?? 1;

      const t =
        Date.now();

      return `https://player.videasy.net/tv/${ctx.mediaId}?season=${season}&episode=${episode}&t=${t}`;
    }

    return `https://player.videasy.net/movie/${ctx.mediaId}?t=${Date.now()}`;
  },
};