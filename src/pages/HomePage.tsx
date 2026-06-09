import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 dark:bg-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/30 dark:bg-violet-600/20 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-500/20 dark:bg-fuchsia-600/15 rounded-full blur-[100px]"
        />
      </div>

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center pt-12 relative z-10"
      >
        <div className="inline-flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-lg shadow-purple-500/10 border border-purple-200/50 dark:border-purple-700/50">
          <motion.span
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md"
          >
            ✨ 100% FREE
          </motion.span>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Watch thousands of Movies, TV Shows & Anime completely free.
          </span>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-32 relative z-10">
        <div className="text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
          >
            <div className="text-gray-900 dark:text-white">Entertainment</div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
            >
              without limits.
            </motion.div>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            <p className="font-medium">Watch movies, anime, TV shows and more in one place.</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Built for speed, quality and endless content.</p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/search?type=movie"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 bg-[length:200%_auto] text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 animate-gradient"
            >
              <span className="text-xl">▶</span>
              <span className="text-lg">Start Watching</span>
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{
                  scale: [0, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{ duration: 0.6 }}
              />
            </Link>
            <Link
              to="/search"
              className="group inline-flex items-center gap-3 text-gray-700 dark:text-gray-300 font-semibold hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-300 px-6 py-4 rounded-full hover:bg-purple-50/50 dark:hover:bg-purple-900/30"
            >
              <span>Browse Library</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl"
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-purple-700 dark:text-purple-400">10K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Movies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-purple-700 dark:text-purple-400">5K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">TV Shows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-purple-700 dark:text-purple-400">3K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Anime</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
