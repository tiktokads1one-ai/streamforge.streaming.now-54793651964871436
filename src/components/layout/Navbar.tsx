import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search', exact: true },
  { to: '/search?type=movie', label: 'Movies', typeParam: 'movie' },
  { to: '/search?type=tv', label: 'TV', typeParam: 'tv' },
  { to: '/favorites', label: 'Saved' },
];

export function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentType = new URLSearchParams(location.search).get('type');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  function isActive(item: (typeof nav)[number]): boolean {
    if (item.to === '/') return location.pathname === '/';
    if ('typeParam' in item && item.typeParam) {
      return location.pathname === '/search' && currentType === item.typeParam;
    }
    if ('exact' in item && item.exact) {
      return location.pathname === '/search' && !currentType;
    }
    return location.pathname.startsWith(item.to);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-base/90 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <span className="text-xl font-extrabold tracking-tight">
            STREAM<span className="text-accent-bright">FORGE</span>
          </span>
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden min-w-0 flex-1 max-w-xl md:block"
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              ⌕
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Quick search…"
              className="w-full rounded-full border border-white/10 bg-surface-raised py-2 pl-9 pr-4 text-sm outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
            />
          </div>
        </form>

        <motion.ul className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive(item)
                    ? 'bg-accent-muted text-accent-bright'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </motion.ul>

        <a
          href="https://discord.gg/ujBH8GjuaY"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/10 px-3.5 py-2 text-sm font-medium text-[#7289da] transition hover:bg-[#5865F2]/20 hover:text-white lg:flex"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
          Discord
        </a>

        <Link
          to="/search"
          className="rounded-full border border-white/10 px-3 py-2 text-sm md:hidden"
        >
          Search
        </Link>
      </nav>
    </header>
  );
}