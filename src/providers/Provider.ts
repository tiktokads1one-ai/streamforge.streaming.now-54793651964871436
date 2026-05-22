import type { MediaType } from '@/types/media';

export type ProviderBadge = 'FAST' | 'HD' | 'ULTRA' | null;
export type ProviderIcon = 'monitor' | 'cloud' | 'server' | 'layers';

export interface ProviderContext {
  mediaId: string;
  mediaType: MediaType;
  season?: number;
  episode?: number;
  startAt?: number;
  autoplay?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  quality: string;
  description: string;
  badge?: ProviderBadge;
  icon: ProviderIcon;
  getPlaybackSource: (ctx: ProviderContext) => string;
}
