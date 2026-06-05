import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-yellow-500/10 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white mb-3">
              PHARAON
            </h3>
            <p className="text-white/60 text-lg mb-2">
              Stream without the hassle
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              HD streaming, quick discovery, and a cleaner watch experience.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white/70 text-[15px] font-semibold uppercase tracking-widest mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search?type=movie" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/search?type=tv" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/search?type=anime" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Anime
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-white/70 text-[15px] font-semibold uppercase tracking-widest mb-4">
              TRUST & LEGAL
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  DMCA
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-yellow-300 transition text-lg">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white/70 text-[15px] font-semibold uppercase tracking-widest mb-4">
              COMMUNITY
            </h4>
            
            <a
              href="https://discord.gg/5K3zwXWpaV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-400/50 px-4 py-3 transition-all duration-200 mb-6"
            >
              <span className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
                💬
              </span>
              <span className="text-lg font-semibold text-yellow-300">
                Join Discord
              </span>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-yellow-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm">
            © {new Date().getFullYear()} Pharaon. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/35">
            <a href="#" className="hover:text-yellow-300 transition">Privacy</a>
            <a href="#" className="hover:text-yellow-300 transition">Terms</a>
            <a href="#" className="hover:text-yellow-300 transition">DMCA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
