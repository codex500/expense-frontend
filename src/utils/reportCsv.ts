import type { Transaction } from '@/types';

export function downloadCsv(transactions: Transaction[]) {
  const headers = ['Date', 'Type', 'Category', 'Payment', 'Amount', 'Note'];
  const rows = transactions.map((t) => [
    t.transaction_date,
    t.type,
    t.category,
    t.payment_method || '',
    t.amount,
    t.note || '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'trackify-transactions.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}
