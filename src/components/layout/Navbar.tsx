import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/search?type=movie', label: 'Movies', typeParam: 'movie' },
  { to: '/search?type=tv', label: 'TV', typeParam: 'tv' },
  { to: '/search?type=anime', label: 'Anime', typeParam: 'anime' },
  { to: '/favorites', label: 'Favorites' },
];

export function Navbar() {
  const [q, setQ] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentType = new URLSearchParams(location.search).get('type');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
    setSearchExpanded(false);
  };

  function isActive(item: (typeof nav)[number]): boolean {
    if (item.to === '/') return location.pathname === '/';
    if ('typeParam' in item && item.typeParam) {
      return location.pathname === '/search' && currentType === item.typeParam;
    }
    return location.pathname.startsWith(item.to);
  }

  return (
    <header className="sticky top-0 z-50 py-4 bg-surface-base/95 backdrop-blur-2xl border-b border-purple-500/10 shadow-xl">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-8">
        <Link to="/" className="shrink-0 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-deep to-purple flex items-center justify-center shadow-glow border border-purple-300/50">
            <span className="text-2xl font-black text-white">S</span>
          </div>
          <span className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            StreamForge
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-5 py-3 text-base font-semibold transition-all duration-200 rounded-xl ${
                  isActive(item)
                    ? 'text-purple-300 bg-purple-400/10'
                    : 'text-white/75 hover:text-white hover:bg-surface-card'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="https://discord.gg/5K3zwXWpaV"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-surface-card border border-purple-500/20 px-5 py-2.5 text-white flex items-center gap-2 hover:border-purple-400/50 hover:bg-surface-hover transition-all duration-300 font-semibold text-sm hidden sm:flex"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.0765.0765 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.0766.0766 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
            </svg>
            Discord
          </a>
          <div className="hidden sm:block">
            {searchExpanded ? (
              <form
                onSubmit={submitSearch}
                className="flex items-center gap-3 bg-surface-card rounded-full border border-purple-500/20 px-5 py-2.5 hover:border-purple-400/30 transition-all duration-300"
              >
                <span className="text-purple-400 text-lg">🔍</span>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search movies, TV, anime…"
                  className="bg-transparent text-white text-sm outline-none placeholder:text-zinc-500 min-w-[250px]"
                />
                <button
                  type="button"
                  onClick={() => setSearchExpanded(false)}
                  className="text-zinc-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchExpanded(true)}
                className="rounded-full bg-surface-card border border-purple-500/20 px-6 py-2.5 text-white flex items-center gap-2 hover:border-purple-400/50 transition-all duration-300 font-semibold text-sm"
              >
                🔍 Search
              </button>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}
