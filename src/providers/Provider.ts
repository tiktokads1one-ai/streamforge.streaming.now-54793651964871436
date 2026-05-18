import type { MediaType } from '@/types/media';

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
  getPlaybackSource: (
    ctx: ProviderContext
  ) => string;
}