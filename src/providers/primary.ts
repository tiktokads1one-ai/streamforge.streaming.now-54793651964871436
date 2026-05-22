import type { Provider } from './Provider';
import { buildVidcoreUrl } from './vidcore';

export const primaryProvider: Provider = {
  id: 'primary',
  name: 'VidCore',
  quality: 'HD',
  description: 'Primary embed · vidcore.net',
  icon: 'server',
  getPlaybackSource: (ctx) =>
    buildVidcoreUrl(ctx, { server: 'primary' }),
};
