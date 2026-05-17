import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function GlassCard({
  children,
  className = '',
  onClick,
  active,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`rounded-xl border bg-white/[0.04] backdrop-blur-md transition ${
        active
          ? 'border-forge-green shadow-glow'
          : 'border-white/10 hover:border-forge-green/40 hover:shadow-glow-sm'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
