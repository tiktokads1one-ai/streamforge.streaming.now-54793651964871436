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
  linkLabel = "View All",
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 px-10 sm:px-14">
      <div>
        {label && <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-purple-700 mb-1">{label}</p>}
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">{title}</h2>
      </div>
      {href && (
        <Link
          to={href}
          className="shrink-0 text-sm font-semibold text-gray-700 hover:text-purple-700 transition-all duration-200 flex items-center gap-1"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
