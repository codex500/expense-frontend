import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { analyticsApi } from '@/api/endpoints';
import type { CategoryExpense, MonthlySpending, DailySpending } from '@/types';
import { ChartCard } from '@/components/ChartCard';
import { Loader } from '@/components/common/Loader';

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function Analytics() {
  const [category, setCategory] = useState<CategoryExpense[]>([]);
  const [monthly, setMonthly] = useState<MonthlySpending[]>([]);
  const [weekly, setWeekly] = useState<DailySpending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.category(), analyticsApi.monthly(6), analyticsApi.weekly()])
      .then(([c, m, w]) => {
        setCategory(c.data.data.category_expense || []);
        setMonthly(m.data.data.monthly_spending || []);
        setWeekly(w.data.data.last_7_days || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" />;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <ChartCard title="By category" className="min-w-0">
          <div className="h-56 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={category} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius="70%" label={({ category: c, total }) => `${c}: ₹${total}`}>
                  {category.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Monthly (6 months)" className="min-w-0">
          <div className="h-56 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`]} />
                <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <ChartCard title="Last 7 days" className="min-w-0">
        <div className="h-56 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`]} />
              <Line type="monotone" dataKey="total" stroke="#22C55E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
