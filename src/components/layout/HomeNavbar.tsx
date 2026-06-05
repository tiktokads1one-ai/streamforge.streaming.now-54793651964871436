import { Link } from 'react-router-dom';

export function HomeNavbar() {
  return (
    <header className="pt-8">
      <nav className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between bg-white rounded-3xl px-6 py-4 shadow-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2E8FF] flex items-center justify-center">
              <span className="text-xl font-black text-purple-700">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">StreamForge</span>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link to="/" className="text-gray-700 font-semibold hover:text-purple-700 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search?type=movie" className="text-gray-700 font-semibold hover:text-purple-700 transition-colors">
                Movies
              </Link>
            </li>
            <li>
              <Link to="/search?type=tv" className="text-gray-700 font-semibold hover:text-purple-700 transition-colors">
                TV Shows
              </Link>
            </li>
            <li>
              <Link to="/search?type=anime" className="text-gray-700 font-semibold hover:text-purple-700 transition-colors">
                Anime
              </Link>
            </li>
            <li>
              <Link to="/search?q=trending" className="text-gray-700 font-semibold hover:text-purple-700 transition-colors">
                Search
              </Link>
            </li>
          </ul>

          {/* Discord Link */}
          <a
            href="https://discord.gg/5K3zwXWpaV"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-700 transition-colors"
          >
            <svg viewBox="0 0 127.14 96.36" className="w-6 h-6">
              <g>
                <path
                  d="M107.7,8.91A107.3,107.3,0,0,0,82.14,0a1.3,1.3,0,0,0-1.17.61c-2.29,3.95-5.36,10.55-6.9,15.14a98.27,98.27,0,0,0-24.36,0C47.91,11.16,44.84,4.56,42.55.61A1.28,1.28,0,0,0,41.4,0a106.24,106.24,0,0,0-25.53,8.91A1.18,1.18,0,0,0,14.9,9.7c-8.45,12.47-12.5,26.3-10.65,47.93a1.36,1.36,0,0,0,.47,1.06,109.18,109.18,0,0,0,32.83,17.35,1.33,1.33,0,0,0,1.37-.29,77.92,77.92,0,0,0,6.3-10.34,1.25,1.25,0,0,0-.71-1.75,45.57,45.57,0,0,1-6.53-3.06,1.31,1.31,0,0,1-.18-2.25c.36-.27.75-.5,1.13-.75,13.32-6,27.82-6,41,0,.39.25.78.49,1.14.76a1.31,1.31,0,0,1-.18,2.24,44.74,44.74,0,0,1-6.52,3.06,1.26,1.26,0,0,0-.72,1.76,82.57,82.57,0,0,0,6.31,10.34,1.32,1.32,0,0,0,1.37.28,108.73,108.73,0,0,0,32.8-17.35,1.32,1.32,0,0,0,.47-1.05c1.86-21.63-2.19-35.46-10.63-47.93A1.17,1.17,0,0,0,107.7,8.91ZM42.79,59.62c-5.88,0-10.82-5.29-10.82-11.83,0-6.55,4.76-11.84,10.82-11.84,6.1,0,10.94,5.3,10.82,11.84C53.61,54.33,48.89,59.62,42.79,59.62Zm41.56,0c-5.88,0-10.82-5.29-10.82-11.83,0-6.55,4.76-11.84,10.82-11.84,6.1,0,10.94,5.3,10.82,11.84C95.25,54.33,90.53,59.62,84.35,59.62Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            Discord
          </a>
        </div>
      </nav>
    </header>
  );
}
