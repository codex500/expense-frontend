export interface User {
  id: string;
  name: string;
  email: string;
  monthly_budget: number;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  payment_method: string | null;
  note: string | null;
  transaction_date: string;
  created_at: string;
}

export interface DashboardSummary {
  total_balance: number;
  total_income: number;
  total_expense: number;
  monthly_expense: number;
  todays_expense: number;
}

export interface BudgetStatus {
  monthly_budget: number;
  monthly_expense: number;
  percent_used: number;
  warning: string | null;
}

export interface CategoryExpense {
  category: string;
  total: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface DailySpending {
  day: string;
  total: number;
}

export interface AddTransactionInput {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  payment_method?: string;
  note?: string;
  transaction_date: string;
}
