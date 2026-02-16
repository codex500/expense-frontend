import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '@/types';

export function downloadPdf(userName: string, totalIncome: number, totalExpense: number, balance: number, transactions: Transaction[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Trackify – Expense Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`User: ${userName}`, 14, 28);
  doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 14, 34);
  doc.text(`Total Expense: ₹${totalExpense.toLocaleString()}`, 14, 40);
  doc.text(`Balance: ₹${balance.toLocaleString()}`, 14, 46);
  const head = [['Date', 'Type', 'Category', 'Amount']];
  const body = transactions.slice(0, 50).map((t) => [
    new Date(t.transaction_date).toLocaleDateString(),
    t.type,
    t.category,
    `₹${Number(t.amount).toLocaleString()}`,
  ]);
  (doc as unknown as { autoTable: (o: { head: string[][]; body: string[][]; startY: number; styles: { fontSize: number } }) => void })
    .autoTable({ head, body, startY: 54, styles: { fontSize: 9 } });
  doc.save('trackify-report.pdf');
}
