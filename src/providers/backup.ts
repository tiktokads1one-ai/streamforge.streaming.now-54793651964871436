import type { Provider } from './Provider';
import { buildVidcoreUrl } from './vidcore';

export const backupProvider: Provider = {
  id: 'backup',
  name: 'Backup',
  quality: 'Ultra',
  description: 'Fallback stream',
  getPlaybackSource: (ctx) =>
    buildVidcoreUrl(ctx, { server: 'backup' }),
};
