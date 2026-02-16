import React, { useEffect, useState } from 'react';
import { transactionsApi } from '@/api/endpoints';
import { dashboardApi } from '@/api/endpoints';
import { computeInsights, type Insight } from '@/utils/advisorLogic';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/common/Loader';

const typeStyles = { good: 'border-l-secondary bg-secondary/5', bad: 'border-l-red-500 bg-red-500/5', tip: 'border-l-primary bg-primary/5' };

export default function Advisor() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, dRes] = await Promise.all([transactionsApi.list(), dashboardApi.summary()]);
        const transactions = tRes.data.data.transactions || [];
        const monthlyExpense = dRes.data.data.monthly_expense || 0;
        setInsights(computeInsights(transactions, monthlyExpense));
      } catch {
        setInsights([{ type: 'tip', title: 'Advisor', message: 'Add transactions to see insights.' }]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" />;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Advisor</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Smart insights from your spending patterns.</p>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((ins, i) => (
          <Card key={i} className={`border-l-4 min-w-0 ${typeStyles[ins.type]}`}>
            <h3 className="font-semibold text-slate-800 dark:text-white text-base sm:text-lg">{ins.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{ins.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
