import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AutoNextOverlayProps {
  show: boolean;
  nextEpisode: number;
  nextSeason: number;
  mediaId: string;
  mediaType: string;
  onPlayNext: () => void;
  onCancel: () => void;
}

export function AutoNextOverlay({
  show,
  nextEpisode,
  nextSeason,
  mediaId,
  mediaType,
  onPlayNext,
  onCancel,
}: AutoNextOverlayProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!show) return;
    setCount(5);
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(tick);
          onPlayNext();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- countdown resets when overlay opens
  }, [show, nextEpisode, nextSeason]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-panel max-w-sm px-8 py-10 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-purple-300">
          Up next
        </p>
        <p className="mt-2 text-lg font-bold text-white">
          S{nextSeason} · E{nextEpisode}
        </p>
        <p
          className="mt-6 text-6xl font-black tabular-nums text-purple-400"
          aria-live="polite"
        >
          {count}
        </p>
        <p className="mt-2 text-sm text-white/50">Next episode starts in…</p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onPlayNext}
            className="rounded-full bg-gradient-to-r from-purple-800 to-purple-600 px-6 py-2.5 text-sm font-bold text-white"
          >
            Play now
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/70 hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
        <Link
          to={`/details/${mediaId}?type=${mediaType}`}
          className="mt-4 inline-block text-xs text-white/40 hover:text-purple-300"
        >
          Back to details
        </Link>
      </div>
    </div>
  );
}
