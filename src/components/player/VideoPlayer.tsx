import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { MediaItem } from '@/types/media';
import type { ProviderContext } from '@/providers/Provider';
import { getPlaybackSource } from '@/providers/providerManager';
import { useLibraryStore } from '@/store/useLibraryStore';
import { ServerSelector } from './ServerSelector';
import { EpisodeSelector } from './episodeselector';

interface VideoPlayerProps {
  media: MediaItem;
  startAt?: number;
  season?: number;
  episode?: number;
  onSeasonChange?: (season: number) => void;
  onEpisodeChange?: (episode: number) => void;
  hideEpisodeSelector?: boolean;
}

export function VideoPlayer({
  media,
  startAt,
  season: controlledSeason,
  episode: controlledEpisode,
  onSeasonChange,
  onEpisodeChange,
  hideEpisodeSelector,
}: VideoPlayerProps) {
  const playback = useLibraryStore((s) => s.playback);
  const [internalSeason, setInternalSeason] = useState(1);
  const [internalEpisode, setInternalEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [providerKey, setProviderKey] = useState(0);

  const season = controlledSeason ?? internalSeason;
  const episode = controlledEpisode ?? internalEpisode;

  const setSeason = (s: number) => {
    if (onSeasonChange) onSeasonChange(s);
    else setInternalSeason(s);
  };

  const setEpisode = (ep: number) => {
    if (onEpisodeChange) onEpisodeChange(ep);
    else setInternalEpisode(ep);
  };

  const isSeries =
    media.mediaType === 'tv' || media.mediaType === 'anime';

  const ctx: ProviderContext = useMemo(
    () => ({
      mediaId: String(media.id),
      mediaType: media.mediaType,
      season,
      episode,
      startAt,
      autoplay: playback.autoplay,
    }),
    [media.id, media.mediaType, season, episode, startAt, playback.autoplay],
  );

  const source = useMemo(
    () => getPlaybackSource(ctx),
    [ctx, providerKey],
  );

  const refreshPlayer = () => {
    setLoading(true);
    setError(false);
    setProviderKey((k) => k + 1);
  };

  return (
    <motion.section>
      <motion.div className="relative aspect-video overflow-hidden rounded-2xl border border-violet-500/25 bg-black shadow-[0_0_40px_rgba(99,102,241,0.15)] sm:rounded-3xl">
        <iframe
          key={`${media.id}-${season}-${episode}-${providerKey}-${source}`}
          src={source}
          id="streamforge-player"
          title={media.title}
          className="h-full w-full"
          allowFullScreen
          allow="fullscreen; autoplay; encrypted-media"
          referrerPolicy="origin"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-violet-300">
            <motion.div
              className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/95 px-6 text-center">
            <p className="font-medium text-red-400">Stream unavailable</p>
            <p className="text-sm text-white/50">Try another server below</p>
          </div>
        )}
      </motion.div>

      <ServerSelector onSwitch={refreshPlayer} />

      {isSeries && !hideEpisodeSelector && (
        <EpisodeSelector
          tmdbId={String(media.id)}
          currentSeason={season}
          currentEpisode={episode}
          onSeasonChange={(s) => {
            setSeason(s);
            setEpisode(1);
            refreshPlayer();
          }}
          onEpisodeSelect={(ep) => {
            setEpisode(ep);
            refreshPlayer();
          }}
        />
      )}
    </motion.section>
  );
}
