import React from 'react';

export function Logo({ className = '', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/40">
        <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M8 12h8" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#22C55E" />
        </svg>
      </div>
      {showText && (
        <span className="font-semibold text-slate-800 dark:text-white text-lg tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Trackify
        </span>
      )}
    </div>
  );
}
