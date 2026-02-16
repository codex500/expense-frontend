import React, { useEffect, useState } from 'react';
import { transactionsApi } from '@/api/endpoints';
import type { Transaction } from '@/types';
import { TransactionTable } from '@/components/TransactionTable';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { show } = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params: { type?: string; category?: string } = {};
      if (type) params.type = type;
      if (category) params.category = category;
      const { data } = await transactionsApi.list(params);
      setTransactions(data.data.transactions || []);
    } catch {
      show('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [type, category, show]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await transactionsApi.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      show('Deleted', 'success');
    } catch {
      show('Delete failed', 'error');
    }
  };

  const filtered = search
    ? transactions.filter(
        (t) =>
          t.category.toLowerCase().includes(search.toLowerCase()) ||
          (t.note && t.note.toLowerCase().includes(search.toLowerCase()))
      )
    : transactions;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>
      <div className="flex flex-wrap items-center gap-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm">
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm w-40"
        />
      </div>
      <TransactionTable transactions={filtered} onDelete={handleDelete} loading={loading} />
    </div>
  );
}
