import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-indigo-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50',
  secondary: 'bg-secondary hover:bg-emerald-600 text-white',
  accent: 'bg-accent hover:bg-amber-600 text-white',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
