import { NavLink } from 'react-router-dom';
import { useLayout } from '@/context/LayoutContext';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from '@/components/ui/Logo';

const links = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/transactions', label: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { to: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/advisor', label: 'Advisor', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { to: '/support', label: 'Support', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

function SidebarContent() {
  const { theme, toggleTheme } = useTheme();
  const { setSidebarOpen } = useLayout();

  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200/80 dark:border-slate-700/80 p-3 sm:p-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <span className="text-lg">☀️</span> : <span className="text-lg">🌙</span>}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useLayout();

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
        style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'auto' : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar: drawer on mobile, fixed on lg+ */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 max-w-[85vw] border-r border-slate-200/80 dark:border-slate-700/80
          bg-white dark:bg-slate-900 backdrop-blur-xl
          flex flex-col
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
