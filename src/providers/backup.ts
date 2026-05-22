import type { Provider } from './Provider';
import { buildVidcoreUrl } from './vidcore';

export const backupProvider: Provider = {
  id: 'backup',
  name: 'AdRock',
  quality: 'Ultra',
  description: 'Fallback · backup server',
  icon: 'server',
  getPlaybackSource: (ctx) =>
    buildVidcoreUrl(ctx, { server: 'backup' }),
};
