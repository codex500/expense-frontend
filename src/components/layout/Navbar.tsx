import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-xl font-bold text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Trackify
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
