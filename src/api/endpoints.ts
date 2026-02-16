import { api } from './axios';
import type { AddTransactionInput, DashboardSummary, BudgetStatus, CategoryExpense, MonthlySpending, DailySpending, Transaction, User } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ data: { user: User; token: string } }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, monthly_budget?: number) =>
    api.post<{ data: { user: User; token: string } }>('/auth/register', { name, email, password, monthly_budget }),
  me: () => api.get<{ data: { user: User } }>('/auth/me'),
};

export const dashboardApi = {
  summary: () => api.get<{ data: DashboardSummary }>('/dashboard'),
};

export const budgetApi = {
  status: () => api.get<{ data: BudgetStatus }>('/budget/status'),
  update: (monthly_budget: number) => api.put('/budget', { monthly_budget }),
};

export const transactionsApi = {
  list: (params?: { type?: string; category?: string; startDate?: string; endDate?: string }) =>
    api.get<{ data: { transactions: Transaction[] } }>('/transactions', { params }),
  create: (body: AddTransactionInput) =>
    api.post<{ data: { transaction: Transaction } }>('/transactions', body),
  update: (id: string, body: Partial<AddTransactionInput>) =>
    api.put<{ data: { transaction: Transaction } }>(`/transactions/${id}`, body),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const analyticsApi = {
  category: (params?: { startDate?: string; endDate?: string }) =>
    api.get<{ data: { category_expense: CategoryExpense[] } }>('/analytics/category-expense', { params }),
  monthly: (months = 12) =>
    api.get<{ data: { monthly_spending: MonthlySpending[] } }>('/analytics/monthly-spending', { params: { months } }),
  weekly: () =>
    api.get<{ data: { last_7_days: DailySpending[] } }>('/analytics/last-7-days'),
};
