import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  dashboardService, 
  transactionsService, 
  accountsService, 
  budgetsService,
  categoriesService,
  analyticsService
} from '../services/endpoints';
import { api } from '../services/api';
import { toast } from 'sonner';

// Dashboard Hooks
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await dashboardService.summary();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardAnalytics = (months?: number) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', months],
    queryFn: async () => {
      const { data } = await analyticsService.dashboard({ months });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryExpenseAnalytics = (month?: string) => {
  return useQuery({
    queryKey: ['analytics', 'category', month],
    queryFn: async () => {
      const { data } = await api.get('/analytics/category', { params: { month } });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMonthlyAnalytics = (months?: number) => {
  return useQuery({
    queryKey: ['analytics', 'monthly', months],
    queryFn: async () => {
      const { data } = await api.get('/analytics/monthly', { params: { months } });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useWeeklyAnalytics = (month?: string) => {
  return useQuery({
    queryKey: ['analytics', 'weekly', month],
    queryFn: async () => {
      const { data } = await api.get('/analytics/weekly', { params: { month } });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdvisorInsights = () => {
  return useQuery({
    queryKey: ['advisor', 'insights'],
    queryFn: async () => {
      const { data } = await api.get('/advisor/insights');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Transaction Hooks
export const useTransactions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const { data } = await transactionsService.list(params);
      return { transactions: data.data, meta: data.meta };
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await transactionsService.create(body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    },
  });
};

// Account Hooks
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await accountsService.getAll();
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Budget Hooks
export const useBudgets = (month?: string) => {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: async () => {
      const { data } = await budgetsService.list({ month });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Category Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesService.getAll();
      return data.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour since categories rarely change
  });
};
