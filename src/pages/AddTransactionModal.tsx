import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { transactionsApi } from '@/api/endpoints';
import type { AddTransactionInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'];
const paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

export function AddTransactionModal({ open, onClose, onSuccess }: AddTransactionModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddTransactionInput & { amount: string }>({
    defaultValues: { type: 'expense', transaction_date: new Date().toISOString().slice(0, 10) },
  });
  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const onSubmit = async (data: AddTransactionInput & { amount: string }) => {
    try {
      await transactionsApi.create({
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        payment_method: data.payment_method || undefined,
        note: data.note || undefined,
        transaction_date: data.transaction_date || new Date().toISOString().slice(0, 10),
      });
      reset();
      onClose();
      onSuccess();
    } catch {
      // Error handled by interceptor or parent
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="glass relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add transaction</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Type</label>
              <div className="flex gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-600 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input type="radio" value="income" {...register('type', { required: true })} className="sr-only" />
                  <span className="text-sm font-medium">Income</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-600 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input type="radio" value="expense" {...register('type', { required: true })} className="sr-only" />
                  <span className="text-sm font-medium">Expense</span>
                </label>
              </div>
            </div>
            <Input label="Amount" type="number" step="0.01" required placeholder="0" error={errors.amount?.message} {...register('amount', { required: 'Required', min: { value: 0.01, message: 'Must be > 0' } })} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
              <select {...register('category', { required: true })} className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Payment method</label>
              <select {...register('payment_method')} className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <Input label="Date" type="date" {...register('transaction_date')} />
            <Input label="Note" placeholder="Optional" {...register('note')} />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1">Add</Button>
            </div>
          </form>
      </div>
    </div>
  );
}
