import React, { useEffect, useState } from 'react';
import { dashboardApi, budgetApi, transactionsApi } from '@/api/endpoints';
import type { DashboardSummary, BudgetStatus, Transaction } from '@/types';
import { Card } from '@/components/ui/Card';
import { TransactionTable } from '@/components/TransactionTable';
import { Loader } from '@/components/common/Loader';
import { useToast } from '@/hooks/useToast';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [budget, setBudget] = useState<BudgetStatus | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, bRes, tRes] = await Promise.all([
          dashboardApi.summary(),
          budgetApi.status(),
          transactionsApi.list(),
        ]);
        if (!cancelled) {
          setSummary(sRes.data.data);
          setBudget(bRes.data.data);
          setRecent((tRes.data.data.transactions || []).slice(0, 5));
        }
      } catch {
        if (!cancelled) show('Failed to load dashboard', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [show]);

  if (loading) return <Loader className="min-h-[60vh]" />;
  const s = summary as DashboardSummary;
  const percent = budget && budget.monthly_budget > 0 ? Math.min(100, budget.percent_used) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-primary min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</p>
          <p className={`text-xl sm:text-2xl font-bold truncate ${s.total_balance >= 0 ? 'text-secondary' : 'text-accent'}`}>₹{s.total_balance.toLocaleString()}</p>
        </Card>
        <Card className="border-l-4 border-l-secondary min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary truncate">₹{s.total_income.toLocaleString()}</p>
        </Card>
        <Card className="border-l-4 border-l-accent min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expense</p>
          <p className="text-xl sm:text-2xl font-bold text-accent truncate">₹{s.total_expense.toLocaleString()}</p>
        </Card>
        <Card className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">₹{s.todays_expense.toLocaleString()}</p>
        </Card>
        <Card className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">₹{s.monthly_expense.toLocaleString()}</p>
        </Card>
      </div>
      {budget && budget.monthly_budget > 0 && (
        <Card>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Budget progress</span>
            <span className="text-slate-500">{percent.toFixed(0)}% used</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className={`h-full rounded-full transition-all duration-500 ${percent >= 80 ? 'bg-accent' : 'bg-secondary'}`} style={{ width: `${percent}%` }} />
          </div>
          {budget.warning && <p className="mt-2 text-sm text-accent">{budget.warning}</p>}
        </Card>
      )}
      <Card className="min-w-0 overflow-hidden">
        <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Recent transactions</h2>
        <TransactionTable transactions={recent} />
      </Card>
    </div>
  );
}
