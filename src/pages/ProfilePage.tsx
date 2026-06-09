import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [watchHistory, setWatchHistory] = useState([
    { id: '1', title: 'Inception', posterPath: '/path/to/poster1.jpg', watchedAt: '2 hours ago', progress: 100 },
    { id: '2', title: 'Stranger Things', posterPath: '/path/to/poster2.jpg', watchedAt: 'Yesterday', progress: 65 },
    { id: '3', title: 'Attack on Titan', posterPath: '/path/to/poster3.jpg', watchedAt: '3 days ago', progress: 40 },
  ]);

  if (!user) {
    navigate('/');
    return null;
  }

  const deleteHistoryItem = (id: string) => {
    setWatchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.email}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
            </div>
            <motion.button
              onClick={signOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Watched</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">12</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">In List</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">48h</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Watch Time</div>
          </div>
        </motion.div>

        {/* Watch History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Watch History</h2>
          <div className="space-y-4">
            {watchHistory.map((item: { id: string; title: string; posterPath: string; watchedAt: string; progress: number }) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-16 h-24 rounded-lg bg-surface-card flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.watchedAt}</p>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-violet-600 h-2 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <motion.button
                  onClick={() => deleteHistoryItem(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  🗑️
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
