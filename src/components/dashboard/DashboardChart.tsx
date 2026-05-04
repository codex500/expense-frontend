import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data: Array<{ name: string; spent: number }>;
}

export default function DashboardChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={32}>
        <defs>
          <linearGradient id="barGradientDash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3, radius: 8 }}
          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
        />
        <Bar dataKey="spent" fill="url(#barGradientDash)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
