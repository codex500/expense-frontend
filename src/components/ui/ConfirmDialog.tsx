import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel'
}: ConfirmDialogProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl glass-card z-10 m-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <button onClick={onClose} className="ml-auto rounded-full p-1 opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{message}</p>
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl border border-input bg-background hover:bg-accent transition-colors">{cancelText}</button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-2"><Trash2 className="h-4 w-4" />{confirmText}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
