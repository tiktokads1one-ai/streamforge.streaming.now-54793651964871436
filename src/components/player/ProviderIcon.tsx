import type { ProviderIcon as IconType } from '@/providers/Provider';

interface Props {
  type: IconType;
  className?: string;
}

export function ProviderIcon({ type, className = 'h-5 w-5' }: Props) {
  const cls = `${className} text-current`;

  if (type === 'monitor') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 20h8M12 18v2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'cloud') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M7 18h11a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6-1.8A4.5 4.5 0 0 0 7 18z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'layers') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
    </svg>
  );
}
