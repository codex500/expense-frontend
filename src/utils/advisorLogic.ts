import type { Transaction } from '@/types';

export interface Insight {
  type: 'good' | 'bad' | 'tip';
  title: string;
  message: string;
}

export function computeInsights(transactions: Transaction[], previousMonthExpense?: number): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 7);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const byCategory: Record<string, number> = {};
  const byPayment: Record<string, number> = {};
  let thisWeekExpense = 0;
  let lastWeekExpense = 0;
  let thisMonthExpense = 0;

  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const amt = Number(t.amount);
    const d = new Date(t.transaction_date);
    byCategory[t.category] = (byCategory[t.category] || 0) + amt;
    byPayment[t.payment_method || 'Other'] = (byPayment[t.payment_method || 'Other'] || 0) + amt;
    if (d >= thisWeekStart) thisWeekExpense += amt;
    if (d >= lastMonthStart && d < thisMonthStart) lastWeekExpense += amt;
    if (d >= thisMonthStart) thisMonthExpense += amt;
  });

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const topPayment = Object.entries(byPayment).sort((a, b) => b[1] - a[1])[0];

  if (topCategory) {
    insights.push({ type: 'tip', title: 'Top spending category', message: `You spend most on ${topCategory[0]} (₹${topCategory[1].toLocaleString()}).` });
  }
  if (topPayment) {
    insights.push({ type: 'tip', title: 'Payment preference', message: `You use ${topPayment[0]} most for expenses.` });
  }

  const foodPrev = Object.keys(byCategory).reduce((sum, k) => (k.toLowerCase().includes('food') ? sum + byCategory[k] : sum), 0);
  if (foodPrev > 0 && thisWeekExpense > 0) {
    const pct = Math.round(((thisWeekExpense - lastWeekExpense) / lastWeekExpense) * 100) || 0;
    if (pct > 20) {
      insights.push({ type: 'bad', title: 'Spending increase', message: `Your expenses increased ${pct}% this week compared to last.` });
    }
  }

  if (previousMonthExpense !== undefined && previousMonthExpense > 0 && thisMonthExpense < previousMonthExpense) {
    const saved = previousMonthExpense - thisMonthExpense;
    insights.push({ type: 'good', title: 'Savings', message: `You saved ₹${saved.toLocaleString()} more than last month.` });
  }

  insights.push({ type: 'tip', title: 'Tip', message: 'Set a monthly budget in Profile to get overspending alerts.' });

  return insights.slice(0, 6);
}
