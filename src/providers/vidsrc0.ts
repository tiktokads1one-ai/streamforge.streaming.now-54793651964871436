import type { Provider, ProviderContext } from './Provider';

export const vidsrc0Provider: Provider = {
  id: 'vidsrc0',
  name: 'Vidsrc0',
  quality: 'HD',
  description: 'Mirror source',
  icon: 'cloud',
  getPlaybackSource: (ctx: ProviderContext): string => {
    const isTv = ctx.mediaType === 'tv' || ctx.mediaType === 'anime';
    if (isTv) {
      const season = ctx.season ?? 1;
      const episode = ctx.episode ?? 1;
      return `https://vidsrc.xyz/embed/tv?tmdb=${ctx.mediaId}&season=${season}&episode=${episode}`;
    }
    return `https://vidsrc.xyz/embed/movie?tmdb=${ctx.mediaId}`;
  },
};
