import { NavLink } from 'react-router-dom';
import {
  Compass,
  Timer,
  Clock3,
  BarChart3,
  BookMarked,
  SlidersHorizontal,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Overview', icon: Compass, end: true },
  { to: '/timer', label: 'Timer', icon: Timer, end: false },
  { to: '/history', label: 'Log', icon: Clock3, end: false },
  { to: '/analytics', label: 'Stats', icon: BarChart3, end: false },
  { to: '/subjects', label: 'Subjects', icon: BookMarked, end: false },
  { to: '/settings', label: 'Settings', icon: SlidersHorizontal, end: false },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-secondary/95 backdrop-blur-md border-t border-border md:hidden shadow-editorial-lg">
      <div className="flex items-center justify-around py-1.5 px-1 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center py-1.5 px-1.5 text-[10px] rounded-md flex-1 transition-all',
                isActive
                  ? 'text-forest font-semibold bg-forest-light'
                  : 'text-ink-muted hover:text-ink font-medium',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={['h-4 w-4 mb-0.5', isActive ? 'text-forest' : 'text-ink-muted'].join(' ')}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
