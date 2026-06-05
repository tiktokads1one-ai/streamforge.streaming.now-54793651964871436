import { formatRating } from '@/utils/format';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingBadge({
  rating,
  size = 'md',
  className = '',
}: RatingBadgeProps) {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-800 font-semibold ${sizes[size]} ${className}`}
      title={`Rating ${formatRating(rating)}`}
    >
      <span>★</span>
      {formatRating(rating)}
    </span>
  );
}
