import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/favorites', label: 'Saved', icon: '★' },
  { to: '/history', label: 'History', icon: '◷' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-surface-base/95 px-2 py-2 backdrop-blur-xl md:hidden">
      <ul className="flex justify-around">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-medium transition ${
                  isActive
                    ? 'text-accent-bright'
                    : 'text-white/45 hover:text-white/70'
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
