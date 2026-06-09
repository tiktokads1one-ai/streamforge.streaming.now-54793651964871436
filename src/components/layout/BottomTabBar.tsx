import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BottomTabBar() {
  const location = useLocation();

  const tabs = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/search', label: 'Search', icon: '🔍' },
    { to: '/favorites', label: 'Saved', icon: '❤️' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
    >
      <div className="flex items-center justify-around py-3 px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || (tab.to !== '/' && location.pathname.startsWith(tab.to));
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`text-2xl ${isActive ? 'scale-110' : 'scale-100'}`}
              >
                {tab.icon}
              </motion.div>
              <span
                className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-8 h-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
