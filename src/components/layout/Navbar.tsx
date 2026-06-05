import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="pt-8">
      <nav className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between bg-white rounded-3xl px-6 py-4 shadow-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-deep to-purple flex items-center justify-center">
              <span className="text-xl font-black text-white">S</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link to="/" className="text-gray-700 font-semibold hover:text-purple-deep transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search?type=movie" className="text-gray-700 font-semibold hover:text-purple-deep transition-colors">
                Movies
              </Link>
            </li>
            <li>
              <Link to="/search?type=tv" className="text-gray-700 font-semibold hover:text-purple-deep transition-colors">
                TV Shows
              </Link>
            </li>
            <li>
              <Link to="/search?type=anime" className="text-gray-700 font-semibold hover:text-purple-deep transition-colors">
                Anime
              </Link>
            </li>
            <li>
              <Link to="/search?q=trending" className="text-gray-700 font-semibold hover:text-purple-deep transition-colors">
                Trending
              </Link>
            </li>
          </ul>

          {/* Right CTA Button */}
          <Link
            to="/search?type=movie"
            className="bg-gradient-to-r from-purple-deep to-purple text-white font-bold px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Start Streaming
          </Link>
        </div>
      </nav>
    </header>
  );
}