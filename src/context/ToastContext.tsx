/**
 * ToastContext — shim that wraps sonner's toast functions.
 * The useToast hook and Profile page import `useToastContext` from here.
 * This provides a `show(message, type)` API compatible with existing usage.
 */

import { toast } from 'sonner';

export function useToastContext() {
  return {
    show: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message);
      else toast.info(message);
    },
  };
}
