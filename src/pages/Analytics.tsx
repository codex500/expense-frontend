import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, ChevronDown, Download } from 'lucide-react';
import { useCategoryExpenseAnalytics, useWeeklyAnalytics, useMonthlyAnalytics } from '@/hooks/useQueries';


export function Analytics() {
  const { data: categoryData, isLoading: loadingCat } = useCategoryExpenseAnalytics();
  const { data: weeklyData, isLoading: loadingWeek } = useWeeklyAnalytics();
  const { data: monthlyData, isLoading: loadingMonth } = useMonthlyAnalytics(6);

  const CAT_COLORS = ['#818cf8', '#a78bfa', '#22d3ee', '#fbbf24', '#f472b6', '#f87171', '#2dd4bf', '#34d399'];

  // Handle both possible field names from backend
  const rawCategories = Array.isArray(categoryData) ? categoryData : (categoryData?.category_expense || categoryData?.categories || []);
  const categoryChartData = rawCategories.map((c: any, i: number) => ({
    name: c.category,
    value: (Number(c.totalPaise) || Number(c.total_paise) || Number(c.amountPaise) || Number(c.amount_paise) || Number(c.total) || 0) / 100,
    color: CAT_COLORS[i % CAT_COLORS.length]
  }));

  const totalSpent = categoryChartData.reduce((acc: number, c: any) => acc + c.value, 0);

  const rawWeekly = Array.isArray(weeklyData) ? weeklyData : (weeklyData?.last_7_days || weeklyData?.weekly || []);
  const weeklyChartData = rawWeekly.length > 0
    ? rawWeekly.map((d: any) => {
        const dayDate = new Date(d.day);
        const dayLabel = !isNaN(dayDate.getTime())
          ? dayDate.toLocaleDateString('en-IN', { weekday: 'short' })
          : (d.name || d.day || 'Day');
        return {
          name: dayLabel,
          spent: (Number(d.expensePaise) || Number(d.expense_paise) || Number(d.spentPaise) || Number(d.spent_paise) || 0) / 100
        };
      })
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ name: d, spent: 0 }));

  const rawMonthly = Array.isArray(monthlyData) ? monthlyData : [];
  const monthlyChartData = rawMonthly.map((m: any) => ({
    name: new Date(m.month).toLocaleString('default', { month: 'short' }),
    income: (Number(m.incomePaise) || 0) / 100,
    expense: (Number(m.expensePaise) || 0) / 100,
  }));

  if (loadingCat || loadingWeek || loadingMonth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep dive into your financial habits.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center glass-card hover:bg-muted/50 text-foreground transition-all duration-200 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> This Month <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          <button className="flex-1 sm:flex-none justify-center glass-card hover:bg-muted/50 text-foreground transition-all duration-200 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col">
           <h3 className="font-semibold tracking-tight mb-6">Spending by Category</h3>
           <div className="flex-1 min-h-[250px] relative">
             {categoryChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryChartData}
                     cx="50%"
                     cy="50%"
                     innerRadius={55}
                     outerRadius={80}
                     paddingAngle={4}
                     dataKey="value"
                     stroke="none"
                   >
                     {categoryChartData.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                     formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                 No spending data yet.
               </div>
             )}
             {totalSpent > 0 && (
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-xs text-muted-foreground">Total Spent</span>
                 <span className="text-xl font-extrabold text-gradient">
                   ₹{totalSpent >= 1000 ? `${(totalSpent/1000).toFixed(1)}k` : totalSpent.toFixed(0)}
                 </span>
               </div>
             )}
           </div>

           <div className="mt-4 space-y-3 max-h-[160px] overflow-y-auto">
             {categoryChartData.map((cat: any) => (
               <div key={cat.name} className="flex items-center justify-between text-sm group hover:bg-muted/30 -mx-2 px-2 py-1 rounded-lg transition-colors">
                 <div className="flex items-center gap-2.5">
                   <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                   <span className="text-muted-foreground capitalize">{cat.name}</span>
                 </div>
                 <span className="font-medium">₹{cat.value.toLocaleString('en-IN')}</span>
               </div>
             ))}
             {categoryChartData.length === 0 && (
               <p className="text-center text-sm text-muted-foreground py-4">Add transactions to see category breakdown.</p>
             )}
           </div>
        </div>

        {/* Weekly Trend */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
           <div className="flex justify-between items-end mb-6">
             <div>
               <h3 className="font-semibold tracking-tight mb-1">Weekly Trend</h3>
               <p className="text-sm text-muted-foreground">Your spending over the last 7 days</p>
             </div>
           </div>

           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={28}>
                 <defs>
                   <linearGradient id="weeklyBarGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#818cf8" />
                     <stop offset="100%" stopColor="#6366f1" />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                 <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                 <Tooltip
                   cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                   formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                 />
                 <Bar dataKey="spent" fill="url(#weeklyBarGrad)" radius={[6, 6, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Monthly Trend (Area Chart) */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-3 flex flex-col mt-2">
           <div className="flex justify-between items-end mb-6">
             <div>
               <h3 className="font-semibold tracking-tight mb-1">Income vs Expenses (6 Months)</h3>
               <p className="text-sm text-muted-foreground">Your financial flow over time</p>
             </div>
           </div>
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                 <Tooltip
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                   formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                 />
                 <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                 <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
