import type { Provider, ProviderContext } from './Provider';

export const videasyProvider: Provider = {
  id: 'videasy',
  name: 'VidUp',
  quality: '4K',
  description: 'Low latency stream',
  badge: 'FAST',
  icon: 'monitor',
  getPlaybackSource: (ctx: ProviderContext): string => {
    const isTv = ctx.mediaType === 'tv' || ctx.mediaType === 'anime';
    if (isTv) {
      const season = ctx.season ?? 1;
      const episode = ctx.episode ?? 1;
      return `https://player.videasy.net/tv/${ctx.mediaId}/${season}/${episode}`;
    }
    return `https://player.videasy.net/movie/${ctx.mediaId}`;
  },
};
