import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdBlockerStore } from '@/store/useAdBlockerStore';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function HomeNavbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, signInWithGoogle } = useAuthStore();
  const { isAdBlockerActive, verifyCode, deactivateAdBlocker } = useAdBlockerStore();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [dropdownError, setDropdownError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > lastScrollY && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignIn = () => {
    signInWithGoogle();
    setIsDropdownOpen(false);
  };

  const discordPath = 'M107.7,8.91A107.3,107.3,0,0,0,82.14,0a1.3,1.3,0,0,0-1.17.61c-2.29,3.95-5.36,10.55-6.9,15.14a98.27,98.27,0,0,0-24.36,0C47.91,11.16,44.84,4.56,42.55.61A1.28,1.28,0,0,0,41.4,0a106.24,106.24,0,0,0-25.53,8.91A1.18,1.18,0,0,0,14.9,9.7c-8.45,12.47-12.5,26.3-10.65,47.93a1.36,1.36,0,0,0,.47,1.06,109.18,109.18,0,0,0,32.83,17.35,1.33,1.33,0,0,0,1.37-.29,77.92,77.92,0,0,0,6.3-10.34,1.25,1.25,0,0,0-.71-1.75,45.57,45.57,0,0,1-6.53-3.06,1.31,1.31,0,0,1-.18-2.25c.36-.27.75-.5,1.13-.75,13.32-6,27.82-6,41,0,.39.25.78.49,1.14.76a1.31,1.31,0,0,1-.18,2.24,44.74,44.74,0,0,1-6.52,3.06,1.26,1.26,0,0,0-.72,1.76,82.57,82.57,0,0,0,6.31,10.34,1.32,1.32,0,0,0,1.37.28,108.73,108.73,0,0,0,32.8-17.35,1.32,1.32,0,0,0,.47-1.05c1.86-21.63-2.19-35.46-10.63-47.93A1.17,1.17,0,0,0,107.7,8.91ZM42.79,59.62c-5.88,0-10.82-5.29-10.82-11.83,0-6.55,4.76-11.84,10.82-11.84,6.1,0,10.94,5.3,10.82,11.84C53.61,54.33,48.89,59.62,42.79,59.62Zm41.56,0c-5.88,0-10.82-5.29-10.82-11.83,0-6.55,4.76-11.84,10.82-11.84,6.1,0,10.94,5.3,10.82,11.84C95.25,54.33,90.53,59.62,84.35,59.62Z';

  const dropdown = (
    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{ position: 'fixed', right: '1rem', top: '5rem', zIndex: 9999 }}
          className="w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-200/50 dark:border-purple-700/50"
        >
          {!user && (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 cursor-pointer rounded-t-2xl"
            >
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold text-gray-900 dark:text-white">Sign In</span>
            </button>
          )}

          {!user && <div className="h-px bg-gray-200 dark:border-gray-700 border-t" />}

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <span className="font-semibold text-gray-900 dark:text-white">Block Ads</span>
              </div>
              <button
                onClick={() => {
                  if (!user) {
                    setDropdownError('Please sign in to use ad blocker');
                    return;
                  }
                  if (isAdBlockerActive) {
                    deactivateAdBlocker();
                  } else {
                    if (inviteCode.trim()) {
                      if (verifyCode(inviteCode)) {
                        setInviteCode('');
                        setDropdownError('');
                      } else {
                        setDropdownError('Invalid code');
                      }
                    } else {
                      setDropdownError('Please enter a code first');
                    }
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${isAdBlockerActive ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: isAdBlockerActive ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste Ad Code
              </label>
              <textarea
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Paste your ad code here..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-300 text-sm text-gray-900 dark:text-white resize-none"
              />
              <a href="https://discord.gg/5K3zwXWpaV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <svg viewBox="0 0 127.14 96.36" className="w-3 h-3" fill="currentColor">
                  <path d={discordPath} />
                </svg>
                Get code from Discord
              </a>
            </div>
          </div>

          {dropdownError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 pb-4 text-red-500 text-xs text-center"
            >
              {dropdownError}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className="pt-4">
      <nav className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: -100, opacity: 0 },
          }}
          animate={hidden ? 'hidden' : 'visible'}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg shadow-purple-500/10 border border-purple-100/50 dark:border-purple-700/50"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <span className="text-xl font-black text-white">S</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 dark:from-white to-gray-700 dark:to-gray-300 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-violet-600 transition-all duration-300">
              StreamForge
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/search?type=movie', label: 'Movies' },
              { to: '/search?type=tv', label: 'TV Shows' },
              { to: '/search?type=anime', label: 'Anime' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-semibold hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-900/30"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600"
            aria-label="Toggle menu"
          >
            <motion.div animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}>
              ☰
            </motion.div>
          </button>

          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-48 lg:w-64 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all duration-300 text-sm text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                🔍
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-purple-100/50 dark:bg-purple-900/50 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-purple-700 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-purple-700 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="w-10 h-10 rounded-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>

            {createPortal(dropdown, document.body)}

            <motion.a
              href="https://discord.gg/5K3zwXWpaV"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              <svg viewBox="0 0 127.14 96.36" className="w-5 h-5" fill="currentColor">
                <path d={discordPath} />
              </svg>
              <span>Join</span>
            </motion.a>
          </div>
        </motion.div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-purple-100/50"
          >
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/search?type=movie', label: 'Movies' },
                { to: '/search?type=tv', label: 'TV Shows' },
                { to: '/search?type=anime', label: 'Anime' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 font-semibold hover:text-purple-700 hover:bg-purple-50/50 rounded-xl transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSearch} className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm"
              />
            </form>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
