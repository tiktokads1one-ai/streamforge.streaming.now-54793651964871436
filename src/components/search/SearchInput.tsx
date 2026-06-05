import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaItem } from '@/types/media';
import { posterImage } from '@/utils/images';
import { formatRating, formatYear } from '@/utils/format';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  suggestions: MediaItem[];
  showSuggestions: boolean;
  onSelectSuggestion: (item: MediaItem) => void;
  onFocusChange?: (focused: boolean) => void;
  autoFocus?: boolean;
  size?: 'md' | 'lg';
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  onFocusChange,
  autoFocus,
  size = 'md',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <motion.div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => setTimeout(() => onFocusChange?.(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onChange('');
        }}
        placeholder="Search movies, TV shows, anime…"
        className={`input-search ${size === 'lg' ? 'py-5 pl-14 text-xl sm:text-2xl' : ''}`}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs text-white/40 hover:bg-white/10 hover:text-white"
        >
          Clear
        </button>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[60] max-h-[min(480px,65vh)] overflow-y-auto rounded-2xl border border-purple-500/20 bg-surface-raised p-2 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            {suggestions.map((item) => (
              <li key={`${item.mediaType}-${item.id}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectSuggestion(item)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-accent-muted"
                >
                  <img
                    src={posterImage(item.posterPath, 'w342')}
                    alt=""
                    className="h-[72px] w-[48px] shrink-0 rounded-lg object-cover shadow-md ring-1 ring-purple-500/10"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-white">
                      {item.title}
                    </span>
                    <span className="text-xs text-white/45">
                      ★ {formatRating(item.rating)}
                      <span className="meta-dot" />
                      {formatYear(item.releaseDate, item.year)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            <li className="border-t border-white/5 px-3 py-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onSubmit}
                className="w-full text-center text-sm font-medium text-purple-300 hover:underline"
              >
                See all results for &quot;{value}&quot;
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
