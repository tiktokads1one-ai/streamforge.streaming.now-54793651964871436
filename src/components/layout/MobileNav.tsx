import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/favorites', label: 'Favorites', icon: '❤️' },
  { to: '/history', label: 'History', icon: '⏰' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-500/20 bg-black/98 px-2 py-3 backdrop-blur-xl md:hidden">
      <ul className="flex justify-around">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-[11px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-purple-800 to-purple-600 shadow-glow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <span className="text-2xl leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
