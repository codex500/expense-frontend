import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`glass rounded-card p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}
