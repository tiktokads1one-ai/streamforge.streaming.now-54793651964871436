import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div
          className="absolute inset-0 h-16 w-16 rounded-full bg-purple-200/30 blur-xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-base font-medium text-gray-600"
      >
        Loading…
      </motion.p>
    </div>
  );
}
