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
    <motion.div className="relative" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <motion.span 
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-purple-500"
        animate={{ scale: value ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.span>
      <motion.input
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
        className={`w-full bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all shadow-lg shadow-purple-500/10 ${
          size === 'lg' ? 'py-5 pl-14 text-xl sm:text-2xl' : 'pl-12'
        }`}
        autoComplete="off"
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
      {value && (
        <motion.button
          type="button"
          onClick={() => onChange('')}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-purple-100 hover:text-purple-700 transition-colors"
        >
          Clear
        </motion.button>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] z-[60] max-h-[min(480px,65vh)] overflow-y-auto rounded-2xl border border-purple-200/50 bg-white/95 backdrop-blur-xl p-2 shadow-2xl shadow-purple-500/20"
          >
            {suggestions.map((item, index) => (
              <motion.li
                key={`${item.mediaType}-${item.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectSuggestion(item)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 group"
                >
                  <div className="relative">
                    <img
                      src={posterImage(item.posterPath, 'w342')}
                      alt=""
                      className="h-[72px] w-[48px] shrink-0 rounded-lg object-cover shadow-md ring-1 ring-purple-200/50 group-hover:ring-purple-400 transition-all"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="flex items-center gap-1">
                        <span className="text-purple-500">★</span>
                        {formatRating(item.rating)}
                      </span>
                      <span className="text-gray-300">·</span>
                      {formatYear(item.releaseDate, item.year)}
                    </span>
                  </span>
                  <motion.span
                    className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: -5 }}
                    whileHover={{ x: 0 }}
                  >
                    →
                  </motion.span>
                </button>
              </motion.li>
            ))}
            <motion.li 
              className="border-t border-purple-100 px-3 py-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onSubmit}
                className="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all py-1"
              >
                See all results for &quot;{value}&quot;
              </button>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
