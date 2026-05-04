import { lazy, Suspense } from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet2, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useQueries';
import { useAuth } from '@/context/AuthContext';

const DashboardChart = lazy(() => import('@/components/dashboard/DashboardChart'));

function formatPaise(paise: number): string {
  return (Number(paise) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading, error } = useDashboardSummary();

  const income = Number(summary?.totalIncome) || 0;
  const expense = Number(summary?.totalExpense) || 0;
  const savings = income - expense > 0 ? income - expense : 0;
  const netWorth = Number(summary?.balance) || 0;

  const transactions = summary?.recentTransactions || [];

  const rawWeekly = summary?.weeklyData || [];
  const chartData = rawWeekly.map((d: any) => {
    // Parse week timestamp into a readable label
    const weekDate = new Date(d.week);
    const label = !isNaN(weekDate.getTime())
      ? `${weekDate.getDate()}/${weekDate.getMonth() + 1}`
      : 'Week';
    return {
      name: label,
      spent: (Number(d.expense) || 0) / 100,
    };
  });

  if (chartData.length === 0) {
    DAY_NAMES.forEach(d => chartData.push({ name: d, spent: 0 }));
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="h-8 w-64 bg-muted/40 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-28 bg-muted/20 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="glass-card rounded-2xl col-span-4 p-6 h-[400px] bg-muted/20 animate-pulse" />
          <div className="glass-card rounded-2xl col-span-3 p-6 h-[400px] bg-muted/20 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">Failed to load dashboard data</p>
          <p className="text-muted-foreground text-sm">Please check your connection and try refreshing.</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Net Worth', value: formatPaise(netWorth), icon: Wallet2, gradient: 'from-indigo-500/20 to-blue-500/10' },
    { label: 'Total Savings', value: formatPaise(savings), icon: DollarSign, gradient: 'from-indigo-500/15 to-indigo-500/5' },
    { label: 'Income', value: formatPaise(income), icon: TrendingUp, gradient: 'from-violet-500/15 to-violet-500/5' },
    { label: 'Expenses', value: formatPaise(expense), icon: TrendingDown, gradient: 'from-purple-500/15 to-purple-500/5' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
          </h2>
          <p className="text-muted-foreground mt-1">Here's your financial overview for this month.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${card.gradient}`}
          >
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{card.label}</h3>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{card.value}</div>
            </div>
          </div>
        ))}

        <div
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
                ? `Track your spending — you've spent ₹${formatPaise(expense)} this month. Great job keeping expenses in check!`
                : 'Start adding transactions to get personalized AI insights about your spending.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="glass-card rounded-2xl col-span-4 p-6">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight">Weekly Overview</h3>
            <p className="text-sm text-muted-foreground">Your spending over the last month.</p>
          </div>
          <div className="pl-2 h-[300px]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-muted/10 rounded animate-pulse" />}>
              <DashboardChart data={chartData} />
            </Suspense>
          </div>
        </div>

        <div className="glass-card rounded-2xl col-span-3 p-6 flex flex-col">
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
                    <p className="text-xs text-muted-foreground">{txn.category} • {new Date(txn.transaction_date || txn.transactionDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className={`ml-auto font-bold text-sm whitespace-nowrap ${
                    txn.type === 'expense' ? 'text-destructive' :
                    txn.type === 'income' ? 'text-success' : 'text-foreground'
                  }`}>
                    {txn.type === 'expense' ? '-' : txn.type === 'income' ? '+' : ''}₹{formatPaise(Number(txn.amount_paise) || Number(txn.amountPaise) || 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
