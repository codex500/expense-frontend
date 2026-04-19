import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet2, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardAnalytics, useTransactions, useWeeklyAnalytics, useAccountSummary } from '@/hooks/useQueries';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

function formatPaise(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: loadingSummary } = useDashboardAnalytics();
  const { data: txData, isLoading: loadingTx } = useTransactions({ limit: 5 });
  const { data: weeklyData, isLoading: loadingWeekly } = useWeeklyAnalytics();
  const { data: accountSummary } = useAccountSummary();

  const income = summary?.currentMonth?.incomePaise || 0;
  const expense = summary?.currentMonth?.expensePaise || 0;
  const savings = summary?.currentMonth?.savingsPaise || 0;
  const expenseChange = summary?.trends?.expenseChange || 0;
  const netWorth = accountSummary?.totalBalancePaise || 0;

  const transactions = txData?.transactions || [];

  // Format weekly data for chart
  const rawWeekly = Array.isArray(weeklyData) ? weeklyData : (weeklyData?.last_7_days || weeklyData?.weekly || []);
  const chartData = rawWeekly.map((d: any) => ({
    name: d.name || d.day?.slice?.(5) || d.day,
    spent: (d.expensePaise || d.expense_paise || d.spentPaise || d.spent_paise || 0) / 100,
  }));

  // Empty state fallback
  if (chartData.length === 0) {
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => chartData.push({ name: d, spent: 0 }));
  }

  if (loadingSummary || loadingTx) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Net Worth', value: formatPaise(netWorth), icon: Wallet2, gradient: 'from-indigo-500/20 to-blue-500/10' },
    { label: 'Total Savings', value: formatPaise(savings), icon: DollarSign, gradient: 'from-indigo-500/15 to-indigo-500/5' },
    { label: 'Income', value: formatPaise(income), icon: TrendingUp, gradient: 'from-violet-500/15 to-violet-500/5' },
    { label: 'Expenses', value: formatPaise(expense), icon: TrendingDown, gradient: 'from-purple-500/15 to-purple-500/5', change: expenseChange },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
          </h2>
          <p className="text-muted-foreground mt-1">Here's your financial overview for this month.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            
            className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${card.gradient}`}
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{card.label}</h3>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{card.value}</div>
              {card.change !== undefined && (
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  {card.change > 0 ? (
                    <span className="text-warning flex items-center"><ArrowUpRight className="h-3 w-3 mr-0.5"/>+{Math.abs(card.change)}%</span>
                  ) : card.change < 0 ? (
                    <span className="text-success flex items-center"><ArrowDownRight className="h-3 w-3 mr-0.5"/>{card.change}%</span>
                  ) : (
                    <span className="text-muted-foreground">0%</span>
                  )}
                  <span>vs last month</span>
                </p>
              )}
            </div>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} 
          className="glass-card rounded-2xl p-6 relative overflow-hidden group bg-gradient-to-br from-primary/10 to-primary/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> AI Insight
            </h3>
          </div>
          <div className="mt-1">
            <p className="text-sm font-medium leading-snug">
              {expense > 0 
                ? `Track your spending — you've spent ₹${formatPaise(expense)} this month. ${expenseChange > 0 ? `That's ${expenseChange}% more than last month.` : 'Great job keeping expenses in check!'}`
                : 'Start adding transactions to get personalized AI insights about your spending.'
              }
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} 
          className="glass-card rounded-2xl col-span-4 p-6"
        >
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight">Weekly Overview</h3>
            <p className="text-sm text-muted-foreground">Your spending over the last 7 days.</p>
          </div>
          <div className="pl-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} 
          className="glass-card rounded-2xl col-span-3 p-6 flex flex-col"
        >
          <div className="flex flex-col space-y-1.5 pb-6">
             <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
             <p className="text-sm text-muted-foreground">
               {transactions.length > 0 ? `Showing your latest ${transactions.length} transactions.` : 'No transactions yet.'}
             </p>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm py-8">
                <Wallet2 className="h-10 w-10 mb-3 opacity-30" />
                <p>No transactions found.</p>
                <p className="text-xs mt-1">Start adding transactions to see them here.</p>
              </div>
            ) : (
              transactions.map((txn: any) => (
                <div key={txn.id} className="flex items-center group cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-1.5 rounded-xl transition-colors">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
                      txn.type === 'expense' ? 'bg-destructive/10 text-destructive' : 
                      txn.type === 'income' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {txn.type === 'expense' && <ArrowDownRight className="h-5 w-5" />}
                    {txn.type === 'income' && <ArrowUpRight className="h-5 w-5" />}
                    {txn.type === 'transfer' && <Wallet2 className="h-5 w-5" />}
                  </div>
                  <div className="ml-3.5 space-y-0.5 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{txn.note || txn.category}</p>
                    <p className="text-xs text-muted-foreground">{txn.category} • {new Date(txn.transactionDate || txn.transaction_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className={`ml-auto font-bold text-sm whitespace-nowrap ${
                    txn.type === 'expense' ? 'text-destructive' : 
                    txn.type === 'income' ? 'text-success' : 'text-foreground'
                  }`}>
                    {txn.type === 'expense' ? '-' : txn.type === 'income' ? '+' : ''}₹{formatPaise(txn.amountPaise || txn.amount_paise || 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
