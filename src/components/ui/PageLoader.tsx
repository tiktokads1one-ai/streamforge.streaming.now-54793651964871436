import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-purple-200 border-t-purple-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  );
}
