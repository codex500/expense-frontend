import { useQuery } from '@tanstack/react-query';
import { accountsApi, transactionsApi, budgetsApi, analyticsApi, advisorApi, dashboardApi } from '@/api/endpoints';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await accountsApi.getAll();
      return data.data; // assuming standard envelope: { success, data: [] }
    },
  });
};

export const useAccountSummary = () => {
  return useQuery({
    queryKey: ['accounts', 'summary'],
    queryFn: async () => {
      const { data } = await accountsApi.getSummary();
      return data.data;
    },
  });
};

export const useTransactions = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await transactionsApi.list(filters);
      // Ensure we return an array. Sometimes data.data is the array depending on sendPaginated implementation.
      const txns = Array.isArray(data.data) ? data.data : (data.data?.transactions || []);
      return { transactions: txns, meta: data.meta || {} };
    },
  });
};

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data } = await budgetsApi.current();
      return data.data; // []
    },
  });
};

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await analyticsApi.dashboard();
      return data.data; 
    },
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await dashboardApi.summary();
      return data.data;
    },
    staleTime: 1000 * 60, // 1 minute (was 5min — too stale)
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

export const useCategoryExpenseAnalytics = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['analytics', 'category', params],
    queryFn: async () => {
      const { data } = await analyticsApi.expenseByCategory(params);
      return data.data;
    },
  });
};

export const useWeeklyAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async () => {
      const { data } = await analyticsApi.weekly();
      return data.data;
    },
  });
};

export const useMonthlyAnalytics = (months = 6) => {
  return useQuery({
    queryKey: ['analytics', 'monthly', months],
    queryFn: async () => {
      const { data } = await analyticsApi.monthly(months);
      return data.data;
    },
  });
};

export const useAdvisorInsights = () => {
  return useQuery({
    queryKey: ['advisor', 'insights'],
    queryFn: async () => {
      const { data } = await advisorApi.insights();
      return data.data; 
    },
  });
};
