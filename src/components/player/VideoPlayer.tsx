import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/types/media';
import type { ProviderContext } from '@/providers/Provider';
import {
  getActiveProvider,
  getPlaybackSource,
  tryFallbackProvider,
} from '@/providers/providerManager';
import { useLibraryStore } from '@/store/useLibraryStore';
import { ServerSelector } from './ServerSelector';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface VideoPlayerProps {
  media: MediaItem;
  startAt?: number;
}

export function VideoPlayer({ media, startAt }: VideoPlayerProps) {
  const playback = useLibraryStore((s) => s.playback);
  const updateContinue = useLibraryStore((s) => s.updateContinueWatching);
  const addHistory = useLibraryStore((s) => s.addHistory);
  const [sourceKey, setSourceKey] = useState(0);
  const [error, setError] = useState(false);

  const ctx: ProviderContext = useMemo(
    () => ({
      mediaId: media.imdbId ?? media.id,
      mediaType: media.mediaType,
      startAt,
      autoplay: playback.autoplay,
    }),
    [media, startAt, playback.autoplay],
  );

  const source = useMemo(
    () => getPlaybackSource(ctx),
    [ctx, sourceKey],
  );

  useEffect(() => {
    addHistory(media, startAt ?? 0);
    updateContinue(media, startAt ?? 0, 100);
  }, [media.id]);

  const refreshSource = useCallback(() => {
    setSourceKey((k) => k + 1);
    setError(false);
  }, []);

  const handleFallback = useCallback(() => {
    const current = getActiveProvider().id;
    const next = tryFallbackProvider(current);
    if (next) refreshSource();
  }, [refreshSource]);

  useKeyboardShortcuts({
    f: () => {
      const iframe = document.querySelector<HTMLIFrameElement>('#streamforge-player');
      iframe?.requestFullscreen?.();
    },
    r: refreshSource,
    b: handleFallback,
  });

  return (
    <motion.section className="w-full">
      <motion.div className="relative aspect-video w-full overflow-hidden rounded-xl border border-forge-green/20 bg-black shadow-glow">
        {!error ? (
          <iframe
            id="streamforge-player"
            key={source}
            src={source}
            title={media.title}
            className="h-full w-full"
            allowFullScreen
            allow="encrypted-media; autoplay; fullscreen"
            onError={() => setError(true)}
          />
        ) : (
          <motion.div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-forge-glow">Stream unavailable on this server.</p>
            <button
              type="button"
              onClick={handleFallback}
              className="rounded-full border border-forge-green/50 px-4 py-2 text-sm hover:bg-forge-green/10"
            >
              Try backup server
            </button>
          </motion.div>
        )}
      </motion.div>
      <ServerSelector onSwitch={refreshSource} />
    </motion.section>
  );
}
