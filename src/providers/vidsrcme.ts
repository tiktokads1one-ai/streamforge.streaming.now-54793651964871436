import type { Provider, ProviderContext } from './Provider';

export const vidsrcMeProvider: Provider = {
  id: 'vidsrcme',
  name: 'VidSrc Pro',
  quality: 'HD+',
  description: 'Best for older titles',
  getPlaybackSource: (ctx: ProviderContext): string => {
    const isTv = ctx.mediaType === 'tv' || ctx.mediaType === 'anime';
    // vidsrc.me uses tmdb ids directly
    const base = 'https://vidsrc.me/embed';
    const path = isTv ? 'tv' : 'movie';
    const url = new URL(`${base}/${path}?tmdb=${ctx.mediaId}`);
    if (isTv && ctx.season != null && ctx.episode != null) {
      url.searchParams.set('season', String(ctx.season));
      url.searchParams.set('episode', String(ctx.episode));
    }
    return url.toString();
  },
};