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
  { to: '/timer', label: 'Study Timer', icon: Timer, end: false },
  { to: '/history', label: 'Session Log', icon: Clock3, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/subjects', label: 'Subjects', icon: BookMarked, end: false },
  { to: '/settings', label: 'Settings', icon: SlidersHorizontal, end: false },
];

export function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-surface-secondary border-r border-border text-ink">
      {/* Editorial Header / Wordmark */}
      <div className="px-6 py-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-forest text-white shadow-editorial">
            <span className="font-serif font-bold text-base leading-none">F</span>
          </div>
          <div>
            <span className="font-serif text-lg font-semibold text-ink tracking-tight block">FocusTrack</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-muted font-medium block">
              Study Journal
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-muted leading-relaxed italic font-serif">
          Understand your time. Improve your focus.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="px-3 pb-2 pt-1 text-[10px] font-semibold tracking-wider text-ink-faint uppercase">
          Navigation
        </div>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150',
                isActive
                  ? 'bg-forest-light text-forest font-semibold shadow-2xs border-l-2 border-forest pl-2.5'
                  : 'text-ink-muted hover:text-ink hover:bg-surface/60 font-medium',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={[
                    'h-4 w-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-forest' : 'text-ink-muted',
                  ].join(' ')}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Academic Attribution */}
      <div className="px-6 py-4 border-t border-border/80 bg-surface-secondary/70">
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span className="font-medium">FocusTrack v1.2</span>
          <span className="text-[10px] text-ink-muted/80 bg-surface px-1.5 py-0.5 rounded border border-border">
            TYCS
          </span>
        </div>
        <p className="text-[10px] text-ink-faint mt-1">
          Local Storage • Zero Backend
        </p>
      </div>
    </div>
  );
}
