import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass p-6 rounded-card ${className}`}>{children}</div>;
}
