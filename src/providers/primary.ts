import type { Provider } from './Provider';
import { buildVidcoreUrl } from './vidcore';

export const primaryProvider: Provider = {
  id: 'primary',
  name: 'Primary',
  quality: 'HD',
  description: 'Fast',
  getPlaybackSource: (ctx) =>
    buildVidcoreUrl(ctx, { server: 'primary' }),
};
