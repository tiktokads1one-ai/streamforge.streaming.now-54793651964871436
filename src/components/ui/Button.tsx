import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-forge-green to-emerald-400 text-black font-semibold shadow-glow hover:brightness-110',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    outline:
      'border border-forge-green/50 text-forge-glow hover:bg-forge-green/10 shadow-glow-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
