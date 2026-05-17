import type { ProviderContext } from './Provider';

const BASE = 'https://vidcore.net';

function normalizeId(mediaId: string): string {
  const trimmed = mediaId.trim();
  if (trimmed.startsWith('tt')) return trimmed;
  if (/^\d+$/.test(trimmed)) return trimmed;
  return trimmed;
}

interface VidcoreOptions {
  server?: string;
}

export function buildVidcoreUrl(
  ctx: ProviderContext,
  options: VidcoreOptions = {},
): string {
  const id = normalizeId(ctx.mediaId);
  const isTv = ctx.mediaType === 'tv' || ctx.mediaType === 'anime';
  const path = isTv ? 'tv' : 'movie';
  const url = new URL(`${BASE}/${path}/${id}`);

  url.searchParams.set('autoPlay', String(ctx.autoplay ?? true));
  url.searchParams.set('title', 'false');
  url.searchParams.set('poster', 'false');

  if (options.server) {
    url.searchParams.set('server', options.server);
  }

  if (ctx.startAt && ctx.startAt > 0) {
    url.searchParams.set('startAt', String(Math.floor(ctx.startAt)));
  }

  if (isTv && ctx.season != null && ctx.episode != null) {
    url.searchParams.set('season', String(ctx.season));
    url.searchParams.set('episode', String(ctx.episode));
  }

  return url.toString();
}
