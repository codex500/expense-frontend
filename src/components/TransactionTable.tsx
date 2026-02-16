import type { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export function TransactionTable({ transactions, onDelete, loading }: TransactionTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!transactions.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 py-12 text-center text-slate-500 dark:text-slate-400">
        No transactions yet.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-card border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80">
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Type</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Category</th>
            <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Amount</th>
            {onDelete && <th className="w-12" />}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(t.transaction_date).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${t.type === 'income' ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'}`}>{t.type}</span>
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{t.category}</td>
              <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-secondary' : 'text-accent'}`}>{t.type === 'income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString()}</td>
              {onDelete && (
                <td className="px-4 py-3">
                  <button type="button" onClick={() => onDelete(t.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10" aria-label="Delete">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
