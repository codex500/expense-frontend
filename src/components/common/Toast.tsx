import React from 'react';
import type { ToastType } from '@/types/toast';

const styles: Record<ToastType, string> = {
  success: 'bg-secondary text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-primary text-white',
};

export function Toast({ message, type }: { message: string; type: ToastType }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 shadow-lg transition-all duration-300 ${styles[type]}`}>
      {message}
    </div>
  );
}
