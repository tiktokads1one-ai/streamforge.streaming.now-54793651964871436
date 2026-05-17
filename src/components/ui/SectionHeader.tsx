import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  label?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  label,
  title,
  href,
  linkLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          {label && <p className="section-label mb-1">{label}</p>}
          <h2 className="section-title">{title}</h2>
        </div>
        {href && (
          <Link
            to={href}
            className="shrink-0 text-sm font-medium text-accent-bright/90 transition hover:text-accent-bright"
          >
            {linkLabel} →
          </Link>
        )}
      </div>
    </>
  );
}
