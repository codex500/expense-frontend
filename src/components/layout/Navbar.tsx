import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-lg sm:text-xl font-bold text-transparent truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Trackify
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400 truncate max-w-[140px] md:max-w-[200px]">
            {user?.email}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 sm:px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition min-h-[40px]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
